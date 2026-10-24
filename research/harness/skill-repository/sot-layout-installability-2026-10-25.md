# Research: Skill 安装发现、单一来源与目录边界

日期：2026-10-25。问题：怎样让 Codex 与 Claude 维护同一套来源，同时保证 skills.sh/skills CLI 的安装结果可预测？背景：当前自有候选在 incubator，第三方开发技能在两个 agent 目录，未来需要正式发布与持续评估。本轮仅调查与建议，不改变现有布局或政策。

当前建议：[inference] 若要确定长期稳定体系，可让自有 runtime package 从起草开始只有 `skills/<name>/` 一个来源，孵化文档留在 `incubator/<name>/`，评估固定在 `evals/suites/<name>/`。未发布包默认隐藏。该方案会修改现有“skills 仅存正式发布包”的约定，不能未经明确采纳就当作现行规则。保守替代是保留当前候选位置，发布时原子移动包而非复制。

证据标记：`[official]` 为核读维护者文档/源码，`[measured]` 为当前文件与 CLI 观察，`[inference]` 为项目建议。

## Overview

| 问题 | 当前建议 | 边界 |
| --- | --- | --- |
| 什么决定可安装目录？ | 以固定版本 CLI 的发现结果与文件不变量双重检查 | 默认去重会隐藏冲突 |
| 能否只靠 internal 隐藏草稿？ | 将其视为 CLI 可见性扩展 | 不是跨客户端安全或权限边界 |
| 候选和发布包是否都保留？ | 保持一份可编辑 runtime source；发布不复制维护第二份 | 独立发布产物可由来源生成，但不得人工编辑 |
| eval 应放哪里？ | 固定项目级 `evals/suites/<name>/` | runtime 包仍需自包含 |
| 是否手工维护 catalog？ | 从实际 SKILL frontmatter 派生目录和包清单 | 第三方 skills-lock 不等于自有发布注册表 |

## 1. 发现规则的实际含义

### Evidence

[official] 创建文档说明标准容器、最多三层的常规扫描、较浅 SKILL.md 遮蔽其后代，以及 `--full-depth` 与无结果时递归回退。根目录、`skills/`、`.agents/skills/`、`.claude/skills/` 都涉及发现。[S1]

[official] 核读发现源码：默认按 skill 名去重；已安装项目 skill 若名称或目录名能在本地 lock 中匹配，则在 agent 安装目录内排除。递归忽略 node_modules 等目录。该排除依赖 lock 和路径，不是 `.agents/` 一律不参与发现。[S2]

[measured] 当前缓存的 skills CLI 为 `1.7.4`；核读其 bundle 中对应实现，与上述主逻辑一致。当前 `skills-lock.json` 记录 research、domain-modeling，两个 agent 目录各有一份相同正文。默认根目录 `add . --list` 返回 No skills found，退出码 1；开启 internal 与 full-depth 后仅列出 meta-thinking，退出码 0。两条命令只列举，未安装。

### Recommendation for the project

[inference] 不在仓库根、`skills/` 或分类容器放 SKILL.md。优先采用扁平 `skills/<name>/SKILL.md`，避免把分类层数变成发现复杂度。名称在所有自有包中保持唯一，不能以默认列表只显示一次来证明没有重复。

[inference] 第三方开发技能应通过锁文件管理，并明确属于工具依赖。删除 lock、改变 skill 名称或在安装目录人工写入自有包，都可能改变公开发现结果。发布检查要验证这些依赖没有混入产品列表。

### Relation to existing constraints

现有唯一名、自包含和防 root shadow 规则仍有直接依据。实际布局调整应同步 AGENTS.md、CLAUDE.md、README 与自动检查。

## 2. internal 是工具扩展，不是生命周期系统

### Evidence

[official] skills CLI 文档提供 `metadata.internal: true`。源码精确比较 YAML 布尔值 `true`；字符串 `"true"` 不满足该判断。`INSTALL_INTERNAL_SKILLS=1` 或实现层的 includeInternal 选项可使其可见。[S1][S2]

