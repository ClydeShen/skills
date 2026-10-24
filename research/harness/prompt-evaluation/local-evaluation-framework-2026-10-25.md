# Research: 跨平台本地 Prompt Evaluation 框架

日期：2026-10-25。问题：如何给仓库配置适用于托管 Linux 云端、原生 Windows、macOS 和 WSL 的 prompt 测试工具？背景：Meta Thinking 候选已有案例，需要可重复运行的评估入口。

当前建议：[inference] 使用项目内锁定版本的 promptfoo，通过 Node.js 入口统一运行。将不调用模型的基础设施检查与真实模型评估分开；前者验证配置、模板和断言链路，不能证明 skill 的语义效果。

标记：`[official]` 表示核读一手文档或源码；`[measured]` 表示实际命令结果；`[inference]` 表示项目建议。本记录未在 Windows 或 macOS 上运行程序。

## Overview

| 问题 | 建议 | 证据强度 | 信心 |
| --- | --- | --- | --- |
| 是否适合跨平台？ | 用 Node.js 24 与 npm 项目依赖 | 强：官方安装说明与上游三平台 CI；本项目各平台实测待补 | 中，J1 |
| 是否需要托管服务？ | 使用本地 SDK、文件结果和可替换 provider | 强：官方 SDK、自定义 provider 文档 | 中，J2 |
| 如何默认不调用付费模型？ | 使用明确标记的本地 fixture/smoke provider；真实模型另设入口 | 强：provider 可自定义；具体分层属推断 | 中，J3 |
| 如何避免把假数据通过当作 skill 有效？ | 分开报告链路检查、真实输出与人工评价 | 方法建议，暂无项目效果证据 | 中，J3 |

## 1. 运行时与平台边界

### Evidence

[official] 官方安装文档要求 Node.js `>=22.22.0`，推荐 Node.js 24 LTS；提供 npm/npx 安装方式及 Windows 数据目录说明。[S1]

[measured] 2026-10-25 在当前环境运行 `npm view promptfoo version engines --json`，registry 返回版本 `0.125.0`、Node.js 要求 `>=22.22.0`。版本选择仍应由项目锁文件固定。

[official] 上游 CI 包含 Linux、macOS、Windows 的测试与包消费检查；其缓存按 OS、Node 版本区分。源码 package.json 当前含 `@libsql/client`，不能照搬旧版本依赖说明。[S2][S3]

### Recommendation for the project

[inference · J1] 用 Node.js 脚本完成环境读取、路径解析和子进程调用。npm scripts 只调用该脚本，避免 Bash 环境变量语法、`cp`、`rm`、`grep` 和平台相关命令成为运行前提。云端可将日志、缓存和结果指定到可写目录。

[inference] 在每个目标系统重新执行 `npm ci`；不共享 Windows、WSL、macOS 的 `node_modules`。上游测试范围说明该方案有跨平台依据，仍需本仓库自己的平台运行证据。

### Relation to existing constraints

框架与候选 skill 的运行时包分开。工具依赖由项目维护，正式 skill 包不必携带整个评估工具链。

## 2. 本地 SDK、provider 与结果控制

### Evidence

[official] Node SDK 的 `evaluate()` 返回 Eval record，再调用 `toEvaluateSummary()` 取得结果。源码说明 suite 的 `writeLatestResults` 控制持久化，options 的 `cache` 控制调用缓存。[S4][S5]

[official] JavaScript 自定义 provider 至少实现 `id()` 与 `callApi()`，支持 `.mjs`。因此可以用固定输入输出做链路检查，也可以接自定义接口。[S6]

[official] 遥测和版本检查分别可由 `PROMPTFOO_DISABLE_TELEMETRY=1`、`PROMPTFOO_DISABLE_UPDATE=1` 关闭；默认数据目录、配置目录及缓存位置可配置。[S1][S7]

### Recommendation for the project

[inference · J2] 在导入 SDK 前设置需要的环境选项。基础检查使用不出网的 provider，关闭不需要的缓存与共享；结果写入项目忽略的本地目录。真实模型调用通过显式入口启动，凭证不进入案例或提交文件。

