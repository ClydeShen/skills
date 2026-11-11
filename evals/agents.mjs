import { cpSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { exportPackageAtRef, exportWorkingPackage } from '../harness/skill-quality.mjs';

// Installs one version of a skill in both clients' native project locations.
export function installSkill(item, ref, directory) {
  const exported = ref
    ? exportPackageAtRef(item, ref, path.join(directory, '.export'))
    : exportWorkingPackage(item, path.join(directory, '.export'));
  if (!exported) throw new Error(`${item.name} does not exist at ${ref}.`);
  for (const location of ['.claude/skills', '.agents/skills']) {
    mkdirSync(path.join(directory, location), { recursive: true });
    cpSync(exported, path.join(directory, location, item.name), { recursive: true });
  }
  rmSync(path.join(directory, '.export'), { recursive: true, force: true });
  return directory;
}

const ACCESS = {
  // Decides whether to use a skill; reads files only.
  read: { claudeTools: ['Read', 'Glob', 'Grep'], turns: 6, codexSandbox: 'read-only' },
  // Does the work the skill describes: writes files and runs the package's scripts.
  write: {
    claudeTools: ['Bash', 'Read', 'Write', 'Edit', 'Glob', 'Grep', 'Skill'],
    turns: 120,
    codexSandbox: 'workspace-write',
  },
};

// A Promptfoo agent provider confined to one throwaway project. Claude loads project settings only.
export function agentProvider(agent, { skill, directory, label, env, access = 'read' }) {
  const level = ACCESS[access];
  if (!level) throw new Error(`Access must be ${Object.keys(ACCESS).join(' or ')}.`);
  if (agent === 'claude') {
    return {
      id: 'anthropic:claude-agent-sdk',
      label,
      config: {
        working_dir: directory,
        setting_sources: skill ? ['project'] : [],
        ...(skill ? { skills: [skill] } : {}),
        append_allowed_tools: level.claudeTools,
        ...(access === 'write' ? { permission_mode: 'acceptEdits' } : {}),
        max_turns: level.turns,
        persist_session: false,
        // Without an API key the SDK uses the existing Claude Code login.
        apiKeyRequired: Boolean(env.ANTHROPIC_API_KEY),
        ...(env.EVAL_CLAUDE_MODEL ? { model: env.EVAL_CLAUDE_MODEL } : {}),
      },
    };
  }
  if (agent !== 'codex') throw new Error('Agent must be claude or codex.');
  return {
    id: 'openai:codex-sdk',
    label,
    config: {
      working_dir: directory,
      skip_git_repo_check: true,
      sandbox_mode: level.codexSandbox,
      // Promptfoo infers Codex skill use from streamed SKILL.md reads.
      enable_streaming: true,
      ...(env.EVAL_CODEX_MODEL ? { model: env.EVAL_CODEX_MODEL } : {}),
    },
  };
}
