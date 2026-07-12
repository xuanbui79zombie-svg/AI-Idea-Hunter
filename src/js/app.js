import { buildResearchBrief, downloadText, parseWorkspaceFile, safeFilename, serializeWorkspace } from "./export.js";
import { createExampleWorkspace, createIdea, MAX_IMPORT_BYTES, THEMES, updateIdea, ValidationError, validateWorkspace } from "./model.js";
import { loadWorkspace, saveWorkspace } from "./storage.js";
import { closeIdeaDialog, confirmAction, initUI, openIdeaDialog, renderApp, setTheme, showFormError, showToast } from "./ui.js";

const loaded = loadWorkspace();
let workspace = loaded.workspace;
let storageWarning = loaded.warning;
let view = { search: "", status: "all", sort: "score" };

function render() {
  renderApp(workspace, view, storageWarning);
  applyTheme(workspace.preferences.theme);
}

function persist(nextWorkspace) {
  const normalized = validateWorkspace(nextWorkspace);
  workspace = normalized;
  const result = saveWorkspace(normalized);
  storageWarning = result.warning;
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
    title: "Delete this opportunity?",
    message: `“${idea.title}” and its ${idea.evidence.length} evidence note${idea.evidence.length === 1 ? "" : "s"} will be removed from this browser. Export a backup first if you may need it.`,
    confirmLabel: "Delete idea",
    danger: true,
  });
  if (!confirmed) return;
  persist({ ...workspace, ideas: workspace.ideas.filter((item) => item.id !== idea.id) });
  showToast("Opportunity deleted.");
}

function exportIdea(idea) {
  downloadText(`${safeFilename(idea.title)}-opportunity-brief.md`, buildResearchBrief(idea), "text/markdown;charset=utf-8");
  showToast("Research brief exported.");
}

async function loadExample() {
  if (workspace.ideas.length > 0) {
    const confirmed = await confirmAction({
      title: "Replace the current workspace?",
      message: "Loading the fictional examples will replace the ideas currently stored in this browser. Export a backup first if needed.",
      confirmLabel: "Load examples",
      danger: true,
    });
    if (!confirmed) return;
  }
  const example = createExampleWorkspace();
  persist({ ...example, preferences: workspace.preferences });
  showToast("Fictional examples loaded. They are not market evidence.");
}

function exportAll() {
  const date = new Date().toISOString().slice(0, 10);
  downloadText(`ai-idea-hunter-${date}.json`, serializeWorkspace(workspace), "application/json;charset=utf-8");
  showToast("Workspace backup exported.");
}

async function importFile(file) {
  if (file.size > MAX_IMPORT_BYTES) {
    showToast("Import file exceeds the 1 MiB limit.");
    return;
  }
  try {
    const imported = parseWorkspaceFile(await file.text());
    const confirmed = await confirmAction({
      title: "Restore this workspace?",
      message: `The file contains ${imported.ideas.length} idea${imported.ideas.length === 1 ? "" : "s"}. A valid import replaces the current browser workspace only after you confirm.`,
      confirmLabel: "Restore backup",
      danger: workspace.ideas.length > 0,
    });
    if (!confirmed) return;
    persist({ ...imported, preferences: workspace.preferences });
    showToast("Workspace restored from JSON.");
  } catch (error) {
    showToast(error?.message ?? "The selected file could not be imported.");
  }
}

async function cardAction(action, id) {
  const idea = workspace.ideas.find((item) => item.id === id);
  if (!idea) {
    showToast("That opportunity no longer exists.");
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
    showToast(persisted ? `“${saved.title}” saved.` : `“${saved.title}” is available in this tab but not browser storage.`);
  } catch (error) {
    if (error instanceof ValidationError) {
      showFormError(error);
      return;
    }
    showToast("The opportunity could not be saved.");
  }
}

function changeTheme() {
  const current = workspace.preferences.theme;
  const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
  persist({ ...workspace, preferences: { ...workspace.preferences, theme: next } });
}

initUI({
  onSaveIdea: saveIdea,
  onCardAction: cardAction,
  onLoadExample: loadExample,
  onExportAll: exportAll,
  onImportFile: importFile,
  onThemeToggle: changeTheme,
  onViewChange: (patch) => {
    view = { ...view, ...patch };
    render();
  },
});

globalThis.matchMedia?.("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
  if (workspace.preferences.theme === "system") applyTheme("system");
});

render();
