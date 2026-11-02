// Builds the icon availability sheet through the skill package itself: its lookup data,
// its standard placement and its embedding. Run from the repository root:
//   node incubator/architecture-diagram/evals/icon-coverage-2026-11-02/generate.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import {
  embedVendorIcons,
  FALLBACK,
  iconEntries,
  iconPlacement,
  loadVendorIcons,
} from '../../candidate/architecture-diagram/scripts/icons.mjs';
import { formatDrawio } from '../../candidate/architecture-diagram/scripts/drawio-format.mjs';

const here = (file) => new URL(file, import.meta.url);
const catalog = JSON.parse(readFileSync(here('../../candidate/architecture-diagram/assets/catalog.json'), 'utf8'));
const icons = loadVendorIcons();
const entries = iconEntries(catalog, icons).filter((e) => e.usable);
const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const pick = (vendor, title, caption = title, filter = () => true) => {
  const found = entries.filter((e) => e.vendor === vendor && e.title === title && filter(e));
  if (!found.length) throw new Error(`No icon for ${vendor} / ${title}`);
  return { caption, placement: iconPlacement(found[0]), source: found[0].source?.package ?? found[0].source?.repository ?? `draw.io ${found[0].library}` };
};
const all = (vendor) => icons.entries.filter((e) => e.vendor === vendor).map((e) => pick(vendor, e.title));
const fallback = (caption) => ({ caption, placement: FALLBACK, source: 'plain-box fallback' });

const k8sNames = {
  pod: 'Pod', deploy: 'Deployment', rs: 'ReplicaSet', sts: 'StatefulSet', ds: 'DaemonSet', job: 'Job',
  cronjob: 'CronJob', svc: 'Service', ing: 'Ingress', ep: 'Endpoints', netpol: 'NetworkPolicy', cm: 'ConfigMap',
  secret: 'Secret', pv: 'PersistentVolume', pvc: 'PVC', sc: 'StorageClass', vol: 'Volume', ns: 'Namespace',
  hpa: 'HPA', quota: 'ResourceQuota', limits: 'LimitRange', sa: 'ServiceAccount', role: 'Role',
  c_role: 'ClusterRole', rb: 'RoleBinding', crb: 'ClusterRoleBinding', crd: 'CRD', psp: 'PodSecurityPolicy',
  user: 'User', group: 'Group', node: 'Node', control_plane: 'Control plane', api: 'API server', etcd: 'etcd',
  sched: 'Scheduler', c_m: 'Controller manager', c_c_m: 'Cloud controller manager', kubelet: 'Kubelet',
  k_proxy: 'kube-proxy',
};
const k8s = [];
for (const e of entries.filter((x) => x.library === 'kubernetes' && !/kubernetesLabel=1/.test(x.style))) {
  const key = e.style.match(/prIcon=([^;]+)/)?.[1];
  if (k8s.some((k) => k.key === key)) continue;
  k8s.push({ key, caption: k8sNames[key] ?? e.title, placement: iconPlacement(e), source: 'draw.io kubernetes' });
}

const vendors = [
  ['Kubernetes', [...all('Kubernetes'), ...k8s]],
  ['OpenShift', [...all('OpenShift'), pick('Azure', 'Red Hat OpenShift', 'Azure Red Hat OpenShift'), pick('AWS', 'Red Hat OpenShift Service on AWS', 'ROSA')]],
  ['Docker', all('Docker')],
  ['Terraform', all('Terraform')],
  ['Ansible', all('Ansible')],
  ['Argo CD', all('Argo CD')],
  ['GitHub', [...all('GitHub'), fallback('GitHub Pages')]],
  ['Azure DevOps', [pick('Azure', 'DevOps', 'Azure DevOps')]],
  ['Jenkins', all('Jenkins')],
  ['VMware', [...all('VMware'), pick('Azure', 'VMWare Solution', 'Azure VMware Solution'), pick('AWS', 'Elastic VMware Service', 'Elastic VMware Service', (e) => /Compute/.test(e.palette))]],
  ['Databricks', [...all('Databricks'), pick('Azure', 'Databricks', 'Azure Databricks')]],
  ['Snowflake', all('Snowflake')],
  ['Microsoft Fabric', all('Microsoft Fabric')],
  ['MuleSoft', all('MuleSoft')],
  ['Apigee', [pick('Google Cloud', 'Apigee')]],
  ['Kong', all('Kong')],
  ['Kafka', [...all('Kafka'), pick('AWS', 'Managed Streaming for Apache Kafka', 'Amazon MSK')]],
  ['Confluent', all('Confluent')],
  ['HashiCorp', all('HashiCorp')],
  ['Splunk', all('Splunk')],
  ['Dynatrace', all('Dynatrace')],
  ['Grafana', [...all('Grafana'), pick('Azure', 'Grafana', 'Azure Managed Grafana'), pick('AWS', 'Managed Grafana', 'Amazon Managed Grafana')]],
  ['Cloudflare', all('Cloudflare')],
];

