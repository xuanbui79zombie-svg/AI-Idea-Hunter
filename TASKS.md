# Delivery Tasks

## Operating Rules

- Priority: `P0` release blocker, `P1` important, `P2` valuable follow-up, `P3` optional.
- State: `TODO`, `DOING`, `DONE`, or `BLOCKED`.
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
| M7 User validation / 用户验证 | Three consent-based sessions and evidence-backed product decisions / 三次知情同意会话及基于证据的产品决策 | DOING | Bilingual protocol ready; external sessions pending / 双语协议已就绪，等待外部会话 |

## TODO

| ID | Priority | Milestone | Task | Requirements | Depends on | Acceptance evidence |
| --- | --- | --- | --- | --- | --- | --- |
| F-001 | P2 | Future | Compare selected ideas side by side | FR-014 | Post-release validation | Reassess after usability evidence |
| F-002 | P3 | Future | Evaluate secure server-side model critique | FR-015 | Explicit architecture approval | New PRD scope, threat model, cost analysis, and ADR required |
| UV-002 | P0 | M7 | Recruit three eligible usability participants / 招募三名合格参与者 | UV-001 | Recruitment brief and eligibility record for P01-P03 / 招募说明及 P01-P03 合格记录 |
| UV-003 | P0 | M7 | Run P01-P03 moderated usability sessions / 执行 P01-P03 主持式测试 | UV-002 | Three sanitized session records with task outcomes and consent confirmed / 三份含任务结果和同意确认的脱敏记录 |
| UV-004 | P0 | M7 | Synthesize findings and prioritize responses / 汇总问题并确定处理优先级 | UV-003 | Task-level counts, finding severities, limitations, and linked decisions / 任务级数量、严重度、局限和关联决策 |
| UV-005 | P0 | M7 | Close or continue the milestone from evidence / 根据证据结束或继续里程碑 | UV-004 | Threshold decision, required fixes verified, and docs updated / 阈值决定、必要修复验证及文档更新 |

## DOING

| ID | Priority | Milestone | Task | Current evidence |
| --- | --- | --- | --- | --- |
| UV-002 | P0 | M7 | Recruit three eligible usability participants / 招募三名合格参与者 | P01-P03 are not scheduled; no user result exists / P01-P03 尚未安排，不存在用户结果 |

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
| Keyboard and accessibility | B-001, B-011 | Q-004 |
| Security, privacy, and performance | Q-001, Q-005 | Q-006 |
| Publication | R-001..R-005 | GitHub checks, Pages, Release |
