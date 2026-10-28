import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { styleMap } from './catalog.mjs';

const base = new URL('../prototype/', import.meta.url);
const catalog = JSON.parse(readFileSync(new URL('catalog.json', base), 'utf8'));
const xml = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('\n', '&#xa;');
const cells = [];
const lookup = (title, palette, id) => {
  const entries = catalog.entries.filter(e => e.vendor === 'AWS' && e.title === title && e.usable && (!palette || e.palette === palette) && (!id || e.id === id));
  if (entries.length !== 1) throw new Error(`Exact lookup needs one entry for ${title}; got ${entries.length}.`);
  return entries[0];
};
const shapeStyle = entry => {
  const style = styleMap(entry.style);
  Object.assign(style, { fontFamily: 'Arial', fontSize: 12, fontStyle: 0, html: 0, whiteSpace: 'wrap', labelWidth: 200, spacingTop: 8 });
  return Object.entries(style).map(([k, v]) => `${k}=${v}`).join(';') + ';';
};
function vertex(id, label, type, technology, parent, x, y, width, height, entry = null, description = '') {
  const style = entry ? shapeStyle(entry) : `rounded=0;whiteSpace=wrap;html=0;fillColor=#ffffff;strokeColor=#8c939d;fontFamily=Arial;fontSize=12;fontStyle=${type === 'Software system boundary' ? 1 : 0};${type.endsWith('boundary') ? 'align=left;verticalAlign=top;spacing=12;' : ''}${type === 'Person' ? 'shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;labelWidth=120;' : ''}`;
  const full = [label, `[${type}${technology ? ': ' + technology : ''}]`, description].filter(Boolean).join('\n');
  cells.push(`<object id="${id}" label="${xml(full)}" c4Type="${xml(type)}" technology="${xml(technology)}" vendor="${entry?.vendor || ''}" iconKey="${entry?.id || ''}"><mxCell vertex="1" parent="${parent}" style="${xml(style)}"><mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/></mxCell></object>`);
}
function note(id, label, x, y, width, height, bold = false) {
  cells.push(`<mxCell id="${id}" value="${xml(label)}" vertex="1" parent="1" style="text;html=0;whiteSpace=wrap;align=left;verticalAlign=top;fontFamily=Arial;fontSize=12;fontStyle=${bold ? 1 : 0};"><mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/></mxCell>`);
}
function edge(id, from, to, label, points = [], { dashed = false, bold = false, exitX = 1, exitY = 0.5, entryX = 0, entryY = 0.5, labelX = 0, labelY = -18 } = {}) {
  const style = `edgeStyle=orthogonalEdgeStyle;rounded=0;html=0;endArrow=block;endFill=1;startArrow=none;strokeColor=#545b64;strokeWidth=1.5;fontFamily=Arial;fontSize=12;fontStyle=${bold ? 1 : 0};dashed=${dashed ? 1 : 0};labelBackgroundColor=#ffffff;exitX=${exitX};exitY=${exitY};exitPerimeter=0;entryX=${entryX};entryY=${entryY};entryPerimeter=0;`;
  cells.push(`<mxCell id="${id}" value="${xml(label)}" edge="1" parent="1" source="${from}" target="${to}" style="${style}"><mxGeometry x="${labelX}" y="${labelY}" relative="1" as="geometry">${points.length ? '<Array as="points">' + points.map(([x, y]) => `<mxPoint x="${x}" y="${y}"/>`).join('') + '</Array>' : ''}</mxGeometry></mxCell>`);
}

