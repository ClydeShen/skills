import { deflateRawSync } from 'node:zlib';
import { styleMap } from './catalog.mjs';
import { checkEmbeddedIcons, sha256 } from './icons.mjs';

// draw.io stores user-object attributes on cell.value, not always on mxCell.
// This function is also serialized into the browser renderer.
export function annotationMetadata(cell) {
  const read = (key) => cell.value?.getAttribute?.(key) || cell[key] || null;
  return { annotationKind: read('annotationKind'), annotationFor: read('annotationFor') };
}

export function pageSize(source) {
  const width = Number(source.match(/\bpageWidth="([^"]*)"/)?.[1] ?? 1900);
  const height = Number(source.match(/\bpageHeight="([^"]*)"/)?.[1] ?? 1040);
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 400 ||
    height < 300 ||
    width > 6000 ||
    height > 4000 ||
    width * height > 20_000_000
  )
    throw new Error('Unsupported render page dimensions.');
  return { width, height };
}

export function referencedAssets(source, catalog, icons = { entries: [] }) {
  const allowed = new Set(
    catalog.entries
      .filter((e) => e.usable)
      .map((e) => styleMap(e.style).image)
      .filter(Boolean),
  );
  const embedded = new Set(icons.entries.map((e) => e.sha256));
  checkEmbeddedIcons(source, icons);
  const refs = [...new Set([...source.matchAll(/\bimage=([^;"<>]+)(?:;|(?="))/g)].map((m) => m[1]))];
  const files = [];
  for (const ref of refs) {
    const data = ref.match(/^data:image\/(?:svg\+xml|png),([A-Za-z0-9+/=]+)$/)?.[1];
    if (data && embedded.has(sha256(Buffer.from(data, 'base64')))) continue;
    if (!/^img\/lib\/[a-zA-Z0-9_./-]+\.svg$/.test(ref) || ref.split('/').includes('..') || !allowed.has(ref))
      throw new Error(`Uncatalogued or unsafe render image: ${ref.slice(0, 80)}`);
    files.push(ref);
  }
  return files;
}

// Needs no installation. Browsers do not send the part after # to the server, so the diagram stays on the device.
export function editorLink(xml) {
  const data = deflateRawSync(encodeURIComponent(xml)).toString('base64');
  return `https://app.diagrams.net/#R${encodeURIComponent(data)}`;
}
