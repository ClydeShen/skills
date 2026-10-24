import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, realpathSync, lstatSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import GithubSlugger from 'github-slugger';
import { parse as parseYaml } from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';

export const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const markdown = new MarkdownIt({ html: true });
const imported = file => /^(?:\.agents|\.claude)\/skills\//.test(file);
const privatePath = file => /(?:^|\/)(?:\.env(?:\..+)?|profile\.json)$/.test(file) && file !== '.env.evaluation.example';
const frameworkRoles = new Set(['AGENTS', 'CLAUDE', 'CONTEXT', 'GLOSSARY', 'HARNESS', 'REPOSITORY-STRUCTURE', 'DOCUMENT-FORMATS']);
const inside = (parent, child) => {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
};

export function repositoryFiles(root) {
  return [...new Set(execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], {
    cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024,
  }).split('\0').filter(Boolean))].filter(file => lstatSync(path.join(root, file), { throwIfNoEntry: false })).sort();
}

function hasSymlink(root, relative) {
  let current = root;
  for (const component of relative.split('/').filter(Boolean)) {
    current = path.join(current, component);
    if (lstatSync(current, { throwIfNoEntry: false })?.isSymbolicLink()) return true;
  }
  return false;
}

// Test every component, even on case-insensitive Windows/macOS filesystems.
export function exactPathExists(root, relative) {
  if (!inside(root, path.resolve(root, relative))) return false;
  let current = root;
  for (const component of relative.split('/').filter(Boolean)) {
    if (!existsSync(current) || !lstatSync(current).isDirectory() || !readdirSync(current).includes(component)) return false;
    current = path.join(current, component);
  }
  return existsSync(current);
}

export function frontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error('YAML frontmatter is required');
  const data = parseYaml(match[1], { uniqueKeys: true });
  if (!data || Array.isArray(data) || typeof data !== 'object') throw new Error('frontmatter must be a mapping');
  return data;
}

export function frameworkFilenameError(file) {
  if (!['.', 'docs'].includes(path.posix.dirname(file))) return;
  const basename = path.posix.basename(file);
  if (!/\.md$/i.test(basename)) return;
  const role = basename.slice(0, -3).toUpperCase();
  if (frameworkRoles.has(role) && basename !== `${role}.md`) return `harness framework document must use uppercase filename stem: ${role}.md`;
}

function tokens(source) {
  return markdown.parse(source.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, ''), {});
}

export function markdownTargets(source) {
  const targets = [];
  const visit = list => {
    for (const token of list) {
      if (token.type === 'link_open') targets.push(token.attrGet('href'));
      if (token.type === 'image') targets.push(token.attrGet('src'));
      if (token.children) visit(token.children);
    }
  };
  visit(tokens(source));
  return targets.filter(Boolean);
}

function anchors(source) {
  const slugger = new GithubSlugger();
  const result = new Set();
  const parsed = tokens(source);
  for (let i = 0; i < parsed.length; i++) {
    if (parsed[i].type !== 'heading_open') continue;
    const inline = parsed[i + 1];
    const text = (inline.children ?? []).filter(t => ['text', 'code_inline', 'image'].includes(t.type)).map(t => t.content).join('');
    result.add(slugger.slug(text));
  }
  for (const match of source.matchAll(/\b(?:id|name)=["']([^"']+)["']/g)) result.add(match[1]);
  return result;
}

