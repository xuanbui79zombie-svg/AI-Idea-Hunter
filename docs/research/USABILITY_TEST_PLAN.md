# M7 Usability Test Plan / M7 可用性测试计划

This document is bilingual. The English and Chinese sections define the same protocol; neither language takes precedence over the evidence.

本文档采用中英双语。英文与中文定义同一套测试协议，证据效力不因语言不同而改变。

## Decision and Evidence Boundary / 决策与证据边界

M7 tests whether independent developers can use AI Idea Hunter to structure an idea, interpret its score, and choose a defensible next step. It does not test market demand, willingness to pay, retention, or product-market fit.

M7 验证独立开发者能否使用 AI Idea Hunter 结构化记录创意、理解评分，并选择有依据的下一步行动。它不验证市场需求、付费意愿、留存率或产品市场匹配度。

Only sessions completed by eligible, consented participants count toward the three-session target. Maintainer reviews, automated checks, and dry runs validate the protocol but are not user evidence.

只有符合条件且已明确同意的参与者完成的会话，才能计入三次测试目标。维护者审查、自动化检查和内部演练只能验证测试流程，不能作为用户证据。

## Research Questions / 研究问题

1. Can a participant identify what the product is for without coaching? / 参与者能否在没有引导的情况下理解产品用途？
2. Can they capture a real, sanitized problem and supporting evidence? / 参与者能否记录一个经过脱敏的真实问题及其支持证据？
3. Can they explain what the score means, what it does not mean, and which uncertainty matters most? / 参与者能否解释评分代表什么、不代表什么，以及最重要的不确定性？
4. Can they turn the strongest idea into a useful next validation step? / 参与者能否把最强创意转化为有价值的下一项验证行动？
5. Can they find the backup and brief exports and understand the local-storage risk? / 参与者能否找到备份和简报导出功能，并理解本地存储风险？

## Participants / 参与者

Run three moderated sessions with people who meet all of these conditions:

执行三次主持式测试，参与者必须同时满足以下条件：

- independently select or build software projects; / 独立选择或开发软件项目；
- have used notes, spreadsheets, or another method to track ideas; / 使用过笔记、表格或其他方式管理创意；
- did not help design or implement AI Idea Hunter; / 未参与 AI Idea Hunter 的设计或开发；
- can use a sanitized idea that contains no employer, client, or personal secrets. / 能够使用不包含雇主、客户或个人秘密的脱敏创意。

Aim for a mix of early-career and experienced builders. Record only a pseudonymous code (`P01` through `P03`) in this repository. The maintainer is ineligible as a counted participant.

参与者应尽量覆盖初级和有经验的开发者。仓库中只能记录匿名编号（`P01` 至 `P03`）。项目维护者不能作为计数参与者。

## Session Format / 会话形式

- Duration: 30–40 minutes. / 时长：30–40 分钟。
- Mode: remote screen share or in person. / 形式：远程屏幕共享或线下测试。
- Build: the published `v1.0.0` demo in a clean browser profile when practical. / 版本：条件允许时，在干净浏览器配置中使用已发布的 `v1.0.0` Demo。
- Language: English or Chinese, chosen by the participant. Use the matching prompt without changing its intent. / 语言：由参与者选择英文或中文；使用对应语言的提示，不改变提示意图。
- Recording: off by default; require separate explicit consent if needed. / 录制：默认关闭；如需录制，必须另行取得明确同意。
- Raw notes: private working material. Commit only anonymized observations and synthesized findings. / 原始笔记：属于私有工作材料；仓库中只能提交匿名观察和汇总结论。

Before starting, explain that the software—not the participant—is being tested, participation is voluntary, they may stop at any time, and they must avoid confidential data. Obtain verbal or written consent to take anonymized notes.

开始前应说明：被测试的是软件而不是参与者；参与完全自愿，可以随时停止，并且不得使用机密数据。记录匿名笔记前，必须取得口头或书面同意。

## Neutral Moderator Script / 中立主持脚本

Use these prompts without explaining the interface or scoring model first. Read either the English or Chinese version, not both, unless the participant asks for clarification.

在不预先解释界面或评分模型的情况下使用以下提示。除非参与者要求澄清，否则只使用其中一种语言，不连续朗读两种语言。

1. “Please look at this page and tell me what you think it is for.”
   “请查看这个页面，并告诉我你认为它是做什么的。”
2. “Use a real but non-confidential software idea. Show how you would capture the problem and what makes you believe it exists.”
   “请使用一个真实但不涉密的软件创意，展示你会如何记录这个问题，以及你为什么相信它确实存在。”
3. “Set the scores as you think appropriate. Tell me what you believe the result means.”
   “请按照你的判断设置评分，并告诉我你认为结果意味着什么。”
4. “Find the biggest weakness in this idea and decide what you would do next.”
   “请找出这个创意最大的薄弱点，并决定下一步要做什么。”
5. “Imagine you want to continue the research elsewhere. Show what you would take with you.”
   “假设你想在其他地方继续研究，请展示你会带走哪些内容。”
6. “Imagine your browser data is about to be cleared. Show how you would protect your work.”
   “假设浏览器数据即将被清除，请展示你会如何保护当前工作。”

