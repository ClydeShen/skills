import { readFile } from 'node:fs/promises';

// Image judge: reads one image and checks a list of claims against what is visible.
// Claims are { id, text, key?, critical?: boolean, expect?: 'drawn' | 'not_drawn' }; id is what the judge sees, key labels reports. A 'not_drawn' claim is a
// planted false claim; the judge must never confirm it. Labels stay on the grading side, outside prompts.
export const verdictValues = ['drawn_correctly', 'drawn_incorrectly', 'not_shown', 'unclear'];

const instruction =
  'You are checking an architecture diagram image. Use only what is visible in the image. For each claim, first quote the visible evidence, then give one verdict: "drawn_correctly" (the image clearly shows it), "drawn_incorrectly" (the image shows something that contradicts it), "not_shown" (the image does not show it), or "unclear". Copy each bracketed claim id exactly. Respond with JSON only.';

export const verdictSchema = {
  type: 'object',
  required: ['verdicts'],
  additionalProperties: false,
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'evidence', 'verdict'],
        additionalProperties: false,
        properties: {
          id: { type: 'string' },
          evidence: { type: 'string' },
          verdict: { type: 'string', enum: verdictValues },
        },
      },
    },
  },
};

// Deterministic shuffle so true and false claims are not grouped and each run sees another order.
export function shuffled(items, seed) {
  const out = [...items];
  let state = ((seed + 1) * 2654435761) >>> 0;
  for (let i = out.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function buildJudgeMessages({ image, claims, seed = 0 }) {
  const order = shuffled(claims, seed);
  const text = order.map((claim, i) => `${i + 1}. [${claim.id}] ${claim.text}`).join('\n');
  return {
    order,
    messages: [
      { role: 'system', content: instruction },
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: image, detail: 'high' } },
          { type: 'text', text },
        ],
      },
    ],
  };
}

// Returns Map id -> { verdict, evidence }, or null when the output holds no usable verdict list.
export function parseVerdicts(output, order) {
  let data = output;
  if (typeof data === 'string') {
    const start = data.indexOf('{'),
      end = data.lastIndexOf('}');
    const arrayStart = data.indexOf('['),
      arrayEnd = data.lastIndexOf(']');
    const slices = [];
    if (start !== -1 && end > start) slices.push(data.slice(start, end + 1));
    if (arrayStart !== -1 && arrayEnd > arrayStart) slices.push(data.slice(arrayStart, arrayEnd + 1));
    data = undefined;
    for (const slice of slices) {
      try {
        data = JSON.parse(slice);
        break;
      } catch {
        /* try the next slice */
      }
    }
  }
  const list = Array.isArray(data) ? data : data?.verdicts;
  if (!Array.isArray(list)) return null;
  const known = new Set(order.map((claim) => claim.id));
  const verdicts = new Map();
  for (const entry of list) {
    let id = String(entry?.id ?? '')
      .trim()
      .replace(/^\[|\]$/g, '')
      .trim();
    // Some models answer with the list number instead of the bracketed id.
    if (/^\d+$/.test(id) && !known.has(id)) id = order[Number(id) - 1]?.id ?? id;
    if (!known.has(id) || verdicts.has(id)) continue;
    const verdict = verdictValues.includes(entry.verdict) ? entry.verdict : 'unclear';
    verdicts.set(id, { verdict, evidence: String(entry.evidence ?? '') });
  }
  return verdicts.size ? verdicts : null;
}

// Combines the runs that produced a usable answer. A claim missing from a run counts as 'unclear' there.
export function aggregateRuns(runs, claims) {
  const usable = runs.filter(Boolean);
  const verdicts = claims.map((claim) => {
    const votes = {};
    let evidence = '';
    for (const run of usable) {
      const entry = run.get(claim.id);
      const verdict = entry?.verdict ?? 'unclear';
      votes[verdict] = (votes[verdict] ?? 0) + 1;
      if (entry?.evidence && !evidence) evidence = entry.evidence;
    }
    const ranked = Object.entries(votes).sort((a, b) => b[1] - a[1]);
    const majority = ranked.length && (ranked.length === 1 || ranked[0][1] > ranked[1][1]) ? ranked[0][0] : 'unclear';
    return { id: claim.id, verdict: majority, votes, evidence };
  });
  return { runs_ok: usable.length, runs_total: runs.length, verdicts };
}

