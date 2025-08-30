import { createEngine, startLoop } from "../../core/engine.js";
import { SceneBase } from "../../core/sceneBase.js";
import { createSpaceBackground } from "../../core/env/spaceBackground.js";
import { RunBackgroundPreset } from "../../core/env/presets.js";
import { createUI } from "../../core/ui/uiFactory.js";
const canvas=document.getElementById('renderCanvas'); const engine=createEngine(canvas);
class PentaRunScene extends SceneBase{
  constructor(e,c){ super(e,c); this.setupBasics({cameraTarget:BABYLON.Vector3.Zero(), radius:18, glow:true}); createSpaceBackground(this.scene, RunBackgroundPreset);
    const penta=BABYLON.MeshBuilder.CreateDisc('penta',{tessellation:5,radius:2},this.scene); penta.rotation.x=Math.PI/2;
    this.ui=createUI(this.scene,{skin:'run'}); this.ui.hud.text='PentaRun — HUD'; }
}
const scene=new PentaRunScene(engine, canvas).scene; startLoop(engine, scene);
