import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { buildJudgeMessages } from '../../../evals/vision-judge.mjs';
import { createSuite, fixtureJudgement, withNeutralIds } from './image-facts-suite.mjs';

const { cases } = JSON.parse(await readFile(new URL('./image-facts.json', import.meta.url), 'utf8'));
const here = (path) => fileURLToPath(new URL(path, import.meta.url));

test('every case has an existing image and source and enough expected and planted claims', () => {
  assert.ok(cases.length >= 3);
  for (const c of cases) {
    assert.ok(existsSync(here(c.image)), c.image);
    assert.ok(existsSync(here(c.source)), c.source);
    const keys = c.claims.map((claim) => claim.key);
    assert.equal(new Set(keys).size, keys.length, `${c.id}: duplicate keys`);
    for (const claim of c.claims) {
      assert.ok(claim.text?.trim() && claim.basis?.trim(), `${c.id}/${claim.key}`);
      assert.ok([undefined, 'not_drawn'].includes(claim.expect), `${c.id}/${claim.key}`);
    }
    assert.ok(c.claims.filter((claim) => !claim.expect && claim.critical !== false).length >= 10, `${c.id}: critical claims`);
    assert.ok(c.claims.filter((claim) => claim.expect === 'not_drawn').length >= 8, `${c.id}: planted claims`);
  }
});

test('Case B keeps the three unconfirmed paths as must-not-be-drawn claims', () => {
  const b = cases.find((c) => c.id === 'three-tier-b');
  for (const key of ['web-to-app-arrow', 'cache-to-rds', 'standby-to-s3']) assert.equal(b.claims.find((claim) => claim.key === key)?.expect, 'not_drawn', key);
});

test('judge prompts carry only neutral ids and claim text, never keys, bases or labels', () => {
  for (const [index, c] of cases.entries()) {
    const claims = withNeutralIds(c.claims, index);
    assert.ok(claims.every((claim) => /^c\d\d$/.test(claim.id)));
    const half = claims.slice(0, Math.ceil(claims.length / 2));
    assert.ok(half.some((claim) => claim.expect === 'not_drawn') && half.some((claim) => !claim.expect), `${c.id}: ids must not group by truth`);
    const prompt = JSON.stringify(buildJudgeMessages({ image: 'data:image/png;base64,AA==', claims }).messages);
    assert.doesNotMatch(prompt, /not_drawn|critical|basis|planted|ledger|handoff/);
    for (const claim of claims) assert.ok(prompt.includes(claim.text.replace(/"/g, '\\"')), claim.key);
    for (const claim of claims) assert.ok(!prompt.includes(claim.key), `key leaked: ${claim.key}`);
  }
});

test('fixture judgements pass every case, and a confirmed false claim or a rejected critical claim fails it', async () => {
  const suite = await createSuite({ mode: 'fixture' });
  assert.equal(suite.tests.length, cases.length);
  for (const t of suite.tests) {
    const { output } = await suite.providers[0]('', { vars: t.vars });
    const grade = (changed) => t.assert[0].value(JSON.stringify(changed));
    assert.equal(grade(JSON.parse(output)).pass, true, t.description);
    const planted = t.vars.claims.find((claim) => claim.expect === 'not_drawn');
    const critical = t.vars.claims.find((claim) => !claim.expect && claim.critical !== false);
    const flip = (id, verdict) => {
      const judgement = JSON.parse(output);
      judgement.verdicts = judgement.verdicts.map((v) => (v.id === id ? { ...v, verdict, votes: { [verdict]: 1 } } : v));
      return judgement;
    };
    const confirmed = grade(flip(planted.id, 'drawn_correctly'));
    assert.equal(confirmed.pass, false);
    assert.match(confirmed.reason, new RegExp(planted.key));
    assert.equal(grade(flip(critical.id, 'drawn_incorrectly')).pass, false);
    assert.equal(grade(flip(critical.id, 'unclear')).pass, false);
  }
});

test('model mode supplies the judge provider and fixture mode makes no model call', async () => {
  const model = await createSuite({ mode: 'model', env: { NVIDIA_API_KEY: 'k' } });
  assert.equal(model.providers.length, 1);
  assert.match(model.providers[0].id(), /^vision-judge:/);
  assert.notEqual(model.providers[0].id(), 'vision-judge:nvidia/nemotron-3.5-super-vl-120b-a12b');
  await assert.rejects(() => createSuite({ mode: 'model', env: {} }), /NVIDIA_API_KEY/);
  assert.match(fixtureJudgement([{ id: 'c01' }]), /"runs_ok":1/);
});
