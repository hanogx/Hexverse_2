// src/core/engine.js
export function createEngine(canvas){
  const engine = new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    alpha: false
  });
  window.addEventListener('resize', () => engine.resize());
  return engine;
}

// sceneOrGetter: ya direkt scene nesnesi, ya da scene döndüren bir fonksiyon
export function startLoop(engine, sceneOrGetter){
  engine.runRenderLoop(() => {
    const scene = (typeof sceneOrGetter === 'function') ? sceneOrGetter() : sceneOrGetter;
    // isDisposed bir boolean olabilir ya da hiç olmayabilir; o yüzden güvenli kontrol
    const disposed = (typeof scene?.isDisposed === 'boolean') ? scene.isDisposed : false;
    if (scene && scene.activeCamera && !disposed) {
      scene.render();
    }
  });
}

export function stopLoop(engine){
  engine.stopRenderLoop();
}
