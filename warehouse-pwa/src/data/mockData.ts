import {
  Category,
  ItemType,
  Variant,
  Size,
  InventoryItem,
  User,
  Vendor,
  Request,
  PurchaseOrder,
  IssuedItem,
  Notification,
} from '../types';

// ==============================================
// CATEGORIES
// ==============================================
export const categories: Category[] = [
  { id: "cat-1", name: "Sanitation", description: "Hygiene and sanitation supplies", sortOrder: 10, isActive: true },
  { id: "cat-2", name: "Safety", description: "Safety equipment and supplies", sortOrder: 20, isActive: true },
  { id: "cat-3", name: "Personal Gear", description: "Personal protective equipment and uniforms", sortOrder: 30, isActive: true },
  { id: "cat-4", name: "HazMat PPE", description: "Hazardous materials protective equipment", sortOrder: 40, isActive: true },
  { id: "cat-5", name: "Water Rescue", description: "Water rescue equipment", sortOrder: 50, isActive: true },
  { id: "cat-6", name: "Medical", description: "Medical supplies and equipment", sortOrder: 60, isActive: true },
  { id: "cat-7", name: "Publications", description: "Reference guides and manuals", sortOrder: 70, isActive: true }
];

// ==============================================
// ITEM TYPES (from FEMA Cache List - subset)
// ==============================================
export const itemTypes: ItemType[] = [
  { id: "it-1", categoryId: "cat-1", name: "Toilet Paper, Rolls", description: "LD-0104.00 - Toilet Paper, Rolls", femaCode: "LD-0104.00", femaRequiredQty: 48, parLevel: 24, isConsumable: true, isActive: true },
  { id: "it-2", categoryId: "cat-1", name: "Towlettes, moistened, antibacterial", description: "LD-0107.00 - Towlettes, moistened, antibacterial", femaCode: "LD-0107.00", femaRequiredQty: 2500, parLevel: 1000, isConsumable: true, isActive: true },
  { id: "it-3", categoryId: "cat-2", name: "Glasses, Safety, shatter proof", description: "LE-0106.00 - Glasses, Safety, shatter proof, with side shields and lanyard", femaCode: "LE-0106.00", femaRequiredQty: 144, parLevel: 50, isConsumable: false, isActive: true },
  { id: "it-4", categoryId: "cat-2", name: "Ear plugs, safety, disposable", description: "LE-0104.00 - Ear plugs, safety, disposable, style NRR 24", femaCode: "LE-0104.00", femaRequiredQty: 300, parLevel: 100, isConsumable: true, isActive: true },
  { id: "it-5", categoryId: "cat-3", name: "Ball cap, navy blue w/ Task Force Logo", description: "LG-0101.00 - Ball cap, navy blue w/ Task Force Logo", femaCode: "LG-0101.00", femaRequiredQty: 1, parLevel: 20, isConsumable: false, isActive: true },
  { id: "it-6", categoryId: "cat-3", name: "Boots, Safety, Black, Gore-Tex", description: "LG-0102.00 - Boots, Safety, Black, Gore-Tex, ASTM/NFPA compliant or equivalent, pair", femaCode: "LG-0102.00", femaRequiredQty: 2, parLevel: 10, isConsumable: false, isActive: true },
  { id: "it-7", categoryId: "cat-3", name: "Uniform, Pants BDU/ACU Style, Navy Blue", description: "LG-0112.00 - Uniform, Pants BDU/ACU Style, Navy Blue", femaCode: "LG-0112.00", femaRequiredQty: 6, parLevel: 30, isConsumable: false, isActive: true },
  { id: "it-8", categoryId: "cat-3", name: "Overshirt or Blouse, BDU/ACU Style, Navy Blue", description: "LG-0112.01 - Overshirt or Blouse, BDU/ACU Style, Navy Blue", femaCode: "LG-0112.01", femaRequiredQty: 4, parLevel: 30, isConsumable: false, isActive: true },
  { id: "it-9", categoryId: "cat-3", name: "T-shirt, with team logos", description: "LG-0125.00 - T-shirt, with team logos, Long and/or Short sleeve", femaCode: "LG-0125.00", femaRequiredQty: 6, parLevel: 50, isConsumable: false, isActive: true },
  { id: "it-10", categoryId: "cat-3", name: "Helmet, rescue-type, low profile", description: "LG-0105.00 - Helmet, rescue-type, low profile, ASTM/NFPA compliant", femaCode: "LG-0105.00", femaRequiredQty: 1, parLevel: 10, isConsumable: false, isActive: true },
  { id: "it-11", categoryId: "cat-3", name: "Gloves, work, leather", description: "LG-0108.00 - Gloves, work, leather, sized as needed", femaCode: "LG-0108.00", femaRequiredQty: 2, parLevel: 30, isConsumable: false, isActive: true },
  { id: "it-12", categoryId: "cat-4", name: "Mask, N95, NIOSH Approved", description: "HD-0169.00 - Mask, N95, NIOSH Approved, w/o relief valve", femaCode: "HD-0169.00", femaRequiredQty: 950, parLevel: 500, isConsumable: true, isActive: true },
  { id: "it-13", categoryId: "cat-5", name: "PFD, Floatation Device, Personal", description: "WA-0105.00 - PFD, Floatation Device, Personal, Extrasport Universal Rescue", femaCode: "WA-0105.00", femaRequiredQty: 80, parLevel: 40, isConsumable: false, isActive: true },
  { id: "it-14", categoryId: "cat-6", name: "First Aid Kit, Personal", description: "MA-0101.00 - First Aid Kit, Personal", femaCode: "MA-0101.00", femaRequiredQty: 80, parLevel: 40, isConsumable: true, isActive: true },
  { id: "it-15", categoryId: "cat-7", name: "Guide, Field Operations, FEMA, US&R", description: "LG-0129.00 - Guide, Field Operations, FEMA, US&R", femaCode: "LG-0129.00", femaRequiredQty: 1, parLevel: 20, isConsumable: false, isActive: true }
];

