export const SCORE_FACTORS = Object.freeze([
  { key: "pain", label: "Pain severity", shortLabel: "Pain", weight: 0.2 },
  { key: "frequency", label: "Frequency", shortLabel: "Frequency", weight: 0.15 },
  {
    key: "willingnessToPay",
    label: "Willingness to pay",
    shortLabel: "Budget",
    weight: 0.15,
  },
  { key: "reach", label: "Reach", shortLabel: "Reach", weight: 0.1 },
  { key: "feasibility", label: "Feasibility", shortLabel: "Feasibility", weight: 0.15 },
  {
    key: "differentiation",
    label: "Differentiation",
    shortLabel: "Difference",
    weight: 0.1,
  },
  {
    key: "evidenceConfidence",
    label: "Evidence confidence",
    shortLabel: "Evidence",
    weight: 0.15,
  },
]);

export const SCORE_GUIDANCE = Object.freeze({
  pain: ["Minor inconvenience", "Noticeable friction", "Meaningful cost", "Serious workflow blocker", "Critical risk or loss"],
  frequency: ["Rare", "A few times a year", "Monthly", "Weekly", "Daily or continuous"],
  willingnessToPay: ["No budget signal", "Weak substitution value", "Possible budget", "Clear budget or spend", "Active purchasing behavior"],
  reach: ["Very narrow", "Small niche", "Defined segment", "Several reachable segments", "Broad reachable market"],
  feasibility: ["Unknown or infeasible", "Major unknowns", "Achievable with constraints", "Straightforward MVP", "Can deliver quickly"],
  differentiation: ["No meaningful difference", "Mostly familiar", "Some clear advantage", "Strong advantage", "Distinct and defensible outcome"],
  evidenceConfidence: ["Pure assumption", "Indirect signal", "Several observations", "Direct repeated evidence", "Behavioral or paid evidence"],
});

function assertScores(scores) {
  if (!scores || typeof scores !== "object") {
    throw new TypeError("Scores must be an object.");
  }

  for (const factor of SCORE_FACTORS) {
    const value = scores[factor.key];
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new RangeError(`${factor.label} must be an integer from 1 to 5.`);
    }
  }
}

export function calculateScore(scores) {
  assertScores(scores);
  const weighted = SCORE_FACTORS.reduce(
    (total, factor) => total + scores[factor.key] * factor.weight,
    0,
  );
  return Math.round((weighted / 5) * 100);
}

export function getScoreBreakdown(scores) {
  assertScores(scores);
  return SCORE_FACTORS.map((factor) => ({
    ...factor,
    value: scores[factor.key],
    guidance: SCORE_GUIDANCE[factor.key][scores[factor.key] - 1],
    contribution: Math.round(scores[factor.key] * factor.weight * 20),
  }));
}

export function getScoreBand(score) {
  if (!Number.isInteger(score) || score < 20 || score > 100) {
    throw new RangeError("Opportunity score must be an integer from 20 to 100.");
  }
  if (score >= 75) {
    return { key: "priority", label: "Priority candidate", description: "Strong enough to validate next." };
  }
  if (score >= 50) {
    return { key: "promising", label: "Promising", description: "Worth more evidence before selection." };
  }
  return { key: "explore", label: "Explore", description: "Important assumptions remain unresolved." };
}

export function getEvidenceGap(idea) {
  const evidence = Array.isArray(idea?.evidence) ? idea.evidence : [];
  if (evidence.length === 0) {
    return "Add the first direct observation before increasing confidence.";
  }

  const strongCount = evidence.filter((item) => item.strength === "strong").length;
  if (strongCount === 0) {
    return "Seek a direct behavioral, budget, or repeated workflow signal.";
  }

  if (idea.scores?.evidenceConfidence < 4) {
    return "Reconcile the evidence notes with the confidence score.";
  }

  if (!idea.nextStep?.trim()) {
    return "Define the smallest next validation action.";
  }

  return "Evidence is ready for the documented next validation step.";
}
