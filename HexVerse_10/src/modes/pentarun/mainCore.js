// src/modes/pentarun/mainCore.js
import { createEngine, startLoop } from "../../core/engine.js";
import { SceneBase } from "../../core/sceneBase.js";
import { createSpaceBackground } from "../../core/env/spaceBackground.js";
import { RunBackgroundPreset } from "../../core/env/presets.js";
import { openPentaCoreSelection } from "./coreSelectUI.js";
import { PentaGame } from "./runtime/PentaGame.js";


class PentaCoreScene extends SceneBase{
  constructor(engine, canvas){
    super(engine, canvas);
    this.scene = new BABYLON.Scene(engine);
    this.setupBasics({ cameraTarget: new BABYLON.Vector3(0, 1, 0), radius: 20, glow: true });
    createSpaceBackground(this.scene, RunBackgroundPreset);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("renderCanvas");
  const engine = createEngine(canvas);
  const core = new PentaCoreScene(engine, canvas);

  // Core selection (tek buton)
  openPentaCoreSelection({
onConfirm: (stageId) => {
  const game = new PentaGame(core.scene, stageId, {
    onExit: () => { location.href = "./index.html"; }
  });
  startLoop(engine, core.scene);
},
    onCancel: () => { location.href = "./index.html"; }
  });
});
