import { readFileSync, writeFileSync, existsSync, realpathSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import { evaluateDescriptions } from './roundtrip.mjs';
import { validateDiagram, validateRender } from '../tools/validate.mjs';
import { styleMap } from '../tools/catalog.mjs';

const digest = value => createHash('sha256').update(value).digest('hex');
const list = value => value == null ? [] : Array.isArray(value) ? value : [value];
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
const nativeNote = { shape: 'note', html: '1', backgroundOutline: '1', autosizeText: '1', fontColor: '#000000', darkOpacity: '0.05', fillColor: '#FFF9B2', strokeColor: 'none', fillStyle: 'solid', direction: 'west', gradientDirection: 'north', gradientColor: '#FFF2A1', shadow: '1', size: '20', pointerEvents: '1' };

export function inspectDiagram(xml, rendered, catalog) {
  const root = parser.parse(xml)?.mxfile?.diagram?.mxGraphModel?.root;
  const cells = [...list(root?.mxCell), ...list(root?.object).map(o => ({ ...o.mxCell, ...o }))];
  const noteFindings = [];
  for (const cell of cells) {
    const style = styleMap(cell.style || '');
    if (style.shape === 'note') {
      const changed = Object.entries(nativeNote).filter(([k, v]) => style[k] !== v).map(([k]) => k);
      if (changed.length) noteFindings.push({ id: cell.id, changed });
    }
  }
  return { staticErrors: validateDiagram(xml, catalog), renderErrors: validateRender(rendered), nativeNoteFindings: noteFindings };
}

export function collectRoundTrips(directory, ids = ['01', '02', '03', '04']) {
  const catalog = JSON.parse(readFileSync(new URL('../prototype/catalog.json', import.meta.url), 'utf8'));
  const policyHash = digest(readFileSync(path.join(directory, 'inputs/policy.txt')));
  const cases = {};
  for (const id of ids) {
    const base = path.join(directory, `case-${id}`);
    const judged = JSON.parse(readFileSync(path.join(base, 'judged.json'), 'utf8'));
    const evidence = {};
    for (const n of [0, 2, 4]) {
      const file = n === 0 ? path.join(directory, `inputs/l0-${id}.txt`) : path.join(base, `l${n}.txt`);
      const text = readFileSync(file, 'utf8');
      if (judged.levels?.[n]?.description !== text) throw new Error(`Judged source mismatch: case ${id}, L${n}`);
      evidence[n] = { sha256: digest(text), facts: judged.levels[n].facts.length };
    }
    for (const n of [1, 3]) {
      const xml = readFileSync(path.join(base, `l${n}.drawio`), 'utf8');
      const png = readFileSync(path.join(base, `l${n}.png`));
      if (!png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw new Error(`Invalid raster: case ${id}, L${n}`);
      const rendered = JSON.parse(readFileSync(path.join(base, `l${n}.render.json`), 'utf8'));
      evidence[n] = { xmlSha256: digest(xml), pngSha256: digest(png), svgSha256: digest(readFileSync(path.join(base, `l${n}.svg`))), browser: rendered.browser, drawioVersion: rendered.drawio_version, checks: inspectDiagram(xml, rendered, catalog) };
    }
    const result = evaluateDescriptions(judged);
    const pairs = Object.fromEntries(Object.entries(result.comparisons).map(([key, c]) => [key, { status: c.status, omitted: c.alignments.filter(a => a.status === 'omitted').length, added: c.alignments.filter(a => a.status === 'added').length, changed: c.alignments.filter(a => a.status === 'changed').length, uncertain: c.uncertain.length, hardFailures: c.hardFailures.length, dimensions: c.counts, findings: c.alignments.filter(a => a.status !== 'preserved').map(a => ({ ...a, beforeClaims: a.before.map(f => judged.levels[key[0]].facts.find(x => x.id === f).claim), afterClaims: a.after.map(f => judged.levels[key[2]].facts.find(x => x.id === f).claim) })) }]));
    cases[id] = { mode: 'full-chain', status: result.status, evidence, pairs };
  }
  return { version: 1, policySha256: policyHash, cases, limitation: 'One host-agent chain per case, conditional on frozen synthetic inputs and reviewed semantic judgments; engineering checks and fact counts do not establish general reliability.' };
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  if (process.argv.length < 3 || process.argv.length > 4) throw new Error('Usage: node collect-roundtrips.mjs <run-directory> [output.json]');
  const report = JSON.stringify(collectRoundTrips(process.argv[2]), null, 2) + '\n';
  if (process.argv[3]) writeFileSync(process.argv[3], report); else console.log(report);
}
