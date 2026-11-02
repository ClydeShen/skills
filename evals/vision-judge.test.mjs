import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { judgeConfig, judgeDefaultModel } from './lib.mjs';
import {
  aggregateRuns,
  buildJudgeMessages,
  createVisionJudgeProvider,
  gradeJudgement,
  parseVerdicts,
  shuffled,
} from './vision-judge.mjs';

const claims = [
  { id: 'a-in-cloud', text: 'A is inside the cloud.', critical: true },
  { id: 'b-calls-a', text: 'B calls A.', critical: true },
  { id: 'note', text: 'There is a note.', critical: false },
  { id: 'x-a-outside', text: 'A is outside the cloud.', expect: 'not_drawn' },
];
const answer = (verdicts) =>
  JSON.stringify({ verdicts: Object.entries(verdicts).map(([id, verdict]) => ({ id, evidence: 'seen', verdict })) });
const good = {
  'a-in-cloud': 'drawn_correctly',
  'b-calls-a': 'drawn_correctly',
  note: 'not_shown',
  'x-a-outside': 'drawn_incorrectly',
};

test('prompts show every claim once and never reveal grading labels', () => {
  const { messages, order } = buildJudgeMessages({ image: 'data:image/png;base64,AA==', claims });
  const text = messages[1].content[1].text;
  assert.equal(order.length, claims.length);
  for (const claim of claims) assert.equal(text.split(`[${claim.id}]`).length, 2);
  assert.doesNotMatch(JSON.stringify(messages), /not_drawn|critical|expect/);
  assert.notDeepEqual(
    shuffled(claims, 0).map((c) => c.id),
    shuffled(claims, 1).map((c) => c.id),
  );
  assert.deepEqual(shuffled(claims, 3), shuffled(claims, 3));
});

test('parsing accepts bracketed ids, list numbers, fences and trailing junk, and rejects unusable output', () => {
  const order = claims;
  assert.equal(parseVerdicts(answer(good), order).get('b-calls-a').verdict, 'drawn_correctly');
  const bracketed = JSON.stringify({ verdicts: [{ id: '[a-in-cloud]', evidence: 'e', verdict: 'drawn_correctly' }] });
  assert.equal(parseVerdicts(bracketed, order).get('a-in-cloud').verdict, 'drawn_correctly');
  const numbered = JSON.stringify({ verdicts: [{ id: '2', evidence: 'e', verdict: 'drawn_correctly' }] });
  assert.equal(parseVerdicts(numbered, order).get('b-calls-a').verdict, 'drawn_correctly');
  assert.equal(parseVerdicts(`\`\`\`json\n${answer(good)}\n\`\`\``, order).size, 4);
  assert.equal(parseVerdicts(`${answer(good)})`, order).size, 4);
  assert.equal(parseVerdicts(JSON.parse(answer(good)), order).size, 4);
  const unknown = JSON.stringify({
    verdicts: [
      { id: 'a-in-cloud', evidence: 'e', verdict: 'maybe' },
      { id: 'other', evidence: '', verdict: 'drawn_correctly' },
    ],
  });
  assert.equal(parseVerdicts(unknown, order).get('a-in-cloud').verdict, 'unclear');
  assert.equal(parseVerdicts(unknown, order).has('other'), false);
  for (const bad of [
    '',
    'no json here',
    '{"verdicts": []}',
    '{"other": 1}',
    '{"verdicts": [{"id":"zzz","verdict":"drawn_correctly"}]}',
  ])
    assert.equal(parseVerdicts(bad, order), null, bad);
});

test('grading passes expected behavior and rejects the failures that matter', () => {
  const run = (verdicts, count = 1) =>
    JSON.stringify(
      aggregateRuns(
        Array.from({ length: count }, () => parseVerdicts(answer(verdicts), claims)),
        claims,
      ),
    );
  assert.equal(gradeJudgement(run(good), claims).pass, true);
  assert.equal(
    gradeJudgement(run({ ...good, 'x-a-outside': 'drawn_correctly' }), claims).pass,
    false,
    'a confirmed false claim',
  );
  assert.equal(
    gradeJudgement(run({ ...good, 'b-calls-a': 'drawn_incorrectly' }), claims).pass,
    false,
    'a missed critical claim',
  );
  assert.equal(
    gradeJudgement(run({ ...good, 'b-calls-a': 'unclear' }), claims).pass,
    false,
    'an undecided critical claim',
  );
  assert.equal(
    gradeJudgement(run({ ...good, note: 'drawn_incorrectly' }), claims).pass,
    true,
    'a non-critical claim is informational',
  );
  for (const output of ['not json', '{}', JSON.stringify({ verdicts: [], runs_ok: 0 })])
    assert.equal(gradeJudgement(output, claims).pass, false, output);
});

