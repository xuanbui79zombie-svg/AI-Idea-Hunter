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
| M4 Build | Complete P0/P1 application behavior | TODO | implementation commits and tests |
| M5 Quality | Independent release evidence with no P0/P1 defects | TODO | `docs/TEST_REPORT.md` and CI |
| M6 Release | Public demo, repository governance, and `v1.0.0` | TODO | GitHub Pages and Release |

## TODO

| ID | Priority | Milestone | Task | Requirements | Depends on | Acceptance evidence |
| --- | --- | --- | --- | --- | --- | --- |
| B-001 | P0 | M4 | Build semantic application shell and responsive design system | FR-010, FR-013 | M3 | Landmarks, navigation, empty state, dialog shell, 360 px reflow, visible focus |
| B-002 | P0 | M4 | Implement workspace model, normalization, limits, and validation | FR-001, FR-002, FR-007, FR-008 | B-001 | Pure tests cover valid, invalid, boundary, duplicate ID, and timestamp cases |
| B-003 | P0 | M4 | Implement transparent scoring and evidence-gap guidance | FR-003, FR-010 | B-002 | Formula, bands, breakdown, and boundary tests pass |
| B-004 | P0 | M4 | Implement storage adapter and recovery behavior | FR-007 | B-002 | Save/load, unavailable storage, corrupted data, and quarantine tests pass |
| B-005 | P0 | M4 | Implement idea create, edit, delete, and lifecycle flows | FR-001, FR-002 | B-002, B-003, B-004 | Full CRUD persists; validation and delete confirmation are visible |
| B-006 | P0 | M4 | Implement evidence note management | FR-004 | B-005 | Add/remove evidence with source, observation, strength, and date |
| B-007 | P0 | M4 | Implement dashboard, portfolio cards, search, filters, and sorting | FR-005, FR-006 | B-005 | Counts and ranking react to state; empty/no-result states work |
| B-008 | P0 | M4 | Implement JSON backup/restore and Markdown brief export | FR-008, FR-009 | B-002, B-003, B-004 | Round-trip, invalid import atomicity, size limit, filename, and brief tests pass |
| B-009 | P1 | M4 | Implement example workspace and first-run guidance | FR-011 | B-005, B-007 | Example is explicit, removable, deterministic, and labelled as fictional |
| B-010 | P1 | M4 | Implement system/light/dark theme preference | FR-012 | B-001, B-004 | System default and persisted override work without flash-sensitive animation |
| B-011 | P1 | M4 | Complete keyboard, dialog focus, form error, and live-region behavior | FR-013 | B-005, B-006, B-008 | Complete core flow works without pointer and returns focus correctly |
| Q-001 | P0 | M5 | Build static repository and security checks | NFR Security, Maintainability | B-001 | Checks reject unsafe HTML APIs, external runtime URLs, placeholders, and oversized assets |
| Q-002 | P0 | M5 | Complete automated domain and adapter tests | All P0 | B-002..B-010 | At least 30 assertions and all requirement-critical branches pass |
| Q-003 | P0 | M5 | Execute browser functional regression | All P0 | B-011, Q-002 | Clean-profile create, edit, score, filter, export, import, delete flow passes |
| Q-004 | P0 | M5 | Execute accessibility and responsive review | Accessibility NFR | B-011 | Keyboard, focus, labels, landmarks, contrast, reduced motion, and 360 px checks pass |
| Q-005 | P1 | M5 | Verify performance and privacy budgets | Performance, Privacy NFR | Q-001 | Assets under 250 KB; no external runtime requests or trackers |
| Q-006 | P0 | M5 | Publish release test report and resolve blockers | Release acceptance | Q-001..Q-005 | Test matrix documents environment, results, limitations, and release recommendation |
| R-001 | P0 | M6 | Add pinned-SHA CI and GitHub Pages workflows | Release acceptance | Q-001, Q-002 | PR CI and main deployment workflows validate successfully |
| R-002 | P0 | M6 | Create and secure the public GitHub repository | Open-source standard | R-001 | Topics, security features, private reporting, labels, and protected main configured |
| R-003 | P0 | M6 | Publish reproducible GitHub Pages demo | Release acceptance | R-001, R-002, Q-006 | Public URL loads current release and core flow works |
| R-004 | P0 | M6 | Complete README, screenshot, contributing, security, support, and changelog packaging | Portfolio standard | Q-006, R-003 | All commands and links verified; claims match evidence |
| R-005 | P0 | M6 | Publish signed-off `v1.0.0` GitHub Release | Release acceptance | R-004 | Annotated tag, release notes, source archive, and final checks available |
| F-001 | P2 | Future | Compare selected ideas side by side | FR-014 | Post-release validation | Reassess after usability evidence |
| F-002 | P3 | Future | Evaluate secure server-side model critique | FR-015 | Explicit architecture approval | New PRD scope, threat model, cost analysis, and ADR required |

## DOING

No task is active at the M3 checkpoint. M4 begins with `B-001` and `B-002`.

## DONE

| ID | Priority | Milestone | Task | Evidence |
| --- | --- | --- | --- | --- |
| P-001 | P0 | M1 | Define users, problem, value, scope, requirements, scoring, and release criteria | `docs/PRODUCT.md`, `d8589bd` |
| A-001 | P0 | M2 | Define local-first native web architecture and data trust boundary | `docs/ARCHITECTURE.md`, ADR-0001, `a339e7e` |
| A-002 | P0 | M2 | Define schema, module contracts, tooling, security, and deployment | `docs/DATABASE.md`, `docs/API.md`, `TECH_STACK.md` |
| T-001 | P0 | M3 | Create requirement-linked implementation, quality, and release plan | This document |

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
| Keyboard and accessibility | B-001, B-011 | Q-004 |
| Security, privacy, and performance | Q-001, Q-005 | Q-006 |
| Publication | R-001..R-005 | GitHub checks, Pages, Release |
