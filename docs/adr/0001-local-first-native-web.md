# ADR 0001: Local-First Native Web Application

- Status: Accepted
- Date: 2026-07-12
- Owners: repository maintainer
- Supersedes: none
- Superseded by: none

## Context

The MVP serves one independent developer, contains a bounded set of structured ideas, must be easy to try from a portfolio, and must not expose API keys or user data. The repository is maintained by one developer and should avoid infrastructure that does not validate the core product assumption.

## Decision

Build a static single-page application with semantic HTML, CSS, and native ES modules. Store a versioned workspace document in localStorage, provide JSON backup/restore, run domain tests with Node's built-in test runner, and deploy `src/` to GitHub Pages.

No backend, authentication, cloud database, framework, runtime package, analytics service, or model API is included in `v1.0.0`.

## Alternatives Considered

### React and a client build tool

Rejected for the MVP because component and build dependencies do not solve a current product requirement. Revisit if interaction complexity makes native rendering demonstrably hard to maintain.

### Full-stack API with a relational database

Rejected because multi-device sync and shared access are non-goals. It would add authentication, privacy, operations, migrations, and cost before validating the workflow.

### Browser calling an LLM directly

Rejected because it would expose credentials or require users to handle unsafe key storage. It would also make scoring less transparent.

## Consequences

Benefits:

- zero production dependencies and low operational cost;
- private-by-default data behavior;
- fast static delivery and simple GitHub Pages demo;
- deterministic, explainable scoring;
- clear separation between product validation and infrastructure.

Costs and limitations:

- data is device- and browser-profile-specific;
- browser clearing can remove data without an export;
- no real-time collaboration, remote backup, or model-generated analysis;
- DOM integration needs targeted browser testing in addition to Node tests.

## Migration and Rollback

There is no earlier application to migrate. A future backend or remote model requires product evidence, explicit approval, a new trust-boundary design, and a separate ADR. The static release remains usable and export files provide a migration input.

## Validation

- Complete P0 requirements with no application server.
- Keep uncompressed application assets under 250 KB.
- Demonstrate JSON round-trip and recovery behavior.
- Pass core logic tests in Node and the complete flow in supported browsers.