test('runs combine by strict majority for true and planted claims, and a lone slip is flagged, not fatal', () => {
  const runs = [good, good, { ...good, 'b-calls-a': 'drawn_incorrectly' }].map((v) => parseVerdicts(answer(v), claims));
  assert.equal(gradeJudgement(aggregateRuns(runs, claims), claims).pass, true);
  const noisy = [good, { ...good, 'b-calls-a': 'not_shown' }, { ...good, 'b-calls-a': 'unclear' }].map((v) =>
    parseVerdicts(answer(v), claims),
  );
  assert.equal(gradeJudgement(aggregateRuns(noisy, claims), claims).pass, false);
  const slip = { ...good, 'x-a-outside': 'drawn_correctly' };
  const oneSlip = gradeJudgement(
    aggregateRuns(
      [good, good, slip].map((v) => parseVerdicts(answer(v), claims)),
      claims,
    ),
    claims,
  );
  assert.equal(oneSlip.pass, true);
  assert.match(oneSlip.reason, /x-a-outside confirmed in 1 of 3 runs/);
  assert.equal(
    gradeJudgement(
      aggregateRuns(
        [good, slip, slip].map((v) => parseVerdicts(answer(v), claims)),
        claims,
      ),
      claims,
    ).pass,
    false,
    'most runs confirmed a false claim',
  );
  assert.equal(
    gradeJudgement(aggregateRuns([parseVerdicts(answer(slip), claims)], claims), claims).pass,
    false,
    'a single run has no majority to outvote the slip',
  );
  const withFailure = aggregateRuns(
    [parseVerdicts(answer(good), claims), null, parseVerdicts(answer(good), claims)],
    claims,
  );
  assert.equal(withFailure.runs_ok, 2);
  assert.equal(withFailure.runs_total, 3);
  assert.equal(gradeJudgement(withFailure, claims).pass, true);
});

async function provider(overrides) {
  const dir = await mkdtemp(join(tmpdir(), 'judge-'));
  const image = join(dir, 'x.png');
  await writeFile(image, Buffer.from([137, 80, 78, 71]));
  const calls = [];
  const queue = [...overrides.responses];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    const next = queue.length > 1 ? queue.shift() : queue[0];
    if (next instanceof Error) throw next;
    return {
      ok: next.status === 200,
      status: next.status,
      json: async () => ({ choices: [{ message: { content: next.content } }], usage: { total_tokens: 10 } }),
    };
  };
  const instance = createVisionJudgeProvider({
    model: 'm',
    apiBaseUrl: 'https://api.test/v1',
    apiKey: 'secret-key',
    runs: overrides.runs ?? 2,
    retries: 2,
    backoffMs: 1,
    sleep: async () => {},
    fetchImpl,
  });
  return { instance, calls, vars: { image_path: image, claims } };
}

test('the provider retries transient errors, asks every run in a different order, and never exposes the key', async () => {
  const { instance, calls, vars } = await provider({
    responses: [{ status: 503 }, { status: 200, content: answer(good) }],
  });
  const result = await instance.callApi('', { vars });
  const judgement = JSON.parse(result.output);
  assert.equal(judgement.runs_ok, 2);
  assert.equal(calls.length, 3);
  assert.equal(calls[0].body.response_format.type, 'json_schema');
  assert.equal(calls[0].init.headers.Authorization, 'Bearer secret-key');
  assert.equal(gradeJudgement(result.output, claims).pass, true);
  assert.doesNotMatch(result.output, /secret-key/);
  const orders = calls.slice(1).map((c) => c.body.messages[1].content[1].text);
  assert.notEqual(orders[0], orders[1]);
});

test('the provider reports an error without secrets when no run succeeds, and gives up on permanent failures', async () => {
  const transient = await provider({ responses: [{ status: 503 }] });
  const failed = await transient.instance.callApi('', { vars: transient.vars });
  assert.match(failed.error, /HTTP 503/);
  assert.doesNotMatch(failed.error, /secret-key/);
  assert.equal(transient.calls.length, 2 * 3, 'each run tries once plus two retries');
  const permanent = await provider({ responses: [{ status: 401 }] });
  assert.match((await permanent.instance.callApi('', { vars: permanent.vars })).error, /HTTP 401/);
  assert.equal(permanent.calls.length, 2, 'no retries for a rejected request');
  const network = await provider({ responses: [new Error('connect secret-key failed')], runs: 1 });
  const lost = await network.instance.callApi('', { vars: network.vars });
  assert.match(lost.error, /network error/);
  assert.doesNotMatch(lost.error, /secret-key/);
  const garbage = await provider({ responses: [{ status: 200, content: 'not json' }], runs: 1 });
  assert.match((await garbage.instance.callApi('', { vars: garbage.vars })).error, /no usable answer/);
});

test('judge settings default to a model separate from generation and ignore generation parameters', () => {
  const env = {
    NVIDIA_API_KEY: 'k',
    NVIDIA_MODEL: 'nvidia/nemotron-3.5-super-vl-120b-a12b',
    NVIDIA_REASONING_EFFORT: 'high',
    EVAL_MAX_TOKENS: '16384',
  };
  const config = judgeConfig(env);
  assert.equal(config.model, judgeDefaultModel);
  assert.equal(config.maxTokens, 4096);
  assert.equal(config.extraBody.reasoning_effort, undefined);
  assert.equal(judgeConfig({ ...env, NVIDIA_JUDGE_MODEL: 'z-ai/glm-5.3-flash' }).model, 'z-ai/glm-5.3-flash');
  assert.equal(
    judgeConfig({ ...env, NVIDIA_JUDGE_MODEL: 'nvidia/nemotron-3.5-super-vl-120b-a12b' }).extraBody.reasoning_effort,
    'none',
  );
  assert.throws(() => judgeConfig({}), /NVIDIA_API_KEY/);
});
