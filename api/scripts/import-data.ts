import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Paths to Excel files
const PPE_INVENTORY_PATH = path.join(__dirname, '../../ppe_inventory.xlsx');
const FEMA_CACHE_PATH = path.join(__dirname, '../../17-001 - 2025 FEMA Approved Equipment Cache List.xlsx');

interface Category {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
}

interface ItemType {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  femaCode: string;
  femaRequiredQty: number;
  parLevel: number;
  isConsumable: boolean;
}

interface Variant {
  id: string;
  itemTypeId: string;
  name: string;
  manufacturer: string;
  sku?: string;
  barcode?: string;
  unitCost?: number;
}

interface Size {
  id: string;
  variantId: string;
  name: string;
  sortOrder: number;
}

interface InventoryItem {
  sizeId: string;
  quantityOnHand: number;
  quantityReserved: number;
}

// Data stores
const categories: Map<string, Category> = new Map();
const itemTypes: Map<string, ItemType> = new Map();
const variants: Map<string, Variant> = new Map();
const sizes: Map<string, Size> = new Map();
const inventory: InventoryItem[] = [];

// Helper to generate consistent IDs
function generateId(prefix: string, name: string): string {
  return `${prefix}-${name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30)}-${uuidv4().substring(0, 8)}`;
}

// Category mapping from FEMA sections
const categoryMapping: Record<string, { name: string; description: string; sortOrder: number }> = {
  'SANITATION': { name: 'Sanitation', description: 'Sanitation and hygiene supplies', sortOrder: 1 },
  'SAFETY': { name: 'Safety', description: 'Safety equipment and protective gear', sortOrder: 2 },
  'PERSONAL GEAR': { name: 'Personal Gear', description: 'Personal clothing and equipment', sortOrder: 3 },
  'HAZMAT PPE': { name: 'HazMat PPE', description: 'Hazardous materials personal protective equipment', sortOrder: 4 },
  'WATER RESCUE': { name: 'Water Rescue', description: 'Water rescue equipment', sortOrder: 5 },
  'MEDICAL': { name: 'Medical', description: 'Medical supplies and equipment', sortOrder: 6 },
  'PUBLICATIONS': { name: 'Publications', description: 'Reference materials and publications', sortOrder: 7 },
  'COMMUNICATIONS': { name: 'Communications', description: 'Communication equipment and radios', sortOrder: 8 },
  'LOGISTICS': { name: 'Logistics', description: 'Logistics and support equipment', sortOrder: 9 },
  'TECHNICAL': { name: 'Technical', description: 'Technical search and rescue equipment', sortOrder: 10 },
};

