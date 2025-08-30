import { Config } from "./config.js";
export class SceneBase{
  constructor(engine, canvas){ this.engine=engine; this.canvas=canvas; this.scene=new BABYLON.Scene(engine); this.camera=null; this.light=null; this.glow=null; }
  setupBasics({cameraTarget=new BABYLON.Vector3(0,1,0), radius=18, glow=Config.effects.glow}={}){
    this.camera=new BABYLON.ArcRotateCamera("cam",-Math.PI/2,Math.PI/3,radius,cameraTarget,this.scene);
    this.camera.attachControl(this.canvas,true);
    this.light=new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0,1,0), this.scene);
    if(glow){ this.glow=new BABYLON.GlowLayer("glow", this.scene, { blurKernelSize:24 }); this.glow.intensity=Config.effects.glowIntensity; }
  }
  dispose(){ this.scene?.dispose(); }
}
