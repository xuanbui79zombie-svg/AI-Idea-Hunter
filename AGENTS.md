# AGENTS.md

This file defines the working contract for Codex and other automated development agents in AI Idea Hunter. Read `README.md`, `PROJECT_RULES.md`, `TASKS.md`, `docs/PRODUCT.md`, and `docs/ARCHITECTURE.md` before changing code.

## Project Goal

Help an independent developer turn observed problems into evidence-backed, comparable AI software opportunities through transparent scoring and exportable research briefs.

The product must remain local-first, explainable, and static-hostable. ADR-0002 permits build-time collection of approved public signals and model analysis, while private workspace content must never leave the browser.

## Codex Working Rules

1. Map every implementation task to an accepted requirement and task ID.
2. Preserve the product non-goals, ADR-0001, and ADR-0002 unless the user approves a major architecture change.
3. Prefer pure domain functions and existing browser standards over new dependencies.
4. Treat imported files, stored values, and all user strings as untrusted data.
5. Never use `innerHTML` with user content or add credentials, analytics, remote fonts, or third-party scripts.
6. Keep the working tree scoped; do not overwrite unrelated user changes.
7. Report product, data-loss, security, accessibility, deployment, and maintenance risks as soon as they are found.
8. Real-user validation is opt-in. Do not recruit, contact, schedule, or collect data from participants unless the project owner explicitly requests it for this project.

## Development Flow

1. Move one accepted task from `TODO` to `DOING`.
2. Read its requirement, architecture contract, and acceptance criteria.
3. Implement the smallest complete vertical slice.
4. Add or update tests before calling the task complete.
5. Run `npm run check` and `npm test`.
6. Manually verify the affected browser flow when DOM behavior changes.
7. Update relevant docs, `CHANGELOG.md`, and task status.
8. Review the diff for secrets, unsafe rendering, unrelated changes, and broken links.
9. Use a focused commit and a pull request once the remote repository exists.

## Test Requirements

- Scoring, validation, normalization, import, export, and persistence behavior require automated tests.
- Bug fixes require a failing regression test before or with the fix.
- Import failure, storage failure, deletion, empty state, keyboard interaction, and narrow viewport behavior require explicit coverage.
- Never delete, skip, or weaken a test to hide a failure.
- If a check cannot run, document the exact reason and remaining risk.
- Automated, functional, security, privacy, accessibility, compatibility, performance, and deployment checks remain required even when real-user validation is not requested.
- Record skipped real-user validation as `SKIPPED`, never as passed or completed, and never infer adoption, usability, satisfaction, or market demand from its absence.

## Documentation Requirements

- User behavior or setup changes: update `README.md`.
- Scope or acceptance changes: update `docs/PRODUCT.md`.
- boundaries or deployment changes: update `docs/ARCHITECTURE.md` and an ADR when durable.
- schema changes: update `docs/DATABASE.md` and migration tests.
- module contract changes: update `docs/API.md`.
- tooling changes: update `TECH_STACK.md`.
- maintainer- or user-visible changes: update `CHANGELOG.md`.
- every completed milestone: update `TASKS.md` and the README status.

## Git Rules

- `main` must remain releasable and protected after publication.
- Use short-lived `agent/`, `feature/`, `fix/`, `docs/`, or `chore/` branches.
- Each commit represents one logical outcome and uses an imperative subject.
- Pull requests state scope, evidence, risks, and rollback.
- Do not force-push shared history, commit secrets, or bypass required checks.
