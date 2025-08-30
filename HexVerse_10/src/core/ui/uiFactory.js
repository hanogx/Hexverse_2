// src/core/ui/uiFactory.js
import { Config } from "../config.js";

export function createUI(scene, {
  skin = "run",
  deadzone = Config.input.deadzone,
  sensitivity = Config.input.joystickSensitivity
} = {}) {
  const adt = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
  adt.renderAtIdealSize = true;
  adt.idealWidth  = Config.ui.idealWidth;
  adt.idealHeight = Config.ui.idealHeight;

  // ------- HUD -------
  const hud = new BABYLON.GUI.TextBlock("hud");
  hud.fontFamily = "Rajdhani";
  hud.text = (skin === "hub" ? "Living Hub" : "HUD");
  hud.fontSize = 24;
  hud.color = "#E8F0FF";
  hud.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  hud.textVerticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  hud.paddingRight = "16px";
  hud.paddingTop   = "16px";
  adt.addControl(hud);

  // ------- HUD göstergeleri (Energy + Timer + Warning) -------
  const energy = new BABYLON.GUI.TextBlock();
  energy.text = "Energy: 0";
  energy.fontFamily = "Rajdhani";
  energy.fontSize = 22;
  energy.color = "#E8F0FF";
  energy.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  energy.textVerticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  energy.paddingLeft = "16px";
  energy.paddingTop  = "16px";
  adt.addControl(energy);

  const timer = new BABYLON.GUI.TextBlock();
  timer.text = "00:00";
  timer.fontFamily = "Rajdhani";
  timer.fontSize = 22;
  timer.color = "#E8F0FF";
  timer.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  timer.textVerticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  timer.paddingTop  = "16px";
  adt.addControl(timer);

  const warn = new BABYLON.GUI.TextBlock();
  warn.text = "";
  warn.fontFamily = "Rajdhani";
  warn.fontSize = 26;
  warn.color = "#FFB4B4";
  warn.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  warn.textVerticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  warn.outlineColor = "#000";
  warn.outlineWidth = 4;
  adt.addControl(warn);

  // ------- Joystick + Fire -------
  const baseBg     = (skin==="hub" ? "rgba(0,0,0,.20)" : "rgba(0,0,0,.28)");
  const baseStroke = (skin==="hub" ? "#22D3EE" : "#1a2433");
  const joyRadius  = 80;     // px
  const knobRadius = 28;     // px

  const joy = new BABYLON.GUI.Ellipse();
  joy.thickness = 2;
  joy.width  = (joyRadius*2)+"px";
  joy.height = (joyRadius*2)+"px";
  joy.color = baseStroke;
  joy.background = baseBg;
  joy.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  joy.verticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  joy.paddingRight  = "10%";
  joy.paddingBottom = "10%";
  adt.addControl(joy);

  const knob = new BABYLON.GUI.Ellipse();
  knob.width  = (knobRadius*2)+"px";
  knob.height = (knobRadius*2)+"px";
  knob.color = "#00E5FF";
  knob.thickness = 3;
  knob.background = "rgba(0,229,255,.15)";
  joy.addControl(knob);

  const fire = BABYLON.GUI.Button.CreateSimpleButton("fire","FIRE");
  fire.fontFamily = "Rajdhani";
  fire.color = "#E8F0FF";
  fire.width = "140px";
  fire.height= "60px";
  fire.cornerRadius = 12;
  fire.thickness = 2;
  fire.background = baseBg;
  fire.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  fire.verticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  fire.paddingLeft  = "10%";
  fire.paddingBottom= "10%";
  adt.addControl(fire);

  // ------- Joystick hesapları -------
  let dragging = false;
  let center = { x: 0, y: 0 };
  let moveCb = null, fireCb = null;

  function refreshCenter(){
    const m = joy?._currentMeasure;
    if (!m) return;
    center.x = m.left + m.width  / 2;
    center.y = m.top  + m.height / 2;
  }

  function resetKnob(){
    knob.left = 0; knob.top = 0;
  }

  function emitMove(px, py){
    const dx = px - center.x;
    const dy = py - center.y;
    const dist = Math.hypot(dx, dy);
    const r = joyRadius;
    const clamped = Math.min(dist, r);
    const angle = Math.atan2(dy, dx);

    // knob ekran konumu
    knob.left = Math.cos(angle) * clamped;
    knob.top  = Math.sin(angle) * clamped;

    // normalize [-1,1]; ekran Y aşağı pozitif → oyun Y'yi tersliyoruz
    let nx = (clamped / r) * Math.cos(angle);
    let ny = (clamped / r) * Math.sin(angle);
    ny = -ny;

    const mag = Math.hypot(nx, ny);
    if (mag < deadzone) { moveCb && moveCb({x:0, y:0, mag:0}); return; }
    const scale = (mag - deadzone) / (1 - deadzone);
    const outx = (nx / (mag||1)) * scale * sensitivity;
    const outy = (ny / (mag||1)) * scale * sensitivity;

    moveCb && moveCb({ x: outx, y: outy, mag: scale });
  }

  joy.onPointerDownObservable.add((pi)=>{ dragging = true; refreshCenter(); emitMove(pi.x, pi.y); });
  joy.onPointerMoveObservable.add((pi)=>{ if (!dragging) return; emitMove(pi.x, pi.y); });
  joy.onPointerUpObservable.add(()=>{ dragging = false; resetKnob(); moveCb && moveCb({x:0,y:0,mag:0}); });

  fire.onPointerUpObservable.add(()=>{ fireCb && fireCb(); });

  // ------- Dış API -------
  const api = {
    adt, hud,
    joystick: { container: joy, knob },
    fire,
    onMove(fn){ moveCb = fn; },
    onFire(fn){ fireCb = fn; },
    setEnergy(val){ energy.text = "Energy: " + Math.max(0, Math.floor(val)); },
    setTimer(sec){
      const m = Math.floor(sec/60).toString().padStart(2,"0");
      const s = Math.floor(sec%60).toString().padStart(2,"0");
      timer.text = `${m}:${s}`;
    },
    showWarning(msg){ warn.text = msg || ""; },
    dispose(){ adt.dispose(); }
  };
  return api;
}
