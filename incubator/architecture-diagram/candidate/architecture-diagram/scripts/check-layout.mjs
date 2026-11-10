import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  absolute,
  ancestorIds,
  captionBox,
  centreOf,
  containsPoint,
  freeTextBox,
  inside,
  isText,
  overlaps,
  pagesOf,
  plain,
  readDiagram,
  titleBox,
} from './diagram.mjs';
import { isFormatted } from './drawio-format.mjs';
import {
  bendCount,
  crosses,
  directRoutes,
  edgeLabelBox,
  edgeRoute,
  routeContact,
  segments,
  sideAt,
  sideOf,
} from './routes.mjs';

// An element wider than two icons and taller than one, drawn behind others, is a boundary to the reader.
const ICON_SPAN = 120;

// One page as the rules see it: its cells, their page positions, and the boundaries among them.
function pageModel(xml) {
  const cells = readDiagram(xml);
  const { byId, boxes } = absolute(cells);
  const vertices = cells.filter((cell) => boxes.has(cell.id));
  const edges = cells.filter((cell) => cell.edge === '1');
  const page = { cells, byId, boxes, vertices, edges };
  page.boundaries = boundariesOf(page);
  return page;
}

// Errors are faults whatever the design, and each has a fix that keeps the meaning.
// Checks ask a person or agent to look.
export function checkLayout(xml) {
  const errors = [];
  const checks = [];
  if (!isFormatted(xml))
    errors.push(
      "The file is not in draw.io's own layout, which importers such as Lucidchart require. Run finalize.mjs.",
    );
  const pages = pagesOf(xml);
  if (pages.length > 1)
    for (const page of pages) {
      const found = checkPage(page.xml);
      errors.push(...found.errors.map((e) => `Page "${page.name}": ${e}`));
      checks.push(...found.checks.map((c) => `Page "${page.name}": ${c}`));
    }
  else {
    const found = checkPage(xml);
    errors.push(...found.errors);
    checks.push(...found.checks);
  }
  errors.push(...keyAcrossPages(xml));
  errors.push(...pageLinks(xml));
  checks.push(...iconsAcrossPages(xml));
  return { errors: [...new Set(errors)], checks: [...new Set(checks)] };
}

