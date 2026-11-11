import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Connectors show direction and relationship, so visible text must not imitate them.
// Doubts about the source belong in the companion account, not on the diagram.
const forbidden = /[·•‣⁃∙⋅←-⇿➔-➾⟰-⟿⤀-⥿⬀-⬑]|\p{Extended_Pictographic}|<-+>?|-+>|=+>/u;

const sourceCommentary =
  /\bunspecified\b|\bnot (?:explicitly|specified|stated|shown)\b|\brelationship only\b|\bis inferred\b|\b(?:in|from|by) the source\b/i;

function decode(text) {
  const named = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
    middot: '·',
    bull: '•',
    rarr: '→',
    larr: '←',
    harr: '↔',
    rArr: '⇒',
  };
  return text.replace(/&(?:#(\d+)|#x([0-9a-f]+)|(\w+));/gi, (match, decimal, hex, name) => {
    if (decimal) return String.fromCodePoint(Number(decimal));
    if (hex) return String.fromCodePoint(Number.parseInt(hex, 16));
    return named[name] ?? match;
  });
}

// Labels are HTML inside an XML attribute, so entities are decoded twice around the tag removal.
function visibleText(attribute) {
  return decode(decode(attribute).replace(/<\/?[a-z][^<>]*>/gi, ' '));
}

export function findForbiddenText(xml) {
  const found = [];
  for (const [, name, value] of xml.matchAll(/\s(value|label|name)="([^"]*)"/g)) {
    const text = visibleText(value);
    const symbol = text.match(forbidden)?.[0] ?? text.match(sourceCommentary)?.[0];
    if (symbol) found.push({ attribute: name, symbol, text: text.trim() });
  }
  return found;
}

if (
  process.argv[1] &&
  existsSync(process.argv[1]) &&
  realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
) {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node check-text.mjs <diagram.drawio>');
    process.exitCode = 2;
  } else {
    const found = findForbiddenText(readFileSync(file, 'utf8'));
    for (const { symbol, text } of found) console.error(`Found "${symbol}" in: ${text}`);
    if (found.length)
      console.error(
        'Do not reword these. Remove what the drawing already says, fix a wrong or missing part of the drawing, or move a source doubt to the companion account.',
      );
    else console.log('Visible text has no connector imitation, separator symbols or source commentary.');
    process.exitCode = found.length ? 1 : 0;
  }
}
