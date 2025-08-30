// src/modes/pentarun/runtime/PentaInput.js
export class PentaInput {
  constructor() {
    this.vector = { x: 0, y: 0 };
    this._buildDOM();
    this._bind();
  }

  _buildDOM() {
    this.root = document.createElement("div");
    this.root.className = "penta-joystick";
    this.root.innerHTML = `
      <div class="outer"></div>
      <div class="knob"></div>
    `;
    Object.assign(this.root.style, {
      position: "fixed", left: "22px", bottom: "22px",
      width: "120px", height: "120px", zIndex: "3000", userSelect: "none"
    });
    const outer = this.root.querySelector(".outer");
    const knob  = this.root.querySelector(".knob");
    Object.assign(outer.style, {
      position: "absolute", inset: "0",
      border: "1px solid rgba(255,255,255,.25)",
      borderRadius: "999px",
      background: "linear-gradient(180deg, rgba(0,229,255,.08), rgba(139,92,246,.08))",
      boxShadow: "inset 0 0 30px rgba(0,0,0,.25)"
    });
    Object.assign(knob.style, {
      position: "absolute", left: "50%", top: "50%",
      width: "54px", height: "54px", marginLeft: "-27px", marginTop: "-27px",
      borderRadius: "999px",
      background: "rgba(255,255,255,.55)",
      boxShadow: "0 4px 16px rgba(0,0,0,.35)",
      transition: "transform .05s linear"
    });
    document.body.appendChild(this.root);
    this.outer = outer; this.knob = knob;
  }

  _bind() {
    const el = this.root;
    const rect = () => el.getBoundingClientRect();
    let active = false;

    const start = (x, y) => { active = true; move(x, y); };
    const end   = () => { active = false; this.vector.x = 0; this.vector.y = 0; this._drawKnob(0,0); };
    const move  = (x, y) => {
      const r = rect();
      const cx = r.left + r.width / 2;
      const cy = r.top  + r.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const max = r.width * 0.45;
      const mag = Math.hypot(dx, dy);
      const clamp = Math.min(1, mag / max);
      const nx = (dx / (max || 1)) * clamp;
      const ny = (dy / (max || 1)) * clamp;
      // Y ekseni ekran koordinatlarında ters, oyunda ileri pozitif olsun:
      this.vector.x = nx;
      this.vector.y = ny; // z ekseni için kullanıyoruz; istersen -ny yap
      this._drawKnob(nx, ny);
    };

    const onMouseDown = (e) => { e.preventDefault(); start(e.clientX, e.clientY); };
    const onMouseMove = (e) => { if (active) move(e.clientX, e.clientY); };
    const onMouseUp   = () => end();

    const onTouchStart = (e) => { const t = e.changedTouches[0]; start(t.clientX, t.clientY); };
    const onTouchMove  = (e) => { const t = e.changedTouches[0]; move(t.clientX, t.clientY); };
    const onTouchEnd   = () => end();

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    el.addEventListener("touchstart", onTouchStart, { passive:false });
    window.addEventListener("touchmove", onTouchMove, { passive:false });
    window.addEventListener("touchend", onTouchEnd);

    this._cleanup = () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }

  _drawKnob(nx, ny){
    this.knob.style.transform = `translate(${nx*40}px, ${ny*40}px)`;
  }

  destroy(){
    this._cleanup?.();
    this.root?.remove();
  }
}
