import { readFileSync, writeFileSync, existsSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { XMLParser } from 'fast-xml-parser';
import { validateDiagram, validateRender } from '../../../tools/validate.mjs';

const read = name => readFileSync(new URL(name, import.meta.url));
const hash = name => createHash('sha256').update(read(name)).digest('hex');
const parser = new XMLParser({ ignoreAttributes:false, attributeNamePrefix:'', parseAttributeValue:false });
const list = value => value == null ? [] : Array.isArray(value) ? value : [value];
function content(name) {
  const model=parser.parse(read(name).toString()).mxfile.diagram.mxGraphModel;
  const nodes=[...list(model.root.mxCell),...list(model.root.object).map(o=>({...o.mxCell,...o,value:o.label}))];
  return {model,nodes};
}
const overlaps=(a,b)=>a&&b&&a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function summary({model,nodes}) {
  return {
    page:[Number(model.pageWidth),Number(model.pageHeight)],
    directed_relationships:nodes.filter(n=>n.edge==='1').length,
    labeled_relationships:nodes.filter(n=>n.edge==='1'&&n.value?.trim()).length,
    deployment_regions:nodes.filter(n=>n.c4Type==='Deployment node').length,
    visible_words:nodes.map(n=>n.value||'').join(' ').replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length,
  };
}
export function collect() {
  const spec=JSON.parse(read('../case.json'));
  const current=content('diagram.drawio'), byId=new Map(current.nodes.map(n=>[n.id,n]));
  const report=JSON.parse(read('diagram.render.json'));
  const catalog=JSON.parse(read('../../../candidate/architecture-diagram/assets/catalog.json'));
  const errors=[...validateDiagram(read('diagram.drawio').toString(),catalog),...validateRender(report)];
  const expected=Object.entries(spec.baseline_checks.memberships).filter(([id])=>id!=='region').map(([id,parent])=>[id,parent==='region'?'aws':parent]);
  for(const [id,parent] of expected) if(byId.get(id)?.parent!==parent) errors.push(`Membership changed: ${id}`);
  for(const [id,cidr] of Object.entries(spec.baseline_checks.cidrs)) if(!byId.get(id)?.value.includes(cidr)) errors.push(`CIDR changed: ${id}`);
  for(const [id,members] of Object.entries(spec.baseline_checks.scaling_groups)) {
    if(byId.get(id)?.members!==members.join(' ')) errors.push(`Scaling membership changed: ${id}`);
    for(const member of members) if(byId.get(member+'-icon')?.iconKey!=='aws4-d2efe117d40ef9f3') errors.push(`Missing multi-instance symbol: ${member}`);
  }
  const actual=current.nodes.filter(n=>n.edge==='1').map(n=>`${n.source}->${n.target}`).sort();
  if(JSON.stringify(actual)!==JSON.stringify(spec.baseline_checks.relationships.map(e=>e.join('->')).sort())) errors.push('Directed relationship set changed.');
  if(!byId.get('replication')?.value.includes('Synchronous replication')) errors.push('Missing replication qualifier.');
  if(!byId.get('rds-standby')?.value.includes('failover only')) errors.push('Missing standby qualifier.');
  const text=report.metrics.filter(n=>n.text);
  for(let i=0;i<text.length;i++)for(let j=i+1;j<text.length;j++) if(overlaps(text[i].text,text[j].text)) errors.push(`Text overlap: ${text[i].id}/${text[j].id}`);
  const metrics=new Map(report.metrics.map(n=>[n.id,n]));
  for(const n of report.metrics.filter(n=>n.id.endsWith('-icon'))) if(overlaps(n.body,metrics.get(n.parent)?.text)) errors.push(`Icon/caption overlap: ${n.id}`);
  if(hash('../source.md')!==spec.frozen_sha256['source.md']) errors.push('Source description changed.');
  for(const [name,digest] of Object.entries(spec.frozen_sha256)) if(hash('../'+name)!==digest) errors.push(`Frozen evidence changed: ${name}`);
  const packageFiles=['SKILL.md','references/notation.md','references/drawio.md','scripts/find-icon.mjs','scripts/catalog.mjs','assets/catalog.json'];
  // Target identity belongs to this frozen run, not to a later active prompt.
  const recorded=existsSync(new URL('verification.json',import.meta.url))?JSON.parse(read('verification.json')):null;
  return {
    date:'2026-10-29',mode:'reference-informed generation in the existing conversation',
    reference_seen:true,fresh_context:false,owner_score:null,
    input_sha256:hash('../source.md'),
    skill_sha256:recorded?.skill_sha256||Object.fromEntries(packageFiles.map(name=>[name,hash('../../../candidate/architecture-diagram/'+name)])),
    artifacts_sha256:Object.fromEntries(['diagram.drawio','diagram.svg','diagram.png','diagram.render.json','generate.mjs'].map(name=>[name,hash(name)])),
    checks:{errors,interpretation:'Bounded artifact checks; not independent semantic or aesthetic judgment.'},
    comparison:{baseline:summary(content('../baseline.drawio')),revised:summary(current),interpretation:'Descriptive counts only; reduced words or area do not establish improved quality.'},
    presentation_changes:['Omit the unspecified Region enclosure; preserve AWS/VPC/AZ/subnet membership.','Use native multi-instance symbols for each EC2 group.','Use filled subnet regions and remove service cards, repeated type tags and unknown-protocol placeholders.'],
    unknowns:'Region, subnet exposure, ELB type/attachments, protocols other than DNS, security configuration and capacities remain unspecified; see the unchanged source for the full scope.',
    limitations:['The generator had seen the reference and previous output.','No fresh image-only readout, independent judge or owner rescore yet.','Browser rendering was checked; offline Desktop and deployed AWS behavior were not.']
  };
}
if(process.argv[1]&&existsSync(process.argv[1])&&realpathSync(process.argv[1])===realpathSync(fileURLToPath(import.meta.url))) {
  const result=collect();
  writeFileSync(new URL('verification.json',import.meta.url),JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify(result,null,2));
  if(result.checks.errors.length) process.exitCode=1;
}
