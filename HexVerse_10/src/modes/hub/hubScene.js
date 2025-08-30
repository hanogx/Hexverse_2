// src/modes/hub/hubScene.js
import { createSpaceBackground } from "../../core/env/spaceBackground.js";
import { HubBackgroundPreset } from "../../core/env/presets.js";
import { createEngine, startLoop } from "../../core/engine.js";
import { SceneBase } from "../../core/sceneBase.js";
import { openPentaRunSelection } from "../pentarun/selectUI.js";
import { logVersionInfo } from "../../core/version.js";

const canvas = document.getElementById("renderCanvas");
const engine = createEngine(canvas);

// Level tablosu (goldberg.html’deki mantık)
const LEVELS = [
  { m:2,n:0, solar:8,electro:8, gravity:7, dark:7 },
  { m:2,n:1, solar:15,electro:15, gravity:15, dark:15 },
  { m:3,n:0, solar:20,electro:20, gravity:20, dark:20 },
  { m:2,n:2, solar:28,electro:28, gravity:27, dark:27 },
  { m:3,n:1, solar:30,electro:30, gravity:30, dark:30 },
  { m:4,n:0, solar:38,electro:38, gravity:37, dark:37 },
  { m:3,n:2, solar:45,electro:45, gravity:45, dark:45 },
  { m:4,n:1, solar:50,electro:50, gravity:50, dark:50 },
  { m:5,n:0, solar:60,electro:60, gravity:60, dark:60 },
  { m:3,n:3, solar:65,electro:65, gravity:65, dark:65 },
  { m:4,n:2, solar:68,electro:68, gravity:67, dark:67 },
  { m:5,n:1, solar:75,electro:75, gravity:75, dark:75 },
  { m:6,n:0, solar:88,electro:88, gravity:87, dark:87 },
  { m:4,n:3, solar:90,electro:90, gravity:90, dark:90 },
  { m:5,n:2, solar:95,electro:95, gravity:95, dark:95 },
  { m:6,n:1, solar:105,electro:105, gravity:105, dark:105 },
  { m:4,n:4, solar:118,electro:118, gravity:117, dark:117 },
  { m:5,n:3, solar:120,electro:120, gravity:120, dark:120 },
  { m:6,n:2, solar:128,electro:128, gravity:127, dark:127 },
  { m:7,n:1, solar:140,electro:140, gravity:140, dark:140 },
  { m:5,n:4, solar:150,electro:150, gravity:150, dark:150 },
  { m:6,n:3, solar:155,electro:155, gravity:155, dark:155 },
  { m:7,n:2, solar:165,electro:165, gravity:165, dark:165 },
  { m:8,n:1, solar:180,electro:180, gravity:180, dark:180 },
  { m:5,n:5, solar:185,electro:185, gravity:185, dark:185 },
  { m:6,n:4, solar:187,electro:187, gravity:188, dark:188 },
  { m:7,n:3, solar:195,electro:195, gravity:195, dark:195 },
  { m:9,n:0, solar:200,electro:200, gravity:200, dark:200 },
  { m:8,n:2, solar:207,electro:207, gravity:208, dark:208 },
  { m:6,n:5, solar:225,electro:225, gravity:225, dark:225 },
  { m:7,n:4, solar:230,electro:230, gravity:230, dark:230 }
];