note('title', 'Dynamic diagram (deployment view): Token-based API authorization', 60, 25, 1730, 28, true);
note('requirement', 'Requirement: Authenticate users and authorize each API request.\nResolved evaluation fixture; not evidence of an executed service.', 60, 90, 460, 65);
note('token', 'Example token claims: cognito:username=alex; custom:tenantId=T-001;\ncustom:type=Customer; cognito:groups=[Customers]', 600, 65, 1130, 45);
vertex('aws', 'AWS Cloud', 'Deployment node', '', '1', 600, 130, 1240, 740, lookup('AWS Cloud', 'aws4Groups', 'aws4-d0472fc38ac34dce'));
vertex('enforcement', 'API enforcement', 'Software system boundary', '', 'aws', 440, 100, 380, 530);
vertex('user', 'User', 'Person', '', '1', 100, 300, 60, 72);
vertex('web', 'Web sign-in page', 'Container', 'Web app', '1', 260, 300, 160, 72);
vertex('cognito', 'Amazon Cognito user pool', 'Container', 'Amazon Cognito', 'aws', 70, 170, 72, 72, lookup('Cognito'), 'Authenticates and issues tokens');
vertex('gateway', 'Amazon API Gateway', 'Container', 'AWS managed service', 'enforcement', 70, 70, 72, 72, lookup('API Gateway', 'aws4Network Content Delivery'), 'Enforces the authorization result');
vertex('authorizer', 'Lambda authorizer', 'Container', 'AWS Lambda', 'enforcement', 70, 370, 72, 72, lookup('Lambda'), 'Verifies token and queries policy');
vertex('policy', 'Amazon Verified Permissions', 'Container', 'AWS managed service', 'aws', 160, 470, 72, 72, lookup('Verified Permissions'), 'Makes policy decisions');
vertex('backend', 'Backend APIs', 'Container', 'REST API', 'aws', 1000, 170, 160, 72);
edge('uses', 'user', 'web', 'Uses web app', [], { labelY: -18 });
edge('authenticate', 'web', 'cognito', '1. Authenticate [HTTPS]\nreturns tokens');
edge('request', 'web', 'gateway', '2. API request with token [HTTPS]', [[340, 230], [1350, 230], [1350, 318]], { exitX: 0.5, exitY: 0, entryX: 1, entryY: 0.25, labelX: -0.15 });
edge('authorize', 'gateway', 'authorizer', '3. Pass token [AWS invocation]', [[930, 336], [930, 520], [1146, 520]], { exitX: 0, exitY: 0.5, entryX: 0.5, entryY: 0, labelX: 0.5, labelY: -18 });
edge('query', 'authorizer', 'policy', '4. Query policy [HTTPS]', [[930, 650], [930, 636]], { dashed: true, exitX: 0, exitY: 0.7, entryX: 1, entryY: 0.5, labelY: 20 });
edge('forward', 'gateway', 'backend', '5. Forward allowed request [HTTPS]');
edge('failure', 'gateway', 'web', "5'. Authorization failure: HTTP 403 [HTTPS]", [[1000, 318], [1000, 210], [300, 210]], { bold: true, exitX: 0, exitY: 0.25, entryX: 0.25, entryY: 0, labelX: 0.15, labelY: -18 });
note('legend', 'Legend\nAWS service tiles: pinned draw.io AWS4 icons.\nWhite box: custom container. Actor glyph: person.\nOutlined groups: deployment node or system boundary.\nSolid: main call. Dashed: auxiliary policy query.\nBold relationship: failure response. Arrows: caller to callee.', 60, 680, 460, 150);
note('assumptions', 'Prototype assumptions (not owner approvals): generic Web app and REST API;\nHTTPS on external calls; generic AWS invocation for the authorizer.\nThe planted password-verification error is corrected only in this fixture.', 600, 905, 1190, 70);
const diagram = `<?xml version="1.0" encoding="UTF-8"?>\n<mxfile host="app.diagrams.net" version="${catalog.drawio_version}" compressed="false"><diagram id="scenario-01" name="Scenario 01"><mxGraphModel grid="1" gridSize="10" page="1" pageWidth="1900" pageHeight="1040"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${cells.join('')}</root></mxGraphModel></diagram></mxfile>\n`;
writeFileSync(fileURLToPath(new URL('scenario-01.drawio', base)), diagram);
console.log('Generated prototype/scenario-01.drawio from explicit evaluation assumptions.');
