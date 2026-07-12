# Tech Stack

## Selection Principles

- Use the smallest stack that satisfies the accepted MVP.
- Prefer browser standards and long-term-supported tooling.
- Keep production free of dependencies, credentials, and build infrastructure.
- Separate pure business logic from browser APIs for testability.
- Add a dependency only when its value exceeds its security and maintenance cost.

## Stack

| Category | Technology | Version | Purpose | Rationale |
| --- | --- | --- | --- | --- |
| Markup | HTML | Living Standard | Semantic application shell | Native accessibility and no build step |
| Styling | CSS | Modern browser baseline | Responsive UI, tokens, themes | Small, portable, and framework-independent |
| Application | JavaScript ES modules | ES2022+ | Domain and UI behavior | Native browser and Node support |
| Persistence | Web Storage | Browser API | Single-user local workspace | Fits bounded local-first MVP |
| Test runtime | Node.js | 24 LTS | Built-in test runner and static checks | Supported LTS without test dependencies |
| Package manager | npm | Bundled with Node 24 | Reproducible commands | No production or development packages required |
| CI/CD | GitHub Actions | Pinned SHAs | Checks and Pages deployment | Native repository integration |
| Hosting | GitHub Pages | Managed | Static public demo | Free, reproducible, and appropriate for portfolio use |

## Runtime and Tooling

- Production runtime: current stable Chrome, Edge, Firefox, or Safari
- Development runtime: Node.js 24 LTS
- Formatter: repository conventions and deterministic whitespace checks
- Linter/static checker: custom zero-dependency repository checks
- Test runner: `node --test`
- CI/CD: GitHub Actions

## Dependency Budget

Production dependencies: **0**

Development dependencies: **0**

A proposed dependency requires an ADR when it changes production payload, data handling, deployment, or core architecture.

## External Services

| Service | Data sent | Purpose | Failure behavior |
| --- | --- | --- | --- |
| GitHub Pages | Static application assets only | Public demo hosting | Last successful deployment remains available |
| GitHub Actions | Repository source and test output | CI and deployment | Merge or release is blocked until fixed |

Workspace content is not sent to either service by application code.

## Upgrade Policy

- Track a supported Node LTS line and review it at least twice yearly.
- Pin GitHub Actions to full commit SHAs and let Dependabot propose updates.
- Test current stable browsers before a release.
- Record compatibility or data migration impact before changing browser APIs or schema.
