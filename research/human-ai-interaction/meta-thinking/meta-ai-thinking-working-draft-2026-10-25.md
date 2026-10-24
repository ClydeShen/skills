# Meta Thinking for Human-AI Interaction — 原始探索草稿

归档日期：2026-10-25。原始撰写日期：未提供。

来源：用户提供的 `meta_ai_thinking_prd_working_draft-2.docx`。

状态：原始探索材料，尚未进行外部来源核验。正文中的判断、理论映射和层级结构均保留原稿表述，不代表仓库已采纳的结论或规范。本次仅转换格式，后续研究与修订应明确引用本稿。

---

Meta Thinking for Human-AI Interaction

PRD-style Working Draft / 需求与概念审视

Status: Exploration Draft - not a final taxonomy

> 文档定位: 这不是要快速定义一套固定的 Level 1-6，而是把当前需求、假设、开放问题和可能的结构记录下来，方便后续继续发散、挑战和验证。

## 1. Background / 背景

当前很多人与 AI 的互动默认采用 vibe anything 模式：提出一个目标，让 AI 生成内容，再根据感觉不断修改。这种方式在低风险、探索型任务中很有效，但它容易让人跳过一个更重要的问题：在回答之前，我们应该采用什么思考方式？

本项目希望建立一套 meta thinking framework。它不是 prompt library，也不是固定工作流，而是一种帮助人和 AI 先选择思考方式、再解决问题的框架。

## 2. Problem Statement / 要解决的问题

- 用户通常只会问自己已经知道要问的问题，难以发现 unknown unknowns。

- AI 很容易顺着用户的 framing 给答案，而不是先判断 framing 是否合理。

- 不同 interaction concepts 被混在一起，例如 Vibe、Centaur、Socratic、Critic、Delegation，它们可能根本不是同一种类型。

- 很多经典哲学、思想、算法和系统理论已经提供了成熟的思考原则，但它们尚未被系统映射到 Human-AI interaction。

- 现有 prompt engineering 更关注“怎么问”，而不是“为什么采用这种思考方式，以及还有哪些方式可选”。

- 如果没有显式选择 reasoning strategy，vibe 很容易成为默认模式，而不是一个有意识选择的模式。

## 3. Product Vision / 愿景

建立一个可以跨领域使用的 Human-AI Meta Thinking Framework。无论问题是架构设计、投资、管理、学习，还是做一道菜，用户都可以先识别问题的深层结构和可用思维原则，再选择合适的 AI interaction pattern，最后下沉到具体方法和 prompt。

Question -> Reason upward -> Select principles -> Reason downward -> Methods -> Interaction

## 4. Core User Intent / 核心需求理解

用户真正想要的不是一个静态知识树，而是一种可执行的 meta 思维。理想情况下，当一个问题出现时，不立即进入生成答案，而是先进行一次“思维模式选择”。

1. 从当前问题出发，先识别是否存在更合适的 interaction pattern，而不是默认使用 vibe。

1. 向上 reasoning，寻找这个问题背后的问题结构、通用思维原则、经典思想或哲学基础。

1. 在更高层重新审视 framing、assumptions 和可能遗漏的视角。

1. 再向下 reasoning，选择具体 method、technique、tool 和 prompt。

1. 执行后观察反馈，并允许重新上浮到更高层重新思考，而不是只在底层不断修改。

> 关键点: 这里的 reasoning 不是单向 top-down，也不是简单 bottom-up，而更像在不同抽象层之间上下移动。

## 5. Working Level Model / 当前层级假设

下面的 Level 结构只是工作假设。它的作用是帮助讨论，而不是提前宣布 taxonomy 已经确定。

| Level | 暂定含义 | 典型内容 | 当前信心 |
| --- | --- | --- | --- |
| L1 | Worldview / Philosophy / Foundational thought | Epistemology, Pragmatism, Holism, Reductionism, Dialectics, Stoicism, Systems philosophy | 中 |
| L2 | General thinking principles / reusable mental models | First Principles, Occam's Razor, Bayesian Updating, Emergence, Feedback Loop, Second-order Thinking | 低到中 |
| L3 | Problem structure / abstract problem class | Decision under uncertainty, Search, Constraint satisfaction, Coordination, Causal inference, Principal-agent problem | 低 |
| L4 | AI reasoning / interaction pattern | Unknown Discovery, Socratic, Critic, Simulation, Verification-first, Cyborg, Centaur, Mixed Initiative, Vibe | 中 |
| L5 | Method / technique | Premortem, Red Team, Blind Spot Scan, Assumption Inventory, What-if Analysis, 5 Whys | 中 |
| L6 | Concrete interaction / action | 具体 prompt、tool call、workflow step、approval gate、checklist | 高 |

