import assert from "node:assert/strict";
import test from "node:test";

import { buildResearchBrief, parseWorkspaceFile, safeFilename, serializeWorkspace } from "../src/js/export.js";
import { createExampleWorkspace, MAX_IMPORT_BYTES } from "../src/js/model.js";

test("workspace serialization is formatted, versioned, and reversible", () => {
  const workspace = createExampleWorkspace();
  const text = serializeWorkspace(workspace);
  assert.ok(text.endsWith("\n"));
  assert.match(text, /"schemaVersion": 1/);
  assert.match(text, /Support Signal Miner/);
  assert.deepEqual(parseWorkspaceFile(text), workspace);
});

test("workspace parser rejects unsafe or unsupported input atomically", () => {
  assert.throws(() => parseWorkspaceFile(null), TypeError);
  assert.throws(() => parseWorkspaceFile("{invalid"), SyntaxError);
  assert.throws(() => parseWorkspaceFile(JSON.stringify({ schemaVersion: 99, ideas: [], preferences: { theme: "system" } })), /Unsupported schema version/);
  assert.throws(() => parseWorkspaceFile("x".repeat(MAX_IMPORT_BYTES + 1)), RangeError);
});

test("safe filenames are portable and bounded", () => {
  assert.equal(safeFilename("  AI Support / Signal!  "), "ai-support-signal");
  assert.equal(safeFilename("***"), "idea");
  assert.ok(safeFilename("x".repeat(100)).length <= 60);
  assert.equal(safeFilename("Café Planner"), "cafe-planner");
});

test("research brief includes visible score, evidence, and caveats", () => {
  const [idea] = createExampleWorkspace().ideas;
  const brief = buildResearchBrief(idea);
  assert.match(brief, /^# Support Signal Miner/m);
  assert.match(brief, /Opportunity score/);
  assert.match(brief, /not proof of market demand/i);
  assert.match(brief, /Pain severity/);
  assert.match(brief, /Fictional support lead note/);
  assert.match(brief, /Interview three support leads/);
  assert.match(brief, /Verify every claim before sharing/);
});

test("research brief escapes Markdown control characters in user fields", () => {
  const idea = structuredClone(createExampleWorkspace().ideas[0]);
  idea.title = "[Risk] *Radar*";
  idea.problem = "A #heading and (link)";
  const brief = buildResearchBrief(idea);
  assert.match(brief, /\\\[Risk\\\] \\\*Radar\\\*/);
  assert.match(brief, /\\#heading/);
  assert.match(brief, /\\\(link\\\)/);
});
