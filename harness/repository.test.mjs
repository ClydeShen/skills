import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync, readFileSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync, spawnSync } from 'node:child_process';
import { parse as parseYaml } from 'yaml';
import { checkRepository, checkSkill, exactPathExists, frameworkFilenameError, markdownTargets, repositoryFiles, repositoryRoot } from './repository.mjs';
import { stopDecision } from './stop-hook.mjs';

const candidate = 'incubator/example/candidate/example/SKILL.md';
const skill = '---\nname: example\ndescription: Use when a concrete example is needed.\nmetadata:\n  internal: true\n---\n\n# Example\n';
const rootAdapter = '# Claude Code adapter\n\n@AGENTS.md\n\nUse the shared instructions above. Maintain repository rules in their authoritative files, not in this adapter.\n';

function fixture(t, extra = {}) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'skills-harness-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const files = {
    'CLAUDE.md': rootAdapter,
    'skills-lock.json': '{"skills":{}}\n',
    'knowledge/harness/setup-checklist.schema.json': '{"type":"object"}\n',
    'knowledge/harness/setup-checklist.yaml': 'items: []\nfinal_checks: []\n',
    [candidate]: skill,
    'incubator/example/README.md': '# Example\n\nStage: candidate; active: [candidate/example/](./candidate/example/SKILL.md).\n',
    'incubator/example/evaluation.md': '# Evaluation\n',
    'incubator/example/evals/suite.mjs': 'export default {};\n',
    'incubator/example/evals/cases.json': '[]\n',
    ...extra,
  };
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), content);
  }
  return { root, files: Object.keys(files), check: () => checkRepository(root, Object.keys(files)) };
}

test('valid isolated repository fixture passes without a network or model', t => {
  assert.deepEqual(fixture(t).check().errors, []);
});

test('main protection preset matches the CI matrix, pins Actions and leaves advisory lint optional', () => {
  const workflow = parseYaml(readFileSync(path.join(repositoryRoot, '.github/workflows/prompt-evaluation.yml'), 'utf8'));
  const preset = JSON.parse(readFileSync(path.join(repositoryRoot, '.github/main-protection.json'), 'utf8'));
  const names = workflow.jobs['local-evaluation'].strategy.matrix.os.map(os => `local-evaluation (${os})`);
  assert.deepEqual(preset.required_status_checks.checks.map(check => check.context), names);
  assert.ok(preset.required_status_checks.checks.every(check => check.app_id === 15368));
  assert.equal(preset.required_status_checks.strict, true);
  assert.equal(preset.enforce_admins, true);
  assert.equal(preset.allow_force_pushes, false);
  assert.equal(preset.allow_deletions, false);
  assert.equal(preset.required_pull_request_reviews.required_approving_review_count, 0);
  assert.equal(preset.required_pull_request_reviews.require_code_owner_reviews, false);
  assert.equal(workflow.jobs['agent-lint-report']['continue-on-error'], true);
  assert.ok(!preset.required_status_checks.checks.some(check => check.context.includes('lint')));
});

test('framework documents use uppercase stems without renaming ordinary content or tool files', t => {
  for (const file of ['AGENTS.md', 'GLOSSARY.md', 'CONTEXT.md', 'docs/HARNESS.md', 'docs/REPOSITORY-STRUCTURE.md', 'docs/DOCUMENT-FORMATS.md', 'docs/prompt-evaluation.md', 'knowledge/harness/harness.md', 'research/harness/context.md', 'harness/repository.mjs', '.codex/hooks.json']) {
    assert.equal(frameworkFilenameError(file), undefined, file);
  }
  for (const file of ['context.md', 'Glossary.md', 'docs/harness.md', 'docs/HaRnEsS.md', 'docs/HARNESS.MD', 'docs/repository-structure.md', 'docs/document-formats.md']) {
    assert.match(frameworkFilenameError(file), /uppercase filename stem/, file);
  }
  const f = fixture(t, { 'docs/harness.md': '# Harness\n' });
  assert.ok(f.check().errors.some(error => error.includes('docs/harness.md: harness framework document must use uppercase')));
});

test('frontmatter enforces lifecycle, field types, duplicate YAML and directory names', () => {
  assert.deepEqual(checkSkill(candidate, skill), []);
  for (const invalid of [skill.replace('internal: true', 'internal: "true"'), skill.replace('name: example', 'name: Example'), skill.replace('description:', 'unknown:'), skill.replace('name: example', 'name: example\nname: example')]) assert.ok(checkSkill(candidate, invalid).length);
  assert.ok(checkSkill('skills/example/SKILL.md', skill).some(e => e.includes('remove candidate')));
  assert.ok(checkSkill('skills/SKILL.md', skill).some(e => e.includes('shadow')));
  assert.ok(checkSkill(candidate, skill.replace('metadata:\n  internal: true', 'metadata: null')).length);
});