> 重要保留: L2 和 L3 的边界目前最不稳定。First Principles、Goodhart's Law、Prisoner's Dilemma、Bayesian Updating、Dunning-Kruger 等常被统称为 mental models，但它们实际可能属于不同类型，不能为了树形结构强行放在同一层。

## 6. Examples / 示例映射

### 6.1 First Principles

当前判断：更像一个跨领域的 reasoning principle，可能位于 L2，而不是具体 method。它描述“如何思考”，但不会直接告诉用户具体下一句话怎么问 AI。

- 可能上层来源：Aristotelian first principles、rational inquiry、reductionist reasoning。

- 可能下层 interaction：Challenge assumptions、Reframe、Progressive decomposition。

- 可能 L5 method：Fact vs convention、Assumption decomposition、5 Whys、reconstruction。

- 可能 L6 prompt：先不要给方案，把当前方案里的事实、约束、惯例和假设分开。

### 6.2 “整体大于局部之和”

这个表达本身可能跨层。Holism 可以是 L1 worldview，而 emergence、system interaction、local vs global optimization 等可能更像 L2 thinking principles。它说明“一个词不一定天然属于一个 Level”。

- L1: Holism / Systems philosophy

- L2: Emergence / Interaction effects / Global optimization

- L3: Complex system / dependency network / bottleneck problem

- L4: System-level review / multi-perspective analysis / simulation

### 6.3 Unknown Discovery

这是目前最清晰的 L4 interaction principle 之一。它的作用不是回答问题，而是将 unknown unknown 转化为 known unknown。

- 上层可能连接：Epistemology、Metacognition、Information gain、Active learning、Problem finding。

- 下层 methods：Blind spot scan、Missing-question generation、Hidden-assumption discovery、Boundary analysis。

### 6.4 Vibe Interaction

Vibe 不应被定义为坏模式。它更像一种以高频 feedback 和快速迭代代替大量 upfront specification 的 interaction strategy。问题在于它常常被无意识地当成默认模式。

- 可能理论来源：Feedback loop、Hill climbing、Iterative design、Exploration/exploitation。

- 适合：低风险、可快速观察结果、可逆、创作型任务。

- 不适合直接默认：高风险、难验证、不可逆、存在隐藏依赖的任务。

## 7. Interaction Principles Identified So Far / 已识别的 L4 候选

这些概念暂时作为 L4 candidates 记录，不代表它们最终一定属于同一层。后续需要检查它们是否其实混合了 relationship model、reasoning method、workflow model 和 governance pattern。

| Candidate | Core idea |
| --- | --- |
| Vibe Interaction | 快速生成、观察、修改、重复。 |
| Cyborg Interaction | Human 和 AI 高频交替思考，形成紧密 feedback loop。 |
| Centaur Interaction | Human 和 AI 明确分工，各自处理更适合的部分。 |
| Delegation / Self-Automation | 把较完整任务交给 AI，人主要定义目标和验收。 |
| Mixed-Initiative Interaction | AI 不只响应，也可以主动提问、提醒、改变下一步。 |
| Socratic Interaction | 通过提问帮助用户暴露假设和形成理解。 |
| Critic / Adversarial Interaction | 主动攻击当前方案、寻找反例和失败方式。 |
| Unknown Discovery | 寻找用户没有意识到需要问的问题。 |
| Simulation Interaction | 运行 scenario、role、future state 或 failure path。 |
| Co-learning | Human 和 AI 通过长期反馈共同适应。 |
| Verification-first Interaction | 把生成和验证绑定，不把生成结果视为终点。 |
| Progressive Specification | 需求不是一次写完，而是逐步增加 constraints 和 definition。 |
| Human Checkpoint | 关键风险点由 human approval / intervention 控制。 |
| Multi-perspective Interaction | 从多个角色、目标或专业视角独立分析再组合。 |
| Exploration Switching | 有意识地在 exploit 当前路线和 explore 新路线之间切换。 |

