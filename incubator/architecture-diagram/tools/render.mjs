import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { spawn, execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
import { upstreamCommit, upstreamVersion } from './catalog.mjs';

const [checkout, input, svgOutput, screenshot] = process.argv.slice(2);
if (!screenshot) throw new Error('Usage: node tools/render.mjs <drawio-checkout> <input.drawio> <output.svg> <preview.png>');
if (execFileSync('git', ['-C', checkout, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() !== upstreamCommit) throw new Error('Renderer checkout is not pinned.');
const source = readFileSync(input, 'utf8');
const temporary = mkdtempSync(path.join(tmpdir(), 'drawio-render-'));
const files = new Map([
  ['/viewer.js', 'js/viewer-static.min.js'], ['/stencils.js', 'js/stencils.min.js'],
  ['/aws.js', 'shapes/mxAWS4.js'], ['/kubernetes.js', 'shapes/mxKubernetes.js'],
]);
execFileSync('git', ['-C', checkout, 'diff', '--exit-code', 'HEAD', '--', ...[...files.values()].map(file => 'src/main/webapp/' + file)], { stdio: 'pipe' });
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:white}#graph{position:relative;width:1900px;height:1040px}</style>
<script>STENCIL_PATH='/stencils';SHAPES_PATH='/shapes';GRAPH_IMAGE_PATH='/img';mxBasePath='/mxgraph';mxLoadResources=false;mxLoadStylesheets=false;</script>
<script src="/viewer.js"></script><script src="/stencils.js"></script><script src="/aws.js"></script><script src="/kubernetes.js"></script>
<div id="graph"></div><pre id="result" style="display:none"></pre>
<script>
try {
  var xml = ${JSON.stringify(source).replaceAll('<', '\\u003c')};
  var doc = mxUtils.parseXml(xml);
  var graph = new Graph(document.getElementById('graph'));
  graph.setEnabled(false);
  new mxCodec(doc).decode(doc.getElementsByTagName('mxGraphModel')[0], graph.getModel());
  graph.refresh();
  var svg = graph.getSvg('#ffffff', 1);
  var rect = function(b) { return b ? {x:b.x,y:b.y,w:b.width,h:b.height} : null; };
  var metrics = Object.values(graph.getModel().cells).map(function(cell) {
    var state=graph.view.getState(cell);
    if (!state) return null;
    return {id:cell.id,parent:cell.parent?.id || null,source:cell.source?.id || null,target:cell.target?.id || null,type:cell.value?.getAttribute?.('c4Type') || null,bounds:rect(state),body:rect(state.shape?.boundingBox),text:rect(state.text?.boundingBox),points:state.absolutePoints?.map(function(p){return {x:p.x,y:p.y};}) || null};
  }).filter(Boolean);
  document.getElementById('result').textContent = 'JSON:' + btoa(unescape(encodeURIComponent(JSON.stringify({svg:mxUtils.getXml(svg),metrics:metrics}))));
} catch (e) { document.getElementById('result').textContent = 'ERROR:' + e.stack; }
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
    await call('Emulation.setDeviceMetricsOverride', { width: 1900, height: 1040, deviceScaleFactor: 1, mobile: false });
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
