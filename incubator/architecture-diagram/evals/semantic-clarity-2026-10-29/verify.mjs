import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { validateDiagram, validateRender } from '../../tools/validate.mjs';

const read = p => readFileSync(new URL(p, import.meta.url));
const hash = p => createHash('sha256').update(read(p)).digest('hex');
const packageRoot = '../../candidate/architecture-diagram/';
const catalog = JSON.parse(read(packageRoot+'assets/catalog.json'));
const errors = [], cases = {};
for (const [id, source] of [['case-a','../three-tier-2026-10-29/source.md'],['case-b','../three-tier-supporting-2026-10-29/source.md']]) {
  const render = JSON.parse(read(id+'/diagram.render.json'));
  const checks = [...validateDiagram(read(id+'/diagram.drawio').toString(),catalog),...validateRender(render)];
  const texts = render.metrics.filter(n=>n.text);
  for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++) {
    const a=texts[i].text,b=texts[j].text;
    if(a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y) checks.push(`Text overlap: ${texts[i].id}/${texts[j].id}`);
  }
  cases[id] = {source,source_sha256:hash(source),checks,artifacts_sha256:Object.fromEntries(['diagram.drawio','diagram.svg','diagram.png','diagram.render.json','assumptions.md','generation.json','generate.mjs','check.mjs'].map(p=>[p,hash(id+'/'+p)]))};
  errors.push(...checks.map(e=>`${id}: ${e}`));
}
const saved = existsSync(new URL('verification.json',import.meta.url)) ? JSON.parse(read('verification.json')) : null;
if(saved&&JSON.stringify(saved.cases)!==JSON.stringify(cases)) errors.push('Frozen source, artifacts or check results changed.');
const report = {
  date:'2026-10-29',mode:'Two fresh-context host agents with source-only scenario packets; parent semantic feedback before delivery',
  skill_sha256:saved?.skill_sha256||Object.fromEntries(['SKILL.md','references/notation.md','references/drawio.md','scripts/find-icon.mjs','scripts/catalog.mjs','assets/catalog.json'].map(p=>[p,hash(packageRoot+p)])),
  cases,
  limits:['Shared filesystem; procedural input isolation, not an enforced sandbox.','Parent had seen references and supplied semantic/catalog feedback; this is not untouched blind evaluation.','No external model endpoint, independent image readout, deployed-system verification or Desktop test.','Geometry checks do not prove semantic correctness or visual quality; owner comparison remains pending.']
};
if(!saved&&!errors.length) writeFileSync(new URL('verification.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({errors,frozen:!!saved},null,2));
if(errors.length) process.exitCode=1;
