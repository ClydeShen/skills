# Research: 抽象、批评与人机协作的证据边界

日期：2026-10-25。问题：原始草稿的哪些机制已有证据，哪些需要优先验证？背景：为 Meta Thinking 的后续探索寻找可检验方向。

当前结论：[inference] 优先研究“何时切换、凭什么验证、何时停止”。抽象和批评都有条件性的实验支持，但增加步骤或加入人类并不自动改善结果。本文建议均为研究假设，尚未采纳为架构或规则。

证据标记：`[official]` 表示读到论文相关正文；`[official · summary only]` 表示仅读到作者摘要；`[inference]` 表示本项目推断。这里的 official 表示来源归属，不表示结论无争议。未运行论文代码或复现实验。

## Overview

| 问题 | 建议 | 证据强度与边界 | 判断信心 |
| --- | --- | --- | --- |
| 向上抽象是否有用？ | 试验一步相关抽象，再回到原问题 | 中：特定模型、任务有实验支持 | 中，见 J1 |
| Critic 是否等于验证？ | 区分生成批评、核验批评、修正答案 | 中：存在负面与正面条件结果 | 中，见 J2 |
| 人机协作是否天然更好？ | 同时保留人工、AI 和协作基线 | 中：跨实验综合证据，适用范围有限 | 中，见 J3 |
| 怎样证明框架有用？ | 同预算比较策略选择与固定流程 | 弱：本项目尚无实验 | 中，见 J4 |

## 1. 向上抽象：有邻近证据，但不能推出完整层级

### Evidence

[official] Step-Back Prompting 将过程分为提出更高层的问题、依据相关概念解决原问题。在物理、化学和知识问答等任务上有改善；论文也记录了新增错误，以及原理错误、上下文丢失等失败类型。已读方法、结果和错误分析部分。[S1]

### Recommendation for the project

[inference · J1] 草稿的 reason upward / downward 可以先作为一个局部可测操作：从具体问题提取一个有用原则，再检查答案是否仍满足原始约束。该实验不要求先确定 Level 1–6，也不能据此断言需要回溯到哲学基础。

### Relation to existing constraints

对应原稿 FR-02、FR-03 和“避免哲学装饰”。保留原稿，不将邻近研究写成整个框架已获验证。

## 2. 批评与验证：反馈机制决定了实验含义

### Evidence

[official] Huang 等研究无外部反馈的 intrinsic self-correction，在所测推理任务中发现它可能无效或降低表现，并强调应与同等推理成本的基线比较。已读定义、引言及对基线问题的讨论。[S2]

[official] CRITIC 使用搜索、执行等工具反馈来核验并修正输出，在作者所测问答、数学程序生成等任务中改善表现。已读方法、反馈流程和实验概述。[S3]

[official · summary only] ProCo 报告通过遮蔽题目关键条件、反向预测条件来校验答案，在所测任务中能改善无外部反馈的纠错。这里只读作者摘要，未检查其全部实验。[S4]

### Recommendation for the project

[inference · J2] 不把“切到 Critic”当作正确性保证。记录它产生了什么可核验的反例、用了什么反馈，以及修正后是否通过核验。也不采用“无外部反馈永远无效”的绝对规则；ProCo 提供了需要继续查证的条件性反例。

[inference] 可以分别测试普通自我批评、结构化条件校验、外部工具核验。三者不应合并成同一个验证标签。

### Relation to existing constraints

对应 FR-06 及 Verification-first 候选。论文讨论的是当时所测模型和任务，不能直接充当 2026 年模型的能力评测。

## 3. 人参与是否增加价值：需要明确比较对象

### Evidence

[official] Vaccaro 等综合 106 个实验，区分“超过人类单独表现”和“超过人类、AI 中较强一方”。样本内平均存在前者，未达后者；创作任务相对决策任务更有利，但创作组相对零的协同增益并不显著。已读结果、方法和限制。研究纳入窗口截止 2023-06-30。[S5]

### Recommendation for the project

[inference · J3] Human Checkpoint、Centaur 和 Cyborg 应描述各自在哪个子任务增加什么价值，并测量参与成本。人工确认可以承载授权或偏好表达；若声称能发现错误，则需要单独验证其检错效果。

### Relation to existing constraints

对应原稿对 L4 概念异质性的疑问。该证据不支持把某种分工方式宣布为通用最优，也不支持“人越少越好”。

## 4. 下一轮最有价值的验证

