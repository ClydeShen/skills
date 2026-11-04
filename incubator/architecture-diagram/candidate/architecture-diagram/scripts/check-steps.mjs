import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { readDiagram } from './check-layout.mjs';

// A source orders steps with a top-level numbered list ("1. ...") or inline markers ("(1) ...").
// Nested list items refine a step and are not steps of their own.
export function sourceSteps(text) {
  const steps = new Set();
  for (const line of text.split(/\r?\n/)) {
    const listed = line.match(/^(\d+)[.)]\s+\S/);
    if (listed) steps.add(Number(listed[1]));
    for (const [, n] of line.matchAll(/\((\d+)\)\s/g)) steps.add(Number(n));
  }
  return steps.size >= 2 ? [...steps].sort((a, b) => a - b) : [];
}

const lines = (value = '') =>
  value
    .replace(/&lt;br\s*\/?&gt;|<br\s*\/?>|&#10;|&#xa;/gi, '\n')
    .replace(/&lt;[^&]*&gt;|<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .split('\n')
    .map((line) => line.trim());

// A connector label line numbers a step when it starts with the number, optionally after a series letter:
// "1 retrieve", "2. Search", "Q3". One label may carry several lines, such as a request and its reply.
export function diagramSteps(xml) {
  const steps = new Set();
  for (const cell of readDiagram(xml)) {
    if (cell.edge !== '1') continue;
    for (const line of lines(cell.value)) {
      const match = line.match(/^[A-Za-z]?(\d+)(?=[\s.):]|$)/);
      if (match) steps.add(Number(match[1]));
    }
  }
  return steps;
}

export function checkSteps(source, xml) {
  const stated = sourceSteps(source);
  if (!stated.length) return [];
  const drawn = diagramSteps(xml);
  const missing = stated.filter((n) => !drawn.has(n));
  if (!missing.length) return [];
  return [
    `The source orders steps ${stated.join(', ')}; no connector label carries ${missing.join(', ')}. Number each stated step on its connector by execution order, with a short action, or name in the companion account why a step is not drawn.`,
  ];
}

if (
  process.argv[1] &&
  existsSync(process.argv[1]) &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
) {
  const [source, diagram] = process.argv.slice(2);
  if (!source || !diagram) {
    console.error('Usage: node check-steps.mjs <source.md> <diagram.drawio>');
    process.exitCode = 2;
  } else {
    const found = checkSteps(readFileSync(source, 'utf8'), readFileSync(diagram, 'utf8'));
    for (const warning of found) console.error(`Check: ${warning}`);
    console.log(`Steps: ${found.length} items to check.`);
  }
}
