# Delivery Tasks

## Operating Rules

- Priority: `P0` release blocker, `P1` important, `P2` valuable follow-up, `P3` optional.
- State: `TODO`, `DOING`, `DONE`, `BLOCKED`, or `SKIPPED`.
- At most two implementation tasks may be `DOING` at once.
- A task moves to `DONE` only with its acceptance evidence and documentation update.
- Product or architecture scope changes must update the source document before implementation.

## Milestones

| Milestone | Outcome | Status | Evidence |
| --- | --- | --- | --- |
| M1 Product | Stable users, problem, scope, requirements, and release criteria | DONE | `docs/PRODUCT.md`, commit `d8589bd` |
| M2 Architecture | Stable components, schema, contracts, security, and deployment | DONE | architecture docs, ADR-0001, commit `a339e7e` |
| M3 Plan | Executable, dependency-aware tasks mapped to requirements | DONE | this task register |
| M4 Build | Complete P0/P1 application behavior | DONE | native web application, 24 automated tests, browser smoke test |
| M5 Quality | Independent release evidence with no P0/P1 defects | DONE | `docs/TEST_REPORT.md`, 24 tests, 111 assertions, browser review |
| M6 Release | Public demo, repository governance, and `v1.0.0` | DONE | GitHub Pages, protected main, quality checks, and GitHub Release |
| M7 User validation / 用户验证 | Optional external sessions / 可选外部会话 | SKIPPED | Skipped by owner policy on 2026-07-13; 0 sessions and no user conclusion / 负责人于 2026-07-13 决定跳过；0 次会话且无用户结论 |
| M8 Automated discovery / 自动发现 | Scheduled public-signal collection, AI analysis, and local candidate review / 定时采集公开信号、AI 分析和本地候选审核 | DONE | 36 automated tests; live public-source and GitHub Models run; bilingual desktop/mobile save flow / 36 项自动化测试；公开来源与 GitHub Models 实测；双语桌面/移动端保存流程 |
| M9 Bilingual discovery refinement / 双语候选体验优化 | Candidate titles, analysis, uncertainties, and saved content switch naturally between English and Chinese / 候选标题、分析、不确定项及保存内容可自然切换中英文 | DONE | Feed schema 2, legacy compatibility, live model output, 37 tests, bilingual save, and mobile browser evidence / Feed schema 2、旧版兼容、模型实测、37 项测试、双语保存及移动端证据 |

## TODO

| ID | Priority | Milestone | Task | Requirements | Depends on | Acceptance evidence |
| --- | --- | --- | --- | --- | --- | --- |
| F-001 | P2 | Future | Compare selected ideas side by side | FR-014 | Explicit owner prioritization | Reassess from product scope and available evidence |
| F-002 | P3 | Future | Evaluate secure server-side model critique | FR-015 | Explicit architecture approval | New PRD scope, threat model, cost analysis, and ADR required |

## DOING

None.

## DONE

