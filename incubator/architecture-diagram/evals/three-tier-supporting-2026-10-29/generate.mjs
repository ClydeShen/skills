import { readFileSync, writeFileSync } from 'node:fs';

// Text-only first delivery for this case; the previous case remains in context.
const catalog = JSON.parse(readFileSync(new URL('../../candidate/architecture-diagram/assets/catalog.json', import.meta.url)));
const cells = ['<mxCell id="0"/>', '<mxCell id="1" parent="0"/>'];
const boxes = new Map([['1', { x: 0, y: 0 }]]);
const escape = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const base = 'fontFamily=Helvetica;fontSize=16;fontColor=#263445;';
function entry(id) {
  const item = catalog.entries.find(e => e.id === id && e.usable && e.vendor === 'AWS');
  if (!item) throw new Error(`No exact AWS catalog match: ${id}`);
  return item;
}
function node(id, parent, x, y, w, h, label, style = '', metadata = {}) {
  const origin = boxes.get(parent);
  boxes.set(id, { x, y, w, h });
  const attributes = Object.entries({ id, label, ...metadata }).map(([k, v]) => `${k}="${escape(v)}"`).join(' ');
  cells.push(`<object ${attributes}><mxCell vertex="1" parent="${parent}" style="${escape(base + style)}"><mxGeometry x="${x - origin.x}" y="${y - origin.y}" width="${w}" height="${h}" as="geometry"/></mxCell></object>`);
}
function text(id, parent, x, y, w, h, label, style = '') {
  node(id, parent, x, y, w, h, label, 'text;html=1;whiteSpace=wrap;fillColor=none;strokeColor=none;verticalAlign=middle;align=left;' + style);
}
function boundary(id, parent, x, y, w, h, label, iconId = null, style = '', type = 'Deployment node') {
  const e = iconId ? entry(iconId) : null;
  node(id, parent, x, y, w, h, label,
    (e?.style || 'html=1;whiteSpace=wrap;fillColor=none;strokeColor=#CBD5E1;') +
    'fontSize=16;fontColor=#263445;fontStyle=1;align=left;verticalAlign=top;spacingTop=10;spacingLeft=14;' + style,
    { c4Type: type, ...(e ? { iconKey: e.id, vendor: 'AWS' } : {}) });
}
function symbol(id, parent, cx, y, label, iconId, { height = 104, width = 160, type = 'Container', technology = 'AWS managed service' } = {}) {
  node(id, parent, cx - width / 2, y, width, height, label,
    'html=1;whiteSpace=wrap;fillColor=none;strokeColor=none;align=center;verticalAlign=bottom;spacingBottom=2;',
    { c4Type: type, technology });
  const e = entry(iconId);
  node(id + '-icon', id, cx - 36, y, 72, 72, '', e.style + 'fontSize=16;', { iconKey: e.id, vendor: 'AWS' });
}
function edge(id, source, target, exit, enter, points = [], label = '', { at = 0, width = 180, dashed = false, relation = 'interaction' } = {}) {
  const style = base + `edgeStyle=none;rounded=0;html=1;whiteSpace=wrap;labelWidth=${width};labelBackgroundColor=#ffffff;startArrow=none;endArrow=block;endFill=1;endSize=7;strokeWidth=1.3;strokeColor=#5D6873;dashed=${dashed ? 1 : 0};exitX=${exit[0]};exitY=${exit[1]};exitPerimeter=0;entryX=${enter[0]};entryY=${enter[1]};entryPerimeter=0;`;
  const via = points.length ? `<Array as="points">${points.map(([x, y]) => `<mxPoint x="${x}" y="${y}"/>`).join('')}</Array>` : '';
  cells.push(`<mxCell id="${id}" relationKind="${relation}" edge="1" parent="1" source="${source}" target="${target}" value="${escape(label)}" style="${style}"><mxGeometry x="${at}" y="0" relative="1" as="geometry">${via}</mxGeometry></mxCell>`);
}

