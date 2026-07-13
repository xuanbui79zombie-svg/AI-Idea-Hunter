import assert from "node:assert/strict";
import test from "node:test";

import { getLanguage, normalizeLanguage, setLanguage, t, translateFor, translationKeys } from "../src/js/i18n.js";
import { createExampleWorkspace } from "../src/js/model.js";

test("English and Chinese expose the same translation contract", () => {
  assert.deepEqual(translationKeys("en"), translationKeys("zh-CN"));
  assert.ok(translationKeys("en").length > 200);
  assert.equal(translateFor("en", "action.newIdea"), "New idea");
  assert.equal(translateFor("zh-CN", "action.newIdea"), "新建创意");
});

test("language normalization, state, and interpolation are deterministic", () => {
  assert.equal(normalizeLanguage("zh-Hans"), "zh-CN");
  assert.equal(normalizeLanguage("fr"), "en");
  assert.equal(setLanguage("zh"), "zh-CN");
  assert.equal(getLanguage(), "zh-CN");
  assert.equal(t("result.many", { count: 3 }), "3 个创意");
  setLanguage("en");
  assert.equal(t("result.many", { count: 3 }), "3 ideas");
});

test("fictional examples use the selected language without changing the schema", () => {
  const english = createExampleWorkspace("en");
  const chinese = createExampleWorkspace("zh-CN");
  assert.equal(english.schemaVersion, chinese.schemaVersion);
  assert.equal(english.ideas[0].id, chinese.ideas[0].id);
  assert.equal(english.ideas[0].title, "Support Signal Miner");
  assert.equal(chinese.ideas[0].title, "客户支持信号挖掘器");
  assert.match(chinese.ideas[0].context, /虚构/);
});
