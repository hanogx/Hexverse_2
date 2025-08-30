// src/core/version.js
export const VERSION_INFO = {
  game: "HexVerse",
  version: "1.0.3",
  build: "2024.12.19",
  modules: {
    hexrun: "2.1.0",
    pentarun: "1.8.2", 
    hub: "1.5.1",
    core: "3.2.0"
  },
  features: {
    modularArchitecture: true,
    unifiedSelectionSystem: true,
    responsiveDesign: true,
    stableGameLoop: true
  }
};

export function getVersionString() {
  return `${VERSION_INFO.game} v${VERSION_INFO.version} (${VERSION_INFO.build})`;
}

export function getModuleVersion(moduleName) {
  return VERSION_INFO.modules[moduleName] || "unknown";
}

export function logVersionInfo() {
  console.log(`🎮 ${getVersionString()}`);
  console.log("📦 Modules:", VERSION_INFO.modules);
  console.log("✨ Features:", VERSION_INFO.features);
}