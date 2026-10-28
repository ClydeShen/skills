import { execFileSync, spawnSync } from 'node:child_process';
import { chmodSync, existsSync, readdirSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
export const taskBranch = name => /^work\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name);
const git = (cwd, args) => execFileSync('git', args, { cwd, encoding: 'utf8', timeout: 15_000 }).trim();
const optionalGit = (cwd, args) => {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8', timeout: 15_000 });
  if (r.error || ![0, 1].includes(r.status)) throw new Error(`Git inspection failed: ${r.error?.message || r.stderr}`);
  return r.status === 0 ? r.stdout.trim() : '';
};

export function ciBranch(env) {
  if (env.GITHUB_EVENT_NAME === 'pull_request') {
    if (env.GITHUB_BASE_REF !== 'main' || !taskBranch(env.GITHUB_HEAD_REF)) {
      throw new Error('Pull requests must target main and originate from work/<kebab-case-topic>.');
    }
    return env.GITHUB_HEAD_REF;
  }
  if (env.GITHUB_EVENT_NAME !== 'push') throw new Error('Unsupported CI event for Git policy.');
  if (env.GITHUB_REF?.startsWith('refs/tags/')) return env.GITHUB_REF;
  const branch = env.GITHUB_REF?.replace(/^refs\/heads\//, '');
  if (branch !== 'main' && !taskBranch(branch)) throw new Error('CI branch must be main or work/<kebab-case-topic>.');
  return branch;
}

export function checkGit(cwd = root, { commit = false, env = process.env } = {}) {
  if (!commit && env.GITHUB_ACTIONS === 'true') return ciBranch(env);
  const branch = optionalGit(cwd, ['symbolic-ref', '--quiet', '--short', 'HEAD']);
  if (branch !== 'main' && !taskBranch(branch)) throw new Error('Use a named work/<kebab-case-topic> branch; detached authoring is not allowed.');
  if (branch === 'main' && (commit || git(cwd, ['status', '--porcelain']))) {
    throw new Error('main is for integration. Create or resume a task branch before editing or committing.');
  }
  if (optionalGit(cwd, ['config', '--get', 'core.hooksPath']) !== '.githooks') {
    throw new Error('Repository hooks are inactive or overridden. Run npm run git:setup; reconcile existing hooks first.');
  }
  for (const name of ['pre-commit', 'pre-push']) {
    if (!existsSync(path.join(cwd, '.githooks', name))) throw new Error(`Missing Git hook: ${name}`);
  }
  return branch;
}

export function setupHooks(cwd = root) {
  const configured = optionalGit(cwd, ['config', '--get', 'core.hooksPath']);
  if (configured && configured !== '.githooks') throw new Error(`Existing core.hooksPath (${configured}) must be reconciled before setup.`);
  if (!configured) {
    const directory = path.resolve(cwd, git(cwd, ['rev-parse', '--git-path', 'hooks']));
    if (existsSync(directory) && readdirSync(directory).some(name => !name.endsWith('.sample'))) {
      throw new Error('Existing default Git hooks must be reconciled before setup.');
    }
  }
  for (const name of ['pre-commit', 'pre-push']) chmodSync(path.join(cwd, '.githooks', name), 0o755);
  git(cwd, ['config', '--local', 'core.hooksPath', '.githooks']);
  return 'Repository Git hooks enabled; other clones must run setup separately.';
}

export function checkPush(input, cwd = root) {
  const lines = input.trim() ? input.trim().split(/\r?\n/) : [];
  if (!lines.length) return; // An up-to-date push has no ref mutations.
  const zero = oid => /^0+$/.test(oid);
  for (const line of lines) {
    const fields = line.split(/\s+/);
    if (fields.length !== 4 || ![fields[1], fields[3]].every(oid => /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(oid))) {
      throw new Error('Malformed Git pre-push update.');
    }
    const [localRef, localOid, remoteRef, remoteOid] = fields;
    if (remoteRef.startsWith('refs/heads/')) {
      if (!taskBranch(remoteRef.slice('refs/heads/'.length))) throw new Error('Push only work/<topic> branches; main updates require a pull request.');
      if (!zero(localOid) && localRef !== remoteRef) throw new Error('Local and remote task branch names must match.');
      if (!zero(localOid) && remoteRef !== `refs/heads/${git(cwd, ['symbolic-ref', '--short', 'HEAD'])}`) {
        throw new Error('Check out the task branch before pushing it so the gate checks the pushed work.');
      }
      if (!zero(localOid) && !zero(remoteOid)) {
        const r = spawnSync('git', ['merge-base', '--is-ancestor', remoteOid, localOid], { cwd, timeout: 15_000 });
        if (r.error || r.status !== 0) throw new Error('Non-fast-forward or unverifiable push refused. Fetch and merge the remote branch first.');
      }
    } else if (remoteRef.startsWith('refs/tags/')) {
      if (zero(localOid) || !zero(remoteOid) || localRef !== remoteRef) throw new Error('Existing tags cannot be changed or deleted.');
    } else throw new Error('Only task branches and new release tags may be pushed.');
  }
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  try {
    const [command, ...extra] = process.argv.slice(2);
    if (extra.length && command !== 'pre-push') throw new Error('Unexpected Git policy arguments.');
    if (command === 'setup') console.log(setupHooks());
    else if (command === 'check' || command === 'pre-commit') console.log(`Git policy: ${checkGit(root, { commit: command === 'pre-commit' })}`);
    else if (command === 'pre-push') {
      // Git provides every ref update on stdin, including explicit refspecs.
      let raw = '';
      for await (const chunk of process.stdin) {
        raw += chunk;
        if (raw.length > 1024 * 1024) throw new Error('Push input exceeds 1 MiB.');
      }
      checkPush(raw);
      checkGit();
    } else throw new Error('Use check, setup, pre-commit or pre-push.');
  } catch (error) {
    console.error(`Git policy: ${error.message}`);
    process.exitCode = 1;
  }
}
