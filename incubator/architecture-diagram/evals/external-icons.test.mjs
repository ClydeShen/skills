import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { deflateRawSync } from 'node:zlib';
import { libraryEntries } from '../candidate/architecture-diagram/scripts/external-icons.mjs';
import { finalize } from '../candidate/architecture-diagram/scripts/finalize.mjs';
import { checkEmbeddedIcons, iconPlacement } from '../candidate/architecture-diagram/scripts/icons.mjs';
import { referencedAssets } from '../candidate/architecture-diagram/scripts/render-inputs.mjs';

const data = (svg) => `data:image/svg+xml,${Buffer.from(svg).toString('base64')}`;
const original = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>';

test('a consumer library survives finalization and render checks without changing artwork', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'consumer-icons-'));
  try {
    const file = path.join(dir, 'icons.xml');
    const cell = `<mxGraphModel><root><mxCell vertex="1" style="shape=image;image=${data(original)};"/></root></mxGraphModel>`;
    const xml = deflateRawSync(encodeURIComponent(cell)).toString('base64');
    writeFileSync(file, `<mxlibrary>${JSON.stringify([{ title: 'Example', w: 10, h: 10, xml }])}</mxlibrary>`);
    const entries = libraryEntries(file);
    assert.equal(entries.length, 1);
    assert.equal(entries[0].svg, original);
    const style = iconPlacement(entries[0]).style;
    const result = finalize(
      `<mxfile><diagram><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="a" parent="1" vertex="1" style="${style}"><mxGeometry x="0" y="0" width="72" height="72" as="geometry"/></mxCell></root></mxGraphModel></diagram></mxfile>`,
      { entries },
    );
    assert.equal(result.count, 1);
    assert.deepEqual(referencedAssets(result.xml, { entries: [] }, { entries }), []);
    assert.throws(() => checkEmbeddedIcons(result.xml.replace(data(original), data(`${original} `)), { entries }));
    writeFileSync(file, JSON.stringify([{ title: 'Changed', w: 10, h: 10, data: data(original) }]));
    assert.notEqual(libraryEntries(file)[0].id, entries[0].id);
  } finally {
    rmSync(dir, { recursive: true });
  }
});

test('unsupported groups, active SVG and remote images are not imported', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'consumer-icons-'));
  try {
    const file = path.join(dir, 'icons.json');
    const entries = [
      { title: 'Remote', w: 10, h: 10, data: 'https://example.com/icon.svg' },
      { title: 'Script', w: 10, h: 10, data: data('<svg><script>alert(1)</script></svg>') },
      { title: 'External', w: 10, h: 10, data: data('<svg><use href="https://example.com/a.svg#b"/></svg>') },
      {
        title: 'Group',
        w: 10,
        h: 10,
        xml: `<root><mxCell vertex="1"/><mxCell vertex="1" style="image=${data(original)};"/></root>`,
      },
      { title: 'Fragment', w: 10, h: 10, data: data('<svg><defs><rect id="a"/></defs><use href="#a"/></svg>') },
    ];
    writeFileSync(file, JSON.stringify(entries));
    assert.deepEqual(
      libraryEntries(file).map((e) => e.title),
      ['Fragment'],
    );
  } finally {
    rmSync(dir, { recursive: true });
  }
});