// Both kinds of claim are decided by a strict majority of runs, so one noisy run cannot fail or pass a case.
// A planted false claim that only some runs confirmed is reported as a flag.
export function gradeJudgement(output, claims) {
  let judgement;
  try {
    judgement = typeof output === 'string' ? JSON.parse(output) : output;
  } catch {
    judgement = null;
  }
  if (!judgement?.verdicts || !judgement.runs_ok) return { pass: false, score: 0, reason: 'No usable judge verdicts.' };
  const byId = new Map(judgement.verdicts.map((v) => [v.id, v]));
  const failures = [];
  const flags = [];
  let checked = 0;
  for (const claim of claims) {
    const expect = claim.expect ?? 'drawn';
    const result = byId.get(claim.id);
    const confirmed = result?.votes?.drawn_correctly ?? 0;
    if (expect === 'not_drawn') {
      checked++;
      if (confirmed * 2 > judgement.runs_ok) failures.push(`false claim confirmed: ${claim.key ?? claim.id}`);
      else if (confirmed) flags.push(`${claim.key ?? claim.id} confirmed in ${confirmed} of ${judgement.runs_ok} runs`);
    } else if (claim.critical !== false) {
      checked++;
      if (confirmed * 2 <= judgement.runs_ok)
        failures.push(`critical claim not confirmed: ${claim.key ?? claim.id} (${result?.verdict ?? 'missing'})`);
    }
  }
  return {
    pass: failures.length === 0,
    score: checked ? (checked - failures.length) / checked : 0,
    reason:
      failures.join('; ') ||
      `All ${checked} checked claims behaved as expected over ${judgement.runs_ok} run(s)${flags.length ? `; flagged: ${flags.join(', ')}` : ''}; judge evidence still needs spot checks.`,
  };
}

const retryable = new Set([408, 425, 429, 500, 502, 503, 504]);
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Promptfoo custom provider. Vars: image_path (file) and claims (array). Output: aggregated JSON string.
// Messages and errors never include the request headers, so the API key cannot reach a report.
export function createVisionJudgeProvider({
  model,
  apiBaseUrl,
  apiKey,
  temperature = 0.6,
  maxTokens = 4096,
  extraBody = {},
  runs = 3,
  retries = 3,
  backoffMs = 2000,
  timeoutMs = 300000,
  fetchImpl = fetch,
  sleep = pause,
}) {
  async function request(messages) {
    let lastError = 'request failed';
    for (let attempt = 0; attempt <= retries; attempt++) {
      if (attempt) await sleep(backoffMs * 2 ** (attempt - 1));
      try {
        const response = await fetchImpl(`${apiBaseUrl}/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          signal: AbortSignal.timeout(timeoutMs),
          body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens: maxTokens,
            stream: false,
            response_format: { type: 'json_schema', json_schema: { name: 'verdicts', schema: verdictSchema } },
            ...extraBody,
          }),
        });
        if (response.ok) {
          const body = await response.json();
          return { content: body.choices?.[0]?.message?.content ?? null, usage: body.usage };
        }
        lastError = `HTTP ${response.status}`;
        if (!retryable.has(response.status)) break;
      } catch (error) {
        lastError = error?.name === 'TimeoutError' ? 'timeout' : 'network error';
      }
    }
    throw new Error(lastError);
  }

  return {
    id: () => `vision-judge:${model}`,
    async callApi(_prompt, context) {
      const { image_path: imagePath, claims } = context.vars;
      const image = `data:image/png;base64,${(await readFile(imagePath)).toString('base64')}`;
      const results = [];
      const errors = [];
      let tokens = 0;
      for (let run = 0; run < runs; run++) {
        const { order, messages } = buildJudgeMessages({ image, claims, seed: run });
        try {
          const { content, usage } = await request(messages);
          tokens += usage?.total_tokens ?? 0;
          results.push(parseVerdicts(content ?? '', order));
        } catch (error) {
          errors.push(error.message);
          results.push(null);
        }
      }
      const aggregate = aggregateRuns(results, claims);
      if (!aggregate.runs_ok)
        return {
          error: `Judge produced no usable answer (${[...new Set(errors)].join(', ') || 'unparsable output'}).`,
        };
      return { output: JSON.stringify({ ...aggregate, model }), tokenUsage: { total: tokens } };
    },
  };
}
