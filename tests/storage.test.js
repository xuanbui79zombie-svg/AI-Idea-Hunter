import assert from "node:assert/strict";
import test from "node:test";

import { createIdea, createEmptyWorkspace } from "../src/js/model.js";
import { clearWorkspace, LANGUAGE_KEY, loadLanguage, loadWorkspace, QUARANTINE_KEY, saveLanguage, saveWorkspace, STORAGE_KEY } from "../src/js/storage.js";

class MemoryStorage {
  constructor() {
    this.values = new Map();
    this.failRead = false;
    this.failWrite = false;
  }

  getItem(key) {
    if (this.failRead) throw new Error("read unavailable");
    return this.values.has(key) ? this.values.get(key) : null;
  }

  setItem(key, value) {
    if (this.failWrite) throw new Error("write unavailable");
    this.values.set(key, String(value));
  }

  removeItem(key) {
    this.values.delete(key);
  }
}

const idea = createIdea({
  title: "Storage test",
  audience: "Developers",
  problem: "Local data can fail",
  context: "Browser storage",
  outcome: "Visible recovery",
  status: "inbox",
  nextStep: "Test failure",
}, "2026-07-12T04:00:00.000Z");

test("loadWorkspace returns a safe empty value when storage is empty", () => {
  const storage = new MemoryStorage();
  const result = loadWorkspace(storage);
  assert.deepEqual(result.workspace, createEmptyWorkspace());
  assert.equal(result.warning, "");
});

test("save and load round-trip a validated workspace", () => {
  const storage = new MemoryStorage();
  const workspace = { ...createEmptyWorkspace(), ideas: [idea] };
  const saved = saveWorkspace(workspace, storage);
  assert.equal(saved.saved, true);
  assert.equal(saved.warning, "");
  assert.ok(storage.getItem(STORAGE_KEY).includes("Storage test"));
  const loaded = loadWorkspace(storage);
  assert.deepEqual(loaded.workspace, workspace);
  assert.equal(loaded.warning, "");
});

test("save failure keeps the in-memory workspace and reports risk", () => {
  const storage = new MemoryStorage();
  storage.failWrite = true;
  const workspace = { ...createEmptyWorkspace(), ideas: [idea] };
  const result = saveWorkspace(workspace, storage);
  assert.equal(result.saved, false);
  assert.equal(result.workspace, workspace);
  assert.match(result.warning, /could not be saved/i);
  assert.ok(result.cause instanceof Error);
});

test("corrupted stored data is quarantined and replaced safely", () => {
  const storage = new MemoryStorage();
  storage.setItem(STORAGE_KEY, "{broken-json");
  const result = loadWorkspace(storage);
  assert.deepEqual(result.workspace, createEmptyWorkspace());
  assert.match(result.warning, /could not be loaded/i);
  assert.equal(storage.getItem(STORAGE_KEY), null);
  assert.equal(storage.getItem(QUARANTINE_KEY), "{broken-json");
});

test("unavailable reads return an empty workspace with a warning", () => {
  const storage = new MemoryStorage();
  storage.failRead = true;
  const result = loadWorkspace(storage);
  assert.deepEqual(result.workspace, createEmptyWorkspace());
  assert.match(result.warning, /safe empty workspace/i);
});

test("clearWorkspace removes only the active application key", () => {
  const storage = new MemoryStorage();
  storage.setItem(STORAGE_KEY, "active");
  storage.setItem(QUARANTINE_KEY, "backup");
  const result = clearWorkspace(storage);
  assert.equal(result.cleared, true);
  assert.equal(storage.getItem(STORAGE_KEY), null);
  assert.equal(storage.getItem(QUARANTINE_KEY), "backup");
});

test("language preference persists separately from workspace data", () => {
  const storage = new MemoryStorage();
  assert.equal(loadLanguage(storage, "zh-CN"), "zh-CN");
  assert.deepEqual(saveLanguage("en", storage), { saved: true, language: "en" });
  assert.equal(storage.getItem(LANGUAGE_KEY), "en");
  assert.equal(loadLanguage(storage, "zh-CN"), "en");
  assert.equal(storage.getItem(STORAGE_KEY), null);
});

test("language preference falls back safely when storage is unavailable", () => {
  const storage = new MemoryStorage();
  storage.failRead = true;
  assert.equal(loadLanguage(storage, "zh-Hans"), "zh-CN");
  storage.failRead = false;
  storage.failWrite = true;
  const result = saveLanguage("zh-CN", storage);
  assert.equal(result.saved, false);
  assert.equal(result.language, "zh-CN");
  assert.ok(result.cause instanceof Error);
});
