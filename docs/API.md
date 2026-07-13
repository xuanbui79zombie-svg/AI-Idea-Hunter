# Module Contracts

AI Idea Hunter has no HTTP API in `v1.0.0`. This document defines stable internal ES module contracts so domain behavior remains testable without a browser DOM.

## `model.js`

| Export | Input | Output | Failure |
| --- | --- | --- | --- |
| `createEmptyWorkspace()` | none | valid schema v1 workspace | none |
| `createIdea(input, now?)` | form-shaped object | normalized `Idea` | throws `ValidationError` |
| `updateIdea(existing, patch, now?)` | idea and allowed fields | normalized updated `Idea` | throws `ValidationError` |
| `validateWorkspace(value)` | unknown | normalized workspace | throws `ValidationError` with field issues |
| `createExampleWorkspace(language?)` | optional supported locale | deterministic localized demonstration workspace | none |

Validation errors contain safe field identifiers and human-readable messages. They never include full imported content.

## `scoring.js`

| Export | Input | Output |
| --- | --- | --- |
| `calculateScore(scores)` | seven validated 1–5 integers | integer from 20 to 100 |
| `getScoreBreakdown(scores)` | score object | factor labels, values, weights, and contributions |
| `getScoreBand(score)` | 20–100 integer | `explore`, `promising`, or `priority` descriptor |
| `getEvidenceGap(idea)` | valid idea | plain-language next evidence recommendation |
| `getEvidenceGapKey(idea)` | valid idea | locale-independent recommendation key |

Scoring functions are pure and must not read storage, time, locale, or the DOM.

## `storage.js`

| Export | Behavior |
| --- | --- |
| `loadWorkspace(storage?)` | returns `{ workspace, warning }`; quarantines malformed stored JSON when possible |
| `saveWorkspace(workspace, storage?)` | validates then writes; returns `{ saved, warning }` without hiding storage failure |
| `clearWorkspace(storage?)` | removes only the application workspace key |
| `loadLanguage(storage?, browserLanguage?)` | returns a normalized persisted or browser-derived locale |
| `saveLanguage(language, storage?)` | writes the separate locale preference and reports failure without blocking the UI |

The optional storage argument enables deterministic tests with an in-memory adapter.

## `export.js`

| Export | Behavior |
| --- | --- |
| `serializeWorkspace(workspace)` | returns formatted, versioned JSON from validated data |
| `parseWorkspaceFile(text)` | enforces text and schema bounds before returning normalized data |
| `buildResearchBrief(idea, language?)` | returns localized Markdown with score breakdown, evidence, assumptions, and next step |
| `safeFilename(value)` | returns a lowercase portable filename segment |
| `downloadText(name, text, type)` | browser adapter that downloads a Blob and revokes the object URL |

## `ui.js`

`ui.js` owns DOM queries, view rendering, dialogs, focus management, form serialization, language application, errors, and live-region announcements. It accepts state and callbacks from `app.js`; it does not access localStorage.

## `i18n.js`

| Export | Behavior |
| --- | --- |
| `normalizeLanguage(language)` | maps Chinese locale variants to `zh-CN` and unsupported values to `en` |
| `setLanguage(language)` / `getLanguage()` | manage the in-memory interface locale |
| `t(key, variables?)` | resolves and interpolates a key in the current locale |
| `translateFor(language, key, variables?)` | resolves a key for an explicit locale without changing state |
| `translationKeys(language?)` | exposes the deterministic contract used by quality checks |

## `app.js`

`app.js` is the composition root. It owns in-memory state, routes user intents to pure modules or adapters, persists successful changes, and asks `ui.js` to render. No business rule should exist only inside an event handler.

## `discovery.js`

| Export | Behavior |
| --- | --- |
| `validateDiscoveryFeed(value)` | returns a bounded normalized public feed or throws a safe validation error |
| `loadDiscoveryFeed(url?)` | fetches only a same-origin JSON feed and returns an explicit `ready`, `empty`, or `unavailable` result |
| `candidateToIdeaInput(candidate)` | maps one validated public candidate to an `inbox` idea input with weak/moderate source evidence |

## Build-Time Discovery Modules

Modules under `scripts/discovery/` expose pure normalization, deduplication, model-prompt, response-validation, fallback-analysis, and feed-building functions. Network adapters accept injected `fetch` implementations for deterministic tests. The command entry point writes only the configured deployment output.

## Compatibility

Internal exports are not a public package API, but tests and documentation treat them as stable within a minor release. Breaking changes require updated tests, docs, and changelog entries.
