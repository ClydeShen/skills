import { centreOf, overlaps, plain, textSize } from './diagram.mjs';

// Where draw.io draws a connector, and how two routes meet.
// The route draw.io takes when both ports are fixed; elbows follow the side each end leaves from.
// Without ports and waypoints, draw.io joins facing sides of aligned elements; other routes are its choice.
export function defaultPorts(a, b, points) {
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
export function edgeRoute(edge, boxes) {
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

export function segments(route) {
  return route.slice(1).map((q, i) => [route[i], q]);
}

// draw.io places an edge label at x in [-1, 1] along the whole path, then shifts it by the offset.
export function edgeLabelBox(edge, route) {
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

export const crosses = ([p, q], b) =>
  overlaps(
    { x: Math.min(p.x, q.x), y: Math.min(p.y, q.y), w: Math.abs(p.x - q.x) || 1, h: Math.abs(p.y - q.y) || 1 },
    b,
  );

export const sideOf = (x, y) =>
  Number(x) === 0 ? 'left' : Number(x) === 1 ? 'right' : Number(y) === 0 ? 'top' : 'bottom';

// Connectors that cross or share a segment make the reader guess which line continues where.
// Two leaving the same side of one element and crossing each other only need their ports swapped.
// Whether two orthogonal routes cross, and how long they run on top of each other.
export function routeContact(first, second) {
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

export const PORTS = [0.25, 0.5, 0.75];
export function directRoutes(s, t) {
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
export function bendCount(route) {
  const runs = segments(route)
    .map(([p, q]) => ({ dx: q.x - p.x, dy: q.y - p.y }))
    .filter(({ dx, dy }) => Math.hypot(dx, dy) >= 2)
    .map(({ dx, dy }) => (Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'));
  return runs.filter((r, i) => i && r !== runs[i - 1]).length;
}

export const sideAt = (p, b) =>
  Math.abs(p.x - b.x) < 1
    ? 'left'
    : Math.abs(p.x - b.x - b.w) < 1
      ? 'right'
      : Math.abs(p.y - b.y) < 1
        ? 'top'
        : 'bottom';
