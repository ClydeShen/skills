# Research: NVIDIA 托管评估模型入口

日期：2026-10-25。问题：在用户自行配置 `NVIDIA_API_KEY` 后，哪个 NVIDIA hosted endpoint 适合作为 prompt evaluation 的可覆盖默认值？背景：本地评估 runner 需要一个真实模型入口，兼容云端、Windows、macOS 与 WSL。

当前建议：[inference] 默认候选使用 `nvidia/nemotron-3.5-super-vl-120b-a12b`，保留模型覆盖入口。理由是当日目录标记免费 endpoint 可用，且托管 API 明确文档化关闭 reasoning 与 JSON schema；尚无本仓库的模型效果或延迟实测，不能称为普遍最优或保证长期稳定。

标记：`[official]` 表示已读 NVIDIA 官方目录、接口或条款；`[inference]` 表示配置建议。本轮未使用 API key、未发起真实推理请求。

## Overview

| 问题 | 建议 | 证据及边界 | 信心 |
| --- | --- | --- | --- |
| 默认模型 | Nemotron 3.5 Super VL，可覆盖 | 目录可用与接口文档支持；尚无服务实测 | 中，J1 |
| 关闭思考、简短 JSON | `reasoning_effort: none`、有限输出预算 | POST schema 明确支持；遵循实际 endpoint 行为 | 中，J2 |
| 是否保证永久免费？ | 按受限试用服务处理 | 官方条款允许限制与终止，具体账户额度未知 | 高，J3 |
| 是否能继续用旧推荐？ | 先检查目录当前可用性 | Qwen3.5-397B、Nemotron3 Super 当前免费端点已弃用 | 中，J4 |

## 1. 按当日目录选择模型

### Evidence

[official] `nvidia/nemotron-3.5-super-vl-120b-a12b` 的 Build 页面显示 Free Endpoint Available，提供 `NVIDIA_API_KEY` 和 `https://integrate.api.nvidia.com/v1` 的调用示例。页面同时将其称为 early-access。[S1]

[official] `nvidia/nemotron-3.5-lightning-30b-a3b` 的页面也显示 Free Endpoint Available；模型卡将其定位为 agentic 工作负载，推荐采样为 temperature 1.0、top_p 0.95。[S3][S4]

[official] `qwen/qwen3.5-397b-a17b` 与 `nvidia/nemotron-3-super-120b-a12b` 的页面均显示 Free Endpoint Deprecated。Kimi K2.5 页面重定向至 K2.6；Kimi K3 与 DeepSeek V4 Pro0813 页面也显示免费端点弃用。不能仅靠模型名称或旧例子选型。[S5–S9]

### Recommendation for the project

[inference · J1/J4] 将 Super 3.5 作为有明确接口依据的默认候选，将模型 ID 保留为显式可配置值。Lightning 可作为后续效率比较候选，不声称其较小参数必然带来更快托管延迟。发生 404、权限拒绝或配额限制时，给出可操作错误，不静默切换模型。

### Relation to existing constraints

跨平台只需要 runner 能访问 hosted HTTPS API，无需本地 NVIDIA GPU。模型目录可用性与用户账号实际权限是两回事。

## 2. 参数与结构化输出

### Evidence

[official] Super 3.5 的托管 POST schema 指定端点 `https://integrate.api.nvidia.com/v1/chat/completions`，默认模型 ID 与目录一致；`reasoning_effort` 支持 `none`、`low`、`high`，其中 `none` 禁用 reasoning tokens；`response_format` 支持 JSON schema，`stream` 可设 false。[S2]

[official] 模型卡也说明通过 chat template 的 `enable_thinking` 控制推理，并推荐文本采样 temperature 1.0、top_p 0.95。目录 snippet 默认开启推理，但不要求所有评估都开启。[S10]

### Recommendation for the project

[inference · J2] NVIDIA preset 可以采用官方文档字段 `reasoning_effort: none`、非流式输出和明确预算。输出 schema 应描述实际评估需要的结构。先以 JSON 解析及断言检查结果，不假定模型输出永远符合格式。

