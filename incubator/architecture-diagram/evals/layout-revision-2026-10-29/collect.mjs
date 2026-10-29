import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { layoutMetrics } from '../../tools/layout-metrics.mjs';
import { inspectDiagram } from '../collect-roundtrips.mjs';

const read = name => readFileSync(new URL(name, import.meta.url));
const json = name => JSON.parse(read(name));
const hash = name => createHash('sha256').update(read(name)).digest('hex');
const catalog = json('../../prototype/catalog.json');
const report = {
  date: '2026-10-29', mode: 'reviewed-artifact-repair-with-blind-readout',
  baselineCommit: '280ed6c1c380ddee7c6fbf8b630dd6d9a02c44c1',
  policySha256: hash('../../prototype/drawing-policy.md'),
  readers: {
    '02': { context: '/root/layout_read_c', fork_turns: 'none', input: 'c.png only', sourceAttestation: 'Read only the assigned raster using view_image at original resolution.' },
    '03': { context: '/root/layout_read_b', fork_turns: 'none', input: 'b.png only', sourceAttestation: 'Read only the assigned raster using view_image at original resolution.' },
  },
  model: 'Host agent; exact model identity and sampling parameters not exposed; no separately configured model endpoint invoked.',
  isolation: 'Fresh conversations with shared filesystem access, not per-worker OS sandboxes.',
  cases: {},
};
for (const id of ['02', '03']) {
  const before = json(`../full-roundtrip-2026-10-29/case-${id}/l1.render.json`);
  const after = json(`./case-${id}/diagram.render.json`);
  const artifacts = ['diagram.drawio', 'diagram.svg', 'diagram.png', 'diagram.render.json', 'readout.txt'];
  report.cases[id] = {
    sourceSha256: hash(`./inputs/l0-${id}.txt`), generatorSha256: hash(`./generate-${id}.mjs`),
    artifacts: Object.fromEntries(artifacts.map(name => [name, hash(`./case-${id}/${name}`)])),
    checks: inspectDiagram(read(`./case-${id}/diagram.drawio`).toString(), after, catalog),
    before: layoutMetrics(before), after: layoutMetrics(after),
  };
}
writeFileSync(new URL('./summary.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
