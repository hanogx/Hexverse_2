// src/modes/pentarun/coreSelectUI.js
import { PENTA_STAGES } from "./config.js";
import { Store } from "../../core/store.js";
import { addSelectionBackground, removeSelectionBackground } from "../../core/env/selectionBg2D.js";


export function openPentaCoreSelection({ onConfirm, onCancel }){
  document.getElementById("hexrun-select")?.remove();

  // HexRun body sınıfı: sayfa scroll’u kilitlesin
  document.body.classList.add("has-hexrun-select");
  addSelectionBackground?.();

  // HexRun ile birebir aynı ID/sınıflar
  const root = document.createElement("div");
  root.id = "hexrun-select";
  root.innerHTML = `
    <div class="select-panel">
      <div class="select-title-row">
        <div class="select-title">PentaRun — Core Stage</div>
        <div style="display:flex; gap:10px; align-items:center;">
          <div class="energy-pill" id="energyPill">ENERGY: <strong>0</strong></div>
          <div class="energy-pill" id="relicPill">RELICS: <strong>0</strong></div>
        </div>
      </div>

      <div class="select-section">
        <div class="type-col" id="stageCol"></div>
      </div>

      <div class="select-hint" id="selectHint"></div>

      <div class="btn-row">
        <button class="btn ghost" id="cancelBtn">Back to Hub</button>
        <button class="btn primary" id="enterBtn" disabled>Enter</button>
      </div>
    </div>
  `;
  document.body.appendChild(root);

  document.getElementById("stageSelectScreen")?.style && 
  (document.getElementById("stageSelectScreen").style.display = "none");


  // Pills
  const energy = Number(Store.get("playerEnergy", Store.get("energy", 120)));
  const relics = Number(Store.get("pentaRelic", 0));
  root.querySelector("#energyPill").innerHTML = `ENERGY: <strong>${energy}</strong>`;
  root.querySelector("#relicPill").innerHTML  = `RELICS: <strong>${relics}</strong>`;

  // Tek buton: CORE STAGE (id: 13)
  const st = PENTA_STAGES[13];
  const listEl    = root.querySelector("#stageCol");
  const enterBtn  = root.querySelector("#enterBtn");
  const cancelBtn = root.querySelector("#cancelBtn");
  const hintEl    = root.querySelector("#selectHint");

  // Kaynak kontrolü (HexRun/Penta ile uyumlu)
function hasEnough(st){
  const energy = Number(Store.get("playerEnergy", Store.get("energy", 120)));
  const relics = Number(Store.get("pentaRelic", 0));
  const needE  = st.reqEnergy ?? 0;
  const needR  = st.reqRelic  ?? 0;
  return (energy >= needE) && (relics >= needR);
}


  const card = document.createElement("div");
  card.className = "type-card";
  card.dataset.id = "13";
  card.innerHTML = `
    <div class="row">
      <div class="left">
        <div class="name">${st.title}</div>
        <div class="subrow">${st.description ?? ""}</div>
      </div>
      <div class="right" style="margin-left:auto; display:flex; gap:12px; font-size:12px; color:var(--hx-muted);">
        <div class="cost">Energy <b>${st.reqEnergy ?? 0}</b></div>
        <div class="cost">Relic <b>${st.reqRelic ?? 0}</b></div>
      </div>
    </div>
  `;

  const needE = st.reqEnergy ?? 0;
  const needR = st.reqRelic  ?? 0;
  const blocked = (energy < needE) || (relics < needR);
  if (blocked) {
    card.classList.add("insufficient");
    hintEl.textContent = `Not enough resources. Requires Energy ${needE}, Penta Relic ${needR}.`;
  }

  let selected = false;
  card.addEventListener("click", ()=>{
    if ((Number(Store.get("playerEnergy", energy)) < needE) ||
        (Number(Store.get("pentaRelic", relics)) < needR)){
      hintEl.textContent = `Not enough resources. Requires Energy ${needE}, Penta Relic ${needR}.`;
      return;
    }
    // kırmızı glow
    card.classList.add("selected");
    card.style.setProperty("--c", "#ff3b3b");
    selected = true;
    hintEl.textContent = "";
    enterBtn.disabled = false;
  });

  listEl.appendChild(card);

enterBtn.addEventListener("click", ()=>{
  const st = PENTA_STAGES[13];
  if (!hasEnough(st)) {
    const needE = st.reqEnergy ?? 0, needR = st.reqRelic ?? 0;
    hintEl.textContent = `Not enough resources. Requires Energy ${needE}, Penta Relic ${needR}.`;
    enterBtn.disabled = true;
    return;
  }
  if (typeof teardown === "function") teardown();
  onConfirm && onConfirm(13);
});





  cancelBtn.addEventListener("click", ()=>{
    teardown();
    onCancel && onCancel();
  });

  function teardown(){
    removeSelectionBackground?.();
    document.body.classList.remove("has-hexrun-select");
    root.remove();
  }
}