function checkPage(xml) {
  const errors = [];
  const checks = [];
  const page = pageModel(xml);
  const { byId, boxes, vertices, edges } = page;
  const name = (cell) => cell.id;

  if (vertices.length) {
    const left = Math.min(...vertices.map((c) => boxes.get(c.id).x));
    const right = Math.max(...vertices.map((c) => boxes.get(c.id).x + boxes.get(c.id).w));
    const top = Math.min(...vertices.map((c) => boxes.get(c.id).y));
    const bottom = Math.max(...vertices.map((c) => boxes.get(c.id).y + boxes.get(c.id).h));
    const [width, height] = [right - left, bottom - top];
    // A page over 1400 units shrinks below readable text at the usual document width.
    if (width > 1400)
      errors.push(
        `Page is ${Math.round(width)} wide; keep it at most 1400. Draw identical repeated structures once with a count, fold boundary levels, or split the view.`,
      );
    if (height > width)
      checks.push(
        `Page is taller than wide (${Math.round(width)} by ${Math.round(height)}). It will appear small in a document.`,
      );
    else if (width / height > 2.5) checks.push(`Page is very wide (${Math.round(width)} by ${Math.round(height)}).`);
  }

  for (const cell of [...vertices, ...edges]) {
    const size = Number(cell.style.fontSize);
    if (cell.value && size && size < 12) errors.push(`Text smaller than 12 in ${name(cell)}: ${size}.`);
  }

  for (const edge of edges) {
    const { startArrow, endArrow } = edge.style;
    // An oval start marks a port on a boundary; only a real arrowhead points both ways.
    if (startArrow && !['none', 'oval', 'dash'].includes(startArrow) && endArrow !== 'none') {
      errors.push(`Double-headed connector ${name(edge)}. Draw one arrow from the initiator, or two connectors.`);
    }
    // Straight or curved connectors cut across the page; routes must run in lanes, horizontally and vertically.
    if (edge.style.edgeStyle !== 'orthogonalEdgeStyle')
      errors.push(
        `Connector ${name(edge)} is not orthogonal. Set edgeStyle=orthogonalEdgeStyle and route it in its lane.`,
      );
    if (edge.points.length > 3)
      checks.push(`Connector ${name(edge)} has ${edge.points.length} bends. Move an element instead.`);
    const route = [
      boxes.get(edge.source),
      ...edge.points.map((p) => ({ ...p, w: 0, h: 0 })),
      boxes.get(edge.target),
    ].filter(Boolean);
    const line = route.map((b) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 }));
    const ignored = new Set([
      edge.source,
      edge.target,
      ...ancestorIds(byId.get(edge.source) ?? {}, byId),
      ...ancestorIds(byId.get(edge.target) ?? {}, byId),
    ]);
    // Only an explicit route is reliable here: without waypoints, draw.io chooses the path.
    if (edge.points.length) {
      for (const cell of vertices) {
        const ancestors = ancestorIds(cell, byId);
        if (
          ignored.has(cell.id) ||
          isText(cell) ||
          cell.style.container === '1' ||
          ancestors.has(edge.source) ||
          ancestors.has(edge.target)
        )
          continue;
        const b = boxes.get(cell.id);
        if (!b.w || !b.h) continue;
        for (let i = 0; i < line.length - 1; i++) {
          const [p, q] = [line[i], line[i + 1]];
          const segment = {
            x: Math.min(p.x, q.x),
            y: Math.min(p.y, q.y),
            w: Math.abs(p.x - q.x) || 1,
            h: Math.abs(p.y - q.y) || 1,
          };
          if (p.x !== q.x && p.y !== q.y) continue;
          if (overlaps(segment, b)) checks.push(`Connector ${name(edge)} passes over ${name(cell)}.`);
        }
      }
    }
  }

  // A child leaving its parent's box looks like a mistake and misstates membership.
  for (const cell of vertices) {
    const parent = byId.get(cell.parent);
    const box = boxes.get(cell.id);
    const outer = parent && boxes.get(parent.id);
    if (outer && box.w && box.h && !inside(box, outer) && !cell.geometry.relative) {
      errors.push(`${name(cell)} crosses the edge of its parent ${name(parent)}.`);
    }
  }

  // Siblings that overlap without one holding the other cover each other's text or symbol.
  for (const [parent, siblings] of Map.groupBy(
    vertices.filter((c) => boxes.get(c.id).w && boxes.get(c.id).h),
    (c) => c.parent,
  )) {
    for (let i = 0; i < siblings.length; i++) {
      for (let j = i + 1; j < siblings.length; j++) {
        const [a, b] = [boxes.get(siblings[i].id), boxes.get(siblings[j].id)];
        if (overlaps(a, b) && !inside(a, b) && !inside(b, a))
          checks.push(`${name(siblings[i])} and ${name(siblings[j])} overlap in ${parent}.`);
      }
    }
  }

  checks.push(...shortDashes(page));
  checks.push(...labelCollisions(page));
  checks.push(...routeIntegrity(page));
  const crossed = crossings(page);
  errors.push(...crossed.errors);
  checks.push(...crossed.checks);
  errors.push(...boundaryTitles(page));
  errors.push(...sharedSegments(page));
  const key = keyRules(page);
  errors.push(...key.errors);
  checks.push(...key.checks);
  checks.push(...simplerRoutes(page));
  checks.push(...boundaryMembers(page));
  return { errors, checks };
}

// A dashed line too short for three dashes reads as solid, so its kind and key row are lost.
// draw.io scales the dash pattern by the stroke width unless fixDash is set.
function shortDashes({ edges, boxes }) {
  const found = [];
  for (const edge of edges) {
    if (edge.style.dashed !== '1') continue;
    const route = edgeRoute(edge, boxes);
    if (!route) continue;
    const length = route.slice(1).reduce((sum, q, i) => sum + Math.hypot(q.x - route[i].x, q.y - route[i].y), 0);
    const scale = edge.style.fixDash === '1' ? 1 : Number(edge.style.strokeWidth) || 1;
    const period = (edge.style.dashPattern || '3 3').split(' ').reduce((sum, n) => sum + (Number(n) || 0), 0) * scale;
    if (length < 3 * period + 10)
      found.push(
        `Dashed connector ${edge.id} is about ${Math.round(length)} long, too short to show its dashes, so it reads as solid. Move its ends at least ${Math.ceil(3 * period + 10)} apart.`,
      );
  }
  return found;
}