class HubScene extends SceneBase{
  constructor(engine, canvas){
    super(engine, canvas);
    this.setupBasics({ cameraTarget: BABYLON.Vector3.Zero(), radius: 8, glow: false });
    this.scene.clearColor = new BABYLON.Color3(0.01,0.01,0.05);

    // Kamera
    const cam = this.camera;
    cam.alpha = -Math.PI/2; cam.beta = Math.PI/2.5; cam.radius = 8;
    cam.inertia = 0.9; cam.angularSensibilityX = 500; cam.angularSensibilityY = 500;
    cam.wheelPrecision = 50; cam.pinchPrecision = 50; cam.pinchDeltaPercentage = 0.01;
    cam.minZ = 0.1; cam.maxZ = 120;

    // --- Kamera kilidi: mouse/touch drag kamera dönmesin ---
try {
  // ArcRotate kamera için varsayılan pointer input'u sök
  this.camera.inputs.removeByType("ArcRotateCameraPointersInput");
} catch(e) { /* bazı sürümlerde removeByType yoksa: */ }
this.camera.panningSensibility = 0;
this.camera.detachControl(); // SceneBase attach etmiş olabilir; tamamen ayır

// (İstersen zoom'u açık tutmak için detachControl'ü kaldırıp sadece removeByType bırakabilirsin.)


    // Işıklar (kameraya bağlı)
    const lights = [
      new BABYLON.DirectionalLight("L1", new BABYLON.Vector3(1.5,0,0), this.scene),
      new BABYLON.DirectionalLight("L2", new BABYLON.Vector3(-1.5,-1.5,0), this.scene),
      new BABYLON.DirectionalLight("L3", new BABYLON.Vector3(0,0,3), this.scene),
    ];
    lights[0].intensity=1.6; lights[1].intensity=0.9; lights[2].intensity=1.4;
    lights.forEach(l=>l.parent=cam);

    // Ana glow sadece seçtiklerimizde çalışsın
    const glow = new BABYLON.GlowLayer("glow", this.scene);
    glow.intensity = 0.6; glow.blurKernelSize = 64;

    // Yıldız arka plan (parçacık)
    this._makeGoldbergStarBackground();  // sabit nebula + yıldız layer


    // Drag inertia
    const WORLD_UP=new BABYLON.Vector3(0,1,0), WORLD_RIGHT=new BABYLON.Vector3(1,0,0);
    let dragging=false, prev={x:0,y:0}, vel={x:0,y:0}; const damp=0.95;

    // Goldberg objeleri
    let outer=null, inner=null;
    const buildGoldberg = (levelIndex=0)=>{
      if (outer) outer.dispose();
      if (inner) inner.dispose();

      const info = LEVELS[Math.max(0, Math.min(levelIndex, LEVELS.length-1))];

      // DIŞ: gövde + kenarlar, pentagonlar kırmızı, hex yüzeyler koyu
      outer = BABYLON.MeshBuilder.CreateGoldberg("outer",{ m:info.m, n:info.n, updatable:true }, this.scene);
      this._addFaceDepth(outer, 0.12);
      this._addThickness(outer, 0.06);
      outer.rotationQuaternion = BABYLON.Quaternion.Identity();

      const nb = outer.goldbergData?.nbFaces ?? outer.goldbergData?.faceCenters?.length ?? 32;
      let faceSizes = outer.goldbergData?.faceSizes;
      if (!faceSizes || faceSizes.length!==nb) faceSizes = Array.from({length:nb}, (_,i)=> i<12?5:6);

      const colsetOuter=[];
      for (let i=0;i<nb;i++){
        if (faceSizes[i]===5) colsetOuter.push([i,i,new BABYLON.Color4(0.9,0.2,0.2,1)]);    // pentagon
        else                  colsetOuter.push([i,i,new BABYLON.Color4(0.18,0.2,0.24,1)]); // hex koyu metal
      }
      outer.setGoldbergFaceColors(colsetOuter);

      const outerMat = new BABYLON.StandardMaterial("outerMat", this.scene);
      outerMat.useVertexColors = true;
      outerMat.specularColor = new BABYLON.Color3(0.12,0.12,0.12);
      outer.material = outerMat;
      outer.enableEdgesRendering(); outer.edgesWidth=0.6;
      outer.edgesColor = new BABYLON.Color4(0.5,0.75,1.0,1.0);
      glow.addIncludedOnlyMesh(outer);

      // İÇ: levele göre hex renk dağıtımı (solar/em/gravity/dark)
      inner = BABYLON.MeshBuilder.CreateGoldberg("inner",{ m:info.m, n:info.n, updatable:true }, this.scene);
      inner.scaling.set(0.99,0.99,0.99);
      const colsetInner = this._colorInnerFaces(inner, info);
      inner.setGoldbergFaceColors(colsetInner);

      const innerMat = new BABYLON.StandardMaterial("innerMat", this.scene);
      innerMat.useVertexColors = true;
      innerMat.specularColor = new BABYLON.Color3(0.0,0.0,0.0);
      inner.material = innerMat;
      inner.parent = outer;
      glow.addIncludedOnlyMesh(inner);

      // Drag inertia animasyonu
      this.scene.onBeforeRenderObservable.add(()=>{
        if (!outer || !outer.rotationQuaternion) return;
        if (!dragging){
          const qYaw = BABYLON.Quaternion.RotationAxis(WORLD_UP, vel.y);
          const qPit = BABYLON.Quaternion.RotationAxis(WORLD_RIGHT, vel.x);
          outer.rotationQuaternion = qYaw.multiply(qPit).multiply(outer.rotationQuaternion);
          vel.x*=damp; vel.y*=damp; if (Math.abs(vel.x)<1e-4) vel.x=0; if (Math.abs(vel.y)<1e-4) vel.y=0;
        }
      });
    };

    // Pointer rotasyonu
    this.scene.onPointerObservable.add((pi)=>{
      const sens=0.008;
      if (pi.type===BABYLON.PointerEventTypes.POINTERDOWN){ dragging=true; vel.x=vel.y=0; prev.x=pi.event.clientX; prev.y=pi.event.clientY; canvas.style.cursor="grabbing"; }
      else if (pi.type===BABYLON.PointerEventTypes.POINTERUP){ dragging=false; canvas.style.cursor="grab"; }
      else if (pi.type===BABYLON.PointerEventTypes.POINTERMOVE && dragging && outer){
        const dx=pi.event.clientX-prev.x, dy=pi.event.clientY-prev.y;
        const qYaw = BABYLON.Quaternion.RotationAxis(WORLD_UP,   -dx*sens);
        const qPit = BABYLON.Quaternion.RotationAxis(WORLD_RIGHT, -dy*sens);
        const rot = qYaw.multiply(qPit);
        outer.rotationQuaternion = rot.multiply(outer.rotationQuaternion||BABYLON.Quaternion.Identity());
        vel.y = -dx*sens; vel.x = -dy*sens;
        prev.x=pi.event.clientX; prev.y=pi.event.clientY;
      }
    });

    // 3D butonlar (kameraya bağlı) + düzgün etiketler
    this._buildButtons(cam);

    // Level seçici (sol üst) — gerçekten rebuild ediyor
    this._buildLevelUI((lvl)=> buildGoldberg(lvl));

    // İlk kurulum
    canvas.style.cursor="grab";
    buildGoldberg(0);
    
    // Log version information
    logVersionInfo();
  }

