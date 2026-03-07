/**
 * Sneakr.lab - DATASTALGO
 * Sneaker models, colors, and design options
 */

export const SNEAKER_MODELS = [
  {
    id: 'classic-1',
    name: 'Classic Low',
    description: 'Timeless low-top silhouette with clean lines and iconic heritage appeal.',
    category: 'Classic',
    icon: '👟',
    premiumOnly: false,
  },
  {
    id: 'runner-1',
    name: 'Runner Pro',
    description: 'Lightweight performance runner built for speed and all-day comfort.',
    category: 'Sport',
    icon: '🏃',
    premiumOnly: false,
  },
  {
    id: 'court-1',
    name: 'Court Classic',
    description: 'Court heritage design with a clean profile and premium materials.',
    category: 'Classic',
    icon: '🎾',
    premiumOnly: false,
  },
  {
    id: 'lifestyle-1',
    name: 'Lifestyle',
    description: 'Versatile everyday style that transitions from day to night effortlessly.',
    category: 'Lifestyle',
    icon: '✨',
    premiumOnly: false,
  },
  {
    id: 'high-top-1',
    name: 'High Top',
    description: 'Bold ankle-high silhouette with elevated street-ready style.',
    category: 'Street',
    icon: '🥾',
    premiumOnly: true,
  },
  {
    id: 'street-1',
    name: 'Street Edge',
    description: 'Urban-inspired silhouette built for bold street culture statements.',
    category: 'Street',
    icon: '🏙️',
    premiumOnly: true,
  },
  {
    id: 'retro-1',
    name: 'Retro Vintage',
    description: 'Classic retro aesthetics reimagined with a modern premium feel.',
    category: 'Retro',
    icon: '🕹️',
    premiumOnly: true,
  },
  {
    id: 'slip-on-1',
    name: 'Slip-On',
    description: 'Clean, effortless design with a laceless construction for modern living.',
    category: 'Lifestyle',
    icon: '🥿',
    premiumOnly: true,
  },
];

export const FREE_COLORS = ['#000000', '#FFFFFF', '#C41E3A', '#0066B3', '#228B22'];
export const PREMIUM_COLORS = [
  ...FREE_COLORS,
  '#FFD700', '#FF69B4', '#8B4513', '#4B0082', '#00CED1',
  '#FF6347', '#2F4F4F', '#DDA0DD', '#F0E68C', '#CD853F',
];

export const DESIGNS = [
  { id: 'plain', name: 'Plain', premiumOnly: false },
  { id: 'stripes', name: 'Stripes', premiumOnly: false },
  { id: 'camo', name: 'Camo', premiumOnly: true },
  { id: 'gradient', name: 'Gradient', premiumOnly: true },
  { id: 'vintage', name: 'Vintage', premiumOnly: true },
];
