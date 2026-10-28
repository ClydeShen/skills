const test = require('node:test');
const assert = require('node:assert/strict');
const check = require('./assertions.cjs');
const buildPrompt = require('./prompt.cjs');
const cases = require('./cases.json');

const envelope = (text, user_profile = null, project_profile = null) =>
  JSON.stringify({ text, user_profile, project_profile });

test('protected terms fail when a synonym replaces an exact identifier', () => {
  const context = { vars: { checks: { contains: ['HTTPRoute', 'ML-KEM'] } } };
  assert.equal(check(envelope('HTTPRoute uses ML-KEM.'), context).pass, true);
  assert.equal(check(envelope('The route uses quantum-safe keys.'), context).pass, false);
});

test('state checks reject contamination, invented learning, and missing state', () => {
  const context = { vars: { checks: { unchanged_profiles: true } } };
  assert.equal(check(envelope('Deployment finished.'), context).pass, true);
  assert.equal(check(envelope('Deployment finished.', { candidates: ['inferred from draft'] }), context).pass, false);
  assert.equal(check('Deployment finished.', context).pass, false);
});

test('project terms cannot leak into the personal profile', () => {
  const context = { vars: { checks: { project_term: 'deployment ring' } } };
  const project = { terms: [{ term: 'deployment ring' }] };
  assert.equal(check(envelope('Saved.', null, project), context).pass, true);
  assert.equal(check(envelope('Saved.', { term: 'deployment ring' }, project), context).pass, false);
});

test('one sample remains provisional until independent evidence accumulates', () => {
  const context = { vars: { checks: { candidate_only: true } } };
  const provisional = { candidates: [{ pattern: 'Decision first' }], contexts: {} };
  assert.equal(check(envelope('Saved candidate.', provisional), context).pass, true);
  const premature = {
    candidates: provisional.candidates,
    global_voice: { patterns: [{ rule: 'Decision first' }] },
  };
  assert.equal(check(envelope('Saved pattern.', premature), context).pass, false);
});

test('the prompt supplies live skill sources and withholds grading criteria', () => {
  const vars = {
    request: 'Rewrite this synthetic note.',
    rubric: 'HELD_OUT_JUDGE_RULE',
    checks: { contains: ['HELD_OUT_PROTECTED_TERM'] },
    user_profile: null,
    project_profile: null,
  };
  const messages = buildPrompt({ vars });
  const serialized = JSON.stringify(messages);
  assert.ok(serialized.includes('FILE: SKILL.md'));
  assert.ok(serialized.includes('FILE: references/technical-terms.json'));
  assert.ok(!serialized.includes(vars.rubric));
  assert.ok(!serialized.includes(vars.checks.contains[0]));
  assert.deepEqual(messages.at(-1), { role: 'user', content: vars.request });
});

test('cases are uniquely identified and each has a semantic grading criterion', () => {
  assert.equal(new Set(cases.map((entry) => entry.description)).size, cases.length);
  for (const entry of cases) {
    assert.ok(entry.vars.request);
    assert.ok(entry.vars.rubric);
    assert.ok(Object.keys(entry.vars.checks).length);
  }
});
