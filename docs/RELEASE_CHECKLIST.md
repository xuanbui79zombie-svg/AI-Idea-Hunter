# Release Checklist

## Version and Scope

- [x] Product scope, non-goals, and acceptance criteria are current.
- [x] Architecture and ADRs match the implementation.
- [x] Package version is `1.0.0`.
- [x] Changelog contains a dated `1.0.0` entry.
- [x] No experimental P2/P3 feature entered the release.

## Quality and Security

- [x] `npm run test:all` passes on Node.js 24 LTS.
- [x] Dependency audit reports no vulnerability.
- [x] Secret and unsafe runtime API scans pass.
- [x] Browser, responsive, keyboard, and accessibility checks are documented.
- [x] Remaining limitations are explicit in `docs/TEST_REPORT.md`.
- [ ] Remote GitHub quality and Pages workflows pass.

## Documentation and Open Source

- [x] README includes purpose, screenshot, features, setup, testing, privacy, architecture, and license.
- [x] Contributing, conduct, security, support, license, issue, and PR files are present.
- [x] Private vulnerability reporting URL is documented.
- [x] Release notes avoid unverified users, adoption, revenue, or performance claims.
- [ ] Public demo and repository links are verified after publication.

## GitHub Settings

- [ ] Repository description, homepage, and topics are configured.
- [ ] Dependabot alerts, security updates, secret scanning, and push protection are enabled.
- [ ] Private vulnerability reporting is enabled.
- [ ] `main` requires pull requests and the `Test and validate` status check.
- [ ] Force pushes and branch deletion are blocked.
- [ ] GitHub Pages uses the Actions publishing source.

## Publication

- [ ] Live Pages demo passes the core smoke test.
- [ ] Final milestone documentation is merged through a pull request.
- [ ] Annotated `v1.0.0` tag points to the verified release commit.
- [ ] GitHub Release includes summary, evidence, limitations, demo, and upgrade notes.
- [ ] Portfolio framework status is updated with the repository and demo.