// An overview box links to its detail page with draw.io's page link; a link to a missing page is dead.
export function pageLinks(xml) {
  const pages = pagesOf(xml);
  const ids = new Set(pages.map((p) => p.id));
  return [...xml.matchAll(/\blink="data:page\/id,([^"]*)"/g)]
    .filter((m) => !ids.has(m[1]))
    .map((m) => `A page link points to page id "${m[1]}", which the file does not contain.`);
}

// The same element keeps its symbol on every page, so a reader recognises it across views.
export function iconsAcrossPages(xml) {
  const pages = pagesOf(xml);
  if (pages.length < 2) return [];
  const seen = new Map();
  const found = [];
  for (const page of pages)
    for (const cell of readDiagram(page.xml)) {
      const symbol = cell.style.image || cell.style.resIcon || cell.style.prIcon;
      const caption = plain(cell.value).replace(/\s+/g, ' ').trim().toLowerCase();
      if (cell.vertex !== '1' || !symbol || !caption) continue;
      const first = seen.get(caption);
      if (!first) seen.set(caption, { symbol, page: page.name });
      else if (first.symbol !== symbol)
        found.push(
          `"${caption}" has one symbol on page "${first.page}" and another on page "${page.name}". Draw an element with the same symbol on every page.`,
        );
    }
  return found;
}

// Boundaries are containers and large background areas; membership is geometric, as a reader sees it.
function boundariesOf({ cells, boxes, vertices }) {
  const parents = new Set(cells.map((c) => c.parent));
  return vertices.filter((c) => {
    const b = boxes.get(c.id);
    return !isText(c) && (parents.has(c.id) || c.style.container === '1' || (b.w > 2 * ICON_SPAN && b.h > ICON_SPAN));
  });
}

// Boundaries whose outline a route crosses more often than its ends require: once if one end is inside, never otherwise.
function extraOutlineCrossings(route, edge, boundaries, boxes) {
  const samples = [];
  for (const [p, q] of segments(route)) {
    const steps = Math.max(1, Math.ceil(Math.hypot(q.x - p.x, q.y - p.y) / 4));
    for (let i = 0; i < steps; i++)
      samples.push({ x: p.x + ((q.x - p.x) * i) / steps, y: p.y + ((q.y - p.y) * i) / steps });
  }
  samples.push(route.at(-1));
  const found = [];
  for (const boundary of boundaries) {
    if (boundary.id === edge.source || boundary.id === edge.target) continue;
    const box = boxes.get(boundary.id);
    const [a, b] = [
      containsPoint(box, centreOf(boxes.get(edge.source))),
      containsPoint(box, centreOf(boxes.get(edge.target))),
    ];
    let crossings = 0;
    for (let i = 1; i < samples.length; i++)
      if (containsPoint(box, samples[i]) !== containsPoint(box, samples[i - 1])) crossings++;
    if (crossings > (a === b ? 0 : 1)) found.push({ boundary, inSource: a, inTarget: b });
  }
  return found;
}

// A route may cross a boundary's outline only where its ends require.
// Extra crossings and long detours are reported, because a reader takes every bend and crossing as meaning.
function routeIntegrity({ boxes, edges, boundaries }) {
  const found = [];
  for (const edge of edges) {
    const route = edgeRoute(edge, boxes);
    if (!route) continue;
    for (const { boundary, inSource: a, inTarget: b } of extraOutlineCrossings(route, edge, boundaries, boxes)) {
      found.push(
        a && b
          ? `Connector ${edge.id} leaves ${boundary.id} and re-enters it. Keep it inside the boundary both ends share.`
          : !a && !b
            ? `Connector ${edge.id} passes through ${boundary.id}, which holds neither end.`
            : `Connector ${edge.id} crosses the outline of ${boundary.id} more than once.`,
      );
    }
    const length = segments(route).reduce((sum, [p, q]) => sum + Math.hypot(q.x - p.x, q.y - p.y), 0);
    const [start, end] = [route[0], route.at(-1)];
    const direct = Math.abs(end.x - start.x) + Math.abs(end.y - start.y);
    // A two-bend route around the outside is a deliberate channel; extra bends, or a loop between
    // aligned ends that could join straight, are detours.
    const aligned = Math.min(Math.abs(end.x - start.x), Math.abs(end.y - start.y)) < 10;
    if (length > direct + 80 && (route.length > 4 || aligned))
      found.push(
        `Connector ${edge.id} detours ${Math.round(length - direct)} units beyond the direct route. Move an element or port instead of bending around it.`,
      );
    // A short step between two long parallel runs is a jog: it adds bends that mean nothing.
    const runs = segments(route).map(([p, q]) => Math.hypot(q.x - p.x, q.y - p.y));
    for (let i = 1; i < runs.length - 1; i++)
      if (runs[i] >= 3 && runs[i] < 60 && runs[i - 1] > runs[i] && runs[i + 1] > runs[i]) {
        const [p, q] = segments(route)[i];
        const [a, b] = [segments(route)[i - 1], segments(route)[i + 1]];
        const dir = ([u, v]) => (u.x === v.x ? 'v' : 'h');
        if (dir(a) === dir(b) && dir([p, q]) !== dir(a)) {
          found.push(
            `Connector ${edge.id} has a ${Math.round(runs[i])}-unit jog. Align its ends so that it runs straight.`,
          );
          break;
        }
      }
  }
  return found;
}

