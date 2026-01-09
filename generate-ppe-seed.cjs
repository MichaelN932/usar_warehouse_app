const XLSX = require('./warehouse-pwa/node_modules/xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('ppe_inventory_USAR_OPTIMIZED.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

// Helper to create slug IDs
const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Build categories from CATEGORY column
const categoryNames = [...new Set(data.map(r => r.CATEGORY))].filter(Boolean).sort();
const categories = categoryNames.map((name, i) => ({
  id: `cat-${slugify(name)}`,
  name,
  sortOrder: (i + 1) * 10,
}));

// Build item types from PRODUCT_NAME + SUBCATEGORY (grouped)
const itemTypeMap = new Map();
data.forEach(row => {
  const key = `${row.PRODUCT_NAME}|${row.CATEGORY}|${row.SUBCATEGORY}|${row.TYPE}`;
  if (!itemTypeMap.has(key)) {
    itemTypeMap.set(key, {
      productName: row.PRODUCT_NAME,
      category: row.CATEGORY,
      subcategory: row.SUBCATEGORY,
      type: row.TYPE,
      femaCode: row.FEMA_REF || row.ITEM_ID,
      manufacturer: row.MANUFACTURER,
    });
  }
});

const itemTypes = Array.from(itemTypeMap.values()).map((item, i) => ({
  id: `it-${i + 1}`,
  categoryId: `cat-${slugify(item.category)}`,
  categoryName: item.category,
  name: item.productName,
  subcategory: item.subcategory,
  type: item.type,
  femaCode: item.femaCode,
  manufacturer: item.manufacturer,
}));

// Build variants (using manufacturer as variant differentiator)
const variantMap = new Map();
itemTypes.forEach(itemType => {
  const key = `${itemType.name}|${itemType.manufacturer}`;
  if (!variantMap.has(key)) {
    variantMap.set(key, {
      itemTypeId: itemType.id,
      name: itemType.name,
      manufacturer: itemType.manufacturer || 'Generic',
    });
  }
});

const variants = Array.from(variantMap.values()).map((v, i) => ({
  id: `var-${i + 1}`,
  itemTypeId: v.itemTypeId,
  name: v.name,
  manufacturer: v.manufacturer,
}));

// Build a lookup for variants by item type id
const variantByItemType = new Map();
variants.forEach(v => {
  variantByItemType.set(v.itemTypeId, v.id);
});

// Build sizes from each row
const sizes = [];
const inventory = [];
let sizeId = 1;

data.forEach(row => {
  // Find the matching item type
  const itemType = itemTypes.find(it =>
    it.name === row.PRODUCT_NAME &&
    it.categoryName === row.CATEGORY &&
    it.subcategory === row.SUBCATEGORY &&
    it.type === row.TYPE
  );
  if (!itemType) {
    // Try with less strict matching
    const fallbackItemType = itemTypes.find(it =>
      it.name === row.PRODUCT_NAME &&
      it.categoryName === row.CATEGORY
    );
    if (!fallbackItemType) return;
  }

  const matchedItemType = itemType || itemTypes.find(it =>
    it.name === row.PRODUCT_NAME &&
    it.categoryName === row.CATEGORY
  );
  if (!matchedItemType) return;

  const variantId = variantByItemType.get(matchedItemType.id);
  if (!variantId) return;

  const sizeName = row.SIZE || 'One Size';
  const sizeDetail = [row.SIZE_DETAIL_1, row.SIZE_DETAIL_2].filter(Boolean).join(' / ');

  const sId = `sz-${sizeId++}`;
  sizes.push({
    id: sId,
    variantId,
    name: sizeName,
    sizeDetail: sizeDetail || undefined,
    sortOrder: row.SIZE_SORT || sizeName,
  });

  inventory.push({
    sizeId: sId,
    categoryName: row.CATEGORY,
    subcategory: row.SUBCATEGORY,
    type: row.TYPE,
    itemTypeName: row.PRODUCT_NAME,
    variantId,
    variantName: row.MANUFACTURER || 'Standard',
    manufacturer: row.MANUFACTURER || 'Generic',
    sizeName,
    sizeDetail: sizeDetail || undefined,
    femaCode: row.FEMA_REF || row.ITEM_ID || '',
    legacyId: row.ITEM_ID || `INV-${sizeId}`,
    displayName: row.DISPLAY_NAME,
    quantityOnHand: row.QTY_AVAILABLE || 0,
    quantityOut: row.QTY_OUT || 0,
    quantityTotal: row.QTY_TOTAL || 0,
    deployment: row.DEPLOYMENT,
    stockStatus: row.STOCK_STATUS,
    status: row.QTY_AVAILABLE > 0 ? 'IN' : (row.QTY_OUT > 0 ? 'OUT' : 'N/A'),
  });
});

// Generate TypeScript file
const output = `// Auto-generated from ppe_inventory_USAR_OPTIMIZED.xlsx
// Generated: ${new Date().toISOString()}
// Total items: ${inventory.length}

export interface PPECategory {
  id: string;
  name: string;
  sortOrder: number;
}

export interface PPEItemType {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  subcategory?: string;
  type?: string;
  femaCode?: string;
  manufacturer?: string;
}

export interface PPEVariant {
  id: string;
  itemTypeId: string;
  name: string;
  manufacturer: string;
}

export interface PPESize {
  id: string;
  variantId: string;
  name: string;
  sizeDetail?: string;
  sortOrder: string;
}

export interface PPEInventoryItem {
  sizeId: string;
  categoryName: string;
  subcategory?: string;
  type?: string;
  itemTypeName: string;
  variantId: string;
  variantName: string;
  manufacturer: string;
  sizeName: string;
  sizeDetail?: string;
  femaCode: string;
  legacyId: string;
  displayName?: string;
  description?: string;
  quantityOnHand: number;
  quantityOut: number;
  quantityTotal: number;
  deployment?: string;
  stockStatus?: string;
  status: 'IN' | 'OUT' | 'N/A';
  serialNumber?: string;
  barcode?: string;
}

export const ppeCategories: PPECategory[] = ${JSON.stringify(categories, null, 2)};

export const ppeItemTypes: PPEItemType[] = ${JSON.stringify(itemTypes, null, 2)};

export const ppeVariants: PPEVariant[] = ${JSON.stringify(variants, null, 2)};

export const ppeSizes: PPESize[] = ${JSON.stringify(sizes, null, 2)};

export const ppeInventory: PPEInventoryItem[] = ${JSON.stringify(inventory, null, 2)};

// Summary stats
export const ppeSummary = {
  totalItems: ${inventory.length},
  totalCategories: ${categories.length},
  totalItemTypes: ${itemTypes.length},
  totalVariants: ${variants.length},
  totalQuantityOnHand: ${inventory.reduce((sum, i) => sum + i.quantityOnHand, 0)},
  totalQuantityOut: ${inventory.reduce((sum, i) => sum + i.quantityOut, 0)},
  deployments: ${JSON.stringify([...new Set(inventory.map(i => i.deployment).filter(Boolean))])},
};
`;

fs.writeFileSync('warehouse-pwa/src/data/ppe-seed-data.ts', output);
console.log('Generated ppe-seed-data.ts with:');
console.log('- Categories:', categories.length);
console.log('- Item Types:', itemTypes.length);
console.log('- Variants:', variants.length);
console.log('- Sizes:', sizes.length);
console.log('- Inventory items:', inventory.length);
