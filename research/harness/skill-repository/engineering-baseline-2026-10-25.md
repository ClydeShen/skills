# Research: Skill 仓库的工程约束与 delivery harness

日期：2026-10-25。问题：什么工程配置适合当前 skill 仓库，既规范产物，又约束 Codex、Claude 等 delivery agent？背景：仓库已有生命周期、知识与候选包、Promptfoo 及三平台 CI，需要把已有规范落到可执行检查。

结论：[inference] 采用少量可重复运行的检查作为共同底座，并分别接入 agent hook、本地 Git hook 和受保护的 CI。建议先实现统一 `npm run check`、skill 包检查和 agnix 报告，再处理客户端适配与远端合并约束。指令文件、linter、hook、沙箱和服务器规则各有作用，不能互相代替。本轮仅研究，不安装工具或修改执行权限、hooks、CI、分支规则。

证据标记：`[measured]` 表示本轮仓库只读检查；`[official]` 表示实际核读一手文档；`[inference]` 表示建议。工具与客户端的详细来源及限制分别见[质量工具调查](./skill-quality-tools-2026-10-25.md)和[运行时约束调查](./agent-controls-2026-10-25.md)。

## Overview

| 需要解决的问题 | 最小建议 | 约束强度与边界 |
| --- | --- | --- |
| 指令与 skill 格式错误 | agnix + reference validator + 包内引用检查 | 检查已编码规则，不能证明语义质量 |
| 仓库规定被遗漏 | 一个确定性检查入口，供各层调用 | 本地调用可以被跳过；CI 是否阻止合并取决于服务器配置 |
| agent 在失败检查后结束 | 客户端支持的结束 hook 反馈 | 有事件、信任、版本和失败语义差异；不能代替沙箱 |
| agent 修改不该修改的文件或出网 | 宿主有效的权限、OS sandbox 与凭证范围 | 需检查实际覆盖的工具路径，不能只看配置文本 |
| agent 改检查让自己通过 | 受保护检查配置、人工审查及无旁路身份 | 规则管理者或 bypass 身份仍可能绕过 |
| skill 真正有用 | 保留行为案例与无 skill 对照 | fixture 通过不证明实际效果 |

## 1. 当前仓库的具体缺口

### Evidence

[measured] 核读 `CLAUDE.md`：它导入 `AGENTS.md`，但仍声称没有 build、lint 或 test tooling。实际 `package.json` 已有 `npm test`、传输检查、fixture 与真实模型评估入口。可以确认存在文档漂移，不能据此推断 agent 已发生错误行为。

[measured] 核读 `.github/workflows/prompt-evaluation.yml`：配置了三平台安装与现有测试，但没有 skill 格式、包依赖、Markdown 引用、生命周期或 agent 配置 lint 的自动检查。

[measured] 工作区中没有 `.agnix.toml`、统一 `check` script、Lefthook 配置或本项目的 Codex/Claude hook 适配文件。没有发现本地 CODEOWNERS 文件。未读取 GitHub 实际 rulesets、权限或管理员旁路配置，因此不判断远端是否已受保护。

[measured] `.agents/skills/` 与 `.claude/skills/` 的现有文件比较一致。这是供不同客户端使用的导入工具，不应当成重复发布包而误报。当前 `skills/` 无正式发布包，Meta Thinking 候选位于 `incubator/`。

### Recommendation for the project

[inference] 首先同步操作入口与实际脚本，保留 `AGENTS.md` 为共同规则来源，让 `CLAUDE.md` 主要承担导入和客户端差异说明。避免每个客户端维护一套互相漂移的完整规范。

### Relation to existing constraints

符合当前生命周期与[guardrails 标准](../../../knowledge/harness/guardrails-standard.md)中“一处维护规则、外层重复检查”的要求；不需要重建已有 harness 知识库。

## 2. 规范 skill 产物的最小检查

### Evidence

[official] Agent Skills 的作者实践强调具体领域知识、基于执行反馈迭代、适度内容与按需加载，并区分输出质量和描述触发优化。并非每条建议都可机械检查。[S1]

相关工具的官方来源、安装与限制见[质量工具调查](./skill-quality-tools-2026-10-25.md)。其中 reference validator 是格式参考实现，不是安全或行为证明；agnix 适合检查多客户端配置；Cisco skill-scanner 适合辅助风险扫描，结果仍需审查。

### Recommendation for the project

[inference] `npm run check` 应组合确定性检查。建议将下面几项视为不同职责，而不是让一个 linter 承担全部：

| 检查 | 本项目适用规则 |
| --- | --- |
| Skill 格式 | frontmatter、目录名与 name、描述及字段兼容性 |
| 包边界 | 本地引用目标存在；运行时资源留在包内；不依赖 knowledge/research/incubator 外部路径 |
| 发现与阶段 | 正式发布名称唯一；候选不误作正式产物；导入工具按自身范围处理 |
| 仓库一致性 | 文档链接、JSON/YAML/schema、工具指令与实际脚本对应 |
| agent 配置 | agnix 分别按实际目标客户端与文件作用域检查 |
| 评估基础设施 | 当前 `npm test` 和 fixture 链路，真实模型结果另标为行为证据 |

