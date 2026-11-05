import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { checkSteps, diagramSteps, sourceSteps } from '../candidate/architecture-diagram/scripts/check-steps.mjs';

const read = (name) => readFileSync(new URL(name, import.meta.url), 'utf8');
const scenarioA = read('./scenarios/a.md');

test('source steps come from top-level numbered items and inline markers, not nested items', () => {
  assert.deepEqual(sourceSteps('Intro\n\n1. search\n2. answer\n   1. nested detail\n3. store\n'), [1, 2, 3]);
  assert.deepEqual(sourceSteps('**Flow.** (1) A calls B. (2) B calls C.'), [1, 2]);
  assert.deepEqual(sourceSteps('No order here.\n1. only one item\n'), []);
});

test('label lines carry step numbers, including a second line and a series letter', () => {
  const edge = (value) =>
    `<mxCell id="e${value.length}" value="${value}" edge="1" parent="1" source="a" target="b"><mxGeometry relative="1" as="geometry"/></mxCell>`;
  const xml = `<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/>${edge('7 XML to JSON&lt;br&gt;9 JSON to XML')}${edge('Q2 answer')}${edge('index')}</root></mxGraphModel>`;
  assert.deepEqual(
    [...diagramSteps(xml)].sort((a, b) => a - b),
    [2, 7, 9],
  );
});

test('the clean runs of scenario A are told apart: unnumbered steps are reported, numbered ones are not', () => {
  assert.deepEqual(checkSteps(scenarioA, read('./fixtures/houses-a.drawio')), [
    'The source orders steps 1, 2, 3; no connector label carries 1, 2, 3. Number each stated step on its connector by execution order, with a short action, or name in the companion account why a step is not drawn.',
  ]);
  assert.deepEqual(checkSteps(scenarioA, read('./fixtures/clean-session-a-final.drawio')), []);
});