// Connectors carry the same meaning when their labels, ignoring step numbers, and their line styles match.
// An unlabelled connector states no meaning, so it never shares one.
const meaningOf = (edge) => ({
  label: plain(edge.value)
    .replace(/^[A-Za-z]?\d+[.):]?\s*/, '')
    .toLowerCase(),
  dashed: edge.style.dashed === '1',
  width: Number(edge.style.strokeWidth) || 1,
});
function sameMeaning(e, f) {
  const [a, b] = [meaningOf(e), meaningOf(f)];
  return a.label !== '' && a.label === b.label && a.dashed === b.dashed && a.width === b.width;
}

// A run shared by connectors of different meaning merges them into one line for the reader: an error.
function sharedSegments({ edges, boxes }) {
  const found = [];
  const routed = edges.map((edge) => ({ edge, route: edgeRoute(edge, boxes) })).filter((r) => r.route);
  for (let i = 0; i < routed.length; i++)
    for (let j = i + 1; j < routed.length; j++) {
      const [a, b] = [routed[i], routed[j]];
      const { shared } = routeContact(a.route, b.route);
      if (shared > 10 && !sameMeaning(a.edge, b.edge))
        found.push(
          `Connectors ${a.edge.id} and ${b.edge.id} have different meanings but share a ${Math.round(shared)}-unit segment, so they read as one connection. Give each its own port and route.`,
        );
    }
  return found;
}

