# Release Test Report

## Quality Conclusion

**Pass for `v1.1.0` release packaging with documented low-risk limitations.** No P0 or P1 functional, security, privacy, accessibility, data-loss, or deployment blocker is known in the tested scope.

Real-user validation is not part of the required test scope and was skipped by owner policy on 2026-07-13. This does not reduce the engineering quality gates above, and this report makes no usability, adoption, satisfaction, market-demand, or commercial claim.

Three P1 findings were discovered and resolved during review:

1. Desktop radar art collapsed to zero width because the grid item had no explicit width.
2. The mobile hero overflowed horizontally at 390 px because the display heading exceeded its grid track.
3. Escape-key close behavior depended only on the native dialog cancel event and was not reliable under automated keyboard input.

Additional review fixed duplicate dialog landmarks, restored imported theme preferences with the complete workspace, and delayed Blob URL cleanup to avoid a cross-browser download race.

## Post-release M7 Language Regression Addendum

Date: 2026-07-13.

FR-016 English/Simplified Chinese switching passed post-release regression:

- 30 automated tests passed with 0 failures, skips, or todos.
- English and Chinese expose the same translation-key contract.
- Locale normalization, placeholder interpolation, preference isolation, storage failure, Chinese fictional examples, and Chinese Markdown export have deterministic coverage.
- The interface language, document title, root `lang`, static copy, dynamic cards, filters, scoring guidance, dates, dialogs, notifications, and accessibility labels changed together.
- The selected language persisted after reload without changing the workspace JSON.
- Desktop and 390 × 844 Chinese layouts had no horizontal page overflow.
- The 390 px idea dialog and its scroll body had no horizontal overflow.
- Browser logs contained no warning or error.

The review found and fixed one P1 accessibility regression before publication: the compact mobile “new idea” control lost its accessible name when the visible text was hidden.

## M8 Automated Discovery Addendum

Date: 2026-07-13.

FR-017 through FR-020 passed release-candidate validation:

- 36 automated tests passed with 0 failures, skips, or todos.
- Deterministic fixtures cover source normalization, deduplication, prompt boundaries, structured response validation, feed validation, fallback generation, and candidate-to-workspace conversion.
- A live collection run returned 5 bounded Hacker News signals and 10 bounded public GitHub Issue signals.
- A live GitHub Models call using `openai/gpt-4o` returned 8 schema-valid candidates; a separate no-model run returned 8 deterministic fallback candidates.
- The English and Chinese discovery views exposed the same 8 candidates, provenance links, reasoning, uncertainty, freshness, source coverage, and provisional score caveats.
- One-click save increased the local workspace from 3 to 4 ideas and displayed localized success feedback.
- At 390 × 844, all 8 candidate cards and the discovery region had zero horizontal overflow.
- Browser logs contained no warning or error.
- The committed feed is an empty seed; collection and analysis happen during Pages deployment so stale test output is not published as source data.
- GitHub Quality run `29231096482` and Pages run `29231125036` passed; the production page and feed returned HTTPS 200.
- The deployed feed reported `ai` mode, `openai/gpt-4o`, 8 candidates, 5 ready Hacker News signals, 10 ready GitHub Issue signals, and HTTPS provenance for every candidate source.

Real-user validation was intentionally not performed and no market-demand conclusion is claimed from public signals or model output.

## Test Scope and Environment

- Date: 2026-07-12
- Host: Windows desktop
- Tooling: Node.js `v24.17.0`, npm `11.13.0`
- Browser: Chromium-based Codex in-app browser
- Desktop viewport: 1280 × 720
- Narrow viewport: 390 × 844 (`documentElement.clientWidth` 375)
- Data: deterministic fictional examples plus one temporary test opportunity
- Network model: local static server; application CSP allows only same-origin feed reads

## Automated Results

| Check | Result | Evidence |
| --- | --- | --- |
| Static repository checks | PASS | 27 required files, 12 application assets, 134,768 bytes |
| Node test runner | PASS | 36 tests, 0 failures/skips/todos |
| Dependency audit | PASS | 0 packages with vulnerabilities; production and development dependencies remain empty |
| Secret pattern scan | PASS | No GitHub, OpenAI, AWS, or private-key pattern found |
| Unsafe runtime API scan | PASS | No `innerHTML`, `eval`, `Function`, XHR, WebSocket, or beacon use; `fetch` is isolated to the validated same-origin discovery adapter |
| Markdown links | PASS | Local link validation included in `npm run check` |
| Git whitespace check | PASS | `git diff --check` returned no finding |

Commands:

```bash
npm run test:all
npm audit --omit=dev
git diff --check
```

## Scenario Matrix

