# Meta Thinking 候选

第一版将[共享知识](../../knowledge/meta-thinking/meta-thinking-guidance.md)转成可试用的低频 skill。用户于 2026-10-25 授权开始实现。当前处于孵化阶段，实际行为与长期收益待试用。

## 文件

- [候选 skill](./candidate/meta-thinking/SKILL.md)：短主体，支持显式调用、停滞诊断、目标探索及 agent 设计。
- [互动选项](./candidate/meta-thinking/references/interaction-options.md)：按障碍选择方法，按需读取。
- [画像约定](./candidate/meta-thinking/references/memory.md)：用户级 JSON、事件与条件性模式、lazy 更新和访问降级。
- [评估案例与验证记录](./evaluation.md)：场景边界、预期行为及实测状态。
- [自动化评估套件](./evals/suite.mjs)：基线、仅描述、完整候选三种条件；使用仓库级 Promptfoo 工具运行。

## 第一版选择

选择本地、可读写用户文件的 agent 作为首个试用目标。默认画像位于实际用户主目录的 `.agents/meta-thinking/profile.json`，支持用户明确指定其他位置。远端环境必须能确认用户归属与持久性，否则仅使用会话上下文。这是本版实现选择，不是所有宿主都已支持的能力。

主体围绕理解障碍、重构并行动、选择性记忆。按需参考文件承载具体选项与存储约定；运行时包不依赖仓库的 knowledge 或 research。画像由 agent 使用宿主工具维护，第一版没有额外服务、后台监控或存储脚本。

命名采用 `meta-thinking`；描述包含用户使用的 `metathinking`。候选位于 `candidate/meta-thinking/`，不是正式发布目录，也没有自动安装到本仓库的 agent 配置。

候选使用当前 skills CLI 支持的 `metadata.internal: true`，在默认发现时隐藏；该键是工具扩展，并非所有客户端的激活控制。显式试用时可设置 `INSTALL_INTERNAL_SKILLS=1` 发现候选。

## 试用

在支持 Agent Skills 的本地客户端中，从本目录的 `candidate/meta-thinking/` 加载候选。安装与用户目录权限按客户端已有机制处理。先使用显式请求：“用 metathinking 帮我设计一个 reviewer skill”。

从仓库根目录可以先执行只列举命令：

```bash
INSTALL_INTERNAL_SKILLS=1 npx skills add ./incubator/meta-thinking/candidate/meta-thinking --list
```

按[评估案例](./evaluation.md)记录实际输入、输出、宿主和版本、触发情况、用户负担及记忆变化。自然触发与跨会话记忆应分别检验。试用阶段只使用合成画像或用户已授权的真实记录。

试用中若发现通用知识错误，先在研究层记录证据，再更新知识；候选指令、激活和画像实现的问题在这里修正。

## 验证依据

2026-10-25 核读 [Agent Skills 规范](https://agentskills.io/specification)及 [skills CLI 创建与发现说明](https://github.com/vercel-labs/skills/blob/main/docs/creating-skills.md)。采用标准 frontmatter、包内相对引用及按需资源。工具检查的实际结果记录在评估文件，不以格式通过代替行为验证。
