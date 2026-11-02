import { existsSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { formatDrawio } from './drawio-format.mjs';
import { checkEmbeddedIcons, embedVendorIcons, loadVendorIcons } from './icons.mjs';

// Prepares a diagram for delivery: embeds vendor artwork and writes draw.io's own file layout.
export function finalize(xml, icons = loadVendorIcons()) {
  const { xml: embedded, count } = embedVendorIcons(xml, icons);
  checkEmbeddedIcons(embedded, icons);
  return { xml: formatDrawio(embedded), count };
}

if (
  process.argv[1] &&
  existsSync(process.argv[1]) &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
) {
  const [file] = process.argv.slice(2);
  try {
    if (!file) throw new Error('Usage: node scripts/finalize.mjs <diagram.drawio>');
    const { xml, count } = finalize(readFileSync(file, 'utf8'));
    writeFileSync(file, xml);
    console.log(
      `Finalized ${file}: embedded ${count} vendor icon(s) and wrote draw.io's file layout, so it opens in draw.io and imports into tools such as Lucidchart.`,
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
