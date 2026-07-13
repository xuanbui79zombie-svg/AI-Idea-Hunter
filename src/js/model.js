import { SCORE_FACTORS } from "./scoring.js";
import { translateFor } from "./i18n.js";

export const SCHEMA_VERSION = 1;
export const MAX_IDEAS = 500;
export const MAX_EVIDENCE_PER_IDEA = 50;
export const MAX_IMPORT_BYTES = 1024 * 1024;
export const STATUSES = Object.freeze(["inbox", "researching", "validated", "selected", "archived"]);
export const EVIDENCE_STRENGTHS = Object.freeze(["weak", "moderate", "strong"]);
export const THEMES = Object.freeze(["system", "light", "dark"]);

const LIMITS = Object.freeze({
  title: 80,
  audience: 120,
  problem: 600,
  context: 400,
  outcome: 400,
  nextStep: 240,
  evidenceSource: 120,
  evidenceObservation: 500,
});

const DEFAULT_SCORES = Object.freeze({
  pain: 3,
  frequency: 3,
  willingnessToPay: 3,
  reach: 3,
  feasibility: 3,
  differentiation: 3,
  evidenceConfidence: 1,
});

export class ValidationError extends Error {
  constructor(message, issues = []) {
    super(message);
    this.name = "ValidationError";
    this.issues = issues;
  }
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function makeId(prefix) {
  const random = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${random}`;
}

function normalizeText(value, field, { required = false, max }) {
  if (typeof value !== "string") {
    throw new ValidationError(`${field} must be text.`, [{ field, message: "Enter text." }]);
  }
  const normalized = value.trim();
  if (required && normalized.length === 0) {
    throw new ValidationError(`${field} is required.`, [{ field, message: "This field is required." }]);
  }
  if (normalized.length > max) {
    throw new ValidationError(`${field} is too long.`, [{ field, message: `Use ${max} characters or fewer.` }]);
  }
  return normalized;
}

function normalizeId(value, field, prefix) {
  if (value === undefined || value === null || value === "") {
    return makeId(prefix);
  }
  const id = normalizeText(value, field, { required: true, max: 100 });
  if (!/^[A-Za-z0-9][A-Za-z0-9._:-]*$/.test(id)) {
    throw new ValidationError(`${field} contains unsupported characters.`, [{ field, message: "Use a valid identifier." }]);
  }
  return id;
}

function normalizeTimestamp(value, field, fallback) {
  const candidate = value ?? fallback;
  if (typeof candidate !== "string" || Number.isNaN(Date.parse(candidate))) {
    throw new ValidationError(`${field} must be a valid ISO date.`, [{ field, message: "Use a valid date." }]);
  }
  return new Date(candidate).toISOString();
}

function normalizeScores(value = DEFAULT_SCORES) {
  if (!isPlainObject(value)) {
    throw new ValidationError("Scores must be an object.", [{ field: "scores", message: "Choose a value for each score." }]);
  }

  const scores = {};
  for (const factor of SCORE_FACTORS) {
    const raw = value[factor.key] ?? DEFAULT_SCORES[factor.key];
    const score = typeof raw === "string" ? Number(raw) : raw;
    if (!Number.isInteger(score) || score < 1 || score > 5) {
      throw new ValidationError(`${factor.label} must be from 1 to 5.`, [{ field: factor.key, message: "Choose a value from 1 to 5." }]);
    }
    scores[factor.key] = score;
  }
  return scores;
}

function normalizeEvidence(value) {
  if (!isPlainObject(value)) {
    throw new ValidationError("Evidence must be an object.", [{ field: "evidence", message: "Evidence is invalid." }]);
  }

  const strength = value.strength ?? "weak";
  if (!EVIDENCE_STRENGTHS.includes(strength)) {
    throw new ValidationError("Evidence strength is invalid.", [{ field: "evidenceStrength", message: "Choose a valid strength." }]);
  }

  const observedAt = normalizeText(value.observedAt ?? "", "observedAt", { required: true, max: 10 });
  if (!/^\d{4}-\d{2}-\d{2}$/.test(observedAt) || Number.isNaN(Date.parse(`${observedAt}T00:00:00Z`))) {
    throw new ValidationError("Evidence date is invalid.", [{ field: "evidenceDate", message: "Choose a valid date." }]);
  }

  return {
    id: normalizeId(value.id, "evidenceId", "evidence"),
    source: normalizeText(value.source ?? "", "evidenceSource", { required: true, max: LIMITS.evidenceSource }),
    observation: normalizeText(value.observation ?? "", "evidenceObservation", { required: true, max: LIMITS.evidenceObservation }),
    strength,
    observedAt,
  };
}

function normalizeIdea(value, { now, existing, requireTimestamps = false } = {}) {
  if (!isPlainObject(value)) {
    throw new ValidationError("Idea must be an object.", [{ field: "idea", message: "Idea data is invalid." }]);
  }

  const timestamp = normalizeTimestamp(now ?? new Date().toISOString(), "now");
  const status = value.status ?? existing?.status ?? "inbox";
  if (!STATUSES.includes(status)) {
    throw new ValidationError("Idea status is invalid.", [{ field: "status", message: "Choose a valid lifecycle status." }]);
  }

  const evidenceInput = value.evidence ?? existing?.evidence ?? [];
  if (!Array.isArray(evidenceInput) || evidenceInput.length > MAX_EVIDENCE_PER_IDEA) {
    throw new ValidationError(`Evidence must contain at most ${MAX_EVIDENCE_PER_IDEA} notes.`, [{ field: "evidence", message: "Too many evidence notes." }]);
  }
  const evidence = evidenceInput.map(normalizeEvidence);
  if (new Set(evidence.map((item) => item.id)).size !== evidence.length) {
    throw new ValidationError("Evidence IDs must be unique.", [{ field: "evidence", message: "Duplicate evidence was found." }]);
  }

  if (requireTimestamps && (typeof value.createdAt !== "string" || typeof value.updatedAt !== "string")) {
    throw new ValidationError("Imported ideas require createdAt and updatedAt timestamps.", [{ field: "updatedAt", message: "Idea timestamps are missing." }]);
  }
  const createdAt = normalizeTimestamp(value.createdAt ?? existing?.createdAt, "createdAt", timestamp);
  const updatedAt = normalizeTimestamp(value.updatedAt ?? timestamp, "updatedAt", timestamp);
  if (Date.parse(updatedAt) < Date.parse(createdAt)) {
    throw new ValidationError("updatedAt cannot be earlier than createdAt.", [{ field: "updatedAt", message: "Update time is invalid." }]);
  }

  return {
    id: normalizeId(value.id ?? existing?.id, "id", "idea"),
    title: normalizeText(value.title ?? existing?.title ?? "", "title", { required: true, max: LIMITS.title }),
    audience: normalizeText(value.audience ?? existing?.audience ?? "", "audience", { required: true, max: LIMITS.audience }),
    problem: normalizeText(value.problem ?? existing?.problem ?? "", "problem", { required: true, max: LIMITS.problem }),
    context: normalizeText(value.context ?? existing?.context ?? "", "context", { max: LIMITS.context }),
    outcome: normalizeText(value.outcome ?? existing?.outcome ?? "", "outcome", { required: true, max: LIMITS.outcome }),
    status,
    nextStep: normalizeText(value.nextStep ?? existing?.nextStep ?? "", "nextStep", { max: LIMITS.nextStep }),
    scores: normalizeScores(value.scores ?? existing?.scores ?? DEFAULT_SCORES),
    evidence,
    createdAt,
    updatedAt,
  };
}

export function createEmptyWorkspace() {
  return {
    schemaVersion: SCHEMA_VERSION,
    ideas: [],
    preferences: { theme: "system" },
  };
}

export function createIdea(input, now = new Date().toISOString()) {
  return normalizeIdea(input, { now });
}

export function updateIdea(existing, patch, now = new Date().toISOString()) {
  if (!existing?.id) {
    throw new ValidationError("Existing idea is required.", [{ field: "id", message: "Idea was not found." }]);
  }
  return normalizeIdea({ ...existing, ...patch, id: existing.id, createdAt: existing.createdAt, updatedAt: now }, { now, existing });
}

export function validateWorkspace(value) {
  if (!isPlainObject(value)) {
    throw new ValidationError("Workspace must be an object.", [{ field: "workspace", message: "Workspace data is invalid." }]);
  }
  if (value.schemaVersion !== SCHEMA_VERSION) {
    throw new ValidationError(`Unsupported schema version: ${String(value.schemaVersion)}.`, [{ field: "schemaVersion", message: `Expected version ${SCHEMA_VERSION}.` }]);
  }
  if (!Array.isArray(value.ideas) || value.ideas.length > MAX_IDEAS) {
    throw new ValidationError(`Workspace must contain at most ${MAX_IDEAS} ideas.`, [{ field: "ideas", message: "Idea collection is invalid or too large." }]);
  }

  const ideas = value.ideas.map((idea) => normalizeIdea(idea, { now: idea?.updatedAt, requireTimestamps: true }));
  if (new Set(ideas.map((idea) => idea.id)).size !== ideas.length) {
    throw new ValidationError("Idea IDs must be unique.", [{ field: "ideas", message: "Duplicate ideas were found." }]);
  }

  const preferences = isPlainObject(value.preferences) ? value.preferences : {};
  const theme = preferences.theme ?? "system";
  if (!THEMES.includes(theme)) {
    throw new ValidationError("Theme preference is invalid.", [{ field: "theme", message: "Choose a valid theme." }]);
  }

  return { schemaVersion: SCHEMA_VERSION, ideas, preferences: { theme } };
}

export function createExampleWorkspace(language = "en") {
  return validateWorkspace({
    schemaVersion: SCHEMA_VERSION,
    preferences: { theme: "system" },
    ideas: [
      {
        id: "idea-example-support-signal",
        title: translateFor(language, "example.support.title"),
        audience: translateFor(language, "example.support.audience"),
        problem: translateFor(language, "example.support.problem"),
        context: translateFor(language, "example.support.context"),
        outcome: translateFor(language, "example.support.outcome"),
        status: "researching",
        nextStep: translateFor(language, "example.support.nextStep"),
        scores: {
          pain: 4,
          frequency: 4,
          willingnessToPay: 3,
          reach: 3,
          feasibility: 4,
          differentiation: 3,
          evidenceConfidence: 2,
        },
        evidence: [
          {
            id: "evidence-example-1",
            source: translateFor(language, "example.support.source"),
            observation: translateFor(language, "example.support.observation"),
            strength: "weak",
            observedAt: "2026-07-01",
          },
        ],
        createdAt: "2026-07-01T09:00:00.000Z",
        updatedAt: "2026-07-10T09:00:00.000Z",
      },
      {
        id: "idea-example-compliance-brief",
        title: translateFor(language, "example.compliance.title"),
        audience: translateFor(language, "example.compliance.audience"),
        problem: translateFor(language, "example.compliance.problem"),
        context: translateFor(language, "example.compliance.context"),
        outcome: translateFor(language, "example.compliance.outcome"),
        status: "inbox",
        nextStep: translateFor(language, "example.compliance.nextStep"),
        scores: {
          pain: 4,
          frequency: 3,
          willingnessToPay: 4,
          reach: 2,
          feasibility: 2,
          differentiation: 3,
          evidenceConfidence: 1,
        },
        evidence: [],
        createdAt: "2026-07-05T09:00:00.000Z",
        updatedAt: "2026-07-05T09:00:00.000Z",
      },
    ],
  });
}