// Only three connector encodings carry a meaning readers share: a line relates, a solid line is the
// direct relation, and one arrowhead gives direction. Everything else is a convention a key must name.
// One kind of each: solid and dashed lines, two weights, one filled arrowhead. See the connector
// encoding research. Vendor boundary styles are the vendor's notation; any other boundary is a thin solid
// outline whose title names its kind, so a dashed, coloured or heavier custom boundary needs a key too.
const ARROWS = new Set(['block', 'classic', 'blockThin', 'classicThin']);
const COLOUR_WORDS = /colou?r|red|blue|green|orange|purple|grey|gray|black|yellow|pink|teal/;
function keyRules({ vertices, edges, boxes, boundaries }) {
  const found = [];
  const checks = [];
  // The key is a native table; its own text and its rows' and cells' text count.
  const byParent = Map.groupBy(vertices, (c) => c.parent);
  const withDescendants = (c) => [c, ...(byParent.get(c.id) ?? []).flatMap(withDescendants)];
  const tables = vertices.filter((c) => c.style.shape === 'table');
  const text = tables
    .flatMap(withDescendants)
    .map((c) => plain(c.value).toLowerCase())
    .join('\n');
  const declared = /\b(uml|archimate|bpmn|sysml)\b|notation/.test(text);
  const ids = (list) => list.map((c) => c.id).join(', ');
  const dashed = (e) => e.style.dashed === '1';
  const dotted = (e) => dashed(e) && /^\s*[0-2](\.\d+)?\s/.test(e.style.dashPattern ?? '');
  const dots = edges.filter(dotted);
  if (dots.length)
    found.push(
      `Dotted connectors (${ids(dots)}): dotted has no shared meaning and readers confuse it with dashed. Use dashed for auxiliary relationships.`,
    );
  const widths = [...new Set(edges.map((e) => Number(e.style.strokeWidth) || 1))].sort((a, b) => a - b);
  if (widths.length > 1)
    found.push(
      `Connectors use ${widths.length} line weights (${widths.join(', ')}). Readers barely tell weights apart: give every connector one weight, and show the main path by its place and step numbers.`,
    );
  const colours = [...new Set(edges.map((e) => (e.style.strokeColor ?? '').toLowerCase()).filter(Boolean))];
  // A key is needed only when connectors come in two or more kinds; one kind of line explains itself.
  const kinds = new Set(
    edges.map((e) =>
      [dashed(e), Number(e.style.strokeWidth) || 1, (e.style.strokeColor ?? '').toLowerCase()].join('|'),
    ),
  );
  const styled = kinds.size > 1;
  if (kinds.size > 2)
    checks.push(
      `Connectors come in ${kinds.size} kinds. Two, solid for runtime and dashed for auxiliary, carry most views: first try splitting the view; keep any extra kind in the key with the same meaning across the split views.`,
    );
  if (styled && !tables.length)
    found.push(
      'Connectors mix styles but the view has no key table. Add a native draw.io table titled "Key" with one row per style: a sample line and its meaning.',
    );
  if (styled) {
    const needs = [
      { what: 'solid', key: /solid/, used: edges.some((e) => !dashed(e)), example: 'Solid: runtime call' },
      { what: 'dashed', key: /dash/, used: edges.some(dashed), example: 'Dashed: <meaning>' },
      { what: 'colour', key: COLOUR_WORDS, used: colours.length > 1, example: 'Red: <meaning>' },
    ];
    for (const { what, key, used, example } of needs)
      if (used && !key.test(text))
        found.push(
          `Connectors mix styles, but no key text says what ${what} means. List every style the view uses in the key, such as "${example}", with a short sample line beside each.`,
        );
  }
  if (!declared) {
    // Any end beyond the one filled arrowhead is an added kind: the key must name it.
    const endKind = (e) => {
      const start = e.style.startArrow;
      const end = e.style.endArrow ?? 'classic';
      if (start && start !== 'none')
        return { name: 'two-headed or start-marked line', key: /both|two.?way|double|start/ };
      if (end === 'none') return { name: 'line without arrowhead', key: /no arrow|undirected|without arrow/ };
      if (['oval', 'circle', 'circlePlus'].includes(end)) return { name: 'circle end', key: /circle|\bdot\b/ };
      if (/diamond/i.test(end)) return { name: 'diamond end', key: /diamond/ };
      if (!ARROWS.has(end) || e.style.endFill === '0') return { name: `${end} end`, key: /open|hollow|empty/ };
      return null;
    };
    const unexplained = edges.map((e) => ({ e, kind: endKind(e) })).filter(({ kind }) => kind && !kind.key.test(text));
    const marks = vertices.filter((c) => {
      const b = boxes.get(c.id);
      return c.style.shape === 'ellipse' && !plain(c.value) && b && b.w <= 24 && b.h <= 24;
    });
    if (unexplained.length || (marks.length && !/circle|\bdot\b/.test(text)))
      found.push(
        `${ids([...unexplained.map(({ e }) => e), ...(/circle|\bdot\b/.test(text) ? [] : marks)])} use an end, marker or undirected line other than one filled arrowhead from initiator to callee, and the key does not explain it. Use the filled arrowhead; if an extra kind is needed, first try splitting the view, then add a key row for it.`,
      );
  }
  const vendor = (c) => String(c.style.shape ?? '').startsWith('mxgraph.aws4.group') || 'grIcon' in c.style;
  const custom = boundaries.filter((c) => !vendor(c) && c.style.strokeColor !== 'none' && !isText(c));
  const dashedBoundaries = custom.filter((c) => c.style.dashed === '1');
  if (dashedBoundaries.length && !/dash/.test(text))
    found.push(
      `Boundaries ${ids(dashedBoundaries)} have dashed outlines, which no vendor style defines here. Draw them as thin solid outlines named by their titles, or explain the dashes in the key.`,
    );
  const boundaryColours = [...new Set(custom.map((c) => (c.style.strokeColor ?? '').toLowerCase()).filter(Boolean))];
  if (boundaryColours.length > 1 && !COLOUR_WORDS.test(text))
    found.push(
      `Boundaries use ${boundaryColours.length} outline colours (${boundaryColours.join(', ')}). Use one neutral outline and let titles name the kind, or explain the colours in the key.`,
    );
  const boundaryWidths = [...new Set(custom.map((c) => Number(c.style.strokeWidth) || 1))];
  if (boundaryWidths.length > 1)
    found.push(
      `Boundaries use ${boundaryWidths.length} outline weights (${boundaryWidths.sort((a, b) => a - b).join(', ')}). Give every boundary outline one weight; nesting and titles show the hierarchy.`,
    );
  return { errors: found, checks };
}

