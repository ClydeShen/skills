// Regenerates the package's vendor icons from pinned npm releases. Authoring only; the skill never runs this.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { sha256 } from '../candidate/architecture-diagram/scripts/icons.mjs';
import { trimViewBox } from './trim-viewbox.mjs';

export const SOURCES = {
  '@thesvg/icons': { version: '4.0.0', dir: 'thesvg' },
  '@fabric-msft/svg-icons': { version: '11.1.0', dir: 'fabric' },
};
const OUTPUT = fileURLToPath(new URL('../candidate/architecture-diagram/assets/vendor-icons.json', import.meta.url));

// [vendor, title, slug, options]. A wordmark already shows the name, so its caption carries only the role.
// Vendors already covered by draw.io libraries stay in the catalog, not here.
const THESVG = [
  ['Kubernetes', 'Kubernetes', 'kubernetes'],
  ['Kubernetes', 'Helm', 'helm'],
  ['OpenShift', 'Red Hat OpenShift', 'openshift'],
  ['Docker', 'Docker', 'docker'],
  ['Terraform', 'Terraform', 'terraform'],
  ['Ansible', 'Ansible', 'ansible'],
  ['Argo CD', 'Argo CD', 'argocd'],
  ['Argo CD', 'Argo', 'argo'],
  ['GitHub', 'GitHub', 'github'],
  ['GitHub', 'GitHub Actions', 'github-actions'],
  ['GitHub', 'GitHub Copilot', 'github-copilot'],
  ['GitHub', 'GitHub Codespaces', 'githubcodespaces'],
  ['Jenkins', 'Jenkins', 'jenkins'],
  // These marks sit in a square canvas with wide transparent margins; only the viewBox is tightened.
  ['VMware', 'VMware', 'vmware', { trim: true, wordmark: true }],
  ['VMware', 'vSphere', 'vsphere'],
  ['Databricks', 'Databricks', 'databricks'],
  ['Snowflake', 'Snowflake', 'snowflake'],
  ['MuleSoft', 'MuleSoft', 'mulesoft', { wordmark: true }],
  ['Kong', 'Kong', 'kong'],
  ['Kafka', 'Apache Kafka', 'apache-kafka'],
  ['Confluent', 'Confluent', 'confluent', { wordmark: true }],
  ['HashiCorp', 'HashiCorp', 'hashicorp'],
  ['HashiCorp', 'Vault', 'vault'],
  ['HashiCorp', 'Consul', 'consul'],
  ['HashiCorp', 'Nomad', 'nomad'],
  ['HashiCorp', 'Packer', 'packer'],
  ['HashiCorp', 'Vagrant', 'vagrant'],
  ['HashiCorp', 'Waypoint', 'waypoint'],
  ['Splunk', 'Splunk', 'splunk', { trim: true, wordmark: true }],
  ['Dynatrace', 'Dynatrace', 'dynatrace'],
  ['Grafana', 'Grafana', 'grafana'],
  ['Grafana', 'Grafana Loki', 'grafana-loki'],
  ['Grafana', 'Prometheus', 'prometheus'],
  ['Cloudflare', 'Cloudflare', 'cloudflare'],
  ['Cloudflare', 'Cloudflare Workers', 'cloudflare-workers'],
  ['Cloudflare', 'Cloudflare Pages', 'cloudflare-pages'],
  ['Cloudflare', 'Workers AI', 'workersai-cloudflare'],
];
// Microsoft Fabric: workload marks are *_48_color, items are *_64_item.
const FABRIC = [
  ['Microsoft Fabric', 'fabric_48_color'],
  ['OneLake', 'one_lake_48_color'],
  ['Power BI', 'power_bi_48_color'],
  ['Data Factory', 'data_factory_48_color'],
  ['Data Engineering', 'data_engineering_48_color'],
  ['Data Warehouse', 'data_warehouse_48_color'],
  ['Data Science', 'data_science_48_color'],
  ['Real-Time Intelligence', 'real_time_intelligence_48_color'],
  ['Lakehouse', 'lakehouse_64_item'],
  ['Warehouse', 'data_warehouse_64_item'],
  ['SQL database', 'sql_database_64_item'],
  ['Mirrored database', 'mirrored_generic_database_64_item'],
  ['Eventstream', 'eventstream_64_item'],
  ['Eventhouse', 'event_house_64_item'],
  ['KQL database', 'kql_database_64_item'],
  ['Pipeline', 'pipeline_64_item'],
  ['Dataflow Gen2', 'dataflow_gen2_64_item'],
  ['Notebook', 'notebook_64_item'],
  ['Semantic model', 'semantic_model_64_item'],
  ['Report', 'report_64_item'],
  ['Real-Time dashboard', 'real_time_dashboard_64_item'],
  ['Data agent', 'data_agent_64_item'],
];

