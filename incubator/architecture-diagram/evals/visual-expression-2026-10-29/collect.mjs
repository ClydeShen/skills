import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { XMLParser } from 'fast-xml-parser';
import { layoutMetrics } from '../../tools/layout-metrics.mjs';
import { inspectDiagram } from '../collect-roundtrips.mjs';

const read = name => readFileSync(new URL(name, import.meta.url));
const json = name => JSON.parse(read(name));
const hash = name => createHash('sha256').update(read(name)).digest('hex');
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
const list = value => value == null ? [] : Array.isArray(value) ? value : [value];
function noteCount(path) {
  const root = parser.parse(read(path)).mxfile.diagram.mxGraphModel.root;
  const cells = [...list(root.mxCell), ...list(root.object).map(o => ({ ...o.mxCell, ...o }))];
  return cells.filter(c => c.annotationKind === 'comment' || /(?:^|;)shape=note;/.test(c.style || '')).length;
}
const catalog = json('../../prototype/catalog.json');
const report = {
  date: '2026-10-29', mode: 'iterative-visual-expression-with-blind-readout',
  baselineCommit: 'b183ee13d51004fc324239067420cf11aeeff253',
  policySha256: hash('./inputs/drawing-policy.txt'),
  readers: {
    '02': { context: '/root/visual_read_c', fork_turns: 'none', input: 'c.png only' },
    '03': { context: '/root/visual_read_d', fork_turns: 'none', input: 'd.png only' },
  },
  model: 'Host agent; exact model identity and sampling parameters not exposed; no separately configured model endpoint invoked.',
  isolation: 'Fresh conversations with shared filesystem access, not per-worker OS sandboxes. Source attestations are retained in visual-review.txt.',
  interpretation: 'Note and route counts are diagnostics, not quality scores. This is not a full L0-to-L4 chain or independent fact-ledger judgment.',
  cases: {},
};
for (const id of ['02', '03']) {
  const before = json(`../layout-revision-2026-10-29/case-${id}/diagram.render.json`);
  const after = json(`./case-${id}/diagram.render.json`);
  const artifacts = ['diagram.drawio', 'diagram.svg', 'diagram.png', 'diagram.render.json', 'readout.txt', 'visual-review.txt'];
  report.cases[id] = {
    sourceSha256: hash(`../layout-revision-2026-10-29/inputs/l0-${id}.txt`),
    generatorSha256: hash(`./generate-${id}.mjs`),
    artifacts: Object.fromEntries(artifacts.map(name => [name, hash(`./case-${id}/${name}`)])),
    notes: { before: noteCount(`../layout-revision-2026-10-29/case-${id}/diagram.drawio`), after: noteCount(`./case-${id}/diagram.drawio`) },
    checks: inspectDiagram(read(`./case-${id}/diagram.drawio`).toString(), after, catalog),
    before: layoutMetrics(before), after: layoutMetrics(after),
  };
}
writeFileSync(new URL('./summary.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
