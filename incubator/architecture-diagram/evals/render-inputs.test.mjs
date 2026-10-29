import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pageSize, referencedAssets, annotationMetadata } from '../tools/render-inputs.mjs';

test('annotation metadata survives draw.io user-object and mxCell encodings', () => {
  const metadata = { annotationKind: 'comment', annotationFor: 'endpoint' };
  assert.deepEqual(annotationMetadata(metadata), metadata);
  const decoded = { value: { getAttribute: key => metadata[key] } };
  assert.deepEqual(annotationMetadata(decoded), metadata);
  // Exercise the same standalone function representation executed in Chromium.
  assert.deepEqual(Function(`return (${annotationMetadata.toString()})`)()(decoded), metadata);
  assert.deepEqual(annotationMetadata({ value: 'ordinary text' }), { annotationKind: null, annotationFor: null });
});

test('render pages are bounded and SVG assets require an exact usable catalog match', () => {
  const ref = 'img/lib/azure2/compute/Function_Apps.svg';
  const catalog = { entries: [{ usable: true, style: `image=${ref};` }, { usable: false, style: 'image=img/lib/azure2/bad.svg;' }] };
  assert.deepEqual(pageSize('<mxGraphModel pageWidth="3000" pageHeight="2000">'), { width: 3000, height: 2000 });
  assert.throws(() => pageSize('<mxGraphModel pageWidth="9000" pageHeight="2000">'));
  for (const value of ['-1', '', 'bad', '1000.5']) assert.throws(() => pageSize(`<mxGraphModel pageWidth="${value}" pageHeight="2000">`));
  assert.deepEqual(referencedAssets(`image=${ref};image=${ref};`, catalog), [ref]);
  assert.deepEqual(referencedAssets(`style="image=${ref}"`, catalog), [ref]);
  for (const image of ['https://example.com/a.svg', 'img/lib/azure2/../a.svg', 'img/lib/azure2/bad.svg', 'img/lib/azure2/unknown.svg', 'data:image/svg+xml,raw']) assert.throws(() => referencedAssets(`image=${image};`, catalog));
});
