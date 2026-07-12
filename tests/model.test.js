import assert from "node:assert/strict";
import test from "node:test";

import {
  createEmptyWorkspace,
  createExampleWorkspace,
  createIdea,
  MAX_IDEAS,
  SCHEMA_VERSION,
  updateIdea,
  validateWorkspace,
  ValidationError,
} from "../src/js/model.js";

const now = "2026-07-12T04:00:00.000Z";
const basicInput = {
  title: "  Useful idea  ",
  audience: "Independent developers",
  problem: "A repeated workflow problem",
  context: "During project selection",
  outcome: "A clearer choice",
  status: "inbox",
  nextStep: "Interview three developers",
};

test("empty workspace is valid and versioned", () => {
  const workspace = createEmptyWorkspace();
  assert.equal(workspace.schemaVersion, SCHEMA_VERSION);
  assert.deepEqual(workspace.ideas, []);
  assert.deepEqual(workspace.preferences, { theme: "system" });
  assert.deepEqual(validateWorkspace(workspace), workspace);
});

test("createIdea normalizes text and supplies safe defaults", () => {
  const idea = createIdea(basicInput, now);
  assert.match(idea.id, /^idea-/);
  assert.equal(idea.title, "Useful idea");
  assert.equal(idea.status, "inbox");
  assert.equal(idea.scores.pain, 3);
  assert.equal(idea.scores.evidenceConfidence, 1);
  assert.deepEqual(idea.evidence, []);
  assert.equal(idea.createdAt, now);
  assert.equal(idea.updatedAt, now);
});

test("createIdea validates required fields and limits", () => {
  assert.throws(() => createIdea({ ...basicInput, title: "" }, now), ValidationError);
  assert.throws(() => createIdea({ ...basicInput, audience: 42 }, now), ValidationError);
  assert.throws(() => createIdea({ ...basicInput, problem: "x".repeat(601) }, now), ValidationError);
  assert.throws(() => createIdea({ ...basicInput, status: "launched" }, now), ValidationError);
  assert.throws(() => createIdea({ ...basicInput, scores: { pain: 9 } }, now), ValidationError);
});

test("evidence is normalized and validated", () => {
  const idea = createIdea({
    ...basicInput,
    evidence: [{ source: "  Interview  ", observation: "  Repeated copying  ", strength: "strong", observedAt: "2026-07-10" }],
  }, now);
  assert.match(idea.evidence[0].id, /^evidence-/);
  assert.equal(idea.evidence[0].source, "Interview");
  assert.equal(idea.evidence[0].observation, "Repeated copying");
  assert.equal(idea.evidence[0].strength, "strong");
  assert.throws(() => createIdea({ ...basicInput, evidence: [{ source: "x", observation: "y", strength: "certain", observedAt: "2026-07-10" }] }, now), ValidationError);
  assert.throws(() => createIdea({ ...basicInput, evidence: [{ source: "x", observation: "y", strength: "weak", observedAt: "not-a-date" }] }, now), ValidationError);
});

test("updateIdea preserves identity and creation while advancing update time", () => {
  const idea = createIdea(basicInput, now);
  const later = "2026-07-13T04:00:00.000Z";
  const updated = updateIdea(idea, { title: "Refined idea", scores: { ...idea.scores, pain: 5 } }, later);
  assert.equal(updated.id, idea.id);
  assert.equal(updated.createdAt, idea.createdAt);
  assert.equal(updated.updatedAt, later);
  assert.equal(updated.title, "Refined idea");
  assert.equal(updated.scores.pain, 5);
  assert.throws(() => updateIdea(null, {}), ValidationError);
});

test("workspace validation rejects duplicate IDs and invalid preferences", () => {
  const idea = createIdea(basicInput, now);
  assert.throws(() => validateWorkspace({ schemaVersion: 2, ideas: [], preferences: { theme: "system" } }), ValidationError);
  assert.throws(() => validateWorkspace({ schemaVersion: 1, ideas: [idea, idea], preferences: { theme: "system" } }), ValidationError);
  assert.throws(() => validateWorkspace({ schemaVersion: 1, ideas: [], preferences: { theme: "neon" } }), ValidationError);
  assert.throws(() => validateWorkspace({ schemaVersion: 1, ideas: Array(MAX_IDEAS + 1).fill(idea), preferences: { theme: "system" } }), ValidationError);
  const { createdAt: _createdAt, updatedAt: _updatedAt, ...withoutTimestamps } = idea;
  assert.throws(() => validateWorkspace({ schemaVersion: 1, ideas: [withoutTimestamps], preferences: { theme: "system" } }), ValidationError);
});

test("example workspace is deterministic, valid, and explicitly fictional", () => {
  const workspace = createExampleWorkspace();
  assert.equal(workspace.ideas.length, 2);
  assert.equal(workspace.schemaVersion, 1);
  assert.ok(workspace.ideas.every((idea) => idea.context.toLowerCase().includes("fictional")));
  assert.deepEqual(validateWorkspace(workspace), workspace);
});