[inference] 当前源码与文档没有提供足够依据采用旧示例里的 `options.write: false`。以实际安装版本 API 为准，显式配置 `writeLatestResults`，并验证真实产生的文件。共享、缓存与结果持久化是不同开关。

### Relation to existing constraints

当前云端的 home 目录可能只读。本地结果目录可写比假定全局 `~/.promptfoo` 可写更稳妥；具体目录由实施配置决定。

## 3. 模型入口与评估含义

### Evidence

[official] promptfoo 提供 Ollama provider，并支持 `OLLAMA_BASE_URL`；文档讨论了 `localhost` 的 IPv4/IPv6 差异。[S8]

[official] OpenAI-compatible provider 支持 `apiBaseUrl` 与自定义凭证变量；不需认证的本地端点可使用相应配置。模型评分断言的 grader 需要单独配置。[S9]

[official] 断言包括字符串、JSON、JavaScript 自定义检查及模型评分；部分断言会调用另一个模型或服务。[S10]

### Recommendation for the project

[inference · J3] 默认采用确定性断言，不默认引入 LLM judge。基础检查应证明正例通过、负例失败，以及错误会产生非零退出状态。固定 fixture 不参与真实模型效果统计。

[inference] 真实评估可以连接本地 Ollama、兼容端点或用户指定模型。这里的“本地框架”指 runner 在本地运行；远程 provider 仍会接收 prompt。云端的 `localhost` 指云端机器，不等于用户的 Windows/macOS 主机。

[inference] 结构化回答可降低自动检查难度，但对输出格式的约束会影响被测行为。需要保留输出和案例依据，辅以人工判断；prompt 层评估不能证明宿主真的进行了文件写入、自然激活或跨会话取回。

### Relation to existing constraints

Meta Thinking 的低频触发与轻量干预可以先用案例测试。画像写入、权限降级和真实 agent 工具使用需要后续宿主集成测试。

## 判断信心

J1–J3 的支持度均为中，3.0：Owner 1（用户明确要求跨平台本地框架）、Research 1（一手 API 和平台来源）、Reasoning 0.5（架构选择属推断）、Project history 0.5（已有案例，尚无完整试用）。分数不是跨平台成功概率。

## Not verified

- 未在 Windows、macOS 或 WSL 上实际安装或运行本仓库套件。
- 未验证用户机器上是否已有本地模型、足够资源或可用凭证。
- 未评估 skill 的长期收益；不将 fixture 或输出结构检查的成功视为行为效果。
- 当前核读上游 main 与当日文档，未逐项比对发布包实现。实施时应以锁定版本及实际执行结果校验。

## Decisions for the owner

本轮无需立即选择模型或购买服务。默认不调用付费模型；真实模型入口保留为显式配置。

## Sources

- [S1 — Installation](https://www.promptfoo.dev/docs/installation/)：运行时要求、安装、目录控制与 Windows 路径。
- [S2 — 上游 CI](https://raw.githubusercontent.com/promptfoo/promptfoo/main/.github/workflows/main.yml)：核读平台矩阵与包消费测试。
- [S3 — package.json](https://raw.githubusercontent.com/promptfoo/promptfoo/main/package.json)：核读 engine、导出入口与依赖。
- [S4 — Using the node package](https://www.promptfoo.dev/docs/usage/node-package/)：核读 evaluate、provider 与断言函数用法。
- [S5 — Node evaluate 源码](https://raw.githubusercontent.com/promptfoo/promptfoo/main/src/node/evaluate.ts)：核读参数与结果说明。
- [S6 — JavaScript provider](https://www.promptfoo.dev/docs/providers/custom-api/)：核读最小接口及模块格式。
- [S7 — Telemetry](https://www.promptfoo.dev/docs/configuration/telemetry/)：核读遥测与更新检查开关。
- [S8 — Ollama provider](https://www.promptfoo.dev/docs/providers/ollama/)：核读本地连接及主机地址边界。
- [S9 — OpenAI provider](https://www.promptfoo.dev/docs/providers/openai/)：仅核读兼容端点、认证及 grader 配置，不引用模型价格或生命周期。
- [S10 — Assertions](https://www.promptfoo.dev/docs/configuration/expected-outputs/)：核读断言类型及需要 provider 的指标。
