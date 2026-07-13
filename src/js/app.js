import { buildResearchBrief, downloadText, parseWorkspaceFile, safeFilename, serializeWorkspace } from "./export.js";
import { candidateToIdeaInput, loadDiscoveryFeed } from "./discovery.js";
import { getLanguage, setLanguage, t } from "./i18n.js";
import { createExampleWorkspace, createIdea, MAX_IMPORT_BYTES, THEMES, updateIdea, ValidationError, validateWorkspace } from "./model.js";
import { loadLanguage, loadWorkspace, saveLanguage, saveWorkspace } from "./storage.js";
import { closeIdeaDialog, confirmAction, initUI, openIdeaDialog, renderApp, setInterfaceLanguage, setTheme, showFormError, showToast } from "./ui.js";

setLanguage(loadLanguage());
const loaded = loadWorkspace();
let workspace = loaded.workspace;
let storageWarning = loaded.warning;
let storageWarningCode = loaded.warningCode;
let view = { search: "", status: "all", sort: "score" };
let discovery = { status: "loading", feed: null };

function render() {
  renderApp(workspace, view, storageWarningCode ? t(storageWarningCode) : storageWarning, discovery);
  applyTheme(workspace.preferences.theme);
}

function persist(nextWorkspace) {
  const normalized = validateWorkspace(nextWorkspace);
  workspace = normalized;
  const result = saveWorkspace(normalized);
  storageWarning = result.warning;
  storageWarningCode = result.warningCode;
  if (result.saved) workspace = result.workspace;
  render();
  return result.saved;
}

function resolvedTheme(theme) {
  if (theme === "system") {
    return globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
}

function applyTheme(theme) {
  setTheme(theme, resolvedTheme(theme));
}

async function deleteIdea(idea) {
  const confirmed = await confirmAction({
    title: t("delete.title"),
    message: t(idea.evidence.length === 1 ? "delete.message.one" : "delete.message.many", { title: idea.title, count: idea.evidence.length }),
    confirmLabel: t("delete.confirm"),
    danger: true,
  });
  if (!confirmed) return;
  persist({ ...workspace, ideas: workspace.ideas.filter((item) => item.id !== idea.id) });
  showToast(t("delete.done"));
}

function exportIdea(idea) {
  downloadText(`${safeFilename(idea.title)}-opportunity-brief.md`, buildResearchBrief(idea, getLanguage()), "text/markdown;charset=utf-8");
  showToast(t("export.briefDone"));
}

async function loadExample() {
  if (workspace.ideas.length > 0) {
    const confirmed = await confirmAction({
      title: t("examples.replaceTitle"),
      message: t("examples.replaceMessage"),
      confirmLabel: t("examples.confirm"),
      danger: true,
    });
    if (!confirmed) return;
  }
  const example = createExampleWorkspace(getLanguage());
  persist({ ...example, preferences: workspace.preferences });
  showToast(t("examples.loaded"));
}

function exportAll() {
  const date = new Date().toISOString().slice(0, 10);
  downloadText(`ai-idea-hunter-${date}.json`, serializeWorkspace(workspace), "application/json;charset=utf-8");
  showToast(t("backup.done"));
}

async function importFile(file) {
  if (file.size > MAX_IMPORT_BYTES) {
    showToast(t("import.tooLarge"));
    return;
  }
  try {
    const imported = parseWorkspaceFile(await file.text());
    const confirmed = await confirmAction({
      title: t("import.title"),
      message: t(imported.ideas.length === 1 ? "import.message.one" : "import.message.many", { count: imported.ideas.length }),
      confirmLabel: t("import.confirm"),
      danger: workspace.ideas.length > 0,
    });
    if (!confirmed) return;
    persist(imported);
    showToast(t("import.done"));
  } catch (error) {
    showToast(getLanguage() === "en" ? (error?.message ?? t("import.failed")) : t("import.failed"));
  }
}

async function cardAction(action, id) {
  const idea = workspace.ideas.find((item) => item.id === id);
  if (!idea) {
    showToast(t("idea.missing"));
    return;
  }
  if (action === "edit") openIdeaDialog(idea);
  if (action === "export") exportIdea(idea);
  if (action === "delete") await deleteIdea(idea);
}

function saveIdea(input) {
  try {
    const existing = input.id ? workspace.ideas.find((idea) => idea.id === input.id) : null;
    const saved = existing ? updateIdea(existing, input) : createIdea(input);
    const ideas = existing
      ? workspace.ideas.map((idea) => (idea.id === existing.id ? saved : idea))
      : [saved, ...workspace.ideas];
    const persisted = persist({ ...workspace, ideas });
    closeIdeaDialog();
    showToast(t(persisted ? "idea.saved" : "idea.memoryOnly", { title: saved.title }));
  } catch (error) {
    if (error instanceof ValidationError) {
      showFormError(error);
      return;
    }
    showToast(t("idea.saveFailed"));
  }
}

function saveDiscoveredCandidate(id) {
  const candidate = discovery.feed?.candidates.find((item) => item.id === id);
  if (!candidate) {
    showToast(t("discovery.missing"));
    return;
  }
  try {
    const saved = createIdea(candidateToIdeaInput(candidate));
    const persisted = persist({ ...workspace, ideas: [saved, ...workspace.ideas] });
    showToast(t(persisted ? "discovery.saved" : "idea.memoryOnly", { title: saved.title }));
  } catch {
    showToast(t("idea.saveFailed"));
  }
}

function changeTheme() {
  const current = workspace.preferences.theme;
  const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
  persist({ ...workspace, preferences: { ...workspace.preferences, theme: next } });
}

function changeLanguage() {
  const next = getLanguage() === "en" ? "zh-CN" : "en";
  saveLanguage(next);
  setInterfaceLanguage(next);
  render();
  showToast(t(`language.changed.${next}`));
}

initUI({
  onSaveIdea: saveIdea,
  onCardAction: cardAction,
  onLoadExample: loadExample,
  onExportAll: exportAll,
  onImportFile: importFile,
  onThemeToggle: changeTheme,
  onLanguageToggle: changeLanguage,
  onDiscoverySave: saveDiscoveredCandidate,
  onViewChange: (patch) => {
    view = { ...view, ...patch };
    render();
  },
});

globalThis.matchMedia?.("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
  if (workspace.preferences.theme === "system") applyTheme("system");
});

render();

loadDiscoveryFeed().then((result) => {
  discovery = result;
  render();
});
