import { readFileSync, existsSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { styleMap, upstreamVersion } from './catalog.mjs';

const list = value => value == null ? [] : Array.isArray(value) ? value : [value];
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', parseAttributeValue: false });
const boundary = node => ['Deployment node', 'Software system boundary'].includes(node.c4Type);
const overlaps = (a, b) => a && b && Math.min(a.x + a.w, b.x + b.w) > Math.max(a.x, b.x) && Math.min(a.y + a.h, b.y + b.h) > Math.max(a.y, b.y);
const intersects = (a, b, r) => {
  if (Math.abs(a.x - b.x) < 1) return a.x > r.x && a.x < r.x + r.w && Math.max(a.y, b.y) > r.y && Math.min(a.y, b.y) < r.y + r.h;
  if (Math.abs(a.y - b.y) < 1) return a.y > r.y && a.y < r.y + r.h && Math.max(a.x, b.x) > r.x && Math.min(a.x, b.x) < r.x + r.w;
  return false;
};

// A route's inside/outside sequence must match its endpoints' declared membership.
// Geometry cannot silently invent transit through another architectural domain.
export function validateBoundaryRoutes(nodes, routes) {
  const errors = [], byId = new Map(nodes.map(n => [n.id, n]));
  const member = (id, domain) => {
    const seen = new Set();
    while (byId.has(id) && !seen.has(id)) {
      if (id === domain) return true;
      seen.add(id); id = byId.get(id).parent;
    }
    return false;
  };
  const epsilon = 1e-6;
  const validRoutes = routes.filter(route => {
    const valid = Array.isArray(route.points) && route.points.length >= 2 && route.points.every(p => p && Number.isFinite(p.x) && Number.isFinite(p.y));
    if (!valid) errors.push(`Invalid boundary route coordinates: ${route.id}`);
    return valid;
  });
  for (const domain of nodes.filter(boundary)) {
    const r = domain.bounds;
    if (!r || !Object.values(r).every(Number.isFinite)) { errors.push(`Missing boundary bounds: ${domain.id}`); continue; }
    for (const node of nodes.filter(n => n.bounds && n.id !== domain.id && member(n.id, domain.id))) {
      const b = node.bounds;
      if (b.x < r.x || b.y < r.y || b.x + b.w > r.x + r.w || b.y + b.h > r.y + r.h) errors.push(`Element outside declared boundary ${domain.id}: ${node.id}`);
    }
    for (const route of validRoutes) {
      if (!byId.has(route.source) || !byId.has(route.target)) { errors.push(`Missing route endpoint metadata: ${route.id}`); continue; }
      const states = [];
      for (let i = 1; i < route.points.length; i++) {
        const a = route.points[i - 1], b = route.points[i], dx = b.x - a.x, dy = b.y - a.y;
        if (Math.abs(dx) + Math.abs(dy) < epsilon) continue;
        const cuts = [0, 1];
        for (const [delta, start, walls] of [[dx, a.x, [r.x, r.x + r.w]], [dy, a.y, [r.y, r.y + r.h]]]) {
          if (Math.abs(delta) > epsilon) for (const wall of walls) {
            const t = (wall - start) / delta;
            if (t > 0 && t < 1) cuts.push(t);
          }
        }
        cuts.sort((x, y) => x - y);
        for (let j = 1; j < cuts.length; j++) {
          if (cuts[j] - cuts[j - 1] < epsilon) continue;
          const t = (cuts[j] + cuts[j - 1]) / 2, x = a.x + dx * t, y = a.y + dy * t;
          const onVertical = (Math.abs(x - r.x) < epsilon || Math.abs(x - r.x - r.w) < epsilon) && y >= r.y && y <= r.y + r.h;
          const onHorizontal = (Math.abs(y - r.y) < epsilon || Math.abs(y - r.y - r.h) < epsilon) && x >= r.x && x <= r.x + r.w;
          if (onVertical || onHorizontal) errors.push(`Route follows boundary ${domain.id}: ${route.id}`);
          const state = x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h ? 'inside' : 'outside';
          if (states.at(-1) !== state) states.push(state);
        }
      }
      const start = member(route.source, domain.id) ? 'inside' : 'outside';
      const end = member(route.target, domain.id) ? 'inside' : 'outside';
      const expected = start === end ? [start] : [start, end];
      if (states.join(',') !== expected.join(',')) errors.push(`Boundary route mismatch ${domain.id}: ${route.id} (${states.join(' -> ')}; expected ${expected.join(' -> ')})`);
    }
  }
  return [...new Set(errors)];
}

export function validateRender(report) {
  const errors = [], metrics = report.metrics || [], vertices = metrics.filter(n => !n.points);
  if (report.upstream_commit !== '84487b4891cbc0f32d7e30f34cf878c87cb1f414' || !metrics.length) return ['Missing or unpinned render evidence.'];
  for (const annotation of vertices.filter(n => n.annotationKind && n.bounds)) {
    for (const node of vertices.filter(n => n.type && !boundary({ c4Type: n.type }))) {
      if (overlaps(annotation.bounds, node.body) || overlaps(annotation.bounds, node.text)) errors.push(`Rendered annotation overlaps element ${node.id}: ${annotation.id}`);
    }
    for (const domain of vertices.filter(n => boundary({ c4Type: n.type }) && n.bounds)) {
      const r = domain.bounds, corners = [{ x: r.x, y: r.y }, { x: r.x + r.w, y: r.y }, { x: r.x + r.w, y: r.y + r.h }, { x: r.x, y: r.y + r.h }];
      if (corners.some((a, i) => intersects(a, corners[(i + 1) % 4], annotation.bounds))) errors.push(`Rendered annotation obscures boundary ${domain.id}: ${annotation.id}`);
    }
  }
  for (const edge of metrics.filter(n => n.points)) {
    let hosted = false;
    for (let i = 1; i < edge.points.length; i++) {
      const a = edge.points[i - 1], b = edge.points[i];
      // A connector's own opaque label interrupts the line; this is not a collision.
      if (edge.text) {
        const t = edge.text, cx = t.x + t.w / 2, cy = t.y + t.h / 2;
        if (Math.abs(a.y - b.y) < 1 && Math.abs(cy - a.y) < 3 && cx - t.w / 2 >= Math.min(a.x, b.x) - 2 && cx + t.w / 2 <= Math.max(a.x, b.x) + 2) hosted = true;
        if (Math.abs(a.x - b.x) < 1 && Math.abs(cx - a.x) < 3 && cy - t.h / 2 >= Math.min(a.y, b.y) - 2 && cy + t.h / 2 <= Math.max(a.y, b.y) + 2) hosted = true;
      }
      for (const node of vertices) if (node.text && intersects(a, b, node.text)) errors.push(`Rendered line crosses text ${node.id}: ${edge.id}`);
      for (const node of vertices.filter(n => n.annotationKind && n.bounds)) if (intersects(a, b, node.bounds)) errors.push(`Rendered line crosses annotation ${node.id}: ${edge.id}`);
    }
    if (edge.text && !hosted) errors.push(`Rendered label must sit on and fit its host segment: ${edge.id}`);
    for (const domain of vertices.filter(n => boundary({ c4Type: n.type }) && n.bounds)) {
      const r = domain.bounds, corners = [{ x: r.x, y: r.y }, { x: r.x + r.w, y: r.y }, { x: r.x + r.w, y: r.y + r.h }, { x: r.x, y: r.y + r.h }];
      if (edge.text && corners.some((a, i) => intersects(a, corners[(i + 1) % 4], edge.text))) errors.push(`Rendered label obscures boundary ${domain.id}: ${edge.id}`);
    }
  }
  errors.push(...validateBoundaryRoutes(vertices.map(n => ({ ...n, c4Type: n.type })), metrics.filter(n => n.points)));
  return [...new Set(errors)];
}

export function validateDiagram(xml, catalog) {
  const errors = [];
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) return ['Document type and entity declarations are not supported.'];
  const syntax = XMLValidator.validate(xml);
  if (syntax !== true) return [`Invalid XML: ${syntax.err.msg}`];
  const doc = parser.parse(xml);
  if (doc.mxfile?.version !== upstreamVersion) errors.push('Diagram must declare the pinned draw.io version.');
  const pages = list(doc.mxfile?.diagram);
  if (pages.length !== 1 || !pages[0]?.mxGraphModel?.root) return [...errors, 'Expected one uncompressed mxGraphModel page.'];
  const root = pages[0].mxGraphModel.root;
  const objects = list(root.object);
  const nodes = [...list(root.mxCell), ...objects.map(o => ({ ...o.mxCell, ...o, mxCell: undefined, value: o.label }))];
  const byId = new Map();
  if (!nodes.some(n => /^Dynamic diagram \(deployment view\):/.test(n.value || ''))) errors.push('Missing diagram type/scope title.');
  if (!nodes.some(n => /^Legend\b/.test(n.value || ''))) errors.push('Missing notation legend.');
  for (const n of nodes) {
    if (!n.id || byId.has(n.id)) errors.push(`Missing or duplicate id: ${n.id}`);
    byId.set(n.id, n);
    if (n.parent && n.parent !== '0' && !nodes.some(p => p.id === n.parent)) errors.push(`Missing parent: ${n.id}`);
    if (n.annotationKind === 'comment' && !nodes.some(p => p.id === n.annotationFor && p.c4Type)) errors.push(`Missing architectural comment target: ${n.id}`);
    if (n.annotationKind && n.c4Type) errors.push(`Annotation must not declare an architectural type: ${n.id}`);
  }
  const geometry = (n, seen = new Set()) => {
    if (seen.has(n.id)) throw new Error(`Parent cycle: ${n.id}`);
    seen.add(n.id);
    const g = n.mxGeometry || {};
    const parent = byId.get(n.parent);
    const origin = parent?.vertex === '1' ? geometry(parent, seen) : { x: 0, y: 0 };
    return { x: origin.x + Number(g.x || 0), y: origin.y + Number(g.y || 0), w: Number(g.width || 0), h: Number(g.height || 0) };
  };
  const boxes = new Map();
  for (const n of nodes.filter(n => n.vertex === '1')) {
    const s = styleMap(n.style || '');
    let box;
    try { box = geometry(n); } catch (e) { errors.push(e.message); continue; }
    if (!Object.values(box).every(Number.isFinite) || box.w <= 0 || box.h <= 0) errors.push(`Invalid dimensions: ${n.id}`);
    boxes.set(n.id, box);
    const autoNote = n.annotationKind === 'comment' && s.shape === 'note' && s.html === '1' && s.autosizeText === '1';
    const validFont = autoNote ? Number.isFinite(Number(s.fontSize)) && Number(s.fontSize) > 0 : String(s.fontSize) === '12' && s.autosizeText !== '1';
    if (!validFont) errors.push(`Font must be 12 unless this is an auto-sized native Note comment: ${n.id}`);
    if (n.c4Type) {
      if (!n.value?.includes(`[${n.c4Type}`)) errors.push(`Missing visible C4 type: ${n.id}`);
      if (['Container', 'Component'].includes(n.c4Type) && !n.technology) errors.push(`Missing technology: ${n.id}`);
      if (['Person', 'External software system'].includes(n.c4Type) && n.parent !== '1') errors.push(`External element must remain outside boundaries: ${n.id}`);
    }
    const refs = ['shape', 'resIcon', 'grIcon', 'image', 'prIcon'];
    if (n.iconKey) {
      const entry = catalog.entries.find(e => e.id === n.iconKey);
      if (!entry?.usable || entry.vendor !== n.vendor) errors.push(`Unknown, unusable or wrong-vendor icon: ${n.id}`);
      else {
        const original = styleMap(entry.style);
        for (const key of [...refs, 'fillColor', 'strokeColor', 'gradientColor']) {
          if (s[key] !== original[key]) errors.push(`Catalog style mismatch (${key}): ${n.id}`);
        }
      }
      for (const key of ['rotation', 'flipH', 'flipV']) if (s[key] && !['0', 'false'].includes(s[key])) errors.push(`Altered vendor icon: ${n.id}`);
    } else if (refs.some(k => s[k]?.startsWith('mxgraph.') || k === 'image' && s[k])) errors.push(`Uncatalogued vendor icon: ${n.id}`);
  }
  const captions = new Map();
  for (const n of objects.filter(n => !boundary(n) && n.iconKey)) {
    const b = boxes.get(n.id); if (!b) continue;
    const s = styleMap(n.mxCell.style), width = Number(s.labelWidth || 200);
    const lines = n.label.split('\n').reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length * 7.2 / width)), 0);
    captions.set(n.id, { x: b.x + b.w / 2 - width / 2, y: b.y + b.h + Number(s.spacingTop || 0), w: width, h: lines * 16 });
  }
  const segments = [], routes = [];
  const annotationOwner = id => {
    const seen = new Set();
    while (byId.has(id) && !seen.has(id)) {
      const node = byId.get(id);
      if (node.annotationKind) return node;
      seen.add(id); id = node.parent;
    }
    return null;
  };
  for (const e of nodes.filter(n => n.edge === '1')) {
    const source = byId.get(e.source), target = byId.get(e.target), s = styleMap(e.style || '');
    if (!source || !target || !boxes.has(e.source) || !boxes.has(e.target)) { errors.push(`Missing edge endpoint: ${e.id}`); continue; }
    if (annotationOwner(source.id) || annotationOwner(target.id)) errors.push(`Architectural call must not target an annotation: ${e.id}`);
    if (!e.value?.trim()) errors.push(`Missing relationship label: ${e.id}`);
    if (s.startArrow !== 'none' || s.endArrow !== 'block' || s.endFill !== '1') errors.push(`Use one filled, single-direction arrow: ${e.id}`);
    if (s.fontSize !== '12' || s.autosizeText === '1') errors.push(`Wrong relationship font: ${e.id}`);
    if (s.labelBackgroundColor !== '#ffffff' || Number(e.mxGeometry?.y || 0) !== 0) errors.push(`Use an opaque label on the connector: ${e.id}`);
    if (source.c4Type === 'Container' && target.c4Type === 'Container' && !/\[[^\]]+\]/.test(e.value)) errors.push(`Missing relationship technology/protocol: ${e.id}`);
    const port = (id, x, y) => { const b = boxes.get(id); return { x: b.x + b.w * Number(x ?? 0.5), y: b.y + b.h * Number(y ?? 0.5) }; };
    const points = [port(e.source, s.exitX, s.exitY), ...list(e.mxGeometry?.Array?.mxPoint).map(p => ({ x: Number(p.x), y: Number(p.y) })), port(e.target, s.entryX, s.entryY)];
    if (e.parent !== '1') errors.push(`Prototype routes require root coordinates: ${e.id}`);
    if (!points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y))) errors.push(`Invalid route coordinates: ${e.id}`);
    routes.push({ id: e.id, source: e.source, target: e.target, points });
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      if (Math.abs(a.x - b.x) >= 1 && Math.abs(a.y - b.y) >= 1) errors.push(`Non-orthogonal declared segment: ${e.id}`);
      for (const [id, box] of boxes) {
        if ([e.source, e.target].includes(id) || boundary(byId.get(id)) || (!byId.get(id).c4Type && !byId.get(id).annotationKind)) continue;
        if (intersects(a, b, box)) errors.push(`Line crosses element ${id}: ${e.id}`);
      }
      for (const [id, box] of captions) if (intersects(a, b, box)) errors.push(`Line crosses caption ${id}: ${e.id}`);
      segments.push({ a, b, id: e.id });
    }
  }
  errors.push(...validateBoundaryRoutes(nodes.filter(n => n.vertex === '1').map(n => ({ ...n, bounds: boxes.get(n.id) })), routes));
  for (let i = 0; i < segments.length; i++) for (let j = i + 1; j < segments.length; j++) {
    const p = segments[i], q = segments[j]; if (p.id === q.id) continue;
    const horizontal = Math.abs(p.a.y - p.b.y) < 1 && Math.abs(q.a.y - q.b.y) < 1 && Math.abs(p.a.y - q.a.y) < 1;
    const vertical = Math.abs(p.a.x - p.b.x) < 1 && Math.abs(q.a.x - q.b.x) < 1 && Math.abs(p.a.x - q.a.x) < 1;
    const axis = horizontal ? 'x' : 'y';
    if ((horizontal || vertical) && Math.min(Math.max(p.a[axis], p.b[axis]), Math.max(q.a[axis], q.b[axis])) - Math.max(Math.min(p.a[axis], p.b[axis]), Math.min(q.a[axis], q.b[axis])) > 1) errors.push(`Shared path segment: ${p.id}, ${q.id}`);
  }
  return [...new Set(errors)];
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  const [file, catalogFile = fileURLToPath(new URL('../prototype/catalog.json', import.meta.url))] = process.argv.slice(2);
  const errors = validateDiagram(readFileSync(file, 'utf8'), JSON.parse(readFileSync(catalogFile, 'utf8')));
  for (const error of errors) console.error(error);
  console.log(`Prototype static checks: ${errors.length} errors. Caption bounds are estimates; inspect the actual render.`);
  process.exitCode = errors.length ? 1 : 0;
}
