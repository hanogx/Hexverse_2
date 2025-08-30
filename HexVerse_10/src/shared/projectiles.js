// src/shared/projectiles.js
export function createProjectileSystem(scene, {
  speed = 20,
  life  = 1.6,
  size  = 0.5,
  color = new BABYLON.Color3(1.0, 0.85, 0.2) // <-- renk parametresi
} = {}) {
  const bullets = [];
  const bulletRadius = size * 0.5;

  function makeMaterial(){
    const mat = new BABYLON.StandardMaterial("proj-mat", scene);
    mat.emissiveColor = color.clone();
    mat.diffuseColor  = color.clone().scale(0.8);
    mat.specularColor = new BABYLON.Color3(0,0,0);
    return mat;
  }
  const material = makeMaterial();

  function fireFrom(positionLike, dirLike){
    const p = (positionLike.copy ? positionLike.clone() : new BABYLON.Vector3(positionLike.x, positionLike.y, positionLike.z));
    let d = new BABYLON.Vector3(dirLike.x||0, dirLike.y||0, dirLike.z||0);
    if (d.lengthSquared() < 1e-4) d = new BABYLON.Vector3(0,0,1);
    d.normalize();

    const mesh = BABYLON.MeshBuilder.CreateSphere("proj", { diameter: size, segments: 8 }, scene);
    mesh.position.copyFrom(p);
    mesh.material = material;
    mesh.alwaysSelectAsActiveMesh = true;
    mesh.isPickable = false;
    mesh.renderOutline = true;
    mesh.outlineColor  = new BABYLON.Color3(1,1,1);
    mesh.outlineWidth  = 0.02;

    const light = new BABYLON.PointLight("projLight", mesh.position.clone(), scene);
    light.diffuse  = color.clone();
    light.specular = new BABYLON.Color3(0.2, 0.2, 0.2);
    light.intensity = 0.3;
    light.range = 5;

    bullets.push({ mesh, vel: d.scale(speed), ttl: life, light });
  }

  function tryHitSphere(centerVec3, radius){
    const rSum = radius + bulletRadius;
    const r2   = rSum * rSum;
    for (let i = bullets.length - 1; i >= 0; i--){
      const b = bullets[i];
      if (!b.mesh || b.ttl <= 0) continue;
      const d2 = BABYLON.Vector3.DistanceSquared(centerVec3, b.mesh.position);
      if (d2 <= r2){
        b.light?.dispose?.(); b.mesh.dispose(); bullets.splice(i,1);
        return true;
      }
    }
    return false;
  }

  const obs = scene.onBeforeRenderObservable.add(()=>{
    const dt = scene.getEngine().getDeltaTime() / 1000;
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      const step = b.vel.scale(dt);
      b.mesh.position.addInPlace(step);
      b.light?.position?.copyFrom?.(b.mesh.position);
      b.ttl -= dt;
      if (b.ttl <= 0) { b.light?.dispose?.(); b.mesh.dispose(); bullets.splice(i,1); }
    }
  });

  function dispose(){
    scene.onBeforeRenderObservable.remove(obs);
    for (const b of bullets) { b.light?.dispose?.(); b.mesh.dispose(); }
    bullets.length = 0;
  }

  return { fireFrom, tryHitSphere, dispose };
}
