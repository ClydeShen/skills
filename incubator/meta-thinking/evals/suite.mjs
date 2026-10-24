import { readFile } from 'node:fs/promises';
import { gradeDecision, readSkill, renderPrompt } from '../../../evals/lib.mjs';

export async function createSuite({ mode }) {
  const cases = JSON.parse(await readFile(new URL('./cases.json', import.meta.url), 'utf8'));
  const skill = await readSkill(new URL('../candidate/meta-thinking/', import.meta.url));
  const fixtures = new Map(cases.map((test) => [test.id, test.fixture]));
  return {
    description: 'Meta Thinking: proposed decisions, not filesystem actions or end-to-end skill execution.',
    prompts: [
      { label: 'baseline', raw: 'baseline', function: ({ vars }) => renderPrompt('', vars) },
      { label: 'description-only', raw: 'description-only', function: ({ vars }) => renderPrompt(`Available skill: meta-thinking\n${skill.description}\nDecide whether this approach is useful; full instructions are not loaded.`, vars) },
      { label: 'candidate-with-references', raw: 'candidate-with-references', function: ({ vars }) => renderPrompt(skill.full, vars) },
    ],
    providers: mode === 'fixture' ? [async (_prompt, context) => ({ output: JSON.stringify(fixtures.get(context.vars.case_id)) })] : [],
    tests: cases.map((test) => ({
      description: test.id,
      vars: { case_id: test.id, conversation: test.conversation },
      assert: [{ type: 'javascript', value: (output) => gradeDecision(output, test.expected) }],
    })),
  };
}
