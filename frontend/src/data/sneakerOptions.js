/**
 * Sneakr.lab - DATASTALGO
 * Sneaker models, colors, and design options
 */

const STANDARD_COLOR_ZONES = [
  { id: 'upper', label: 'Main', description: 'Upper and quarter panels' },
  { id: 'midsole', label: 'Midsole', description: 'Middle sole cushioning' },
  { id: 'sole', label: 'Outsole', description: 'Bottom rubber sole' },
  { id: 'accent', label: 'Accent', description: 'Branding and detail accents' },
  { id: 'laces', label: 'Laces', description: 'Lace system' },
];

const PREMIUM_COLOR_ZONES = [
  ...STANDARD_COLOR_ZONES,
  { id: 'midsoleRim', label: 'Trim', description: 'Accent trim and foxing' },
  { id: 'stitching', label: 'Stitching', description: 'Decorative stitching' },
  { id: 'heel', label: 'Heel Tab', description: 'Heel counter' },
];

export const SNEAKER_MODELS = [
  {
    id: 'airforce',
    name: 'AirForce 1',
    description: 'Iconic streetwear silhouette with timeless style.',
    category: 'Classic',
    icon: '👟',
    premiumOnly: false,
    colorZones: STANDARD_COLOR_ZONES,
  },
  {
    id: 'airforce-new',
    name: 'AirForce 1 Premium',
    description: 'Enhanced AirForce build with richer detail zones for customization.',
    category: 'Classic',
    icon: '⭐',
    premiumOnly: true,
    colorZones: PREMIUM_COLOR_ZONES,
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
