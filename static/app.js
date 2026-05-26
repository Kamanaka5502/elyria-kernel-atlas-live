const kernels = window.KERNELS || [];
const byId = Object.fromEntries(kernels.map(k => [k.id, k]));

const title = document.getElementById("kernel-title");
const type = document.getElementById("kernel-type");
const summary = document.getElementById("kernel-summary");
const inputs = document.getElementById("kernel-inputs");
const outputs = document.getElementById("kernel-outputs");
const receipt = document.getElementById("receipt-code");

function renderKernel(id) {
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
}

document.querySelectorAll("[data-kernel]").forEach(el => {
  el.addEventListener("click", () => renderKernel(el.dataset.kernel));
});

let idx = 0;
setInterval(() => {
  if (!kernels.length) return;
  renderKernel(kernels[idx % kernels.length].id);
  idx += 1;
}, 5200);

renderKernel("true-zero");
