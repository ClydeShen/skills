import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { findIcons } from '../candidate/architecture-diagram/scripts/find-icon.mjs';
import { createSuite } from './suite.mjs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const catalog = JSON.parse(read('../candidate/architecture-diagram/assets/catalog.json'));

test('candidate helpers work from an isolated relocated package with exact, vendor-safe icon lookup', () => {
  const entry = findIcons(catalog, { vendor: 'AWS', title: 'Lambda' });
  assert.equal(entry.length, 1);
  assert.deepEqual(findIcons(catalog, { vendor: 'Azure', id: entry[0].id }), []);
  assert.deepEqual(findIcons(catalog, { vendor: 'AWS', title: 'lambda' }), []);
  const bad = catalog.entries.find((e) => !e.usable);
  assert.deepEqual(findIcons(catalog, { vendor: bad.vendor, id: bad.id }), []);
  assert.throws(() => findIcons(catalog, { vendor: 'AWS', title: 'Lambda', id: entry[0].id }));
  const ambiguous = { entries: [entry[0], { ...entry[0], id: 'another-id' }] };
  assert.equal(findIcons(ambiguous, { vendor: 'AWS', title: 'Lambda' }).length, 2);
  const dir = mkdtempSync(join(tmpdir(), 'architecture-package-'));
  try {
    const moved = join(dir, 'skills', 'diagrams', 'architecture-diagram');
    cpSync(fileURLToPath(new URL('../candidate/architecture-diagram', import.meta.url)), moved, { recursive: true });
    const result = spawnSync(
      process.execPath,
      [join(moved, 'scripts', 'find-icon.mjs'), '--vendor', 'AWS', '--title', 'Lambda'],
      { cwd: dir, encoding: 'utf8' },
    );
    assert.equal(result.status, 0, result.error?.message || result.stderr);
    const { placement, ...match } = JSON.parse(result.stdout).matches[0];
    assert.deepEqual([match], entry);
    assert.deepEqual([placement.width, placement.height, placement.kind], [72, 72, 'symbol']);
    const module = spawnSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        'const m = await import(process.argv[1]); console.log(m.upstreamVersion);',
        pathToFileURL(join(moved, 'scripts', 'catalog.mjs')).href,
      ],
      { cwd: dir, encoding: 'utf8' },
    );
    assert.equal(module.status, 0, module.error?.message || module.stderr);
    assert.equal(module.stdout.trim(), catalog.drawio_version);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('clarification evaluation loads the active standard package and its notation', async () => {
  const suite = await createSuite({ mode: 'fixture' });
  const messages = JSON.parse(suite.prompts[0].function({ vars: suite.tests[0].vars }));
  assert.ok(messages[0].content.startsWith(read('../candidate/architecture-diagram/SKILL.md')));
  assert.ok(messages[0].content.includes(read('../candidate/architecture-diagram/references/notation.md')));
  assert.equal(messages[1].content, suite.tests[0].vars.input);
});
