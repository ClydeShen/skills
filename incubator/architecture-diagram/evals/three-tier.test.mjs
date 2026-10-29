import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { XMLParser } from 'fast-xml-parser';
import { validateDiagram, validateRender } from '../tools/validate.mjs';
import { collect as collectRevision } from './three-tier-2026-10-29/revised/collect.mjs';

const read = name => readFileSync(new URL(name, import.meta.url));
const location = './three-tier-2026-10-29/';
const manifest = JSON.parse(read(location + 'case.json'));
const xml = read(location + 'baseline.drawio').toString();
const render = JSON.parse(read(location + 'baseline.render.json'));
const catalog = JSON.parse(read('../candidate/architecture-diagram/assets/catalog.json'));
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', parseAttributeValue: false });

test('reference-informed revision preserves architecture and saved evidence without claiming a blind quality result', () => {
  const actual=collectRevision();
  assert.deepEqual(actual,JSON.parse(read(location+'revised/verification.json')));
  assert.deepEqual(actual.checks.errors,[]);
  assert.equal(actual.reference_seen,true);
  assert.equal(actual.fresh_context,false);
  assert.equal(actual.owner_score,null);
  assert.equal(actual.comparison.baseline.directed_relationships,actual.comparison.revised.directed_relationships);
});

test('three-tier evidence remains byte-identical to the pre-reference baseline', () => {
  for (const [file, hash] of Object.entries(manifest.frozen_sha256)) {
    assert.equal(createHash('sha256').update(read(location + file)).digest('hex'), hash, file);
  }
  const original = JSON.parse(read(location + 'baseline-verification.json'));
  assert.equal(original.reference_image_seen, false);
  assert.equal(original.source_repository_commit, '96a9ec0c045c0a18803142cdaea97048024e642b');
  assert.equal(original.static_diagnostics.length, 3, 'Do not rewrite the historical result after fixing the checker.');
  assert.equal(manifest.generation_input, 'source.md');
  assert.equal(read(location + manifest.generation_input).toString().includes('60/100'), false);
});

test('three-tier baseline retains source memberships, CIDRs, scaling groups and directed relationships', () => {
  const root = parser.parse(xml).mxfile.diagram.mxGraphModel.root;
  const objects = new Map(root.object.map(o => [o.id, o]));
  for (const [id, parent] of Object.entries(manifest.baseline_checks.memberships)) assert.equal(objects.get(id).mxCell.parent, parent, id);
  for (const [id, cidr] of Object.entries(manifest.baseline_checks.cidrs)) assert.ok(objects.get(id).label.includes(cidr), id);
  for (const [id, members] of Object.entries(manifest.baseline_checks.scaling_groups)) assert.deepEqual(objects.get(id).members.split(' '), members, id);
  const actual = root.mxCell.filter(c => c.edge === '1').map(c => `${c.source}->${c.target}`).sort();
  assert.deepEqual(actual, manifest.baseline_checks.relationships.map(e => e.join('->')).sort());
  assert.match(objects.get('rds-standby').label, /Failover; no application reads/);
  assert.match(root.mxCell.find(c => c.id === 'replication').value, /Synchronous replication/);
});

test('native logical-group headings do not acquire imaginary captions, but actual collisions still fail', () => {
  assert.deepEqual(validateDiagram(xml, catalog), []);
  assert.deepEqual(validateRender(render), []);
  const collided = structuredClone(render);
  collided.metrics.find(n => n.id === 'web-to-app-a').points = [
    {x:470,y:850},{x:850,y:850},{x:850,y:1010},{x:680,y:1010}
  ];
  assert.ok(validateRender(collided).some(e=>e.includes('line crosses text web-asg')));
});

const concise = `<mxfile version="32.6.1"><diagram name="Service request"><mxGraphModel architectureFontSize="12"><root>
<mxCell id="0"/><mxCell id="1" parent="0"/>
<object id="cloud" label="AWS" c4Type="Deployment node"><mxCell vertex="1" parent="1" style="fontSize=16;"><mxGeometry x="0" y="0" width="600" height="400"/></mxCell></object>
<object id="a" label="Web" c4Type="Container" technology="EC2"><mxCell vertex="1" parent="cloud" style="fontSize=16;"><mxGeometry x="80" y="130" width="120" height="70"/></mxCell></object>
<object id="b" label="App" c4Type="Container" technology="EC2"><mxCell vertex="1" parent="cloud" style="fontSize=16;"><mxGeometry x="360" y="130" width="120" height="70"/></mxCell></object>
<mxCell id="call" edge="1" source="a" target="b" parent="1" style="exitX=1;exitY=0.5;entryX=0;entryY=0.5;startArrow=none;endArrow=block;endFill=1;fontSize=16;"><mxGeometry relative="1"/></mxCell>
</root></mxGraphModel></diagram></mxfile>`;

test('concise presentation is allowed without dropping names, technology metadata, direction or domain checks', () => {
  assert.deepEqual(validateDiagram(concise, catalog), [], 'No forced title prefix, legend, C4 tags or forwarding labels.');
  assert.deepEqual(validateDiagram(concise.replace('fontSize=16;', 'fontSize=22;'), catalog), [], 'Readable type hierarchy.');
  assert.ok(validateDiagram(concise.replace('label="Web"', 'label=""'), catalog).some(e=>e.includes('visible element name')));
  assert.ok(validateDiagram(concise.replace('technology="EC2"', ''), catalog).some(e=>e.includes('Missing technology')));
  assert.ok(validateDiagram(concise.replace('fontSize=16;', 'fontSize=11;'), catalog).some(e=>e.includes('minimum')));
  assert.ok(validateDiagram(concise.replace('endArrow=block', 'endArrow=none'), catalog).some(e=>e.includes('single-direction arrow')));
  const escaped = concise.replace('<mxGeometry relative="1"/>', '<mxGeometry relative="1"><Array as="points"><mxPoint x="650" y="165"/><mxPoint x="650" y="220"/><mxPoint x="360" y="220"/></Array></mxGeometry>');
  assert.ok(validateDiagram(escaped, catalog).some(e=>e.includes('Boundary route mismatch')));
  const labeled = concise.replace('id="call" edge', 'id="call" value="Important contract" edge');
  assert.ok(validateDiagram(labeled, catalog).some(e=>e.includes('opaque label on the connector')));
});
