import { readFileSync, existsSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Match the existing render validator's sub-pixel tolerance.
const epsilon = 1;
const distance = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const direction = (a, b) => [b.x - a.x, b.y - a.y].map(delta => Math.abs(delta) < epsilon ? 0 : Math.sign(delta));

export function routeMetrics(points) {
  if (!Array.isArray(points) || points.length < 2 || points.some(p => !Number.isFinite(p?.x) || !Number.isFinite(p?.y))) throw new Error('Expected a finite route.');
  const segments = points.slice(1).map((b, i) => ({ a: points[i], b })).filter(s => distance(s.a, s.b) > epsilon);
  if (segments.some(({ a, b }) => Math.abs(a.x - b.x) > epsilon && Math.abs(a.y - b.y) > epsilon)) throw new Error('Expected orthogonal segments.');
  const directions = segments.map(s => direction(s.a, s.b));
  const bends = directions.slice(1).filter((d, i) => d.some((n, axis) => n !== directions[i][axis])).length;
  const length = segments.reduce((sum, s) => sum + distance(s.a, s.b), 0);
  const lowerBound = distance(points[0], points.at(-1));
  const aligned = Math.abs(points[0].x - points.at(-1).x) < epsilon || Math.abs(points[0].y - points.at(-1).y) < epsilon;
  return { bends, length, lowerBound, excessLength: length - lowerBound, alignedDetour: aligned && length - lowerBound > epsilon };
}

export function layoutMetrics(report) {
  const routes = (report.metrics || []).filter(n => n.points);
  const edges = Object.fromEntries(routes.map(r => [r.id, routeMetrics(r.points)]));
  const crossings = new Set();
  for (let i = 0; i < routes.length; i++) for (let j = i + 1; j < routes.length; j++) {
    const a = routes[i], b = routes[j];
    for (let u = 1; u < a.points.length; u++) for (let v = 1; v < b.points.length; v++) {
      let p = a.points[u - 1], q = a.points[u], r = b.points[v - 1], s = b.points[v];
      const horizontal = (x, y) => Math.abs(x.y - y.y) < epsilon;
      if (horizontal(p, q) === horizontal(r, s)) continue;
      if (!horizontal(p, q)) [p, q, r, s] = [r, s, p, q];
      if (r.x > Math.min(p.x, q.x) + epsilon && r.x < Math.max(p.x, q.x) - epsilon && p.y > Math.min(r.y, s.y) + epsilon && p.y < Math.max(r.y, s.y) - epsilon) crossings.add(`${a.id}/${b.id}@${r.x.toFixed(1)},${p.y.toFixed(1)}`);
    }
  }
  return {
    edges,
    properCrossings: [...crossings],
    totalBends: Object.values(edges).reduce((sum, e) => sum + e.bends, 0),
    totalLength: Object.values(edges).reduce((sum, e) => sum + e.length, 0),
    alignedDetours: Object.entries(edges).filter(([, e]) => e.alignedDetour).map(([id]) => id),
    limitation: 'Advisory geometry only. Crossings count segment-interior intersections, not touches or overlaps. The Manhattan lower bound ignores obstacles, captions, parallel paths and domains. A detour is not necessarily unnecessary; never shorten it without semantic and rendered checks.',
  };
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  console.log(JSON.stringify(layoutMetrics(JSON.parse(readFileSync(process.argv[2], 'utf8'))), null, 2));
}