[official] Agent Skills 规范将 metadata 描述为字符串键值映射，并允许客户端附加元数据；它不定义 CLI 的 internal 可见性语义。[S3]

### Recommendation for the project

[inference] 若继续使用当前 CLI 扩展，应在仓库规则中明确布尔 internal 的兼容例外，不把它伪装成所有客户端都支持的标准能力。内部包仍可被明确加载或被其他工具发现。

[inference] 生命周期信息可以采用字符串 `metadata.lifecycle`，由项目自己定义合法值与转换；它不自动改变 CLI 行为。若选择它作为唯一生命周期来源，检查必须验证状态与 internal 的关系，而非再手工维护一张独立状态表。

### Relation to existing constraints

当前候选已经使用布尔 internal，之前通过 reference validator 不代表规范中的字符串约定不存在。未来 linter 遇到此差异应记录有范围的理由或单独处理，不以修改成字符串来“修正”而破坏隐藏效果。

## 3. 单一来源的两种可行布局

### Evidence

[official] 规范要求一个包具有 SKILL.md，并提供 references/scripts/assets 等可选资源；CLI 按实际目录与元数据读取包。没有要求同时维护 candidate 和 released 两份正文。[S1][S3]

### Recommendation for the project

[inference] 长期稳定布局建议：

```text
skills/<name>/               # 自有 runtime 唯一来源，含 SKILL.md 与包内资源
incubator/<name>/            # 设计、评估总结、试用记录，不复制 runtime 包
evals/suites/<name>/         # 从第一天固定的案例、评分与适配配置
evals/                      # 通用 runner、provider 与工具测试
research/<category>/<topic>/ # 证据与历史研究
knowledge/<topic>/          # 当前可复用知识
docs/                       # 仓库政策、格式、生命周期与维护规则
```

[inference] 此方案让候选与发布保持同一路径，发布只是满足条件后改变生命周期/可见性；所有 runtime 资源在该包内，移除仓库其他目录仍可安装使用。`skills/` 不再仅表示“已发布”，这需要明确的新政策。

[inference] 保守方案仍可成立：`incubator/<name>/candidate/<name>/` 是候选唯一来源，通过验证后整体移动到 `skills/<name>/`；不留下可编辑副本。评估路径仍固定在 root evals，由扫描得到的 inventory 解析当前源路径。两种方案应选定一种，不混用。

[inference] 推荐前者的理由是用户正在建立长期规范，而包数量还少，稳定路径减少将来 promotion 带来的引用变更。它是项目选择，不是 Agent Skills 标准要求。

### Relation to existing constraints

不论采取哪种布局，依赖 resources 不能链接回研究/知识目录充当运行时。共同原则是唯一可编辑来源；历史版本由 Git 保留。

## 4. 开发技能与 agent 专属目录

### Evidence

[official] 安装器区分 canonical 目录与 agent 视图，支持 copy、symlink、link；在 Windows 上使用 junction，并有复制回退逻辑。源目录与安装视图不是相同概念。[S4]

### Recommendation for the project

[inference] 自有 skill 源码不在 `.claude/skills/` 和 `.agents/skills/` 各写一份。开发用第三方 skill 以其上游/锁定版本为来源；本地安装视图由工具生成。若为了客户端兼容保留多个视图，应验证它们与同一上游版本一致，修改通过刷新依赖完成。

[inference] 仓库级规则放一份权威文件，Claude/Codex 入口只引用或导向它；客户端权限设置保持各自格式，但调用同一个项目检查命令。不能因客户端目录格式不同而分叉生命周期规则。

### Relation to existing constraints

不需要把所有开发工具都发布为本项目产品。当前 imported skill 有锁记录，不应因整理布局将它们误搬成自有发布技能。

## 5. 派生 catalog 与可执行不变量

