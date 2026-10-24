# Research: Skill 仓库的质量工具与工程检查

日期：2026-10-25。问题：哪些工程工具适合规范本仓库的 agent skill，并为 delivery agent 提供可执行反馈？背景：本仓库已有候选、Promptfoo 和三平台 CI，需要补足格式、配置和发布检查。本轮只研究，不安装或改动工具配置。

当前建议：[inference] 以仓库级统一检查命令为核心，加入针对 skill/agent 配置的 agnix 试运行、格式兼容检查、包自包含和导航检查，继续复用现有评估。安全扫描按需增加。CI 与宿主权限负责不同边界；不要把 linter 当成权限控制。

证据标记：`[official]` 表示核读维护者文档或源码，`[measured]` 表示本次命令观察，`[inference]` 表示建议。未运行新 linter 或 scanner。

## Overview

| 问题 | 建议 | 依据与限制 | 判断信心 |
| --- | --- | --- | --- |
| Skill 格式是否合规？ | 保留 skills-ref 兼容检查，并补充仓库约束 | 官方参考实现，但自述是 demonstration | 中，J1 |
| 多 agent 配置是否写对？ | agnix 先报告、调噪后再阻断明确错误 | 支持技能与多工具配置；非行为证明 | 中，J2 |
| Skill 有没有实际价值？ | 复用 Promptfoo，并增加真实宿主 with/without 对照 | 官方评估指导；fixture 不足 | 中，J3 |
| 是否要默认安全扫描？ | Cisco Skill Scanner 作为发布或引入第三方包时的可选层 | best-effort，额外运行时与误报成本 | 中，J4 |
| Agent 能否改检查后宣布成功？ | 受保护分支、required checks、对检查配置的独立 review | 服务端机制需要实际启用，CODEOWNERS 文件本身不够 | 中，J5 |

## 1. 当前仓库的缺口

### Evidence

[measured] 检查 `package.json` 和 `.github/workflows/prompt-evaluation.yml`：已有 Node.js 测试、loopback transport 和 fixture evaluation；尚无统一 `check`、agent 配置 lint 或包布局检查命令。

[measured] `CLAUDE.md` 仍称仓库没有测试工具，与现有 npm 配置不一致。`.agents/skills/` 与 `.claude/skills/` 中两个已导入 skill 的正文经 `cmp` 检查相同，但具有两处维护位置。

[inference] 最先应修复说明漂移并提供单一检查入口，再逐步添加规则。不必先更换整个 delivery harness。

### Recommendation for the project

建议未来的 `npm run check` 调用现有工具与少量仓库专用检查，统一服务本地、CI 和 agent 的结束检查。初始范围：

- agent/skill 配置 lint；正式包和候选包使用明确扫描清单。
- SKILL frontmatter、唯一名称、目录名称与名称一致。
- 包内引用有效、运行时资源不依赖 research/knowledge/incubator 的包外文件。
- Markdown 链接及 JSON/schema 检查；已有结构化清单应使用其 schema。
- 已有 harness 测试和 fixture smoke，结果明确标为链路检查。

[inference] 候选和导入的工具 skill 应分类扫描，不因仓库内出现任何 SKILL.md 就自动认定其是正式发布产物。真实模型评估保持显式运行，避免每次提交消耗 quota 或被模型波动阻塞。

### Relation to existing constraints

符合 AGENTS.md 的生命周期、运行时自包含和发布验证要求。仓库通用检查属于工程配置，具体 skill 的案例仍归孵化项目。

## 2. agnix：最值得先试的专用 linter

### Evidence

[official] agnix 核读 README 提供 CLI、编辑器和 GitHub Action；检查 SKILL.md、AGENTS.md、CLAUDE.md、hooks、MCP 和不同 agent 的配置。它支持严格模式及跨工具配置检查。[S1]

[official] 配置文件是 `.agnix.toml`，可选择 `tools`、规则类别、严重程度、路径范围及局部例外；可在 CI 忽略内联 suppression。相关配置需要与固定版本核对。[S2]

