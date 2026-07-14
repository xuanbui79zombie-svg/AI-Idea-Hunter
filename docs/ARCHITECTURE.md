# Architecture

## Summary

AI Idea Hunter is a static, local-first single-page application built with semantic HTML, CSS, and native ES modules. A scheduled GitHub Actions build-time pipeline collects bounded public signals and uses GitHub Models to publish a source-linked candidate feed with the Pages artifact. The browser still has no application server, account system, analytics, or exposed model credential.

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

Workspace content does not leave the browser unless the user explicitly exports a file. The browser downloads only the same-origin public candidate feed; collection and model analysis cannot access localStorage.

```text
Approved public APIs ---> GitHub Actions collector ---> GitHub Models
        |                         |                         |
        `---------------- untrusted public text -----------'
                                  |
                         validated candidate JSON
                                  |
                            GitHub Pages artifact
                                  |
                        browser read-only candidate feed
                                  |
                         explicit save to localStorage
```

## Component Boundaries

```text
src/index.html
    |
    +-- js/app.js ------------ composition and event orchestration
    +-- js/ui.js ------------- DOM rendering and accessible interaction
    +-- js/model.js ---------- entities, defaults, normalization, validation
    +-- js/scoring.js -------- pure weighted score calculation and guidance
    +-- js/radar.js ---------- pure SVG point geometry for score visualization
    +-- js/storage.js -------- localStorage adapter and recovery behavior
    +-- js/export.js --------- JSON import/export and Markdown brief generation
    +-- js/discovery.js ------ candidate-feed validation, loading, and local idea mapping
    +-- js/i18n.js ----------- pure locale state, translation resources, interpolation
    `-- styles.css ----------- tokens, responsive layout, themes, states
```

Dependency direction is `app/ui -> model/scoring/radar/storage/export`. Pure modules never import the DOM or browser storage. No module may write directly to storage except `storage.js`.

Build-time modules under `scripts/discovery/` own public source adapters, normalization, prompt construction, model response validation, fallback analysis, and feed serialization. They never import browser storage or UI modules.

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

### Inspect a score

1. A saved-idea score button sends the selected idea ID to `app.js`.
2. `scoring.js` returns the same seven-factor breakdown used by exports and card summaries.
3. `radar.js` converts the validated 1–5 values into deterministic SVG polygon coordinates.
4. `ui.js` renders localized SVG labels and seven semantic detail cards using safe DOM APIs.
5. The native dialog traps focus; Escape or either close control restores focus to the originating score button.

### Switch interface language

1. `storage.js` loads the language preference from a key separate from the workspace document.
2. `i18n.js` normalizes the locale and resolves static and dynamic translation keys.
3. `ui.js` updates visible text, placeholders, accessibility names, date formatting, the document title, and the root `lang` attribute.
4. `discovery.js` selects the validated English base or Simplified Chinese localization for every generated candidate while preserving original source quotations and URLs.
5. `app.js` re-renders derived labels and discovered content without modifying user-entered idea content.
6. New fictional examples, saved discovered candidates, and Markdown briefs use the language selected when they are created, saved, or exported.

### Refresh and review discovered candidates

1. A daily or manually triggered Pages workflow requests a bounded set of public Hacker News items and public GitHub Issues.
2. Source adapters reduce responses to plain-text identifiers, titles, excerpts, timestamps, and canonical HTTPS URLs.
3. GitHub Models receives untrusted public text inside an explicit data boundary and returns English plus natural Simplified Chinese candidate fields; the collector validates every localized field, score, source ID, and URL.
4. If AI inference fails, deterministic fallback analysis produces clearly labelled provisional candidates instead of fabricating AI success.
5. The validated feed is generated only in the deployment workspace and included in the immutable Pages artifact; it is not committed to `main`.
6. The browser fetches the same-origin feed, validates it again, and renders content with safe DOM properties.
7. Saving a candidate maps it to the existing `Idea` input and passes through `createIdea` plus complete workspace validation before local persistence.

## Quality Attributes

### Maintainability

- No production dependencies; deployment adds a zero-dependency data-generation step.
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
- No credentials, model keys, trackers, remote fonts, or third-party scripts are shipped to the browser.
- The build job uses the ephemeral `GITHUB_TOKEN` with `models: read`; Pages deployment retains only the existing minimum deployment permissions.
- Source text is untrusted prompt data, never instructions. Model output is untrusted and schema-validated before publication.
- Browser network access is restricted by CSP to same-origin assets, including the generated candidate feed.
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
| Public source unavailable | Other sources continue; coverage is recorded in the feed | Retry on the next schedule or manual workflow dispatch |
| GitHub Models unavailable or invalid | Feed is labelled `fallback` and uses bounded deterministic analysis | Inspect workflow logs and rerun without affecting the local workspace |
| Candidate feed unavailable or invalid | Discovery section shows an unavailable state | Continue using all local workspace features |
| Browser data cleared | Local workspace is lost | Restore from an exported JSON backup |

## Evolution Rules

- A server, authentication, cloud sync, remote AI model, telemetry, or shared workspace changes the trust boundary and requires explicit approval plus a new ADR.
- New collection sources require an approved API/access review, bounded fields and volume, provenance, failure behavior, and an ADR update when the trust boundary changes.
- Schema changes require a migration, backward-compatibility tests, and a version increment.
- New lifecycle states or score factors require product acceptance criteria and score migration behavior.

See [ADR-0001](adr/0001-local-first-native-web.md) for the primary architecture decision.
See [ADR-0002](adr/0002-build-time-automated-discovery.md) for the automated discovery boundary.
