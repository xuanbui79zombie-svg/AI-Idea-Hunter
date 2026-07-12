# Portfolio and Interview Review

## Career Value Conclusion

AI Idea Hunter is portfolio-ready as an independently delivered product and engineering case study. It demonstrates scope control, product reasoning, explainable domain logic, local-first architecture, safe data boundaries, accessible frontend work, automated testing, CI/CD, open-source governance, and release ownership.

It does not yet prove external adoption, revenue, retention, or validated commercial demand. Those claims must wait for real evidence.

## Evidence Map

| Capability | Repository evidence |
| --- | --- |
| Product design | User, problem, non-goals, requirements, scoring model, and release criteria in `docs/PRODUCT.md` |
| Architecture | Local-first decision, module boundaries, data flow, failure recovery, and ADR-0001 |
| Frontend engineering | Responsive native web application, safe DOM rendering, themes, dialogs, and accessibility behavior |
| Data engineering | Versioned schema, bounded validation, atomic import, quarantine, backup, and restore |
| Quality engineering | 24 tests, 111 assertions, browser matrix, static/security checks, and `docs/TEST_REPORT.md` |
| DevOps | Pinned-SHA CI, protected main, GitHub Pages artifact deployment, and release evidence |
| Open source | MIT license, contribution guide, conduct policy, support, security, issue forms, and PR template |

## Strongest Technical Decisions

1. Chose a static local-first architecture because accounts, cloud sync, and shared workspaces were non-goals.
2. Kept scoring deterministic and visible instead of hiding prioritization behind a model call.
3. Separated pure model, scoring, storage, export, UI, and orchestration modules without adding a framework.
4. Treated imported and stored data as untrusted, with explicit bounds and recovery behavior.
5. Used zero runtime and development dependencies while retaining repeatable Node tests and CI.

## Resume Bullet Drafts

- Designed and shipped a local-first opportunity discovery web app that converts problem observations and evidence into transparent seven-factor scores and exportable research briefs.
- Built a zero-dependency ES module architecture with versioned local persistence, bounded JSON validation, atomic restore, corruption quarantine, and safe Markdown export.
- Established a release-quality open-source workflow with 24 automated tests, 111 assertions, pinned GitHub Actions, protected branches, security reporting, and GitHub Pages deployment.
- Diagnosed and fixed responsive, accessibility, import consistency, focus recovery, and browser-download timing defects through risk-based browser and security review.

These bullets intentionally avoid user, revenue, speed, or adoption claims because those outcomes have not been measured.

## Interview Narrative

### Situation

Independent developers often collect many software ideas but lack a consistent way to separate observed pain from assumed solutions.

### Task

Deliver a public MVP that improves prioritization quality without requiring accounts, cloud infrastructure, analytics, or browser-exposed model keys.

### Action

Defined an evidence-first workflow and transparent scoring model; selected a static local-first architecture; implemented pure domain modules and safe browser adapters; created automated and browser tests; then published through protected GitHub workflows.

### Result

Released a reproducible `v1.0.0` application and public demo with passing quality gates, 84 KB of application assets, zero package dependencies, and documented residual risks. External product value remains a post-release validation question.

## Likely Interview Questions

- Why not use React or a backend?
- How do you prevent corrupted imports or stored data from breaking the workspace?
- Why is the opportunity score trustworthy, and what can it not prove?
- How would you add multi-device sync without exposing private research data?
- What would trigger adding an AI model, and where would the trust boundary move?
- Which tests caught real defects, and what remains unverified?

## Next Evidence Priorities

| Priority | Action | Acceptance evidence |
| --- | --- | --- |
| P0 | Run three consent-based usability sessions | Task notes, observed failures, and prioritized findings |
| P1 | Verify current Firefox and Safari | Updated compatibility matrix with version and result |
| P1 | Measure whether users can explain their ranking | Baseline result without invented improvement claims |
| P2 | Add comparison only if users struggle with shortlist decisions | Accepted PRD change and new tests |
| P3 | Evaluate model-assisted critique only after secure server approval | Threat model, cost model, privacy decision, and ADR |