[measured] 本次 `npm view agnix version engines --json` 返回版本 `0.59.3`，Node.js 要求 `>=16.0.0`。未安装、未执行。

[official] 核读 npm 安装器：postinstall 下载 GitHub release 二进制并校验 SHA-256。映射含 Linux、macOS、Windows x64；所读版本中 Intel Mac 使用 ARM 二进制经 Rosetta，Windows ARM64 未列入映射。上游 CI 有三种 OS 测试。主分支 package.json 与 registry 的版本不同，不能混同。[S3][S4][S5]

### Recommendation for the project

[inference · J2] 若实施，固定 npm 版本，以 `tools = ["codex", "claude-code"]` 为起点，先报告再分类处理。保留格式或无效字段等确定性错误为 gate，通用措辞、token 预算等启发式规则先警告。不默认执行自动修复。

[inference] 例外需要规则 ID、路径和理由；不要为清空报告而全局关闭规则。初次评估需覆盖现有 research 文档中的示例文本，防止把记录中的坏例子当作待运行配置。

[inference] 云端首次安装还需能访问 GitHub release，不能认为允许 npm registry 就足够。Windows ARM 或 Intel Mac 等需额外验证。锁文件与 release 校验有价值，但不等于不再需要供应链审查。

### Relation to existing constraints

能复用 Node.js 工具入口，避免另引一套日常执行语言。它验证配置，不限制 agent 的实际权限，也不证明所有 instructions 被遵守。

## 3. skills-ref 与 authoring best practices 的正确位置

### Evidence

[official] skills-ref 提供 `validate`、读取属性及生成提示目录，README 同时明确将其定位为演示性质参考库，不适合直接当生产系统。[S6]

[official] Agent Skills best-practices 强调来自真实领域经验、精简上下文、保持合理职责范围，并通过真实执行修订。[S7]

[official] 官方评估文档推荐相同任务的 with-skill 与 without-skill/旧版本对照，干净上下文，以及记录产物、耗时和 token。Anthropic skill-creator 提供相近的迭代、评价和 description 优化方法。[S8][S9]

### Recommendation for the project

[inference · J1/J3] 保留已采用的 reference validator 作为格式兼容 smoke。对本仓库必须成立的规则，建立可测试的本地检查，不依赖 reference 库承担完整发布质量保证。

[inference] 把 authoring 指导提炼成少量能审核的标准：明确触发边界、用户任务导向、最少必要步骤、包内资源、自带边界案例。不要把完整 skill-creator 流程强制运行于每次小改动。

[inference] 当前 Promptfoo 可以比较 prompt 条件；技能自然激活、按需读引用、文件输出和记忆操作仍需真实宿主测试。`42/42 fixture` 应继续只作为 harness 自检，不能升级成 skill 通过率。

### Relation to existing constraints

符合用户希望 skill 本体轻量的要求。作者工具帮助发现问题，不能取代独立验证或代码审查。

## 4. Cisco Skill Scanner：可选安全层

### Evidence

[official] Scanner 自述为 best-effort，检测注入、外传和恶意代码模式，并明确存在误报漏报。CLI、SARIF 和可复用 CI 可用于报告；部分分析器或外部服务是可选项。[S10]

[official] 当前 pyproject 要求 Python `>=3.11,<3.15`，带 YARA-X、文件检测及 AI SDK 等依赖。Quick Start 中基本扫描使用静态等核心分析器，真实威胁覆盖的推荐配置会再启用 LLM judge。后者需要模型、额外延迟及数据流向选择。[S11][S12]

### Recommendation for the project

[inference · J4] 将其放在引入第三方 skill、准备发布或定期检查时的报告层，先用合成包验证安装与噪声。未验证检测结果前，不把所有命中设为阻断。LLM/cloud 分析需要明确选择，不与 NVIDIA prompt evaluation 凭证默认混用。

[inference] 当前自有文本候选较少，核心收益仍来自正确引用、自包含、真实行为评估和宿主权限。无需为每次文档改动默认增加完整安全扫描栈。

### Relation to existing constraints

