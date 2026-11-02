import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { homedir, tmpdir } from 'node:os';
import path from 'node:path';
import { upstreamCommit, upstreamVersion } from './catalog.mjs';
import { annotationMetadata, editorLink, pageSize, referencedAssets } from './render-inputs.mjs';

const [input, screenshot = input?.replace(/(\.drawio)?$/, '.png')] = process.argv.slice(2);
if (!input) throw new Error('Usage: node scripts/render.mjs <diagram.drawio> [output.png]');
const svgOutput = screenshot.replace(/\.png$/, '.svg');
const git = (args, options = {}) => execFileSync('git', args, { encoding: 'utf8', ...options }).trim();

// The first run fetches the pinned draw.io viewer once; later runs work offline.
function pinnedCheckout() {
  const directory =
    process.env.DRAWIO_CHECKOUT || path.join(homedir(), '.cache/architecture-diagram', `drawio-${upstreamCommit}`);
  if (!existsSync(path.join(directory, '.git'))) {
    git(
      ['clone', '--quiet', '--filter=blob:none', '--no-checkout', 'https://github.com/jgraph/drawio.git', directory],
      { stdio: 'pipe' },
    );
    git([
      '-C',
      directory,
      'sparse-checkout',
      'set',
      'src/main/webapp/js',
      'src/main/webapp/shapes',
      'src/main/webapp/img/lib',
    ]);
    git(['-C', directory, 'checkout', '--quiet', upstreamCommit], { stdio: 'pipe' });
  }
  if (git(['-C', directory, 'rev-parse', 'HEAD']) !== upstreamCommit)
    throw new Error(`Renderer checkout is not pinned: ${directory}`);
  return directory;
}

function findBrowser() {
  const names = [process.env.DIAGRAM_BROWSER, 'chromium', 'chromium-browser', 'google-chrome', 'chrome'];
  for (const name of names.filter(Boolean)) {
    if (spawnSync(name, ['--version'], { stdio: 'ignore' }).status === 0) return name;
  }
  const paths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  ];
  const found = paths.find((file) => existsSync(file));
  if (!found) throw new Error('no draw.io Desktop, Chromium or Chrome found.');
  return found;
}

// draw.io Desktop is the real target, and its PNG keeps an editable copy of the diagram.
function exportWithDesktop() {
  const candidates = [
    process.env.DRAWIO_CLI,
    'drawio',
    path.join(homedir(), 'Applications/draw.io.app/Contents/MacOS/draw.io'),
    '/Applications/draw.io.app/Contents/MacOS/draw.io',
    'C:/Program Files/draw.io/draw.io.exe',
  ];
  const args = [
    '--export',
    '--format',
    'png',
    '--embed-diagram',
    '--border',
    '20',
    '--scale',
    '2',
    '--output',
    screenshot,
    input,
  ];
  // Never run these through a shell: the paths come from the caller.
  for (const cli of candidates.filter(Boolean)) {
    if (spawnSync(cli, args, { stdio: 'ignore', timeout: 60_000 }).status === 0 && existsSync(screenshot)) return cli;
  }
  return null;
}

if (exportWithDesktop()) {
  console.log(`Rendered ${screenshot} with draw.io Desktop; it embeds an editable copy. Inspect the PNG.`);
  process.exit(0);
}

// A system that cannot install anything still gets a usable diagram; say plainly what is missing.
function giveUp(error) {
  console.error(`PNG not produced: ${error.message.split('\n')[0]}`);
  console.error('The .drawio file is complete. To view it and export a PNG in any browser, open:');
  console.error(editorLink(readFileSync(input, 'utf8')));
  process.exitCode = 3;
}