// Views split from one diagram share one notation: a key entry means the same on every page.
export function keyAcrossPages(xml) {
  const pages = pagesOf(xml).map((page) => page.xml);
  if (pages.length < 2) return [];
  const seen = new Map();
  const found = [];
  for (const [index, page] of pages.entries()) {
    const cells = readDiagram(page);
    const byParent = Map.groupBy(cells, (c) => c.parent);
    const withDescendants = (c) => [c, ...(byParent.get(c.id) ?? []).flatMap(withDescendants)];
    const rows = cells
      .filter((c) => c.style.shape === 'table')
      .flatMap(withDescendants)
      .flatMap((c) => plain(c.value).split('\n'))
      .map((line) => line.match(/^\s*([^:]{1,40}):\s*(.+)$/))
      .filter(Boolean);
    for (const [, entry, meaning] of rows) {
      const k = entry.trim().toLowerCase();
      const m = meaning.trim().toLowerCase();
      if (seen.has(k) && seen.get(k).meaning !== m)
        found.push(
          `Key entry "${entry.trim()}" means "${seen.get(k).meaning}" on page ${seen.get(k).page} but "${m}" on page ${index + 1}. Split views share one notation; give each style one meaning across pages.`,
        );
      else if (!seen.has(k)) seen.set(k, { meaning: m, page: index + 1 });
    }
  }
  return found;
}

function crossings({ edges, boxes }) {
  const errors = [];
  const checks = [];
  const routed = edges.map((edge) => ({ edge, route: edgeRoute(edge, boxes) })).filter((r) => r.route);
  for (let i = 0; i < routed.length; i++)
    for (let j = i + 1; j < routed.length; j++) {
      const [a, b] = [routed[i], routed[j]];
      const { crossed, shared } = routeContact(a.route, b.route);
      const [e, f] = [a.edge, b.edge];
      const sameSide =
        (e.source === f.source && sideOf(e.style.exitX, e.style.exitY) === sideOf(f.style.exitX, f.style.exitY)) ||
        (e.target === f.target && sideOf(e.style.entryX, e.style.entryY) === sideOf(f.style.entryX, f.style.entryY));
      if (crossed && sameSide && e.style.exitX !== undefined && f.style.exitX !== undefined)
        errors.push(`Connectors ${e.id} and ${f.id} share a side of one element and cross. Swap their ports.`);
      else if (crossed)
        checks.push(
          `Connectors ${e.id} and ${f.id} cross. Reorder ports, move an element, or route one around the outside.`,
        );
      if (shared > 10 && sameMeaning(e, f))
        checks.push(
          `Connectors ${e.id} and ${f.id} share a ${Math.round(shared)}-unit segment. That reads as one relationship; keep it only if they are one.`,
        );
    }
  return { errors, checks };
}

// Every boundary title sits in the same place, so a reader finds each scope's name the same way.
// Only a corner icon, when the boundary has one, comes before the title.
const TABLE_SHAPES = new Set(['table', 'tableRow', 'partialRectangle']);
function boundaryTitles({ boundaries }) {
  return boundaries
    .filter((c) => plain(c.value) && !TABLE_SHAPES.has(c.style.shape))
    .filter((c) => c.style.align !== 'left' || c.style.verticalAlign !== 'top')
    .map(
      (c) =>
        `Boundary ${c.id} has its title away from the top left. Set align=left;verticalAlign=top, as find-icon.mjs --boundary returns.`,
    );
}

// A boundary that represents a service is that service: a member named like the boundary repeats it.
// The small icon in a boundary's top-left corner marks the boundary and is not a member.
// Each nested outline is one more question for the reader; past three, the view should split.
const VENDOR_WORDS = new Set(['amazon', 'aws', 'azure', 'microsoft', 'google', 'cloud', 'gcp']);
const nameWords = (value) =>
  plain(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w && !VENDOR_WORDS.has(w));
