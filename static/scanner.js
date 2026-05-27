const scannerForm = document.getElementById("scanner-form");
const resetScannerBtn = document.getElementById("reset-scanner");
const riskRing = document.getElementById("risk-ring");
const riskScore = document.getElementById("risk-score");
const riskLabel = document.getElementById("risk-label");
const riskSummary = document.getElementById("risk-summary");
const flagList = document.getElementById("flag-list");
const recommendationList = document.getElementById("recommendation-list");

const weights = {
  consequence: 18,
  preeffect: 18,
  authority: 14,
  custody: 12,
  receipts: 14,
  replay: 12,
  refusal: 12,
};

const labels = {
  0: "LOW SURFACE RISK",
  1: "MODERATE GOVERNANCE GAP",
  2: "HIGH CONSEQUENCE EXPOSURE",
  3: "CRITICAL BOUNDARY FAILURE",
};

const answerExplanations = {
  consequence: [
    "Advisory-only output usually carries lower bind-time exposure.",
    "Indirect downstream use still needs a named handoff boundary.",
    "Reviewed consequence requires proof that review happens before effect.",
    "Direct consequence requires strict pre-effect refusal and receipt logic."
  ],
  preeffect: [
    "Best posture: admissibility resolves before consequence forms.",
    "Mixed controls can leave gaps between approval and effect.",
    "Post-event controls document consequence after it already formed.",
    "After-consequence governance cannot prevent invalid motion from binding."
  ],
  authority: [
    "Live authority checks reduce standing drift.",
    "Partial checks may miss revocation, scope change, or delegation decay.",
    "Weak authority checks allow continuation to outrun standing.",
    "No live check means action can continue after authority has collapsed."
  ],
  custody: [
    "Traceable custody supports reviewable decision basis.",
    "Partial custody needs freshness and transformation controls.",
    "Unclear custody weakens admissibility and replay confidence.",
    "No reliable custody means evidence can drive consequence without standing."
  ],
  receipts: [
    "Decision-basis receipts preserve why motion was admitted or refused.",
    "Partial receipts may not bind all required state and authority fields.",
    "Logs preserve activity, not necessarily admissibility.",
    "No meaningful receipt leaves the decision surface unverifiable."
  ],
  replay: [
    "Replay should reproduce the decision basis under identical conditions.",
    "Partial replay needs stronger state, policy, and authority binding.",
    "Outcome-only replay can miss legitimacy collapse.",
    "No replay means the system cannot verify why the decision held."
  ],
  refusal: [
    "Fail-closed behavior prevents uncertain motion from binding.",
    "Escalation is useful only if consequence remains blocked during review.",
    "Ambiguity often becomes silent permission under pressure.",
    "Continue-anyway behavior is the highest boundary failure pattern."
  ],
};

const flags = {
  consequence: [
    "AI output appears non-consequential or advisory only.",
    "Some downstream consequence exists, but operational impact appears bounded.",
    "AI output can influence meaningful operational, financial, clinical, legal, or organizational consequence.",
    "AI output can directly initiate or bind high-impact consequence without sufficient separation."
  ],
  preeffect: [
    "Pre-effect review appears structurally present.",
    "Some pre-effect checks exist, but they may not bind execution.",
    "Governance appears to occur after output generation or workflow routing.",
    "Consequence can form before admissibility is resolved."
  ],
  authority: [
    "Authority and standing appear explicit.",
    "Authority is partially defined but may not be rechecked under changed conditions.",
    "Standing, delegation, or revocation conditions are weakly represented.",
    "The system can continue action without live authority verification."
  ],
  custody: [
    "Evidence custody appears traceable.",
    "Evidence is logged, but chain continuity may be incomplete.",
    "Evidence freshness, source, or transformation history is unclear.",
    "Consequence can bind from evidence without reliable custody or freshness."
  ],
  receipts: [
    "Decision basis appears receipted.",
    "Receipts exist but may be mostly descriptive logs.",
    "Receipts do not clearly bind state, authority, policy, and decision basis.",
    "The system cannot show why consequence was admitted or refused."
  ],
  replay: [
    "Replay appears deterministic under identical conditions.",
    "Replay exists but may not preserve legitimacy differentiation.",
    "Replay appears focused on outcome history rather than admissibility basis.",
    "The system cannot reproduce the decision basis under identical inputs/state."
  ],
  refusal: [
    "Refusal behavior appears explicit.",
    "Refusal exists but may rely on manual intervention.",
    "Failure behavior is ambiguous or tends toward escalation without blocking.",
    "Invalid or uncertain motion can still proceed instead of failing closed."
  ],
};

function getValue(name) {
  const el = scannerForm.querySelector(`[name="${name}"]`);
  return Number(el ? el.value : 0);
}

function levelFromValue(value) {
  if (value <= 0) return "green";
  if (value === 1) return "yellow";
  return "red";
}

function ensureQuestionEnhancements() {
  if (!scannerForm) return;
  scannerForm.querySelectorAll(".scan-question").forEach(question => {
    if (!question.querySelector(".question-indicator")) {
      const indicator = document.createElement("span");
      indicator.className = "question-indicator green";
      indicator.textContent = "LOW";
      question.appendChild(indicator);
    }
    if (!question.querySelector(".answer-explain")) {
      const explain = document.createElement("div");
      explain.className = "answer-explain";
      question.appendChild(explain);
    }
  });
}

