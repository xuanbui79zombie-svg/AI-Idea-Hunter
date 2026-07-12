# Module Contracts

AI Idea Hunter has no HTTP API in `v1.0.0`. This document defines stable internal ES module contracts so domain behavior remains testable without a browser DOM.

## `model.js`

| Export | Input | Output | Failure |
| --- | --- | --- | --- |
| `createEmptyWorkspace()` | none | valid schema v1 workspace | none |
| `createIdea(input, now?)` | form-shaped object | normalized `Idea` | throws `ValidationError` |
| `updateIdea(existing, patch, now?)` | idea and allowed fields | normalized updated `Idea` | throws `ValidationError` |
| `validateWorkspace(value)` | unknown | normalized workspace | throws `ValidationError` with field issues |
| `createExampleWorkspace()` | none | deterministic demonstration workspace | none |

Validation errors contain safe field identifiers and human-readable messages. They never include full imported content.

## `scoring.js`

| Export | Input | Output |
| --- | --- | --- |
| `calculateScore(scores)` | seven validated 1–5 integers | integer from 20 to 100 |
| `getScoreBreakdown(scores)` | score object | factor labels, values, weights, and contributions |
| `getScoreBand(score)` | 20–100 integer | `explore`, `promising`, or `priority` descriptor |
| `getEvidenceGap(idea)` | valid idea | plain-language next evidence recommendation |

Scoring functions are pure and must not read storage, time, locale, or the DOM.

## `storage.js`

| Export | Behavior |
| --- | --- |
| `loadWorkspace(storage?)` | returns `{ workspace, warning }`; quarantines malformed stored JSON when possible |
| `saveWorkspace(workspace, storage?)` | validates then writes; returns `{ saved, warning }` without hiding storage failure |
| `clearWorkspace(storage?)` | removes only the application workspace key |

The optional storage argument enables deterministic tests with an in-memory adapter.

## `export.js`

| Export | Behavior |
| --- | --- |
| `serializeWorkspace(workspace)` | returns formatted, versioned JSON from validated data |
| `parseWorkspaceFile(text)` | enforces text and schema bounds before returning normalized data |
| `buildResearchBrief(idea)` | returns Markdown with score breakdown, evidence, assumptions, and next step |
| `safeFilename(value)` | returns a lowercase portable filename segment |
| `downloadText(name, text, type)` | browser adapter that downloads a Blob and revokes the object URL |

## `ui.js`

`ui.js` owns DOM queries, view rendering, dialogs, focus management, form serialization, errors, and live-region announcements. It accepts state and callbacks from `app.js`; it does not access localStorage.

## `app.js`

`app.js` is the composition root. It owns in-memory state, routes user intents to pure modules or adapters, persists successful changes, and asks `ui.js` to render. No business rule should exist only inside an event handler.

## Compatibility

Internal exports are not a public package API, but tests and documentation treat them as stable within a minor release. Breaking changes require updated tests, docs, and changelog entries.