export function checkSkill(file, source) {
  const errors = [];
  let data;
  try { data = frontmatter(source); } catch (error) { return [error.message]; }
  const candidate = /^incubator\/[^/]+\/candidate\/[^/]+\/SKILL\.md$/.test(file);
  const released = /^skills\/[^/]+\/SKILL\.md$/.test(file);
  if (!candidate && !released) errors.push('authored package must be a candidate or flat release; container SKILL.md can shadow discovery');
  if (typeof data.name !== 'string' || data.name.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.name)) errors.push('name must be lowercase kebab-case, 1–64 characters');
  if (data.name !== path.posix.basename(path.posix.dirname(file))) errors.push('name must match package directory');
  if (typeof data.description !== 'string' || !data.description.trim() || data.description.length > 1024) errors.push('description must contain 1–1024 characters');
  const allowed = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);
  for (const key of Object.keys(data)) if (!allowed.has(key)) errors.push(`unsupported frontmatter field: ${key}`);
  for (const key of ['license', 'compatibility', 'allowed-tools']) {
    if (key in data && typeof data[key] !== 'string') errors.push(`${key} must be a string`);
  }
  if (typeof data.compatibility === 'string' && data.compatibility.length > 500) errors.push('compatibility exceeds 500 characters');
  if (data.metadata !== undefined && (!data.metadata || Array.isArray(data.metadata) || typeof data.metadata !== 'object')) errors.push('metadata must be a mapping');
  for (const [key, value] of Object.entries(data.metadata ?? {})) {
    if (key === 'internal' && typeof value === 'boolean') continue;
    if (typeof value !== 'string') errors.push(`metadata.${key} must be a string (internal boolean is the documented CLI extension)`);
  }
  if (candidate && data.metadata?.internal !== true) errors.push('candidate requires boolean metadata.internal: true');
  if (released && data.metadata && 'internal' in data.metadata) errors.push('release must remove candidate internal marker');
  return errors;
}

