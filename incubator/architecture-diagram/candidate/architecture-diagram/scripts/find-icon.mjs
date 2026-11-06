import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { boundaryPlacement, FALLBACK, iconEntries, iconPlacement, loadVendorIcons } from './icons.mjs';

export function findIcons(catalog, { vendor, title, id }) {
  if (!vendor || Boolean(title) === Boolean(id)) throw new Error('Specify vendor and exactly one of title or id.');
  return catalog.entries.filter((e) => e.usable && e.vendor === vendor && (id ? e.id === id : e.title === title));
}

const usage =
  'Usage: node scripts/find-icon.mjs --vendor <vendor> (--title <exact-title> | --id <exact-id>) [--boundary] [--library <local-file>]\n       node scripts/find-icon.mjs [--vendor <vendor>] --list';

if (
  process.argv[1] &&
  existsSync(process.argv[1]) &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
) {
  try {
    const args = process.argv.slice(2),
      options = {};
    for (let i = 0; i < args.length; i++) {
      if (['--list', '--boundary'].includes(args[i])) {
        options[args[i].slice(2)] = true;
        continue;
      }
      const key = args[i].slice(2);
      if (!['--vendor', '--title', '--id', '--library'].includes(args[i]) || !args[i + 1] || options[key])
        throw new Error(usage);
      options[key] = args[++i];
    }
    if (options.library) process.env.ARCHITECTURE_ICON_LIBRARIES = options.library;
    const catalog = JSON.parse(readFileSync(new URL('../assets/catalog.json', import.meta.url), 'utf8'));
    const entries = iconEntries(catalog, loadVendorIcons()).filter((e) => e.usable);
    if (options.list) {
      if (options.title || options.id || options.boundary) throw new Error(usage);
      const counts = {};
      for (const e of entries) counts[e.vendor] = (counts[e.vendor] ?? 0) + 1;
      const titles = options.vendor && [
        ...new Set(entries.filter((e) => e.vendor === options.vendor).map((e) => e.title)),
      ];
      if (options.vendor && !titles.length) throw new Error(`Unknown vendor ${options.vendor}.`);
      console.log(
        JSON.stringify(
          options.vendor ? { vendor: options.vendor, titles: titles.sort() } : { vendors: counts },
          null,
          2,
        ),
      );
    } else {
      const matches = findIcons({ entries }, options).map(({ svg, png, ...entry }) => ({
        ...entry,
        placement: iconPlacement(svg || png ? { ...entry, svg, png } : entry),
        ...(options.boundary ? { boundary: boundaryPlacement(svg || png ? { ...entry, svg, png } : entry) } : {}),
      }));
      console.log(
        JSON.stringify(
          {
            drawio_version: catalog.drawio_version,
            matches,
            decision:
              matches.length === 1
                ? 'Verify service meaning, then use placement.style, width and height unchanged.'
                : matches.length
                  ? 'Ambiguous: select an evidenced entry ID.'
                  : 'No exact usable match: use the plain-box fallback.',
            ...(matches.length ? {} : { fallback: FALLBACK }),
          },
          null,
          2,
        ),
      );
      if (!matches.length) process.exitCode = 1;
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