text('title', '1', 40, 20, 1400, 36, 'AWS web application · cache, standby and supporting services', 'fontSize=24;fontStyle=1;');
boundary('region', '1', 40, 250, 1420, 920, 'AWS Region', 'aws4-b7c9d5f1f6fc7588', 'spacingLeft=38;');
boundary('deployment', 'region', 70, 410, 940, 600, 'Application deployment', null, 'strokeColor=#A8B0B8;fillColor=#FAFBFC;', 'Software system boundary');
boundary('az-1', 'deployment', 100, 450, 570, 520, 'AZ-1', 'aws4-29f0ed3584241a7b');
boundary('az-2', 'deployment', 720, 450, 250, 520, 'AZ-2', 'aws4-29f0ed3584241a7b');
const asg = entry('aws4-96f425eb6ab3902b');
node('web-asg', 'az-1', 300, 500, 310, 170, 'Web servers · Auto Scaling', asg.style + 'fontSize=16;labelWidth=290;',
  { iconKey: asg.id, vendor: 'AWS', groupingKind: 'Auto Scaling membership', members: 'web-1 web-2' });
node('app-tier', 'az-1', 300, 680, 310, 140, 'Application servers',
  'html=1;whiteSpace=wrap;fillColor=#EDF2F7;strokeColor=none;align=left;verticalAlign=top;spacingTop=10;spacingLeft=14;fontStyle=1;',
  { groupingKind: 'Application tier; no scaling group specified', members: 'app-1 app-2' });

symbol('users', '1', 450, 90, 'www.yourApp.com', 'aws4-b0455dcf7d6ab7f3', { type: 'Person', technology: 'Application users', width: 220 });
symbol('dns', '1', 160, 90, 'Route 53 hosted zone', 'aws4-bd28863047f4dd8d', { technology: 'Amazon Route 53', width: 220 });
symbol('cloudfront', '1', 850, 90, 'CloudFront · static content<br>media.yourApp.com', 'aws4-e51c75c7037f2414', { height: 124, width: 260, technology: 'Amazon CloudFront' });
symbol('elb', 'region', 450, 300, 'ELB', 'aws4-7bc374c95b5f5aaa', { technology: 'Elastic Load Balancing; type and AZ attachments unspecified' });
symbol('s3', 'region', 850, 300, 'S3 bucket', 'aws4-7d0e996c99148efe', { technology: 'Amazon S3 regional storage' });
for (const [number, cx] of [[1, 380], [2, 530]]) {
  symbol(`web-${number}`, 'web-asg', cx, 560, 'EC2', 'aws4-ddec86e91fa0a9c2', { width: 100, height: 100, technology: 'Amazon EC2 web server; one of two illustrated instances' });
  symbol(`app-${number}`, 'app-tier', cx, 720, 'EC2', 'aws4-ddec86e91fa0a9c2', { width: 100, height: 100, technology: 'Amazon EC2 application server; no Auto Scaling specified' });
}
symbol('cache', 'az-1', 200, 850, 'ElastiCache', 'aws4-5903a64a34810675', { technology: 'Amazon ElastiCache; engine and strategy unspecified' });
symbol('primary', 'az-1', 580, 850, 'RDS primary', 'aws4-6958f9ce7fdf9067', { technology: 'Amazon RDS; engine unspecified' });
symbol('standby', 'az-2', 850, 850, 'RDS standby', 'aws4-6958f9ce7fdf9067', { technology: 'Amazon RDS standby; no direct application reads shown' });
text('support-heading', 'region', 1070, 425, 360, 50, 'Supporting services<br>Calling components unspecified', 'fontSize=14;align=center;');
symbol('dynamodb', 'region', 1250, 500, 'DynamoDB table', 'aws4-35d1821eb6a19e22', { technology: 'Amazon DynamoDB table' });
symbol('ses', 'region', 1250, 680, 'SES · email delivery', 'aws4-2573a358c515958e', { technology: 'Amazon Simple Email Service', width: 240 });
symbol('sns', 'region', 1250, 860, 'SNS · email notifications', 'aws4-9758db46c424c589', { technology: 'Amazon Simple Notification Service', width: 260 });
symbol('alarms', 'region', 1250, 1040, 'CloudWatch Alarms', 'aws4-8d2e34c3511b5f4a', { technology: 'Amazon CloudWatch Alarms', width: 240 });
// Tiny boundary anchors identify an unresolved endpoint, not an extra service.
for (const [id, x, y] of [['ddb-out',1004,517],['ddb-in',1004,549],['ses',1004,713],['sns',1004,893],['alarms',947,1004]]) {
  node('port-'+id, 'deployment', x, y, 6, 6, '', 'ellipse;fillColor=#A8B0B8;strokeColor=none;',
    { boundaryPortFor: 'deployment', endpointResolution: 'Calling component unspecified' });
}

