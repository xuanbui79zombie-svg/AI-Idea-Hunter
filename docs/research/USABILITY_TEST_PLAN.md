# M7 Usability Test Plan

## Decision and Evidence Boundary

M7 tests whether independent developers can use AI Idea Hunter to structure an idea, interpret its score, and choose a defensible next step. It does not test market demand, willingness to pay, retention, or product-market fit.

Only sessions completed by eligible, consented participants count toward the three-session target. Maintainer reviews, automated checks, and dry runs validate the protocol but are not user evidence.

## Research Questions

1. Can a participant identify what the product is for without coaching?
2. Can they capture a real, sanitized problem and supporting evidence?
3. Can they explain what the score means, what it does not mean, and which uncertainty matters most?
4. Can they turn the strongest idea into a useful next validation step?
5. Can they find the backup and brief exports and understand the local-storage risk?

## Participants

Run three moderated sessions with people who:

- independently select or build software projects;
- have used notes, spreadsheets, or another method to track ideas;
- did not help design or implement AI Idea Hunter;
- can use a sanitized idea that contains no employer, client, or personal secrets.

Aim for a mix of early-career and experienced builders. Record only a pseudonymous code (`P01` through `P03`) in this repository. The maintainer is ineligible as a counted participant.

## Session Format

- Duration: 30–40 minutes.
- Mode: remote screen share or in person.
- Build: the published `v1.0.0` demo in a clean browser profile when practical.
- Recording: off by default; require separate explicit consent if needed.
- Raw notes: private working material. Commit only anonymized observations and synthesized findings.

Before starting, explain that the software—not the participant—is being tested, participation is voluntary, they may stop at any time, and they must avoid confidential data. Obtain verbal or written consent to take anonymized notes.

## Neutral Moderator Script

Use these prompts without explaining the interface or scoring model first:

1. “Please look at this page and tell me what you think it is for.”
2. “Use a real but non-confidential software idea. Show how you would capture the problem and what makes you believe it exists.”
3. “Set the scores as you think appropriate. Tell me what you believe the result means.”
4. “Find the biggest weakness in this idea and decide what you would do next.”
5. “Imagine you want to continue the research elsewhere. Show what you would take with you.”
6. “Imagine your browser data is about to be cleared. Show how you would protect your work.”

If the participant becomes stuck, wait briefly, then use prompts in this order: “What would you try next?”, “What are you looking for?”, and finally a direct hint. Record the highest assistance level used.

## Tasks and Success Criteria

| ID | Task | Independent success evidence | Core |
| --- | --- | --- | --- |
| U1 | Explain the product | Describes evidence-backed idea prioritization without calling the score market validation | Yes |
| U2 | Capture an idea | Saves a problem, audience, outcome, and at least one meaningful evidence note | Yes |
| U3 | Interpret the score | Explains that inputs drive a comparative score and identifies one uncertainty | Yes |
| U4 | Choose a next step | Uses evidence gaps or the brief to state a specific validation action | Yes |
| U5 | Export a brief | Locates Markdown export and understands its research handoff purpose | No |
| U6 | Protect the workspace | Locates JSON backup and explains that browser storage can be cleared | Yes |

## Measures

For each task record:

- result: `Independent`, `Prompted`, `Direct help`, or `Failed`;
- critical error or misleading interpretation;
- approximate completion time, used descriptively rather than as a performance claim;
- Single Ease Question rating from 1 (very difficult) to 7 (very easy);
- concise observation and an anonymized quote only when consent covers it.

## M7 Exit Thresholds

M7 can conclude only after all three eligible sessions are recorded and synthesized. Targets are:

- at least two of three participants complete every core task independently;
- at least two of three explain the score and strongest uncertainty without help;
- no unresolved P0 or P1 finding involving data loss, unsafe disclosure, or a materially misleading score;
- every observed problem has participant evidence, severity, and a disposition.

These are decision thresholds, not predeclared results. Missing a threshold triggers a fix or explicit product decision; it must not be rewritten as success.

## Finding Severity

| Severity | Definition | Response |
| --- | --- | --- |
| P0 | Data loss, unsafe disclosure, or the core flow cannot be completed | Stop sessions if participant safety is affected; fix before continuing |
| P1 | Multiple participants fail a core task or materially misunderstand the score | Fix before M7 closes and rerun the affected task |
| P2 | Recoverable friction, unclear copy, or failure in a non-core task | Prioritize with evidence for the next release |
| P3 | Preference or minor polish issue with no task impact | Record; do not expand scope without repeated evidence |

## Synthesis Rules

- Separate observation, interpretation, and recommendation.
- Do not convert one participant’s preference into a universal need.
- Do not publish identities, contact details, employer data, screen recordings, or raw notes.
- Link product changes to finding IDs and update `TASKS.md` after the three-session synthesis.
- Any change to the core product direction or architecture still requires explicit approval.
