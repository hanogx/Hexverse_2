
// HexRun integration adapter — parity with original HUD/camera + themed Back button
(function(){
  function ensureScript(src){
    return new Promise((resolve) => {
      if ([...document.getElementsByTagName('script')].some(s => s.src.includes(src))) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.defer = true;
      s.onload = () => resolve();
      document.head.appendChild(s);
    });
  }
  function ensureBabylon(){
    const needsCore = (typeof window.BABYLON === 'undefined');
    const needsGUI = !(window.BABYLON && window.BABYLON.GUI);
    const promises = [];
    if (needsCore) promises.push(ensureScript("https://cdn.babylonjs.com/babylon.js"));
    if (needsGUI) promises.push(ensureScript("https://cdn.babylonjs.com/gui/babylon.gui.min.js"));
    return Promise.all(promises);
  }
  function ensureCanvas(){
    // Respect skeleton's layout and styles; don't override.
    let canvas = document.getElementById('renderCanvas');
    if (!canvas){
      canvas = document.createElement('canvas');
      canvas.id = 'renderCanvas';
      document.body.appendChild(canvas);
    }
    return canvas;
  }
  function ensureHudAndEndScreen(){
    // Use original DOM markup for parity with user's hexrun.html
    let hud = document.getElementById('hud');
    if (!hud){
      hud = document.createElement('div');
      hud.id = 'hud';
      hud.innerHTML = '<span id="timer">00:00</span>' +
                      '<span id="spawnedCount" style="margin-left:20px">Spawned: 0</span>' +
                      '<span id="hitCount" style="margin-left:20px">Hits: 0</span>' +
                      '<span id="dropCount" style="margin-left:20px">Drops: 0</span>';
      document.body.appendChild(hud);
    }
    let endScreen = document.getElementById('endScreen');
    if (!endScreen){
      endScreen = document.createElement('div');
      endScreen.id = 'endScreen';
      endScreen.innerHTML = '<p>Run Over!</p><button id="restartBtn">BACK TO HUB</button>';
      document.body.appendChild(endScreen);
    }
    // Enforce Orbitron for warnings per design language
    const styleId = 'hexrun-orbitron-hud-style';
    if (!document.getElementById(styleId)){
      const st = document.createElement('style');
      st.id = styleId;
      st.textContent = `html, body { margin:0; padding:0; overflow:hidden; width:100%; height:100%; }\ncanvas { width:100%; height:100%; display:block; }\n
        #hud {
          position: absolute; top: 10px; left: 10px;
          color: white; font-family: 'Orbitron', sans-serif;
          font-size: 24px; display: none; z-index: 10; text-shadow: 0 0 5px black;
        }
        #endScreen {
          position: absolute; top:0; left:0; width:100%; height:100%; display:none;
          flex-direction: column; align-items: center; justify-content: center;
          background-color: rgba(0,0,0,0.9); color: white; font-family: 'Orbitron', sans-serif; z-index: 20;
        }
        #endScreen p { font-size: 32px; margin-bottom: 20px; text-shadow: 0 0 10px #FF4500; }
        #endScreen button { padding: 10px 20px; font-size: 18px; background: transparent; color: white; border: 2px solid white; cursor: pointer; }
        #endScreen button:hover { background: rgba(255,255,255,0.08); }
      `;
      document.head.appendChild(st);
    }
    // Hook the endScreen button to hub
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn){
      restartBtn.onclick = () => { location.href = window.__hubUrl || 'index.html'; };
    }
    return { hud, endScreen };
  }
  function ensureThemedBackBtn(){
    let wrap = document.getElementById('runBackBtnContainer');
    if (!wrap){
      wrap = document.createElement('div');
      wrap.id = 'runBackBtnContainer';
      wrap.style.position = 'absolute';
      wrap.style.top = '12px';
      wrap.style.right = '12px';
      wrap.style.zIndex = '15';
      const btn = document.createElement('button');
      btn.id = 'runBackBtn';
      btn.className = 'btn run sm';
      btn.textContent = 'Back to Hub';
      btn.onclick = () => { location.href = window.__hubUrl || 'index.html'; };
      wrap.appendChild(btn);
      document.body.appendChild(wrap);
    } else {
      wrap.style.display = 'block';
    }
  }
  function hideSelectionUI(){
    const ids = ['hexrun-select','hexSelectionScreen','selection-root','hexrun-selection','selector'];
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    document.body.classList.remove("has-hexrun-select");
  }

  window.__startHexRun = function(selectedType){
    // Ensure deps + DOM
    ensureBabylon().then(() => {
      ensureCanvas();
      
      
      hideSelectionUI();
      try {
        window.__hubUrl = window.__hubUrl || './index.html';
        window.game = new Game(selectedType || 'solar');
        console.log('[HexRun] Started:', selectedType);
      } catch(err){
        console.error('Failed to start HexRun:', err);
        alert('Failed to start HexRun: ' + err.message);
      }
    });
  };
})();
