// src/shared/goldbergFactory.js
export function createGoldbergBundle(scene, {
  parent = null,
  m = 2, n = 1,
  scale = 1.5,
  position = new BABYLON.Vector3(0, -27, 4),
  color = new BABYLON.Color3(0.2, 0.8, 1.0) // istersen değiştir
} = {}) {
  // Materyal
  const mat = new BABYLON.StandardMaterial("goldberg-mat", scene);
  mat.emissiveColor = color.clone();
  mat.diffuseColor  = color.clone().scale(0.6);
  mat.specularColor = new BABYLON.Color3(0,0,0);

  // Goldberg
  const goldberg = BABYLON.MeshBuilder.CreateGoldberg("goldberg", { m, n }, scene);
  goldberg.material = mat;
  goldberg.scaling.set(scale, scale, scale);
  goldberg.position.copyFrom(position);
  if (parent) goldberg.parent = parent;

  // Wing grid düğümü
  const wingGrid = new BABYLON.TransformNode("wingGrid", scene);
  wingGrid.parent = goldberg;
  wingGrid.position = new BABYLON.Vector3(0, 1.4, 0);

  return { goldberg, wingGrid, material: mat };
}
