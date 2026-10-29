import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { XMLParser } from 'fast-xml-parser';
import { validateDiagram, validateRender } from '../../tools/validate.mjs';

const read = name => readFileSync(new URL(name, import.meta.url));
const hash = name => createHash('sha256').update(read(name)).digest('hex');
const list = value => value == null ? [] : Array.isArray(value) ? value : [value];
const xml = read('first.drawio').toString();
const root = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', parseAttributeValue: false }).parse(xml).mxfile.diagram.mxGraphModel.root;
const nodes = [...list(root.mxCell), ...list(root.object).map(o => ({ ...o.mxCell, ...o, value: o.label }))];
const byId = new Map(nodes.map(n => [n.id, n]));
const render = JSON.parse(read('first.render.json'));
const errors = [...validateDiagram(xml, JSON.parse(read('../../candidate/architecture-diagram/assets/catalog.json'))), ...validateRender(render)];
const expectedParents = {
  deployment: 'region', 'az-1': 'deployment', 'az-2': 'deployment',
  'web-asg': 'az-1', 'app-tier': 'az-1', 'web-1': 'web-asg', 'web-2': 'web-asg',
  'app-1': 'app-tier', 'app-2': 'app-tier', cache: 'az-1', primary: 'az-1', standby: 'az-2',
  s3: 'region', elb: 'region', dynamodb: 'region', ses: 'region', sns: 'region', alarms: 'region',
  dns: '1', users: '1', cloudfront: '1'
};
for (const [id, parent] of Object.entries(expectedParents)) if (byId.get(id)?.parent !== parent) errors.push(`Membership changed: ${id}`);
const expectedRelationships = [
  ['users','dns'], ['users','elb'], ['elb','web-asg'], ['web-asg','s3'],
  ['app-tier','cache'], ['app-tier','primary'], ['cache','primary'], ['primary','standby'],
  ['standby','s3'], ['cloudfront','s3'], ['port-ddb-out','dynamodb'], ['dynamodb','port-ddb-in'],
  ['port-ses','ses'], ['port-sns','sns'], ['port-alarms','alarms']
].map(e => e.join('->')).sort();
const actualRelationships = nodes.filter(n => n.edge === '1').map(n => `${n.source}->${n.target}`).sort();
if (JSON.stringify(actualRelationships) !== JSON.stringify(expectedRelationships)) errors.push('Relationship set changed.');
for (const id of ['web-asg','app-tier']) if (byId.get(id)?.members !== (id === 'web-asg' ? 'web-1 web-2' : 'app-1 app-2')) errors.push(`Instance group changed: ${id}`);
for (const id of ['web-1','web-2','app-1','app-2']) if (byId.get(id+'-icon')?.iconKey !== 'aws4-ddec86e91fa0a9c2') errors.push(`Single-instance symbol missing: ${id}`);
for (const id of ['port-ddb-out','port-ddb-in','port-ses','port-sns','port-alarms']) if (byId.get(id)?.boundaryPortFor !== 'deployment' || byId.get(id)?.c4Type) errors.push(`Boundary endpoint became a service: ${id}`);
if (!byId.get('cache-database')?.value.includes('Relationship only') || !byId.get('standby-s3')?.value.includes('unspecified')) errors.push('Unresolved connection qualifier missing.');
const overlaps = (a,b) => a && b && a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
const texts = render.metrics.filter(n => n.text);
for (let i=0;i<texts.length;i++) for (let j=i+1;j<texts.length;j++) if (overlaps(texts[i].text,texts[j].text)) errors.push(`Text overlap: ${texts[i].id}/${texts[j].id}`);
const metrics = new Map(render.metrics.map(n => [n.id,n]));
for (const n of render.metrics.filter(n => n.id.endsWith('-icon'))) if (overlaps(n.body,metrics.get(n.parent)?.text)) errors.push(`Icon/caption overlap: ${n.id}`);
const files = ['source.md','generate.mjs','first.drawio','first.svg','first.png','first.render.json'];
const packageFiles = ['SKILL.md','references/notation.md','references/drawio.md','scripts/find-icon.mjs','scripts/catalog.mjs','assets/catalog.json'];
const previous = existsSync(new URL('verification.json', import.meta.url)) ? JSON.parse(read('verification.json')) : null;
const digests = Object.fromEntries(files.map(name => [name,hash(name)]));
if (previous) for (const [name,digest] of Object.entries(previous.artifact_sha256)) if (digests[name] !== digest) errors.push(`Frozen first-delivery artifact changed: ${name}`);
const report = {
  date: '2026-10-29', mode: 'Text-only first delivery in the existing host-agent conversation',
  case_reference_seen: false, previous_case_reference_seen: true, fresh_context: false,
  owner_score: null, independent_semantic_review: false,
  source_normalization: 'Heading levels, list markers and table spacing only; architecture wording retained.',
  skill_sha256: previous?.skill_sha256 || Object.fromEntries(packageFiles.map(name => [name,hash('../../candidate/architecture-diagram/'+name)])),
  artifact_sha256: digests,
  renderer: { name: render.renderer, version: render.drawio_version, upstream_commit: render.upstream_commit, browser: render.browser },
  checks: { errors, expected_relationships: expectedRelationships, interpretation: 'Bounded XML, source assertions, rendered routes and text geometry; not independent architectural or aesthetic judgment.' },
  interpretations: [
    'DNS resolves ingress; user payload travels directly to ELB.',
    'CloudFront points to S3 as the origin request, not the reverse content-return direction; media domain remains in its caption.',
    'The deployment outline and its small ports retain unspecified callers without creating a network or runtime component.',
    'S3 and supporting services are regional and outside AZ boundaries; no VPC/subnets are invented.',
    'Cache-to-RDS and standby-side-to-S3 remain explicitly unresolved source relationships, not asserted native service operations.',
    'Replication mode, automatic failover settings, full-application Multi-AZ availability and App Auto Scaling are not asserted.'
  ],
  limitations: ['The prior case and its visual reference remain in context.','No reference image for this case was supplied or retrieved.','No independent image-only readout or original-image comparison has run.','No external model endpoint was called; exact host model parameters were not exposed.','Browser rendering does not verify draw.io Desktop or real deployment correctness.']
};
if (!previous && !errors.length) writeFileSync(new URL('verification.json', import.meta.url), JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({ errors, artifact_sha256: digests, frozen: Boolean(previous) },null,2));
if (errors.length) process.exitCode = 1;
