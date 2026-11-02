import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  checkEmbeddedIcons,
  dataUri,
  embedVendorIcons,
  FALLBACK,
  ICON_SIZE,
  iconPlacement,
  loadVendorIcons,
  sha256,
  WIDE_HEIGHT,
} from '../candidate/architecture-diagram/scripts/icons.mjs';
import { referencedAssets } from '../candidate/architecture-diagram/scripts/render-inputs.mjs';
import { pathBox, trimViewBox } from '../tools/trim-viewbox.mjs';

const icons = loadVendorIcons();
const catalog = JSON.parse(
  readFileSync(new URL('../candidate/architecture-diagram/assets/catalog.json', import.meta.url), 'utf8'),
);
const byId = (id) => icons.entries.find((e) => e.id === id);
const page = (style) =>
  `<mxfile><diagram><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="a" value="x" style="${style}" vertex="1" parent="1"/></root></mxGraphModel></diagram></mxfile>`;

test('bundled vendor icons are pinned, unique and hash-identified', () => {
  assert.deepEqual(icons.sources, { '@thesvg/icons': '4.0.0', '@fabric-msft/svg-icons': '11.1.0' });
  assert.equal(new Set(icons.entries.map((e) => e.id)).size, icons.entries.length);
  for (const e of icons.entries) {
    assert.equal(sha256(e.svg), e.sha256, e.id);
    assert.match(e.svg, /<svg[\s>]/, e.id);
    assert.ok(e.vendor && e.title && e.license && e.source.version, e.id);
    assert.ok(!catalog.entries.some((c) => c.id === e.id), `${e.id} collides with the draw.io catalog`);
  }
});

test('placement gives every source the same size and caption standard', () => {
  const lambda = catalog.entries.find((e) => e.usable && e.vendor === 'AWS' && e.title === 'Lambda');
  for (const entry of [lambda, byId('thesvg-vault'), byId('fabric-lakehouse_64_item')]) {
    const p = iconPlacement(entry);
    assert.equal(Math.max(p.width, p.height), ICON_SIZE);
    assert.match(p.style, /verticalLabelPosition=bottom;align=center;verticalAlign=top;fontSize=16;$/);
    assert.equal(p.style.match(/fontSize=/g).length, 1);
  }
  const mule = iconPlacement(byId('thesvg-mulesoft'));
  assert.equal(mule.kind, 'wide');
  assert.equal(mule.height, WIDE_HEIGHT);
  assert.ok(mule.caption);
  assert.equal(iconPlacement(byId('thesvg-cloudflare')).caption, undefined);
  assert.match(iconPlacement(byId('thesvg-vault')).style, /vendorIcon=thesvg-vault;/);
  assert.doesNotMatch(iconPlacement(byId('thesvg-vault')).style, /image=/);
  assert.equal(FALLBACK.height, ICON_SIZE);
});

test('embedding writes the exact artwork and checks reject missing, altered or unknown images', () => {
  const vault = byId('thesvg-vault');
  const source = page(iconPlacement(vault).style);
  assert.throws(() => checkEmbeddedIcons(source, icons), /has no artwork/);
  const { xml, count } = embedVendorIcons(source, icons);
  assert.equal(count, 1);
  assert.ok(xml.includes(`image=${dataUri(vault.svg)};`));
  assert.equal(embedVendorIcons(xml, icons).xml, xml);
  checkEmbeddedIcons(xml, icons);
  assert.deepEqual(referencedAssets(xml, catalog, icons), []);
  const altered = xml.replace(dataUri(vault.svg), dataUri(vault.svg.replace('<svg', '<svg data-x="1"')));
  assert.throws(() => checkEmbeddedIcons(altered, icons), /differs/);
  assert.throws(() => referencedAssets(altered, catalog, icons));
  const swapped = xml.replace('vendorIcon=thesvg-vault', 'vendorIcon=thesvg-consul');
  assert.throws(() => checkEmbeddedIcons(swapped, icons), /differs/);
  assert.throws(() => embedVendorIcons(page('shape=image;vendorIcon=missing;'), icons), /Unknown vendorIcon/);
  assert.throws(() => referencedAssets(page(`shape=image;image=${dataUri('<svg/>')};`), catalog, icons));
});

test('relocated package embeds icons without the authoring repository', () => {
  const dir = mkdtempSync(join(tmpdir(), 'architecture-icons-'));
  try {
    const moved = join(dir, 'architecture-diagram');
    cpSync(fileURLToPath(new URL('../candidate/architecture-diagram', import.meta.url)), moved, { recursive: true });
    const file = join(dir, 'diagram.drawio');
    writeFileSync(file, page(iconPlacement(byId('fabric-fabric_48_color')).style));
    const run = spawnSync(process.execPath, [join(moved, 'scripts', 'embed-icons.mjs'), file], {
      cwd: dir,
      encoding: 'utf8',
    });
    assert.equal(run.status, 0, run.stderr);
    checkEmbeddedIcons(readFileSync(file, 'utf8'), icons);
    const find = spawnSync(
      process.execPath,
      [join(moved, 'scripts', 'find-icon.mjs'), '--vendor', 'GitHub', '--title', 'GitHub Pages'],
      { cwd: dir, encoding: 'utf8' },
    );
    assert.equal(find.status, 1);
    assert.deepEqual(JSON.parse(find.stdout).fallback, FALLBACK);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('viewBox trimming measures compact arcs and leaves path data unchanged', () => {
  const arc = pathBox('M0 0a5 5 0 00 10 0');
  assert.deepEqual([arc.minX, arc.maxX], [0, 10]);
  assert.ok(Math.abs(arc.maxY - arc.minY - 5) < 0.05, 'a compact-flag half circle spans its radius');
  const svg = '<svg viewBox="0 0 24 24"><path d="M2 10h20v4H2z"/></svg>';
  const trimmed = trimViewBox(svg, 0);
  assert.match(trimmed, /viewBox="2 10 20 4"/);
  assert.equal(trimmed.replace(/viewBox="[^"]*"/, ''), svg.replace(/viewBox="[^"]*"/, ''));
  assert.throws(() => trimViewBox('<svg viewBox="0 0 1 1"><g transform="scale(2)"><path d="M0 0h1"/></g></svg>'));
});