function boundaryMembers({ byId, boxes, vertices, boundaries }) {
  const found = [];
  const ids = new Set(boundaries.map((c) => c.id));
  for (const cell of vertices) {
    const boundary = byId.get(cell.parent);
    if (!boundary || !ids.has(boundary.id) || ids.has(cell.id) || isText(cell)) continue;
    const [box, outer] = [boxes.get(cell.id), boxes.get(boundary.id)];
    const marker = box.w <= 40 && box.h <= 40 && box.x - outer.x <= 12 && box.y - outer.y <= 12;
    const [mine, theirs] = [nameWords(cell.value), new Set(nameWords(boundary.value))];
    if (!marker && mine.length && mine.every((w) => theirs.has(w)))
      found.push(
        `${cell.id} repeats the boundary ${boundary.id} it sits in. Mark the boundary with its icon at the top left and attach its connectors to the boundary instead.`,
      );
  }
  // Light fills without a stroke separate without adding an outline, so only outlined boundaries count.
  const outlined = (c) => ids.has(c.id) && c.style.strokeColor !== 'none';
  let deepest = null;
  for (const cell of vertices) {
    let depth = outlined(cell) ? 1 : 0;
    for (let c = byId.get(cell.parent); c; c = byId.get(c.parent)) if (outlined(c)) depth++;
    if (depth > 3 && (!deepest || depth > deepest.depth)) deepest = { id: cell.id, depth };
  }
  if (deepest)
    found.push(
      `Boundaries nest ${deepest.depth} deep at ${deepest.id}. Keep three outlines in one view; fold a level or split the detail into its own view.`,
    );
  return found;
}

// Bends the reader takes as meaning should come from the layout, not from avoiding text.
// When ends could be joined straight, or with one bend, the extra bends of the actual route are
// reported if that simpler route is clear, or blocked only by movable text. A simpler route through
// another element or its caption, an extra boundary outline or a new crossing is blocked, so going around
// is reasonable.
const turns = (n) => (n === 1 ? 'bends once' : `bends ${n} times`);

function simplerRoutes(page) {
  const { byId, boxes, vertices, edges, boundaries } = page;
  const found = [];
  const routes = new Map(edges.map((edge) => [edge.id, edgeRoute(edge, boxes)]));
  const texts = textBoxes(page, routes);
  const solids = vertices.filter((c) => {
    const b = boxes.get(c.id);
    return !isText(c) && !boundaries.includes(c) && b.w && b.h;
  });
  const shrink = (b) => ({ x: b.x + 1, y: b.y + 1, w: b.w - 2, h: b.h - 2 });
  for (const edge of edges) {
    const route = routes.get(edge.id);
    const [s, t] = [boxes.get(edge.source), boxes.get(edge.target)];
    if (!route || !s || !t) continue;
    const ends = [edge.source, edge.target];
    const [sourceUp, targetUp] = ends.map((id) => ancestorIds(byId.get(id), byId));
    if (sourceUp.has(edge.target) || targetUp.has(edge.source)) continue;
    const direct = directRoutes(s, t);
    const bends = bendCount(route);
    if (!direct || bends <= direct.bends) continue;
    const others = edges.filter((e) => e !== edge && routes.get(e.id));
    const judge = (candidate) => {
      const parts = segments(candidate);
      const hits = (b) => parts.some((part) => crosses(part, shrink(b)));
      const blocked =
        solids.some((c) => {
          if (ends.includes(c.id) || sourceUp.has(c.id) || targetUp.has(c.id)) return false;
          const up = ancestorIds(c, byId);
          return !ends.some((id) => up.has(id)) && hits(boxes.get(c.id));
        }) ||
        extraOutlineCrossings(candidate, edge, boundaries, boxes).length > 0 ||
        others.some((other) => {
          const now = routeContact(route, routes.get(other.id));
          const then = routeContact(candidate, routes.get(other.id));
          return (then.crossed && !now.crossed) || (then.shared > 10 && now.shared <= 10);
        });
      // A caption or boundary title belongs to its element; a route through it is blocked. Connector labels
      // and free text can move, so a detour around them is the problem to report.
      const text = texts.filter((x) => x.owner !== edge.id && hits(x.box));
      if (blocked || text.some((x) => x.kind === 'caption' || x.kind === 'title')) return null;
      return text;
    };
    const judged = direct.routes.map((candidate) => ({ candidate, text: judge(candidate) })).filter((r) => r.text);
    const clear = judged.find((r) => !r.text.length);
    const kind = direct.bends ? 'one-bend' : 'straight';
    if (clear) {
      const [p, q] = [clear.candidate[0], clear.candidate.at(-1)];
      found.push(
        `Connector ${edge.id} ${turns(bends)}, but a ${kind} route is clear: leave the ${sideAt(p, s)} of ${edge.source} and enter the ${sideAt(q, t)} of ${edge.target}.`,
      );
    } else if (judged.length)
      found.push(
        `Connector ${edge.id} ${turns(bends)} to avoid the ${describe(judged[0].text[0])}. A bend around text reads as part of the route; move an element or the text so that a ${kind} route is clear.`,
      );
  }
  return found;
}

