/**
 * SQL Seed Generator for PPE Inventory
 *
 * Reads ppe_inventory_USAR_OPTIMIZED.xlsx and generates SQL INSERT statements
 * for populating the Azure SQL database with PPE inventory data.
 *
 * Usage: node generate-sql-seed.cjs
 * Output: warehouse-api/scripts/seed-ppe-data.sql
 */

const XLSX = require('./warehouse-pwa/node_modules/xlsx');
const fs = require('fs');

// Read Excel file
const workbook = XLSX.readFile('ppe_inventory_USAR_OPTIMIZED.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

console.log(`Read ${data.length} rows from Excel file`);

// Helper to create slug IDs
const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Helper to escape SQL strings (handle single quotes)
const sqlEscape = (str) => {
  if (str === null || str === undefined) return 'NULL';
  return `N'${String(str).replace(/'/g, "''")}'`;
};

// Build categories from CATEGORY column
const categoryNames = [...new Set(data.map(r => r.CATEGORY))].filter(Boolean).sort();
const categories = categoryNames.map((name, i) => ({
  id: `cat-${slugify(name)}`,
  name,
  sortOrder: (i + 1) * 10,
}));

console.log(`Found ${categories.length} categories`);

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
      deployment: row.DEPLOYMENT || 'CA-TF2',
    });
  }
});

const itemTypes = Array.from(itemTypeMap.values()).map((item, i) => ({
  id: `it-${i + 1}`,
  categoryId: `cat-${slugify(item.category)}`,
  name: item.productName,
  subcategory: item.subcategory,
  type: item.type,
  femaCode: item.femaCode,
  deployment: item.deployment,
}));

console.log(`Found ${itemTypes.length} item types`);

// Build variants - create one variant per item type (using manufacturer from itemTypeMap)
const variants = itemTypes.map((itemType, i) => {
  // Find the original data for this item type to get manufacturer
  const categoryName = categories.find(c => c.id === itemType.categoryId)?.name;
  const originalData = Array.from(itemTypeMap.values()).find(
    d => d.productName === itemType.name &&
         d.category === categoryName &&
         d.subcategory === itemType.subcategory &&
         d.type === itemType.type
  );

  return {
    id: `var-${i + 1}`,
    itemTypeId: itemType.id,
    name: itemType.name,
    manufacturer: originalData?.manufacturer || 'Generic',
  };
});

console.log(`Created ${variants.length} variants (1:1 with item types)`);

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
    categories.find(c => c.id === it.categoryId)?.name === row.CATEGORY &&
    it.subcategory === row.SUBCATEGORY &&
    it.type === row.TYPE
  );

  if (!itemType) {
    // Try with less strict matching
    const fallbackItemType = itemTypes.find(it =>
      it.name === row.PRODUCT_NAME &&
      categories.find(c => c.id === it.categoryId)?.name === row.CATEGORY
    );
    if (!fallbackItemType) {
      console.warn(`No matching item type for: ${row.PRODUCT_NAME}`);
      return;
    }
  }

  const matchedItemType = itemType || itemTypes.find(it =>
    it.name === row.PRODUCT_NAME &&
    categories.find(c => c.id === it.categoryId)?.name === row.CATEGORY
  );

  if (!matchedItemType) return;

  const variantId = variantByItemType.get(matchedItemType.id);
  if (!variantId) {
    console.warn(`No variant found for item type: ${matchedItemType.id}`);
    return;
  }

  const sizeName = row.SIZE || 'One Size';
  const sizeDetail = [row.SIZE_DETAIL_1, row.SIZE_DETAIL_2].filter(Boolean).join(' / ');
  const legacyId = row.ITEM_ID || row.FEMA_REF || `INV-${sizeId}`;

  const sId = `sz-${sizeId++}`;

  sizes.push({
    id: sId,
    variantId,
    name: sizeName,
    sizeDetail: sizeDetail || null,
    legacyId: legacyId,
    sortOrder: row.SIZE_SORT || sizeName,
  });

  inventory.push({
    sizeId: sId,
    quantityOnHand: row.QTY_AVAILABLE || 0,
    quantityReserved: 0,
    quantityOut: row.QTY_OUT || 0,
  });
});

console.log(`Generated ${sizes.length} sizes and ${inventory.length} inventory records`);