function importFEMACache() {
  console.log('Reading FEMA Cache List...');

  if (!fs.existsSync(FEMA_CACHE_PATH)) {
    console.log('FEMA Cache file not found at:', FEMA_CACHE_PATH);
    return;
  }

  const workbook = XLSX.readFile(FEMA_CACHE_PATH);

  // Type I Cache is usually the second sheet
  const sheetName = workbook.SheetNames.find(name => name.includes('Type I') || name.includes('Cache')) || workbook.SheetNames[1];
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    console.log('Could not find Type I Cache sheet');
    return;
  }

  const data = XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[];
  console.log(`Found ${data.length} rows in FEMA Cache`);

  for (const row of data) {
    const section = String(row['SECTION'] || row['Section'] || '').toUpperCase().trim();
    const description = String(row['Description'] || row['description'] || '');
    const femaCode = String(row['FEMA Cache Item Number'] || row['Item Number'] || '');
    const qty = Number(row['Type I Qty'] || row['Qty'] || 0);
    const manufacturer = String(row['Manufacturer/Vendor'] || row['Manufacturer'] || 'Generic');

    if (!section || !description) continue;

    // Get or create category
    let category = Array.from(categories.values()).find(c =>
      c.name.toUpperCase() === section ||
      categoryMapping[section]?.name === c.name
    );

    if (!category) {
      const mapping = categoryMapping[section] || {
        name: section.charAt(0) + section.slice(1).toLowerCase(),
        description: `${section} items`,
        sortOrder: categories.size + 1
      };
      category = {
        id: generateId('cat', mapping.name),
        name: mapping.name,
        description: mapping.description,
        sortOrder: mapping.sortOrder
      };
      categories.set(category.id, category);
    }

    // Create item type
    const itemTypeKey = `${category.id}-${description}`;
    if (!itemTypes.has(itemTypeKey)) {
      const itemType: ItemType = {
        id: generateId('it', description),
        categoryId: category.id,
        name: description,
        description: description,
        femaCode: femaCode,
        femaRequiredQty: qty,
        parLevel: Math.ceil(qty * 0.5), // Default par level to 50% of FEMA required
        isConsumable: description.toLowerCase().includes('consumable') ||
                      description.toLowerCase().includes('battery') ||
                      description.toLowerCase().includes('kit')
      };
      itemTypes.set(itemTypeKey, itemType);

      // Create a default variant
      const variant: Variant = {
        id: generateId('var', `${description}-${manufacturer}`),
        itemTypeId: itemType.id,
        name: manufacturer !== 'Generic' ? manufacturer : description,
        manufacturer: manufacturer
      };
      variants.set(variant.id, variant);

      // Create a default size
      const size: Size = {
        id: generateId('sz', `${description}-default`),
        variantId: variant.id,
        name: 'Standard',
        sortOrder: 0
      };
      sizes.set(size.id, size);

      // Initialize inventory at FEMA required qty
      inventory.push({
        sizeId: size.id,
        quantityOnHand: qty,
        quantityReserved: 0
      });
    }
  }

  console.log(`Imported ${categories.size} categories, ${itemTypes.size} item types from FEMA Cache`);
}

function importPPEInventory() {
  console.log('Reading PPE Inventory...');

  if (!fs.existsSync(PPE_INVENTORY_PATH)) {
    console.log('PPE Inventory file not found at:', PPE_INVENTORY_PATH);
    return;
  }

  const workbook = XLSX.readFile(PPE_INVENTORY_PATH);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(sheet) as Record<string, unknown>[];
  console.log(`Found ${data.length} rows in PPE Inventory`);

  // Find or create Personal Gear category for PPE items
  let ppeCategory = Array.from(categories.values()).find(c => c.name === 'Personal Gear');
  if (!ppeCategory) {
    ppeCategory = {
      id: generateId('cat', 'Personal Gear'),
      name: 'Personal Gear',
      description: 'Personal clothing and equipment',
      sortOrder: 3
    };
    categories.set(ppeCategory.id, ppeCategory);
  }

  for (const row of data) {
    const description = String(row['description'] || row['Description'] || '');
    const femaCode = String(row['idCacheFEMA'] || '');
    const manufacturer = String(row['manufacturer'] || 'Unknown');
    const barcode = String(row['barcode'] || '');
    const qtyAvailable = Number(row['quantityAvailable'] || 0);
    const qtyOut = Number(row['quantityOut'] || 0);
    const qtyTotal = Number(row['quantityTotal'] || qtyAvailable + qtyOut);

    if (!description) continue;

    // Try to match to existing item type by FEMA code or create new
    let itemType = Array.from(itemTypes.values()).find(it =>
      it.femaCode === femaCode && femaCode !== ''
    );

    if (!itemType) {
      // Create new item type
      const itemTypeKey = `${ppeCategory.id}-${description}`;
      if (!itemTypes.has(itemTypeKey)) {
        itemType = {
          id: generateId('it', description),
          categoryId: ppeCategory.id,
          name: description,
          description: description,
          femaCode: femaCode,
          femaRequiredQty: qtyTotal,
          parLevel: Math.ceil(qtyTotal * 0.3),
          isConsumable: false
        };
        itemTypes.set(itemTypeKey, itemType);
      } else {
        itemType = itemTypes.get(itemTypeKey)!;
      }
    }

    // Create variant for this specific manufacturer
    const variantKey = `${itemType.id}-${manufacturer}`;
    let variant = Array.from(variants.values()).find(v =>
      v.itemTypeId === itemType!.id && v.manufacturer === manufacturer
    );

    if (!variant) {
      variant = {
        id: generateId('var', `${description}-${manufacturer}`),
        itemTypeId: itemType.id,
        name: manufacturer !== 'Unknown' ? `${manufacturer} ${description}` : description,
        manufacturer: manufacturer,
        barcode: barcode || undefined
      };
      variants.set(variant.id, variant);
    }

    // Create size entry
    const sizeName = String(row['size'] || 'One Size');
    const sizeKey = `${variant.id}-${sizeName}`;
    let size = Array.from(sizes.values()).find(s =>
      s.variantId === variant!.id && s.name === sizeName
    );

    if (!size) {
      size = {
        id: generateId('sz', `${description}-${sizeName}`),
        variantId: variant.id,
        name: sizeName,
        sortOrder: sizes.size
      };
      sizes.set(size.id, size);

      // Add inventory
      inventory.push({
        sizeId: size.id,
        quantityOnHand: qtyAvailable,
        quantityReserved: 0
      });
    }
  }

  console.log(`Total: ${categories.size} categories, ${itemTypes.size} item types, ${variants.size} variants, ${sizes.size} sizes`);
}

