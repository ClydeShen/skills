import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { isFormatted } from './drawio-format.mjs';

const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
const styleOf = (style = '') =>
  Object.fromEntries(
    style
      .split(';')
      .filter(Boolean)
      .map((part) => part.split('=')),
  );

// A small reader for uncompressed draw.io XML, so the installed package needs no dependencies.
export function readDiagram(xml) {
  const cells = [];
  let wrapper = null;
  let current = null;
  let inPoints = false;
  for (const [tag, closing, name] of xml.matchAll(
    /<(\/?)(object|UserObject|mxCell|mxGeometry|Array|mxPoint)\b[^>]*>/g,
  )) {
    if (closing) {
      if (name === 'object' || name === 'UserObject') wrapper = null;
      if (name === 'Array') inPoints = false;
      continue;
    }
    const a = attributes(tag);
    if (name === 'object' || name === 'UserObject') wrapper = a;
    else if (name === 'mxCell') {
      current = {
        ...a,
        ...(wrapper ? { id: wrapper.id, value: wrapper.label ?? a.value } : {}),
        style: styleOf(a.style),
        points: [],
      };
      cells.push(current);
    } else if (name === 'mxGeometry' && current) {
      current.geometry = {
        x: +a.x || 0,
        y: +a.y || 0,
        w: +a.width || 0,
        h: +a.height || 0,
        relative: a.relative === '1',
      };
    } else if (name === 'Array') inPoints = a.as === 'points';
    else if (name === 'mxPoint' && inPoints && current) current.points.push({ x: +a.x || 0, y: +a.y || 0 });
    else if (name === 'mxPoint' && a.as === 'offset' && current) current.offset = { x: +a.x || 0, y: +a.y || 0 };
  }
  return cells;
}

function absolute(cells) {
  const byId = new Map(cells.map((cell) => [cell.id, cell]));
  const origin = (cell, seen = new Set()) => {
    const parent = byId.get(cell.parent);
    if (!parent?.geometry || parent.edge || seen.has(parent.id)) return { x: 0, y: 0 };
    seen.add(parent.id);
    const o = origin(parent, seen);
    return { x: o.x + parent.geometry.x, y: o.y + parent.geometry.y };
  };
  const boxes = new Map();
  for (const cell of cells) {
    if (cell.vertex !== '1' || !cell.geometry) continue;
    const o = origin(cell);
    boxes.set(cell.id, { x: o.x + cell.geometry.x, y: o.y + cell.geometry.y, w: cell.geometry.w, h: cell.geometry.h });
  }
  return { byId, boxes };
}

const inside = (a, b) => a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h;
const overlaps = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
const ancestorIds = (cell, byId) => {
  const ids = new Set();
  for (let c = byId.get(cell.parent); c && !ids.has(c.id); c = byId.get(c.parent)) ids.add(c.id);
  return ids;
};
const isText = (cell) => 'text' in cell.style || 'edgeLabel' in cell.style;

// Text geometry is estimated, not measured: Helvetica averages about 0.5 em per character.
const plain = (value = '') =>
  value
    .replace(/&lt;br\s*\/?&gt;|<br\s*\/?>/gi, '\n')
    .replace(/&lt;[^&]*&gt;|<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .trim();
export function textSize(value, fontSize = 11, wrap = Infinity) {
  const em = fontSize * 0.5;
  let width = 0;
  let lines = 0;
  for (const paragraph of plain(value).split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const next = line ? `${line} ${word}` : word;
      if (line && next.length * em > wrap) {
        width = Math.max(width, line.length * em);
        lines++;
        line = word;
      } else line = next;
    }
    width = Math.max(width, line.length * em);
    lines++;
  }
  return { w: Math.min(width, wrap), h: lines * fontSize * 1.2 };
}

// The caption of an icon whose label sits outside it, below or beside.
function captionBox(cell, box) {
  const text = plain(cell.value);
  if (!text || isText(cell) || cell.style.container === '1') return null;
  const { verticalLabelPosition: vertical, labelPosition: horizontal } = cell.style;
  if (vertical !== 'bottom' && vertical !== 'top' && horizontal !== 'right' && horizontal !== 'left') return null;
  const fontSize = Number(cell.style.fontSize) || 11;
  const wrapWidth = Number(cell.style.labelWidth) || (cell.style.whiteSpace === 'wrap' ? box.w : Infinity);
  const size = textSize(text, fontSize, wrapWidth);
  if (vertical === 'bottom' || vertical === 'top') {
    const y = vertical === 'bottom' ? box.y + box.h + 2 : box.y - 2 - size.h;
    return { x: box.x + box.w / 2 - size.w / 2, y, w: size.w, h: size.h };
  }
  const x = horizontal === 'right' ? box.x + box.w + 2 : box.x - 2 - size.w;
  return { x, y: box.y + box.h / 2 - size.h / 2, w: size.w, h: size.h };
}

