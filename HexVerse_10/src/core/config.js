// src/core/config.js
export const Config = {
  ui: { idealWidth: 1080, idealHeight: 1920, marginPct: 0.10 },
  effects: { glow: true, glowIntensity: 0.7 },
  skins: { hub: "hub", run: "run" },
  i18n: { default: "en" },
  input: {
    joystickSensitivity: 1.0,   // arttırırsan daha hızlı tepki verir
    deadzone: 0.12              // 0.08 - 0.18 arası ideal
  }
};
