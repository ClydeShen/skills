import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmodSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

// Release binaries that npm cannot pin. Each download must match the recorded SHA-256.
const tools = {
  'skill-validator': {
    version: '1.8.0',
    url: (asset) => `https://github.com/agent-ecosystem/skill-validator/releases/download/v1.8.0/${asset}`,
    asset: (os, arch, ext) => `skill-validator_1.8.0_${os}_${arch === 'x64' ? 'amd64' : arch}.${ext}`,
    sha256: {
      'darwin-x64': 'c1d5ba9c6cb9cb74e6c1c9804fc1f8a9d0743abc2db111ed62e2e46dac0c20c2',
      'darwin-arm64': '38233187e0424a616a31e0c9d27f3f17eb350928f3f1641da663ea2bd63161ed',
      'linux-x64': 'a9b4cb3436682ff8d55dd0d164376c8479d35cb58c0adc3e93170fbde8baa04f',
      'linux-arm64': '87dc2f61df60f6c737b29e479a541ad72ee0f9c11422cdd76e7036a7e22e9fbc',
      'windows-x64': 'e4526df55580f3641e25c0fd40ebdc149ce5b3479bb3c1fdb8dc83f1dc14f654',
      'windows-arm64': '53418f29b22187deb3fa5de4341f99b504c2eaf5d5d2f2bdc43bb92dc43b2cad',
    },
  },
  gitleaks: {
    version: '8.30.1',
    url: (asset) => `https://github.com/gitleaks/gitleaks/releases/download/v8.30.1/${asset}`,
    asset: (os, arch, ext) => `gitleaks_8.30.1_${os}_${arch}.${ext}`,
    sha256: {
      'darwin-x64': 'dfe101a4db2255fc85120ac7f3d25e4342c3c20cf749f2c20a18081af1952709',
      'darwin-arm64': 'b40ab0ae55c505963e365f271a8d3846efbc170aa17f2607f13df610a9aeb6a5',
      'linux-x64': '551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb',
      'linux-arm64': 'e4a487ee7ccd7d3a7f7ec08657610aa3606637dab924210b3aee62570fb4b080',
      'windows-x64': 'd29144deff3a68aa93ced33dddf84b7fdc26070add4aa0f4513094c8332afc4e',
      'windows-arm64': 'b95f5e4f5c425cedca7ee203d9afd29597e692c4924a12ed42f970537c72cc0f',
    },
  },
};

const hostOs = () => (process.platform === 'win32' ? 'windows' : process.platform);

export const toolNames = Object.keys(tools);

export function toolPath(name, cwd = root) {
  const file = process.platform === 'win32' ? `${name}.exe` : name;
  return path.join(cwd, 'node_modules/.cache/repository-tools', `${name}-${tools[name].version}`, file);
}

export function requireTool(name) {
  const file = toolPath(name);
  if (!existsSync(file)) throw new Error(`${name} is unavailable. Run npm ci with network access; this is not a pass.`);
  return file;
}

export function verifyDigest(bytes, expected) {
  const actual = createHash('sha256').update(bytes).digest('hex');
  if (actual !== expected) throw new Error(`Checksum mismatch: expected ${expected}, received ${actual}.`);
}

export async function installTool(name) {
  const tool = tools[name];
  const file = toolPath(name);
  if (existsSync(file)) return file;
  const expected = tool.sha256[`${hostOs()}-${process.arch}`];
  if (!expected) throw new Error(`${name} has no release for ${process.platform}/${process.arch}.`);
  const extension = process.platform === 'win32' ? 'zip' : 'tar.gz';
  const asset = tool.asset(hostOs(), process.arch, extension);
  const response = await fetch(tool.url(asset));
  if (!response.ok) throw new Error(`${name} download returned HTTP ${response.status}.`);
  const bytes = Buffer.from(await response.arrayBuffer());
  verifyDigest(bytes, expected);
  const directory = path.dirname(file);
  mkdirSync(directory, { recursive: true });
  const archive = path.join(directory, asset);
  writeFileSync(archive, bytes);
  // Windows ships bsdtar, which reads zip; Git for Windows may put GNU tar first on PATH.
  const tar = process.platform === 'win32' ? path.join(process.env.SystemRoot, 'System32/tar.exe') : 'tar';
  const result = spawnSync(tar, ['-xf', archive, '-C', directory], { encoding: 'utf8' });
  rmSync(archive, { force: true });
  if (result.error || result.status !== 0)
    throw new Error(`${name} extraction failed: ${result.error?.message || result.stderr}`);
  if (process.platform !== 'win32') chmodSync(file, 0o755);
  return file;
}