// A standalone text cell, such as a caption drawn separately: its text, aligned within the cell.
function freeTextBox(cell, box) {
  const text = plain(cell.value);
  if (!text || !('text' in cell.style)) return null;
  const size = textSize(text, Number(cell.style.fontSize) || 11, cell.style.whiteSpace === 'wrap' ? box.w : Infinity);
  const x = { left: box.x, right: box.x + box.w - size.w }[cell.style.align] ?? box.x + box.w / 2 - size.w / 2;
  const y = { top: box.y, bottom: box.y + box.h - size.h }[cell.style.verticalAlign] ?? box.y + box.h / 2 - size.h / 2;
  return { x, y, w: size.w, h: size.h };
}

// The title of a frame drawn inside its top edge.
function titleBox(cell, box, holdsChildren) {
  const text = plain(cell.value);
  if (!text || !holdsChildren || cell.style.verticalAlign !== 'top') return null;
  const fontSize = Number(cell.style.fontSize) || 11;
  const size = textSize(text, fontSize, box.w - 8);
  const spacing = Number(cell.style.spacing) || 2;
  const left = box.x + spacing + (Number(cell.style.spacingLeft) || 0);
  const x = cell.style.align === 'center' ? box.x + box.w / 2 - size.w / 2 : left;
  return { x, y: box.y + spacing + (Number(cell.style.spacingTop) || 0), w: size.w, h: size.h };
}

// The route draw.io takes when both ports are fixed; elbows follow the side each end leaves from.
// Without ports and waypoints, draw.io joins facing sides of aligned elements; other routes are its choice.
const ICON_SPAN = 120;
function defaultPorts(a, b, points) {
  if (points.length) return {};
  const columns = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const rows = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  if (columns > 0) {
    const x = (Math.max(a.x, b.x) + columns / 2 - a.x) / a.w;
    const below = b.y > a.y;
    return { exitX: x, exitY: below ? 1 : 0, entryX: (a.x + x * a.w - b.x) / b.w, entryY: below ? 0 : 1 };
  }
  if (rows > 0) {
    const y = (Math.max(a.y, b.y) + rows / 2 - a.y) / a.h;
    const right = b.x > a.x;
    return { exitX: right ? 1 : 0, exitY: y, entryX: right ? 0 : 1, entryY: (a.y + y * a.h - b.y) / b.h };
  }
  return {};
}
function edgeRoute(edge, boxes) {
  const [source, target] = [boxes.get(edge.source), boxes.get(edge.target)];
  if (!source || !target) return null;
  const s = { ...defaultPorts(source, target, edge.points), ...edge.style };
  if (s.exitX === undefined || s.entryX === undefined) return null;
  const port = (b, x, y) => ({
    x: b.x + Number(x) * b.w,
    y: b.y + Number(y) * b.h,
    side: Number(x) === 0 || Number(x) === 1,
  });
  const start = port(source, s.exitX, s.exitY);
  const end = port(target, s.entryX, s.entryY);
  const route = [start];
  // A port on a left or right side leaves horizontally; on the top or bottom, vertically.
  let horizontal = start.side;
  for (const q of [...edge.points, end]) {
    const p = route.at(-1);
    // draw.io treats ends within a couple of units as aligned and draws them straight.
    if (Math.abs(p.x - q.x) < 2 || Math.abs(p.y - q.y) < 2) horizontal = Math.abs(p.y - q.y) < 2;
    else if (q === end && end.side === horizontal) {
      // Facing ports that are not level: draw.io steps across halfway, making a Z.
      const mid = horizontal ? { x: (p.x + q.x) / 2 } : { y: (p.y + q.y) / 2 };
      route.push(horizontal ? { x: mid.x, y: p.y } : { x: p.x, y: mid.y });
      route.push(horizontal ? { x: mid.x, y: q.y } : { x: q.x, y: mid.y });
    } else {
      route.push(horizontal ? { x: q.x, y: p.y } : { x: p.x, y: q.y });
      horizontal = !horizontal;
    }
    route.push(q);
  }
  return route.map(({ x, y }) => ({ x, y }));
}

