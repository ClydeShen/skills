// draw.io's own file layout: one element per line, two-space indentation, " />" for empty elements.
// Some importers, such as Lucidchart, reject a valid draw.io file written any other way.
export function formatDrawio(xml) {
  const tokens = xml.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) ?? [];
  const lines = [];
  let depth = 0;
  let textOpen = false;
  for (const token of tokens) {
    if (!token.startsWith('<')) {
      // Text content, such as a compressed diagram, stays inline with its element.
      if (token.trim() && lines.length) {
        lines[lines.length - 1] += token.trim();
        textOpen = true;
      }
      continue;
    }
    const closing = token.startsWith('</');
    if (closing) depth = Math.max(0, depth - 1);
    if (closing && textOpen) lines[lines.length - 1] += token;
    else lines.push('  '.repeat(depth) + token.replace(/\s*\/>$/, ' />'));
    textOpen = false;
    if (!closing && !/^<[?!]|\/>$/.test(token)) depth++;
  }
  return `${lines.join('\n')}\n`;
}

export const isFormatted = (xml) => formatDrawio(xml) === xml;