本项目新增依赖应有具体收益；scanner 的零命中不是安全证明，更不能给予 delivery agent 更宽权限。

## 5. 检查本身需要独立边界

### Evidence

[official] GitHub 受保护分支可以要求 review、status checks，并控制绕过；默认管理员可能例外。CODEOWNERS 只有与 required owner reviews 等设置结合，才构成合并要求。[S13][S14]

### Recommendation for the project

[inference · J5] 将 `AGENTS.md`、`CLAUDE.md`、检查脚本、CI、权限配置及 CODEOWNERS 自身列为需独立审查的路径。让本地 hooks 和 CI 调用同一命令，但以实际启用的服务端 gate 为最终合并条件。

[inference] 如果 agent 使用仓库所有者同一账号或 bypass 凭证，review 要求可能无法形成独立判断。对检查的修改要与业务改动一并审视，不能仅看修改后的检查已通过。本轮未读取远端保护设置，不能断言当前已启用或缺失。

### Relation to existing constraints

支持已有 guardrails 的分层和保护检查原则；不在研究阶段更改远端设置、权限或工作流。

## 判断信心

J1–J5 均为中，3.0：Owner 1（明确要求相关研究）、Research 1（已核读维护者资料）、Reasoning 0.5（组合方案尚需实现）、Project history 0.5（有现有工具与规则，无新方案实测）。这是建议的支持度，不是成功概率。

## Not verified

- 未安装或运行 agnix、Cisco Scanner，未验证其对当前仓库的诊断质量。
- 未在 Windows、macOS、WSL 实测新工具，架构与安装器信息限于所读源码。
- 未读取远端 branch protection、rulesets、CODEOWNERS 设置或账号绕过权限。
- 未验证实际 skill 的自然激活和宿主行为；官方 skill-creator 只是阅读来源，未安装或执行。
- 未实施 `npm run check`、新 hooks、权限配置或安全扫描。

## Decisions for the owner

当前无须决定具体 provider 或购买服务。实施前需要决定哪些高影响路径必须由独立身份审查，以及是否接受将外部扫描器作为初期报告层。

## Sources

- [S1 — agnix README](https://raw.githubusercontent.com/agent-sh/agnix/main/README.md)：能力、CLI 与安装建议。
- [S2 — agnix 配置参考](https://raw.githubusercontent.com/agent-sh/agnix/main/docs/CONFIGURATION.md)：范围、严重程度与例外机制。
- [S3 — npm package.json](https://raw.githubusercontent.com/agent-sh/agnix/main/npm/package.json)：平台字段与 postinstall。
- [S4 — npm 安装器](https://raw.githubusercontent.com/agent-sh/agnix/main/npm/install.js)：二进制下载、校验与平台映射。
- [S5 — agnix CI](https://raw.githubusercontent.com/agent-sh/agnix/main/.github/workflows/ci.yml)：三平台测试范围。
- [S6 — skills-ref README](https://raw.githubusercontent.com/agentskills/agentskills/main/skills-ref/README.md)：参考实现定位和命令。
- [S7 — Best practices](https://agentskills.io/skill-creation/best-practices)：领域经验、上下文和真实执行。
- [S8 — Evaluating skills](https://agentskills.io/skill-creation/evaluating-skills)：隔离、对照和实际产物。
- [S9 — Anthropic skill-creator](https://raw.githubusercontent.com/anthropics/skills/main/skills/skill-creator/SKILL.md)：作者迭代与评价方法。
- [S10 — Scanner README](https://raw.githubusercontent.com/cisco-ai-defense/skill-scanner/main/README.md)：安全范围与明确限制。
- [S11 — Scanner pyproject](https://raw.githubusercontent.com/cisco-ai-defense/skill-scanner/main/pyproject.toml)：运行时与依赖。
- [S12 — Scanner Quick Start](https://raw.githubusercontent.com/cisco-ai-defense/skill-scanner/main/docs/getting-started/quick-start.md)：核心扫描、judge 和 CLI。
- [S13 — Protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)：合并要求及绕过边界。
- [S14 — CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)：owner review 与设置依赖。