// ==============================================
// VARIANTS (from Ripley Room - subset)
// ==============================================
export const variants: Variant[] = [
  // Pants variants
  { id: "var-1", itemTypeId: "it-7", name: "5.11 Stryke TDU", manufacturer: "5.11 Tactical", sku: "74433", unitCost: 65.99, isActive: true },
  { id: "var-2", itemTypeId: "it-7", name: "Tru-Spec 24/7 Tactical", manufacturer: "Tru-Spec", sku: "1024", unitCost: 54.99, isActive: true },
  // Shirt variants
  { id: "var-3", itemTypeId: "it-8", name: "5.11 Stryke TDU Shirt", manufacturer: "5.11 Tactical", sku: "72416", unitCost: 59.99, isActive: true },
  { id: "var-4", itemTypeId: "it-8", name: "Tru-Spec TRU Shirt", manufacturer: "Tru-Spec", sku: "1269", unitCost: 49.99, isActive: true },
  // T-shirt variants
  { id: "var-5", itemTypeId: "it-9", name: "5.11 Station Wear SS", manufacturer: "5.11 Tactical", sku: "40050", unitCost: 24.99, isActive: true },
  { id: "var-6", itemTypeId: "it-9", name: "Under Armour Tactical", manufacturer: "Under Armour", sku: "1005684", unitCost: 29.99, isActive: true },
  // Boot variants
  { id: "var-7", itemTypeId: "it-6", name: "Bates GX-8 Gore-Tex", manufacturer: "Bates", sku: "E02268", unitCost: 159.99, isActive: true },
  { id: "var-8", itemTypeId: "it-6", name: "Danner Striker Bolt GTX", manufacturer: "Danner", sku: "26631", unitCost: 189.99, isActive: true },
  // Helmet variants
  { id: "var-9", itemTypeId: "it-10", name: "Team Wendy EXFIL SAR", manufacturer: "Team Wendy", sku: "81R-WH", unitCost: 325.00, isActive: true },
  { id: "var-10", itemTypeId: "it-10", name: "Petzl Vertex", manufacturer: "Petzl", sku: "A010AA", unitCost: 115.00, isActive: true },
  // Gloves variants
  { id: "var-11", itemTypeId: "it-11", name: "Shelby 2533", manufacturer: "Shelby", sku: "2533", unitCost: 32.99, isActive: true },
  { id: "var-12", itemTypeId: "it-11", name: "Mechanix M-Pact", manufacturer: "Mechanix Wear", sku: "MPT-55", unitCost: 34.99, isActive: true },
  // Cap variants
  { id: "var-13", itemTypeId: "it-5", name: "5.11 Uniform Hat", manufacturer: "5.11 Tactical", sku: "89260", unitCost: 14.99, isActive: true },
  // Safety glasses variants
  { id: "var-14", itemTypeId: "it-3", name: "Oakley SI Ballistic M Frame", manufacturer: "Oakley", sku: "11-162", unitCost: 120.00, isActive: true },
  { id: "var-15", itemTypeId: "it-3", name: "ESS Crossbow", manufacturer: "ESS", sku: "740-0387", unitCost: 89.00, isActive: true },
  // PFD variant
  { id: "var-16", itemTypeId: "it-13", name: "Extrasport Universal Rescue", manufacturer: "Extrasport", sku: "URV", unitCost: 175.00, isActive: true },
  // N95 variant
  { id: "var-17", itemTypeId: "it-12", name: "3M N95 8210", manufacturer: "3M", sku: "8210", unitCost: 1.25, isActive: true },
  // Consumables - generic variants
  { id: "var-18", itemTypeId: "it-1", name: "Standard Roll", manufacturer: "Generic", sku: "TP-001", unitCost: 0.50, isActive: true },
  { id: "var-19", itemTypeId: "it-2", name: "Antibacterial Wipes", manufacturer: "Wet Ones", sku: "WO-100", unitCost: 0.10, isActive: true },
  { id: "var-20", itemTypeId: "it-4", name: "Howard Leight", manufacturer: "Honeywell", sku: "LT-30", unitCost: 0.15, isActive: true },
  // First aid kit
  { id: "var-21", itemTypeId: "it-14", name: "Adventure Medical MOLLE", manufacturer: "Adventure Medical", sku: "AMK-2064", unitCost: 45.00, isActive: true },
  // Field guide
  { id: "var-22", itemTypeId: "it-15", name: "FEMA FOG", manufacturer: "FEMA", sku: "FOG-2024", unitCost: 15.00, isActive: true }
];

