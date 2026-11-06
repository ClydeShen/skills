import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { reviewedPolicy, scanSkill } from './skill-security.mjs';

const packagePath = 'incubator/example/candidate/example';
const source = "import { spawnSync } from 'node:child_process';\nspawnSync('git', ['--version']);\n";

function fixture(t) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'skill-security-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const script = path.join(root, packagePath, 'scripts/render.mjs');
  mkdirSync(path.dirname(script), { recursive: true });
  writeFileSync(script, source);
  const review = {
    scanner_version: '2.3.2',
    reviews: [
      {
        package: packagePath,
        file: 'scripts/render.mjs',
        sha256: createHash('sha256').update(source).digest('hex'),
        rule_id: 'COMMAND_INJECTION_JS_CHILD_PROCESS',
        reviewed_on: '2026-11-06',
        reason: 'Fixture review: an explicit argument array, without a shell.',
      },
    ],
  };
  mkdirSync(path.join(root, 'harness'));
  writeFileSync(path.join(root, 'harness/skill-security-reviews.json'), JSON.stringify(review));
  return { root, script, review };
}

test('only the reviewed skill, exact script and rule are re-rated, never hidden or globally disabled', (t) => {
  const { root, review } = fixture(t);
  const policy = reviewedPolicy(root, packagePath, review);
  assert.deepEqual(Object.keys(policy).sort(), ['preset_base', 'suppressions']);
  assert.equal(policy.preset_base, 'balanced');
  assert.equal(policy.suppressions.length, 1);
  const entry = policy.suppressions[0];
  assert.deepEqual(entry.skills, ['example']);
  assert.deepEqual(entry.paths, ['scripts/render.mjs']);
  assert.equal(entry.rule_id, 'COMMAND_INJECTION_JS_CHILD_PROCESS');
  assert.equal(entry.severity, 'INFO');
  assert.match(entry.reason, /scanner 2\.3\.2; SHA-256 [a-f0-9]{64}/);
  assert.deepEqual(reviewedPolicy(root, 'skills/another', review).suppressions, []);
});

test('changed reviewed bytes, scanner upgrades and wildcard selectors invalidate the review', (t) => {
  const { root, script, review } = fixture(t);
  for (const file of ['scripts/*.mjs', '../render.mjs', '/tmp/render.mjs']) {
    const invalid = structuredClone(review);
    invalid.reviews[0].file = file;
    assert.throws(() => reviewedPolicy(root, packagePath, invalid), /exact script path/);
  }
  assert.throws(() => reviewedPolicy(root, '../outside', review), /exact repository-relative/);
  assert.throws(() => reviewedPolicy(root, packagePath, { ...review, scanner_version: '2.4.0' }), /upgrade/);
  writeFileSync(script, `${source}process.exit(0);\n`);
  assert.throws(() => reviewedPolicy(root, packagePath, review), /Security review expired/);
});

test('scanner reports retain review metadata and new critical findings still fail', (t) => {
  const { root } = fixture(t);
  const report = {
    max_severity: 'CRITICAL',
    findings: [
      {
        severity: 'INFO',
        rule_id: 'COMMAND_INJECTION_JS_CHILD_PROCESS',
        file_path: 'scripts/render.mjs',
        metadata: { suppression: { previous_severity: 'CRITICAL', reason: 'Reviewed fixture' } },
      },
      { severity: 'CRITICAL', rule_id: 'COMMAND_INJECTION_JS_CHILD_PROCESS', file_path: 'scripts/new.mjs' },
    ],
  };
  const run = (command, args, options) => {
    assert.equal(command, 'uvx');
    assert.ok(args.includes('cisco-ai-skill-scanner==2.3.2'));
    assert.ok(args.includes('--fail-on-severity'));
    assert.equal(options.shell, false);
    const policy = JSON.parse(readFileSync(args[args.indexOf('--policy') + 1], 'utf8'));
    assert.deepEqual(policy.suppressions[0].paths, ['scripts/render.mjs']);
    // Defend against a scanner returning a success exit code with a high finding.
    return { status: 0, stdout: JSON.stringify(report), stderr: '' };
  };
  assert.equal(scanSkill(root, packagePath, run), false);
  const output = path.join(root, 'evals/.local/security', `${packagePath.replaceAll('/', '__')}.report.json`);
  assert.deepEqual(JSON.parse(readFileSync(output, 'utf8')), report);
  assert.equal(
    scanSkill(root, packagePath, () => ({
      status: 0,
      stdout: JSON.stringify({ ...report, findings: report.findings.slice(0, 1) }),
    })),
    true,
  );
});

test('unavailable scanners, malformed reports and nonzero exit codes cannot count as a pass', (t) => {
  const { root } = fixture(t);
  assert.throws(() => scanSkill(root, packagePath, () => ({ error: new Error('missing uvx') })), /missing uvx/);
  assert.throws(() => scanSkill(root, packagePath, () => ({ status: 0, stdout: 'not JSON' })), SyntaxError);
  assert.throws(() => scanSkill(root, packagePath, () => ({ status: 0, stdout: '{}' })), /invalid report/);
  assert.equal(
    scanSkill(root, packagePath, () => ({ status: 1, stdout: '{"findings":[]}' })),
    false,
  );
});

test('case-insensitive native matching cannot re-rate a different source file', (t) => {
  const { root } = fixture(t);
  assert.throws(
    () =>
      scanSkill(root, packagePath, () => ({
        status: 0,
        stdout: JSON.stringify({
          findings: [
            {
              severity: 'INFO',
              rule_id: 'COMMAND_INJECTION_JS_CHILD_PROCESS',
              file_path: 'scripts/Render.mjs',
              metadata: { suppression: { previous_severity: 'CRITICAL' } },
            },
          ],
        }),
      })),
    /outside its exact path/,
  );
});

test('committed reviews match the actual reviewed source', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const review = JSON.parse(readFileSync(path.join(root, 'harness/skill-security-reviews.json'), 'utf8'));
  for (const packagePath of new Set(review.reviews.map((entry) => entry.package)))
    assert.ok(reviewedPolicy(root, packagePath, review).suppressions.length > 0);
});
