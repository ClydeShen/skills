import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { XMLParser } from 'fast-xml-parser';
import { findIcons } from '../candidate/architecture-diagram/scripts/find-icon.mjs';
import { validateDiagram, validateRender } from '../tools/validate.mjs';
import { createSuite } from './suite.mjs';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');
const catalog = JSON.parse(read('../candidate/architecture-diagram/assets/catalog.json'));
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
const list = x => x == null ? [] : Array.isArray(x) ? x : [x];
function cells(xml) {
  const root = parser.parse(xml).mxfile.diagram.mxGraphModel.root;
  return [...list(root.mxCell), ...list(root.object).map(o => ({ ...o.mxCell, ...o }))];
}
const xml = id => read(`./candidate-layout-2026-10-29/case-${id}/diagram.drawio`);

test('candidate helpers work from an isolated relocated package with exact, vendor-safe icon lookup', () => {
  const entry = findIcons(catalog, { vendor: 'AWS', title: 'Lambda' });
  assert.equal(entry.length, 1);
  assert.deepEqual(findIcons(catalog, { vendor: 'Azure', id: entry[0].id }), []);
  assert.deepEqual(findIcons(catalog, { vendor: 'AWS', title: 'lambda' }), []);
  const bad = catalog.entries.find(e => !e.usable);
  assert.deepEqual(findIcons(catalog, { vendor: bad.vendor, id: bad.id }), []);
  assert.throws(() => findIcons(catalog, { vendor: 'AWS', title: 'Lambda', id: entry[0].id }));
  const ambiguous = { entries: [entry[0], { ...entry[0], id: 'another-id' }] };
  assert.equal(findIcons(ambiguous, { vendor: 'AWS', title: 'Lambda' }).length, 2);
  const dir = mkdtempSync(join(tmpdir(), 'architecture-package-'));
  try {
    const moved = join(dir, 'skills', 'diagrams', 'architecture-diagram');
    cpSync(fileURLToPath(new URL('../candidate/architecture-diagram', import.meta.url)), moved, { recursive: true });
    const result = spawnSync(process.execPath, [join(moved, 'scripts', 'find-icon.mjs'), '--vendor', 'AWS', '--title', 'Lambda'], { cwd: dir, encoding: 'utf8' });
    assert.equal(result.status, 0, result.error?.message || result.stderr);
    assert.deepEqual(JSON.parse(result.stdout).matches, entry);
    const module = spawnSync(process.execPath, ['--input-type=module', '-e', 'const m = await import(process.argv[1]); console.log(m.upstreamVersion);', pathToFileURL(join(moved, 'scripts', 'catalog.mjs')).href], { cwd: dir, encoding: 'utf8' });
    assert.equal(module.status, 0, module.error?.message || module.stderr);
    assert.equal(module.stdout.trim(), catalog.drawio_version);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test('clarification evaluation loads the active standard package and its notation', async () => {
  const suite = await createSuite({ mode: 'fixture' });
  const messages = JSON.parse(suite.prompts[0].function({ vars: suite.tests[0].vars }));
  assert.ok(messages[0].content.startsWith(read('../candidate/architecture-diagram/SKILL.md')));
  assert.ok(messages[0].content.includes(read('../candidate/architecture-diagram/references/notation.md')));
  assert.equal(messages[1].content, suite.tests[0].vars.input);
});

test('candidate-layout repairs preserve identities, ownership and existing hops while drawing missing instance paths', () => {
  for (const id of ['02', '03']) {
    const before = cells(read(`./visual-expression-2026-10-29/case-${id}/diagram.drawio`));
    const after = cells(xml(id)), byId = new Map(after.map(c => [c.id, c]));
    assert.deepEqual(after.filter(c => c.c4Type).map(c => c.id).sort(), before.filter(c => c.c4Type).map(c => c.id).sort());
    for (const c of before.filter(c => c.c4Type)) {
      for (const field of ['parent', 'c4Type', 'technology', 'iconKey']) assert.equal(byId.get(c.id)[field], c[field], `${id}/${c.id}/${field}`);
    }
    for (const e of before.filter(c => c.edge)) {
      assert.equal(byId.get(e.id).source, e.source);
      assert.equal(byId.get(e.id).target, e.target);
    }
    assert.equal(after.filter(c => c.edge).length, before.filter(c => c.edge).length + (id === '02' ? 4 : 0));
    assert.ok(!after.some(c => c.annotationKind === 'comment' || /(?:^|;)shape=note;/.test(c.style || '')));
    if (id === '02') {
      for (const [suffix, env] of [['b', 'test'], ['c', 'prod']]) {
        assert.equal(byId.get(`A1${suffix}`).source, `${env}-caller`);
        assert.equal(byId.get(`A1${suffix}`).target, 'dns-in');
        assert.equal(byId.get(`B1${suffix}`).source, `${env}-caller`);
        assert.equal(byId.get(`B1${suffix}`).target, 'azfw');
        assert.match(byId.get(`B7${suffix}`).value, new RegExp(`${env} only`));
      }
      assert.ok(!after.some(c => c.id.startsWith('environment-bindings')));
      assert.doesNotMatch(xml(id), /Same A\/B path/);
    } else {
      assert.match(byId.get('auth').label, /Common-Authx-Handler/);
      for (const node of ['orders', 'documents']) assert.match(byId.get(node).label, /Wrap decoded XML in JSON/);
      assert.doesNotMatch(byId.get('invoke').value, /JSON/);
    }
  }
});

test('readable typography preserves the declared minimum and rejects undersized or invalid declarations', () => {
  for (const id of ['02', '03']) {
    const source = xml(id);
    assert.deepEqual(validateDiagram(source, catalog), []);
    const report = JSON.parse(read(`./candidate-layout-2026-10-29/case-${id}/diagram.render.json`));
    assert.deepEqual(validateRender(report), []);
    const text = report.metrics.filter(m => m.text);
    for (let i = 0; i < text.length; i++) for (let j = i + 1; j < text.length; j++) {
      const p = text[i].text, q = text[j].text;
      const overlap = Math.min(p.x + p.w, q.x + q.w) > Math.max(p.x, q.x) + 1 && Math.min(p.y + p.h, q.y + q.h) > Math.max(p.y, q.y) + 1;
      assert.equal(overlap, false, `${id}: ${text[i].id}/${text[j].id} text overlaps`);
    }
    assert.ok(validateDiagram(source.replace('fontSize=16', 'fontSize=12'), catalog).some(e => e.includes('declared architectural size (16)')));
    for (const invalid of ['10', 'NaN']) assert.ok(validateDiagram(source.replace('architectureFontSize="16"', `architectureFontSize="${invalid}"`), catalog).some(e => e.includes('at least 12')));
  }
});
