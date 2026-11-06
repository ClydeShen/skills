import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstatSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const scannerVersion = '2.3.2';

// Use the scanner's scoped re-rating, not disabled rules or hidden findings.
export function reviewedPolicy(repository, packagePath, review) {
  if (!/^(?:incubator\/[a-z0-9-]+\/candidate|skills|\.agents\/skills)\/[a-z0-9-]+$/.test(packagePath))
    throw new Error('Provide an exact repository-relative skill package path.');
  if (review.scanner_version !== scannerVersion || !Array.isArray(review.reviews))
    throw new Error('Invalid or expired scanner review configuration; re-review after a scanner upgrade.');
  const suppressions = review.reviews
    .filter((entry) => entry.package === packagePath)
    .map((entry) => {
      if (
        !/^scripts\/[a-z0-9-]+\.mjs$/.test(entry.file) ||
        !/^[a-f0-9]{64}$/.test(entry.sha256) ||
        !/^[A-Z][A-Z0-9_]+$/.test(entry.rule_id) ||
        !entry.reason?.trim() ||
        !/^\d{4}-\d{2}-\d{2}$/.test(entry.reviewed_on)
      )
        throw new Error('A review needs an exact script path, SHA-256, rule, date and reason.');
      const file = path.join(realpathSync(repository), packagePath, entry.file);
      if (!lstatSync(file).isFile() || realpathSync(file) !== path.resolve(file))
        throw new Error(`Reviewed source must not be a symlink: ${file}`);
      const digest = createHash('sha256').update(readFileSync(file)).digest('hex');
      if (digest !== entry.sha256)
        throw new Error(
          `Security review expired: ${packagePath}/${entry.file} changed. Review the calls before updating its hash.`,
        );
      return {
        rule_id: entry.rule_id,
        skills: [path.posix.basename(packagePath)],
        paths: [entry.file],
        severity: 'INFO',
        reason: `${entry.reviewed_on}; scanner ${review.scanner_version}; SHA-256 ${digest}. ${entry.reason}`,
      };
    });
  return { preset_base: 'balanced', suppressions };
}

export function scanSkill(repository, packagePath, run = spawnSync) {
  const review = JSON.parse(readFileSync(path.join(repository, 'harness/skill-security-reviews.json'), 'utf8'));
  const policy = reviewedPolicy(repository, packagePath, review);
  const output = path.join(repository, 'evals/.local/security');
  mkdirSync(output, { recursive: true });
  const prefix = path.join(output, packagePath.replaceAll('/', '__'));
  const policyFile = `${prefix}.policy.json`;
  writeFileSync(policyFile, `${JSON.stringify(policy, null, 2)}\n`);
  const result = run(
    'uvx',
    [
      '--from',
      `cisco-ai-skill-scanner==${review.scanner_version}`,
      'skill-scanner',
      'scan',
      packagePath,
      '--policy',
      policyFile,
      '--format',
      'json',
      '--fail-on-severity',
      'high',
    ],
    { cwd: repository, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024, shell: false },
  );
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) throw result.error;
  // Keep the complete native report, including previous_severity and review reasons.
  writeFileSync(`${prefix}.report.json`, result.stdout || '');
  const report = JSON.parse(result.stdout);
  if (!Array.isArray(report.findings)) throw new Error('Scanner returned an invalid report.');
  // The scanner case-folds paths; a second, differently cased file is not reviewed.
  for (const finding of report.findings) {
    if (
      finding.metadata?.suppression &&
      !policy.suppressions.some((entry) => entry.rule_id === finding.rule_id && entry.paths[0] === finding.file_path)
    )
      throw new Error(`Scanner applied a review outside its exact path: ${finding.file_path}`);
  }
  console.log(`${packagePath}: ${report.findings.length} finding(s); max severity ${report.max_severity}`);
  for (const finding of report.findings) {
    const previous = finding.metadata?.suppression?.previous_severity;
    console.log(
      `  ${finding.severity}${previous ? ` (reviewed from ${previous})` : ''}: ${finding.rule_id} ${finding.file_path}:${finding.line_number ?? '-'} — ${finding.metadata?.suppression?.reason || finding.title}`,
    );
  }
  reviewedPolicy(repository, packagePath, review);
  return result.status === 0 && !report.findings.some((finding) => ['HIGH', 'CRITICAL'].includes(finding.severity));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 3) throw new Error('Usage: npm run security:scan -- <repository-relative-skill-path>');
    process.exitCode = scanSkill(root, process.argv[2]) ? 0 : 1;
  } catch (error) {
    console.error(`Skill security: ${error.message}`);
    process.exitCode = 1;
  }
}
