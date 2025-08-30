// GravityWell: yeşil kuyu; yakınındaki oyuncuyu çeker
export class GravityWell {
  constructor(scene, rules = {}) {
    this.scene = scene; this.alive = true;
    this.node = BABYLON.MeshBuilder.CreateSphere("grav", { diameter: 0.9 }, scene);
    this.node.position.set((Math.random()<0.5?-1:1)*(7+Math.random()*8), 1, (Math.random()<0.5?-1:1)*(7+Math.random()*8));
    const m = new BABYLON.StandardMaterial("gravM", scene);
    m.emissiveColor = BABYLON.Color3.FromHexString("#34d399");
    m.diffuseColor  = BABYLON.Color3.Black();
    this.node.material = m;

    this._radius = 7.5;
    this._force  = 18;
  }

  update(dt, player){
    if (!this.alive) return { speedMul:1, impulse:{x:0,z:0} };
    const v = this.node.position.subtract(player.position); v.y = 0;
    const d = v.length(); if (d<0.001) return { speedMul:1, impulse:{x:0,z:0} };
    if (d <= this._radius) {
      v.normalize();
      return { speedMul:1, impulse:{ x: v.x*this._force, z: v.z*this._force } };
    }
    return { speedMul:1, impulse:{x:0,z:0} };
  }

  dispose(){ this.alive = false; this.node?.dispose(); }
}
