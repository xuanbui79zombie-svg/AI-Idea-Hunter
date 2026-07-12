# AI Idea Hunter

[![Quality](https://github.com/xuanbui79zombie-svg/AI-Idea-Hunter/actions/workflows/quality.yml/badge.svg)](https://github.com/xuanbui79zombie-svg/AI-Idea-Hunter/actions/workflows/quality.yml)
[![Deploy GitHub Pages](https://github.com/xuanbui79zombie-svg/AI-Idea-Hunter/actions/workflows/pages.yml/badge.svg)](https://github.com/xuanbui79zombie-svg/AI-Idea-Hunter/actions/workflows/pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

AI Idea Hunter is a local-first opportunity workspace for independent developers. It turns scattered observations into evidence-backed AI software ideas that can be scored transparently, compared consistently, and exported as research briefs.

> Status: `v1.0.0` release candidate. Local quality gates passed; remote CI and Pages verification are in progress.

**[Open the live demo](https://xuanbui79zombie-svg.github.io/AI-Idea-Hunter/)**

![AI Idea Hunter interface](docs/assets/ai-idea-hunter-hero.png)

## Why It Exists

Idea backlogs often mix assumed problems with proposed features and rank them by excitement. AI Idea Hunter asks for the problem, audience, evidence, uncertainty, and next validation step before a project earns attention.

The resulting score organizes work; it does not claim market demand, revenue, or product-market fit.

## Features

- Create, edit, archive, and safely delete structured opportunities.
- Attach dated evidence notes with explicit signal strength.
- Score seven visible factors with a documented weighted formula.
- Search, filter, sort, and inspect dashboard signals.
- Export a single idea as a Markdown research brief.
- Back up and restore the full workspace as versioned JSON.
- Load clearly labelled fictional examples on demand.
- Use system, light, or dark themes on desktop and mobile.
- Work without an account, server, analytics tracker, or model API key.

## Quick Start

Requirements: [Node.js 24 LTS](https://nodejs.org/en/about/previous-releases).

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:4173`.

There are no production or development packages; `npm install` verifies metadata and the lockfile. Any static HTTP server can serve `src/`.

## Quality Commands

```bash
npm run check
npm test
npm run test:all
```

The current suite covers model validation, weighted scoring, evidence guidance, storage failure and recovery, JSON round-trip, import rejection, portable filenames, and Markdown output.

## How the Score Works

| Factor | Weight |
| --- | ---: |
| Pain severity | 20% |
| Frequency | 15% |
| Willingness to pay | 15% |
| Reach | 10% |
| Feasibility | 15% |
| Differentiation | 10% |
| Evidence confidence | 15% |

Each input uses a 1–5 scale. The normalized score is `round(sum(value × weight) / 5 × 100)`, producing a result from 20 to 100. Every input and contribution remains visible.

## Privacy and Recovery

Workspace content stays in browser localStorage unless the user explicitly downloads a JSON or Markdown file. The application makes no runtime network request, loads no third-party script or font, and contains no analytics.

Browser clearing or private-browsing behavior can remove data. Export JSON backups regularly. Invalid imports do not mutate the active workspace, and malformed stored data opens a safe empty workspace with a visible warning.

## Project Structure

```text
src/
├── index.html       # semantic application shell
├── styles.css       # responsive design system and themes
└── js/
    ├── app.js       # composition and user-intent orchestration
    ├── ui.js        # safe DOM rendering and interaction
    ├── model.js     # entities, validation, limits, examples
    ├── scoring.js   # pure transparent scoring
    ├── storage.js   # localStorage adapter and recovery
    └── export.js    # JSON and Markdown boundaries
tests/               # Node built-in test suite
scripts/             # static checks and local server
docs/                # product, architecture, schema, contracts, ADRs
```

## Documentation

- [Product requirements](docs/PRODUCT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Data model](docs/DATABASE.md)
- [Module contracts](docs/API.md)
- [ADR-0001: local-first native web](docs/adr/0001-local-first-native-web.md)
- [Delivery tasks](TASKS.md)
- [Technology choices](TECH_STACK.md)
- [Release test report](docs/TEST_REPORT.md)
- [Release checklist](docs/RELEASE_CHECKLIST.md)
- [Security policy](SECURITY.md)

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md), [PROJECT_RULES.md](PROJECT_RULES.md), and [AGENTS.md](AGENTS.md). Report vulnerabilities privately according to [SECURITY.md](SECURITY.md).

## License

Licensed under the [MIT License](LICENSE).
