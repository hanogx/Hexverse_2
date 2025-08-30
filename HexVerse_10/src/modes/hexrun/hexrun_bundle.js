// Auto-generated from hexrun.html scripts
// ---- CORE GAME LOGIC ----

const FireHandlers = {
  solar: {
    single: (game, idx) => game.solarSingleFire(game.projectiles[idx], idx),
    combo:  game => game.solarComboFire()
  },
  em: {
    single: (game, projIndex) => game.emSingleFire(game.projectiles[projIndex], projIndex),
    combo:  game => game.emComboFire()
  },
  gravity: {
    single: (game, projIndex) => game.gravitySingleFire(game.projectiles[projIndex], projIndex),
    combo:  game => game.gravityComboFire()
  },
  dark: {
    single: (game, projIndex) => game.darkSingleFire(game.projectiles[projIndex], projIndex),
    combo:  game => game.darkComboFire()
  },
  wex: {
    single: (game, i) => game.wexSingleFire(game.projectiles[i], i),
    combo: game => game.wexComboFire()
  },
  hexcraft: {
    single: (game, projIndex) => game.darkSingleFire(game.projectiles[projIndex], projIndex),
    combo:  game => game.darkComboFire()
  }
};

// ---- HEX SELECTION SCREEN ----
const createHexSelectionUI = () => {
    const uiContainer = document.getElementById('hexSelectionScreen');
    if (!uiContainer) return;

    // Önceki içeriği temizle
    while (uiContainer.firstChild) {
        uiContainer.removeChild(uiContainer.firstChild);
    }
    
    // Ana konteyner stili
    uiContainer.style.position = 'absolute';
    uiContainer.style.top = '0';
    uiContainer.style.left = '0';
    uiContainer.style.width = '100%';
    uiContainer.style.height = '100%';
    uiContainer.style.backgroundColor = 'rgba(0,0,0,0.9)';
    uiContainer.style.fontFamily = "'Orbitron', 'Rajdhani', sans-serif";
    uiContainer.style.color = '#FFFFFF';
    uiContainer.style.zIndex = '1000';
    uiContainer.style.display = 'flex';
    uiContainer.style.flexDirection = 'column';
    uiContainer.style.alignItems = 'center';
    uiContainer.style.justifyContent = 'center';
    uiContainer.style.padding = '30px';
    uiContainer.style.boxSizing = 'border-box';
    
    // Üst panel - Level Bilgisi
    const topPanel = document.createElement('div');
    topPanel.style.textAlign = 'center';
    topPanel.style.marginBottom = '40px';
    
    const levelTitle = document.createElement('h1');
    levelTitle.textContent = `PLANET LEVEL: ${window.__planetLevel || 1}`;
    levelTitle.style.fontSize = '32px';
    levelTitle.style.fontWeight = 'bold';
    levelTitle.style.textShadow = '0 0 10px rgba(0,191,255,0.8)';
    levelTitle.style.marginBottom = '10px';
    topPanel.appendChild(levelTitle);
    
    const hexTitle = document.createElement('h2');
    hexTitle.textContent = 'SELECT HEX TYPE TO RUN';
    hexTitle.style.fontSize = '22px';
    hexTitle.style.opacity = '0.8';
    hexTitle.style.fontFamily = "'Rajdhani', sans-serif";
    topPanel.appendChild(hexTitle);
    
    uiContainer.appendChild(topPanel);
    
    // Orta panel - Hex Türleri
    const hexPanel = document.createElement('div');
    hexPanel.style.display = 'flex';
    hexPanel.style.flexWrap = 'wrap';
    hexPanel.style.justifyContent = 'center';
    hexPanel.style.gap = '30px';
    hexPanel.style.maxWidth = '900px';
    hexPanel.style.margin = '0 auto';
    
    const hexTypes = [
        { type: 'solar', name: 'SOLAR HEX', color: '#FFA500', data: (window.__hexData && window.__hexData.solar) || { total: 10, active: 8, mex: 75, wex: 42 } },
        { type: 'em', name: 'EM HEX', color: '#4169E1', data: (window.__hexData && window.__hexData.em) || { total: 8, active: 6, mex: 68, wex: 39 } },
        { type: 'gravity', name: 'GRAVITY HEX', color: '#32CD32', data: (window.__hexData && window.__hexData.gravity) || { total: 9, active: 7, mex: 72, wex: 45 } },
        { type: 'dark', name: 'DARK HEX', color: '#9932CC', data: (window.__hexData && window.__hexData.dark) || { total: 5, active: 4, mex: 58, wex: 36 } }
    ];
    
    let selectedHexType = null;
    
    hexTypes.forEach(hexType => {
        const hexCard = document.createElement('div');
        hexCard.className = 'hex-card';
        hexCard.dataset.color = hexType.color; // Rengi sakla
        hexCard.style.width = '350px';
        hexCard.style.height = '220px';
        hexCard.style.backgroundColor = 'rgba(10, 20, 30, 0.7)';
        hexCard.style.border = `2px solid ${hexType.color}`;
        hexCard.style.borderRadius = '10px';
        hexCard.style.boxShadow = `0 0 15px ${hexType.color}`;
        hexCard.style.padding = '20px';
        hexCard.style.display = 'flex';
        hexCard.style.flexDirection = 'column';
        hexCard.style.justifyContent = 'space-between';
        hexCard.style.cursor = 'pointer';
        
        const hexHeader = document.createElement('div');
        hexHeader.style.display = 'flex';
        hexHeader.style.alignItems = 'center';
        hexHeader.style.marginBottom = '15px';
        
        const hexShape = document.createElement('div');
        hexShape.style.width = '30px';
        hexShape.style.height = '30px';
        hexShape.style.backgroundColor = hexType.color;
        hexShape.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
        hexShape.style.marginRight = '15px';
        hexHeader.appendChild(hexShape);
        
        const hexName = document.createElement('div');
        hexName.textContent = hexType.name;
        hexName.style.fontSize = '20px';
        hexName.style.fontWeight = 'bold';
        hexName.style.color = hexType.color;
        hexHeader.appendChild(hexName);
        hexCard.appendChild(hexHeader);
        
        const hexStats = document.createElement('div');
        hexStats.style.fontFamily = "'Rajdhani', sans-serif";
        hexStats.style.fontSize = '18px';
        
        const efficiency = Math.round((hexType.data.active / hexType.data.total) * 100);
        const efficiencyText = document.createElement('div');
        efficiencyText.textContent = `Efficiency: ${efficiency}% (${hexType.data.active}/${hexType.data.total})`;
        efficiencyText.style.marginBottom = '10px';
        hexStats.appendChild(efficiencyText);
        
        const progressBar = document.createElement('div');
        progressBar.style.width = '100%';
        progressBar.style.height = '8px';
        progressBar.style.backgroundColor = 'rgba(255,255,255,0.2)';
        progressBar.style.borderRadius = '4px';
        progressBar.style.overflow = 'hidden';
        
        const progressFill = document.createElement('div');
        progressFill.style.width = `${efficiency}%`;
        progressFill.style.height = '100%';
        progressFill.style.backgroundColor = hexType.color;
        progressFill.style.borderRadius = '4px';
        progressBar.appendChild(progressFill);
        hexStats.appendChild(progressBar);
        hexCard.appendChild(hexStats);
        
        const towerStats = document.createElement('div');
        towerStats.style.display = 'flex';
        towerStats.style.justifyContent = 'space-between';
        towerStats.style.marginTop = '15px';
        
        const mexStats = document.createElement('div');
        mexStats.innerHTML = `<strong>MEX Hit Rate:</strong> ${hexType.data.mex}%`;
        towerStats.appendChild(mexStats);
        
        const wexStats = document.createElement('div');
        wexStats.innerHTML = `<strong>WEX Hit Rate:</strong> ${hexType.data.wex}%`;
        towerStats.appendChild(wexStats);
        hexCard.appendChild(towerStats);
        
        hexCard.onclick = () => {
            document.querySelectorAll('.hex-card').forEach(card => {
                card.style.transform = 'scale(1)';
                card.style.boxShadow = `0 0 15px ${card.dataset.color}`;
            });
            
            hexCard.style.transform = 'scale(1.05)';
            hexCard.style.boxShadow = `0 0 25px ${hexType.color}, 0 0 10px white inset`;
            selectedHexType = hexType.type;
            
            const startButton = document.getElementById('startRunBtn');
            if (startButton) {
                startButton.disabled = false;
                startButton.style.opacity = '1';
                startButton.style.cursor = 'pointer';
            }
        };
        
        hexPanel.appendChild(hexCard);
    });
    
    uiContainer.appendChild(hexPanel);
    
    const bottomPanel = document.createElement('div');
    bottomPanel.style.display = 'flex';
    bottomPanel.style.justifyContent = 'center';
    bottomPanel.style.gap = '30px';
    bottomPanel.style.marginTop = '40px';
    
    const backButton = document.createElement('button');
    backButton.textContent = 'BACK TO HUB';
    backButton.style.padding = '12px 24px';
    backButton.style.backgroundColor = 'transparent';
    backButton.style.color = '#FFFFFF';
    backButton.style.border = '2px solid #FFFFFF';
    backButton.style.borderRadius = '5px';
    backButton.style.fontSize = '16px';
    backButton.style.fontWeight = 'bold';
    backButton.style.cursor = 'pointer';
    backButton.style.transition = 'all 0.3s ease';
    
    backButton.onmouseover = () => { backButton.style.backgroundColor = 'rgba(255,255,255,0.1)'; backButton.style.boxShadow = '0 0 10px rgba(255,255,255,0.5)'; };
    backButton.onmouseout = () => { backButton.style.backgroundColor = 'transparent'; backButton.style.boxShadow = 'none'; };
    backButton.onclick = () => { window.location.href = 'goldberg.html'; };
    bottomPanel.appendChild(backButton);
    
    const startButton = document.createElement('button');
    startButton.id = 'startRunBtn'; // ID ekledik
    startButton.textContent = 'START RUN';
    startButton.style.padding = '12px 24px';
    startButton.style.backgroundColor = 'transparent';
    startButton.style.color = '#00BFFF';
    startButton.style.border = '2px solid #00BFFF';
    startButton.style.borderRadius = '5px';
    startButton.style.fontSize = '16px';
    startButton.style.fontWeight = 'bold';
    startButton.style.transition = 'all 0.3s ease';
    startButton.style.boxShadow = '0 0 10px #00BFFF';
    startButton.disabled = true;
    startButton.style.opacity = '0.5';
    startButton.style.cursor = 'not-allowed';
    
    startButton.onmouseover = () => { if (!startButton.disabled) { startButton.style.backgroundColor = 'rgba(0,191,255,0.2)'; startButton.style.boxShadow = '0 0 20px #00BFFF'; } };
    startButton.onmouseout = () => { if (!startButton.disabled) { startButton.style.backgroundColor = 'transparent'; startButton.style.boxShadow = '0 0 10px #00BFFF'; } };
    
    startButton.onclick = () => {
        if (selectedHexType) {
            window.__selectedHexType = selectedHexType;
            document.getElementById('hexSelectionScreen').style.display = 'none';
            document.getElementById("renderCanvas").style.display = "block";
            document.getElementById("hud").style.display = "block";
            window.game = new Game(selectedHexType);
        }
    };
    
    bottomPanel.appendChild(startButton);
    uiContainer.appendChild(bottomPanel);
};

window.addEventListener("DOMContentLoaded", function() {

    try {
        const savedData = JSON.parse(localStorage.getItem('planetData'));
        if (savedData) {
            console.log('Kaydedilmiş veri yüklendi:', savedData);
            window.__planetLevel = savedData.planetLevel;
            window.__hexData = savedData.hexData;
            // Diğer verileri de buraya yükleyebilirsiniz.
        }
    } catch (e) {
        console.error("LocalStorage veri okuma hatası:", e);
    }
    // LocalStorage'dan verileri al (goldberg.html'den gelen)
    try {
        const planetLevel = localStorage.getItem('planetLevel');
        const hexData = JSON.parse(localStorage.getItem('hexData') || '{}');
        
        if (planetLevel) window.__planetLevel = parseInt(planetLevel);
        if (hexData) window.__hexData = hexData;
    } catch (e) {
        console.error("LocalStorage veri okuma hatası:", e);
        // Varsayılan verileri ata
        window.__planetLevel = 1;
        window.__hexData = {};
    }
    
    // Hex Selection ekranını oluştur ve göster
    createHexSelectionUI();
});

// ─── Fraktal yıldırım için midpoint displacement yöntemi ───


// ─── Fraktal yıldırım için midpoint displacement yöntemi ───
function generateFractalLightning(start, end, disp, detail, branchChance = 0.3) {
  const points = [];
  function subdivide(p1, p2, currentDisp) {
    if (currentDisp < detail) {
      points.push(p1, p2);
    } else {
      // 1) İki noktanın ortası
      const mid = p1.add(p2).scale(0.5);
      // 2) Orta noktayı, iki nokta arasına dik vektörde rasgele kaydır
      const dir  = p2.subtract(p1).normalize();
      const perp = BABYLON.Vector3.Cross(dir, BABYLON.Vector3.Up()).normalize();
      const offset = (Math.random() - 0.5) * currentDisp;
      mid.addInPlace(perp.scale(offset));
      // 3) İkiye böl ve sapmayı yarıya indirerek tekrar işle
      subdivide(p1, mid, currentDisp * 0.5);
      subdivide(mid, p2, currentDisp * 0.5);
      // ─── Rastgele bir yan dal oluştur ───
    if (Math.random() < branchChance) {
      // Dal için dik eksende sapma
      const branchDir  = BABYLON.Vector3.Cross(dir, perp).normalize();
      // Dalın uzunluğu: currentDisp'in %70–100 arası
      const branchLength = currentDisp * (0.7 + 0.3 * Math.random());
      const branchEnd = mid.add(branchDir.scale(branchLength));
      // Dalları biraz daha az sapmayla çiz
      subdivide(mid, branchEnd, currentDisp * 0.5);
    }
    }
  }
  subdivide(start, end, disp);
  return points;
}

// ==================== İSTEDİĞİNİZ KODUN DÜZELTİLMİŞ HALİ ====================

class Joystick3DController {
    constructor(scene, movementCallback) {
        this.scene = scene;
        this.movementCallback = movementCallback;
        this.camera = null;
        this.uiParent = null;
        this.base = null;
        this.nub = null;
        this.isDragging = false;
        this.pointerId = -1;
        this.baseRadius = 7;
        this.maxPixelRadius = 150;
        this.initialPointerPos = new BABYLON.Vector2(0, 0);
        this._pointerObserver = null;
        
        // Sürekli hareket için
        this._moveInterval = null;
        this._currentMoveX = 0;
        this._currentMoveZ = 0;
    }

    // --- EKRAN ORANINA GÖRE RESPONSIVE POZİSYONLAMA ---
// ActionButtonsController sınıfında updatePosition fonksiyonunu güncelleyin
updatePosition() {
    if (!this.camera || !this.uiParent) return;
    
    // Ekran boyutlarını al
    const engine = this.scene.getEngine();
    const width = engine.getRenderWidth();
    const height = engine.getRenderHeight();
    const aspectRatio = width / height;
    
    // Viewport boyutlarını hesapla (kameranın görüş alanı)
    const fov = this.camera.fov;
    const distance = this.camera.position.z;
    
    // Viewport genişliği ve yüksekliği (dünya koordinatlarında)
    const viewportHeight = 2.0 * Math.tan(fov / 2) * distance;
    const viewportWidth = viewportHeight * aspectRatio;
    
    // Joystick konumu - SAĞ ALT KÖŞE
    // Ekranın sağ kenarından %15 içeride, alt kenarından %15 yukarıda
    const rightMarginPercent = 0.20;
    const bottomMarginPercent = 0.18;
    
    const xPos = (viewportWidth / 2) * (1 - rightMarginPercent * 2);
    const yPos = -(viewportHeight / 2) * (1 - bottomMarginPercent * 2);
    
    // Z değeri - kameraya olan mesafe
    const zPos = distance * 0.8; // Kameradan biraz önde
    
    this.uiParent.position.set(xPos, yPos, zPos);
}


    createUI(camera) {
        this.camera = camera;
        if (this.uiParent) this.uiParent.dispose();

        this.uiParent = new BABYLON.TransformNode("JoystickUIParent", this.scene);
        this.uiParent.parent = this.camera;

        // Joystick tabanı - HEXAGON
        const baseMaterial = new BABYLON.PBRMaterial("joyBaseMat", this.scene);
        baseMaterial.metallic = 0.3;
        baseMaterial.roughness = 0.7;
        baseMaterial.albedoColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        baseMaterial.alpha = 0.5;

        // Hexagon taban (6 köşeli silindir)
        this.base = BABYLON.MeshBuilder.CreateCylinder("joystickBase", { 
            height: 0.2, 
            diameter: this.baseRadius * 1.5, 
            tessellation: 6  // 6 köşeli hexagon
        }, this.scene);
        this.base.material = baseMaterial;
        this.base.parent = this.uiParent;
        this.base.rotation.x = Math.PI / 2;
        this.base.isPickable = true;

        // Joystick nub (nipple) - HEXAGON
        const nubMaterial = new BABYLON.PBRMaterial("joyNubMat", this.scene);
        nubMaterial.metallic = 0.8;
        nubMaterial.roughness = 0.4;
        nubMaterial.albedoColor = new BABYLON.Color3(0.9, 0.1, 0.1);
        nubMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.05, 0.05);

        // Hexagon nub (6 köşeli silindir)
        this.nub = BABYLON.MeshBuilder.CreateCylinder("joystickNub", { 
            height: 0.5, 
            diameter: 5, 
            tessellation: 6  // 6 köşeli hexagon
        }, this.scene);
        this.nub.material = nubMaterial;
        this.nub.parent = this.base;
        this.nub.position.z = -0.5;  // Orijinal pozisyonu koruyoruz
        this.nub.isPickable = false;

        // Dokunma alanı - görünmez ama tıklanabilir (daha geniş)
        const touchArea = BABYLON.MeshBuilder.CreateCylinder("joystickTouchArea", { 
            diameter: this.baseRadius * 3, 
            height: 0.1,
            tessellation: 6  // Hexagon şeklinde dokunma alanı
        }, this.scene);
        touchArea.visibility = 0;
        touchArea.parent = this.base;
        touchArea.isPickable = true;

        // Pointer olaylarını ayarla
        this._setupPointerEvents();
        
        // Sürekli hareket için render loop'a ekle
        this.scene.registerBeforeRender(() => {
            if (this._currentMoveX !== 0 || this._currentMoveZ !== 0) {
                this.movementCallback(this._currentMoveX, this._currentMoveZ);
            }
        });
        
        this.updatePosition();
        this.adjustUIScale();
        
        window.addEventListener('resize', () => {
            this.updatePosition();
            this.adjustUIScale();
        });
    }
    
    _setupPointerEvents() {
    // Önceki observer'ı temizle
    if (this._pointerObserver) {
        this.scene.onPointerObservable.remove(this._pointerObserver);
    }
    
    // Yeni observer ekle
    this._pointerObserver = this.scene.onPointerObservable.add((pointerInfo) => {
        const event = pointerInfo.event;
        
        // POINTERDOWN - Joystick'e tıklandığında
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
            const pickedMesh = pointerInfo.pickInfo?.pickedMesh;
            
            if (pickedMesh && (pickedMesh === this.base || pickedMesh.name === "joystickTouchArea")) {
                this.isDragging = true;
                this.pointerId = event.pointerId;
                this.initialPointerPos.x = event.clientX;
                this.initialPointerPos.y = event.clientY;
            }
        }
        
        // POINTERMOVE - Sürükleme sırasında
        else if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE && this.isDragging) {
            if (event.pointerId === this.pointerId) {
                const deltaX = event.clientX - this.initialPointerPos.x;
                const deltaY = event.clientY - this.initialPointerPos.y;
                
                // Hareket vektörünü hesapla
                const moveVector = new BABYLON.Vector2(deltaX, deltaY);
                const distance = moveVector.length();
                
                // Ölü bölge (deadzone) - çok küçük hareketleri filtrele
                const deadzone = 5; // 5 piksel
                if (distance < deadzone) {
                    this._currentMoveX = 0;
                    this._currentMoveZ = 0;
                    this.nub.position.x = 0;
                    this.nub.position.z = 0;
                    return;
                }
                
                // Vektörü sınırla - GÖRSEL SINIR
                const visualLimit = this.maxPixelRadius;
                let visualScale = 1;
                if (distance > visualLimit) {
                    visualScale = visualLimit / distance;
                }
                
                // Nub pozisyonunu güncelle - GÖRSEL SINIR ile
                const nubX = moveVector.x * visualScale / this.maxPixelRadius * (this.baseRadius / 2);
                const nubZ = moveVector.y * visualScale / this.maxPixelRadius * (this.baseRadius / 2);
                
                // Nub'ı hareket ettir - GÖRSEL olarak sınırlı
                this.nub.position.x = nubX;
                this.nub.position.z = nubZ;
                
                // SANAL SINIR - Daha geniş hareket alanı için
                const virtualLimit = this.maxPixelRadius * 2; // 2 kat daha geniş sanal hareket alanı
                
                // Hareket gücünü hesapla - SANAL SINIR ile
                const force = Math.min(1.0, distance / virtualLimit);
                
                // Yön vektörünü normalize et
                const normalizedVector = distance > 0 ? 
                    new BABYLON.Vector2(moveVector.x / distance, moveVector.y / distance) : 
                    new BABYLON.Vector2(0, 0);
                
                // Hareket yönünü düzelt - SANAL SINIR ile ölçeklendir
                this._currentMoveX = normalizedVector.x * (distance / virtualLimit);
                this._currentMoveZ = -normalizedVector.y * (distance / virtualLimit);

                if (this.movementCallback) {
                    this.movementCallback(this._currentMoveX, this._currentMoveZ);
                }
                
                // Joystick'in merkeze olan uzaklığını kaydet - basılı tutma mantığı için
                this.lastDeltaX = deltaX;
                this.lastDeltaY = deltaY;
            }
        }
        
        // POINTERUP - Sürükleme bittiğinde
        else if ((pointerInfo.type === BABYLON.PointerEventTypes.POINTERUP || 
                 pointerInfo.type === BABYLON.PointerEventTypes.POINTEROUT) && 
                 this.isDragging) {
            if (event.pointerId === this.pointerId) {
                this.isDragging = false;
                this.pointerId = -1;
                
                // Nub'ı merkeze getir
                this.nub.position.x = 0;
                this.nub.position.z = 0;
                
                // Hareketi durdur
                this._currentMoveX = 0;
                this._currentMoveZ = 0;
                this.lastDeltaX = 0;
                this.lastDeltaY = 0;
            }
        }
    });
}

adjustUIScale() {
    if (this.uiParent) {
        // Ekran boyutuna göre ölçeklendirme
        const engine = this.scene.getEngine();
        const width = engine.getRenderWidth();
        const height = engine.getRenderHeight();
        
        // Daha küçük ekranlarda daha büyük UI
        const baseScale = 0.15;
        const minDimension = Math.min(width, height);
        
        // Referans çözünürlük (1080p)
        const referenceResolution = 1080;
        
        // Ölçek faktörü: küçük ekranlarda daha büyük, büyük ekranlarda daha küçük
        const scaleFactor = Math.max(0.8, Math.min(1.5, referenceResolution / minDimension));
        
        const finalScale = baseScale * scaleFactor;
        this.uiParent.scaling.setAll(finalScale);
    }
}

    show() {
        if (this.base) this.base.isVisible = true;
        if (this.nub) this.nub.isVisible = true;
    }
    
    hide() {
        if (this.base) this.base.isVisible = false;
        if (this.nub) this.nub.isVisible = false;
    }
}


class ActionButtonsController {
    constructor(scene, fireCallback, comboCallback) {
        this.scene = scene;
        this.fireCallback = fireCallback;
        this.comboCallback = comboCallback;
        this.flipCallback = null;
        this.camera = null;
        this.uiParent = null;
        this.fireButton = null;
        this.comboButton = null;
        this.flipButton = null;
        this.isComboEnabled = false;
        
        // Materyalleri tanımla
        this.fireMat = null;
        this.fireCapMat = null;
        this.comboMat_active = null;
        this.comboCapMat_active = null;
        this.comboMat_inactive = null;
        this.comboCapMat_inactive = null;
        this.flipMat = null;
        this.flipCapMat = null; 
    }

setFlipCallback(callback) {
    this.flipCallback = callback;
}


    _cleanupOldUI() {
        this.scene.getTransformNodeByName("ActionButtonsParent")?.dispose();
        if (this.fireButton) this.fireButton.dispose();
        if (this.comboButton) this.comboButton.dispose();
        this.fireButton = null;
        this.comboButton = null;
        this.flipButton = null;
        this.uiParent = null;
    }
    
    // --- EKRAN ORANINA GÖRE RESPONSIVE POZİSYONLAMA ---
updatePosition() {
    if (!this.camera || !this.uiParent) return;
    
    // Ekran boyutlarını al
    const engine = this.scene.getEngine();
    const width = engine.getRenderWidth();
    const height = engine.getRenderHeight();
    const aspectRatio = width / height;
    
    // Viewport boyutlarını hesapla (kameranın görüş alanı)
    const fov = this.camera.fov;
    const distance = this.camera.position.z;
    
    // Viewport genişliği ve yüksekliği (dünya koordinatlarında)
    const viewportHeight = 2.0 * Math.tan(fov / 2) * distance;
    const viewportWidth = viewportHeight * aspectRatio;
    
    // Butonlar konumu - SOL ALT KÖŞE
    // Ekranın sol kenarından %15 içeride, alt kenarından %15 yukarıda
    const leftMarginPercent = 0.18;
    const bottomMarginPercent = 0.25;
    
    const xPos = -(viewportWidth / 2) * (1 - leftMarginPercent * 2);
    const yPos = -(viewportHeight / 2) * (1 - bottomMarginPercent * 2);
    
    // Z değeri - kameraya olan mesafe
    const zPos = distance * 0.8; // Kameradan biraz önde
    
    this.uiParent.position.set(xPos, yPos, zPos);
}

createUI(camera) {
        this.camera = camera;
        this._cleanupOldUI();
        
        this.uiParent = new BABYLON.TransformNode("ActionButtonsParent", this.scene);
        this.uiParent.parent = camera;

        const basePBR = new BABYLON.PBRMaterial("buttonPBRMat", this.scene);
        basePBR.metallic = 0.3;
        basePBR.roughness = 0.4;
        basePBR.alpha = 0.6;
        
        this.fireMat = basePBR.clone("fireMat");
        this.fireMat.albedoColor = new BABYLON.Color3(0.8, 0.1, 0.1);
        this.fireMat.emissiveColor = new BABYLON.Color3(0.4, 0.05, 0.05);
        
        this.fireCapMat = basePBR.clone("fireCapMat");
        this.fireCapMat.albedoColor = new BABYLON.Color3(0.9, 0.2, 0.2);
        this.fireCapMat.emissiveColor = new BABYLON.Color3(0.5, 0.1, 0.1);
        
        this.comboMat_active = basePBR.clone("comboMatActive");
        this.comboMat_active.albedoColor = new BABYLON.Color3(1, 0.8, 0);
        this.comboMat_active.emissiveColor = new BABYLON.Color3(0.5, 0.4, 0);
        
        this.comboCapMat_active = basePBR.clone("comboCapMatActive");
        this.comboCapMat_active.albedoColor = new BABYLON.Color3(1, 0.9, 0);
        this.comboCapMat_active.emissiveColor = new BABYLON.Color3(0.6, 0.5, 0);
        
        this.comboMat_inactive = basePBR.clone("comboMatInactive");
        this.comboMat_inactive.albedoColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        this.comboMat_inactive.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1);
        this.comboMat_inactive.alpha = 0.5;
        
        this.comboCapMat_inactive = basePBR.clone("comboCapMatInactive");
        this.comboCapMat_inactive.albedoColor = new BABYLON.Color3(0.3, 0.3, 0.3);
        this.comboCapMat_inactive.emissiveColor = new BABYLON.Color3(0.15, 0.15, 0.15);
        this.comboCapMat_inactive.alpha = 0.5;
        
        // Flip buton materyalleri
        this.flipMat = basePBR.clone("flipMat");
        this.flipMat.albedoColor = new BABYLON.Color3(0.1, 0.4, 0.8); // Mavi renk
        this.flipMat.emissiveColor = new BABYLON.Color3(0.05, 0.2, 0.4);
        
        this.flipCapMat = basePBR.clone("flipCapMat");
        this.flipCapMat.albedoColor = new BABYLON.Color3(0.2, 0.5, 0.9);
        this.flipCapMat.emissiveColor = new BABYLON.Color3(0.1, 0.25, 0.45);

        const createButton = (name, yPos) => {
            const button = BABYLON.MeshBuilder.CreateCylinder(name, { height: 1, diameter: 5, tessellation: 6 }, this.scene);
            button.parent = this.uiParent;
            button.position.y = yPos;
            button.rotation.x = Math.PI / 2;
            
            const cap = BABYLON.MeshBuilder.CreateCylinder(name + "Cap", { height: 0.2, diameter: 4.5, tessellation: 6 }, this.scene);
            cap.parent = button;
            cap.position.y = 0.6;
            return button;
        };

        // Butonların yerlerini ayarla - COMBO BUTON ÜSTTE, FIRE BUTON ORTADA, FLIP BUTON ALTTA
        this.comboButton = createButton("comboButton", 0);
        this.fireButton = createButton("fireButton", -6);
        this.flipButton = createButton("flipButton", -12); // Fire butonunun altında
        
        this.fireButton.material = this.fireMat;
        this.fireButton.getChildren()[0].material = this.fireCapMat;
        
        this.flipButton.material = this.flipMat;
        this.flipButton.getChildren()[0].material = this.flipCapMat;
        
        const setupActions = (button, callback) => {
           if (!callback) return; // Callback yoksa işlem yapma
    
    button.actionManager = new BABYLON.ActionManager(this.scene);
    const action = new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger, 
        () => {
            // isEnabled özelliğini kontrol et (sadece combo butonu için)
            if (button === this.comboButton && !this.isComboEnabled) return;
            
            callback();
            
            // Animasyon
            if (button._isAnimating) return;
            button._isAnimating = true;
            
            const startScale = button.scaling.clone();
            const animation = new BABYLON.Animation(
                "clickAnimation",
                "scaling",
                30,
                BABYLON.Animation.ANIMATIONTYPE_VECTOR3
            );
            
            animation.setKeys([
                { frame: 0, value: startScale },
                { frame: 5, value: startScale.scale(0.85) },
                { frame: 10, value: startScale }
            ]);
            
            button.animations = [animation];
            this.scene.beginAnimation(button, 0, 10, false, 1, () => {
                button._isAnimating = false;
            });
        }
    );
    button.actionManager.registerAction(action);
    
    // Kapak için de aynı aksiyonu ekle
    const cap = button.getChildren()[0];
    cap.actionManager = new BABYLON.ActionManager(this.scene);
    cap.actionManager.registerAction(action);
};

        setupActions(this.fireButton, this.fireCallback);
        setupActions(this.comboButton, this.comboCallback);
if (this.flipButton) {
    setupActions(this.flipButton, this.flipCallback);
}
        
        this.updateComboButtonState(false);
        this.updatePosition(); // İlk pozisyonu hesapla
        this.adjustUIScale();
        window.addEventListener('resize', () => this.updatePosition());
    }


    
    updateComboButtonState(isEnabled) {
        if (!this.comboButton) return;
        
        this.isComboEnabled = isEnabled;
        const glowLayer = this.scene.getGlowLayerByName("glow");
        const comboCap = this.comboButton.getChildren()[0];

        if (isEnabled) {
            this.comboButton.material = this.comboMat_active;
            comboCap.material = this.comboCapMat_active;
            if (glowLayer) glowLayer.addIncludedOnlyMesh(comboCap);
        } else {
            this.comboButton.material = this.comboMat_inactive;
            comboCap.material = this.comboCapMat_inactive;
            if (glowLayer) glowLayer.removeIncludedOnlyMesh(comboCap);
        }
    }
    
adjustUIScale() {
    if (this.uiParent) {
        // Ekran boyutuna göre ölçeklendirme
        const engine = this.scene.getEngine();
        const width = engine.getRenderWidth();
        const height = engine.getRenderHeight();
        
        // Daha küçük ekranlarda daha büyük UI
        const baseScale = 0.15;
        const minDimension = Math.min(width, height);
        
        // Referans çözünürlük (1080p)
        const referenceResolution = 1080;
        
        // Ölçek faktörü: küçük ekranlarda daha büyük, büyük ekranlarda daha küçük
        const scaleFactor = Math.max(0.8, Math.min(1.5, referenceResolution / minDimension));
        
        const finalScale = baseScale * scaleFactor;
        this.uiParent.scaling.setAll(finalScale);
    }
}
    
    show() {
        if (this.fireButton) this.fireButton.isVisible = true;
        if (this.comboButton) this.comboButton.isVisible = true;
    }
    
    hide() {
        if (this.fireButton) this.fireButton.isVisible = false;
        if (this.comboButton) this.comboButton.isVisible = false;
    }
}

class GameHUD_BUNDLED_UNUSED {
  constructor(game) {
    this.game = game;
    this.scene = game.scene;
    this.gui = game.gui;
    
    // Ana HUD konteynerlerini oluştur
    this.createHUDContainers();
    
    // Aktif bildirimleri ve sayaçları takip etmek için
    this.activeNotifications = [];
    this.activeCountdowns = {};
  }
  
  createHUDContainers() {
    // Üst orta bildirim alanı
    this.notificationContainer = new BABYLON.GUI.StackPanel();
    this.notificationContainer.width = "500px";
    this.notificationContainer.height = "150px";
    this.notificationContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.notificationContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    this.notificationContainer.top = "120px";
    this.gui.addControl(this.notificationContainer);
    
    // Sağ üst sayaç alanı
    this.countdownContainer = new BABYLON.GUI.StackPanel();
    this.countdownContainer.width = "400px";
    this.countdownContainer.height = "250px";
    this.countdownContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.countdownContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    this.countdownContainer.top = "120px";
    this.countdownContainer.right = "20px";
    this.gui.addControl(this.countdownContainer);
    
    // Sol üst durum alanı
    this.statusContainer = new BABYLON.GUI.StackPanel();
    this.statusContainer.width = "400px";
    this.statusContainer.height = "300px";
    this.statusContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.statusContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    this.statusContainer.top = "120px";
    this.statusContainer.left = "20px";
    this.gui.addControl(this.statusContainer);
  }
  
  // Başarı bildirimi göster
  showNotification(text, color, duration = 2000) {
    const notification = new BABYLON.GUI.TextBlock();
    notification.text = text;
    notification.color = color;
    notification.fontSize = 42;
    notification.fontFamily = "Orbitron";
    notification.height = "50px";
    notification.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    notification.outlineWidth = 2;
    notification.outlineColor = "black";

  // Glow efekti için shadow desteği ekle
  notification.shadowBlur = 0; // Varsayılan olarak glow yok
  notification.shadowColor = color;
  notification.shadowOffsetX = 0;
  notification.shadowOffsetY = 0;
    
    // Animasyon için başlangıç değerleri
    notification.alpha = 0;
    notification.scaleX = 0.5;
    notification.scaleY = 0.5;
    
    this.notificationContainer.addControl(notification);
    this.activeNotifications.push(notification);
    
    // Giriş animasyonu
    const fadeInAnimation = () => {
      notification.alpha += 0.1;
      notification.scaleX += 0.05;
      notification.scaleY += 0.05;
      
      if (notification.alpha < 1) {
        requestAnimationFrame(fadeInAnimation);
      } else {
        // Tam görünür olduktan sonra
        notification.alpha = 1;
        notification.scaleX = 1;
        notification.scaleY = 1;
        
        // Belirli süre sonra kaybolma animasyonu
        setTimeout(() => {
          const fadeOutAnimation = () => {
            notification.alpha -= 0.05;
            
            if (notification.alpha > 0) {
              requestAnimationFrame(fadeOutAnimation);
            } else {
              // Tamamen kaybolduğunda kaldır
              this.notificationContainer.removeControl(notification);
              const index = this.activeNotifications.indexOf(notification);
              if (index !== -1) {
                this.activeNotifications.splice(index, 1);
              }
            }
          };
          fadeOutAnimation();
        }, duration);
      }
    };
    
    fadeInAnimation();
    
    return notification;
  }
  
  // Geri sayım göster
  showCountdown(id, text, color, duration, onComplete = null) {
    // Önceki aynı ID'li sayacı temizle
    if (this.activeCountdowns[id]) {
      this.countdownContainer.removeControl(this.activeCountdowns[id].control);
      clearInterval(this.activeCountdowns[id].interval);
      delete this.activeCountdowns[id];
    }
    
    const countdownControl = new BABYLON.GUI.Rectangle();
    countdownControl.width = "280px";
    countdownControl.height = "60px";
    countdownControl.cornerRadius = 10;
    countdownControl.color = color;
    countdownControl.thickness = 2;
    countdownControl.background = "rgba(0, 0, 0, 0.5)";
    
    const countdownText = new BABYLON.GUI.TextBlock();
    countdownText.text = `${text}: ${(duration / 1000).toFixed(1)}s`;
    countdownText.color = color;
    countdownText.fontSize = 36;
    countdownText.fontFamily = "Rajdhani";
    
    countdownControl.addControl(countdownText);
    this.countdownContainer.addControl(countdownControl);
    
    const startTime = performance.now();
    const interval = setInterval(() => {
      const elapsedTime = performance.now() - startTime;
      const remainingTime = Math.max(0, duration - elapsedTime);
      
      if (remainingTime <= 0) {
        clearInterval(interval);
        this.countdownContainer.removeControl(countdownControl);
        delete this.activeCountdowns[id];
        
        if (onComplete) onComplete();
      } else {
        countdownText.text = `${text}: ${(remainingTime / 1000).toFixed(1)}s`;
        
        // Son 3 saniyede renk değişimi
        if (remainingTime < 3000) {
          countdownText.color = "red";
          countdownControl.color = "red";
        }
      }
    }, 100);
    
    this.activeCountdowns[id] = {
      control: countdownControl,
      interval: interval
    };
    
    return countdownControl;
  }
  
  // Durum bildirimi göster
  showStatus(id, text, color, duration = 3000) {

    const statusControl = new BABYLON.GUI.Rectangle();
    statusControl.width = "280px";
    statusControl.height = "60px";
    statusControl.cornerRadius = 10;
    statusControl.color = color;
    statusControl.thickness = 2;
    statusControl.background = "rgba(0, 0, 0, 0.5)";
    statusControl.alpha = 0;
    statusControl.name = id;
    
    const statusText = new BABYLON.GUI.TextBlock();
    statusText.text = text;
    statusText.color = color;
    statusText.fontSize = 36;
    statusText.fontFamily = "Rajdhani";
    
    statusControl.addControl(statusText);
    this.statusContainer.addControl(statusControl);
    
    // Giriş animasyonu
    let alpha = 0;
    const fadeIn = () => {
      alpha += 0.1;
      statusControl.alpha = alpha;
      
      if (alpha < 1) {
        requestAnimationFrame(fadeIn);
      } else {
        if (duration > 0) {
          setTimeout(() => {
            let fadeAlpha = 1;
            const fadeOut = () => {
              fadeAlpha -= 0.05;
              statusControl.alpha = fadeAlpha;
              
              if (fadeAlpha > 0) {
                requestAnimationFrame(fadeOut);
              } else {
                this.statusContainer.removeControl(statusControl);
              }
            };
            fadeOut();
          }, duration);
        }
      }
    };
    
    fadeIn();
    
    return statusControl;
  }
  
  // Özel başarı bildirimleri
showMexShot() {
  // Run tipine göre renk seç
  let color;
  switch(this.game.initialFace) {
    case 'solar':
      color = "#FFA500"; // Turuncu
      break;
    case 'em':
      color = "#00BFFF"; // Mavi
      break;
    case 'gravity':
      color = "#32CD32"; // Yeşil
      break;
    case 'dark':
      color = "#9932CC"; // Mor
      break;
    default:
      color = "#FFA500"; // Varsayılan turuncu
  }
  
  const notification = this.showNotification("MEX SHOT!", color, 1500);
  
  // Daha kalın yazı ve glow efekti
  notification.fontWeight = "bold";
  notification.shadowBlur = 10;
  notification.shadowColor = color;
  notification.shadowOffsetX = 0;
  notification.shadowOffsetY = 0;
  notification.outlineWidth = 3; // Daha kalın outline
  
  return notification;
}

showWexShot() {
  const color = "#00BFFF"; // WEX için mavi
  const notification = this.showNotification("WEX SHOT!", color, 1500);
  
  // Daha kalın yazı ve glow efekti
  notification.fontWeight = "bold";
  notification.shadowBlur = 10;
  notification.shadowColor = color;
  notification.shadowOffsetX = 0;
  notification.shadowOffsetY = 0;
  notification.outlineWidth = 3; // Daha kalın outline
  
  return notification;
}

  
showComboReady() {
  // 500ms gecikme ekleyerek "MEX/WEX Shot!" yazısının önce görünmesini sağla
  setTimeout(() => {
    this.showNotification("COMBO READY!", "#FFD700", 2000);
  }, 500);
}
  
  showPerfect() {
    const perfect = this.showNotification("PERFECT!", "#FF00FF", 2000);
    perfect.fontSize = 48; // Daha büyük font
    return perfect;
  }
  
  // Özel sayaçlar
  showSolarComboTimer(duration) {
    return this.showCountdown("solarCombo", "Solar Burst", "#FFA500", duration);
  }
  
  showEMShieldTimer(duration) {
    return this.showCountdown("emShield", "Shield", "#00BFFF", duration);
  }
  
  showGravityStunTimer(duration) {
    return this.showCountdown("gravityStun", "Time Freeze", "#32CD32", duration);
  }
  
  showDarkPortalsTimer(duration) {
    return this.showCountdown("darkPortals", "Portals", "#9932CC", duration);
  }
  
  showWexComboTimer(duration) {
    return this.showCountdown("wexCombo", "Ice Storm", "#00BFFF", duration);
  }
  
  // Özel durum bildirimleri
showModeSwitch(mode) {
  // Rengi belirle - MEX modunda run rengini, WEX modunda mavi rengi kullan
  let color;
  if (mode === "mex") {
    // Run tipine göre renk seç
    switch(this.game.initialFace) {
      case 'solar':
        color = "#FFA500"; // Turuncu
        break;
      case 'em':
        color = "#00BFFF"; // Mavi
        break;
      case 'gravity':
        color = "#32CD32"; // Yeşil
        break;
      case 'dark':
        color = "#9932CC"; // Mor
        break;
      default:
        color = "#FFA500"; // Varsayılan turuncu
    }
  } else {
    color = "#00BFFF"; // WEX modu için mavi
  }
  
  const text = mode === "mex" ? "MEX MODE" : "WEX MODE";
  return this.showStatus("modeSwitch", text, color);
}

  showEnergyDrained() {
    return this.showStatus("energyDrained", "ENERGY DRAINED!", "#FF0000", 2000);
  }
  
showEnergyGained() {
  return this.showStatus("energyGained", "ENERGY GAINED!", "#32CD32", 2000); // Yeşil renk
}
  showImmunityActive() {
    return this.showStatus("immunity", "SHIELD ACTIVE", "#00BFFF", 0); // Süresiz
  }
  
  hideImmunity() {
    // İlgili durum bildirimini kaldır
    const controls = this.statusContainer.children;
    for (let i = 0; i < controls.length; i++) {
      if (controls[i].name === "immunity") {
        this.statusContainer.removeControl(controls[i]);
        break;
      }
    }
  }
  
  // Tüm bildirimleri temizle
  clearAll() {
    // Tüm bildirimleri temizle
    while (this.activeNotifications.length > 0) {
      const notification = this.activeNotifications.pop();
      this.notificationContainer.removeControl(notification);
    }
    
    // Tüm sayaçları temizle
    for (const id in this.activeCountdowns) {
      clearInterval(this.activeCountdowns[id].interval);
      this.countdownContainer.removeControl(this.activeCountdowns[id].control);
    }
    this.activeCountdowns = {};
    
    // Tüm durum bildirimlerini temizle
    while (this.statusContainer.children.length > 0) {
      this.statusContainer.removeControl(this.statusContainer.children[0]);
    }
  }
}


class Game {
    constructor(initialFace, options = {}) {
      // Babylon.GUI tam ekran UI dokusu (1 kere)
      // this.gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

      // ——— UI Konfigürasyonu ———
      this.uiConfig = {
        distance: 4,        // Kamera-buton aralığı
        fire:   { radius:0.12, height:0.05, offsetX:-0.8, offsetY:0.8 },
        combo:  { radius:0.09, height:0.05, offsetX:0.77, offsetY:0.65 }
      };
      
      this.isPentaRun = options.isPentaRun || false;
      this.initialFace = initialFace || "solar"; // Default değer ekle
      this.currentMode = this.initialFace;
      this.fireHandler = FireHandlers[this.initialFace];

     this.gridMovementEnabled = true; // Kademeli hareket aktif/pasif
     this.gridMovementStep = 0.9; // Bir kule katmanının yüksekliği
     this.isMoving = false; // Hareket durumu
     this.targetY = 0; // Hedef Y pozisyonu
      
      // Canvas, engine ve sahne oluşturuluyor:
      this.canvas = document.getElementById("renderCanvas");
      this.engine = new BABYLON.Engine(this.canvas, true);
      this.scene = new BABYLON.Scene(this.engine);

      // --- Reticle Mesh (işaretçi) ---
      this.reticle = BABYLON.MeshBuilder.CreateDisc("reticle", {
        radius: 0.5, tessellation: 32
      }, this.scene);
      const retMat = new BABYLON.StandardMaterial("reticleMat", this.scene);
      retMat.diffuseColor = new BABYLON.Color3(1,1,1);
      retMat.emissiveColor = new BABYLON.Color3(1,1,1);
      retMat.disableLighting = true;
      this.reticle.material = retMat;
      this.reticle.isPickable = false;
      // ekle:
      this.reticle.rotation.x = Math.PI / 2;               // düz yüzey
      this.reticle.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL; // kameraya dönük
      this.reticle.position.y = 0.1;                      // hafif yerden yukarı

      this.scene.clearColor = new BABYLON.Color4(0.05, 0.05, 0.05, 1);
      
      // constructor'ın başında, this.scene tanımlandıktan sonra:
      this.worldRoot = new BABYLON.TransformNode("worldRoot", this.scene);

      // Cihaza göre ölçek (örnek: mobil için %80)
      const isMobile = window.innerWidth < 600;
      const rootScale = isMobile ? 0.8 : 1.0;
      this.worldRoot.scaling.set(rootScale, rootScale, rootScale);

      this.gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(
        "UI",        // benzersiz isim
        true,        // foreground
        this.scene   // mutlaka scene referansı verilmeli
      );

this.hud = new GameHUD(this);



// Game sınıfı içinde, constructor'da:
this.joystickController = new Joystick3DController(this.scene, (xVel, zVel) => {
    // Goldberg'in pozisyonunu güncelle
    if (this.goldberg) {
        // Delta time kullan
        const deltaTime = 0.07;
        
        // Oyun alanı sınırlarını hesapla
        const totalGridWidth = this.gridCols * this.hexHorizSpacing;
        const maxX = (totalGridWidth / 2) - 5;
        const minX = -maxX;
        const maxZ = 12.5;
        const minZ = 2.5;
        
        // Hareket alanı genişliği
        const movementRangeX = maxX - minX;
        const movementRangeZ = maxZ - minZ;
        
        // Joystick değerlerini hareket alanına orantıla
        const scaledX = xVel * movementRangeX * 0.4;
        const scaledZ = zVel * movementRangeZ * 0.2;
        
        // Hareketi uygula
        this.goldberg.position.x -= scaledX * deltaTime;
        this.goldberg.position.z += scaledZ * deltaTime;
        
        // Sınırları kontrol et
        this.goldberg.position.x = Math.min(Math.max(this.goldberg.position.x, minX), maxX);
        this.goldberg.position.z = Math.min(Math.max(this.goldberg.position.z, minZ), maxZ);
        
        // Kamerayı takip ettir
        if (this.camera) {
            this.camera.position.x = this.goldberg.position.x;
        }
    }
});





this.actionButtonsController = new ActionButtonsController(
    this.scene,
    () => this.fireProjectile(),
    () => {
        if (this.comboMode) {
            this.fireHandler.combo(this);
            this.updateComboButtonState(false);
        }
    }
);

// Flip callback'i ayrıca ayarlayın
this.actionButtonsController.setFlipCallback(() => {
  // Flip işlemi burada
  if (this.currentMode === "mex") {
    this.currentMode = "wex";
    this.fireHandler = FireHandlers.wex;
    this.goldberg.material.diffuseColor = new BABYLON.Color3(0.6, 0.8, 1);
    
    // Yeni: Mod değişimi bildirimi
    if (this.hud) {
      this.hud.showModeSwitch("wex");
    }
  } else {
    this.currentMode = "mex";
    this.fireHandler = FireHandlers[this.initialFace];
    this.goldberg.material.diffuseColor = this.faceColor.clone();
    
    // Yeni: Mod değişimi bildirimi
    if (this.hud) {
      this.hud.showModeSwitch("mex");
    }
  }
    
    // Animasyon ekleyebilirsiniz
  const currentRotationY = this.goldberg.rotation.y;
  const targetRotationY = this.baseRotation + (this.currentMode === "wex" ? Math.PI : 0);
  
  const flipAnim = new BABYLON.Animation(
    "flipAnim", 
    "rotation.y", 
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );
  
  flipAnim.setKeys([
    { frame: 0, value: currentRotationY },
    { frame: 30, value: targetRotationY }
  ]);
  
  this.goldberg.animations = [flipAnim];
  this.scene.beginAnimation(this.goldberg, 0, 30, false);
});


      this.wexComboActive = false;
      this.wexComboTimer  = 0;
      this.wexComboMesh   = null;
      this.wexComboShootTimer = 0; // otomatik atış için sayaç

      this.emRelicHitTowers = new Set(); // 3 farklı relic tower'a isabeti takip için
      this.emComboReady = false;

      // Glow layer ekleniyor
      this.glowLayer = new BABYLON.GlowLayer("glow", this.scene);
      this.glowLayer.intensity = 0.6;
      this.glowLayer.separateCullingPass = true;

      // Oyun parametreleri
      this.gameTime = 0;
      this.baseTileSpeed = 0;
      this.tileSpawnTimer = 0;
      this.tileSpawnInterval = 4;
      this.towers = [];        // Kuleleri tutacak
      this.baseTiles = [];     // Zemin altıgenleri
      this.tileTowers = [];    // Işık hüzmesi (light tower) objeleri
      this.projectiles = [];   // Ateşlenen mermiler
      this.activeWingTiles = []; // Kullanılabilir wing tile'lar
      this.usedWingTiles = [];   // Şarjı bitmiş wing tile'lar
      this.maxTowers = 75;      // run başına izin verilen toplam kule sayısı
      this.spawnedTowers = 0;   // şu ana kadar spawn olmuş kule sayısı
      
      // Grid parametreleri
      this.gridRadius = 0.9;
      this.gridRows = 50;
      this.gridCols = 20;
      this.hexVertSpacing = 0;
      this.hexHorizSpacing = 0;

      // Mod ve dönüş parametreleri
      this.currentMode = "mex";
      this.baseRotation = 0;
      this.flipOffset = 0;
      this.lastFireTime = 0;
      this.fireCooldown = 0.3;
      this.lastLightTime = 0;

      // Game sınıfına immunity durumunu ekleyelim
      this.isImmune = false;
      this.immunityEndTime = 0;

      // Kaç kule oluşturunca run bitecek:
      this.minRunTowers    = 75;
      this.maxRunTowers    = 100;
      this.disposedTowers  = 0;          // kaç tane kule yıkıldı / despawn oldu
      this.targetTowers    = Math.floor(
        Math.random() * (this.maxRunTowers - this.minRunTowers + 1) + this.minRunTowers
      );

      // Materyallerin oluşturulması
      this.createMaterials();
    
      if (this.currentMode === "wex") {
        this.goldbergMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.8, 1); // buz-mavisi
        this.faceColor = this.goldbergMaterial.diffuseColor.clone();
        this.fireHandler = FireHandlers.wex;
      } else if (this.currentMode === "hexcraft") {
        this.goldbergMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.8, 1); // hexcraft rengi
        this.faceColor = this.goldbergMaterial.diffuseColor.clone();
        this.fireHandler = FireHandlers.hexcraft; // hexcraft handler'ı ata
      } else {
        // Seçilen face tipine göre Goldberg'in rengini ayarla
        switch(this.initialFace) {
          case 'solar':
            this.goldbergMaterial.diffuseColor = new BABYLON.Color3(1, 0.6, 0);
            break;
          case 'em':
            this.goldbergMaterial.diffuseColor = new BABYLON.Color3(0, 0.6, 1);
            break;
          case 'gravity':
            this.goldbergMaterial.diffuseColor = new BABYLON.Color3(0.2, 1, 0.2);
            break;
          case 'dark':
            this.goldbergMaterial.diffuseColor = new BABYLON.Color3(0.5, 0, 0.5);
            break;
        }
        this.fireHandler = FireHandlers[this.initialFace];
      }
      this.faceColor = this.goldbergMaterial.diffuseColor.clone();
      
      // Kamera ve ışık ayarları
      this.setupCameraAndLight();

const originalCameraPos = this.camera.position.clone();
const originalCameraTarget = this.camera.getTarget().clone();
const originalCameraFov = this.camera.fov;

// Arka planı oluştur
this.createSpaceBackground();

// Kamera ayarlarını geri yükle
this.camera.position = originalCameraPos;
this.camera.setTarget(originalCameraTarget);
this.camera.fov = originalCameraFov;
 
      this.createSpaceBackground(); 

      // Zemin grid'inin oluşturulması
      this.createHexGrid(this.gridRows, this.gridCols, this.gridRadius);
      
      // Goldberg mesh ve wing grid oluşturuluyor.
      this.createGoldberg();
      this.createWingGrid();


     
      // Fire ve Combo buton materyalleri
      this.fireMat = new BABYLON.StandardMaterial("fireBtnMat", this.scene);
      this.fireMat.emissiveColor = this.faceColor.clone();
      this.fireMat.diffuseColor   = this.faceColor.clone();

      this.comboMat = new BABYLON.StandardMaterial("comboBtnMat", this.scene);
      this.comboMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      this.comboMat.diffuseColor   = new BABYLON.Color3(0.2, 0.2, 0.2);

      // Kullanıcı girişlerinin (input) ayarlanması
      this.setupInput();
      this.elapsedTime = 0;  
      this.timerElem    = document.getElementById("timer");
      
      // GUI oluştur - joystickController ve actionButtonsController oluşturulduktan sonra
      this.createGUI(); 
      
      this.engine.runRenderLoop(() => this.updateAndRender());

      // constructor içi, this.timerElem satırından hemen sonra:
      this.spawnedElem  = document.getElementById("spawnedCount");
      this.hitElem      = document.getElementById("hitCount");
      this.hitCount     = 0;

      // Başlangıçta iki sayaçı da güncelle
      this.spawnedElem.textContent = `Spawned: ${this.spawnedTowers}`;
      this.hitElem.textContent     = `Hits: ${this.hitCount}`;

      // ——— Relic Tower için sayaç ve timer
      this.relicSpawnTimer     = 0;
      this.relicSpawnInterval  = 4;   // her 4 sn'de bir
      this.relicSpawnStartTime = 15;  // run başladıktan 15 sn sonra
      this.relicTowers         = [];  // spawn edilen relic tower düğümleri
      this.drops               = [];  // düşen fragment/relic objeleri
      this.dropCount           = 0;
      this.dropElem            = document.getElementById("dropCount");

      // ——— Tower spawn sınırları ———
      this.spawnMinCol = 3;
      this.spawnMaxCol = this.gridCols - 4;
      this.spawnMinRow = Math.floor(this.gridRows * 0.6);
      this.spawnMaxRow = this.gridRows - 1;

      this.relicHitCount = 0;
      this.projectileHitRadius = 2.0;
      this.fixedAimingDistance = 15;
      this.darkSingleHitCount = 0;

      if (this.hud) {
  this.hud.showModeSwitch(this.currentMode);
}

      // resize olayını dinle
      window.addEventListener("resize", () => {
          this.engine.resize();
      });
    }

cleanupAllMeshes() {
  // 1. Tüm relic tower'ları kontrol et
  for (let i = this.relicTowers.length - 1; i >= 0; i--) {
    const rt = this.relicTowers[i];
    
    // Tower null veya dispose edilmişse diziden çıkar
    if (!rt || rt.isDisposed()) {
      this.relicTowers.splice(i, 1);
      continue;
    }
    
    // Tower'ın tüm segmentlerini kontrol et
    const segments = rt.getChildren().filter(s => s instanceof BABYLON.Mesh);
    
    // Eğer segment kalmadıysa tower'ı temizle
    if (segments.length === 0) {
      // Tower'ın baseTile referansını temizle
      if (rt.baseTile) {
        rt.baseTile.relicTower = null;
      }
      
      // Tower'ı diziden çıkar
      this.relicTowers.splice(i, 1);
      
      // Tower'ı temizle
      rt.dispose();
    }
  }
  
  // 2. Tüm hex grid'i kontrol et ve artık kalmış relic tower parçalarını temizle
  this.baseTiles.forEach(tile => {
    if (tile.relicTower && (!tile.relicTower.parent || tile.relicTower.isDisposed())) {
      tile.relicTower = null;
    }
  });
  
  // 3. Scene'deki tüm mesh'leri kontrol et
  const meshesToRemove = [];
  
  this.scene.meshes.forEach(mesh => {
    // Eğer mesh bir segment veya tile ise ve parent'ı yoksa veya parent'ı dispose edilmişse
    if (mesh && (
      (mesh.name && (mesh.name.includes("segment") || mesh.name.includes("tile") || mesh.name.includes("relic"))) &&
      (!mesh.parent || mesh.parent.isDisposed())
    )) {
      meshesToRemove.push(mesh);
    }
  });
  
  // Tespit edilen mesh'leri temizle
  meshesToRemove.forEach(mesh => {
    if (mesh && !mesh.isDisposed()) {
      mesh.dispose();
    }
  });
  
  // 4. Sahipsiz particle sistemlerini temizle
  const particlesToRemove = [];
  
  this.scene.particleSystems.forEach(ps => {
    if (ps && (!ps.emitter || (ps.emitter instanceof BABYLON.AbstractMesh && ps.emitter.isDisposed()))) {
      particlesToRemove.push(ps);
    }
  });
  
  particlesToRemove.forEach(ps => {
    if (ps) {
      ps.dispose();
    }
  });
}
// Game sınıfına eklenecek
createPositionIndicators() {
    if (!this.positionGUI) {
        this.positionGUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("positionUI", true, this.scene);
    }

    // Sadece Z-ekseni indikatörü (sağ kenardaki)
    this.zIndicator = new BABYLON.GUI.Rectangle("zIndicator");
    this.zIndicator.width = "15px";
    this.zIndicator.height = "30px";
    this.zIndicator.cornerRadius = 3;
    this.zIndicator.color = "white";
    this.zIndicator.thickness = 2;
    
    // faceColor'ı güvenli bir şekilde kullan
    if (this.faceColor) {
        // Color3 nesnesini hex string'e çevirme
        const r = Math.floor(this.faceColor.r * 255).toString(16).padStart(2, '0');
        const g = Math.floor(this.faceColor.g * 255).toString(16).padStart(2, '0');
        const b = Math.floor(this.faceColor.b * 255).toString(16).padStart(2, '0');
        this.zIndicator.background = `#${r}${g}${b}`;
    } else {
        // Varsayılan renk
        this.zIndicator.background = "#00BFFF"; // Açık mavi
    }
    
    this.zIndicator.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.zIndicator.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    this.zIndicator.left = "-10px";
    this.zIndicator.zIndex = 1000;
    this.positionGUI.addControl(this.zIndicator);
}


flipBoard() {
    this.isFlipped = !this.isFlipped;
    const boardElement = document.getElementById('board');
    
    if (this.isFlipped) {
        boardElement.classList.add('flipped');
    } else {
        boardElement.classList.remove('flipped');
    }
}

// update() metoduna eklenecek
updatePositionIndicators() {
    if (!this.zIndicator || !this.goldberg) return;

    // Oyun alanı sınırlarını hesapla
    const maxZ = 12.5;
    const minZ = 2.5;

    // Z pozisyonunu 0-1 arasına normalize et
    const normalizedZ = (this.goldberg.position.z - minZ) / (maxZ - minZ);
    
    // Sınırları kontrol et (0-1 arasında olmasını sağla)
    const clampedNormalizedZ = Math.max(0, Math.min(1, normalizedZ));

    // Ekran boyutlarını al
    const screenHeight = this.engine.getRenderHeight();
    const screenWidth = this.engine.getRenderWidth();

    // Z indikatörünün boyutlarını al
    const zIndicatorHeight = parseFloat(this.zIndicator.height.toString().replace("px", "")) || 30;
    
    // Marjinleri ayarla
    const topMargin = 50; // Üstten 50px boşluk
    const bottomMargin = 50; // Alttan 50px boşluk
    
    // Kullanılabilir yükseklik
    const availableHeight = screenHeight - topMargin - bottomMargin - zIndicatorHeight;
    
    // İndikatörün üst pozisyonunu hesapla
    let zPos = ((1 - clampedNormalizedZ) * availableHeight) + topMargin;
    
    // Ekranın dışına çıkmamasını sağla
    zPos = Math.max(topMargin, Math.min(screenHeight - bottomMargin - zIndicatorHeight, zPos));
    
    // Z indikatörünün pozisyonunu güncelle
    this.zIndicator.topInPixels = zPos;

}



// update() metoduna eklenecek
updateAimingSystem() {
    // Nişangah pozisyonunu güncelle
    const ray = this.scene.createPickingRay(
        this.scene.pointerX,
        this.scene.pointerY,
        BABYLON.Matrix.Identity(),
        this.camera
    );
    
    const hit = this.scene.pickWithRay(ray);
    
    if (hit.hit) {
        this.reticle.position = hit.pickedPoint.clone();
        this.reticle.position.y += 0.1;
        
        // Yörünge çizgisini güncelle
        if (this.goldberg) {
            const direction = hit.pickedPoint.subtract(this.goldberg.position).normalize();
            const points = [];
            const startPos = this.goldberg.position.clone();
            startPos.y += 1; // Goldberg'in üstünden başla
            
            for (let i = 0; i < 20; i++) {
                points.push(startPos.add(direction.scale(i * 0.5)));
            }
            
            this.trajectoryLine = BABYLON.MeshBuilder.CreateLines("trajectoryLine", {
                points: points,
                instance: this.trajectoryLine
            }, this.scene);
            this.trajectoryLine.isVisible = true;
        }
        
        // Hedef vurgulaması
        const closestTower = this.findClosestTowerToPoint(hit.pickedPoint);
        if (closestTower && BABYLON.Vector3.Distance(hit.pickedPoint, closestTower.position) < 2) {
            this.targetHighlight.position = closestTower.position.clone();
            this.targetHighlight.position.y = hit.pickedPoint.y + 0.05;
            this.targetHighlight.isVisible = true;
            
            // Pulse animasyonu
            if (!this._pulseAnimation) {
                this._pulseAnimation = true;
                let scale = 1;
                const pulseAnim = () => {
                    scale = 1 + 0.2 * Math.sin(performance.now() * 0.005);
                    this.targetHighlight.scaling.setAll(scale);
                    
                    if (this._pulseAnimation) {
                        requestAnimationFrame(pulseAnim);
                    }
                };
                pulseAnim();
            }
        } else {
            this.targetHighlight.isVisible = false;
            this._pulseAnimation = false;
        }
    } else {
        this.trajectoryLine.isVisible = false;
        this.targetHighlight.isVisible = false;
        this._pulseAnimation = false;
    }
}

// Yardımcı fonksiyon
findClosestTowerToPoint(point) {
    let closestTower = null;
    let minDistance = Infinity;
    
    // Normal kuleleri kontrol et
    for (const tower of this.towers) {
        const distance = BABYLON.Vector3.Distance(point, tower.position);
        if (distance < minDistance) {
            minDistance = distance;
            closestTower = tower;
        }
    }
    
    // Relic kuleleri kontrol et
    for (const tower of this.relicTowers) {
        const distance = BABYLON.Vector3.Distance(point, tower.position);
        if (distance < minDistance) {
            minDistance = distance;
            closestTower = tower;
        }
    }
    
    return closestTower;
}



updateAndRender() {
    this.update();
    this.scene.render();
  }


    createMaterials() {
this.baseMaterial = new BABYLON.PBRMaterial("shinyStoneMat", this.scene);
this.baseMaterial.albedoColor = new BABYLON.Color3(0.15, 0.18, 0.22); // Koyu arduvaz rengi
this.baseMaterial.metallic = 0.2; // Hafif metalik yansıma
this.baseMaterial.roughness = 0.5; // Ne çok parlak, ne çok mat
      // Global zemin materyali:
      this.baseMaterial = new BABYLON.StandardMaterial("hexMat", this.scene);
      this.baseMaterial.diffuseColor = new BABYLON.Color3(0.25, 0.25, 0.25);

      // Kırmızı ve mavi tile materyalleri:
      this.redTileMaterial = new BABYLON.StandardMaterial("redTileMat", this.scene);
      this.redTileMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
      this.blueTileMaterial = new BABYLON.StandardMaterial("blueTileMat", this.scene);
      this.blueTileMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);

      // Wing tile materyali:
      this.wingMaterial = new BABYLON.StandardMaterial("wingMat", this.scene);
      this.wingMaterial.diffuseColor = new BABYLON.Color3(0.6, 0.8, 1);

      // Goldberg’in başlangıç materyali (mex modu için turuncu)
      this.goldbergMaterial = new BABYLON.StandardMaterial("goldbergMat", this.scene);
      this.goldbergMaterial.diffuseColor = new BABYLON.Color3(1, 0.4, 0.2);
      
    }

setupCameraAndLight() {
  // Kamera
  this.camera = new BABYLON.FreeCamera("cam",
    new BABYLON.Vector3(0, -50, 25), this.scene);
  this.camera.setTarget(BABYLON.Vector3.Zero());

  // Ana hemisferik ışık - yukarıdan gelen yumuşak ışık
  this.light = new BABYLON.HemisphericLight("mainLight",
    new BABYLON.Vector3(1, 1.5, 3), this.scene);
  this.light.intensity = 0.7; // Daha düşük yoğunluk
  this.light.diffuse = new BABYLON.Color3(0.7, 0.7, 0.9); // Hafif mavimsi
  this.light.specular = new BABYLON.Color3(1, 1, 1);
  
  // Yan ışık - dramatik gölgeler için
  const sideLight = new BABYLON.DirectionalLight("sideLight", 
    new BABYLON.Vector3(1, -0.5, -0.5), this.scene);
  sideLight.intensity = 0.4;
  sideLight.diffuse = new BABYLON.Color3(1, 0.7, 0.3); // Turuncu ton

  // Ortam ışığı - tüm sahneye hafif bir parlaklık ekler
  const ambientLight = new BABYLON.HemisphericLight("ambientLight", 
    new BABYLON.Vector3(0, 4, 1), this.scene);
  ambientLight.intensity = 0.8; // Düşük yoğunluk
  ambientLight.diffuse = new BABYLON.Color3(0.2, 0.2, 0.3); // Koyu mavi-mor ton
  ambientLight.groundColor = new BABYLON.Color3(0.1, 0.1, 0.15); // Daha koyu zemin rengi
  ambientLight.specular = new BABYLON.Color3(0, 0, 0); // Speküler yansıma yok
  
  // Hafif mavi dolgu ışığı
  const fillLight = new BABYLON.DirectionalLight("fillLight", 
    new BABYLON.Vector3(-1, -0.2, -0.2), this.scene);
  fillLight.intensity = 0.2;
  fillLight.diffuse = new BABYLON.Color3(0.4, 0.6, 1); // Mavi ton
  
  // Sahne arka plan rengi - çok koyu
  this.scene.clearColor = new BABYLON.Color4(0.02, 0.02, 0.05, 1);
  
  // Glow efekti ayarları
  if (this.glowLayer) {
    this.glowLayer.intensity = 0.8;
  }
}

createSpaceBackground() {
    // Kamera ayarlarını yedekle
    const originalCameraPos = this.camera.position.clone();
    const originalCameraTarget = this.camera.getTarget().clone();
    const originalCameraFov = this.camera.fov;
    
    // 1. Uzay kubbesi (skybox) oluştur
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size: 1000.0}, this.scene);
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMaterial", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skyboxMaterial.emissiveColor = new BABYLON.Color3(0.02, 0.02, 0.05); // Çok koyu mavi-mor
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;
    skybox.renderingGroupId = 0; // En arkada render edilsin

    // 2. Yıldız alanı (starfield) - uzak yıldızlar
    const starfield = new BABYLON.ParticleSystem("starfield", 5000, this.scene);
    starfield.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
    starfield.emitter = new BABYLON.Vector3(0, 0, 0); // Merkez noktada
    starfield.minEmitBox = new BABYLON.Vector3(-500, -500, -500);
    starfield.maxEmitBox = new BABYLON.Vector3(500, 500, 500);
    
    // Farklı yıldız renkleri ve boyutları
    starfield.addColorGradient(0, new BABYLON.Color4(0.8, 0.8, 1.0, 1.0)); // Mavi-beyaz
    starfield.addColorGradient(0.25, new BABYLON.Color4(1.0, 1.0, 1.0, 1.0)); // Beyaz
    starfield.addColorGradient(0.5, new BABYLON.Color4(1.0, 0.9, 0.7, 1.0)); // Sarımsı
    starfield.addColorGradient(0.75, new BABYLON.Color4(1.0, 0.6, 0.6, 1.0)); // Kırmızımsı
    starfield.addColorGradient(1.0, new BABYLON.Color4(0.6, 0.6, 1.0, 1.0)); // Mavimsi
    
    starfield.minSize = 0.1;
    starfield.maxSize = 0.5;
    starfield.minLifeTime = Infinity; // Yıldızlar sonsuza kadar yaşar
    starfield.maxLifeTime = Infinity;
    starfield.emitRate = 0; // Başlangıçta hepsini bir kerede oluştur
    starfield.manualEmitCount = 5000;
    starfield.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    starfield.gravity = new BABYLON.Vector3(0, 0, 0);
    starfield.start();

    // Yıldızların kamerayı takip etmesi - kamera pozisyonunu değiştirmeden
    const originalCameraPos2 = this.camera.position.clone();
    this.scene.registerBeforeRender(() => {
        starfield.emitter.copyFrom(this.camera.position);
    });

    // 3. Nebula efektleri - renkli gaz bulutları
    this.createNebulaEffects();

    // 4. Parlayan yıldızlar - daha büyük ve parlak (lens flare olmadan)
    this.createSimpleBrightStars();

    // 5. Uzak galaksiler - disk şeklinde bulanık nesneler
    this.createDistantGalaxies();
    
    // Kamera ayarlarını geri yükle
    this.camera.position = originalCameraPos;
    this.camera.setTarget(originalCameraTarget);
    this.camera.fov = originalCameraFov;
}

createSimpleBrightStars() {
    // 20-30 parlak yıldız
    for (let i = 0; i < 25; i++) {
        // Parlak yıldız için bir ışık
        const starLight = new BABYLON.PointLight(`brightStar${i}`, BABYLON.Vector3.Zero(), this.scene);
        
        // Rastgele renk - beyaz, mavi, sarı veya kırmızı tonları
        const colorChoice = Math.random();
        if (colorChoice < 0.4) {
            starLight.diffuse = new BABYLON.Color3(1, 1, 1); // Beyaz
        } else if (colorChoice < 0.7) {
            starLight.diffuse = new BABYLON.Color3(0.7, 0.8, 1); // Mavi
        } else if (colorChoice < 0.9) {
            starLight.diffuse = new BABYLON.Color3(1, 0.9, 0.7); // Sarı
        } else {
            starLight.diffuse = new BABYLON.Color3(1, 0.6, 0.6); // Kırmızı
        }
        
        // Rastgele konum - kameradan uzakta
        const distance = 300 + Math.random() * 200;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        starLight.position = new BABYLON.Vector3(
            distance * Math.sin(phi) * Math.cos(theta),
            distance * Math.sin(phi) * Math.sin(theta),
            distance * Math.cos(phi)
        );
        
        // Düşük yoğunluk ve sınırlı menzil
        starLight.intensity = 0.2 + Math.random() * 0.2; // Çok düşük yoğunluk
        starLight.range = 50; // Daha kısa menzil
        
        // Yanıp sönme efekti
        const pulseSpeed = 0.2 + Math.random() * 0.3;
        const pulseAmplitude = 0.05 + Math.random() * 0.1; // Çok az yanıp sönme
        const baseIntensity = starLight.intensity;
        
        this.scene.registerBeforeRender(() => {
            starLight.intensity = baseIntensity + Math.sin(this.scene.getAnimationRatio() * pulseSpeed) * pulseAmplitude;
        });
        
        // Yıldız görselini temsil eden küre
        const starSphere = BABYLON.MeshBuilder.CreateSphere(`starSphere${i}`, {
            diameter: 2 + Math.random() * 3,
            segments: 8
        }, this.scene);
        
        starSphere.position = starLight.position.clone();
        
        const starMat = new BABYLON.StandardMaterial(`starMat${i}`, this.scene);
        starMat.emissiveColor = starLight.diffuse.clone();
        starMat.disableLighting = true;
        starSphere.material = starMat;
        starSphere.renderingGroupId = 0; // Arka planda render edilsin
    }
}

createNebulaEffects() {
    // Farklı renklerde 3-4 nebula oluştur
    const nebulaColors = [
        new BABYLON.Color4(0.5, 0.2, 0.8, 0.05), // Mor
        new BABYLON.Color4(0.2, 0.4, 0.8, 0.05), // Mavi
        new BABYLON.Color4(0.8, 0.2, 0.5, 0.05), // Pembe
        new BABYLON.Color4(0.1, 0.6, 0.6, 0.05)  // Turkuaz
    ];

    nebulaColors.forEach((color, index) => {
        // Her nebula için bir particle sistemi
        const nebula = new BABYLON.ParticleSystem(`nebula${index}`, 500, this.scene);
        nebula.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
        
        // Rastgele bir konumda
        const offset = 200;
        const position = new BABYLON.Vector3(
            (Math.random() - 0.5) * offset,
            (Math.random() - 0.5) * offset,
            (Math.random() - 0.5) * offset
        );
        nebula.emitter = position;
        
        // Geniş bir alanda yayılmış
        const size = 50 + Math.random() * 100;
        nebula.minEmitBox = new BABYLON.Vector3(-size, -size, -size);
        nebula.maxEmitBox = new BABYLON.Vector3(size, size, size);
        
        // Renk ve boyut
        nebula.color1 = color;
        nebula.color2 = color;
        nebula.colorDead = new BABYLON.Color4(color.r, color.g, color.b, 0);
        
        nebula.minSize = 10;
        nebula.maxSize = 30;
        
        // Çok yavaş hareket eden ve uzun ömürlü
        nebula.minLifeTime = 30;
        nebula.maxLifeTime = 60;
        nebula.emitRate = 50;
        
        // Çok yavaş hareket
        nebula.minEmitPower = 0.1;
        nebula.maxEmitPower = 0.3;
        
        // Parçacıklar birbirine karışsın
        nebula.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
        
        nebula.start();
        
        // Nebula'nın yavaşça dönmesi
        const rotationSpeed = (Math.random() - 0.5) * 0.01;
        this.scene.registerBeforeRender(() => {
            nebula.emitter.addInPlace(new BABYLON.Vector3(
                Math.sin(this.scene.getAnimationRatio() * rotationSpeed) * 0.1,
                Math.cos(this.scene.getAnimationRatio() * rotationSpeed) * 0.1,
                Math.sin(this.scene.getAnimationRatio() * rotationSpeed * 0.7) * 0.1
            ));
        });
    });
}

createBrightStars() {
    // 20-30 parlak yıldız
    for (let i = 0; i < 25; i++) {
        // Parlak yıldız için bir ışık
        const starLight = new BABYLON.PointLight(`brightStar${i}`, BABYLON.Vector3.Zero(), this.scene);
        
        // Rastgele renk - beyaz, mavi, sarı veya kırmızı tonları
        const colorChoice = Math.random();
        if (colorChoice < 0.4) {
            starLight.diffuse = new BABYLON.Color3(1, 1, 1); // Beyaz
        } else if (colorChoice < 0.7) {
            starLight.diffuse = new BABYLON.Color3(0.7, 0.8, 1); // Mavi
        } else if (colorChoice < 0.9) {
            starLight.diffuse = new BABYLON.Color3(1, 0.9, 0.7); // Sarı
        } else {
            starLight.diffuse = new BABYLON.Color3(1, 0.6, 0.6); // Kırmızı
        }
        
        // Rastgele konum - kameradan uzakta
        const distance = 300 + Math.random() * 200;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        starLight.position = new BABYLON.Vector3(
            distance * Math.sin(phi) * Math.cos(theta),
            distance * Math.sin(phi) * Math.sin(theta),
            distance * Math.cos(phi)
        );
        
        // Düşük yoğunluk ve sınırlı menzil
        starLight.intensity = 0.5 + Math.random() * 0.5;
        starLight.range = 100;
        
        // Yanıp sönme efekti
        const pulseSpeed = 0.2 + Math.random() * 0.3;
        const pulseAmplitude = 0.2 + Math.random() * 0.3;
        const baseIntensity = starLight.intensity;
        
        this.scene.registerBeforeRender(() => {
            starLight.intensity = baseIntensity + Math.sin(this.scene.getAnimationRatio() * pulseSpeed) * pulseAmplitude;
        });
        
        // Yıldız parlaması için lens flare efekti
        const flareUrl = "https://playground.babylonjs.com/textures/flare.png"; // URL'yi bir değişkene aldık
        const lensFlareSystem = new BABYLON.LensFlareSystem("lensFlareSystem", starLight, this.scene);
        
        // DÜZELTME: 4. parametre olarak nesne yerine URL string'i veriyoruz
        const mainFlare = new BABYLON.LensFlare(0.4, 0, starLight.diffuse, flareUrl, lensFlareSystem);
        const secondaryFlare = new BABYLON.LensFlare(0.2, 0.2, starLight.diffuse, flareUrl, lensFlareSystem);
        const tertiaryFlare = new BABYLON.LensFlare(0.1, -0.3, starLight.diffuse, flareUrl, lensFlareSystem);
    }
}


createShootingStars() {
    // Düzenli aralıklarla yıldız kayması oluştur
    this.scene.onBeforeRenderObservable.add(() => {
        // Ortalama her 5 saniyede bir
        if (Math.random() < 0.005) {
            this.createShootingStar();
        }
    });
}

createShootingStar() {
    // Kameranın görüş alanında rastgele bir başlangıç noktası
    const startPos = new BABYLON.Vector3(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
    );
    startPos.addInPlace(this.camera.position);
    
    // Rastgele bir yön - genellikle aşağı doğru
    const direction = new BABYLON.Vector3(
        (Math.random() - 0.5) * 2,
        -1 - Math.random(),
        (Math.random() - 0.5) * 2
    ).normalize();
    
    // Yıldız kayması için particle sistemi
    const shootingStar = new BABYLON.ParticleSystem("shootingStar", 300, this.scene);
    shootingStar.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
    shootingStar.emitter = startPos;
    shootingStar.minEmitBox = new BABYLON.Vector3(0, 0, 0);
    shootingStar.maxEmitBox = new BABYLON.Vector3(0, 0, 0);
    
    // Beyaz-mavi renk
    shootingStar.color1 = new BABYLON.Color4(1, 1, 1, 1);
    shootingStar.color2 = new BABYLON.Color4(0.8, 0.9, 1, 1);
    shootingStar.colorDead = new BABYLON.Color4(0.5, 0.7, 1, 0);
    
    // Boyut ve ömür
    shootingStar.minSize = 0.3;
    shootingStar.maxSize = 0.7;
    shootingStar.minLifeTime = 0.2;
    shootingStar.maxLifeTime = 0.5;
    
    // Hız ve yön
    shootingStar.direction1 = direction.scale(0.9);
    shootingStar.direction2 = direction.scale(1.1);
    shootingStar.minEmitPower = 30;
    shootingStar.maxEmitPower = 50;
    
    // Parlaklık
    shootingStar.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    
    // Kısa süreli çalıştır
    shootingStar.targetStopDuration = 0.5;
    shootingStar.disposeOnStop = true;
    shootingStar.start();
}

createDistantGalaxies() {
    // 5-10 uzak galaksi
    for (let i = 0; i < 8; i++) {
        // Galaksi için disk şeklinde mesh
        const galaxy = BABYLON.MeshBuilder.CreateDisc(`galaxy${i}`, {
            radius: 20 + Math.random() * 30,
            tessellation: 64
        }, this.scene);
        
        // Rastgele konum - çok uzakta
        const distance = 400 + Math.random() * 300;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        galaxy.position = new BABYLON.Vector3(
            distance * Math.sin(phi) * Math.cos(theta),
            distance * Math.sin(phi) * Math.sin(theta),
            distance * Math.cos(phi)
        );
        
        // Rastgele döndür
        galaxy.rotation = new BABYLON.Vector3(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        // Yarı saydam materyal
        const galaxyMaterial = new BABYLON.StandardMaterial(`galaxyMat${i}`, this.scene);
        
        // Galaksi rengi - mavi, mor, pembe veya sarı tonları
        const colorChoice = Math.random();
        if (colorChoice < 0.25) {
            galaxyMaterial.emissiveColor = new BABYLON.Color3(0.2, 0.3, 0.8); // Mavi
        } else if (colorChoice < 0.5) {
            galaxyMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.2, 0.8); // Mor
        } else if (colorChoice < 0.75) {
            galaxyMaterial.emissiveColor = new BABYLON.Color3(0.8, 0.3, 0.5); // Pembe
        } else {
            galaxyMaterial.emissiveColor = new BABYLON.Color3(0.8, 0.7, 0.3); // Sarı
        }
        
        galaxyMaterial.diffuseColor = galaxyMaterial.emissiveColor.clone();
        galaxyMaterial.alpha = 0.3;
        galaxyMaterial.disableLighting = true;
        galaxyMaterial.backFaceCulling = false;
        galaxy.material = galaxyMaterial;
        
        // Yavaş dönüş animasyonu
        const rotationSpeed = (Math.random() - 0.5) * 0.0005;
        this.scene.registerBeforeRender(() => {
            galaxy.rotation.z += rotationSpeed;
        });
    }
}


    createHexTile(radius, material, height = 1.0) {
      const hex = BABYLON.MeshBuilder.CreateCylinder("hex", {
        diameterTop: radius * 2,
        diameterBottom: radius * 2,
        height: height,
        tessellation: 6
      }, this.scene);
      hex.material = material;
      hex.rotation.x = Math.PI / 2;
      return hex;
    }

createHexGrid(rows, cols, radius) {
  const hexHeight = Math.sqrt(3) * radius;
  const spacingFactor = 1.15;
  this.hexVertSpacing = hexHeight * spacingFactor;
  this.hexHorizSpacing = 1.5 * radius * spacingFactor;

  // Altıgen grid'in toplam genişliği
  const totalGridWidth = cols * this.hexHorizSpacing;
  
  // Merkez offset hesaplama - altıgen grid için düzeltme
  const centerOffset = totalGridWidth / 2;

  // Create the base tile mesh (only once):
  const baseTileMesh = this.createHexTile(radius, this.baseMaterial);
  baseTileMesh.isVisible = false; // Hide the original mesh

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * this.hexHorizSpacing;
      const y = row * this.hexVertSpacing + (col % 2 === 0 ? 0 : this.hexVertSpacing / 2);

      // Create an instance of the base tile mesh:
      const hexInstance = baseTileMesh.createInstance("hexInstance_" + row + "_" + col);
      hexInstance.parent = this.worldRoot;
      
      // Düzeltilmiş merkez hesaplama
      hexInstance.position.x = x - centerOffset;
      hexInstance.position.y = y - (rows * this.hexVertSpacing) / 2;
      hexInstance.position.z = 0;
      hexInstance.metadata = { xIndex: col, yIndex: row };
      this.baseTiles.push(hexInstance);
    }
  }
}


    recycleBaseTiles() {
      // Belirli bir y-değerinin altına inen baseTile objelerini yukarı döndürüyoruz.
      for (let tile of this.baseTiles) {
        if (tile.position.y < -30) {
          tile.position.y += this.gridRows * this.hexVertSpacing;
        }
      }
    }

   // Bu fonksiyonu tamamen aşağıdaki ile değiştirin:
createGoldberg() {
    // Goldberg mesh’i oluşturuluyor:
    this.goldberg = BABYLON.MeshBuilder.CreateGoldberg("goldberg", { m: 2, n: 1 }, this.scene);
    this.goldberg.parent = this.worldRoot;
    this.goldberg.scaling.set(1.5, 1.5, 1.5);
    this.goldberg.position.set(0, -27, 4);
    this.goldberg.rotation = new BABYLON.Vector3(0, 0, 0);
    this.goldberg.material = this.goldbergMaterial;

    // Goldberg’e bağlı wing grid node’u:
    this.wingGrid = new BABYLON.TransformNode("wingGrid", this.scene);
    this.wingGrid.parent = this.goldberg;
    this.wingGrid.position = new BABYLON.Vector3(0, 1.4, 0);
}

createWingBeam() {
    // Işın için silindir mesh kullan (çizgi yerine)
    this.wingBeam = BABYLON.MeshBuilder.CreateCylinder("wingBeam", {
        height: 10, // Başlangıç uzunluğu
        diameter: 0.1, // İnce bir ışın
        tessellation: 8 // Daha az poligon
    }, this.scene);
    
    // Işın materyali
    const beamMat = new BABYLON.StandardMaterial("beamMat", this.scene);
    beamMat.emissiveColor = new BABYLON.Color3(0.6, 0.8, 1); // Wing tile rengi
    beamMat.diffuseColor = new BABYLON.Color3(0.6, 0.8, 1);
    beamMat.alpha = 0.5; // Yarı saydam
    this.wingBeam.material = beamMat;
    
    // Işının üst noktasında küçük bir küre
    this.beamTop = BABYLON.MeshBuilder.CreateSphere("beamTop", {
        diameter: 0.2,
        segments: 8
    }, this.scene);
    
    const topMat = new BABYLON.StandardMaterial("topMat", this.scene);
    topMat.emissiveColor = new BABYLON.Color3(0.6, 0.8, 1);
    topMat.diffuseColor = new BABYLON.Color3(0.6, 0.8, 1);
    this.beamTop.material = topMat;
    
    // Işının alt noktasında küçük bir küre
    this.beamBottom = BABYLON.MeshBuilder.CreateSphere("beamBottom", {
        diameter: 0.2,
        segments: 8
    }, this.scene);

    // Yükseklik çentikleri
    this.heightMarkers = [];
    for (let i = 1; i <= 10; i++) {
        const marker = BABYLON.MeshBuilder.CreateDisc("heightMarker_" + i, {
            radius: 0.15,
            tessellation: 6
        }, this.scene);
        
        const markerMat = new BABYLON.StandardMaterial("markerMat_" + i, this.scene);
        markerMat.emissiveColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        markerMat.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
        markerMat.backFaceCulling = false;
        marker.material = markerMat;
        
        marker.parent = this.wingBeam;
        marker.position.y = -i; // DÜZELTME: Silindirin ölçeğine göre ayarlanacak
        marker.rotation.x = Math.PI / 2;
        
        this.heightMarkers.push(marker);
    }
    
    const bottomMat = new BABYLON.StandardMaterial("bottomMat", this.scene);
    bottomMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    bottomMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    this.beamBottom.material = bottomMat;
    
    // Alt küreyi doğrudan ana dünyaya bağla
    this.beamBottom.parent = this.worldRoot;
}


    createWingGrid() {
      // Wing grid: 15 satır x 9 sütun (bazı tile’lar kaldırılıyor, geriye aktif olan wing tile’lar kalıyor)
      const wingRows = 15;
      const wingCols = 9;
      const wingRadius = 0.25;
      const wingHexHeight = Math.sqrt(3) * wingRadius;
      const wingSpacingFactor = 1.1;
      const wingVertSpacing = wingHexHeight * wingSpacingFactor;
      const wingHorizSpacing = 1.5 * wingRadius * wingSpacingFactor;

      for (let row = 0; row < wingRows; row++) {
        for (let col = 0; col < wingCols; col++) {
          const x = col * wingHorizSpacing;
          const y = row * wingVertSpacing + (col % 2 === 0 ? 0 : wingVertSpacing / 2);

          // Her wing tile için materyali klonlayarak bağımsız hale getiriyoruz:
          const wingTileMat = this.wingMaterial.clone("wingTileMat_" + row + "_" + col);
          const wingTile = this.createHexTile(wingRadius, wingTileMat, 0.1);
          wingTile.position.x = x - ((wingCols - 1) * wingHorizSpacing) / 2;
          wingTile.position.y = y - ((wingRows - 1) * wingVertSpacing) / 2;
          wingTile.position.z = 0;
          wingTile.metadata = { row: row, col: col };
          wingTile.parent = this.wingGrid;

          // 39 tile belirli koşullarda sahneden kaldırılıyor:
          if (
            (row === 0 && [0, 1, 2, 6, 7, 8].includes(col)) ||
            (row === 1 && [0, 8].includes(col)) ||
            (row === 2 && [3, 4, 5].includes(col)) ||
            (row === 3 && (col >= 2 && col <= 6)) ||
            (row === 4 && (col >= 2 && col <= 6)) ||
            (row === 5 && (col >= 2 && col <= 6)) ||
            (row === 6 && col === 4) ||
            (row === 7 && col === 4) ||
            (row === 8 && col === 4) ||
            (row === 9 && col === 4) ||
            (row === 10 && col === 4) ||
            (row === 11 && col === 4) ||
            (row === 12 && col === 4) ||
            (row === 13 && col === 4) ||
            (row === 14 && [0, 1, 4, 7, 8].includes(col))
          ) {
            wingTile.dispose();
          } else {
            wingTile.charge = 1;
            this.updateWingTileColor(wingTile);
            this.activeWingTiles.push(wingTile);
          }
        }
      }
    }

    updateWingTileColor(tile) {
      const fullColor = new BABYLON.Color3(0.6, 0.8, 1);
      const emptyColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      const charge = tile.charge; // 0 ile 1 arasında
      const newColor = new BABYLON.Color3(
        emptyColor.r + (fullColor.r - emptyColor.r) * charge,
        emptyColor.g + (fullColor.g - emptyColor.g) * charge,
        emptyColor.b + (fullColor.b - emptyColor.b) * charge
      );
      if (tile.material) {
        tile.material.diffuseColor = newColor;
      }
    }

getRandomTowerType(allowRelic = false) {
    let r = Math.random();
    if (!allowRelic) {
        return r < 0.5 ? "obstacle" : "mineral";
    }
    if (r < 0.25) return "obstacle";
    if (r < 0.40) return "relic";
    return "mineral";
}


getTowerHeight(gameTime) {
    const startRates = [0.4, 0.3, 0.2, 0.1];
    const maxRates = [0.1, 0.2, 0.3, 0.4];
    const changeDuration = 600;
    const progress = Math.min(gameTime / changeDuration, 1);
    const currentRates = startRates.map((start, idx) => start + (maxRates[idx] - start) * progress);
    const rand = Math.random();
    let cumulative = 0;
    if ((cumulative += currentRates[0]) > rand) return Math.floor(Math.random() * 3) + 1;
    if ((cumulative += currentRates[1]) > rand) return Math.floor(Math.random() * 3) + 4;
    if ((cumulative += currentRates[2]) > rand) return Math.floor(Math.random() * 2) + 7;
    return Math.floor(Math.random() * 2) + 9;
}

spawnTowerOnBaseTile(tile, gameTime) {
    if (this.spawnedTowers >= this.maxTowers) return false;

    const c = tile.metadata.xIndex;
    const r = tile.metadata.yIndex;
    if (c < this.spawnMinCol || c > this.spawnMaxCol || r < this.spawnMinRow || r > this.spawnMaxRow) {
        return false;
    }
    if (this.towers.some(t => BABYLON.Vector3.Distance(t.position, tile.position) < 0.1)) {
        return false;
    }

    const type = this.getRandomTowerType(false);
    let height = this.getTowerHeight(gameTime);
    height = Math.max(3, Math.min(height, 10));

    let towerNode = new BABYLON.TransformNode("tower", this.scene);
    towerNode.parent = this.worldRoot;
    towerNode.position = tile.position.clone();
    towerNode.baseTile = tile;
    towerNode.rotation.z = BABYLON.Tools.ToRadians((Math.random() * 30) - 15);

    let specialTileIndex = null;
    let specialColor = null;
    const specialThreshold = 2;
    if (height > specialThreshold) {
        const range = height - specialThreshold;
        specialTileIndex = Math.floor(Math.random() * range) + (specialThreshold + 1);
        specialColor = (Math.random() < 0.7) ? "red" : "blue";
    }

    for (let z = 1; z <= height; z++) {
        let pos = new BABYLON.Vector3(0, 0, z * 0.9);
        const hex = BABYLON.MeshBuilder.CreateCylinder("tile", {
            diameterTop: this.gridRadius * 2,
            diameterBottom: this.gridRadius * 2,
            height: 0.7,
            tessellation: 6
        }, this.scene);
        hex.rotation.x = Math.PI / 2;
        hex.position = pos;
        hex.parent = towerNode;
        hex.tower = towerNode;

        if (specialTileIndex !== null && z === specialTileIndex) {
            if (specialColor === "red") {
                const mexMat = new BABYLON.StandardMaterial("mexTileMat", this.scene);
                mexMat.diffuseColor = this.faceColor.clone();
                hex.material = mexMat;
            } else {
                const wexMat = new BABYLON.StandardMaterial("wexTileMat", this.scene);
                wexMat.diffuseColor = new BABYLON.Color3(0.6, 0.8, 1);
                hex.material = wexMat;
            }
            hex.isSpecial = true;
            hex.specialColor = specialColor;
        } else {
            const segmentMat = this.baseMaterial.clone("towerSegmentMat");
            segmentMat.diffuseColor = this.baseMaterial.diffuseColor.clone();
            hex.material = segmentMat;
        }
    }

    this.towers.push(towerNode);
    this.spawnedTowers++;
    this.spawnedElem.textContent = `Spawned: ${this.spawnedTowers}`;
    return true;
}



animateTowerFall(towerNode, onComplete) {
  const fallAnim = new BABYLON.Animation("towerFallAnim", "position.z", 60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const currentZ = towerNode.position.z;
  const targetZ  = currentZ - 10;
  fallAnim.setKeys([
    { frame:  0, value: currentZ },
    { frame: 30, value: targetZ }
  ]);
  towerNode.animations = [fallAnim];

  this.scene.beginAnimation(towerNode, 0, 30, false, 1, () => {
    // collapse bittiğinde önce callback’i çağır
    if (onComplete) onComplete();

    // sonra tower’ı kaldır ve oyun sonu kontrolü
    const idx = this.towers.indexOf(towerNode);
    if (idx !== -1) this.towers.splice(idx, 1);
    towerNode.dispose();
    this.disposedTowers++;
    if (this.disposedTowers >= this.targetTowers) {
      this.onGameOver();
    }
  });
}


   animateTileFall(tile) {
  console.log("Animating tile fall!", tile); // Debug için log
  
  // Daha BÜYÜK ve YAVAŞ animasyonlar için değişiklikler
  const randomX = (Math.random() * 4) - 2;  // -2 ile 2 arası (daha geniş)
  const randomZ = (Math.random() * 4) - 2;  // Z ekseninde de hareket
  
  // Düşme animasyonu - daha yavaş, 60 frame'den 90 frame'e
  const fallAnim = new BABYLON.Animation("fallAnim", "position.y", 60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const currentY = tile.position.y;
  const targetY = currentY - 15; // Daha uzağa düşsün
  fallAnim.setKeys([
    { frame: 0, value: currentY },
    { frame: 30, value: currentY + 1 }, // Önce hafif yukarı
    { frame: 90, value: targetY }       // Sonra aşağı
  ]);
  
  // X ekseni kayma - daha büyük
  const slideXAnim = new BABYLON.Animation("slideXAnim", "position.x", 60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const currentX = tile.position.x;
  const targetX = currentX + (randomX * 5);  // 5 kat daha fazla hareket
  slideXAnim.setKeys([
    { frame: 0, value: currentX },
    { frame: 90, value: targetX }
  ]);
  
  // Z ekseni kayma (yeni)
  const slideZAnim = new BABYLON.Animation("slideZAnim", "position.z", 60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const currentZ = tile.position.z;
  const targetZ = currentZ + (randomZ * 5);  // Z'de de hareket
  slideZAnim.setKeys([
    { frame: 0, value: currentZ },
    { frame: 90, value: targetZ }
  ]);
  
  // 3 eksende dönüş (daha dramatik)
  const rotateXAnim = new BABYLON.Animation("rotateXAnim", "rotation.x", 60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  rotateXAnim.setKeys([
    { frame: 0, value: tile.rotation.x },
    { frame: 90, value: tile.rotation.x + (Math.random() * Math.PI * 4) }
  ]);
  
  const rotateZAnim = new BABYLON.Animation("rotateZAnim", "rotation.z", 60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  rotateZAnim.setKeys([
    { frame: 0, value: tile.rotation.z },
    { frame: 90, value: tile.rotation.z + (Math.random() * Math.PI * 4) }
  ]);
  
  // Ölçek animasyonu - küçülsün
  const scaleAnim = new BABYLON.Animation("scaleAnim", "scaling.x", 60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  scaleAnim.setKeys([
    { frame: 0, value: 1.0 },
    { frame: 90, value: 0.2 }  // %20'ye küçülsün
  ]);
  
  const scaleAnimY = new BABYLON.Animation("scaleAnimY", "scaling.y", 60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  scaleAnimY.setKeys([
    { frame: 0, value: 1.0 },
    { frame: 90, value: 0.2 }
  ]);
  
  const scaleAnimZ = new BABYLON.Animation("scaleAnimZ", "scaling.z", 60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  scaleAnimZ.setKeys([
    { frame: 0, value: 1.0 },
    { frame: 90, value: 0.2 }
  ]);
  
  // Tüm animasyonları ekle
  tile.animations = [
    fallAnim, slideXAnim, slideZAnim, 
    rotateXAnim, rotateZAnim,
    scaleAnim, scaleAnimY, scaleAnimZ
  ];
  
  // Daha uzun süre çalıştır - 30 yerine 90 frame
  this.scene.beginAnimation(tile, 0, 90, false, 1, () => {
    console.log("Animation complete, disposing tile");
    tile.dispose();
  });
}

    createShimmeringLightBeam(height) {
      // Işık hüzmesi oluşturuluyor:
      const beam = BABYLON.MeshBuilder.CreateCylinder("shimmerBeam", {
        diameterTop: 0.2,
        diameterBottom: 0.2,
        height: height,
        tessellation: 12
      }, this.scene);
      const textureResolution = 512;
      const dynTexture = new BABYLON.DynamicTexture("beamDynTexture", { width: textureResolution, height: textureResolution }, this.scene, false);
      const mat = new BABYLON.StandardMaterial("beamMat", this.scene);
      mat.emissiveTexture = dynTexture;
      mat.emissiveColor = new BABYLON.Color3(1, 1, 1);
      mat.alpha = 1;
      beam.material = mat;

      const ctx = dynTexture.getContext();
      let offset = 0;
      const updateTexture = () => {
        offset += 0.5;
        ctx.clearRect(0, 0, textureResolution, textureResolution);

        const gradient = ctx.createLinearGradient(0, 0, 0, textureResolution);
        gradient.addColorStop(0, "rgba(255,220,0,1)");
        gradient.addColorStop(0.5, "rgba(255,150,0,0.8)");
        gradient.addColorStop(1, "rgba(255,100,0,0.6)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, textureResolution, textureResolution);

        // Rastgele beyaz noktalar (ışık parıltısı) çiziliyor:
        for (let i = 0; i < 50; i++) {
          ctx.fillStyle = `rgba(255,255,255, ${Math.random() * 0.3})`;
          const x = Math.random() * textureResolution;
          const y = (Math.random() * textureResolution + offset) % textureResolution;
          const radius = Math.random() * 5;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.fill();
        }
        dynTexture.update();
      };
      this.scene.registerBeforeRender(updateTexture);
      return beam;
    }

setupInput() {
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    // BAŞLANGIÇ: Fareye bastığında sürüklemeyi başlat
    this.canvas.addEventListener("pointerdown", (e) => {
        const pickResult = this.scene.pick(e.clientX, e.clientY);
        // goldberg mesh'ine tıkladıysa başlat
        if (pickResult.hit && pickResult.pickedMesh === this.goldberg) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
        }
    });

    // BIRAKMA: Fareyi kaldırınca sürüklemeyi bitir
    this.canvas.addEventListener("pointerup", (e) => {
        isDragging = false;
    });

    // MEVCUT pointermove'unuz:
    this.canvas.addEventListener("pointermove", (e) => {
        if (!isDragging) return;

        const deltaX = -(e.clientX - startX) * 0.03;
        
        // X ekseni hareketi - sürekli
        this.goldberg.position.x += deltaX;
        
        // Grid genişliğine göre X sınırlarını ayarla
        const totalGridWidth = this.gridCols * this.hexHorizSpacing;
        const maxX = (totalGridWidth / 2) - 5; // 5 birim kenar payı
        
        // Simetrik hareket sınırları
        this.goldberg.position.x = Math.min(Math.max(this.goldberg.position.x, -maxX), maxX);
        
        // Kamerayı Goldberg'e göre ayarla
        this.camera.position.x = this.goldberg.position.x;

        // Z ekseni hareketi - kademeli
if (this.gridMovementEnabled && this.isMoving) {
    const currentZ = this.goldberg.position.z;
    const distanceToTarget = this.targetZ - currentZ;
    
    // Hedefe yaklaştık mı?
    if (Math.abs(distanceToTarget) < 0.01) {
        this.goldberg.position.z = this.targetZ;
        this.isMoving = false;
    } else {
        // Hedefe doğru hareket et (yumuşak geçiş)
        const step = Math.sign(distanceToTarget) * Math.min(Math.abs(distanceToTarget), this.gridMovementStep * 0.1);
        this.goldberg.position.z += step;
    }
}
        startX = e.clientX;
    });

    window.addEventListener("keydown", (e) => {
        const rotationSpeed = BABYLON.Angle.FromDegrees(15).radians();
        const maxRotation = Math.PI / 2;

        // Kademeli hareket kontrolleri
        if (this.gridMovementEnabled && !this.isMoving) {
            if (e.key === "ArrowUp" || e.key === "w") {
                this.targetY = this.worldRoot.position.y + this.gridMovementStep;
                this.isMoving = true;
            } else if (e.key === "ArrowDown" || e.key === "s") {
                this.targetY = this.worldRoot.position.y - this.gridMovementStep;
                this.isMoving = true;
            }
        }

        if (e.key.toLowerCase() === "f") {
            let newFlipOffset, targetColor;
            if (this.currentMode === "mex") {
                newFlipOffset = Math.PI;
                targetColor = new BABYLON.Color3(0.6, 0.8, 1);    // ice‑blue for WEX mode
                this.currentMode = "wex";
                this.fireHandler = FireHandlers.wex;
            } else {
                newFlipOffset = 0;
                targetColor = this.faceColor.clone();            // revert to initial face color for MEX
                this.currentMode = "mex";
                // Hexcraft kontrolü ekle
                if (this.initialFace === "hexcraft") {
                    this.fireHandler = FireHandlers.hexcraft;
                } else {
                    this.fireHandler = FireHandlers[this.initialFace];
                }
            }

            const currentRotationY = this.goldberg.rotation.y;
            const targetRotationY = this.baseRotation + newFlipOffset;
            const frames = 30;

            const flipAnim = new BABYLON.Animation("flipAnim", "rotation.y", 60,
                BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            flipAnim.setKeys([
                { frame: 0, value: currentRotationY },
                { frame: frames, value: targetRotationY }
            ]);

            const colorAnim = new BABYLON.Animation("colorAnim", "material.diffuseColor", 60,
                BABYLON.Animation.ANIMATIONTYPE_COLOR3,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
            colorAnim.setKeys([
                { frame: 0, value: this.goldberg.material.diffuseColor.clone() },
                { frame: frames, value: targetColor }
            ]);

            this.goldberg.animations = [];
            this.goldberg.animations.push(flipAnim);
            this.goldberg.animations.push(colorAnim);
            this.scene.beginAnimation(this.goldberg, 0, frames, false);
            this.flipOffset = newFlipOffset;
        }

        if (e.key === "ArrowLeft") {
            this.baseRotation = Math.min(this.baseRotation + rotationSpeed, maxRotation);
            this.goldberg.rotation.y = this.baseRotation + this.flipOffset;
        } else if (e.key === "ArrowRight") {
            this.baseRotation = Math.max(this.baseRotation - rotationSpeed, -maxRotation);
            this.goldberg.rotation.y = this.baseRotation + this.flipOffset;
        } else if (e.code === "Space") {
            const now = performance.now() / 1000;
            if (now - this.lastFireTime >= this.fireCooldown) {
                this.fireProjectile();
                this.lastFireTime = now;
            }
        }
    });
}


 // **Sadece solar run için normal atış (relic tile’ları parça parça yok etme)**
 solarSingleFire(projectile, i) {
  // Güneş rengi ve efektleri için temel renkler
  const solarColor = this.faceColor.clone();
  const brightSolarColor = new BABYLON.Color3(1, 0.8, 0.2); // Daha parlak sarı
  const hotSolarColor = new BABYLON.Color3(1, 0.4, 0); // Turuncu-kırmızı

  // RELIC TOWER KONTROLÜ - SADECE ÇARPIŞMA KONTROLÜ DEĞİŞTİRİLDİ
  for (let j = this.relicTowers.length - 1; j >= 0; j--) {
    const rt = this.relicTowers[j];
    
    for (const seg of rt.getChildren()) {
      if (!(seg instanceof BABYLON.Mesh)) continue;
      
      // YENİ: Mesafe tabanlı çarpışma kontrolü
      const segPos = seg.getAbsolutePosition();
      const distance = BABYLON.Vector3.Distance(projectile.position, segPos);
      
      // Çarpışma mesafesi kontrolü (2.0 birim)
      if (distance < 1.5) {
        // ORİJİNAL KOD - Çarpışma noktasında patlama efekti
        const hitPoint = seg.getAbsolutePosition();
        
        // Ana patlama ışığı
        const explosionLight = new BABYLON.PointLight("solarLight", hitPoint, this.scene);
        explosionLight.diffuse = solarColor;
        explosionLight.intensity = 2;
        explosionLight.range = 8;

        // Işık animasyonu
        const lightAnim = new BABYLON.Animation(
          "lightAnim", 
          "intensity", 
          60,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        
        lightAnim.setKeys([
          { frame: 0, value: 2 },
          { frame: 15, value: 4 },
          { frame: 30, value: 0 }
        ]);
        
        explosionLight.animations = [lightAnim];
        this.scene.beginAnimation(explosionLight, 0, 30, false, 1, () => {
          explosionLight.dispose();
        });

        // 2. Güneş patlaması particle efekti
        const explosion = new BABYLON.ParticleSystem("solarExplosion", 300, this.scene);
        explosion.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
        explosion.emitter = hitPoint;
        explosion.minEmitBox = new BABYLON.Vector3(-0.2, -0.2, -0.2);
        explosion.maxEmitBox = new BABYLON.Vector3(0.2, 0.2, 0.2);
        
        // Renk gradyanı
        explosion.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 1));
        explosion.addColorGradient(0.4, new BABYLON.Color4(1, 0.8, 0.2, 0.8));
        explosion.addColorGradient(0.7, new BABYLON.Color4(1, 0.4, 0, 0.4));
        explosion.addColorGradient(1.0, new BABYLON.Color4(0.5, 0, 0, 0));
        
        explosion.minSize = 0.2;
        explosion.maxSize = 0.5;
        explosion.minLifeTime = 0.3;
        explosion.maxLifeTime = 0.5;
        explosion.emitRate = 1000;
        explosion.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        explosion.gravity = new BABYLON.Vector3(0, 5, 0);
        explosion.direction1 = new BABYLON.Vector3(-1, 8, -1);
        explosion.direction2 = new BABYLON.Vector3(1, 8, 1);
        explosion.minAngularSpeed = 0;
        explosion.maxAngularSpeed = Math.PI;
        explosion.minEmitPower = 1;
        explosion.maxEmitPower = 3;
        explosion.updateSpeed = 0.005;
        
        explosion.start();
        setTimeout(() => explosion.stop(), 200);
        setTimeout(() => explosion.dispose(), 500);

        // 3. Segmentin erime/parçalanma animasyonu
        const segmentMat = seg.material.clone("meltingMat");
        seg.material = segmentMat;
        
        // Erime animasyonu
        let meltProgress = 0;
        const meltAnim = () => {
          meltProgress += 0.05;
          
          if (meltProgress >= 1) {
            // Segment tamamen eridiğinde
            const segZ = seg.position.z;
            
            // Mini parçacıklar oluştur
            for(let p = 0; p < 5; p++) {
              const fragment = BABYLON.MeshBuilder.CreateBox("fragment", {size: 0.2}, this.scene);
              fragment.position = seg.getAbsolutePosition().clone();
              fragment.material = new BABYLON.StandardMaterial("fragmentMat", this.scene);
              fragment.material.emissiveColor = hotSolarColor;
              
              // Parçaları rastgele yönlerde fırlat
              const randomVel = new BABYLON.Vector3(
                (Math.random() - 0.5) * 0.5,
                -Math.random() * 0.5,
                (Math.random() - 0.5) * 0.5
              );
              
              let fragmentLife = 1.0;
              const animateFragment = () => {
                if (fragmentLife <= 0) {
                  fragment.dispose();
                  return;
                }
                fragment.position.addInPlace(randomVel);
                fragment.rotation.x += 0.1;
                fragment.rotation.y += 0.1;
                fragment.scaling.scaleInPlace(0.95);
                fragmentLife -= 0.05;
                fragment.material.alpha = fragmentLife;
                requestAnimationFrame(animateFragment);
              };
              animateFragment();
            }
            
            // Drop oluştur
            const drop = BABYLON.MeshBuilder.CreateSphere("drop", { diameter: 0.5 }, this.scene);
            drop.position.copyFrom(seg.getAbsolutePosition());
            drop.material = new BABYLON.StandardMaterial("dropMat", this.scene);
            drop.material.emissiveColor = solarColor;
            drop.metadata = { dropType: this.initialFace };
            this.drops.push(drop);
            
            // Segmenti yok et ve üsttekileri indir
            seg.dispose();
            for (const otherSeg of rt.getChildren()) {
              if (otherSeg.position.z > segZ) {
                otherSeg.position.z -= 0.9;
              }
            }
            
            return;
          }
          
          // Erime efekti
          segmentMat.emissiveColor = BABYLON.Color3.Lerp(
            solarColor,
            brightSolarColor,
            Math.sin(meltProgress * Math.PI)
          );
          segmentMat.alpha = 1 - meltProgress;
          seg.scaling.y = 1 - meltProgress * 0.5;
          
          requestAnimationFrame(meltAnim);
        };
        meltAnim();

        // 4. Tower kontrolü ve combo
        if (rt.getChildren().length === 0) {
          this.relicTowers.splice(j, 1);
          rt.dispose();
        }

        this.relicHitCount++;
        if (this.relicHitCount >= 3) {
          this.updateComboButtonState(true);
          this.relicHitCount = 0;
        }

        // 5. Projectile temizliği
        if (projectile.pulseInterval) clearInterval(projectile.pulseInterval);
        if (projectile.electricParticles) projectile.electricParticles.dispose();
        projectile.dispose();
        this.projectiles.splice(i, 1);
        
        return true;
      }
    }
  }
  
  // MEX TILE TOWER KONTROLÜ - SADECE ÇARPIŞMA KONTROLÜ DEĞİŞTİRİLDİ
  for (let t = this.towers.length - 1; t >= 0; t--) {
    const tower = this.towers[t];
    for (const seg of tower.getChildren()) {
      if (seg.isSpecial && seg.specialColor === 'red') {
        // YENİ: Mesafe tabanlı çarpışma kontrolü
        const segPos = seg.getAbsolutePosition();
        const distance = BABYLON.Vector3.Distance(projectile.position, segPos);
        
        // Çarpışma mesafesi kontrolü (2.0 birim)
        if (distance < 1.5) {
          // ORİJİNAL KOD - Çarpışma noktasında patlama efekti
          const hitPoint = segPos;
          
          // Ana patlama ışığı
          const explosionLight = new BABYLON.PointLight("solarLight", hitPoint, this.scene);
          explosionLight.diffuse = solarColor;
          explosionLight.intensity = 2;
          explosionLight.range = 8;

          // Işık animasyonu
          const lightAnim = new BABYLON.Animation(
            "lightAnim", 
            "intensity", 
            60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
          );
          
          lightAnim.setKeys([
            { frame: 0, value: 2 },
            { frame: 15, value: 4 },
            { frame: 30, value: 0 }
          ]);
          
          explosionLight.animations = [lightAnim];
          this.scene.beginAnimation(explosionLight, 0, 30, false, 1, () => {
            explosionLight.dispose();
          });

          // Tower'ı solar rengine boyama
          tower.getChildren().forEach(child => {
            if (child.material) {
              child.material.diffuseColor = solarColor;
              child.material.emissiveColor = solarColor;
            }
          });

          // Tower'ı düşürme
          setTimeout(() => {
            this.animateTowerFall(tower, () => {
              const { xIndex: cx, yIndex: cy } = tower.baseTile.metadata;
              this.baseTiles
                .filter(tile =>
                  Math.abs(tile.metadata.xIndex - cx) <= 1 &&
                  Math.abs(tile.metadata.yIndex - cy) <= 1
                )
                .forEach(tile => this.spawnLightTower(tile, 10));
            });
            if (this.hud) {
             this.hud.showMexShot();
              }
          }, 300);

          // Combo hakkı
          this.updateComboButtonState(true);

          // Projectile'ı temizle
          if (projectile.pulseInterval) clearInterval(projectile.pulseInterval);
          if (projectile.electricParticles) projectile.electricParticles.dispose();
          if (projectile.particles) projectile.particles.dispose();
          projectile.dispose();
          this.projectiles.splice(i, 1);
          
          return true;
        }
      }
    }
  }
  
  return false;
}


emSingleFire(projectile, i) {
  // Elektrik efekti için materyal
  const emMaterial = new BABYLON.StandardMaterial("emMat", this.scene);
  emMaterial.emissiveColor = new BABYLON.Color3(0, 0.6, 1);
  emMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
  emMaterial.specularPower = 32;

  // Gelişmiş elektrik efekti
  const createEnhancedElectricEffect = (position) => {
    const mainBurst = new BABYLON.ParticleSystem("emBurst", 200, this.scene);
    mainBurst.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
    mainBurst.emitter = position;
    mainBurst.minEmitBox = new BABYLON.Vector3(-0.3, -0.3, -0.3);
    mainBurst.maxEmitBox = new BABYLON.Vector3(0.3, 0.3, 0.3);
    mainBurst.color1 = new BABYLON.Color4(0.8, 0.9, 1, 1);
    mainBurst.color2 = new BABYLON.Color4(0, 0.6, 1, 1);
    mainBurst.colorDead = new BABYLON.Color4(0, 0.2, 0.5, 0);
    mainBurst.minSize = 0.2;
    mainBurst.maxSize = 0.5;
    mainBurst.minLifeTime = 0.1;
    mainBurst.maxLifeTime = 0.3;
    mainBurst.emitRate = 500;
    mainBurst.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    mainBurst.gravity = new BABYLON.Vector3(0, 0, 0);
    mainBurst.direction1 = new BABYLON.Vector3(-1, -1, -1);
    mainBurst.direction2 = new BABYLON.Vector3(1, 1, 1);
    mainBurst.minAngularSpeed = 0;
    mainBurst.maxAngularSpeed = Math.PI;
    mainBurst.start();

    // Elektrik arkları
    const createArcs = () => {
      for(let i = 0; i < 8; i++) {
        const start = position.clone();
        const end = position.add(new BABYLON.Vector3(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4
        ));
        this.createEnhancedLightningArc(start, end, this.scene, new BABYLON.Color3(0, 0.6, 1));
      }
    };

    let arcCount = 0;
    const arcInterval = setInterval(() => {
      createArcs();
      arcCount++;
      if(arcCount >= 3) clearInterval(arcInterval);
    }, 100);

    setTimeout(() => {
      mainBurst.stop();
      setTimeout(() => mainBurst.dispose(), 300);
    }, 200);
  };

  // 1. MEX Tile Tower Kontrolü
  for (let t = this.towers.length - 1; t >= 0; t--) {
    const tower = this.towers[t];
    for (const seg of tower.getChildren()) {
      if (seg.isSpecial && seg.specialColor === 'red') {
        const segPos = seg.getAbsolutePosition();
        const distance = BABYLON.Vector3.Distance(projectile.position, segPos);

        // Çarpışma mesafesi kontrolü (1.5 birim)
        if (distance < 1.5) {
          createEnhancedElectricEffect(segPos);

          // Screen shake
          const camera = this.scene.activeCamera;
          const originalPosition = camera.position.clone();
          let shakeTime = 0;
          const shakeInterval = setInterval(() => {
            camera.position = originalPosition.add(
              new BABYLON.Vector3(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                0
              )
            );
            shakeTime += 50;
            if(shakeTime >= 200) {
              clearInterval(shakeInterval);
              camera.position = originalPosition;
            }
          }, 50);

          // Tower elektriklenme efekti
          tower.getChildren().forEach(child => {
            if (child.material) {
              child.material = emMaterial.clone();
              let pulseTime = 0;
              const pulseInterval = setInterval(() => {
                child.material.emissiveColor = new BABYLON.Color3(
                  0,
                  0.6 + Math.sin(pulseTime * 0.2) * 0.4,
                  1
                );
                pulseTime += 16;
                if(pulseTime >= 300) clearInterval(pulseInterval);
              }, 16);
            }
          });

          setTimeout(() => {
            this.animateTowerFall(tower, () => {
              const { xIndex: cx, yIndex: cy } = tower.baseTile.metadata;
              this.baseTiles
                .filter(tile =>
                  Math.abs(tile.metadata.xIndex - cx) <= 1 &&
                  Math.abs(tile.metadata.yIndex - cy) <= 1
                )
                .forEach(tile => this.spawnLightTower(tile, 10));
            });
                        if (this.hud) {
             this.hud.showMexShot();
              }
          }, 400);

this.updateComboButtonState(true);

          if (projectile.pulseInterval) clearInterval(projectile.pulseInterval);
          if (projectile.electricParticles) projectile.electricParticles.dispose();
          projectile.dispose();
          this.projectiles.splice(i, 1);
          return true;
        }
      }
    }
  }

  // 2. Relic Tower Kontrolü
  for (let j = this.relicTowers.length - 1; j >= 0; j--) {
    const rt = this.relicTowers[j];
    for (const seg of rt.getChildren()) {
      const segPos = seg.getAbsolutePosition();
      const distance = BABYLON.Vector3.Distance(projectile.position, segPos);

      if (distance < 1.5) {
        createEnhancedElectricEffect(segPos);

        if (seg.material) {
          const originalMaterial = {
            diffuse: seg.material.diffuseColor.clone(),
            emissive: seg.material.emissiveColor ? seg.material.emissiveColor.clone() : null
          };

          seg.material = emMaterial.clone();
          
          let chargeTime = 0;
          const chargeInterval = setInterval(() => {
            const intensity = Math.sin(chargeTime * 0.1) * 0.5 + 0.5;
            seg.material.emissiveColor = new BABYLON.Color3(0, 0.6 * intensity, 1);
            chargeTime += 16;
            if(chargeTime >= 600) {
              clearInterval(chargeInterval);
              if (seg.material) {
                seg.material.diffuseColor = originalMaterial.diffuse;
                if (originalMaterial.emissive) {
                  seg.material.emissiveColor = originalMaterial.emissive;
                }
              }
            }
          }, 16);
        }

        // Zincir yıldırım
        const otherSegments = rt.getChildren()
          .filter(s => s !== seg && s instanceof BABYLON.Mesh)
          .slice(0, 3);

        // Relic Tower kontrolü kısmında, zincir yıldırım efektinden sonra:

otherSegments.forEach(target => {
  const start = segPos;
  const end = target.getAbsolutePosition();
  this.createEnhancedLightningArc(start, end, this.scene, new BABYLON.Color3(0, 0.6, 1));
  
  setTimeout(() => {
    if (target.material) {
      target.material = emMaterial.clone();
      
      // Segment'in Z pozisyonunu al
      const segZ = target.position.z;
      
      // Segment'i düşür ve dispose et
      this.animateTileFall(target);
      
      // Üstteki segmentleri aşağı kaydır
      setTimeout(() => {
        // Önce segment'i dispose et
        target.dispose();
        
        // Kalan segmentleri bul ve sırala
        const remainingSegments = rt.getChildren()
          .filter(s => s instanceof BABYLON.Mesh && s !== target)
          .sort((a, b) => a.position.z - b.position.z);
        
        // Her segment için yeni z pozisyonu hesapla
        const layerHeight = 0.9; // Segment yüksekliği
        remainingSegments.forEach((segment, index) => {
          if (segment.position.z > segZ) {
            // Yumuşak geçiş animasyonu
            const animation = new BABYLON.Animation(
              "segmentDrop",
              "position.z",
              60,
              BABYLON.Animation.ANIMATIONTYPE_FLOAT,
              BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
            );

            const currentZ = segment.position.z;
            const targetZ = layerHeight * (index + 1);

            animation.setKeys([
              { frame: 0, value: currentZ },
              { frame: 30, value: targetZ }
            ]);

            segment.animations = [animation];
            this.scene.beginAnimation(segment, 0, 30, false);
          }
        });

        // Eğer tower boşsa dispose et
        if (remainingSegments.length === 0) {
          const idx = this.relicTowers.indexOf(rt);
          if (idx !== -1) {
            this.relicTowers.splice(idx, 1);
            rt.dispose();
          }
        }
      }, 300);
    }
  }, 100);
});


        this.emRelicHitTowers.add(rt.uniqueId);
        if (this.emRelicHitTowers.size >= 3) {
this.updateComboButtonState(true);
          this.emRelicHitTowers.clear();
        }

        if (projectile.pulseInterval) clearInterval(projectile.pulseInterval);
        if (projectile.electricParticles) projectile.electricParticles.dispose();
        projectile.dispose();
        this.projectiles.splice(i, 1);
        return true;
      }
    }
  }
  return false;
}



gravitySingleFire(projectile, i) {
  let hitRelicThisShot = false;
  const gravityColor = new BABYLON.Color4(0.2, 1, 0.2, 1); // Gravity rengi (yeşil)

  // MEX TILE TOWER
  for (let t = this.towers.length - 1; t >= 0; t--) {
    const tower = this.towers[t];
    for (const seg of tower.getChildren()) {
      if (seg.isSpecial && seg.specialColor === 'red') {
        // ESKİ: Bounding box kontrolü
        // const bi = seg.getBoundingInfo().boundingBox;
        // const p = projectile.position;
        // const min = bi.minimumWorld, max = bi.maximumWorld;
        // if (p.x >= min.x && p.x <= max.x && p.y >= min.y && p.y <= max.y && p.z >= min.z && p.z <= max.z) {

        // YENİ: Mesafe tabanlı kontrol
        const segPos = seg.getAbsolutePosition();
        const distance = BABYLON.Vector3.Distance(projectile.position, segPos);
        
        if (distance < 1.5) { // Standart çarpışma mesafesi
          tower.getChildren().forEach(child => {
            child.material.diffuseColor = gravityColor.clone();
            child.material.emissiveColor = gravityColor.clone();
          });

          setTimeout(() => {
            this.animateTowerFall(tower, () => {
              const { xIndex: cx, yIndex: cy } = tower.baseTile.metadata;
              this.baseTiles
                .filter(tile =>
                  Math.abs(tile.metadata.xIndex - cx) <= 1 &&
                  Math.abs(tile.metadata.yIndex - cy) <= 1)
                .forEach(tile => this.spawnLightTower(tile, 10));
            });
            if (this.hud) {
             this.hud.showMexShot();
              }
          }, 300);

          this.updateComboButtonState(true);

          projectile.dispose();
          this.projectiles.splice(i, 1);
          return true;
        }
      }
    }
  }

  // RELIC TILE TOWER
  for (let j = this.relicTowers.length - 1; j >= 0; j--) {
    const rt = this.relicTowers[j];
    for (const seg of rt.getChildren()) {
      // ESKİ: Bounding box kontrolü
      // const bi = seg.getBoundingInfo().boundingBox;
      // const p = projectile.position;
      // const min = bi.minimumWorld, max = bi.maximumWorld;
      // if (p.x >= min.x && p.x <= max.x && p.y >= min.y && p.y <= max.y && p.z >= min.z && p.z <= max.z) {

      // YENİ: Mesafe tabanlı kontrol
      const segPos = seg.getAbsolutePosition();
      const distance = BABYLON.Vector3.Distance(projectile.position, segPos);
      
      if (distance < 1.5) { // Standart çarpışma mesafesi
        const segZ = seg.position.z;
        const height = 0.9;

        const toFall = rt.getChildren().filter(s =>
          Math.abs(s.position.z - segZ) <= height && s instanceof BABYLON.Mesh);

        toFall.forEach(tile => {
          tile.material.diffuseColor = gravityColor.clone();
          tile.material.emissiveColor = gravityColor.clone();
          this.animateTileFall(tile);
        });

        setTimeout(() => {
          const remaining = rt.getChildren().filter(s => !toFall.includes(s));
          remaining.sort((a, b) => a.position.z - b.position.z);
          remaining.forEach((seg, idx) => seg.position.z = height * (idx + 1));
        }, 500);

        setTimeout(() => {
          if (rt.getChildren().length === 0) {
            this.relicTowers.splice(j, 1);
            rt.dispose();
          }
        }, 700);

        this.emRelicHitTowers.add(rt.uniqueId);
        if (this.emRelicHitTowers.size >= 3) {
          this.updateComboButtonState(true);
          this.emRelicHitTowers.clear();
        }

        if (projectile.pulseInterval) clearInterval(projectile.pulseInterval);
        if (projectile.electricParticles) projectile.electricParticles.dispose();
        projectile.dispose();
        this.projectiles.splice(i, 1);
        return true;
      }
    }
  }

  return false;
}

 
// darkSingleFire fonksiyonunu düzeltelim
darkSingleFire(projectile, i) {
  // Daha zengin mor renk paleti
  const darkPrimaryColor = new BABYLON.Color3(0.4, 0, 0.6); // Ana mor
  const darkSecondaryColor = new BABYLON.Color3(0.2, 0, 0.3); // Koyu mor
  const darkAccentColor = new BABYLON.Color3(0.7, 0.3, 1.0); // Parlak mor vurgu
  
  // Performans için çarpışma kontrolünü optimize et
  const projectilePos = projectile.position;
  const checkRadius = 1.8; // Biraz daha geniş çarpışma alanı
  
  // ─── 1) MEX tile tower vuruşu ───
  // Önce kaba bir mesafe kontrolü yaparak performansı artır
  for (let t = this.towers.length - 1; t >= 0; t--) {
    const tower = this.towers[t];
    
    // Kaba çarpışma kontrolü - tower merkezi ile projectile arası mesafe
    if (BABYLON.Vector3.Distance(tower.position, projectilePos) > 5) {
      continue; // Bu tower çok uzakta, atla
    }
    
    for (const seg of tower.getChildren()) {
      if (seg.isSpecial && seg.specialColor === 'red') {
        const segPos = seg.getAbsolutePosition();
        const distance = BABYLON.Vector3.Distance(projectilePos, segPos);
        
        if (distance < checkRadius) {
          // Çarpışma noktasında mor enerji patlaması
          this.createDarkImpactEffect(segPos);
          
          // Ekran sarsıntısı
          this.screenShake(0.2, 200);
          
          // Tüm segmentleri koyu mora çevir - DAHA ETKILEYICI GEÇIŞ ANIMASYONU
          tower.getChildren().forEach((child, index) => {
            if (child.material) {
              // Orijinal rengi sakla
              const originalColor = child.material.diffuseColor.clone();
              
              // Segment başına farklı zamanlama ile renk değişimi animasyonu
              setTimeout(() => {
                // Renk geçiş animasyonu
                let progress = 0;
                const colorTransition = setInterval(() => {
                  progress += 0.1;
                  if (progress >= 1) {
                    clearInterval(colorTransition);
                    child.material.diffuseColor = darkPrimaryColor.clone();
                    if (child.material.emissiveColor) {
                      child.material.emissiveColor = darkSecondaryColor.clone();
                    }
                  } else {
                    // Orijinal renkten mor renge geçiş
                    const currentColor = BABYLON.Color3.Lerp(
                      originalColor,
                      darkPrimaryColor,
                      progress
                    );
                    child.material.diffuseColor = currentColor;
                    
                    if (child.material.emissiveColor) {
                      child.material.emissiveColor = BABYLON.Color3.Lerp(
                        originalColor.scale(0.5),
                        darkSecondaryColor,
                        progress
                      );
                    }
                  }
                }, 20);
              }, index * 30); // Her segment için kademeli geçiş
            }
          });
          
          // Mor enerji dalgası efekti
          const energyWave = BABYLON.MeshBuilder.CreateDisc("darkEnergyWave", {
            radius: 0.1,
            tessellation: 36,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
          }, this.scene);
          
          energyWave.position = segPos.clone();
          energyWave.rotation.x = Math.PI / 2;
          
          const waveMat = new BABYLON.StandardMaterial("wavemat", this.scene);
          waveMat.emissiveColor = darkAccentColor;
          waveMat.alpha = 0.7;
          waveMat.disableLighting = true;
          energyWave.material = waveMat;
          
          // Dalga büyüme animasyonu
          let waveSize = 0.1;
          const waveGrow = setInterval(() => {
            waveSize *= 1.2;
            energyWave.scaling.x = waveSize;
            energyWave.scaling.y = waveSize;
            waveMat.alpha *= 0.9;
            
            if (waveSize > 10) {
              clearInterval(waveGrow);
              energyWave.dispose();
            }
          }, 30);
          
          // 300ms sonra collapse & ışık hüzmesi - DAHA DRAMATIK ÇÖKME
          setTimeout(() => {
            // Çökme öncesi hafif yükselme efekti
            const preFallAnim = new BABYLON.Animation(
              "preFall",
              "position.z",
              60,
              BABYLON.Animation.ANIMATIONTYPE_FLOAT,
              BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
            );
            
            const currentZ = tower.position.z;
            preFallAnim.setKeys([
              { frame: 0, value: currentZ },
              { frame: 10, value: currentZ + 0.5 }, // Hafif yükselme
              { frame: 20, value: currentZ }
            ]);
            
            tower.animations = [preFallAnim];
            this.scene.beginAnimation(tower, 0, 20, false, 1, () => {
              // Yükselme bittikten sonra çökme animasyonu
              this.animateTowerFall(tower, () => {
                // Komşu tile'ları bul ve her birine ışık hüzmesi spawn et
                const { xIndex: cx, yIndex: cy } = tower.baseTile.metadata;
                const neighborTiles = this.baseTiles.filter(tile => {
                  const dx = Math.abs(tile.metadata.xIndex - cx);
                  const dy = Math.abs(tile.metadata.yIndex - cy);
                  // Kendisi dahil 3x3 grid (9 tile)
                  return dx <= 1 && dy <= 1;
                });
                
                // Her komşu tile'a ışık hüzmesi spawn et - KADEMELI IŞIK HÜZMELERI
                neighborTiles.forEach((tile, idx) => {
                  setTimeout(() => {
                    const beam = this.spawnLightTower(tile, 10);
                    
                    // Işık hüzmesi için özel mor renk
                    if (beam && beam.material) {
                      beam.material.emissiveColor = darkPrimaryColor;
                      beam.material.diffuseColor = darkPrimaryColor;
                    }
                  }, idx * 50); // Kademeli oluşum
                });
              });
            });
            if (this.hud) {
             this.hud.showMexShot();
              }
          }, 300);
          
          // Combo hakkı
          this.updateComboButtonState(true);
          
          // Projectile'dan son bir mor patlama
          const finalBurst = new BABYLON.ParticleSystem("darkBurst", 100, this.scene);
          finalBurst.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
          finalBurst.emitter = projectilePos;
          finalBurst.minEmitBox = new BABYLON.Vector3(-0.5, -0.5, -0.5);
          finalBurst.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5);
          finalBurst.color1 = new BABYLON.Color4(0.7, 0.3, 1.0, 1);
          finalBurst.color2 = new BABYLON.Color4(0.4, 0, 0.6, 1);
          finalBurst.colorDead = new BABYLON.Color4(0.2, 0, 0.3, 0);
          finalBurst.minSize = 0.3;
          finalBurst.maxSize = 0.8;
          finalBurst.minLifeTime = 0.3;
          finalBurst.maxLifeTime = 0.6;
          finalBurst.emitRate = 500;
          finalBurst.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
          finalBurst.minEmitPower = 1;
          finalBurst.maxEmitPower = 3;
          finalBurst.updateSpeed = 0.01;
          finalBurst.start();
          
          setTimeout(() => {
            finalBurst.stop();
            setTimeout(() => finalBurst.dispose(), 600);
          }, 100);
          
          // ÖNEMLİ: Projectile'ı temizle ve diziden çıkar
          if (projectile.pulseInterval) clearInterval(projectile.pulseInterval);
          if (projectile.electricParticles) projectile.electricParticles.dispose();
          projectile.dispose();
          this.projectiles.splice(i, 1);
          
          return true;
        }
      }
    }
  }

// ─── 2) RELIC tile tower vuruşu ve yutma (kara delik efekti) ───
for (let r = this.relicTowers.length - 1; r >= 0; r--) {
  const rt = this.relicTowers[r];
  
  // Kaba çarpışma kontrolü - relic tower merkezi ile projectile arası mesafe
  if (BABYLON.Vector3.Distance(rt.position, projectilePos) > 5) {
    continue; // Bu relic tower çok uzakta, atla
  }
  
  for (const seg of rt.getChildren()) {
    if (!(seg instanceof BABYLON.Mesh)) continue;
    
    const segPos = seg.getAbsolutePosition();
    const distance = BABYLON.Vector3.Distance(projectilePos, segPos);
    
    if (distance < checkRadius) {
      // Çarpışma noktasında mor enerji patlaması
      this.createDarkImpactEffect(segPos);
      
      // Ekran sarsıntısı
      this.screenShake(0.2, 150);
      
      // 2.a) İsabet alan segment'i koyu mora çevir - ANIMASYONLU
      if (seg.material) {
        // Orijinal rengi sakla
        const originalColor = seg.material.diffuseColor.clone();
        
        // Renk geçiş animasyonu
        let progress = 0;
        const colorTransition = setInterval(() => {
          progress += 0.1;
          if (progress >= 1) {
            clearInterval(colorTransition);
            seg.material.diffuseColor = darkPrimaryColor.clone();
            if (seg.material.emissiveColor) {
              seg.material.emissiveColor = darkSecondaryColor.clone();
            }
          } else {
            // Orijinal renkten mor renge geçiş
            const currentColor = BABYLON.Color3.Lerp(
              originalColor,
              darkPrimaryColor,
              progress
            );
            seg.material.diffuseColor = currentColor;
            
            if (seg.material.emissiveColor) {
              seg.material.emissiveColor = BABYLON.Color3.Lerp(
                originalColor.scale(0.5),
                darkSecondaryColor,
                progress
              );
            }
          }
        }, 20);
      }

      // 2.b) İsabet alan seg'e açık mor aura ekle - DAHA ETKILEYICI AURA
      const segAura = BABYLON.MeshBuilder.CreateSphere("darkSegAura", { diameter: 3, segments: 32 }, this.scene);
      segAura.parent = seg;
      segAura.position.set(0, 0, 0);
      
      const segAuraMat = new BABYLON.StandardMaterial("darkSegAuraMat", this.scene);
      segAuraMat.diffuseColor = darkAccentColor;
      segAuraMat.alpha = 0.2;
      segAuraMat.backFaceCulling = false;
      segAuraMat.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
      segAura.material = segAuraMat;
      
      // Aura pulse animasyonu
      let auraScale = 1;
      let auraAlpha = 0.2;
      const auraPulse = setInterval(() => {
        auraScale *= 1.05;
        auraAlpha *= 0.95;
        segAura.scaling.setAll(auraScale);
        segAuraMat.alpha = auraAlpha;
        
        if (auraScale > 2) {
          clearInterval(auraPulse);
          segAura.dispose();
        }
      }, 30);

      // 2.c) Alt ve üst komşuları seç
      const segZ = seg.position.z;
      const layerH = 0.9;
      const below = rt.getChildren().find(s => s instanceof BABYLON.Mesh && Math.abs(s.position.z - (segZ - layerH)) < 0.001);
      const above = rt.getChildren().find(s => s instanceof BABYLON.Mesh && Math.abs(s.position.z - (segZ + layerH)) < 0.001);
      const toSwallow = [seg, below, above].filter(Boolean);

      const center = seg.position.clone();

      const swallowedSegments = new Set();
      
      // Oluşturulan efekt mesh'lerini takip etmek için
      const effectMeshes = [];

      // Tower'ın baseTile referansını temizle
      if (rt.baseTile) {
        rt.baseTile.relicTower = null;
      }

      // DAHA ETKILEYICI YUTULMA ANIMASYONU
      toSwallow.forEach((tile, idx) => {
        swallowedSegments.add(tile.uniqueId);
        // Kademeli başlangıç
        setTimeout(() => {
          // Yutulma öncesi titreşim
          let vibrationPhase = 0;
          const vibrate = setInterval(() => {
            vibrationPhase += 0.2;
            tile.position.x += Math.sin(vibrationPhase) * 0.02;
            tile.position.y += Math.cos(vibrationPhase) * 0.02;
            
            if (vibrationPhase > Math.PI * 2) {
              clearInterval(vibrate);
              
              // Yutulma animasyonu
              const animFrames = 30;
              const posAnim = new BABYLON.Animation(
                "swallowPos", 
                "position", 
                60, 
                BABYLON.Animation.ANIMATIONTYPE_VECTOR3, 
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
              );
              
              // Easing fonksiyonu ekle - daha doğal hareket
              const easingFunction = new BABYLON.CircleEase();
              easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
              posAnim.setEasingFunction(easingFunction);
              
              posAnim.setKeys([
                { frame: 0, value: tile.position.clone() },
                { frame: animFrames, value: center }
              ]);
              
              const scaleAnim = new BABYLON.Animation(
                "swallowScale", 
                "scaling", 
                60, 
                BABYLON.Animation.ANIMATIONTYPE_VECTOR3, 
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
              );
              
              scaleAnim.setKeys([
                { frame: 0, value: tile.scaling.clone() },
                { frame: animFrames * 0.7, value: tile.scaling.scale(1.2) }, // Önce genişle
                { frame: animFrames, value: new BABYLON.Vector3(0.2, 0.2, 0.2) } // Sonra küçül
              ]);
              
              // Dönme animasyonu ekle
              const rotAnim = new BABYLON.Animation(
                "swallowRot", 
                "rotation", 
                60, 
                BABYLON.Animation.ANIMATIONTYPE_VECTOR3, 
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
              );
              
              rotAnim.setKeys([
                { frame: 0, value: tile.rotation.clone() },
                { frame: animFrames, value: new BABYLON.Vector3(
                  tile.rotation.x + Math.PI * 2,
                  tile.rotation.y + Math.PI,
                  tile.rotation.z + Math.PI / 2
                )}
              ]);
              
              tile.animations = [posAnim, scaleAnim, rotAnim];
              
              // Yutulma sırasında parçacık efekti
              const absorbParticles = new BABYLON.ParticleSystem("absorbParticles", 50, this.scene);
              absorbParticles.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
              absorbParticles.emitter = tile;
              absorbParticles.minEmitBox = new BABYLON.Vector3(-0.5, -0.5, -0.5);
              absorbParticles.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5);
              absorbParticles.color1 = new BABYLON.Color4(0.7, 0.3, 1.0, 1);
              absorbParticles.color2 = new BABYLON.Color4(0.4, 0, 0.6, 1);
              absorbParticles.colorDead = new BABYLON.Color4(0.2, 0, 0.3, 0);
              absorbParticles.minSize = 0.1;
              absorbParticles.maxSize = 0.3;
              absorbParticles.minLifeTime = 0.2;
              absorbParticles.maxLifeTime = 0.4;
              absorbParticles.emitRate = 30;
              absorbParticles.direction1 = new BABYLON.Vector3(-1, -1, -1);
              absorbParticles.direction2 = new BABYLON.Vector3(1, 1, 1);
              absorbParticles.minEmitPower = 0.5;
              absorbParticles.maxEmitPower = 1;
              absorbParticles.updateSpeed = 0.01;
              absorbParticles.start();
              
              this.scene.beginAnimation(tile, 0, animFrames, false, 1, () => {
                absorbParticles.stop();
                setTimeout(() => absorbParticles.dispose(), 400);
                
                // Yutulma sonrası efekt
                const aura = BABYLON.MeshBuilder.CreateSphere("darkAura", { diameter: 2.2, segments: 24 }, this.scene);
                aura.position = center.clone();
                // Parent'ı scene olarak ayarla, rt'ye bağlama
                aura.parent = null;
                
                // Efekt mesh'lerini takip listesine ekle
                effectMeshes.push(aura);
                
                const auraMat = new BABYLON.StandardMaterial("darkAuraMat", this.scene);
                auraMat.diffuseColor = darkPrimaryColor;
                auraMat.emissiveColor = darkSecondaryColor;
                auraMat.alpha = 0.25;
                auraMat.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
                auraMat.disableDepthWrite = true;
                auraMat.needDepthPrePass = true;
                auraMat.backFaceCulling = false;
                aura.material = auraMat;
                
                // Aura pulse animasyonu
                let auraSize = 1;
                const auraPulse = setInterval(() => {
                  auraSize = 1 + 0.2 * Math.sin(performance.now() * 0.002);
                  aura.scaling.setAll(auraSize);
                }, 30);
                
                setTimeout(() => {
                  clearInterval(auraPulse);
                  
                  // Aura fade out
                  let auraAlpha = 0.25;
                  const auraFade = setInterval(() => {
                    auraAlpha -= 0.01;
                    auraMat.alpha = auraAlpha;
                    
                    if (auraAlpha <= 0) {
                      clearInterval(auraFade);
                      aura.dispose();
                      
                      // Efekt mesh'lerini takip listesinden çıkar
                      const auraIndex = effectMeshes.indexOf(aura);
                      if (auraIndex !== -1) {
                        effectMeshes.splice(auraIndex, 1);
                      }
                    }
                  }, 30);
                }, 2000);

                const miniTile = BABYLON.MeshBuilder.CreateCylinder("miniDarkTile", {
                  diameterTop: 0.4,
                  diameterBottom: 0.4,
                  height: 0.15,
                  tessellation: 6
                }, this.scene);
                miniTile.position = center.clone();
                // Parent'ı scene olarak ayarla, rt'ye bağlama
                miniTile.parent = null;
                miniTile.rotation.x = Math.PI / 2;
                
                // Efekt mesh'lerini takip listesine ekle
                effectMeshes.push(miniTile);
                
                const miniMat = new BABYLON.StandardMaterial("miniDarkMat", this.scene);
                miniMat.diffuseColor = darkSecondaryColor;
                miniMat.emissiveColor = darkSecondaryColor;
                miniTile.material = miniMat;
                
                // Mini tile pulse animasyonu
                let miniScale = 1;
                const miniPulse = setInterval(() => {
                  miniScale = 1 + 0.1 * Math.sin(performance.now() * 0.003);
                  miniTile.scaling.setAll(miniScale);
                }, 30);
                
                // 2 saniye sonra mini tile'ı temizle
                setTimeout(() => {
                  clearInterval(miniPulse);
                  
                  // Mini tile fade out
                  let miniAlpha = 1;
                  const miniFade = setInterval(() => {
                    miniAlpha -= 0.05;
                    miniMat.alpha = miniAlpha;
                    
                    if (miniAlpha <= 0) {
                      clearInterval(miniFade);
                      miniTile.dispose();
                      
                      // Efekt mesh'lerini takip listesinden çıkar
                      const miniIndex = effectMeshes.indexOf(miniTile);
                      if (miniIndex !== -1) {
                        effectMeshes.splice(miniIndex, 1);
                      }
                    }
                  }, 30);
                }, 2000);

                // Segment'i parent'tan ayır ve temizle
                tile.parent = null;
                tile.dispose();
                
                // Tüm segmentler yutulduysa tower'ı temizle
                const remainingSegments = rt.getChildren().filter(
                  s => s instanceof BABYLON.Mesh && !swallowedSegments.has(s.uniqueId)
                );
                
                if (remainingSegments.length === 0) {
                  // Tower'ı diziden çıkar
                  const rtIndex = this.relicTowers.indexOf(rt);
                  if (rtIndex !== -1) {
                    this.relicTowers.splice(rtIndex, 1);
                  }
                  
                  // Tower'ı temizle (2 saniye sonra - efektlerin tamamlanması için)
                  setTimeout(() => {
                    if (rt && !rt.isDisposed()) {
                      // Tüm kalan alt elemanları temizle
                      while (rt.getChildren().length > 0) {
                        const child = rt.getChildren()[0];
                        child.parent = null;
                        child.dispose();
                      }
                      rt.dispose();
                    }
                    
                    // 3 saniye sonra tüm efekt mesh'lerini temizle
                    setTimeout(() => {
                      effectMeshes.forEach(mesh => {
                        if (mesh && !mesh.isDisposed()) {
                          mesh.dispose();
                        }
                      });
                    }, 3000);
                  }, 2000);
                }
              });
            }
          }, 20);
        }, idx * 100); // Kademeli başlangıç
      });

      // Projectile etrafında mor aura - DAHA ETKILEYICI
      const projAura = BABYLON.MeshBuilder.CreateSphere("projAura", { diameter: 3, segments: 24 }, this.scene);
      projAura.parent = projectile;
      projAura.position.set(0, 0, 0);

      const pMat = new BABYLON.StandardMaterial("projAuraMat", this.scene);
      pMat.diffuseColor = darkAccentColor;
      pMat.emissiveColor = darkPrimaryColor;
      pMat.alpha = 0.5;
      pMat.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
      pMat.disableDepthWrite = true;
      pMat.needDepthPrePass = true;
      pMat.backFaceCulling = false;
      projAura.material = pMat;
      
      // Aura pulse animasyonu
      let projAuraScale = 1;
      const projAuraPulse = setInterval(() => {
        projAuraScale = 1 + 0.3 * Math.sin(performance.now() * 0.005);
        projAura.scaling.setAll(projAuraScale);
      }, 30);
      
      setTimeout(() => {
        clearInterval(projAuraPulse);
        projAura.dispose();
      }, 500);

      // Combo sayaç
      this.darkSingleHitCount++;
      if (this.darkSingleHitCount >= 3) {
        this.updateComboButtonState(true);
        this.darkSingleHitCount = 0;
      }

      // ÖNEMLİ: Projectile'ı temizle ve diziden çıkar
      if (projectile.pulseInterval) clearInterval(projectile.pulseInterval);
      if (projectile.electricParticles) projectile.electricParticles.dispose();
      projectile.dispose();
      this.projectiles.splice(i, 1);
      
      // 5 saniye sonra temizleme işlemi yap
      setTimeout(() => {
        this.cleanupAllMeshes();
      }, 5000);
      
      return true;
    }
  }
}

return false;

}

// Yeni yardımcı fonksiyon - Mor enerji çarpma efekti
createDarkImpactEffect(position) {
  // Mor ışık patlaması
  const impactLight = new BABYLON.PointLight("darkImpactLight", position.clone(), this.scene);
  impactLight.diffuse = new BABYLON.Color3(0.7, 0.3, 1.0);
  impactLight.intensity = 2;
  impactLight.range = 8;
  
  // Işık animasyonu
  const lightAnim = new BABYLON.Animation(
    "impactLightAnim", 
    "intensity", 
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );
  
  lightAnim.setKeys([
    { frame: 0, value: 2 },
    { frame: 5, value: 4 },
    { frame: 20, value: 0 }
  ]);
  
  impactLight.animations = [lightAnim];
  this.scene.beginAnimation(impactLight, 0, 20, false, 1, () => {
    impactLight.dispose();
  });
  
  // Parçacık patlaması
  const impactBurst = new BABYLON.ParticleSystem("darkImpactBurst", 150, this.scene);
  impactBurst.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
  impactBurst.emitter = position.clone();
  impactBurst.minEmitBox = new BABYLON.Vector3(-0.3, -0.3, -0.3);
  impactBurst.maxEmitBox = new BABYLON.Vector3(0.3, 0.3, 0.3);
  impactBurst.color1 = new BABYLON.Color4(0.7, 0.3, 1.0, 1);
  impactBurst.color2 = new BABYLON.Color4(0.4, 0, 0.6, 1);
  impactBurst.colorDead = new BABYLON.Color4(0.2, 0, 0.3, 0);
  impactBurst.minSize = 0.2;
  impactBurst.maxSize = 0.5;
  impactBurst.minLifeTime = 0.2;
  impactBurst.maxLifeTime = 0.4;
  impactBurst.emitRate = 600;
  impactBurst.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
  impactBurst.gravity = new BABYLON.Vector3(0, 0, 0);
  impactBurst.direction1 = new BABYLON.Vector3(-1, -1, -1);
  impactBurst.direction2 = new BABYLON.Vector3(1, 1, 1);
  impactBurst.minEmitPower = 1;
  impactBurst.maxEmitPower = 3;
  impactBurst.updateSpeed = 0.01;
  impactBurst.start();
  
  setTimeout(() => {
    impactBurst.stop();
    setTimeout(() => impactBurst.dispose(), 400);
  }, 100);
  
  // Mor enerji dalgası
  const energyWave = BABYLON.MeshBuilder.CreateDisc("darkEnergyWave", {
    radius: 0.1,
    tessellation: 36,
    sideOrientation: BABYLON.Mesh.DOUBLESIDE
  }, this.scene);
  
  energyWave.position = position.clone();
  energyWave.rotation.x = Math.PI / 2;
  
  const waveMat = new BABYLON.StandardMaterial("wavemat", this.scene);
  waveMat.emissiveColor = new BABYLON.Color3(0.7, 0.3, 1.0);
  waveMat.alpha = 0.7;
  waveMat.disableLighting = true;
  energyWave.material = waveMat;
  
  // Dalga büyüme animasyonu
  let waveSize = 0.1;
  const waveGrow = setInterval(() => {
    waveSize *= 1.2;
    energyWave.scaling.x = waveSize;
    energyWave.scaling.y = waveSize;
    waveMat.alpha *= 0.9;
    
    if (waveSize > 8) {
      clearInterval(waveGrow);
      energyWave.dispose();
    }
  }, 30);
}

// animateTowerFall fonksiyonunu da güncelleyelim - daha güvenli hale getirelim
animateTowerFall(towerNode, onComplete) {
  // Tower'ın zaten düşmekte olup olmadığını kontrol et
  if (towerNode._isFalling) {
    console.warn("Tower already falling, skipping duplicate animation");
    return;
  }
  
  towerNode._isFalling = true;
  
  const fallAnim = new BABYLON.Animation("towerFallAnim", "position.z", 60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  const currentZ = towerNode.position.z;
  const targetZ  = currentZ - 10;
  fallAnim.setKeys([
    { frame:  0, value: currentZ },
    { frame: 30, value: targetZ }
  ]);
  towerNode.animations = [fallAnim];

  this.scene.beginAnimation(towerNode, 0, 30, false, 1, () => {
    // collapse bittiğinde önce callback'i çağır
    if (onComplete && typeof onComplete === 'function') {
      try {
        onComplete();
      } catch (error) {
        console.error("Error in tower fall callback:", error);
      }
    }

    // sonra tower'ı kaldır ve oyun sonu kontrolü
    const idx = this.towers.indexOf(towerNode);
    if (idx !== -1) this.towers.splice(idx, 1);
    
    // Tower'ı dispose etmeden önce tüm child'larını kontrol et
    const children = towerNode.getChildren();
    children.forEach(child => {
      if (child && child.dispose) {
        child.dispose();
      }
    });
    
    towerNode.dispose();
    this.disposedTowers++;
    
    if (this.disposedTowers >= this.targetTowers) {
      this.onGameOver();
    }
  });
}

// spawnLightTower fonksiyonunu da iyileştirelim - duplicate kontrolü ekleyelim
spawnLightTower(tile, height = 10) {
  // Aynı tile'da zaten bir ışık hüzmesi var mı kontrol et
  const existingBeam = this.tileTowers.find(beam => 
    Math.abs(beam.position.x - tile.position.x) < 0.1 &&
    Math.abs(beam.position.y - tile.position.y) < 0.1
  );
  
  if (existingBeam) {
    console.log("Light beam already exists at this position, skipping");
    return;
  }
  
  // Işık hüzmesi oluştur
  const beam = BABYLON.MeshBuilder.CreateCylinder("lightBeam", {
    diameterTop: 0.4,
    diameterBottom: 0.4,
    height: height,
    tessellation: 6
  }, this.scene);
  
  beam.parent = this.worldRoot;
  
  // STANDART MATERYAL - Tüm runlar için aynı
  const beamMat = new BABYLON.StandardMaterial("beamMat", this.scene);
  
  // Işık hüzmesi rengi - Run tipine göre değişebilir
  let beamColor;
  
  switch (this.initialFace) {
    case 'solar':
      beamColor = new BABYLON.Color3(1, 0.8, 0); // Sarı-turuncu
      break;
    case 'em':
      beamColor = new BABYLON.Color3(0, 0.6, 1); // Mavi
      break;
    case 'gravity':
      beamColor = new BABYLON.Color3(0.2, 1, 0.2); // Yeşil
      break;
    case 'dark':
      beamColor = new BABYLON.Color3(0.5, 0, 0.5); // Mor
      break;
    case 'hexcraft':
      beamColor = new BABYLON.Color3(0.2, 0.8, 1); // Açık mavi
      break;
    default:
      beamColor = new BABYLON.Color3(1, 1, 0); // Varsayılan sarı
  }
  
  // Materyal ayarları - Tüm runlar için standart
  beamMat.emissiveColor = beamColor;
  beamMat.diffuseColor = beamColor;
  beamMat.alpha = 0.6; // Daha belirgin olması için alpha değeri artırıldı
  beamMat.specularColor = new BABYLON.Color3(1, 1, 1);
  beamMat.specularPower = 32;
  
  beam.material = beamMat;
  
  // DÖNDÜR - Z eksenine yatır
  beam.rotation.x = Math.PI / 2;
  
  // TAM POZİSYON: tile'ın pozisyonundan yukarıya Z yönünde uzasın
  beam.position.x = tile.position.x;
  beam.position.y = tile.position.y;
  beam.position.z = tile.position.z + 0.5 + (height / 2);
  
  // Glow efekti ekle - Tüm runlar için standart parlaklık
  if (this.glowLayer) {
    this.glowLayer.addIncludedOnlyMesh(beam);
    this.glowLayer.intensity = 0.7; // Standart glow yoğunluğu
  }
  
  // Işık hüzmesi etrafında particle efekti
  const particles = new BABYLON.ParticleSystem("beamParticles", 50, this.scene);
  particles.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
  particles.emitter = beam;
  particles.minEmitBox = new BABYLON.Vector3(-0.2, -height/2, -0.2);
  particles.maxEmitBox = new BABYLON.Vector3(0.2, height/2, 0.2);
  particles.color1 = new BABYLON.Color4(beamColor.r, beamColor.g, beamColor.b, 1);
  particles.color2 = new BABYLON.Color4(beamColor.r, beamColor.g, beamColor.b, 0.7);
  particles.colorDead = new BABYLON.Color4(beamColor.r, beamColor.g, beamColor.b, 0);
  particles.minSize = 0.1;
  particles.maxSize = 0.3;
  particles.minLifeTime = 0.2;
  particles.maxLifeTime = 0.6;
  particles.emitRate = 20;
  particles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
  particles.gravity = new BABYLON.Vector3(0, 0, 0);
  particles.direction1 = new BABYLON.Vector3(-0.1, -0.1, -0.1);
  particles.direction2 = new BABYLON.Vector3(0.1, 0.1, 0.1);
  particles.minAngularSpeed = 0;
  particles.maxAngularSpeed = Math.PI;
  particles.minEmitPower = 0.1;
  particles.maxEmitPower = 0.3;
  particles.updateSpeed = 0.01;
  particles.start();
  
  // Particle sistemi referansını beam'e ekle (temizlik için)
  beam.particleSystem = particles;
  
  // Işık kaynağı ekle
  const beamLight = new BABYLON.PointLight("beamLight", new BABYLON.Vector3(beam.position.x, beam.position.y, beam.position.z + height/2), this.scene);
  beamLight.diffuse = beamColor;
  beamLight.specular = beamColor;
  beamLight.intensity = 0.7;
  beamLight.range = 10;
  
  // Işık referansını beam'e ekle (temizlik için)
  beam.light = beamLight;
  
  // Pulse animasyonu
  let pulseTime = 0;
  beam.pulseAnimation = () => {
    pulseTime += 0.05;
    const pulseFactor = 0.9 + Math.sin(pulseTime) * 0.1;
    
    if (beam.scaling) {
      beam.scaling.x = pulseFactor;
      beam.scaling.z = pulseFactor;
    }
    
    if (beam.light) {
      beam.light.intensity = 0.5 + Math.sin(pulseTime) * 0.2;
    }
  };
  
  this.scene.registerBeforeRender(beam.pulseAnimation);
  
  // Temizlik fonksiyonu
  beam.dispose = function() {
    if (this.particleSystem) {
      this.particleSystem.stop();
      this.particleSystem.dispose();
    }
    
    if (this.light) {
      this.light.dispose();
    }
    
    if (this.pulseAnimation && this.scene) {
      this.scene.unregisterBeforeRender(this.pulseAnimation);
    }
    
    BABYLON.Mesh.prototype.dispose.call(this);
  };
  
  this.tileTowers.push(beam);
  return beam;
}


wexSingleFire(projectile, i) {
  for (let t = this.towers.length - 1; t >= 0; t--) {
    const tower = this.towers[t];
    for (const seg of tower.getChildren()) {
      if (seg.isSpecial && seg.specialColor === 'blue') {
        const segPos = seg.getAbsolutePosition();
        const distance = BABYLON.Vector3.Distance(projectile.position, segPos);
         if (distance < 1.5) {
          // 1) Tüm segmentlerin rengini WEX rengine çevir (SADECE BUZ-MAVİSİ)
          const wexColor = new BABYLON.Color3(0.6, 0.8, 1);
          tower.getChildren().forEach(child => {
            if (child.material && child.material.diffuseColor) {
              child.material.diffuseColor.copyFrom(wexColor);
              if (child.material.emissiveColor) child.material.emissiveColor.copyFrom(wexColor);
            }
          });

          // 2) Kuleyi animasyonla düşür, animasyon bitince diziden çıkar
setTimeout(() => {
  this.animateTowerFall(tower, () => {
    const { xIndex: cx, yIndex: cy } = tower.baseTile.metadata;
    this.baseTiles
      .filter(tile =>
        Math.abs(tile.metadata.xIndex - cx) <= 1 &&
        Math.abs(tile.metadata.yIndex - cy) <= 1
      )
      .forEach(tile => this.spawnLightTower(tile, 10));
  });
  // Diziden çıkarma burada!
  const idx = this.towers.indexOf(tower);
  if (idx !== -1) this.towers.splice(idx, 1);
}, 500);

// Yeni: WEX Shot bildirimi
if (this.hud) {
  this.hud.showWexShot();
}

          // Combo hakkı ver
this.updateComboButtonState(true);
          if (projectile.pulseInterval) clearInterval(projectile.pulseInterval);
          if (projectile.electricParticles) projectile.electricParticles.dispose();
          // Mermiyi temizle
          projectile.dispose();
          this.projectiles.splice(i, 1);

          return true;
        }
      }
    }
  }
  return false;
}

createElectricZapEffect(position) {
  const zap = new BABYLON.ParticleSystem("zap", 80, this.scene);
  zap.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
  zap.emitter = position.clone();
  zap.minEmitBox = new BABYLON.Vector3(-0.2, 0, -0.2);
  zap.maxEmitBox = new BABYLON.Vector3(0.2, 0, 0.2);
  zap.color1 = new BABYLON.Color4(0.8, 1, 1, 1);
  zap.color2 = new BABYLON.Color4(0.2, 0.8, 1, 0.7);
  zap.colorDead = new BABYLON.Color4(0.2, 0.8, 1, 0);
  zap.minSize = 0.1;
  zap.maxSize = 0.25;
  zap.minLifeTime = 0.05;
  zap.maxLifeTime = 0.15;
  zap.emitRate = 400;
  zap.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
  zap.direction1 = new BABYLON.Vector3(-1, 0, -1);
  zap.direction2 = new BABYLON.Vector3(1, 0, 1);
  zap.minEmitPower = 2;
  zap.maxEmitPower = 5;
  zap.updateSpeed = 0.02;
  zap.start();
  setTimeout(() => zap.stop(), 120);
  setTimeout(() => zap.dispose(), 400);
}
createLightningArc(start, end, scene, color = new BABYLON.Color3(0.2, 0.8, 1)) {
  // start ve end: BABYLON.Vector3
  // color: BABYLON.Color3
  // scene: BABYLON.Scene

  // Zigzag noktaları oluştur
  const points = [];
  const segments = 12;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Doğrusal interpolasyon
    const pos = BABYLON.Vector3.Lerp(start, end, t);
    // Zigzag için rastgele sapma
    if (i !== 0 && i !== segments) {
      pos.x += (Math.random() - 0.5) * 0.3;
      pos.y += (Math.random() - 0.5) * 0.3;
      pos.z += (Math.random() - 0.5) * 0.3;
    }
    points.push(pos);
  }

  // Çizgi mesh'i oluştur
  const lightning = BABYLON.MeshBuilder.CreateLines("lightningArc", { points }, scene);
  lightning.color = color;
  lightning.alwaysSelectAsActiveMesh = true;
  lightning.isPickable = false;

  // Hafif parıltı için glow layer varsa ekle
  if (scene.getGlowLayerByName && scene.getGlowLayerByName("glow")) {
    scene.getGlowLayerByName("glow").addIncludedOnlyMesh(lightning);
  }

  // Kısa ömürlü: 80ms sonra sil
  setTimeout(() => {
    lightning.dispose();
  }, 80);

  return lightning;
}

wexComboFire() {
  const comboDuration = 10000; // 10 saniye
  const shootInterval = 200;   // Her 200ms'de bir atış kontrolü
  const startTime = performance.now();
  let lastShootTime = startTime;

  // Ekran sarsıntısı ile başla (hafif)
  this.screenShake(0.2, 200);

  // Combo durumunu aktif et
  this.wexComboActive = true;
  this.wexComboTimer = comboDuration;

    // Yeni: WEX Combo süre sayacı
  if (this.hud) {
    this.hud.showWexComboTimer(comboDuration);
  }

  // Buff altıgeni oluştur - minimal tasarım
  const buffHex = BABYLON.MeshBuilder.CreateCylinder("wexBuffHex", {
    diameterTop: 1.8,
    diameterBottom: 1.8,
    height: 0.3,
    tessellation: 6
  }, this.scene);

  // Daha zarif materyal
  const buffMat = new BABYLON.StandardMaterial("wexBuffMat", this.scene);
  buffMat.diffuseColor = new BABYLON.Color3(0.7, 0.9, 1);
  buffMat.emissiveColor = new BABYLON.Color3(0.6, 0.8, 1);
  buffMat.specularColor = new BABYLON.Color3(1, 1, 1);
  buffMat.specularPower = 64;
  buffMat.alpha = 0.8;
  buffHex.material = buffMat;
  buffHex.parent = this.goldberg;
  buffHex.position = new BABYLON.Vector3(0, 3, 0);
  buffHex.rotation.x = Math.PI / 2;
  this.wexComboMesh = buffHex;

  // Hafif ışık efekti
  const hexLight = new BABYLON.PointLight("hexLight", buffHex.getAbsolutePosition(), this.scene);
  hexLight.diffuse = new BABYLON.Color3(0.6, 0.8, 1);
  hexLight.intensity = 1;
  hexLight.range = 8;

  // Buz buğusu parçacık sistemi - minimal
  const iceMist = new BABYLON.ParticleSystem("iceMist", 50, this.scene);
  iceMist.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
  iceMist.emitter = buffHex;
  iceMist.minEmitBox = new BABYLON.Vector3(-0.8, -0.1, -0.8);
  iceMist.maxEmitBox = new BABYLON.Vector3(0.8, 0.1, 0.8);
  iceMist.color1 = new BABYLON.Color4(0.8, 0.9, 1, 0.2);
  iceMist.color2 = new BABYLON.Color4(0.6, 0.8, 1, 0.3);
  iceMist.colorDead = new BABYLON.Color4(0.5, 0.7, 1, 0);
  iceMist.minSize = 0.2;
  iceMist.maxSize = 0.4;
  iceMist.minLifeTime = 0.5;
  iceMist.maxLifeTime = 1;
  iceMist.emitRate = 30;
  iceMist.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
  iceMist.minEmitPower = 0.1;
  iceMist.maxEmitPower = 0.3;
  iceMist.updateSpeed = 0.01;
  iceMist.start();

  // Pulse animasyonu - zarif
  let pulseScale = 1;
  let rotationZ = 0;
  const pulseAnim = () => {
    // Pulse efekti
    pulseScale = 1 + 0.1 * Math.sin(performance.now() * 0.003);
    buffHex.scaling.x = pulseScale;
    buffHex.scaling.z = pulseScale;
    
    // Dönüş animasyonu - yavaş ve zarif
    rotationZ += 0.01;
    buffHex.rotation.z = rotationZ;
    
    // Işık yoğunluğu dalgalanması
    hexLight.intensity = 1 + 0.3 * Math.sin(performance.now() * 0.004);
    hexLight.position = buffHex.getAbsolutePosition();
  };
  this.scene.registerBeforeRender(pulseAnim);

  // Ice Beam oluşturma fonksiyonu - daha zarif
  const createIceBeam = (target) => {
    const origin = this.wexComboMesh.getAbsolutePosition();
    const targetPos = target.getAbsolutePosition();
    const direction = targetPos.subtract(origin).normalize();
    const distance = BABYLON.Vector3.Distance(origin, targetPos);

    // Buz ışını mesh'i
    const beam = BABYLON.MeshBuilder.CreateCylinder("iceBeam", {
      height: distance,
      diameter: 0.3,
      tessellation: 8
    }, this.scene);

    // Işın materyali - zarif
    const beamMat = new BABYLON.StandardMaterial("beamMat", this.scene);
    beamMat.diffuseColor = new BABYLON.Color3(0.7, 0.9, 1);
    beamMat.emissiveColor = new BABYLON.Color3(0.6, 0.8, 1);
    beamMat.alpha = 0.7;
    beamMat.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
    beam.material = beamMat;

    // Işının pozisyonu ve yönü
    const midPoint = origin.add(targetPos).scale(0.5);
    beam.position = midPoint;
    beam.lookAt(targetPos);
    beam.rotate(BABYLON.Axis.X, Math.PI / 2);

    // Buz parçacıkları - minimal
    const particles = new BABYLON.ParticleSystem("iceParticles", 100, this.scene);
    particles.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
    particles.emitter = beam;
    particles.minEmitBox = new BABYLON.Vector3(-0.1, -distance/2, -0.1);
    particles.maxEmitBox = new BABYLON.Vector3(0.1, distance/2, 0.1);
    particles.color1 = new BABYLON.Color4(0.8, 0.9, 1, 0.8);
    particles.color2 = new BABYLON.Color4(0.6, 0.8, 1, 0.6);
    particles.colorDead = new BABYLON.Color4(0.5, 0.7, 1, 0);
    particles.minSize = 0.1;
    particles.maxSize = 0.2;
    particles.minLifeTime = 0.1;
    particles.maxLifeTime = 0.3;
    particles.emitRate = 100;
    particles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    particles.minEmitPower = 0.1;
    particles.maxEmitPower = 0.2;
    particles.updateSpeed = 0.01;
    particles.start();

    // Hedef noktasında buz patlaması - minimal
    const impactBurst = new BABYLON.ParticleSystem("impactBurst", 50, this.scene);
    impactBurst.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
    impactBurst.emitter = targetPos;
    impactBurst.color1 = new BABYLON.Color4(0.8, 0.9, 1, 1);
    impactBurst.color2 = new BABYLON.Color4(0.6, 0.8, 1, 0.8);
    impactBurst.colorDead = new BABYLON.Color4(0.5, 0.7, 1, 0);
    impactBurst.minSize = 0.1;
    impactBurst.maxSize = 0.3;
    impactBurst.minLifeTime = 0.2;
    impactBurst.maxLifeTime = 0.4;
    impactBurst.emitRate = 0;
    impactBurst.manualEmitCount = 50;
    impactBurst.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    impactBurst.minEmitPower = 0.5;
    impactBurst.maxEmitPower = 1;
    impactBurst.start();
    
    setTimeout(() => {
      impactBurst.dispose();
    }, 400);

    // Işın efekti animasyonu - yumuşak
    let alpha = 1;
    const beamAnim = () => {
      if (alpha <= 0) {
        particles.stop();
        setTimeout(() => {
          particles.dispose();
          beam.dispose();
        }, 300);
        return;
      }

      alpha -= 0.05;
      beamMat.alpha = alpha * 0.7;
      requestAnimationFrame(beamAnim);
    };

    // Tower'ı buz efekti ile vur
    const tower = this.towers.find(t => t.getChildren().includes(target));
    if (tower) {
      // Kademeli renk değişimi
      tower.getChildren().forEach((seg, index) => {
        if (seg.material) {
          setTimeout(() => {
            // Orijinal rengi sakla
            const originalColor = seg.material.diffuseColor.clone();
            const targetColor = new BABYLON.Color3(0.7, 0.9, 1);
            
            // Renk geçiş animasyonu
            let progress = 0;
            const colorTransition = setInterval(() => {
              progress += 0.1;
              if (progress >= 1) {
                clearInterval(colorTransition);
                seg.material.diffuseColor = targetColor;
                seg.material.emissiveColor = new BABYLON.Color3(0.5, 0.8, 1);
              } else {
                seg.material.diffuseColor = BABYLON.Color3.Lerp(
                  originalColor,
                  targetColor,
                  progress
                );
                
                if (seg.material.emissiveColor) {
                  seg.material.emissiveColor = BABYLON.Color3.Lerp(
                    originalColor.scale(0.5),
                    new BABYLON.Color3(0.5, 0.8, 1),
                    progress
                  );
                }
              }
            }, 20);
          }, index * 50); // Kademeli renk değişimi
        }
      });

      // Tower'ı düşür
      setTimeout(() => {
        // Buz kırılma parçacıkları - minimal
        const breakPos = tower.position.clone();
        breakPos.y += 1;
        
        const iceBreak = new BABYLON.ParticleSystem("iceBreak", 100, this.scene);
        iceBreak.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
        iceBreak.emitter = breakPos;
        iceBreak.color1 = new BABYLON.Color4(0.8, 0.9, 1, 1);
        iceBreak.color2 = new BABYLON.Color4(0.6, 0.8, 1, 0.8);
        iceBreak.colorDead = new BABYLON.Color4(0.5, 0.7, 1, 0);
        iceBreak.minSize = 0.1;
        iceBreak.maxSize = 0.2;
        iceBreak.minLifeTime = 0.3;
        iceBreak.maxLifeTime = 0.6;
        iceBreak.emitRate = 0;
        iceBreak.manualEmitCount = 100;
        iceBreak.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
        iceBreak.minEmitPower = 0.5;
        iceBreak.maxEmitPower = 1.5;
        iceBreak.gravity = new BABYLON.Vector3(0, -9.81, 0);
        iceBreak.start();
        
        setTimeout(() => iceBreak.dispose(), 600);
        
        this.animateTowerFall(tower, () => {
          const { xIndex: cx, yIndex: cy } = tower.baseTile.metadata;
          
          // Komşu tile'lara ışık kuleleri spawn et
          this.baseTiles
            .filter(tile => 
              Math.abs(tile.metadata.xIndex - cx) <= 1 && 
              Math.abs(tile.metadata.yIndex - cy) <= 1
            )
            .forEach((tile, idx) => {
              setTimeout(() => {
                this.spawnLightTower(tile, 10);
              }, idx * 80); // Kademeli ışık kuleleri
            });
        });
        
        // Tower'ı diziden çıkar
        const idx = this.towers.indexOf(tower);
        if (idx !== -1) this.towers.splice(idx, 1);
      }, 300);
    }

    // Işın animasyonunu başlat
    setTimeout(beamAnim, 200);
  };

  // Performans optimizasyonu için değişkenler
  let frameCount = 0;
  const checkInterval = 2; // Her 2 frame'de bir kontrol et

  // Otomatik atış fonksiyonu
  const autoShoot = () => {
    const currentTime = performance.now();
    
    if (currentTime - startTime >= comboDuration) {
      this.wexComboActive = false;
      this.wexComboTimer = 0;
      this.scene.unregisterBeforeRender(pulseAnim);
      
      // Fade out animasyonu - zarif
      let fadeAlpha = 1;
      const fadeOut = () => {
        fadeAlpha -= 0.05;
        
        if (fadeAlpha <= 0) {
          // Tüm kaynakları temizle
          iceMist.stop();
          
          // Tüm mesh'leri temizle
          buffHex.dispose();
          hexLight.dispose();
          
          // Son bir temizlik
          setTimeout(() => {
            iceMist.dispose();
            this.wexComboMesh = null;
          }, 300);
        } else {
          // Alfa değerlerini azalt
          buffMat.alpha = fadeAlpha * 0.8;
          hexLight.intensity = fadeAlpha;
          
          requestAnimationFrame(fadeOut);
        }
      };
      
      fadeOut();
      return;
    }

    this.wexComboTimer = comboDuration - (currentTime - startTime);

    // Her frame'de değil, belirli aralıklarla kontrol et (performans için)
    frameCount++;
    if (frameCount % checkInterval !== 0) {
      requestAnimationFrame(autoShoot);
      return;
    }

    if (currentTime - lastShootTime >= shootInterval) {
      // Mavi tile'ları bul
      const blueTiles = [];
      this.towers.forEach(tower => {
        if (tower && !tower.isDisposed()) {
          const towerBlueTiles = tower.getChildren().filter(seg => 
            seg instanceof BABYLON.Mesh && seg.isSpecial && seg.specialColor === 'blue'
          );
          
          blueTiles.push(...towerBlueTiles);
        }
      });

      // Her mavi tile için buz ışını oluştur - maksimum 3 tile aynı anda
      const maxTilesPerShot = 3;
      const tilesToProcess = blueTiles.slice(0, maxTilesPerShot);
      
      tilesToProcess.forEach((tile, index) => {
        setTimeout(() => {
          createIceBeam(tile);
        }, index * 100); // Kademeli atış
      });

      lastShootTime = currentTime;
    }

    requestAnimationFrame(autoShoot);
  };

  // Otomatik atışı başlat
  autoShoot();
  
  // Temizleme fonksiyonu
  const cleanupFunction = () => {
    if (this.wexComboActive) {
      this.wexComboActive = false;
      this.wexComboTimer = 0;
      this.scene.unregisterBeforeRender(pulseAnim);
      
      // Tüm kaynakları temizle
      iceMist.stop();
      
      setTimeout(() => {
        iceMist.dispose();
        
        if (buffHex && !buffHex.isDisposed()) {
          buffHex.dispose();
        }
        
        if (hexLight && !hexLight.isDisposed()) {
          hexLight.dispose();
        }
        
        this.wexComboMesh = null;
      }, 300);
    }
  };
  
  // 10 saniye sonra zorla temizlik yap (güvenlik önlemi)
  setTimeout(cleanupFunction, 10000);
}

// Geliştirilmiş WEX projectile ateşleme
// Geliştirilmiş WEX projectile ateşleme
fireWexProjectile(target) {
  if (!this.wexComboMesh || this.wexComboMesh.isDisposed()) return;
  
  const origin = this.wexComboMesh.getAbsolutePosition().clone();
  const targetPos = target.getAbsolutePosition();
  
  // Hafif ekran sarsıntısı
  this.screenShake(0.1, 100);
  
  // Mermi oluştur - daha detaylı buz kristali
  const proj = BABYLON.MeshBuilder.CreatePolyhedron("wexProj", {
    type: 1, // Oktahedron (8 yüzlü)
    size: 0.4
  }, this.scene);

  // Daha etkileyici materyal
  const projMat = new BABYLON.StandardMaterial("wexProjMat", this.scene);
  projMat.diffuseColor = new BABYLON.Color3(0.7, 0.9, 1);
  projMat.emissiveColor = new BABYLON.Color3(0.5, 0.8, 1);
  projMat.specularColor = new BABYLON.Color3(1, 1, 1);
  projMat.specularPower = 128;
  projMat.alpha = 0.9;
  proj.material = projMat;

  // Başlangıç pozisyonu
  proj.position = origin.clone();
  
  // Atış efekti
  const muzzleFlash = new BABYLON.ParticleSystem("muzzleFlash", 50, this.scene);
  muzzleFlash.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
  muzzleFlash.emitter = origin;
  muzzleFlash.color1 = new BABYLON.Color4(0.9, 0.95, 1, 1);
  muzzleFlash.color2 = new BABYLON.Color4(0.7, 0.85, 1, 1);
  muzzleFlash.colorDead = new BABYLON.Color4(0.5, 0.7, 1, 0);
  muzzleFlash.minSize = 0.2;
  muzzleFlash.maxSize = 0.5;
  muzzleFlash.minLifeTime = 0.1;
  muzzleFlash.maxLifeTime = 0.3;
  muzzleFlash.emitRate = 0;
  muzzleFlash.manualEmitCount = 50;
  muzzleFlash.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
  muzzleFlash.minEmitPower = 0.5;
  muzzleFlash.maxEmitPower = 1;
  muzzleFlash.updateSpeed = 0.01;
  muzzleFlash.start();
  
  setTimeout(() => muzzleFlash.dispose(), 300);

  // Yön ve hız
  const direction = targetPos.subtract(origin).normalize();
  const speed = 2;
  
  // Mermi ışık efekti
  const projLight = new BABYLON.PointLight("projLight", proj.position, this.scene);
  projLight.diffuse = new BABYLON.Color3(0.6, 0.8, 1);
  projLight.intensity = 1;
  projLight.range = 3;

  // Particle trail - daha etkileyici
  const trail = new BABYLON.ParticleSystem("wexTrail", 150, this.scene);
  trail.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
  trail.emitter = proj;
  trail.minEmitBox = new BABYLON.Vector3(-0.1, -0.1, -0.1);
  trail.maxEmitBox = new BABYLON.Vector3(0.1, 0.1, 0.1);
  trail.color1 = new BABYLON.Color4(0.8, 0.9, 1, 0.8);
  trail.color2 = new BABYLON.Color4(0.6, 0.8, 1, 0.6);
  trail.colorDead = new BABYLON.Color4(0.5, 0.7, 1, 0);
  trail.minSize = 0.1;
  trail.maxSize = 0.3;
  trail.minLifeTime = 0.2;
  trail.maxLifeTime = 0.4;
  trail.emitRate = 150;
  trail.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
  trail.minEmitPower = 0.1;
  trail.maxEmitPower = 0.3;
  trail.updateSpeed = 0.01;
  trail.start();
  
  // Buz kristalleri trail
  const crystalTrail = new BABYLON.ParticleSystem("crystalTrail", 30, this.scene);
  crystalTrail.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
  crystalTrail.emitter = proj;
  crystalTrail.minEmitBox = new BABYLON.Vector3(-0.05, -0.05, -0.05);
  crystalTrail.maxEmitBox = new BABYLON.Vector3(0.05, 0.05, 0.05);
  crystalTrail.color1 = new BABYLON.Color4(0.9, 0.95, 1, 1);
  crystalTrail.color2 = new BABYLON.Color4(0.7, 0.85, 1, 1);
  crystalTrail.colorDead = new BABYLON.Color4(0.5, 0.7, 1, 0);
  crystalTrail.minSize = 0.05;
  crystalTrail.maxSize = 0.15;
  crystalTrail.minLifeTime = 0.5;
  crystalTrail.maxLifeTime = 1;
  crystalTrail.emitRate = 30;
  crystalTrail.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
  crystalTrail.minEmitPower = 0.05;
  crystalTrail.maxEmitPower = 0.1;
  crystalTrail.updateSpeed = 0.01;
  crystalTrail.start();

  // Dönüş animasyonu
  let rotationSpeed = {
    x: (Math.random() - 0.5) * 0.2,
    y: (Math.random() - 0.5) * 0.2,
    z: (Math.random() - 0.5) * 0.2
  };

  // Hareket ve çarpışma kontrolü
  const update = () => {
    // Mermi hareketi
    proj.position.addInPlace(direction.scale(speed));
    
    // Dönüş animasyonu
    proj.rotation.x += rotationSpeed.x;
    proj.rotation.y += rotationSpeed.y;
    proj.rotation.z += rotationSpeed.z;
    
    // Işık pozisyonunu güncelle
    projLight.position = proj.position.clone();

    // Hedef ile çarpışma kontrolü
    if (BABYLON.Vector3.Distance(proj.position, targetPos) < 1) {
      // Ekran sarsıntısı
      this.screenShake(0.2, 150);
      
      // İsabet efekti - daha etkileyici
      const impactPos = proj.position.clone();
      
      // Buz patlaması
      const impactBurst = new BABYLON.ParticleSystem("impactBurst", 150, this.scene);
      impactBurst.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
      impactBurst.emitter = impactPos;
      impactBurst.color1 = new BABYLON.Color4(0.9, 0.95, 1, 1);
      impactBurst.color2 = new BABYLON.Color4(0.7, 0.85, 1, 1);
      impactBurst.colorDead = new BABYLON.Color4(0.5, 0.7, 1, 0);
      impactBurst.minSize = 0.2;
      impactBurst.maxSize = 0.5;
      impactBurst.minLifeTime = 0.3;
      impactBurst.maxLifeTime = 0.6;
      impactBurst.emitRate = 0;
      impactBurst.manualEmitCount = 150;
      impactBurst.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
      impactBurst.minEmitPower = 1;
      impactBurst.maxEmitPower = 2;
      impactBurst.gravity = new BABYLON.Vector3(0, 0, 0);
      impactBurst.direction1 = new BABYLON.Vector3(-1, -1, -1);
      impactBurst.direction2 = new BABYLON.Vector3(1, 1, 1);
      impactBurst.start();
      
      setTimeout(() => impactBurst.dispose(), 600);
      
      // Buz kristalleri oluştur
      for (let i = 0; i < 5; i++) {
        const crystal = BABYLON.MeshBuilder.CreatePolyhedron("impactCrystal_" + i, {
          type: 1, // Oktahedron
          size: 0.2 + Math.random() * 0.3
        }, this.scene);
        
        // Rastgele pozisyon
        const offset = new BABYLON.Vector3(
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 0.5
        );
        crystal.position = impactPos.add(offset);
        
        // Rastgele rotasyon
        crystal.rotation = new BABYLON.Vector3(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );
        
        const crystalMat = new BABYLON.StandardMaterial("impactCrystalMat_" + i, this.scene);
        crystalMat.diffuseColor = new BABYLON.Color3(0.8, 0.95, 1);
        crystalMat.emissiveColor = new BABYLON.Color3(0.5, 0.8, 1);
        crystalMat.alpha = 0.8;
        crystalMat.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
        crystal.material = crystalMat;
        
        // Büyüme ve kaybolma animasyonu
        let scale = 0.1;
        const growAnim = () => {
          scale += 0.1;
          crystal.scaling.setAll(scale);
          
          if (scale >= 1) {
            // Büyüme tamamlandı, kaybolma başla
            setTimeout(() => {
              let fadeAlpha = 0.8;
              const fadeCrystal = () => {
                fadeAlpha -= 0.05;
                crystalMat.alpha = fadeAlpha;
                
                if (fadeAlpha <= 0) {
                  crystal.dispose();
                } else {
                  requestAnimationFrame(fadeCrystal);
                }
              };
              
              fadeCrystal();
            }, 300 + Math.random() * 200);
            
            return;
          }
          
          requestAnimationFrame(growAnim);
        };
        
        growAnim();
      }
      
      // Geçici ışık
      const impactLight = new BABYLON.PointLight("impactLight", impactPos, this.scene);
      impactLight.diffuse = new BABYLON.Color3(0.6, 0.8, 1);
      impactLight.intensity = 2;
      impactLight.range = 5;
      
      // Işık animasyonu
      let lightIntensity = 2;
      const fadeLight = () => {
        lightIntensity -= 0.1;
        impactLight.intensity = lightIntensity;
        
        if (lightIntensity <= 0) {
          impactLight.dispose();
        } else {
          requestAnimationFrame(fadeLight);
        }
      };
      
      setTimeout(fadeLight, 100);
      
      // Tower'ı bul ve işle
      const tower = this.towers.find(t => 
        t.getChildren().includes(target)
      );
      
      if (tower) {
        // Buz kristalleri oluştur
        const createIceCrystals = (segment) => {
          const segPos = segment.getAbsolutePosition();
          
          // Buz kristali
          const crystal = BABYLON.MeshBuilder.CreatePolyhedron("towerIce", {
            type: 1, // Oktahedron
            size: 0.3 + Math.random() * 0.2
          }, this.scene);
          
          crystal.position = segPos.clone();
          
          const crystalMat = new BABYLON.StandardMaterial("towerIceMat", this.scene);
          crystalMat.diffuseColor = new BABYLON.Color3(0.8, 0.95, 1);
          crystalMat.emissiveColor = new BABYLON.Color3(0.5, 0.8, 1);
          crystalMat.alpha = 0.7;
          crystalMat.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
          crystal.material = crystalMat;
          
          // Büyüme animasyonu
          let scale = 0.1;
          const growAnim = () => {
            scale += 0.1;
            crystal.scaling.setAll(scale);
            
            if (scale >= 1) {
              // Büyüme tamamlandı
              return;
            }
            
            requestAnimationFrame(growAnim);
          };
          
          growAnim();
          
          // 300ms sonra kristali temizle
          setTimeout(() => {
            let fadeAlpha = 0.7;
            const fadeCrystal = () => {
              fadeAlpha -= 0.05;
              crystalMat.alpha = fadeAlpha;
              
              if (fadeAlpha <= 0) {
                crystal.dispose();
              } else {
                requestAnimationFrame(fadeCrystal);
              }
            };
            
            fadeCrystal();
          }, 300);
        };

        // Kademeli renk değişimi ve buz efekti
        tower.getChildren().forEach((seg, index) => {
          if (seg.material) {
            setTimeout(() => {
              // Orijinal rengi sakla
              const originalColor = seg.material.diffuseColor.clone();
              const targetColor = new BABYLON.Color3(0.7, 0.9, 1);
              
              // Renk geçiş animasyonu
              let progress = 0;
              const colorTransition = setInterval(() => {
                progress += 0.1;
                if (progress >= 1) {
                  clearInterval(colorTransition);
                  seg.material.diffuseColor = targetColor;
                  seg.material.emissiveColor = new BABYLON.Color3(0.5, 0.8, 1);
                  
                  // Buz kristalleri oluştur
                  createIceCrystals(seg);
                } else {
                  seg.material.diffuseColor = BABYLON.Color3.Lerp(
                    originalColor,
                    targetColor,
                    progress
                  );
                  
                  if (seg.material.emissiveColor) {
                    seg.material.emissiveColor = BABYLON.Color3.Lerp(
                      originalColor.scale(0.5),
                      new BABYLON.Color3(0.5, 0.8, 1),
                      progress
                    );
                  }
                }
              }, 20);
            }, index * 50); // Kademeli renk değişimi
          }
        });

        // Buz kırılma efekti ve tower düşme
        setTimeout(() => {
          // Buz kırılma sesi
          if (this.sounds && this.sounds.iceBreak) {
            this.sounds.iceBreak.play();
          }
          
          // Buz kırılma parçacıkları
          const breakPos = tower.position.clone();
          breakPos.y += 1;
          
          const iceBreak = new BABYLON.ParticleSystem("iceBreak", 200, this.scene);
          iceBreak.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
          iceBreak.emitter = breakPos;
          iceBreak.color1 = new BABYLON.Color4(0.9, 0.95, 1, 1);
          iceBreak.color2 = new BABYLON.Color4(0.7, 0.85, 1, 1);
          iceBreak.colorDead = new BABYLON.Color4(0.5, 0.7, 1, 0);
          iceBreak.minSize = 0.1;
          iceBreak.maxSize = 0.3;
          iceBreak.minLifeTime = 0.5;
          iceBreak.maxLifeTime = 1;
          iceBreak.emitRate = 0;
          iceBreak.manualEmitCount = 200;
          iceBreak.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
          iceBreak.minEmitPower = 1;
          iceBreak.maxEmitPower = 3;
          iceBreak.gravity = new BABYLON.Vector3(0, -9.81, 0);
          iceBreak.direction1 = new BABYLON.Vector3(-1, 1, -1);
          iceBreak.direction2 = new BABYLON.Vector3(1, 1, 1);
          iceBreak.start();
          
          setTimeout(() => iceBreak.dispose(), 1000);
          
          // Tower'ı düşür
          this.animateTowerFall(tower, () => {
            const { xIndex: cx, yIndex: cy } = tower.baseTile.metadata;
            
            // Komşu tile'lara ışık kuleleri spawn et - kademeli
            const neighborTiles = this.baseTiles.filter(tile => 
              Math.abs(tile.metadata.xIndex - cx) <= 1 && 
              Math.abs(tile.metadata.yIndex - cy) <= 1
            );
            
            neighborTiles.forEach((tile, idx) => {
              setTimeout(() => {
                const beam = this.spawnLightTower(tile, 10);
                
                // Işık kulesi için özel buz efekti
                if (beam) {
                  // Buz parçacıkları
                  const beamFrost = new BABYLON.ParticleSystem("beamFrost", 50, this.scene);
                  beamFrost.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
                  beamFrost.emitter = beam.position.clone();
                  beamFrost.emitter.y += 2;
                  beamFrost.color1 = new BABYLON.Color4(0.9, 0.95, 1, 0.7);
                  beamFrost.color2 = new BABYLON.Color4(0.7, 0.85, 1, 0.5);
                  beamFrost.colorDead = new BABYLON.Color4(0.5, 0.7, 1, 0);
                  beamFrost.minSize = 0.1;
                  beamFrost.maxSize = 0.3;
                  beamFrost.minLifeTime = 0.3;
                  beamFrost.maxLifeTime = 0.6;
                  beamFrost.emitRate = 100;
                  beamFrost.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
                  beamFrost.direction1 = new BABYLON.Vector3(-0.5, 1, -0.5);
                  beamFrost.direction2 = new BABYLON.Vector3(0.5, 1, 0.5);
                  beamFrost.minEmitPower = 0.5;
                  beamFrost.maxEmitPower = 1;
                  beamFrost.manualEmitCount = 50;
                  beamFrost.start();
                  
                  setTimeout(() => beamFrost.dispose(), 600);
                }
              }, idx * 100); // Kademeli ışık kuleleri
            });
          });
          
          // Tower'ı diziden çıkar
          const idx = this.towers.indexOf(tower);
          if (idx !== -1) this.towers.splice(idx, 1);
        }, 500);
      }

      // Temizlik
      trail.stop();
      crystalTrail.stop();
      projLight.dispose();
      
      setTimeout(() => {
        trail.dispose();
        crystalTrail.dispose();
        proj.dispose();
      }, 200);
      
      return;
    }

    // Ekran dışına çıktı mı?
    if (proj.position.y < -30 || proj.position.y > 60 || 
        proj.position.x < -60 || proj.position.x > 60 || 
        proj.position.z < -60 || proj.position.z > 60) {
      
      trail.stop();
      crystalTrail.stop();
      projLight.dispose();
      
      setTimeout(() => {
        trail.dispose();
        crystalTrail.dispose();
        proj.dispose();
      }, 200);
      
      return;
    }

    requestAnimationFrame(update);
  };

  update();
}

solarComboFire() {
  this.updateComboButtonState(false);

  // Ekran sarsıntısı ile başla
  this.screenShake(0.2, 200);

  const startPos = this.goldberg.getAbsolutePosition().clone();
  startPos.y += 2;

    // Yeni: Solar Combo süre sayacı
  if (this.hud) {
    this.hud.showSolarComboTimer(15000); // 15 saniye süre
  }
  // Güneş çekirdeği (merkez küre) - daha detaylı ve etkileyici
  const solarCore = BABYLON.MeshBuilder.CreatePolyhedron("solarCore", {
    type: 3,  // 3: Icosahedral (20 yüzlü)
    size: 2.2 // Daha büyük boyut
  }, this.scene);

  // Parlak beyaz-sarı çekirdek materyali - daha parlak ve etkileyici
  const coreMat = new BABYLON.StandardMaterial("coreMat", this.scene);
  coreMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
  coreMat.emissiveColor = new BABYLON.Color3(1, 0.9, 0.4);
  coreMat.specularColor = new BABYLON.Color3(1, 1, 1);
  coreMat.specularPower = 128; // Daha parlak yansıma
  coreMat.alpha = 0.8;
  solarCore.material = coreMat;
  solarCore.position = startPos;

  // Çekirdek ışık efekti
  const coreLight = new BABYLON.PointLight("coreLight", startPos, this.scene);
  coreLight.diffuse = new BABYLON.Color3(1, 0.8, 0.3);
  coreLight.intensity = 2;
  coreLight.range = 15;

  // İç korona (iç halka)
  const innerCorona = BABYLON.MeshBuilder.CreateTorus("innerCorona", {
    diameter: 5,
    thickness: 0.4,
    tessellation: 64
  }, this.scene);
  innerCorona.parent = solarCore;
  
  // İç korona materyali
  const innerCoronaMat = new BABYLON.StandardMaterial("innerCoronaMat", this.scene);
  innerCoronaMat.emissiveColor = new BABYLON.Color3(1, 0.8, 0.2);
  innerCoronaMat.diffuseColor = new BABYLON.Color3(1, 0.9, 0.3);
  innerCoronaMat.alpha = 0.7;
  innerCoronaMat.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
  innerCorona.material = innerCoronaMat;

  // Dış korona (dış halka)
  const outerCorona = BABYLON.MeshBuilder.CreateTorus("outerCorona", {
    diameter: 9,
    thickness: 0.6,
    tessellation: 64
  }, this.scene);
  outerCorona.parent = solarCore;
  
  // Dış korona materyali
  const outerCoronaMat = new BABYLON.StandardMaterial("outerCoronaMat", this.scene);
  outerCoronaMat.emissiveColor = new BABYLON.Color3(1, 0.4, 0);
  outerCoronaMat.diffuseColor = new BABYLON.Color3(1, 0.6, 0);
  outerCoronaMat.alpha = 0.6;
  outerCoronaMat.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
  outerCorona.material = outerCoronaMat;

  // Güneş yüzey detayları (küçük küreler)
  const surfaceDetails = [];
  for (let i = 0; i < 15; i++) {
    const detail = BABYLON.MeshBuilder.CreateSphere(`surfaceDetail_${i}`, {
      diameter: 0.4 + Math.random() * 0.6,
      segments: 16
    }, this.scene);
    
    // Rastgele pozisyon
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const radius = 2.2;
    
    detail.position = new BABYLON.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );
    
    detail.parent = solarCore;
    
    // Materyal
    const detailMat = new BABYLON.StandardMaterial(`detailMat_${i}`, this.scene);
    detailMat.emissiveColor = new BABYLON.Color3(1, 0.6 + Math.random() * 0.4, 0.2);
    detail.material = detailMat;
    
    surfaceDetails.push(detail);
  }

  const direction = new BABYLON.Vector3(
    Math.sin(this.goldberg.rotation.y),
    1,
    Math.sin(this.goldberg.rotation.y)
  ).normalize();

  // Güneş parçacıkları - daha etkileyici
  const solarParticles = new BABYLON.ParticleSystem("solarParticles", 500, this.scene);
  solarParticles.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
  solarParticles.emitter = solarCore;
  solarParticles.minEmitBox = new BABYLON.Vector3(-2, -2, -2);
  solarParticles.maxEmitBox = new BABYLON.Vector3(2, 2, 2);
  solarParticles.color1 = new BABYLON.Color4(1, 1, 1, 1);
  solarParticles.color2 = new BABYLON.Color4(1, 0.7, 0, 1);
  solarParticles.colorDead = new BABYLON.Color4(1, 0.2, 0, 0);
  solarParticles.minSize = 0.3;
  solarParticles.maxSize = 1.2;
  solarParticles.minLifeTime = 0.3;
  solarParticles.maxLifeTime = 0.8;
  solarParticles.emitRate = 350;
  solarParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
  solarParticles.gravity = new BABYLON.Vector3(0, 0, 0);
  solarParticles.minAngularSpeed = 0;
  solarParticles.maxAngularSpeed = Math.PI;
  solarParticles.minEmitPower = 1;
  solarParticles.maxEmitPower = 3;
  solarParticles.updateSpeed = 0.01;
  solarParticles.start();

  // Güneş patlamaları (solar flares)
  const createSolarFlare = () => {
    const flarePos = solarCore.position.clone();
    const flareDir = new BABYLON.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ).normalize();
    
    const flareLength = 3 + Math.random() * 5;
    
    const flare = BABYLON.MeshBuilder.CreateCylinder("solarFlare", {
      height: flareLength,
      diameterTop: 0.1,
      diameterBottom: 0.8,
      tessellation: 8
    }, this.scene);
    
    const flareMat = new BABYLON.StandardMaterial("flareMat", this.scene);
    flareMat.emissiveColor = new BABYLON.Color3(1, 0.6, 0);
    flareMat.diffuseColor = new BABYLON.Color3(1, 0.8, 0.2);
    flareMat.alpha = 0.7;
    flareMat.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
    flare.material = flareMat;
    
    flare.position = flarePos.add(flareDir.scale(flareLength / 2 + 2));
    flare.lookAt(flarePos);
    flare.rotate(BABYLON.Axis.X, Math.PI / 2);
    
    // Flare parçacıkları
    const flareParticles = new BABYLON.ParticleSystem("flareParticles", 100, this.scene);
    flareParticles.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
    flareParticles.emitter = flare;
    flareParticles.minEmitBox = new BABYLON.Vector3(-0.2, -flareLength/2, -0.2);
    flareParticles.maxEmitBox = new BABYLON.Vector3(0.2, flareLength/2, 0.2);
    flareParticles.color1 = new BABYLON.Color4(1, 0.9, 0.3, 1);
    flareParticles.color2 = new BABYLON.Color4(1, 0.5, 0, 1);
    flareParticles.colorDead = new BABYLON.Color4(1, 0.2, 0, 0);
    flareParticles.minSize = 0.2;
    flareParticles.maxSize = 0.5;
    flareParticles.minLifeTime = 0.2;
    flareParticles.maxLifeTime = 0.4;
    flareParticles.emitRate = 100;
    flareParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    flareParticles.minEmitPower = 0.5;
    flareParticles.maxEmitPower = 1;
    flareParticles.start();
    
    // Flare animasyonu
    let alpha = 1;
    const fadeFlare = () => {
      alpha -= 0.02;
      flareMat.alpha = alpha;
      
      if (alpha <= 0) {
        flareParticles.stop();
        setTimeout(() => {
          flareParticles.dispose();
          flare.dispose();
        }, 500);
      } else {
        requestAnimationFrame(fadeFlare);
      }
    };
    
    setTimeout(fadeFlare, 500);
  };

  // Düzenli aralıklarla güneş patlamaları oluştur
  const flareInterval = setInterval(createSolarFlare, 800);

  // Vurulan hedefleri takip için Set
  const hitTargets = new Set();

  // Güneş ışını efekti oluşturma fonksiyonu - daha etkileyici
  const createSolarBeam = (target) => {
    // Işın başlangıç ve bitiş noktaları
    const startPoint = solarCore.position.clone();
    const endPoint = target.clone();
    const distance = BABYLON.Vector3.Distance(startPoint, endPoint);
    
    // Ana ışın
    const beam = BABYLON.MeshBuilder.CreateCylinder("solarBeam", {
      height: distance,
      diameter: 0.5,
      tessellation: 12
    }, this.scene);
    
    const beamMat = new BABYLON.StandardMaterial("beamMat", this.scene);
    beamMat.emissiveColor = new BABYLON.Color3(1, 0.8, 0.2);
    beamMat.diffuseColor = new BABYLON.Color3(1, 0.9, 0.3);
    beamMat.alpha = 0.8;
    beamMat.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
    beam.material = beamMat;
    
    // Işını hedef ve kaynak arasında konumlandır
    const midPoint = BABYLON.Vector3.Lerp(startPoint, endPoint, 0.5);
    beam.position = midPoint;
    beam.lookAt(endPoint);
    beam.rotate(BABYLON.Axis.X, Math.PI / 2);
    
    // Dış ışın hale efekti
    const outerBeam = BABYLON.MeshBuilder.CreateCylinder("outerBeam", {
      height: distance,
      diameter: 1.2,
      tessellation: 12
    }, this.scene);
    
    const outerBeamMat = new BABYLON.StandardMaterial("outerBeamMat", this.scene);
    outerBeamMat.emissiveColor = new BABYLON.Color3(1, 0.6, 0);
    outerBeamMat.diffuseColor = new BABYLON.Color3(1, 0.7, 0.1);
    outerBeamMat.alpha = 0.4;
    outerBeamMat.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;
    outerBeam.material = outerBeamMat;
    
    outerBeam.position = midPoint;
    outerBeam.lookAt(endPoint);
    outerBeam.rotate(BABYLON.Axis.X, Math.PI / 2);
    
    // Işın parçacıkları
    const beamParticles = new BABYLON.ParticleSystem("beamParticles", 200, this.scene);
    beamParticles.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
    beamParticles.emitter = beam;
    beamParticles.minEmitBox = new BABYLON.Vector3(-0.2, -distance/2, -0.2);
    beamParticles.maxEmitBox = new BABYLON.Vector3(0.2, distance/2, 0.2);
    beamParticles.color1 = new BABYLON.Color4(1, 1, 0.6, 1);
    beamParticles.color2 = new BABYLON.Color4(1, 0.6, 0, 1);
    beamParticles.colorDead = new BABYLON.Color4(1, 0.3, 0, 0);
    beamParticles.minSize = 0.1;
    beamParticles.maxSize = 0.3;
    beamParticles.minLifeTime = 0.1;
    beamParticles.maxLifeTime = 0.3;
    beamParticles.emitRate = 200;
    beamParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    beamParticles.minEmitPower = 0.2;
    beamParticles.maxEmitPower = 0.5;
    beamParticles.start();
    
    // Hedef noktasında patlama efekti
    const impactBurst = new BABYLON.ParticleSystem("impactBurst", 100, this.scene);
    impactBurst.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
    impactBurst.emitter = endPoint;
    impactBurst.minEmitBox = new BABYLON.Vector3(-0.1, -0.1, -0.1);
    impactBurst.maxEmitBox = new BABYLON.Vector3(0.1, 0.1, 0.1);
    impactBurst.color1 = new BABYLON.Color4(1, 1, 0.6, 1);
    impactBurst.color2 = new BABYLON.Color4(1, 0.6, 0, 1);
    impactBurst.colorDead = new BABYLON.Color4(1, 0.3, 0, 0);
    impactBurst.minSize = 0.3;
    impactBurst.maxSize = 0.8;
    impactBurst.minLifeTime = 0.2;
    impactBurst.maxLifeTime = 0.4;
    impactBurst.emitRate = 300;
    impactBurst.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    impactBurst.minEmitPower = 1;
    impactBurst.maxEmitPower = 2;
    impactBurst.gravity = new BABYLON.Vector3(0, 0, 0);
    impactBurst.direction1 = new BABYLON.Vector3(-1, -1, -1);
    impactBurst.direction2 = new BABYLON.Vector3(1, 1, 1);
    impactBurst.start();
    
    setTimeout(() => {
      impactBurst.stop();
      setTimeout(() => impactBurst.dispose(), 500);
    }, 200);
    
    // Işın animasyonu ve temizlik
    let alpha = 1;
    const fadeBeam = () => {
      alpha -= 0.05;
      beamMat.alpha = alpha * 0.8;
      outerBeamMat.alpha = alpha * 0.4;
      
      if (alpha <= 0) {
        beamParticles.stop();
        setTimeout(() => {
          beamParticles.dispose();
          beam.dispose();
          outerBeam.dispose();
        }, 500);
      } else {
        requestAnimationFrame(fadeBeam);
      }
    };
    
    setTimeout(fadeBeam, 300);
    
    // Hedef noktasında geçici ışık
    const impactLight = new BABYLON.PointLight("impactLight", endPoint, this.scene);
    impactLight.diffuse = new BABYLON.Color3(1, 0.7, 0.3);
    impactLight.intensity = 2;
    impactLight.range = 5;
    
    // Işık animasyonu
    let lightIntensity = 2;
    const fadeLight = () => {
      lightIntensity -= 0.1;
      impactLight.intensity = lightIntensity;
      
      if (lightIntensity <= 0) {
        impactLight.dispose();
      } else {
        requestAnimationFrame(fadeLight);
      }
    };
    
    setTimeout(fadeLight, 300);
  };

  // Erime efekti için geliştirilmiş fonksiyon
  const createMeltEffect = (segment) => {
    const segPos = segment.getAbsolutePosition().clone();
    const originalScale = segment.scaling.clone();
    const originalMaterial = segment.material;
    
    // Erime materyali - daha gerçekçi
    const meltMat = new BABYLON.StandardMaterial("meltMat", this.scene);
    meltMat.emissiveColor = new BABYLON.Color3(1, 0.4, 0);
    meltMat.diffuseColor = new BABYLON.Color3(1, 0.6, 0.2);
    meltMat.specularColor = new BABYLON.Color3(1, 0.8, 0.5);
    meltMat.specularPower = 64;
    segment.material = meltMat;
    
    // Erime ve düşme animasyonu - daha doğal
    let progress = 0;
    const melt = () => {
      progress += 0.02;
      
      if (progress >= 1) {
        // Eriyen damlalar oluştur
        for (let i = 0; i < 5; i++) {
          createMoltenDroplet(segPos);
        }
        
        segment.dispose();
      } else {
        // Erime efekti
        const meltFactor = Math.pow(1 - progress, 2); // Easing fonksiyonu
        segment.scaling.x = originalScale.x * meltFactor;
        segment.scaling.z = originalScale.z * meltFactor;
        segment.scaling.y = originalScale.y * (0.8 + 0.2 * Math.sin(progress * Math.PI)); // Hafif sıkışma
        
        // Pozisyon değişimi
        segment.position.y -= 0.08 * (1 - meltFactor);
        
        // Materyal değişimi
        meltMat.emissiveColor = BABYLON.Color3.Lerp(
          new BABYLON.Color3(1, 0.4, 0),
          new BABYLON.Color3(1, 0.2, 0),
          progress
        );
        
        requestAnimationFrame(melt);
      }
    };
    
    melt();
    
    // Eriyen parçacıklar - daha gerçekçi
    const droplets = new BABYLON.ParticleSystem("droplets", 80, this.scene);
    droplets.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
    droplets.emitter = segment;
    droplets.minEmitBox = new BABYLON.Vector3(-0.3, -0.1, -0.3);
    droplets.maxEmitBox = new BABYLON.Vector3(0.3, 0.1, 0.3);
    droplets.color1 = new BABYLON.Color4(1, 0.6, 0.2, 1);
    droplets.color2 = new BABYLON.Color4(1, 0.3, 0, 1);
    droplets.colorDead = new BABYLON.Color4(0.7, 0.1, 0, 0);
    droplets.minSize = 0.1;
    droplets.maxSize = 0.25;
    droplets.minLifeTime = 0.5;
    droplets.maxLifeTime = 1.2;
    droplets.emitRate = 120;
    droplets.gravity = new BABYLON.Vector3(0, -9.81, 0);
    droplets.direction1 = new BABYLON.Vector3(-0.3, -1, -0.3);
    droplets.direction2 = new BABYLON.Vector3(0.3, -0.8, 0.3);
    droplets.minEmitPower = 0.5;
    droplets.maxEmitPower = 1.5;
    droplets.updateSpeed = 0.01;
    droplets.start();
    
    setTimeout(() => {
      droplets.stop();
      setTimeout(() => droplets.dispose(), 1500);
    }, 800);
  };

  // Eriyen damlacık efekti
  const createMoltenDroplet = (position) => {
    const droplet = BABYLON.MeshBuilder.CreateSphere("moltenDroplet", {
      diameter: 0.2 + Math.random() * 0.2,
      segments: 8
    }, this.scene);
    
    droplet.position = position.clone();
    droplet.position.y -= 0.2;
    
    const dropletMat = new BABYLON.StandardMaterial("dropletMat", this.scene);
    dropletMat.emissiveColor = new BABYLON.Color3(1, 0.3, 0);
    dropletMat.diffuseColor = new BABYLON.Color3(1, 0.5, 0.1);
    dropletMat.specularColor = new BABYLON.Color3(1, 0.8, 0.5);
    dropletMat.specularPower = 64;
    droplet.material = dropletMat;
    
    // Düşme animasyonu
    const startY = droplet.position.y;
    const gravity = 0.01;
    let velocity = 0;
    
    const fall = () => {
      velocity += gravity;
      droplet.position.y -= velocity;
      
      // Rastgele X ve Z hareketi
      droplet.position.x += (Math.random() - 0.5) * 0.02;
      droplet.position.z += (Math.random() - 0.5) * 0.02;
      
      // Yere çarptığında
      if (droplet.position.y < -5) {
        // Sıçrama efekti
        const splash = new BABYLON.ParticleSystem("splash", 20, this.scene);
        splash.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
        splash.emitter = droplet.position.clone();
        splash.color1 = new BABYLON.Color4(1, 0.5, 0.1, 1);
        splash.color2 = new BABYLON.Color4(1, 0.3, 0, 1);
        splash.colorDead = new BABYLON.Color4(0.7, 0.1, 0, 0);
        splash.minSize = 0.05;
        splash.maxSize = 0.15;
        splash.minLifeTime = 0.2;
        splash.maxLifeTime = 0.4;
        splash.emitRate = 100;
        splash.gravity = new BABYLON.Vector3(0, -9.81, 0);
        splash.direction1 = new BABYLON.Vector3(-0.5, 0.5, -0.5);
        splash.direction2 = new BABYLON.Vector3(0.5, 1, 0.5);
        splash.minEmitPower = 0.5;
        splash.maxEmitPower = 1;
        splash.manualEmitCount = 20;
        splash.start();
        
        setTimeout(() => splash.dispose(), 500);
        
        droplet.dispose();
      } else {
        requestAnimationFrame(fall);
      }
    };
    
    fall();
  };

  // Performans optimizasyonu için değişkenler
  let frameCount = 0;
  const checkInterval = 2; // Her 2 frame'de bir kontrol et
  let isDisposed = false;

  const moveAndCheck = () => {
    if (isDisposed) return;
    
    frameCount++;
    
    // İleri hareket ve dönüş animasyonları
    solarCore.position.addInPlace(direction.scale(0.4));
    solarCore.rotate(BABYLON.Axis.Y, 0.05, BABYLON.Space.LOCAL);
    solarCore.rotate(BABYLON.Axis.X, 0.03, BABYLON.Space.LOCAL);
    innerCorona.rotation.z += 0.03;
    outerCorona.rotation.z -= 0.02;
    
    // Yüzey detayları animasyonu
    surfaceDetails.forEach((detail, index) => {
      detail.rotation.x += 0.01 * (index % 3 + 1);
      detail.rotation.y += 0.02 * ((index + 1) % 3 + 1);
    });
    
    // Işık yoğunluğu dalgalanması
    coreLight.intensity = 1.8 + 0.4 * Math.sin(performance.now() * 0.002);
    coreLight.position = solarCore.position.clone();

    // Her frame'de değil, belirli aralıklarla kontrol et (performans için)
    if (frameCount % checkInterval === 0) {
      // Relic Tower kontrolü
      this.relicTowers.forEach(rt => {
        if (!rt || rt.isDisposed()) return;
        
        if (!hitTargets.has(rt.uniqueId)) {
          const dist = BABYLON.Vector3.Distance(solarCore.position, rt.position);
          if (dist < 10) { // Daha geniş etki alanı
            hitTargets.add(rt.uniqueId);
            
            // Tower'ın baseTile referansını temizle
            if (rt.baseTile) {
              rt.baseTile.relicTower = null;
            }
            
            // Ekran sarsıntısı
            this.screenShake(0.2, 200);
            
            // Her segmente güneş ışını ve erime efekti
            const segments = rt.getChildren().filter(seg => seg instanceof BABYLON.Mesh);
            
            segments.forEach((seg, index) => {
              // Kademeli etki için gecikme
              setTimeout(() => {
                createSolarBeam(seg.getAbsolutePosition());
                createMeltEffect(seg);
              }, index * 100);
            });
            
            // Tower'ı diziden çıkar
            const rtIndex = this.relicTowers.indexOf(rt);
            if (rtIndex !== -1) {
              this.relicTowers.splice(rtIndex, 1);
            }
            
            // Tower'ı temizle (tüm segmentler eridiğinde)
            setTimeout(() => {
              if (rt && !rt.isDisposed()) {
                rt.dispose();
              }
            }, segments.length * 100 + 1000);
          }
        }
      });

      // MEX/WEX Tower kontrolü
      this.towers.forEach(tower => {
        if (!tower || tower.isDisposed()) return;
        
        if (!hitTargets.has(tower.uniqueId)) {
          const dist = BABYLON.Vector3.Distance(solarCore.position, tower.position);
          if (dist < 10) { // Daha geniş etki alanı
            hitTargets.add(tower.uniqueId);
            
            const specialTile = tower.getChildren().find(seg => 
              seg instanceof BABYLON.Mesh && seg.isSpecial && 
              (seg.specialColor === 'red' || seg.specialColor === 'blue')
            );

            if (specialTile) {
              // Ekran sarsıntısı
              this.screenShake(0.2, 200);
              
              createSolarBeam(tower.position);

              // Renk değişimi ve düşme
              const targetColor = specialTile.specialColor === 'red' 
                ? this.faceColor.clone() 
                : new BABYLON.Color3(0.6, 0.8, 1);

              // Kademeli renk değişimi
              tower.getChildren().forEach((seg, index) => {
                if (seg.material) {
                  setTimeout(() => {
                    // Renk geçiş animasyonu
                    let progress = 0;
                    const originalColor = seg.material.diffuseColor.clone();
                    
                    const colorTransition = setInterval(() => {
                      progress += 0.1;
                      if (progress >= 1) {
                        clearInterval(colorTransition);
                        seg.material.diffuseColor = targetColor;
                        seg.material.emissiveColor = targetColor.scale(0.5);
                      } else {
                        seg.material.diffuseColor = BABYLON.Color3.Lerp(
                          originalColor,
                          targetColor,
                          progress
                        );
                        if (seg.material.emissiveColor) {
                          seg.material.emissiveColor = BABYLON.Color3.Lerp(
                            originalColor.scale(0.5),
                            targetColor.scale(0.5),
                            progress
                          );
                        }
                      }
                    }, 20);
                  }, index * 50); // Kademeli renk değişimi
                }
              });

              setTimeout(() => {
                // Işık parçacıkları
                const lightBurst = new BABYLON.ParticleSystem("lightBurst", 100, this.scene);
                lightBurst.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
                lightBurst.emitter = tower.position.clone();
                lightBurst.minEmitBox = new BABYLON.Vector3(-1, 0, -1);
                lightBurst.maxEmitBox = new BABYLON.Vector3(1, 0, 1);
                lightBurst.color1 = new BABYLON.Color4(1, 0.9, 0.5, 1);
                lightBurst.color2 = new BABYLON.Color4(1, 0.7, 0.3, 1);
                lightBurst.colorDead = new BABYLON.Color4(1, 0.5, 0.1, 0);
                lightBurst.minSize = 0.2;
                lightBurst.maxSize = 0.5;
                lightBurst.minLifeTime = 0.3;
                lightBurst.maxLifeTime = 0.6;
                lightBurst.emitRate = 200;
                lightBurst.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
                lightBurst.direction1 = new BABYLON.Vector3(-1, 1, -1);
                lightBurst.direction2 = new BABYLON.Vector3(1, 1, 1);
                lightBurst.minEmitPower = 1;
                lightBurst.maxEmitPower = 2;
                lightBurst.updateSpeed = 0.01;
                lightBurst.start();
                
                setTimeout(() => {
                  lightBurst.stop();
                  setTimeout(() => lightBurst.dispose(), 600);
                }, 300);
                
                // Tower'ı düşür
                this.animateTowerFall(tower, () => {
                  const { xIndex: cx, yIndex: cy } = tower.baseTile.metadata;
                  
                  // Komşu tile'lara ışık kuleleri spawn et - kademeli
                  const neighborTiles = this.baseTiles.filter(tile => 
                    Math.abs(tile.metadata.xIndex - cx) <= 1 && 
                    Math.abs(tile.metadata.yIndex - cy) <= 1
                  );
                  
                  neighborTiles.forEach((tile, idx) => {
                    setTimeout(() => {
                      const beam = this.spawnLightTower(tile, 10);
                      
                      // Işık kulesi için özel efekt
                      if (beam) {
                        // Işık patlaması
                        const beamBurst = new BABYLON.ParticleSystem("beamBurst", 50, this.scene);
                        beamBurst.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
                        beamBurst.emitter = beam.position.clone();
                        beamBurst.emitter.y += 2;
                        beamBurst.color1 = new BABYLON.Color4(1, 0.9, 0.5, 1);
                        beamBurst.color2 = new BABYLON.Color4(1, 0.7, 0.3, 1);
                        beamBurst.colorDead = new BABYLON.Color4(1, 0.5, 0.1, 0);
                        beamBurst.minSize = 0.2;
                        beamBurst.maxSize = 0.4;
                        beamBurst.minLifeTime = 0.2;
                        beamBurst.maxLifeTime = 0.4;
                        beamBurst.emitRate = 100;
                        beamBurst.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
                        beamBurst.direction1 = new BABYLON.Vector3(-0.5, 1, -0.5);
                        beamBurst.direction2 = new BABYLON.Vector3(0.5, 1, 0.5);
                        beamBurst.minEmitPower = 0.5;
                        beamBurst.maxEmitPower = 1;
                        beamBurst.manualEmitCount = 50;
                        beamBurst.start();
                        
                        setTimeout(() => beamBurst.dispose(), 500);
                      }
                    }, idx * 100); // Kademeli ışık kuleleri
                  });
                });
              }, 500);
            }
          }
        }
      });
    }

    // Ekran dışı kontrolü
    if (solarCore.position.y > 60 || solarCore.position.y < -30 || 
        solarCore.position.x > 60 || solarCore.position.x < -60 ||
        solarCore.position.z > 60 || solarCore.position.z < -60) {
      
      isDisposed = true;
      clearInterval(flareInterval);
      
      // Güneş kaybolma efekti
      let fadeAlpha = 1;
      const fadeOut = () => {
        fadeAlpha -= 0.05;
        
        if (fadeAlpha <= 0) {
          // Tüm kaynakları temizle
          solarParticles.stop();
          
          // Tüm mesh'leri temizle
          surfaceDetails.forEach(detail => detail.dispose());
          innerCorona.dispose();
          outerCorona.dispose();
          solarCore.dispose();
          coreLight.dispose();
          
          // Son bir temizlik
          setTimeout(() => {
            solarParticles.dispose();
            
            // Artık kalmış olabilecek mesh'leri temizle
            this.cleanupAllMeshes();
          }, 500);
        } else {
          // Alfa değerlerini azalt
          coreMat.alpha = fadeAlpha * 0.8;
          innerCoronaMat.alpha = fadeAlpha * 0.7;
          outerCoronaMat.alpha = fadeAlpha * 0.6;
          coreLight.intensity = fadeAlpha * 2;
          
          requestAnimationFrame(fadeOut);
        }
      };
      
      // Son bir patlama efekti
      const finalBurst = new BABYLON.ParticleSystem("finalBurst", 500, this.scene);
      finalBurst.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
      finalBurst.emitter = solarCore.position.clone();
      finalBurst.color1 = new BABYLON.Color4(1, 1, 0.7, 1);
      finalBurst.color2 = new BABYLON.Color4(1, 0.7, 0.3, 1);
      finalBurst.colorDead = new BABYLON.Color4(1, 0.5, 0.1, 0);
      finalBurst.minSize = 0.3;
      finalBurst.maxSize = 0.8;
      finalBurst.minLifeTime = 0.5;
      finalBurst.maxLifeTime = 1;
      finalBurst.emitRate = 500;
      finalBurst.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
      finalBurst.direction1 = new BABYLON.Vector3(-1, -1, -1);
      finalBurst.direction2 = new BABYLON.Vector3(1, 1, 1);
      finalBurst.minEmitPower = 2;
      finalBurst.maxEmitPower = 5;
      finalBurst.manualEmitCount = 500;
      finalBurst.start();
      
      setTimeout(() => {
        finalBurst.stop();
        setTimeout(() => finalBurst.dispose(), 1000);
      }, 100);
      
      // Ekran sarsıntısı
      this.screenShake(0.5, 500);
      
      // Fade out başlat
      setTimeout(fadeOut, 300);
      
      return;
    }

    requestAnimationFrame(moveAndCheck);
  };

  moveAndCheck();
  
  // Temizleme fonksiyonu
  const cleanupFunction = () => {
    if (!isDisposed) {
      this.cleanupAllMeshes();
    }
  };
  
  // 30 saniye sonra zorla temizlik yap (güvenlik önlemi)
  setTimeout(cleanupFunction, 30000);
}



gravityComboFire() {
    this.updateComboButtonState(false);

    // Stun efektini aktifleştir
    this.stunActive = true;
    setTimeout(() => this.stunActive = false, 3000);

      // Yeni: Gravity Stun süre sayacı
  if (this.hud) {
    this.hud.showGravityStunTimer(3000);
  }

    // Merkez için daha etkileyici bir geometri - ama daha sade
    const gravityCore = BABYLON.MeshBuilder.CreatePolyhedron("gravityCore", {
        type: 2, // Dodecahedron (12 yüzlü)
        size: 1.2
    }, this.scene);

    // Daha parlak ve dinamik materyal
    const coreMat = new BABYLON.PBRMaterial("coreMat", this.scene);
    coreMat.emissiveColor = new BABYLON.Color3(0.2, 1, 0.2);
    coreMat.albedoColor = new BABYLON.Color3(0.1, 0.8, 0.1);
    coreMat.metallic = 0.7;
    coreMat.roughness = 0.3;
    coreMat.alpha = 0.9;
    gravityCore.material = coreMat;

    // Başlangıç pozisyonu
    const startPos = this.goldberg.getAbsolutePosition().clone();
    startPos.y += 2;
    gravityCore.position = startPos;

    // Dönme animasyonu
    gravityCore.rotationQuaternion = BABYLON.Quaternion.Identity();
    const rotationAnimation = () => {
        gravityCore.rotate(BABYLON.Axis.Y, 0.02, BABYLON.Space.LOCAL);
        gravityCore.rotate(BABYLON.Axis.X, 0.01, BABYLON.Space.LOCAL);
    };
    this.scene.registerBeforeRender(rotationAnimation);

    // Şeffaf küresel etki alanı - daha sade
    const gravityField = BABYLON.MeshBuilder.CreateSphere("gravityField", {
        diameter: 12,
        segments: 32
    }, this.scene);
    gravityField.parent = gravityCore;
    
    const fieldMat = new BABYLON.StandardMaterial("fieldMat", this.scene);
    fieldMat.diffuseColor = new BABYLON.Color3(0.2, 1, 0.2);
    fieldMat.alpha = 0.15;
    fieldMat.wireframe = true; // Tel kafes görünümü
    gravityField.material = fieldMat;

    // Hareket yönü
    const direction = new BABYLON.Vector3(
        Math.sin(this.goldberg.rotation.y),
        1,
        Math.sin(this.goldberg.rotation.y)
    ).normalize();

    // Ana parçacık sistemi
    const particles = new BABYLON.ParticleSystem("gravityParticles", 500, this.scene);
    particles.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
    particles.emitter = gravityCore;
    particles.minEmitBox = new BABYLON.Vector3(-1, -1, -1);
    particles.maxEmitBox = new BABYLON.Vector3(1, 1, 1);
    particles.color1 = new BABYLON.Color4(0.2, 1, 0.2, 1);
    particles.color2 = new BABYLON.Color4(0.1, 0.8, 0.1, 1);
    particles.colorDead = new BABYLON.Color4(0, 0.5, 0, 0);
    particles.minSize = 0.1;
    particles.maxSize = 0.3;
    particles.minLifeTime = 0.3;
    particles.maxLifeTime = 0.6;
    particles.emitRate = 300;
    particles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particles.gravity = new BABYLON.Vector3(0, 0, 0);
    particles.direction1 = new BABYLON.Vector3(-1, -1, -1);
    particles.direction2 = new BABYLON.Vector3(1, 1, 1);
    particles.minAngularSpeed = 0;
    particles.maxAngularSpeed = Math.PI;
    particles.updateSpeed = 0.02;
    particles.start();

    // Vurulan hedefleri takip için Set
    const hitTargets = new Set();

    // Gelişmiş çökme efekti
    const createEnhancedTileSinkEffect = (tile) => {
        const originalZ = tile.position.z;
        const originalScale = tile.scaling.clone();
        
        // Daha karmaşık ve etkileyici animasyon
        const sinkAnim = new BABYLON.Animation(
            "tileSink",
            "position.z",
            60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        
        // Daha doğal bir hareket için easing fonksiyonu
        const easingFunction = new BABYLON.CircleEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        sinkAnim.setEasingFunction(easingFunction);
        
        sinkAnim.setKeys([
            { frame: 0, value: originalZ },
            { frame: 10, value: originalZ - 0.8 },  // Daha derin çökme
            { frame: 30, value: originalZ }
        ]);
        
        // Titreşim animasyonu
        const vibrateAnim = new BABYLON.Animation(
            "tileVibrate",
            "rotation.z",
            60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        
        const vibrationKeys = [];
        for (let i = 0; i <= 30; i++) {
            vibrationKeys.push({
                frame: i,
                value: (Math.random() - 0.5) * 0.1 * Math.sin(i * 0.5)
            });
        }
        vibrateAnim.setKeys(vibrationKeys);
        
        // Ölçek animasyonu - sıkışma ve genişleme
        const scaleAnim = new BABYLON.Animation(
            "tileScale",
            "scaling",
            60,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        
        scaleAnim.setKeys([
            { frame: 0, value: originalScale },
            { frame: 10, value: new BABYLON.Vector3(originalScale.x * 1.1, originalScale.y * 1.1, originalScale.z * 0.7) }, // Yatayda genişleme, dikeyde sıkışma
            { frame: 20, value: new BABYLON.Vector3(originalScale.x * 0.9, originalScale.y * 0.9, originalScale.z * 1.2) }, // Yatayda daralma, dikeyde uzama
            { frame: 30, value: originalScale }
        ]);
        
        tile.animations = [sinkAnim, vibrateAnim, scaleAnim];
        this.scene.beginAnimation(tile, 0, 30, false);
        
        // Yeşil parçacık efekti
        const particles = new BABYLON.ParticleSystem("sinkParticles", 30, this.scene);
        particles.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
        particles.emitter = tile.getAbsolutePosition();
        particles.minEmitBox = new BABYLON.Vector3(-0.5, -0.5, -0.5);
        particles.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5);
        particles.color1 = new BABYLON.Color4(0.2, 1, 0.2, 1);
        particles.color2 = new BABYLON.Color4(0.1, 0.8, 0.1, 1);
        particles.colorDead = new BABYLON.Color4(0, 0.5, 0, 0);
        particles.minSize = 0.1;
        particles.maxSize = 0.3;
        particles.minLifeTime = 0.3;
        particles.maxLifeTime = 0.6;
        particles.emitRate = 50;
        particles.direction1 = new BABYLON.Vector3(0, 0, -1); // Aşağı doğru
        particles.direction2 = new BABYLON.Vector3(0, 0, -1);
        particles.minEmitPower = 1;
        particles.maxEmitPower = 2;
        particles.updateSpeed = 0.01;
        particles.start();
        
        setTimeout(() => {
            particles.stop();
            setTimeout(() => particles.dispose(), 600);
        }, 300);
    };

    // Daha verimli etki alanı kontrolü
    const checkEffectRadius = (position, target, radius) => {
        // Kaba kutu kontrolü (daha hızlı)
        if (Math.abs(position.x - target.x) > radius || 
            Math.abs(position.y - target.y) > radius || 
            Math.abs(position.z - target.z) > radius) {
            return false;
        }
        
        // Tam mesafe kontrolü (daha yavaş)
        return BABYLON.Vector3.Distance(position, target) < radius;
    };

    let isActive = true;
    const moveAndCheck = () => {
        if (!isActive) return;

        // İleri hareket
        gravityCore.position.addInPlace(direction.scale(0.4));

        // Base tile'ları kontrol et
        this.baseTiles.forEach(tile => {
            if (!hitTargets.has(tile.uniqueId) && checkEffectRadius(gravityCore.position, tile.position, 6)) {
                hitTargets.add(tile.uniqueId);
                createEnhancedTileSinkEffect(tile);
            }
        });

        // Relic tower'ları kontrol et
        this.relicTowers.forEach(rt => {
            if (!hitTargets.has(rt.uniqueId)) {
                const dist = BABYLON.Vector3.Distance(gravityCore.position, rt.position);
                if (dist < 6) { // Etki alanı yarıçapı
                    hitTargets.add(rt.uniqueId);
                    
                    // Gravity single fire'daki gibi devrilme efekti
                    rt.getChildren().forEach(seg => {
                        if (seg instanceof BABYLON.Mesh) {
                            const segMat = new BABYLON.StandardMaterial("segMat", this.scene);
                            segMat.emissiveColor = new BABYLON.Color3(0.2, 1, 0.2);
                            segMat.diffuseColor = new BABYLON.Color3(0.2, 1, 0.2);
                            seg.material = segMat;
                            
                            // Orijinal animateTileFall fonksiyonunu kullan
                            this.animateTileFall(seg);
                        }
                    });
                    
                    // Tower'ı diziden çıkar
                    setTimeout(() => {
                        const idx = this.relicTowers.indexOf(rt);
                        if (idx !== -1) {
                            this.relicTowers.splice(idx, 1);
                            rt.dispose();
                        }
                    }, 500);
                }
            }
        });

        // MEX/WEX tower'ları kontrol et
        this.towers.forEach(tower => {
            if (!hitTargets.has(tower.uniqueId)) {
                const dist = BABYLON.Vector3.Distance(gravityCore.position, tower.position);
                if (dist < 6) { // Etki alanı yarıçapı
                    hitTargets.add(tower.uniqueId);
                    
                    const specialTile = tower.getChildren().find(seg => 
                        seg.isSpecial && (seg.specialColor === 'red' || seg.specialColor === 'blue')
                    );

                    if (specialTile) {
                        // WEX/MEX renk kontrolü
                        const targetColor = specialTile.specialColor === 'blue' 
                            ? new BABYLON.Color3(0.6, 0.8, 1)  // WEX için mavi
                            : new BABYLON.Color3(0.2, 1, 0.2); // MEX için yeşil

                        tower.getChildren().forEach(seg => {
                            if (seg.material) {
                                seg.material.diffuseColor = targetColor;
                                seg.material.emissiveColor = targetColor;
                            }
                        });

                        // Orijinal animateTowerFall fonksiyonunu kullan
                        setTimeout(() => {
                            this.animateTowerFall(tower, () => {
                                const { xIndex: cx, yIndex: cy } = tower.baseTile.metadata;
                                this.baseTiles
                                    .filter(tile => 
                                        Math.abs(tile.metadata.xIndex - cx) <= 1 && 
                                        Math.abs(tile.metadata.yIndex - cy) <= 1
                                    )
                                    .forEach(tile => this.spawnLightTower(tile, 10));
                            });
                        }, 300);
                    }
                }
            }
        });

        // Ekran dışı kontrolü
        if (gravityCore.position.y > 60 || gravityCore.position.y < -30) {
            isActive = false;
            
            // Animasyon ve efektleri temizle
            this.scene.unregisterBeforeRender(rotationAnimation);
            
            particles.stop();
            
            // Fade out efekti
            let alpha = 1;
            const fadeOut = () => {
                alpha -= 0.02;
                if (alpha <= 0) {
                    // Tüm objeleri temizle
                    particles.dispose();
                    gravityField.dispose();
                    gravityCore.dispose();
                    return;
                }
                
                if (coreMat) coreMat.alpha = alpha;
                if (fieldMat) fieldMat.alpha = alpha * 0.15;
                
                requestAnimationFrame(fadeOut);
            };
            
            setTimeout(fadeOut, 500);
            return;
        }

        requestAnimationFrame(moveAndCheck);
    };

    // Ekran sarsıntısı efekti
    this.screenShake(0.3, 300);

    // Hareket ve kontrol döngüsünü başlat
    moveAndCheck();
}



darkComboFire() {
    this.updateComboButtonState(false);

      // Yeni: Dark Portals süre sayacı
  if (this.hud) {
    this.hud.showDarkPortalsTimer(3000); // Portal süresi
  }

    // Hexgrid ve tower'lar için yavaşlatma
    const originalSpeed = this.baseTileSpeed;
    this.baseTileSpeed *= 0.5; // %50 yavaşlatma

    setTimeout(() => {
        this.baseTileSpeed = originalSpeed;
    }, 3000);

    const projectileCount = 6;    
    const maxPortals = 6;         
    const spiralRadius = 2;       
    const portalSpacing = 10;     
    const projectileDuration = 3000;
    const projectiles = [];
    const hitTiles = new Set(); // Çekilmiş tile'ları takip için

    const startPos = this.goldberg.getAbsolutePosition().clone();
    const forward = new BABYLON.Vector3(
        Math.sin(this.goldberg.rotation.y),
        1,
        Math.sin(this.goldberg.rotation.y)
    ).normalize();

    // Base tile çekme animasyonu fonksiyonu - darkComboFire içinde
    const createTilePullEffect = (tile) => {
        if (hitTiles.has(tile.uniqueId)) return;
        hitTiles.add(tile.uniqueId);

        const originalZ = tile.position.z;
        const originalScale = tile.scaling.clone();
        
        // Daha karmaşık ve etkileyici animasyon
        const pullAnim = new BABYLON.Animation(
            "tilePull",
            "position.z",
            60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        // Daha doğal bir hareket için easing fonksiyonu
        const easingFunction = new BABYLON.CircleEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEOUT);
        pullAnim.setEasingFunction(easingFunction);

        pullAnim.setKeys([
            { frame: 0, value: originalZ },
            { frame: 15, value: originalZ + 0.8 },  // Daha yüksek çekme
            { frame: 30, value: originalZ }
        ]);
        
        // Titreşim animasyonu
        const vibrateAnim = new BABYLON.Animation(
            "tileVibrate",
            "rotation.z",
            60,
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        
        const vibrationKeys = [];
        for (let i = 0; i <= 30; i++) {
            vibrationKeys.push({
                frame: i,
                value: (Math.random() - 0.5) * 0.1 * Math.sin(i * 0.5)
            });
        }
        vibrateAnim.setKeys(vibrationKeys);
        
        // Ölçek animasyonu
        const scaleAnim = new BABYLON.Animation(
            "tileScale",
            "scaling",
            60,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        
        scaleAnim.setKeys([
            { frame: 0, value: originalScale },
            { frame: 10, value: originalScale.scale(1.1) }, // Genişleme
            { frame: 20, value: originalScale.scale(0.95) }, // Daralma
            { frame: 30, value: originalScale }
        ]);

        tile.animations = [pullAnim, vibrateAnim, scaleAnim];
        this.scene.beginAnimation(tile, 0, 30, false, 1, () => {
            tile.position.z = originalZ;
            tile.rotation.z = 0;
            tile.scaling = originalScale;
        });
        
        // Mor parçacık efekti
        const particles = new BABYLON.ParticleSystem("darkPullParticles", 30, this.scene);
        particles.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
        particles.emitter = tile.getAbsolutePosition();
        particles.minEmitBox = new BABYLON.Vector3(-0.5, -0.5, -0.5);
        particles.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5);
        particles.color1 = new BABYLON.Color4(0.5, 0, 0.7, 1);
        particles.color2 = new BABYLON.Color4(0.3, 0, 0.5, 1);
        particles.colorDead = new BABYLON.Color4(0.1, 0, 0.2, 0);
        particles.minSize = 0.1;
        particles.maxSize = 0.3;
        particles.minLifeTime = 0.3;
        particles.maxLifeTime = 0.6;
        particles.emitRate = 50;
        particles.direction1 = new BABYLON.Vector3(0, 0, 1);
        particles.direction2 = new BABYLON.Vector3(0, 0, 1);
        particles.minEmitPower = 1;
        particles.maxEmitPower = 2;
        particles.updateSpeed = 0.01;
        particles.start();
        
        setTimeout(() => {
            particles.stop();
            setTimeout(() => particles.dispose(), 600);
        }, 300);
    };

    // 1. Altıgen projectile'ları oluştur
    for(let i = 0; i < projectileCount; i++) {
        const hex = BABYLON.MeshBuilder.CreateCylinder(`darkHex_${i}`, {
            diameterTop: 1.0,
            diameterBottom: 1.0,
            height: 0.4,
            tessellation: 6
        }, this.scene);

        const mat = new BABYLON.StandardMaterial(`darkHexMat_${i}`, this.scene);
        mat.emissiveColor = new BABYLON.Color3(0.4, 0, 0.6); // Daha zengin mor
        mat.diffuseColor = new BABYLON.Color3(0.3, 0, 0.3);
        hex.material = mat;

        // Işık efekti
        const hexLight = new BABYLON.PointLight(`hexLight_${i}`, hex.position, this.scene);
        hexLight.diffuse = new BABYLON.Color3(0.4, 0, 0.6);
        hexLight.intensity = 0.7;
        hexLight.range = 3;
        hex.light = hexLight;

        // Parçacık izi
        const trail = new BABYLON.ParticleSystem(`hexTrail_${i}`, 100, this.scene);
        trail.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
        trail.emitter = hex;
        trail.minEmitBox = new BABYLON.Vector3(-0.2, -0.2, -0.2);
        trail.maxEmitBox = new BABYLON.Vector3(0.2, 0.2, 0.2);
        trail.color1 = new BABYLON.Color4(0.5, 0, 0.7, 1);
        trail.color2 = new BABYLON.Color4(0.3, 0, 0.5, 1);
        trail.colorDead = new BABYLON.Color4(0.1, 0, 0.2, 0);
        trail.minSize = 0.1;
        trail.maxSize = 0.3;
        trail.minLifeTime = 0.2;
        trail.maxLifeTime = 0.4;
        trail.emitRate = 50;
        trail.direction1 = new BABYLON.Vector3(-0.2, -0.2, -0.2);
        trail.direction2 = new BABYLON.Vector3(0.2, 0.2, 0.2);
        trail.minEmitPower = 0.5;
        trail.maxEmitPower = 1;
        trail.updateSpeed = 0.01;
        trail.start();
        hex.trail = trail;

        hex.rotation.x = Math.PI / 2;
        hex.position = startPos.clone();
        hex.initialAngle = (i * 2 * Math.PI) / projectileCount;
        
        projectiles.push(hex);
    }

    let distance = 0;
    let lastPortalDistance = 0;
    let portalCount = 0;
    const startTime = performance.now();

    // Ekran sarsıntısı efekti
    this.screenShake(0.3, 300);

    const animate = () => {
        const currentTime = performance.now();
        const elapsedTime = currentTime - startTime;

        if (elapsedTime >= projectileDuration) {
            projectiles.forEach(hex => {
                if (hex.trail) {
                    hex.trail.stop();
                    setTimeout(() => hex.trail.dispose(), 500);
                }
                if (hex.light) {
                    hex.light.dispose();
                }
                hex.dispose();
            });
            return;
        }

        // Spiral hareket ve base tile çekme kontrolü
        projectiles.forEach((hex, index) => {
            const angle = hex.initialAngle + (distance * 0.1);
            
            hex.position = startPos.clone()
                .add(forward.scale(distance))
                .add(new BABYLON.Vector3(
                    Math.cos(angle) * spiralRadius,
                    Math.sin(angle) * spiralRadius,
                    0
                ));

            // Daha karmaşık dönüş animasyonu
            hex.rotation.y += 0.1;
            hex.rotation.z = Math.sin(currentTime * 0.005 + index) * 0.2;
            
            // Işık pozisyonunu güncelle
            if (hex.light) {
                hex.light.position = hex.position.clone();
                // Işık yoğunluğu dalgalanması
                hex.light.intensity = 0.7 + 0.3 * Math.sin(currentTime * 0.01 + index * 0.5);
            }

            // Her projectile'ın etrafındaki base tile'ları çek
            this.baseTiles.forEach(tile => {
                const dist = BABYLON.Vector3.Distance(hex.position, tile.position);
                if (dist < 4) { // Çekme etki alanı
                    createTilePullEffect(tile);
                }
            });
        });

        // Portal oluşturma
        if (portalCount < maxPortals && distance - lastPortalDistance >= portalSpacing) {
            const portalPos = startPos.clone().add(forward.scale(distance));
            this.createDarkPortal(portalPos);
            lastPortalDistance = distance;
            portalCount++;
            
            // Her portal oluştuğunda ekran sarsıntısı
            this.screenShake(0.3, 200);
        }

        // Hız kontrolü - daha yumuşak hareket
        const progressRatio = elapsedTime / projectileDuration;
        const speedFactor = 1 - Math.pow(progressRatio, 2); // Zamanla yavaşlayan hareket
        distance += 1 * speedFactor;
        
        requestAnimationFrame(animate);
    };

    animate();
}

createDarkPortal(position) {
    // Portal süresi
    const portalDuration = 6000;
    const startTime = performance.now();

    // Ana portal torus
    const portal = BABYLON.MeshBuilder.CreateTorus("darkPortal", {
        diameter: 4,
        thickness: 0.5,
        tessellation: 64
    }, this.scene);

    portal.position = position;
    portal.rotation.x = Math.PI / 2;

    const portalMat = new BABYLON.StandardMaterial("portalMat", this.scene);
    portalMat.emissiveColor = new BABYLON.Color3(0.3, 0, 0.3);
    portalMat.alpha = 0.7;
    portal.material = portalMat;

    // Daha etkileyici kara delik görünümü
    const innerCore = BABYLON.MeshBuilder.CreateSphere("darkCore", {
        diameter: 1.5,
        segments: 32
    }, this.scene);
    
    innerCore.position = position;
    
    const coreMat = new BABYLON.StandardMaterial("darkCoreMat", this.scene);
    coreMat.emissiveColor = new BABYLON.Color3(0.1, 0, 0.2);
    coreMat.diffuseColor = new BABYLON.Color3(0, 0, 0);
    coreMat.specularColor = new BABYLON.Color3(0.5, 0, 0.7);
    innerCore.material = coreMat;

    // Ana particle sistemi
    const particleSystem = new BABYLON.ParticleSystem("portalParticles", 2000, this.scene);
    particleSystem.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
    particleSystem.emitter = portal;
    particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, -1);
    particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 1);
    particleSystem.color1 = new BABYLON.Color4(0.3, 0, 0.3, 1.0);
    particleSystem.color2 = new BABYLON.Color4(0.5, 0, 0.5, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0.1, 0, 0.2, 0);
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.3;
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 0.8;
    particleSystem.emitRate = 2000;
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
    particleSystem.direction1 = new BABYLON.Vector3(-1, -1, -1);
    particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.005;
    particleSystem.start();
    
    // Çekim efekti için spiral parçacık sistemi
    const spiralParticles = new BABYLON.ParticleSystem("spiralParticles", 1000, this.scene);
    spiralParticles.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
    spiralParticles.emitter = position;
    spiralParticles.minEmitBox = new BABYLON.Vector3(-5, -5, -5);
    spiralParticles.maxEmitBox = new BABYLON.Vector3(5, 5, 5);
    spiralParticles.color1 = new BABYLON.Color4(0.5, 0, 0.7, 1);
    spiralParticles.color2 = new BABYLON.Color4(0.3, 0, 0.5, 1);
    spiralParticles.colorDead = new BABYLON.Color4(0.1, 0, 0.2, 0);
    spiralParticles.minSize = 0.1;
    spiralParticles.maxSize = 0.3;
    spiralParticles.minLifeTime = 0.5;
    spiralParticles.maxLifeTime = 1.5;
    spiralParticles.emitRate = 300;
    spiralParticles.direction1 = new BABYLON.Vector3(0, 0, 0);
    spiralParticles.direction2 = new BABYLON.Vector3(0, 0, 0);
    spiralParticles.minEmitPower = 0;
    spiralParticles.maxEmitPower = 0;
    spiralParticles.updateSpeed = 0.01;
    spiralParticles.start();
    
    // Spiral hareket için özel güncelleme fonksiyonu
    spiralParticles.updateFunction = (particles) => {
        for (let p = 0; p < particles.length; p++) {
            const particle = particles[p];
            const toCenter = position.subtract(particle.position);
            const distance = toCenter.length();
            
            if (distance < 0.5) {
                particle.age = particle.lifeTime; // Merkeze ulaşan parçacıkları yok et
                continue;
            }
            
            // Spiral hareket
            const speed = 0.05 * (1 / Math.max(0.5, distance));
            const tangent = new BABYLON.Vector3(
                -toCenter.y,
                toCenter.x,
                toCenter.z
            ).normalize().scale(speed * 0.5);
            
            // Merkeze doğru çekim
            const pull = toCenter.normalize().scale(speed);
            
            particle.direction = tangent.add(pull);
            particle.size *= 0.99; // Merkeze yaklaştıkça küçült
        }
    };

    // Işık efekti
    const portalLight = new BABYLON.PointLight("portalLight", position, this.scene);
    portalLight.diffuse = new BABYLON.Color3(0.5, 0, 0.7);
    portalLight.intensity = 1;
    portalLight.range = 10;

    // Çekilen segmentleri takip etmek için
    const pulledSegments = new Set();
    
    // İşlenmiş tower'ları takip etmek için
    const processedTowers = new Set();

const pullUpdate = () => {
    const currentTime = performance.now();
    const elapsedTime = currentTime - startTime;

    // Portalın son 1 saniyesinde yavaşça kaybolma
    if (elapsedTime >= portalDuration - 1000) {
        const fadeRatio = (elapsedTime - (portalDuration - 1000)) / 1000;
        portal.material.alpha = 0.7 * (1 - fadeRatio);
        coreMat.alpha = 1 * (1 - fadeRatio);
        portalLight.intensity = 1 * (1 - fadeRatio);
        
        if (portal.material.alpha <= 0.05) {
            this.scene.unregisterBeforeRender(pullUpdate);
            particleSystem.dispose();
            spiralParticles.dispose();
            portal.dispose();
            innerCore.dispose();
            portalLight.dispose();
            return;
        }
    }

    // Çekim yarıçapı
    const pullRadius = 8; // Daha geniş çekim alanı

    // SADECE Relic Tower çekme kontrolü
    for (let j = 0; j < this.relicTowers.length; j++) {
        const tower = this.relicTowers[j];
        
        // Eğer tower yoksa veya dispose edilmişse atla
        if (!tower || !tower.position) continue;
        
        // Tower ile portal arasındaki mesafe
        const distance = BABYLON.Vector3.Distance(tower.position, position);
        
        // ÖNEMLİ: Tower merkeze çok yakınsa tamamen yok et
        if (distance < 1.5) {
            // Daha önce işlenmediyse
            if (!processedTowers.has(tower.uniqueId)) {
                processedTowers.add(tower.uniqueId);
                
                // Mor patlama efekti
                const explosionParticles = new BABYLON.ParticleSystem("towerExplosion", 200, this.scene);
                explosionParticles.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
                explosionParticles.emitter = tower.position.clone();
                explosionParticles.color1 = new BABYLON.Color4(0.7, 0.3, 1.0, 1);
                explosionParticles.color2 = new BABYLON.Color4(0.5, 0, 0.7, 1);
                explosionParticles.colorDead = new BABYLON.Color4(0.3, 0, 0.5, 0);
                explosionParticles.minSize = 0.3;
                explosionParticles.maxSize = 0.8;
                explosionParticles.minLifeTime = 0.3;
                explosionParticles.maxLifeTime = 0.6;
                explosionParticles.emitRate = 500;
                explosionParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
                explosionParticles.minEmitPower = 1;
                explosionParticles.maxEmitPower = 3;
                explosionParticles.direction1 = new BABYLON.Vector3(-1, -1, -1);
                explosionParticles.direction2 = new BABYLON.Vector3(1, 1, 1);
                explosionParticles.manualEmitCount = 200;
                explosionParticles.start();
                
                setTimeout(() => {
                    explosionParticles.stop();
                    setTimeout(() => explosionParticles.dispose(), 600);
                }, 100);
                
                // Tower'ın baseTile referansını temizle
                if (tower.baseTile) {
                    tower.baseTile.relicTower = null;
                }
                
                // Tower'ı diziden çıkar
                this.relicTowers.splice(j, 1);
                j--; // Diziden eleman çıkarıldığı için indeksi azalt
                
                // Tower'ı ve tüm alt elemanlarını temizle
                while (tower.getChildren().length > 0) {
                    const child = tower.getChildren()[0];
                    child.parent = null;
                    child.dispose();
                }
                tower.dispose();
            }
            continue;
        }
        
        if (distance < pullRadius) {
            // Tower'ı merkeze doğru çek - DAHA GÜÇLÜ ÇEKİM
            const pullDir = position.subtract(tower.position).normalize();
            
            // Zamanla artan çekim gücü
            const timeBoost = Math.min(elapsedTime / 1000, 3); // Maksimum 3x güç artışı
            const pullStrength = 0.5 * (1 + (pullRadius - distance) / pullRadius) * (1 + timeBoost * 0.5);
            
            tower.position.addInPlace(pullDir.scale(pullStrength));
            
            // Tower segmentlerini de çek
            const segments = tower.getChildren().filter(s => s instanceof BABYLON.Mesh);
            
            // Eğer hiç segment kalmadıysa tower'ı yok et
            if (segments.length === 0) {
                // Tower'ın baseTile referansını temizle
                if (tower.baseTile) {
                    tower.baseTile.relicTower = null;
                }
                
                this.relicTowers.splice(j, 1);
                tower.dispose();
                j--; // Diziden eleman çıkarıldığı için indeksi azalt
                continue;
            }
            
            segments.forEach(segment => {
                // Segment'i portala doğru çek
                const segPos = segment.getAbsolutePosition();
                const segDistance = BABYLON.Vector3.Distance(segPos, position);
                
                // Çekilirken dönme efekti
                segment.rotation.x += 0.02;
                segment.rotation.y += 0.03;
                segment.rotation.z += 0.01;
                
                // Segment portal merkezine çok yakınsa ve daha önce işlenmemişse
                if (segDistance < 2 && !pulledSegments.has(segment.uniqueId)) {
                    pulledSegments.add(segment.uniqueId);
                    
                    // Mor parçacık patlaması
                    const burstParticles = new BABYLON.ParticleSystem("burstParticles", 50, this.scene);
                    burstParticles.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
                    burstParticles.emitter = segPos;
                    burstParticles.color1 = new BABYLON.Color4(0.5, 0, 0.7, 1);
                    burstParticles.color2 = new BABYLON.Color4(0.3, 0, 0.5, 1);
                    burstParticles.colorDead = new BABYLON.Color4(0.1, 0, 0.2, 0);
                    burstParticles.minSize = 0.1;
                    burstParticles.maxSize = 0.3;
                    burstParticles.minLifeTime = 0.2;
                    burstParticles.maxLifeTime = 0.4;
                    burstParticles.emitRate = 100;
                    burstParticles.minEmitPower = 1;
                    burstParticles.maxEmitPower = 2;
                    burstParticles.manualEmitCount = 50;
                    burstParticles.start();
                    
                    setTimeout(() => burstParticles.dispose(), 500);
                    
                    // Segment'i tower'dan kaldır
                    segment.parent = null;
                    
                    // Segment'i küçülterek yok et
                    const shrinkAnim = new BABYLON.Animation(
                        "shrinkSegment",
                        "scaling",
                        60,
                        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
                        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                    );
                    
                    shrinkAnim.setKeys([
                        { frame: 0, value: segment.scaling.clone() },
                        { frame: 30, value: new BABYLON.Vector3(0.1, 0.1, 0.1) }
                    ]);
                    
                    segment.animations = [shrinkAnim];
                    this.scene.beginAnimation(segment, 0, 30, false, 1, () => {
                        if (segment && !segment.isDisposed()) {
                            segment.dispose();
                        }
                    });
                    
                    // Animasyon başarısız olursa yedek temizleme
                    setTimeout(() => {
                        if (segment && !segment.isDisposed()) {
                            segment.dispose();
                        }
                    }, 1000);
                }
            });
        }
    }

    // MEX/WEX Tower kontrolü - SADECE DÜŞÜRME, ÇEKİM YOK
    for (let i = 0; i < this.towers.length; i++) {
        const tower = this.towers[i];
        
        // Eğer tower yoksa veya dispose edilmişse atla
        if (!tower || !tower.position) continue;
        
        // Tower ile portal arasındaki mesafe
        const distance = BABYLON.Vector3.Distance(tower.position, position);
        
        if (distance < pullRadius) {
            const specialTile = tower.getChildren().find(seg => 
                seg instanceof BABYLON.Mesh && seg.isSpecial && 
                (seg.specialColor === 'red' || seg.specialColor === 'blue')
            );

            if (specialTile) {
                // Renk değişimi
                const targetColor = specialTile.specialColor === 'red' 
                    ? this.faceColor.clone() 
                    : new BABYLON.Color3(0.6, 0.8, 1);

                tower.getChildren().forEach(segment => {
                    if (segment.material) {
                        segment.material.diffuseColor = targetColor;
                        segment.material.emissiveColor = targetColor;
                    }
                });

                // Tower'ı düşür - ÇEKİM YOK
                this.animateTowerFall(tower, () => {
                    const { xIndex: cx, yIndex: cy } = tower.baseTile.metadata;
                    this.baseTiles
                        .filter(tile => 
                            Math.abs(tile.metadata.xIndex - cx) <= 1 && 
                            Math.abs(tile.metadata.yIndex - cy) <= 1
                        )
                        .forEach(tile => this.spawnLightTower(tile, 10));
                });

                // Diziden çıkar
                this.towers.splice(i, 1);
                i--; // Diziden eleman çıkarıldığı için indeksi azalt
            }
        }
    }

    // Animasyon efektleri
    portal.rotation.z += 0.02;
    innerCore.rotation.y += 0.01;
    innerCore.rotation.x += 0.005;
    
    // Işık yoğunluğu dalgalanması
    portalLight.intensity = 1 + 0.2 * Math.sin(currentTime * 0.005);
};

this.scene.registerBeforeRender(pullUpdate);

return portal;
}



// EM Combo Fire fonksiyonunu düzeltilmiş hali
// Game sınıfına eklenecek fonksiyonlar:

// 1. Fraktal yıldırım oluşturma yardımcı fonksiyonu
generateFractalLightning(start, end, disp, detail, branchChance = 0.3) {
  const points = [];
  
  function subdivide(p1, p2, currentDisp) {
    if (currentDisp < detail) {
      points.push(p1, p2);
    } else {
      // 1) İki noktanın ortası
      const mid = p1.add(p2).scale(0.5);
      
      // 2) Orta noktayı, iki nokta arasına dik vektörde rasgele kaydır
      const dir = p2.subtract(p1).normalize();
      const perp = BABYLON.Vector3.Cross(dir, BABYLON.Vector3.Up()).normalize();
      const offset = (Math.random() - 0.5) * currentDisp;
      mid.addInPlace(perp.scale(offset));
      
      // 3) İkiye böl ve sapmayı yarıya indirerek tekrar işle
      subdivide(p1, mid, currentDisp * 0.5);
      subdivide(mid, p2, currentDisp * 0.5);
      
      // Rastgele bir yan dal oluştur
      if (Math.random() < branchChance) {
        // Dal için dik eksende sapma
        const branchDir = BABYLON.Vector3.Cross(dir, perp).normalize();
        // Dalın uzunluğu: currentDisp'in %70–100 arası
        const branchLength = currentDisp * (0.7 + 0.3 * Math.random());
        const branchEnd = mid.add(branchDir.scale(branchLength));
        // Dalları biraz daha az sapmayla çiz
        subdivide(mid, branchEnd, currentDisp * 0.5);
      }
    }
  }
  
  subdivide(start, end, disp);
  return points;
}

// 2. Gelişmiş yıldırım çizgisi oluşturma fonksiyonu
createEnhancedLightningArc(start, end, scene, color = new BABYLON.Color3(0.2, 0.8, 1)) {
  // 1) Başlangıç ve bitiş arası mesafe ve sapma
  const distance = BABYLON.Vector3.Distance(start, end);
  const initialDisp = distance * 0.5; // mesafenin yarısı kadar başlangıç sapması
  const minDetail = 1.0; // daha fazla bölünme için eşik

  // 2) Fraktal noktaları üret
  const pathPoints = this.generateFractalLightning(start, end, initialDisp, minDetail, 0.4);

  // 3) Fraktal yolu Tube ile çiz
  const lightning = BABYLON.MeshBuilder.CreateTube("lightningArc", {
    path: pathPoints,
    radius: 0.05,
    tessellation: 8,
    updatable: false
  }, scene);

  // 4) Parlak materyal ata
  const mat = new BABYLON.StandardMaterial("lightningMat", scene);
  mat.emissiveColor = color.clone();
  mat.disableLighting = true;
  lightning.material = mat;

  // 5) Glow katmanı varsa ekle
  const glow = scene.getGlowLayerByName && scene.getGlowLayerByName("glow");
  if (glow) glow.addIncludedOnlyMesh(lightning);

  // 6) Kısa ömür: 80ms sonra temizle
  setTimeout(() => lightning.dispose(), 80);

  return lightning;
}

// 3. Gelişmiş elektrik çarpma efekti
createEnhancedElectricZapEffect(position) {
  // Ana elektrik patlaması
  const zap = new BABYLON.ParticleSystem("zap", 120, this.scene);
  zap.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
  zap.emitter = position.clone();
  zap.minEmitBox = new BABYLON.Vector3(-0.3, 0, -0.3);
  zap.maxEmitBox = new BABYLON.Vector3(0.3, 0, 0.3);
  
  // Daha parlak ve çeşitli renkler
  zap.color1 = new BABYLON.Color4(0.9, 1, 1, 1);
  zap.color2 = new BABYLON.Color4(0.2, 0.8, 1, 0.8);
  zap.colorDead = new BABYLON.Color4(0, 0.5, 1, 0);
  
  zap.minSize = 0.15;
  zap.maxSize = 0.35;
  zap.minLifeTime = 0.08;
  zap.maxLifeTime = 0.2;
  zap.emitRate = 600;
  zap.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
  zap.direction1 = new BABYLON.Vector3(-1, -1, -1);
  zap.direction2 = new BABYLON.Vector3(1, 1, 1);
  zap.minEmitPower = 3;
  zap.maxEmitPower = 7;
  zap.updateSpeed = 0.02;
  zap.start();
  
  // Elektrik ışığı
  const zapLight = new BABYLON.PointLight("zapLight", position.clone(), this.scene);
  zapLight.diffuse = new BABYLON.Color3(0.2, 0.8, 1);
  zapLight.intensity = 2;
  zapLight.range = 5;
  
  // Işık animasyonu
  const lightAnim = new BABYLON.Animation(
    "zapLightAnim", 
    "intensity", 
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );
  
  lightAnim.setKeys([
    { frame: 0, value: 2 },
    { frame: 5, value: 4 },
    { frame: 15, value: 0 }
  ]);
  
  zapLight.animations = [lightAnim];
  this.scene.beginAnimation(zapLight, 0, 15, false, 1, () => {
    zapLight.dispose();
  });
  
  setTimeout(() => zap.stop(), 150);
  setTimeout(() => zap.dispose(), 500);
  
  // İkincil elektrik patlaması
  setTimeout(() => {
    const secondaryZap = new BABYLON.ParticleSystem("secondaryZap", 60, this.scene);
    secondaryZap.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
    secondaryZap.emitter = position.clone();
    secondaryZap.minEmitBox = new BABYLON.Vector3(-0.2, 0, -0.2);
    secondaryZap.maxEmitBox = new BABYLON.Vector3(0.2, 0, 0.2);
    secondaryZap.color1 = new BABYLON.Color4(0.7, 0.9, 1, 0.8);
    secondaryZap.color2 = new BABYLON.Color4(0, 0.7, 1, 0.6);
    secondaryZap.colorDead = new BABYLON.Color4(0, 0.4, 0.8, 0);
    secondaryZap.minSize = 0.1;
    secondaryZap.maxSize = 0.2;
    secondaryZap.minLifeTime = 0.05;
    secondaryZap.maxLifeTime = 0.15;
    secondaryZap.emitRate = 300;
    secondaryZap.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    secondaryZap.minEmitPower = 1;
    secondaryZap.maxEmitPower = 3;
    secondaryZap.start();
    
    setTimeout(() => secondaryZap.stop(), 100);
    setTimeout(() => secondaryZap.dispose(), 300);
  }, 100);
}
// Game sınıfına ekleyin
// Game sınıfına ekleyin
strikeTowersInRadius(projectile) {
  const position = projectile.getAbsolutePosition();
  const emColor = new BABYLON.Color3(0, 0.6, 1); // EM mavi
  
  const forward = projectile.direction.scale(projectile.lightningDepth / 2);
  const up = new BABYLON.Vector3(0, projectile.lightningHeight / 2, 0);
  const right = BABYLON.Vector3.Cross(projectile.direction, BABYLON.Vector3.Up()).normalize().scale(projectile.lightningWidth / 2);
  
  const center = position.add(forward.scale(0.5));

  // 1. Normal kuleleri kontrol et (GERİYE DOĞRU DÖNGÜ)
  for (let t = this.towers.length - 1; t >= 0; t--) {
    const tower = this.towers[t];
    if (!tower || tower.isDisposed()) continue;
    if (projectile.struckTowers.has(tower.uniqueId)) continue;
    
    const towerPos = tower.position;
    const distToCenter = BABYLON.Vector3.Distance(towerPos, center);
    
    if (distToCenter < Math.max(projectile.lightningWidth, projectile.lightningHeight, projectile.lightningDepth) / 1.5) {
      for (const seg of tower.getChildren()) {
        if (seg.isSpecial && (seg.specialColor === 'red' || seg.specialColor === 'blue')) {
          const lightningStart = position.clone();
          const lightningEnd = seg.getAbsolutePosition();
          this.createEnhancedLightningArc(lightningStart, lightningEnd, this.scene, emColor);
          
          this.createEnhancedElectricZapEffect(lightningEnd);
          
          tower.getChildren().forEach(child => {
            if (child.material && child.material.diffuseColor) {
              child.material.diffuseColor.copyFrom(emColor);
              if (child.material.emissiveColor) child.material.emissiveColor.copyFrom(emColor);
            }
          });
          
          setTimeout(() => {
            this.animateTowerFall(tower, () => {
              const { xIndex: cx, yIndex: cy } = tower.baseTile.metadata;
              this.baseTiles
                .filter(tile =>
                  Math.abs(tile.metadata.xIndex - cx) <= 1 &&
                  Math.abs(tile.metadata.yIndex - cy) <= 1
                )
                .forEach(tile => this.spawnLightTower(tile, 10));
            });
          }, 400);
          
          projectile.struckTowers.add(tower.uniqueId);
          break;
        }
      }
    }
  }
  
  // 2. Relic Tower'ları kontrol et (GERİYE DOĞRU DÖNGÜ)
  for (let j = this.relicTowers.length - 1; j >= 0; j--) {
    const rt = this.relicTowers[j];
    if (!rt || rt.isDisposed()) continue; 
    if (projectile.struckRelicTowers.has(rt.uniqueId)) continue;
  
    const rtPos = rt.position;
    const distToCenter = BABYLON.Vector3.Distance(rtPos, center);
  
    if (distToCenter < Math.max(projectile.lightningWidth, projectile.lightningHeight, projectile.lightningDepth) / 1.5) {
      const segments = rt.getChildren().filter(s => s instanceof BABYLON.Mesh);
      if (segments.length > 0) {
        // ... (Bu döngünün geri kalanı aynı kalabilir)
        // Ana hedef segment
        const randomSegment = segments[Math.floor(Math.random() * segments.length)];
        const lightningStart = position.clone();
        const lightningEnd = randomSegment.getAbsolutePosition();
        this.createEnhancedLightningArc(lightningStart, lightningEnd, this.scene, emColor);
        
        this.createEnhancedElectricZapEffect(lightningEnd);
        
        // Ana segment materyal değişimi
        if (randomSegment.material) {
          const originalMaterial = {
            diffuse: randomSegment.material.diffuseColor.clone(),
            emissive: randomSegment.material.emissiveColor ? randomSegment.material.emissiveColor.clone() : null
          };

          randomSegment.material = this.emMaterial ? this.emMaterial.clone() : new BABYLON.StandardMaterial("emMat", this.scene);
          randomSegment.material.diffuseColor = emColor;
          randomSegment.material.emissiveColor = emColor;
          
          let chargeTime = 0;
          const chargeInterval = setInterval(() => {
            const intensity = Math.sin(chargeTime * 0.1) * 0.5 + 0.5;
            randomSegment.material.emissiveColor = new BABYLON.Color3(0, 0.6 * intensity, 1);
            chargeTime += 16;
            if(chargeTime >= 600) {
              clearInterval(chargeInterval);
              if (randomSegment.material) {
                randomSegment.material.diffuseColor = originalMaterial.diffuse;
                if (originalMaterial.emissive) {
                  randomSegment.material.emissiveColor = originalMaterial.emissive;
                }
              }
            }
          }, 16);
        }

        // Zincir yıldırım ve yakın segmentleri vurma
        const otherSegments = rt.getChildren()
          .filter(s => s !== randomSegment && s instanceof BABYLON.Mesh)
          .slice(0, 3);

        const hitSegmentZPositions = new Set();
        hitSegmentZPositions.add(randomSegment.position.z);

        otherSegments.forEach(target => {
          const start = lightningEnd;
          const end = target.getAbsolutePosition();
          this.createEnhancedLightningArc(start, end, this.scene, emColor);
          hitSegmentZPositions.add(target.position.z);
          
          setTimeout(() => {
            if (target.material) {
              target.material = this.emMaterial ? this.emMaterial.clone() : new BABYLON.StandardMaterial("emMat", this.scene);
              target.material.diffuseColor = emColor;
              target.material.emissiveColor = emColor;
            }
          }, 100);
        });

        setTimeout(() => {
          [randomSegment, ...otherSegments].forEach(segment => {
            this.animateTileFall(segment);
            setTimeout(() => segment.dispose(), 300);
          });

          setTimeout(() => {
            const remainingSegments = rt.getChildren()
              .filter(s => s instanceof BABYLON.Mesh)
              .sort((a, b) => a.position.z - b.position.z);

            const layerHeight = 0.9;
            remainingSegments.forEach((seg, index) => {
              if ([...hitSegmentZPositions].some(z => seg.position.z > z)) {
                const animation = new BABYLON.Animation(
                  "segmentDrop",
                  "position.z",
                  60,
                  BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                  BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
                );

                animation.setKeys([
                  { frame: 0, value: seg.position.z },
                  { frame: 30, value: layerHeight * (index + 1) }
                ]);

                seg.animations = [animation];
                this.scene.beginAnimation(seg, 0, 30, false);
              }
            });

            if (remainingSegments.length === 0) {
              const idx = this.relicTowers.indexOf(rt);
              if (idx !== -1) {
                rt.dispose();
                this.relicTowers.splice(idx, 1);
              }
            }
          }, 350);
        }, 200);

        projectile.struckRelicTowers.add(rt.uniqueId);
      }
    }
  }
}

// 4. Ana emComboFire fonksiyonu
emComboFire() {
  // Combo modunu kapat
  this.updateComboButtonState(false);
  this.emRelicHitTowers.clear();

  // Immunity shield aktif et
  this.isImmune = true;
  this.immunityEndTime = performance.now() + 6000; // 6 saniye immunity

  // Yeni: EM Shield süre sayacı ve durum bildirimi
if (this.hud) {
  this.hud.showEMShieldTimer(6000);
  this.hud.showImmunityActive();
}

  // Immunity shield görsel efekti
  const shield = BABYLON.MeshBuilder.CreateSphere("immunityShield", {
    diameter: 5,
    segments: 32
  }, this.scene);
  
  shield.parent = this.goldberg;
  shield.position = new BABYLON.Vector3(0, 0, 0);

  // Shield materyal
  const shieldMat = new BABYLON.StandardMaterial("shieldMat", this.scene);
  shieldMat.diffuseColor = new BABYLON.Color3(0, 0.6, 1);
  shieldMat.alpha = 0.3;
  shieldMat.emissiveColor = new BABYLON.Color3(0, 0.4, 1);
  shieldMat.specularPower = 128;
  shieldMat.backFaceCulling = false;
  shield.material = shieldMat;

  // Shield particle efekti
  const shieldParticles = new BABYLON.ParticleSystem("shieldParticles", 100, this.scene);
  shieldParticles.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
  shieldParticles.emitter = this.goldberg;
  shieldParticles.minEmitBox = new BABYLON.Vector3(-2, -2, -2);
  shieldParticles.maxEmitBox = new BABYLON.Vector3(2, 2, 2);
  shieldParticles.color1 = new BABYLON.Color4(0, 0.6, 1, 1);
  shieldParticles.color2 = new BABYLON.Color4(0.2, 0.5, 1, 1);
  shieldParticles.colorDead = new BABYLON.Color4(0, 0.3, 0.8, 0);
  shieldParticles.minSize = 0.2;
  shieldParticles.maxSize = 0.5;
  shieldParticles.minLifeTime = 0.3;
  shieldParticles.maxLifeTime = 0.6;
  shieldParticles.emitRate = 50;
  shieldParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
  shieldParticles.minAngularSpeed = 0;
  shieldParticles.maxAngularSpeed = Math.PI;
  shieldParticles.minEmitPower = 0.5;
  shieldParticles.maxEmitPower = 1;
  shieldParticles.updateSpeed = 0.02;
  shieldParticles.start();

  // YENİ: Shield çarpışma kontrolü için observable ekle
  const shieldCollisionObserver = this.scene.onBeforeRenderObservable.add(() => {
    // Shield aktif olduğu sürece relic tower'larla çarpışma kontrolü yap
    if (this.isImmune && shield) {
      for (let j = this.relicTowers.length - 1; j >= 0; j--) {
        const rt = this.relicTowers[j];
        if (!rt) continue;
        
        // Shield ile relic tower arasındaki mesafeyi kontrol et
        const distance = BABYLON.Vector3.Distance(
          shield.getAbsolutePosition(), 
          rt.position
        );
        
        // Çarpışma mesafesi (shield çapının yarısı + biraz tolerans)
        if (distance < 5.5) {
          // Çarpışma efekti
          const hitPos = rt.position.clone();
          
          // Elektrik çarpma efekti
          const zapEffect = new BABYLON.ParticleSystem("shieldZap", 100, this.scene);
          zapEffect.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
          zapEffect.emitter = hitPos;
          zapEffect.minEmitBox = new BABYLON.Vector3(-0.5, -0.5, -0.5);
          zapEffect.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5);
          zapEffect.color1 = new BABYLON.Color4(0, 0.6, 1, 1);
          zapEffect.color2 = new BABYLON.Color4(0.2, 0.5, 1, 1);
          zapEffect.colorDead = new BABYLON.Color4(0, 0.3, 0.8, 0);
          zapEffect.minSize = 0.2;
          zapEffect.maxSize = 0.5;
          zapEffect.minLifeTime = 0.2;
          zapEffect.maxLifeTime = 0.4;
          zapEffect.emitRate = 200;
          zapEffect.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
          zapEffect.gravity = new BABYLON.Vector3(0, 0, 0);
          zapEffect.direction1 = new BABYLON.Vector3(-1, -1, -1);
          zapEffect.direction2 = new BABYLON.Vector3(1, 1, 1);
          zapEffect.minEmitPower = 1;
          zapEffect.maxEmitPower = 3;
          zapEffect.updateSpeed = 0.01;
          zapEffect.start();
          
          setTimeout(() => {
            zapEffect.stop();
            setTimeout(() => zapEffect.dispose(), 500);
          }, 200);
          
          // Tower'ı düşür
          const segments = rt.getChildren().filter(s => s instanceof BABYLON.Mesh);
          segments.forEach(segment => {
            this.animateTileFall(segment);
          });
          
          // Tower'ı diziden çıkar
          this.relicTowers.splice(j, 1);
          
          // Bir süre sonra tower'ı temizle
          setTimeout(() => {
            rt.dispose();
          }, 500);
        }
      }
    }
  });

  // 3 saniye sonra shield'ı kaldır
  setTimeout(() => {
    // Observable'ı kaldır
    this.scene.onBeforeRenderObservable.remove(shieldCollisionObserver);
    
    // Fade out animasyonu
    let alpha = 1;
    const fadeInterval = setInterval(() => {
      alpha -= 0.05;
      if (shield.material) {
        shield.material.alpha = alpha * 0.3;
      }
      if (alpha <= 0) {
        clearInterval(fadeInterval);
        shield.dispose();
        shieldParticles.stop();
        setTimeout(() => shieldParticles.dispose(), 1000);
      }
    }, 50);

      this.isImmune = false;
  
  // Yeni: Immunity durum bildirimini kaldır
  if (this.hud) {
    this.hud.hideImmunity();
  }
  }, 3000);

  // 1. Ana EM Combo projektil oluştur
  const projectile = BABYLON.MeshBuilder.CreateCylinder("emComboProj", {
    diameterTop: 2.0,
    diameterBottom: 2.0,
    height: 0.8,
    tessellation: 6
  }, this.scene);
  
  // Parlak ve pulsar efektli materyal
  const mat = new BABYLON.StandardMaterial("emComboProjMat", this.scene);
  mat.emissiveColor = new BABYLON.Color3(0, 0.6, 1);
  mat.diffuseColor = new BABYLON.Color3(0, 0.6, 1);
  mat.specularColor = new BABYLON.Color3(1, 1, 1);
  mat.alpha = 0.8;
  projectile.material = mat;

  // Başlangıç pozisyonu ve yönü
  projectile.position = this.goldberg.getAbsolutePosition().clone();
  projectile.position.y += 3;
  
  projectile.direction = new BABYLON.Vector3(
    Math.sin(this.goldberg.rotation.y),
    1,
    Math.sin(this.goldberg.rotation.y)
  ).normalize();
  
  projectile.rotation.x = Math.PI / 2;
  projectile.rotation.y = this.goldberg.rotation.y;
  projectile.speed = 7.0;
  projectile.forwardDistance = 0;

  // Yıldırım alanı parametreleri
  projectile.lightningWidth = 24;
  projectile.lightningHeight = 12;
  projectile.lightningDepth = 10;
  projectile.lastStrikeTime = 0;
  projectile.strikeInterval = 80;
  projectile.maxLifetime = 15000;
  projectile.startTime = performance.now();
  projectile.struckTowers = new Set();
  projectile.struckRelicTowers = new Set();

  // 2. Elektrik bulutu efekti
  const electricCloud = new BABYLON.ParticleSystem("electricCloud", 200, this.scene);
  electricCloud.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
  electricCloud.emitter = projectile;
  electricCloud.minEmitBox = new BABYLON.Vector3(-1, -1, -1);
  electricCloud.maxEmitBox = new BABYLON.Vector3(1, 1, 1);
  electricCloud.color1 = new BABYLON.Color4(0.4, 0.8, 1, 0.8);
  electricCloud.color2 = new BABYLON.Color4(0, 0.6, 1, 0.6);
  electricCloud.colorDead = new BABYLON.Color4(0, 0.3, 0.8, 0);
  electricCloud.minSize = 0.3;
  electricCloud.maxSize = 0.8;
  electricCloud.minLifeTime = 0.2;
  electricCloud.maxLifeTime = 0.4;
  electricCloud.emitRate = 100;
  electricCloud.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
  electricCloud.gravity = new BABYLON.Vector3(0, 0, 0);
  electricCloud.minAngularSpeed = 0;
  electricCloud.maxAngularSpeed = Math.PI;
  electricCloud.minEmitPower = 0.5;
  electricCloud.maxEmitPower = 1;
  electricCloud.updateSpeed = 0.02;
  electricCloud.start();
  projectile.electricCloud = electricCloud;

  // 3. Ana particle sistemi
  const particles = new BABYLON.ParticleSystem("emComboParticles", 300, this.scene);
  particles.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
  particles.emitter = projectile;
  particles.minEmitBox = new BABYLON.Vector3(-0.5, -0.5, -0.5);
  particles.maxEmitBox = new BABYLON.Vector3(0.5, 0.5, 0.5);
  particles.color1 = new BABYLON.Color4(0, 0.6, 1, 1);
  particles.color2 = new BABYLON.Color4(0.4, 0.8, 1, 0.7);
  particles.colorDead = new BABYLON.Color4(0, 0.3, 0.6, 0);
  particles.minSize = 0.2;
  particles.maxSize = 0.5;
  particles.minLifeTime = 0.3;
  particles.maxLifeTime = 0.6;
  particles.emitRate = 200;
  particles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
  particles.minEmitPower = 1;
  particles.maxEmitPower = 3;
  particles.updateSpeed = 0.01;
  particles.start();
  projectile.particles = particles;

  // 4. Yıldırım alanı görselleştirme - DÜZELTME: Görünmez yap
  const lightningField = BABYLON.MeshBuilder.CreateBox("lightningField", {
    width: projectile.lightningWidth,
    height: projectile.lightningHeight,
    depth: projectile.lightningDepth
  }, this.scene);
  
  const fieldMat = new BABYLON.StandardMaterial("fieldMat", this.scene);
  fieldMat.diffuseColor = new BABYLON.Color3(0, 0.6, 1);
  fieldMat.alpha = 0; // DÜZELTME: Tamamen şeffaf yap
  fieldMat.wireframe = true;
  lightningField.material = fieldMat;
  lightningField.parent = projectile;
  lightningField.isVisible = false; // DÜZELTME: Görünmez yap
  projectile.lightningField = lightningField;

  // 5. Yıldırım update fonksiyonu
  projectile.updateLightning = () => {
    const currentTime = performance.now();
    const elapsedTime = currentTime - projectile.startTime;
    

    if (elapsedTime > projectile.maxLifetime) {
      if (projectile.particles) projectile.particles.stop();
      if (projectile.electricCloud) projectile.electricCloud.stop();
      setTimeout(() => {
        if (projectile.lightningField) projectile.lightningField.dispose();
        if (projectile.particles) projectile.particles.dispose();
        if (projectile.electricCloud) projectile.electricCloud.dispose();
        projectile.dispose();
        
        const idx = this.projectiles.indexOf(projectile);
        if (idx !== -1) this.projectiles.splice(idx, 1);
      }, 500);
      return;
    }

    if (currentTime - projectile.lastStrikeTime >= projectile.strikeInterval) {
      projectile.lastStrikeTime = currentTime;

      // Random yıldırım efektleri
      const createRandomLightning = () => {
        const origin = projectile.getAbsolutePosition();
        const randomPoint = new BABYLON.Vector3(
          origin.x + (Math.random() - 0.5) * projectile.lightningWidth,
          origin.y + (Math.random() - 0.5) * projectile.lightningHeight,
          origin.z + (Math.random() - 0.5) * projectile.lightningDepth
        );
        this.createEnhancedLightningArc(origin, randomPoint, this.scene, new BABYLON.Color3(0, 0.6, 1));
      };

      const lightningCount = 3 + Math.floor(Math.random() * 3);
      for(let i = 0; i < lightningCount; i++) {
        createRandomLightning();
      }

      this.strikeTowersInRadius(projectile);
    }

    const remainingTimeRatio = 1 - (elapsedTime / projectile.maxLifetime);
    if (projectile.material) {
      projectile.material.alpha = 0.8 * remainingTimeRatio;
    }
    if (projectile.lightningField && projectile.lightningField.material) {
      projectile.lightningField.material.alpha = 0; // DÜZELTME: Her zaman şeffaf
    }

    // Random yıldırım kontrolü
    if (!projectile._lastRandomLightning || currentTime - projectile._lastRandomLightning > 80) {
      projectile._lastRandomLightning = currentTime;
      const center = projectile.getAbsolutePosition();
      const border = this.getRandomPrismBorderPoint(projectile);
      this.createEnhancedLightningArc(center, border, this.scene, new BABYLON.Color3(0, 0.6, 1));
    }
  };

  this.projectiles.push(projectile);
}

// 5. Yardımcı fonksiyon: Prizmanın sınırında rastgele nokta üretme
getRandomPrismBorderPoint(projectile) {
  const w = projectile.lightningWidth / 2;
  const h = projectile.lightningHeight / 2;
  const d = projectile.lightningDepth / 2;

  const face = Math.floor(Math.random() * 6);
  let x = 0, y = 0, z = 0;

  switch (face) {
    case 0: x = +w; y = (Math.random() - 0.5) * 2 * h; z = (Math.random() - 0.5) * 2 * d; break;
    case 1: x = -w; y = (Math.random() - 0.5) * 2 * h; z = (Math.random() - 0.5) * 2 * d; break;
    case 2: y = +h; x = (Math.random() - 0.5) * 2 * w; z = (Math.random() - 0.5) * 2 * d; break;
    case 3: y = -h; x = (Math.random() - 0.5) * 2 * w; z = (Math.random() - 0.5) * 2 * d; break;
    case 4: z = +d; x = (Math.random() - 0.5) * 2 * w; y = (Math.random() - 0.5) * 2 * h; break;
    case 5: z = -d; x = (Math.random() - 0.5) * 2 * w; y = (Math.random() - 0.5) * 2 * h; break;
  }

  const local = new BABYLON.Vector3(x, y, z);
  return BABYLON.Vector3.TransformCoordinates(local, projectile.getWorldMatrix());
}

// ========================================================================
// --- GÜNCELLENMİŞ VE DÜZELTİLMİŞ fireProjectile FONKSİYONU ---
// ========================================================================
fireProjectile() {
    if (this.activeWingTiles.length === 0) {
        console.log("Yetersiz enerji: Ateş hakkı kalmadı!");
        return;
    }

    const usedTile = this.activeWingTiles.pop();
    usedTile.charge = 0;
    this.updateWingTileColor(usedTile);
    this.usedWingTiles.push(usedTile);

    const projectile = BABYLON.MeshBuilder.CreateCylinder("hexProjectile", {
        diameterTop: 1.2,
        diameterBottom: 1.2,
        height: 0.4,
        tessellation: 6
    }, this.scene);

    projectile.hitSphere = BABYLON.MeshBuilder.CreateSphere("hitSphere", {
        diameter: 2.5
    }, this.scene);
    projectile.hitSphere.parent = projectile;
    projectile.hitSphere.isVisible = false;

    projectile.material = new BABYLON.StandardMaterial("projMat", this.scene);
    if (this.currentMode === "mex") {
        projectile.material.emissiveColor = this.faceColor.clone();
        projectile.material.diffuseColor = this.faceColor.clone();
    } else {
        const iceColor = new BABYLON.Color3(0.6, 0.8, 1);
        projectile.material.emissiveColor = iceColor;
        projectile.material.diffuseColor = iceColor;
    }
    projectile.material.alpha = 1;

    projectile.position = this.goldberg.getAbsolutePosition().clone();
    
    // Goldberg'in baktığı yönde ateş et
    projectile.direction = new BABYLON.Vector3(
        Math.sin(this.goldberg.rotation.y),
        1,
        Math.sin(this.goldberg.rotation.y)
    ).normalize();

    projectile.rotation.x = Math.PI / 2;
    projectile.rotation.y = this.goldberg.rotation.y;
    projectile.speed = 40;

    const particles = new BABYLON.ParticleSystem("particles", 200, this.scene);
    particles.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
    particles.emitter = projectile;
    particles.minEmitBox = new BABYLON.Vector3(-0.3, 0, 0);
    particles.maxEmitBox = new BABYLON.Vector3(0.3, 0, 0);
    particles.color1 = projectile.material.emissiveColor.clone();
    particles.color2 = projectile.material.emissiveColor.scale(0.5);
    particles.minSize = 0.1;
    particles.maxSize = 0.3;
    particles.minLifeTime = 0.2;
    particles.maxLifeTime = 0.4;
    particles.emitRate = 500;
    particles.direction1 = new BABYLON.Vector3(-1, -1, -1);
    particles.direction2 = new BABYLON.Vector3(1, 1, 1);
    particles.minAngularSpeed = 0;
    particles.maxAngularSpeed = Math.PI;
    particles.minEmitPower = 1;
    particles.maxEmitPower = 3;
    particles.updateSpeed = 0.005;
    particles.start();

    projectile.particles = particles;
    this.projectiles.push(projectile);
}



// Game sınıfına yeni bir screen shake fonksiyonu ekleyelim
screenShake(intensity = 1.0, duration = 250) {
  const camera = this.scene.activeCamera;
  const originalPosition = camera.position.clone();
  let shakeTime = 0;
  
  // Sarsıntı gücünü zamanla azalt
  const shakeInterval = setInterval(() => {
    const percentComplete = shakeTime / duration;
    const currentIntensity = intensity * (1 - percentComplete);
    
    // Perlin noise benzeri daha doğal bir sarsıntı için
    const offsetX = (Math.random() - 0.5) * currentIntensity;
    const offsetY = (Math.random() - 0.5) * currentIntensity;
    const offsetZ = (Math.random() - 0.5) * currentIntensity * 0.5; // Z'de daha az sarsıntı
    
    camera.position = originalPosition.add(
      new BABYLON.Vector3(offsetX, offsetY, offsetZ)
    );
    
    shakeTime += 16; // Her frame yaklaşık 16ms
    
    if (shakeTime >= duration) {
      clearInterval(shakeInterval);
      camera.position = originalPosition; // Kamerayı orijinal pozisyonuna getir
    }
  }, 16);
}

  _incrementFireCount() {
    this.fireCount = (this.fireCount || 0) + 1;
    if (this.fireCount % 3 === 0) {
this.updateComboButtonState(true);
    }

  }

spawnLightTower(tile, height = 10) {
  const beam = BABYLON.MeshBuilder.CreateCylinder("lightBeam", {
    diameterTop: 0.4,
    diameterBottom: 0.4,
    height: height,
    tessellation: 6
  }, this.scene);
  beam.parent = this.worldRoot;
  const beamMat = new BABYLON.StandardMaterial("beamMat", this.scene);
  beamMat.emissiveColor = new BABYLON.Color3(1, 1, 0);
  beamMat.alpha = 0.4;
  beam.material = beamMat;

  // DÖNDÜR - Z eksenine yatır
  beam.rotation.x = Math.PI / 2;

  // TAM POZİSYON: tile’ın pozisyonundan yukarıya Z yönünde uzasın
  beam.position.x = tile.position.x;
  beam.position.y = tile.position.y;
  beam.position.z = tile.position.z + 0.5 + (height / 2); // üst yüzeyden yukarıya

  this.tileTowers.push(beam);
}
spawnRelicTowerGroup() {
  // 1. Ekranın üst kısmındaki sınırlar
  const topRowStart = this.spawnMinRow;  // En üst sıranın başlangıcı
  const topRowEnd = Math.min(topRowStart + 5, this.spawnMaxRow);  // 5 sıra aşağısına kadar
  
  console.log`(Spawning relic towers in rows ${topRowStart}-${topRowEnd})`;
  
  // 2. Sadece üst sıralardan filtrelenen tile'lar
  const topTiles = this.baseTiles.filter(t => {
    const { xIndex: c, yIndex: r } = t.metadata;
    return r >= topRowStart 
        && r <= topRowEnd
        && c >= this.spawnMinCol 
        && c <= this.spawnMaxCol
        && !this.towers.some(tv => tv.baseTile === t)
        // Ekle: y pozisyonu ekran sınırları içinde olsun 
        && t.position.y > 25  // Oyuncunun görebileceği yükseklikte
        && t.position.y < 50; // Ekranın çok üstünde olmasın
  });

  console.log`(Found ${topTiles.length} candidate tiles for relic towers)`;
  
  if (!topTiles.length) {
    console.log("No suitable tiles found for relic towers!");
    return;
  }

  // 3. Rastgele bir tile seç
  const baseTile = topTiles[Math.floor(Math.random() * topTiles.length)];
  const row = baseTile.metadata.yIndex;
  const colCenter = baseTile.metadata.xIndex;
  
  console.log`(Selected base tile at row ${row}, col ${colCenter})`;

  // 4. GÖRÜNÜR animasyon için tower spawn'ından önce ışık efekti oluştur
  const beamLight = new BABYLON.PointLight("relicSpawnLight", baseTile.position.clone(), this.scene);
  beamLight.diffuse = this.faceColor.clone();
  beamLight.intensity = 0.5;
  
  // 5. Işık efekti animasyonu
  const lightAnim = new BABYLON.Animation("lightAnim", "intensity", 60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  lightAnim.setKeys([
    { frame: 0, value: 0.2 },
    { frame: 15, value: 2 },
    { frame: 30, value: 0.2 }
  ]);
  beamLight.animations = [lightAnim];
  
  // 6. Animasyon çalışıp bitince tower'ları spawn et
  this.scene.beginAnimation(beamLight, 0, 30, false, 1, () => {
    // Seçilen row'daki colCenter-1, colCenter, colCenter+1 pozisyonlarında spawn 
    for (let offset = -1; offset <= 1; offset++) {
      const tile = this.getTileAt(row, colCenter + offset);
      if (tile && !this.towers.some(tv => tv.baseTile === tile)) {
        this.spawnRelicTowerOnBaseTile(tile);
        console.log`(Spawned relic tower at row ${row}, col ${colCenter + offset})`;
      }
    }
    
    // Işığı temizle
    beamLight.dispose();
  });
}

// Game sınıfına yeni bir fonksiyon ekleyelim
drainWingTileEnergy() {
  // Aktif wing tile varsa birini deaktif et
  if (this.activeWingTiles.length > 0) {
    const drainedTile = this.activeWingTiles.pop();
    drainedTile.charge = 0;
    this.updateWingTileColor(drainedTile);
    this.usedWingTiles.push(drainedTile);

    // Görsel feedback için efekt
    const drainEffect = new BABYLON.ParticleSystem("drainEffect", 50, this.scene);
    drainEffect.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
    drainEffect.emitter = drainedTile;
    drainEffect.minEmitBox = new BABYLON.Vector3(-0.1, -0.1, -0.1);
    drainEffect.maxEmitBox = new BABYLON.Vector3(0.1, 0.1, 0.1);
    drainEffect.color1 = new BABYLON.Color4(1, 0, 0, 1);
    drainEffect.color2 = new BABYLON.Color4(0.5, 0, 0, 1);
    drainEffect.colorDead = new BABYLON.Color4(0.2, 0, 0, 0);
    drainEffect.minSize = 0.1;
    drainEffect.maxSize = 0.3;
    drainEffect.minLifeTime = 0.2;
    drainEffect.maxLifeTime = 0.4;
    drainEffect.emitRate = 100;
    drainEffect.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    drainEffect.gravity = new BABYLON.Vector3(0, 5, 0);
    drainEffect.start();

    setTimeout(() => {
      drainEffect.stop();
      setTimeout(() => drainEffect.dispose(), 500);
    }, 200);

    // Yeni: Enerji drained bildirimi göster
    if (this.hud) {
      this.hud.showEnergyDrained();
    }

    return true;
  }
  return false;
}

spawnRelicTowerOnBaseTile(tile) {
  // ——— Sınır kontrolü ———
const c = tile.metadata.xIndex, r = tile.metadata.yIndex;
if (c < this.spawnMinCol || c > this.spawnMaxCol ||
    r < this.spawnMinRow || r > this.spawnMaxRow) {
  return;  // relic tower spawn’ı iptal
}
  const height = 10;
  const towerNode = new BABYLON.TransformNode("relicTower", this.scene);
  towerNode.parent = this.worldRoot;
  towerNode.position = tile.position.clone();

  for (let z = 1; z <= height; z++) {
  // (1) hex mesh’i oluşturulduğu kısım aynı
  const hex = BABYLON.MeshBuilder.CreateCylinder("relicTile", {
    diameterTop: this.gridRadius*2,
    diameterBottom: this.gridRadius*2,
    height: 0.7,
    tessellation: 6
  }, this.scene);
  hex.rotation.x = Math.PI/2;
  hex.position   = new BABYLON.Vector3(0, 0, z*0.9);
  hex.parent     = towerNode;

  // (2) Sadece z === height ise run rengini ver, diğerlerinde baseMaterial rengi
  const mat = new BABYLON.StandardMaterial("relicTileMat_"+z, this.scene);
  mat.diffuseColor = (z === height)
    ? this.faceColor.clone()
    : this.baseMaterial.diffuseColor.clone();
  hex.isRelicTile = true;
  hex.material = mat;
 
  }

  this.relicTowers.push(towerNode);
}

    getCurrentIntensity(time) {
      const baseIntensity = 10;
      const increment = Math.floor(time / 20);
      return Math.min(baseIntensity + increment, 50);
    }

    getCurrentLightSettings(time) {
      const level = Math.floor(time / 90);
      const settings = [];
      settings.push({ angle: 0, chance: 0.3 });
      if (level >= 1) settings.push({ angle: 15, chance: 0.3 });
      if (level >= 2) settings.push({ angle: 30, chance: 0.2 });
      if (level >= 3) settings.push({ angle: 45, chance: 0.1 });
      if (level >= 4) settings.push({ angle: 60, chance: 0.05 });
      if (level >= 5) settings.push({ angle: 75, chance: 0.05 });
      return settings;
    }

    selectRandomLightSetting(settings) {
      const rand = Math.random();
      let cumulative = 0;
      for (let s of settings) {
        cumulative += s.chance;
        if (rand <= cumulative) return s;
      }
      return settings[settings.length - 1];
    }

    isTileEmpty(tile) {
      return !this.tileTowers.some(tw =>
        Math.abs(tw.position.x - tile.position.x) < 0.5 &&
        Math.abs(tw.position.y - tile.position.y) < 0.5
      );
    }

    getTileAt(row, col) {
      return this.baseTiles.find(t =>
        t.metadata.xIndex === col && t.metadata.yIndex === row
      );
    }

// Game sınıfının içine eklenecek yeni fonksiyonlar

createGUI() {
    // Joystick ve butonları oluştur
    if (this.joystickController) {
        this.joystickController.createUI(this.camera);
    }
    
    if (this.actionButtonsController) {
        this.actionButtonsController.createUI(this.camera);
    }

    // YENİ: Pozisyon göstergelerini oluştur - Bu satırın aktif olduğundan emin olun
    this.createPositionIndicators();
    
    // Her zaman göster (mobil veya değil)
    if (this.joystickController) {
        this.joystickController.show();
    }
    
    if (this.actionButtonsController) {
        this.actionButtonsController.show();
    }
    
    // Ekran boyutu değiştiğinde UI'ı güncelle
    window.addEventListener("resize", () => {
        if (this.joystickController) {
            this.joystickController.updatePosition();
            this.joystickController.adjustUIScale();
        }
        
        if (this.actionButtonsController) {
            this.actionButtonsController.updatePosition();
            this.actionButtonsController.adjustUIScale();
        }
        
        // YENİ: Pozisyon göstergelerini de güncelle
        this.updatePositionIndicators();
    });
}


updateComboButtonState(isEnabled) {
  this.comboMode = isEnabled;
  if (this.actionButtonsController) {
    this.actionButtonsController.updateComboButtonState(isEnabled);
  }
  
  // Yeni: Combo hazır olduğunda bildirim göster
  if (isEnabled && this.hud) {
    this.hud.showComboReady();
  }
}




// ========================================================================
// --- GÜNCELLENMİŞ VE DÜZELTİLMİŞ UPDATE FONKSİYONU ---
// ========================================================================
update() {
    const delta = this.engine.getDeltaTime() / 1000;

    // 1. ZAMANLAYICILAR VE OYUN DURUMU GÜNCELLEMESİ
    this.elapsedTime += delta;
    this.timerElem.textContent = this.formatTime(this.elapsedTime);

    const progress = this.spawnedTowers / this.targetTowers;
    // DÜZELTME: HIZ DEĞERİ ARTIRILDI. Delta time ile uyumlu olması için ~50 kat artırıldı.
    this.baseTileSpeed = 10 + progress * 5; 

    if (this.isImmune && performance.now() > this.immunityEndTime) {
        this.isImmune = false;
    }

    // 2. DÜNYA ELEMANLARININ HAREKETİ (TEK BLOKTA BİRLEŞTİRİLDİ)
    if (!this.stunActive) {
        const tileSpeed = this.baseTileSpeed * delta;

        for (let tile of this.baseTiles) {
            tile.position.y -= tileSpeed;
        }
        for (let tower of [...this.towers, ...this.relicTowers]) {
            tower.position.y -= tileSpeed;
        }
        for (let i = this.tileTowers.length - 1; i >= 0; i--) {
            const tile = this.tileTowers[i];
            tile.position.y -= tileSpeed;
            if (tile.position.y < -30) {
                tile.dispose();
                this.tileTowers.splice(i, 1);
            }
        }
    }

    if (this.isMoving && this.targetZ !== undefined) {
        const moveSpeed = 0.2; // Hareket hızı
        const distanceToTarget = this.targetZ - this.goldberg.position.z;
        
        if (Math.abs(distanceToTarget) < 0.05) {
            // Hedefe vardık
            this.goldberg.position.z = this.targetZ;
            this.isMoving = false;
        } else {
            // Hedefe doğru hareket et
            this.goldberg.position.z += Math.sign(distanceToTarget) * moveSpeed;
        }
    }

    // 3. MERMİ (PROJECTILE) GÜNCELLEMELERİ
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const p = this.projectiles[i];

        if (p.updateLightning) { // EM Combo mermisi
            if (p.direction && typeof p.speed === 'number') {
                p.position.addInPlace(p.direction.scale(p.speed * delta));
                p.forwardDistance += p.speed * delta;
            }
            p.updateLightning();
            continue;
        }

        if (p.direction && typeof p.speed === 'number') {
            p.position.addInPlace(p.direction.scale(p.speed * delta));
        }

        if (this.fireHandler.single(this, i)) {
            continue;
        }

        if (p.position.y > 60 || p.position.y < -30) {
            if (p.pulseInterval) clearInterval(p.pulseInterval);
            if (p.electricParticles) p.electricParticles.dispose();
            if (p.hitSphere) p.hitSphere.dispose();
            if (p.particles) p.particles.dispose();
            p.dispose();
            this.projectiles.splice(i, 1);
        }
    }

    // 4. DÜŞEN PARÇACIKLARIN (DROPS) TOPLANMASI
    for (let i = this.drops.length - 1; i >= 0; i--) {
        const drop = this.drops[i];
        const target = this.goldberg.getAbsolutePosition();
        drop.position = BABYLON.Vector3.Lerp(drop.position, target, 0.1);
        drop.position.y -= this.baseTileSpeed * delta;
        if (BABYLON.Vector3.Distance(drop.position, target) < 1.5) {
            this.dropCount++;
            this.dropElem.textContent = `Drops: ${this.dropCount}`;
            drop.dispose();
            this.drops.splice(i, 1);
        } else if (drop.position.y < -30) {
            drop.dispose();
            this.drops.splice(i, 1);
        }
    }

    // 5. YENİ KULELERİN OLUŞTURULMASI (SPAWNING)
    this.tileSpawnTimer += delta;
    if (this.spawnedTowers < this.targetTowers && this.tileSpawnTimer >= this.tileSpawnInterval) {
        const validTiles = this.baseTiles.filter(t => t.position.y > 38 && t.metadata.xIndex >= this.spawnMinCol && t.metadata.xIndex <= this.spawnMaxCol && t.metadata.yIndex >= this.spawnMinRow && t.metadata.yIndex <= this.spawnMaxRow);
        if (validTiles.length) {
            const tile = validTiles[Math.floor(Math.random() * validTiles.length)];
            if (this.spawnTowerOnBaseTile(tile, this.elapsedTime)) {
                this.tileSpawnTimer = 0;
            }
        }
    }
    this.relicSpawnTimer += delta;
    if (this.elapsedTime >= this.relicSpawnStartTime && this.relicSpawnTimer >= this.relicSpawnInterval) {
        this.spawnRelicTowerGroup();
        this.relicSpawnTimer = 0;
    }

    // 6. GÖRSEL ARAYÜZ (GUI) VE EFEKT GÜNCELLEMELERİ
    this.updateWingBeam();
    this.updatePositionIndicators();


// 7. OYUNCU ÇARPIŞMA KONTROLÜ
for (let j = this.relicTowers.length - 1; j >= 0; j--) {
    const rt = this.relicTowers[j];
    for (const seg of rt.getChildren()) {
        if (seg instanceof BABYLON.Mesh && this.goldberg.intersectsMesh(seg, true)) {
            if (!this.isImmune) {
                if (this.drainWingTileEnergy()) {
                    this.screenShake(0.4, 400);
                    
                    // Çarpışma noktasında kırmızı yanıp sönme efekti
                    if (seg.material) {
                        const originalEmissive = seg.material.emissiveColor ? seg.material.emissiveColor.clone() : null;
                        seg.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
                        
                        setTimeout(() => {
                            if (seg.material && originalEmissive) {
                                seg.material.emissiveColor = originalEmissive;
                            }
                        }, 200);
                    }
                } else {
                    this.screenShake(0.4, 400);
                    this.onGameOver();
                }
            } else {
                // Immune iken çarpışma gerçekleşirse farklı bir efekt göster
                const deflectEffect = new BABYLON.ParticleSystem("deflect", 50, this.scene);
                deflectEffect.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
                deflectEffect.emitter = this.goldberg.position;
                deflectEffect.minEmitBox = new BABYLON.Vector3(-1, -1, -1);
                deflectEffect.maxEmitBox = new BABYLON.Vector3(1, 1, 1);
                deflectEffect.color1 = new BABYLON.Color4(0, 0.6, 1, 1);
                deflectEffect.color2 = new BABYLON.Color4(0.2, 0.5, 1, 1);
                deflectEffect.colorDead = new BABYLON.Color4(0, 0.3, 0.8, 0);
                deflectEffect.minSize = 0.2;
                deflectEffect.maxSize = 0.4;
                deflectEffect.minLifeTime = 0.1;
                deflectEffect.maxLifeTime = 0.2;
                deflectEffect.emitRate = 100;
                deflectEffect.start();
                setTimeout(() => {
                    deflectEffect.stop();
                    setTimeout(() => deflectEffect.dispose(), 200);
                }, 100);
            }
            break;
        }
    }
}

if (this.gridMovementEnabled && this.isMoving) {
    const currentY = this.worldRoot.position.y;
    const distanceToTarget = this.targetY - currentY;
    
    // Hedefe yaklaştık mı?
    if (Math.abs(distanceToTarget) < 0.01) {
        this.worldRoot.position.y = this.targetY;
        this.isMoving = false;
    } else {
        // Hedefe doğru hareket et (yumuşak geçiş)
        const step = Math.sign(distanceToTarget) * Math.min(Math.abs(distanceToTarget), this.gridMovementStep * 0.1);
        this.worldRoot.position.y += step;
    }
}


    // 8. GERİ DÖNÜŞÜM VE ŞARJ İŞLEMLERİ
    this.recycleBaseTiles();
    for (let i = this.tileTowers.length - 1; i >= 0; i--) {
        const beam = this.tileTowers[i];
        if (beam.name !== "lightBeam") continue;
        for (let j = this.usedWingTiles.length - 1; j >= 0; j--) {
            const wingTile = this.usedWingTiles[j];
            if (beam.intersectsMesh(wingTile, true)) {
                wingTile.charge = 1;
                this.updateWingTileColor(wingTile);
                this.activeWingTiles.push(this.usedWingTiles.splice(j, 1)[0]);

                     // Yeni: Enerji kazanımı bildirimi
      if (this.hud) {
        this.hud.showEnergyGained();
      }
                beam.dispose();
                this.tileTowers.splice(i, 1);
                break;
            }
        }
    }
}



updateWingBeam() {
    if (!this.wingBeam || !this.goldberg || !this.beamBottom) return;
    
    // Goldberg'in dünya koordinatlarındaki pozisyonu
    const goldbergWorldPos = this.goldberg.getAbsolutePosition();
    
    // Zemin pozisyonu (aynı X,Z koordinatları, Y=0)
    const groundPos = new BABYLON.Vector3(
        goldbergWorldPos.x,
        0, // Zemin Y koordinatı
        goldbergWorldPos.z
    );
    
    // Işın uzunluğunu hesapla
    const distance = BABYLON.Vector3.Distance(goldbergWorldPos, groundPos);
    
    // Işın uzunluğunu güncelle
    this.wingBeam.scaling.y = distance / 10; // 10 = başlangıç uzunluğu
    
    // Alt kürenin pozisyonunu güncelle
    this.beamBottom.position = groundPos;
    
    // Işın rengini yüksekliğe göre değiştir (opsiyonel)
    const maxHeight = 15; // Maksimum beklenen yükseklik
    const heightRatio = Math.min(distance / maxHeight, 1);
    
    // Renk geçişi: Mavi (alçak) -> Yeşil (orta) -> Kırmızı (yüksek)
    const r = Math.floor(255 * heightRatio);
    const g = Math.floor(255 * (1 - Math.abs(heightRatio - 0.5) * 2));
    const b = Math.floor(255 * (1 - heightRatio));
    
    if (this.wingBeam.material) {
        this.wingBeam.material.emissiveColor = new BABYLON.Color3(r/255, g/255, b/255);
        this.wingBeam.material.diffuseColor = new BABYLON.Color3(r/255, g/255, b/255);
    }

    // Çentiklerin görünürlüğünü güncelle
    if (this.heightMarkers) {
        this.heightMarkers.forEach((marker, index) => {
            // Işın uzunluğuna göre çentikleri göster/gizle
            const markerHeight = (index + 1);
            marker.isVisible = distance >= markerHeight;
        });
    }




// Goldberg ile Relic Tower çarpışma kontrolü
for (let j = this.relicTowers.length - 1; j >= 0; j--) {
  const rt = this.relicTowers[j];
  const rtSegments = rt.getChildren().filter(s => s instanceof BABYLON.Mesh);
  
  for (const seg of rtSegments) {
    const segPos = seg.getAbsolutePosition();
    const goldbergPos = this.goldberg.getAbsolutePosition();
    
    if (BABYLON.Vector3.Distance(segPos, goldbergPos) < 2.5) {
      if (!this.isImmune) {
        if (this.drainWingTileEnergy()) {
          this.screenShake(0.4, 400);
          
          if (seg.material) {
            const originalEmissive = seg.material.emissiveColor ? seg.material.emissiveColor.clone() : null;
            seg.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
            
            setTimeout(() => {
              if (seg.material && originalEmissive) {
                seg.material.emissiveColor = originalEmissive;
              }
            }, 200);
          }

          const warningText = new BABYLON.GUI.TextBlock();
          warningText.text = "Energy Drained!";
          warningText.color = "red";
          warningText.fontSize = 24;
          warningText.alpha = 1;
          this.gui.addControl(warningText);

          // Warning text'i biraz daha dramatik hale getirelim
          warningText.scaleX = 1.5;
          warningText.scaleY = 1.5;

          let alpha = 1;
          const fadeInterval = setInterval(() => {
            alpha -= 0.05;
            warningText.alpha = alpha;
            if (alpha <= 0) {
              clearInterval(fadeInterval);
              this.gui.removeControl(warningText);
            }
          }, 50);
        }
        else if (this.activeWingTiles.length === 0) {
          this.screenShake(0.4, 400);
          this.onGameOver();
        }
      } else {
        // Immune iken çarpışma gerçekleşirse farklı bir efekt göster
        const deflectEffect = new BABYLON.ParticleSystem("deflect", 50, this.scene);
        deflectEffect.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
        deflectEffect.emitter = this.goldberg.position;
        deflectEffect.minEmitBox = new BABYLON.Vector3(-1, -1, -1);
        deflectEffect.maxEmitBox = new BABYLON.Vector3(1, 1, 1);
        deflectEffect.color1 = new BABYLON.Color4(0, 0.6, 1, 1);
        deflectEffect.color2 = new BABYLON.Color4(0.2, 0.5, 1, 1);
        deflectEffect.colorDead = new BABYLON.Color4(0, 0.3, 0.8, 0);
        deflectEffect.minSize = 0.2;
        deflectEffect.maxSize = 0.4;
        deflectEffect.minLifeTime = 0.1;
        deflectEffect.maxLifeTime = 0.2;
        deflectEffect.emitRate = 100;
        deflectEffect.start();
        setTimeout(() => {
          deflectEffect.stop();
          setTimeout(() => deflectEffect.dispose(), 200);
        }, 100);
      }
    }
  }
}


  this.recycleBaseTiles();


// Wing tile recharge check
for (let i = this.tileTowers.length - 1; i >= 0; i--) {
  const beam = this.tileTowers[i];
  // Skip if not a light beam
  if (beam.name !== "lightBeam") continue;

  for (let j = this.usedWingTiles.length - 1; j >= 0; j--) {
    const wingTile = this.usedWingTiles[j];
    if (beam.intersectsMesh(wingTile, true)) {
      // Recharge
      wingTile.charge = 1;
      this.updateWingTileColor(wingTile);
      this.usedWingTiles.splice(j, 1);
      this.activeWingTiles.push(wingTile);

 

      // Remove beam
      beam.dispose();
      this.tileTowers.splice(i, 1);
      break;
    }
  }
}


}
fireWexAt(segment) {
  if (!this.wexComboMesh || !segment) return;
  const origin = this.wexComboMesh.getAbsolutePosition().clone();
  origin.y += 2; // Mermiyi biraz yukarıdan başlat
  const target = segment.getAbsolutePosition();
  const dir = target.subtract(origin).normalize();

  const proj = BABYLON.MeshBuilder.CreateCylinder("wexProj", {
    diameterTop: 0.5, diameterBottom: 0.5, height:0.2, tessellation:6
  }, this.scene);
  const mat = new BABYLON.StandardMaterial("wexProjMat", this.scene);
  mat.emissiveColor = new BABYLON.Color3(0.6,0.8,1);
  mat.diffuseColor   = mat.emissiveColor.clone();
  proj.material      = mat;

  proj.position  = origin.clone();
  proj.direction = dir;
  proj.speed     = 2;
  proj.isCombo   = true;
  proj.basePos   = origin.clone();
  proj.forwardDistance = 0;
  proj.target = target.clone(); // Hedefi kaydet

  this.projectiles.push(proj);
}
// Game sınıfının içine ekleyin (en sonda olabilir)

// Debug gösterimleri açık/kapalı
showCollisionDebug = false; // İsterseniz true yapabilirsiniz

// Çizginin küreyle kesişip kesişmediğini kontrol eder
lineIntersectsSphere(lineStart, lineEnd, sphereCenter, sphereRadius) {
  const line = lineEnd.subtract(lineStart);
  const lineLength = line.length();
  const lineDir = line.normalize();
  
  // Küre merkezinden çizgiye olan en kısa mesafeyi bul
  const startToCenter = sphereCenter.subtract(lineStart);
  const projection = BABYLON.Vector3.Dot(startToCenter, lineDir);
  
  // Eğer projeksiyon negatif veya çizgiden uzunsa, en yakın nokta çizgi dışındadır
  if (projection < 0 || projection > lineLength) {
    return false;
  }
  
  // Küre merkezinden çizgiye olan en kısa mesafe
  const closestPoint = lineStart.add(lineDir.scale(projection));
  const distance = BABYLON.Vector3.Distance(sphereCenter, closestPoint);
  
  // Mesafe küre yarıçapından küçükse kesişim vardır
  return distance <= sphereRadius;
}

// Çizgi ile kürenin kesişim noktasını bulur
getLineSphereIntersection(lineStart, lineEnd, sphereCenter, sphereRadius) {
  const line = lineEnd.subtract(lineStart);
  const lineDir = line.normalize();
  
  const startToCenter = sphereCenter.subtract(lineStart);
  const projection = BABYLON.Vector3.Dot(startToCenter, lineDir);
  
  // Küre merkezinden çizgiye olan en kısa mesafe
  const closestPoint = lineStart.add(lineDir.scale(projection));
  
  // Küre yüzeyine doğru ilerle
  const centerToClosest = closestPoint.subtract(sphereCenter);
  const dirToSurface = centerToClosest.normalize();
  
  // Küre yüzeyindeki kesişim noktası
  return sphereCenter.add(dirToSurface.scale(sphereRadius));
}

 //}  // <-- Burada update() metodu kapanıyor

  // saniyeyi mm:ss formatına çevirir
  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

onGameOver() {
  this.engine.stopRenderLoop();
  document.getElementById("renderCanvas").style.display = "none";
  document.getElementById("hud").style.display = "none";
  document.getElementById("endScreen").style.display = "flex";
  
  // Yeni: Tüm HUD bildirimlerini temizle
  if (this.hud) {
    this.hud.clearAll();
  }
  
  // Restart butonuna basıldığında Living Hub'a geri dön
  const restartBtn = document.getElementById("restartBtn");
  const newRestartBtn = restartBtn.cloneNode(true);
  restartBtn.parentNode.replaceChild(newRestartBtn, restartBtn);
  newRestartBtn.addEventListener("click", () => {
    this.engine.dispose();
    window.location.href = "goldberg.html"; // Living Hub'a geri dön
  });
} // <-- onGameOver() kapanışı


createHitExplosion(position) {
  console.log("Creating hit explosion at", position);
  
  // 1. Patlama ışığı
  const explosionLight = new BABYLON.PointLight("explosionLight", position.clone(), this.scene);
  explosionLight.diffuse = this.faceColor.clone();
  explosionLight.intensity = 1.5;
  explosionLight.range = 10;
  
  // 2. Gelişmiş particle sistemi
  const explosion = new BABYLON.ParticleSystem("explosion", 200, this.scene); // 50'den 200'e çıkarıldı
  explosion.particleTexture = new BABYLON.Texture("https://playground.babylonjs.com/textures/flare.png", this.scene);
  explosion.emitter = position.clone();
  explosion.minEmitBox = new BABYLON.Vector3(-1, -1, -1); // Daha geniş
  explosion.maxEmitBox = new BABYLON.Vector3(1, 1, 1);   // Daha geniş
  
  // Daha parlak renkler
  explosion.color1 = this.faceColor.scale(1.2);  // Daha parlak
  explosion.color2 = this.faceColor.scale(0.8);  // Daha koyu
  
  // Daha büyük parçacıklar
  explosion.minSize = 0.5;  // 0.3'ten
  explosion.maxSize = 1.2;  // 0.8'den
  
  // Daha uzun ömürlü
  explosion.minLifeTime = 0.3;  // 0.2'den
  explosion.maxLifeTime = 0.8;  // 0.4'ten
  
  // Daha yüksek yayılma hızı
  explosion.minEmitPower = 3;  // 2'den
  explosion.maxEmitPower = 8;  // 4'ten
  
  explosion.emitRate = 1000;  // 500'den
  explosion.updateSpeed = 0.01;
  
  // Yeni: Renkli parçacık izi
  explosion.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 1));
  explosion.addColorGradient(0.4, new BABYLON.Color4(
    this.faceColor.r,
    this.faceColor.g,
    this.faceColor.b,
    0.8
  ));
  explosion.addColorGradient(0.7, new BABYLON.Color4(
    this.faceColor.r * 0.7,
    this.faceColor.g * 0.7,
    this.faceColor.b * 0.7,
    0.4
  ));
  explosion.addColorGradient(1.0, new BABYLON.Color4(0, 0, 0, 0));
  
  // Patlama başlat
  explosion.start();
  
  // Işık animasyonu
  const lightAnim = new BABYLON.Animation(
    "explosionLightAnim", 
    "intensity", 
    60,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
  );
  
  lightAnim.setKeys([
    { frame: 0, value: 1.5 },
    { frame: 5, value: 3 },
    { frame: 20, value: 0 }
  ]);
  
  explosionLight.animations = [lightAnim];
  this.scene.beginAnimation(explosionLight, 0, 20, false, 1, () => {
    explosionLight.dispose();
  });
  
  // Patlamanın daha uzun süre görünmesi için timeout sürelerini arttır
  setTimeout(() => {
    explosion.stop();
    // Tüm parçacıklar bitince dispose et
    setTimeout(() => explosion.dispose(), 800);  // 500'den 800'e
  }, 400);  // 200'den 400'e
}
}



window.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById('renderCanvas');
  
});