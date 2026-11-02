import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { judgeConfig } from '../../../evals/lib.mjs';
import { createVisionJudgeProvider, gradeJudgement, shuffled } from '../../../evals/vision-judge.mjs';

// The judge sees neutral ids in a shuffled order, so an id never reveals whether a claim is true.
export function withNeutralIds(claims, seed) {
  return shuffled(claims, seed).map((claim, i) => ({ ...claim, id: `c${String(i + 1).padStart(2, '0')}` }));
}

// Synthetic judge answer for fixture mode: every expected claim confirmed, every planted one rejected.
export function fixtureJudgement(claims) {
  const verdicts = claims.map((claim) => {
    const verdict = claim.expect === 'not_drawn' ? 'not_shown' : 'drawn_correctly';
    return { id: claim.id, verdict, votes: { [verdict]: 1 }, evidence: 'synthetic' };
  });
  return JSON.stringify({ runs_ok: 1, runs_total: 1, verdicts, model: 'fixture' });
}

export async function createSuite({ mode, env = {} }) {
  const { cases } = JSON.parse(await readFile(new URL('./image-facts.json', import.meta.url), 'utf8'));
  const tests = cases.map((test, index) => {
    const claims = withNeutralIds(test.claims, index);
    return {
      description: test.id,
      options: { disableVarExpansion: true },
      vars: { case_id: test.id, image_path: fileURLToPath(new URL(test.image, import.meta.url)), claims },
      assert: [{ type: 'javascript', value: (output) => gradeJudgement(output, claims) }],
    };
  });
  return {
    description: 'Architecture diagram image facts: a judge model reads each saved diagram image and confirms or rejects claims. Not agent execution; owner spot checks of the images remain.',
    prompts: [{ label: 'image-facts', raw: 'image-facts', function: () => 'image-facts' }],
    providers: mode === 'model'
      ? [createVisionJudgeProvider(judgeConfig(env))]
      : [async (_prompt, context) => ({ output: fixtureJudgement(context.vars.claims) })],
    tests,
  };
}
