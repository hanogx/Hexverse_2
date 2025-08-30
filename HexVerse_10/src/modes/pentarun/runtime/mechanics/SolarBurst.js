// SolarBurst: patlayan turuncu küre + genişleyen halka; halka çarparsa dışarı doğru itki
export class SolarBurst {
  constructor(scene, rules = {}) {
    this.scene = scene;
    this.alive = true;

    this.core = BABYLON.MeshBuilder.CreateSphere("solarCore", { diameter: 0.8 }, scene);
    this.core.position.set((Math.random()<0.5?-1:1)*(6+Math.random()*8), 1, (Math.random()<0.5?-1:1)*(6+Math.random()*8));
    const m = new BABYLON.StandardMaterial("solarM", scene);
    m.emissiveColor = BABYLON.Color3.FromHexString("#fb923c");
    m.diffuseColor  = BABYLON.Color3.Black();
    this.core.material = m;

    this.ring = BABYLON.MeshBuilder.CreateTorus("solarRing", { diameter: 0.5, thickness: 0.08, tessellation: 32 }, scene);
    this.ring.position = this.core.position.clone();
    const mr = new BABYLON.StandardMaterial("solarRingM", scene);
    mr.emissiveColor = BABYLON.Color3.FromHexString("#fb923c");
    mr.alpha = 0.8;
    this.ring.material = mr;

    this._age = 0;
    this._duration = 2.4;
  }

  update(dt, player) {
    if (!this.alive) return { speedMul:1, impulse:{x:0,z:0} };
    this._age += dt;

    const t = this._age / this._duration;
    const R = 0.5 + t * 8.0;               // halka çapı büyür
    const W = 0.6;                          // halka kalınlık eşiği
    this.ring.scaling.set(R, 1, R);
    this.core.scaling.set(1 + t*0.6, 1 + t*0.6, 1 + t*0.6);
    this.ring.material.alpha = Math.max(0, 0.85 - t);

    // oyuncu halkaya yakınsa dışarı it
    const v = player.position.subtract(this.core.position); v.y = 0;
    const d = v.length(); if (d>0) v.normalize();
    const hit = Math.abs(d - R) < W;
    if (hit) {
      return { speedMul: 1, impulse: { x: v.x*12, z: v.z*12 } };
    }

    if (this._age >= this._duration) this.dispose();
    return { speedMul:1, impulse:{x:0,z:0} };
  }

  dispose(){ this.alive = false; this.core?.dispose(); this.ring?.dispose(); }
}