let browserPath, checkout;
try {
  browserPath = findBrowser();
  checkout = pinnedCheckout();
} catch (error) {
  giveUp(error);
  process.exit();
}
const source = readFileSync(input, 'utf8');
const page = pageSize(source);
const catalog = JSON.parse(readFileSync(new URL('../assets/catalog.json', import.meta.url), 'utf8'));
const assets = referencedAssets(source, catalog);
const assetUris = Object.fromEntries(
  assets.map((ref) => [
    ref,
    `data:image/svg+xml,${encodeURIComponent(readFileSync(path.join(checkout, 'src/main/webapp', ref), 'utf8'))}`,
  ]),
);
const files = new Map([
  ['/viewer.js', 'js/viewer-static.min.js'],
  ['/stencils.js', 'js/stencils.min.js'],
  ['/aws.js', 'shapes/mxAWS4.js'],
  ['/kubernetes.js', 'shapes/mxKubernetes.js'],
]);
execFileSync(
  'git',
  [
    '-C',
    checkout,
    'diff',
    '--exit-code',
    'HEAD',
    '--',
    ...[...files.values(), ...assets].map((file) => `src/main/webapp/${file}`),
  ],
  { stdio: 'pipe' },
);
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
  var annotationMetadata = ${annotationMetadata.toString()};
  var metrics = Object.values(graph.getModel().cells).map(function(cell) {
    var state=graph.view.getState(cell);
    if (!state) return null;
    return {id:cell.id,parent:cell.parent?.id || null,source:cell.source?.id || null,target:cell.target?.id || null,type:cell.value?.getAttribute?.('c4Type') || null,...annotationMetadata(cell),bounds:rect(state),body:rect(state.shape?.boundingBox),text:rect(state.text?.boundingBox),points:state.absolutePoints?.map(function(p){return {x:p.x,y:p.y};}) || null};
  }).filter(Boolean);
  document.getElementById('result').textContent = 'JSON:' + btoa(unescape(encodeURIComponent(JSON.stringify({svg:mxUtils.getXml(svg),metrics:metrics}))));
} catch (e) { document.getElementById('result').textContent = 'ERROR:' + e.stack; } })();
</script>`;
const server = createServer((req, res) => {
  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
  } else if (files.has(req.url)) {
    res.setHeader('Content-Type', 'application/javascript');
    res.end(readFileSync(path.join(checkout, 'src/main/webapp', files.get(req.url))));
  } else {
    res.statusCode = 404;
    res.end('Local-only renderer: resource not supplied.');
  }
});
try {
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const child = spawn(
    browserPath,
    [
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-background-networking',
      '--remote-debugging-port=0',
      '--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1',
      `--user-data-dir=${temporary}/profile`,
      'about:blank',
    ],
    {
      stdio: ['ignore', 'ignore', 'pipe'],
      env: { ...process.env, XDG_CACHE_HOME: temporary, XDG_CONFIG_HOME: temporary },
    },
  );
  const exited = new Promise((resolve) => child.once('close', resolve));
  let socket;
  const pending = new Map();
  let sequence = 0,
    sessionId;
  const timeout = setTimeout(() => {
    child.kill('SIGTERM');
    for (const p of pending.values()) p.reject(new Error('Browser render timed out.'));
  }, 40_000);
  try {
    const endpoint = await new Promise((resolve, reject) => {
      let stderr = '';
      const startup = setTimeout(
        () => reject(new Error(`Browser did not expose a local debugging endpoint: ${stderr.slice(-1000)}`)),
        12_000,
      );
      child.once('error', reject);
      child.stderr.on('data', (c) => {
        stderr += c;
        const match = stderr.match(/DevTools listening on (ws:\/\/127\.0\.0\.1:[^\s]+)/);
        if (match) {
          clearTimeout(startup);
          resolve(match[1]);
        }
      });
    });
    socket = new WebSocket(endpoint);
    await once(socket, 'open');
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data),
        p = pending.get(message.id);
      if (p) {
        pending.delete(message.id);
        message.error ? p.reject(new Error(message.error.message)) : p.resolve(message.result);
      }
    });
    const call = (method, params = {}, page = true) =>
      new Promise((resolve, reject) => {
        const id = ++sequence;
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params, ...(page && sessionId ? { sessionId } : {}) }));
      });
    const target = await call('Target.createTarget', { url: 'about:blank' }, false);
    sessionId = (await call('Target.attachToTarget', { targetId: target.targetId, flatten: true }, false)).sessionId;
    await call('Page.enable');
    await call('Emulation.setDeviceMetricsOverride', {
      width: page.width,
      height: page.height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await call('Page.navigate', { url: `http://127.0.0.1:${server.address().port}/` });
    const evaluation = await call('Runtime.evaluate', {
      expression:
        "(async () => { for (let i=0;i<150;i++) { const s=document.getElementById('result')?.textContent; if(s) return s; await new Promise(r=>setTimeout(r,100)); } return 'ERROR: diagram script did not finish'; })()",
      awaitPromise: true,
      returnByValue: true,
    });
    const result = evaluation.result?.value || evaluation.exceptionDetails?.text || 'ERROR: No result';
    if (!result.startsWith('JSON:')) throw new Error(result);
    const rendered = JSON.parse(Buffer.from(result.slice(5), 'base64').toString('utf8'));
    writeFileSync(svgOutput, `${rendered.svg}\n`);
    const browser = await call('Browser.getVersion', {}, false);
    writeFileSync(
      svgOutput.replace(/\.svg$/, '.render.json'),
      `${JSON.stringify(
        {
          renderer: 'Chromium with pinned local draw.io viewer',
          drawio_version: upstreamVersion,
          upstream_commit: upstreamCommit,
          browser: browser.product,
          metrics: rendered.metrics,
        },
        null,
        2,
      )}\n`,
    );
    const capture = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    writeFileSync(screenshot, Buffer.from(capture.data, 'base64'));
  } finally {
    clearTimeout(timeout);
    socket?.close();
    child.kill('SIGTERM');
    await exited;
  }
  console.log(`Rendered ${screenshot} and ${svgOutput} with the pinned draw.io viewer. Inspect the PNG.`);
} catch (error) {
  giveUp(error);
} finally {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
  rmSync(temporary, { recursive: true, force: true });
}
