import { EVIDENCE_STRENGTHS, STATUSES } from "./model.js";
import { getLanguage, setLanguage, t } from "./i18n.js";
import { calculateScore, getEvidenceGapKey, getScoreBand, getScoreBreakdown, SCORE_FACTORS } from "./scoring.js";

const elements = {};
let callbacks = {};
let evidenceDraft = [];
let lastFocusedElement = null;
let toastTimer = null;

function byId(id) {
  return document.getElementById(id);
}

function element(tag, { className, text, attributes } = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  if (attributes) {
    for (const [name, value] of Object.entries(attributes)) {
      node.setAttribute(name, String(value));
    }
  }
  return node;
}

function statusLabel(status) {
  return t(`status.${status}`);
}

function formatDate(value) {
  const date = new Date(value);
  return new Intl.DateTimeFormat(getLanguage(), { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function todayInputValue() {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

function button(labelKey, action, ideaId, symbol, title) {
  const label = t(labelKey);
  const node = element("button", {
    className: "card-action",
    text: symbol,
    attributes: {
      type: "button",
      "data-action": action,
      "data-idea-id": ideaId,
      title: label,
      "aria-label": t("action.aria", { action: label, title }),
    },
  });
  return node;
}

function buildScoreEditor() {
  const fragment = document.createDocumentFragment();
  for (const factor of SCORE_FACTORS) {
    const wrapper = element("div", { className: "score-field" });
    const header = element("div", { className: "score-field-header" });
    const label = element("label", {
      text: t(`factor.${factor.key}.label`),
      attributes: { for: `score-${factor.key}`, id: `label-${factor.key}` },
    });
    const output = element("output", { text: factor.key === "evidenceConfidence" ? "1" : "3", attributes: { for: `score-${factor.key}`, id: `output-${factor.key}` } });
    const input = element("input", {
      attributes: {
        id: `score-${factor.key}`,
        name: `score-${factor.key}`,
        type: "range",
        min: "1",
        max: "5",
        step: "1",
        value: factor.key === "evidenceConfidence" ? "1" : "3",
      },
    });
    const guidance = element("small", {
      text: t(`guidance.${factor.key}.${Number(input.value) - 1}`),
      attributes: { id: `guidance-${factor.key}` },
    });
    header.append(label, output);
    wrapper.append(header, input, guidance);
    fragment.append(wrapper);
  }
  elements.scoreEditor.append(fragment);
}

function currentScores() {
  return Object.fromEntries(SCORE_FACTORS.map((factor) => [factor.key, Number(byId(`score-${factor.key}`).value)]));
}

function updateScorePreview() {
  const scores = currentScores();
  const score = calculateScore(scores);
  const band = getScoreBand(score);
  elements.scorePreviewValue.textContent = String(score);
  elements.scorePreviewBand.textContent = t(`band.${band.key}.label`);
  for (const factor of SCORE_FACTORS) {
    byId(`label-${factor.key}`).textContent = t(`factor.${factor.key}.label`);
    byId(`output-${factor.key}`).textContent = String(scores[factor.key]);
    byId(`guidance-${factor.key}`).textContent = t(`guidance.${factor.key}.${scores[factor.key] - 1}`);
  }
}

function renderEvidenceDraft() {
  elements.evidenceList.replaceChildren();
  if (evidenceDraft.length === 0) {
    elements.evidenceList.append(element("p", { className: "eyebrow", text: t("evidence.none") }));
    return;
  }

  const fragment = document.createDocumentFragment();
  evidenceDraft.forEach((item, index) => {
    const row = element("article", { className: "evidence-item" });
    const strength = element("span", {
      className: "evidence-strength",
      attributes: { "data-strength": item.strength, title: t("evidence.strengthTitle", { strength: t(`strength.${item.strength}`) }) },
    });
    const copy = element("div");
    copy.append(
      element("strong", { text: `${item.source} · ${item.observedAt}` }),
      element("p", { text: item.observation }),
    );
    const remove = element("button", {
      className: "card-action",
      text: "×",
      attributes: { type: "button", "data-evidence-index": index, "aria-label": t("evidence.remove", { source: item.source }) },
    });
    row.append(strength, copy, remove);
    fragment.append(row);
  });
  elements.evidenceList.append(fragment);
}

function clearFormErrors() {
  for (const field of elements.ideaForm.querySelectorAll("[aria-invalid='true']")) {
    field.removeAttribute("aria-invalid");
  }
}

function setCharacterCounts() {
  for (const count of elements.ideaForm.querySelectorAll("[data-count-for]")) {
    const input = byId(count.dataset.countFor);
    count.textContent = `${input.value.length} / ${input.maxLength}`;
  }
}

function createIdeaCard(idea) {
  const score = calculateScore(idea.scores);
  const band = getScoreBand(score);
  const breakdown = getScoreBreakdown(idea.scores);
  const card = element("article", { className: "idea-card", attributes: { "data-band": band.key } });

  const top = element("div", { className: "card-topline" });
  top.append(
    element("span", { className: "status-pill", text: statusLabel(idea.status) }),
    element("span", {
      className: "score-badge",
      text: String(score),
      attributes: { title: t("card.scoreTitle", { score, band: t(`band.${band.key}.label`) }) },
    }),
  );

  const title = element("h3", { text: idea.title });
  const audience = element("p", { className: "audience", text: idea.audience });
  const problem = element("p", { className: "problem-excerpt", text: idea.problem });

  const scoreLine = element("div", { className: "score-line", attributes: { "aria-label": t("card.factorProfile") } });
  for (const factor of breakdown) {
    const segment = element("span", {
      className: "score-segment",
      attributes: { title: t("card.factorTitle", { factor: t(`factor.${factor.key}.label`), value: factor.value }) },
    });
    const fill = element("span");
    fill.style.width = `${factor.value * 20}%`;
    segment.append(fill);
    scoreLine.append(segment);
  }

  const meta = element("div", { className: "card-meta" });
  meta.append(
    element("span", { text: t(idea.evidence.length === 1 ? "card.evidence.one" : "card.evidence.many", { count: idea.evidence.length }) }),
    element("span", { text: t("card.updated", { date: formatDate(idea.updatedAt) }) }),
  );

  const footer = element("div", { className: "card-footer" });
  const gap = t(`gap.${getEvidenceGapKey(idea)}`);
  footer.append(element("span", { className: "evidence-gap", text: gap, attributes: { title: gap } }));
  const actions = element("div", { className: "card-actions" });
  actions.append(
    button("action.edit", "edit", idea.id, "✎", idea.title),
    button("action.export", "export", idea.id, "⇩", idea.title),
    button("action.delete", "delete", idea.id, "×", idea.title),
  );
  footer.append(actions);
  card.append(top, title, audience, problem, scoreLine, meta, footer);
  return card;
}

function createDiscoveryCard(candidate) {
  const score = calculateScore(candidate.scores);
  const band = getScoreBand(score);
  const card = element("article", { className: "discovery-card", attributes: { "data-band": band.key } });
  const top = element("div", { className: "card-topline" });
  top.append(
    element("span", { className: "status-pill", text: t(`band.${band.key}.label`) }),
    element("span", { className: "score-badge", text: String(score), attributes: { title: t("discovery.scoreCaveat") } }),
  );
  card.append(
    top,
    element("h3", { text: candidate.title }),
    element("p", { className: "audience", text: candidate.audience }),
    element("p", { className: "problem-excerpt", text: candidate.problem }),
  );

  const analysis = element("div", { className: "discovery-analysis" });
  analysis.append(
    element("strong", { text: t("discovery.reasoning") }),
    element("p", { text: candidate.reasoning }),
  );
  if (candidate.uncertainties.length) {
    analysis.append(element("strong", { text: t("discovery.uncertainties") }));
    const list = element("ul");
    for (const uncertainty of candidate.uncertainties) list.append(element("li", { text: uncertainty }));
    analysis.append(list);
  }
  card.append(analysis);

  const sources = element("div", { className: "discovery-sources" });
  sources.append(element("strong", { text: t("discovery.sources") }));
  for (const source of candidate.sources) {
    const link = element("a", {
      text: `${source.source === "github" ? "GitHub" : "Hacker News"}: ${source.title}`,
      attributes: { href: source.url, target: "_blank", rel: "noopener noreferrer" },
    });
    sources.append(link);
  }
  card.append(sources);

  const action = element("button", {
    className: "button button-secondary discovery-save",
    text: t("discovery.save"),
    attributes: { type: "button", "data-candidate-id": candidate.id },
  });
  card.append(action);
  return card;
}

function renderDiscovery(discovery) {
  elements.discoveryGrid.replaceChildren();
  if (discovery.status === "loading") {
    elements.discoveryMode.textContent = t("discovery.loading");
    elements.discoverySummary.textContent = "";
    return;
  }
  if (discovery.status === "unavailable" || !discovery.feed) {
    elements.discoveryMode.textContent = t("discovery.unavailable");
    elements.discoverySummary.textContent = t("discovery.unavailableCopy");
    return;
  }
  const { feed } = discovery;
  elements.discoveryMode.textContent = t(`discovery.mode.${feed.analysisMode}`);
  const readySources = feed.sourceSummary.filter((item) => item.status === "ready").length;
  elements.discoverySummary.textContent = t("discovery.summary", {
    count: feed.candidates.length,
    sources: readySources,
    date: formatDate(feed.generatedAt),
  });
  if (!feed.candidates.length) {
    elements.discoveryGrid.append(element("p", { className: "discovery-empty", text: t("discovery.empty") }));
    return;
  }
  elements.discoveryGrid.append(...feed.candidates.map(createDiscoveryCard));
}

function filteredIdeas(workspace, view) {
  const query = view.search.trim().toLowerCase();
  const ideas = workspace.ideas.filter((idea) => {
    const matchesStatus = view.status === "all" || idea.status === view.status;
    const haystack = `${idea.title} ${idea.audience} ${idea.problem} ${idea.outcome} ${idea.context}`.toLowerCase();
    return matchesStatus && (!query || haystack.includes(query));
  });

  return ideas.sort((left, right) => {
    if (view.sort === "updated") return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
    if (view.sort === "title") return left.title.localeCompare(right.title);
    return calculateScore(right.scores) - calculateScore(left.scores) || Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
  });
}

export function renderApp(workspace, view, warning = "", discovery = { status: "loading", feed: null }) {
  const active = workspace.ideas.filter((idea) => idea.status !== "archived");
  const ranked = [...active].sort((a, b) => calculateScore(b.scores) - calculateScore(a.scores));
  const top = ranked[0];
  const average = active.length
    ? Math.round(active.reduce((sum, idea) => sum + calculateScore(idea.scores), 0) / active.length)
    : null;
  const gaps = active.filter((idea) => !idea.evidence.some((item) => item.strength === "strong")).length;

  elements.metricActive.textContent = String(active.length);
  elements.metricAverage.textContent = average === null ? "—" : String(average);
  elements.metricGaps.textContent = String(gaps);
  elements.metricTop.textContent = top?.title ?? t("metric.noSignal");
  elements.metricTopDetail.textContent = top
    ? `${calculateScore(top.scores)}/100 · ${t(`band.${getScoreBand(calculateScore(top.scores)).key}.label`)}`
    : t("metric.captureFirst");
  elements.dashboardSummary.textContent = active.length
    ? t(active.length === 1 ? "dashboard.summary.one" : "dashboard.summary.many", { count: active.length, gaps })
    : t("dashboard.empty");

  const ideas = filteredIdeas(workspace, view);
  elements.ideaGrid.replaceChildren(...ideas.map(createIdeaCard));
  elements.emptyState.hidden = workspace.ideas.length > 0 || Boolean(view.search) || view.status !== "all";
  elements.ideaGrid.hidden = ideas.length === 0;
  elements.resultCount.textContent = t(ideas.length === 1 ? "result.one" : "result.many", { count: ideas.length });
  if (workspace.ideas.length > 0 && ideas.length === 0) {
    elements.ideaGrid.hidden = false;
    elements.ideaGrid.append(element("p", { className: "empty-state", text: t("result.none") }));
  }

  elements.storageWarning.hidden = !warning;
  elements.storageWarningText.textContent = warning;
  renderDiscovery(discovery);
}

export function openIdeaDialog(idea) {
  clearFormErrors();
  elements.ideaForm.reset();
  evidenceDraft = idea?.evidence ? structuredClone(idea.evidence) : [];
  elements.ideaId.value = idea?.id ?? "";
  elements.ideaTitle.value = idea?.title ?? "";
  elements.ideaAudience.value = idea?.audience ?? "";
  elements.ideaProblem.value = idea?.problem ?? "";
  elements.ideaContext.value = idea?.context ?? "";
  elements.ideaOutcome.value = idea?.outcome ?? "";
  elements.ideaStatus.value = idea?.status ?? "inbox";
  elements.ideaNextStep.value = idea?.nextStep ?? "";
  for (const factor of SCORE_FACTORS) {
    byId(`score-${factor.key}`).value = String(idea?.scores?.[factor.key] ?? (factor.key === "evidenceConfidence" ? 1 : 3));
  }
  elements.evidenceDate.value = todayInputValue();
  elements.evidenceError.textContent = "";
  elements.ideaDialogKicker.textContent = t(idea ? "dialog.editKicker" : "dialog.newKicker");
  elements.ideaDialogTitle.textContent = t(idea ? "dialog.editTitle" : "dialog.newTitle");
  renderEvidenceDraft();
  updateScorePreview();
  setCharacterCounts();
  lastFocusedElement = document.activeElement;
  elements.ideaDialog.showModal();
  elements.ideaTitle.focus();
}

export function closeIdeaDialog() {
  elements.ideaDialog.close();
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

export function readIdeaForm() {
  const data = new FormData(elements.ideaForm);
  return {
    id: data.get("id") || undefined,
    title: data.get("title"),
    audience: data.get("audience"),
    problem: data.get("problem"),
    context: data.get("context"),
    outcome: data.get("outcome"),
    status: data.get("status"),
    nextStep: data.get("nextStep"),
    scores: currentScores(),
    evidence: structuredClone(evidenceDraft),
  };
}

export function showFormError(error) {
  clearFormErrors();
  const issue = error?.issues?.[0];
  const map = {
    title: "idea-title",
    audience: "idea-audience",
    problem: "idea-problem",
    context: "idea-context",
    outcome: "idea-outcome",
    status: "idea-status",
    nextStep: "idea-next-step",
  };
  const target = byId(map[issue?.field] ?? "idea-title");
  target?.setAttribute("aria-invalid", "true");
  target?.focus();
  showToast(getLanguage() === "en" ? (issue?.message ?? error?.message ?? t("form.review")) : t("form.review"));
}

export function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  toastTimer = setTimeout(() => {
    elements.toast.hidden = true;
  }, 4200);
}

export function setTheme(theme, resolvedTheme) {
  document.documentElement.dataset.theme = resolvedTheme;
  const label = t(`theme.${theme}`);
  elements.themeLabel.textContent = label;
  elements.themeToggle.setAttribute("aria-label", t("theme.aria", { theme: label }));
}

function applyStaticTranslations() {
  document.documentElement.lang = getLanguage();
  document.title = t("page.title");
  document.querySelector('meta[name="description"]')?.setAttribute("content", t("meta.description"));
  for (const node of document.querySelectorAll("[data-i18n]")) {
    node.textContent = t(node.dataset.i18n);
  }
  for (const node of document.querySelectorAll("[data-i18n-placeholder]")) {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  }
  for (const node of document.querySelectorAll("[data-i18n-aria]")) {
    node.setAttribute("aria-label", t(node.dataset.i18nAria));
  }
  elements.languageLabel.textContent = t(`language.label.${getLanguage()}`);
  elements.languageToggle.setAttribute("aria-label", t(`language.aria.${getLanguage()}`));
}

export function setInterfaceLanguage(language) {
  setLanguage(language);
  applyStaticTranslations();
  updateScorePreview();
  renderEvidenceDraft();
}

export function confirmAction({ title, message, confirmLabel = "Confirm", danger = false }) {
  elements.confirmTitle.textContent = title;
  elements.confirmMessage.textContent = message;
  elements.confirmButton.textContent = confirmLabel;
  elements.confirmButton.className = `button ${danger ? "button-danger" : "button-primary"}`;
  elements.confirmDialog.showModal();
  return new Promise((resolve) => {
    elements.confirmDialog.addEventListener("close", () => resolve(elements.confirmDialog.returnValue === "confirm"), { once: true });
  });
}

function addEvidenceFromComposer() {
  const source = elements.evidenceSource.value.trim();
  const observation = elements.evidenceObservation.value.trim();
  const strength = elements.evidenceStrength.value;
  const observedAt = elements.evidenceDate.value;
  if (!source || !observation || !observedAt || !EVIDENCE_STRENGTHS.includes(strength)) {
    elements.evidenceError.textContent = t("evidence.incomplete");
    (!source ? elements.evidenceSource : !observation ? elements.evidenceObservation : elements.evidenceDate).focus();
    return;
  }
  evidenceDraft.push({ source, observation, strength, observedAt });
  elements.evidenceSource.value = "";
  elements.evidenceObservation.value = "";
  elements.evidenceStrength.value = "weak";
  elements.evidenceDate.value = todayInputValue();
  elements.evidenceError.textContent = "";
  renderEvidenceDraft();
  elements.evidenceSource.focus();
}

export function initUI(handlers) {
  callbacks = handlers;
  Object.assign(elements, {
    languageToggle: byId("language-toggle"),
    languageLabel: byId("language-label"),
    themeToggle: byId("theme-toggle"),
    themeLabel: byId("theme-label"),
    searchInput: byId("search-input"),
    statusFilter: byId("status-filter"),
    sortSelect: byId("sort-select"),
    resultCount: byId("result-count"),
    ideaGrid: byId("idea-grid"),
    emptyState: byId("empty-state"),
    metricTop: byId("metric-top"),
    metricTopDetail: byId("metric-top-detail"),
    metricActive: byId("metric-active"),
    metricAverage: byId("metric-average"),
    metricGaps: byId("metric-gaps"),
    dashboardSummary: byId("dashboard-summary"),
    storageWarning: byId("storage-warning"),
    storageWarningText: byId("storage-warning-text"),
    ideaDialog: byId("idea-dialog"),
    ideaDialogKicker: byId("idea-dialog-kicker"),
    ideaDialogTitle: byId("idea-dialog-title"),
    ideaForm: byId("idea-form"),
    ideaId: byId("idea-id"),
    ideaTitle: byId("idea-title"),
    ideaAudience: byId("idea-audience"),
    ideaProblem: byId("idea-problem"),
    ideaContext: byId("idea-context"),
    ideaOutcome: byId("idea-outcome"),
    ideaStatus: byId("idea-status"),
    ideaNextStep: byId("idea-next-step"),
    scoreEditor: byId("score-editor"),
    scorePreviewValue: byId("score-preview-value"),
    scorePreviewBand: byId("score-preview-band"),
    evidenceList: byId("evidence-list"),
    evidenceSource: byId("evidence-source"),
    evidenceObservation: byId("evidence-observation"),
    evidenceStrength: byId("evidence-strength"),
    evidenceDate: byId("evidence-date"),
    evidenceError: byId("evidence-error"),
    confirmDialog: byId("confirm-dialog"),
    confirmTitle: byId("confirm-title"),
    confirmMessage: byId("confirm-message"),
    confirmButton: byId("confirm-action-button"),
    importFile: byId("import-file"),
    toast: byId("toast"),
    discoveryGrid: byId("discovery-grid"),
    discoveryMode: byId("discovery-mode"),
    discoverySummary: byId("discovery-summary"),
  });

  buildScoreEditor();
  elements.evidenceDate.value = todayInputValue();
  applyStaticTranslations();

  for (const id of ["add-idea-button", "hero-add-button", "empty-add-button"]) {
    byId(id).addEventListener("click", () => openIdeaDialog());
  }
  for (const id of ["example-button", "empty-example-button"]) {
    byId(id).addEventListener("click", () => callbacks.onLoadExample());
  }
  byId("close-idea-dialog").addEventListener("click", closeIdeaDialog);
  byId("cancel-idea-dialog").addEventListener("click", closeIdeaDialog);
  byId("add-evidence-button").addEventListener("click", addEvidenceFromComposer);
  elements.themeToggle.addEventListener("click", () => callbacks.onThemeToggle());
  elements.languageToggle.addEventListener("click", () => callbacks.onLanguageToggle());
  byId("import-button").addEventListener("click", () => elements.importFile.click());
  byId("export-all-button").addEventListener("click", () => callbacks.onExportAll());

  elements.searchInput.addEventListener("input", () => callbacks.onViewChange({ search: elements.searchInput.value }));
  elements.statusFilter.addEventListener("change", () => callbacks.onViewChange({ status: elements.statusFilter.value }));
  elements.sortSelect.addEventListener("change", () => callbacks.onViewChange({ sort: elements.sortSelect.value }));

  elements.scoreEditor.addEventListener("input", updateScorePreview);
  elements.ideaForm.addEventListener("input", setCharacterCounts);
  elements.ideaForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearFormErrors();
    if (!elements.ideaForm.reportValidity()) return;
    callbacks.onSaveIdea(readIdeaForm());
  });
  elements.evidenceList.addEventListener("click", (event) => {
    const target = event.target.closest("[data-evidence-index]");
    if (!target) return;
    evidenceDraft.splice(Number(target.dataset.evidenceIndex), 1);
    renderEvidenceDraft();
  });

  elements.ideaGrid.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    callbacks.onCardAction(target.dataset.action, target.dataset.ideaId);
  });

  elements.discoveryGrid.addEventListener("click", (event) => {
    const target = event.target.closest("[data-candidate-id]");
    if (!target) return;
    callbacks.onDiscoverySave(target.dataset.candidateId);
  });

  elements.importFile.addEventListener("change", async () => {
    const [file] = elements.importFile.files;
    elements.importFile.value = "";
    if (!file) return;
    await callbacks.onImportFile(file);
  });

  elements.ideaDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeIdeaDialog();
  });
  elements.ideaDialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeIdeaDialog();
    }
  });
}
