import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

// One display standard for every icon source.
export const ICON_SIZE = 72;
export const WIDE_HEIGHT = 40;
export const WIDE_MAX_WIDTH = 200;
// Captions get a fixed width, so they wrap to at most a few lines and their footprint is predictable.
export const CAPTION_WIDTH = 160;
const WIDE_RATIO = 1.6;
const LABEL =
  'html=1;whiteSpace=wrap;labelPosition=center;verticalLabelPosition=bottom;align=center;verticalAlign=top;fontSize=16;';
const LABEL_KEYS = new Set([
  'html',
  'whiteSpace',
  'whitespace',
  'labelPosition',
  'verticalLabelPosition',
  'align',
  'verticalAlign',
  'fontSize',
  'labelWidth',
]);
export const FALLBACK = {
  kind: 'fallback',
  width: 144,
  height: 72,
  style:
    'rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#64748B;align=center;verticalAlign=middle;fontSize=16;',
};

export const sha256 = (data) => createHash('sha256').update(data).digest('hex');
export const dataUri = (svg) => `data:image/svg+xml,${Buffer.from(svg, 'utf8').toString('base64')}`;
// Official artwork is SVG where the vendor publishes one, PNG otherwise; both embed the same way.
export const artwork = (entry) => (entry.png ? Buffer.from(entry.png, 'base64') : Buffer.from(entry.svg, 'utf8'));
export const entryUri = (entry) => (entry.png ? `data:image/png,${entry.png}` : dataUri(entry.svg));
const isVendorIcon = (entry) => Boolean(entry.svg || entry.png);

export function loadVendorIcons(url = new URL('../assets/vendor-icons.json', import.meta.url)) {
  return JSON.parse(readFileSync(url, 'utf8'));
}

// Searchable entries for find-icon: vendor icons look like usable catalog entries.
export function iconEntries(catalog, icons) {
  return [...catalog.entries, ...icons.entries.map((e) => ({ ...e, usable: true }))];
}

function withoutKeys(style, keys) {
  return style
    .split(';')
    .filter((part) => part && !keys.has(part.split('=')[0]))
    .join(';');
}

// Size and caption placement for a catalog or vendor-icon entry; the artwork itself is never changed.
export function iconPlacement(entry) {
  const ratio = entry.aspect ?? entry.width / entry.height;
  let width, height, kind;
  if (ratio > WIDE_RATIO) {
    kind = 'wide';
    width = Math.min(WIDE_HEIGHT * ratio, WIDE_MAX_WIDTH);
    height = width / ratio;
  } else if (ratio >= 1) {
    kind = 'symbol';
    width = ICON_SIZE;
    height = ICON_SIZE / ratio;
  } else {
    kind = 'symbol';
    height = ICON_SIZE;
    width = ICON_SIZE * ratio;
  }
  const base = isVendorIcon(entry)
    ? `shape=image;aspect=fixed;imageAspect=1;vendorIcon=${entry.id}`
    : withoutKeys(entry.style, LABEL_KEYS);
  return {
    kind,
    ...(entry.wordmark ? { caption: 'The mark shows the name; caption only the role, or leave it empty.' } : {}),
    width: Math.round(width * 10) / 10,
    height: Math.round(height * 10) / 10,
    style: `${base};${LABEL}labelWidth=${Math.max(CAPTION_WIDTH, Math.ceil(width))};`,
  };
}

const styleAttributes = /\bstyle="([^"]*)"/g;
// A title marker identifies its parent boundary; it is not another deployed resource.
// A boundary without an identity keeps the same outline and title place as a marked one, without the marker.
const boundaryStyle = (spacingLeft) =>
  `rounded=0;container=1;collapsible=0;html=1;fillColor=none;strokeColor=#64748B;strokeWidth=1;verticalAlign=top;align=left;spacingLeft=${spacingLeft};fontSize=14;fontColor=#1F2937;`;
export const PLAIN_BOUNDARY = { kind: 'plain-boundary', style: boundaryStyle(8), marker: null };

export function boundaryPlacement(entry) {
  if (entry.palette === 'aws4Groups') return { kind: 'native-boundary', style: entry.style, marker: null };
  const placement = iconPlacement(entry);
  const scale = 24 / Math.max(placement.width, placement.height);
  return {
    kind: 'marked-boundary',
    style: boundaryStyle(36),
    marker: {
      x: 6,
      y: 6,
      width: Math.round(placement.width * scale * 10) / 10,
      height: Math.round(placement.height * scale * 10) / 10,
      style: `${withoutKeys(placement.style, LABEL_KEYS)};html=1;noLabel=1;`,
      label: '',
    },
  };
}

const vendorIconId = (style) => style.match(/(?:^|;)vendorIcon=([^;]+)/)?.[1];

// Writes each referenced icon's exact artwork into its cell, replacing any earlier copy.
export function embedVendorIcons(xml, icons) {
  const byId = new Map(icons.entries.map((e) => [e.id, e]));
  let count = 0;
  const output = xml.replace(styleAttributes, (match, style) => {
    const id = vendorIconId(style);
    if (!id) return match;
    const entry = byId.get(id);
    if (!entry) throw new Error(`Unknown vendorIcon ${id}. Look it up with find-icon.mjs.`);
    const image = `image=${entryUri(entry)}`;
    const next = /(?:^|;)image=/.test(style)
      ? style.replace(/(^|;)image=[^;]*/, `$1${image}`)
      : `${style.replace(/;?$/, ';')}${image};`;
    count++;
    return `style="${next}"`;
  });
  return { xml: output, count };
}

// Every embedded image must be the catalogued artwork for the icon its cell names.
export function checkEmbeddedIcons(xml, icons) {
  const byId = new Map(icons.entries.map((e) => [e.id, e]));
  const hashes = new Set(icons.entries.map((e) => e.sha256));
  for (const [, style] of xml.matchAll(styleAttributes)) {
    const id = vendorIconId(style);
    const data = style.match(/(?:^|;)image=data:image\/(?:svg\+xml|png),([^;]*)/)?.[1];
    if (id && !byId.has(id)) throw new Error(`Unknown vendorIcon ${id}.`);
    if (id && !data) throw new Error(`vendorIcon ${id} has no artwork. Run node scripts/finalize.mjs.`);
    if (!data) continue;
    const hash = sha256(Buffer.from(data, 'base64'));
    if (id ? byId.get(id).sha256 !== hash : !hashes.has(hash))
      throw new Error(`Embedded image ${id ?? '(unnamed)'} differs from the catalogued artwork. Run finalize.mjs.`);
  }
}
