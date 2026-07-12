# AI Idea Hunter

AI Idea Hunter is a local-first opportunity workspace that helps independent developers turn scattered AI software ideas into evidence-backed, comparable project candidates.

> Status: product and architecture milestones complete; implementation planning in progress.

## Product Direction

The product focuses on decision quality rather than idea generation. Users capture an observed problem, record supporting evidence, score the opportunity with a transparent model, and export an actionable research brief.

The MVP is private by default, requires no account, and will not send workspace data to an external service.

## Planned MVP

- Structured idea and evidence capture
- Transparent seven-factor opportunity scoring
- Search, lifecycle filters, sorting, and dashboard signals
- Local persistence with versioned JSON backup and restore
- Markdown research brief export
- Responsive, accessible interface with light and dark themes

## Documentation

- [Product requirements](docs/PRODUCT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Data model](docs/DATABASE.md)
- [API and module contracts](docs/API.md)
- [Architecture decisions](docs/adr/)
- [Delivery tasks](TASKS.md)
- [Technology choices](TECH_STACK.md)

## Evidence Boundary

The scoring model prioritizes ideas; it does not prove market demand. User adoption, time savings, and business value will only be reported after they are measured.

## License

Licensed under the [MIT License](LICENSE).
