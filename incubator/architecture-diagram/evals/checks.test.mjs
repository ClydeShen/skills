import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateDiagram, validateRender } from '../tools/validate.mjs';
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
  const crossing = original.replace('</mxGeometry>', '<Array as="points"><mxPoint x="450" y="336"/><mxPoint x="450" y="410"/><mxPoint x="620" y="410"/><mxPoint x="620" y="336"/></Array></mxGeometry>');
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

test('actual browser geometry keeps node text clear and provides label-length segments', () => {
  const report = JSON.parse(read('../prototype/scenario-01.render.json'));
  assert.deepEqual(validateRender(report), []);
  const altered = structuredClone(report);
  const edge = altered.metrics.find(m => m.points);
  altered.metrics.find(m => m.text && !m.points).text = { x: edge.points[0].x, y: edge.points[0].y - 20, w: 100, h: 40 };
  assert.ok(validateRender(altered).length);
});
