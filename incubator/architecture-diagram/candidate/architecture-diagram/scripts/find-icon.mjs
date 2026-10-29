import { readFileSync, existsSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function findIcons(catalog, { vendor, title, id }) {
  if (!vendor || Boolean(title) === Boolean(id)) throw new Error('Specify vendor and exactly one of title or id.');
  return catalog.entries.filter(e => e.usable && e.vendor === vendor && (id ? e.id === id : e.title === title));
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  try {
    const args = process.argv.slice(2), options = {};
    for (let i = 0; i < args.length; i += 2) {
      const key = args[i].slice(2);
      if (!['--vendor', '--title', '--id'].includes(args[i]) || !args[i + 1] || options[key]) throw new Error('Usage: node scripts/find-icon.mjs --vendor <vendor> (--title <exact-title> | --id <exact-id>)');
      options[key] = args[i + 1];
    }
    const catalog = JSON.parse(readFileSync(new URL('../assets/catalog.json', import.meta.url), 'utf8'));
    const matches = findIcons(catalog, options);
    console.log(JSON.stringify({ drawio_version: catalog.drawio_version, matches, decision: matches.length === 1 ? 'Verify service meaning before use.' : matches.length ? 'Ambiguous: select an evidenced entry ID.' : 'No exact usable match: use the plain-box fallback.' }, null, 2));
    if (!matches.length) process.exitCode = 1;
  } catch (error) {
    console.error(error.message); process.exitCode = 1;
  }
}
