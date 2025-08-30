// src/core/gameUtils.js
// Shared utilities for all game modes

export function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    stage: parseInt(params.get('stage')) || null,
    mode: params.get('mode') || null,
    debug: params.get('debug') === 'true'
  };
}

export function navigateToHub() {
  location.href = "./index.html";
}

export function navigateToMode(mode, params = {}) {
  const paramString = Object.keys(params).length > 0 
    ? '?' + new URLSearchParams(params).toString() 
    : '';
  location.href = `./${mode}.html${paramString}`;
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatScore(score) {
  return score.toLocaleString();
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Color utilities
export function hexToColor3(hex) {
  const h = hex.replace("#", "");
  const n = parseInt(h, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return new BABYLON.Color3(r / 255, g / 255, b / 255);
}

// Safe disposal utility
export function safeDispose(object) {
  try {
    if (object && typeof object.dispose === 'function') {
      object.dispose();
    }
  } catch (error) {
    console.warn('Error disposing object:', error);
  }
}

// Performance monitoring
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      frameTime: 0,
      fps: 0,
      memoryUsage: 0
    };
    this.lastTime = performance.now();
  }

  update() {
    const currentTime = performance.now();
    this.metrics.frameTime = currentTime - this.lastTime;
    this.metrics.fps = Math.round(1000 / this.metrics.frameTime);
    
    if (performance.memory) {
      this.metrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
    }
    
    this.lastTime = currentTime;
  }

  getMetrics() {
    return { ...this.metrics };
  }
}