# Architecture

## Summary

AI Idea Hunter is a static, local-first single-page application built with semantic HTML, CSS, and native ES modules. It has no application server, runtime dependency, account system, analytics, or external API call.

The architecture deliberately separates pure opportunity logic from browser adapters and DOM rendering. GitHub Pages hosts immutable static assets; the browser is the application runtime and trust boundary.

## Context

```text
Independent developer
        |
        v
AI Idea Hunter in browser
  |       |        |
  |       |        +----> JSON / Markdown files chosen by the user
  |       +-------------> localStorage on the same browser profile
  +---------------------> GitHub Pages (static asset download only)
```

Workspace content does not leave the browser unless the user explicitly exports a file.

## Component Boundaries

```text
src/index.html
    |
    +-- js/app.js ------------ composition and event orchestration
    +-- js/ui.js ------------- DOM rendering and accessible interaction
    +-- js/model.js ---------- entities, defaults, normalization, validation
    +-- js/scoring.js -------- pure weighted score calculation and guidance
    +-- js/storage.js -------- localStorage adapter and recovery behavior
    +-- js/export.js --------- JSON import/export and Markdown brief generation
    +-- js/i18n.js ----------- pure locale state, translation resources, interpolation
    `-- styles.css ----------- tokens, responsive layout, themes, states
```

Dependency direction is `app/ui -> model/scoring/storage/export`. Pure modules never import the DOM or browser storage. No module may write directly to storage except `storage.js`.

## Key Data Flows

### Create or update an idea

1. UI collects strings, lifecycle, and 1–5 factor values.
2. `model.js` trims, normalizes, validates, and creates a versioned entity.
3. `scoring.js` derives the visible score from validated factor values.
4. `app.js` replaces the idea in the in-memory workspace.
5. `storage.js` serializes the complete workspace.
6. UI re-renders from the saved workspace and announces the outcome.

### Import a workspace

1. UI rejects files above 1 MiB before reading.
2. `export.js` parses JSON without mutating current state.
3. `model.js` validates schema version, collection bounds, field types, lengths, enums, dates, and IDs.
4. UI shows a preview summary and asks for confirmation.
5. Only a valid, confirmed workspace replaces the current workspace.
6. A failed import leaves current data unchanged.

### Export a research brief

1. The selected idea is validated.
2. `scoring.js` returns a factor breakdown.
3. `export.js` escapes Markdown control characters and builds English or Simplified Chinese plain text from the selected locale.
4. The browser downloads a user-selected `.md` file.

### Switch interface language

1. `storage.js` loads the language preference from a key separate from the workspace document.
2. `i18n.js` normalizes the locale and resolves static and dynamic translation keys.
3. `ui.js` updates visible text, placeholders, accessibility names, date formatting, the document title, and the root `lang` attribute.
4. `app.js` re-renders derived labels without modifying user-entered idea content.
5. New fictional examples and Markdown briefs use the language selected when they are created or exported.

## Quality Attributes

### Maintainability

- No production dependencies or build step.
- Pure domain modules have deterministic Node tests.
- Browser adapters are thin and replaceable.
- Translation resources have identical key contracts and are checked by tests and static validation.
- Schema version and migrations are explicit.
- CSS uses tokens and component/state classes rather than inline styles.

### Reliability

- Workspace writes serialize a fully validated value.
- Invalid or unavailable storage falls back to an in-memory workspace with a visible warning.
- Import is validate-then-confirm, never incremental mutation.
- Deletes require confirmation; full JSON export provides user-controlled backup.

### Security and Privacy

- User content is rendered with `textContent` or safe DOM properties, never injected with `innerHTML`.
- Content Security Policy restricts sources to the application origin and disallows object embedding.
- No credentials, model keys, trackers, remote fonts, or third-party scripts.
- Imported data is untrusted and bounded by size, count, length, enum, and schema checks.
- GitHub Actions use minimum permissions and immutable action SHAs.

### Accessibility

- Native controls and landmarks are preferred over custom widgets.
- Dialog focus is contained and restored; Escape closes non-destructive dialogs.
- Visible focus, status announcements, form errors, reduced motion, and responsive reflow are required.
- Color is never the only carrier of score, lifecycle, error, or evidence strength.

### Performance

- Static assets target less than 250 KB uncompressed in total.
- No client framework, runtime package download, remote font, or image-heavy hero.
- Filtering and scoring operate over a bounded maximum of 500 ideas.

## Deployment

```text
Pull request -> CI checks -> protected main -> Pages workflow
                                            |
                                            v
                                  GitHub Pages artifact
```

Pull requests run static validation and Node tests. A successful push to protected `main` packages only `src/` and deploys it through the `github-pages` environment.

## Observability

The product has no telemetry in `v1.0.0`. User-facing status messages report save, import, export, and storage failures without exposing content. CI and Pages deployment logs provide operational evidence for the hosted static assets.

## Failure and Recovery

| Failure | User behavior | Recovery |
| --- | --- | --- |
| localStorage unavailable or full | App continues in memory and shows a persistent warning | Export JSON before closing; free browser storage and retry |
| Stored JSON invalid | Invalid value is quarantined; an empty workspace opens with warning | Import a known-good backup or clear corrupted data |
| Invalid import | Current workspace is unchanged | Correct the file or select another backup |
| Pages deployment failure | Last successful deployment remains available | Fix the workflow and redeploy from `main` |
| Browser data cleared | Local workspace is lost | Restore from an exported JSON backup |

## Evolution Rules

- A server, authentication, cloud sync, remote AI model, telemetry, or shared workspace changes the trust boundary and requires explicit approval plus a new ADR.
- Schema changes require a migration, backward-compatibility tests, and a version increment.
- New lifecycle states or score factors require product acceptance criteria and score migration behavior.

See [ADR-0001](adr/0001-local-first-native-web.md) for the primary architecture decision.
