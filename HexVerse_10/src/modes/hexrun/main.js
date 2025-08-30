// src/modes/hexrun/main.js
import { createEngine, startLoop } from "../../core/engine.js";
import { SceneBase } from "../../core/sceneBase.js";
import { createSpaceBackground } from "../../core/env/spaceBackground.js";
import { RunBackgroundPreset } from "../../core/env/presets.js";
import { createUI } from "../../core/ui/uiFactory.js";
import { createProjectileSystem } from "../../shared/projectiles.js";
import { createHexGrid } from "../../shared/hexGridFactory.js";
import { createEnemySystem } from "../../shared/enemySpawner.js";
import { openHexRunSelection } from "./selectUI.js";
import { makeRunConfig, color3 } from "./config.js";
import { Store } from "../../core/store.js";
import { navigateToHub, safeDispose, PerformanceMonitor } from "../../core/gameUtils.js";

class HexRunScene extends SceneBase {
  constructor(engine, canvas) {
    super(engine, canvas);
    this.setupBasics({ cameraTarget: new BABYLON.Vector3(0, 1, 0), radius: 20, glow: true });
    createSpaceBackground(this.scene, RunBackgroundPreset);
    
    // Initialize selection screen
    this.initializeSelection();
  }

  initializeSelection() {
    // Show selection screen first, then initialize game
    openHexRunSelection({
      onConfirm: (selection) => {
        const cfg = makeRunConfig(selection);
        Store.set("lastHexRunConfig", selection);
        
        // Check if external game starter exists (for integration)
        if (window.__startHexRun) {
          window.__hubUrl = "./index.html";
          const hexType = (selection && selection.hexTypeKey) ? selection.hexTypeKey : (cfg.initialFace || "solar");
          safeDispose(this.scene.getEngine());
          window.__startHexRun(hexType);
          return;
        }
        
        // Initialize game with selected configuration
        this.initializeGame(cfg);
      },
      onCancel: () => {
        // Return to hub
        navigateToHub();
      }
    });
  }

  initializeGame(config) {
    // Create hex grid with theme color
    const tint = config.themeColor;
    this.grid = createHexGrid(this.scene, {
      radius: 5, 
      tileSize: 1.1, 
      y: 0,
      onTile: (mesh, q, r) => {
        const distance = Math.abs(q) + Math.abs(r) + Math.abs(-q-r);
        const baseColor = new BABYLON.Color3(0.08, 0.12, 0.20);
        const emissiveBlend = BABYLON.Color3.Lerp(baseColor, tint, 0.35);
        mesh.material.diffuseColor = baseColor;
        mesh.material.emissiveColor = new BABYLON.Color3(
          emissiveBlend.r * 0.6, 
          emissiveBlend.g * 0.6, 
          emissiveBlend.b * 0.8
        );
      }
    });

    // Create player ship
    this.ship = BABYLON.MeshBuilder.CreateSphere("ship", { diameter: 1.2 }, this.scene);
    this.ship.position.y = 0.8;
    this.ship.material = new BABYLON.StandardMaterial("shipMat", this.scene);
    this.ship.material.emissiveColor = tint.clone();
    this.playerRadius = 0.6;

    // Initialize UI/HUD
    this.ui = createUI(this.scene, { skin: "run" });
    this.ui.hud.text = `HexRun — ${config.label} / ${config.spawnEvery.toFixed(2)}s`;

    // Setup input handling
    this.input = { x: 0, y: 0, mag: 0 };
    this.ui.onMove(vector => { this.input = vector; });

    // Initialize projectile system
    this.projectiles = createProjectileSystem(this.scene, {
      speed: 20, 
      life: 1.6, 
      size: 0.5, 
      color: config.projectileColor
    });

    // Setup fire controls
    this.ui.onFire(() => {
      const direction = new BABYLON.Vector3(this.input.x, 0, this.input.y);
      const startPosition = this.ship.position.add(new BABYLON.Vector3(0, 0.2, 0));
      this.projectiles.fireFrom(startPosition, direction);
      this.ui.showWarning("FIRE!");
      setTimeout(() => this.ui.showWarning(""), 120);
    });

    // Initialize game state
    this.gameState = {
      time: 0,
      energy: 0,
      score: 0
    };

    // Initialize enemy system
    this.initializeEnemySystem(config);

    // Start game loop
    this.scene.onBeforeRenderObservable.add(() => this.gameLoop(config));
  }

  initializeEnemySystem(config) {
    const enemyMaterialColor = config.enemyColor;
    
    this.enemies = createEnemySystem(this.scene, {
      getTargetPosition: () => this.ship.position,
      projectiles: this.projectiles,
      spawnEvery: config.spawnEvery,
      speed: config.enemySpeed,
      enemyRadius: 0.6,
      onEnemyKilled: () => { 
        this.gameState.score += 10; 
        this.gameState.energy += 10; 
      }
    });

    // Apply enemy material styling
    this.applyEnemyMaterial(enemyMaterialColor);
  }

  applyEnemyMaterial(color) {
    const enemyMaterial = new BABYLON.StandardMaterial("enemyMatOverride", this.scene);
    enemyMaterial.emissiveColor = color.clone();
    enemyMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    
    // Apply to existing enemies
    this.enemies.forEachEnemy?.(enemy => enemy.mesh.material = enemyMaterial);
    
    // Apply to future spawned enemies
    this.scene.onNewMeshAddedObservable.add((mesh) => {
      if (mesh.name.startsWith("enemy")) {
        mesh.material = enemyMaterial;
      }
    });
  }

  gameLoop(config) {
    const deltaTime = this.scene.getEngine().getDeltaTime() / 1000;

    // Update player movement
    const speed = config.playerSpeed;
    this.ship.position.x += this.input.x * speed * deltaTime;
    this.ship.position.z += this.input.y * speed * deltaTime;

    // Smooth camera follow
    const targetPosition = this.ship.position.add(new BABYLON.Vector3(0, 0.4, 0));
    const newTarget = BABYLON.Vector3.Lerp(this.camera.target, targetPosition, 0.08);
    this.camera.target.copyFrom(newTarget);

    // Handle enemy collisions
    this.handleCollisions();

    // Update game state
    this.updateGameState(deltaTime);
  }

  handleCollisions() {
    const enemiesToRemove = [];
    
    this.enemies.forEachEnemy(enemy => {
      const distanceSquared = BABYLON.Vector3.DistanceSquared(this.ship.position, enemy.mesh.position);
      const radiusSum = this.playerRadius + enemy.radius;
      
      if (distanceSquared <= radiusSum * radiusSum) {
        enemiesToRemove.push(enemy);
      }
    });

    if (enemiesToRemove.length > 0) {
      enemiesToRemove.forEach(enemy => this.enemies.removeEnemy(enemy));
      this.gameState.energy = Math.max(0, this.gameState.energy - 15);
      this.ui.showWarning("HIT!");
      setTimeout(() => this.ui.showWarning(""), 250);
    }
  }

  updateGameState(deltaTime) {
    this.gameState.time += deltaTime;
    this.ui.setTimer(this.gameState.time);
    this.ui.setEnergy(this.gameState.energy);
  }
}

// Initialize the game
window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("renderCanvas");
  const engine = createEngine(canvas);
  const hexRunScene = new HexRunScene(engine, canvas);
  
  startLoop(engine, hexRunScene.scene);
});