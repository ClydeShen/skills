import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const catalog = JSON.parse(readFileSync(new URL('../../../candidate/architecture-diagram/assets/catalog.json', import.meta.url)));
const cells = ['<mxCell id="0"/>', '<mxCell id="1" parent="0"/>'];
const boxes = new Map([['1', { x: 0, y: 0 }]]);
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const attrs = values => Object.entries(values).map(([k, v]) => `${k}="${esc(v)}"`).join(' ');
function vertex(id, label, x, y, w, h, parent, style, metadata = {}) {
  const p = boxes.get(parent);
  boxes.set(id, { x, y, w, h });
  cells.push(`<object ${attrs({ id, label, ...metadata })}><mxCell vertex="1" parent="${parent}" style="${esc(style)}"><mxGeometry x="${x - p.x}" y="${y - p.y}" width="${w}" height="${h}" as="geometry"/></mxCell></object>`);
}
function text(id, label, x, y, w, h, size = 15) {
  vertex(id, label, x, y, w, h, '1', `text;html=1;whiteSpace=wrap;align=left;verticalAlign=middle;fontSize=${size};fontColor=#334155;strokeColor=none;fillColor=none;`);
}
function boundary(id, label, x, y, w, h, parent, fill, dashed = false, titleInset = 14) {
  vertex(id, label, x, y, w, h, parent, `rounded=0;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacingLeft=${titleInset};spacingTop=12;fontSize=16;fontStyle=1;fontColor=#64748b;strokeColor=#b8c2cc;strokeWidth=1;fillColor=${fill};dashed=${dashed ? 1 : 0};container=1;collapsible=0;`, { c4Type: 'Deployment node' });
}
function group(id, label, x, y, w, h, parent) {
  vertex(id, label, x, y, w, h, parent, 'rounded=0;html=1;whiteSpace=wrap;align=left;verticalAlign=top;spacingLeft=12;spacingTop=9;fontSize=15;fontStyle=1;fontColor=#475569;strokeColor=#9aa6b2;strokeWidth=1;fillColor=none;dashed=1;container=1;collapsible=0;', { c4Type: 'Component', technology: 'Logical grouping' });
}
function icon(id, label, key, x, y, parent) {
  const entry = catalog.entries.find(e => e.id === key);
  if (!entry?.usable) throw new Error(`Unavailable exact catalog identity: ${key}`);
  vertex(id, label, x, y, 72, 72, parent, entry.style + 'fontSize=15;labelWidth=156;spacingTop=7;', { c4Type: 'Container', technology: entry.title, vendor: 'AWS', iconKey: entry.id });
}
function box(id, label, x, y, w, h) {
  vertex(id, label, x, y, w, h, '1', 'rounded=0;html=1;whiteSpace=wrap;fontSize=15;fontColor=#334155;strokeColor=#94a3b8;fillColor=#ffffff;align=center;verticalAlign=middle;', { c4Type: 'External software system' });
}
function edge(id, source, target, label, exit, entry, waypoints = [], dashed = false, labelPosition = 0) {
  const style = `edgeStyle=none;rounded=0;html=1;startArrow=none;endArrow=block;endFill=1;strokeColor=${dashed ? '#64748b' : '#475569'};strokeWidth=1.5;fontSize=14;fontColor=#334155;labelBackgroundColor=#ffffff;exitX=${exit[0]};exitY=${exit[1]};entryX=${entry[0]};entryY=${entry[1]};exitPerimeter=0;entryPerimeter=0;dashed=${dashed ? 1 : 0};`;
  cells.push(`<mxCell ${attrs({ id, value: label, edge: '1', parent: '1', source, target, style })}><mxGeometry x="${labelPosition}" y="0" relative="1" as="geometry">${waypoints.length ? `<Array as="points">${waypoints.map(([x, y]) => `<mxPoint x="${x}" y="${y}"/>`).join('')}</Array>` : ''}</mxGeometry></mxCell>`);
}