const top = [.5, 0], bottom = [.5, 1];
// Ports use the actual symbol edge, not its wider caption container.
const left = id => [(boxes.get(id).w / 2 - 36) / boxes.get(id).w, 36 / boxes.get(id).h];
const right = id => [(boxes.get(id).w / 2 + 36) / boxes.get(id).w, 36 / boxes.get(id).h];
edge('dns-query', 'users', 'dns', left('users'), right('dns'), [], 'DNS → ELB', { dashed: true, width: 140, relation: 'DNS resolution; no payload forwarding' });
edge('application-ingress', 'users', 'elb', bottom, top);
edge('load-balance', 'elb', 'web-asg', bottom, [150/310,0]);
edge('web-s3', 'web-asg', 's3', [1,.5], left('s3'), [[690,585],[690,336]]);
edge('app-cache', 'app-tier', 'cache', [0,.5], top, [[200,750]]);
edge('app-database', 'app-tier', 'primary', [280/310,1], top);
edge('cache-database', 'cache', 'primary', right('cache'), left('primary'), [], 'Relationship only', { dashed: true, width: 170, relation: 'Source connection; operation unspecified; not a native database-fetch capability' });
edge('replication', 'primary', 'standby', right('primary'), left('standby'), [], 'Replication', { dashed: true, width: 125, at: .55, relation: 'Replication mode unspecified' });
edge('standby-s3', 'standby', 's3', top, bottom, [], 'Purpose<br>unspecified', { dashed: true, width: 130, relation: 'Source connection from standby side; not assumed backup or export' });
edge('static-origin', 'cloudfront', 's3', bottom, top, [], 'S3 origin', { width: 110, at: .5, relation: 'CloudFront retrieves static content from S3' });
edge('deployment-ddb', 'port-ddb-out', 'dynamodb', [.5,.5], [.275,20/104], [], '', { relation: 'Boundary-level outbound NoSQL access' });
edge('ddb-deployment', 'dynamodb', 'port-ddb-in', [.275,52/104], [.5,.5], [], '', { relation: 'Boundary-level return direction explicitly shown in source' });
edge('deployment-ses', 'port-ses', 'ses', [.5,.5], left('ses'), [], '', { relation: 'Boundary-level email delivery; caller unspecified' });
edge('deployment-sns', 'port-sns', 'sns', [.5,.5], left('sns'), [], '', { relation: 'Boundary-level notifications; publisher unspecified' });
edge('deployment-alarms', 'port-alarms', 'alarms', [.5,.5], left('alarms'), [[950,1076]], '', { relation: 'Boundary-level monitoring; monitored resource unspecified' });

text('scope', '1', 40, 1185, 1420, 44,
  'Two instances per compute tier are illustrated, not fixed capacity. Web → App is not explicitly connected in the source.<br>Cache → RDS and standby-side → S3 preserve source relationships only; no operation or native service capability is inferred.', 'fontSize=14;');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<mxfile host="app.diagrams.net" version="32.6.1"><diagram id="supporting-services-first" name="AWS web application with supporting services"><mxGraphModel architectureFontSize="14" grid="1" gridSize="10" page="1" pageScale="1" pageWidth="1500" pageHeight="1240"><root>${cells.join('\n')}</root></mxGraphModel></diagram></mxfile>\n`;
writeFileSync(new URL('./first.drawio', import.meta.url), xml);
console.log('Generated first delivery from the second text scenario; no case reference image was supplied.');
