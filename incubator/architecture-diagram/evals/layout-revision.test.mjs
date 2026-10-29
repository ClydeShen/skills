import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLParser } from 'fast-xml-parser';
import { inspectDiagram } from './collect-roundtrips.mjs';
import { layoutMetrics, routeMetrics } from '../tools/layout-metrics.mjs';

const read = relative => readFileSync(new URL(relative, import.meta.url), 'utf8');
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
const list = value => value == null ? [] : Array.isArray(value) ? value : [value];
const cells = xml => {
  const root = parser.parse(xml).mxfile.diagram.mxGraphModel.root;
  return [...list(root.mxCell), ...list(root.object).map(o => ({ ...o.mxCell, ...o }))];
};

test('route diagnostics distinguish bends, redundant points and aligned detours without claiming invalidity', () => {
  assert.equal(routeMetrics([{x:0,y:0},{x:5,y:0},{x:5,y:0},{x:10,y:0}]).bends, 0);
  const detour = routeMetrics([{x:0,y:0},{x:0,y:10},{x:20,y:10},{x:20,y:0}]);
  assert.equal(detour.bends, 2);
  assert.equal(detour.excessLength, 20);
  assert.equal(detour.alignedDetour, true);
  assert.throws(() => routeMetrics([{x:0,y:0},{x:20,y:10}]));
  assert.throws(() => routeMetrics([{x:0,y:0},{x:Infinity,y:0}]));
  const cross = layoutMetrics({metrics: [
    {id: 'a', points: [{x:0,y:10},{x:20,y:10}]},
    {id: 'b', points: [{x:10,y:0},{x:10,y:20}]},
  ]});
  assert.equal(cross.properCrossings.length, 1);
});

test('repaired diagrams preserve source elements and hops except the declared semantic repairs', () => {
  for (const id of ['02', '03']) {
    const before = cells(read(`./full-roundtrip-2026-10-29/case-${id}/l1.drawio`));
    const after = cells(read(`./layout-revision-2026-10-29/case-${id}/diagram.drawio`));
    assert.deepEqual(after.map(c => c.id).sort(), before.map(c => c.id).sort());
    const allowed = new Set(id === '02' ? ['awsvpn', 'forward-rule', 'A1', 'A9'] : ['invoke']);
    for (const old of before) {
      const current = after.find(c => c.id === old.id);
      for (const key of ['source', 'target', 'c4Type', 'technology', 'iconKey', 'annotationFor']) assert.equal(current[key], old[key], `${id}/${old.id}/${key}`);
      assert.equal(current.parent, id === '02' && old.id === 'awsvpn' ? 'network' : old.parent);
      if (!allowed.has(old.id)) {
        assert.equal(current.label, old.label, `${id}/${old.id}/label`);
        assert.equal(current.value, old.value, `${id}/${old.id}/value`);
      }
      if (old.edge) {
        const oldDashed = old.style.match(/(?:^|;)dashed=([^;]+)/)?.[1];
        const newDashed = current.style.match(/(?:^|;)dashed=([^;]+)/)?.[1];
        assert.equal(newDashed, old.id === 'authorize' ? '0' : oldDashed);
      }
    }
    if (id === '03') assert.equal(after.find(c => c.id === 'invoke').value, '10 Invoke<br>[Lambda invocation]');
    if (id === '02') assert.match(after.find(c => c.id === 'forward-rule').label, /associated with Private Resolver outbound endpoint/);
  }
});

test('repaired diagrams pass actual render checks, retain note metadata, and reduce bends', () => {
  const catalog = JSON.parse(read('../prototype/catalog.json'));
  for (const id of ['02', '03']) {
    const xml = read(`./layout-revision-2026-10-29/case-${id}/diagram.drawio`);
    const rendered = JSON.parse(read(`./layout-revision-2026-10-29/case-${id}/diagram.render.json`));
    assert.deepEqual(inspectDiagram(xml, rendered, catalog), {staticErrors: [], renderErrors: [], nativeNoteFindings: []});
    const comments = cells(xml).filter(c => c.annotationKind === 'comment');
    for (const comment of comments) {
      const actual = rendered.metrics.find(n => n.id === comment.id);
      assert.equal(actual.annotationKind, 'comment', comment.id);
      assert.equal(actual.annotationFor, comment.annotationFor, comment.id);
      assert.ok(actual.text.x >= actual.bounds.x - 2 && actual.text.y >= actual.bounds.y - 2 && actual.text.x + actual.text.w <= actual.bounds.x + actual.bounds.w + 2 && actual.text.y + actual.text.h <= actual.bounds.y + actual.bounds.h + 2, `Note text must fit: ${comment.id}`);
    }
    const previous = JSON.parse(read(`./full-roundtrip-2026-10-29/case-${id}/l1.render.json`));
    assert.ok(layoutMetrics(rendered).totalBends < layoutMetrics(previous).totalBends);
    assert.ok(layoutMetrics(rendered).properCrossings.length <= layoutMetrics(previous).properCrossings.length, 'Do not trade fewer bends for more crossings');
    if (id === '03') for (const edge of ['routeorders', 'awsorders', 'vpnorders', 'vpndocuments', 'invoke']) assert.equal(layoutMetrics(rendered).edges[edge].bends, 0, edge);
  }
});
