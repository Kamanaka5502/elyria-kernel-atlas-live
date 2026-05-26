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

function setActiveCard(id) {
  cards.forEach(card => {
    const active = card.dataset.kernel === id;
    card.classList.toggle("active-card", active);
    card.setAttribute("aria-pressed", active ? "true" : "false");

    let badge = card.querySelector(".live-badge");
    if (active && !badge) {
      badge = document.createElement("span");
      badge.className = "live-badge";
      badge.textContent = "ACTIVE";
      card.appendChild(badge);
    }
    if (!active && badge) badge.remove();
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

function renderKernel(id, source = "manual") {
  const k = byId[id] || kernels[0];
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

  receipt.textContent = "ELYRIA-" + k.id.toUpperCase().replaceAll("-", "_") + "-" + Math.floor(Date.now() / 1000);

  setActiveCard(k.id);
  injectCardTrace(getCardById(k.id), k);
  flashElement(panel, "panel-flash");
  flashElement(orbitalStage, "stage-flash");

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

let idx = 0;
setInterval(() => {
  if (!kernels.length) return;
  const hovered = document.querySelector(".kernel-card:hover, .node:hover");
  if (hovered) return;
  renderKernel(kernels[idx % kernels.length].id, "auto");
  idx += 1;
}, 6200);

renderKernel("true-zero", "auto");
