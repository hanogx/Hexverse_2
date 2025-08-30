// src/modes/pentarun/selectUI.js (HexRun seçim kabuğunu aynen kullanır)
import { PENTA_STAGES } from "./config.js";
import { Store } from "../../core/store.js";
import { addSelectionBackground, removeSelectionBackground } from "../../core/env/selectionBg2D.js";


// Mekanik noktaları için renkler
const COLORS = {
  laser:   "#7dd3fc",  // ice blue
  solar:   "#fb923c",  // orange
  em:      "#60a5fa",  // blue
  gravity: "#34d399",  // green
  dark:    "#a78bfa",  // purple
};

export function openPentaRunSelection({ onConfirm, onCancel }){
  // Önce aynı id’li overlay varsa kaldır
  document.getElementById("hexrun-select")?.remove();
  document.getElementById("pentarun-select")?.remove(); // eski denemeler için

  // HexRun ile uyumlu store varsayılanları
  let energy = Store.get("playerEnergy");
  if (typeof energy !== "number") { energy = 100; Store.set("playerEnergy", energy); }
  let relics = Number(Store.get("pentaRelic", 0));

  // Panelin altına BG
  document.body.classList.add("has-hexrun-select");
  addSelectionBackground?.();

  // *** DİKKAT: HexRun ile aynı ID **(#hexrun-select)** ve sınıflar ***
  const root = document.createElement("div");
  root.id = "hexrun-select";
  root.innerHTML = `
    <div class="select-panel">
      <div class="select-title-row">
        <div class="select-title">PentaRun — Select Stage</div>
        <div style="display:flex; gap:10px; align-items:center;">
          <div class="energy-pill" id="energyPill">ENERGY: <strong>${energy}</strong></div>
          <div class="energy-pill" id="relicPill">RELICS: <strong>${relics}</strong></div>
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

  // Eski pentarun.html stageSelect ekranı varsa kapat
document.getElementById("stageSelectScreen")?.style && 
  (document.getElementById("stageSelectScreen").style.display = "none");


  const listEl     = root.querySelector("#stageCol");
  const enterBtn   = root.querySelector("#enterBtn");
  const cancelBtn  = root.querySelector("#cancelBtn");
  const hintEl     = root.querySelector("#selectHint");
  const energyPill = root.querySelector("#energyPill");
  const relicPill  = root.querySelector("#relicPill");

  // Kaynak kontrolü (HexRun/Penta ile uyumlu)
function hasEnough(st){
  const energy = Number(Store.get("playerEnergy", Store.get("energy", 120)));
  const relics = Number(Store.get("pentaRelic", 0));
  const needE  = st.reqEnergy ?? 0;
  const needR  = st.reqRelic  ?? 0;
  return (energy >= needE) && (relics >= needR);
}


  const entries = Object.entries(PENTA_STAGES)
    .map(([id, st]) => ({ id: Number(id), ...st }))
    .filter(st => st.id !== 13) 
    .sort((a,b)=>a.id-b.id);

  let selectedId = null;

  // Listeyi oluştur (HexRun kart yapısı)
  for (const st of entries){
    const card = document.createElement("div");
    card.className = "type-card";
    card.dataset.id = String(st.id);

    // Mekanik dot’ları — her dot kendi --c’sine sahip (seçim kırmızısı dotları bozmaz)
    const dotsHtml = (st.mechanics||[]).map(m=>{
      const c = COLORS[m] || "#9fb0c7";
      return `<span class="dot" style="--c:${c}"></span>`;
    }).join("");

    card.innerHTML = `
      <div class="row">
        <div class="left">
          <div class="name">${st.title}</div>
          <div class="subrow">${st.description ?? ""}</div>
        </div>
        <div class="right" style="margin-left:auto; display:flex; gap:12px; font-size:12px; color:var(--hx-muted);">
          <div class="cost">Energy <b>${st.reqEnergy ?? 0}</b></div>
          <div class="cost">Relic <b>${st.reqRelic ?? 0}</b></div>
          <div class="dots" style="display:flex; gap:8px; align-items:center;">${dotsHtml}</div>
        </div>
      </div>
    `;

    const insufficient = (energy < (st.reqEnergy ?? 0)) || (relics < (st.reqRelic ?? 0));
    if (insufficient) card.classList.add("insufficient");

    card.addEventListener("click", ()=>{
      // Anlık store’dan tekrar kontrol et
      const curEnergy = Store.get("playerEnergy", energy);
      const curRelic  = Number(Store.get("pentaRelic", relics));
      const needE = st.reqEnergy ?? 0, needR = st.reqRelic ?? 0;
      const block = (curEnergy < needE) || (curRelic < needR);
      if (block){
        hintEl.textContent = `Not enough resources. Requires Energy ${needE}, Penta Relic ${needR}.`;
        return;
      }

      // Öncekini temizle
      listEl.querySelectorAll(".type-card.selected").forEach(el=>{
        el.classList.remove("selected");
        el.style.removeProperty("--c");
      });

      // Seçimi uygula — kırmızı glow (dotlar kendi rengini korur)
      card.classList.add("selected");
      card.style.setProperty("--c", "#ff3b3b");

      selectedId = st.id;
      hintEl.textContent = "";
      enterBtn.disabled = false;
    });

    listEl.appendChild(card);
  }

  // Enter
enterBtn.addEventListener("click", () => {
  if (!selectedId) return;
  const st = PENTA_STAGES[selectedId];
  if (!hasEnough(st)) {
    const needE = st.reqEnergy ?? 0, needR = st.reqRelic ?? 0;
    hintEl.textContent = `Not enough resources. Requires Energy ${needE}, Penta Relic ${needR}.`;
    enterBtn.disabled = true;
    return;
  }
  // Önce overlay’i kapat
  if (typeof teardown === "function") teardown();
  // Ardından ana akışa teslim et (main.js startLoop’u çağırıyor)
  onConfirm && onConfirm(selectedId);
});



  // Back
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
