import { mkdir, open, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Every request to NVIDIA's hosted trial endpoints, from any skill, any suite and any process on this machine, takes
// its start time from one shared schedule. The endpoint answers HTTP 429 above about 40 requests per minute and to
// a quick burst, so a fixed gap between request starts bounds both.
// See research/harness/prompt-evaluation/0001-nvidia-trial-limit-is-about-forty-requests-per-minute.md.

// The most the endpoint accepts. A setting can lower the rate, never raise it above this.
export const nvidiaRequestLimit = 40;
// Four below the limit, because other sessions may share the same key.
export const nvidiaRequestsPerMinute = 36;

const root = fileURLToPath(new URL('../', import.meta.url));
export const sharedScheduleFile = path.join(root, 'evals/.local/nvidia-rate.json');

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function requestsPerMinute(env) {
  const raw = env.NVIDIA_RPM;
  if (raw === undefined || raw === '') return nvidiaRequestsPerMinute;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > nvidiaRequestLimit)
    throw new Error(`NVIDIA_RPM must be an integer from 1 to ${nvidiaRequestLimit}; the endpoint rejects more.`);
  return value;
}

export const minIntervalMs = (rpm) => Math.ceil(60000 / rpm);

// A process that dies holding the lock must not block the others for long.
const staleLockMs = 10000;

async function withLock(lockFile, { now, sleep }, work) {
  await mkdir(path.dirname(lockFile), { recursive: true });
  for (;;) {
    let handle;
    try {
      handle = await open(lockFile, 'wx');
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      const held = await stat(lockFile).catch(() => null);
      if (held && Date.now() - held.mtimeMs > staleLockMs) await rm(lockFile, { force: true });
      else await sleep(Math.min(25, 1 + Math.floor(now() % 20)));
      continue;
    }
    try {
      return await work();
    } finally {
      await handle.close();
      await rm(lockFile, { force: true });
    }
  }
}

// Callers reserve a start time at once, so concurrent callers queue in order. With a schedule file the reservation
// is shared by every process on the machine; without one it is private to this limiter, which tests use.
export function createRateLimiter({ requestsPerMinute: rpm, file, now = Date.now, sleep = pause }) {
  const interval = minIntervalMs(rpm);
  let next = 0;
  const reserve = async () => {
    const start = Math.max(now(), next);
    next = start + interval;
    return start;
  };
  const reserveShared = () =>
    withLock(`${file}.lock`, { now, sleep }, async () => {
      const stored = Number(JSON.parse(await readFile(file, 'utf8').catch(() => '{}')).next) || 0;
      const start = Math.max(now(), stored);
      await writeFile(file, JSON.stringify({ next: start + interval }));
      return start;
    });
  return {
    interval,
    async acquire() {
      const start = await (file ? reserveShared() : reserve());
      const wait = start - now();
      if (wait > 0) await sleep(wait);
    },
  };
}

// The limiter every NVIDIA request uses: the configured rate, one schedule for the whole machine.
export const sharedNvidiaLimiter = (env) =>
  createRateLimiter({ requestsPerMinute: requestsPerMinute(env), file: sharedScheduleFile });

// A 429 recovered within seven seconds in a measured burst, so the first retry waits two and the third eight.
// A Retry-After header, when the service sends one, sets the minimum.
export function retryDelayMs(retryAfter, retry, backoffMs) {
  const seconds =
    retryAfter === null || retryAfter === undefined || retryAfter === '' ? Number.NaN : Number(retryAfter);
  const asked = Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : 0;
  return Math.max(asked, backoffMs * 2 ** (retry - 1));
}

// A Promptfoo provider that takes its place in the shared schedule before each request.
// A cached response is not a request, but it cannot be told from one before the call, so it takes a place too.
export function limitedProvider(inner, limiter) {
  return {
    id: () => inner.id(),
    label: inner.label,
    config: inner.config,
    async callApi(prompt, context, options) {
      await limiter.acquire();
      return inner.callApi(prompt, context, options);
    },
  };
}

export const isNvidiaProvider = (provider, nvidiaBaseUrl) => provider?.config?.apiBaseUrl === nvidiaBaseUrl;
