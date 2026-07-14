# Data Model and Persistence

## Storage Decision

`v1.0.0` stores one versioned workspace document in browser `localStorage` under:

`ai-idea-hunter.workspace.v1`

This is not a relational database. It is appropriate for a single user, a bounded dataset, and static hosting. JSON export is the portability and backup mechanism.

The interface language is stored separately under:

`ai-idea-hunter.language`

Its value is `en` or `zh-CN`. It is intentionally excluded from workspace JSON so changing or importing a workspace does not overwrite the user's interface preference.

## Workspace Schema

```js
{
  schemaVersion: 1,
  ideas: Idea[],
  preferences: {
    theme: "system" | "light" | "dark"
  }
}
```

## Idea Schema

```js
{
  id: string,                 // UUID
  title: string,              // 1..80 characters
  audience: string,           // 1..120 characters
  problem: string,            // 1..600 characters
  context: string,            // 0..400 characters
  outcome: string,            // 1..400 characters
  status: "inbox" | "researching" | "validated" | "selected" | "archived",
  nextStep: string,           // 0..240 characters
  scores: {
    pain: number,
    frequency: number,
    willingnessToPay: number,
    reach: number,
    feasibility: number,
    differentiation: number,
    evidenceConfidence: number
  },                          // every value is an integer from 1 to 5
  evidence: Evidence[],       // maximum 50
  createdAt: string,          // ISO 8601
  updatedAt: string           // ISO 8601
}
```

## Evidence Schema

```js
{
  id: string,                 // UUID
  source: string,             // 1..120 characters
  observation: string,        // 1..500 characters
  strength: "weak" | "moderate" | "strong",
  observedAt: string          // YYYY-MM-DD
}
```

## Invariants

- Maximum workspace size: 500 ideas.
- IDs must be unique within their collection.
- Timestamps must be valid ISO strings; `updatedAt` cannot precede `createdAt`.
- An idea score is derived and never persisted as authoritative data.
- Unknown object keys are ignored during normalization; required keys must validate.
- User strings are trimmed and stored as plain text.
- Import does not accept functions, prototypes, HTML, or executable values; JSON parsing produces data only.

## Versioning and Migration

The root `schemaVersion` is mandatory. The reader accepts version 1 only for the first release. Future versions must add a migration function from every supported prior version and preserve a backup before writing migrated data.

An unsupported future version is rejected with a clear message; it is never downgraded silently.

## Persistence Semantics

1. Normalize and validate the complete workspace.
2. Serialize to JSON.
3. Write one key with `localStorage.setItem`.
4. Read back only on the next explicit load or page start.

JavaScript is single-threaded per tab, but two tabs can overwrite each other. Multi-tab coordination is a documented limitation of `v1.0.0`; adding it is not required for release.

## Backup and Recovery

- Exported files use `ai-idea-hunter-YYYY-MM-DD.json`.
- Export includes `schemaVersion` and the complete normalized workspace.
- Import validates before confirmation and replacement.
- Corrupted stored data is copied to a quarantine key when possible before the active key is cleared.
- The UI explains that browser clearing and private browsing can remove data.
- Language preference failure never blocks the workspace; the interface falls back to the browser language or English.

## Privacy

The application sends no workspace data to a server. Users remain responsible for removing confidential information before sharing exported JSON or Markdown files.

## Public Discovery Feed

Automated discovery uses a separate read-only `schemaVersion: 2` JSON document deployed at `data/opportunities.json`. It contains generation metadata, source coverage, analysis mode, and at most 12 source-linked candidates. Version 2 requires validated Simplified Chinese localizations alongside the English base product fields; the browser remains read-compatible with version 1 feeds during deployment transitions. The feed is not part of the workspace schema, is never written to localStorage automatically, and cannot overwrite user ideas.

Each candidate contains bounded plain-text English product fields, a bounded `localizations["zh-CN"]` object with the same content contract, seven shared provisional 1–5 scores, and one or more canonical HTTPS source references. Original source titles, excerpts, dates, and URLs are not translated. The browser validates the complete feed before rendering or mapping the currently displayed locale into an `Idea` input.