| Priority | Scenario | Expected | Result | Evidence |
| --- | --- | --- | --- | --- |
| P0 | Empty first launch | Clear empty state and zero dashboard values | PASS | Browser DOM and visual check |
| P0 | Load examples | Two explicitly fictional ideas, updated dashboard | PASS | 2 ideas, top score 67, average 62 |
| P0 | Create opportunity | Required fields, evidence, score, and persistence | PASS | Created `Interview Insight Synthesizer`; 3 ideas after reload |
| P0 | Scoring | Deterministic 20–100 score and visible factor contributions | PASS | Unit boundaries and browser card labels |
| P0 | Search and lifecycle filter | Results match visible query and stage | PASS | Browser search/filter check |
| P0 | Delete safety | Confirmation names the idea; cancel preserves it | PASS | Browser confirmation and post-cancel heading check |
| P0 | Storage recovery | Malformed or unavailable storage opens safely | PASS | Storage adapter tests, quarantine assertion |
| P0 | JSON round-trip | Versioned data serializes, parses, and validates | PASS | Export/import unit round-trip |
| P0 | Invalid import | Size, JSON, version, and schema failures preserve current data | PASS | Parser and validation tests; app reviews before replacement |
| P0 | Markdown brief | Score, evidence, caveat, and next step are escaped and present | PASS | Export tests and browser success feedback |
| P0 | Responsive layout | No horizontal overflow at narrow target | PASS | `scrollWidth` equals `clientWidth` at 390 × 844 |
| P0 | Mobile dialog | Full-height dialog has no internal horizontal overflow | PASS | dialog body `scrollWidth` equals `clientWidth` |
| P1 | Theme behavior | System/light/dark cycle and persistence | PASS | Dark preference survived reload; default restored afterward |
| P1 | Keyboard close and focus | Escape closes idea dialog and restores opener focus | PASS | dialog closed; focus returned to `add-idea-button` |
| P1 | Browser console | No runtime warnings or errors | PASS | Browser log inspection returned an empty set |
| P1 | Accessibility structure | One banner, one main, one contentinfo; labelled controls and live status | PASS | Accessibility DOM snapshot |
| P1 | Public-source collection | Bounded official API data with explicit source failures | PASS | Fixture tests plus live Hacker News and GitHub collection |
| P1 | AI analysis | Structured, provenance-linked candidates or deterministic fallback | PASS | Live GitHub Models run and fallback pipeline tests |
| P1 | Candidate save | Explicit action enters the existing validated local workspace | PASS | Browser count changed from 3 to 4 with localized feedback |
| P1 | Discovery responsive layout | Candidate feed has no narrow-viewport horizontal overflow | PASS | 8 cards at 390 × 844; zero card or region overflow |

## Security and Privacy Review

Assets are static and hosted from one origin. Workspace data is not transmitted by application code. The browser reads only a validated same-origin public candidate feed. Imported JSON is bounded to 1 MiB, normalized, schema-validated, and applied only after confirmation. User and public-source text is rendered through safe DOM text properties. The CSP blocks cross-origin runtime connections and remote executable assets.

Collection and model calls run only in GitHub Actions with an ephemeral workflow token and minimum `contents`, `pages`, `id-token`, and `models` permissions. Source text is explicitly delimited as untrusted data, model output is JSON-parsed and schema-validated, and failures produce a deterministic fallback or honest empty state. Authentication, browser sessions, hosted databases, CSRF, and browser-exposed API credentials remain out of scope.

## Requirements Coverage

All P0 functional requirements have deterministic domain coverage and/or browser evidence. The P1 example, theme, and keyboard requirements were also exercised. Product claims remain limited to implemented behavior; no external user adoption or commercial outcome is claimed.

## Remaining Limitations

- Firefox and Safari were not available in the current Windows test environment. The application uses standard APIs, but release evidence is Chromium-based; cross-browser verification remains a P2 follow-up.
- Browser automation could verify export feedback and the generated content independently but did not inspect the operating-system download destination.
- The browser automation surface could not drive the native file picker. Import parsing, validation, replacement confirmation, and atomicity are covered below the picker boundary.
- Two open tabs can overwrite the same localStorage document. This is a documented single-user MVP limitation.
- Browser clearing or private mode can remove data; JSON backup is the recovery mechanism.

## Release Recommendation

M6 release evidence passed:

- GitHub Quality completed successfully with `Test and validate` passing.
- GitHub Pages completed `Verify and package` and `Publish site` successfully.
- The production URL returned HTTPS 200.
- All nine deployed application assets matched the locally tested source byte-for-byte.
- Dependabot checks completed successfully.
- Private vulnerability reporting, secret scanning, push protection, Dependabot alerts, and security updates are enabled.
- `main` requires pull requests and the `Test and validate` status check and blocks force pushes and deletion.

The project is approved and published as `v1.1.0`; required GitHub checks and the Pages discovery workflow passed, with the cross-browser and native-file-picker limitations already documented above.
