import test from "node:test";
import assert from "node:assert/strict";
import { candidateToIdeaInput, loadDiscoveryFeed, validateDiscoveryFeed } from "../src/js/discovery.js";
import { createIdea } from "../src/js/model.js";

const candidate = {
  id: "candidate-1",
  title: "Recurring issue theme mapper",
  audience: "Open-source maintainers",
  problem: "Maintainers repeatedly group similar requests by hand.",
  context: "Collected from public source signals.",
  outcome: "Create a source-linked theme summary.",
  nextStep: "Review the source and define a narrow implementation slice.",
  reasoning: "Two public reports describe the same recurring workflow.",
  uncertainties: ["Budget is unknown."],
  scores: {
    pain: 3, frequency: 3, willingnessToPay: 1, reach: 2,
    feasibility: 4, differentiation: 2, evidenceConfidence: 2,
  },
  sources: [{
    id: "github:1",
    source: "github",
    title: "Feature request",
    excerpt: "Grouping is manual every week.",
    url: "https://github.com/example/project/issues/1",
    publishedAt: "2026-07-12T00:00:00.000Z",
  }],
};

const feed = {
  schemaVersion: 1,
  generatedAt: "2026-07-13T00:00:00.000Z",
  analysisMode: "ai",
  model: "openai/gpt-4o",
  sourceSummary: [{ source: "github", count: 1, status: "ready" }],
  candidates: [candidate],
};

test("discovery feed validates bounded candidates and HTTPS provenance", () => {
  const validated = validateDiscoveryFeed(feed);
  assert.equal(validated.candidates.length, 1);
  assert.equal(validated.candidates[0].sources[0].url, "https://github.com/example/project/issues/1");
  assert.throws(() => validateDiscoveryFeed({ ...feed, candidates: [{ ...candidate, sources: [{ ...candidate.sources[0], url: "javascript:alert(1)" }] }] }), /URL/);
});

test("discovered candidate enters the existing validated local idea boundary", () => {
  const input = candidateToIdeaInput(candidate);
  const idea = createIdea(input, "2026-07-13T00:00:00.000Z");
  assert.equal(idea.status, "inbox");
  assert.equal(idea.evidence.length, 1);
  assert.match(idea.evidence[0].observation, /https:\/\/github\.com/);
});

test("discovery loader accepts same-origin data and fails closed", async () => {
  const ready = await loadDiscoveryFeed("data/opportunities.json", async () => ({ ok: true, json: async () => feed }));
  assert.equal(ready.status, "ready");
  let called = false;
  const unavailable = await loadDiscoveryFeed("https://evil.example/feed.json", async () => { called = true; });
  assert.equal(unavailable.status, "unavailable");
  assert.equal(called, false);
});
