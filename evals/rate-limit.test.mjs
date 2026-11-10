import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { judgeConfig, nvidiaApiBaseUrl } from './lib.mjs';
import {
  createRateLimiter,
  isNvidiaProvider,
  limitedProvider,
  minIntervalMs,
  nvidiaRequestLimit,
  nvidiaRequestsPerMinute,
  requestsPerMinute,
  retryDelayMs,
  sharedNvidiaLimiter,
  sharedScheduleFile,
} from './rate-limit.mjs';
import { createVisionJudgeProvider } from './vision-judge.mjs';

const moduleUrl = new URL('./rate-limit.mjs', import.meta.url).href;

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

test('the rate is capped at the 40 requests per minute the trial endpoint allows, and defaults below it', () => {
  assert.equal(nvidiaRequestLimit, 40);
  assert.equal(nvidiaRequestsPerMinute, 36);
  assert.equal(requestsPerMinute({}), 36);
  assert.equal(requestsPerMinute({ NVIDIA_RPM: '' }), 36);
  assert.equal(requestsPerMinute({ NVIDIA_RPM: '20' }), 20);
  assert.equal(requestsPerMinute({ NVIDIA_RPM: '40' }), 40);
  for (const bad of ['0', '-3', '2.5', 'many', '41', '200', '1000'])
    assert.throws(() => requestsPerMinute({ NVIDIA_RPM: bad }), /NVIDIA_RPM must be an integer from 1 to 40/, bad);
  assert.equal(minIntervalMs(36), 1667);
  assert.equal(minIntervalMs(40), 1500);
});

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

test('separate processes share one schedule, so together they stay below the rate', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'schedule-'));
  const file = join(dir, 'nvidia-rate.json');
  // 600 per minute is a 100 ms interval: fast enough to test, with the same mechanism as the real rate.
  const child = `
    import { createRateLimiter } from ${JSON.stringify(moduleUrl)};
    const limiter = createRateLimiter({ requestsPerMinute: 600, file: ${JSON.stringify(file)} });
    const starts = [];
    for (let i = 0; i < 4; i++) { await limiter.acquire(); starts.push(Date.now()); }
    console.log(JSON.stringify(starts));`;
  const run = () =>
    new Promise((resolve, reject) => {
      const p = spawn(process.execPath, ['--input-type=module', '-e', child], { stdio: ['ignore', 'pipe', 'inherit'] });
      let out = '';
      p.stdout.on('data', (d) => {
        out += d;
      });
      p.on('close', (code) => (code === 0 ? resolve(JSON.parse(out)) : reject(new Error(`exit ${code}`))));
    });
  const starts = (await Promise.all([run(), run(), run()])).flat().sort((a, b) => a - b);
  assert.equal(starts.length, 12);
  // Timers may fire a millisecond or two early; a shared schedule keeps every gap near the 100 ms interval.
  for (let i = 1; i < starts.length; i++)
    assert.ok(starts[i] - starts[i - 1] >= 95, `gap ${i}: ${starts[i] - starts[i - 1]}`);
  // Without the shared schedule, three processes would start together.
  assert.ok(starts.at(-1) - starts[0] >= 11 * 95);
});

test('a lock left by a dead process does not block the schedule for long', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'schedule-'));
  const file = join(dir, 'nvidia-rate.json');
  await writeFile(`${file}.lock`, '');
  const old = new Date(Date.now() - 60_000);
  const { utimes } = await import('node:fs/promises');
  await utimes(`${file}.lock`, old, old);
  const limiter = createRateLimiter({ requestsPerMinute: 600, file });
  await limiter.acquire();
});

test('the shared limiter uses the configured rate and the machine-wide schedule file', () => {
  assert.equal(sharedNvidiaLimiter({}).interval, 1667);
  assert.equal(sharedNvidiaLimiter({ NVIDIA_RPM: '10' }).interval, 6000);
  assert.throws(() => sharedNvidiaLimiter({ NVIDIA_RPM: '100' }), /from 1 to 40/);
  assert.match(sharedScheduleFile, /evals\/\.local\/nvidia-rate\.json$/);
});

