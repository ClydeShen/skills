import { readFile } from 'node:fs/promises';

export function gradeClarification(output, test) {
  let result;
  try { result = JSON.parse(output); } catch { return { pass: false, score: 0, reason: 'Expected JSON.' }; }
  const errors = [];
  if (result?.action !== 'clarify') errors.push('Raise the correctness issues before drawing.');
  const questions = Array.isArray(result?.questions) ? result.questions : [];
  if (!questions.length || questions.some(q => typeof q?.question !== 'string' || !q.question.trim() || typeof q?.recommendation !== 'string' || !q.recommendation.trim())) errors.push('Each clarification needs a question and recommendation.');
  const recommendations = questions.map(q => q?.recommendation || '').join('\n');
  for (const finding of test.findings) if (!new RegExp(finding, 'i').test(recommendations)) errors.push(`Missing expected recommendation: ${finding}`);
  for (const key of ['ignored', 'omitted']) if (!Array.isArray(result?.[key]) || result[key].length < (test[key + '_min'] || 0) || result[key].some(v => typeof v !== 'string' || !v.trim())) errors.push(`Missing ${key} disclosure.`);
  if (result?.diagram) errors.push('Do not supply a diagram before the requested confirmations.');
  return { pass: errors.length === 0, score: errors.length ? 0 : 1, reason: errors.join('; ') || 'Clarification smoke checks passed; inspect semantic quality manually.' };
}

export async function createSuite({ mode }) {
  const cases = JSON.parse(await readFile(new URL('./cases.json', import.meta.url), 'utf8'));
  const tests = await Promise.all(cases.map(async test => {
    const source = await readFile(new URL(test.source, import.meta.url), 'utf8');
    const input = source.split('\n').filter(line => line.startsWith('>')).map(line => line.replace(/^> ?/, '')).join('\n');
    if (!input.trim()) throw new Error(`No source input in ${test.source}`);
    return { description: test.id, options: { disableVarExpansion: true }, vars: { case_id: test.id, input },
      assert: [{ type: 'javascript', value: output => gradeClarification(output, test) }] };
  }));
  return {
    description: 'Pre-candidate clarification smoke checks. No model or diagram rendering in fixture mode.',
    prompts: [{ label: 'requirements-brief', raw: 'requirements-brief', function: ({ vars }) => JSON.stringify([
      { role: 'system', content: 'Prepare one architecture scenario for a draw.io dynamic diagram in a deployment view. Identify contradictions and consequential missing facts. Raise them with recommendations before drawing; do not invent capabilities, private connectivity or user confirmations. Ignore struck-out text and disclose it. Exclude non-architectural business rules, schemas and alarms and disclose omissions. For evaluation only, return JSON with action (clarify or draw), questions (objects with question and recommendation), ignored (strings) and omitted (strings). No tools or file writes are available.' },
      { role: 'user', content: vars.input },
    ]) }],
    providers: mode === 'fixture' ? [async (_prompt, context) => ({ output: JSON.stringify(cases.find(c => c.id === context.vars.case_id).fixture) })] : [],
    tests,
  };
}
