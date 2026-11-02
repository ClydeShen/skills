// Bounding box of SVG path data from endpoints, control points and sampled arcs (a safe outer bound).
export function pathBox(d) {
  let p = 0,
    cmd = '',
    x = 0,
    y = 0,
    sx = 0,
    sy = 0;
  const xs = [],
    ys = [];
  const skip = () => {
    while (p < d.length && /[\s,]/.test(d[p])) p++;
  };
  const num = () => {
    skip();
    const m = /^[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/.exec(d.slice(p));
    if (!m) throw new Error(`Bad number at ${p}`);
    p += m[0].length;
    return Number(m[0]);
  };
  // Arc flags are single digits and may be written without separators, as in "a.5.5 0 00-.2.05".
  const flag = () => {
    skip();
    return Number(d[p++]);
  };
  const add = (px, py) => {
    xs.push(px);
    ys.push(py);
  };
  for (skip(); p < d.length; skip()) {
    if (/[a-zA-Z]/.test(d[p])) cmd = d[p++];
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    const bx = rel ? x : 0,
      by = rel ? y : 0;
    if (C === 'Z') {
      x = sx;
      y = sy;
      continue;
    }
    if (C === 'M' || C === 'L' || C === 'T') {
      x = bx + num();
      y = by + num();
      add(x, y);
      if (C === 'M') {
        sx = x;
        sy = y;
        cmd = rel ? 'l' : 'L';
      }
    } else if (C === 'H') {
      x = bx + num();
      add(x, y);
    } else if (C === 'V') {
      y = by + num();
      add(x, y);
    } else if (C === 'C') {
      for (let k = 0; k < 2; k++) add(bx + num(), by + num());
      x = bx + num();
      y = by + num();
      add(x, y);
    } else if (C === 'S' || C === 'Q') {
      add(bx + num(), by + num());
      x = bx + num();
      y = by + num();
      add(x, y);
    } else if (C === 'A') {
      const rx0 = Math.abs(num()),
        ry0 = Math.abs(num()),
        phi = (num() * Math.PI) / 180,
        fa = flag(),
        fs = flag();
      const ox = x,
        oy = y;
      x = bx + num();
      y = by + num();
      add(ox, oy);
      add(x, y);
      for (const [px, py] of arcPoints(ox, oy, rx0, ry0, phi, fa, fs, x, y)) add(px, py);
    } else throw new Error(`Unsupported path command ${cmd}`);
  }
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

// Endpoint-to-centre conversion from SVG 2, appendix B.2.4, then sampling along the sweep.
function arcPoints(x1, y1, rx, ry, phi, fa, fs, x2, y2) {
  if (!rx || !ry) return [];
  const cos = Math.cos(phi),
    sin = Math.sin(phi);
  const dx = (x1 - x2) / 2,
    dy = (y1 - y2) / 2;
  const xp = cos * dx + sin * dy,
    yp = -sin * dx + cos * dy;
  const lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);
  if (lambda > 1) {
    rx *= Math.sqrt(lambda);
    ry *= Math.sqrt(lambda);
  }
  const num = rx * rx * ry * ry - rx * rx * yp * yp - ry * ry * xp * xp;
  const k = (fa === fs ? -1 : 1) * Math.sqrt(Math.max(0, num / (rx * rx * yp * yp + ry * ry * xp * xp)));
  const cxp = (k * rx * yp) / ry,
    cyp = (-k * ry * xp) / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2,
    cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
  const ang = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  const t1 = ang(1, 0, (xp - cxp) / rx, (yp - cyp) / ry);
  let dt = ang((xp - cxp) / rx, (yp - cyp) / ry, (-xp - cxp) / rx, (-yp - cyp) / ry);
  if (!fs && dt > 0) dt -= 2 * Math.PI;
  if (fs && dt < 0) dt += 2 * Math.PI;
  const out = [];
  for (let i = 1; i < 32; i++) {
    const t = t1 + (dt * i) / 32;
    out.push([
      cx + rx * Math.cos(t) * cos - ry * Math.sin(t) * sin,
      cy + rx * Math.cos(t) * sin + ry * Math.sin(t) * cos,
    ]);
  }
  return out;
}

// Tighten only the viewBox around simple path-only artwork; path data and colours stay byte-identical.
export function trimViewBox(svg, margin = 0.02) {
  if (/transform=|<(g|use|image|text|circle|rect|ellipse|polygon|polyline|line)\b/.test(svg))
    throw new Error('Trim supports path-only SVGs without transforms.');
  const boxes = [...svg.matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => pathBox(m[1]));
  const b = {
    minX: Math.min(...boxes.map((v) => v.minX)),
    minY: Math.min(...boxes.map((v) => v.minY)),
    maxX: Math.max(...boxes.map((v) => v.maxX)),
    maxY: Math.max(...boxes.map((v) => v.maxY)),
  };
  const w = b.maxX - b.minX,
    h = b.maxY - b.minY,
    m = Math.max(w, h) * margin;
  const vb = [b.minX - m, b.minY - m, w + 2 * m, h + 2 * m].map((n) => +n.toFixed(3)).join(' ');
  return svg.replace(/viewBox="[^"]*"/, `viewBox="${vb}"`);
}
