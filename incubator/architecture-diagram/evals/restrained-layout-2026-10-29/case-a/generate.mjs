import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Fresh composition derived only from the isolated text scenario.
const catalog = JSON.parse(readFileSync(new URL('../../../candidate/architecture-diagram/assets/catalog.json', import.meta.url), 'utf8'));
const cells = ['<mxCell id="0"/>', '<mxCell id="1" parent="0"/>'];
const boxes = new Map();
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const attrs = obj => Object.entries(obj).map(([k, v]) => `${k}="${esc(v)}"`).join(' ');
const base = 'html=1;fontFamily=Arial;fontSize=16;fontColor=#253247;';
function node(id, label, parent, x, y, w, h, style, metadata = {}) {
  const p = boxes.get(parent) || { x: 0, y: 0 };
  boxes.set(id, { x: p.x + x, y: p.y + y, w, h });
  cells.push(`<object ${attrs({ id, label, ...metadata })}><mxCell vertex="1" parent="${parent}" style="${esc(base + style)}"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell></object>`);
}
function text(id, label, x, y, w, h, size = 16, extra = '') {
  node(id, label, '1', x, y, w, h, `text;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;whiteSpace=wrap;fontSize=${size};${extra}`);
}
function region(id, label, parent, x, y, w, h, fill, stroke, extra = '') {
  node(id, label, parent, x, y, w, h, `rounded=0;fillColor=${fill};strokeColor=${stroke};strokeWidth=1;align=left;verticalAlign=top;spacingTop=12;spacingLeft=14;whiteSpace=wrap;${extra}`, { c4Type: 'Deployment node' });
}
function icon(id, label, parent, x, y, key, technology, width = 180) {
  const entry = catalog.entries.find(e => e.id === key);
  if (!entry?.usable) throw new Error(`Missing exact icon ${key}`);
  node(id, label, parent, x, y, 72, 72, entry.style + `fontFamily=Arial;fontSize=16;spacingTop=9;labelWidth=${width};`, {
    c4Type: 'Container', technology, vendor: 'AWS', iconKey: key,
  });
}
function edge(id, source, target, from, to, points = [], label = '', position = 0, dashed = false) {
  const style = `edgeStyle=none;rounded=0;html=1;startArrow=none;endArrow=block;endFill=1;strokeColor=#415468;strokeWidth=1.7;fontFamily=Arial;fontSize=16;fontColor=#253247;labelBackgroundColor=#ffffff;exitX=${from[0]};exitY=${from[1]};entryX=${to[0]};entryY=${to[1]};exitPerimeter=0;entryPerimeter=0;${dashed ? 'dashed=1;dashPattern=5 4;' : ''}`;
  cells.push(`<mxCell ${attrs({ id, value: label, edge: '1', parent: '1', source, target, style })}><mxGeometry relative="1" x="${position}" y="0" as="geometry">${points.length ? `<Array as="points">${points.map(([x, y]) => `<mxPoint x="${x}" y="${y}"/>`).join('')}</Array>` : ''}</mxGeometry></mxCell>`);
}

text('title', 'AWS three-tier web application', 40, 20, 1100, 42, 28, 'fontStyle=1;');
region('vpc', 'VPC · 10.0.0.0/16', '1', 430, 90, 1250, 790, '#ffffff', '#758899', 'fontSize=19;fontStyle=1;');
region('aza', 'Availability Zone A', 'vpc', 170, 55, 1020, 285, '#F7F9FC', '#B7C2CC');
region('azb', 'Availability Zone B', 'vpc', 170, 490, 1020, 275, '#F7F9FC', '#B7C2CC');
for (const [az, y] of [['aza', 55], ['azb', 45]]) {
  const b = az === 'azb';
  region(`web-${az}`, `Web Subnet ${b ? 2 : 1}<br>10.0.${b ? 1 : 0}.0/24`, az, 20, y, 220, 190, '#FFF7EB', 'none');
  region(`app-${az}`, `App Subnet ${b ? 2 : 1}<br>10.0.${b ? 3 : 2}.0/24`, az, 380, y, 220, 190, '#FFF7EB', 'none');
  region(`db-${az}`, `RDS Subnet ${b ? 2 : 1}<br>10.0.${b ? 5 : 4}.0/24`, az, 740, y, 240, 190, '#FCF3FD', 'none');
}
// Logical overlays are explicitly distinct from subnet and AZ boundaries.
for (const [id, x, members] of [['web-asg', 612, 'web-a web-b'], ['app-asg', 972, 'app-a app-b']]) {
  node(id, '', '1', x, 260, id === 'web-asg' ? 224 : 236, 550, 'rounded=1;arcSize=6;fillColor=none;strokeColor=#D19A48;dashed=1;dashPattern=6 4;strokeWidth=1.3;', { logicalGroup: 'Auto Scaling group', members });
}
text('web-asg-label', 'Web Auto Scaling<br>group', 640, 465, 180, 56, 16, 'align=center;fillColor=#ffffff;');
text('app-asg-label', 'App Auto Scaling<br>group', 1000, 465, 180, 56, 16, 'align=center;fillColor=#ffffff;');