// ==============================================
// SIZES
// ==============================================
export const sizes: Size[] = [
  // Pants sizes (5.11 Stryke)
  { id: "sz-1", variantId: "var-1", name: "30x30", sortOrder: 1, isActive: true },
  { id: "sz-2", variantId: "var-1", name: "30x32", sortOrder: 2, isActive: true },
  { id: "sz-3", variantId: "var-1", name: "32x30", sortOrder: 3, isActive: true },
  { id: "sz-4", variantId: "var-1", name: "32x32", sortOrder: 4, isActive: true },
  { id: "sz-5", variantId: "var-1", name: "34x30", sortOrder: 5, isActive: true },
  { id: "sz-6", variantId: "var-1", name: "34x32", sortOrder: 6, isActive: true },
  { id: "sz-7", variantId: "var-1", name: "36x32", sortOrder: 7, isActive: true },
  { id: "sz-8", variantId: "var-1", name: "38x32", sortOrder: 8, isActive: true },
  // Pants sizes (Tru-Spec)
  { id: "sz-9", variantId: "var-2", name: "32x32", sortOrder: 1, isActive: true },
  { id: "sz-10", variantId: "var-2", name: "34x32", sortOrder: 2, isActive: true },
  { id: "sz-11", variantId: "var-2", name: "36x32", sortOrder: 3, isActive: true },
  // Shirt sizes (5.11)
  { id: "sz-12", variantId: "var-3", name: "S", sortOrder: 1, isActive: true },
  { id: "sz-13", variantId: "var-3", name: "M", sortOrder: 2, isActive: true },
  { id: "sz-14", variantId: "var-3", name: "L", sortOrder: 3, isActive: true },
  { id: "sz-15", variantId: "var-3", name: "XL", sortOrder: 4, isActive: true },
  { id: "sz-16", variantId: "var-3", name: "2XL", sortOrder: 5, isActive: true },
  // Shirt sizes (Tru-Spec)
  { id: "sz-17", variantId: "var-4", name: "M", sortOrder: 1, isActive: true },
  { id: "sz-18", variantId: "var-4", name: "L", sortOrder: 2, isActive: true },
  { id: "sz-19", variantId: "var-4", name: "XL", sortOrder: 3, isActive: true },
  // T-shirt sizes
  { id: "sz-20", variantId: "var-5", name: "S", sortOrder: 1, isActive: true },
  { id: "sz-21", variantId: "var-5", name: "M", sortOrder: 2, isActive: true },
  { id: "sz-22", variantId: "var-5", name: "L", sortOrder: 3, isActive: true },
  { id: "sz-23", variantId: "var-5", name: "XL", sortOrder: 4, isActive: true },
  { id: "sz-24", variantId: "var-6", name: "M", sortOrder: 1, isActive: true },
  { id: "sz-25", variantId: "var-6", name: "L", sortOrder: 2, isActive: true },
  // Boot sizes
  { id: "sz-26", variantId: "var-7", name: "8", sortOrder: 1, isActive: true },
  { id: "sz-27", variantId: "var-7", name: "9", sortOrder: 2, isActive: true },
  { id: "sz-28", variantId: "var-7", name: "10", sortOrder: 3, isActive: true },
  { id: "sz-29", variantId: "var-7", name: "10.5", sortOrder: 4, isActive: true },
  { id: "sz-30", variantId: "var-7", name: "11", sortOrder: 5, isActive: true },
  { id: "sz-31", variantId: "var-7", name: "12", sortOrder: 6, isActive: true },
  { id: "sz-32", variantId: "var-8", name: "9", sortOrder: 1, isActive: true },
  { id: "sz-33", variantId: "var-8", name: "10", sortOrder: 2, isActive: true },
  { id: "sz-34", variantId: "var-8", name: "11", sortOrder: 3, isActive: true },
  // Helmet sizes
  { id: "sz-35", variantId: "var-9", name: "M/L", sortOrder: 1, isActive: true },
  { id: "sz-36", variantId: "var-9", name: "L/XL", sortOrder: 2, isActive: true },
  { id: "sz-37", variantId: "var-10", name: "1 (53-63cm)", sortOrder: 1, isActive: true },
  { id: "sz-38", variantId: "var-10", name: "2 (53-63cm)", sortOrder: 2, isActive: true },
  // Gloves sizes
  { id: "sz-39", variantId: "var-11", name: "S", sortOrder: 1, isActive: true },
  { id: "sz-40", variantId: "var-11", name: "M", sortOrder: 2, isActive: true },
  { id: "sz-41", variantId: "var-11", name: "L", sortOrder: 3, isActive: true },
  { id: "sz-42", variantId: "var-11", name: "XL", sortOrder: 4, isActive: true },
  { id: "sz-43", variantId: "var-12", name: "M", sortOrder: 1, isActive: true },
  { id: "sz-44", variantId: "var-12", name: "L", sortOrder: 2, isActive: true },
  { id: "sz-45", variantId: "var-12", name: "XL", sortOrder: 3, isActive: true },
  // Cap - one size
  { id: "sz-46", variantId: "var-13", name: "One Size", sortOrder: 1, isActive: true },
  // Safety glasses - one size
  { id: "sz-47", variantId: "var-14", name: "One Size", sortOrder: 1, isActive: true },
  { id: "sz-48", variantId: "var-15", name: "One Size", sortOrder: 1, isActive: true },
  // PFD - universal
  { id: "sz-49", variantId: "var-16", name: "Universal", sortOrder: 1, isActive: true },
  // N95 - one size
  { id: "sz-50", variantId: "var-17", name: "One Size", sortOrder: 1, isActive: true },
  // Consumables - unit
  { id: "sz-51", variantId: "var-18", name: "Roll", sortOrder: 1, isActive: true },
  { id: "sz-52", variantId: "var-19", name: "Pack of 40", sortOrder: 1, isActive: true },
  { id: "sz-53", variantId: "var-20", name: "Pair", sortOrder: 1, isActive: true },
  // First aid kit
  { id: "sz-54", variantId: "var-21", name: "One Size", sortOrder: 1, isActive: true },
  // Field guide
  { id: "sz-55", variantId: "var-22", name: "One Size", sortOrder: 1, isActive: true }
];

