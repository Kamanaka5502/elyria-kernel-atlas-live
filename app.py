from flask import Flask, render_template, jsonify

app = Flask(__name__)

KERNELS = [
    {
        "id": "true-zero",
        "title": "True Zero Universal Layer",
        "type": "Origin Kernel",
        "summary": "The layer below execution where proposed motion is resolved before consequence binds.",
        "inputs": ["proposed motion", "host context", "authority reference"],
        "outputs": ["admit", "repair", "escalate", "refuse", "fail-closed"],
    },
    {
        "id": "motion-envelope",
        "title": "Universal Motion Envelope",
        "type": "Envelope Kernel",
        "summary": "Transforms raw system events into governed motion objects.",
        "inputs": ["actor", "requested effect", "source system", "risk context"],
        "outputs": ["motion hash", "policy reference", "evidence reference"],
    },
    {
        "id": "financial-motion",
        "title": "Financial Motion Governance",
        "type": "Consequence Kernel",
        "summary": "Prevents value-bearing financial motion from binding without admissibility.",
        "inputs": ["payment motion", "settlement basis", "custody path", "authority"],
        "outputs": ["admit", "quarantine", "review", "fail-closed"],
    },
    {
        "id": "software-motion",
        "title": "Software Motion Boundary",
        "type": "Commit Kernel",
        "summary": "Controls protected repository and deployment motion before mutation.",
        "inputs": ["commit", "branch state", "CI evidence", "review status"],
        "outputs": ["execute", "refuse", "escalate", "receipt"],
    },
    {
        "id": "semantic-execution",
        "title": "Semantic-to-Execution Boundary",
        "type": "Translation Kernel",
        "summary": "Separates valid output from permission to become protected consequence.",
        "inputs": ["model output", "semantic pass", "execution intent"],
        "outputs": ["non-binding answer", "action review", "refusal"],
    },
    {
        "id": "safechange",
        "title": "SafeChange State Mutation",
        "type": "Mutation Kernel",
        "summary": "Evaluates whether state change may persist, revert, or block.",
        "inputs": ["change request", "state snapshot", "verification result"],
        "outputs": ["safe", "reverted", "blocked"],
    },
    {
        "id": "boundary-response",
        "title": "Boundary Response Kernel",
        "type": "Agent Kernel",
        "summary": "Classifies AI responses before they cross into action.",
        "inputs": ["AI response", "intent", "tool request", "authority"],
        "outputs": ["informational", "review", "action blocked"],
    },
    {
        "id": "accelerator",
        "title": "Accelerator Admission",
        "type": "Compute Kernel",
        "summary": "Determines whether workload dispatch may reach compute infrastructure.",
        "inputs": ["workload", "capacity", "custody", "risk posture"],
        "outputs": ["execute", "throttle", "halt", "quarantine"],
    },
    {
        "id": "trust-settlement",
        "title": "Trust / Settlement Substrate",
        "type": "Settlement Kernel",
        "summary": "Maps trust, wallet, and conservation state into admissibility evidence.",
        "inputs": ["stake", "trust score", "wallet state", "conservation signal"],
        "outputs": ["accepted", "repair", "quarantine"],
    },
    {
        "id": "custody-evidence",
        "title": "Custody Evidence",
        "type": "Evidence Kernel",
        "summary": "Preserves source traceability, evidence integrity, and chain continuity.",
        "inputs": ["evidence object", "holder chain", "transform history"],
        "outputs": ["custody accepted", "chain broken", "quarantine"],
    },
    {
        "id": "replay-receipt",
        "title": "Replay / Receipt",
        "type": "Proof Kernel",
        "summary": "Emits deterministic proof artifacts and verifies decision basis.",
        "inputs": ["decision", "state hash", "rule trace", "policy version"],
        "outputs": ["receipt", "replay verified", "fail-closed"],
    },
    {
        "id": "claim-proof",
        "title": "Claim-Proof Ledger",
        "type": "Admissibility Kernel",
        "summary": "Maps every public claim to proof state and evidence surface.",
        "inputs": ["claim", "repo", "artifact", "boundary"],
        "outputs": ["proven", "partial", "designed", "not claimed"],
    },
    {
        "id": "regulatory",
        "title": "Regulatory Alignment",
        "type": "Compliance Kernel",
        "summary": "Maps proof surfaces to inspection, custody, and accountability needs.",
        "inputs": ["AI Act", "DORA", "NIS2", "GDPR", "EBA"],
        "outputs": ["evidence support", "non-claim boundary", "review packet"],
    },
    {
        "id": "scientific",
        "title": "Scientific Discovery Governance",
        "type": "Research Kernel",
        "summary": "Classifies candidate scientific motion under evidence, safety, risk, and review.",
        "inputs": ["hypothesis", "evidence", "risk", "safety", "benefit"],
        "outputs": ["research path", "safety review", "refusal receipt"],
    },
    {
        "id": "protected-math",
        "title": "Protected Math Boundary",
        "type": "Protection Kernel",
        "summary": "Exposes public-safe interfaces while keeping private invariants protected.",
        "inputs": ["public interface", "private substrate", "claim boundary"],
        "outputs": ["safe disclosure", "protected core", "non-derivation boundary"],
    },
    {
        "id": "install-kit",
        "title": "Install Kit",
        "type": "Deployment Kernel",
        "summary": "Packages a True Zero layer so another system can run, verify, and explain it.",
        "inputs": ["README", "contract", "verifier", "workflow", "proof lock"],
        "outputs": ["installable layer", "receipt", "replay basis"],
    },
]

@app.route("/")
def index():
    return render_template("index.html", kernels=KERNELS)

@app.route("/api/kernels")
def api_kernels():
    return jsonify(KERNELS)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