function generateSQL(): string {
  const lines: string[] = [];

  lines.push('-- Generated SQL Insert Statements');
  lines.push('-- Run this after schema.sql');
  lines.push('');
  lines.push('-- Categories');

  for (const cat of categories.values()) {
    lines.push(`INSERT INTO Categories (id, name, description, sortOrder, isActive) VALUES ('${cat.id}', '${cat.name.replace(/'/g, "''")}', '${cat.description.replace(/'/g, "''")}', ${cat.sortOrder}, 1);`);
  }

  lines.push('');
  lines.push('-- Item Types');

  for (const it of itemTypes.values()) {
    lines.push(`INSERT INTO ItemTypes (id, categoryId, name, description, femaCode, femaRequiredQty, parLevel, isConsumable, isActive) VALUES ('${it.id}', '${it.categoryId}', '${it.name.replace(/'/g, "''")}', '${it.description.replace(/'/g, "''")}', '${it.femaCode}', ${it.femaRequiredQty}, ${it.parLevel}, ${it.isConsumable ? 1 : 0}, 1);`);
  }

  lines.push('');
  lines.push('-- Variants');

  for (const v of variants.values()) {
    lines.push(`INSERT INTO Variants (id, itemTypeId, name, manufacturer, sku, barcode, unitCost, isActive) VALUES ('${v.id}', '${v.itemTypeId}', '${v.name.replace(/'/g, "''")}', '${v.manufacturer.replace(/'/g, "''")}', ${v.sku ? `'${v.sku}'` : 'NULL'}, ${v.barcode ? `'${v.barcode}'` : 'NULL'}, ${v.unitCost || 'NULL'}, 1);`);
  }

  lines.push('');
  lines.push('-- Sizes');

  for (const s of sizes.values()) {
    lines.push(`INSERT INTO Sizes (id, variantId, name, sortOrder, isActive) VALUES ('${s.id}', '${s.variantId}', '${s.name.replace(/'/g, "''")}', ${s.sortOrder}, 1);`);
  }

  lines.push('');
  lines.push('-- Inventory');

  for (const inv of inventory) {
    lines.push(`INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved) VALUES ('${inv.sizeId}', ${inv.quantityOnHand}, ${inv.quantityReserved});`);
  }

  return lines.join('\n');
}

// Main execution
console.log('Starting data import...\n');

importFEMACache();
importPPEInventory();

const sql = generateSQL();
const outputPath = path.join(__dirname, 'seed-data.sql');
fs.writeFileSync(outputPath, sql);

console.log(`\nGenerated SQL saved to: ${outputPath}`);
console.log('\nTo import into your database:');
console.log('1. First run schema.sql to create tables');
console.log('2. Then run seed-data.sql to import the data');