text('title', 'AWS three-tier web application', 40, 20, 980, 40, 26);
text('subtitle', 'Two illustrated web instances and two app instances · database standby in a second Availability Zone', 40, 65, 950, 30);
boundary('region', 'AWS Region', 260, 220, 1320, 850, '1', '#fbfcfd');
boundary('deployment', 'Application deployment', 285, 370, 1260, 470, 'region', '#ffffff', false, 100);
boundary('az1', 'AZ-1', 470, 410, 840, 390, 'deployment', '#f5f8fb');
boundary('az2', 'AZ-2', 1340, 410, 185, 390, 'deployment', '#f5f8fb');
group('web', 'Web tier · Auto Scaling group', 500, 460, 240, 170, 'az1');
group('app', 'Application tier', 810, 460, 240, 170, 'az1');
box('www', 'www.yourApp.com', 40, 506, 180, 60);
box('media', 'media.yourApp.com<br>Static data', 700, 115, 210, 60);
icon('dns', 'Route 53', 'aws4-bd28863047f4dd8d', 94, 240, '1');
icon('elb', 'ELB', 'aws4-7bc374c95b5f5aaa', 330, 500, 'deployment');
icon('web1', 'Web 1', 'aws4-dcf10dde6f3a8c0e', 520, 510, 'web');
icon('web2', 'Web 2', 'aws4-dcf10dde6f3a8c0e', 650, 510, 'web');
icon('app1', 'App 1', 'aws4-dcf10dde6f3a8c0e', 830, 510, 'app');
icon('app2', 'App 2', 'aws4-dcf10dde6f3a8c0e', 960, 510, 'app');
icon('cache', 'ElastiCache', 'aws4-5903a64a34810675', 894, 690, 'az1');
icon('primary', 'RDS primary', 'aws4-26cfbc9df4b4ec81', 1140, 500, 'az1');
icon('standby', 'RDS standby', 'aws4-26cfbc9df4b4ec81', 1400, 500, 'az2');
icon('s3', 'S3 · static objects', 'aws4-7d0e996c99148efe', 1390, 240, 'region');
icon('cdn', 'CloudFront', 'aws4-e51c75c7037f2414', 1050, 109, '1');
icon('dynamo', 'DynamoDB table', 'aws4-35d1821eb6a19e22', 514, 940, 'region');
icon('ses', 'SES<br>Email delivery', 'aws4-2573a358c515958e', 794, 940, 'region');
icon('sns', 'SNS<br>Email notifications', 'aws4-9758db46c424c589', 1074, 940, 'region');
icon('alarm', 'CloudWatch Alarms', 'aws4-8d2e34c3511b5f4a', 1354, 940, 'region');

edge('dns-lookup', 'www', 'dns', 'DNS lookup', [0.5, 0], [0, 0.5], [[130, 380], [30, 380], [30, 276]], true, -0.68);
edge('dns-ingress', 'dns', 'elb', 'Ingress record', [1, 0.5], [0.5, 0], [[366, 276]], true, 0.3);
edge('request', 'www', 'elb', '', [1, 0.5], [0, 0.5]);
edge('web-requests', 'elb', 'web', '', [1, 0.5], [0, 76 / 170]);
edge('implied', 'web', 'app', 'Implied', [1, 0.5], [0, 0.5], [], true);
edge('app-db', 'app', 'primary', '', [1, 76 / 170], [0, 0.5]);
edge('app-cache', 'app', 'cache', '', [0.5, 1], [0.5, 0]);
edge('cache-db', 'cache', 'primary', '†', [1, 0.5], [0, 0.85], [[1090, 726], [1090, 561.2]], true, -0.55);
edge('replication', 'primary', 'standby', 'Replication', [1, 0.5], [0, 0.5], [], true, -0.54);
edge('web-s3', 'web', 's3', 'Object access', [0.5, 0], [0, 0.5], [[620, 350], [1290, 350], [1290, 276]], true, 0.1);
edge('standby-s3', 'standby', 's3', '†', [1, 0.5], [1, 0.5], [[1505, 536], [1505, 276]], true, 0.1);
edge('origin', 'cdn', 's3', 'Fetch origin', [1, 0.5], [0.5, 0], [[1426, 145]], true, -0.2);
edge('delivery', 'cdn', 'media', 'Static content', [0, 0.5], [1, 0.5]);
edge('nosql-out', 'deployment', 'dynamo', 'Read / write', [(540 - 285) / 1260, 0.96], [26 / 72, 0], [], true);
edge('nosql-in', 'dynamo', 'deployment', '', [1, 0.5], [(610 - 285) / 1260, 0.96], [[610, 976]], true);
edge('email', 'deployment', 'ses', 'Email', [(830 - 285) / 1260, 0.96], [0.5, 0], [], true);
edge('notify', 'deployment', 'sns', 'Publish', [(1110 - 285) / 1260, 0.96], [0.5, 0], [], true);
edge('monitor', 'deployment', 'alarm', 'Monitor', [(1390 - 285) / 1260, 0.96], [0.5, 0], [], true);
text('support-scope', 'Supporting-service callers are identified only at the deployment boundary.', 820, 380, 680, 24, 14);
text('scope1', 'Dashed paths: DNS, auxiliary interactions, replication and the implied Web → App hop. † Cache → RDS operation and standby → S3 purpose are unstated.', 40, 1090, 1530, 28, 14);
text('scope2', 'Region name, network/security layout, protocols, scaling settings, cache/DB engines and failover details are not specified. The source does not establish full application Multi-AZ availability.', 40, 1125, 1530, 38, 14);

const xml = `<mxfile host="app.diagrams.net" version="32.6.1"><diagram id="aws-three-tier" name="AWS three-tier application"><mxGraphModel dx="1620" dy="1180" page="1" pageScale="1" pageWidth="1620" pageHeight="1180" architectureFontSize="14" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1"><root>${cells.join('\n')}</root></mxGraphModel></diagram></mxfile>\n`;
writeFileSync(fileURLToPath(new URL('diagram.drawio', import.meta.url)), xml);