[inference] 对其他模型的覆盖不要无条件继承这些专属参数。仅设置模型 ID 不能证明同一个 reasoning 字段或 JSON schema 机制也适用。需要明确 preset 的适用模型，或允许用户配置参数。

### Relation to existing constraints

框架应读取 `NVIDIA_API_KEY`，避免要求用户将同一凭证复制到其他名称。云端和本地 shell 的设置方式可不同；runner 统一从进程环境读取。

## 3. 试用与验证边界

### Evidence

[official] NVIDIA API Trial Terms 将服务限定为受限制的试用、内部测试与评估。限制可能涉及时间、调用次数或 credits；预发布服务可能变更或终止。条款未向本项目提供一个固定、保证的免费配额。[S11]

### Recommendation for the project

[inference · J3] 文档使用“当前目录提供的免费试用端点”，保留账号配额与访问状态的限制。测试采用合成案例，不自动读取并上传真实用户画像。真实结果应注明模型 ID、参数及运行日期，不能与 fixture smoke 的结果混为一谈。

### Relation to existing constraints

连接能力、模型语义效果与长期可用性应分别报告。本轮研究不代替带凭证的小规模连通与案例实测。

## 判断信心

J1、J2、J4 为中，3.0：Owner 1、Research 1、Reasoning 0.5、Project history 0.5。J3 为高，3.5：Owner 1、Research 1、Reasoning 1、Project history 0.5。分数记录建议支持度，不是模型可靠性概率。

## Not verified

- 未调用真实 NVIDIA endpoint，未验证账号权限、配额、延迟或案例通过率。
- 未证明 Super 3.5 比其他可用模型更适合本仓库；这是基于当前可用性和接口文档的初始选择。
- 未验证其他模型的关闭推理参数或 JSON schema 支持。
- API 目录会变化，后续修改默认模型前应重新检查。

## Decisions for the owner

本轮无必须决定的事项。用户配置 key 后，可显式运行少量合成案例；不要求购买服务。

## Sources

- [S1 — Super 3.5 Build 页面](https://build.nvidia.com/nvidia/nemotron-3.5-super-vl-120b-a12b)：当前可用性、model ID、API base 与 early-access 状态。
- [S2 — Super 3.5 POST schema](https://docs.api.nvidia.com/nim/reference/nvidia-nemotron-3_5-super-vl-120b-a12b-infer)：托管端点、reasoning_effort、response_format 和 stream。
- [S3 — Lightning 3.5 Build 页面](https://build.nvidia.com/nvidia/nemotron-3.5-lightning-30b-a3b)：当前 Free Endpoint Available。
- [S4 — Lightning 3.5 模型卡](https://docs.api.nvidia.com/nim/reference/nvidia-nemotron-3-5-lightning-30b-a3b)：任务定位和采样推荐。
- [S5 — Qwen3.5-397B Build 页面](https://build.nvidia.com/qwen/qwen3.5-397b-a17b)：免费端点弃用。
- [S6 — Nemotron3 Super Build 页面](https://build.nvidia.com/nvidia/nemotron-3-super-120b-a12b)：免费端点弃用。
- [S7 — Kimi K2.5 旧入口](https://build.nvidia.com/moonshotai/kimi-k2.5)：当日重定向至 K2.6。
- [S8 — Kimi K3 Build 页面](https://build.nvidia.com/moonshotai/kimi-k3)：免费端点弃用。
- [S9 — DeepSeek V4 Pro 入口](https://build.nvidia.com/deepseek-ai/deepseek-v4-pro)：重定向至 Pro0813，免费端点弃用。
- [S10 — Super 3.5 模型卡](https://docs.api.nvidia.com/nim/reference/nvidia-nemotron-3_5-super-vl-120b-a12b)：推理配置与采样推荐。
- [S11 — NVIDIA API Trial Terms](https://assets.ngc.nvidia.com/products/api-catalog/legal/NVIDIA%20API%20Trial%20Terms%20of%20Service.pdf)：定向核读试用、使用限制和预发布条款。
