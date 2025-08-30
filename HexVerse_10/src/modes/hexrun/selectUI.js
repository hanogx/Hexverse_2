// src/modes/hexrun/selectUI.js
import { HEX_TYPES } from "./config.js";
import { Store } from "../../core/store.js";
import { addSelectionBackground, removeSelectionBackground } from "../../core/env/selectionBg2D.js";
import { getVersionString, getModuleVersion } from "../../core/version.js";


export function openHexRunSelection({ onConfirm, onCancel }){
  document.getElementById("hexrun-select")?.remove();

  // Oyuncu enerjisini hazırla (varsayılan 100)
  let energy = Store.get("playerEnergy");
  if (typeof energy !== "number") { energy = 100; Store.set("playerEnergy", energy); }

  const root = document.createElement("div");
  root.id = "hexrun-select";
  root.innerHTML = `
    <div class="select-wrap">
      <div class="select-panel">
        <div class="select-title-row">
          <div class="select-title">HexRun — Select Type <span style="font-size:11px;opacity:0.6;">v${getModuleVersion('hexrun')}</span></div>
          <div class="energy-pill" id="energyPill">ENERGY: <strong>${energy}</strong></div>
        </div>

        <div class="select-section">
          <div class="type-col" id="typeCol"></div>
        </div>

        <div class="btn-row">
          <button class="btn ghost" id="cancelBtn">Back to Hub</button>
          <button class="btn primary" id="enterBtn" disabled>Enter</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  addSelectionBackground();
document.body.classList.add("has-hexrun-select"); // (topbar vs. saklıyorsan dursun)


  const col = root.querySelector("#typeCol");
  const energyPill = root.querySelector("#energyPill");
  const enterBtn = root.querySelector("#enterBtn");
  let selected = Store.get("selectedHexType","em");
  let selectedCost = 0;

  function updateEnterState(){
    const ok = selected && energy >= selectedCost;
    enterBtn.disabled = !ok;
    enterBtn.classList.toggle("disabled", !ok);
  }

  HEX_TYPES.forEach(t=>{
    const card = document.createElement("div");
    card.className = "type-card vertical";
    card.dataset.key = t.key;
    card.style.setProperty("--c", t.color);
    card.innerHTML = `
      <div class="row">
        <div class="dot"></div>
        <div class="name">${t.label}</div>
      </div>
      <div class="subrow">
        <div class="cost">Energy Required: <b>${t.energyCost}</b></div>
      </div>
    `;
    if (t.key===selected){ card.classList.add("selected"); selectedCost = t.energyCost; }
    if (energy < t.energyCost) card.classList.add("insufficient");

    card.onclick = ()=>{
      selected = t.key;
      selectedCost = t.energyCost;
      Store.set("selectedHexType", selected);
      col.querySelectorAll(".type-card").forEach(c=>c.classList.remove("selected"));
      card.classList.add("selected");
      updateEnterState();
    };
    col.appendChild(card);
  });

  updateEnterState();

root.querySelector("#cancelBtn").onclick = ()=>{
  removeSelectionBackground();
  onCancel && onCancel(); // scene.js içinde stopRenderLoop + location.replace(...)
};

  enterBtn.onclick = ()=>{
    if (energy < selectedCost) return;   // güvenlik
    // Enerjiyi düş ve kaydet
    energy -= selectedCost;
    Store.set("playerEnergy", energy);
    energyPill.innerHTML = `ENERGY: <strong>${energy}</strong>`;
    onConfirm && onConfirm({ hexTypeKey: selected });
    removeSelectionBackground();
document.body.classList.remove("has-hexrun-select");

    root.remove();
  };

  return { destroy(){ root.remove(); } };
}