import { copyFileSync, existsSync, lstatSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { repositoryFiles, repositoryRoot } from './repository.mjs';

if (process.argv.slice(2).join(' ') !== '--write') throw new Error('Use npm run skills:sync after reviewing canonical .agents/skills changes.');
const files = repositoryFiles(repositoryRoot);
const canonical = files.filter(file => file.startsWith('.agents/skills/'));
const orphans = files.filter(file => file.startsWith('.claude/skills/') && !canonical.includes(file.replace(/^\.claude\//, '.agents/')));
if (orphans.length) throw new Error(`Remove obsolete projections explicitly after review; nothing copied:\n${orphans.join('\n')}`);
// Preflight all paths before any copy; do not follow a directory/file symlink.
for (const file of canonical) {
  for (const relative of [file, file.replace(/^\.agents\//, '.claude/')]) {
    let current = repositoryRoot;
    for (const component of relative.split('/')) {
      current = path.join(current, component);
      if (existsSync(current) && lstatSync(current).isSymbolicLink()) throw new Error(`Refuse symlink: ${relative}`);
    }
  }
}
for (const file of canonical) {
  const target = path.join(repositoryRoot, file.replace(/^\.agents\//, '.claude/'));
  mkdirSync(path.dirname(target), { recursive: true });
  copyFileSync(path.join(repositoryRoot, file), target);
}
console.log(`Synchronized ${canonical.length} development-tool files. Run npm run check:repo to verify provenance and equality.`);
