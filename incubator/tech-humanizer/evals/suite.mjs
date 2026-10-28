import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const buildPrompt = require('./prompt.cjs');
const check = require('./assertions.cjs');

// Replay output that satisfies the case's deterministic checks. It verifies the harness and assertions only.
function fixtureFor({ checks, user_profile = null, project_profile = null }) {
  let user = user_profile;
  let project = project_profile;
  const rule = checks.profile_rule;
  if (rule) {
    const entry = { rule: rule.pattern.split('|')[0], confidence: rule.confidence };
    user = rule.scope === 'global'
      ? { global_voice: { preferences: [entry] } }
      : { contexts: { [rule.scope]: { patterns: [entry] } } };
  }
  if (checks.candidate_only) user = { candidates: [{ note: 'one conversation' }] };
  if (checks.project_term) project = { terms: [{ term: checks.project_term }] };
  return {
    text: checks.exact ?? (checks.contains ?? []).join(' '),
    user_profile: user,
    project_profile: project,
  };
}

export async function createSuite({ mode }) {
  const cases = JSON.parse(await readFile(new URL('./cases.json', import.meta.url), 'utf8'));
  const fixtures = new Map(cases.map((test) => [test.description, fixtureFor(test.vars)]));
  return {
    description: 'tech-humanizer: deterministic behavior checks. Rubric-graded quality runs through promptfooconfig.cjs.',
    prompts: [
      { label: 'candidate-with-references', raw: 'candidate-with-references', function: ({ vars }) => JSON.stringify(buildPrompt({ vars })) },
    ],
    providers: mode === 'fixture' ? [async (_prompt, context) => ({ output: JSON.stringify(fixtures.get(context.vars.case_id)) })] : [],
    tests: cases.map((test) => ({
      description: test.description,
      options: { disableVarExpansion: true },
      vars: {
        case_id: test.description,
        ...Object.fromEntries(Object.entries(test.vars).filter(([, value]) => value !== null)),
      },
      assert: [{ type: 'javascript', value: (output, context) => check(output, context) }],
    })),
  };
}
