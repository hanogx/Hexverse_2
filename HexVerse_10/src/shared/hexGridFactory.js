// src/shared/hexGridFactory.js
//
// Düz, çalışır bir altıgen zemin üretir (XZ düzleminde). Axial koordinat (q,r) kullanır.
// Sonradan kendi tile materyallerini/kurallarını bu iskeletin üzerine ekleyebilirsin.

function axialToWorld(q, r, tileSize){
  // flat-topped hex layout
  const x = tileSize * (3/2 * q);
  const z = tileSize * (Math.sqrt(3) * (r + q/2));
  return new BABYLON.Vector3(x, 0, z);
}

export function createHexGrid(scene, {
  radius = 4,       // kaç halka (0=tek hücre)
  tileSize = 1.0,   // altıgen kenar uzunluğu
  y = 0,            // yerleşim yüksekliği
  material = null,  // opsiyonel: özel malzeme
  onTile = null     // opsiyonel: (mesh, q, r) => void
} = {}){
  const tiles = [];
  const defaultMat = new BABYLON.StandardMaterial("hex-mat", scene);
  defaultMat.diffuseColor  = new BABYLON.Color3(0.08, 0.12, 0.20);
  defaultMat.emissiveColor = new BABYLON.Color3(0.02, 0.06, 0.10);
  defaultMat.specularColor = new BABYLON.Color3(0,0,0);

  // axial ring scan
  for (let q = -radius; q <= radius; q++){
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    for (let r = r1; r <= r2; r++){
      const pos = axialToWorld(q, r, tileSize);
      pos.y = y;

      // altıgen: 6 köşeli düz zemin
      const tile = BABYLON.MeshBuilder.CreatePolygon(
        `hex_${q}_${r}`,
        { shape: hexShape(tileSize), depth: 0.05, sideOrientation: BABYLON.Mesh.DOUBLESIDE },
        scene
      );
      tile.position = pos;

      tile.material = material || defaultMat;
      tile.isPickable = true;
      tile.metadata = { q, r };

      tiles.push(tile);
      onTile && onTile(tile, q, r);
    }
  }

  // group parent
  const parent = new BABYLON.TransformNode("hexgrid", scene);
  tiles.forEach(t => t.parent = parent);

  function dispose(){
    tiles.forEach(t => t.dispose());
    parent.dispose();
  }

  return { parent, tiles, dispose };
}

// flat-topped hex polygon (unit by tileSize)
function hexShape(tileSize){
  const a = tileSize;              // kenar
  const r = a;                     // yatay yarıçap
  const R = Math.sqrt(3) * a / 2;  // dikey yarıçap
  // saat yönünde 6 köşe
  return [
    new BABYLON.Vector2(+r, 0),
    new BABYLON.Vector2(+r/2, +R),
    new BABYLON.Vector2(-r/2, +R),
    new BABYLON.Vector2(-r, 0),
    new BABYLON.Vector2(-r/2, -R),
    new BABYLON.Vector2(+r/2, -R),
  ];
}
