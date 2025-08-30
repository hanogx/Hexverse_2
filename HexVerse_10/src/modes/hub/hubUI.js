// src/modes/hub/hubUI.js
import { HEX_TYPES } from "./hexTypes.js";
import { Store } from "../../core/store.js";

export function createHubUI() {

    // Defensive cleanup: selection overlay/background leftovers
  document.getElementById('hexrun-select')?.remove();
  document.getElementById('pentarun-select')?.remove();
  document.getElementById('hexrun-select-bg')?.remove();
  document.body.classList.remove('has-hexrun-select');

  // Panel kaplaması
  const wrap = document.createElement("div");
  wrap.className = "hub-panel";
  wrap.innerHTML = `
    <div class="hub-panel-inner">
      <div class="hub-title">Living Hub</div>
      <div class="hex-grid" id="hexGrid"></div>
      <div class="start-row">
        <button class="btn hub start" id="startHex">Start HexRun</button>
        <button class="btn hub start" id="startPenta">Start PentaRun</button>
        <button class="btn hub start" id="startCore">Enter Core</button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  // Orb/sphere dekorları tıklamayı kapmasın
const orbEls = wrap.querySelectorAll('.hex-grid [class*="sphere"], .hex-grid [class*="orb"], .hex-grid [data-decor="orb"]');
orbEls.forEach(el => { el.style.pointerEvents = 'none'; });


  // Kartları doldur
  const grid = wrap.querySelector("#hexGrid");
  let selected = Store.get("selectedHexType", "em");

  HEX_TYPES.forEach((t) => {
    const card = document.createElement("div");
    card.className = "hex-card";
    card.dataset.type = t.type;
    card.style.setProperty("--color", t.color);

    card.innerHTML = `
      <div class="hex-head">
        <div class="hex-dot" style="background:${t.color}"></div>
        <div class="hex-name">${t.title}</div>
      </div>
      <div class="hex-desc">${t.desc}</div>
      <div class="hex-stats">
        <div class="stat">
          <div class="stat-label">MEX</div>
          <div class="stat-bar"><div class="bar-fill" style="width:${t.mex}%;"></div></div>
          <div class="stat-val">${t.mex}</div>
        </div>
        <div class="stat">
          <div class="stat-label">WEX</div>
          <div class="stat-bar"><div class="bar-fill" style="width:${t.wex}%;"></div></div>
          <div class="stat-val">${t.wex}</div>
        </div>
      </div>
    `;

    if (t.type === selected) card.classList.add("selected");
    card.addEventListener("click", () => {
      selected = t.type;
      Store.set("selectedHexType", selected);
      grid.querySelectorAll(".hex-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
    });

    grid.appendChild(card);
  });

  // Start butonları
  wrap.querySelector("#startHex").addEventListener("click", () => {
    Store.set("selectedHexType", selected);
    location.href = "./hexrun.html";
  });
  wrap.querySelector("#startPenta").addEventListener("click", () => {
    Store.set("selectedHexType", selected);
    location.href = "./pentarun.html";
  });

  wrap.querySelector("#startCore").addEventListener("click", () => {
  Store.set("selectedHexType", selected);
  location.href = "./core.html";
});


  return {
    root: wrap,
    destroy(){ wrap.remove(); }
  };
}
