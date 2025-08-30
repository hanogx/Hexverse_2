// src/modes/hexrun/systems/game.js
export class Game {
  constructor({ canvas, initialFace="em" }) {
    this.canvas = canvas;
    this.engine = new BABYLON.Engine(canvas, true, { stencil: true });
    this.scene  = new BABYLON.Scene(this.engine);
    this.initialFace = initialFace;
    this.elapsed = 0;
    this.spawned = 0;
    this.hits    = 0;

    this._setupCameraLights();
    this._createSpaceBackground();
    this._createMaterials();
    this._createGrid(40, 22, 0.9);
    this._createGoldberg();
    this._setupInput();

    this._tickHandlers = [];
    this.engine.runRenderLoop(()=> this._update());
    window.addEventListener("resize", () => this.engine.resize());
  }

  onTick(cb){ this._tickHandlers.push(cb); }

  _setupCameraLights(){
    this.camera = new BABYLON.ArcRotateCamera("cam",
      Math.PI/2, Math.PI/2.2, 45, BABYLON.Vector3.Zero(), this.scene);
    this.camera.attachControl(this.canvas, true);
    this.camera.lowerRadiusLimit = 30;
    this.camera.upperRadiusLimit = 80;
    this.camera.wheelDeltaPercentage = 0.01;

    const hemi = new BABYLON.HemisphericLight("h", new BABYLON.Vector3(0,1,0), this.scene);
    hemi.intensity = 0.7;
    const dir = new BABYLON.DirectionalLight("d", new BABYLON.Vector3(1,-1,0.2), this.scene);
    dir.intensity = 0.5;

    this.glow = new BABYLON.GlowLayer("glow", this.scene);
    this.glow.intensity = 0.6;
  }

  _createSpaceBackground(){
    // Koyu skybox
    const sky = BABYLON.MeshBuilder.CreateBox("sky", { size: 1000 }, this.scene);
    const mat = new BABYLON.StandardMaterial("skyMat", this.scene);
    mat.disableLighting = true;
    mat.emissiveColor = new BABYLON.Color3(0.02, 0.02, 0.06);
    sky.material = mat;
    sky.infiniteDistance = true;

    // Yıldız partikülleri (hafif)
    const stars = new BABYLON.ParticleSystem("stars", 2000, this.scene);
    stars.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
    stars.emitter = new BABYLON.Vector3(0,0,0);
    stars.minEmitBox = new BABYLON.Vector3(-500,-500,-500);
    stars.maxEmitBox = new BABYLON.Vector3( 500, 500, 500);
    stars.minSize = 0.1; stars.maxSize = 0.5;
    stars.emitRate = 0; stars.manualEmitCount = 2000;
    stars.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    stars.start();

    // Nebula “blobları”
    const addBlob = (pos, radius, col) => {
      const m = new BABYLON.MeshBuilder.CreateSphere("nb", { diameter: radius*2, segments: 8 }, this.scene);
      const mm = new BABYLON.StandardMaterial("nbMat", this.scene);
      mm.disableLighting = true;
      mm.emissiveColor = col;
      mm.alpha = 0.08;
      m.material = mm;
      m.position = pos;
      m.renderingGroupId = 0;
    };
    addBlob(new BABYLON.Vector3(-80,  20, -100), 120, new BABYLON.Color3(0.2,0.6,1));
    addBlob(new BABYLON.Vector3( 90, -30, -120), 140, new BABYLON.Color3(0.6,0.3,1));
  }

  _createMaterials(){
    // zemin
    this.hexMat = new BABYLON.StandardMaterial("hexMat", this.scene);
    this.hexMat.diffuseColor = new BABYLON.Color3(0.22,0.24,0.3);

    // goldberg rengi seçime göre
    const faceColors = {
      solar:   new BABYLON.Color3(1.0, 0.6, 0.0), // turuncu
      em:      new BABYLON.Color3(0.0, 0.6, 1.0), // mavi
      gravity: new BABYLON.Color3(0.2, 1.0, 0.2), // yeşil
      dark:    new BABYLON.Color3(0.6, 0.2, 0.8)  // mor
    };
    this.goldbergColor = faceColors[this.initialFace] || faceColors.em;
    this.projectileMat = new BABYLON.StandardMaterial("projMat", this.scene);
    this.projectileMat.emissiveColor = this.goldbergColor.clone();
    this.projectileMat.diffuseColor  = this.goldbergColor.clone();
  }

