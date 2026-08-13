// Sand-DOS v3.1 Element Registry & Reaction Definitions

export const ELEMENT_IDS = {
  EMPTY: 0,
  SAND: 1,
  WATER: 2,
  OIL: 3,
  FIRE: 4,
  PLANT: 5,
  STONE: 6,
  ACID: 7,
  LAVA: 8,
  GUNPOWDER: 9,
  C4: 10,
  ICE: 11,
  STEAM: 12,
  SMOKE: 13,
  SPOUT_SAND: 14,
  SPOUT_WATER: 15,
  SPOUT_OIL: 16,
  SPOUT_LAVA: 17,
  CLONER: 18,
  VOID: 19,
  SPARK: 20,
};

export const ELEMENT_CATEGORIES = {
  POWDERS: 'Powders',
  LIQUIDS: 'Liquids',
  GASES: 'Gases',
  SOLIDS: 'Solids',
  EXPLOSIVES: 'Explosives',
  SPECIAL: 'Special & Tools',
};

// Colors stored as RGBA integer arrays [r, g, b, a] or primary palette arrays for noise variation
export const ELEMENTS = {
  [ELEMENT_IDS.EMPTY]: {
    id: ELEMENT_IDS.EMPTY,
    name: 'Air / Void',
    category: ELEMENT_CATEGORIES.SPECIAL,
    description: 'Empty space',
    color: [12, 16, 32, 255], // Dark DOS blue-black canvas background
    density: 0,
    type: 'empty',
    hotkey: '0',
  },

  [ELEMENT_IDS.SAND]: {
    id: ELEMENT_IDS.SAND,
    name: 'Sand',
    category: ELEMENT_CATEGORIES.POWDERS,
    description: 'Heavy granular powder. Flows down and forms pyramids.',
    color: [225, 185, 95, 255],
    colorVariants: [
      [235, 195, 105, 255],
      [220, 180, 85, 255],
      [205, 165, 75, 255],
      [245, 205, 115, 255],
    ],
    density: 10,
    type: 'powder',
    flammable: false,
    hotkey: '1',
  },

  [ELEMENT_IDS.WATER]: {
    id: ELEMENT_IDS.WATER,
    name: 'Water',
    category: ELEMENT_CATEGORIES.LIQUIDS,
    description: 'Fluid liquid. Spreads laterally, puts out fires, waters plants.',
    color: [40, 140, 240, 220],
    colorVariants: [
      [35, 130, 230, 220],
      [50, 150, 250, 220],
      [30, 120, 220, 220],
      [60, 160, 255, 220],
    ],
    density: 5,
    dispersion: 4,
    type: 'liquid',
    flammable: false,
    hotkey: '2',
  },

  [ELEMENT_IDS.OIL]: {
    id: ELEMENT_IDS.OIL,
    name: 'Oil',
    category: ELEMENT_CATEGORIES.LIQUIDS,
    description: 'Viscous petroleum. Floats on water, extremely flammable.',
    color: [140, 100, 30, 240],
    colorVariants: [
      [130, 90, 25, 240],
      [150, 110, 35, 240],
      [120, 80, 20, 240],
    ],
    density: 3,
    dispersion: 3,
    type: 'liquid',
    flammable: true,
    burnRate: 0.8,
    hotkey: '3',
  },

  [ELEMENT_IDS.FIRE]: {
    id: ELEMENT_IDS.FIRE,
    name: 'Fire',
    category: ELEMENT_CATEGORIES.GASES,
    description: 'Hot plasma. Consumes fuel, rises, flickers, produces smoke.',
    color: [255, 80, 20, 255],
    colorVariants: [
      [255, 120, 10, 255],
      [255, 60, 0, 255],
      [255, 200, 40, 255],
      [230, 40, 0, 255],
    ],
    density: -1,
    type: 'gas',
    lifeMin: 12,
    lifeMax: 28,
    hotkey: '4',
  },

  [ELEMENT_IDS.PLANT]: {
    id: ELEMENT_IDS.PLANT,
    name: 'Plant / Wood',
    category: ELEMENT_CATEGORIES.SOLIDS,
    description: 'Organic solid. Combustible. Grows vines when hydrated by Water.',
    color: [45, 170, 60, 255],
    colorVariants: [
      [40, 155, 55, 255],
      [55, 185, 70, 255],
      [35, 140, 45, 255],
      [75, 200, 85, 255], // Blossom / leaf accent
    ],
    density: 100,
    type: 'solid',
    flammable: true,
    burnRate: 0.3,
    hotkey: '5',
  },

  [ELEMENT_IDS.STONE]: {
    id: ELEMENT_IDS.STONE,
    name: 'Stone Wall',
    category: ELEMENT_CATEGORIES.SOLIDS,
    description: 'Indestructible barrier. Blockade against liquids and fire.',
    color: [140, 145, 155, 255],
    colorVariants: [
      [130, 135, 145, 255],
      [150, 155, 165, 255],
      [115, 120, 130, 255],
    ],
    density: 1000,
    type: 'solid',
    flammable: false,
    hotkey: '6',
  },

  [ELEMENT_IDS.ACID]: {
    id: ELEMENT_IDS.ACID,
    name: 'Acid',
    category: ELEMENT_CATEGORIES.LIQUIDS,
    description: 'Corrosive chemical liquid. Melts solids & liquids into acid vapor.',
    color: [120, 255, 30, 240],
    colorVariants: [
      [110, 240, 20, 240],
      [135, 255, 50, 240],
      [100, 225, 10, 240],
    ],
    density: 6,
    dispersion: 3,
    type: 'liquid',
    flammable: false,
    hotkey: '7',
  },

  [ELEMENT_IDS.LAVA]: {
    id: ELEMENT_IDS.LAVA,
    name: 'Lava',
    category: ELEMENT_CATEGORIES.LIQUIDS,
    description: 'Heavy molten rock. Ignites surroundings, creates steam with water.',
    color: [255, 60, 10, 255],
    colorVariants: [
      [240, 40, 0, 255],
      [255, 110, 20, 255],
      [220, 30, 0, 255],
      [255, 160, 40, 255],
    ],
    density: 8,
    dispersion: 2,
    type: 'liquid',
    flammable: false,
    hotkey: '8',
  },

  [ELEMENT_IDS.GUNPOWDER]: {
    id: ELEMENT_IDS.GUNPOWDER,
    name: 'Gunpowder',
    category: ELEMENT_CATEGORIES.EXPLOSIVES,
    description: 'Volatile explosive powder. Explodes rapidly when sparked.',
    color: [75, 80, 85, 255],
    colorVariants: [
      [65, 70, 75, 255],
      [85, 90, 95, 255],
      [55, 60, 65, 255],
    ],
    density: 9,
    type: 'powder',
    flammable: true,
    explosive: true,
    hotkey: '9',
  },

  [ELEMENT_IDS.C4]: {
    id: ELEMENT_IDS.C4,
    name: 'C4 Explosive',
    category: ELEMENT_CATEGORIES.EXPLOSIVES,
    description: 'High-stability explosive block. Creates massive blast shockwave.',
    color: [210, 195, 150, 255],
    colorVariants: [
      [200, 185, 140, 255],
      [220, 205, 160, 255],
    ],
    density: 500,
    type: 'solid',
    flammable: true,
    explosive: true,
    hotkey: 'C',
  },

  [ELEMENT_IDS.ICE]: {
    id: ELEMENT_IDS.ICE,
    name: 'Ice',
    category: ELEMENT_CATEGORIES.SOLIDS,
    description: 'Cold solid. Freezes adjacent water, melts into water near heat.',
    color: [175, 225, 255, 220],
    colorVariants: [
      [160, 215, 250, 220],
      [190, 235, 255, 220],
      [150, 205, 245, 220],
    ],
    density: 950,
    type: 'solid',
    flammable: false,
    hotkey: 'I',
  },

  [ELEMENT_IDS.STEAM]: {
    id: ELEMENT_IDS.STEAM,
    name: 'Steam',
    category: ELEMENT_CATEGORIES.GASES,
    description: 'Hot moisture vapor. Rises quickly, condenses back into Water.',
    color: [210, 230, 245, 160],
    colorVariants: [
      [200, 220, 240, 150],
      [225, 240, 255, 170],
    ],
    density: -2,
    type: 'gas',
    lifeMin: 40,
    lifeMax: 90,
    hotkey: 'V',
  },

  [ELEMENT_IDS.SMOKE]: {
    id: ELEMENT_IDS.SMOKE,
    name: 'Smoke',
    category: ELEMENT_CATEGORIES.GASES,
    description: 'Combustion byproduct gas. Rises slowly and dissipates.',
    color: [90, 95, 105, 180],
    colorVariants: [
      [75, 80, 90, 170],
      [105, 110, 120, 190],
      [60, 65, 75, 160],
    ],
    density: -1,
    type: 'gas',
    lifeMin: 30,
    lifeMax: 70,
    hotkey: 'M',
  },

  [ELEMENT_IDS.SPOUT_SAND]: {
    id: ELEMENT_IDS.SPOUT_SAND,
    name: 'Sand Spout',
    category: ELEMENT_CATEGORIES.SPECIAL,
    description: 'Infinite sand generator spout block.',
    color: [225, 160, 40, 255],
    colorVariants: [[210, 150, 30, 255]],
    density: 1000,
    type: 'solid',
    spawns: ELEMENT_IDS.SAND,
    hotkey: 'S',
  },

  [ELEMENT_IDS.SPOUT_WATER]: {
    id: ELEMENT_IDS.SPOUT_WATER,
    name: 'Water Spout',
    category: ELEMENT_CATEGORIES.SPECIAL,
    description: 'Infinite water fountain spout block.',
    color: [0, 180, 255, 255],
    colorVariants: [[0, 165, 240, 255]],
    density: 1000,
    type: 'solid',
    spawns: ELEMENT_IDS.WATER,
    hotkey: 'W',
  },

  [ELEMENT_IDS.SPOUT_OIL]: {
    id: ELEMENT_IDS.SPOUT_OIL,
    name: 'Oil Spout',
    category: ELEMENT_CATEGORIES.SPECIAL,
    description: 'Infinite petroleum spout block.',
    color: [180, 130, 20, 255],
    colorVariants: [[165, 115, 15, 255]],
    density: 1000,
    type: 'solid',
    spawns: ELEMENT_IDS.OIL,
    hotkey: 'O',
  },

  [ELEMENT_IDS.SPOUT_LAVA]: {
    id: ELEMENT_IDS.SPOUT_LAVA,
    name: 'Lava Spout',
    category: ELEMENT_CATEGORIES.SPECIAL,
    description: 'Magma volcano spout block.',
    color: [255, 40, 0, 255],
    colorVariants: [[235, 30, 0, 255]],
    density: 1000,
    type: 'solid',
    spawns: ELEMENT_IDS.LAVA,
    hotkey: 'L',
  },

  [ELEMENT_IDS.CLONER]: {
    id: ELEMENT_IDS.CLONER,
    name: 'Cloner',
    category: ELEMENT_CATEGORIES.SPECIAL,
    description: 'Duplicates any element that falls on top of it!',
    color: [210, 40, 220, 255],
    colorVariants: [
      [230, 60, 240, 255],
      [190, 20, 200, 255],
    ],
    density: 1000,
    type: 'solid',
    hotkey: 'K',
  },

  [ELEMENT_IDS.VOID]: {
    id: ELEMENT_IDS.VOID,
    name: 'Black Hole (Void)',
    category: ELEMENT_CATEGORIES.SPECIAL,
    description: 'Consumes any element that touches its singularity.',
    color: [40, 10, 60, 255],
    colorVariants: [
      [60, 15, 90, 255],
      [25, 5, 40, 255],
    ],
    density: 1000,
    type: 'solid',
    hotkey: 'X',
  },

  [ELEMENT_IDS.SPARK]: {
    id: ELEMENT_IDS.SPARK,
    name: 'Spark',
    category: ELEMENT_CATEGORIES.SPECIAL,
    description: 'Transient high-heat ember spark particle.',
    color: [255, 255, 180, 255],
    colorVariants: [[255, 240, 120, 255]],
    density: -1,
    type: 'gas',
    lifeMin: 3,
    lifeMax: 10,
    hotkey: '*',
  },
};

// Helper function to pick color variant or base color
export function getElementColor(id, variantSeed = 0) {
  const elem = ELEMENTS[id] || ELEMENTS[ELEMENT_IDS.EMPTY];
  if (elem.colorVariants && elem.colorVariants.length > 0) {
    const idx = Math.abs(variantSeed) % elem.colorVariants.length;
    return elem.colorVariants[idx];
  }
  return elem.color;
}
