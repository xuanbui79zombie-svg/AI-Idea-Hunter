# ADR-0002: Build-Time Automated Discovery

- Status: Accepted
- Date: 2026-07-13

## Context

The owner approved automatic collection of external idea signals and AI analysis. The existing product is a static GitHub Pages application whose private workspace stays in browser localStorage. Direct browser scraping or model calls would expose credentials, expand cross-origin risk, and risk sending private workspace data.

## Decision

Run automated discovery only in GitHub Actions. The pipeline reads bounded public Hacker News and public GitHub Issues APIs, normalizes plain-text source records, and calls GitHub Models with the ephemeral `GITHUB_TOKEN` and `models: read`. It validates model output and publishes a same-origin JSON feed inside the Pages artifact.

The browser may read that public feed but never sends workspace content to it. A candidate enters localStorage only after an explicit user save action and existing model validation. Source text and model output are always untrusted. Arbitrary crawling, login-wall access, private repositories, user-supplied targets, analytics, and browser-exposed credentials remain prohibited.

## Consequences

- Automated refresh can run daily and on manual dispatch without a separate server or long-lived API key.
- GitHub Models and source API limits can produce degraded refreshes; the feed must disclose its analysis mode and source coverage.
- The browser CSP changes from no connections to same-origin connections only.
- Generated candidates are provisional prioritization aids, not proof of demand or product-market fit.
- Adding a new source requires an access, privacy, provenance, rate-limit, and maintenance review.

## Alternatives Rejected

- Browser-side scraping or model calls: exposes credentials and weakens privacy boundaries.
- General-purpose crawler: excessive legal, security, reliability, and maintenance risk for the first increment.
- Separate hosted backend: adds operations and cost before the scheduled static pipeline is proven useful.
