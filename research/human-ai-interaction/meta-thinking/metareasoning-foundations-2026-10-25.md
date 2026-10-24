# Research: Meta Thinking 的计算、协作与自动化基础

日期：2026-10-25。研究问题：哪些成熟理论能帮助检验最初草稿，哪些地方需要补充机制而非继续增加概念？背景：[原始探索草稿](./meta-ai-thinking-working-draft-2026-10-25.md)。本记录是初轮定向研究，所有产品建议均为待验证假设。

当前收获：[inference] 草稿可以优先研究“下一步思考是否值得”“何时介入用户”“具体环节如何分工”。这些问题已有相关理论可借鉴，但现有来源没有验证草稿的固定层数、跨领域效果或推荐算法。

证据标记采用[研究模板](../../../knowledge/harness/templates/research-note-template.md)：[official] 表示读到一手来源相关正文；[official · summary only] 表示仅读摘要或作者概览；[inference] 表示本研究的推断。这里的证据类型不等于结论已被实验确认。

## Overview

| 问题 | 当前建议 | 证据强度与适用边界 | 判断信心 |
| --- | --- | --- | --- |
| 是否已有“选择思考方式”的基础？ | 研究 rational metareasoning，把计算当作会消耗资源的决策 | 理论关联强；本项目实现效果未验证 | 中，3.0 |
| 何时停止继续分析？ | 为候选动作记录预期改变、成本和停止条件 | 资源约束理论支持；具体阈值待实验 | 中，3.0 |
| AI 应何时主动提问或改变路线？ | 同时考虑目标不确定性、介入收益和打扰成本 | mixed-initiative 原文支持；对话适配待验证 | 中，3.0 |
| Centaur、Critic、Checkpoint 能否并列？ | 分开描述功能、分工程度、推理操作和控制权限 | 自动化模型直接支持功能与程度分开；其他维度是推断 | 中，3.0 |

以上分数按[判断规范](../../../knowledge/harness/judgment-practices.md)记录：owner 1（已授权探索），research 0.5（相关一手理论，对本项目属间接证据），reasoning 1（建议能导出可检查机制），project history 0.5（原始草稿已有方向，尚无实测），合计 3.0。它是本次研究建议的支持度记录，不是统计概率；不用于声称产品有效。

## 1. 把下一步思考视为有成本的行动

### Evidence

[official · summary only] Russell 的作者研究页将 rational metareasoning 描述为：按计算对下一次现实决策质量的预期改善来选择计算步骤。该页同时指出，精确的元层决策可能比原任务更难计算。这里只核验了作者概览，1991 年论文全文未读到。[S1]

### Recommendation for the project

[inference] 原稿的“先选思考方式”可以转成一个可研究的问题：当前有哪些候选动作，它们各自可能改变什么判断？例如查证一个关键事实、寻找一个反例、生成另一种 framing、直接做一个可逆试验，都可以进入比较。

[inference] 每个候选动作先记录以下字段，再观察实际效果：

| 字段 | 要回答的问题 |
| --- | --- |
| 当前决策 | 接下来到底要决定什么？ |
| 关键不确定性 | 哪个未知会改变选择？ |
| 候选动作 | 查询、澄清、反驳、模拟或试验中的哪一步？ |
| 预期改变 | 得到何种结果时会换方案？ |
| 成本 | 需要多少时间、计算和用户注意力？ |
| 停止条件 | 什么结果足以采取下一步？ |

[inference] 这给“哲学映射”增加了检验方式：如果引用某个原则没有改变候选动作、信息需求或停止条件，暂时不能把它算作框架带来的收益。

### Relation to existing constraints

对应原稿 FR-02、FR-03、FR-06 和 Avoid philosophy decoration。保留向上与向下移动，但不把经过所有抽象层作为必要步骤。该建议不定义新层级。

## 2. 控制元思考自己的成本

### Evidence

[official] Lieder 与 Griffiths 的 resource-rational analysis 将目标、环境与有限认知资源结合，用来研究可执行的认知机制。所读部分是论文引言及资源约束论述；它提出的是认知建模框架，不能据此声称任意一次 AI 推理都已实现最优资源分配。[S2]

### Recommendation for the project

[inference] 需要同时测量两种失败：该深入时过早行动，以及简单问题被过度分析。可先用人工标注的小样本比较，避免先实现复杂的最优路由器。

[inference] 候选停止规则可以是：关键约束已满足、下一个查询不太可能改变选择、分析预算用尽、或者有一个更便宜且可逆的现实试验。规则优劣仍需实测，不能由理论名称决定。

[inference] 应把“选择模式的开销”计入总耗时。若输出改善很小但多消耗大量用户注意力，即使解释更丰富，也可能是不合适的策略。

### Relation to existing constraints

对应原稿中“简单问题仍可以直接回答”和 analysis paralysis 开放问题。建议为 Mode check 增加预算与退出条件，而不是要求所有问题先做深层抽象。

## 3. 主动介入需要考虑打扰与纠错

