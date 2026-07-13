# Product Requirements

## Product Conclusion

AI Idea Hunter is a local-first opportunity workspace for independent developers. It turns scattered observations about user problems into structured, evidence-backed AI software ideas that can be compared, prioritized, and exported as an actionable project brief.

The first release optimizes for decision quality, not idea volume. It does not claim that a score proves market demand.

## Status and Evidence Boundary

- Product stage: `v1.0.0` released; M7 external usability validation in progress
- Current release: `v1.0.0`
- Confirmed fact: independent developers need a repeatable way to organize and compare ideas in this project context.
- Working assumption: structured evidence and explicit scoring reduce impulsive project selection.
- Unknown: whether external users will adopt the scoring model without customization.
- Validation rule: user counts, time savings, conversion, and satisfaction must not be claimed until measured.

## Target Users and Jobs

| Segment | Situation | Job to be done | Current alternative |
| --- | --- | --- | --- |
| Independent developer | Choosing the next portfolio or commercial project | Compare ideas using the same evidence and criteria | Notes, spreadsheets, intuition |
| AI product builder | Collecting repeated workflow pain points | Turn observations into testable opportunity briefs | Chat threads and disconnected documents |
| Career-focused developer | Building a differentiated portfolio | Select an idea with technical, commercial, and resume value | Tutorial lists and trend chasing |

The primary user for `v1.0.0` is a single independent developer working on one device.

## Problem Definition

Potential software ideas often arrive as unstructured fragments. They mix a proposed solution with an assumed problem, omit evidence, and use inconsistent criteria. The result is a backlog that is large but difficult to trust.

AI Idea Hunter creates a deliberate sequence:

1. capture the observed problem before proposing a solution;
2. record evidence and uncertainty;
3. score the opportunity with transparent criteria;
4. compare ideas consistently;
5. export a research brief for validation or implementation planning.

## Value Proposition

For independent developers who have more ideas than delivery capacity, AI Idea Hunter provides a private, zero-setup decision workspace that exposes assumptions and ranks opportunities. Unlike a generic note app, it requires problem evidence, explains every score, and produces a reusable brief.

## Product Goals

- Make one idea capturable in less than two minutes after the interface is understood.
- Make every ranking traceable to visible user inputs and a documented formula.
- Keep all default data on the user's device and support complete JSON export and import.
- Produce a Markdown brief suitable for discovery interviews, a project issue, or AI-assisted research.
- Deliver a responsive and keyboard-usable experience without account creation.

## Non-Goals

- Generating unlimited ideas from trends or scraping external sources.
- Claiming market validation, revenue potential, or product-market fit from a score.
- Multi-user collaboration, authentication, cloud sync, or a hosted database.
- Calling a paid model API or asking users to expose an API key in the browser.
- Building project management, source control, billing, CRM, or analytics features.
- Replacing interviews, competitor research, prototypes, or real usage evidence.

## Core User Flow

1. The user opens an empty workspace and sees the scoring model and privacy behavior.
2. The user creates an idea from an observed problem, audience, context, and proposed outcome.
3. The user records one or more evidence notes and marks each note's strength.
4. The user scores pain, frequency, willingness to pay, reach, feasibility, differentiation, and evidence confidence.
5. The application calculates an opportunity score and explains the contribution of each factor.
6. The user filters or sorts the portfolio and opens the strongest candidate.
7. The user updates its lifecycle stage or exports a Markdown research brief.
8. The user can export the full workspace to JSON and restore it later.

## Lifecycle

`Inbox -> Researching -> Validated -> Selected -> Archived`

Lifecycle status is a workflow marker, not proof of market validation. Moving an idea to `Validated` remains a user decision and should reference evidence notes.

## Scoring Model

Each factor uses a 1–5 scale with plain-language guidance.

| Factor | Weight | High score means |
| --- | ---: | --- |
| Pain severity | 20% | The problem causes meaningful cost, delay, risk, or frustration |
| Frequency | 15% | The problem occurs repeatedly in the target workflow |
| Willingness to pay | 15% | There is credible budget or strong substitution value |
| Reach | 10% | The reachable audience is sufficiently broad for the goal |
| Feasibility | 15% | A useful MVP can be delivered with available skills and resources |
| Differentiation | 10% | The proposed outcome is meaningfully better than alternatives |
| Evidence confidence | 15% | Claims are backed by strong, relevant observations |

The normalized score is:

`round(sum(factor score * factor weight) / 5)`

The result ranges from 20 to 100. The interface must show the formula, factor values, and guidance. No hidden AI ranking is permitted in the MVP.

## Functional Requirements

