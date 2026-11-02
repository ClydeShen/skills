import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

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
const isText = (cell) => cell.style.text !== undefined || cell.style.edgeLabel !== undefined;

// Errors are faults whatever the design; warnings ask a person or agent to look.
export function checkLayout(xml) {
  const errors = [];
  const warnings = [];
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
  return { errors: [...new Set(errors)], warnings: [...new Set(warnings)] };
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
