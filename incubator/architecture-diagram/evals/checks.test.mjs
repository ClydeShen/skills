import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateDiagram, validateRender, validateBoundaryRoutes } from '../tools/validate.mjs';
import { gradeClarification, createSuite } from './suite.mjs';

const read = name => readFileSync(new URL(name, import.meta.url), 'utf8');
const diagram = read('../prototype/scenario-01.drawio');
const catalog = JSON.parse(read('../prototype/catalog.json'));

test('actual prototype XML passes static checks; unknown and altered vendor icons fail', () => {
  assert.deepEqual(validateDiagram(diagram, catalog), []);
  for (const changed of [diagram.replace('resIcon=mxgraph.aws4.cognito', 'resIcon=mxgraph.aws4.invented'), diagram.replace('vendor="AWS"', 'vendor="Azure"'), diagram.replace('fillColor=#DD344C', 'fillColor=#000000'), diagram.replace('resIcon=mxgraph.aws4.cognito;', 'resIcon=mxgraph.aws4.cognito;rotation=45;')]) assert.ok(validateDiagram(changed, catalog).length);
});

test('invalid XML, DTDs, compressed pages, duplicate ids, missing legend and bidirectional arrows fail', () => {
  for (const changed of ['<bad>', '<!DOCTYPE mxfile>' + diagram, diagram.replace('mxGraphModel', 'compressedModel'), diagram.replace('id="user"', 'id="web"'), diagram.replace('Legend&#xa;', 'Key&#xa;'), diagram.replace('startArrow=none', 'startArrow=block')]) assert.ok(validateDiagram(changed, catalog).length);
});

test('shared path segments and declared routes through captions are detected', () => {
  const original = diagram.match(/<mxCell id="authenticate"[\s\S]*?<\/mxCell>/)[0];
  const crossing = original.replace(/<Array as="points">[\s\S]*?<\/Array>/, '<Array as="points"><mxPoint x="380" y="400"/><mxPoint x="736" y="400"/><mxPoint x="736" y="286"/></Array>');
  assert.ok(validateDiagram(diagram.replace(original, crossing), catalog).some(e => e.includes('Line crosses caption')));
  const clone = original.replace('id="authenticate"', 'id="duplicate-route"');
  assert.ok(validateDiagram(diagram.replace('</root>', clone + '</root>'), catalog).some(e => e.includes('Shared path')));
});

test('catalog excludes case-mismatched paths and contains no remote artwork', () => {
  assert.equal(catalog.entries.filter(e => !e.usable).length, 4);
  assert.ok(catalog.entries.filter(e => !e.usable).every(e => e.problems.some(p => p.includes('wrong-case'))));
  assert.ok(!catalog.entries.some(e => /(?:image=https?:|data:image)/.test(e.style)));
});

test('four approved cases reach grading without expected answers entering the input', async () => {
  const cases = JSON.parse(read('./cases.json'));
  const suite = await createSuite({ mode: 'fixture' });
  assert.equal(suite.tests.length, 4);
  for (const c of cases) {
    assert.equal(gradeClarification(JSON.stringify(c.fixture), c).pass, true);
    assert.equal(gradeClarification(JSON.stringify({ ...c.fixture, action: 'draw', diagram: '<mxfile/>' }), c).pass, false);
    assert.equal(gradeClarification(JSON.stringify({ action: 'clarify', questions: [{ question: 'Any comments?', recommendation: 'Use best practices.' }], ignored: [], omitted: [] }), c).pass, false);
  }
  assert.equal(gradeClarification('not JSON', cases[0]).pass, false);
  assert.equal(gradeClarification('{"action":"clarify","questions":"bad"}', cases[0]).pass, false);
  assert.equal(gradeClarification('{"action":"clarify","questions":[null]}', cases[0]).pass, false);
  assert.ok(suite.tests.every(t => !t.vars.input.includes('**Expected elements:**') && !t.vars.input.includes('**Natural errors')));
});

