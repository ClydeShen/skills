// The diagram as a reader sees it: cells, their page positions and the estimated space their text takes.
export const attributes = (tag) =>
  Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
// A draw.io style string: "key=value" pairs, and flags such as "text" without a value.
// A value keeps every "=" after the first, as in a data URI.
export const styleOf = (style = '') =>
  Object.fromEntries(
    style
      .split(';')
      .filter(Boolean)
      .map((part) => {
        const i = part.indexOf('=');
        return i < 0 ? [part, undefined] : [part.slice(0, i), part.slice(i + 1)];
      }),
  );

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

export function absolute(cells) {
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

export const inside = (a, b) => a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h;
export const overlaps = (a, b) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
export const ancestorIds = (cell, byId) => {
  const ids = new Set();
  for (let c = byId.get(cell.parent); c && !ids.has(c.id); c = byId.get(c.parent)) ids.add(c.id);
  return ids;
};
export const isText = (cell) => 'text' in cell.style || 'edgeLabel' in cell.style;

// Text geometry is estimated, not measured: Helvetica averages about 0.5 em per character.
export const plain = (value = '') =>
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
export function captionBox(cell, box) {
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
export function freeTextBox(cell, box) {
  const text = plain(cell.value);
  if (!text || !('text' in cell.style)) return null;
  const size = textSize(text, Number(cell.style.fontSize) || 11, cell.style.whiteSpace === 'wrap' ? box.w : Infinity);
  const x = { left: box.x, right: box.x + box.w - size.w }[cell.style.align] ?? box.x + box.w / 2 - size.w / 2;
  const y = { top: box.y, bottom: box.y + box.h - size.h }[cell.style.verticalAlign] ?? box.y + box.h / 2 - size.h / 2;
  return { x, y, w: size.w, h: size.h };
}

// The title of a boundary drawn inside its top edge.
export function titleBox(cell, box, holdsChildren) {
  const text = plain(cell.value);
  if (!text || !holdsChildren || cell.style.verticalAlign !== 'top') return null;
  const fontSize = Number(cell.style.fontSize) || 11;
  const size = textSize(text, fontSize, box.w - 8);
  const spacing = Number(cell.style.spacing) || 2;
  const left = box.x + spacing + (Number(cell.style.spacingLeft) || 0);
  const x = cell.style.align === 'center' ? box.x + box.w / 2 - size.w / 2 : left;
  return { x, y: box.y + spacing + (Number(cell.style.spacingTop) || 0), w: size.w, h: size.h };
}

// Each <diagram> element is one page; split views are pages of one file.
export function pagesOf(xml) {
  return [...xml.matchAll(/<diagram\b([^>]*)>([\s\S]*?)<\/diagram>/g)].map((m, index) => {
    const a = attributes(`<diagram ${m[1]}>`);
    return { id: a.id, name: a.name || String(index + 1), xml: m[2], element: m[0] };
  });
}

// Whether a point lies strictly inside a box.
export const containsPoint = (b, p) => p.x > b.x && p.x < b.x + b.w && p.y > b.y && p.y < b.y + b.h;
export const centreOf = (b) => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });
