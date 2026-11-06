import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import { parse as parseYaml } from 'yaml';
import { markdownTargets } from './repository.mjs';

const bundle = fileURLToPath(new URL('../knowledge/skill-lifecycle/', import.meta.url));
const schema = JSON.parse(readFileSync(path.join(bundle, 'checklist.schema.json'), 'utf8'));
const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema);
const checklist = () => parseYaml(readFileSync(path.join(bundle, 'checklist.yaml'), 'utf8'));

function valid(data) {
  return validate(data) && new Set(data.items.map((item) => item.id)).size === data.items.length;
}

test('portable lifecycle template validates and starts without asserted passes', () => {
  const data = checklist();
  assert.ok(valid(data), JSON.stringify(validate.errors));
  assert.ok(data.items.every((item) => item.status === 'todo' && item.evidence.length === 0));
  for (const id of ['freeze-provenance', 'platform-audit-binding', 'state-compatibility', 'release-approval'])
    assert.ok(data.items.some((item) => item.id === id));
});

test('lifecycle status validation rejects unsupported claims and malformed records', () => {
  const mutations = [
    (data) => {
      data.items[0].status = 'pass';
    },
    (data) => {
      data.items[0].status = 'not-applicable';
      data.items[0].rationale = 'Unavailable';
    },
    (data) => {
      data.items[0].executor = 'agent';
    },
    (data) => {
      data.items[0].extra = true;
    },
    (data) => {
      data.items[1].id = data.items[0].id;
    },
    (data) => {
      data.items[0].status = 'approved';
    },
    (data) => {
      data.items.find((item) => item.applicability === 'conditional').status = 'not-applicable';
    },
    (data) => {
      data.items[0].status = 'pass';
      data.items[0].evidence = ['   '];
    },
    (data) => {
      delete data.items.find((item) => item.applicability === 'conditional').when;
    },
    (data) => {
      data.items.find((item) => item.gate === 'mechanical').executor = 'agent';
    },
  ];
  for (const mutate of mutations) {
    const data = checklist();
    mutate(data);
    assert.equal(valid(data), false);
  }
});

test('lifecycle records accept evidence-backed structure without asserting evidence truth', () => {
  const data = checklist();
  data.items[0].status = 'pass';
  data.items[0].evidence = ['owner-decision-record#approved-artifact'];
  const state = data.items.find((item) => item.id === 'state-compatibility');
  state.status = 'not-applicable';
  state.rationale = 'This package does not persist or modify external state.';
  data.items.find((item) => item.id === 'platform-audit-binding').status = 'inconclusive';
  assert.ok(valid(data), JSON.stringify(validate.errors));
});

test('lifecycle bundle can be copied alone with no project-local link dependencies', (t) => {
  const temporary = mkdtempSync(path.join(os.tmpdir(), 'skill-lifecycle-portable-'));
  t.after(() => rmSync(temporary, { recursive: true, force: true }));
  cpSync(bundle, temporary, { recursive: true });
  const files = readdirSync(temporary, { recursive: true }).filter((file) => file.endsWith('.md'));
  for (const file of files) {
    const content = readFileSync(path.join(temporary, file), 'utf8');
    assert.doesNotMatch(content, /\/workspace\/|ClydeShen\/skills|incubator\//);
    for (const href of markdownTargets(content)) {
      if (/^(?:https?:|mailto:|#)/.test(href)) continue;
      const resolved = path.resolve(path.dirname(path.join(temporary, file)), href.split('#')[0]);
      assert.ok(resolved.startsWith(`${temporary}${path.sep}`), `${file}: ${href} leaves copied bundle`);
      assert.ok(existsSync(resolved), `${file}: ${href} is missing`);
    }
  }
  const copiedSchema = JSON.parse(readFileSync(path.join(temporary, 'checklist.schema.json'), 'utf8'));
  const copiedData = parseYaml(readFileSync(path.join(temporary, 'checklist.yaml'), 'utf8'));
  assert.ok(new Ajv2020({ strict: true }).compile(copiedSchema)(copiedData));
});