// ==============================================
// INVENTORY
// ==============================================
export const inventory: InventoryItem[] = [
  { sizeId: "sz-1", quantityOnHand: 5, quantityReserved: 1, quantityAvailable: 4 },
  { sizeId: "sz-2", quantityOnHand: 8, quantityReserved: 2, quantityAvailable: 6 },
  { sizeId: "sz-3", quantityOnHand: 10, quantityReserved: 0, quantityAvailable: 10 },
  { sizeId: "sz-4", quantityOnHand: 15, quantityReserved: 3, quantityAvailable: 12 },
  { sizeId: "sz-5", quantityOnHand: 12, quantityReserved: 1, quantityAvailable: 11 },
  { sizeId: "sz-6", quantityOnHand: 20, quantityReserved: 4, quantityAvailable: 16 },
  { sizeId: "sz-7", quantityOnHand: 8, quantityReserved: 0, quantityAvailable: 8 },
  { sizeId: "sz-8", quantityOnHand: 5, quantityReserved: 1, quantityAvailable: 4 },
  { sizeId: "sz-9", quantityOnHand: 10, quantityReserved: 0, quantityAvailable: 10 },
  { sizeId: "sz-10", quantityOnHand: 12, quantityReserved: 2, quantityAvailable: 10 },
  { sizeId: "sz-11", quantityOnHand: 6, quantityReserved: 0, quantityAvailable: 6 },
  { sizeId: "sz-12", quantityOnHand: 8, quantityReserved: 1, quantityAvailable: 7 },
  { sizeId: "sz-13", quantityOnHand: 15, quantityReserved: 2, quantityAvailable: 13 },
  { sizeId: "sz-14", quantityOnHand: 18, quantityReserved: 3, quantityAvailable: 15 },
  { sizeId: "sz-15", quantityOnHand: 12, quantityReserved: 1, quantityAvailable: 11 },
  { sizeId: "sz-16", quantityOnHand: 6, quantityReserved: 0, quantityAvailable: 6 },
  { sizeId: "sz-17", quantityOnHand: 10, quantityReserved: 0, quantityAvailable: 10 },
  { sizeId: "sz-18", quantityOnHand: 12, quantityReserved: 1, quantityAvailable: 11 },
  { sizeId: "sz-19", quantityOnHand: 8, quantityReserved: 0, quantityAvailable: 8 },
  { sizeId: "sz-20", quantityOnHand: 15, quantityReserved: 0, quantityAvailable: 15 },
  { sizeId: "sz-21", quantityOnHand: 25, quantityReserved: 2, quantityAvailable: 23 },
  { sizeId: "sz-22", quantityOnHand: 30, quantityReserved: 3, quantityAvailable: 27 },
  { sizeId: "sz-23", quantityOnHand: 20, quantityReserved: 1, quantityAvailable: 19 },
  { sizeId: "sz-24", quantityOnHand: 18, quantityReserved: 0, quantityAvailable: 18 },
  { sizeId: "sz-25", quantityOnHand: 22, quantityReserved: 2, quantityAvailable: 20 },
  { sizeId: "sz-26", quantityOnHand: 3, quantityReserved: 0, quantityAvailable: 3 },
  { sizeId: "sz-27", quantityOnHand: 5, quantityReserved: 1, quantityAvailable: 4 },
  { sizeId: "sz-28", quantityOnHand: 8, quantityReserved: 2, quantityAvailable: 6 },
  { sizeId: "sz-29", quantityOnHand: 6, quantityReserved: 0, quantityAvailable: 6 },
  { sizeId: "sz-30", quantityOnHand: 7, quantityReserved: 1, quantityAvailable: 6 },
  { sizeId: "sz-31", quantityOnHand: 4, quantityReserved: 0, quantityAvailable: 4 },
  { sizeId: "sz-32", quantityOnHand: 4, quantityReserved: 0, quantityAvailable: 4 },
  { sizeId: "sz-33", quantityOnHand: 5, quantityReserved: 1, quantityAvailable: 4 },
  { sizeId: "sz-34", quantityOnHand: 3, quantityReserved: 0, quantityAvailable: 3 },
  { sizeId: "sz-35", quantityOnHand: 6, quantityReserved: 1, quantityAvailable: 5 },
  { sizeId: "sz-36", quantityOnHand: 4, quantityReserved: 0, quantityAvailable: 4 },
  { sizeId: "sz-37", quantityOnHand: 8, quantityReserved: 0, quantityAvailable: 8 },
  { sizeId: "sz-38", quantityOnHand: 6, quantityReserved: 1, quantityAvailable: 5 },
  { sizeId: "sz-39", quantityOnHand: 10, quantityReserved: 0, quantityAvailable: 10 },
  { sizeId: "sz-40", quantityOnHand: 15, quantityReserved: 2, quantityAvailable: 13 },
  { sizeId: "sz-41", quantityOnHand: 18, quantityReserved: 3, quantityAvailable: 15 },
  { sizeId: "sz-42", quantityOnHand: 12, quantityReserved: 1, quantityAvailable: 11 },
  { sizeId: "sz-43", quantityOnHand: 12, quantityReserved: 0, quantityAvailable: 12 },
  { sizeId: "sz-44", quantityOnHand: 15, quantityReserved: 1, quantityAvailable: 14 },
  { sizeId: "sz-45", quantityOnHand: 10, quantityReserved: 0, quantityAvailable: 10 },
  { sizeId: "sz-46", quantityOnHand: 25, quantityReserved: 2, quantityAvailable: 23 },
  { sizeId: "sz-47", quantityOnHand: 20, quantityReserved: 0, quantityAvailable: 20 },
  { sizeId: "sz-48", quantityOnHand: 18, quantityReserved: 1, quantityAvailable: 17 },
  { sizeId: "sz-49", quantityOnHand: 35, quantityReserved: 5, quantityAvailable: 30 },
  { sizeId: "sz-50", quantityOnHand: 500, quantityReserved: 0, quantityAvailable: 500 },
  { sizeId: "sz-51", quantityOnHand: 100, quantityReserved: 0, quantityAvailable: 100 },
  { sizeId: "sz-52", quantityOnHand: 50, quantityReserved: 5, quantityAvailable: 45 },
  { sizeId: "sz-53", quantityOnHand: 200, quantityReserved: 0, quantityAvailable: 200 },
  { sizeId: "sz-54", quantityOnHand: 45, quantityReserved: 2, quantityAvailable: 43 },
  { sizeId: "sz-55", quantityOnHand: 30, quantityReserved: 0, quantityAvailable: 30 }
];

