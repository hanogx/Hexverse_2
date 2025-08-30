// src/core/env/selectionBg2D.js
let rafId = null;
let canvas = null;
let ctx = null;
let stars = [];
let onResizeRef = null; // <-- eklendi

function resize() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const w = Math.floor(window.innerWidth * dpr);
  const h = Math.floor(window.innerHeight * dpr);
  canvas.width = w; canvas.height = h;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(dpr, dpr);
}

function drawNebula() {
  const w = window.innerWidth, h = window.innerHeight;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle = "#050812";
  ctx.fillRect(0,0,w,h);

  ctx.globalCompositeOperation = "lighter";
  function blob(x,y,r, rgb, a){
    const g = ctx.createRadialGradient(x,y,0,x,y,r);
    const [R,G,B] = rgb;
    g.addColorStop(0, `rgba(${R},${G},${B},${a*0.8})`);
    g.addColorStop(0.5, `rgba(${R},${G},${B},${a*0.25})`);
    g.addColorStop(1, `rgba(${R},${G},${B},0)`);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  }
  blob(w*0.30, h*0.38, Math.min(w,h)*0.38, [14,165,233], 0.35);
  blob(w*0.65, h*0.30, Math.min(w,h)*0.42, [168,85,247], 0.30);
  blob(w*0.55, h*0.65, Math.min(w,h)*0.34, [56,189,248], 0.25);
  blob(w*0.35, h*0.70, Math.min(w,h)*0.28, [99,102,241], 0.22);
  ctx.globalCompositeOperation = "source-over";
}

function initStars() {
  const w = window.innerWidth, h = window.innerHeight;
  const count = Math.floor(Math.min(900, w*h/2500));
  stars = [];
  for (let i=0;i<count;i++){
    stars.push({
      x: Math.random()*w,
      y: Math.random()*h,
      size: Math.random()<0.92 ? 1 : 2,
      hue: Math.random()<0.1 ? 10+Math.random()*30 : 200+Math.random()*40,
      base: 0.3 + Math.random()*0.6,
      speed: 0.8 + Math.random()*1.8,
      t: Math.random()*Math.PI*2
    });
  }
}

function drawStars(dt) {
  const w = window.innerWidth, h = window.innerHeight;
  for (const s of stars){
    s.t += dt * s.speed;
    const a = s.base * (0.4 + 0.6*Math.abs(Math.sin(s.t)));
    ctx.fillStyle = `hsla(${s.hue}, 90%, 85%, ${a})`;
    ctx.fillRect(s.x, s.y, s.size, s.size);
  }
}

function loop(last=performance.now()){
  const now = performance.now();
  const dt = Math.min(0.05, (now-last)/1000);
  drawNebula();
  drawStars(dt);
  rafId = requestAnimationFrame(()=>loop(now));
}

export function addSelectionBackground() {
  if (canvas) return;
  canvas = document.createElement("canvas");
  canvas.id = "hexrun-select-bg";

  // >>> burada katman/stil garanti
// BG her zaman panelin ALTINDA
Object.assign(canvas.style, {
  position: "fixed",
  inset: "0",
  zIndex: "1500",       // 🔴 ÖNEMLİ: 1500
  pointerEvents: "none"
});

  // <<<

  ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);

  resize();
  initStars();

  onResizeRef = ()=>{ resize(); initStars(); };
  window.addEventListener("resize", onResizeRef, { passive:true });

  loop();
}

export function removeSelectionBackground() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;

  if (onResizeRef) {
    window.removeEventListener("resize", onResizeRef);
    onResizeRef = null;
  }

  if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
  canvas = null; ctx = null; stars = [];
}
