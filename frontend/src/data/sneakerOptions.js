/**
 * Sneakr.lab - DATASTALGO
 * Sneaker models, colors, and design options
 */

export const SNEAKER_MODELS = [
  { 
    id: 'airforce', 
    name: 'AirForce 1', 
    premiumOnly: false,
    colorZones: [
      { id: 'upper', label: 'Main', description: 'Leather panels & quarter' },
      { id: 'midsole', label: 'Midsole', description: 'Middle sole cushioning' },
      { id: 'sole', label: 'Outsole', description: 'Bottom rubber sole' },
      { id: 'accent', label: 'Swoosh', description: 'Nike branding' },
      { id: 'laces', label: 'Laces', description: 'Lace system' },
    ]
  },
  { 
    id: 'airforce-new', 
    name: 'AirForce 1 Premium', 
    premiumOnly: true,
    colorZones: [
      { id: 'upper', label: 'Main', description: 'Leather panels & quarter' },
      { id: 'midsole', label: 'Midsole', description: 'Middle sole cushioning' },
      { id: 'sole', label: 'Outsole', description: 'Bottom rubber sole' },
      { id: 'accent', label: 'Swoosh', description: 'Nike & Air branding' },
      { id: 'midsoleRim', label: 'Trim', description: 'Accent trim & foxing' },
      { id: 'stitching', label: 'Stitching', description: 'Decorative stitching' },
      { id: 'heel', label: 'Heel Tab', description: 'Heel counter' },
      { id: 'laces', label: 'Laces', description: 'Lace system' },
    ]
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
