import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { translationKeys } from "../src/js/i18n.js";

const root = process.cwd();
const sourceRoot = path.join(root, "src");
const errors = [];

const required = [
  "README.md",
  "LICENSE",
  "SECURITY.md",
  "CONTRIBUTING.md",
  "CHANGELOG.md",
  "TASKS.md",
  ".github/CODEOWNERS",
  ".github/dependabot.yml",
  ".github/workflows/quality.yml",
  ".github/workflows/pages.yml",
  "docs/PRODUCT.md",
  "docs/ARCHITECTURE.md",
  "docs/DATABASE.md",
  "docs/API.md",
  "docs/adr/0002-build-time-automated-discovery.md",
  "src/index.html",
  "src/styles.css",
  "src/favicon.svg",
  "src/js/app.js",
  "src/js/ui.js",
  "src/js/model.js",
  "src/js/scoring.js",
  "src/js/storage.js",
  "src/js/export.js",
  "src/js/discovery.js",
  "src/js/i18n.js",
  "src/data/opportunities.json",
];

async function exists(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    if (entry.isFile()) files.push(full);
  }
  return files;
}

for (const file of required) {
  if (!await exists(path.join(root, file))) errors.push(`Missing required file: ${file}`);
}

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
if (Object.keys(packageJson.dependencies ?? {}).length) errors.push("Production dependencies must remain empty for v1.0.0.");
if (Object.keys(packageJson.devDependencies ?? {}).length) errors.push("Development dependencies must remain empty for v1.0.0.");

const workflowFiles = [".github/workflows/quality.yml", ".github/workflows/pages.yml"];
for (const workflowFile of workflowFiles) {
  const workflow = await readFile(path.join(root, workflowFile), "utf8");
  for (const match of workflow.matchAll(/^\s*uses:\s*([^\s]+)$/gm)) {
    if (!/@[0-9a-f]{40}(?:\s*#.*)?$/i.test(match[1])) {
      errors.push(`${workflowFile} does not pin an action to a full commit SHA: ${match[1]}`);
    }
  }
  if (!workflow.includes("permissions:")) errors.push(`${workflowFile} must declare explicit permissions.`);
}

const sourceFiles = await walk(sourceRoot);
let totalBytes = 0;
for (const file of sourceFiles) totalBytes += (await stat(file)).size;
if (totalBytes > 250 * 1024) errors.push(`Static assets exceed 250 KiB: ${totalBytes} bytes.`);

const jsFiles = sourceFiles.filter((file) => file.endsWith(".js"));
const prohibitedJavaScript = [
  [/\.innerHTML\b/, "innerHTML"],
  [/\beval\s*\(/, "eval"],
  [/\bnew\s+Function\b/, "new Function"],
  [/\bfetch\s*\(/, "fetch"],
  [/\bXMLHttpRequest\b/, "XMLHttpRequest"],
  [/\bWebSocket\b/, "WebSocket"],
  [/\bsendBeacon\b/, "sendBeacon"],
];

for (const file of jsFiles) {
  const text = await readFile(file, "utf8");
  for (const [pattern, label] of prohibitedJavaScript) {
    if (label === "fetch" && path.relative(sourceRoot, file) === path.join("js", "discovery.js")) continue;
    if (pattern.test(text)) errors.push(`${path.relative(root, file)} uses prohibited runtime API: ${label}`);
  }
}

const html = await readFile(path.join(sourceRoot, "index.html"), "utf8");
const css = await readFile(path.join(sourceRoot, "styles.css"), "utf8");
if (!html.includes("connect-src 'self'")) errors.push("Content Security Policy must allow only same-origin candidate-feed connections.");
if (!html.includes("<main")) errors.push("Application shell requires a main landmark.");
if (!html.includes("aria-live")) errors.push("Application shell requires an ARIA live region.");
if (/<(?:script|link|img)[^>]+(?:src|href)=["']https?:/i.test(html)) errors.push("Runtime assets must not load from external origins.");
if (!html.includes('class="eyebrow-mark"')) errors.push("Hero eyebrow requires a dedicated decorative marker class.");
if (!/\.hero\s+\.eyebrow-mark\s*\{/.test(css)) errors.push("Hero eyebrow marker styles must target only the decorative element.");
if (/\.hero\s+\.eyebrow\s+span\s*\{/.test(css)) errors.push("Hero eyebrow styles must not collapse every text span.");
const knownTranslationKeys = new Set(translationKeys("en"));
for (const match of html.matchAll(/data-i18n(?:-placeholder|-aria)?="([^"]+)"/g)) {
  if (!knownTranslationKeys.has(match[1])) errors.push(`index.html references an unknown translation key: ${match[1]}`);
}

const markdownFiles = (await walk(root)).filter((file) => file.endsWith(".md") && !file.includes(`${path.sep}.git${path.sep}`));
const linkPattern = /!?\[[^\]]*\]\(([^)]+)\)/g;
for (const file of markdownFiles) {
  const text = await readFile(file, "utf8");
  if (file.endsWith(`${path.sep}0000-template.md`)) continue;
  if (/<[A-Z][A-Z0-9_]+>/.test(text)) errors.push(`${path.relative(root, file)} contains an unresolved placeholder.`);
  for (const match of text.matchAll(linkPattern)) {
    const target = match[1].trim();
    if (!target || target.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith("//")) continue;
    const localPath = decodeURIComponent(target.split("#", 1)[0]);
    if (localPath && !await exists(path.resolve(path.dirname(file), localPath)) && !(await stat(path.resolve(path.dirname(file), localPath)).catch(() => null))?.isDirectory()) {
      errors.push(`${path.relative(root, file)} has a broken link: ${target}`);
    }
  }
}

if (errors.length) {
  console.error(`Static checks failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Static checks passed: ${required.length} required files, ${sourceFiles.length} assets, ${totalBytes} bytes, ${markdownFiles.length} Markdown files.`);