// Estimated text boxes of captions, boundary titles, free text and connector labels.
function textBoxes({ cells, boxes, vertices, edges }, routes) {
  const parents = new Set(cells.map((c) => c.parent));
  const texts = [];
  for (const cell of vertices) {
    const box = boxes.get(cell.id);
    const caption = captionBox(cell, box);
    if (caption) texts.push({ kind: 'caption', owner: cell.id, box: caption });
    const title = titleBox(cell, box, parents.has(cell.id));
    if (title) texts.push({ kind: 'title', owner: cell.id, box: title });
    const free = freeTextBox(cell, box);
    if (free) texts.push({ kind: 'text', owner: cell.id, box: free });
  }
  for (const edge of edges) {
    const label = edgeLabelBox(edge, routes.get(edge.id));
    if (label) texts.push({ kind: 'label', owner: edge.id, box: label });
  }
  return texts;
}
const describe = (t) =>
  ({ label: `connector label ${t.owner}`, title: `title of ${t.owner}`, text: `text ${t.owner}` })[t.kind] ??
  `caption of ${t.owner}`;

// Captions, boundary titles and connector labels must not cover each other or a line.
function labelCollisions(page) {
  const { cells, byId, boxes, vertices, edges } = page;
  const found = [];
  const parents = new Set(cells.map((c) => c.parent));
  const routes = new Map(edges.map((edge) => [edge.id, edgeRoute(edge, boxes)]));
  const texts = textBoxes(page, routes);

  for (let i = 0; i < texts.length; i++)
    for (let j = i + 1; j < texts.length; j++) {
      const [a, b] = [texts[i], texts[j]];
      if (a.owner !== b.owner && overlaps(a.box, b.box))
        found.push(`The ${describe(a)} and the ${describe(b)} overlap or nearly touch.`);
    }
  // A caption or title must not sit on another icon, and text must not straddle an outline:
  // that reads as belonging to both sides. Text wholly inside a boundary sits on its background.
  for (const t of texts)
    for (const cell of vertices) {
      const box = boxes.get(cell.id);
      if (cell.id === t.owner || isText(cell) || !box.w || !box.h || !overlaps(t.box, box)) continue;
      if (page.boundaries.includes(cell)) {
        if (!inside(t.box, box)) found.push(`The ${describe(t)} crosses the outline of ${cell.id}.`);
      } else if (t.kind === 'label' || !ancestorIds(byId.get(t.owner), byId).has(cell.id))
        found.push(`The ${describe(t)} covers ${cell.id}.`);
    }
  // A connector label belongs on its own line; set apart, it could label any line. At a bend it
  // reads as hanging from the corner rather than naming the segment.
  for (const t of texts.filter((x) => x.kind === 'label')) {
    const route = routes.get(t.owner);
    if (!route) continue;
    const near = { x: t.box.x - 20, y: t.box.y - 20, w: t.box.w + 40, h: t.box.h + 40 };
    if (!segments(route).some((s) => crosses(s, near))) found.push(`The ${describe(t)} sits away from its connector.`);
    else if (route.slice(1, -1).some((p) => overlaps({ x: p.x - 3, y: p.y - 3, w: 6, h: 6 }, t.box)))
      found.push(`The ${describe(t)} sits on a bend. Put it on a straight segment.`);
  }
  // A connector must not run through any caption or title, including those of its own ends.
  for (const edge of edges) {
    const route = routes.get(edge.id);
    if (!route) continue;
    for (const t of texts) {
      if (t.owner === edge.id) continue;
      if (segments(route).some((s) => crosses(s, t.box)))
        found.push(`Connector ${edge.id} runs through the ${describe(t)}.`);
    }
  }
  return found;
}

if (
  process.argv[1] &&
  existsSync(process.argv[1]) &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node check-layout.mjs <diagram.drawio>');
    process.exitCode = 2;
  } else {
    const { errors, checks } = checkLayout(readFileSync(file, 'utf8'));
    for (const error of errors) console.error(`Error: ${error}`);
    for (const check of checks) console.error(`Check: ${check}`);
    console.log(
      `Layout: ${errors.length} errors, ${checks.length} items to check. Geometry only; inspect the image too.`,
    );
    process.exitCode = errors.length ? 1 : 0;
  }
}
