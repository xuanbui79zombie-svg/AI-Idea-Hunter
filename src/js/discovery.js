import { SCORE_FACTORS } from "./scoring.js";

export const DISCOVERY_FEED_PATH = "data/opportunities.json";
export const MAX_DISCOVERY_CANDIDATES = 12;
const MAX_CANDIDATE_SOURCES = 4;
const SCORE_KEYS = Object.freeze(SCORE_FACTORS.map((factor) => factor.key));

function text(value, maximum, field, required = true) {
  const normalized = String(value ?? "").trim();
  if ((required && !normalized) || normalized.length > maximum) {
    throw new TypeError(`Invalid discovery field: ${field}`);
  }
  return normalized;
}

function iso(value, field) {
  const normalized = text(value, 40, field);
  if (!Number.isFinite(Date.parse(normalized))) throw new TypeError(`Invalid discovery date: ${field}`);
  return new Date(normalized).toISOString();
}

function httpsUrl(value, field) {
  const normalized = text(value, 500, field);
  const parsed = new URL(normalized);
  if (parsed.protocol !== "https:") throw new TypeError(`Invalid discovery URL: ${field}`);
  return parsed.href;
}

function score(value, field) {
  const normalized = Number(value);
  if (!Number.isInteger(normalized) || normalized < 1 || normalized > 5) {
    throw new TypeError(`Invalid discovery score: ${field}`);
  }
  return normalized;
}

function validateSource(value, index) {
  return Object.freeze({
    id: text(value?.id, 120, `sources.${index}.id`),
    source: text(value?.source, 40, `sources.${index}.source`),
    title: text(value?.title, 200, `sources.${index}.title`),
    excerpt: text(value?.excerpt, 600, `sources.${index}.excerpt`, false),
    url: httpsUrl(value?.url, `sources.${index}.url`),
    publishedAt: iso(value?.publishedAt, `sources.${index}.publishedAt`),
  });
}

function validateCandidate(value, index) {
  if (!Array.isArray(value?.sources) || value.sources.length < 1 || value.sources.length > MAX_CANDIDATE_SOURCES) {
    throw new TypeError(`Invalid discovery sources: candidates.${index}`);
  }
  const scores = Object.fromEntries(SCORE_KEYS.map((key) => [key, score(value?.scores?.[key], `${index}.${key}`)]));
  const uncertainties = Array.isArray(value?.uncertainties)
    ? value.uncertainties.slice(0, 4).map((item, itemIndex) => text(item, 240, `${index}.uncertainties.${itemIndex}`))
    : [];
  return Object.freeze({
    id: text(value?.id, 120, `${index}.id`),
    title: text(value?.title, 80, `${index}.title`),
    audience: text(value?.audience, 120, `${index}.audience`),
    problem: text(value?.problem, 600, `${index}.problem`),
    context: text(value?.context, 400, `${index}.context`, false),
    outcome: text(value?.outcome, 400, `${index}.outcome`),
    nextStep: text(value?.nextStep, 240, `${index}.nextStep`, false),
    reasoning: text(value?.reasoning, 600, `${index}.reasoning`),
    uncertainties: Object.freeze(uncertainties),
    scores: Object.freeze(scores),
    sources: Object.freeze(value.sources.map(validateSource)),
  });
}

export function validateDiscoveryFeed(value) {
  if (value?.schemaVersion !== 1) throw new TypeError("Unsupported discovery feed version");
  if (!Array.isArray(value?.candidates) || value.candidates.length > MAX_DISCOVERY_CANDIDATES) {
    throw new TypeError("Invalid discovery candidate collection");
  }
  const mode = text(value?.analysisMode, 20, "analysisMode");
  if (!["ai", "fallback", "empty"].includes(mode)) throw new TypeError("Invalid discovery analysis mode");
  const sourceSummary = Array.isArray(value?.sourceSummary)
    ? value.sourceSummary.slice(0, 8).map((item, index) => Object.freeze({
      source: text(item?.source, 40, `sourceSummary.${index}.source`),
      count: Math.max(0, Math.min(100, Number.parseInt(item?.count, 10) || 0)),
      status: ["ready", "unavailable"].includes(item?.status) ? item.status : "unavailable",
    }))
    : [];
  return Object.freeze({
    schemaVersion: 1,
    generatedAt: iso(value?.generatedAt, "generatedAt"),
    analysisMode: mode,
    model: text(value?.model, 100, "model", false),
    sourceSummary: Object.freeze(sourceSummary),
    candidates: Object.freeze(value.candidates.map(validateCandidate)),
  });
}

export async function loadDiscoveryFeed(path = DISCOVERY_FEED_PATH, fetchImpl = globalThis.fetch) {
  try {
    if (typeof path !== "string" || /^(?:[a-z]+:)?\/\//i.test(path) || typeof fetchImpl !== "function") {
      throw new TypeError("Discovery feed must be same-origin");
    }
    const response = await fetchImpl(path, { cache: "no-store", credentials: "same-origin" });
    if (!response?.ok) throw new Error(`Discovery feed returned ${response?.status ?? "unknown"}`);
    const feed = validateDiscoveryFeed(await response.json());
    return { status: feed.candidates.length ? "ready" : "empty", feed };
  } catch {
    return { status: "unavailable", feed: null };
  }
}

export function candidateToIdeaInput(candidate) {
  const normalized = validateCandidate(candidate, 0);
  return {
    title: normalized.title,
    audience: normalized.audience,
    problem: normalized.problem,
    context: normalized.context,
    outcome: normalized.outcome,
    status: "inbox",
    nextStep: normalized.nextStep,
    scores: { ...normalized.scores },
    evidence: normalized.sources.map((source) => ({
      source: `${source.source}: ${source.title}`.slice(0, 120),
      observation: `${source.excerpt || source.title} Source: ${source.url}`.slice(0, 500),
      strength: normalized.sources.length > 1 ? "moderate" : "weak",
      observedAt: source.publishedAt.slice(0, 10),
    })),
  };
}