// Generate SQL output
const timestamp = new Date().toISOString();
let sql = `-- =====================================================
-- PPE Inventory Seed Data
-- =====================================================
-- Auto-generated from ppe_inventory_USAR_OPTIMIZED.xlsx
-- Generated: ${timestamp}
--
-- Categories: ${categories.length}
-- Item Types: ${itemTypes.length}
-- Variants: ${variants.length}
-- Sizes: ${sizes.length}
-- Inventory Records: ${inventory.length}
-- =====================================================

-- IMPORTANT: Run warehouse-api/scripts/migrations/001-add-ppe-fields.sql first!
-- This script requires the new columns (subcategory, type, deployment, sizeDetail, legacyId, quantityOut)

SET NOCOUNT ON;
BEGIN TRANSACTION;

BEGIN TRY

-- =====================================================
-- Clear existing PPE data (optional - uncomment if needed)
-- =====================================================
-- DELETE FROM Inventory WHERE sizeId LIKE 'sz-%';
-- DELETE FROM Sizes WHERE id LIKE 'sz-%';
-- DELETE FROM Variants WHERE id LIKE 'var-%';
-- DELETE FROM ItemTypes WHERE id LIKE 'it-%';
-- DELETE FROM Categories WHERE id LIKE 'cat-%';

-- =====================================================
-- Insert Categories
-- =====================================================
PRINT 'Inserting ${categories.length} categories...';

`;

// Categories INSERT
categories.forEach(cat => {
  sql += `IF NOT EXISTS (SELECT 1 FROM Categories WHERE id = ${sqlEscape(cat.id)})
    INSERT INTO Categories (id, name, sortOrder, isActive) VALUES (${sqlEscape(cat.id)}, ${sqlEscape(cat.name)}, ${cat.sortOrder}, 1);
`;
});

sql += `
-- =====================================================
-- Insert Item Types
-- =====================================================
PRINT 'Inserting ${itemTypes.length} item types...';

`;

// ItemTypes INSERT
itemTypes.forEach(it => {
  sql += `IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = ${sqlEscape(it.id)})
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (${sqlEscape(it.id)}, ${sqlEscape(it.categoryId)}, ${sqlEscape(it.name)}, ${sqlEscape(it.subcategory)}, ${sqlEscape(it.type)}, ${sqlEscape(it.deployment)}, ${sqlEscape(it.femaCode)}, 1);
`;
});

sql += `
-- =====================================================
-- Insert Variants
-- =====================================================
PRINT 'Inserting ${variants.length} variants...';

`;

// Variants INSERT
variants.forEach(v => {
  sql += `IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = ${sqlEscape(v.id)})
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (${sqlEscape(v.id)}, ${sqlEscape(v.itemTypeId)}, ${sqlEscape(v.name)}, ${sqlEscape(v.manufacturer)}, 1);
`;
});

sql += `
-- =====================================================
-- Insert Sizes
-- =====================================================
PRINT 'Inserting ${sizes.length} sizes...';

`;

// Sizes INSERT
sizes.forEach(s => {
  // sortOrder needs to be an integer for the DB
  const sortOrderInt = typeof s.sortOrder === 'string' ? 0 : s.sortOrder;
  sql += `IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = ${sqlEscape(s.id)})
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (${sqlEscape(s.id)}, ${sqlEscape(s.variantId)}, ${sqlEscape(s.name)}, ${sqlEscape(s.sizeDetail)}, ${sqlEscape(s.legacyId)}, ${sortOrderInt}, 1);
`;
});

sql += `
-- =====================================================
-- Insert/Update Inventory
-- =====================================================
PRINT 'Inserting ${inventory.length} inventory records...';

`;

// Inventory MERGE (upsert)
inventory.forEach(inv => {
  sql += `IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = ${sqlEscape(inv.sizeId)})
    UPDATE Inventory SET quantityOnHand = ${inv.quantityOnHand}, quantityReserved = ${inv.quantityReserved}, quantityOut = ${inv.quantityOut} WHERE sizeId = ${sqlEscape(inv.sizeId)};
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (${sqlEscape(inv.sizeId)}, ${inv.quantityOnHand}, ${inv.quantityReserved}, ${inv.quantityOut});
`;
});

sql += `
-- =====================================================
-- Commit Transaction
-- =====================================================
COMMIT TRANSACTION;
PRINT '';
PRINT '=====================================================';
PRINT 'PPE Seed Data Import Complete!';
PRINT '=====================================================';
PRINT 'Categories: ${categories.length}';
PRINT 'Item Types: ${itemTypes.length}';
PRINT 'Variants: ${variants.length}';
PRINT 'Sizes: ${sizes.length}';
PRINT 'Inventory Records: ${inventory.length}';
PRINT '=====================================================';

END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    PRINT 'ERROR: ' + ERROR_MESSAGE();
    THROW;
END CATCH
`;

// Write SQL file
const outputPath = 'warehouse-api/scripts/seed-ppe-data.sql';
fs.writeFileSync(outputPath, sql);

console.log('');
console.log('=====================================================');
console.log(`Generated ${outputPath}`);
console.log('=====================================================');
console.log(`Categories: ${categories.length}`);
console.log(`Item Types: ${itemTypes.length}`);
console.log(`Variants: ${variants.length}`);
console.log(`Sizes: ${sizes.length}`);
console.log(`Inventory Records: ${inventory.length}`);
console.log('');
console.log('Next steps:');
console.log('1. Run migrations/001-add-ppe-fields.sql on your database');
console.log('2. Run seed-ppe-data.sql on your database');
console.log('=====================================================');