test('inventory rejects duplicate authored names independently of CLI deduplication', t => {
  const f = fixture(t, { 'skills/example/SKILL.md': skill.replace('metadata:\n  internal: true\n', '') });
  assert.ok(f.check().errors.some(e => e.includes('duplicate authored name')));
});

test('links check actual Markdown, reference links and anchors, not fenced examples', t => {
  assert.deepEqual(markdownTargets('[x][ref]\n\n[ref]: ./real.md\n\n```md\n[x](missing.md)\n```'), ['./real.md']);
  const f = fixture(t, {
    'README.md': '# Root\n\n[x](./target.md#some-title)\n[x](./target.md#some-title-1)\n',
    'target.md': '# Some **title**\n\n## Some title\n',
  });
  assert.deepEqual(f.check().errors, []);
  writeFileSync(path.join(f.root, 'README.md'), '# Root\n\n[x](./Target.md)\n[x](./target.md#absent)\n');
  assert.equal(exactPathExists(f.root, 'Target.md'), false);
  assert.ok(f.check().errors.some(e => e.includes('wrong-case')));
  assert.ok(f.check().errors.some(e => e.includes('heading anchor')));
});

test('runtime links and literal resource paths cannot escape or reference missing files', t => {
  const f = fixture(t, { [candidate]: `${skill}\n[author notes](../../README.md)\n[local](C:/machine/private.md)\n\n\`assets/absent.json\`\n` });
  assert.ok(f.check().errors.some(e => e.includes('escapes package')));
  assert.ok(f.check().errors.some(e => e.includes('assets/absent.json')));
  assert.ok(f.check().errors.some(e => e.includes('nonportable local path')));
});

test('development tool projections require equality, lock provenance and no orphan files', t => {
  const f = fixture(t, { '.agents/skills/tool/SKILL.md': skill, '.claude/skills/tool/SKILL.md': `${skill}\nDifferent\n` });
  assert.ok(f.check().errors.some(e => e.includes('no lock provenance')));
  assert.ok(f.check().errors.some(e => e.includes('projection differs')));
});

test('authored names cannot collide with development tools excluded by skills CLI', t => {
  const f = fixture(t, {
    'skills-lock.json': '{"skills":{"example":{"source":"synthetic/tool"}}}\n',
    '.agents/skills/example/SKILL.md': skill,
    '.claude/skills/example/SKILL.md': skill,
  });
  assert.ok(f.check().errors.some(e => e.includes('collides with a locked')));
});

test('structured data schema and stable IDs, private paths and client overrides are gates', t => {
  const f = fixture(t, {
    'knowledge/harness/setup-checklist.yaml': 'items: [{id: duplicate}]\nfinal_checks: [{id: duplicate}]\n',
    '.env.evaluation': 'SYNTHETIC_TEST_ONLY=not-a-key\n',
    'AGENTS.override.md': '# Override\n',
    'broken.json': '{bad}\n',
  });
  const errors = f.check().errors;
  for (const text of ['IDs must be unique', 'private environment', 'override', 'invalid structured']) assert.ok(errors.some(e => e.includes(text)), text);
  writeFileSync(path.join(f.root, 'knowledge/harness/setup-checklist.schema.json'), '{"type":"object","required":["absent"]}\n');
  assert.ok(f.check().errors.some(e => e.includes('required')));
});

test('Git inventory includes new work but excludes ignored keys and local results', t => {
  const f = fixture(t, { '.gitignore': '.env.evaluation\nevals/.local/\n', '.env.evaluation': 'SYNTHETIC=only\n', 'evals/.local/run.json': '{}\n' });
  execFileSync('git', ['init', '-q'], { cwd: f.root });
  const files = repositoryFiles(f.root);
  assert.ok(files.includes(candidate));
  assert.ok(!files.includes('.env.evaluation'));
  assert.ok(!files.includes('evals/.local/run.json'));
});

test('symlink package source is rejected (where symlink creation is supported)', t => {
  const f = fixture(t, { 'outside.md': '# Outside\n' });
  const file = 'skills/link/SKILL.md';
  mkdirSync(path.join(f.root, 'skills/link'), { recursive: true });
  try { symlinkSync(path.join(f.root, 'outside.md'), path.join(f.root, file)); }
  catch (error) { if (['EPERM', 'EACCES'].includes(error.code)) { t.skip('OS requires symlink privilege'); return; } throw error; }
  assert.ok(checkRepository(f.root, [...f.files, file]).errors.some(e => e.includes('symlinks')));
});

