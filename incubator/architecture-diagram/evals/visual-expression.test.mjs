import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLParser } from 'fast-xml-parser';
import { inspectDiagram } from './collect-roundtrips.mjs';
import { layoutMetrics } from '../tools/layout-metrics.mjs';

const read = relative => readFileSync(new URL(relative, import.meta.url), 'utf8');
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
const list = value => value == null ? [] : Array.isArray(value) ? value : [value];
function cells(xml) {
  const root = parser.parse(xml).mxfile.diagram.mxGraphModel.root;
  return [...list(root.mxCell), ...list(root.object).map(o => ({ ...o.mxCell, ...o }))];
}
const load = id => cells(read(`./visual-expression-2026-10-29/case-${id}/diagram.drawio`));
const get = (all, id) => {
  const cell = all.find(c => c.id === id);
  assert.ok(cell, `Missing ${id}`);
  return cell;
};

test('visual revisions retain architectural units, domain membership and existing call endpoints', () => {
  for (const id of ['02', '03']) {
    const before = cells(read(`./layout-revision-2026-10-29/case-${id}/diagram.drawio`));
    const after = load(id);
    const restored = id === '02' ? ['test-caller', 'prod-caller'] : [];
    assert.deepEqual(after.filter(c => c.c4Type).map(c => c.id).sort(), [...before.filter(c => c.c4Type).map(c => c.id), ...restored].sort());
    for (const old of before.filter(c => c.c4Type)) {
      const current = get(after, old.id);
      for (const field of ['c4Type', 'parent', 'technology', 'iconKey']) assert.equal(current[field], old[field], `${id}/${old.id}/${field}`);
    }
    for (const old of before.filter(c => c.edge)) {
      const current = get(after, old.id);
      for (const field of ['source', 'target']) assert.equal(current[field], old[field]);
    }
    assert.equal(after.filter(c => c.edge).length, before.filter(c => c.edge).length + (id === '03' ? 2 : 0));
  }
});

test('removed Notes are expressed by their actual nodes, hops and explicit relation matrices', () => {
  const a = load('02'), b = load('03');
  assert.match(get(a, 'caller').label, /Logic Apps alternative/);
  for (const env of ['test', 'prod']) {
    const workload = get(a, `${env}-caller`);
    assert.equal(workload.parent, `${env}-spoke`);
    assert.equal(workload.c4Type, 'Container');
    assert.equal(workload.iconKey, get(a, 'caller').iconKey);
    assert.match(workload.label, /Representative.*Logic Apps alternative/s);
    assert.ok(!a.some(c => c.id === `${env}-pattern`), 'Do not replace a repeated component with a prose placeholder');
  }
  assert.match(get(a, 'A3').value, /outbound ruleset.*execute-api.*Route 53 inbound endpoint IPs/s);
  assert.match(get(a, 'phz').label, /execute-api.*Associated with ingress VPC/s);
  assert.match(get(a, 'tgw').label, /VPC routing details: unspecified/);
  for (const [i, env] of ['dev', 'test', 'prod'].entries()) {
    assert.match(get(a, `B7${String.fromCharCode(97 + i)}`).value, new RegExp(`${env} only`));
    assert.equal(get(a, `environment-bindings-${i + 1}-0`).label, env);
    assert.equal(get(a, `environment-bindings-${i + 1}-3`).label, env);
    for (const col of [1, 2]) {
      assert.equal(get(a, `environment-bindings-${i + 1}-${col}`).label, '✓');
      assert.equal(get(a, `firewall-allowances-${i + 1}-${col}`).label, '✓');
    }
    assert.match(get(a, `${env}-lambda`).label, /Runtime: unspecified/);
  }
  for (const [i, cidr] of ['10.1.0.0/20', '10.2.0.0/24', '10.3.0.0/20'].entries()) assert.equal(get(a, `tgw-bindings-${i + 1}-1`).label, cidr);
  assert.match(get(a, 'firewall-allowances').label, /Azure Firewall \+ AWS Network Firewall/);
  assert.match(get(a, 'r53').label, /DNS only/);
  assert.ok(!a.filter(c => c.c4Type).some(c => /Route 53.*outbound/i.test(c.label)));
  assert.match(get(b, 'apimpolicy').label, /Check system-account roles.*Require user profile/s);
  assert.match(get(b, 'b2c').label, /Identity exchange: unspecified/);
  assert.match(get(b, 'gateway').label, /Operation \/ response schema:.*unspecified/s);
  assert.match(get(b, 'validation').label, /Business-rule validation/);
  for (const id of ['orders', 'documents']) assert.match(get(b, id).label, /Validate XML · method · base64.*Wrap decoded XML in JSON.*JSON → Liquid template → XML/s);
  for (const [suffix, api, caller] of [['a', 'legacy', 'existing'], ['b', 'partner', 'new']]) {
    const failure = get(b, `failure${suffix}`);
    assert.equal(failure.source, api); assert.equal(failure.target, caller);
    assert.match(failure.value, /On internal error \/ timeout.*Generic error only/s);
    assert.match(failure.style, /fontStyle=1;/);
  }
  assert.ok(!/JSON/i.test(get(b, 'invoke').value));
});

test('zero-Note examples still require real geometry, native styles and no new crossings', () => {
  const catalog = JSON.parse(read('../prototype/catalog.json'));
  for (const id of ['02', '03']) {
    const xml = read(`./visual-expression-2026-10-29/case-${id}/diagram.drawio`);
    const all = cells(xml);
    assert.equal(all.filter(c => c.annotationKind === 'comment' || /(?:^|;)shape=note;/.test(c.style || '')).length, 0);
    const render = JSON.parse(read(`./visual-expression-2026-10-29/case-${id}/diagram.render.json`));
    assert.deepEqual(inspectDiagram(xml, render, catalog), {staticErrors: [], renderErrors: [], nativeNoteFindings: []});
    const before = JSON.parse(read(`./layout-revision-2026-10-29/case-${id}/diagram.render.json`));
    assert.ok(layoutMetrics(render).properCrossings.length <= layoutMetrics(before).properCrossings.length);
    // These assertions establish bounded conformance; the separate visual review
    // must still reject paragraphs disguised as labels or tables.
  }
});
