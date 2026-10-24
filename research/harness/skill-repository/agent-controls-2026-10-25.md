# Research: Codex 与 Claude 的交付约束

日期：2026-10-25。问题：skill 仓库如何用客户端配置、hooks、权限和隔离约束 delivery agent？背景：本仓库已有 AGENTS.md、CLAUDE.md 和评估命令，需要区分操作指引、即时反馈与真正的执行边界。

当前建议：[inference] 共用一套仓库检查命令，为 Codex 与 Claude 分别提供薄适配。hooks 用于早反馈与有限拦截；可写配置、不同客户端及云端执行路径会影响其有效性。需要更强限制时，采用宿主管理的权限与隔离，并将合并条件放在受保护的服务端。本文仅研究，未安装 hooks 或修改任何权限。

标记：`[official]` 为已核读官方文档相关部分，`[measured]` 为当前命令观察，`[inference]` 为本项目建议。本文不将上游支持等同于当前会话已启用。

## Overview

| 问题 | 建议 | 证据与边界 | 信心 |
| --- | --- | --- | --- |
| 指令如何共用？ | AGENTS.md 保持权威，CLAUDE.md 负责导入和准确命令入口 | 当前仓库已有导入，但存在陈旧工具说明 | 中，J1 |
| 是否能共享同一份 hook 配置？ | 共用 Node 检查程序，分别适配客户端配置与事件结果 | 两者有类似事件，控制语义和加载范围不完全一致 | 中，J2 |
| 能否限制改检查、读凭证？ | 结合文件工具规则、OS 隔离、宿主管理策略 | 文本规则与工具级 deny 不覆盖全部间接 IO | 中，J3 |
| 如何避免被 agent 自己改掉规则？ | 重要边界置于其不能改的宿主或服务端 | 项目配置可覆盖和信任机制有明确限制 | 中，J3 |

## 1. 本仓库的观察

### Evidence

[measured] 当前 `CLAUDE.md` 通过 `@AGENTS.md` 导入共享说明，但仍称仓库没有 build、lint 或 test tooling；`package.json` 已含 npm test、Promptfoo fixture 与模型入口。该声明已经与仓库不同步。

[measured] 当前环境的 `codex --version` 为 `0.163.0`。`codex --help` 包含 sandbox、approval、strict-config 和 hook-trust 选项。未发现 Claude 可执行程序，未运行真实客户端 hook。

### Recommendation for the project

[inference · J1] 实施时先修正文档漂移，并为所有检查设置稳定入口，例如未来的 `npm run check`。hook、Git hook 和 CI 调同一入口，避免维护多套规范。当前研究不改代码或说明文件。

### Relation to existing constraints

符合仓库对一个规则一个权威位置、跨平台命令和 research → knowledge → incubator 的要求。

## 2. Codex：项目默认值、规则与 hooks

### Evidence

[official] `.codex/config.toml` 是受信任项目的配置层；CLI 参数优先。管理员 `requirements.toml` 用来限制允许的选择，与普通默认配置不同。未信任项目不会加载项目配置。[S1][S4]

[official] Codex 从活跃配置层的 `rules/` 加载 `.rules`。`prefix_rule` 约束命令前缀，`forbidden`、`prompt`、`allow` 的严格程度依次降低；`allow` 可使匹配命令在沙箱外免询问执行，不能把它当成单纯的快捷命令列表。[S2]

[official] 当前 Codex 已支持 `.codex/hooks.json` 或内联 `[hooks]`，包含 PreToolUse、PostToolUse、Stop。项目与变更后的 hook 需要信任。工具覆盖存在例外，命令 hook 与云端编排也有兼容限制；官方将其定位为 guardrail，而非完整边界。[S3]

### Recommendation for the project

[inference · J2] 可以用工具前 hook 检查明显越界行为，用工具后 hook 运行改动文件的快速检查，用结束 hook 检查最终状态。三者应调用共享程序，但各自适配 JSON 输入、匹配工具名、退出状态和继续机制。不能仅靠回合结束时再检查来阻止已经发生的外部写入。

[inference] 实施前核对支持版本和信任状态；对命令失败、超时、无效 JSON、取消和反复触发分别测试。不要将“hook 被加载”当作“所有动作都会被拦”。当前 Codex 文档允许 `commandWindows` 作为 Windows 命令覆盖，可用于薄适配。[S3]

### Relation to existing constraints

当前托管云端的执行策略由宿主控制。提交 `.codex/` 文件只是提供配置，不证明当前云端、其他 app-server 或 Work Cloud 编排实际采用了它。需要在目标宿主检查生效范围。

## 3. Claude：设置文件、事件与失败策略

### Evidence

[official] `.claude/settings.json` 是可提交的项目设置；`.claude/settings.local.json` 是个人项目层。项目、用户和 managed 设置具有不同优先级。[S5]

[official] PreToolUse 可阻止未执行工具；PostToolUse 在执行后反馈；Stop 可使 agent 继续工作。当前 command hook 支持 `command` 与 `args` 的 exec 形式。多数 hook 的启动错误、超时或无效输出可能不阻止动作；`onFailure: block` 在支持版本和事件上可改变这一点，Stop 不支持该失败阻断。文档标明该字段要求 v2.1.295 或以上。[S6]

### Recommendation for the project

[inference · J2] 如首批只支持本仓库已有 Node.js 24，可采用直接调用 Node 的 exec 形式，减少 Bash/PowerShell 字符串转义差异。将输出 JSON 和事件行为写在单独的客户端适配层；共用核心检查，不直接复制 Codex hook 配置。

