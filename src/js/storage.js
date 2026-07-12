import { createEmptyWorkspace, validateWorkspace } from "./model.js";

export const STORAGE_KEY = "ai-idea-hunter.workspace.v1";
export const QUARANTINE_KEY = "ai-idea-hunter.workspace.quarantine";

function resolveStorage(storage) {
  if (storage) {
    return storage;
  }
  return globalThis.localStorage;
}

export function loadWorkspace(storage) {
  const empty = createEmptyWorkspace();
  let adapter;
  try {
    adapter = resolveStorage(storage);
    const raw = adapter.getItem(STORAGE_KEY);
    if (!raw) {
      return { workspace: empty, warning: "" };
    }
    return { workspace: validateWorkspace(JSON.parse(raw)), warning: "" };
  } catch (error) {
    try {
      const raw = adapter?.getItem?.(STORAGE_KEY);
      if (raw) {
        adapter.setItem(QUARANTINE_KEY, raw);
        adapter.removeItem(STORAGE_KEY);
      }
    } catch {
      // Recovery is best effort; the user-facing warning remains the source of truth.
    }
    return {
      workspace: empty,
      warning: "Saved data could not be loaded. A safe empty workspace is open; restore a known-good JSON backup if available.",
      cause: error,
    };
  }
}

export function saveWorkspace(workspace, storage) {
  try {
    const normalized = validateWorkspace(workspace);
    resolveStorage(storage).setItem(STORAGE_KEY, JSON.stringify(normalized));
    return { saved: true, workspace: normalized, warning: "" };
  } catch (error) {
    return {
      saved: false,
      workspace,
      warning: "Changes are available in this tab but could not be saved in the browser. Export a JSON backup before closing.",
      cause: error,
    };
  }
}

export function clearWorkspace(storage) {
  try {
    resolveStorage(storage).removeItem(STORAGE_KEY);
    return { cleared: true, warning: "" };
  } catch (error) {
    return { cleared: false, warning: "Browser storage could not be cleared.", cause: error };
  }
}
