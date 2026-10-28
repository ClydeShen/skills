const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { manifest } = require('./prompt.cjs');
const pkg = require('./package.json');

for (const name of ['EVAL_TARGET_PROVIDER', 'EVAL_GRADER_PROVIDER']) {
  if (!process.env[name]) {
    console.error('Set ' + name + ' to a Promptfoo provider ID before running model evaluations.');
    process.exit(2);
  }
}
process.chdir(__dirname);
fs.mkdirSync('results', { recursive: true });
fs.writeFileSync('results/manifest.json', JSON.stringify({
  created_at: new Date().toISOString(),
  promptfoo: pkg.devDependencies.promptfoo,
  target: process.env.EVAL_TARGET_PROVIDER,
  grader: process.env.EVAL_GRADER_PROVIDER,
  skill: manifest(),
}, null, 2) + '\n');
const installedPackage = path.join(__dirname, 'node_modules/promptfoo');
const installedMetadata = JSON.parse(fs.readFileSync(path.join(installedPackage, 'package.json'), 'utf8'));
const entry = path.join(installedPackage, installedMetadata.bin.promptfoo);
const result = spawnSync(process.execPath, [
  entry, 'eval', '-c', 'promptfooconfig.cjs',
  '--no-cache', '--no-share', '--no-write', '--max-concurrency', '2',
  '-o', 'results/latest.json', ...process.argv.slice(2),
], {
  stdio: 'inherit',
  env: { ...process.env, PROMPTFOO_DISABLE_TELEMETRY: '1' },
});
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 2);