## 8. Functional Requirements / 功能需求

| ID | Requirement | Assessment |
| --- | --- | --- |
| FR-01 | Framework must help the user avoid defaulting immediately to vibe interaction. | Keep |
| FR-02 | Framework must support reasoning upward from a concrete question to more abstract principles, problem structures, or worldview assumptions. | Keep |
| FR-03 | Framework must support reasoning downward from abstract principles to interaction patterns, methods, tools and concrete prompts. | Keep |
| FR-04 | Framework must expose multiple plausible reasoning paths instead of forcing one canonical path too early. | Keep |
| FR-05 | Framework must actively surface unknown unknowns, hidden assumptions, missing stakeholders, missing constraints and alternative framings. | Keep |
| FR-06 | Framework must support challenge and falsification of its own selected reasoning approach. | Keep |
| FR-07 | Framework must distinguish between different concept types even when popular literature groups them together as mental models. | Keep |
| FR-08 | Framework must work across domains, including technical design, business decisions, learning, everyday tasks and creative work. | Keep |
| FR-09 | Framework must allow loops. A user may move from L6 back to L4, L3, L2 or L1 when feedback shows the framing is wrong. | Keep |
| FR-10 | Framework should explain why a particular interaction pattern is suitable, not only recommend a prompt. | Keep |
| FR-11 | Framework should preserve vibe interaction as a valid strategy when conditions make it suitable. | Keep |
| FR-12 | Framework should be extensible as new AI interaction concepts and classical thinking models are discovered. | Keep |

## 9. Non-Goals / 暂时不做

- 不在当前阶段定义一套最终、唯一、封闭的 Level 1-6 taxonomy。

- 不把所有哲学家或思想流派强行塞入一棵树。

- 不把 framework 降级成 prompt collection。

- 不假设每个 concept 只能有一个 parent。

- 不追求一次覆盖所有人类哲学和所有算法理论。

- 不把“更复杂的思考方式”默认视为更好的方式。简单问题仍可以直接回答。

## 10. Design Principles for the Framework / 框架自身应遵守的原则

- Do not converge too early - 先发散、比较、挑战，再收敛。

- Use the framework on itself - 设计这套 framework 时也必须使用 Unknown Discovery、Critic、Reframing、Verification 等模式。

- Separate concept type from abstraction level - “属于哪类概念”和“位于多抽象”是两件事。

- Prefer graph internally, tree as a view - 底层关系可能是 graph，树可以只是用户界面上的 projection。

- Make upward reasoning explicit - 让用户看到为什么从一个实际问题上升到某个 principle。

- Make downward reasoning actionable - 高层思想最终必须能落到具体 method 和 interaction。

- Preserve optionality - 在信息不足时保留多个 plausible paths。

- Avoid philosophy decoration - 不能为了显得深刻而把哲学名词贴到 AI pattern 上，映射必须有真实机制上的联系。

## 11. Requirement Review / 对当前需求的审视

### 11.1 我认为目前方向是对的

- 核心目标已经从“整理 AI 互动技巧”升级为“建立一种选择思考方式的 meta framework”。这是更稳定、更有长期价值的目标。

- 要求先向上抽象再向下落地非常合理，它能避免 AI 只在用户最初 framing 内局部优化。

- 把 vibe 从默认行为变成有意识选择，而不是完全否定 vibe，这个要求合理。

- 将哲学、思想、算法和 AI interaction 建立映射是有价值的，但应该是机制映射，不是名称映射。

- 允许 graph / cross-link，而不是强迫所有概念只有一个 parent，是必要的。

### 11.2 目前仍然不稳定或可能有问题的假设

