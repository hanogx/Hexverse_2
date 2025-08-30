// src/modes/pentarun/runtime/PentaSpawner.js
import { LaserHazard }   from "./mechanics/LaserHazard.js";
import { SolarBurst }    from "./mechanics/SolarBurst.js";
import { EmField }       from "./mechanics/EmField.js";
import { GravityWell }   from "./mechanics/GravityWell.js";
import { DarkWraith }    from "./mechanics/DarkWraith.js";

const REGISTRY = {
  laser:   LaserHazard,
  solar:   SolarBurst,
  em:      EmField,
  gravity: GravityWell,
  dark:    DarkWraith,
};

export class PentaSpawner {
  constructor(scene, rules){
    this.scene = scene;
    this.rules = rules || {};
    this._time = 0;
    this._spawnCd = 0;
    this._entities = [];
    this._mechanics = (this.rules.mechanics && this.rules.mechanics.length)
      ? this.rules.mechanics.slice()
      : ["laser","solar","em","gravity","dark"];
  }

  update(dt, player){
    this._time += dt;
    this._spawnCd -= dt;

    // Spawn hızı
    const rate = this.rules.spawnRate || 0.8;
    if (this._spawnCd <= 0 && this._entities.length < 18) {
      this._spawnCd = 1 / rate;
      this._spawnOne();
    }

    // Etkileri topla
    let speedMul = 1;
    let impulse  = { x:0, z:0 };

    // Tersine iterate + ölüleri temizle
    for (let i=this._entities.length-1; i>=0; i--){
      const e = this._entities[i];
      const eff = e.update(dt, player) || { speedMul:1, impulse:{x:0,z:0} };
      speedMul = Math.min(speedMul, eff.speedMul||1);
      if (eff.impulse){ impulse.x += eff.impulse.x||0; impulse.z += eff.impulse.z||0; }
      if (!e.alive){ this._entities.splice(i,1); }
    }

    return { speedMul, impulse };
  }

  _spawnOne(){
    const key = this._mechanics[(Math.random()*this._mechanics.length)|0];
    const Cls = REGISTRY[key] || LaserHazard;
    const inst = new Cls(this.scene, this.rules);
    this._entities.push(inst);
  }

  dispose(){
    for (const e of this._entities){ try{ e.dispose(); }catch{} }
    this._entities = [];
  }
}
