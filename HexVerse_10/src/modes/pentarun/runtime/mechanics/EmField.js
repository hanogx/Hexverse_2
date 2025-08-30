// EmField: mavi alan; içine girince oyuncuyu yavaşlatır
export class EmField {
  constructor(scene, rules = {}) {
    this.scene = scene; this.alive = true;
    this.center = BABYLON.MeshBuilder.CreateSphere("emNode", { diameter: 0.6 }, scene);
    this.center.position.set((Math.random()<0.5?-1:1)*(4+Math.random()*10), 1, (Math.random()<0.5?-1:1)*(4+Math.random()*10));
    const m = new BABYLON.StandardMaterial("emM", scene);
    m.emissiveColor = BABYLON.Color3.FromHexString("#60a5fa");
    m.diffuseColor  = BABYLON.Color3.Black();
    this.center.material = m;

    this._radius = 5.5;
    this._pulse = 0;
  }

  update(dt, player){
    if (!this.alive) return { speedMul:1, impulse:{x:0,z:0} };
    this._pulse += dt*2;
    const s = 1 + Math.sin(this._pulse)*0.08;
    this.center.scaling.set(s,s,s);

    const d = BABYLON.Vector3.Distance(player.position, this.center.position);
    if (d <= this._radius) {
      const mul = 0.45; // yavaşlatma
      return { speedMul: mul, impulse:{x:0,z:0} };
    }
    return { speedMul:1, impulse:{x:0,z:0} };
  }

  dispose(){ this.alive = false; this.center?.dispose(); }
}
