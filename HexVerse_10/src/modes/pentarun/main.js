// src/modes/pentarun/main.js
import { createEngine, startLoop } from "../../core/engine.js";
import { SceneBase } from "../../core/sceneBase.js";
import { createSpaceBackground } from "../../core/env/spaceBackground.js";
import { RunBackgroundPreset } from "../../core/env/presets.js";
import { PentaGame } from "./runtime/PentaGame.js";

class PentaRunScene extends SceneBase {
  constructor(engine, canvas) {
    super(engine, canvas);
    this.setupBasics({ cameraTarget: new BABYLON.Vector3(0, 1, 0), radius: 20, glow: true });
    createSpaceBackground(this.scene, RunBackgroundPreset);
    
    // Initialize game directly - selection is handled by hub
    this.initializeGame();
  }

  initializeGame() {
    // Get stage selection from URL parameters or default to stage 1
    const urlParams = new URLSearchParams(window.location.search);
    const stageId = parseInt(urlParams.get('stage')) || 1;
    
    // Initialize PentaRun game
    this.pentaGame = new PentaGame(this.scene, stageId, {
      onExit: () => { 
        // Return to hub
        location.href = "./index.html"; 
      },
      onStageComplete: (nextStageId) => {
        // Handle stage progression
        if (nextStageId) {
          // Reload with next stage
          location.href = `./pentarun.html?stage=${nextStageId}`;
        } else {
          // Return to hub if no next stage
          location.href = "./index.html";
        }
      }
    });
  }
}

// Initialize the game
window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("renderCanvas");
  const engine = createEngine(canvas);
  const pentaRunScene = new PentaRunScene(engine, canvas);
  
  startLoop(engine, pentaRunScene.scene);
});