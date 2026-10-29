import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { spawn, execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
import { upstreamCommit, upstreamVersion } from './catalog.mjs';
import { pageSize, referencedAssets } from './render-inputs.mjs';

const [checkout, input, svgOutput, screenshot] = process.argv.slice(2);
if (!screenshot) throw new Error('Usage: node tools/render.mjs <drawio-checkout> <input.drawio> <output.svg> <preview.png>');
if (execFileSync('git', ['-C', checkout, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() !== upstreamCommit) throw new Error('Renderer checkout is not pinned.');
const source = readFileSync(input, 'utf8');
const page = pageSize(source);
const catalog = JSON.parse(readFileSync(new URL('../prototype/catalog.json', import.meta.url), 'utf8'));
const assets = referencedAssets(source, catalog);
const assetUris = Object.fromEntries(assets.map(ref => [ref, 'data:image/svg+xml,' + encodeURIComponent(readFileSync(path.join(checkout, 'src/main/webapp', ref), 'utf8'))]));
const files = new Map([
  ['/viewer.js', 'js/viewer-static.min.js'], ['/stencils.js', 'js/stencils.min.js'],
  ['/aws.js', 'shapes/mxAWS4.js'], ['/kubernetes.js', 'shapes/mxKubernetes.js'],
]);
execFileSync('git', ['-C', checkout, 'diff', '--exit-code', 'HEAD', '--', ...[...files.values(), ...assets].map(file => 'src/main/webapp/' + file)], { stdio: 'pipe' });
const temporary = mkdtempSync(path.join(tmpdir(), 'drawio-render-'));
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:white}#graph{position:relative;width:${page.width}px;height:${page.height}px}</style>
<script>STENCIL_PATH='/stencils';SHAPES_PATH='/shapes';GRAPH_IMAGE_PATH='/img';mxBasePath='/mxgraph';mxLoadResources=false;mxLoadStylesheets=false;</script>
<script src="/viewer.js"></script><script src="/stencils.js"></script><script src="/aws.js"></script><script src="/kubernetes.js"></script>
<div id="graph"></div><pre id="result" style="display:none"></pre>
<script>
(async function() { try {
  var xml = ${JSON.stringify(source).replaceAll('<', '\\u003c')};
  var doc = mxUtils.parseXml(xml);
  var graph = new Graph(document.getElementById('graph'));
  graph.setEnabled(false);
  new mxCodec(doc).decode(doc.getElementsByTagName('mxGraphModel')[0], graph.getModel());
  var assetUris = ${JSON.stringify(assetUris).replaceAll('<', '\\u003c')};
  Object.values(graph.getModel().cells).forEach(function(cell) {
    if (cell.style) cell.style = cell.style.replace(/\\bimage=([^;]+);/g, function(all, ref) { return assetUris[ref] ? 'image=' + assetUris[ref] + ';' : all; });
  });
  await Promise.all(Object.values(assetUris).map(function(uri) { return new Promise(function(resolve, reject) {
    var img = new Image(), timer = setTimeout(function() { reject(new Error('Local SVG image did not load.')); }, 10000);
    img.onload = function() { clearTimeout(timer); resolve(); }; img.onerror = function() { clearTimeout(timer); reject(new Error('Local SVG image failed.')); }; img.src = uri;
  }); }));
  graph.refresh();
  var svg = graph.getSvg('#ffffff', 1);
  var rect = function(b) { return b ? {x:b.x,y:b.y,w:b.width,h:b.height} : null; };
  var metrics = Object.values(graph.getModel().cells).map(function(cell) {
    var state=graph.view.getState(cell);
    if (!state) return null;
    return {id:cell.id,parent:cell.parent?.id || null,source:cell.source?.id || null,target:cell.target?.id || null,type:cell.value?.getAttribute?.('c4Type') || null,annotationKind:cell.annotationKind || null,annotationFor:cell.annotationFor || null,bounds:rect(state),body:rect(state.shape?.boundingBox),text:rect(state.text?.boundingBox),points:state.absolutePoints?.map(function(p){return {x:p.x,y:p.y};}) || null};
  }).filter(Boolean);
  document.getElementById('result').textContent = 'JSON:' + btoa(unescape(encodeURIComponent(JSON.stringify({svg:mxUtils.getXml(svg),metrics:metrics}))));
} catch (e) { document.getElementById('result').textContent = 'ERROR:' + e.stack; } })();
</script>`;
const server = createServer((req, res) => {
  if (req.url === '/') { res.setHeader('Content-Type', 'text/html'); res.end(html); }
  else if (files.has(req.url)) { res.setHeader('Content-Type', 'application/javascript'); res.end(readFileSync(path.join(checkout, 'src/main/webapp', files.get(req.url)))); }
  else { res.statusCode = 404; res.end('Local-only renderer: resource not supplied.'); }
});
try {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const child = spawn(process.env.DIAGRAM_BROWSER || 'chromium', ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--disable-background-networking', '--remote-debugging-port=0', '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1', `--user-data-dir=${temporary}/profile`, 'about:blank'], { stdio: ['ignore', 'ignore', 'pipe'], env: { ...process.env, XDG_CACHE_HOME: temporary, XDG_CONFIG_HOME: temporary } });
  const exited = new Promise(resolve => child.once('close', resolve));
  let socket;
  const pending = new Map();
  let sequence = 0, sessionId;
  const timeout = setTimeout(() => { child.kill('SIGTERM'); for (const p of pending.values()) p.reject(new Error('Browser render timed out.')); }, 40_000);
  try {
    const endpoint = await new Promise((resolve, reject) => {
      let stderr = '';
      const startup = setTimeout(() => reject(new Error('Browser did not expose a local debugging endpoint: ' + stderr.slice(-1000))), 12_000);
      child.once('error', reject);
      child.stderr.on('data', c => {
        stderr += c;
        const match = stderr.match(/DevTools listening on (ws:\/\/127\.0\.0\.1:[^\s]+)/);
        if (match) { clearTimeout(startup); resolve(match[1]); }
      });
    });
    socket = new WebSocket(endpoint);
    await once(socket, 'open');
    socket.addEventListener('message', event => {
      const message = JSON.parse(event.data), p = pending.get(message.id);
      if (p) { pending.delete(message.id); message.error ? p.reject(new Error(message.error.message)) : p.resolve(message.result); }
    });
    const call = (method, params = {}, page = true) => new Promise((resolve, reject) => {
      const id = ++sequence;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params, ...(page && sessionId ? { sessionId } : {}) }));
    });
    const target = await call('Target.createTarget', { url: 'about:blank' }, false);
    sessionId = (await call('Target.attachToTarget', { targetId: target.targetId, flatten: true }, false)).sessionId;
    await call('Page.enable');
    await call('Emulation.setDeviceMetricsOverride', { width: page.width, height: page.height, deviceScaleFactor: 1, mobile: false });
    await call('Page.navigate', { url: `http://127.0.0.1:${server.address().port}/` });
    const evaluation = await call('Runtime.evaluate', { expression: "(async () => { for (let i=0;i<150;i++) { const s=document.getElementById('result')?.textContent; if(s) return s; await new Promise(r=>setTimeout(r,100)); } return 'ERROR: diagram script did not finish'; })()", awaitPromise: true, returnByValue: true });
    const result = evaluation.result?.value || evaluation.exceptionDetails?.text || 'ERROR: No result';
    if (!result.startsWith('JSON:')) throw new Error(result);
    const rendered = JSON.parse(Buffer.from(result.slice(5), 'base64').toString('utf8'));
    writeFileSync(svgOutput, rendered.svg + '\n');
    const browser = await call('Browser.getVersion', {}, false);
    writeFileSync(svgOutput.replace(/\.svg$/, '.render.json'), JSON.stringify({ renderer: 'Chromium with pinned local draw.io viewer', drawio_version: upstreamVersion, upstream_commit: upstreamCommit, browser: browser.product, metrics: rendered.metrics }, null, 2) + '\n');
    const capture = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    writeFileSync(screenshot, Buffer.from(capture.data, 'base64'));
  } finally {
    clearTimeout(timeout);
    socket?.close();
    child.kill('SIGTERM');
    await exited;
  }
  console.log('Rendered with pinned local draw.io runtime in Chromium. Desktop rendering still requires verification.');
} finally {
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
  rmSync(temporary, { recursive: true, force: true });
}
