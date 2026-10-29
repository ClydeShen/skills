import { styleMap } from './catalog.mjs';

// draw.io stores user-object attributes on cell.value, not always on mxCell.
// This function is also serialized into the browser renderer.
export function annotationMetadata(cell) {
  const read = key => cell.value?.getAttribute?.(key) || cell[key] || null;
  return { annotationKind: read('annotationKind'), annotationFor: read('annotationFor') };
}

export function pageSize(source) {
  const width = Number(source.match(/\bpageWidth="([^"]*)"/)?.[1] ?? 1900);
  const height = Number(source.match(/\bpageHeight="([^"]*)"/)?.[1] ?? 1040);
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 400 || height < 300 || width > 6000 || height > 4000 || width * height > 20_000_000) throw new Error('Unsupported render page dimensions.');
  return { width, height };
}

export function referencedAssets(source, catalog) {
  const allowed = new Set(catalog.entries.filter(e => e.usable).map(e => styleMap(e.style).image).filter(Boolean));
  const refs = [...new Set([...source.matchAll(/\bimage=([^;"<>]+)(?:;|(?="))/g)].map(m => m[1]))];
  for (const ref of refs) {
    if (!/^img\/lib\/[a-zA-Z0-9_./-]+\.svg$/.test(ref) || ref.split('/').includes('..') || !allowed.has(ref)) throw new Error(`Uncatalogued or unsafe render image: ${ref}`);
  }
  return refs;
}
