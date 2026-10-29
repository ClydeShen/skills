import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { inspectDiagram } from '../collect-roundtrips.mjs';
import { layoutMetrics } from '../../tools/layout-metrics.mjs';

const read = path => readFileSync(new URL(path, import.meta.url));
const json = path => JSON.parse(read(path));
const hash = path => createHash('sha256').update(read(path)).digest('hex');
const catalog = json('../../candidate/architecture-diagram/assets/catalog.json');
const packageFiles = ['SKILL.md', 'references/notation.md', 'references/drawio.md', 'scripts/find-icon.mjs', 'scripts/catalog.mjs', 'assets/catalog.json'];
const report = {
  date: '2026-10-29', mode: 'authored-artifact-repair-and-package-check',
  baselineCommit: 'ca4a53561f2a67a4e5a4fdbc162b4d07de07f04f',
  packageSha256: Object.fromEntries(packageFiles.map(p => [p, hash('../../candidate/architecture-diagram/' + p)])),
  interpretation: 'Author repairs, actual pinned browser rendering and deterministic checks. No new model generation, blind readout, L0-to-L4 chain, Desktop test or release approval.',
  cases: {},
};
for (const id of ['02', '03']) {
  const render = json(`./case-${id}/diagram.render.json`);
  report.cases[id] = {
    sourceSha256: hash(`../layout-revision-2026-10-29/inputs/l0-${id}.txt`),
    generatorSha256: hash(`./generate-${id}.mjs`),
    artifacts: Object.fromEntries(['diagram.drawio', 'diagram.svg', 'diagram.png', 'diagram.render.json'].map(p => [p, hash(`./case-${id}/${p}`)])),
    checks: inspectDiagram(read(`./case-${id}/diagram.drawio`).toString(), render, catalog),
    before: layoutMetrics(json(`../visual-expression-2026-10-29/case-${id}/diagram.render.json`)),
    after: layoutMetrics(render),
  };
}
writeFileSync(new URL('./summary.json', import.meta.url), JSON.stringify(report, null, 2) + '\n');
