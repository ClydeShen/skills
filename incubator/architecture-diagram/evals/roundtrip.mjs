import { readFileSync, realpathSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const dimensions = Object.freeze(['elements', 'responsibilities', 'relationships', 'directions', 'protocols', 'boundaries', 'conditions', 'notes']);
export const comparisonPairs = Object.freeze([[0, 2], [2, 4], [0, 4]]);
const normalize = text => text.replace(/\s+/g, ' ').trim();
const requireThat = (condition, message) => { if (!condition) throw new Error(message); };

function validateLedger(ledger) {
  requireThat(typeof ledger?.description === 'string' && ledger.description.trim(), 'Missing source description.');
  requireThat(Array.isArray(ledger.facts) && ledger.facts.length > 0, 'Missing extracted facts.');
  const ids = new Set();
  for (const f of ledger.facts) {
    requireThat(typeof f.id === 'string' && f.id.trim() && !ids.has(f.id), 'Fact IDs must be nonempty and unique within each level.');
    ids.add(f.id);
    requireThat(dimensions.includes(f.dimension), `Unknown fact dimension: ${f.dimension}`);
    requireThat(typeof f.claim === 'string' && f.claim.trim(), `Missing claim: ${f.id}`);
    requireThat(typeof f.critical === 'boolean', `Missing criticality: ${f.id}`);
    requireThat(typeof f.evidence === 'string' && f.evidence.trim() && normalize(ledger.description).includes(normalize(f.evidence)), `Evidence is not a source quotation: ${f.id}`);
  }
}

// The judge supplies semantic alignment, not string equality or keyword matching.
// This code checks provenance/coverage and derives drift, not architecture truth.
export function compareLedgers(before, after, alignments) {
  validateLedger(before); validateLedger(after);
  requireThat(Array.isArray(alignments) && alignments.length > 0, 'Missing semantic alignment.');
  const left = new Map(before.facts.map(f => [f.id, f])), right = new Map(after.facts.map(f => [f.id, f]));
  const coveredLeft = new Set(), coveredRight = new Set();
  const rows = [];
  for (const row of alignments) {
    requireThat(['preserved', 'omitted', 'added', 'changed', 'uncertain'].includes(row.status), 'Invalid alignment status.');
    requireThat(Array.isArray(row.before) && Array.isArray(row.after) && row.before.length + row.after.length > 0, 'An alignment must reference facts.');
    requireThat(typeof row.reason === 'string' && row.reason.trim(), 'An alignment needs a reason.');
    if (row.status === 'omitted') requireThat(row.before.length && !row.after.length, 'Omission must have only before facts.');
    else if (row.status === 'added') requireThat(!row.before.length && row.after.length, 'Addition must have only after facts.');
    else if (row.status !== 'uncertain') requireThat(row.before.length && row.after.length, 'Preserved/changed alignment needs both sides.');
    const facts = [];
    for (const [ids, index, covered] of [[row.before, left, coveredLeft], [row.after, right, coveredRight]]) {
      for (const id of ids) {
        requireThat(index.has(id) && !covered.has(id), `Unknown or multiply aligned fact: ${id}`);
        covered.add(id); facts.push(index.get(id));
      }
    }
    const kinds = new Set(facts.map(f => f.dimension));
    requireThat(kinds.size === 1, 'Do not align different semantic dimensions.');
    rows.push({ ...row, dimension: [...kinds][0], critical: facts.some(f => f.critical) });
  }
  requireThat(coveredLeft.size === left.size && coveredRight.size === right.size, 'Alignment must cover every extracted fact on both sides.');
  const drift = rows.filter(r => ['omitted', 'added', 'changed'].includes(r.status));
  const hardFailures = drift.filter(r => r.critical);
  const uncertain = rows.filter(r => r.status === 'uncertain');
  const counts = Object.fromEntries(dimensions.map(d => [d, Object.fromEntries(['preserved', 'omitted', 'added', 'changed', 'uncertain'].map(s => [s, rows.filter(r => r.dimension === d && r.status === s).length]))]));
  return { status: hardFailures.length ? 'hard-fail' : drift.length ? 'drift' : uncertain.length ? 'incomplete' : 'no-drift-found', beforeFacts: left.size, afterFacts: right.size, counts, hardFailures, uncertain, alignments: rows };
}

export function evaluateDescriptions(judged) {
  const results = {};
  for (const [from, to] of comparisonPairs) {
    const key = `${from}-${to}`;
    results[key] = compareLedgers(judged.levels?.[from], judged.levels?.[to], judged.pairs?.[key]);
  }
  const statuses = Object.values(results).map(r => r.status);
  const status = statuses.includes('hard-fail') ? 'hard-fail' : statuses.includes('drift') ? 'drift' : statuses.includes('incomplete') ? 'incomplete' : 'no-drift-found';
  return { status, comparisons: results, limitation: 'Conditional on the judge\'s fact extraction and semantic alignment. No-drift-found is not proof of correctness or completeness.' };
}

// Host adapters must actually create fresh workers and enforce allowed inputs.
// Unique context labels and minimal packets are checks, not a filesystem sandbox.
export async function executeRoundTrip({ description, policy, adapter, initialDiagram }) {
  requireThat(typeof description === 'string' && description.trim(), 'Missing L0 description.');
  const actors = [], contextIds = new Set();
  const invoke = async (role, packet) => {
    const result = await adapter[role](Object.freeze(packet));
    requireThat(result?.context?.fresh === true && typeof result.context.id === 'string' && result.context.id.trim() && !contextIds.has(result.context.id), 'Workers must report distinct fresh contexts.');
    contextIds.add(result.context.id); actors.push({ role, ...result.context });
    requireThat(typeof result.output === 'string' && result.output.trim(), `Missing ${role} output.`);
    return result.output;
  };
  const pilot = initialDiagram !== undefined;
  if (pilot) requireThat(typeof initialDiagram === 'string' && initialDiagram.trim(), 'Missing L1 diagram.');
  const l1 = pilot ? initialDiagram : await invoke('generate', { description, policy });
  requireThat(typeof l1 === 'string' && l1.trim(), 'Missing L1 diagram.');
  const raster = async diagram => {
    const result = await adapter.render(Object.freeze({ diagram }));
    requireThat(result?.mimeType === 'image/png' && typeof result.image === 'string' && result.image.trim(), 'Renderer must supply a PNG image, not SVG/XML text.');
    return result.image;
  };
  const image1 = await raster(l1);
  const l2 = await invoke('read', { image: image1 });
  const l3 = await invoke('generate', { description: l2, policy });
  const image3 = await raster(l3);
  const l4 = await invoke('read', { image: image3 });
  // No judge or comparison feedback is sent into a generation/read stage.
  const judged = await adapter.judge(Object.freeze({ descriptions: Object.freeze({ 0: description, 2: l2, 4: l4 }), dimensions }));
  for (const [level, text] of [[0, description], [2, l2], [4, l4]]) requireThat(judged?.levels?.[level]?.description === text, `Judge changed source description L${level}.`);
  return { mode: pilot ? 'existing-L1-pilot' : 'full-chain', actors, levels: { 0: description, 1: l1, 2: l2, 3: l3, 4: l4 }, images: { 1: image1, 3: image3 }, result: evaluateDescriptions(judged) };
}

if (process.argv[1] && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  requireThat(process.argv.length === 3, 'Usage: node evals/roundtrip.mjs <judged-roundtrip.json>');
  const report = evaluateDescriptions(JSON.parse(readFileSync(process.argv[2], 'utf8')));
  console.log(JSON.stringify(report, null, 2));
  // A negative evaluation is a valid measured result, not a broken CLI invocation.
}