node('users', 'Users', '1', 64, 465, 72, 72, 'shape=actor;fillColor=#ffffff;strokeColor=#415468;verticalLabelPosition=bottom;verticalAlign=top;spacingTop=9;', { c4Type: 'Person' });
icon('dns', 'Route 53<br>Resolves to CloudFront', '1', 64, 185, 'aws4-bd28863047f4dd8d', 'Amazon Route 53', 180);
icon('cdn', 'CloudFront', '1', 284, 465, 'aws4-e51c75c7037f2414', 'Amazon CloudFront');
icon('s3', 'S3 bucket', '1', 284, 185, 'aws4-7d0e996c99148efe', 'Amazon S3');
icon('web-elb', 'Web ELB', 'vpc', 54, 375, 'aws4-7bc374c95b5f5aaa', 'Elastic Load Balancing', 120);
icon('app-elb', 'App ELB', 'vpc', 444, 375, 'aws4-7bc374c95b5f5aaa', 'Elastic Load Balancing', 120);
for (const [id, subnet] of [['web-a', 'web-aza'], ['web-b', 'web-azb'], ['app-a', 'app-aza'], ['app-b', 'app-azb']]) {
  icon(id, id.startsWith('web') ? 'Web servers' : 'App servers', subnet, 74, 65, 'aws4-d2efe117d40ef9f3', 'Amazon EC2', 160);
}
icon('primary', 'RDS primary', 'db-aza', 84, 65, 'aws4-6958f9ce7fdf9067', 'Amazon RDS', 190);
icon('standby', 'RDS standby<br>Automatic failover only', 'db-azb', 84, 65, 'aws4-6958f9ce7fdf9067', 'Amazon RDS', 220);

edge('dns-query', 'users', 'dns', [0.5, 0], [1, 0.5], [[100,405],[195,405],[195,221]], 'DNS', -0.46, true);
edge('entry', 'users', 'cdn', [1,0.5], [0,0.5]);
edge('static', 'cdn', 's3', [0.5,0], [0,0.5], [[320,400],[220,400],[220,221]], 'Static', 0.1);
edge('dynamic', 'cdn', 'web-elb', [1,0.5], [0,0.5], [], 'Dynamic', -0.38);
edge('web-to-a', 'web-elb', 'web-a', [1,0.25], [0,0.5], [[574,483],[574,301]]);
edge('web-to-b', 'web-elb', 'web-b', [1,0.75], [0,0.5], [[584,519],[584,726]]);
edge('a-to-app-elb', 'web-a', 'app-elb', [1,0.5], [0.5,0], [[910,301]]);
edge('b-to-app-elb', 'web-b', 'app-elb', [1,0.5], [0,0.75], [[850,726],[850,519]]);
edge('app-to-a', 'app-elb', 'app-a', [1,0.25], [0,0.5], [[964,483],[964,301]]);
edge('app-to-b', 'app-elb', 'app-b', [1,0.75], [0,0.5], [[988,519],[988,726]]);
edge('a-to-db', 'app-a', 'primary', [1,0.5], [0,0.5]);
edge('b-to-db', 'app-b', 'primary', [1,0.5], [0,0.75], [[1270,726],[1270,319]]);
edge('replication', 'primary', 'standby', [1,0.5], [1,0.5], [[1600,301],[1600,726]], 'Synchronous<br>replication', 0, true);

text('scale-scope', 'Dashed amber outlines: independent Auto Scaling groups across both AZs. EC2 symbols represent fleets; counts are not fixed.', 430, 900, 1250, 28);
text('scope', 'Scope: Region, protocols, ELB types, subnet exposure, security controls and capacities are unspecified.<br>Responses follow the request path. RDS Multi-AZ standby does not serve application reads.', 430, 938, 1250, 48);
const xml = `<mxfile host="app.diagrams.net" version="32.6.1"><diagram id="three-tier" name="AWS three-tier application"><mxGraphModel page="1" pageScale="1" pageWidth="1720" pageHeight="1010" architectureFontSize="16" background="#ffffff"><root>${cells.join('\n')}</root></mxGraphModel></diagram></mxfile>\n`;
writeFileSync(fileURLToPath(new URL('diagram.drawio', import.meta.url)), xml);
