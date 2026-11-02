// Regenerates the package's vendor icons from pinned npm releases. Authoring only; the skill never runs this.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
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
  // AI providers and tooling. Variant names are not consistent across icons, so each is chosen by eye.
  ['OpenAI', 'OpenAI', 'openai', { variant: 'light' }],
  ['OpenAI', 'ChatGPT', 'openai-chatgpt', { variant: 'default' }],
  ['Anthropic', 'Anthropic', 'anthropic', { variant: 'light' }],
  ['Anthropic', 'Claude', 'claude', { variant: 'default' }],
  ['Anthropic', 'Claude Code', 'claude-code', { variant: 'default' }],
  ['Google', 'Gemini', 'gemini', { variant: 'default' }],
  ['Microsoft', 'Microsoft Copilot', 'microsoft-copilot', { variant: 'default' }],
  ['Microsoft', 'Microsoft 365 Copilot', 'microsoft-365-copilot', { variant: 'default' }],
  ['NVIDIA', 'NVIDIA', 'nvidia', { variant: 'light' }],
  ['Hugging Face', 'Hugging Face', 'hugging-face', { variant: 'default' }],
  ['LangChain', 'LangChain', 'langchain', { variant: 'default' }],
  ['LangChain', 'LangGraph', 'langgraph', { variant: 'default' }],
  ['LangChain', 'LangSmith', 'langsmith-langchain', { variant: 'default' }],
  ['LlamaIndex', 'LlamaIndex', 'llamaindex', { variant: 'default' }],
  ['CrewAI', 'CrewAI', 'crewai', { variant: 'default' }],
  ['Pydantic', 'Pydantic AI', 'pydanticai', { variant: 'default' }],
  ['Mastra', 'Mastra', 'mastra', { variant: 'default' }],
  ['MLflow', 'MLflow', 'mlflow', { variant: 'default' }],
  ['Ollama', 'Ollama', 'ollama', { variant: 'default' }],
  ['vLLM', 'vLLM', 'vllm', { variant: 'color' }],
  // The default Pinecone variant is a wordmark; mono is the symbol alone.
  ['Pinecone', 'Pinecone', 'pinecone', { variant: 'mono' }],
  ['Langfuse', 'Langfuse', 'langfuse', { variant: 'default' }],
  ['Dify', 'Dify', 'dify', { variant: 'default' }],
  ['n8n', 'n8n', 'n8n', { variant: 'color' }],
  ['Palantir', 'Palantir', 'palantir', { variant: 'default' }],
  ['Salesforce', 'Salesforce', 'salesforce', { variant: 'default' }],
  ['Model Context Protocol', 'Model Context Protocol', 'model-context-protocol', { variant: 'light' }],
];
// Official project repositories, pinned to a commit, for marks no package carries.
const GITHUB = [
  [
    'A2A',
    'Agent2Agent Protocol',
    'a2aproject/A2A',
    '6fd5c389147b0095fd718d51d0a68dfa52bff698',
    'docs/assets/a2a-logo-black.svg',
    'Apache-2.0',
  ],
  [
    'Google',
    'Agent Development Kit',
    'google/adk-python',
    '2623c710868d832b6d5119f38e22d82adb3de66b',
    'src/google/adk/cli/browser/assets/ADK-512-color.svg',
    'Apache-2.0',
  ],
  [
    'Microsoft',
    'AutoGen',
    'microsoft/autogen',
    '4a3634d6da6365ca4e774d4d7be61f863a5f360d',
    'python/docs/src/_static/images/logo/logo.svg',
    'CC-BY-4.0',
  ],
  [
    'Microsoft',
    'Semantic Kernel',
    'microsoft/semantic-kernel',
    '1e6039769ed4d9648b4598a13b1962402203574b',
    'dotnet/nuget/icon.png',
    'MIT',
  ],
  [
    'Microsoft',
    'Microsoft Agent Framework',
    'microsoft/agent-framework',
    'e7c7f7477a1f28b8fd2caa01e7c869cb87f6f4e8',
    'dotnet/nuget/icon.png',
    'MIT',
  ],
  [
    'Weaviate',
    'Weaviate',
    'weaviate/weaviate-io',
    '4e8c78603d34561a5e3bc311d9a560109e0523bd',
    'static/img/site/weaviate-logo-icon.svg',
    'Trademark of Weaviate; repository has no licence',
  ],
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
  if (Buffer.isBuffer(svg)) return svg.readUInt32BE(16) / svg.readUInt32BE(20); // PNG IHDR width / height
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

// Uses a local copy at <root>/github/<repo>/<path> when present, else the pinned raw file.
async function githubFile(root, repo, commit, file) {
  const local = path.join(root, 'github', repo, file);
  if (existsSync(local)) return readFileSync(local);
  const response = await fetch(`https://raw.githubusercontent.com/${repo}/${commit}/${file}`);
  if (!response.ok) throw new Error(`${repo}/${file}: HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

export async function buildVendorIcons(root) {
  const entries = [];
  const add = (vendor, title, id, art, source, license, url, { trimmed = false, wordmark = false } = {}) =>
    entries.push({
      id,
      vendor,
      title,
      source,
      license,
      url,
      ...(trimmed ? { viewBoxTrimmed: true } : {}),
      ...(wordmark ? { wordmark: true } : {}),
      aspect: Math.round(aspect(art) * 1000) / 1000,
      sha256: sha256(art),
      ...(Buffer.isBuffer(art) ? { png: art.toString('base64') } : { svg: art }),
    });
  const ts = SOURCES['@thesvg/icons'];
  for (const [vendor, title, slug, { trim = false, wordmark = false, variant: chosen } = {}] of THESVG) {
    const file = path.join(root, ts.dir, 'package', 'dist', `${slug}.js`);
    const icon = (await import(pathToFileURL(file).href)).default;
    // The canvas is white, so prefer the variant drawn for light backgrounds unless one was chosen by eye.
    const variant = chosen ?? (icon.variants.light ? 'light' : 'default');
    if (!icon.variants[variant]) throw new Error(`${slug} has no ${variant} variant.`);
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
  for (const [vendor, title, repo, commit, file, license] of GITHUB) {
    const data = await githubFile(root, repo, commit, file);
    const art = file.endsWith('.png') ? data : data.toString('utf8');
    const id = `github-${repo.split('/')[1].toLowerCase()}-${path
      .basename(file)
      .replace(/\.[a-z]+$/, '')
      .toLowerCase()}`;
    add(vendor, title, id, art, { repository: repo, commit, path: file }, license, `https://github.com/${repo}`);
  }
  if (new Set(entries.map((e) => e.id)).size !== entries.length) throw new Error('Duplicate icon IDs.');
  return {
    version: 1,
    sources: Object.fromEntries(Object.entries(SOURCES).map(([name, s]) => [name, s.version])),
    scope:
      'Unmodified upstream SVG or PNG artwork for vendors without a draw.io library, except a tightened viewBox where marked. Brand marks are trademarks of their owners; check each entry license and url.',
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
