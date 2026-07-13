import { dedupeSignals } from "./core.mjs";

const HN_BASE = "https://hacker-news.firebaseio.com/v0";
const GITHUB_API = "https://api.github.com";

async function json(response) {
  if (!response.ok) throw new Error(`Source request failed: ${response.status}`);
  return response.json();
}

export async function collectHackerNews(fetchImpl = fetch) {
  const ids = await json(await fetchImpl(`${HN_BASE}/beststories.json`));
  const items = await Promise.all(ids.slice(0, 60).map(async (id) => {
    try {
      return await json(await fetchImpl(`${HN_BASE}/item/${id}.json`));
    } catch {
      return null;
    }
  }));
  const signalPattern = /\b(ask hn|how (?:do|can|to)|struggl|problem|pain|wish|workflow|help|alternative|tool for)\b/i;
  const selected = items.filter((item) => item?.type === "story" && item.title && signalPattern.test(`${item.title} ${item.text ?? ""}`));
  return selected.slice(0, 10).map((item) => ({
    source: "hackernews",
    externalId: item.id,
    title: item.title,
    excerpt: item.text || item.title,
    url: `https://news.ycombinator.com/item?id=${item.id}`,
    publishedAt: new Date(item.time * 1000).toISOString(),
    engagement: (item.score || 0) + (item.descendants || 0),
  }));
}

export async function collectGitHubIssues(token, fetchImpl = fetch) {
  const since = new Date(Date.now() - 45 * 86_400_000).toISOString().slice(0, 10);
  const queries = [
    `is:issue is:open \"feature request\" created:>=${since}`,
    `is:issue is:open \"would be useful\" created:>=${since}`,
  ];
  const headers = {
    Accept: "application/vnd.github.text+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const batches = await Promise.all(queries.map(async (query) => {
    const url = `${GITHUB_API}/search/issues?q=${encodeURIComponent(query)}&sort=comments&order=desc&per_page=8`;
    return json(await fetchImpl(url, { headers }));
  }));
  return batches.flatMap((batch) => batch.items ?? []).filter((item) => !item.pull_request).map((item) => ({
    source: "github",
    externalId: item.id,
    title: item.title,
    excerpt: item.body_text || item.body || item.title,
    url: item.html_url,
    publishedAt: item.created_at,
    engagement: item.comments || 0,
  })).slice(0, 10);
}

export async function collectPublicSignals({ token = "", fetchImpl = fetch } = {}) {
  const sourceSummary = [];
  const collected = [];
  for (const [source, collector] of [
    ["hackernews", () => collectHackerNews(fetchImpl)],
    ["github", () => collectGitHubIssues(token, fetchImpl)],
  ]) {
    try {
      const signals = await collector();
      collected.push(...signals);
      sourceSummary.push({ source, count: signals.length, status: "ready" });
    } catch (error) {
      console.warn(`${source} collection unavailable: ${error.message}`);
      sourceSummary.push({ source, count: 0, status: "unavailable" });
    }
  }
  return { signals: dedupeSignals(collected, 20), sourceSummary };
}
