import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { judgeConfig, nvidiaApiBaseUrl } from './lib.mjs';
import {
  createRateLimiter,
  minIntervalMs,
  nvidiaRequestsPerMinute,
  providerDelayMs,
  requestsPerMinute,
  retryDelayMs,
} from './rate-limit.mjs';
import { createVisionJudgeProvider } from './vision-judge.mjs';

// A clock the test advances only by sleeping.
const clock = () => {
  const state = { t: 1_000_000, sleeps: [] };
  return {
    state,
    now: () => state.t,
    sleep: async (ms) => {
      state.sleeps.push(ms);
      state.t += ms;
    },
  };
};

test('the default rate stays below the 40 requests per minute that the trial endpoint allows', () => {
  assert.equal(nvidiaRequestsPerMinute, 36);
  assert.equal(requestsPerMinute({}), 36);
  assert.equal(requestsPerMinute({ NVIDIA_RPM: '' }), 36);
  assert.equal(requestsPerMinute({ NVIDIA_RPM: '20' }), 20);
  for (const bad of ['0', '-3', '2.5', 'many', '1001'])
    assert.throws(() => requestsPerMinute({ NVIDIA_RPM: bad }), /NVIDIA_RPM must be an integer from 1 to 1000/);
  assert.equal(minIntervalMs(36), 1667);
  assert.equal(minIntervalMs(40), 1500);
});

// Sleepers wait on one virtual timeline, as concurrent timers do; the driver wakes the earliest first.
async function drive(work, state, timers) {
  let done = false;
  const finished = work.then(() => {
    done = true;
  });
  while (!done) {
    await new Promise((resolve) => setImmediate(resolve));
    timers.sort((a, b) => a.at - b.at);
    const next = timers.shift();
    if (next) {
      state.t = Math.max(state.t, next.at);
      next.resolve();
    }
  }
  await finished;
}

test('requests start at least one interval apart, so neither a burst nor the average can exceed the rate', async () => {
  const state = { t: 1_000_000 };
  const timers = [];
  const now = () => state.t;
  const sleep = (ms) => new Promise((resolve) => timers.push({ at: state.t + ms, resolve }));
  const limiter = createRateLimiter({ requestsPerMinute: 36, now, sleep });
  const starts = [];
  // Twenty callers arrive at once, as in a burst.
  await drive(
    Promise.all(
      Array.from({ length: 20 }, async () => {
        await limiter.acquire();
        starts.push(state.t);
      }),
    ),
    state,
    timers,
  );
  assert.equal(starts.length, 20);
  starts.sort((a, b) => a - b);
  for (let i = 1; i < starts.length; i++) assert.ok(starts[i] - starts[i - 1] >= limiter.interval, `gap ${i}`);
  // No sliding minute holds more requests than the rate allows.
  for (const from of starts) assert.ok(starts.filter((t) => t >= from && t < from + 60000).length <= 36);
});

test('an idle limiter lets the next request start at once', async () => {
  const { state, now, sleep } = clock();
  const limiter = createRateLimiter({ requestsPerMinute: 36, now, sleep });
  await limiter.acquire();
  state.t += 10_000;
  await limiter.acquire();
  assert.deepEqual(state.sleeps, []);
});

test('a retry waits for Retry-After when the service sends it, and otherwise backs off exponentially', () => {
  assert.equal(retryDelayMs(null, 1, 2000), 2000);
  assert.equal(retryDelayMs(undefined, 3, 2000), 8000);
  assert.equal(retryDelayMs('', 2, 2000), 4000);
  assert.equal(retryDelayMs('7', 1, 2000), 7000);
  assert.equal(retryDelayMs('1', 2, 2000), 4000, 'never shorter than the backoff');
  assert.equal(retryDelayMs('soon', 1, 2000), 2000, 'a date or text value is ignored');
});

test('only calls to the NVIDIA endpoint leave a gap', () => {
  const nvidia = { config: { apiBaseUrl: nvidiaApiBaseUrl } };
  assert.equal(providerDelayMs(nvidia, {}, nvidiaApiBaseUrl), 1667);
  assert.equal(providerDelayMs(nvidia, { NVIDIA_RPM: '10' }, nvidiaApiBaseUrl), 6000);
  assert.equal(providerDelayMs({ config: { apiBaseUrl: 'http://127.0.0.1:11434/v1' } }, {}, nvidiaApiBaseUrl), 0);
  assert.equal(providerDelayMs(null, {}, nvidiaApiBaseUrl), 0);
});

test('the image judge takes its rate from the environment', () => {
  assert.equal(judgeConfig({ NVIDIA_API_KEY: 'k' }).requestsPerMinute, 36);
  assert.equal(judgeConfig({ NVIDIA_API_KEY: 'k', NVIDIA_RPM: '12' }).requestsPerMinute, 12);
});

test('the image judge spaces every attempt, honours Retry-After on a 429, and then succeeds', async () => {
  const { state, now, sleep } = clock();
  const dir = await mkdtemp(join(tmpdir(), 'rate-'));
  const image = join(dir, 'x.png');
  await writeFile(image, Buffer.from([137, 80, 78, 71]));
  const claims = [{ id: 'a', text: 'A is drawn.' }];
  const starts = [];
  const replies = [{ status: 429, retryAfter: '7' }, { status: 200 }, { status: 200 }];
  const fetchImpl = async (_url, init) => {
    starts.push(state.t);
    const next = replies.shift() ?? { status: 200 };
    const content = JSON.stringify({
      verdicts: JSON.parse(init.body).messages[1].content[1].text.match(/\[([^\]]+)\]/g)
        ? [{ id: 'a', evidence: 'seen', verdict: 'drawn_correctly' }]
        : [],
    });
    return {
      ok: next.status === 200,
      status: next.status,
      headers: { get: (name) => (name === 'retry-after' ? (next.retryAfter ?? null) : null) },
      json: async () => ({ choices: [{ message: { content } }], usage: { total_tokens: 1 } }),
    };
  };
  const instance = createVisionJudgeProvider({
    model: 'm',
    apiBaseUrl: 'https://api.test/v1',
    apiKey: 'k',
    runs: 2,
    retries: 2,
    backoffMs: 2000,
    requestsPerMinute: 36,
    now,
    sleep,
    fetchImpl,
  });
  const result = await instance.callApi('', { vars: { image_path: image, claims } });
  assert.ok(result.output, result.error);
  assert.equal(starts.length, 3, 'one rejected attempt, its retry, and the second run');
  assert.ok(starts[1] - starts[0] >= 7000, 'the retry waits for the 7 seconds Retry-After asked for');
  for (let i = 1; i < starts.length; i++) assert.ok(starts[i] - starts[i - 1] >= 1667, `gap ${i}`);
});