| ID | Priority | Milestone | Task | Evidence |
| --- | --- | --- | --- | --- |
| P-001 | P0 | M1 | Define users, problem, value, scope, requirements, scoring, and release criteria | `docs/PRODUCT.md`, `d8589bd` |
| A-001 | P0 | M2 | Define local-first native web architecture and data trust boundary | `docs/ARCHITECTURE.md`, ADR-0001, `a339e7e` |
| A-002 | P0 | M2 | Define schema, module contracts, tooling, security, and deployment | `docs/DATABASE.md`, `docs/API.md`, `TECH_STACK.md` |
| T-001 | P0 | M3 | Create requirement-linked implementation, quality, and release plan | This document |
| B-001 | P0 | M4 | Build semantic application shell and responsive design system | Desktop and 390 px browser layouts; no horizontal overflow |
| B-002 | P0 | M4 | Implement workspace model, normalization, limits, and validation | `tests/model.test.js` |
| B-003 | P0 | M4 | Implement transparent scoring and evidence-gap guidance | `tests/scoring.test.js` |
| B-004 | P0 | M4 | Implement storage adapter and recovery behavior | `tests/storage.test.js` |
| B-005 | P0 | M4 | Implement idea create, edit, delete, and lifecycle flows | Browser create/persist/delete-cancel smoke test |
| B-006 | P0 | M4 | Implement evidence note management | Browser evidence composer test and model coverage |
| B-007 | P0 | M4 | Implement dashboard, search, lifecycle filters, and sorting | Browser dashboard and filter smoke test |
| B-008 | P0 | M4 | Implement JSON backup/restore and Markdown brief export | `tests/export.test.js` |
| B-009 | P1 | M4 | Implement explicit fictional example workspace | Deterministic example tests and visible fictional-data notice |
| B-010 | P1 | M4 | Implement system, light, and dark theme preference | Persisted preference and system listener |
| B-011 | P1 | M4 | Implement keyboard, dialog focus, form error, and live-region behavior | Native dialog, focus return, labelled controls, status regions |
| Q-001 | P0 | M5 | Build static repository and security checks | `npm run check`, secret and unsafe API scans |
| Q-002 | P0 | M5 | Complete automated domain and adapter tests | 24 tests, 111 assertions, 0 failures/skips/todos |
| Q-003 | P0 | M5 | Execute browser functional regression | Create, persist, score, filter, export feedback, and delete-cancel evidence |
| Q-004 | P0 | M5 | Execute accessibility and responsive review | Landmarks, labels, focus return, 390 × 844 no-overflow check |
| Q-005 | P1 | M5 | Verify performance and privacy budgets | 84,187 bytes; CSP `connect-src 'none'`; no runtime network API |
| Q-006 | P0 | M5 | Publish release test report and resolve blockers | `docs/TEST_REPORT.md`; no known P0/P1 blocker |
| R-001 | P0 | M6 | Add pinned-SHA CI and GitHub Pages workflows | Remote Quality and Pages runs passed |
| R-002 | P0 | M6 | Create and secure the public GitHub repository | Topics, labels, security features, private reporting, and ruleset configured |
| R-003 | P0 | M6 | Publish reproducible GitHub Pages demo | HTTPS 200; 9 deployed assets matched verified source byte-for-byte |
| R-004 | P0 | M6 | Complete open-source and portfolio packaging | README, screenshot, governance, test report, and interview review |
| R-005 | P0 | M6 | Publish signed-off `v1.0.0` GitHub Release | Annotated tag and GitHub Release on the verified final commit |
| UV-001 | P0 | M7 | Define the bilingual consent, privacy, task, metric, severity, and synthesis protocol / 定义双语同意、隐私、任务、指标、严重度及汇总协议 | `docs/research/`; internal dry run on 2026-07-13 does not count as user evidence / 2026-07-13 内部演练不计入用户证据 |
| L-001 | P1 | M7 | Add persistent English/Simplified Chinese interface switching / 添加持久化中英文界面切换 | FR-016; 30 automated tests; desktop and 390 × 844 browser regression; preference reload verified |
| AD-001 | P0 | M8 | Define automated discovery product and architecture boundary | Approved owner direction, `docs/PRODUCT.md`, ADR-0002, and architecture contracts |
| AD-002 | P1 | M8 | Implement bounded Hacker News and GitHub Issues collection | Official public APIs, bounded normalization, deterministic fixtures, and source failure states |
| AD-003 | P1 | M8 | Add GitHub Models structured analysis with safe fallback | Structured schema validation, prompt-injection boundary, live model run, and deterministic fallback tests |
| AD-004 | P1 | M8 | Publish scheduled candidate feed through GitHub Pages | Scheduled/manual Pages workflow, ephemeral token, and same-origin JSON artifact |
| AD-005 | P1 | M8 | Build bilingual discovery feed and save-to-workspace flow | English/Chinese desktop regression, 390 × 844 no-overflow check, empty browser logs, and local persistence save test |
| L-002 | P1 | M9 | Add versioned bilingual candidate content and locale-aware saving / 增加版本化双语候选内容及按当前语言保存 | FR-016, FR-021; schema 2 and version 1 compatibility tests; live bilingual GitHub Models output; English/Chinese render and save; 390 × 844 no-overflow; empty browser logs |

## SKIPPED

| ID | Former priority | Milestone | Task | Reason and evidence boundary |
| --- | --- | --- | --- | --- |
| UV-002 | P0 | M7 | Recruit three eligible usability participants / 招募三名合格参与者 | Owner policy decision on 2026-07-13; no recruitment or participant data collected / 负责人于 2026-07-13 决定跳过；未招募且未收集参与者数据 |
| UV-003 | P0 | M7 | Run P01-P03 moderated usability sessions / 执行 P01-P03 主持式测试 | Not executed; 0 sessions and no usability result / 未执行；0 次会话且无可用性结论 |
| UV-004 | P0 | M7 | Synthesize findings and prioritize responses / 汇总问题并确定处理优先级 | Not applicable because no participant evidence exists / 不适用，因为不存在参与者证据 |
| UV-005 | P0 | M7 | Close or continue the milestone from evidence / 根据证据结束或继续里程碑 | Replaced by the explicit owner decision to skip M7 / 已由负责人明确跳过 M7 的决定取代 |

## BLOCKED

None.

## Requirement Traceability

| Requirement group | Build tasks | Quality evidence |
| --- | --- | --- |
| Idea and evidence management | B-002, B-005, B-006 | Q-002, Q-003 |
| Scoring and explanation | B-003 | Q-002, Q-003 |
| Portfolio navigation and dashboard | B-007 | Q-003, Q-004 |
| Persistence, backup, and recovery | B-004, B-008 | Q-002, Q-003 |
| Example and themes | B-009, B-010 | Q-003, Q-004 |
| Interface language | L-001 | Automated i18n, persistence, export, desktop, and mobile browser evidence |
| Automated discovery | AD-001..AD-005 | Deterministic pipeline tests, live source/model run, bilingual browser save, mobile no-overflow, Pages workflow |
| Bilingual discovered content | L-002 | Versioned feed tests, legacy fallback, English/Chinese render and save assertions, desktop/mobile browser evidence |
| Keyboard and accessibility | B-001, B-011 | Q-004 |
| Security, privacy, and performance | Q-001, Q-005 | Q-006 |
| Publication | R-001..R-005 | GitHub checks, Pages, Release |
