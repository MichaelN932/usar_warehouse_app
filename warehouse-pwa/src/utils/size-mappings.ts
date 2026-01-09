// Size option mappings for PPE inventory
// Provides category and manufacturer-specific size dropdowns

export const SIZE_OPTIONS = {
  // Standard clothing sizes
  clothing: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],

  // Shoe sizes (numeric)
  footwear: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14', '15'],

  // Glove sizes
  gloves: ['S', 'M', 'L', 'XL', '2XL'],

  // One size for categories that don't have size variations
  oneSize: ['One Size'],

  // Tru-Spec sizing codes (Letter + Length code: S=Short, R=Regular, L=Long)
  truSpec: [
    'SS', 'SR', 'SL',    // Small: Short, Regular, Long
    'MS', 'MR', 'ML',    // Medium
    'LS', 'LR', 'LL',    // Large
    'XLS', 'XLR', 'XLL', // X-Large
    '2XLS', '2XLR', '2XLL', // 2X-Large
    '3XLS', '3XLR', '3XLL', // 3X-Large
    '4XLS', '4XLR', '4XLL', // 4X-Large
  ],

  // 5.11 Tactical pants sizing (WaistxInseam)
  fiveElevenPants: [
    '28X30', '28X32',
    '30X30', '30X32', '30X34',
    '32X30', '32X32', '32X34',
    '34X30', '34X32', '34X34',
    '36X30', '36X32', '36X34',
    '38X30', '38X32', '38X34',
    '40X30', '40X32', '40X34',
    '42X32', '44X32',
  ],

  // Rocky and other tactical boot sizes
  boots: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14', '15'],

  // Safety gear with adjustable fit
  adjustable: ['One Size Fits Most', 'Adjustable'],
};

// Categories that typically use "One Size"
export const ONE_SIZE_CATEGORIES = [
  'Head Protection',
  'Headwear',
  'Medical',
  'Patches',
  'Personal Care',
  'References',
  'Sleep System',
  'Tools & Lighting',
  'Packs & Bags',
  'Safety & Protection',
];

// Subcategories by category - for the subcategory dropdown
export const SUBCATEGORIES_BY_CATEGORY: Record<string, string[]> = {
  Clothing: [
    'BDUs',
    'Base Layers',
    'Outerwear',
    'Polos - CA-TF2',
    'Polos - USAID',
    'T-Shirts - CA-TF2',
    'T-Shirts - USAID',
  ],
  Footwear: [
    'Boots',
    'Socks',
  ],
  Gloves: [
    'Tactical',
    'Work',
    'Medical',
  ],
  'Head Protection': [
    'Hard Hats',
    'Bump Caps',
  ],
  Headwear: [
    'Caps',
    'Beanies',
    'Balaclavas',
  ],
  Medical: [
    'First Aid',
    'IFAK',
    'PPE',
  ],
  'Packs & Bags': [
    'Backpacks',
    'Duffel Bags',
    'Pouches',
  ],
  Patches: [
    'Identification',
    'Unit',
    'Flag',
  ],
  'Personal Care': [
    'Hygiene',
    'Sunscreen',
  ],
  References: [
    'Field Guides',
    'Manuals',
  ],
  'Safety & Protection': [
    'Eye Protection',
    'Hearing Protection',
    'Respirators',
    'Knee Pads',
  ],
  'Sleep System': [
    'Sleeping Bags',
    'Sleeping Pads',
    'Bivvy',
  ],
  'Tools & Lighting': [
    'Flashlights',
    'Headlamps',
    'Multi-tools',
  ],
};

// Get size options based on category and manufacturer
export function getSizeOptions(category: string, manufacturer?: string, subcategory?: string): string[] {
  const normalizedManufacturer = manufacturer?.toLowerCase() || '';
  const normalizedSubcategory = subcategory?.toLowerCase() || '';

  // Check manufacturer-specific sizing first
  if (normalizedManufacturer.includes('tru-spec') || normalizedManufacturer.includes('truspec')) {
    // Tru-Spec uses their unique sizing for clothing
    if (category === 'Clothing') {
      return SIZE_OPTIONS.truSpec;
    }
  }

  if (normalizedManufacturer.includes('5.11') || normalizedManufacturer.includes('five eleven')) {
    // 5.11 uses WaistxInseam for pants
    if (category === 'Clothing' && (normalizedSubcategory.includes('pant') || normalizedSubcategory.includes('bdu'))) {
      return SIZE_OPTIONS.fiveElevenPants;
    }
    // 5.11 uses standard sizing for tops
    if (category === 'Clothing') {
      return SIZE_OPTIONS.clothing;
    }
  }

  // Category-based sizing
  if (ONE_SIZE_CATEGORIES.includes(category)) {
    return SIZE_OPTIONS.oneSize;
  }

  switch (category) {
    case 'Footwear':
      return SIZE_OPTIONS.footwear;
    case 'Gloves':
      return SIZE_OPTIONS.gloves;
    case 'Clothing':
      return SIZE_OPTIONS.clothing;
    default:
      return SIZE_OPTIONS.oneSize;
  }
}

// Get subcategories for a given category
export function getSubcategoriesForCategory(category: string): string[] {
  return SUBCATEGORIES_BY_CATEGORY[category] || [];
}

// Check if a category uses one-size
export function isOneSizeCategory(category: string): boolean {
  return ONE_SIZE_CATEGORIES.includes(category);
}

// Get manufacturers commonly used for a category
export const MANUFACTURERS_BY_CATEGORY: Record<string, string[]> = {
  Clothing: ['Tru-Spec', '5.11', 'Hanes', 'CMC', 'Propper', 'Carhartt'],
  Footwear: ['Rocky', 'Globe', 'Danner', 'Bates', '5.11'],
  Gloves: ['Mechanix', 'HexArmor', 'PIP', 'Ringers'],
  'Head Protection': ['MSA', '3M', 'Bullard', 'Honeywell'],
  Headwear: ['Richardson', 'Flexfit', 'Yupoong'],
  Medical: ['North American Rescue', 'Dynarex', 'Adventure Medical'],
  'Packs & Bags': ['5.11', 'Mystery Ranch', 'Blackhawk', 'Condor'],
  'Safety & Protection': ['3M', 'Peltor', 'Uvex', 'Honeywell'],
  'Sleep System': ['Snugpak', 'Kelty', 'Therm-a-Rest'],
  'Tools & Lighting': ['Streamlight', 'Petzl', 'SureFire', 'Leatherman'],
};

// Get manufacturer options for a category
export function getManufacturersForCategory(category: string): string[] {
  return MANUFACTURERS_BY_CATEGORY[category] || [];
}
