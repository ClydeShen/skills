import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { contrastRatio } from '../candidate/architecture-diagram/scripts/check-colors.mjs';
import {
  artwork,
  boundaryPlacement,
  checkEmbeddedIcons,
  dataUri,
  embedVendorIcons,
  entryUri,
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

test('colour-pair guidance measures sRGB contrast without treating it as Level A compliance', () => {
  assert.equal(contrastRatio('#000', '#fff'), 21);
  assert.equal(contrastRatio('#FFFFFF', '#ffffff'), 1);
  assert.equal(contrastRatio('#123456', '#ABCDEF'), contrastRatio('#ABCDEF', '#123456'));
  assert.ok(contrastRatio('#777', '#fff') < 4.5);
  assert.ok(contrastRatio('#767676', '#fff') > 4.5);
  assert.ok(contrastRatio('#1F2937', '#FFFFFF') >= 4.5);
  assert.ok(contrastRatio('#64748B', '#FFFFFF') >= 3);
  assert.ok(contrastRatio('#64748B', '#F4F7FA') >= 3);
  assert.throws(() => contrastRatio('red', '#fff'), /opaque/);
  assert.throws(() => contrastRatio('#0000', '#fff'), /opaque/);
});

test('bundled vendor icons are pinned, unique and hash-identified', () => {
  assert.deepEqual(icons.sources, { '@thesvg/icons': '4.0.0', '@fabric-msft/svg-icons': '11.1.0' });
  assert.equal(new Set(icons.entries.map((e) => e.id)).size, icons.entries.length);
  for (const e of icons.entries) {
    assert.equal(sha256(artwork(e)), e.sha256, e.id);
    if (e.png) assert.equal(artwork(e).subarray(1, 4).toString(), 'PNG', e.id);
    else assert.match(e.svg, /<svg[\s>]/, e.id);
    assert.ok(e.vendor && e.title && e.license, e.id);
    assert.ok(e.source.version || /^[0-9a-f]{40}$/.test(e.source.commit), `${e.id} is pinned`);
    assert.ok(!catalog.entries.some((c) => c.id === e.id), `${e.id} collides with the draw.io catalog`);
  }
});

test('boundary markers preserve exact artwork and scope without duplicating native corner icons', () => {
  const azure = byId('thesvg-microsoft-azure');
  assert.equal(azure.vendor, 'Azure');
  assert.equal(azure.title, 'Microsoft Azure');
  const boundary = boundaryPlacement(azure);
  assert.equal(boundary.kind, 'marked-boundary');
  assert.deepEqual(
    [boundary.marker.x, boundary.marker.y, boundary.marker.width, boundary.marker.height],
    [6, 6, 24, 24],
  );
  assert.equal(boundary.marker.label, '');
  assert.match(boundary.style, /container=1;.*spacingLeft=36;/);
  assert.doesNotMatch(boundary.marker.style, /labelWidth|verticalLabelPosition/);
  assert.match(boundary.marker.style, /vendorIcon=thesvg-microsoft-azure;/);
  const xml = embedVendorIcons(page(boundary.marker.style), icons).xml;
  checkEmbeddedIcons(xml, icons);
  const aws = catalog.entries.find((e) => e.vendor === 'AWS' && e.title === 'AWS Cloud' && e.palette === 'aws4Groups');
  assert.deepEqual(boundaryPlacement(aws), { kind: 'native-boundary', style: aws.style, marker: null });
  const network = catalog.entries.find((e) => e.vendor === 'Azure' && e.title === 'Virtual Networks');
  assert.match(boundaryPlacement(network).marker.style, /Virtual_Networks.svg/);
  const cli = spawnSync(
    process.execPath,
    [
      fileURLToPath(new URL('../candidate/architecture-diagram/scripts/find-icon.mjs', import.meta.url)),
      '--vendor',
      'Azure',
      '--title',
      'Microsoft Azure',
      '--boundary',
    ],
    { encoding: 'utf8' },
  );
  assert.equal(cli.status, 0, cli.stderr);
  assert.deepEqual(JSON.parse(cli.stdout).matches[0].boundary, boundary);
});

test('all three cloud providers have exact boundary identities and portable marker rendering', () => {
  const aws = catalog.entries.find((e) => e.id === 'aws4-61258b1e47d472ca');
  assert.equal(aws.vendor, 'AWS');
  assert.match(boundaryPlacement(aws).style, /grIcon=mxgraph.aws4.group_aws_cloud/);
  for (const [id, vendor, title] of [
    ['thesvg-microsoft-azure', 'Azure', 'Microsoft Azure'],
    ['thesvg-google-cloud', 'Google Cloud', 'Google Cloud'],
  ]) {
    const entry = byId(id);
    assert.equal(entry.vendor, vendor);
    assert.equal(entry.title, title);
    const { marker } = boundaryPlacement(entry);
    assert.equal(Math.max(marker.width, marker.height), 24);
    assert.equal(marker.label, '');
    const xml = embedVendorIcons(page(marker.style), icons).xml;
    checkEmbeddedIcons(xml, icons);
    assert.deepEqual(referencedAssets(xml, catalog, icons), []);
    const cli = spawnSync(
      process.execPath,
      [
        fileURLToPath(new URL('../candidate/architecture-diagram/scripts/find-icon.mjs', import.meta.url)),
        '--vendor',
        vendor,
        '--title',
        title,
        '--boundary',
      ],
      { encoding: 'utf8' },
    );
    assert.equal(cli.status, 0, cli.stderr);
    assert.equal(JSON.parse(cli.stdout).matches.length, 1);
    assert.deepEqual(JSON.parse(cli.stdout).matches[0].boundary.marker, marker);
  }
});

test('official PNG artwork embeds and verifies like SVG', () => {
  const kernel = icons.entries.find((e) => e.title === 'Semantic Kernel');
  assert.ok(kernel.png);
  const { xml } = embedVendorIcons(page(iconPlacement(kernel).style), icons);
  assert.ok(xml.includes(`image=${entryUri(kernel)};`));
  checkEmbeddedIcons(xml, icons);
  assert.deepEqual(referencedAssets(xml, catalog, icons), []);
  assert.throws(() => checkEmbeddedIcons(xml.replace(kernel.png.slice(-12), 'AAAAAAAAAAAA'), icons), /differs/);
});

test('placement gives every source the same size and caption standard', () => {
  const lambda = catalog.entries.find((e) => e.usable && e.vendor === 'AWS' && e.title === 'Lambda');
  for (const entry of [lambda, byId('thesvg-vault'), byId('fabric-lakehouse_64_item')]) {
    const p = iconPlacement(entry);
    assert.equal(Math.max(p.width, p.height), ICON_SIZE);
    assert.match(p.style, /verticalLabelPosition=bottom;align=center;verticalAlign=top;fontSize=16;labelWidth=\d+;$/);
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
    const run = spawnSync(process.execPath, [join(moved, 'scripts', 'finalize.mjs'), file], {
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
