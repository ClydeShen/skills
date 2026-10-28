function parseOutput(output) {
  const value = typeof output === 'string' ? JSON.parse(output) : output;
  if (!value || typeof value.text !== 'string' ||
      !Object.hasOwn(value, 'user_profile') ||
      !Object.hasOwn(value, 'project_profile')) {
    throw new Error('Expected text, user_profile, and project_profile fields');
  }
  for (const name of ['user_profile', 'project_profile']) {
    if (value[name] !== null &&
        (typeof value[name] !== 'object' || Array.isArray(value[name]))) {
      throw new Error(name + ' must be an object or null');
    }
  }
  return value;
}

function check(output, context) {
  let result;
  try {
    result = parseOutput(output);
  } catch (error) {
    return { pass: false, score: 0, reason: error.message };
  }
  const failures = [];
  const expected = context.vars.checks || {};
  for (const term of expected.contains || []) {
    if (!result.text.includes(term)) failures.push('Missing protected text: ' + term);
  }
  for (const expression of expected.forbidden || []) {
    if (new RegExp(expression, 'i').test(result.text)) {
      failures.push('Unexpected output pattern: ' + expression);
    }
  }
  if (expected.exact !== undefined && result.text.trim() !== expected.exact) {
    failures.push('Changed already-clean text');
  }
  if (expected.unchanged_profiles) {
    for (const name of ['user_profile', 'project_profile']) {
      const before = context.vars[name] || null;
      if (JSON.stringify(result[name]) !== JSON.stringify(before)) {
        // Property order is irrelevant; compare parsed structures.
        const { isDeepStrictEqual } = require('node:util');
        if (!isDeepStrictEqual(result[name], before)) {
          failures.push('Unexpected profile update: ' + name);
        }
      }
    }
  }
  if (expected.profile_rule) {
    const profile = result.user_profile || {};
    const global = profile.global_voice || {};
    const scope = expected.profile_rule.scope;
    const entries = scope === 'global'
      ? [...(global.preferences || []), ...(global.patterns || []), ...(global.do_not_change || [])]
      : (profile.contexts?.[scope]?.patterns || []);
    if (!entries.some((entry) =>
      new RegExp(expected.profile_rule.pattern, 'i').test(JSON.stringify(entry)) &&
      (!expected.profile_rule.confidence || entry.confidence === expected.profile_rule.confidence)
    )) failures.push('Expected profile rule missing from ' + scope);
  }
  if (expected.candidate_only) {
    const profile = result.user_profile || {};
    const patterns = [
      ...(profile.global_voice?.patterns || []),
      ...Object.values(profile.contexts || {}).flatMap((value) => value.patterns || []),
    ];
    if (!profile.candidates?.length || patterns.length) {
      failures.push('Expected a candidate without promoted voice patterns');
    }
  }
  if (expected.project_term) {
    if (!result.project_profile?.terms?.some((entry) => entry.term === expected.project_term)) {
      failures.push('Missing project term');
    }
    if (JSON.stringify(result.user_profile).includes(expected.project_term)) {
      failures.push('Project terminology leaked into personal profile');
    }
  }
  return {
    pass: failures.length === 0,
    score: failures.length ? 0 : 1,
    reason: failures.length ? failures.join('; ') : 'All deterministic behavior checks passed',
  };
}

module.exports = check;
module.exports.parseOutput = parseOutput;