### Evidence

[official] CLI 从 SKILL frontmatter 获取名称、描述和路径；默认去重是发现行为，不是库级唯一性验证。[S2]

### Recommendation for the project

[inference] 从唯一 runtime 根扫描生成 inventory/catalog，派生名称、路径、描述与生命周期。生成文件若提交，应检查再生成无差异；若只用于检查，可不提交。不要手写另一份与源码重复的名称、路径和状态注册表。

[inference] 建议未来统一检查入口至少验证：

- 源目录及名称一致，所有自有包的名称唯一。
- 根或容器没有会遮蔽后代的 SKILL.md。
- 所有包内链接存在，解析真实路径后仍在包内，避免 symlink 逃逸。
- 候选隐藏、发布可见的状态一致；导入的开发技能不混入产品清单。
- 不存在候选与发布两个可编辑 runtime 副本。
- 各 suite 对应真实包，expected/fixture 不混入模型输入。
- 当前 CLI 的默认发现结果，与 inventory 派生的发布清单相等；full-depth 另外检查无意外包与同名冲突。

[inference] `.gitignore` 只控制 Git 跟踪，不能当成 skills CLI 的发布排除配置。目录规则、元数据和实际发现检查需要共同工作。

### Relation to existing constraints

这将当前人工的目录理解变成能被 Codex、Claude、本地和 CI 复用的检查，而非增加一套独立注册流程。

## 判断信心

上述布局建议为中，3.0：Owner 1（用户明确要统一 SOT）、Research 1（规范与源码已核读）、Reasoning 0.5（仍是项目方案）、Project history 0.5（有小规模当前布局，无迁移实测）。支持度不代表任意客户端都能发现相同目录。

## Not verified

- 未安装或更新 skills CLI，使用现有缓存 `1.7.4` 做只读列举。
- 未迁移 runtime、suite 或 agent 安装视图，未修改政策与检查。
- 未验证第三方客户端如何处理 internal/lifecycle 扩展。
- 未验证远端 skills.sh 对此仓库的索引状态或刷新时机。
- 主分支源码与固定 CLI 并非同一版本，升级前仍需重复发现检查。

## Decisions for the owner

应明确采纳稳定 runtime 根方案，还是继续采用发布时单次移动方案。其余自动检查围绕所选方案实现，不同时维护两套。

### 后续方案选择（2026-10-25）

用户授权主任务确定方案后，主 agent 采纳了保守的单次移动方案，并让评估继续稳定归属 initiative。理由是保持已确认的 released-only `skills/` 语义，避免把草稿可见性全面依赖于 CLI 扩展，同时维持一份活跃 runtime source。候选发布时必须在同一变更更新 suite 目标。原研究偏好的固定源方案保留为已考虑替代，不再是未决事项。当前规则见[结构标准](../../../docs/REPOSITORY-STRUCTURE.md)，取舍见 [ADR 0001](../adr/0001-repository-sources-of-truth.md)。

## Sources

- [S1 — skills CLI 创建与发现说明](https://raw.githubusercontent.com/vercel-labs/skills/main/docs/creating-skills.md)：扫描深度、shadow、internal 和 fallback。
- [S2 — skills CLI 发现源码](https://raw.githubusercontent.com/vercel-labs/skills/main/src/skills.ts)：锁记录排除、布尔判断、去重与扫描规则；另核读本地 1.7.4 bundle 的对应实现。
- [S3 — Agent Skills 规范](https://agentskills.io/specification)：标准包结构与 metadata 字符串约定。
- [S4 — skills CLI 安装器](https://raw.githubusercontent.com/vercel-labs/skills/main/src/installer.ts)：来源、canonical 安装位置、视图与跨平台处理。
- [S5 — skills CLI add 源码](https://raw.githubusercontent.com/vercel-labs/skills/main/src/add.ts)：仅定向确认发现/安装入口的分工，未逐项核验完整 CLI 行为。
