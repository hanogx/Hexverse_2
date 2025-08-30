export const PENTA_STAGES = {
  1:  { title: "Stage 1",  mechanics: ["laser"], description: "Ice Lasers", reqEnergy: 20, reqRelic: 0 },
  2:  { title: "Stage 2",  mechanics: ["solar"], description: "Solar Fire", reqEnergy: 24, reqRelic: 0 },
  3:  { title: "Stage 3",  mechanics: ["em"], description: "EM Waves", reqEnergy: 28, reqRelic: 0 },
  4:  { title: "Stage 4",  mechanics: ["gravity"], description: "Gravitational Push", reqEnergy: 32, reqRelic: 1 },
  5:  { title: "Stage 5",  mechanics: ["dark"], description: "Black Holes", reqEnergy: 36, reqRelic: 1 },
  6:  { title: "Stage 6",  mechanics: ["laser","solar"], description: "Entry-level Combo (Ice + Fire)", reqEnergy: 40, reqRelic: 1 },
  7:  { title: "Stage 7",  mechanics: ["gravity","em"], description: "Movement Control Test", reqEnergy: 44, reqRelic: 2 },
  8:  { title: "Stage 8",  mechanics: ["laser","dark"], description: "Multitasking Test", reqEnergy: 48, reqRelic: 2 },
  9:  { title: "Stage 9",  mechanics: ["laser","solar","em"], description: "Area Control Peak", reqEnergy: 52, reqRelic: 3 },
  10: { title: "Stage 10", mechanics: ["gravity","solar","dark"], description: "Synergistic Chaos", reqEnergy: 56, reqRelic: 3 },
  11: { title: "Stage 11", mechanics: ["laser","solar","em","dark"], description: "Mental Load Test", reqEnergy: 60, reqRelic: 4 },
  12: { title: "Stage 12", mechanics: ["gravity","laser","em","dark"], description: "Final Challenge", reqEnergy: 64, reqRelic: 4 },
  13: { title: "CORE STAGE", mechanics: ["laser","solar","em","gravity","dark"], description: "Endless Mode: Planet Core", reqEnergy: 70, reqRelic: 5 },
};

export const PENTA_UI_CONFIG = {
  joystick: { deadzone: 0.18, sensitivity: 1.12 },
  combo:    { slots: 3 }
};
