import { MAX_IMPORT_BYTES, validateWorkspace } from "./model.js";
import { translateFor } from "./i18n.js";
import { calculateScore, getEvidenceGapKey, getScoreBand, getScoreBreakdown } from "./scoring.js";

export function serializeWorkspace(workspace) {
  return `${JSON.stringify(validateWorkspace(workspace), null, 2)}\n`;
}

export function parseWorkspaceFile(text) {
  if (typeof text !== "string") {
    throw new TypeError("Import content must be text.");
  }
  const size = new TextEncoder().encode(text).length;
  if (size > MAX_IMPORT_BYTES) {
    throw new RangeError("Import file exceeds the 1 MiB limit.");
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new SyntaxError("Import file is not valid JSON.");
  }
  return validateWorkspace(parsed);
}

export function safeFilename(value) {
  const normalized = String(value)
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return normalized || "idea";
}

function escapeMarkdown(value) {
  return String(value).replace(/([\\`*_{}\[\]()#+.!|>-])/g, "\\$1");
}

export function buildResearchBrief(idea, language = "en") {
  const text = (key, variables) => translateFor(language, key, variables);
  const score = calculateScore(idea.scores);
  const band = getScoreBand(score);
  const breakdown = getScoreBreakdown(idea.scores);
  const evidence = idea.evidence.length
    ? idea.evidence.map((item) => `- **${escapeMarkdown(item.source)}** (${text(`strength.${item.strength}`)}, ${item.observedAt}): ${escapeMarkdown(item.observation)}`).join("\n")
    : `- ${text("export.noEvidence")}`;
  const scoreRows = breakdown
    .map((factor) => `| ${text(`factor.${factor.key}.label`)} | ${factor.value}/5 | ${Math.round(factor.weight * 100)}% | ${factor.contribution} |`)
    .join("\n");

  return `# ${escapeMarkdown(idea.title)} — ${text("export.title")}

## ${text("export.problem")}

${escapeMarkdown(idea.problem)}

## ${text("export.audienceContext")}

- **${text("export.audience")}:** ${escapeMarkdown(idea.audience)}
- **${text("export.context")}:** ${escapeMarkdown(idea.context || text("export.notRecorded"))}
- **${text("export.lifecycle")}:** ${text(`status.${idea.status}`)}

## ${text("export.outcome")}

${escapeMarkdown(idea.outcome)}

## ${text("export.score")}

**${score}/100 — ${text(`band.${band.key}.label`)}.** ${text("export.scoreCaveat")}

| ${text("export.factor")} | ${text("export.value")} | ${text("export.weight")} | ${text("export.contribution")} |
| --- | ---: | ---: | ---: |
${scoreRows}

## ${text("export.evidence")}

${evidence}

## ${text("export.gap")}

${text(`gap.${getEvidenceGapKey(idea)}`)}

## ${text("export.nextStep")}

${escapeMarkdown(idea.nextStep || text("export.defaultNextStep"))}

## ${text("export.assumptions")}

- ${text("export.assumption1")}
- ${text("export.assumption2")}
- ${text("export.assumption3")}
- ${text("export.assumption4")}

---

${text("export.generated")}
`;
}

export function downloadText(filename, text, type = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.hidden = true;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