| Open assumption / risk | Why it matters |
| --- | --- |
| Level 1 = philosophy 是否过宽 | 哲学、科学方法、控制论、信息论、经济学模型的性质不同。未来可能需要把 L1 改成 Foundations，并允许多个 foundation type。 |
| L2 = thinking principles 是否能统一 | First Principles、Goodhart's Law、Bayesian Updating、Emergence 并不是同一种东西。可能需要 subtype 或第二个维度。 |
| L3 = problem structure 是否必须存在 | 有些 interaction pattern 可能直接由 principle 触发，不一定经过明确 problem class。L3 可能是 optional routing layer，而不是所有路径必经。 |
| L4 concepts 是否同质 | Centaur 是 division-of-labour model，Critic 是 reasoning mode，Human Checkpoint 是 governance pattern，Vibe 是 workflow style。它们可能需要类型标签。 |
| 是否真的需要固定层数 | 真实 structure 可能是 graph + typed edges。Level 只是给人理解用的 abstraction bands。 |
| 向上 reasoning 是否总有价值 | 简单、低风险问题不应为了使用 framework 而过度分析。需要一个“是否值得上浮”的判断。 |
| 经典理论映射可能产生伪深度 | 如果只是说 Vibe = cybernetics，却没有说明具体 feedback mechanism，就只是贴标签。必须要求可解释的 mapping criteria。 |

## 12. Key Open Questions / 下一阶段需要继续发散的问题

- 这套 framework 的底层应该是 tree、DAG、knowledge graph、matrix，还是多种 view 共存？

- Level 应该代表 abstraction depth，还是 concept type？两者是否应该分开？

- 什么是最小的一组 cognitive operators，例如 expand、narrow、challenge、simulate、verify、act、reflect？它们是否比 interaction principles 更基础？

- “First Principles”这种通用 principle 与“Bayesian Updating”这种机制是否应该位于同一层？

- 哪些 Level 4 pattern 是真正独立的，哪些只是更底层 pattern 的组合？

- 是否存在一个类似 periodic table 的多维结构，比树更适合描述 Human-AI interaction？

- 如何判断一个问题应该直接回答，还是应该触发 upward reasoning？

- 如何避免 meta thinking 自己造成 analysis paralysis？

- 如何定义“更好的 interaction pattern”？准确性、覆盖面、决策质量、可解释性、成本、速度还是学习价值？

- 是否应该让 AI 主动推荐 reasoning mode，还是由用户显式选择？

- 这个 framework 最终更像一个知识体系、一个 agent policy、一个 UI interaction model，还是三者结合？

## 13. Candidate Meta Flow / 当前最接近需求的工作流

下面不是最终流程，只是目前最符合需求意图的一种描述。

| Stage | Meaning |
| --- | --- |
| 0. Question arrives | 用户提出一个实际问题。 |
| 1. Mode check | 先判断直接回答是否足够，还是需要更深的 reasoning strategy。 |
| 2. L4 candidate discovery | 提出可能适合的 interaction patterns，例如 Unknown Discovery、Critic、Simulation、Socratic、Vibe。 |
| 3. Reason upward | 追问这些模式为什么适用，问题背后的结构是什么，哪些 thinking principles 或 worldview assumptions 在起作用。 |
| 4. Reframe if needed | 如果发现原问题 framing 太窄或错误，先重定义问题。 |
| 5. Reason downward | 从高层原则重新选择 L4，并下沉到 L5 methods。 |
| 6. Concrete interaction | 形成具体 prompt、tool、workflow、checklist 或 action。 |
| 7. Observe and loop | 根据结果决定继续向下执行，还是重新上浮。 |

## 14. Success Criteria / 什么情况下说明方向成立

- 面对同一个问题，framework 能让用户看到不止一种合理的思考路径。

- 用户能理解为什么选择某种 interaction pattern，而不是只拿到一个 prompt。

- framework 能发现至少一部分用户原本没有意识到的问题、假设或视角。

- 高层原则能够实际影响下层方法选择，而不是装饰性引用哲学名词。

- framework 对技术问题和日常问题都能工作，但不会迫使简单问题过度复杂化。

- vibe、first principles、critic、simulation 等可以被放在一个可解释但不僵化的关系网中。

- 当新的 interaction concept 出现时，可以加入而不破坏整个结构。

## 15. Current Product Hypothesis / 当前最简产品假设

如果暂时把它想象成一个 AI 功能，而不是纯理论体系，它可能不是“选择一个 prompt 模板”，而是一个 Meta Reasoning Router：先识别问题和不确定性，再提出 2-5 个可能的 reasoning / interaction paths，帮助用户向上审视，再向下生成具体 interaction。

> 但仍需验证: Meta Reasoning Router 只是目前一个可能的产品化表达，不应该反过来限制理论框架。