function updateQuestionIndicators() {
  if (!scannerForm) return;
  scannerForm.querySelectorAll(".scan-question").forEach(question => {
    const select = question.querySelector("select");
    if (!select) return;
    const value = Number(select.value || 0);
    const level = levelFromValue(value);
    const indicator = question.querySelector(".question-indicator");
    const explain = question.querySelector(".answer-explain");

    if (indicator) {
      indicator.className = `question-indicator ${level}`;
      indicator.textContent = level === "green" ? "LOW" : level === "yellow" ? "WATCH" : "RISK";
    }
    if (explain) {
      const name = select.name;
      explain.textContent = answerExplanations[name]?.[value] || "Selection recorded.";
    }
  });
}

function ensureResultGuidance() {
  const result = document.querySelector(".scanner-result");
  if (!result || document.getElementById("score-interpretation")) return;

  const interpret = document.createElement("div");
  interpret.className = "scanner-guidance";
  interpret.id = "score-interpretation";
  interpret.innerHTML = "<strong>How to interpret your score</strong><p id='score-interpretation-text'></p>";

  const highRisk = document.createElement("div");
  highRisk.className = "scanner-guidance high-risk-next";
  highRisk.id = "high-risk-next";
  highRisk.innerHTML = "<strong>Next steps for high-risk answers</strong><ul><li>Locate where output becomes consequence.</li><li>Block or gate that point before effect.</li><li>Define refusal behavior for uncertain motion.</li><li>Require receipts and replay for admitted and refused paths.</li></ul>";

  const cannot = document.createElement("div");
  cannot.className = "scanner-guidance cannot-detect";
  cannot.id = "cannot-detect";
  cannot.innerHTML = "<strong>What this scanner cannot detect</strong><p>It cannot verify source code, prove compliance, certify safety, inspect live integrations, validate clinical use, or expose the protected mathematical substrate. It identifies public boundary-risk patterns only.</p>";

  const boundary = result.querySelector(".scanner-boundary");
  result.insertBefore(interpret, boundary || null);
  result.insertBefore(highRisk, boundary || null);
  result.insertBefore(cannot, boundary || null);
}

function updateScoreInterpretation(score) {
  const interpretation = document.getElementById("score-interpretation-text");
  const highRisk = document.getElementById("high-risk-next");
  if (!interpretation) return;

  if (score < 25) {
    interpretation.textContent = "Low score means the visible answers show fewer obvious execution-governance gaps. It does not certify the system; it only lowers the public surface concern.";
    if (highRisk) highRisk.classList.add("soft-hide");
  } else if (score < 50) {
    interpretation.textContent = "Moderate score means controls exist, but at least one boundary condition may not bind before consequence forms.";
    if (highRisk) highRisk.classList.remove("soft-hide");
  } else if (score < 75) {
    interpretation.textContent = "High score means governance may be happening too late, or receipts/replay/refusal may not preserve admissibility under pressure.";
    if (highRisk) highRisk.classList.remove("soft-hide");
  } else {
    interpretation.textContent = "Critical score means invalid or uncertain motion may be able to bind consequence. The system needs a pre-effect boundary review before expansion.";
    if (highRisk) highRisk.classList.remove("soft-hide");
  }
}

function scoreScanner() {
  const keys = Object.keys(weights);
  let raw = 0;
  let max = 0;
  const selectedFlags = [];

  keys.forEach(key => {
    const value = getValue(key);
    raw += value * weights[key];
    max += 3 * weights[key];
    if (value >= 2) selectedFlags.push(flags[key][value]);
  });

  const score = Math.round((raw / max) * 100);
  const angle = Math.max(8, Math.round((score / 100) * 360));
  riskRing.style.setProperty("--risk-angle", `${angle}deg`);
  riskScore.textContent = score;

  let level = 0;
  if (score >= 25) level = 1;
  if (score >= 50) level = 2;
  if (score >= 75) level = 3;
  riskLabel.textContent = labels[level];

  if (level === 0) {
    riskSummary.textContent = "The visible answers suggest lower immediate consequence-boundary exposure. Confirm with a real proof review before relying on this classification.";
  } else if (level === 1) {
    riskSummary.textContent = "The system shows governance structure, but some boundary conditions may not bind before consequence forms.";
  } else if (level === 2) {
    riskSummary.textContent = "The system appears exposed where AI-assisted motion can produce consequence before admissibility, custody, receipt, or replay are fully proven.";
  } else {
    riskSummary.textContent = "The system appears critically exposed: capability may be substituting for admissibility, and invalid motion may be able to bind consequence.";
  }

  flagList.innerHTML = "";
  const shownFlags = selectedFlags.length ? selectedFlags : ["No major red flags selected in this public self-assessment."];
  shownFlags.slice(0, 6).forEach(flag => {
    const div = document.createElement("div");
    div.textContent = flag;
    flagList.appendChild(div);
  });

  recommendationList.innerHTML = "";
  const recommendations = [
    "Map the point where AI output becomes operational, legal, clinical, financial, or organizational consequence.",
    "Separate output validity from permission to bind effect.",
    "Define authority, custody, admissibility, refusal, receipt, and replay before deployment expands.",
    "Require negative cases that prove invalid motion refuses or fails closed."
  ];
  recommendations.forEach(item => {
    const div = document.createElement("div");
    div.textContent = item;
    recommendationList.appendChild(div);
  });

  updateQuestionIndicators();
  updateScoreInterpretation(score);
}

function resetScanner() {
  if (!scannerForm) return;
  scannerForm.reset();
  scoreScanner();
  const firstSelect = scannerForm.querySelector("select");
  if (firstSelect) firstSelect.focus({ preventScroll: true });
}

if (scannerForm) {
  ensureQuestionEnhancements();
  ensureResultGuidance();
  scannerForm.addEventListener("change", scoreScanner);
  scannerForm.addEventListener("submit", event => {
    event.preventDefault();
    scoreScanner();
  });
  if (resetScannerBtn) {
    resetScannerBtn.addEventListener("click", resetScanner);
  }
  scoreScanner();
}