If the participant becomes stuck, wait briefly, then use prompts in this order: “What would you try next?”, “What are you looking for?”, and finally a direct hint. Record the highest assistance level used.

如果参与者遇到困难，先短暂等待，然后依次提示：“你接下来会尝试什么？”、“你正在找什么？”，最后才提供直接提示。记录使用过的最高帮助等级。

## Tasks and Success Criteria / 任务与成功标准

| ID | Task / 任务 | Independent success evidence / 独立成功证据 | Core / 核心 |
| --- | --- | --- | --- |
| U1 | Explain the product / 解释产品 | Describes evidence-backed idea prioritization without calling the score market validation / 能说明这是基于证据的创意排序，且不把评分称为市场验证 | Yes / 是 |
| U2 | Capture an idea / 记录创意 | Saves a problem, audience, outcome, and at least one meaningful evidence note / 保存问题、受众、预期结果和至少一条有意义的证据 | Yes / 是 |
| U3 | Interpret the score / 理解评分 | Explains that inputs drive a comparative score and identifies one uncertainty / 说明输入产生的是比较性评分，并识别至少一项不确定性 | Yes / 是 |
| U4 | Choose a next step / 选择下一步 | Uses evidence gaps or the brief to state a specific validation action / 根据证据缺口或简报提出具体验证行动 | Yes / 是 |
| U5 | Export a brief / 导出简报 | Locates Markdown export and understands its research handoff purpose / 找到 Markdown 导出，并理解其研究交接用途 | No / 否 |
| U6 | Protect the workspace / 保护工作区 | Locates JSON backup and explains that browser storage can be cleared / 找到 JSON 备份，并说明浏览器存储可能被清除 | Yes / 是 |

## Measures / 记录指标

For each task record the following:

每项任务记录以下内容：

- result: `Independent`, `Prompted`, `Direct help`, or `Failed`; / 结果：`独立完成`、`提示后完成`、`直接帮助后完成`或`失败`；
- critical error or misleading interpretation; / 严重错误或误导性理解；
- approximate completion time, used descriptively rather than as a performance claim; / 大致完成时间，仅作描述，不作为性能宣传；
- Single Ease Question rating from 1 (very difficult) to 7 (very easy); / 单项难度评分：1（非常困难）至 7（非常容易）；
- concise observation and an anonymized quote only when consent covers it. / 简明观察；只有在同意范围内才能记录匿名引语。

## M7 Exit Thresholds / M7 退出标准

M7 can conclude only after all three eligible sessions are recorded and synthesized. Targets are:

只有在三名合格参与者的会话全部记录并完成汇总后，M7 才能结束。目标如下：

- at least two of three participants complete every core task independently; / 至少三人中的两人独立完成全部核心任务；
- at least two of three explain the score and strongest uncertainty without help; / 至少三人中的两人无需帮助即可解释评分和最大不确定性；
- no unresolved P0 or P1 finding involving data loss, unsafe disclosure, or a materially misleading score; / 不存在涉及数据丢失、不安全披露或评分严重误导的未解决 P0/P1 问题；
- every observed problem has participant evidence, severity, and a disposition. / 每个观察到的问题都有参与者证据、严重度和处置决定。

These are decision thresholds, not predeclared results. Missing a threshold triggers a fix or explicit product decision; it must not be rewritten as success.

这些是决策阈值，不是预设结果。未达到阈值时必须修复或作出明确产品决策，不得改写成成功结论。

## Finding Severity / 问题严重度

| Severity / 严重度 | Definition / 定义 | Response / 处理 |
| --- | --- | --- |
| P0 | Data loss, unsafe disclosure, or the core flow cannot be completed / 数据丢失、不安全披露或核心流程无法完成 | Stop sessions if participant safety is affected; fix before continuing / 如影响参与者安全则停止测试，修复后再继续 |
| P1 | Multiple participants fail a core task or materially misunderstand the score / 多名参与者无法完成核心任务或严重误解评分 | Fix before M7 closes and rerun the affected task / M7 结束前修复并重新测试受影响任务 |
| P2 | Recoverable friction, unclear copy, or failure in a non-core task / 可恢复的阻碍、文案不清或非核心任务失败 | Prioritize with evidence for the next release / 基于证据排入下一版本 |
| P3 | Preference or minor polish issue with no task impact / 不影响任务的偏好或轻微优化 | Record; do not expand scope without repeated evidence / 记录；没有重复证据时不扩展范围 |

## Synthesis Rules / 汇总规则

- Separate observation, interpretation, and recommendation. / 分开记录观察、解释和建议。
- Do not convert one participant’s preference into a universal need. / 不把单个参与者的偏好当作普遍需求。
- Do not publish identities, contact details, employer data, screen recordings, or raw notes. / 不公开身份、联系方式、雇主数据、屏幕录制或原始笔记。
- Link product changes to finding IDs and update `TASKS.md` after the three-session synthesis. / 产品修改必须关联问题编号，并在三次会话汇总后更新 `TASKS.md`。
- Any change to the core product direction or architecture still requires explicit approval. / 任何核心产品方向或架构变更仍需明确批准。
