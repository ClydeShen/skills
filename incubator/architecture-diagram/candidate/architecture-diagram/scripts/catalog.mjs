import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFileSync, existsSync, realpathSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { createContext, runInContext } from 'node:vm';
import { fileURLToPath } from 'node:url';

export const upstreamCommit = '84487b4891cbc0f32d7e30f34cf878c87cb1f414';
export const upstreamVersion = '32.6.1';
export const styleMap = style => Object.fromEntries(style.split(';').filter(s => s.includes('=')).map(s => {
  const i = s.indexOf('='); return [s.slice(0, i), s.slice(i + 1)];
}));
const digest = text => createHash('sha256').update(text).digest('hex');

export function buildCatalog(checkout) {
  const git = args => execFileSync('git', ['-C', checkout, ...args], { encoding: 'utf8', maxBuffer: 30 * 1024 * 1024 });
  if (git(['rev-parse', 'HEAD']).trim() !== upstreamCommit) throw new Error('Checkout must be the pinned draw.io commit.');
  const sources = {};
  const read = relative => {
    const file = `src/main/webapp/${relative}`;
    const text = git(['show', `HEAD:${file}`]);
    sources[file] = digest(text);
    return text;
  };
  const tree = new Set(git(['ls-tree', '-r', '--name-only', 'HEAD']).trim().split('\n'));
  const registry = { loadStencil() { throw new Error('Unbundled stencil requested.'); } };
  const context = createContext({ mxStencilRegistry: registry, STENCIL_PATH: '/stencils', atob,
    TextDecoder, pako: { inflateRaw: bytes => new Uint8Array(inflateRawSync(bytes)) } });
  runInContext(read('js/stencils.min.js'), context, { timeout: 20_000 });
  const registered = new Set();
  for (const library of ['aws4', 'gcp3', 'kubernetes', 'kubernetes2']) {
    const doc = registry.loadStencil(`/stencils/${library}.xml`).documentElement;
    const prefix = doc.getAttribute('name').toLowerCase();
    for (const shape of doc.getElementsByTagName('shape')) registered.add(`${prefix}.${shape.getAttribute('name').toLowerCase().replaceAll(' ', '_')}`);
  }
  const wrappers = new Set();
  for (const file of ['shapes/mxAWS4.js', 'shapes/mxKubernetes.js']) {
    const source = read(file);
    for (const match of source.matchAll(/registerShape\(\w+\.prototype\.cst\.(\w+),/g)) {
      const value = source.match(new RegExp(`\\b${match[1]}\\s*:\\s*['\"]([^'\"]+)['\"]`));
      if (!value) throw new Error(`Cannot resolve registered wrapper ${match[1]}`);
      wrappers.add(value[1]);
    }
  }
  const entries = [];
  for (const [vendor, library, name] of [['AWS', 'aws4', 'AWS4'], ['Azure', 'azure2', 'Azure2'], ['Google Cloud', 'gcp3', 'GCP3'], ['Kubernetes', 'kubernetes', 'Kubernetes']]) {
    let palette = '';
    function Sidebar() {}
    Object.assign(Sidebar.prototype, {
      setCurrentSearchEntryLibrary(_library, value) { palette = value || library; },
      getTagsForStencil() { return []; },
      addPaletteFunctions() {},
      addPalette() {}, // Entries are captured when the upstream factory is called, before DOM insertion.
      createEdgeTemplateEntry() { return () => {}; },
      createVertexTemplateEntry(style, width, height, label, title) {
        const properties = styleMap(style);
        const problems = [];
        for (const key of ['shape', 'resIcon', 'grIcon']) {
          const ref = properties[key];
          if (ref?.startsWith('mxgraph.') && !registered.has(ref) && !wrappers.has(ref)) problems.push(`Unknown ${key}: ${ref}`);
        }
        if (properties.prIcon && !['mxgraph.kubernetes.', 'mxgraph.kubernetes2.'].some(p => registered.has(p + properties.prIcon))) problems.push(`Unknown prIcon: ${properties.prIcon}`);
        if (properties.image && !tree.has(`src/main/webapp/${properties.image}`)) problems.push(`Missing or wrong-case image: ${properties.image}`);
        const normalizedTitle = (title || label || '').replaceAll('\n', ' ').trim();
        entries.push({ id: `${library}-${digest(style + '\n' + normalizedTitle).slice(0, 16)}`, vendor, library,
          palette, title: normalizedTitle, style, width, height, usable: problems.length === 0, problems });
        return () => ({});
      },
    });
    const sandbox = createContext({ Sidebar, mxConstants: { STYLE_SHAPE: 'shape' }, mxUtils: { bind: (self, fn) => fn.bind(self) } });
    runInContext(read(`js/diagramly/sidebar/Sidebar-${name}.js`), sandbox, { timeout: 10_000 });
    runInContext(`new Sidebar().add${name}Palette()`, sandbox, { timeout: 10_000 });
  }
  const unique = [...new Map(entries.map(entry => [entry.id, entry])).values()].sort((a, b) => a.id.localeCompare(b.id, 'en'));
  return { version: 1, drawio_version: upstreamVersion, upstream_commit: upstreamCommit,
    source: `https://github.com/jgraph/drawio/tree/${upstreamCommit}`, source_sha256: sources,
    scope: 'Palette metadata and style strings only; no icon artwork. Exact titles are upstream labels, not a complete service alias map.',
    entries: unique };
}

export function catalogMain([checkout, output]) {
  if (!checkout || !output) throw new Error('Usage: node scripts/catalog.mjs <pinned-drawio-checkout> <catalog.json>');
  const catalog = buildCatalog(checkout);
  // Generated metadata is regenerated as a whole, never edited by hand.
  const { entries, ...header } = catalog;
  writeFileSync(output, JSON.stringify(header, null, 2).replace(/\n}$/, ',\n  "entries": [\n') + entries.map(e => '    ' + JSON.stringify(e)).join(',\n') + '\n  ]\n}\n');
  console.log(JSON.stringify({ entries: entries.length, counts: Object.fromEntries(['aws4', 'azure2', 'gcp3', 'kubernetes'].map(l => [l, entries.filter(e => e.library === l).length])), unusable: entries.filter(e => !e.usable).map(e => ({ title: e.title, problems: e.problems })) }, null, 2));
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) catalogMain(process.argv.slice(2));
