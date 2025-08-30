// src/shared/enemySpawner.js
// Basit düşman sistemi: halka çevresinden spawn, hedefe doğru hareket, mermi çarpışması
export function createEnemySystem(scene, {
  getTargetPosition,           // () => BABYLON.Vector3 (ör. ship.position)
  projectiles,                 // createProjectileSystem(...) sonucu
  spawnEvery = 1.5,            // saniye
  speed = 2.6,                 // birim/sn
  enemyRadius = 0.6,
  color = new BABYLON.Color3(1.0, 0.45, 0.25),
  onEnemyKilled = null         // (enemy) => void
} = {}){
  const enemies = [];
  let timer = 0;

  function makeMat(){
    const m = new BABYLON.StandardMaterial("enemy-mat", scene);
    m.emissiveColor = color;
    m.specularColor = new BABYLON.Color3(0,0,0);
    return m;
  }
  const mat = makeMat();

  function spawnOne(){
    // 18-24 birim yarıçaplı çemberden random
    const R = 18 + Math.random()*6;
    const ang = Math.random() * Math.PI * 2;
    const pos = new BABYLON.Vector3(Math.cos(ang)*R, enemyRadius, Math.sin(ang)*R);
    const mesh = BABYLON.MeshBuilder.CreateSphere("enemy", { diameter: enemyRadius*2 }, scene);
    mesh.material = mat;
    mesh.position.copyFrom(pos);
    enemies.push({ mesh, radius: enemyRadius });
  }

  const obs = scene.onBeforeRenderObservable.add(()=>{
    const dt = scene.getEngine().getDeltaTime()/1000;
    timer += dt;
    if (timer >= spawnEvery){
      timer = 0;
      spawnOne();
    }

    // hareket + çarpışma
    const target = getTargetPosition ? getTargetPosition() : new BABYLON.Vector3(0,0,0);
    for (let i = enemies.length - 1; i >= 0; i--){
      const e = enemies[i];
      if (!e.mesh) { enemies.splice(i,1); continue; }

      // hedefe doğru
      const dir = target.subtract(e.mesh.position); dir.y = 0;
      const len = dir.length();
      if (len > 0.0001) e.mesh.position.addInPlace(dir.scale((speed/len)*dt));

      // mermi çarpışması (ilk mermide yok et)
      if (projectiles?.tryHitSphere(e.mesh.position, e.radius)){
        e.mesh.dispose();
        enemies.splice(i,1);
        onEnemyKilled && onEnemyKilled(e);
      }
    }
  });

  function forEachEnemy(fn){ for (const e of enemies) fn(e); }
  function removeEnemy(e){
    const idx = enemies.indexOf(e);
    if (idx >= 0){
      e.mesh?.dispose?.();
      enemies.splice(idx,1);
    }
  }
  function dispose(){
    scene.onBeforeRenderObservable.remove(obs);
    enemies.forEach(e => e.mesh?.dispose?.());
    enemies.length = 0;
  }

  return { forEachEnemy, removeEnemy, dispose };
}
