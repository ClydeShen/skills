// NVIDIA's hosted trial endpoints answer HTTP 429 above about 40 requests per minute, and also to a quick burst.
// A fixed gap between request starts keeps both the average and the burst below that limit.
// See research/harness/prompt-evaluation/0001-nvidia-trial-limit-is-about-forty-requests-per-minute.md.

// Four below the reported limit of 40, because other sessions may share the same key.
export const nvidiaRequestsPerMinute = 36;

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function requestsPerMinute(env) {
  const raw = env.NVIDIA_RPM;
  if (raw === undefined || raw === '') return nvidiaRequestsPerMinute;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > 1000)
    throw new Error('NVIDIA_RPM must be an integer from 1 to 1000.');
  return value;
}

export const minIntervalMs = (rpm) => Math.ceil(60000 / rpm);

// Callers reserve their start time at once, so concurrent callers queue in order.
export function createRateLimiter({ requestsPerMinute: rpm, now = Date.now, sleep = pause }) {
  const interval = minIntervalMs(rpm);
  let next = 0;
  return {
    interval,
    async acquire() {
      const start = Math.max(now(), next);
      next = start + interval;
      const wait = start - now();
      if (wait > 0) await sleep(wait);
    },
  };
}

// A 429 recovered within seven seconds in a measured burst, so the first retry waits two and the third eight.
// A Retry-After header, when the service sends one, sets the minimum.
export function retryDelayMs(retryAfter, retry, backoffMs) {
  const seconds =
    retryAfter === null || retryAfter === undefined || retryAfter === '' ? Number.NaN : Number(retryAfter);
  const asked = Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : 0;
  return Math.max(asked, backoffMs * 2 ** (retry - 1));
}

// The gap Promptfoo leaves after each uncached call to the NVIDIA endpoint; other endpoints are not limited.
export function providerDelayMs(provider, env, nvidiaBaseUrl) {
  return provider?.config?.apiBaseUrl === nvidiaBaseUrl ? minIntervalMs(requestsPerMinute(env)) : 0;
}
