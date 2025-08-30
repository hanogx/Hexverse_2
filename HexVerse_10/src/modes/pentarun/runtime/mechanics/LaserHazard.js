// LaserHazard: aktif/pasif tarama yapan bir lazer şaftı (ice blue)
export class LaserHazard {
  constructor(scene, rules = {}) {
    this.scene = scene;
    this.rules = rules;
    this.alive = true;

    const w = 0.25, h = 0.25, len = 26; // ince uzun kutu (zemin üstü)
    this.mesh = BABYLON.MeshBuilder.CreateBox("laser", { width: len, height: h, depth: w }, scene);
    this.mesh.position.set(0, 1, 0);
    this.mesh.rotation.y = Math.random() * Math.PI;

    const m = new BABYLON.StandardMaterial("laserM", scene);
    m.emissiveColor = BABYLON.Color3.FromHexString("#7dd3fc");
    m.diffuseColor  = BABYLON.Color3.Black();
    this.mesh.material = m;

    this._t = 0;
    this._phase = 0; // 0:off, 1:on
    this._sweepSpeed = 0.6 + Math.random()*0.5;
    this._activeTime = 1.2, this._idleTime = 0.8;
  }

  update(dt, player) {
    if (!this.alive) return { speedMul: 1, impulse: {x:0,z:0} };

    this._t += dt * this._sweepSpeed;
    // Sürekli y-sweep (yani rotate)
    this.mesh.rotation.y += dt * (0.6 + Math.sin(this._t*0.7)*0.4);

    // on/off fazı
    const dur = (this._phase===1) ? this._activeTime : this._idleTime;
    if (this._t >= dur){ this._t = 0; this._phase = 1 - this._phase; }
    this.mesh.setEnabled(true);
    this.mesh.isVisible = (this._phase===1);

    // Etki: aktifken lazer çizgisine çok yaklaşan oyuncuya küçük itki
    if (this._phase===1) {
      const p = this.mesh.position;
      // oyuncu ile lazer ekseninin en yakın uzaklığı (yxz rotasyonu ignore edip world uzayı approx)
      const d = Math.abs(Math.sin(this.mesh.rotation.y)*(player.position.x - p.x) - Math.cos(this.mesh.rotation.y)*(player.position.z - p.z));
      if (d < 0.8) {
        // çizgiden dışarı doğru hafif it
        const nx = Math.cos(this.mesh.rotation.y);
        const nz = Math.sin(this.mesh.rotation.y);
        return { speedMul: 1, impulse: { x: (player.position.x>p.x ? nx : -nx)*8, z: (player.position.z>p.z ? nz : -nz)*8 } };
      }
    }
    return { speedMul: 1, impulse: {x:0,z:0} };
  }

  dispose(){ this.alive = false; this.mesh?.dispose(); }
}
