// src/modes/pentarun/runtime/PentaRules.js
export function buildRulesForStage(stageDef){
  const mechs = stageDef.mechanics || [];
  const base = {
    mechanics: mechs.slice(),
    spawnRate: 0.8,       // saniyede ~0.8 spawn
    hazardSpeed: 3.0,
    playerSpeedMul: 1.0,
  };

  // Basit farklılaştırma
  if (mechs.includes("gravity")) base.hazardSpeed += 0.6;
  if (mechs.includes("em"))      base.spawnRate  += 0.3;
  if (mechs.includes("dark"))    base.spawnRate  += 0.2;
  if (mechs.includes("solar"))   base.playerSpeedMul += 0.1;

  // Stage id’ye göre küçük artış (isteğe bağlı)
  if (/^\d+$/.test(String(stageDef.title || ""))) {
    // hiçbir şey — title number kullanılmıyor olabilir
  }

  return base;
}