[inference] 结束检查应处理重复触发，避免形成永远无法结束的循环。静态检查失败时返回具体文件与修复动作；基础工具不能启动时应明确报告，不能宣称仓库验证通过。

### Relation to existing constraints

不建议在每个 PostToolUse 上运行完整模型评估。文件格式和包结构检查可做即时反馈，昂贵或有外部调用的评估保留为显式流程。

## 4. 工具规则与沙箱的范围

### Evidence

[official] Claude 的 Read/Edit deny 会覆盖其内建文件工具及部分可识别 shell IO，但不能覆盖任意 Python/Node 脚本的间接文件访问。`Write(path)` 等路径规则不是有效替代；官方要求用正确的 Read/Edit 规则，并指出 OS 隔离的作用。[S7]

[official] Claude Bash sandbox 在 macOS、Linux、WSL2 可用；原生 Windows shell 当前不受此沙箱限制。它只包围 shell 命令及子进程，文件工具、MCP 和 hooks 在外。严格模式与不可用时退出控制是否回退为非沙箱执行。[S8]

[official] Codex 文档描述了 macOS、Linux、原生 Windows 与 WSL2 的不同隔离实现。当前管理文档建议新客户端优先使用 permission profiles；管理员要求可以约束默认值及 CLI 覆盖。read-only 本身并不隐藏凭证内容。[S4][S9]

### Recommendation for the project

[inference · J3] 不声称一个项目 deny 就能保护所有读写。若要限制访问密钥、修改 harness、越出工作区或出网，应同时检查文件工具权限、shell 子进程隔离、MCP/插件，以及继承的环境变量。保护检查配置与凭证的策略应由 agent 无法编辑的宿主或 managed 层持有。

[inference] 对 Windows/macOS/WSL/云端共用 Node 检查代码，但分别验证隔离；原生 Windows 的 Claude 如需 OS 级 shell 隔离，应选择 WSL2 或明确配置的外层受限环境。容器不是自动的网络、凭证或挂载边界，需要单独设计。

### Relation to existing constraints

用户需要跨平台通用工具，不等于各平台具备相同安全实现。仓库级反馈可以共用，执行限制须适配宿主。

## 5. 建议的最小落地顺序

[inference] 第一批只需共同检查入口、准确的 agent 指引和两个可选 hook 适配；先验证快速检查与结束检查。需要限制 shell 或读写时，第二批再提供明确的 permission/sandbox presets，并测试生效与失败路径。

[inference] 若要让最终合并条件不能被 delivery agent 单方面解除，应使用必需服务端检查和代码所有者审核，并给 agent 独立、无 bypass 的受限身份。若 agent 使用 owner/admin 的绕过权限，单靠同仓库可修改的配置无法实现对它自己的可靠限制。是否启用这些仓库规则需用户另行决定。

## 判断信心

J1–J3 均为中，3.0：Owner 1（用户要求研究约束工具）、Research 1（官方机制与边界）、Reasoning 0.5（具体组合待实施）、Project history 0.5（已有指引及检查，未实测 hook）。分数不代表安全保证。

## Not verified

- 未安装或启用任何项目、用户或 managed 设置，未修改 agent 权限。
- 未实际运行 Codex/Claude hooks，也未在 Windows、macOS 或 WSL 测试。
- 未检查 GitHub 仓库实际 branch protection/ruleset、CODEOWNERS 或 token 权限；本文不声称远端目前缺少或具有这些规则。
- 本轮对官方当日文档定向阅读；Codex 本地版本已测，Claude 版本与当前宿主对新增字段的支持仍需实施时检查。
- `developers.openai.com/codex/security/` 当前重定向到 Codex Security 产品说明；本文沙箱依据来自 Agent approvals & security，而非该旧入口。

## Decisions for the owner

本轮不需要立即修改权限。实施时需选择约束强度：协作提醒与质量反馈，还是限制 agent 无法绕过的宿主/服务端边界；后者涉及凭证角色和管理员配置。

## Sources

- [S1 — Codex Config basics](https://learn.chatgpt.com/docs/config-file/config-basic)：项目层、信任与优先级。
- [S2 — Codex Rules](https://learn.chatgpt.com/docs/agent-configuration/rules)：命令前缀、严格程度与 allow 的沙箱外执行含义。
- [S3 — Codex Hooks](https://learn.chatgpt.com/docs/hooks)：配置位置、工具覆盖、信任、事件、Windows 覆盖和云端差异。
- [S4 — Codex Managed configuration](https://learn.chatgpt.com/docs/enterprise/managed-configuration)：要求与默认值、permission profiles 和云端执行范围。
- [S5 — Claude settings files](https://code.claude.com/docs/en/settings)：项目、个人与 managed 作用域。
- [S6 — Claude Hooks reference](https://code.claude.com/docs/en/hooks)：事件、exec 形式、onFailure 支持和失败语义。
- [S7 — Claude permissions](https://code.claude.com/docs/en/permissions)：路径权限语法和间接 IO 的覆盖边界。
- [S8 — Claude sandboxing](https://code.claude.com/docs/en/sandboxing)：支持平台、沙箱覆盖范围、严格模式与默认访问。
- [S9 — Codex Agent approvals & security](https://learn.chatgpt.com/docs/agent-approvals-security)：权限、沙箱配置与平台实现。