  // --- Yardımcılar ---

// Sabit (ekran-space) nebula + yıldız katmanı
// goldberg.html tabanlı sabit yıldız sistemi + çok hafif nebula
_makeGoldbergStarBackground(){
  const scene = this.scene;

  // --- yıldız dokusu (parlak merkez + ışınlar) ---
  const createStarTexture = () => {
    const size = 64;
    const tex = new BABYLON.DynamicTexture("starTex", size, scene, false);
    const ctx = tex.getContext();
    ctx.clearRect(0,0,size,size);
    const cx=size/2, cy=size/2, r=size/4;

    const grad = ctx.createRadialGradient(cx,cy,0,cx,cy,r);
    grad.addColorStop(0.0, "rgba(255,255,255,1.0)");
    grad.addColorStop(0.2, "rgba(240,240,255,0.9)");
    grad.addColorStop(0.5, "rgba(200,200,255,0.4)");
    grad.addColorStop(1.0, "rgba(100,100,200,0.0)");
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fill();

    ctx.strokeStyle = "rgba(200,200,255,0.30)"; ctx.lineWidth = 1;
    for(let i=0;i<4;i++){
      const a=(Math.PI/4)*i;
      ctx.beginPath(); ctx.moveTo(cx,cy);
      ctx.lineTo(cx+Math.cos(a)*size, cy+Math.sin(a)*size); ctx.stroke();
    }
    ctx.strokeStyle = "rgba(200,200,255,0.15)";
    for(let i=0;i<4;i++){
      const a=(Math.PI/4)*(i+0.5);
      ctx.beginPath(); ctx.moveTo(cx,cy);
      ctx.lineTo(cx+Math.cos(a)*size*0.7, cy+Math.sin(a)*size*0.7); ctx.stroke();
    }
    tex.update();
    return tex;
  };

  // --- yıldız parçacıkları ---
  const starSphere = BABYLON.MeshBuilder.CreateSphere("starEmitter", { diameter:160, segments:1 }, scene);
  starSphere.isVisible = false;

  const stars = new BABYLON.ParticleSystem("stars", 3000, scene);
  stars.particleTexture = createStarTexture();

  const emitter = new BABYLON.SphereParticleEmitter();
  emitter.radius = 80; emitter.radiusRange = 0.2;
  stars.particleEmitterType = emitter;
  stars.emitter = starSphere;

  stars.minSize = 0.2;  stars.maxSize = 0.8;
  stars.minLifeTime = Number.MAX_SAFE_INTEGER;
  stars.maxLifeTime = Number.MAX_SAFE_INTEGER;
  stars.minEmitPower = 0; stars.maxEmitPower = 0;
  stars.direction1 = new BABYLON.Vector3(0,0,0);
  stars.direction2 = new BABYLON.Vector3(0,0,0);
  stars.manualEmitCount = 3000;

  stars.updateFunction = function(particles){
    for (let i=0;i<particles.length;i++){
      const p = particles[i];
      if (p.twinkleSpeed === undefined){
        // renk dağılımı
        const ct = Math.random();
        if (ct>0.9)      p.baseColor = new BABYLON.Color4(1.0,0.6,0.6,1.0); // kırmızımsı (nadir)
        else if (ct>0.7) p.baseColor = new BABYLON.Color4(0.8,0.8,1.0,1.0); // mavi-beyaz
        else if (ct>0.5) p.baseColor = new BABYLON.Color4(1.0,0.8,0.6,1.0); // sarımsı
        else             p.baseColor = new BABYLON.Color4(1.0,1.0,1.0,1.0); // beyaz

        // boyut & yanıp sönme hızı
        const sr = Math.random();
        if (sr>0.97){ p.size=1.0; p.twinkleSpeed=0.001+Math.random()*0.003; }
        else if (sr>0.85){ p.size=0.6; p.twinkleSpeed=0.002+Math.random()*0.005; }
        else if (sr>0.5){  p.size=0.3; p.twinkleSpeed=0.004+Math.random()*0.008; }
        else {             p.size=0.18; p.twinkleSpeed=0.006+Math.random()*0.012; }
        p.twinkleOffset = Math.random()*100;
        p.age2=0;
      }
      p.age2 = (p.age2||0) + 0.016;
      const a = 0.2 + 0.8*Math.abs(Math.sin(p.age2*p.twinkleSpeed + p.twinkleOffset));
      p.color = new BABYLON.Color4(p.baseColor.r, p.baseColor.g, p.baseColor.b, a);
    }
  };
  stars.start();

  // --- çok hafif nebula (opsiyonel — istersen stars.layer dışında bırak) ---
  const W=2048, H=1024;
  const nebDT = new BABYLON.DynamicTexture("nebulaDT", {width:W,height:H}, scene, false);
  const nctx = nebDT.getContext();
  nctx.clearRect(0,0,W,H);
  nctx.fillStyle = "#050812"; nctx.fillRect(0,0,W,H);
  nctx.globalCompositeOperation = "lighter";
  const blob=(cx,cy,r,[R,G,B],a)=>{
    const x=cx*W, y=cy*H, Rr=r*Math.min(W,H);
    const g=nctx.createRadialGradient(x,y,0,x,y,Rr);
    const rgba=(aa)=>`rgba(${R},${G},${B},${aa})`;
    g.addColorStop(0,rgba(a*0.8)); g.addColorStop(0.5,rgba(a*0.25)); g.addColorStop(1,rgba(0));
    nctx.fillStyle=g; nctx.beginPath(); nctx.arc(x,y,Rr,0,Math.PI*2); nctx.fill();
  };
  blob(0.30,0.38,0.40,[14,165,233],0.35);
  blob(0.65,0.30,0.44,[168,85,247],0.30);
  blob(0.55,0.65,0.36,[56,189,248],0.25);
  blob(0.35,0.65,0.30,[99,102,241],0.22);
  nebDT.update();

  const nebLayer = new BABYLON.Layer("nebulaLayer", null, scene, true);
  nebLayer.texture = nebDT;
  nebLayer.isBackground = true;
  nebLayer.alpha = 0.45; // çok hafif renk
}



