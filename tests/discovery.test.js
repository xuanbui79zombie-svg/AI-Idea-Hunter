import test from "node:test";
import assert from "node:assert/strict";
import { candidateToIdeaInput, loadDiscoveryFeed, localizeCandidate, validateDiscoveryFeed } from "../src/js/discovery.js";
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
  localizations: {
    "zh-CN": {
      title: "重复问题主题整理器",
      audience: "开源项目维护者",
      problem: "维护者需要反复手工归类相似请求。",
      context: "从公开来源信号中采集。",
      outcome: "创建带来源链接的主题摘要。",
      nextStep: "查看来源并定义最小实现范围。",
      reasoning: "两份公开报告描述了相同的重复工作。",
      uncertainties: ["预算尚不明确。"],
    },
  },
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
  schemaVersion: 2,
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
  assert.equal(localizeCandidate(validated.candidates[0], "zh-CN").title, "重复问题主题整理器");
  assert.throws(() => validateDiscoveryFeed({ ...feed, candidates: [{ ...candidate, sources: [{ ...candidate.sources[0], url: "javascript:alert(1)" }] }] }), /URL/);
  assert.throws(() => validateDiscoveryFeed({ ...feed, candidates: [{ ...candidate, localizations: {} }] }), /Simplified Chinese/);
});

test("discovered candidate enters the existing validated local idea boundary in the selected language", () => {
  const input = candidateToIdeaInput(candidate, "zh-CN");
  const idea = createIdea(input, "2026-07-13T00:00:00.000Z");
  assert.equal(idea.status, "inbox");
  assert.equal(idea.title, "重复问题主题整理器");
  assert.equal(idea.evidence.length, 1);
  assert.match(idea.evidence[0].observation, /https:\/\/github\.com/);
  assert.match(idea.evidence[0].observation, /来源/);
});

test("legacy version 1 feeds remain readable and fall back to English content", () => {
  const { localizations, ...legacyCandidate } = candidate;
  const legacy = validateDiscoveryFeed({ ...feed, schemaVersion: 1, candidates: [legacyCandidate] });
  assert.equal(legacy.schemaVersion, 1);
  assert.equal(localizeCandidate(legacy.candidates[0], "zh-CN").title, candidate.title);
});

test("discovery loader accepts same-origin data and fails closed", async () => {
  const ready = await loadDiscoveryFeed("data/opportunities.json", async () => ({ ok: true, json: async () => feed }));
  assert.equal(ready.status, "ready");
  let called = false;
  const unavailable = await loadDiscoveryFeed("https://evil.example/feed.json", async () => { called = true; });
  assert.equal(unavailable.status, "unavailable");
  assert.equal(called, false);
});
