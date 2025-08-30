// DarkWraith: mor hayalet — oyuncuya homing + periyodik kısa teleport
export class DarkWraith {
  constructor(scene, rules = {}) {
    this.scene = scene; this.alive = true;
    this.mesh = BABYLON.MeshBuilder.CreateSphere("dark", { diameter: 1.0 }, scene);
    this.mesh.position.set((Math.random()<0.5?-1:1)*(10+Math.random()*8), 1, (Math.random()<0.5?-1:1)*(10+Math.random()*8));
    const m = new BABYLON.StandardMaterial("darkM", scene);
    m.emissiveColor = BABYLON.Color3.FromHexString("#a78bfa");
    m.diffuseColor  = BABYLON.Color3.Black();
    this.mesh.material = m;

    this._speed = 3.6;
    this._blinkCd = 1.6 + Math.random()*0.8;
  }

  update(dt, player){
    if (!this.alive) return { speedMul:1, impulse:{x:0,z:0} };

    // Homing
    const dir = player.position.subtract(this.mesh.position); dir.y = 0;
    const d = dir.length() || 1; dir.normalize();
    this.mesh.position.addInPlace(dir.scale(this._speed*dt));

    // Kısa menzilde yavaşça fazlanan blur efekti (alpha gibi)
    this.mesh.visibility = Math.min(1, 0.5 + 0.5*Math.sin(performance.now()/400));

    // Blink
    this._blinkCd -= dt;
    if (this._blinkCd <= 0) {
      this._blinkCd = 1.6 + Math.random()*0.8;
      // oyuncunun arkasına yakın teleport
      const back = player.position.subtract(dir.scale(3 + Math.random()*2));
      back.y = 1;
      this.mesh.position = back;
    }

    // Çarpışma yakınlığına geldiğinde küçük yavaşlatma etkisi
    if (d < 1.6) return { speedMul: 0.8, impulse:{x:0,z:0} };
    return { speedMul:1, impulse:{x:0,z:0} };
  }

  dispose(){ this.alive = false; this.mesh?.dispose(); }
}
