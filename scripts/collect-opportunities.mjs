import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { buildFeed, buildModelMessages, fallbackCandidates, parseModelJson, validateModelCandidates } from "./discovery/core.mjs";
import { collectPublicSignals } from "./discovery/sources.mjs";

function argument(name, fallback = "") {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

async function analyzeWithGitHubModels(signals, token, model) {
  if (!token) throw new Error("GITHUB_TOKEN is unavailable");
  const response = await fetch("https://models.github.ai/inference/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages: buildModelMessages(signals), temperature: 0.2, max_tokens: 3500 }),
  });
  if (!response.ok) throw new Error(`GitHub Models returned ${response.status}`);
  const payload = await response.json();
  return validateModelCandidates(parseModelJson(payload?.choices?.[0]?.message?.content), signals);
}

async function main() {
  const output = path.resolve(argument("--output", "src/data/opportunities.json"));
  const fixture = argument("--fixture");
  const noAi = process.argv.includes("--no-ai");
  const token = process.env.GITHUB_TOKEN || "";
  const model = process.env.DISCOVERY_MODEL || "openai/gpt-4o";

  const collected = fixture
    ? JSON.parse(await readFile(path.resolve(fixture), "utf8"))
    : await collectPublicSignals({ token });
  const signals = collected.signals ?? [];
  let candidates = [];
  let analysisMode = "empty";
  let usedModel = "";

  if (signals.length) {
    try {
      if (noAi) throw new Error("AI disabled for deterministic run");
      candidates = await analyzeWithGitHubModels(signals, token, model);
      analysisMode = "ai";
      usedModel = model;
    } catch (error) {
      console.warn(`AI analysis unavailable: ${error.message}`);
      candidates = fallbackCandidates(signals);
      analysisMode = "fallback";
      usedModel = "deterministic-fallback";
    }
  }

  const feed = buildFeed({
    candidates,
    sourceSummary: collected.sourceSummary ?? [],
    analysisMode,
    model: usedModel,
  });
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(feed, null, 2)}\n`, "utf8");
  console.log(`Discovery feed written: ${feed.candidates.length} candidates, mode=${feed.analysisMode}, output=${output}`);
}

await main();