  _addFaceDepth(mesh, d=0.12){
    const pos = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    const nor = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
    if(!pos||!nor) return;
    for(let i=0;i<pos.length;i+=3){
      pos[i]+=nor[i]*d; pos[i+1]+=nor[i+1]*d; pos[i+2]+=nor[i+2]*d;
    }
    mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, pos);
    mesh.refreshBoundingInfo();
  }

  _addThickness(mesh, t=0.06){
    if (t<=0) return;
    const pos = mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
    const nor = mesh.getVerticesData(BABYLON.VertexBuffer.NormalKind);
    const idx = mesh.getIndices(); if(!pos||!nor||!idx) return;
    const inner=[];
    for(let i=0;i<pos.length;i+=3){
      inner.push(pos[i]-nor[i]*t, pos[i+1]-nor[i+1]*t, pos[i+2]-nor[i+2]*t);
    }
    const newPos=[...pos,...inner], newNor=[...nor];
    for(let i=0;i<nor.length;i+=3){ newNor.push(-nor[i],-nor[i+1],-nor[i+2]); }
    const vcount = pos.length/3; const newIdx=[...idx];
    for(let i=0;i<idx.length;i+=3){ newIdx.push(idx[i+2]+vcount, idx[i+1]+vcount, idx[i]+vcount); }
    const edges=new Map();
    for(let i=0;i<idx.length;i+=3){
      const add=(a,b)=>{ const k=a<b?`${a}-${b}`:`${b}-${a}`; edges.set(k,(edges.get(k)||0)+1); };
      add(idx[i],idx[i+1]); add(idx[i+1],idx[i+2]); add(idx[i+2],idx[i]);
    }
    edges.forEach((c,k)=>{
      if(c===1){ const [v1,v2]=k.split('-').map(Number);
        newIdx.push(v1,v2,v2+vcount, v1,v2+vcount,v1+vcount);
      }
    });
    mesh.setVerticesData(BABYLON.VertexBuffer.PositionKind, newPos);
    mesh.setVerticesData(BABYLON.VertexBuffer.NormalKind, newNor);
    mesh.setIndices(newIdx);
    mesh.refreshBoundingInfo();
  }

  _colorInnerFaces(mesh, info){
    // Yüz tipleri
    const nb = mesh.goldbergData?.nbFaces ?? mesh.goldbergData?.faceCenters?.length ?? 32;
    let faceSizes = mesh.goldbergData?.faceSizes;
    if (!faceSizes || faceSizes.length!==nb) faceSizes = Array.from({length:nb}, (_,i)=> i<12?5:6);

    const hexIdx=[], pentIdx=[];
    for(let i=0;i<nb;i++) (faceSizes[i]===6 ? hexIdx : pentIdx).push(i);

    // Renk paleti
    const C_SOLAR   = new BABYLON.Color4(1.0,0.55,0.1,1);
    const C_ELECTRO = new BABYLON.Color4(0.2,0.55,1.0,1);
    const C_GRAV    = new BABYLON.Color4(0.2,0.9,0.4,1);
    const C_DARK    = new BABYLON.Color4(0.85,0.25,1.0,1);
    const C_PENTA   = new BABYLON.Color4(1.0,0.25,0.25,1);

    const cs=[];
    // pentagonlar sabit renk
    pentIdx.forEach(i=> cs.push([i,i,C_PENTA]));

    // hex dağıtımı
    let hi=0; const H=hexIdx.length;
    function take(k, col){ for(let t=0;t<k && hi<H; t++,hi++){ const f=hexIdx[hi]; cs.push([f,f,col]); } }
    take(info.solar,   C_SOLAR);
    take(info.electro, C_ELECTRO);
    take(info.gravity, C_GRAV);
    take(info.dark,    C_DARK);

    // kalan varsa griye boya
    while (hi<H){ const f=hexIdx[hi++]; cs.push([f,f,new BABYLON.Color4(0.25,0.28,0.32,1)]); }

    return cs;
  }

  _buildButtons(cam){
    const scene = this.scene;

    // --- 3D butonlar (kameraya bağlı node) ---
    const parent = new BABYLON.TransformNode("hubButtons", scene);
    parent.parent = cam;
    parent.position = new BABYLON.Vector3(0,-3.5,12);
    parent.scaling.set(0.5,0.5,0.5);

    // Glow katmanları
    const glowHex  = new BABYLON.GlowLayer("glowHex", scene);  glowHex.intensity=0.6;  glowHex.blurKernelSize=64;
    const glowPenta= new BABYLON.GlowLayer("glowPenta", scene);glowPenta.intensity=0.6;glowPenta.blurKernelSize=64;
    const glowCore = new BABYLON.GlowLayer("glowCore", scene); glowCore.intensity=0.4; glowCore.blurKernelSize=64;
    const glowPvp  = new BABYLON.GlowLayer("glowPvp", scene);  glowPvp.intensity=0.5;  glowPvp.blurKernelSize=64;

    // Malzemeler
    const hexBlue = new BABYLON.PBRMaterial("hexBlue", scene);
    hexBlue.albedoColor   = new BABYLON.Color3(0,0.75,1);
    hexBlue.emissiveColor = new BABYLON.Color3(0,0.5,0.8);
    hexBlue.metallic=0.8; hexBlue.roughness=0.2; hexBlue.alpha=0.7;

    const pentaRed = new BABYLON.PBRMaterial("pentaRed", scene);
    pentaRed.albedoColor   = new BABYLON.Color3(1,0.2,0.2);
    pentaRed.emissiveColor = new BABYLON.Color3(0.8,0.2,0.2);
    pentaRed.metallic=0.8; pentaRed.roughness=0.2; pentaRed.alpha=0.7;

    const coreMat = new BABYLON.PBRMaterial("coreMat", scene);
    coreMat.albedoColor   = new BABYLON.Color3(1.0,0.5,0.1);
    coreMat.emissiveColor = new BABYLON.Color3(0.8,0.4,0.1);
    coreMat.metallic=0.8; coreMat.roughness=0.2; coreMat.alpha=0.4;

    const coreSphereMat = new BABYLON.PBRMaterial("coreSphere", scene);
    coreSphereMat.albedoColor   = new BABYLON.Color3(1.0,0.1,0.1);
    coreSphereMat.emissiveColor = new BABYLON.Color3(1.0,0.2,0.2);
    coreSphereMat.metallic=0.5; coreSphereMat.roughness=0.2;

    const pvpSoonMat = new BABYLON.PBRMaterial("pvpSoon", scene);
    pvpSoonMat.albedoColor   = new BABYLON.Color3(0.5,0.5,0.5);
    pvpSoonMat.emissiveColor = new BABYLON.Color3(0.25,0.25,0.25);
    pvpSoonMat.metallic=0.5; pvpSoonMat.roughness=0.5; pvpSoonMat.alpha=0.6;

    // Meshler (HEX / PENTA / CORE / PvP SOON)
    const hexBtn   = BABYLON.MeshBuilder.CreateCylinder("hexBtn",   {height:0.3, diameter:2.0, tessellation:6}, scene);
    hexBtn.material=hexBlue;  hexBtn.parent=parent;  hexBtn.position.x=-3.6; hexBtn.rotation.x=Math.PI/2; glowHex.addIncludedOnlyMesh(hexBtn);

    const pentaBtn = BABYLON.MeshBuilder.CreateCylinder("pentaBtn", {height:0.3, diameter:2.0, tessellation:5}, scene);
    pentaBtn.material=pentaRed;pentaBtn.parent=parent;pentaBtn.position.x=-1.2; pentaBtn.rotation.x=Math.PI/2; glowPenta.addIncludedOnlyMesh(pentaBtn);

    const corePenta= BABYLON.MeshBuilder.CreateCylinder("corePenta",{height:0.3, diameter:2.0, tessellation:5}, scene);
    corePenta.material=coreMat;corePenta.parent=parent;corePenta.position.x= 1.2; corePenta.rotation.x=Math.PI/2; glowCore.addIncludedOnlyMesh(corePenta);

    const coreSphere= BABYLON.MeshBuilder.CreateSphere("coreSphere",{diameter:1.0, segments:16}, scene);
    coreSphere.material=coreSphereMat; coreSphere.parent=corePenta; coreSphere.position.z=0.0; glowCore.addIncludedOnlyMesh(coreSphere);

    const pvpBtn   = BABYLON.MeshBuilder.CreateGoldberg("pvpBtn", { m:3, n:0, size:0.9 }, scene);
    pvpBtn.material=pvpSoonMat; pvpBtn.parent=parent; pvpBtn.position.x=3.6; pvpBtn.rotation.x=Math.PI/2; glowPvp.addIncludedOnlyMesh(pvpBtn);

    // --- EKRAN ÜSTÜ (GUI) ETİKETLER: sabit dururlar, dönmezler ---
// --- EKRAN ÜSTÜ (GUI) ETİKETLER: sabit dururlar ---
// --- EKRAN ÜSTÜ (GUI) ETİKETLER: sabit dururlar ---
// --- GUI etiketler (sabit ekran üzeri) ---
// --- GUI etiketler (sabit ekran üzeri) ---
// --- GUI etiketler (sabit ekran üzeri) ---
if (this._hubGui) this._hubGui.dispose();
const ui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("hubGui", true, scene);
this._hubGui = ui;

const _textBlocks = []; // <— tüm TextBlock’ları toplayacağız

function addLabel(mesh, lines){
  const rect = new BABYLON.GUI.Rectangle();
  rect.width = "120px";
  rect.height = "40px";
  rect.thickness = 0;
  rect.background = "transparent";
  rect.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  rect.verticalAlignment   = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

  const tb = new BABYLON.GUI.TextBlock();
  tb.text = lines;
  tb.color = "#FFFFFF";
  tb.fontFamily = "Orbitron";   // hedef font
  tb.fontSize = 10;             // senin ayarın
  tb.textWrapping = true;
  tb.lineSpacing = "2px";
  tb.outlineColor = "#000";
  tb.outlineWidth = 2;
  rect.addControl(tb);
  _textBlocks.push(tb);         // <— referansı sakla

  ui.addControl(rect);
  rect.linkWithMesh(mesh);
  rect.linkOffsetY = 52;        // butona değmesin diye biraz aşağı
  return rect;
}




// *** SADECE BU BLOK KALSIN — üstteki bağımsız addLabel çağrılarını SİLİN ***
const labels = [];
labels.push(addLabel(hexBtn,   "ENTER\nHEX"));
labels.push(addLabel(pentaBtn, "ENTER\nPENTA"));
labels.push(addLabel(corePenta,"ENTER\nCORE"));
labels.push(addLabel(pvpBtn,   "PvP\nSOON"));

// Orbitron'u kesin uygula (font yüklenmesini bekle + GUI'yi zorla yeniden çiz)
function ensureOrbitron(){
  const apply = () => { _textBlocks.forEach(tb => tb.fontFamily = "Orbitron"); ui.markAsDirty(); };
  if (document.fonts?.load) {
    document.fonts.load("10px Orbitron").then(apply);
    document.fonts.ready.then(apply);
  }
  setTimeout(apply, 300); // ekstra emniyet
}
ensureOrbitron();


// Ekrana göre ölçek/yerleşim (buton kümesini küçült)
const engine = scene.getEngine();
function fitButtons(){
  const w = engine.getRenderWidth();
  // temel değerler
  let s = 0.50, offsetY = 52, posY = -3.5, posZ = 12;

  if (w <= 768) { s = 0.42; offsetY = 48; posY = -3.3; posZ = 11.5; }
  if (w <= 420) { s = 0.36; offsetY = 44; posY = -3.0; posZ = 11.0; }

  parent.scaling.set(s, s, s);
  parent.position.y = posY;
  parent.position.z = posZ;

  labels.forEach(r => r.linkOffsetY = offsetY);
}
fitButtons();
engine.onResizeObservable.add(() => fitButtons());



    // --- Hover / Click anim + navigasyon ---
    const animateBtn = (mesh, hover)=>{
      const t=hover?1.1:1.0;
      BABYLON.Animation.CreateAndStartAnimation("s_"+mesh.name, mesh, "scaling", 30, 10, mesh.scaling, new BABYLON.Vector3(t,t,t), BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      if (mesh.material){
        const cur = mesh.material.emissiveIntensity||0.6;
        const to  = hover?1.2:0.6;
        BABYLON.Animation.CreateAndStartAnimation("e_"+mesh.name, mesh.material, "emissiveIntensity", 30, 10, cur, to, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
      }
    };
    function bind(mesh, onClick){
      mesh.actionManager = new BABYLON.ActionManager(scene);
      mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, ()=>animateBtn(mesh,true)));
      mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger,  ()=>animateBtn(mesh,false)));
      mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, ()=>onClick()));
    }

    bind(hexBtn,   ()=>{ location.href="./hexrun.html"; });
    bind(pentaBtn, ()=>{ this.openPentaStageSelection(); });
    bind(corePenta,()=>{ location.href="./corerun.html"; });
    bind(pvpBtn,   ()=>{ /* şimdilik pasif */ });

    // dışarıdan erişmek istersen:
    window.hubButtonsContainer = parent;
  }

  openPentaStageSelection() {
    // Open PentaRun stage selection overlay
    openPentaRunSelection({
      onConfirm: (stageId) => {
        // Navigate to PentaRun with selected stage
        location.href = `./pentarun.html?stage=${stageId}`;
      },
      onCancel: () => {
        // Stay in hub - selection overlay will close automatically
      }
    });
  }


  _buildLevelUI(onChange){
    // önceki varsa kaldır
    document.getElementById('hub-level-ui')?.remove();
    const box = document.createElement('div');
    box.id="hub-level-ui";
    Object.assign(box.style,{
      position:'absolute', top:'16px', left:'16px', zIndex:1000, pointerEvents:'auto',
      background:'rgba(0,0,0,0.55)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:'10px',
      padding:'10px 12px', color:'#fff', fontFamily:"'Orbitron','Rajdhani',sans-serif"
    });
    const label=document.createElement('div'); label.textContent="SELECT LEVEL"; Object.assign(label.style,{fontSize:'12px',opacity:.8,marginBottom:'6px'});
    const sel=document.createElement('select'); Object.assign(sel.style,{padding:'6px 8px', background:'rgba(0,0,0,0.75)', color:'#fff', border:'1px solid rgba(255,255,255,0.25)', borderRadius:'6px'});
    const base=new Option("Base Level","0"); sel.add(base);
    for(let i=1;i<=LEVELS.length;i++) sel.add(new Option(`Level ${i}`, String(i)));
    sel.onchange=()=>{ const v=parseInt(sel.value,10); onChange(v); };
    box.appendChild(label); box.appendChild(sel); document.body.appendChild(box);
  }
}

const hub = new HubScene(engine, canvas);
startLoop(engine, hub.scene);