test('a retry waits for Retry-After when the service sends it, and otherwise backs off exponentially', () => {
  assert.equal(retryDelayMs(null, 1, 2000), 2000);
  assert.equal(retryDelayMs(undefined, 3, 2000), 8000);
  assert.equal(retryDelayMs('', 2, 2000), 4000);
  assert.equal(retryDelayMs('7', 1, 2000), 7000);
  assert.equal(retryDelayMs('1', 2, 2000), 4000, 'never shorter than the backoff');
  assert.equal(retryDelayMs('soon', 1, 2000), 2000, 'a date or text value is ignored');
});

test('a Promptfoo provider for NVIDIA takes its place in the schedule before every call, and others are left alone', async () => {
  const calls = [];
  const inner = {
    id: () => 'openai:chat:m',
    label: 'm',
    config: { apiBaseUrl: nvidiaApiBaseUrl },
    callApi: async (prompt) => {
      calls.push(`call ${prompt}`);
      return { output: 'ok' };
    },
  };
  const limiter = {
    acquire: async () => {
      calls.push('acquire');
    },
  };
  const wrapped = limitedProvider(inner, limiter);
  assert.equal(wrapped.id(), 'openai:chat:m');
  assert.deepEqual(await wrapped.callApi('a'), { output: 'ok' });
  await wrapped.callApi('b');
  assert.deepEqual(calls, ['acquire', 'call a', 'acquire', 'call b']);
  assert.equal(isNvidiaProvider(inner, nvidiaApiBaseUrl), true);
  assert.equal(isNvidiaProvider({ config: { apiBaseUrl: 'http://127.0.0.1:11434/v1' } }, nvidiaApiBaseUrl), false);
  assert.equal(isNvidiaProvider(null, nvidiaApiBaseUrl), false);
});

test('the image judge uses the shared schedule at the configured rate', () => {
  assert.equal(judgeConfig({ NVIDIA_API_KEY: 'k' }).limiter.interval, 1667);
  assert.equal(judgeConfig({ NVIDIA_API_KEY: 'k', NVIDIA_RPM: '12' }).limiter.interval, 5000);
});

test('the image judge spaces every attempt, honours Retry-After on a 429, and then succeeds', async () => {
  const { state, now, sleep } = clock();
  const dir = await mkdtemp(join(tmpdir(), 'rate-'));
  const image = join(dir, 'x.png');
  await writeFile(image, Buffer.from([137, 80, 78, 71]));
  const claims = [{ id: 'a', text: 'A is drawn.' }];
  const starts = [];
  const replies = [{ status: 429, retryAfter: '7' }, { status: 200 }, { status: 200 }];
  const fetchImpl = async () => {
    starts.push(state.t);
    const next = replies.shift() ?? { status: 200 };
    const content = JSON.stringify({ verdicts: [{ id: 'a', evidence: 'seen', verdict: 'drawn_correctly' }] });
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
    limiter: createRateLimiter({ requestsPerMinute: 36, now, sleep }),
    sleep,
    fetchImpl,
  });
  const result = await instance.callApi('', { vars: { image_path: image, claims } });
  assert.ok(result.output, result.error);
  assert.equal(starts.length, 3, 'one rejected attempt, its retry, and the second run');
  assert.ok(starts[1] - starts[0] >= 7000, 'the retry waits for the 7 seconds Retry-After asked for');
  for (let i = 1; i < starts.length; i++) assert.ok(starts[i] - starts[i - 1] >= 1667, `gap ${i}`);
});

test('this module is the only place that reads the schedule path', () => {
  assert.ok(fileURLToPath(new URL('./rate-limit.mjs', import.meta.url)).endsWith('evals/rate-limit.mjs'));
});