const aiVendors = [
  ['OpenAI', [...all('OpenAI'), fallback('OpenAI Agents SDK')]],
  ['Anthropic', [...all('Anthropic'), fallback('Claude Agent SDK')]],
  ['Google', [...all('Google'), pick('Google Cloud', 'Vertex AI')]],
  ['Microsoft', all('Microsoft')],
  ['Microsoft Foundry and Azure AI', [
    pick('Azure', 'AI Foundry', 'Microsoft Foundry'), pick('Azure', 'Foundry Models'), pick('Azure', 'Foundry Agent Service'),
    pick('Azure', 'OpenAI', 'Azure OpenAI'), pick('Azure', 'Azure Machine Learning'), pick('Azure', 'Cognitive Services', 'Azure AI services'),
    pick('Azure', 'Copilot Studio'),
  ]],
  ['AWS', [pick('AWS', 'Bedrock'), pick('AWS', 'Bedrock AgentCore')]],
  ['Databricks', [...all('Databricks'), pick('Azure', 'Databricks', 'Azure Databricks')]],
  ['NVIDIA and Hugging Face', [...all('NVIDIA'), ...all('Hugging Face')]],
  ['LangChain', all('LangChain')],
  ['Agent frameworks', [...all('LlamaIndex'), ...all('CrewAI'), ...all('Pydantic'), ...all('Mastra')]],
  ['Model serving and MLOps', [...all('MLflow'), ...all('Ollama'), ...all('vLLM')]],
  ['Vector databases', [...all('Pinecone'), ...all('Weaviate')]],
  ['LLM observability', all('Langfuse')],
  ['Protocols', [...all('Model Context Protocol'), ...all('A2A')]],
  ['Workflow platforms', [...all('Dify'), ...all('n8n')]],
  ['Enterprise AI', [...all('Palantir'), ...all('Salesforce')]],
];

// Grid of 160-wide slots; a placement wider than one slot takes two. Every size comes from iconPlacement.
const COL = 240, SLOT = 160, ROW = 164, PER_ROW = 8, BAND = 72, TOP = 100, PAD = 30;
const font = 'fontFamily=Helvetica;fontColor=#263238;';
function sheet(name, title, groups) {
  const cells = [
    `<mxCell id="title" value="${esc(title)}" style="text;html=1;align=left;fontSize=24;${font}" vertex="1" parent="1"><mxGeometry x="${PAD}" y="20" width="1000" height="36" as="geometry"/></mxCell>`,
    `<mxCell id="note" value="Placement and artwork from find-icon.mjs and finalize.mjs. Grey box: no usable icon (plain-box fallback)." style="text;html=1;align=left;fontSize=16;${font}" vertex="1" parent="1"><mxGeometry x="${PAD}" y="56" width="1300" height="26" as="geometry"/></mxCell>`,
  ];
  let y = TOP, n = 0;
  for (const [group, items] of groups) {
    let slot = 0;
    const placed = items.map((it) => {
      const span = it.placement.width > SLOT - 16 ? 2 : 1;
      if ((slot % PER_ROW) + span > PER_ROW) slot += PER_ROW - (slot % PER_ROW);
      const at = slot;
      slot += span;
      return { ...it, at, span };
    });
    const h = Math.ceil(slot / PER_ROW) * ROW;
    cells.push(`<mxCell id="v${n++}" value="${esc(group)}" style="text;html=1;whiteSpace=wrap;align=left;verticalAlign=middle;fontSize=18;fontStyle=1;${font}" vertex="1" parent="1"><mxGeometry x="${PAD}" y="${y}" width="${COL - 20}" height="${h - 12}" as="geometry"/></mxCell>`);
    for (const it of placed) {
      const { width, height, style } = it.placement;
      const cx = PAD + COL + (it.at % PER_ROW) * SLOT + (it.span * SLOT) / 2;
      const top = y + Math.floor(it.at / PER_ROW) * ROW + 8 + (BAND - height) / 2;
      cells.push(`<mxCell id="i${n++}" value="${esc(it.caption)}" style="${esc(style)}${font}" vertex="1" parent="1"><mxGeometry x="${(cx - width / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${width}" height="${height}" as="geometry"/></mxCell>`);
    }
    y += h;
    cells.push(`<mxCell id="r${n++}" value="" style="line;strokeColor=#E0E0E0;" vertex="1" parent="1"><mxGeometry x="${PAD}" y="${y - 8}" width="${COL + PER_ROW * SLOT}" height="1" as="geometry"/></mxCell>`);
  }
  const width = PAD * 2 + COL + PER_ROW * SLOT;
  const xml = `<mxfile host="drawio" version="32.6.1"><diagram id="icons" name="Icons"><mxGraphModel dx="0" dy="0" grid="0" page="1" pageWidth="${width}" pageHeight="${y + PAD}" background="#FFFFFF"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${cells.join('')}</root></mxGraphModel></diagram></mxfile>\n`;
  writeFileSync(here(`./${name}.drawio`), formatDrawio(embedVendorIcons(xml, icons).xml));
  return groups.flatMap(([group, items]) =>
    items.map(({ caption, placement, source }) => ({ group, caption, kind: placement.kind, width: placement.width, height: placement.height, source })),
  );
}

const platform = sheet('icon-sheet', 'Non-cloud vendor icons in the architecture-diagram skill', vendors);
const ai = sheet('ai-icon-sheet', 'AI provider and tooling icons in the architecture-diagram skill', aiVendors);
writeFileSync(here('./icon-sources.json'), `${JSON.stringify({ platform, ai }, null, 2)}\n`);
console.log(`${platform.length} platform and ${ai.length} AI placements.`);
