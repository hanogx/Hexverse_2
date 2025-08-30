// src/modes/pentarun/ui/PentaHUD.js
export class PentaHUD {
  constructor({ onBack } = {}){
    this.onBack = onBack || (()=>{});
    this._build();
  }

  _build(){
    this.root = document.createElement("div");
    this.root.className = "penta-hud";
    this.root.innerHTML = `
      <div class="row left">
        <div class="pill">PentaRun</div>
        <div class="combo">
          <span class="slot"></span>
          <span class="slot"></span>
          <span class="slot"></span>
        </div>
      </div>
      <div class="row right">
        <button class="btn back">Back to Hub</button>
      </div>
    `;
    Object.assign(this.root.style, {
      position: "fixed", left: "0", right: "0", top: "0",
      height: "56px", display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "8px 12px",
      zIndex: "3200",
      background: "linear-gradient(180deg, rgba(11,19,36,.65), rgba(11,19,36,0))",
      pointerEvents: "auto"
    });

    const pill = this.root.querySelector(".pill");
    Object.assign(pill.style, {
      fontSize: "13px", padding: "6px 10px",
      borderRadius: "999px",
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.18)"
    });

    const combo = this.root.querySelector(".combo");
    Object.assign(combo.style, { display:"flex", gap:"8px", marginLeft:"12px" });
    this.root.querySelectorAll(".combo .slot").forEach(el=>{
      Object.assign(el.style, {
        display:"inline-block", width:"16px", height:"16px", borderRadius:"999px",
        background:"rgba(255,255,255,.15)", boxShadow:"inset 0 0 6px rgba(0,0,0,.45)"
      });
    });

    const back = this.root.querySelector(".btn.back");
    Object.assign(back.style, {
      padding:"8px 10px", borderRadius:"12px", border:"1px solid rgba(255,255,255,.18)",
      background:"rgba(0,0,0,.25)", color:"#fff", cursor:"pointer"
    });
    back.addEventListener("click", ()=> this.onBack());

    document.body.appendChild(this.root);
  }

  update({ time, stageId }){
    // gelecekte: skor, süre, enerji vs. güncelle
  }

  destroy(){
    this.root?.remove();
  }
}