// ==============================================
// USERS
// ==============================================
export const users: User[] = [
  {
    id: "user-1",
    email: "john.smith@lacountyfire.gov",
    firstName: "John",
    lastName: "Smith",
    role: "TeamMember",
    isActive: true,
    employeeId: "88142",
    department: "USAR Task Force",
    position: "Rescue Specialist",
    phone: "(323) 555-0142",
    hireDate: "2018-06-15T00:00:00Z",
    sizes: { shirt: "L", pantsWaist: "34", pantsInseam: "32", bootSize: "10.5", gloveSize: "L" },
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-06-20T14:30:00Z"
  },
  {
    id: "user-2",
    email: "maria.garcia@lacountyfire.gov",
    firstName: "Maria",
    lastName: "Garcia",
    role: "TeamMember",
    isActive: true,
    employeeId: "88256",
    department: "USAR Task Force",
    position: "Search Specialist",
    phone: "(323) 555-0256",
    hireDate: "2020-03-01T00:00:00Z",
    sizes: { shirt: "M", pantsWaist: "30", pantsInseam: "30", bootSize: "8", gloveSize: "S" },
    createdAt: "2024-02-01T09:00:00Z",
    updatedAt: "2024-07-15T10:00:00Z"
  },
  {
    id: "user-3",
    email: "mike.johnson@lacountyfire.gov",
    firstName: "Mike",
    lastName: "Johnson",
    role: "WarehouseStaff",
    isActive: true,
    employeeId: "88103",
    department: "Logistics",
    position: "Warehouse Technician",
    phone: "(323) 555-0103",
    hireDate: "2015-09-01T00:00:00Z",
    sizes: { shirt: "XL", pantsWaist: "36", pantsInseam: "32", bootSize: "11", gloveSize: "XL" },
    createdAt: "2023-06-01T08:00:00Z",
    updatedAt: "2024-08-01T16:00:00Z"
  },
  {
    id: "user-4",
    email: "sarah.williams@lacountyfire.gov",
    firstName: "Sarah",
    lastName: "Williams",
    role: "WarehouseAdmin",
    isActive: true,
    employeeId: "88001",
    department: "Logistics",
    position: "Logistics Manager",
    phone: "(323) 555-0001",
    hireDate: "2010-01-15T00:00:00Z",
    sizes: { shirt: "S", pantsWaist: "28", pantsInseam: "30", bootSize: "7", gloveSize: "S" },
    createdAt: "2022-01-15T08:00:00Z",
    updatedAt: "2024-09-01T09:00:00Z"
  },
  {
    id: "user-5",
    email: "david.chen@lacountyfire.gov",
    firstName: "David",
    lastName: "Chen",
    role: "TeamMember",
    isActive: true,
    employeeId: "88312",
    department: "USAR Task Force",
    position: "HazMat Specialist",
    phone: "(323) 555-0312",
    hireDate: "2021-08-15T00:00:00Z",
    sizes: { shirt: "M", pantsWaist: "32", pantsInseam: "32", bootSize: "9", gloveSize: "M" },
    createdAt: "2024-03-01T08:00:00Z",
    updatedAt: "2024-05-15T11:00:00Z"
  },
  {
    id: "user-6",
    email: "robert.martinez@lacountyfire.gov",
    firstName: "Robert",
    lastName: "Martinez",
    role: "TeamMember",
    isActive: true,
    employeeId: "88189",
    department: "USAR Task Force",
    position: "Task Force Leader",
    phone: "(323) 555-0189",
    hireDate: "2012-04-01T00:00:00Z",
    sizes: { shirt: "XL", pantsWaist: "38", pantsInseam: "32", bootSize: "12", gloveSize: "XL" },
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-09-01T10:00:00Z"
  },
  {
    id: "user-7",
    email: "jennifer.lee@lacountyfire.gov",
    firstName: "Jennifer",
    lastName: "Lee",
    role: "TeamMember",
    isActive: true,
    employeeId: "88278",
    department: "USAR Task Force",
    position: "Medical Specialist",
    phone: "(323) 555-0278",
    hireDate: "2019-11-01T00:00:00Z",
    sizes: { shirt: "S", pantsWaist: "28", pantsInseam: "30", bootSize: "7", gloveSize: "S" },
    createdAt: "2024-02-15T08:00:00Z",
    updatedAt: "2024-06-01T14:00:00Z"
  },
  {
    id: "user-8",
    email: "kevin.brown@lacountyfire.gov",
    firstName: "Kevin",
    lastName: "Brown",
    role: "WarehouseStaff",
    isActive: true,
    employeeId: "88156",
    department: "Logistics",
    position: "Inventory Specialist",
    phone: "(323) 555-0156",
    hireDate: "2017-02-15T00:00:00Z",
    sizes: { shirt: "L", pantsWaist: "34", pantsInseam: "30", bootSize: "10", gloveSize: "L" },
    createdAt: "2023-08-01T08:00:00Z",
    updatedAt: "2024-07-15T11:00:00Z"
  },
  {
    id: "user-9",
    email: "amanda.wilson@lacountyfire.gov",
    firstName: "Amanda",
    lastName: "Wilson",
    role: "TeamMember",
    isActive: false,
    employeeId: "88234",
    department: "USAR Task Force",
    position: "K-9 Handler",
    phone: "(323) 555-0234",
    hireDate: "2016-07-01T00:00:00Z",
    sizes: { shirt: "M", pantsWaist: "30", pantsInseam: "32", bootSize: "8", gloveSize: "M" },
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: "2024-10-01T09:00:00Z"
  },
  {
    id: "user-10",
    email: "james.taylor@lacountyfire.gov",
    firstName: "James",
    lastName: "Taylor",
    role: "TeamMember",
    isActive: true,
    employeeId: "88345",
    department: "USAR Task Force",
    position: "Structural Engineer",
    phone: "(323) 555-0345",
    hireDate: "2022-01-10T00:00:00Z",
    sizes: { shirt: "L", pantsWaist: "32", pantsInseam: "34", bootSize: "11", gloveSize: "L" },
    createdAt: "2024-03-20T08:00:00Z",
    updatedAt: "2024-08-15T10:00:00Z"
  }
];