function segments(route) {
  return route.slice(1).map((q, i) => [route[i], q]);
}

// draw.io places an edge label at x in [-1, 1] along the whole path, then shifts it by the offset.
function edgeLabelBox(edge, route) {
  const text = plain(edge.value);
  if (!text || !route) return null;
  const lengths = segments(route).map(([p, q]) => Math.hypot(q.x - p.x, q.y - p.y));
  const total = lengths.reduce((a, b) => a + b, 0);
  let distance = (((edge.geometry?.x ?? 0) + 1) / 2) * total;
  let at = route[0];
  for (const [i, [p, q]] of segments(route).entries()) {
    if (distance <= lengths[i] || i === lengths.length - 1) {
      const t = lengths[i] ? Math.min(1, distance / lengths[i]) : 0;
      at = { x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t };
      break;
    }
    distance -= lengths[i];
  }
  const fontSize = Number(edge.style.fontSize) || 11;
  const size = textSize(text, fontSize, Number(edge.style.labelWidth) || Infinity);
  const x = at.x + (edge.offset?.x ?? 0) - size.w / 2 - 2;
  const y = at.y + (edge.offset?.y ?? 0) - size.h / 2 - 1;
  return { x, y, w: size.w + 4, h: size.h + 2 };
}

const crosses = ([p, q], b) =>
  overlaps(
    { x: Math.min(p.x, q.x), y: Math.min(p.y, q.y), w: Math.abs(p.x - q.x) || 1, h: Math.abs(p.y - q.y) || 1 },
    b,
  );

// Errors are faults whatever the design; warnings ask a person or agent to look.
export function checkLayout(xml) {
  const errors = [];
  const warnings = [];
  if (!isFormatted(xml))
    errors.push(
      "The file is not in draw.io's own layout, which importers such as Lucidchart require. Run finalize.mjs.",
    );
  const cells = readDiagram(xml);
  const { byId, boxes } = absolute(cells);
  const name = (cell) => cell.id;
  const vertices = cells.filter((cell) => boxes.has(cell.id));
  const edges = cells.filter((cell) => cell.edge === '1');

  if (vertices.length) {
    const left = Math.min(...vertices.map((c) => boxes.get(c.id).x));
    const right = Math.max(...vertices.map((c) => boxes.get(c.id).x + boxes.get(c.id).w));
    const top = Math.min(...vertices.map((c) => boxes.get(c.id).y));
    const bottom = Math.max(...vertices.map((c) => boxes.get(c.id).y + boxes.get(c.id).h));
    const [width, height] = [right - left, bottom - top];
    if (width > 1600)
      warnings.push(
        `Page is ${Math.round(width)} wide. Over 1600, split the view; its text will be small in a document.`,
      );
    if (height > width)
      warnings.push(
        `Page is taller than wide (${Math.round(width)} by ${Math.round(height)}). It will appear small in a document.`,
      );
    else if (width / height > 2.5) warnings.push(`Page is very wide (${Math.round(width)} by ${Math.round(height)}).`);
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
    if (edge.points.length > 3)
      warnings.push(`Connector ${name(edge)} has ${edge.points.length} bends. Move an element instead.`);
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
        const within = ancestorIds(cell, byId);
        if (
          ignored.has(cell.id) ||
          isText(cell) ||
          cell.style.container === '1' ||
          within.has(edge.source) ||
          within.has(edge.target)
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
          if (overlaps(segment, b)) warnings.push(`Connector ${name(edge)} passes over ${name(cell)}.`);
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
          warnings.push(`${name(siblings[i])} and ${name(siblings[j])} overlap in ${parent}.`);
      }
    }
  }

  const widths = edges.map((edge) => Number(edge.style.strokeWidth) || 1);
  const heaviest = Math.max(1, ...widths);
  if (edges.length > 3 && heaviest === Math.min(...widths))
    warnings.push('All connectors have the same weight. Make the main path the heaviest.');
  warnings.push(...labelCollisions(cells, byId, boxes, vertices, edges));
  warnings.push(...routeIntegrity(cells, boxes, vertices, edges));
  warnings.push(...simplerRoutes(cells, byId, boxes, vertices, edges));
  warnings.push(...stepOrder(edges, boxes));
  return { errors: [...new Set(errors)], warnings: [...new Set(warnings)] };
}

// Regions are frames and large background areas; membership is geometric, as a reader sees it.
function regionsOf(cells, boxes, vertices) {
  const parents = new Set(cells.map((c) => c.parent));
  return vertices.filter((c) => {
    const b = boxes.get(c.id);
    return !isText(c) && (parents.has(c.id) || c.style.container === '1' || (b.w > 2 * ICON_SPAN && b.h > ICON_SPAN));
  });
}

