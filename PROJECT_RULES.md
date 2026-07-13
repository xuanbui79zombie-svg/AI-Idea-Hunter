# Project Rules

## Architecture Rules

- Keep `model`, `scoring`, and serialization logic independent from the DOM and localStorage.
- `app.js` is the composition root; `ui.js` owns DOM behavior; `storage.js` is the only localStorage adapter.
- Persist source inputs, not derived opportunity scores.
- Preserve the versioned workspace boundary and validate before every import or write.
- A backend, authentication, cloud sync, telemetry, or model API requires user approval and a new ADR. The approved build-time GitHub Models exception is defined by ADR-0002; browser-side model calls remain prohibited.

## Code Rules

- Use native ES modules, descriptive names, small functions, and explicit return values.
- Prefer immutable array/object updates at state boundaries.
- Centralize limits, score factors, lifecycle values, and storage keys as exported constants.
- Use `textContent`, `setAttribute`, and safe properties for user-controlled content.
- Handle expected failures with useful UI messages; do not silently swallow errors.
- Keep application assets below the documented performance budget.

## Change Process

1. Link the change to a requirement and task.
2. Define validation and failure behavior before implementation.
3. Update domain logic, adapters, UI, tests, and documentation together.
4. Run static checks, unit tests, browser checks, and `git diff --check` as applicable.
5. Record user-visible or maintainer-visible changes in the changelog.
6. Use PR review and required CI after GitHub publication.

## Prohibited Actions

- No secrets, browser-exposed API keys, personal data, production data, or hidden telemetry.
- No `eval`, dynamic code execution, unsafe HTML injection, or arbitrary remote script loading.
- No framework or dependency added for preference alone.
- No score described as proof of market demand or revenue.
- No schema change without migration behavior and tests.
- No direct deployment from an unreviewed or failing branch.
- No modification of core product direction or accepted major architecture without user approval.
- No participant recruitment, outreach, user session, consent collection, or participant-data handling unless the project owner explicitly opts this project into real-user validation.
- No skipped or unexecuted user validation described as passed, completed, or evidence of user or market outcomes.
