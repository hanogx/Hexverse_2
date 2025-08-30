// src/modes/pentarun/runtime/PentaGame.js
import { PENTA_STAGES } from "../config.js";
import { buildRulesForStage } from "./PentaRules.js";
import { PentaInput } from "./PentaInput.js";
import { PentaSpawner } from "./PentaSpawner.js";
import { PentaHUD } from "../ui/PentaHUD.js";

export class PentaGame {
  constructor(scene, stageId, opts = {}) {
    this.scene = scene;
    this.engine = scene.getEngine();
    this.stageId = stageId;
    this.onExit = opts.onExit || (()=>{});
    this._running = false;
    this._dtAcc = 0;

    // Player (placeholder)
    this.player = BABYLON.MeshBuilder.CreateSphere("pentaPlayer", { diameter: 1.2 }, this.scene);
    this.player.position.set(0, 1, 0);

    if (!this.scene.lights || this.scene.lights.length === 0) {
      const light = new BABYLON.HemisphericLight("pentaLight", new BABYLON.Vector3(0,1,0), this.scene);
      light.intensity = 0.9;
    }

    // UI
    this.input = new PentaInput();
    this.hud   = new PentaHUD({ onBack: () => { this.stop(); this.onExit(); } });

    // Kurallar & spawner
    const stageDef = PENTA_STAGES[stageId] || { mechanics: [] };
    this.rules   = buildRulesForStage(stageDef);
    this.spawner = new PentaSpawner(this.scene, this.rules);

    // Update
    this._update = this._update.bind(this);
    this.scene.onBeforeRenderObservable.add(this._update);
    this._running = true;
  }

  _update() {
    if (!this._running) return;
    const dt = this.engine.getDeltaTime() / 1000;
    this._dtAcc += dt;

    // Spawner önce çalışsın → etkileri toplayalım
    const effects = this.spawner.update(dt, this.player) || { speedMul:1, impulse:{x:0,z:0} };
    const speedMul = Math.max(0.2, Math.min(1, effects.speedMul||1));
    const imp = effects.impulse || {x:0,z:0};

    // Joystick → hareket
    const v = this.input.vector; // {x,y}
    const baseSpeed = 6.0 * (this.rules.playerSpeedMul || 1);
    const vxz = { x: v.x * baseSpeed * speedMul, z: v.y * baseSpeed * speedMul };

    // İmpuls (gravity/solar vs.)
    this.player.position.x += (vxz.x + imp.x) * dt;
    this.player.position.z += (vxz.z + imp.z) * dt;

    // Alan sınırı
    this.player.position.x = Math.max(-15, Math.min(15, this.player.position.x));
    this.player.position.z = Math.max(-15, Math.min(15, this.player.position.z));

    this.hud.update({ time: this._dtAcc, stageId: this.stageId });
  }

  stop() {
    if (!this._running) return;
    this._running = false;
    this.scene.onBeforeRenderObservable.removeCallback(this._update);
    this.input.destroy();
    this.hud.destroy();
    this.player?.dispose();
    this.spawner.dispose();
  }
}
