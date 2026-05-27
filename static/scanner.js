const scannerForm = document.getElementById("scanner-form");
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
}

if (scannerForm) {
  scannerForm.addEventListener("change", scoreScanner);
  scannerForm.addEventListener("submit", event => {
    event.preventDefault();
    scoreScanner();
  });
  scoreScanner();
}
