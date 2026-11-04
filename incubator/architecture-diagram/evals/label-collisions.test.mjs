import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { checkLayout, textSize } from '../candidate/architecture-diagram/scripts/check-layout.mjs';
import { formatDrawio, isFormatted } from '../candidate/architecture-diagram/scripts/drawio-format.mjs';

const icon = (id, x, y, value, parent = '1') =>
  `<mxCell id="${id}" value="${value}" style="shape=image;html=1;whiteSpace=wrap;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;fontSize=16;labelWidth=160;" vertex="1" parent="${parent}"><mxGeometry x="${x}" y="${y}" width="72" height="72" as="geometry"/></mxCell>`;
const edge = (id, source, target, ports, value = '', points = '', label = '') =>
  `<mxCell id="${id}" value="${value}" style="edgeStyle=orthogonalEdgeStyle;html=1;fontSize=16;${ports}" edge="1" parent="1" source="${source}" target="${target}"><mxGeometry relative="1" as="geometry"${label}>${points}</mxGeometry></mxCell>`;
const page = (...cells) =>
  formatDrawio(
    `<mxfile><diagram><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/>${cells.join('')}</root></mxGraphModel></diagram></mxfile>`,
  );
const side = 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;';
const collisions = (xml) =>
  checkLayout(xml).warnings.filter((w) =>
    /overlap or nearly touch|runs through|covers|crosses the outline|away from its connector/.test(w),
  );

test('text width estimate wraps at the caption width and honours line breaks', () => {
  assert.deepEqual(textSize('Amazon Bedrock Anthropic Claude', 16, 160).h, 2 * 16 * 1.2);
  assert.equal(textSize('a&lt;br&gt;b', 16).h, 2 * 16 * 1.2);
  assert.ok(textSize('Changed articles', 16).w < 140);
});

test('a well-spaced row with side ports and a labeled connector is clean', () => {
  const xml = page(icon('a', 0, 0, 'Client'), icon('b', 400, 0, 'Service'), edge('e', 'a', 'b', side, 'HTTPS', '', ''));
  assert.deepEqual(collisions(xml), []);
});

test('connectors leaving through a caption, or labels on a caption, are reported', () => {
  const below = page(
    icon('agent', 0, 0, 'Assistant service'),
    icon('trace', 0, 300, 'Langfuse'),
    edge('t', 'agent', 'trace', 'exitX=0.5;exitY=1;entryX=0.5;entryY=0;'),
  );
  assert.ok(collisions(below).includes('Connector t runs through the caption of agent.'));

  const crowded = page(
    icon('a', 0, 0, 'GitHub Actions'),
    icon('b', 200, 0, 'OpenAI Embeddings API'),
    icon('c', 600, 0, 'Terraform'),
    edge(
      'run',
      'a',
      'c',
      'exitX=1;exitY=0.85;entryX=0;entryY=0.85;',
      'Run',
      '<Array as="points"><mxPoint x="150" y="100"/><mxPoint x="500" y="100"/></Array>',
      ' x="-0.25"',
    ),
  );
  const found = collisions(crowded);
  assert.ok(found.some((w) => w.includes('connector label run') && w.includes('caption of b')));
  assert.ok(found.includes('Connector run runs through the caption of b.'));
});

test('separately drawn captions, detached labels and background regions are judged correctly', () => {
  const region =
    '<mxCell id="band" value="" style="rounded=0;fillColor=#F5F7FA;strokeColor=none;" vertex="1" parent="1"><mxGeometry x="-60" y="-140" width="720" height="320" as="geometry"/></mxCell>';
  const text =
    '<mxCell id="agent-caption" value="Assistant service" style="text;html=1;whiteSpace=wrap;align=center;fontSize=16;" vertex="1" parent="1"><mxGeometry x="-44" y="90" width="160" height="30" as="geometry"/></mxCell>';
  const xml = page(
    region,
    icon('agent', 0, 0, ''),
    text,
    icon('mcp', 0, 400, 'MCP server'),
    icon('b', 400, 0, 'Service'),
    edge('down', 'agent', 'mcp', 'exitX=0.5;exitY=1;entryX=0.5;entryY=0;'),
    edge('far', 'agent', 'b', side, 'HTTPS', '<mxPoint x="0" y="-80" as="offset"/>'),
  );
  const found = collisions(xml);
  assert.ok(found.includes('Connector down runs through the text agent-caption.'));
  assert.ok(found.includes('The connector label far sits away from its connector.'));
  assert.ok(!found.some((w) => w.includes('band')), 'text inside a background region is fine');
});

