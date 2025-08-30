
// Compatible DOM-based GameHUD (global). Provides methods used by Game.
// No Babylon.GUI dependency; safe stubs + lightweight notifications.

(function(){
  function ensureBaseCss(){
    if (document.getElementById('hexrun-base-style')) return;
    var st = document.createElement('style');
    st.id = 'hexrun-base-style';
    st.textContent = `
      html, body { margin:0; padding:0; overflow:hidden; width:100%; height:100%; }
      canvas { width:100%; height:100%; display:block; }
      #hud { position:absolute; top:10px; left:10px; z-index:10; color:#fff;
             font-family:'Orbitron', sans-serif; font-size:24px; text-shadow:0 0 5px #000; display:none; pointer-events:none; }
      #endScreen { position:absolute; inset:0; display:none; z-index:20; background:rgba(0,0,0,.9);
                   color:#fff; font-family:'Orbitron', sans-serif; align-items:center; justify-content:center; flex-direction:column; }
      #endScreen p { font-size:32px; margin-bottom:20px; text-shadow:0 0 10px #FF4500; }
      #endScreen button { padding:10px 20px; font-size:18px; }
      #runBackBtnContainer { position:absolute; top:12px; left:12px; z-index:15; }
      #hudStatus { position:absolute; top:60px; left:10px; z-index:12; font-family:'Orbitron', sans-serif; color:#E8F0FF; text-shadow:0 0 6px #000; }
      .hud-toast { margin-bottom:6px; background:rgba(0,0,0,.35); border:1px solid rgba(255,255,255,.15); border-radius:8px; padding:6px 10px; display:inline-block; }
    `;
    document.head.appendChild(st);
  }
  function ensureDom(){
    var hud = document.getElementById('hud');
    if (!hud){
      hud = document.createElement('div');
      hud.id = 'hud';
      hud.innerHTML = '<span id="timer">00:00</span>' +
                      '<span id="spawnedCount" style="margin-left:20px">Spawned: 0</span>' +
                      '<span id="hitCount" style="margin-left:20px">Hits: 0</span>' +
                      '<span id="dropCount" style="margin-left:20px">Drops: 0</span>' +
                      '<span id="modeStatus" style="margin-left:20px">Mode: -</span>';
      document.body.appendChild(hud);
    }
    var status = document.getElementById('hudStatus');
    if (!status){
      status = document.createElement('div');
      status.id = 'hudStatus';
      document.body.appendChild(status);
    }
    var end = document.getElementById('endScreen');
    if (!end){
      end = document.createElement('div');
      end.id = 'endScreen';
      end.innerHTML = '<p>Run Over!</p><button id="restartBtn" class="btn run sm">BACK TO HUB</button>';
      document.body.appendChild(end);
    }
    var rb = document.getElementById('restartBtn');
    if (rb) rb.onclick = function(){ location.href = (window.__hubUrl || 'index.html'); };

    var backWrap = document.getElementById('runBackBtnContainer');
    if (!backWrap){
      backWrap = document.createElement('div');
      backWrap.id = 'runBackBtnContainer';
      var btn = document.createElement('button');
      btn.id = 'runBackBtn';
      btn.className = 'btn run sm';
      btn.textContent = 'Back to Hub';
      btn.onclick = function(){ location.href = (window.__hubUrl || 'index.html'); };
      backWrap.appendChild(btn);
      document.body.appendChild(backWrap);
    }
    return { hud, status, end };
  }
  function toast(statusRoot, text, ttl=1500){
    var el = document.createElement('div');
    el.className = 'hud-toast';
    el.textContent = text;
    statusRoot.appendChild(el);
    setTimeout(function(){
      if (el.parentNode === statusRoot) statusRoot.removeChild(el);
    }, ttl);
  }
  function countdown(statusRoot, label, ms){
    var el = document.createElement('div');
    el.className = 'hud-toast';
    statusRoot.appendChild(el);
    var left = Math.ceil(ms/1000);
    function tick(){
      el.textContent = label + ': ' + left + 's';
      left -= 1;
      if (left < 0){
        if (el.parentNode === statusRoot) statusRoot.removeChild(el);
      } else {
        el.__timer = setTimeout(tick, 1000);
      }
    }
    tick();
    return { destroy: function(){ clearTimeout(el.__timer); if (el.parentNode===statusRoot) statusRoot.removeChild(el); } };
  }

  // Global class expected by Game()
  window.GameHUD = class GameHUD {
    constructor(game){
      ensureBaseCss();
      var dom = ensureDom();
      this.game = game;
      this.statusRoot = dom.status;
      // Show HUD when game starts
      document.getElementById('hud').style.display = 'block';
    }
    // --- API used by Game (stubs are safe) ---
    showModeSwitch(text){ document.getElementById('modeStatus').textContent = 'Mode: ' + (text||'-'); }
    showComboReady(){ toast(this.statusRoot, 'Combo Ready', 1200); }
    showWexShot(){ toast(this.statusRoot, 'WEX Shot', 1000); }
    showMexShot(){ toast(this.statusRoot, 'MEX Shot', 1000); }
    showEnergyGained(n){ toast(this.statusRoot, '+Energy ' + (n??''), 1000); }
    showEnergyDrained(n){ toast(this.statusRoot, '-Energy ' + (n??''), 1000); }
    showImmunityActive(){ toast(this.statusRoot, 'Immunity Active', 1200); }
    hideImmunity(){ /* no-op visual clear; toasts auto-remove */ }
    showSolarComboTimer(ms){ countdown(this.statusRoot, 'Solar Combo', ms||3000); }
    showWexComboTimer(ms){ countdown(this.statusRoot, 'WEX Combo', ms||3000); }
    showDarkPortalsTimer(ms){ countdown(this.statusRoot, 'Dark Portals', ms||3000); }
    showGravityStunTimer(ms){ countdown(this.statusRoot, 'Gravity Stun', ms||3000); }
    clearAll(){ this.statusRoot.innerHTML = ''; }
  };

  // Precreate DOM early so Game can query #timer etc.
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ ensureBaseCss(); ensureDom(); }, {once:true});
  } else {
    ensureBaseCss(); ensureDom();
  }
})();
