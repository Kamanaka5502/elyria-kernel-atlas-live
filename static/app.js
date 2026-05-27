const kernels = window.KERNELS || [];
const byId = Object.fromEntries(kernels.map(k => [k.id, k]));

const title = document.getElementById("kernel-title");
const type = document.getElementById("kernel-type");
const summary = document.getElementById("kernel-summary");
const inputs = document.getElementById("kernel-inputs");
const outputs = document.getElementById("kernel-outputs");
const receipt = document.getElementById("receipt-code");
const panel = document.querySelector(".panel");
const orbitalStage = document.querySelector(".orbital-stage");
const cards = Array.from(document.querySelectorAll(".kernel-card"));
const nodes = Array.from(document.querySelectorAll(".node"));

let idx = 0;
let manualMode = false;
let manualModeTimer = null;

function flashElement(el, className) {
  if (!el) return;
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

function getCardById(id) {
  return cards.find(card => card.dataset.kernel === id);
}

function getNodeById(id) {
  return nodes.find(node => node.dataset.kernel === id);
}

function removeDynamicDetails(card) {
  card.querySelectorAll(".live-badge, .card-trace, .selected-detail, .selected-verdict").forEach(el => el.remove());
}

function setManualMode() {
  manualMode = true;
  clearTimeout(manualModeTimer);
  manualModeTimer = setTimeout(() => {
    manualMode = false;
  }, 45000);
}

function setActiveCard(id) {
  cards.forEach(card => {
    const active = card.dataset.kernel === id;
    card.classList.toggle("active-card", active);
    card.classList.remove("preview-card");
    card.setAttribute("aria-pressed", active ? "true" : "false");

    if (!active) removeDynamicDetails(card);

    if (active && !card.querySelector(".live-badge")) {
      const badge = document.createElement("span");
      badge.className = "live-badge";
      badge.textContent = "SELECTED";
      card.appendChild(badge);
    }
  });

  nodes.forEach(node => {
    node.classList.toggle("active-node", node.dataset.kernel === id);
  });
}

function injectCardTrace(card, kernel) {
  if (!card || !kernel) return;
  let trace = card.querySelector(".card-trace");
  if (!trace) {
    trace = document.createElement("div");
    trace.className = "card-trace";
    card.appendChild(trace);
  }
  const input = kernel.inputs && kernel.inputs.length ? kernel.inputs[0] : "motion";
  const output = kernel.outputs && kernel.outputs.length ? kernel.outputs[0] : "receipt";
  trace.innerHTML = "<span>" + input + "</span><b>→</b><span>" + output + "</span>";
}

function injectSelectedDetails(card, kernel) {
  if (!card || !kernel) return;
  let detail = card.querySelector(".selected-detail");
  if (!detail) {
    detail = document.createElement("div");
    detail.className = "selected-detail";
    card.appendChild(detail);
  }

  const inputList = (kernel.inputs || []).slice(0, 3).map(x => "<li>" + x + "</li>").join("");
  const outputList = (kernel.outputs || []).slice(0, 3).map(x => "<li>" + x + "</li>").join("");
  detail.innerHTML = "<div><b>Inputs</b><ul>" + inputList + "</ul></div><div><b>Outputs</b><ul>" + outputList + "</ul></div>";

  let verdict = card.querySelector(".selected-verdict");
  if (!verdict) {
    verdict = document.createElement("div");
    verdict.className = "selected-verdict";
    card.appendChild(verdict);
  }
  verdict.textContent = "Active corridor: " + kernel.title;
}

function renderKernel(id, source = "manual") {
  const k = byId[id] || kernels[0];
  if (!k) return;

  if (source === "manual") setManualMode();

  title.textContent = k.title;
  type.textContent = k.type;
  summary.textContent = k.summary;

  inputs.innerHTML = "";
  outputs.innerHTML = "";

  k.inputs.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    inputs.appendChild(li);
  });

  k.outputs.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    outputs.appendChild(li);
  });

  receipt.textContent = "ELYRIA-" + k.id.toUpperCase().replace(/-/g, "_") + "-" + Math.floor(Date.now() / 1000);

  setActiveCard(k.id);
  const activeCard = getCardById(k.id);
  injectCardTrace(activeCard, k);
  injectSelectedDetails(activeCard, k);
  flashElement(panel, "panel-flash");
  flashElement(orbitalStage, "stage-flash");
  flashElement(activeCard, "card-selected-flash");

  const activeNode = getNodeById(k.id);
  if (activeNode) flashElement(activeNode, "node-flash");
}

cards.forEach(card => {
  card.setAttribute("aria-pressed", "false");
  card.addEventListener("click", () => renderKernel(card.dataset.kernel, "manual"));
  card.addEventListener("mouseenter", () => {
    if (!card.classList.contains("active-card")) {
      injectCardTrace(card, byId[card.dataset.kernel]);
      card.classList.add("preview-card");
    }
  });
  card.addEventListener("mouseleave", () => {
    if (!card.classList.contains("active-card")) {
      card.classList.remove("preview-card");
      const trace = card.querySelector(".card-trace");
      if (trace) trace.remove();
    }
  });
});

nodes.forEach(node => {
  node.addEventListener("click", () => renderKernel(node.dataset.kernel, "manual"));
});

setInterval(() => {
  if (!kernels.length || manualMode) return;
  const hovered = document.querySelector(".kernel-card:hover, .node:hover");
  if (hovered) return;
  renderKernel(kernels[idx % kernels.length].id, "auto");
  idx += 1;
}, 6200);

renderKernel("true-zero", "auto");
