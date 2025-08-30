// src/core/env/spaceBackground.js
export function createSpaceBackground(scene, preset){
  const {
    starCount = 600,
    radius = 60,
    y = 0.2,
    color = { r: 0.7, g: 0.9, b: 1.0 },
    twinkle = false
  } = preset || {};

  // Renk objesini Color3'e çevir (burada BABYLON'u kullanıyoruz)
  const col = new BABYLON.Color3(color.r ?? 1, color.g ?? 1, color.b ?? 1);

  const positions = [];
  for (let i = 0; i < starCount; i++){
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = radius * (0.6 + 0.4 * Math.random());
    const x = r * Math.sin(phi) * Math.cos(theta);
    const yv = r * Math.cos(phi) + y;
    const z = r * Math.sin(phi) * Math.sin(theta);
    positions.push(x, yv, z);
  }

  const mesh = new BABYLON.Mesh("stars", scene);
  const vdata = new BABYLON.VertexData();
  vdata.positions = new Float32Array(positions);
  vdata.applyToMesh(mesh);

  const mat = new BABYLON.StandardMaterial("stars-mat", scene);
  mat.emissiveColor = col;
  // noktacık gibi göster
  mat.pointsCloud = true;
  mat.pointSize = 1.5;
  mat.disableLighting = true;
  mesh.material = mat;
  mesh.isPickable = false;
  mesh.alwaysSelectAsActiveMesh = true;

  if (twinkle){
    let t = 0;
    scene.onBeforeRenderObservable.add(()=>{
      t += scene.getEngine().getDeltaTime() * 0.001;
      mat.pointSize = 1.2 + 0.6 * Math.abs(Math.sin(t));
    });
  }
  return mesh;
}