### Evidence

[official] Horvitz 在 mixed-initiative UI 论文原则部分讨论用户目标的不确定性、介入时机、成本收益与澄清对话；同时要求用户能有效启动和终止服务，并让系统在不确定时降低介入精度。研究实例是 LookOut 日程辅助系统。[S3]

### Recommendation for the project

[inference] “AI 主动推荐模式”应成为可修正的建议。研究时可以比较：直接继续、先问一个有决策影响的问题、提出可跳过的替代路线。不要把每次不确定都转化为一个用户问题。

[inference] 对提问的价值，可以观察用户答案是否实际改变下一步；对主动重构问题的价值，可以观察用户是否接受重构，以及后续返工是否减少。还应记录用户跳过、纠正或终止介入的行为。

[inference] 这提示一个容易遗漏的 unknown unknown：框架可能误判用户的任务。用户希望快速得到可用草稿时，系统可能以为用户希望进行严密决策；两者的“更好”并不相同。

### Relation to existing constraints

对应 Mixed-Initiative、Socratic、Human Checkpoint 候选，以及“由 AI 推荐还是用户选择”的开放问题。论文为介入机制提供参考，没有验证本草稿的模式菜单或 2–5 条推荐路径。

## 4. 分工方式与推理方式需要分别描述

### Evidence

[official · summary only] Parasuraman、Sheridan 与 Wickens 的论文摘要区分信息获取、信息分析、决策与动作选择、动作实施四类功能；每类功能可采用不同自动化程度。摘要强调自动化会改变人的活动和协调需求。本次仅读摘要。[S4]

### Recommendation for the project

[inference] 原稿 L4 的候选可以先用具体组合检验：AI 收集证据，人与 AI 共同批判方案，人决定，AI 执行。这里 Critic 可与 Centaur 分工、Human Checkpoint 同时出现，互斥的单选分类会丢失信息。

[inference] 用以下候选维度描述实例，比立即决定每个词的唯一层级更便于比较。这些维度是本研究的工作假设，尚未进入共享术语表。

| 候选维度 | 示例问题 |
| --- | --- |
| 工作功能 | 当前在收集、分析、决策还是执行？ |
| 人与 AI 分工 | 谁提出、谁核验、谁完成？ |
| 推理操作 | 在扩展选项、质疑假设还是检验证据？ |
| 控制权限 | 谁能决定、暂停、修改或撤销？ |

### Relation to existing constraints

直接关联 FR-07 和 Separate concept type from abstraction level。相关证据支持把不同问题拆开描述，并不证明知识图谱一定优于树，也不证明上述四个维度已经充分。

## 下一轮可做的检验

[inference] 从真实任务选取低风险创作、约束设计、证据判断、学习四类案例。每类比较直接回答、固定反思流程、按任务信号选择下一步三种条件。预先定义质量标准，尽量在不知道生成条件时评判；同时记录时间、成本、用户负担和可追溯的错误。

[inference] 特别记录策略改变的因果链：看到了什么信号，改变了什么动作，获得了什么新证据，是否改变最终判断。如果只能增加理论解释却无法指出实际差异，框架收益仍未得到支持。

## Not verified

- Russell 与 Wefald 1991 年论文全文未读取；出版商页面访问失败。相关判断限于作者研究概览。
- Resource-rational analysis 仅定向阅读相关段落，没有全面审查全文、评论和后续实证。
- Parasuraman 等人的论文只读摘要，未核验完整等级表与适用细节。
- 尚未证明思考模式推荐优于基础模型的默认行为。
- 尚未证明不同领域可以共享同一套触发规则，也未确定预算、停止阈值和用户负担指标。
- 原稿的固定层数、认知操作最小集、知识图谱选型和 unknown unknowns 发现率未得到验证。

## Decisions for the owner

本轮无须作产品或架构决定。若进入实验，需要确定首批真实任务及其主要目标：完成质量、学习收益或时间成本。此处仅记录后续选择，不阻塞当前研究。

## Sources

以下来源均于 2026-10-25 打开；摘要与全文的阅读范围已在正文说明。

- [S1 — Stuart Russell: Foundations, Rationality and Intelligence](https://aima.cs.berkeley.edu/~russell/research-bo.html)：作者对 rational metareasoning、元层计算复杂性和 bounded optimality 的说明。
- [S2 — Lieder 与 Griffiths: Resource-rational analysis](https://cocosci.princeton.edu/papers/liederresource.pdf)：作者实验室提供的论文，定向阅读资源约束与认知策略建模部分。
- [S3 — Horvitz: Principles of Mixed-Initiative User Interfaces](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/11/chi99horvitz.pdf)：微软研究院提供的论文全文，阅读 mixed-initiative 原则和 LookOut 场景。
- [S4 — Parasuraman、Sheridan 与 Wickens: A model for types and levels of human interaction with automation](https://pubmed.ncbi.nlm.nih.gov/11760769/)：论文摘要，提供自动化功能与程度的区分。
