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
function comment(id, target, parent, label, x, y, width, height) {
  // Native Misc > Note preset from the pinned grapheditor/Sidebar.js.
  const style = 'shape=note;whiteSpace=wrap;html=1;backgroundOutline=1;autosizeText=1;fontColor=#000000;darkOpacity=0.05;fillColor=#FFF9B2;strokeColor=none;fillStyle=solid;fontSize=20;direction=west;gradientDirection=north;gradientColor=#FFF2A1;shadow=1;size=20;pointerEvents=1;';
  cells.push(`<mxCell id="${id}" value="${xml(label.replaceAll('\n', '<br>'))}" annotationKind="comment" annotationFor="${target}" vertex="1" parent="${parent}" style="${style}"><mxGeometry x="${x}" y="${y}" width="${width}" height="${height}" as="geometry"/></mxCell>`);
}
function legendTable(x, y) {
  const widths = [130, 330], rowHeight = 30;
  const rows = [
    ['Notation', 'Meaning'],
    ['Solid arrow', 'Main call; caller to callee'],
    ['Dashed arrow', 'Auxiliary policy query'],
    ['Bold label', 'Failure response'],
    ['Service tile / actor', 'AWS service / person'],
    ['Plain white box', 'Custom container'],
    ['Outlined group', 'Deployment node or system boundary'],
    ['Folded note', 'Local comment, not a service or boundary'],
  ];
  cells.push(`<mxCell id="legend" value="Legend" annotationKind="legend" vertex="1" parent="1" style="rounded=0;html=0;align=left;verticalAlign=top;spacing=8;fillColor=none;strokeColor=#c4c9cf;fontFamily=Arial;fontSize=12;fontStyle=1;"><mxGeometry x="${x}" y="${y}" width="460" height="${28 + rows.length * rowHeight}" as="geometry"/></mxCell>`);
  rows.forEach((row, r) => row.forEach((value, c) => {
    cells.push(`<mxCell id="legend-${r}-${c}" value="${xml(value)}" vertex="1" parent="legend" style="rounded=0;html=0;whiteSpace=wrap;align=left;verticalAlign=middle;spacing=8;fillColor=${r ? '#ffffff' : '#f5f6f7'};strokeColor=#c4c9cf;fontFamily=Arial;fontSize=12;fontStyle=${r ? 0 : 1};"><mxGeometry x="${c ? widths[0] : 0}" y="${28 + r * rowHeight}" width="${widths[c]}" height="${rowHeight}" as="geometry"/></mxCell>`);
  }));
}
function edge(id, from, to, label, points = [], { dashed = false, bold = false, exitX = 1, exitY = 0.5, entryX = 0, entryY = 0.5, labelX = 0, labelY = 0 } = {}) {
  const style = `edgeStyle=orthogonalEdgeStyle;rounded=0;html=0;endArrow=block;endFill=1;startArrow=none;strokeColor=#545b64;strokeWidth=1.5;fontFamily=Arial;fontSize=12;fontStyle=${bold ? 1 : 0};dashed=${dashed ? 1 : 0};labelBackgroundColor=#ffffff;exitX=${exitX};exitY=${exitY};exitPerimeter=0;entryX=${entryX};entryY=${entryY};entryPerimeter=0;`;
  cells.push(`<mxCell id="${id}" value="${xml(label)}" edge="1" parent="1" source="${from}" target="${to}" style="${style}"><mxGeometry x="${labelX}" y="${labelY}" relative="1" as="geometry">${points.length ? '<Array as="points">' + points.map(([x, y]) => `<mxPoint x="${x}" y="${y}"/>`).join('') + '</Array>' : ''}</mxGeometry></mxCell>`);
}

note('title', 'Dynamic diagram (deployment view): Token-based API authorization', 60, 25, 1730, 28, true);
note('requirement', 'Requirement: Authenticate users and authorize each API request.', 60, 65, 1730, 28);
vertex('aws', 'AWS Cloud', 'Deployment node', '', '1', 600, 130, 1240, 740, lookup('AWS Cloud', 'aws4Groups', 'aws4-d0472fc38ac34dce'));
vertex('enforcement', 'API enforcement', 'Software system boundary', '', 'aws', 410, 220, 440, 460);
vertex('user', 'User', 'Person', '', '1', 100, 470, 60, 72);
vertex('web', 'Web sign-in page', 'Container', 'Web app', '1', 260, 470, 160, 72);
vertex('cognito', 'Amazon Cognito user pool', 'Container', 'Amazon Cognito', 'aws', 100, 120, 72, 72, lookup('Cognito'), 'Authenticates and issues tokens');
vertex('gateway', 'Amazon API Gateway', 'Container', 'AWS managed service', 'enforcement', 70, 120, 72, 72, lookup('API Gateway', 'aws4Network Content Delivery'), 'Enforces the authorization result');
vertex('authorizer', 'Lambda authorizer', 'Container', 'AWS Lambda', 'enforcement', 290, 270, 72, 72, lookup('Lambda'), 'Verifies token and queries policy');
vertex('policy', 'Amazon Verified Permissions', 'Container', 'AWS managed service', 'aws', 160, 490, 72, 72, lookup('Verified Permissions'), 'Makes policy decisions');
vertex('backend', 'Backend APIs', 'Container', 'REST API', 'aws', 1030, 340, 160, 72);
comment('token', 'cognito', 'aws', 'Step 1: example token claims\ncognito:username = alex\ncustom:tenantId = T-001\ncustom:type = Customer\ncognito:groups = [Customers]', 270, 70, 300, 140);
edge('uses', 'user', 'web', 'Uses web app');
edge('authenticate', 'web', 'cognito', '1. Authenticate [HTTPS]\nreturns tokens', [[380, 286]], { exitX: 0.75, exitY: 0, labelX: 0.3 });
edge('request', 'web', 'gateway', '2. API request with token [HTTPS]');
edge('authorize', 'gateway', 'authorizer', '3. Pass token\n[AWS invocation]', [[1336, 488]], { exitX: 1, exitY: 0.25, entryX: 0.5, entryY: 0, labelX: -0.5 });
edge('query', 'authorizer', 'policy', '4. Query policy [HTTPS]', [], { dashed: true, exitX: 0, exitY: 0.5, entryX: 1, entryY: 0.5, labelX: 0.7 });
edge('forward', 'gateway', 'backend', '5. Forward allowed request\n[HTTPS]', [], { exitY: 0.75, entryY: 0.75, labelX: 0.62 });
edge('failure', 'gateway', 'web', "5'. Authorization failure: HTTP 403 [HTTPS]", [[1116, 430], [300, 430]], { bold: true, exitX: 0.5, exitY: 0, entryX: 0.25, entryY: 0, labelX: -0.25 });
legendTable(60, 602);
const diagram = `<?xml version="1.0" encoding="UTF-8"?>\n<mxfile host="app.diagrams.net" version="${catalog.drawio_version}" compressed="false"><diagram id="scenario-01" name="Scenario 01"><mxGraphModel grid="1" gridSize="10" page="1" pageWidth="1900" pageHeight="1040"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${cells.join('')}</root></mxGraphModel></diagram></mxfile>\n`;
writeFileSync(fileURLToPath(new URL('scenario-01.drawio', base)), diagram);
console.log('Generated prototype/scenario-01.drawio from explicit evaluation assumptions.');
