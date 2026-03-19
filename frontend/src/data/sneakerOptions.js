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

const AIRFORCE_COLOR_ZONES = [
  { id: 'upper', label: 'Main', description: 'Upper and quarter panels' },
  { id: 'midsole', label: 'Midsole', description: 'Middle sole cushioning' },
  { id: 'sole', label: 'Outsole', description: 'Bottom rubber sole' },
  { id: 'accent', label: 'Accent', description: 'Branding and detail accents' },
  { id: 'laces', label: 'Laces', description: 'Lace system' },
  { id: 'midsoleRim', label: 'Trim', description: 'Accent trim and foxing' },
  { id: 'stitching', label: 'Stitching', description: 'Decorative stitching' },
  { id: 'heel', label: 'Heel Tab', description: 'Heel counter' },
];

const JORDAN1_COLOR_ZONES = [
  { id: 'upper', label: 'Main', description: 'Upper and quarter panels' },
  { id: 'midsole', label: 'Midsole', description: 'Middle sole cushioning' },
  { id: 'sole', label: 'Outsole', description: 'Bottom rubber sole' },
  { id: 'accent', label: 'Accent', description: 'Branding and detail accents' },
  { id: 'laces', label: 'Laces', description: 'Lace system' },
  { id: 'midsoleRim', label: 'Trim', description: 'Accent trim and foxing' },
  { id: 'stitching', label: 'Stitching', description: 'Decorative stitching' },
  { id: 'logo', label: 'Logo', description: 'Logo and branding elements' },
];

const NIKE_AIR_ZOOM_COLOR_ZONES = [
  { id: 'upper', label: 'Main', description: 'Main upper panels' },
  { id: 'sole', label: 'Sole', description: 'Sole and outsole' },
  { id: 'stitching', label: 'Tongue', description: 'Tongue cushioning' },
  { id: 'accent', label: 'Logo', description: 'Logo and branding' },
  { id: 'laces', label: 'Laces', description: 'Lace system' },
  { id: 'midsoleRim', label: 'Accent', description: 'Accent stripes and details' },
];

const CONVERSE_COLOR_ZONES = [
  { id: 'LEATHER_MAIN', label: 'Leather Main', description: 'Main leather upper panels' },
  { id: 'EYELETS', label: 'Eyelets', description: 'Lace eyelets' },
  { id: 'HEELCAP', label: 'Heel Cap', description: 'Heel cap and counter' },
  { id: 'INSOLE', label: 'Insole', description: 'Inner sole lining' },
  { id: 'LACES', label: 'Laces', description: 'Lace system' },
  { id: 'MIDSOLE.001', label: 'Midsole', description: 'Midsole cushioning' },
  { id: 'OUTERSOLE', label: 'Outersole', description: 'Bottom rubber sole' },
  { id: 'STITCHES', label: 'Stitches', description: 'Decorative stitching' },
  { id: 'TAGS', label: 'Tags', description: 'Branding tags and logos' },
  { id: 'TOETIP', label: 'Toe Tip', description: 'Toe cap area' },
  { id: 'TONGUE', label: 'Tongue', description: 'Tongue padding' },
];

export const SNEAKER_MODELS = [
  {
    id: 'nike-alphafly',
    name: 'Nike Air Zoom Alphafly',
    description: 'A performance-focused line built around Nike\'s Zoom Air cushioning technology. Designed primarily for running and athletic use, the Zoom unit provides responsive, low-profile energy return. Popular models include the Pegasus and Tempo NEXT%.',
    category: 'Performance',
    icon: '⚡',
    premiumOnly: false,
    colorZones: NIKE_AIR_ZOOM_COLOR_ZONES,
  },
  {
    id: 'adidas-samba',
    name: 'Air Force 1',
    description: 'Introduced in 1982 as the first basketball shoe to use Nike Air cushioning, it\'s since become one of the most iconic lifestyle sneakers of all time. The all-white low-top is a streetwear staple and one of the best-selling shoes in history.',
    category: 'Classic',
    icon: '👟',
    premiumOnly: false,
    colorZones: PREMIUM_COLOR_ZONES,
  },
  {
    id: 'jordan1',
    name: 'Air Jordan 1 Retro High OG',
    description: 'Originally released in 1985 as Michael Jordan\'s first signature shoe, the AJ1 High OG is a cultural landmark. The "OG" designation means it closely follows the original colorways and construction. Highly sought-after on the resale market, especially in classic colorways like Chicago and Bred.',
    category: 'Basketball',
    icon: '🏀',
    premiumOnly: false,
    colorZones: JORDAN1_COLOR_ZONES,
  },
  {
    id: 'converse-chuck',
    name: 'Converse Chuck Taylor All Star',
    description: 'A true vintage classic dating back to 1917, making it one of the oldest sneaker designs still in production. The canvas upper, rubber toe cap, and ankle patch are instantly recognizable. Beloved for its simplicity, versatility, and counter-culture roots.',
    category: 'Streetwear',
    icon: '🛹',
    premiumOnly: false,
    colorZones: CONVERSE_COLOR_ZONES,
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