  _createGrid(rows, cols, radius){
    const hexH = Math.sqrt(3)*radius;
    const vSp = hexH*1.15;
    const hSp = 1.5*radius*1.15;

    const base = BABYLON.MeshBuilder.CreateCylinder("hexBase", {
      diameterTop: radius*2, diameterBottom: radius*2, height: 0.7, tessellation: 6
    }, this.scene);
    base.rotation.x = Math.PI/2;
    base.material = this.hexMat;
    base.isVisible = false;

    this.tiles = [];
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const x = c*hSp - (cols*hSp)/2;
        const y = r*vSp + (c%2===0?0:vSp/2) - (rows*vSp)/2;
        const t = base.createInstance(`hex_${r}_${c}`);
        t.position.set(x, y, 0);
        this.tiles.push(t);
      }
    }
  }

  _createGoldberg(){
    // Babylon 5+ içinde CreateGoldberg var; yoksa IcoSphere ile degrade edilebilir.
    try{
      this.goldberg = BABYLON.MeshBuilder.CreateGoldberg("gold", { m:2, n:1 }, this.scene);
    }catch(e){
      this.goldberg = BABYLON.MeshBuilder.CreateIcoSphere("gold", { subdivisions: 2, radius: 1.2 }, this.scene);
    }
    this.goldberg.material = new BABYLON.StandardMaterial("goldMat", this.scene);
    this.goldberg.material.diffuseColor  = this.goldbergColor.clone();
    this.goldberg.material.emissiveColor = this.goldbergColor.clone().scale(0.4);
    this.goldberg.position = new BABYLON.Vector3(0, -20, 5);

    // basit “reticle”
    this.reticle = BABYLON.MeshBuilder.CreateDisc("ret", { radius: 0.6, tessellation: 32 }, this.scene);
    const rm = new BABYLON.StandardMaterial("rm", this.scene);
    rm.disableLighting = true;
    rm.emissiveColor = new BABYLON.Color3(1,1,1);
    this.reticle.material = rm;
    this.reticle.rotation.x = Math.PI/2;
    this.reticle.position = new BABYLON.Vector3(0,-10,0.1);
  }

  _setupInput(){
    // fareyle nişan (zemine raycast)
    this.scene.onPointerObservable.add((pi)=>{
      if (pi.type !== BABYLON.PointerEventTypes.POINTERMOVE) return;
      const pick = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
      if (pick?.hit) {
        const p = pick.pickedPoint.clone();
        p.z = 0.1;
        this.reticle.position = p;
      }
    });

    // Space = mermi
    window.addEventListener("keydown",(e)=>{
      if (e.code === "Space") this._fire();
    });
  }

  _fire(){
    const proj = BABYLON.MeshBuilder.CreateSphere("p", { diameter: 0.5, segments: 8 }, this.scene);
    proj.position = this.goldberg.position.add(new BABYLON.Vector3(0, 0, -0.5));
    proj.material = this.projectileMat;
    proj.metadata = { vel: this.reticle.position.subtract(this.goldberg.position).normalize().scale(0.8) };
    this.spawned++;
    // kısa kuyruğa basit parçacık efekti
    const ps = new BABYLON.ParticleSystem("trail", 80, this.scene);
    ps.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
    ps.emitter = proj;
    ps.minEmitBox = ps.maxEmitBox = BABYLON.Vector3.Zero();
    ps.color1 = new BABYLON.Color4(this.goldbergColor.r, this.goldbergColor.g, this.goldbergColor.b, 1);
    ps.color2 = new BABYLON.Color4(1,1,1,0.3);
    ps.minSize = 0.05; ps.maxSize = 0.2;
    ps.emitRate = 120;
    ps.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    ps.start();
    proj.metadata.trail = ps;

    // 5 sn sonra otomatik temizle
    setTimeout(()=>{
      ps.stop(); setTimeout(()=>ps.dispose(), 300);
      proj.dispose();
    }, 5000);
  }

  _update(){
    const dt = this.scene.getEngine().getDeltaTime()/1000;
    this.elapsed += dt;

    // mermileri ilerlet
    for(const m of this.scene.meshes){
      if (m.name === "p" && m.metadata?.vel){
        m.position.addInPlace(m.metadata.vel);
        // basit “çarpma” (zemini geçtiyse yok et)
        if (m.position.z < -1) {
          if (m.metadata.trail){ m.metadata.trail.stop(); setTimeout(()=>m.metadata.trail.dispose(), 300); }
          m.dispose();
          this.hits++; // şimdilik “isabet” sayalım
        }
      }
    }

    // HUD callback
    for(const cb of this._tickHandlers){
      cb({ seconds: this.elapsed, spawned: this.spawned, hits: this.hits });
    }

    this.scene.render();
  }
}