test('Stop adapters permit success, request one repair, surface repeated failures and handle tool errors', () => {
  const event = { hook_event_name: 'Stop', stop_hook_active: false };
  assert.deepEqual(stopDecision(event, { status: 0 }), {});
  const failure = { status: 1, stderr: 'bad link' };
  assert.equal(stopDecision(event, failure).decision, 'block');
  assert.match(stopDecision(event, failure).reason, /authorized task/);
  const repeated = stopDecision({ ...event, stop_hook_active: true }, failure);
  assert.equal(repeated.decision, undefined);
  assert.match(repeated.systemMessage, /incomplete/);
  assert.equal(stopDecision(event, { error: new Error('timed out') }).decision, 'block');
  assert.equal(stopDecision(event, { status: null, signal: 'SIGTERM' }).decision, 'block');
  assert.deepEqual(stopDecision({ hook_event_name: 'Other' }, failure), {});
});

test('hook CLI rejects malformed/wrong-event JSON instead of reporting a validation pass', () => {
  for (const input of ['not json', 'null', '{"hook_event_name":"Other"}']) {
    const result = spawnSync(process.execPath, ['harness/stop-hook.mjs'], { cwd: repositoryRoot, input, encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /No repository validation/);
  }
});

test('hook CLI checks a relocated fixture and surfaces failure without an endless continuation', t => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'skills-hook-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(path.join(root, 'harness'));
  writeFileSync(path.join(root, 'harness/stop-hook.mjs'), readFileSync(path.join(repositoryRoot, 'harness/stop-hook.mjs')));
  const check = path.join(root, 'harness/check.mjs');
  const run = active => {
    const result = spawnSync(process.execPath, [path.join(root, 'harness/stop-hook.mjs')], { input: JSON.stringify({ hook_event_name: 'Stop', stop_hook_active: active }), encoding: 'utf8' });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(result.stdout.trim(), 'Stop hook must emit a JSON decision, not silently skip its entrypoint');
    return result;
  };
  writeFileSync(check, 'process.exitCode = 0;\n');
  assert.deepEqual(JSON.parse(run(false).stdout), {});
  writeFileSync(check, 'console.error("synthetic check failed"); process.exitCode = 1;\n');
  assert.equal(JSON.parse(run(false).stdout).decision, 'block');
  const repeated = JSON.parse(run(true).stdout);
  assert.equal(repeated.decision, undefined);
  assert.match(repeated.systemMessage, /synthetic check failed/);
});

test('hook entrypoint works through directory aliases with spaces and preserved main symlinks', t => {
  const root = mkdtempSync(path.join(os.tmpdir(), 'skills-hook-alias-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const actual = path.join(root, 'actual workspace');
  const alias = path.join(root, 'alias workspace');
  mkdirSync(path.join(actual, 'harness'), { recursive: true });
  writeFileSync(path.join(actual, 'harness/stop-hook.mjs'), readFileSync(path.join(repositoryRoot, 'harness/stop-hook.mjs')));
  writeFileSync(path.join(actual, 'harness/check.mjs'), 'console.error("synthetic alias failure"); process.exitCode = 1;\n');
  try { symlinkSync(actual, alias, process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (error) { if (['EPERM', 'EACCES'].includes(error.code)) { t.skip('OS requires symlink/junction privilege'); return; } throw error; }
  for (const flags of [[], ['--preserve-symlinks-main']]) {
    const result = spawnSync(process.execPath, [...flags, path.join(alias, 'harness/stop-hook.mjs')], {
      input: JSON.stringify({ hook_event_name: 'Stop', stop_hook_active: false }), encoding: 'utf8',
    });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(result.stdout.trim(), 'aliased entrypoint must not silently skip validation');
    const decision = JSON.parse(result.stdout);
    assert.equal(decision.decision, 'block');
    assert.match(decision.reason, /synthetic alias failure/);
  }
});

test('client hook configurations point to the shared implementation and do not grant permissions', () => {
  const claude = JSON.parse(readFileSync(path.join(repositoryRoot, '.claude/settings.json')));
  assert.equal(claude.permissions, undefined);
  assert.deepEqual(claude.hooks.Stop[0].hooks[0].args, ['${CLAUDE_PROJECT_DIR}/harness/stop-hook.mjs']);
  const codex = JSON.parse(readFileSync(path.join(repositoryRoot, '.codex/hooks.json')));
  const handler = codex.hooks.Stop[0].hooks[0];
  assert.match(handler.command, /stop-hook\.mjs/);
  // Execute the actual configured bootstrap from a nested directory, with stdin intact.
  const result = spawnSync(handler.command, { cwd: path.join(repositoryRoot, 'docs'), shell: true, input: 'invalid json', encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /No repository validation/);
});