### Evidence

[inference] 以上来源尚不能证明原稿的跨领域框架有效，也没有直接证明可稳定发现 unknown unknowns。

### Recommendation for the project

[inference · J4] 先制作小型对照案例集，再扩充概念目录。以下为候选实验，尚未执行：

| 案例 | 比较方式 | 观察什么 |
| --- | --- | --- |
| 目标已清楚的简单任务 | 直接执行 vs 框架 | 是否增加无用提问和耗时 |
| 有隐藏约束的选择问题 | 直接回答 vs 主动探查 | 发现约束是否改变最终选择 |
| 方案反复修改仍失败 | 继续迭代 vs 重定义问题 | 是否识别错误目标或关键假设 |
| 有标准答案的推理任务 | 自我批评 vs 条件校验 vs 工具核验 | 修复错误和引入新错误的比例 |
| 开放式创作 | 快速迭代 vs 先抽象 | 盲评质量、用户投入和完成时间 |

[inference] 对每个案例预先记录可发现的隐藏因素及其影响，区分有证据的发现、合理待查问题和无依据猜测。受控隐藏因素只能检验局部发现能力，不能证明覆盖真实世界所有 unknown unknowns。

[inference] 至少比较直接回答、固定流程、自适应选择；控制模型、工具和总预算，另报用户时间。若与人机协作效果有关，再加入人工与 AI 单独基线。成功标准是结果或决策改善，以及成本可接受，不以步骤数量或解释篇幅评分。

### Relation to existing constraints

对应原稿 Success Criteria 和“简单问题不应过度复杂化”。评估设计属于研究建议，暂存本目录。

## 判断信心

以下分数衡量建议与当前项目证据的匹配程度，不是统计概率。顺序为 Owner / Research / Reasoning / Project history，每项 0–1。

| 判断 | 四维分数 | 合计与等级 | 主要限制 |
| --- | --- | --- | --- |
| J1 局部验证抽象操作 | 0.5 / 0.5 / 1 / 0.5 | 2.5，中 | 尚无项目内测试 |
| J2 区分批评和核验机制 | 0.5 / 1 / 1 / 0.5 | 3，中 | 模型与任务迁移未验证 |
| J3 保留不同协作基线 | 0.5 / 1 / 1 / 0.5 | 3，中 | 历史样本不能代表当前系统 |
| J4 先建立对照案例集 | 0.5 / 0.5 / 1 / 0.5 | 2.5，中 | 具体案例及预算未选定 |

## Not verified

- 未复现任何论文结果；未对当前模型进行评测。
- 未系统检索至 2026-10-25 的全部研究，本记录是初步定向调查。
- 未证明完整层级、图结构或 Meta Reasoning Router 的必要性和有效性。
- ProCo 只核读摘要；其方法强度与比较公平性需进一步核读正文。
- Nature 与 PMC 全文入口分别出现跳转限制和验证码，S5 改读作者 arXiv v2 正文。

## Decisions for the owner

本轮无必须立即决定的事项。下一轮案例选择需考虑主要目标更偏向任务质量、用户学习，还是节省投入；这属于产品取舍。

## Sources

- [S1: Take a Step Back，ICLR 2024 正文](https://proceedings.iclr.cc/paper_files/paper/2024/file/592da1445a51e54a3987958b5831948f-Paper-Conference.pdf)：抽象操作、实验和失败类型。
- [S2: Large Language Models Cannot Self-Correct Reasoning Yet，ICLR 2024 正文](https://proceedings.iclr.cc/paper_files/paper/2024/file/8b4add8b0aa8749d80a34ca5d941c355-Paper-Conference.pdf)：无外部反馈纠错的负面结果与比较条件。
- [S3: CRITIC，ICLR 2024 正文](https://proceedings.iclr.cc/paper_files/paper/2024/file/fef126561bbf9d4467dbb8d27334b8fe-Paper-Conference.pdf)：基于工具反馈的核验与修正。
- [S4: ProCo，EMNLP 2024 论文摘要](https://aclanthology.org/2024.emnlp-main.714/)：结构化条件校验的正面报告，仅读摘要。
- [S5: When Are Combinations of Humans and AI Useful?，作者 arXiv v2 正文](https://arxiv.org/html/2405.06087v2)：协作评价基线、异质性和研究范围限制。

起点：[原始探索草稿](./meta-ai-thinking-working-draft-2026-10-25.md)。
