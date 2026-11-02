module.exports = {
  forbidden: [
    { name: 'no-circular', severity: 'error', from: {}, to: { circular: true } },
    {
      name: 'skill-package-is-relocatable',
      comment: 'Runtime files of a skill package move with it, so they cannot import from outside the package.',
      severity: 'error',
      from: { path: '^(incubator/[^/]+/candidate|skills)/([^/]+)/' },
      to: { pathNot: '^(incubator/[^/]+/candidate|skills)/$2/', dependencyTypesNot: ['core'] },
    },
    {
      name: 'harness-is-independent-of-skills',
      comment: 'The delivery harness must work without any particular skill.',
      severity: 'error',
      from: { path: '^harness/' },
      to: { path: '^(incubator|skills)/' },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    exclude: { path: '(^|/)\\.local/|node_modules' },
  },
};
