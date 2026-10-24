# Skill 仓库工程约束研究

日期：2026-10-25。状态：定向研究已完成；下列研究笔记保留研究时的观察，当前实施状态以工程指南为准。

- [项目建议与推进顺序](./engineering-baseline-2026-10-25.md)：当前缺口、统一检查、分层反馈和服务器门槛。
- [Skill 质量工具](./skill-quality-tools-2026-10-25.md)：agnix、skills-ref、官方作者与评估指导、可选 Skill Scanner。
- [Codex 与 Claude 约束](./agent-controls-2026-10-25.md)：hooks、权限、沙箱、平台差异与不可覆盖的边界。
- [SOT、目录与安装发现](./sot-layout-installability-2026-10-25.md)：单一维护源、skills CLI 发现行为与候选发布取舍。

本轮目录与格式方案已记录为 [ADR 0001](../adr/0001-repository-sources-of-truth.md)，当前规则见[仓库结构标准](../../../docs/REPOSITORY-STRUCTURE.md)。共享检查、客户端 hook 适配及 CI 已按 [ADR 0002](../adr/0002-shared-delivery-harness.md) 实施；覆盖范围、实测结果和未验证边界见 [HARNESS.md](../../../docs/HARNESS.md)。

工程实施应复用现有 npm、Promptfoo 与三平台 CI。采用新工具前需试运行并建立误报基线；远端规则及凭证角色由用户选择后另行配置。