[inference] 对 SKILL 正文体积、描述泛化程度、引用深度等建议，先作为报告或警告。对缺字段、失效引用和明确越界依赖可以阻断。不要直接启用所有工具规则为 fatal，或在 CI 使用自动修复。

[inference] 使用同一模型、案例和预算比较有无 skill，并检查真实执行轨迹。触发误报、退出是否及时和画像真实读写需要宿主验证；当前结构化 prompt 检查不能替代。[S1]

### Relation to existing constraints

运行时包继续自包含。代码实现、案例和门槛属于具体工程工作，先对齐首批错误与警告，再实施。

## 3. 从快速反馈到有效的交付门槛

### Evidence

[official] Lefthook 的文档说明配置文件安装到 Git hooks，由 hook 调用对应任务；官方列出 npm、winget、Homebrew 等安装入口。本轮仅确认机制，未安装或测试平台兼容。[S2]

[official] GitHub CODEOWNERS 定义文件审查归属，需要结合 required review 才影响合并；rulesets 提供 required PR、checks 和 bypass 设置。检查可以绑定预期 GitHub App。具备旁路权限的主体仍可绕过相应规则。[S3–S5]

### Recommendation for the project

[inference] 可以先不增加 Git hook manager。明确统一检查入口后，再选 Lefthook 作为跨平台的本地便捷层：pre-commit 运行轻检查、pre-push 运行统一检查。agent hook 调用同一个命令，不能各自复制评分或校验逻辑。

[inference] Claude 和 Codex 的配置应分别适配当前客户端能力。结束 hook 可提供未通过检查的反馈，但需处理重复触发、超时及失败行为。hook 自身应有快速可重复的执行路径；免费模型推理不应放进每次结束或提交的强制 hook。客户端细节见[运行时约束调查](./agent-controls-2026-10-25.md)。

[inference] 需要限制交付时，再为 `main` 配置 required PR、required checks、必要审查和禁止 force-push；对 `.github/`、agent 配置、检查器、评估断言与依赖配置设置明确审查归属，CODEOWNERS 自身也要被覆盖。当前只运行 push 后 CI，不能说明失败提交一定进不了 main。

[inference] 使用 owner 的同一管理员身份或具有 bypass 的凭证运行 agent，会削弱服务器约束。CODEOWNERS 也不能把同一 GitHub 身份的自我审查变成独立审查。若需要这一级约束，应限制 agent 身份与凭证，把规则管理或最终确认留在独立受信任路径。该建议涉及远端协作方式，本轮不改变现有直接推送流程。

### Relation to existing constraints

沿用现有三平台 CI，不引入大型编排平台。远端规则属于服务端配置，仅添加仓库文件不足以启用它们。

## 4. 推荐推进顺序

[inference] 第一批工程工作：修正文档漂移，增加统一检查与包边界验证，将 agnix 固定版本接入 report-only，扩展现有 CI 执行同一入口。用实际报告区分工具兼容规则与有价值的质量门槛。

[inference] 第二批工程工作：添加有必要的客户端 hook 和本地 Git hook，实测允许与拒绝的行为。对 Windows、WSL、macOS 和托管云端分别记录哪些约束有效；不假定本地客户端配置自动控制托管云端。

[inference] 当需要限制 agent 自行交付时，配置并核验服务器规则、审查身份和权限旁路。需要更严格保护检查时，检查的可信来源也要独立于被检查分支；不能只因为工作分支内的检查通过就视为规则未被修改。

[inference] Cisco skill-scanner、第三方包供应链与秘密扫描可按引入外部 skill 或新增权限的风险增量加入。先以本地静态报告为主；无需为了这个仓库默认启用额外 LLM judge、云扫描服务或大规模多 agent 编排。

## 判断信心

采用分层检查与受保护交付入口的建议：中，3.0（Owner 0.5：授权研究，尚未采纳具体配置；Research 1：官方机制；Reasoning 1；Project history 0.5：已有规则与评估，缺工具试运行）。分数不是安全性或效果概率。

## Not verified

- agnix、Lefthook、skill-scanner 未在本轮安装或对本仓库运行；尚无规则误报基线。
- 未测试 Codex/Claude hooks，未执行沙箱拒绝行为探针。
- 未核验远端保护、CI 实际执行结果、仓库计划或 agent 身份权限。
- 本轮不修改操作规则，也不执行配置安装、提交或推送。

## Decisions for the owner

本轮无必须立即决定的事项。实施前可先完成第一批本地配置方案；服务器门槛如何改变现有直接推送方式，需要按期望的交付流程选择。

## Sources

- [S1 — Agent Skills 作者实践](https://agentskills.io/skill-creation/best-practices)：核读基于执行反馈迭代、内容与控制粒度建议。
- [S2 — Lefthook 官方说明](https://lefthook.dev/)：Git hook 安装机制与安装入口。
- [S3 — GitHub CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)：审查归属与 required review 的关联。
- [S4 — GitHub rulesets 可用规则](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets)：required PR/checks 及 bypass。
- [S5 — GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)：检查来源、审查与旁路边界。

相关调查：[skill 质量工具](./skill-quality-tools-2026-10-25.md)、[agent 运行时约束](./agent-controls-2026-10-25.md)。更早的背景见[运行时与扩展供应链研究](../agent-driven-delivery/agent-runtime-security-and-extension-supply-chain-2026-10-18.md)；客户端机制以本轮核验为准。
