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
        "id": "banking-corridor",
        "title": "Banking Corridor",
        "type": "Regulated Finance Kernel",
        "summary": "Controls account, treasury, lending, claims, and payment motion before regulated effect binds.",
        "inputs": ["customer authority", "transaction intent", "risk tier", "ledger state"],
        "outputs": ["approve", "hold", "escalate", "refuse", "receipt"],
    },
    {
        "id": "clinical-ai",
        "title": "Clinical AI Kernel",
        "type": "Medical Governance Kernel",
        "summary": "Separates clinical AI output from consequence-bearing clinical action through review, evidence, and safety gates.",
        "inputs": ["clinical context", "model output", "evidence basis", "human signoff"],
        "outputs": ["inform", "review", "escalate", "refuse", "clinical receipt"],
    },
    {
        "id": "scientific",
        "title": "Scientific Discovery Governance",
        "type": "Research Kernel",
        "summary": "Classifies candidate scientific motion under evidence, safety, risk, custody, and review.",
        "inputs": ["hypothesis", "evidence", "risk", "safety", "benefit"],
        "outputs": ["research path", "safety review", "refusal receipt"],
    },
    {
        "id": "longevity-discovery",
        "title": "Longevity Discovery Kernel",
        "type": "Biological Research Kernel",
        "summary": "Routes natural molecules, failed-drug rescue, subgroup signals, and multi-level biological evidence into governed classification.",
        "inputs": ["target biology", "mechanism", "source trace", "off-target risk"],
        "outputs": ["promising path", "review required", "quarantine", "receipt"],
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
        "id": "safechange",
        "title": "SafeChange State Mutation",
        "type": "Mutation Kernel",
        "summary": "Evaluates whether state change may persist, revert, or block.",
        "inputs": ["change request", "state snapshot", "verification result"],
        "outputs": ["safe", "reverted", "blocked"],
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
        "id": "boundary-response",
        "title": "Boundary Response Kernel",
        "type": "Agent Kernel",
        "summary": "Classifies AI responses before they cross into action.",
        "inputs": ["AI response", "intent", "tool request", "authority"],
        "outputs": ["informational", "review", "action blocked"],
    },
    {
        "id": "multi-agent",
        "title": "Autonomous Multi-Agent Kernel",
        "type": "Agent Federation Kernel",
        "summary": "Coordinates agent proposals while preventing free-running behavior from becoming uncontrolled consequence.",
        "inputs": ["agent proposal", "role", "authority", "coordination trace"],
        "outputs": ["allow proposal", "route review", "contain drift", "receipt"],
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
        "id": "robotics-motion",
        "title": "Robotics Motion Kernel",
        "type": "Physical Execution Kernel",
        "summary": "Governs robotic motion before physical effect, collision risk, or unsafe manipulation can bind.",
        "inputs": ["robot intent", "environment state", "force envelope", "safety corridor"],
        "outputs": ["move", "slow", "halt", "human review"],
    },
    {
        "id": "flight-envelope",
        "title": "Flight Envelope Kernel",
        "type": "Air / Mobility Kernel",
        "summary": "Controls motion inside admissible flight, routing, load, and safety envelopes before navigation consequence binds.",
        "inputs": ["route motion", "weather state", "capacity", "authority"],
        "outputs": ["continue", "reroute", "hold", "refuse"],
    },
    {
        "id": "operating-system",
        "title": "Operating System Consequence Kernel",
        "type": "OS Kernel",
        "summary": "Governs privileged system motion before process, file, network, or device mutation becomes real.",
        "inputs": ["process intent", "privilege", "resource state", "policy basis"],
        "outputs": ["allow", "sandbox", "deny", "kill switch"],
    },
    {
        "id": "identity-authority",
        "title": "Identity / Authority Kernel",
        "type": "Standing Kernel",
        "summary": "Determines whether actor standing, signature, delegation, and revocation state remain admissible.",
        "inputs": ["identity", "credential", "delegation", "revocation state"],
        "outputs": ["standing valid", "expired", "revoked", "escalate"],
    },
    {
        "id": "legal-evidence",
        "title": "Legal Evidence Kernel",
        "type": "Evidence Law Kernel",
        "summary": "Preserves admissibility of evidence path, custody chain, transformation history, and review boundary.",
        "inputs": ["evidence item", "custody chain", "timestamp", "transformation log"],
        "outputs": ["admissible evidence", "chain break", "quarantine", "receipt"],
    },
    {
        "id": "insurance-claims",
        "title": "Insurance Claims Kernel",
        "type": "Claims Consequence Kernel",
        "summary": "Controls claim approval, payout, denial, and escalation before financial or legal effect binds.",
        "inputs": ["claim", "policy", "evidence", "coverage basis"],
        "outputs": ["approve", "repair", "review", "deny", "payout hold"],
    },
    {
        "id": "data-privacy",
        "title": "Data Privacy Kernel",
        "type": "Privacy Boundary Kernel",
        "summary": "Classifies data motion under purpose, minimization, consent, retention, access, and export constraints.",
        "inputs": ["data object", "purpose", "subject rights", "retention rule"],
        "outputs": ["process", "minimize", "withhold", "delete", "review"],
    },
    {
        "id": "incident-response",
        "title": "Incident Response Kernel",
        "type": "Resilience Kernel",
        "summary": "Turns anomalous motion, proof collapse, or custody break into bounded response, escalation, and evidence preservation.",
        "inputs": ["anomaly", "impact", "asset", "receipt trace"],
        "outputs": ["contain", "escalate", "report", "restore", "posture receipt"],
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
        "summary": "Maps proof surfaces to inspection, custody, continuity, accountability, and non-claim boundaries.",
        "inputs": ["AI Act", "DORA", "NIS2", "GDPR", "EBA", "PSD3"],
        "outputs": ["evidence support", "non-claim boundary", "review packet"],
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
        "title": "Install Kit Kernel",
        "type": "Deployment Kernel",
        "summary": "Packages one Elyria layer so another system can install it, run it, verify it, and explain it back.",
        "inputs": ["README", "layer contract", "verifier", "workflow", "proof lock"],
        "outputs": ["installable layer", "receipt", "replay basis", "proof surface"],
    },
]

INSTALL_PROOF = {
    "title": "Installable Layer Proof",
    "summary": "The public proof target is one clean Elyria layer that another system can install, execute, verify, replay, and explain without exposing the protected substrate.",
    "steps": [
        "install the layer",
        "feed a governed motion envelope",
        "run admissibility evaluation",
        "emit deterministic receipt",
        "verify receipt integrity",
        "replay decision basis",
        "explain what was admitted or refused",
        "preserve protected math boundary",
    ],
}

@app.route("/")
def index():
    return render_template("index.html", kernels=KERNELS, install_proof=INSTALL_PROOF)

@app.route("/api/kernels")
def api_kernels():
    return jsonify(KERNELS)

@app.route("/api/install-proof")
def api_install_proof():
    return jsonify(INSTALL_PROOF)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
