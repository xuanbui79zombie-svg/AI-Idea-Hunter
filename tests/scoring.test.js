import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateScore,
  getEvidenceGap,
  getScoreBand,
  getScoreBreakdown,
  SCORE_FACTORS,
} from "../src/js/scoring.js";

const scores = (value) => Object.fromEntries(SCORE_FACTORS.map((factor) => [factor.key, value]));

test("score factors form a complete normalized model", () => {
  assert.equal(SCORE_FACTORS.length, 7);
  assert.equal(SCORE_FACTORS.reduce((sum, factor) => sum + factor.weight, 0), 1);
  assert.deepEqual(SCORE_FACTORS.map((factor) => factor.key), [
    "pain",
    "frequency",
    "willingnessToPay",
    "reach",
    "feasibility",
    "differentiation",
    "evidenceConfidence",
  ]);
});

test("calculateScore maps the 1-5 scale to 20-100", () => {
  assert.equal(calculateScore(scores(1)), 20);
  assert.equal(calculateScore(scores(3)), 60);
  assert.equal(calculateScore(scores(5)), 100);
  assert.equal(calculateScore({ ...scores(3), pain: 5 }), 68);
});

test("calculateScore rejects invalid values", () => {
  assert.throws(() => calculateScore(null), TypeError);
  assert.throws(() => calculateScore({}), RangeError);
  assert.throws(() => calculateScore({ ...scores(3), reach: 0 }), RangeError);
  assert.throws(() => calculateScore({ ...scores(3), reach: 2.5 }), RangeError);
  assert.throws(() => calculateScore({ ...scores(3), reach: 6 }), RangeError);
});

test("score breakdown explains every contribution", () => {
  const breakdown = getScoreBreakdown(scores(4));
  assert.equal(breakdown.length, 7);
  assert.equal(breakdown[0].label, "Pain severity");
  assert.equal(breakdown[0].value, 4);
  assert.equal(breakdown[0].contribution, 16);
  assert.ok(breakdown.every((factor) => factor.guidance.length > 0));
  assert.equal(breakdown.reduce((sum, factor) => sum + factor.contribution, 0), 80);
});

test("score bands cover every release boundary", () => {
  assert.equal(getScoreBand(20).key, "explore");
  assert.equal(getScoreBand(49).key, "explore");
  assert.equal(getScoreBand(50).key, "promising");
  assert.equal(getScoreBand(74).key, "promising");
  assert.equal(getScoreBand(75).key, "priority");
  assert.equal(getScoreBand(100).key, "priority");
  assert.throws(() => getScoreBand(19), RangeError);
  assert.throws(() => getScoreBand(101), RangeError);
});

test("evidence guidance identifies the next useful gap", () => {
  const base = { scores: { evidenceConfidence: 2 }, evidence: [], nextStep: "" };
  assert.match(getEvidenceGap(base), /first direct observation/i);
  assert.match(getEvidenceGap({ ...base, evidence: [{ strength: "weak" }] }), /behavioral, budget, or repeated/i);
  assert.match(getEvidenceGap({ ...base, evidence: [{ strength: "strong" }] }), /reconcile/i);
  assert.match(getEvidenceGap({ ...base, scores: { evidenceConfidence: 4 }, evidence: [{ strength: "strong" }] }), /define the smallest/i);
  assert.match(getEvidenceGap({ ...base, scores: { evidenceConfidence: 4 }, evidence: [{ strength: "strong" }], nextStep: "Interview three users" }), /ready/i);
});
