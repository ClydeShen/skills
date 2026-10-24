# 本地 prompt evaluation

本仓库采用 Promptfoo 作为本地评估库，Node.js 24 为统一运行环境。依赖固定在 `package.json` 和 `package-lock.json`。命令采用 Node.js 和 npm，不依赖 Bash、全局安装、Docker 或云端评估服务。

2026-10-25 的选型：npm registry 当前返回 Promptfoo `0.125.0`。它适合本项目的 prompt 回归、版本对比和可替换模型端点。GitHub 页面当时显示 [Promptfoo](https://github.com/promptfoo/promptfoo) 约 26.4k stars、[DeepEval](https://github.com/confident-ai/deepeval) 约 19.1k、[Inspect AI](https://github.com/UKGovernmentBEIS/inspect_ai) 约 3.1k；这里只比较这三个项目的社区关注度，不声称是全生态使用量排行。框架选择以本地运行和评估场景匹配为主。

## 安装与运行

在云端 Linux、原生 Windows PowerShell、macOS 或 WSL 中安装 Node.js 24。进入仓库根目录后，运行：

```text
npm ci
npm test
npm run eval
```

`npm test` 检查评分逻辑和样例隔离。`npm run eval` 用合成回答运行 Promptfoo，检验 prompt 渲染、断言和结果输出；它不调用模型。首次安装需要网络，安装后基础检查不需要模型 API 或凭证。

`npm run test:transport` 另测本机 HTTP 传输，连接一次临时 loopback 测试服务，不调用真实模型。受限云端需要允许绑定本机端口；基础检查不依赖这项权限。

各系统分别执行 `npm ci`。不要在 Windows 和 WSL 间共用 `node_modules`，其中可能有平台专用依赖。`.nvmrc` 供支持它的版本管理器使用；原生 Windows 也可直接安装 Node.js 24。

本地结果位于 `evals/.local/`，每次运行生成独立 JSON 报告。缓存、设置、依赖和结果均被 Git 忽略。报告包含合成输入、模型输出、断言、prompt 哈希和运行环境；真实模型模式下应先检查报告内容再分享。

## 真实模型评估

### NVIDIA 免费试用端点

在云端或本机环境中配置 `NVIDIA_API_KEY` 后，直接运行：

```text
npm run eval:nvidia -- --case C6
```

这先运行一个案例的三种 prompt 条件。去掉 `-- --case C6` 则运行完整套件。配置在 `.env.evaluation` 也有效，不需要把密钥粘贴进聊天或提交到 Git。

2026-10-25 核读 NVIDIA 目录后，默认模型选为 `nvidia/nemotron-3.5-super-vl-120b-a12b`，使用固定的 `https://integrate.api.nvidia.com/v1`。其目录当前标为 Free Endpoint Available，支持 agentic 工作负载；API 明确支持推理模式开关和结构化回答。这是基于能力适配的首个候选，尚未实测它在本套件中优于其他模型。

默认使用 `reasoning_effort: none`、`stream: false`、4096 输出 token 上限，避免推理输出挤占短 JSON 回答。温度 1、top-p 0.95 沿用模型文档默认值；运行参数随报告保存。可用 `NVIDIA_REASONING_EFFORT=low` 或 `high` 启用推理，此时默认上限为 16384；可用 `EVAL_MAX_TOKENS` 显式覆盖。

设置 `NVIDIA_MODEL` 可换模型，例如目录同样显示免费端点可用的 `nvidia/nemotron-3.5-lightning-30b-a3b`。更换模型时不自动发送 Super 专用的推理参数；请先核对该模型参数支持，不要照搬另一模型的设置。Super 端点属于 early access，免费试用资格、限流和可用性以账号与 NVIDIA 当前服务为准。失败时不会自动切换模型或付费端点。

`npm run eval:model` 仅在没有通用端点配置、且存在 `NVIDIA_API_KEY` 时自动使用 NVIDIA。显式的 `eval:nvidia` 始终只使用 NVIDIA 固定地址和该密钥；不会把它转发给 `EVAL_API_BASE_URL`。本机环境变量和 `.env.evaluation` 的写法可在所有目标系统共用。

选型和已弃用的免费端点记录见 [NVIDIA provider 研究](../research/harness/prompt-evaluation/nvidia-hosted-provider-2026-10-25.md)。目录的 Available 不等于已用用户账号实测；密钥配置好后先运行单案例确认连接。

### 通用兼容端点

将根目录的 `.env.evaluation.example` 复制为 `.env.evaluation`。取消对应注释并配置 `EVAL_API_BASE_URL` 和 `EVAL_MODEL`；本地兼容端点可使用 `http://127.0.0.1:11434/v1`，模型名必须是端点实际提供的名称。远端端点还需显式配置 `EVAL_API_KEY`。

运行：

```text
npm run eval:model
```

端点必须支持 Chat Completions 接口。可连接本地服务，或显式配置已获授权的远端服务；远端运行会发送案例和 prompt，可能产生服务费用。未配置时命令报错，不自动使用宿主中的其他 API 凭证。本项目没有安装模型，也没有启动本地模型服务。

变量通过 `.env.evaluation` 或宿主环境读取，无需在 npm 命令中使用系统专用的变量赋值语法。已有环境变量优先。评估关闭 Promptfoo telemetry、更新检查、缓存和结果分享；报告由本地 runner 写入。

## Meta Thinking 套件

[案例](../incubator/meta-thinking/evals/cases.json)与[套件](../incubator/meta-thinking/evals/suite.mjs)归具体孵化项目维护，共享 runner 位于 `evals/`。

同一组案例比较基础助手、仅 skill 描述、完整候选及参考资料三种 prompt 条件。当前评估为每个条件增加统一的 JSON 输出约定，用规则检查建议的互动方向、记忆策略和原因确信程度，并要求给出解释和下一步。预期值和合成回答留在评分端，不进入模型输入。

当前边界：JSON 约定会影响模型输出，这不是自然对话或完整 agent 执行。规则通过只能说明这些有限检查符合预期；仍须人工查看解释和实际产物。仅描述条件也只能提供激活相关的线索，不能证明某客户端真实加载 skill。画像案例检查拟采取的策略，不执行用户目录读写。

默认的 fixture 模式把预先编写的合成回答送入评分链路，三种 prompt 条件都会收到同一合成回答。因此 fixture 分数不能用于比较 prompt 优劣，不能当作模型效果或画像功能通过。

## 增加套件

在对应 `incubator/<initiative>/evals/` 添加模块。导出 `createSuite({ mode })`，返回 Promptfoo 测试配置；fixture 模式提供无外部调用的 provider，model 模式由 runner 注入显式配置的端点。案例和领域断言放在项目目录，复用工具放在 `evals/`。

指定套件：

```text
npm run eval -- --suite incubator/meta-thinking/evals/suite.mjs
```

报告显示每个结果的 prompt、输出和判断理由。新增规则应包含会被拒绝的反例，避免把“运行成功”误当成“质量合格”。模型评估无需另外启用付费 LLM judge；如后续需要语义评分，应另行明确评分模型与成本。

## 验证状态

Linux 云端运行记录见[候选评估](../incubator/meta-thinking/evaluation.md)。[CI 配置](../.github/workflows/prompt-evaluation.yml)定义 Linux、Windows、macOS 的相同检查；本次仅在当前 Linux 环境执行，其他系统及 WSL 的实际运行尚未验证。CI 不接收模型凭证，也不运行付费评估。

选型证据与读取范围见[研究记录](../research/harness/prompt-evaluation/local-evaluation-framework-2026-10-25.md)。后续升级依赖时重新检查运行版本要求及报告结构。