function aspect(svg) {
  const vb = svg.match(/viewBox=["']\s*([-\d.]+)[\s,]+([-\d.]+)[\s,]+([-\d.]+)[\s,]+([-\d.]+)/);
  if (vb) return Number(vb[3]) / Number(vb[4]);
  const w = svg.match(/<svg[^>]*\bwidth=["']([\d.]+)/);
  const h = svg.match(/<svg[^>]*\bheight=["']([\d.]+)/);
  if (!w || !h) throw new Error('SVG has no viewBox or size.');
  return Number(w[1]) / Number(h[1]);
}

function fetchSources() {
  const root = mkdtempSync(path.join(tmpdir(), 'vendor-icons-'));
  for (const [name, { version, dir }] of Object.entries(SOURCES)) {
    const file = execFileSync('npm', ['pack', `${name}@${version}`, '--silent', '--pack-destination', root], {
      encoding: 'utf8',
    })
      .trim()
      .split('\n')
      .pop();
    mkdirSync(path.join(root, dir));
    execFileSync('tar', ['xzf', path.join(root, file), '-C', path.join(root, dir)]);
  }
  return root;
}

export async function buildVendorIcons(root) {
  const entries = [];
  const add = (vendor, title, id, svg, source, license, url, { trimmed = false, wordmark = false } = {}) =>
    entries.push({
      id,
      vendor,
      title,
      source,
      license,
      url,
      ...(trimmed ? { viewBoxTrimmed: true } : {}),
      ...(wordmark ? { wordmark: true } : {}),
      aspect: Math.round(aspect(svg) * 1000) / 1000,
      sha256: sha256(svg),
      svg,
    });
  const ts = SOURCES['@thesvg/icons'];
  for (const [vendor, title, slug, { trim = false, wordmark = false } = {}] of THESVG) {
    const file = path.join(root, ts.dir, 'package', 'dist', `${slug}.js`);
    const icon = (await import(pathToFileURL(file).href)).default;
    // The canvas is white, so prefer the variant drawn for light backgrounds.
    const variant = icon.variants.light ? 'light' : 'default';
    const svg = trim ? trimViewBox(icon.variants[variant]) : icon.variants[variant];
    add(
      vendor,
      title,
      `thesvg-${slug}`,
      svg,
      { package: '@thesvg/icons', version: ts.version, path: `dist/${slug}.js`, variant },
      icon.license,
      icon.url || null,
      { trimmed: trim, wordmark },
    );
  }
  const fabric = SOURCES['@fabric-msft/svg-icons'];
  for (const [title, name] of FABRIC) {
    const svg = readFileSync(path.join(root, fabric.dir, 'package', 'svg', `${name}.svg`), 'utf8');
    add(
      'Microsoft Fabric',
      title,
      `fabric-${name}`,
      svg,
      { package: '@fabric-msft/svg-icons', version: fabric.version, path: `svg/${name}.svg` },
      'Microsoft terms: architecture diagrams, training materials and documentation',
      'https://learn.microsoft.com/en-us/fabric/fundamentals/icons',
    );
  }
  if (new Set(entries.map((e) => e.id)).size !== entries.length) throw new Error('Duplicate icon IDs.');
  return {
    version: 1,
    sources: Object.fromEntries(Object.entries(SOURCES).map(([name, s]) => [name, s.version])),
    scope:
      'Unmodified upstream SVG artwork for vendors without a draw.io library, except a tightened viewBox where marked. Brand marks are trademarks of their owners; check each entry license and url.',
    entries,
  };
}

function write(icons) {
  const { entries, ...header } = icons;
  writeFileSync(
    OUTPUT,
    JSON.stringify(header, null, 2).replace(/\n}$/, ',\n  "entries": [\n') +
      entries.map((e) => `    ${JSON.stringify(e)}`).join(',\n') +
      '\n  ]\n}\n',
  );
}

function checkLatest() {
  let stale = 0;
  for (const [name, { version }] of Object.entries(SOURCES)) {
    const latest = execFileSync('npm', ['view', name, 'version'], { encoding: 'utf8' }).trim();
    if (latest !== version) stale++;
    console.log(`${name}: pinned ${version}, latest ${latest}${latest === version ? '' : ' (update available)'}`);
  }
  process.exitCode = stale ? 2 : 0;
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  const args = process.argv.slice(2);
  if (args.includes('--check-latest')) checkLatest();
  else {
    const fetched = !args[0];
    const root = args[0] ? path.resolve(args[0]) : fetchSources();
    try {
      const icons = await buildVendorIcons(root);
      write(icons);
      console.log(`${icons.entries.length} vendor icons written to ${path.relative(process.cwd(), OUTPUT)}.`);
    } finally {
      if (fetched) rmSync(root, { recursive: true, force: true });
    }
  }
}