export function checkRepository(root, files = repositoryFiles(root)) {
  const errors = [];
  const warnings = [];
  const packages = [];
  const contents = new Map();
  const error = (file, message) => errors.push(`${file}: ${message}`);
  const bytes = file => {
    if (privatePath(file) || !inside(root, path.resolve(root, file)) || hasSymlink(root, file)) throw new Error(`refuse private or symlinked content: ${file}`);
    return readFileSync(path.join(root, file));
  };
  const read = file => {
    if (!contents.has(file)) contents.set(file, bytes(file).toString('utf8'));
    return contents.get(file);
  };

  for (const file of files) {
    if (privatePath(file)) { error(file, 'private environment/profile file must not be tracked'); continue; }
    if (path.posix.basename(file) === 'AGENTS.override.md') error(file, 'client-specific instruction override requires a compatibility decision');
    if (hasSymlink(root, file)) { error(file, 'symlinks are not portable package or projection sources'); continue; }
    if (imported(file)) continue;
    const namingError = frameworkFilenameError(file);
    if (namingError) error(file, namingError);
    if (!/\.(?:md|mjs|json|ya?ml|toml)$/.test(file) && !['.editorconfig', '.gitattributes', '.gitignore', '.nvmrc'].includes(file)) continue;
    const source = read(file);
    if (source.includes('\r')) error(file, 'use LF line endings');
    if (!source.endsWith('\n')) error(file, 'missing final newline');
    try {
      if (file.endsWith('.json')) JSON.parse(source);
      if (/\.ya?ml$/.test(file)) parseYaml(source, { uniqueKeys: true });
    } catch (failure) { error(file, `invalid structured data: ${failure.message}`); }
    if (path.posix.basename(file) === 'SKILL.md') {
      for (const message of checkSkill(file, source)) error(file, message);
      try { packages.push({ file, name: frontmatter(source).name, directory: path.posix.dirname(file) }); } catch { /* reported above */ }
      if (source.split('\n').length > 500) warnings.push(`${file}: exceeds upstream 500-line authoring guidance`);
    }
  }

  const names = new Map();
  for (const pkg of packages) {
    if (names.has(pkg.name)) error(pkg.file, `duplicate authored name ${pkg.name}; also at ${names.get(pkg.name)}`);
    names.set(pkg.name, pkg.file);
    if (pkg.directory.startsWith('incubator/')) {
      const initiative = pkg.directory.split('/').slice(0, 2).join('/');
      for (const required of ['README.md', 'evaluation.md', 'evals/suite.mjs', 'evals/cases.json']) {
        if (!files.includes(`${initiative}/${required}`)) error(pkg.file, `missing initiative artifact ${initiative}/${required}`);
      }
      if (files.includes(`${initiative}/README.md`) && !read(`${initiative}/README.md`).includes('candidate/')) error(pkg.file, 'initiative README must identify the active candidate path');
    }
  }

  for (const file of files.filter(f => f.endsWith('.md') && !imported(f))) {
    if (privatePath(file) || hasSymlink(root, file)) continue;
    const source = read(file);
    const pkg = packages.find(p => file.startsWith(`${p.directory}/`));
    const targets = markdownTargets(source);
    // Also inspect literal resource paths in inline code, but not fenced examples.
    if (pkg) for (const token of tokens(source)) for (const child of token.children ?? []) {
      if (child.type === 'code_inline' && /^(?:\.\/)?(?:references|scripts|assets)\/[\w./-]+$/.test(child.content)) targets.push(child.content);
    }
    for (const target of targets) {
      if (/^[a-z]:[\\/]/i.test(target) || target.includes('\\')) { error(file, `nonportable local path: ${target}`); continue; }
      if (/^(?:[a-z][\w+.-]*:|\/\/)/i.test(target)) {
        if (/^file:/i.test(target)) error(file, `nonportable file URL: ${target}`);
        continue; // No network, credentials or model calls in repository checks.
      }
      const [rawPath, fragment] = target.split('#', 2);
      let relative;
      try { relative = path.posix.normalize(path.posix.join(path.posix.dirname(file), decodeURIComponent(rawPath.split('?')[0]))); }
      catch { error(file, `invalid URL encoding: ${target}`); continue; }
      if (target.startsWith('/') || relative === '..' || relative.startsWith('../') || target.includes('\\')) { error(file, `nonportable/out-of-repository reference: ${target}`); continue; }
      if (!exactPathExists(root, relative === '.' ? '' : relative)) { error(file, `missing or wrong-case link: ${target}`); continue; }
      if (hasSymlink(root, relative)) { error(file, `reference traverses a symlink: ${target}`); continue; }
      if (pkg && (!inside(path.join(root, pkg.directory), path.join(root, relative)) || !inside(realpathSync(path.join(root, pkg.directory)), realpathSync(path.join(root, relative))))) error(file, `runtime reference escapes package: ${target}`);
      if (fragment && relative.endsWith('.md')) {
        let decoded;
        try { decoded = decodeURIComponent(fragment); } catch { error(file, `invalid anchor encoding: ${target}`); continue; }
        if (!anchors(read(relative)).has(decoded)) error(file, `missing heading anchor: ${target}`);
      }
    }
  }

  const lockFile = 'skills-lock.json';
  try {
    const locked = JSON.parse(read(lockFile)).skills;
    const canonical = files.filter(f => f.startsWith('.agents/skills/'));
    const projected = files.filter(f => f.startsWith('.claude/skills/'));
    for (const pkg of packages) if (Object.hasOwn(locked, pkg.name)) error(pkg.file, `authored name ${pkg.name} collides with a locked development tool and may be hidden by CLI discovery`);
    for (const name of Object.keys(locked)) if (!canonical.includes(`.agents/skills/${name}/SKILL.md`)) error(lockFile, `missing installed tool ${name}`);
    for (const file of canonical) {
      const name = file.split('/')[2];
      if (!Object.hasOwn(locked, name)) error(file, 'installed tool has no lock provenance');
      const projection = file.replace(/^\.agents\//, '.claude/');
      if (!projected.includes(projection) || !bytes(file).equals(bytes(projection))) error(projection, 'projection differs; review canonical tool then run npm run skills:sync');
    }
    for (const file of projected) if (!canonical.includes(file.replace(/^\.claude\//, '.agents/'))) error(file, 'orphan development-tool projection');
  } catch (failure) { error(lockFile, `cannot verify tool projections: ${failure.message}`); }
  if (!files.includes('CLAUDE.md') || read('CLAUDE.md').trim() !== '# Claude Code adapter\n\n@AGENTS.md\n\nUse the shared instructions above. Maintain repository rules in their authoritative files, not in this adapter.') error('CLAUDE.md', 'keep the thin AGENTS.md import adapter; shared rules belong in AGENTS.md');

  try {
    const directory = 'knowledge/harness/';
    const data = parseYaml(read(`${directory}setup-checklist.yaml`));
    const schema = JSON.parse(read(`${directory}setup-checklist.schema.json`));
    const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema);
    if (!validate(data)) error(`${directory}setup-checklist.yaml`, JSON.stringify(validate.errors));
    const ids = [...data.items, ...data.final_checks].map(item => item.id);
    if (new Set(ids).size !== ids.length) error(`${directory}setup-checklist.yaml`, 'checklist IDs must be unique');
  } catch (failure) { error('knowledge/harness/setup-checklist.yaml', `schema validation failed: ${failure.message}`); }
  return { errors, warnings, packages, files: files.length };
}
