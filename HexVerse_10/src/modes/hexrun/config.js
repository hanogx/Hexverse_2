// src/modes/hexrun/config.js
// Tutarlı palet (goldberg.html semantiği): Solar=Turuncu, EM=Mavi, Gravity=Yeşil, Dark=Mor
export const HEX_TYPES = [
  { key:"solar",   label:"Solar",   color:"#FF8C1A", proj:"#FFB84D", enemy:"#FF7043", energyCost: 30 },
  { key:"em",      label:"EM",      color:"#338CFF", proj:"#4DA3FF", enemy:"#4FC3F7", energyCost: 20 },
  { key:"gravity", label:"Gravity", color:"#33E666", proj:"#66F099", enemy:"#6EE7B7", energyCost: 25 },
  { key:"dark",    label:"Dark",    color:"#D940FF", proj:"#E37AFF", enemy:"#C084FC", energyCost: 35 },
];

export function color3(hex){
  const h = hex.replace("#",""); const n = parseInt(h,16);
  const r = (n>>16)&255, g = (n>>8)&255, b = n&255;
  return new BABYLON.Color3(r/255, g/255, b/255);
}

// Yalnızca hex tipiyle koşu ayarları (şimdilik difficulty yok)
export function makeRunConfig({ hexTypeKey="em" }={}){
  const type = HEX_TYPES.find(t => t.key===hexTypeKey) || HEX_TYPES[1];
  return {
    typeKey: type.key,
    label: type.label,
    themeColor: color3(type.color),
    projectileColor: color3(type.proj),
    enemyColor: color3(type.enemy),
    spawnEvery: 1.25,
    enemySpeed: 2.7,
    playerSpeed: 6.0,
    energyCost: type.energyCost
  };
}