test('a caption spilling over a frame outline is reported', () => {
  const xml = page(
    '<mxCell id="frame" value="" style="rounded=0;" vertex="1" parent="1"><mxGeometry x="0" y="0" width="200" height="100" as="geometry"/></mxCell>',
    icon('db', 64, 10, 'Database with a long two line caption', 'frame'),
  );
  assert.ok(collisions(xml).includes('The caption of db crosses the outline of frame.'));
});

test('routes that leave a shared region, pass through a foreign one, detour or jog are reported', () => {
  const frame = (id, x, y, w, h) =>
    `<mxCell id="${id}" value="" style="rounded=0;container=1;" vertex="1" parent="1"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`;
  const pts = (...p) => `<Array as="points">${p.map(([x, y]) => `<mxPoint x="${x}" y="${y}"/>`).join('')}</Array>`;
  const xml = page(
    frame('vpc', 0, 0, 600, 200),
    icon('a', 40, 60, 'App', 'vpc'),
    icon('b', 440, 60, 'Database', 'vpc'),
    frame('other', 0, 400, 600, 200),
    icon('c', 40, 700, 'Client'),
    icon('d', 440, 700, 'Store'),
    icon('e', 800, 60, 'Partner'),
    icon('f', 1000, 74, 'Archive'),
    edge('out', 'a', 'b', side, '', pts([150, 96], [150, 300], [400, 300], [400, 96])),
    edge('through', 'c', 'd', 'exitX=0.5;exitY=0;entryX=0.5;entryY=0;', '', pts([76, 500], [476, 500])),
    edge('jog', 'e', 'f', side),
  );
  const found = checkLayout(xml).warnings;
  assert.ok(found.some((w) => w.startsWith('Connector out leaves vpc and re-enters it')));
  assert.ok(found.some((w) => w.startsWith('Connector out detours')));
  assert.ok(found.includes('Connector through passes through other, which holds neither end.'));
  assert.ok(found.some((w) => w.startsWith('Connector jog has a 14-unit jog')));
  const straight = page(
    frame('vpc', 0, 0, 600, 200),
    icon('a', 40, 60, 'App', 'vpc'),
    icon('b', 440, 60, 'Database', 'vpc'),
    edge('ok', 'a', 'b', side),
  );
  assert.deepEqual(
    checkLayout(straight).warnings.filter((w) => /detour|re-enter|passes through|jog/.test(w)),
    [],
  );
});

test('crossing connectors and swappable ports are reported; a clear outside channel is not', () => {
  const pts = (...p) => `<Array as="points">${p.map(([x, y]) => `<mxPoint x="${x}" y="${y}"/>`).join('')}</Array>`;
  // The connector to the lower target leaves from the higher port, so the two cross.
  const swapped = page(
    icon('agent', 0, 100, 'Agent'),
    icon('up', 300, 0, 'Upper'),
    icon('down', 300, 300, 'Lower'),
    edge('toLower', 'agent', 'down', 'exitX=1;exitY=0.25;entryX=0.5;entryY=0;', '', pts([200, 118])),
    edge('toUpper', 'agent', 'up', 'exitX=1;exitY=0.75;entryX=0;entryY=0.5;', '', pts([250, 154], [250, 36])),
  );
  assert.ok(
    checkLayout(swapped).warnings.includes(
      'Connectors toLower and toUpper share a side of one element and cross. Swap their ports.',
    ),
  );

  // A long connector through the middle crosses another; around the top it crosses nothing and is not a detour.
  const body = [
    icon('ci', 0, 200, 'CI'),
    icon('db', 700, 400, 'Index'),
    icon('tf', 300, 200, 'Terraform'),
    icon('cloud', 300, 500, 'Cloud'),
    edge('manage', 'tf', 'cloud', 'exitX=0.5;exitY=1;entryX=0.5;entryY=0;'),
  ];
  const through = page(
    ...body,
    edge(
      'write',
      'ci',
      'db',
      'exitX=1;exitY=0.5;entryX=0;entryY=0.5;',
      '',
      pts([200, 236], [200, 400], [650, 400], [650, 436]),
    ),
  );
  assert.ok(
    checkLayout(through).warnings.some(
      (w) => w.startsWith('Connectors manage and write cross') || w.startsWith('Connectors write and manage cross'),
    ),
  );
  const around = page(
    ...body,
    edge('write', 'ci', 'db', 'exitX=0.5;exitY=0;entryX=0.5;entryY=0;', '', pts([36, 120], [736, 120])),
  );
  assert.deepEqual(
    checkLayout(around).warnings.filter((w) => /cross|detour|Swap|share a/.test(w)),
    [],
  );
});

