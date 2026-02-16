/**
 * Sneakr.lab - DATASTALGO
 * Generates canvas-based textures and material overrides for each design option
 */

import * as THREE from 'three';

const TEX_SIZE = 256;

function makeCanvasTexture(draw) {
  const canvas = document.createElement('canvas');
  canvas.width = TEX_SIZE;
  canvas.height = TEX_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2d context not available');
  draw(ctx, TEX_SIZE, TEX_SIZE);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Returns a grayscale texture for the given design (multiplies with accent color).
 * null for plain or vintage (vintage uses overrides only).
 */
export function getDesignTexture(designId, _accentColor) {
  switch (designId) {
    case 'plain':
    case 'vintage':
      return null;

    case 'stripes': {
      return makeCanvasTexture((ctx, w, h) => {
        const stripeH = 20;
        for (let y = 0; y < h; y += stripeH) {
          ctx.fillStyle = (y / stripeH) % 2 === 0 ? '#ffffff' : '#666666';
          ctx.fillRect(0, y, w, stripeH);
        }
      });
    }

    case 'camo': {
      return makeCanvasTexture((ctx, w, h) => {
        ctx.fillStyle = '#888888';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#555555';
        const blobs = [
          [0.2, 0.2, 0.25], [0.6, 0.1, 0.2], [0.1, 0.6, 0.2], [0.7, 0.6, 0.15],
          [0.4, 0.5, 0.2], [0.8, 0.3, 0.18], [0.3, 0.8, 0.18],
        ];
        blobs.forEach(([x, y, radius]) => {
          ctx.beginPath();
          ctx.arc(x * w, y * h, radius * w, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.fillStyle = '#bbbbbb';
        blobs.forEach(([x, y, radius]) => {
          ctx.beginPath();
          ctx.arc((x + 0.05) * w, (y + 0.05) * h, radius * w * 0.5, 0, Math.PI * 2);
          ctx.fill();
        });
      });
    }

    case 'gradient': {
      return makeCanvasTexture((ctx, w, h) => {
        const grd = ctx.createLinearGradient(0, 0, 0, h);
        grd.addColorStop(0, '#dddddd');
        grd.addColorStop(0.5, '#ffffff');
        grd.addColorStop(1, '#666666');
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);
      });
    }

    default:
      return null;
  }
}

/**
 * Optional material tweaks per design (e.g. vintage = higher roughness).
 */
export function getDesignOverrides(designId, accentColor) {
  if (designId === 'vintage') {
    const c = new THREE.Color(accentColor);
    const tint = new THREE.Color(0.85, 0.75, 0.65);
    c.lerp(tint, 0.2);
    return { roughness: 0.88, color: c };
  }
  return {};
}