// ==============================================
// VENDORS
// ==============================================
export const vendors: Vendor[] = [
  { id: "ven-1", name: "5.11 Tactical", contactName: "Account Rep", email: "orders@511tactical.com", phone: "866-451-1726", website: "https://www.511tactical.com", isActive: true },
  { id: "ven-2", name: "Tru-Spec", contactName: "Customer Service", email: "sales@truspec.com", phone: "800-727-4312", website: "https://www.truspec.com", isActive: true },
  { id: "ven-3", name: "Bates Footwear", contactName: "Government Sales", email: "gov@batesfootwear.com", phone: "800-253-2184", website: "https://www.batesfootwear.com", isActive: true },
  { id: "ven-4", name: "Team Wendy", contactName: "Sales", email: "sales@teamwendy.com", phone: "216-738-2850", website: "https://www.teamwendy.com", isActive: true },
  { id: "ven-5", name: "Shelby Specialty Gloves", contactName: "Orders", email: "info@shelbyglove.com", phone: "800-458-7075", website: "https://www.shelbyglove.com", isActive: true },
  { id: "ven-6", name: "3M Safety", contactName: "Public Safety", email: "safety@3m.com", phone: "800-328-1667", website: "https://www.3m.com/safety", isActive: true }
];

// ==============================================
// REQUESTS
// ==============================================
export const requests: Request[] = [
  {
    id: "req-1",
    requestedBy: "user-1",
    requestedByName: "John Smith",
    status: "Pending",
    requestDate: "2024-12-01T10:00:00Z",
    notes: "Need new pants for deployment",
    lines: [
      { id: "rl-1", requestId: "req-1", itemTypeId: "it-7", itemTypeName: "Uniform, Pants BDU/ACU Style, Navy Blue", requestedSizeId: "sz-6", requestedSizeName: "34x32", preferredVariantId: "var-1", preferredVariantName: "5.11 Stryke TDU", quantity: 2, issuedQuantity: 0, isBackordered: false }
    ],
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z"
  },
  {
    id: "req-2",
    requestedBy: "user-2",
    requestedByName: "Maria Garcia",
    status: "Approved",
    requestDate: "2024-11-28T14:30:00Z",
    lines: [
      { id: "rl-2", requestId: "req-2", itemTypeId: "it-9", itemTypeName: "T-shirt, with team logos", requestedSizeId: "sz-21", requestedSizeName: "M", quantity: 3, issuedQuantity: 0, isBackordered: false },
      { id: "rl-3", requestId: "req-2", itemTypeId: "it-11", itemTypeName: "Gloves, work, leather", requestedSizeId: "sz-39", requestedSizeName: "S", preferredVariantId: "var-11", preferredVariantName: "Shelby 2533", quantity: 1, issuedQuantity: 0, isBackordered: false }
    ],
    createdAt: "2024-11-28T14:30:00Z",
    updatedAt: "2024-11-29T09:00:00Z"
  },
  {
    id: "req-3",
    requestedBy: "user-5",
    requestedByName: "David Chen",
    status: "ReadyForPickup",
    requestDate: "2024-11-25T09:00:00Z",
    lines: [
      { id: "rl-4", requestId: "req-3", itemTypeId: "it-10", itemTypeName: "Helmet, rescue-type, low profile", requestedSizeId: "sz-35", requestedSizeName: "M/L", preferredVariantId: "var-9", preferredVariantName: "Team Wendy EXFIL SAR", quantity: 1, issuedQuantity: 1, isBackordered: false }
    ],
    fulfilledBy: "user-3",
    createdAt: "2024-11-25T09:00:00Z",
    updatedAt: "2024-11-26T11:00:00Z"
  },
  {
    id: "req-4",
    requestedBy: "user-1",
    requestedByName: "John Smith",
    status: "Fulfilled",
    requestDate: "2024-11-15T08:00:00Z",
    lines: [
      { id: "rl-5", requestId: "req-4", itemTypeId: "it-6", itemTypeName: "Boots, Safety, Black, Gore-Tex", requestedSizeId: "sz-29", requestedSizeName: "10.5", preferredVariantId: "var-7", preferredVariantName: "Bates GX-8 Gore-Tex", quantity: 1, replacementReason: "Worn Out", issuedQuantity: 1, isBackordered: false }
    ],
    fulfilledBy: "user-3",
    fulfilledAt: "2024-11-18T14:00:00Z",
    pickupSignature: "base64encodedimage",
    pickupSignedAt: "2024-11-18T14:05:00Z",
    createdAt: "2024-11-15T08:00:00Z",
    updatedAt: "2024-11-18T14:05:00Z"
  },
  {
    id: "req-5",
    requestedBy: "user-2",
    requestedByName: "Maria Garcia",
    status: "Backordered",
    requestDate: "2024-11-20T11:00:00Z",
    lines: [
      { id: "rl-6", requestId: "req-5", itemTypeId: "it-6", itemTypeName: "Boots, Safety, Black, Gore-Tex", requestedSizeId: "sz-26", requestedSizeName: "8", preferredVariantId: "var-7", preferredVariantName: "Bates GX-8 Gore-Tex", quantity: 1, issuedQuantity: 0, isBackordered: true, backorderedAt: "2024-11-21T09:00:00Z" }
    ],
    createdAt: "2024-11-20T11:00:00Z",
    updatedAt: "2024-11-21T09:00:00Z"
  }
];