test('actual browser geometry preserves boundaries, clear node text and inline connector labels', () => {
  const report = JSON.parse(read('../prototype/scenario-01.render.json'));
  assert.deepEqual(validateRender(report), []);
  const altered = structuredClone(report);
  const edge = altered.metrics.find(m => m.points);
  altered.metrics.find(m => m.text && !m.points).text = { x: edge.points[0].x, y: edge.points[0].y - 20, w: 100, h: 40 };
  assert.ok(validateRender(altered).length);
  const displaced = structuredClone(report);
  displaced.metrics.find(m => m.id === 'request').text.y += 30;
  assert.ok(validateRender(displaced).some(e => e.includes('host segment')));
  const masked = structuredClone(report);
  masked.metrics.find(m => m.id === 'request').text.x = 590;
  assert.ok(validateRender(masked).some(e => e.includes('obscures boundary')));
  const escaped = structuredClone(report);
  escaped.metrics.find(m => m.id === 'authorize').points = [{ x: 1152, y: 488 }, { x: 980, y: 488 }, { x: 980, y: 610 }, { x: 1336, y: 610 }, { x: 1336, y: 620 }];
  assert.ok(validateRender(escaped).some(e => e.includes('Boundary route mismatch enforcement')));
});

test('boundary routes preserve nested membership and cross only necessary domains', () => {
  const nodes = [
    { id: 'outer', c4Type: 'Deployment node', bounds: { x: 0, y: 0, w: 300, h: 200 } },
    { id: 'inner', parent: 'outer', c4Type: 'Software system boundary', bounds: { x: 20, y: 20, w: 100, h: 120 } },
    ...[['a', 'inner', 40, 40], ['b', 'inner', 80, 80], ['c', 'outer', 200, 40], ['d', null, 400, 40], ['e', null, 400, 160]].map(([id, parent, x, y]) => ({ id, parent, bounds: { x, y, w: 10, h: 10 } })),
  ];
  const route = (source, target, points) => [{ id: 'test-route', source, target, points: points.map(([x, y]) => ({ x, y })) }];
  assert.deepEqual(validateBoundaryRoutes(nodes, route('a', 'b', [[50, 45], [85, 45], [85, 80]])), []);
  assert.deepEqual(validateBoundaryRoutes(nodes, route('a', 'c', [[50, 45], [200, 45]])), []);
  assert.deepEqual(validateBoundaryRoutes(nodes, route('a', 'd', [[50, 45], [400, 45]])), []);
  assert.deepEqual(validateBoundaryRoutes(nodes, route('d', 'a', [[400, 45], [50, 45]])), []);
  const siblings = [...nodes, { id: 'sibling', parent: 'outer', c4Type: 'Software system boundary', bounds: { x: 180, y: 20, w: 100, h: 120 } }].map(n => n.id === 'c' ? { ...n, parent: 'sibling' } : n);
  assert.deepEqual(validateBoundaryRoutes(siblings, route('a', 'c', [[50, 45], [200, 45]])), []);
  for (const [source, target, points] of [
    ['a', 'b', [[50, 45], [10, 45], [10, 85], [80, 85]]], // Same-domain escape and re-entry.
    ['a', 'c', [[50, 45], [350, 45], [350, 160], [205, 160], [205, 50]]], // Shared outer domain escape.
    ['d', 'e', [[400, 45], [250, 45], [250, 165], [400, 165]]], // Unrelated-domain transit.
    ['a', 'd', [[50, 45], [150, 45], [150, 100], [100, 100], [100, 160], [400, 160], [400, 45]]], // Re-enter source domain.
    ['d', 'e', [[400, 45], [300, 45], [300, 165], [400, 165]]], // Following a boundary is ambiguous.
  ]) assert.ok(validateBoundaryRoutes(nodes, route(source, target, points)).length, JSON.stringify(points));
  assert.ok(validateBoundaryRoutes(nodes, route('d', 'a', [[400, 45], [100, 45], [100, 160], [45, 160], [45, 50]])).some(e => e.includes('Boundary route mismatch inner')));
  const outside = structuredClone(nodes); outside.find(n => n.id === 'a').bounds.x = -10;
  assert.ok(validateBoundaryRoutes(outside, []).some(e => e.includes('Element outside declared boundary')));
  assert.ok(validateBoundaryRoutes(nodes, route('d', 'e', [[NaN, 45], [400, 165]])).some(e => e.includes('Invalid boundary route coordinates')));
});

test('static XML rejects the original same-domain detour and detached labels', () => {
  const original = diagram.match(/<mxCell id="authorize"[\s\S]*?<\/mxCell>/)[0];
  const escaped = original.replace(/<Array as="points">[\s\S]*?<\/Array>/, '<Array as="points"><mxPoint x="980" y="488"/><mxPoint x="980" y="610"/><mxPoint x="1336" y="610"/></Array>');
  assert.ok(validateDiagram(diagram.replace(original, escaped), catalog).some(e => e.includes('Boundary route mismatch enforcement')));
  assert.ok(validateDiagram(diagram.replace('y="0" relative="1"', 'y="-18" relative="1"'), catalog).some(e => e.includes('opaque label on the connector')));
});