const within = (p, b) => p.x > b.x && p.x < b.x + b.w && p.y > b.y && p.y < b.y + b.h;
const centreOf = (b) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });

// Regions whose outline a route crosses more often than its ends require: once if one end is inside, never otherwise.
function extraOutlineCrossings(route, edge, regions, boxes) {
  const samples = [];
  for (const [p, q] of segments(route)) {
    const steps = Math.max(1, Math.ceil(Math.hypot(q.x - p.x, q.y - p.y) / 4));
    for (let i = 0; i < steps; i++)
      samples.push({ x: p.x + ((q.x - p.x) * i) / steps, y: p.y + ((q.y - p.y) * i) / steps });
  }
  samples.push(route.at(-1));
  const found = [];
  for (const region of regions) {
    if (region.id === edge.source || region.id === edge.target) continue;
    const box = boxes.get(region.id);
    const [a, b] = [within(centreOf(boxes.get(edge.source)), box), within(centreOf(boxes.get(edge.target)), box)];
    let crossings = 0;
    for (let i = 1; i < samples.length; i++) if (within(samples[i], box) !== within(samples[i - 1], box)) crossings++;
    if (crossings > (a === b ? 0 : 1)) found.push({ region, inSource: a, inTarget: b });
  }
  return found;
}

// A route may cross a region's outline only where its ends require.
// Extra crossings and long detours are reported, because a reader takes every bend and crossing as meaning.
function routeIntegrity(cells, boxes, vertices, edges) {
  const found = [];
  const regions = regionsOf(cells, boxes, vertices);
  for (const edge of edges) {
    const route = edgeRoute(edge, boxes);
    if (!route) continue;
    for (const { region, inSource: a, inTarget: b } of extraOutlineCrossings(route, edge, regions, boxes)) {
      found.push(
        a && b
          ? `Connector ${edge.id} leaves ${region.id} and re-enters it. Keep it inside the region both ends share.`
          : !a && !b
            ? `Connector ${edge.id} passes through ${region.id}, which holds neither end.`
            : `Connector ${edge.id} crosses the outline of ${region.id} more than once.`,
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
  found.push(...crossings(edges, boxes));
  return found;
}

const sideOf = (x, y) => (Number(x) === 0 ? 'left' : Number(x) === 1 ? 'right' : Number(y) === 0 ? 'top' : 'bottom');

// Connectors that cross or share a segment make the reader guess which line continues where.
// Two leaving the same side of one element and crossing each other only need their ports swapped.
// Whether two orthogonal routes cross, and how long they run on top of each other.
function routeContact(first, second) {
  const vertical = ([p, q]) => p.x === q.x;
  let crossed = false;
  let shared = 0;
  for (const s of segments(first))
    for (const t of segments(second)) {
      if (vertical(s) !== vertical(t)) {
        const [v, h] = vertical(s) ? [s, t] : [t, s];
        const [x, y] = [v[0].x, h[0].y];
        if (
          x > Math.min(h[0].x, h[1].x) + 1 &&
          x < Math.max(h[0].x, h[1].x) - 1 &&
          y > Math.min(v[0].y, v[1].y) + 1 &&
          y < Math.max(v[0].y, v[1].y) - 1
        )
          crossed = true;
      } else {
        const axis = vertical(s) ? 'x' : 'y';
        const along = vertical(s) ? 'y' : 'x';
        if (Math.abs(s[0][axis] - t[0][axis]) > 1) continue;
        const lo = Math.max(Math.min(s[0][along], s[1][along]), Math.min(t[0][along], t[1][along]));
        const hi = Math.min(Math.max(s[0][along], s[1][along]), Math.max(t[0][along], t[1][along]));
        shared += Math.max(0, hi - lo);
      }
    }
  return { crossed, shared };
}

function crossings(edges, boxes) {
  const found = [];
  const routed = edges.map((edge) => ({ edge, route: edgeRoute(edge, boxes) })).filter((r) => r.route);
  for (let i = 0; i < routed.length; i++)
    for (let j = i + 1; j < routed.length; j++) {
      const [a, b] = [routed[i], routed[j]];
      const { crossed, shared } = routeContact(a.route, b.route);
      const [e, f] = [a.edge, b.edge];
      const sameSide =
        (e.source === f.source && sideOf(e.style.exitX, e.style.exitY) === sideOf(f.style.exitX, f.style.exitY)) ||
        (e.target === f.target && sideOf(e.style.entryX, e.style.entryY) === sideOf(f.style.entryX, f.style.entryY));
      const [m, n] = [stepOf(e), stepOf(f)];
      if (crossed && sameSide && m && n && m.series === n.series)
        // Swapping the ports of numbered steps would put them out of order; step order reports where to move.
        found.push(`Connectors ${e.id} and ${f.id} are steps that cross. Place their targets in step order.`);
      else if (crossed && sameSide && e.style.exitX !== undefined && f.style.exitX !== undefined)
        found.push(`Connectors ${e.id} and ${f.id} share a side of one element and cross. Swap their ports.`);
      else if (crossed)
        found.push(
          `Connectors ${e.id} and ${f.id} cross. Reorder ports, move an element, or route one around the outside.`,
        );
      if (shared > 10) found.push(`Connectors ${e.id} and ${f.id} share a ${Math.round(shared)}-unit segment.`);
    }
  return found;
}

// A label such as "2. Write answer" or "Q2" numbers a step; the letter separates series.
function stepOf(edge) {
  const text = plain(edge.value);
  const match = text.match(/^([A-Z])(\d+)\b/) ?? text.match(/^()(\d+)[.):]/);
  return match ? { series: match[1], n: Number(match[2]), label: `${match[1]}${match[2]}` } : null;
}

// Steps leaving one side of an element read in order only when their ports and their targets
// both run top to bottom (or left to right) in step order; otherwise the lines read out of order or tangle.
function stepOrder(edges, boxes) {
  const found = [];
  const steps = edges
    .map((edge) => ({ edge, step: stepOf(edge) }))
    .filter(({ edge, step }) => step && edge.style.exitX !== undefined && boxes.has(edge.target));
  const groups = Map.groupBy(steps, ({ edge, step }) => {
    const side = sideOf(edge.style.exitX, edge.style.exitY);
    return `${edge.source}\u0000${side}\u0000${step.series}`;
  });
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const { edge } = group[0];
    const side = sideOf(edge.style.exitX, edge.style.exitY);
    const across = side === 'left' || side === 'right';
    const [before, axis] = across ? ['above', 'top to bottom'] : ['left of', 'left to right'];
    const port = ({ edge: e }) => Number(across ? e.style.exitY : e.style.exitX);
    const place = ({ edge: e }) => {
      const b = boxes.get(e.target);
      return across ? b.y + b.h / 2 : b.x + b.w / 2;
    };
    group.sort((a, b) => a.step.n - b.step.n);
    for (let i = 1; i < group.length; i++) {
      const [a, b] = [group[i - 1], group[i]];
      if (a.step.n === b.step.n) continue;
      if (port(b) < port(a))
        found.push(
          `Step ${b.step.label} leaves the ${side} of ${edge.source} ${before} step ${a.step.label}. Order the ports, and their targets, ${axis} in step order.`,
        );
      else if (a.edge.target !== b.edge.target && place(b) < place(a) - 10)
        found.push(
          `Steps ${a.step.label} and ${b.step.label} leave the ${side} of ${edge.source} in order, but ${b.edge.target} sits ${before} ${a.edge.target}. Move the targets into step order so the lines do not cross.`,
        );
    }
  }
  return found;
}

// Bends the reader takes as meaning should come from the layout, not from avoiding text.
// When ends could be joined straight, or with one bend, the extra bends of the actual route are
// reported if that simpler route is clear, or blocked only by movable text. A simpler route through
// another element or its caption, an extra region outline or a new crossing is blocked, so going around
// is reasonable.
const PORTS = [0.25, 0.5, 0.75];
function directRoutes(s, t) {
  const span = (a, b, x, w) => [Math.max(a[x], b[x]), Math.min(a[x] + a[w], b[x] + b[w])];
  const [cols, rows] = [span(s, t, 'x', 'w'), span(s, t, 'y', 'h')];
  const [a, b] = [centreOf(s), centreOf(t)];
  const right = b.x > a.x;
  const down = b.y > a.y;
  if (cols[1] - cols[0] >= 8 && rows[1] - rows[0] >= 8) return null;
  if (cols[1] - cols[0] >= 8)
    return {
      bends: 0,
      routes: PORTS.map((f) => {
        const x = cols[0] + f * (cols[1] - cols[0]);
        return [
          { x, y: down ? s.y + s.h : s.y },
          { x, y: down ? t.y : t.y + t.h },
        ];
      }),
    };
  if (rows[1] - rows[0] >= 8)
    return {
      bends: 0,
      routes: PORTS.map((f) => {
        const y = rows[0] + f * (rows[1] - rows[0]);
        return [
          { x: right ? s.x + s.w : s.x, y },
          { x: right ? t.x : t.x + t.w, y },
        ];
      }),
    };
  const routes = [];
  for (const f of PORTS)
    for (const g of PORTS) {
      const y = s.y + f * s.h;
      const x = t.x + g * t.w;
      routes.push([
        { x: right ? s.x + s.w : s.x, y },
        { x, y },
        { x, y: down ? t.y : t.y + t.h },
      ]);
      const vx = s.x + g * s.w;
      const vy = t.y + f * t.h;
      routes.push([
        { x: vx, y: down ? s.y + s.h : s.y },
        { x: vx, y: vy },
        { x: right ? t.x : t.x + t.w, y: vy },
      ]);
    }
  return { bends: 1, routes };
}

// Waypoints on a straight run, or steps of a unit or two that draw.io draws straight, are not bends.
function bendCount(route) {
  const runs = segments(route)
    .map(([p, q]) => ({ dx: q.x - p.x, dy: q.y - p.y }))
    .filter(({ dx, dy }) => Math.hypot(dx, dy) >= 2)
    .map(({ dx, dy }) => (Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'));
  return runs.filter((r, i) => i && r !== runs[i - 1]).length;
}

const turns = (n) => (n === 1 ? 'bends once' : `bends ${n} times`);

const sideAt = (p, b) =>
  Math.abs(p.x - b.x) < 1
    ? 'left'
    : Math.abs(p.x - b.x - b.w) < 1
      ? 'right'
      : Math.abs(p.y - b.y) < 1
        ? 'top'
        : 'bottom';

function simplerRoutes(cells, byId, boxes, vertices, edges) {
  const found = [];
  const regions = regionsOf(cells, boxes, vertices);
  const routes = new Map(edges.map((edge) => [edge.id, edgeRoute(edge, boxes)]));
  const texts = textBoxes(cells, boxes, vertices, edges, routes);
  const solids = vertices.filter((c) => {
    const b = boxes.get(c.id);
    return !isText(c) && !regions.includes(c) && b.w && b.h;
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
        extraOutlineCrossings(candidate, edge, regions, boxes).length > 0 ||
        others.some((other) => {
          const now = routeContact(route, routes.get(other.id));
          const then = routeContact(candidate, routes.get(other.id));
          return (then.crossed && !now.crossed) || (then.shared > 10 && now.shared <= 10);
        });
      // A caption or frame title belongs to its element; a route through it is blocked. Connector labels
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

// Estimated text boxes of captions, frame titles, free text and connector labels.
function textBoxes(cells, boxes, vertices, edges, routes) {
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

// Captions, frame titles and connector labels must not cover each other or a line.
function labelCollisions(cells, byId, boxes, vertices, edges) {
  const found = [];
  const parents = new Set(cells.map((c) => c.parent));
  const routes = new Map(edges.map((edge) => [edge.id, edgeRoute(edge, boxes)]));
  const texts = textBoxes(cells, boxes, vertices, edges, routes);

  for (let i = 0; i < texts.length; i++)
    for (let j = i + 1; j < texts.length; j++) {
      const [a, b] = [texts[i], texts[j]];
      if (a.owner !== b.owner && overlaps(a.box, b.box))
        found.push(`The ${describe(a)} and the ${describe(b)} overlap or nearly touch.`);
    }
  // A caption or title must not sit on another icon, and text must not straddle an outline:
  // that reads as belonging to both sides. Text wholly inside a region or frame sits on its background.
  for (const t of texts)
    for (const cell of vertices) {
      const box = boxes.get(cell.id);
      if (cell.id === t.owner || isText(cell) || !box.w || !box.h || !overlaps(t.box, box)) continue;
      const region =
        parents.has(cell.id) || cell.style.container === '1' || (box.w > 2 * ICON_SPAN && box.h > ICON_SPAN);
      if (region) {
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
    const { errors, warnings } = checkLayout(readFileSync(file, 'utf8'));
    for (const error of errors) console.error(`Error: ${error}`);
    for (const warning of warnings) console.error(`Check: ${warning}`);
    console.log(
      `Layout: ${errors.length} errors, ${warnings.length} items to check. Geometry only; inspect the image too.`,
    );
    process.exitCode = errors.length ? 1 : 0;
  }
}
