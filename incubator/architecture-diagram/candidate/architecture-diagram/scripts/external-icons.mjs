// Optional local libraries supply artwork to the consumer, never to the installed package.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { inflateRawSync } from 'node:zlib';

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const limit = 16 * 1024 * 1024;
const unescapeXml = (text) =>
  text.replace(/&(quot|apos|lt|gt|amp);/g, (_, key) => ({ quot: '"', apos: "'", lt: '<', gt: '>', amp: '&' })[key]);

export function libraryEntries(file) {
  const bytes = readFileSync(file);
  if (bytes.length > limit) throw new Error('Icon library exceeds 16 MiB.');
  const text = bytes.toString('utf8').trim();
  const match = text.match(/^<mxlibrary(?:\s[^>]*)?>([\s\S]*)<\/mxlibrary>$/);
  const entries = JSON.parse(match ? unescapeXml(match[1]) : text);
  if (!Array.isArray(entries) || entries.length > 5000) throw new Error('Expected at most 5000 library entries.');
  const libraryHash = hash(bytes);
  return entries
    .map((entry, index) => {
      let data = entry.data;
      if (!data && entry.xml) {
        const xml = entry.xml.trim().startsWith('<')
          ? entry.xml
          : decodeURIComponent(
              inflateRawSync(Buffer.from(entry.xml, 'base64'), { maxOutputLength: limit }).toString('utf8'),
            );
        const images = [...xml.matchAll(/(?:^|;)image=(data:image\/(?:svg\+xml|png),[^;"<>]+)/g)];
        // Groups, connectors and native stencils are not flattened into a misleading icon.
        if (images.length !== 1 || (xml.match(/vertex="1"/g) || []).length !== 1) return null;
        data = images[0][1];
      }
      if (!data || !entry.title) return null;
      const image = data.match(/^data:image\/(svg\+xml|png)(?:;base64)?,(?:base64,)?([A-Za-z0-9+/=]+)$/);
      if (!image) return null;
      const artwork = Buffer.from(image[2], 'base64');
      if (artwork.length > 2 * 1024 * 1024) throw new Error('Library icon exceeds 2 MiB.');
      const svg = artwork.toString('utf8');
      if (
        image[1] === 'svg+xml' &&
        (!/<svg\b/i.test(svg) ||
          /<!DOCTYPE|<!ENTITY|<\s*(?:[\w-]+:)?(?:script|foreignObject|iframe|object|embed|image|style|animate\w*|set)\b|\bon[a-z]+\s*=|(?:href|src)\s*=\s*["'](?!#)|url\(\s*(?!#)/i.test(
            svg,
          ))
      )
        return null;
      if (image[1] === 'png' && !artwork.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
        return null;
      const width = Number(entry.w),
        height = Number(entry.h);
      if (!(width > 0 && height > 0 && Number.isFinite(width / height))) return null;
      return {
        id: `local-${libraryHash.slice(0, 16)}-${index}`,
        vendor: entry.vendor || 'Local library',
        title: entry.title,
        source: { library: path.basename(file), sha256: libraryHash, entry: index },
        license: 'User-selected library: retain its applicable terms and output attribution.',
        sha256: hash(artwork),
        aspect: width / height,
        ...(image[1] === 'png' ? { png: artwork.toString('base64') } : { svg }),
      };
    })
    .filter(Boolean);
}

export function externalIconEntries(value = process.env.ARCHITECTURE_ICON_LIBRARIES) {
  return value ? value.split(path.delimiter).filter(Boolean).flatMap(libraryEntries) : [];
}
