const cases = require('./cases.json');

module.exports = {
  description: 'tech-humanizer: rewrite quality and profile-state decisions',
  prompts: ['file://prompt.cjs'],
  providers: [{
    id: process.env.EVAL_TARGET_PROVIDER || 'openai:chat:configure-target',
    config: {
      ...(process.env.EVAL_API_BASE_URL ? { apiBaseUrl: process.env.EVAL_API_BASE_URL } : {}),
    },
  }],
  defaultTest: {
    options: {
      disableVarExpansion: true,
      provider: {
        id: process.env.EVAL_GRADER_PROVIDER || 'openai:chat:configure-grader',
        config: {
          ...(process.env.EVAL_GRADER_API_BASE_URL
            ? { apiBaseUrl: process.env.EVAL_GRADER_API_BASE_URL } : {}),
        },
      },
    },
    assert: [
      { type: 'javascript', value: 'file://assertions.cjs', metric: 'behavior' },
      {
        type: 'llm-rubric',
        metric: 'quality',
        value: [
          'Evaluate the candidate JSON text and profile state against this case:',
          '{{rubric}}',
          'Use the request and initial profiles below as the evidence boundary.',
          'Request: {{request}}',
          'Initial user profile: {{user_profile | dump}}',
          'Initial project profile: {{project_profile | dump}}',
          'Conversation: {{history | dump}}',
          'Pass only if meaning, terms, uncertainty, and requested context remain correct.',
          'Judge naturalness and voice by the supplied evidence, without requiring one exact rewrite.',
        ].join('\n'),
      },
    ],
  },
  tests: cases.map((entry) => ({
    ...entry,
    vars: Object.fromEntries(Object.entries(entry.vars).filter(([, value]) => value !== null)),
  })),
};