// ==============================================
// PURCHASE ORDERS
// ==============================================
export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "po-1",
    poNumber: "PO-2024-001",
    vendorId: "ven-1",
    vendorName: "5.11 Tactical",
    status: "Submitted",
    orderDate: "2024-11-20T10:00:00Z",
    expectedDeliveryDate: "2024-12-10T10:00:00Z",
    totalAmount: 1319.80,
    lines: [
      { id: "pol-1", purchaseOrderId: "po-1", sizeId: "sz-4", itemDescription: "5.11 Stryke TDU Pants 32x32", quantityOrdered: 10, quantityReceived: 0, unitCost: 65.99, lineTotal: 659.90 },
      { id: "pol-2", purchaseOrderId: "po-1", sizeId: "sz-6", itemDescription: "5.11 Stryke TDU Pants 34x32", quantityOrdered: 10, quantityReceived: 0, unitCost: 65.99, lineTotal: 659.90 }
    ],
    createdBy: "user-4",
    createdAt: "2024-11-20T10:00:00Z",
    updatedAt: "2024-11-20T10:00:00Z"
  },
  {
    id: "po-2",
    poNumber: "PO-2024-002",
    vendorId: "ven-3",
    vendorName: "Bates Footwear",
    status: "PartialReceived",
    orderDate: "2024-11-01T09:00:00Z",
    expectedDeliveryDate: "2024-11-25T10:00:00Z",
    totalAmount: 3199.80,
    lines: [
      { id: "pol-3", purchaseOrderId: "po-2", sizeId: "sz-26", itemDescription: "Bates GX-8 Gore-Tex Size 8", quantityOrdered: 5, quantityReceived: 2, unitCost: 159.99, lineTotal: 799.95 },
      { id: "pol-4", purchaseOrderId: "po-2", sizeId: "sz-28", itemDescription: "Bates GX-8 Gore-Tex Size 10", quantityOrdered: 10, quantityReceived: 10, unitCost: 159.99, lineTotal: 1599.90 },
      { id: "pol-5", purchaseOrderId: "po-2", sizeId: "sz-30", itemDescription: "Bates GX-8 Gore-Tex Size 11", quantityOrdered: 5, quantityReceived: 0, unitCost: 159.99, lineTotal: 799.95 }
    ],
    createdBy: "user-4",
    createdAt: "2024-11-01T09:00:00Z",
    updatedAt: "2024-11-15T14:00:00Z"
  },
  {
    id: "po-3",
    poNumber: "PO-2024-003",
    vendorId: "ven-6",
    vendorName: "3M Safety",
    status: "Received",
    orderDate: "2024-10-15T08:00:00Z",
    totalAmount: 625.00,
    lines: [
      { id: "pol-6", purchaseOrderId: "po-3", sizeId: "sz-50", itemDescription: "3M N95 8210 Masks", quantityOrdered: 500, quantityReceived: 500, unitCost: 1.25, lineTotal: 625.00 }
    ],
    createdBy: "user-4",
    createdAt: "2024-10-15T08:00:00Z",
    updatedAt: "2024-10-25T11:00:00Z"
  }
];

