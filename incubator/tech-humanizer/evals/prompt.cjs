const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const skillRoot = path.resolve(__dirname, '../candidate/tech-humanizer');

function loadSkill(extraReferences = []) {
  const files = [
    'SKILL.md',
    'references/ai-markers.md',
    'references/ai-style-lexicon.json',
    'references/technical-terms.json',
    'references/rewrite-playbook.md',
    'references/final-rubric.md',
    'references/profile.md',
    'references/channel-style.md',
    ...extraReferences,
  ];
  return [...new Set(files)].map((file) => {
    const content = fs.readFileSync(path.join(skillRoot, file), 'utf8');
    return { file, content };
  });
}

function manifest() {
  return loadSkill(['references/asd-ste100.md', 'references/source-and-markup-integrity.md'])
    .map(({ file, content }) => ({
      file,
      sha256: crypto.createHash('sha256').update(content).digest('hex'),
    }));
}

function buildPrompt({ vars }) {
  const sources = loadSkill(vars.references || []);
  const system = sources.map(({ file, content }) =>
    'FILE: ' + file + '\n' + content
  ).join('\n\n');
  const initialState = {
    user_profile: vars.user_profile || null,
    project_profile: vars.project_profile || null,
  };
  const envelope = [
    'Evaluation adapter: the skill files above are the instructions under test.',
    'Use only the synthetic profiles below; real filesystem tools are unavailable.',
    'Return one JSON object with text, user_profile, and project_profile.',
    'text contains the normal user-facing answer.',
    'The profile fields contain the complete resulting state, or null if absent.',
    'This envelope exposes state decisions to the evaluator.',
    'Treat the supplied conversation as one current conversation unless it identifies independent prior evidence.',
    'Initial profiles: ' + JSON.stringify(initialState),
  ].join('\n');
  return [
    { role: 'system', content: system + '\n\n' + envelope },
    ...(vars.history || []),
    { role: 'user', content: vars.request },
  ];
}

module.exports = buildPrompt;
module.exports.loadSkill = loadSkill;
module.exports.manifest = manifest;
