import { existsSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { checkEmbeddedIcons, embedVendorIcons, loadVendorIcons } from './icons.mjs';

if (
  process.argv[1] &&
  existsSync(process.argv[1]) &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
) {
  const [file] = process.argv.slice(2);
  try {
    if (!file) throw new Error('Usage: node scripts/embed-icons.mjs <diagram.drawio>');
    const icons = loadVendorIcons();
    const { xml, count } = embedVendorIcons(readFileSync(file, 'utf8'), icons);
    checkEmbeddedIcons(xml, icons);
    writeFileSync(file, xml);
    console.log(`Embedded ${count} vendor icon(s) in ${file}; the file no longer needs this package to display them.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