// ==============================================
// ISSUED ITEMS
// ==============================================
export const issuedItems: IssuedItem[] = [
  {
    id: "ii-1",
    userId: "user-1",
    sizeId: "sz-29",
    itemDescription: "Bates GX-8 Gore-Tex - 10.5",
    categoryName: "Personal Gear",
    itemTypeName: "Boots, Safety, Black, Gore-Tex",
    variantName: "Bates GX-8 Gore-Tex",
    sizeName: "10.5",
    quantity: 1,
    issuedAt: "2024-11-18T14:00:00Z",
    requestLineId: "rl-5"
  },
  {
    id: "ii-2",
    userId: "user-1",
    sizeId: "sz-6",
    itemDescription: "5.11 Stryke TDU Pants - 34x32",
    categoryName: "Personal Gear",
    itemTypeName: "Uniform, Pants BDU/ACU Style, Navy Blue",
    variantName: "5.11 Stryke TDU",
    sizeName: "34x32",
    quantity: 4,
    issuedAt: "2024-06-15T10:00:00Z"
  },
  {
    id: "ii-3",
    userId: "user-1",
    sizeId: "sz-14",
    itemDescription: "5.11 Stryke TDU Shirt - L",
    categoryName: "Personal Gear",
    itemTypeName: "Overshirt or Blouse, BDU/ACU Style, Navy Blue",
    variantName: "5.11 Stryke TDU Shirt",
    sizeName: "L",
    quantity: 3,
    issuedAt: "2024-06-15T10:00:00Z"
  },
  {
    id: "ii-4",
    userId: "user-1",
    sizeId: "sz-35",
    itemDescription: "Team Wendy EXFIL SAR - M/L",
    categoryName: "Personal Gear",
    itemTypeName: "Helmet, rescue-type, low profile",
    variantName: "Team Wendy EXFIL SAR",
    sizeName: "M/L",
    quantity: 1,
    issuedAt: "2024-01-20T09:00:00Z"
  },
  {
    id: "ii-5",
    userId: "user-2",
    sizeId: "sz-12",
    itemDescription: "5.11 Stryke TDU Shirt - S",
    categoryName: "Personal Gear",
    itemTypeName: "Overshirt or Blouse, BDU/ACU Style, Navy Blue",
    variantName: "5.11 Stryke TDU Shirt",
    sizeName: "S",
    quantity: 2,
    issuedAt: "2024-02-10T11:00:00Z"
  },
  {
    id: "ii-6",
    userId: "user-5",
    sizeId: "sz-4",
    itemDescription: "5.11 Stryke TDU Pants - 32x32",
    categoryName: "Personal Gear",
    itemTypeName: "Uniform, Pants BDU/ACU Style, Navy Blue",
    variantName: "5.11 Stryke TDU",
    sizeName: "32x32",
    quantity: 3,
    issuedAt: "2024-03-15T14:00:00Z"
  }
];

// ==============================================
// NOTIFICATIONS
// ==============================================
export const notifications: Notification[] = [
  {
    id: "notif-1",
    userId: "user-1",
    title: "Request Approved",
    message: "Your request for 2x BDU Pants has been approved and is being processed.",
    relatedTable: "requests",
    relatedRecordId: "req-1",
    isRead: false,
    createdAt: "2024-12-01T11:00:00Z"
  },
  {
    id: "notif-2",
    userId: "user-5",
    title: "Ready for Pickup",
    message: "Your helmet is ready for pickup at the Ripley Room.",
    relatedTable: "requests",
    relatedRecordId: "req-3",
    isRead: false,
    createdAt: "2024-11-26T11:00:00Z"
  },
  {
    id: "notif-3",
    userId: "user-2",
    title: "Item Backordered",
    message: "The boots you requested (Size 8) are currently out of stock. You will be notified when they arrive.",
    relatedTable: "requests",
    relatedRecordId: "req-5",
    isRead: true,
    readAt: "2024-11-21T10:00:00Z",
    createdAt: "2024-11-21T09:00:00Z"
  },
  {
    id: "notif-4",
    userId: "user-3",
    title: "New Request",
    message: "John Smith has submitted a new request for BDU Pants.",
    relatedTable: "requests",
    relatedRecordId: "req-1",
    isRead: false,
    createdAt: "2024-12-01T10:00:00Z"
  },
  {
    id: "notif-5",
    userId: "user-4",
    title: "Low Stock Alert",
    message: "Bates GX-8 Gore-Tex Size 8 is below par level. Current: 3, Par: 10",
    relatedTable: "inventory",
    relatedRecordId: "sz-26",
    isRead: false,
    createdAt: "2024-11-25T08:00:00Z"
  }
];

// Current logged-in user (for mock purposes)
export const currentUser = users[0]; // John Smith - TeamMember
// Change to users[2] for Mike Johnson - WarehouseStaff
// Change to users[3] for Sarah Williams - WarehouseAdmin
