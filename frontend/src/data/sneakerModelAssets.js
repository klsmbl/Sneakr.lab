/**
 * Sneakr.lab - DATASTALGO
 * Maps each sneaker model to a 3D asset URL and display transform.
 */

const KHRONOS_BASE =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0';
const UI_CODE_TV_BASE = 'https://raw.githubusercontent.com/ui-code-tv/3d-shoe-model-gltf/master';

export const SNEAKER_MODEL_ASSETS = {
  'classic-1': {
    url: `${KHRONOS_BASE}/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb`,
    scale: 2.2,
    rotationY: Math.PI / 4,
  },
  'runner-1': {
    url: `${UI_CODE_TV_BASE}/shoe.gltf`,
    scale: 1.8,
    rotationY: Math.PI / 4,
    rotationX: -0.1,
  },
  'new-balance-574': {
    url: '/models/new-balance-574.glb',
    scale: 1.8,
    rotationY: Math.PI / 4,
    rotationX: -0.05,
  },
  'sport-sneakers': {
    url: '/models/sport-sneakers.glb',
    scale: 2.0,
    rotationY: Math.PI / 3,
    rotationX: 0,
  },
  'high-top-1': {
    url: `${KHRONOS_BASE}/SheenHighHeel/glTF/SheenHighHeel.gltf`,
    scale: 2.0,
    rotationY: Math.PI / 4,
    rotationX: 0.05,
  },
  'slip-on-1': {
    url: '/models/slip_ons.gltf',
    scale: 2.0,
    rotationY: Math.PI / 4,
    rotationX: 0,
  },
  'court-1': {
    url: `${KHRONOS_BASE}/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb`,
    scale: 2.2,
    rotationY: Math.PI / 6,
    rotationX: -0.08,
  },
  'street-1': {
    url: `${UI_CODE_TV_BASE}/shoe.gltf`,
    scale: 1.8,
    rotationY: -Math.PI / 5,
    rotationX: 0.12,
  },
  'sport-1': {
    url: `${KHRONOS_BASE}/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb`,
    scale: 2.2,
    rotationY: Math.PI / 3,
    rotationX: 0,
  },
  'lifestyle-1': {
    url: `${UI_CODE_TV_BASE}/shoe.gltf`,
    scale: 1.8,
    rotationY: Math.PI / 2.2,
    rotationX: -0.05,
  },
  'retro-1': {
    url: `${KHRONOS_BASE}/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb`,
    scale: 2.0,
    rotationY: -Math.PI / 4,
    rotationX: 0.1,
  },
};

export function getSneakerAsset(modelId) {
  return (
    SNEAKER_MODEL_ASSETS[modelId] ??
    SNEAKER_MODEL_ASSETS['classic-1']
  );
}