test('a connector label on a bend is reported; one on a straight segment is not', () => {
  const pts = '<Array as="points"><mxPoint x="236" y="300"/></Array>';
  const at = (x) =>
    page(
      icon('a', 0, 0, 'App'),
      icon('b', 400, 264, 'Model'),
      edge('call', 'a', 'b', 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;', 'Write answer', '', ` x="${x}"`),
    );
  const bent = (x) =>
    page(
      icon('a', 200, 0, 'App'),
      icon('b', 400, 264, 'Model'),
      edge('call', 'a', 'b', 'exitX=0.5;exitY=1;entryX=0;entryY=0.5;', 'Write answer', pts, ` x="${x}"`),
    );
  assert.ok(checkLayout(bent(0.1)).warnings.some((w) => w.includes('sits on a bend')));
  assert.ok(!checkLayout(at(0)).warnings.some((w) => w.includes('sits on a bend')));
});

test('the vendor-mix trial reports the collisions visible in its image', () => {
  const xml = readFileSync(new URL('./vendor-mix-2026-11-02/diagram.drawio', import.meta.url), 'utf8');
  const found = collisions(xml);
  for (const expected of [
    'The caption of openai and the connector label runterraform overlap or nearly touch.',
    'The caption of bedrock crosses the outline of eks.',
    'Connector trace runs through the caption of agent.',
    'Connector index runs through the caption of actions.',
  ])
    assert.ok(found.includes(expected), expected);
});

test("files must use draw.io's own layout, which importers such as Lucidchart require", () => {
  const compact =
    '<mxfile host="drawio" version="32.6.1"><diagram id="a" name="A"><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel></diagram></mxfile>';
  assert.ok(checkLayout(compact).errors.some((e) => e.includes('finalize.mjs')));
  const formatted = formatDrawio(compact);
  assert.ok(isFormatted(formatted));
  assert.equal(formatDrawio(formatted), formatted);
  assert.equal(formatted.split('\n')[4], '        <mxCell id="0" />');
  assert.deepEqual(checkLayout(formatted).errors, []);
  const exported = readFileSync(new URL('./fixtures/drawio-export.drawio', import.meta.url), 'utf8');
  assert.ok(isFormatted(exported), 'a file saved by draw.io is already in its layout');
  assert.equal(
    formatDrawio('<mxfile><diagram id="z">eJxLTEoGAAJNASs=</diagram></mxfile>'),
    '<mxfile>\n  <diagram id="z">eJxLTEoGAAJNASs=</diagram>\n</mxfile>\n',
  );
});

const waypoints = (...p) => `<Array as="points">${p.map(([x, y]) => `<mxPoint x="${x}" y="${y}"/>`).join('')}</Array>`;
const simpler = (xml) => checkLayout(xml).warnings.filter((w) => /route is clear|to avoid the/.test(w));

test('a clear one-bend route reports the extra bend of a Z', () => {
  const xml = page(
    icon('a', 0, 0, 'App'),
    icon('b', 400, 300, 'Store'),
    edge('z', 'a', 'b', 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;', '', waypoints([236, 36], [236, 336])),
  );
  assert.deepEqual(simpler(xml), [
    'Connector z bends 2 times, but a one-bend route is clear: leave the right of a and enter the top of b.',
  ]);
});

test('a detour around a movable connector label is reported; one around a caption or element is not', () => {
  // A tall label of another connector sits on the straight line between a and b.
  const label = 'one&lt;br&gt;two&lt;br&gt;three&lt;br&gt;four';
  const aroundLabel = page(
    icon('a', 0, 0, 'App'),
    icon('b', 600, 0, 'Store'),
    icon('e', 250, -260, 'E'),
    icon('f', 450, -260, 'F'),
    edge('other', 'e', 'f', side, label, '<mxPoint x="-86" y="260" as="offset"/>'),
    edge('z', 'a', 'b', 'exitX=0.5;exitY=0;entryX=0.5;entryY=0;', '', waypoints([36, -60], [636, -60])),
  );
  assert.deepEqual(simpler(aroundLabel), [
    'Connector z bends 2 times to avoid the connector label other. A bend around text reads as part of the route; move an element or the text so that a straight route is clear.',
  ]);
  // The same detour around another element's caption is reasonable: the caption belongs to its icon.
  const aroundCaption = page(
    icon('a', 0, 0, 'App'),
    icon('b', 600, 0, 'Store'),
    icon('c', 300, -80, label),
    edge('z', 'a', 'b', 'exitX=0.5;exitY=0;entryX=0.5;entryY=0;', '', waypoints([36, -200], [636, -200])),
  );
  assert.deepEqual(simpler(aroundCaption), []);
});

test('numbered steps that tangle are told to swap ports; numbers out of spatial order are not reported', () => {
  const fan = (...lines) =>
    page(
      icon('agent', 0, 200, 'Agent'),
      icon('t1', 400, 0, 'One'),
      icon('t2', 400, 200, 'Two'),
      icon('t3', 400, 400, 'Three'),
      edge('s1', 'agent', 't1', 'exitX=1;exitY=0.25;entryX=0;entryY=0.5;', '1. Step', waypoints([236, 218], [236, 36])),
      ...lines,
    );
  const steps = (xml) => checkLayout(xml).warnings.filter((w) => /Swap their ports|[Ss]teps? /.test(w));
  // A reader finds the numbers on the page; 1, 3, 2 from top to bottom is fine when nothing crosses.
  const untangled = fan(
    edge('s3', 'agent', 't2', 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;', '3. Step'),
    edge('s2', 'agent', 't3', 'exitX=1;exitY=0.75;entryX=0;entryY=0.5;', '2. Step', waypoints([236, 254], [236, 436])),
  );
  assert.deepEqual(steps(untangled), []);
  const tangled = fan(
    edge('s2', 'agent', 't3', 'exitX=1;exitY=0.5;entryX=0;entryY=0.5;', '2. Step', waypoints([200, 236], [200, 436])),
    edge('s3', 'agent', 't2', 'exitX=1;exitY=0.75;entryX=0;entryY=0.5;', '3. Step', waypoints([250, 254], [250, 236])),
  );
  assert.deepEqual(steps(tangled), ['Connectors s2 and s3 share a side of one element and cross. Swap their ports.']);
});

test('round 3 semantic routing trials report the tangle and avoidable bends visible in their images', () => {
  const trial = (name) =>
    checkLayout(readFileSync(new URL(`./semantic-routing-2026-11-02/${name}/diagram.drawio`, import.meta.url), 'utf8'))
      .warnings;
  const a = trial('round3-a');
  assert.ok(
    a.includes(
      'Connector runTf bends 2 times, but a one-bend route is clear: leave the right of actions and enter the top of tf.',
    ),
  );
  // Steps reading 1, 3, 2 do not cross there, so they are not reported.
  assert.ok(!a.some((w) => /Swap their ports|[Ss]teps? /.test(w)));
  // Write embeddings goes around the Embeddings API icon; that channel is reasonable.
  assert.ok(!a.some((w) => w.startsWith('Connector index ') && /route is clear|to avoid/.test(w)));
  // Steps 2 and 3 cross; swapping their ports untangles them.
  assert.ok(
    trial('round3-b').includes('Connectors answer and store share a side of one element and cross. Swap their ports.'),
  );
});

test('a member named like its house repeats it; a corner marker does not; deep outlines are reported', () => {
  const house = (id, x, y, w, h, value, parent = '1', extra = '') =>
    `<mxCell id="${id}" value="${value}" style="rounded=1;container=1;${extra}" vertex="1" parent="${parent}"><mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/></mxCell>`;
  const small = (id, x, y, value, parent) =>
    `<mxCell id="${id}" value="${value}" style="shape=image;" vertex="1" parent="${parent}"><mxGeometry x="${x}" y="${y}" width="24" height="24" as="geometry"/></mxCell>`;
  const repeats = (xml) => checkLayout(xml).warnings.filter((w) => /repeats the house|nest \d+ deep/.test(w));
  const duplicate = page(
    house('cluster', 0, 0, 600, 400, 'Amazon EKS cluster'),
    icon('eks', 40, 260, 'EKS', 'cluster'),
    icon('agent', 300, 100, 'Assistant', 'cluster'),
  );
  assert.deepEqual(repeats(duplicate), [
    'eks repeats the house cluster it sits in. Mark the house with its icon at the top left and attach its connectors to the house instead.',
  ]);
  const marked = page(
    house('cluster', 0, 0, 600, 400, 'Amazon EKS cluster', '1', 'spacingLeft=36;'),
    small('eks', 6, 6, 'EKS', 'cluster'),
    icon('agent', 300, 100, 'Assistant', 'cluster'),
  );
  assert.deepEqual(repeats(marked), []);
  const nest = (fill) =>
    page(
      house('cloud', 0, 0, 1000, 800, 'Cloud'),
      house('vpc', 20, 40, 900, 700, 'VPC', 'cloud'),
      house('subnet', 20, 40, 800, 600, 'Subnet', 'vpc', fill),
      house('group', 20, 40, 700, 500, 'Group', 'subnet'),
      icon('vm', 40, 60, 'VM', 'group'),
    );
  assert.deepEqual(repeats(nest('')), [
    'Boundaries nest 4 deep at group. Keep three outlines in one view; fold a level or split the detail into its own view.',
  ]);
  assert.deepEqual(repeats(nest('strokeColor=none;fillColor=#F2F2F2;')), []);
});

test('a run shared by connectors of different meaning is an error; identical connectors only get a check', () => {
  const trunk = (labels, style = '') =>
    page(
      icon('app', 0, 200, 'App'),
      icon('t1', 400, 0, 'One'),
      icon('t2', 400, 400, 'Two'),
      edge(
        'a',
        'app',
        't1',
        `exitX=1;exitY=0.5;entryX=0;entryY=0.5;${style}`,
        labels[0],
        waypoints([200, 236], [200, 36]),
      ),
      edge(
        'b',
        'app',
        't2',
        `exitX=1;exitY=0.5;entryX=0;entryY=0.5;${style}`,
        labels[1],
        waypoints([200, 236], [200, 436]),
      ),
    );
  const shared = (xml) => {
    const { errors, warnings } = checkLayout(xml);
    return [...errors, ...warnings].filter((m) => /segment/.test(m));
  };
  assert.deepEqual(shared(trunk(['1 Search', '2 Answer'])), [
    'Connectors a and b have different meanings but share a 128-unit segment, so they read as one connection. Give each its own port and route.',
  ]);
  assert.deepEqual(shared(trunk(['', ''], 'dashed=1;')), [
    'Connectors a and b have different meanings but share a 128-unit segment, so they read as one connection. Give each its own port and route.',
  ]);
  assert.deepEqual(shared(trunk(['Deploy', 'Deploy'], 'dashed=1;')), [
    'Connectors a and b share a 128-unit segment. That reads as one relationship; keep it only if they are one.',
  ]);
  const b = checkLayout(readFileSync(new URL('./region-intent-2026-11-04/b/diagram.drawio', import.meta.url), 'utf8'));
  assert.ok(b.errors.some((m) => m.startsWith('Connectors e3 and e4 have different meanings')));
  const a = checkLayout(readFileSync(new URL('./region-intent-2026-11-04/a/diagram.drawio', import.meta.url), 'utf8'));
  assert.ok(!a.errors.some((m) => /segment/.test(m)));
});

test('dashed, dotted and weighted connectors need key text; a keyed view passes', () => {
  const two = (styleA, styleB, key = '') =>
    page(
      icon('a', 0, 0, 'App'),
      icon('b', 400, 0, 'Store'),
      icon('c', 400, 300, 'Vault'),
      edge('main', 'a', 'b', side + styleA, 'Read'),
      edge('aux', 'a', 'c', 'exitX=0.5;exitY=1;entryX=0;entryY=0.5;' + styleB, 'Secrets'),
      key
        ? `<mxCell id="key" value="${key}" style="text;" vertex="1" parent="1"><mxGeometry x="0" y="500" width="300" height="40" as="geometry"/></mxCell>`
        : '',
    );
  const keyErrors = (xml) => checkLayout(xml).errors.filter((m) => /no key text/.test(m));
  assert.deepEqual(keyErrors(two('strokeWidth=2.5;', 'dashed=1;strokeWidth=1;')), [
    '1 dashed connector (aux) but no key text says what dashed means. Add a key entry such as "Dashed: <meaning>".',
    'Connectors use 2 line weights (1, 2.5) but no key text says what weight means. Add a key entry such as "Heavy: main path".',
  ]);
  assert.deepEqual(keyErrors(two('', 'dashed=1;dashPattern=1 4;')), [
    '1 dotted connector (aux) but no key text says what dotted means. Add a key entry such as "Dotted: <meaning>".',
  ]);
  assert.deepEqual(
    keyErrors(two('strokeWidth=2.5;', 'dashed=1;strokeWidth=1;', 'Heavy: main path&lt;br&gt;Dashed: secrets')),
    [],
  );
});