| ID | Priority | Requirement | Acceptance criteria |
| --- | --- | --- | --- |
| FR-001 | P0 | Create an idea | Required fields are validated; a saved idea appears immediately in the portfolio |
| FR-002 | P0 | Edit and delete an idea | Changes persist after reload; deletion requires explicit confirmation |
| FR-003 | P0 | Score an idea | Seven factors accept 1–5; the score and explanation update deterministically |
| FR-004 | P0 | Manage evidence notes | Notes include source/context, observation, strength, and date; notes can be removed |
| FR-005 | P0 | Browse the portfolio | Users can search, filter by lifecycle, and sort by score or update time |
| FR-006 | P0 | View an opportunity dashboard | Counts, average score, top candidate, and evidence gaps reflect current data |
| FR-007 | P0 | Persist locally | Valid workspace data survives page reload without a server |
| FR-008 | P0 | Export and import JSON | Export includes a schema version; valid imports replace data only after confirmation; invalid files do not mutate data |
| FR-009 | P0 | Export a Markdown brief | The output includes problem, audience, outcome, score breakdown, evidence, assumptions, and next validation steps |
| FR-010 | P0 | Explain privacy and scoring | The interface states where data lives and how scores are calculated |
| FR-011 | P1 | Seed an example | A deliberate demo action adds sample data; first launch does not silently add it |
| FR-012 | P1 | Support light and dark themes | Theme follows system by default and can be toggled with a persisted preference |
| FR-013 | P1 | Provide keyboard-efficient interaction | Dialogs, forms, controls, and navigation work without a pointer |
| FR-014 | P2 | Compare selected ideas side by side | Deferred until ranking behavior is validated |
| FR-015 | P3 | Optional model-assisted brief critique | Deferred; requires a secure server-side integration and explicit architecture approval |

## Non-Functional Requirements

| Category | Requirement | Release target |
| --- | --- | --- |
| Performance | Fast startup and immediate local interactions | Initial application assets under 250 KB uncompressed; input response under 100 ms on a typical laptop |
| Reliability | User actions must not corrupt stored data | Schema validation, atomic import, deterministic score tests, recoverable empty state |
| Privacy | No default network transfer of workspace content | No analytics, trackers, remote fonts, or external runtime requests |
| Security | Treat imported content as untrusted | No `innerHTML` for user content; file size limit; validated schema; no secrets |
| Accessibility | Support keyboard and assistive technology | Semantic landmarks, visible focus, labelled controls, status announcements, contrast-conscious palette |
| Compatibility | Work as a static site | Current stable Chrome, Edge, Firefox, and Safari; responsive from 360 px width |
| Maintainability | Keep business logic independent from the DOM | Pure modules for model, scoring, persistence validation, and export |

## Success Metrics

These are release and validation targets, not measured outcomes.

| Metric | Baseline | Target | Measurement method |
| --- | ---: | ---: | --- |
| P0 acceptance coverage | 0% | 100% | Requirement-to-test matrix |
| Automated core-logic tests | 0 | At least 30 assertions | Node test report |
| Critical accessibility defects | Unknown | 0 known | Automated and manual keyboard review |
| Unhandled data-loss paths | Unknown | 0 known | Import, delete, storage, and recovery tests |
| First external usability sessions | 0 | 3 after release | Consent-based notes; no fabricated results |
| Users who can choose a top idea without help | Unknown | Establish baseline after release | Task-based usability session |

## MVP Release Acceptance

`v1.0.0` is releasable only when:

- all P0 requirements pass automated or documented manual tests;
- the application works from a clean browser profile and from GitHub Pages;
- JSON round-trip preserves supported data and rejects invalid imports safely;
- keyboard navigation covers the complete create, score, filter, export, and delete flow;
- repository documentation, screenshots, license, security policy, changelog, and release notes are current;
- no secret or personal data is committed;
- all required GitHub checks pass.

## Assumptions, Risks, and Validation

| Type | Statement | Validation or response |
| --- | --- | --- |
| Assumption | Users accept explicit manual scoring | Observe three usability sessions and ask users to explain a ranking |
| Assumption | Local-only data is sufficient for an MVP | Track requests for sync without promising it |
| Risk | A numeric score creates false confidence | Show inputs and caveats; require evidence; avoid predictive language |
| Risk | Local storage can be cleared by the browser | Provide JSON export, clear warnings, and recovery guidance |
| Risk | Rich features turn the product into project management | Enforce non-goals and keep lifecycle deliberately small |
| Risk | Future model integration exposes secrets or user data | Require a server-side trust boundary and a new ADR before implementation |

## Milestones

| Milestone | Outcome | Exit condition |
| --- | --- | --- |
| M1 Product | Stable MVP scope and acceptance criteria | This document reviewed against assumptions and non-goals |
| M2 Architecture | Technology, modules, data schema, security, and deployment decided | Architecture docs and ADRs complete |
| M3 Plan | Executable work items with priorities and dependencies | `TASKS.md` has acceptance-linked tasks |
| M4 Build | Complete local vertical slices | P0 features implemented and documented |
| M5 Quality | Release evidence and resolved blockers | Automated checks and browser review pass |
| M6 Release | Public, reproducible portfolio project | GitHub Pages, `v1.0.0`, release notes, and repository packaging complete |
| M7 User validation | Evidence about independent task completion and score comprehension | Three eligible sessions synthesized; critical findings resolved or explicitly accepted |
