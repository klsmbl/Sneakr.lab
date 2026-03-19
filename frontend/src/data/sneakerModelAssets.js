/**
 * Sneakr.lab - DATASTALGO
 * Maps each sneaker model to a 3D asset URL and display transform.
 */

const KHRONOS_BASE =
  'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0';
const UI_CODE_TV_BASE = 'https://raw.githubusercontent.com/ui-code-tv/3d-shoe-model-gltf/master';
const DEFAULT_FALLBACK_MODEL_URL =
  `${KHRONOS_BASE}/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb`;
const EXTERNAL_MODEL_BASE_URL = process.env.REACT_APP_MODEL_ASSET_BASE_URL
  ? process.env.REACT_APP_MODEL_ASSET_BASE_URL.trim().replace(/\/$/, '')
  : '';

function resolveModelUrl(url) {
  if (!url || /^https?:\/\//i.test(url)) return url;

  if (url.startsWith('/models/')) {
    // When configured, load local /models assets from external object storage/CDN.
    if (EXTERNAL_MODEL_BASE_URL) {
      return `${EXTERNAL_MODEL_BASE_URL}${encodeURI(url)}`;
    }

    // In production on Vercel, large local models may be excluded from deployment.
    // Use a hosted fallback model so the app remains usable instead of crashing.
    return DEFAULT_FALLBACK_MODEL_URL;
  }

  return url;
}

export const SNEAKER_MODEL_ASSETS = {
  'classic-1': {
    url: `${KHRONOS_BASE}/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb`,
    scale: 2.2,
    rotationY: Math.PI / 4,
  },
  'nike-alphafly': {
    url: '/models/Nike Air Zoom.glb',
    scale: 2.0,
    rotationY: Math.PI / 4,
    rotationX: 0,
  },
  'airforce': {
    url: '/models/airforccenew.glb?v=3',
    scale: 2.0,
    rotationY: Math.PI / 4,
    rotationX: 0,
  },
  'adidas-samba': {
    url: '/models/airforccenew.glb?v=11',
    scale: 2.0,
    rotationY: Math.PI / 4,
    rotationX: 0,
  },
  'airforce-new': {
    url: '/models/airforce-new.glb?v=12',
    scale: 2.0,
    rotationY: Math.PI / 4,
    rotationX: 0,
  },
  'jordan1': {
    url: '/models/jordans 1s.glb',
    scale: 2.0,
    rotationY: Math.PI / 4,
    rotationX: 0,
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
  'converse-chuck': {
    url: '/models/converse.glb',
    scale: 1.9,
    rotationY: Math.PI / 4,
    rotationX: 0,
  },
};

export function getSneakerAsset(modelId) {
  const asset = SNEAKER_MODEL_ASSETS[modelId] ?? SNEAKER_MODEL_ASSETS['airforce'];
  return {
    ...asset,
    url: resolveModelUrl(asset.url),
  };
}
