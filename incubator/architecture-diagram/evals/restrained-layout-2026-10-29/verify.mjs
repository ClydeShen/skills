import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { validateDiagram, validateRender } from '../../tools/validate.mjs';

const read = name => readFileSync(new URL(name, import.meta.url));
const hash = name => createHash('sha256').update(read(name)).digest('hex');
const target = '../../candidate/architecture-diagram/';
const packageFiles = ['SKILL.md','references/notation.md','references/drawio.md','scripts/find-icon.mjs','scripts/catalog.mjs','assets/catalog.json'];
const cases = {
  'case-a': { source: '../three-tier-2026-10-29/source.md', previous: '../three-tier-2026-10-29/revised/diagram.png' },
  'case-b': { source: '../three-tier-supporting-2026-10-29/source.md', previous: '../three-tier-supporting-2026-10-29/first.png' }
};
const catalog = JSON.parse(read(target+'assets/catalog.json'));
const saved = existsSync(new URL('verification.json', import.meta.url)) ? JSON.parse(read('verification.json')) : null;
const errors = [], results = {};
const overlaps = (a,b) => a && b && a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
for (const [id, spec] of Object.entries(cases)) {
  const render = JSON.parse(read(id+'/diagram.render.json'));
  const checks = [...validateDiagram(read(id+'/diagram.drawio').toString(),catalog),...validateRender(render)];
  const texts = render.metrics.filter(n => n.text);
  for (let i=0;i<texts.length;i++) for (let j=i+1;j<texts.length;j++) if (overlaps(texts[i].text,texts[j].text)) checks.push(`Text overlap: ${texts[i].id}/${texts[j].id}`);
  const artifacts = Object.fromEntries(['diagram.drawio','diagram.svg','diagram.png','diagram.render.json','generate.mjs','generation.json'].map(name => [name,hash(id+'/'+name)]));
  results[id] = {
    generator: id === 'case-a' ? '/root/layout_case_a' : '/root/layout_case_b',
    fork_turns: 'none', reference_provided: false,
    source: spec.source, source_sha256: hash(spec.source),
    previous_preview: spec.previous, previous_preview_sha256: hash(spec.previous),
    artifact_sha256: artifacts,
    renderer: { name: render.renderer, drawio: render.drawio_version, commit: render.upstream_commit, browser: render.browser },
    checks
  };
  if (saved && JSON.stringify(results[id]) !== JSON.stringify(saved.cases[id])) checks.push('Frozen case artifacts, source or check results changed.');
  errors.push(...checks.map(e => `${id}: ${e}`));
}
const report = {
  date: '2026-10-29', mode: 'Two fresh-context host-agent generations, one per unchanged text scenario',
  skill_sha256: saved?.skill_sha256 || Object.fromEntries(packageFiles.map(name => [name,hash(target+name)])),
  cases: results,
  limits: [
    'Generators received no parent conversation, old diagram, visual reference or score; each was instructed to read only its source and current package plus neutral authoring tools.',
    'Agents shared filesystem access; input isolation is procedural, not an access-control guarantee.',
    'The parent had seen earlier diagrams and references; its comparison is not independent review.',
    'One generation per case is not a controlled effect estimate, a reliability score or an image-only round trip.',
    'These checks cover declared XML, rendered geometry and text overlaps; they do not prove source fidelity, aesthetics or deployed correctness.',
    'No external model endpoint was called; exact host model parameters were not exposed. Desktop remains unverified.',
    'The second user-supplied reference image was not downloaded or archived.'
  ]
};
if (!saved && !errors.length) writeFileSync(new URL('verification.json', import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({errors,cases:Object.keys(results),frozen:Boolean(saved)},null,2));
if (errors.length) process.exitCode = 1;
