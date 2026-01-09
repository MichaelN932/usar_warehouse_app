// ==============================================
// Mock Data - Generated from Ripley Room Inventory
// and FEMA Approved Equipment Cache List
// ==============================================

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
} from '../types';

// ==============================================
// CATEGORIES
// ==============================================
export const categories: Category[] = [
  {
    "id": "cat-1",
    "name": "Sanitation",
    "description": "Hygiene and sanitation supplies",
    "sortOrder": 10,
    "isActive": true
  },
  {
    "id": "cat-2",
    "name": "Safety",
    "description": "Safety equipment and supplies",
    "sortOrder": 20,
    "isActive": true
  },
  {
    "id": "cat-3",
    "name": "Personal Gear",
    "description": "Personal protective equipment and uniforms",
    "sortOrder": 30,
    "isActive": true
  },
  {
    "id": "cat-4",
    "name": "HazMat PPE",
    "description": "Hazardous materials protective equipment",
    "sortOrder": 40,
    "isActive": true
  },
  {
    "id": "cat-5",
    "name": "Water Rescue",
    "description": "Water rescue equipment",
    "sortOrder": 50,
    "isActive": true
  },
  {
    "id": "cat-6",
    "name": "Medical",
    "description": "Medical supplies and equipment",
    "sortOrder": 60,
    "isActive": true
  },
  {
    "id": "cat-7",
    "name": "Publications",
    "description": "Reference guides and manuals",
    "sortOrder": 70,
    "isActive": true
  }
];

// ==============================================
// ITEM TYPES (from FEMA Cache List)
// ==============================================
export const itemTypes: ItemType[] = [
  {
    "id": "it-1",
    "categoryId": "cat-1",
    "name": "Sanitation",
    "description": "LD-0000.00 - Sanitation",
    "femaCode": "LD-0000.00",
    "femaRequiredQty": 0,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-2",
    "categoryId": "cat-1",
    "name": "Shelter, Shower, 2-stall System, in aluminum case",
    "description": "LD-0103.00 - Shelter, Shower, 2-stall System, in aluminum case",
    "femaCode": "LD-0103.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-3",
    "categoryId": "cat-1",
    "name": "Shower caddy",
    "description": "LD-0103.01 - Shower caddy",
    "femaCode": "LD-0103.01",
    "femaRequiredQty": 4,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-4",
    "categoryId": "cat-1",
    "name": "Bag, Shower, dry",
    "description": "LD-0103.02 - Bag, Shower, dry",
    "femaCode": "LD-0103.02",
    "femaRequiredQty": 4,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-5",
    "categoryId": "cat-1",
    "name": "Toilet Paper, Rolls",
    "description": "LD-0104.00 - Toilet Paper, Rolls",
    "femaCode": "LD-0104.00",
    "femaRequiredQty": 48,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-6",
    "categoryId": "cat-1",
    "name": "Toilets, portable latrine system, utilizing bio-bags, with privacy shelter",
    "description": "LD-0105.00 - Toilets, portable latrine system, utilizing bio-bags, with privacy shelter",
    "femaCode": "LD-0105.00",
    "femaRequiredQty": 7,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-7",
    "categoryId": "cat-1",
    "name": "Toilet, Brief Relief, Commode Kit",
    "description": "LD-0105.03 - Toilet, Brief Relief, Commode Kit",
    "femaCode": "LD-0105.03",
    "femaRequiredQty": 4,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-8",
    "categoryId": "cat-1",
    "name": "Toilet, Daily Restroom Kit, Brief Relief, 50/case",
    "description": "LD-0105.04 - Toilet, Daily Restroom Kit, Brief Relief, 50/case",
    "femaCode": "LD-0105.04",
    "femaRequiredQty": 16,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-9",
    "categoryId": "cat-1",
    "name": "Towlettes, moistened, antibacterial",
    "description": "LD-0107.00 - Towlettes, moistened, antibacterial",
    "femaCode": "LD-0107.00",
    "femaRequiredQty": 2500,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-10",
    "categoryId": "cat-1",
    "name": "Bleach, liquid or granular (equivalent of 1 gal)",
    "description": "LD-0108.00 - Bleach, liquid or granular (equivalent of 1 gal)",
    "femaCode": "LD-0108.00",
    "femaRequiredQty": 12,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-11",
    "categoryId": "cat-1",
    "name": "Body Bath Wipes, Bio-degradable",
    "description": "LD-0110.00 - Body Bath Wipes, Bio-degradable",
    "femaCode": "LD-0110.00",
    "femaRequiredQty": 400,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-12",
    "categoryId": "cat-1",
    "name": "Water Heater System, Multi Fuel",
    "description": "LD-0113.00 - Water Heater System, Multi Fuel",
    "femaCode": "LD-0113.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-13",
    "categoryId": "cat-1",
    "name": "Sink, gang, 2 basin",
    "description": "LD-0114.00 - Sink, gang, 2 basin",
    "femaCode": "LD-0114.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-14",
    "categoryId": "cat-1",
    "name": "Pump, Primary distribution",
    "description": "LD-0115.00 - Pump, Primary distribution",
    "femaCode": "LD-0115.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-15",
    "categoryId": "cat-1",
    "name": "Bladder, water, potable, 500 Gallon",
    "description": "LD-0116.00 - Bladder, water, potable, 500 Gallon",
    "femaCode": "LD-0116.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-16",
    "categoryId": "cat-1",
    "name": "Bladder, water, gray, 500 Gallon",
    "description": "LD-0117.00 - Bladder, water, gray, 500 Gallon",
    "femaCode": "LD-0117.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-17",
    "categoryId": "cat-1",
    "name": "Purification System, Water,  w/spare parts",
    "description": "LD-0118.00 - Purification System, Water,  w/spare parts",
    "femaCode": "LD-0118.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-18",
    "categoryId": "cat-1",
    "name": "Support kit, Potable and standard water distribution, in 64\u201d X 20\u201d X 22\u201d Aluminum field case.",
    "description": "LD-0120.00 - Support kit, Potable and standard water distribution, in 64\u201d X 20\u201d X 22\u201d Aluminum field case.",
    "femaCode": "LD-0120.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-19",
    "categoryId": "cat-1",
    "name": "Support Kit, Gray water distribution, in 28\u201d X 34\u201d X 21\u201d Aluminum field case.",
    "description": "LD-0121.00 - Support Kit, Gray water distribution, in 28\u201d X 34\u201d X 21\u201d Aluminum field case.",
    "femaCode": "LD-0121.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-20",
    "categoryId": "cat-1",
    "name": "Water test kit",
    "description": "LD-0122.00 - Water test kit",
    "femaCode": "LD-0122.00",
    "femaRequiredQty": 5,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-21",
    "categoryId": "cat-2",
    "name": "Safety",
    "description": "LE-0000.00 - Safety",
    "femaCode": "LE-0000.00",
    "femaRequiredQty": 0,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-22",
    "categoryId": "cat-2",
    "name": "Alarm Device, Audible, personal",
    "description": "LE-0101.00 - Alarm Device, Audible, personal",
    "femaCode": "LE-0101.00",
    "femaRequiredQty": 40,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-23",
    "categoryId": "cat-2",
    "name": "Cartridge / Filter. Respirator, P100",
    "description": "LE-0102.00 - Cartridge / Filter. Respirator, P100",
    "femaCode": "LE-0102.00",
    "femaRequiredQty": 300,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-24",
    "categoryId": "cat-2",
    "name": "Detector, current,  AC voltage detection-type,",
    "description": "LE-0103.00 - Detector, current,  AC voltage detection-type,",
    "femaCode": "LE-0103.00",
    "femaRequiredQty": 14,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-25",
    "categoryId": "cat-2",
    "name": "Ear plugs, safety, disposable, style NRR 24",
    "description": "LE-0104.00 - Ear plugs, safety, disposable, style NRR 24",
    "femaCode": "LE-0104.00",
    "femaRequiredQty": 300,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-26",
    "categoryId": "cat-2",
    "name": "Extinguisher, fire, 10 lb., ABC-type",
    "description": "LE-0105.00 - Extinguisher, fire, 10 lb., ABC-type",
    "femaCode": "LE-0105.00",
    "femaRequiredQty": 12,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-27",
    "categoryId": "cat-2",
    "name": "Glasses, Safety, shatter proof, with side shields and lanyard, for resupply",
    "description": "LE-0106.00 - Glasses, Safety, shatter proof, with side shields and lanyard, for resupply",
    "femaCode": "LE-0106.00",
    "femaRequiredQty": 144,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-28",
    "categoryId": "cat-2",
    "name": "Goggles, safety, shatter proof",
    "description": "LE-0111.00 - Goggles, safety, shatter proof",
    "femaCode": "LE-0111.00",
    "femaRequiredQty": 109,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-29",
    "categoryId": "cat-2",
    "name": "Headsets, hearing protection, muff style, NRR 29dB",
    "description": "LE-0112.00 - Headsets, hearing protection, muff style, NRR 29dB",
    "femaCode": "LE-0112.00",
    "femaRequiredQty": 12,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-30",
    "categoryId": "cat-2",
    "name": "Air horn, with hand pump",
    "description": "LE-0113.00 - Air horn, with hand pump",
    "femaCode": "LE-0113.00",
    "femaRequiredQty": 6,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-31",
    "categoryId": "cat-2",
    "name": "Meter, Weather/Wind",
    "description": "LE-0114.00 - Meter, Weather/Wind",
    "femaCode": "LE-0114.00",
    "femaRequiredQty": 4,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-32",
    "categoryId": "cat-2",
    "name": "Light stick, Cyalume, Yellow, 12-hour duration",
    "description": "LE-0115.01 - Light stick, Cyalume, Yellow, 12-hour duration",
    "femaCode": "LE-0115.01",
    "femaRequiredQty": 500,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-33",
    "categoryId": "cat-2",
    "name": "Light stick, Cyalume, Green, 12-hour duration",
    "description": "LE-0115.02 - Light stick, Cyalume, Green, 12-hour duration",
    "femaCode": "LE-0115.02",
    "femaRequiredQty": 500,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-34",
    "categoryId": "cat-2",
    "name": "Light stick, Cyalume, Red, 12-hour duration",
    "description": "LE-0115.03 - Light stick, Cyalume, Red, 12-hour duration",
    "femaCode": "LE-0115.03",
    "femaRequiredQty": 500,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-35",
    "categoryId": "cat-2",
    "name": "Light stick, Cyalume, Blue, 8-hour duration",
    "description": "LE-0115.04 - Light stick, Cyalume, Blue, 8-hour duration",
    "femaCode": "LE-0115.04",
    "femaRequiredQty": 500,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-36",
    "categoryId": "cat-2",
    "name": "Line, utility, nylon shroud, 3mm x 100 yards, roll",
    "description": "LE-0116.00 - Line, utility, nylon shroud, 3mm x 100 yards, roll",
    "femaCode": "LE-0116.00",
    "femaRequiredQty": 7,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-37",
    "categoryId": "cat-2",
    "name": "Pads, knee, heavy duty, pair, Spare",
    "description": "LE-0119.00 - Pads, knee, heavy duty, pair, Spare",
    "femaCode": "LE-0119.00",
    "femaRequiredQty": 10,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-38",
    "categoryId": "cat-2",
    "name": "Pads, elbow, heavy duty, pair, Spare",
    "description": "LE-0120.00 - Pads, elbow, heavy duty, pair, Spare",
    "femaCode": "LE-0120.00",
    "femaRequiredQty": 10,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-39",
    "categoryId": "cat-2",
    "name": "Paint, spray, fluorescent, Orange",
    "description": "LE-0121.00 - Paint, spray, fluorescent, Orange",
    "femaCode": "LE-0121.00",
    "femaRequiredQty": 60,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-40",
    "categoryId": "cat-2",
    "name": "Paint, spray, fluorescent, Green",
    "description": "LE-0121.01 - Paint, spray, fluorescent, Green",
    "femaCode": "LE-0121.01",
    "femaRequiredQty": 12,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-41",
    "categoryId": "cat-2",
    "name": "Repellent, insect (for clothing), Pyrethrin base, 4 oz. Bottle",
    "description": "LE-0122.00 - Repellent, insect (for clothing), Pyrethrin base, 4 oz. Bottle",
    "femaCode": "LE-0122.00",
    "femaRequiredQty": 84,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-42",
    "categoryId": "cat-2",
    "name": "Repellent, insect, minimum 35% DEET content, towlettes",
    "description": "LE-0123.00 - Repellent, insect, minimum 35% DEET content, towlettes",
    "femaCode": "LE-0123.00",
    "femaRequiredQty": 100,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-43",
    "categoryId": "cat-2",
    "name": "Sunscreen, SPF30, wipes",
    "description": "LE-0126.00 - Sunscreen, SPF30, wipes",
    "femaCode": "LE-0126.00",
    "femaRequiredQty": 300,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-44",
    "categoryId": "cat-2",
    "name": "Tape, barrier, roll",
    "description": "LE-0127.00 - Tape, barrier, roll",
    "femaCode": "LE-0127.00",
    "femaRequiredQty": 16,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-45",
    "categoryId": "cat-2",
    "name": "Gloves, work, leather, sized as needed, pair,  for resupply",
    "description": "LE-0129.00 - Gloves, work, leather, sized as needed, pair,  for resupply",
    "femaCode": "LE-0129.00",
    "femaRequiredQty": 100,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-46",
    "categoryId": "cat-2",
    "name": "Tape, Gaffers, 3\" x 60yds., Black",
    "description": "LE-0130.00 - Tape, Gaffers, 3\" x 60yds., Black",
    "femaCode": "LE-0130.00",
    "femaRequiredQty": 32,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-47",
    "categoryId": "cat-2",
    "name": "Paintstick, Temporary, All-Weather , Orange",
    "description": "LE-0131.00 - Paintstick, Temporary, All-Weather , Orange",
    "femaCode": "LE-0131.00",
    "femaRequiredQty": 60,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-48",
    "categoryId": "cat-2",
    "name": "Paintstick, Temporary, All-Weather , Fluorescent Green",
    "description": "LE-0131.01 - Paintstick, Temporary, All-Weather , Fluorescent Green",
    "femaCode": "LE-0131.01",
    "femaRequiredQty": 12,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-49",
    "categoryId": "cat-3",
    "name": "Personal Bag",
    "description": "LG-0000.00 - Personal Bag",
    "femaCode": "LG-0000.00",
    "femaRequiredQty": 0,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-50",
    "categoryId": "cat-3",
    "name": "Ball cap, navy blue w/ Task Force Logo",
    "description": "LG-0101.00 - Ball cap, navy blue w/ Task Force Logo",
    "femaCode": "LG-0101.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-51",
    "categoryId": "cat-3",
    "name": "Hat, wide brim, (boonie style)",
    "description": "LG-0101.01 - Hat, wide brim, (boonie style)",
    "femaCode": "LG-0101.01",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-52",
    "categoryId": "cat-3",
    "name": "Boots, Safety, Black, Gore-Tex,  ASTM/NFPA compliant or equivalent, pair",
    "description": "LG-0102.00 - Boots, Safety, Black, Gore-Tex,  ASTM/NFPA compliant or equivalent, pair",
    "femaCode": "LG-0102.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-53",
    "categoryId": "cat-3",
    "name": "Flashlight, battery powered, intrinsically safe, UL rated, w/ spare bulbs",
    "description": "LG-0103.00 - Flashlight, battery powered, intrinsically safe, UL rated, w/ spare bulbs",
    "femaCode": "LG-0103.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-54",
    "categoryId": "cat-3",
    "name": "Ear plugs, safety, disposable, style NRR 24",
    "description": "LG-0104.00 - Ear plugs, safety, disposable, style NRR 24",
    "femaCode": "LG-0104.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-55",
    "categoryId": "cat-3",
    "name": "Helmet, rescue-type, low profile, ASTM/NFPA compliant or equivalent",
    "description": "LG-0105.00 - Helmet, rescue-type, low profile, ASTM/NFPA compliant or equivalent",
    "femaCode": "LG-0105.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-56",
    "categoryId": "cat-3",
    "name": "Light, Helmet, battery powered, Intrinsically safe w/ spare bulbs",
    "description": "LG-0106.00 - Light, Helmet, battery powered, Intrinsically safe w/ spare bulbs",
    "femaCode": "LG-0106.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-57",
    "categoryId": "cat-3",
    "name": "Knife, combination, folding",
    "description": "LG-0107.00 - Knife, combination, folding",
    "femaCode": "LG-0107.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-58",
    "categoryId": "cat-3",
    "name": "Gloves, work, leather, sized as needed",
    "description": "LG-0108.00 - Gloves, work, leather, sized as needed",
    "femaCode": "LG-0108.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-59",
    "categoryId": "cat-3",
    "name": "Rain gear, set",
    "description": "LG-0110.00 - Rain gear, set",
    "femaCode": "LG-0110.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-60",
    "categoryId": "cat-3",
    "name": "Glasses, Safety, shatter proof, with side shields and lanyard, Z87",
    "description": "LG-0111.00 - Glasses, Safety, shatter proof, with side shields and lanyard, Z87",
    "femaCode": "LG-0111.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-61",
    "categoryId": "cat-3",
    "name": "Uniform, Pants BDU/ACU Style, Navy Blue",
    "description": "LG-0112.00 - Uniform, Pants BDU/ACU Style, Navy Blue",
    "femaCode": "LG-0112.00",
    "femaRequiredQty": 6,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-62",
    "categoryId": "cat-3",
    "name": "Overshirt or Blouse, BDU/ACU Style, Navy Blue",
    "description": "LG-0112.01 - Overshirt or Blouse, BDU/ACU Style, Navy Blue",
    "femaCode": "LG-0112.01",
    "femaRequiredQty": 4,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-63",
    "categoryId": "cat-3",
    "name": "Uniform, Jumpsuits or two piece, Nomex IIIA, set",
    "description": "LG-0113.01 - Uniform, Jumpsuits or two piece, Nomex IIIA, set",
    "femaCode": "LG-0113.01",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-64",
    "categoryId": "cat-3",
    "name": "Uniform jacket, w/ optional liner, Navy Blue",
    "description": "LG-0114.00 - Uniform jacket, w/ optional liner, Navy Blue",
    "femaCode": "LG-0114.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-65",
    "categoryId": "cat-3",
    "name": "Pads, knee, heavy duty, pair",
    "description": "LG-0115.00 - Pads, knee, heavy duty, pair",
    "femaCode": "LG-0115.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-66",
    "categoryId": "cat-3",
    "name": "Pads, elbow, heavy duty, pair",
    "description": "LG-0115.01 - Pads, elbow, heavy duty, pair",
    "femaCode": "LG-0115.01",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-67",
    "categoryId": "cat-3",
    "name": "Durable face / neck covering",
    "description": "LG-0116.00 - Durable face / neck covering",
    "femaCode": "LG-0116.00",
    "femaRequiredQty": 3,
    "parLevel": 0,
    "isConsumable": true,
    "isActive": true
  },
  {
    "id": "it-68",
    "categoryId": "cat-3",
    "name": "Pack, Field,  personal, system",
    "description": "LG-0117.00 - Pack, Field,  personal, system",
    "femaCode": "LG-0117.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-69",
    "categoryId": "cat-3",
    "name": "Bag(s), Gear, personal equipment (as required to outfit each task force member)",
    "description": "LG-0118.00 - Bag(s), Gear, personal equipment (as required to outfit each task force member)",
    "femaCode": "LG-0118.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-70",
    "categoryId": "cat-3",
    "name": "Shorts, uniform, BDU Style, Navy Blue",
    "description": "LG-0120.00 - Shorts, uniform, BDU Style, Navy Blue",
    "femaCode": "LG-0120.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-71",
    "categoryId": "cat-3",
    "name": "Sweatshirt, Heavyweight",
    "description": "LG-0121.00 - Sweatshirt, Heavyweight",
    "femaCode": "LG-0121.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-72",
    "categoryId": "cat-3",
    "name": "Cold weather system, including jacket, pants, fleece or fiberpile liners, socks, gator, gloves, knit",
    "description": "LG-0122.00 - Cold weather system, including jacket, pants, fleece or fiberpile liners, socks, gator, gloves, knit cap, neoprene mask, expedition long underwear, and safety boot (ECWCS or equivalent) (+40 deg F to",
    "femaCode": "LG-0122.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-73",
    "categoryId": "cat-3",
    "name": "T-shirt, with team logos, Long and/or Short sleeve, including tactical style long sleeve",
    "description": "LG-0125.00 - T-shirt, with team logos, Long and/or Short sleeve, including tactical style long sleeve",
    "femaCode": "LG-0125.00",
    "femaRequiredQty": 6,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-74",
    "categoryId": "cat-3",
    "name": "Respirator, half face piece, cartridge-type",
    "description": "LG-0127.00 - Respirator, half face piece, cartridge-type",
    "femaCode": "LG-0127.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-75",
    "categoryId": "cat-3",
    "name": "Guide, Field Operations, FEMA, US&R",
    "description": "LG-0129.00 - Guide, Field Operations, FEMA, US&R",
    "femaCode": "LG-0129.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-76",
    "categoryId": "cat-3",
    "name": "Hood, fire retardant",
    "description": "LG-0133.00 - Hood, fire retardant",
    "femaCode": "LG-0133.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-77",
    "categoryId": "cat-3",
    "name": "Boots, Light tactical, Tan, Mid or Three Quarter height minimum (MUST COVER ANKLE) Waterproof and Br",
    "description": "LG-0134.00 - Boots, Light tactical, Tan, Mid or Three Quarter height minimum (MUST COVER ANKLE) Waterproof and Breathable (FOR WIDE AREA SEACH)",
    "femaCode": "LG-0134.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-78",
    "categoryId": "cat-3",
    "name": "Boardshort, Navy Blue",
    "description": "LG-0135.00 - Boardshort, Navy Blue",
    "femaCode": "LG-0135.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-79",
    "categoryId": "cat-3",
    "name": "Bag, Sleeping, general purpose, rated to 0 degrees, synthetic, with stuff sack",
    "description": "LG-0136.00 - Bag, Sleeping, general purpose, rated to 0 degrees, synthetic, with stuff sack",
    "femaCode": "LG-0136.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-80",
    "categoryId": "cat-3",
    "name": "Belt, Uniform (Optional Purchase)",
    "description": "LG-0137.00 - Belt, Uniform (Optional Purchase)",
    "femaCode": "LG-0137.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-81",
    "categoryId": "cat-4",
    "name": "Personal Protective Equipment",
    "description": "HD-0000.00 - Personal Protective Equipment",
    "femaCode": "HD-0000.00",
    "femaRequiredQty": 0,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-82",
    "categoryId": "cat-4",
    "name": "Glove, Butyl, Guardian CP 14F or equivalent, 14 Mil, 14\", sizes to be determined by task forces",
    "description": "HD-0110.00 - Glove, Butyl, Guardian CP 14F or equivalent, 14 Mil, 14\", sizes to be determined by task forces",
    "femaCode": "HD-0110.00",
    "femaRequiredQty": 133,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-83",
    "categoryId": "cat-4",
    "name": "Glove, Light Cotton, Inner, un-hemmed, sizes to be determined by task forces",
    "description": "HD-0113.00 - Glove, Light Cotton, Inner, un-hemmed, sizes to be determined by task forces",
    "femaCode": "HD-0113.00",
    "femaRequiredQty": 11,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-84",
    "categoryId": "cat-4",
    "name": "Glove, Leather, Size to be determined by task forces",
    "description": "HD-0116.00 - Glove, Leather, Size to be determined by task forces",
    "femaCode": "HD-0116.00",
    "femaRequiredQty": 72,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-85",
    "categoryId": "cat-4",
    "name": "Glove, Nitrile, Ultimate N-DEX, exam, puncture resistant, 50 box, 11\", 5 mil, powder free, Size to b",
    "description": "HD-0119.00 - Glove, Nitrile, Ultimate N-DEX, exam, puncture resistant, 50 box, 11\", 5 mil, powder free, Size to be determined by task forces",
    "femaCode": "HD-0119.00",
    "femaRequiredQty": 3,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-86",
    "categoryId": "cat-4",
    "name": "Boot, CBRN Lightweight Overboot, (sizes LG, XLG, 2XLG)",
    "description": "HD-0122.00 - Boot, CBRN Lightweight Overboot, (sizes LG, XLG, 2XLG)",
    "femaCode": "HD-0122.00",
    "femaRequiredQty": 45,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-87",
    "categoryId": "cat-4",
    "name": "Boot, CBRN (sizes per Task Force)",
    "description": "HD-0123.00 - Boot, CBRN (sizes per Task Force)",
    "femaCode": "HD-0123.00",
    "femaRequiredQty": 45,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-88",
    "categoryId": "cat-4",
    "name": "Coverall,  100% Cotton, Navy, sizes determined by task forces",
    "description": "HD-0126.00 - Coverall,  100% Cotton, Navy, sizes determined by task forces",
    "femaCode": "HD-0126.00",
    "femaRequiredQty": 120,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-89",
    "categoryId": "cat-4",
    "name": "SCBA, Scott Air Pak X3-21",
    "description": "HD-0129.00 - SCBA, Scott Air Pak X3-21",
    "femaCode": "HD-0129.00",
    "femaRequiredQty": 24,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-90",
    "categoryId": "cat-4",
    "name": "Cylinder, 60 minute, Carbon, Spare 4500 PSI, Scott Air Pak Fifty",
    "description": "HD-0131.00 - Cylinder, 60 minute, Carbon, Spare 4500 PSI, Scott Air Pak Fifty",
    "femaCode": "HD-0131.00",
    "femaRequiredQty": 46,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-91",
    "categoryId": "cat-4",
    "name": "PAPR, Scott C420 Plus with 36\" hose",
    "description": "HD-0132.00 - PAPR, Scott C420 Plus with 36\" hose",
    "femaCode": "HD-0132.00",
    "femaRequiredQty": 45,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-92",
    "categoryId": "cat-4",
    "name": "Battery Pack Assembly, PAPR, Disposable, 10 hour capacity, with 10 year Shelf Life",
    "description": "HD-0134.00 - Battery Pack Assembly, PAPR, Disposable, 10 hour capacity, with 10 year Shelf Life",
    "femaCode": "HD-0134.00",
    "femaRequiredQty": 100,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-93",
    "categoryId": "cat-4",
    "name": "Cartridge, CBRN CAP 1 Canister",
    "description": "HD-0138.00 - Cartridge, CBRN CAP 1 Canister",
    "femaCode": "HD-0138.00",
    "femaRequiredQty": 212,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-94",
    "categoryId": "cat-4",
    "name": "Fit Tester, PortaCount Plus Respirator (purchase minimum of 1 and Optional Purchase to a maximum of ",
    "description": "HD-0144.00 - Fit Tester, PortaCount Plus Respirator (purchase minimum of 1 and Optional Purchase to a maximum of 3)",
    "femaCode": "HD-0144.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-95",
    "categoryId": "cat-4",
    "name": "Adapter, Fit Tester, Cartridge, for AV3000 Face piece, (1/4 turn adapter)(AV-632) package of 5",
    "description": "HD-0145.00 - Adapter, Fit Tester, Cartridge, for AV3000 Face piece, (1/4 turn adapter)(AV-632) package of 5",
    "femaCode": "HD-0145.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-96",
    "categoryId": "cat-4",
    "name": "Adapter, Fit Tester, Quantitative Fit Test 601 (full face piece)",
    "description": "HD-0145.01 - Adapter, Fit Tester, Quantitative Fit Test 601 (full face piece)",
    "femaCode": "HD-0145.01",
    "femaRequiredQty": 3,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-97",
    "categoryId": "cat-4",
    "name": "Filter, Fit Tester, Respirator, P100, (for porta count) 30/case",
    "description": "HD-0146.00 - Filter, Fit Tester, Respirator, P100, (for porta count) 30/case",
    "femaCode": "HD-0146.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-98",
    "categoryId": "cat-4",
    "name": "Face Piece, AV3000 Sure Seal w/Kevlar Head Harness, sizes determined by task forces",
    "description": "HD-0147.00 - Face Piece, AV3000 Sure Seal w/Kevlar Head Harness, sizes determined by task forces",
    "femaCode": "HD-0147.00",
    "femaRequiredQty": 210,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-99",
    "categoryId": "cat-4",
    "name": "Adapter, Cartridge, for AV3000 Face piece, (1/4 turn adapter)(AV-632) package of 5",
    "description": "HD-0148.00 - Adapter, Cartridge, for AV3000 Face piece, (1/4 turn adapter)(AV-632) package of 5",
    "femaCode": "HD-0148.00",
    "femaRequiredQty": 210,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-100",
    "categoryId": "cat-4",
    "name": "Carrier, Scott Facepiece/APR, for AV3000 Sure Seal face piece",
    "description": "HD-0149.01 - Carrier, Scott Facepiece/APR, for AV3000 Sure Seal face piece",
    "femaCode": "HD-0149.01",
    "femaRequiredQty": 210,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-101",
    "categoryId": "cat-4",
    "name": "Boot covers, disposable (latex, silver shields or equivalent), pair",
    "description": "HD-0150.00 - Boot covers, disposable (latex, silver shields or equivalent), pair",
    "femaCode": "HD-0150.00",
    "femaRequiredQty": 48,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-102",
    "categoryId": "cat-4",
    "name": "Coveralls, plain (Tyvek, Saranex or equivalent)",
    "description": "HD-0151.00 - Coveralls, plain (Tyvek, Saranex or equivalent)",
    "femaCode": "HD-0151.00",
    "femaRequiredQty": 288,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-103",
    "categoryId": "cat-4",
    "name": "Gloves, disposable (Ambi Tru-Touch or equivalent)",
    "description": "HD-0154.00 - Gloves, disposable (Ambi Tru-Touch or equivalent)",
    "femaCode": "HD-0154.00",
    "femaRequiredQty": 12,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-104",
    "categoryId": "cat-4",
    "name": "Tactical Rescue Suit; Fire Service version Garment and Gloves, offering protection to multiple hazar",
    "description": "HD-0162.00 - Tactical Rescue Suit; Fire Service version Garment and Gloves, offering protection to multiple hazards. Designed and certified to meet NFPA 1994 level 2 and NFPA 1992, this garment is constructed usin",
    "femaCode": "HD-0162.00",
    "femaRequiredQty": 14,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-105",
    "categoryId": "cat-4",
    "name": "Training Garment,  Tactical Rescue Suit. Scenario simulation purpose, not chemical or flame resistan",
    "description": "HD-0163.00 - Training Garment,  Tactical Rescue Suit. Scenario simulation purpose, not chemical or flame resistant, NOT NFPA COMPLIANT, using 1000 denier urethane coated with attached 600 denier cordura booties, w",
    "femaCode": "HD-0163.00",
    "femaRequiredQty": 30,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-106",
    "categoryId": "cat-4",
    "name": "Bag, Equipment, Tactix Multi-Compartment, Cordura, Black.",
    "description": "HD-0164.00 - Bag, Equipment, Tactix Multi-Compartment, Cordura, Black.",
    "femaCode": "HD-0164.00",
    "femaRequiredQty": 30,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-107",
    "categoryId": "cat-4",
    "name": "Adapter, 40mm, CBRN for AV3000 Sure Seal face piece",
    "description": "HD-0166.00 - Adapter, 40mm, CBRN for AV3000 Sure Seal face piece",
    "femaCode": "HD-0166.00",
    "femaRequiredQty": 210,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-108",
    "categoryId": "cat-4",
    "name": "Mask, N95, NIOSH Approved, w/o relief valve",
    "description": "HD-0169.00 - Mask, N95, NIOSH Approved, w/o relief valve",
    "femaCode": "HD-0169.00",
    "femaRequiredQty": 950,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-109",
    "categoryId": "cat-4",
    "name": "Cartridge / Filter, Respirator, P100 Multi Gas / Vapor (30 pairs per case)",
    "description": "HD-0170.00 - Cartridge / Filter, Respirator, P100 Multi Gas / Vapor (30 pairs per case)",
    "femaCode": "HD-0170.00",
    "femaRequiredQty": 10,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-110",
    "categoryId": "cat-4",
    "name": "Suit, NFPA 1994, Class 3; NFPA 1992; Non-IDLH atmosphere one piece front entry coverall with integra",
    "description": "HD-0171.00 - Suit, NFPA 1994, Class 3; NFPA 1992; Non-IDLH atmosphere one piece front entry coverall with integrated gloves and booties, a liquid and vapor resistant zipper and storm fly, and an integrated hood wi",
    "femaCode": "HD-0171.00",
    "femaRequiredQty": 30,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-111",
    "categoryId": "cat-5",
    "name": "Personal Protective Equiment",
    "description": "WA-0000.00 - Personal Protective Equiment",
    "femaCode": "WA-0000.00",
    "femaRequiredQty": 0,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-112",
    "categoryId": "cat-5",
    "name": "Helmet, water, adjustable ratchet headband, Rescuer (34 Minimum. UP TO 80)",
    "description": "WA-0101.00 - Helmet, water, adjustable ratchet headband, Rescuer (34 Minimum. UP TO 80)",
    "femaCode": "WA-0101.00",
    "femaRequiredQty": 80,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-113",
    "categoryId": "cat-5",
    "name": "PFD, Floatation Device, Personal, Extrasport Universal Rescue, Integrated US Coast Guard approved qu",
    "description": "WA-0105.00 - PFD, Floatation Device, Personal, Extrasport Universal Rescue, Integrated US Coast Guard approved quick-release buckle and rescuer's harness.  Size: Universal Chest Size 30 -56\" Color: Yellow (34 Mini",
    "femaCode": "WA-0105.00",
    "femaRequiredQty": 80,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-114",
    "categoryId": "cat-5",
    "name": "PFD, Floatation Device, Canine, Size: Medium, sturdy haul handle, secure leash D-ring, and high-visi",
    "description": "WA-0106.00 - PFD, Floatation Device, Canine, Size: Medium, sturdy haul handle, secure leash D-ring, and high-visibility reflective tape",
    "femaCode": "WA-0106.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-115",
    "categoryId": "cat-5",
    "name": "PFD, Floatation Device, Canine, Size: Large, sturdy haul handle, secure leash D-ring, and high-visib",
    "description": "WA-0107.00 - PFD, Floatation Device, Canine, Size: Large, sturdy haul handle, secure leash D-ring, and high-visibility reflective tape",
    "femaCode": "WA-0107.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-116",
    "categoryId": "cat-5",
    "name": "PFD, Floatation Device, Canine, Size: Extra Large, sturdy haul handle, secure leash D-ring, and high",
    "description": "WA-0108.00 - PFD, Floatation Device, Canine, Size: Extra Large, sturdy haul handle, secure leash D-ring, and high-visibility reflective tape",
    "femaCode": "WA-0108.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-117",
    "categoryId": "cat-5",
    "name": "Whistle, Safety, Storm, Hi Visibility Orange, Durable plastic safety whistle, w/lanyard and stainles",
    "description": "WA-0109.00 - Whistle, Safety, Storm, Hi Visibility Orange, Durable plastic safety whistle, w/lanyard and stainless spit-ring (34 Minimum. UP TO 80)",
    "femaCode": "WA-0109.00",
    "femaRequiredQty": 80,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-118",
    "categoryId": "cat-5",
    "name": "Light, Strobe, for Personal Flotation Device (34 Minimum. UP TO 80)",
    "description": "WA-0111.00 - Light, Strobe, for Personal Flotation Device (34 Minimum. UP TO 80)",
    "femaCode": "WA-0111.00",
    "femaRequiredQty": 80,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-119",
    "categoryId": "cat-5",
    "name": "Headlamp, Petzl Duo LED , UL Class I; Div. 1; SECTION D T3, Class I; Div. 2; SECTIONs A, B, C, D, T3",
    "description": "WA-0112.00 - Headlamp, Petzl Duo LED , UL Class I; Div. 1; SECTION D T3, Class I; Div. 2; SECTIONs A, B, C, D, T3. Class II; Div. 2; SECTIONs F, G, T3 (34 Minimum. UP TO 80)",
    "femaCode": "WA-0112.00",
    "femaRequiredQty": 80,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-120",
    "categoryId": "cat-5",
    "name": "Pouch, Headlamp, Myo/Duo  (34 Minimum. UP TO 80)",
    "description": "WA-0113.00 - Pouch, Headlamp, Myo/Duo  (34 Minimum. UP TO 80)",
    "femaCode": "WA-0113.00",
    "femaRequiredQty": 80,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-121",
    "categoryId": "cat-5",
    "name": "Knife, with sheath.  Blade length:3\",  Handle: 3.75\".  Weight: 4 oz.  Color: High Visibility Orange ",
    "description": "WA-0114.00 - Knife, with sheath.  Blade length:3\",  Handle: 3.75\".  Weight: 4 oz.  Color: High Visibility Orange (34 Minimum. UP TO 80)",
    "femaCode": "WA-0114.00",
    "femaRequiredQty": 80,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-122",
    "categoryId": "cat-5",
    "name": "Throw Rope, Guardian Raft Rescue , with waist harness and throw bag. Rope Length: 55' (34 Minimum. U",
    "description": "WA-0115.00 - Throw Rope, Guardian Raft Rescue , with waist harness and throw bag. Rope Length: 55' (34 Minimum. UP TO 80)",
    "femaCode": "WA-0115.00",
    "femaRequiredQty": 80,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-123",
    "categoryId": "cat-5",
    "name": "Bag, Waterproof, Large, For Handheld Radios, w/Lanyard (34 Minimum. UP TO 80)",
    "description": "WA-0116.00 - Bag, Waterproof, Large, For Handheld Radios, w/Lanyard (34 Minimum. UP TO 80)",
    "femaCode": "WA-0116.00",
    "femaRequiredQty": 80,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-124",
    "categoryId": "cat-5",
    "name": "Bag, Duffel, Mesh, CMC Rescue, Yellow Mesh, 1000 Denier Cordura nylon. W/Full-size zippered pocket o",
    "description": "WA-0117.00 - Bag, Duffel, Mesh, CMC Rescue, Yellow Mesh, 1000 Denier Cordura nylon. W/Full-size zippered pocket on one end (34 Minimum. UP TO 80)",
    "femaCode": "WA-0117.00",
    "femaRequiredQty": 80,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-125",
    "categoryId": "cat-5",
    "name": "Float Marker Recovery System, Integral marker float w/ 100-foot tether line and quick-release anchor",
    "description": "WA-0118.00 - Float Marker Recovery System, Integral marker float w/ 100-foot tether line and quick-release anchor, Bright Yellow",
    "femaCode": "WA-0118.00",
    "femaRequiredQty": 6,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-126",
    "categoryId": "cat-5",
    "name": "LSP Cinch Rescue Collar",
    "description": "WA-0119.00 - LSP Cinch Rescue Collar",
    "femaCode": "WA-0119.00",
    "femaRequiredQty": 3,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-127",
    "categoryId": "cat-5",
    "name": "Buoy, Ring,  USCG approved, urethane foam core,Oil/Gas Resistant, Color: International Orange.  Diam",
    "description": "WA-0120.00 - Buoy, Ring,  USCG approved, urethane foam core,Oil/Gas Resistant, Color: International Orange.  Diameter: 24\"",
    "femaCode": "WA-0120.00",
    "femaRequiredQty": 3,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-128",
    "categoryId": "cat-5",
    "name": "PFD, (manual activation), Deluxe Inflatable, USCG approved type V personal flotation device",
    "description": "WA-0123.00 - PFD, (manual activation), Deluxe Inflatable, USCG approved type V personal flotation device",
    "femaCode": "WA-0123.00",
    "femaRequiredQty": 48,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-129",
    "categoryId": "cat-5",
    "name": "Re-Arm Kit, Mustang Survival Manual Inflatable PFDs",
    "description": "WA-0123.01 - Re-Arm Kit, Mustang Survival Manual Inflatable PFDs",
    "femaCode": "WA-0123.01",
    "femaRequiredQty": 48,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-130",
    "categoryId": "cat-5",
    "name": "Dry Suit, Reinforced Knees and Elbows, Field Repairable (30 Minimum. UP TO 80)",
    "description": "WA-0124.00 - Dry Suit, Reinforced Knees and Elbows, Field Repairable (30 Minimum. UP TO 80)",
    "femaCode": "WA-0124.00",
    "femaRequiredQty": 80,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-131",
    "categoryId": "cat-5",
    "name": "Liner, For Dry Suit (30 Minimum. UP TO 80)",
    "description": "WA-0124.01 - Liner, For Dry Suit (30 Minimum. UP TO 80)",
    "femaCode": "WA-0124.01",
    "femaRequiredQty": 80,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-132",
    "categoryId": "cat-5",
    "name": "Drysuit Repair Kit",
    "description": "WA-0124.02 - Drysuit Repair Kit",
    "femaCode": "WA-0124.02",
    "femaRequiredQty": 6,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-133",
    "categoryId": "cat-5",
    "name": "Fins, (Pair), Various Sizes (30 Minimum. UP TO 80)",
    "description": "WA-0125.00 - Fins, (Pair), Various Sizes (30 Minimum. UP TO 80)",
    "femaCode": "WA-0125.00",
    "femaRequiredQty": 80,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-134",
    "categoryId": "cat-5",
    "name": "Gloves (Water) 3.5 to 5 mil (30 Minimum. UP TO 80)",
    "description": "WA-0126.00 - Gloves (Water) 3.5 to 5 mil (30 Minimum. UP TO 80)",
    "femaCode": "WA-0126.00",
    "femaRequiredQty": 80,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-135",
    "categoryId": "cat-5",
    "name": "Water Rescue Boots, Various Sizes (30 Minimum. UP TO 80)",
    "description": "WA-0127.00 - Water Rescue Boots, Various Sizes (30 Minimum. UP TO 80)",
    "femaCode": "WA-0127.00",
    "femaRequiredQty": 30,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-136",
    "categoryId": "cat-5",
    "name": "Steel Shank Insert for Boots, Various Sizes (30 Minimum. UP TO 80)",
    "description": "WA-0128.00 - Steel Shank Insert for Boots, Various Sizes (30 Minimum. UP TO 80)",
    "femaCode": "WA-0128.00",
    "femaRequiredQty": 30,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-137",
    "categoryId": "cat-5",
    "name": "PFD, Victim. Type II, Sizes Adult.Youth, Child, Infant",
    "description": "WA-0129.00 - PFD, Victim. Type II, Sizes Adult.Youth, Child, Infant",
    "femaCode": "WA-0129.00",
    "femaRequiredQty": 32,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-138",
    "categoryId": "cat-5",
    "name": "Waders, Hip or Chest, w/Boots or Neoprene Socks & suspenders",
    "description": "WA-0130.00 - Waders, Hip or Chest, w/Boots or Neoprene Socks & suspenders",
    "femaCode": "WA-0130.00",
    "femaRequiredQty": 20,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-139",
    "categoryId": "cat-5",
    "name": "Personal Gear Bag - Mesh, for Dry Suits (30 Minimum. UP TO 80)",
    "description": "WA-0131.00 - Personal Gear Bag - Mesh, for Dry Suits (30 Minimum. UP TO 80)",
    "femaCode": "WA-0131.00",
    "femaRequiredQty": 80,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-140",
    "categoryId": "cat-5",
    "name": "White light sticks, 15 inch",
    "description": "WA-0132.00 - White light sticks, 15 inch",
    "femaCode": "WA-0132.00",
    "femaRequiredQty": 200,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-141",
    "categoryId": "cat-6",
    "name": "Patient Assessment / General Care",
    "description": "MN-0000.00 - Patient Assessment / General Care",
    "femaCode": "MN-0000.00",
    "femaRequiredQty": 0,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-142",
    "categoryId": "cat-6",
    "name": "Blankets, Mylar Space or equivalent",
    "description": "MN-0102.00 - Blankets, Mylar Space or equivalent",
    "femaCode": "MN-0102.00",
    "femaRequiredQty": 50,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-143",
    "categoryId": "cat-6",
    "name": "BP Cuff, pediatric (Semi-Disposable)",
    "description": "MN-0103.00 - BP Cuff, pediatric (Semi-Disposable)",
    "femaCode": "MN-0103.00",
    "femaRequiredQty": 7,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-144",
    "categoryId": "cat-6",
    "name": "BP Manometers",
    "description": "MN-0104.00 - BP Manometers",
    "femaCode": "MN-0104.00",
    "femaRequiredQty": 10,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-145",
    "categoryId": "cat-6",
    "name": "BP Cuff, adult (Semi-Disposable)",
    "description": "MN-0105.00 - BP Cuff, adult (Semi-Disposable)",
    "femaCode": "MN-0105.00",
    "femaRequiredQty": 10,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-146",
    "categoryId": "cat-6",
    "name": "BP Cuff, obese/thigh with Manometers",
    "description": "MN-0106.00 - BP Cuff, obese/thigh with Manometers",
    "femaCode": "MN-0106.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-147",
    "categoryId": "cat-6",
    "name": "Swabs, cotton, sterile, long, wrapped pairs",
    "description": "MN-0107.00 - Swabs, cotton, sterile, long, wrapped pairs",
    "femaCode": "MN-0107.00",
    "femaRequiredQty": 50,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-148",
    "categoryId": "cat-6",
    "name": "Electrodes, Cardiac Monitor, disposable, 4/pkg, 10 pkg/bx",
    "description": "MN-0109.00 - Electrodes, Cardiac Monitor, disposable, 4/pkg, 10 pkg/bx",
    "femaCode": "MN-0109.00",
    "femaRequiredQty": 50,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-149",
    "categoryId": "cat-6",
    "name": "Form, Patient Encounter",
    "description": "MN-0110.00 - Form, Patient Encounter",
    "femaCode": "MN-0110.00",
    "femaRequiredQty": 100,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-150",
    "categoryId": "cat-6",
    "name": "Catheter, Foley, Prep Trays and Collection Bags (16 French)",
    "description": "MN-0112.00 - Catheter, Foley, Prep Trays and Collection Bags (16 French)",
    "femaCode": "MN-0112.00",
    "femaRequiredQty": 4,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-151",
    "categoryId": "cat-6",
    "name": "Jelly, Lubricant, single use packets",
    "description": "MN-0115.00 - Jelly, Lubricant, single use packets",
    "femaCode": "MN-0115.00",
    "femaRequiredQty": 50,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-152",
    "categoryId": "cat-6",
    "name": "Tubes, NG, Adult, 18 French",
    "description": "MN-0117.00 - Tubes, NG, Adult, 18 French",
    "femaCode": "MN-0117.00",
    "femaRequiredQty": 4,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-153",
    "categoryId": "cat-6",
    "name": "Tubes, NG, Pediatric, 8 French",
    "description": "MN-0118.00 - Tubes, NG, Pediatric, 8 French",
    "femaCode": "MN-0118.00",
    "femaRequiredQty": 4,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-154",
    "categoryId": "cat-6",
    "name": "Scissors, Trauma Dressing, disposable, pair",
    "description": "MN-0120.00 - Scissors, Trauma Dressing, disposable, pair",
    "femaCode": "MN-0120.00",
    "femaRequiredQty": 18,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-155",
    "categoryId": "cat-6",
    "name": "Stethoscopes",
    "description": "MN-0121.00 - Stethoscopes",
    "femaCode": "MN-0121.00",
    "femaRequiredQty": 10,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-156",
    "categoryId": "cat-6",
    "name": "Syringe, Irrigation Tip, 60cc",
    "description": "MN-0122.00 - Syringe, Irrigation Tip, 60cc",
    "femaCode": "MN-0122.00",
    "femaRequiredQty": 20,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-157",
    "categoryId": "cat-6",
    "name": "Thermometers, oral, electronic",
    "description": "MN-0123.00 - Thermometers, oral, electronic",
    "femaCode": "MN-0123.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-158",
    "categoryId": "cat-6",
    "name": "Tongue Depressors, sterile, individually wrapped, box",
    "description": "MN-0125.00 - Tongue Depressors, sterile, individually wrapped, box",
    "femaCode": "MN-0125.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-159",
    "categoryId": "cat-6",
    "name": "Triage Tags (Dept. of Transportation-type) 50/pkg",
    "description": "MN-0126.00 - Triage Tags (Dept. of Transportation-type) 50/pkg",
    "femaCode": "MN-0126.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-160",
    "categoryId": "cat-6",
    "name": "Urine Multi-stix (or equivalent), 100 Strips/Pkg",
    "description": "MN-0127.00 - Urine Multi-stix (or equivalent), 100 Strips/Pkg",
    "femaCode": "MN-0127.00",
    "femaRequiredQty": 100,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-161",
    "categoryId": "cat-6",
    "name": "Urinal",
    "description": "MN-0128.00 - Urinal",
    "femaCode": "MN-0128.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-162",
    "categoryId": "cat-6",
    "name": "Bed Pan, Fracture",
    "description": "MN-0129.00 - Bed Pan, Fracture",
    "femaCode": "MN-0129.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-163",
    "categoryId": "cat-6",
    "name": "Cot, Patient, Surgical Medical, Waist Level",
    "description": "MN-0130.00 - Cot, Patient, Surgical Medical, Waist Level",
    "femaCode": "MN-0130.00",
    "femaRequiredQty": 4,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-164",
    "categoryId": "cat-6",
    "name": "Ice Packs, Gel, 6 x 9 Reusable",
    "description": "MN-0131.00 - Ice Packs, Gel, 6 x 9 Reusable",
    "femaCode": "MN-0131.00",
    "femaRequiredQty": 10,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-165",
    "categoryId": "cat-6",
    "name": "Tube, Chest, 10 FR",
    "description": "MN-0132.00 - Tube, Chest, 10 FR",
    "femaCode": "MN-0132.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-166",
    "categoryId": "cat-6",
    "name": "Tube, Chest, 36 FR",
    "description": "MN-0134.00 - Tube, Chest, 36 FR",
    "femaCode": "MN-0134.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-167",
    "categoryId": "cat-6",
    "name": "Tube, Chest, 20 FR",
    "description": "MN-0135.00 - Tube, Chest, 20 FR",
    "femaCode": "MN-0135.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-168",
    "categoryId": "cat-6",
    "name": "Tube,  Chest, 32 FR",
    "description": "MN-0136.00 - Tube,  Chest, 32 FR",
    "femaCode": "MN-0136.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-169",
    "categoryId": "cat-6",
    "name": "Fan, Room (for treating heat illness), large",
    "description": "MN-0138.00 - Fan, Room (for treating heat illness), large",
    "femaCode": "MN-0138.00",
    "femaRequiredQty": 4,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-170",
    "categoryId": "cat-6",
    "name": "Heimlich Valves or equivalent",
    "description": "MN-0139.00 - Heimlich Valves or equivalent",
    "femaCode": "MN-0139.00",
    "femaRequiredQty": 12,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-171",
    "categoryId": "cat-6",
    "name": "Obstetrics Kit, disposable with ear bulb syringe",
    "description": "MN-0143.00 - Obstetrics Kit, disposable with ear bulb syringe",
    "femaCode": "MN-0143.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-172",
    "categoryId": "cat-6",
    "name": "Pleurevac Chambers or equivalent",
    "description": "MN-0145.00 - Pleurevac Chambers or equivalent",
    "femaCode": "MN-0145.00",
    "femaRequiredQty": 4,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-173",
    "categoryId": "cat-6",
    "name": "Tissues, Facial, (pocket packs)",
    "description": "MN-0146.00 - Tissues, Facial, (pocket packs)",
    "femaCode": "MN-0146.00",
    "femaRequiredQty": 50,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-174",
    "categoryId": "cat-6",
    "name": "Bottles, Spray or Misting",
    "description": "MN-0147.00 - Bottles, Spray or Misting",
    "femaCode": "MN-0147.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-175",
    "categoryId": "cat-6",
    "name": "Corpsman, Kit, Field, ENT, Basic  or equivalent",
    "description": "MN-0150.00 - Corpsman, Kit, Field, ENT, Basic  or equivalent",
    "femaCode": "MN-0150.00",
    "femaRequiredQty": 4,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-176",
    "categoryId": "cat-6",
    "name": "Corpsman, Kit, Field, Deluxe, ENT",
    "description": "MN-0151.00 - Corpsman, Kit, Field, Deluxe, ENT",
    "femaCode": "MN-0151.00",
    "femaRequiredQty": 2,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-177",
    "categoryId": "cat-6",
    "name": "Glucometer",
    "description": "MN-0152.00 - Glucometer",
    "femaCode": "MN-0152.00",
    "femaRequiredQty": 7,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-178",
    "categoryId": "cat-6",
    "name": "Glucometer, patient test strips",
    "description": "MN-0153.00 - Glucometer, patient test strips",
    "femaCode": "MN-0153.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-179",
    "categoryId": "cat-6",
    "name": "Glucometer, QA solution",
    "description": "MN-0154.00 - Glucometer, QA solution",
    "femaCode": "MN-0154.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-180",
    "categoryId": "cat-6",
    "name": "Lancet, for use with Glucometer, box of 100",
    "description": "MN-0155.00 - Lancet, for use with Glucometer, box of 100",
    "femaCode": "MN-0155.00",
    "femaRequiredQty": 100,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-181",
    "categoryId": "cat-6",
    "name": "Chest Tube Kit",
    "description": "MN-0156.00 - Chest Tube Kit",
    "femaCode": "MN-0156.00",
    "femaRequiredQty": 4,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-182",
    "categoryId": "cat-6",
    "name": "Hypothermia Wrap",
    "description": "MN-0157.00 - Hypothermia Wrap",
    "femaCode": "MN-0157.00",
    "femaRequiredQty": 6,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-183",
    "categoryId": "cat-6",
    "name": "IFAK (Indvidual First Aid Kit) to contain 1 each of the following: Tourniquet (MR-0150.00), Hemostat",
    "description": "MN-0158.00 - IFAK (Indvidual First Aid Kit) to contain 1 each of the following: Tourniquet (MR-0150.00), Hemostatic agent (MR-0151.00), Israeli Dressing (MR-0152.00), ABD 5x8 Gauze dressing (MR-0117.00), Pair of N",
    "femaCode": "MN-0158.00",
    "femaRequiredQty": 80,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-184",
    "categoryId": "cat-6",
    "name": "MFAK (Medical First Aid Kit) to contain the following: 2x Tourniquet (MR-0150.00), 2x Hemostatic age",
    "description": "MN-0159.00 - MFAK (Medical First Aid Kit) to contain the following: 2x Tourniquet (MR-0150.00), 2x Hemostatic agent (MR-0151.00),  Israeli Dressing (MR-0152.00), ABD 5x8 Gauze dressing (MR-0117.00), Pair of Nitril",
    "femaCode": "MN-0159.00",
    "femaRequiredQty": 12,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-185",
    "categoryId": "cat-6",
    "name": "ARS, for Needle Decompression",
    "description": "MN-0159.01 - ARS, for Needle Decompression",
    "femaCode": "MN-0159.01",
    "femaRequiredQty": 12,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-186",
    "categoryId": "cat-6",
    "name": "Pouch for IFAK and MFAK, Color determined by Task Force. (Up to 80 for IFAK MN-0158.00)  (12 for MFA",
    "description": "MN-0160.00 - Pouch for IFAK and MFAK, Color determined by Task Force. (Up to 80 for IFAK MN-0158.00)  (12 for MFAK MN-0159.00)",
    "femaCode": "MN-0160.00",
    "femaRequiredQty": 92,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-187",
    "categoryId": "cat-6",
    "name": "Ultrasound, Imaging, Compact, with one electric device to meet the needs specific to Medical Team fo",
    "description": "MN-0161.00 - Ultrasound, Imaging, Compact, with one electric device to meet the needs specific to Medical Team for ultrasound imaging and reference materials",
    "femaCode": "MN-0161.00",
    "femaRequiredQty": 1,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-188",
    "categoryId": "cat-6",
    "name": "Gel, ultrasound, single use packets",
    "description": "MN-0161.01 - Gel, ultrasound, single use packets",
    "femaCode": "MN-0161.01",
    "femaRequiredQty": 100,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  },
  {
    "id": "it-189",
    "categoryId": "cat-6",
    "name": "Thermometers, handheld, non-contact",
    "description": "MN-0162.00 - Thermometers, handheld, non-contact",
    "femaCode": "MN-0162.00",
    "femaRequiredQty": 6,
    "parLevel": 0,
    "isConsumable": false,
    "isActive": true
  }
];

// ==============================================
// VARIANTS (from Ripley Room)
// ==============================================
export const variants: Variant[] = [
  {
    "id": "var-1",
    "itemTypeId": "it-8",
    "name": "American Innotek Daily Restroom Kit - 2 Liquid Waste, 1 Solid Waste",
    "manufacturer": "American Innotek",
    "sku": "Daily Restroom Kit - 2 Liquid Waste, 1 Solid Waste",
    "isActive": true
  },
  {
    "id": "var-2",
    "itemTypeId": "it-60",
    "name": "Uvex S3200X",
    "manufacturer": "Uvex",
    "sku": "S3200X",
    "isActive": true
  },
  {
    "id": "var-3",
    "itemTypeId": "it-58",
    "name": "Shelby 2515",
    "manufacturer": "Shelby",
    "sku": "2515",
    "isActive": true
  },
  {
    "id": "var-4",
    "itemTypeId": "it-112",
    "name": "NRS Water Rescue Helmet, White",
    "manufacturer": "NRS",
    "sku": "Water Rescue Helmet, White",
    "isActive": true
  },
  {
    "id": "var-5",
    "itemTypeId": "it-62",
    "name": "5.11 Stryke TDU Blouse",
    "manufacturer": "5.11",
    "sku": "Stryke TDU Blouse",
    "isActive": true
  },
  {
    "id": "var-6",
    "itemTypeId": "it-62",
    "name": "Tru-Spec BDU Blouse",
    "manufacturer": "Tru-Spec",
    "sku": "BDU Blouse",
    "isActive": true
  },
  {
    "id": "var-7",
    "itemTypeId": "it-61",
    "name": "Tru-Spec BDU Pants",
    "manufacturer": "Tru-Spec",
    "sku": "BDU Pants",
    "isActive": true
  },
  {
    "id": "var-8",
    "itemTypeId": "it-61",
    "name": "5.11 Stryke EMS Pants",
    "manufacturer": "5.11",
    "sku": "Stryke EMS Pants",
    "isActive": true
  },
  {
    "id": "var-9",
    "itemTypeId": "it-70",
    "name": "Tru-Spec BDU Shorts",
    "manufacturer": "Tru-Spec",
    "sku": "BDU Shorts",
    "isActive": true
  },
  {
    "id": "var-10",
    "itemTypeId": "it-70",
    "name": "Gildan Dry Blend 50/50 Poly/Cotton",
    "manufacturer": "Gildan",
    "sku": "Dry Blend 50/50 Poly/Cotton",
    "isActive": true
  },
  {
    "id": "var-11",
    "itemTypeId": "it-73",
    "name": "Gildan Dry Blend 50/50 Poly/Cotton",
    "manufacturer": "Gildan",
    "sku": "Dry Blend 50/50 Poly/Cotton",
    "isActive": true
  },
  {
    "id": "var-12",
    "itemTypeId": "it-78",
    "name": "Florence Marine X F1 Cordura Utility Short",
    "manufacturer": "Florence Marine X",
    "sku": "F1 Cordura Utility Short",
    "isActive": true
  },
  {
    "id": "var-13",
    "itemTypeId": "it-78",
    "name": "HippyTree Design Co. USAR Guard Boardshort (Custom)",
    "manufacturer": "HippyTree Design Co.",
    "sku": "USAR Guard Boardshort (Custom)",
    "isActive": true
  },
  {
    "id": "var-14",
    "itemTypeId": "it-72",
    "name": "5.11 3-IN-1 Parka",
    "manufacturer": "5.11",
    "sku": "3-IN-1 Parka",
    "isActive": true
  },
  {
    "id": "var-15",
    "itemTypeId": "it-59",
    "name": "Tru-Spec Rain Shell Pant",
    "manufacturer": "Tru-Spec",
    "sku": "Rain Shell Pant",
    "isActive": true
  },
  {
    "id": "var-16",
    "itemTypeId": "it-72",
    "name": "Tru-Spec Gen-III ECWS Level 2",
    "manufacturer": "Tru-Spec",
    "sku": "Gen-III ECWS Level 2",
    "isActive": true
  },
  {
    "id": "var-17",
    "itemTypeId": "it-59",
    "name": "Outdoor Research Rocky Mountain High",
    "manufacturer": "Outdoor Research",
    "sku": "Rocky Mountain High",
    "isActive": true
  },
  {
    "id": "var-18",
    "itemTypeId": "it-72",
    "name": "Generic",
    "manufacturer": "Generic",
    "sku": "",
    "isActive": true
  },
  {
    "id": "var-19",
    "itemTypeId": "it-51",
    "name": "Generic",
    "manufacturer": "Generic",
    "sku": "",
    "isActive": true
  },
  {
    "id": "var-20",
    "itemTypeId": "it-50",
    "name": "FlexFit 110 nu",
    "manufacturer": "FlexFit",
    "sku": "110 nu",
    "isActive": true
  },
  {
    "id": "var-21",
    "itemTypeId": "it-58",
    "name": "Dragon Fire First-Due",
    "manufacturer": "Dragon Fire",
    "sku": "First-Due",
    "isActive": true
  },
  {
    "id": "var-22",
    "itemTypeId": "it-72",
    "name": "Mechanix Coldwork M-PACT",
    "manufacturer": "Mechanix",
    "sku": "Coldwork M-PACT",
    "isActive": true
  },
  {
    "id": "var-23",
    "itemTypeId": "it-72",
    "name": "Mechanix Coldwork Peak",
    "manufacturer": "Mechanix",
    "sku": "Coldwork Peak",
    "isActive": true
  },
  {
    "id": "var-24",
    "itemTypeId": "it-79",
    "name": "Big Agnes Lost Dog 0",
    "manufacturer": "Big Agnes",
    "sku": "Lost Dog 0",
    "isActive": true
  },
  {
    "id": "var-25",
    "itemTypeId": "it-79",
    "name": "Big Agnes Superlight Girdle",
    "manufacturer": "Big Agnes",
    "sku": "Superlight Girdle",
    "isActive": true
  },
  {
    "id": "var-26",
    "itemTypeId": "it-79",
    "name": "Big Agnes Boundary Deluxe Pillow",
    "manufacturer": "Big Agnes",
    "sku": "Boundary Deluxe Pillow",
    "isActive": true
  },
  {
    "id": "var-27",
    "itemTypeId": "it-79",
    "name": "Big Agnes Rapide Sleeping Pad",
    "manufacturer": "Big Agnes",
    "sku": "Rapide Sleeping Pad",
    "isActive": true
  },
  {
    "id": "var-28",
    "itemTypeId": "it-79",
    "name": "SOL Escape Bivy Orange",
    "manufacturer": "SOL",
    "sku": "Escape Bivy Orange",
    "isActive": true
  },
  {
    "id": "var-29",
    "itemTypeId": "it-55",
    "name": "Team Wendy EXFIL SAR",
    "manufacturer": "Team Wendy",
    "sku": "EXFIL SAR",
    "isActive": true
  },
  {
    "id": "var-30",
    "itemTypeId": "it-55",
    "name": "Team Wendy SAR Comfort Pad Replacement Kit",
    "manufacturer": "Team Wendy",
    "sku": "SAR Comfort Pad Replacement Kit",
    "isActive": true
  },
  {
    "id": "var-31",
    "itemTypeId": "it-28",
    "name": "ESS Profile Pivot",
    "manufacturer": "ESS",
    "sku": "Profile Pivot",
    "isActive": true
  },
  {
    "id": "var-32",
    "itemTypeId": "it-55",
    "name": "Team Wendy SAR Replacement Vent Covers",
    "manufacturer": "Team Wendy",
    "sku": "SAR Replacement Vent Covers",
    "isActive": true
  },
  {
    "id": "var-33",
    "itemTypeId": "it-55",
    "name": "Team Wendy MAGPUL MOE 5-Slot Mounting Kit",
    "manufacturer": "Team Wendy",
    "sku": "MAGPUL MOE 5-Slot Mounting Kit",
    "isActive": true
  },
  {
    "id": "var-34",
    "itemTypeId": "it-56",
    "name": "Princeton Tec VIZ II",
    "manufacturer": "Princeton Tec",
    "sku": "VIZ II",
    "isActive": true
  },
  {
    "id": "var-35",
    "itemTypeId": "it-53",
    "name": "Pelican Pelican 3415",
    "manufacturer": "Pelican",
    "sku": "Pelican 3415",
    "isActive": true
  },
  {
    "id": "var-36",
    "itemTypeId": "it-57",
    "name": "Gerber MP-600",
    "manufacturer": "Gerber",
    "sku": "MP-600",
    "isActive": true
  },
  {
    "id": "var-37",
    "itemTypeId": "it-54",
    "name": "3M Multiple",
    "manufacturer": "3M",
    "sku": "Multiple",
    "isActive": true
  },
  {
    "id": "var-38",
    "itemTypeId": "it-42",
    "name": "Coretex Bug X 30",
    "manufacturer": "Coretex",
    "sku": "Bug X 30",
    "isActive": true
  },
  {
    "id": "var-39",
    "itemTypeId": "it-43",
    "name": "Coretex SunX30",
    "manufacturer": "Coretex",
    "sku": "SunX30",
    "isActive": true
  },
  {
    "id": "var-40",
    "itemTypeId": "it-61",
    "name": "CMC CMC Cobra-D Uniform Rappel Belt",
    "manufacturer": "CMC",
    "sku": "CMC Cobra-D Uniform Rappel Belt",
    "isActive": true
  },
  {
    "id": "var-41",
    "itemTypeId": "it-8",
    "name": "American Innotek Daily Restroom Kit",
    "manufacturer": "American Innotek",
    "sku": "Daily Restroom Kit",
    "isActive": true
  },
  {
    "id": "var-42",
    "itemTypeId": "it-8",
    "name": "American innotek Urinal Bag",
    "manufacturer": "American innotek",
    "sku": "Urinal Bag",
    "isActive": true
  },
  {
    "id": "var-43",
    "itemTypeId": "it-74",
    "name": "3M 3M 60000 Half Face Respirator",
    "manufacturer": "3M",
    "sku": "3M 60000 Half Face Respirator",
    "isActive": true
  },
  {
    "id": "var-44",
    "itemTypeId": "it-23",
    "name": "3M 3M 7093 Hard Shell Particulate Filter P100",
    "manufacturer": "3M",
    "sku": "3M 7093 Hard Shell Particulate Filter P100",
    "isActive": true
  },
  {
    "id": "var-45",
    "itemTypeId": "it-68",
    "name": "Wolf Pack Gear Load Bearing Harness",
    "manufacturer": "Wolf Pack Gear",
    "sku": "Load Bearing Harness",
    "isActive": true
  },
  {
    "id": "var-46",
    "itemTypeId": "it-69",
    "name": "Wolf Pack Gear Max Air Roller bag",
    "manufacturer": "Wolf Pack Gear",
    "sku": "Max Air Roller bag",
    "isActive": true
  },
  {
    "id": "var-47",
    "itemTypeId": "it-69",
    "name": "Wolf Pack Gear 24 Hour Pack",
    "manufacturer": "Wolf Pack Gear",
    "sku": "24 Hour Pack",
    "isActive": true
  },
  {
    "id": "var-48",
    "itemTypeId": "it-69",
    "name": "Wolf Pack Gear Web Gear Bag",
    "manufacturer": "Wolf Pack Gear",
    "sku": "Web Gear Bag",
    "isActive": true
  },
  {
    "id": "var-49",
    "itemTypeId": "it-69",
    "name": "Generic Forest Service",
    "manufacturer": "Generic",
    "sku": "Forest Service",
    "isActive": true
  },
  {
    "id": "var-50",
    "itemTypeId": "it-69",
    "name": "5.11 Rush 72",
    "manufacturer": "5.11",
    "sku": "Rush 72",
    "isActive": true
  },
  {
    "id": "var-51",
    "itemTypeId": "it-72",
    "name": "Rocky Alpha Force",
    "manufacturer": "Rocky",
    "sku": "Alpha Force",
    "isActive": true
  },
  {
    "id": "var-52",
    "itemTypeId": "it-75",
    "name": "USACE US&R Shoring Operations Guide",
    "manufacturer": "USACE",
    "sku": "US&R Shoring Operations Guide",
    "isActive": true
  },
  {
    "id": "var-53",
    "itemTypeId": "it-75",
    "name": "USACE US&R Structural Specialist F.O.G.",
    "manufacturer": "USACE",
    "sku": "US&R Structural Specialist F.O.G.",
    "isActive": true
  },
  {
    "id": "var-54",
    "itemTypeId": "it-75",
    "name": "Desert Rescue Research Edition 6",
    "manufacturer": "Desert Rescue Research",
    "sku": "Edition 6",
    "isActive": true
  },
  {
    "id": "var-55",
    "itemTypeId": "it-62",
    "name": "Generic",
    "manufacturer": "Generic",
    "sku": "",
    "isActive": true
  },
  {
    "id": "var-56",
    "itemTypeId": "it-98",
    "name": "Scott AV300",
    "manufacturer": "Scott",
    "sku": "AV300",
    "isActive": true
  },
  {
    "id": "var-57",
    "itemTypeId": "it-95",
    "name": "Scott Bayonet Adapter",
    "manufacturer": "Scott",
    "sku": "Bayonet Adapter",
    "isActive": true
  },
  {
    "id": "var-58",
    "itemTypeId": "it-98",
    "name": "Scott Bag",
    "manufacturer": "Scott",
    "sku": "Bag",
    "isActive": true
  },
  {
    "id": "var-59",
    "itemTypeId": "it-183",
    "name": "North American Rescue",
    "manufacturer": "North American Rescue",
    "sku": "",
    "isActive": true
  },
  {
    "id": "var-60",
    "itemTypeId": "it-52",
    "name": "Globe Technical Rescue",
    "manufacturer": "Globe",
    "sku": "Technical Rescue",
    "isActive": true
  },
  {
    "id": "var-61",
    "itemTypeId": "it-11",
    "name": "Medline Ready Bath",
    "manufacturer": "Medline",
    "sku": "Ready Bath",
    "isActive": true
  }
];

// ==============================================
// SIZES (from Ripley Room)
// ==============================================
export const sizes: Size[] = [
  {
    "id": "size-1",
    "variantId": "var-1",
    "name": "Standard",
    "sortOrder": 1,
    "isActive": true
  },
  {
    "id": "size-2",
    "variantId": "var-2",
    "name": "Standard",
    "sortOrder": 2,
    "isActive": true
  },
  {
    "id": "size-3",
    "variantId": "var-3",
    "name": "Large",
    "sortOrder": 3,
    "isActive": true
  },
  {
    "id": "size-4",
    "variantId": "var-3",
    "name": "Medium",
    "sortOrder": 4,
    "isActive": true
  },
  {
    "id": "size-5",
    "variantId": "var-3",
    "name": "X-Large",
    "sortOrder": 5,
    "isActive": true
  },
  {
    "id": "size-6",
    "variantId": "var-4",
    "name": "Standard",
    "sortOrder": 6,
    "isActive": true
  },
  {
    "id": "size-7",
    "variantId": "var-5",
    "name": "XS",
    "sortOrder": 7,
    "isActive": true
  },
  {
    "id": "size-8",
    "variantId": "var-5",
    "name": "Small",
    "sortOrder": 8,
    "isActive": true
  },
  {
    "id": "size-9",
    "variantId": "var-5",
    "name": "Medium",
    "sortOrder": 9,
    "isActive": true
  },
  {
    "id": "size-10",
    "variantId": "var-5",
    "name": "Large",
    "sortOrder": 10,
    "isActive": true
  },
  {
    "id": "size-11",
    "variantId": "var-5",
    "name": "Standard",
    "sortOrder": 11,
    "isActive": true
  },
  {
    "id": "size-12",
    "variantId": "var-5",
    "name": "2XL",
    "sortOrder": 12,
    "isActive": true
  },
  {
    "id": "size-13",
    "variantId": "var-5",
    "name": "3XL",
    "sortOrder": 13,
    "isActive": true
  },
  {
    "id": "size-14",
    "variantId": "var-6",
    "name": "Small Short",
    "sortOrder": 14,
    "isActive": true
  },
  {
    "id": "size-15",
    "variantId": "var-6",
    "name": "Small Regular",
    "sortOrder": 15,
    "isActive": true
  },
  {
    "id": "size-16",
    "variantId": "var-6",
    "name": "Small Long",
    "sortOrder": 16,
    "isActive": true
  },
  {
    "id": "size-17",
    "variantId": "var-6",
    "name": "Medium Short",
    "sortOrder": 17,
    "isActive": true
  },
  {
    "id": "size-18",
    "variantId": "var-6",
    "name": "Medium Regular",
    "sortOrder": 18,
    "isActive": true
  },
  {
    "id": "size-19",
    "variantId": "var-6",
    "name": "Medium Long",
    "sortOrder": 19,
    "isActive": true
  },
  {
    "id": "size-20",
    "variantId": "var-6",
    "name": "Large Short",
    "sortOrder": 20,
    "isActive": true
  },
  {
    "id": "size-21",
    "variantId": "var-6",
    "name": "Large Regular",
    "sortOrder": 21,
    "isActive": true
  },
  {
    "id": "size-22",
    "variantId": "var-6",
    "name": "Large Long",
    "sortOrder": 22,
    "isActive": true
  },
  {
    "id": "size-23",
    "variantId": "var-6",
    "name": "XL Short",
    "sortOrder": 23,
    "isActive": true
  },
  {
    "id": "size-24",
    "variantId": "var-6",
    "name": "XL Regular",
    "sortOrder": 24,
    "isActive": true
  },
  {
    "id": "size-25",
    "variantId": "var-6",
    "name": "XL Long",
    "sortOrder": 25,
    "isActive": true
  },
  {
    "id": "size-26",
    "variantId": "var-7",
    "name": "Small Short",
    "sortOrder": 26,
    "isActive": true
  },
  {
    "id": "size-27",
    "variantId": "var-7",
    "name": "Small Regular",
    "sortOrder": 27,
    "isActive": true
  },
  {
    "id": "size-28",
    "variantId": "var-7",
    "name": "Small Long",
    "sortOrder": 28,
    "isActive": true
  },
  {
    "id": "size-29",
    "variantId": "var-7",
    "name": "Medium Short",
    "sortOrder": 29,
    "isActive": true
  },
  {
    "id": "size-30",
    "variantId": "var-7",
    "name": "Medium Regular",
    "sortOrder": 30,
    "isActive": true
  },
  {
    "id": "size-31",
    "variantId": "var-7",
    "name": "Medium Long",
    "sortOrder": 31,
    "isActive": true
  },
  {
    "id": "size-32",
    "variantId": "var-7",
    "name": "Large Short",
    "sortOrder": 32,
    "isActive": true
  },
  {
    "id": "size-33",
    "variantId": "var-7",
    "name": "Large Regular",
    "sortOrder": 33,
    "isActive": true
  },
  {
    "id": "size-34",
    "variantId": "var-7",
    "name": "Large Long",
    "sortOrder": 34,
    "isActive": true
  },
  {
    "id": "size-35",
    "variantId": "var-7",
    "name": "XL Short",
    "sortOrder": 35,
    "isActive": true
  },
  {
    "id": "size-36",
    "variantId": "var-7",
    "name": "XL Regular",
    "sortOrder": 36,
    "isActive": true
  },
  {
    "id": "size-37",
    "variantId": "var-7",
    "name": "2XL Short",
    "sortOrder": 37,
    "isActive": true
  },
  {
    "id": "size-38",
    "variantId": "var-7",
    "name": "2XL Regular",
    "sortOrder": 38,
    "isActive": true
  },
  {
    "id": "size-39",
    "variantId": "var-7",
    "name": "2XL Long",
    "sortOrder": 39,
    "isActive": true
  },
  {
    "id": "size-40",
    "variantId": "var-8",
    "name": "28X30",
    "sortOrder": 40,
    "isActive": true
  },
  {
    "id": "size-41",
    "variantId": "var-8",
    "name": "28X32",
    "sortOrder": 41,
    "isActive": true
  },
  {
    "id": "size-42",
    "variantId": "var-8",
    "name": "28X34",
    "sortOrder": 42,
    "isActive": true
  },
  {
    "id": "size-43",
    "variantId": "var-8",
    "name": "30X30",
    "sortOrder": 43,
    "isActive": true
  },
  {
    "id": "size-44",
    "variantId": "var-8",
    "name": "30X32",
    "sortOrder": 44,
    "isActive": true
  },
  {
    "id": "size-45",
    "variantId": "var-8",
    "name": "30X34",
    "sortOrder": 45,
    "isActive": true
  },
  {
    "id": "size-46",
    "variantId": "var-8",
    "name": "32X30",
    "sortOrder": 46,
    "isActive": true
  },
  {
    "id": "size-47",
    "variantId": "var-8",
    "name": "32X32",
    "sortOrder": 47,
    "isActive": true
  },
  {
    "id": "size-48",
    "variantId": "var-8",
    "name": "32X34",
    "sortOrder": 48,
    "isActive": true
  },
  {
    "id": "size-49",
    "variantId": "var-8",
    "name": "34X30",
    "sortOrder": 49,
    "isActive": true
  },
  {
    "id": "size-50",
    "variantId": "var-8",
    "name": "34X32",
    "sortOrder": 50,
    "isActive": true
  },
  {
    "id": "size-51",
    "variantId": "var-8",
    "name": "34X34",
    "sortOrder": 51,
    "isActive": true
  },
  {
    "id": "size-52",
    "variantId": "var-8",
    "name": "36X30",
    "sortOrder": 52,
    "isActive": true
  },
  {
    "id": "size-53",
    "variantId": "var-8",
    "name": "36X32",
    "sortOrder": 53,
    "isActive": true
  },
  {
    "id": "size-54",
    "variantId": "var-8",
    "name": "36X34",
    "sortOrder": 54,
    "isActive": true
  },
  {
    "id": "size-55",
    "variantId": "var-8",
    "name": "38X30",
    "sortOrder": 55,
    "isActive": true
  },
  {
    "id": "size-56",
    "variantId": "var-8",
    "name": "38X32",
    "sortOrder": 56,
    "isActive": true
  },
  {
    "id": "size-57",
    "variantId": "var-8",
    "name": "38X34",
    "sortOrder": 57,
    "isActive": true
  },
  {
    "id": "size-58",
    "variantId": "var-8",
    "name": "40X30",
    "sortOrder": 58,
    "isActive": true
  },
  {
    "id": "size-59",
    "variantId": "var-8",
    "name": "40X32",
    "sortOrder": 59,
    "isActive": true
  },
  {
    "id": "size-60",
    "variantId": "var-8",
    "name": "40X34",
    "sortOrder": 60,
    "isActive": true
  },
  {
    "id": "size-61",
    "variantId": "var-8",
    "name": "42X30",
    "sortOrder": 61,
    "isActive": true
  },
  {
    "id": "size-62",
    "variantId": "var-8",
    "name": "42X32",
    "sortOrder": 62,
    "isActive": true
  },
  {
    "id": "size-63",
    "variantId": "var-8",
    "name": "42X34",
    "sortOrder": 63,
    "isActive": true
  },
  {
    "id": "size-64",
    "variantId": "var-8",
    "name": "44X30",
    "sortOrder": 64,
    "isActive": true
  },
  {
    "id": "size-65",
    "variantId": "var-8",
    "name": "44X32",
    "sortOrder": 65,
    "isActive": true
  },
  {
    "id": "size-66",
    "variantId": "var-9",
    "name": "Waist: 27-29",
    "sortOrder": 66,
    "isActive": true
  },
  {
    "id": "size-67",
    "variantId": "var-9",
    "name": "Waist: 29-31",
    "sortOrder": 67,
    "isActive": true
  },
  {
    "id": "size-68",
    "variantId": "var-9",
    "name": "Waist: 31-33",
    "sortOrder": 68,
    "isActive": true
  },
  {
    "id": "size-69",
    "variantId": "var-9",
    "name": "Waist: 33-35",
    "sortOrder": 69,
    "isActive": true
  },
  {
    "id": "size-70",
    "variantId": "var-9",
    "name": "Waist: 35-37",
    "sortOrder": 70,
    "isActive": true
  },
  {
    "id": "size-71",
    "variantId": "var-10",
    "name": "Short Sleeve, XS",
    "sortOrder": 71,
    "isActive": true
  },
  {
    "id": "size-72",
    "variantId": "var-11",
    "name": "Short Sleeve, Small",
    "sortOrder": 72,
    "isActive": true
  },
  {
    "id": "size-73",
    "variantId": "var-11",
    "name": "Short Sleeve, Medium",
    "sortOrder": 73,
    "isActive": true
  },
  {
    "id": "size-74",
    "variantId": "var-11",
    "name": "Short Sleeve, Large",
    "sortOrder": 74,
    "isActive": true
  },
  {
    "id": "size-75",
    "variantId": "var-11",
    "name": "Short Sleeve, XL",
    "sortOrder": 75,
    "isActive": true
  },
  {
    "id": "size-76",
    "variantId": "var-11",
    "name": "Short Sleeve, 2XL",
    "sortOrder": 76,
    "isActive": true
  },
  {
    "id": "size-77",
    "variantId": "var-11",
    "name": "Short Sleeve, 3XL",
    "sortOrder": 77,
    "isActive": true
  },
  {
    "id": "size-78",
    "variantId": "var-11",
    "name": "Long Sleeve, XS",
    "sortOrder": 78,
    "isActive": true
  },
  {
    "id": "size-79",
    "variantId": "var-11",
    "name": "Long Sleeve, Small",
    "sortOrder": 79,
    "isActive": true
  },
  {
    "id": "size-80",
    "variantId": "var-11",
    "name": "Long Sleeve, Medium",
    "sortOrder": 80,
    "isActive": true
  },
  {
    "id": "size-81",
    "variantId": "var-11",
    "name": "Long Sleeve, Large",
    "sortOrder": 81,
    "isActive": true
  },
  {
    "id": "size-82",
    "variantId": "var-11",
    "name": "Long Sleeve, XL",
    "sortOrder": 82,
    "isActive": true
  },
  {
    "id": "size-83",
    "variantId": "var-11",
    "name": "Long Sleeve, 2XL",
    "sortOrder": 83,
    "isActive": true
  },
  {
    "id": "size-84",
    "variantId": "var-11",
    "name": "Short Sleeve, XS",
    "sortOrder": 84,
    "isActive": true
  },
  {
    "id": "size-85",
    "variantId": "var-11",
    "name": "Short Sleeve, Small",
    "sortOrder": 85,
    "isActive": true
  },
  {
    "id": "size-86",
    "variantId": "var-11",
    "name": "Short Sleeve, Medium",
    "sortOrder": 86,
    "isActive": true
  },
  {
    "id": "size-87",
    "variantId": "var-11",
    "name": "Short Sleeve, Large",
    "sortOrder": 87,
    "isActive": true
  },
  {
    "id": "size-88",
    "variantId": "var-11",
    "name": "Short Sleeve, XL",
    "sortOrder": 88,
    "isActive": true
  },
  {
    "id": "size-89",
    "variantId": "var-11",
    "name": "Short Sleeve, 2XL",
    "sortOrder": 89,
    "isActive": true
  },
  {
    "id": "size-90",
    "variantId": "var-11",
    "name": "Short Sleeve, 3XL",
    "sortOrder": 90,
    "isActive": true
  },
  {
    "id": "size-91",
    "variantId": "var-11",
    "name": "Long Sleeve, XS",
    "sortOrder": 91,
    "isActive": true
  },
  {
    "id": "size-92",
    "variantId": "var-11",
    "name": "Long Sleeve, Small",
    "sortOrder": 92,
    "isActive": true
  },
  {
    "id": "size-93",
    "variantId": "var-11",
    "name": "Long Sleeve, Medium",
    "sortOrder": 93,
    "isActive": true
  },
  {
    "id": "size-94",
    "variantId": "var-11",
    "name": "Long Sleeve, Large",
    "sortOrder": 94,
    "isActive": true
  },
  {
    "id": "size-95",
    "variantId": "var-11",
    "name": "Long Sleeve, XL",
    "sortOrder": 95,
    "isActive": true
  },
  {
    "id": "size-96",
    "variantId": "var-11",
    "name": "Long Sleeve, 2XL",
    "sortOrder": 96,
    "isActive": true
  },
  {
    "id": "size-97",
    "variantId": "var-11",
    "name": "Long Sleeve, 3XL",
    "sortOrder": 97,
    "isActive": true
  },
  {
    "id": "size-98",
    "variantId": "var-12",
    "name": "Size 30",
    "sortOrder": 98,
    "isActive": true
  },
  {
    "id": "size-99",
    "variantId": "var-12",
    "name": "Size 32",
    "sortOrder": 99,
    "isActive": true
  },
  {
    "id": "size-100",
    "variantId": "var-12",
    "name": "Size 34",
    "sortOrder": 100,
    "isActive": true
  },
  {
    "id": "size-101",
    "variantId": "var-12",
    "name": "Size 36",
    "sortOrder": 101,
    "isActive": true
  },
  {
    "id": "size-102",
    "variantId": "var-12",
    "name": "Size 38",
    "sortOrder": 102,
    "isActive": true
  },
  {
    "id": "size-103",
    "variantId": "var-13",
    "name": "Size 40",
    "sortOrder": 103,
    "isActive": true
  },
  {
    "id": "size-104",
    "variantId": "var-13",
    "name": "Size 42",
    "sortOrder": 104,
    "isActive": true
  },
  {
    "id": "size-105",
    "variantId": "var-13",
    "name": "Size 44",
    "sortOrder": 105,
    "isActive": true
  },
  {
    "id": "size-106",
    "variantId": "var-14",
    "name": "XS",
    "sortOrder": 106,
    "isActive": true
  },
  {
    "id": "size-107",
    "variantId": "var-14",
    "name": "Standard",
    "sortOrder": 107,
    "isActive": true
  },
  {
    "id": "size-108",
    "variantId": "var-14",
    "name": "Standard",
    "sortOrder": 108,
    "isActive": true
  },
  {
    "id": "size-109",
    "variantId": "var-14",
    "name": "Standard",
    "sortOrder": 109,
    "isActive": true
  },
  {
    "id": "size-110",
    "variantId": "var-14",
    "name": "Standard",
    "sortOrder": 110,
    "isActive": true
  },
  {
    "id": "size-111",
    "variantId": "var-14",
    "name": "Standard",
    "sortOrder": 111,
    "isActive": true
  },
  {
    "id": "size-112",
    "variantId": "var-14",
    "name": "Standard",
    "sortOrder": 112,
    "isActive": true
  },
  {
    "id": "size-113",
    "variantId": "var-15",
    "name": "Small Regular",
    "sortOrder": 113,
    "isActive": true
  },
  {
    "id": "size-114",
    "variantId": "var-15",
    "name": "Large Regular",
    "sortOrder": 114,
    "isActive": true
  },
  {
    "id": "size-115",
    "variantId": "var-15",
    "name": "XL Regular",
    "sortOrder": 115,
    "isActive": true
  },
  {
    "id": "size-116",
    "variantId": "var-15",
    "name": "XL Long",
    "sortOrder": 116,
    "isActive": true
  },
  {
    "id": "size-117",
    "variantId": "var-15",
    "name": "2XL Regular",
    "sortOrder": 117,
    "isActive": true
  },
  {
    "id": "size-118",
    "variantId": "var-15",
    "name": "3XL Regular",
    "sortOrder": 118,
    "isActive": true
  },
  {
    "id": "size-119",
    "variantId": "var-16",
    "name": "Small",
    "sortOrder": 119,
    "isActive": true
  },
  {
    "id": "size-120",
    "variantId": "var-16",
    "name": "Medium",
    "sortOrder": 120,
    "isActive": true
  },
  {
    "id": "size-121",
    "variantId": "var-16",
    "name": "Large",
    "sortOrder": 121,
    "isActive": true
  },
  {
    "id": "size-122",
    "variantId": "var-16",
    "name": "XL",
    "sortOrder": 122,
    "isActive": true
  },
  {
    "id": "size-123",
    "variantId": "var-16",
    "name": "2XL",
    "sortOrder": 123,
    "isActive": true
  },
  {
    "id": "size-124",
    "variantId": "var-16",
    "name": "3XL",
    "sortOrder": 124,
    "isActive": true
  },
  {
    "id": "size-125",
    "variantId": "var-16",
    "name": "Small",
    "sortOrder": 125,
    "isActive": true
  },
  {
    "id": "size-126",
    "variantId": "var-16",
    "name": "Medium",
    "sortOrder": 126,
    "isActive": true
  },
  {
    "id": "size-127",
    "variantId": "var-16",
    "name": "Large",
    "sortOrder": 127,
    "isActive": true
  },
  {
    "id": "size-128",
    "variantId": "var-16",
    "name": "XL",
    "sortOrder": 128,
    "isActive": true
  },
  {
    "id": "size-129",
    "variantId": "var-16",
    "name": "2XL",
    "sortOrder": 129,
    "isActive": true
  },
  {
    "id": "size-130",
    "variantId": "var-16",
    "name": "3XL",
    "sortOrder": 130,
    "isActive": true
  },
  {
    "id": "size-131",
    "variantId": "var-17",
    "name": "Shoe Size: 4-7",
    "sortOrder": 131,
    "isActive": true
  },
  {
    "id": "size-132",
    "variantId": "var-17",
    "name": "Standard",
    "sortOrder": 132,
    "isActive": true
  },
  {
    "id": "size-133",
    "variantId": "var-17",
    "name": "Shoe Size: 9-11",
    "sortOrder": 133,
    "isActive": true
  },
  {
    "id": "size-134",
    "variantId": "var-17",
    "name": "Shoe Size: 11-13",
    "sortOrder": 134,
    "isActive": true
  },
  {
    "id": "size-135",
    "variantId": "var-17",
    "name": "Shoe Size: 13-15",
    "sortOrder": 135,
    "isActive": true
  },
  {
    "id": "size-136",
    "variantId": "var-18",
    "name": "Standard",
    "sortOrder": 136,
    "isActive": true
  },
  {
    "id": "size-137",
    "variantId": "var-19",
    "name": "Standard",
    "sortOrder": 137,
    "isActive": true
  },
  {
    "id": "size-138",
    "variantId": "var-20",
    "name": "Standard",
    "sortOrder": 138,
    "isActive": true
  },
  {
    "id": "size-139",
    "variantId": "var-21",
    "name": "Standard",
    "sortOrder": 139,
    "isActive": true
  },
  {
    "id": "size-140",
    "variantId": "var-21",
    "name": "Standard",
    "sortOrder": 140,
    "isActive": true
  },
  {
    "id": "size-141",
    "variantId": "var-21",
    "name": "Standard",
    "sortOrder": 141,
    "isActive": true
  },
  {
    "id": "size-142",
    "variantId": "var-21",
    "name": "Standard",
    "sortOrder": 142,
    "isActive": true
  },
  {
    "id": "size-143",
    "variantId": "var-21",
    "name": "Standard",
    "sortOrder": 143,
    "isActive": true
  },
  {
    "id": "size-144",
    "variantId": "var-22",
    "name": "Standard",
    "sortOrder": 144,
    "isActive": true
  },
  {
    "id": "size-145",
    "variantId": "var-22",
    "name": "Standard",
    "sortOrder": 145,
    "isActive": true
  },
  {
    "id": "size-146",
    "variantId": "var-22",
    "name": "Standard",
    "sortOrder": 146,
    "isActive": true
  },
  {
    "id": "size-147",
    "variantId": "var-23",
    "name": "Standard",
    "sortOrder": 147,
    "isActive": true
  },
  {
    "id": "size-148",
    "variantId": "var-23",
    "name": "Standard",
    "sortOrder": 148,
    "isActive": true
  },
  {
    "id": "size-149",
    "variantId": "var-23",
    "name": "Standard",
    "sortOrder": 149,
    "isActive": true
  },
  {
    "id": "size-150",
    "variantId": "var-23",
    "name": "Standard",
    "sortOrder": 150,
    "isActive": true
  },
  {
    "id": "size-151",
    "variantId": "var-23",
    "name": "Standard",
    "sortOrder": 151,
    "isActive": true
  },
  {
    "id": "size-152",
    "variantId": "var-24",
    "name": "Standard",
    "sortOrder": 152,
    "isActive": true
  },
  {
    "id": "size-153",
    "variantId": "var-25",
    "name": "Standard",
    "sortOrder": 153,
    "isActive": true
  },
  {
    "id": "size-154",
    "variantId": "var-26",
    "name": "Standard",
    "sortOrder": 154,
    "isActive": true
  },
  {
    "id": "size-155",
    "variantId": "var-27",
    "name": "Standard",
    "sortOrder": 155,
    "isActive": true
  },
  {
    "id": "size-156",
    "variantId": "var-28",
    "name": "Standard",
    "sortOrder": 156,
    "isActive": true
  },
  {
    "id": "size-157",
    "variantId": "var-29",
    "name": "Yellow",
    "sortOrder": 157,
    "isActive": true
  },
  {
    "id": "size-158",
    "variantId": "var-29",
    "name": "Standard",
    "sortOrder": 158,
    "isActive": true
  },
  {
    "id": "size-159",
    "variantId": "var-29",
    "name": "Orange",
    "sortOrder": 159,
    "isActive": true
  },
  {
    "id": "size-160",
    "variantId": "var-29",
    "name": "White",
    "sortOrder": 160,
    "isActive": true
  },
  {
    "id": "size-161",
    "variantId": "var-30",
    "name": "Standard",
    "sortOrder": 161,
    "isActive": true
  },
  {
    "id": "size-162",
    "variantId": "var-31",
    "name": "For Team Wendy Helmet",
    "sortOrder": 162,
    "isActive": true
  },
  {
    "id": "size-163",
    "variantId": "var-32",
    "name": "Standard",
    "sortOrder": 163,
    "isActive": true
  },
  {
    "id": "size-164",
    "variantId": "var-33",
    "name": "Standard",
    "sortOrder": 164,
    "isActive": true
  },
  {
    "id": "size-165",
    "variantId": "var-34",
    "name": "Standard",
    "sortOrder": 165,
    "isActive": true
  },
  {
    "id": "size-166",
    "variantId": "var-35",
    "name": "Standard",
    "sortOrder": 166,
    "isActive": true
  },
  {
    "id": "size-167",
    "variantId": "var-36",
    "name": "Standard",
    "sortOrder": 167,
    "isActive": true
  },
  {
    "id": "size-168",
    "variantId": "var-37",
    "name": "Standard",
    "sortOrder": 168,
    "isActive": true
  },
  {
    "id": "size-169",
    "variantId": "var-38",
    "name": "Standard",
    "sortOrder": 169,
    "isActive": true
  },
  {
    "id": "size-170",
    "variantId": "var-39",
    "name": "Standard",
    "sortOrder": 170,
    "isActive": true
  },
  {
    "id": "size-171",
    "variantId": "var-40",
    "name": "Standard",
    "sortOrder": 171,
    "isActive": true
  },
  {
    "id": "size-172",
    "variantId": "var-41",
    "name": "Standard",
    "sortOrder": 172,
    "isActive": true
  },
  {
    "id": "size-173",
    "variantId": "var-42",
    "name": "Standard",
    "sortOrder": 173,
    "isActive": true
  },
  {
    "id": "size-174",
    "variantId": "var-43",
    "name": "Standard",
    "sortOrder": 174,
    "isActive": true
  },
  {
    "id": "size-175",
    "variantId": "var-44",
    "name": "Standard",
    "sortOrder": 175,
    "isActive": true
  },
  {
    "id": "size-176",
    "variantId": "var-8",
    "name": "Standard",
    "sortOrder": 176,
    "isActive": true
  },
  {
    "id": "size-177",
    "variantId": "var-6",
    "name": "Standard",
    "sortOrder": 177,
    "isActive": true
  },
  {
    "id": "size-178",
    "variantId": "var-6",
    "name": "Standard",
    "sortOrder": 178,
    "isActive": true
  },
  {
    "id": "size-179",
    "variantId": "var-6",
    "name": "Standard",
    "sortOrder": 179,
    "isActive": true
  },
  {
    "id": "size-180",
    "variantId": "var-45",
    "name": "Standard",
    "sortOrder": 180,
    "isActive": true
  },
  {
    "id": "size-181",
    "variantId": "var-46",
    "name": "Standard",
    "sortOrder": 181,
    "isActive": true
  },
  {
    "id": "size-182",
    "variantId": "var-47",
    "name": "Standard",
    "sortOrder": 182,
    "isActive": true
  },
  {
    "id": "size-183",
    "variantId": "var-48",
    "name": "Standard",
    "sortOrder": 183,
    "isActive": true
  },
  {
    "id": "size-184",
    "variantId": "var-49",
    "name": "Standard",
    "sortOrder": 184,
    "isActive": true
  },
  {
    "id": "size-185",
    "variantId": "var-50",
    "name": "Standard",
    "sortOrder": 185,
    "isActive": true
  },
  {
    "id": "size-186",
    "variantId": "var-51",
    "name": "Standard",
    "sortOrder": 186,
    "isActive": true
  },
  {
    "id": "size-187",
    "variantId": "var-51",
    "name": "Standard",
    "sortOrder": 187,
    "isActive": true
  },
  {
    "id": "size-188",
    "variantId": "var-51",
    "name": "Standard",
    "sortOrder": 188,
    "isActive": true
  },
  {
    "id": "size-189",
    "variantId": "var-51",
    "name": "Standard",
    "sortOrder": 189,
    "isActive": true
  },
  {
    "id": "size-190",
    "variantId": "var-51",
    "name": "Standard",
    "sortOrder": 190,
    "isActive": true
  },
  {
    "id": "size-191",
    "variantId": "var-51",
    "name": "Standard",
    "sortOrder": 191,
    "isActive": true
  },
  {
    "id": "size-192",
    "variantId": "var-51",
    "name": "Standard",
    "sortOrder": 192,
    "isActive": true
  },
  {
    "id": "size-193",
    "variantId": "var-51",
    "name": "Standard",
    "sortOrder": 193,
    "isActive": true
  },
  {
    "id": "size-194",
    "variantId": "var-52",
    "name": "Edition 4.1",
    "sortOrder": 194,
    "isActive": true
  },
  {
    "id": "size-195",
    "variantId": "var-53",
    "name": "Standard",
    "sortOrder": 195,
    "isActive": true
  },
  {
    "id": "size-196",
    "variantId": "var-54",
    "name": "Standard",
    "sortOrder": 196,
    "isActive": true
  },
  {
    "id": "size-197",
    "variantId": "var-22",
    "name": "Standard",
    "sortOrder": 197,
    "isActive": true
  },
  {
    "id": "size-198",
    "variantId": "var-22",
    "name": "Standard",
    "sortOrder": 198,
    "isActive": true
  },
  {
    "id": "size-199",
    "variantId": "var-43",
    "name": "Standard",
    "sortOrder": 199,
    "isActive": true
  },
  {
    "id": "size-200",
    "variantId": "var-55",
    "name": "Standard",
    "sortOrder": 200,
    "isActive": true
  },
  {
    "id": "size-201",
    "variantId": "var-55",
    "name": "Standard",
    "sortOrder": 201,
    "isActive": true
  },
  {
    "id": "size-202",
    "variantId": "var-55",
    "name": "Standard",
    "sortOrder": 202,
    "isActive": true
  },
  {
    "id": "size-203",
    "variantId": "var-55",
    "name": "Standard",
    "sortOrder": 203,
    "isActive": true
  },
  {
    "id": "size-204",
    "variantId": "var-55",
    "name": "Standard",
    "sortOrder": 204,
    "isActive": true
  },
  {
    "id": "size-205",
    "variantId": "var-55",
    "name": "Standard",
    "sortOrder": 205,
    "isActive": true
  },
  {
    "id": "size-206",
    "variantId": "var-55",
    "name": "Standard",
    "sortOrder": 206,
    "isActive": true
  },
  {
    "id": "size-207",
    "variantId": "var-55",
    "name": "Standard",
    "sortOrder": 207,
    "isActive": true
  },
  {
    "id": "size-208",
    "variantId": "var-55",
    "name": "Standard",
    "sortOrder": 208,
    "isActive": true
  },
  {
    "id": "size-209",
    "variantId": "var-55",
    "name": "Standard",
    "sortOrder": 209,
    "isActive": true
  },
  {
    "id": "size-210",
    "variantId": "var-56",
    "name": "Small",
    "sortOrder": 210,
    "isActive": true
  },
  {
    "id": "size-211",
    "variantId": "var-56",
    "name": "Medium",
    "sortOrder": 211,
    "isActive": true
  },
  {
    "id": "size-212",
    "variantId": "var-56",
    "name": "Large",
    "sortOrder": 212,
    "isActive": true
  },
  {
    "id": "size-213",
    "variantId": "var-57",
    "name": "Standard",
    "sortOrder": 213,
    "isActive": true
  },
  {
    "id": "size-214",
    "variantId": "var-58",
    "name": "Standard",
    "sortOrder": 214,
    "isActive": true
  },
  {
    "id": "size-215",
    "variantId": "var-59",
    "name": "Standard",
    "sortOrder": 215,
    "isActive": true
  },
  {
    "id": "size-216",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 216,
    "isActive": true
  },
  {
    "id": "size-217",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 217,
    "isActive": true
  },
  {
    "id": "size-218",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 218,
    "isActive": true
  },
  {
    "id": "size-219",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 219,
    "isActive": true
  },
  {
    "id": "size-220",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 220,
    "isActive": true
  },
  {
    "id": "size-221",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 221,
    "isActive": true
  },
  {
    "id": "size-222",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 222,
    "isActive": true
  },
  {
    "id": "size-223",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 223,
    "isActive": true
  },
  {
    "id": "size-224",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 224,
    "isActive": true
  },
  {
    "id": "size-225",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 225,
    "isActive": true
  },
  {
    "id": "size-226",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 226,
    "isActive": true
  },
  {
    "id": "size-227",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 227,
    "isActive": true
  },
  {
    "id": "size-228",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 228,
    "isActive": true
  },
  {
    "id": "size-229",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 229,
    "isActive": true
  },
  {
    "id": "size-230",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 230,
    "isActive": true
  },
  {
    "id": "size-231",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 231,
    "isActive": true
  },
  {
    "id": "size-232",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 232,
    "isActive": true
  },
  {
    "id": "size-233",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 233,
    "isActive": true
  },
  {
    "id": "size-234",
    "variantId": "var-60",
    "name": "Standard",
    "sortOrder": 234,
    "isActive": true
  },
  {
    "id": "size-235",
    "variantId": "var-7",
    "name": "Standard",
    "sortOrder": 235,
    "isActive": true
  },
  {
    "id": "size-236",
    "variantId": "var-61",
    "name": "Standard",
    "sortOrder": 236,
    "isActive": true
  }
];

// ==============================================
// INVENTORY (current stock)
// ==============================================
export const inventory: InventoryItem[] = [
  {
    "sizeId": "size-1",
    "quantityOnHand": 2630,
    "quantityReserved": 0,
    "quantityAvailable": 2630
  },
  {
    "sizeId": "size-2",
    "quantityOnHand": 200,
    "quantityReserved": 0,
    "quantityAvailable": 200
  },
  {
    "sizeId": "size-3",
    "quantityOnHand": 40,
    "quantityReserved": 0,
    "quantityAvailable": 40
  },
  {
    "sizeId": "size-4",
    "quantityOnHand": 20,
    "quantityReserved": 0,
    "quantityAvailable": 20
  },
  {
    "sizeId": "size-5",
    "quantityOnHand": 10,
    "quantityReserved": 0,
    "quantityAvailable": 10
  },
  {
    "sizeId": "size-6",
    "quantityOnHand": 24,
    "quantityReserved": 0,
    "quantityAvailable": 24
  },
  {
    "sizeId": "size-7",
    "quantityOnHand": 20,
    "quantityReserved": 0,
    "quantityAvailable": 20
  },
  {
    "sizeId": "size-8",
    "quantityOnHand": 27,
    "quantityReserved": 0,
    "quantityAvailable": 27
  },
  {
    "sizeId": "size-9",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-10",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-11",
    "quantityOnHand": 32,
    "quantityReserved": 0,
    "quantityAvailable": 32
  },
  {
    "sizeId": "size-12",
    "quantityOnHand": 34,
    "quantityReserved": 0,
    "quantityAvailable": 34
  },
  {
    "sizeId": "size-13",
    "quantityOnHand": 31,
    "quantityReserved": 0,
    "quantityAvailable": 31
  },
  {
    "sizeId": "size-14",
    "quantityOnHand": 11,
    "quantityReserved": 0,
    "quantityAvailable": 11
  },
  {
    "sizeId": "size-15",
    "quantityOnHand": 13,
    "quantityReserved": 0,
    "quantityAvailable": 13
  },
  {
    "sizeId": "size-16",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-17",
    "quantityOnHand": 6,
    "quantityReserved": 0,
    "quantityAvailable": 6
  },
  {
    "sizeId": "size-18",
    "quantityOnHand": 62,
    "quantityReserved": 0,
    "quantityAvailable": 62
  },
  {
    "sizeId": "size-19",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-20",
    "quantityOnHand": 6,
    "quantityReserved": 0,
    "quantityAvailable": 6
  },
  {
    "sizeId": "size-21",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-22",
    "quantityOnHand": 1,
    "quantityReserved": 0,
    "quantityAvailable": 1
  },
  {
    "sizeId": "size-23",
    "quantityOnHand": 21,
    "quantityReserved": 0,
    "quantityAvailable": 21
  },
  {
    "sizeId": "size-24",
    "quantityOnHand": 203,
    "quantityReserved": 0,
    "quantityAvailable": 203
  },
  {
    "sizeId": "size-25",
    "quantityOnHand": 43,
    "quantityReserved": 0,
    "quantityAvailable": 43
  },
  {
    "sizeId": "size-26",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-27",
    "quantityOnHand": 10,
    "quantityReserved": 0,
    "quantityAvailable": 10
  },
  {
    "sizeId": "size-28",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-29",
    "quantityOnHand": 8,
    "quantityReserved": 0,
    "quantityAvailable": 8
  },
  {
    "sizeId": "size-30",
    "quantityOnHand": 12,
    "quantityReserved": 0,
    "quantityAvailable": 12
  },
  {
    "sizeId": "size-31",
    "quantityOnHand": 15,
    "quantityReserved": 0,
    "quantityAvailable": 15
  },
  {
    "sizeId": "size-32",
    "quantityOnHand": 18,
    "quantityReserved": 0,
    "quantityAvailable": 18
  },
  {
    "sizeId": "size-33",
    "quantityOnHand": 20,
    "quantityReserved": 0,
    "quantityAvailable": 20
  },
  {
    "sizeId": "size-34",
    "quantityOnHand": 34,
    "quantityReserved": 0,
    "quantityAvailable": 34
  },
  {
    "sizeId": "size-35",
    "quantityOnHand": 35,
    "quantityReserved": 0,
    "quantityAvailable": 35
  },
  {
    "sizeId": "size-36",
    "quantityOnHand": 51,
    "quantityReserved": 0,
    "quantityAvailable": 51
  },
  {
    "sizeId": "size-37",
    "quantityOnHand": 24,
    "quantityReserved": 0,
    "quantityAvailable": 24
  },
  {
    "sizeId": "size-38",
    "quantityOnHand": 44,
    "quantityReserved": 0,
    "quantityAvailable": 44
  },
  {
    "sizeId": "size-39",
    "quantityOnHand": 35,
    "quantityReserved": 0,
    "quantityAvailable": 35
  },
  {
    "sizeId": "size-40",
    "quantityOnHand": 17,
    "quantityReserved": 0,
    "quantityAvailable": 17
  },
  {
    "sizeId": "size-41",
    "quantityOnHand": 19,
    "quantityReserved": 0,
    "quantityAvailable": 19
  },
  {
    "sizeId": "size-42",
    "quantityOnHand": 12,
    "quantityReserved": 0,
    "quantityAvailable": 12
  },
  {
    "sizeId": "size-43",
    "quantityOnHand": 20,
    "quantityReserved": 0,
    "quantityAvailable": 20
  },
  {
    "sizeId": "size-44",
    "quantityOnHand": 40,
    "quantityReserved": 0,
    "quantityAvailable": 40
  },
  {
    "sizeId": "size-45",
    "quantityOnHand": 23,
    "quantityReserved": 0,
    "quantityAvailable": 23
  },
  {
    "sizeId": "size-46",
    "quantityOnHand": 10,
    "quantityReserved": 0,
    "quantityAvailable": 10
  },
  {
    "sizeId": "size-47",
    "quantityOnHand": 34,
    "quantityReserved": 0,
    "quantityAvailable": 34
  },
  {
    "sizeId": "size-48",
    "quantityOnHand": 16,
    "quantityReserved": 0,
    "quantityAvailable": 16
  },
  {
    "sizeId": "size-49",
    "quantityOnHand": 21,
    "quantityReserved": 0,
    "quantityAvailable": 21
  },
  {
    "sizeId": "size-50",
    "quantityOnHand": 33,
    "quantityReserved": 0,
    "quantityAvailable": 33
  },
  {
    "sizeId": "size-51",
    "quantityOnHand": 32,
    "quantityReserved": 0,
    "quantityAvailable": 32
  },
  {
    "sizeId": "size-52",
    "quantityOnHand": 35,
    "quantityReserved": 0,
    "quantityAvailable": 35
  },
  {
    "sizeId": "size-53",
    "quantityOnHand": 5,
    "quantityReserved": 0,
    "quantityAvailable": 5
  },
  {
    "sizeId": "size-54",
    "quantityOnHand": 63,
    "quantityReserved": 0,
    "quantityAvailable": 63
  },
  {
    "sizeId": "size-55",
    "quantityOnHand": 23,
    "quantityReserved": 0,
    "quantityAvailable": 23
  },
  {
    "sizeId": "size-56",
    "quantityOnHand": 20,
    "quantityReserved": 0,
    "quantityAvailable": 20
  },
  {
    "sizeId": "size-57",
    "quantityOnHand": 14,
    "quantityReserved": 0,
    "quantityAvailable": 14
  },
  {
    "sizeId": "size-58",
    "quantityOnHand": 20,
    "quantityReserved": 0,
    "quantityAvailable": 20
  },
  {
    "sizeId": "size-59",
    "quantityOnHand": 15,
    "quantityReserved": 0,
    "quantityAvailable": 15
  },
  {
    "sizeId": "size-60",
    "quantityOnHand": 12,
    "quantityReserved": 0,
    "quantityAvailable": 12
  },
  {
    "sizeId": "size-61",
    "quantityOnHand": 12,
    "quantityReserved": 0,
    "quantityAvailable": 12
  },
  {
    "sizeId": "size-62",
    "quantityOnHand": 12,
    "quantityReserved": 0,
    "quantityAvailable": 12
  },
  {
    "sizeId": "size-63",
    "quantityOnHand": 11,
    "quantityReserved": 0,
    "quantityAvailable": 11
  },
  {
    "sizeId": "size-64",
    "quantityOnHand": 12,
    "quantityReserved": 0,
    "quantityAvailable": 12
  },
  {
    "sizeId": "size-65",
    "quantityOnHand": 13,
    "quantityReserved": 0,
    "quantityAvailable": 13
  },
  {
    "sizeId": "size-66",
    "quantityOnHand": 4,
    "quantityReserved": 0,
    "quantityAvailable": 4
  },
  {
    "sizeId": "size-67",
    "quantityOnHand": 12,
    "quantityReserved": 0,
    "quantityAvailable": 12
  },
  {
    "sizeId": "size-68",
    "quantityOnHand": 9,
    "quantityReserved": 0,
    "quantityAvailable": 9
  },
  {
    "sizeId": "size-69",
    "quantityOnHand": 24,
    "quantityReserved": 0,
    "quantityAvailable": 24
  },
  {
    "sizeId": "size-70",
    "quantityOnHand": 14,
    "quantityReserved": 0,
    "quantityAvailable": 14
  },
  {
    "sizeId": "size-71",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-72",
    "quantityOnHand": 8,
    "quantityReserved": 0,
    "quantityAvailable": 8
  },
  {
    "sizeId": "size-73",
    "quantityOnHand": 37,
    "quantityReserved": 0,
    "quantityAvailable": 37
  },
  {
    "sizeId": "size-74",
    "quantityOnHand": 5,
    "quantityReserved": 0,
    "quantityAvailable": 5
  },
  {
    "sizeId": "size-75",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-76",
    "quantityOnHand": 16,
    "quantityReserved": 0,
    "quantityAvailable": 16
  },
  {
    "sizeId": "size-77",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-78",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-79",
    "quantityOnHand": 27,
    "quantityReserved": 0,
    "quantityAvailable": 27
  },
  {
    "sizeId": "size-80",
    "quantityOnHand": 25,
    "quantityReserved": 0,
    "quantityAvailable": 25
  },
  {
    "sizeId": "size-81",
    "quantityOnHand": 10,
    "quantityReserved": 0,
    "quantityAvailable": 10
  },
  {
    "sizeId": "size-82",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-83",
    "quantityOnHand": 18,
    "quantityReserved": 0,
    "quantityAvailable": 18
  },
  {
    "sizeId": "size-84",
    "quantityOnHand": 66,
    "quantityReserved": 0,
    "quantityAvailable": 66
  },
  {
    "sizeId": "size-85",
    "quantityOnHand": 319,
    "quantityReserved": 0,
    "quantityAvailable": 319
  },
  {
    "sizeId": "size-86",
    "quantityOnHand": 302,
    "quantityReserved": 0,
    "quantityAvailable": 302
  },
  {
    "sizeId": "size-87",
    "quantityOnHand": 234,
    "quantityReserved": 0,
    "quantityAvailable": 234
  },
  {
    "sizeId": "size-88",
    "quantityOnHand": 15,
    "quantityReserved": 0,
    "quantityAvailable": 15
  },
  {
    "sizeId": "size-89",
    "quantityOnHand": 86,
    "quantityReserved": 0,
    "quantityAvailable": 86
  },
  {
    "sizeId": "size-90",
    "quantityOnHand": 66,
    "quantityReserved": 0,
    "quantityAvailable": 66
  },
  {
    "sizeId": "size-91",
    "quantityOnHand": 62,
    "quantityReserved": 0,
    "quantityAvailable": 62
  },
  {
    "sizeId": "size-92",
    "quantityOnHand": 89,
    "quantityReserved": 0,
    "quantityAvailable": 89
  },
  {
    "sizeId": "size-93",
    "quantityOnHand": 214,
    "quantityReserved": 0,
    "quantityAvailable": 214
  },
  {
    "sizeId": "size-94",
    "quantityOnHand": 131,
    "quantityReserved": 0,
    "quantityAvailable": 131
  },
  {
    "sizeId": "size-95",
    "quantityOnHand": 79,
    "quantityReserved": 0,
    "quantityAvailable": 79
  },
  {
    "sizeId": "size-96",
    "quantityOnHand": 108,
    "quantityReserved": 0,
    "quantityAvailable": 108
  },
  {
    "sizeId": "size-97",
    "quantityOnHand": 33,
    "quantityReserved": 0,
    "quantityAvailable": 33
  },
  {
    "sizeId": "size-98",
    "quantityOnHand": 19,
    "quantityReserved": 0,
    "quantityAvailable": 19
  },
  {
    "sizeId": "size-99",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-100",
    "quantityOnHand": 11,
    "quantityReserved": 0,
    "quantityAvailable": 11
  },
  {
    "sizeId": "size-101",
    "quantityOnHand": 32,
    "quantityReserved": 0,
    "quantityAvailable": 32
  },
  {
    "sizeId": "size-102",
    "quantityOnHand": 21,
    "quantityReserved": 0,
    "quantityAvailable": 21
  },
  {
    "sizeId": "size-103",
    "quantityOnHand": 12,
    "quantityReserved": 0,
    "quantityAvailable": 12
  },
  {
    "sizeId": "size-104",
    "quantityOnHand": 25,
    "quantityReserved": 0,
    "quantityAvailable": 25
  },
  {
    "sizeId": "size-105",
    "quantityOnHand": 15,
    "quantityReserved": 0,
    "quantityAvailable": 15
  },
  {
    "sizeId": "size-106",
    "quantityOnHand": 8,
    "quantityReserved": 0,
    "quantityAvailable": 8
  },
  {
    "sizeId": "size-107",
    "quantityOnHand": 15,
    "quantityReserved": 0,
    "quantityAvailable": 15
  },
  {
    "sizeId": "size-108",
    "quantityOnHand": 17,
    "quantityReserved": 0,
    "quantityAvailable": 17
  },
  {
    "sizeId": "size-109",
    "quantityOnHand": 29,
    "quantityReserved": 0,
    "quantityAvailable": 29
  },
  {
    "sizeId": "size-110",
    "quantityOnHand": 17,
    "quantityReserved": 0,
    "quantityAvailable": 17
  },
  {
    "sizeId": "size-111",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-112",
    "quantityOnHand": 5,
    "quantityReserved": 0,
    "quantityAvailable": 5
  },
  {
    "sizeId": "size-113",
    "quantityOnHand": 7,
    "quantityReserved": 0,
    "quantityAvailable": 7
  },
  {
    "sizeId": "size-114",
    "quantityOnHand": 1,
    "quantityReserved": 0,
    "quantityAvailable": 1
  },
  {
    "sizeId": "size-115",
    "quantityOnHand": 2,
    "quantityReserved": 0,
    "quantityAvailable": 2
  },
  {
    "sizeId": "size-116",
    "quantityOnHand": 2,
    "quantityReserved": 0,
    "quantityAvailable": 2
  },
  {
    "sizeId": "size-117",
    "quantityOnHand": 27,
    "quantityReserved": 0,
    "quantityAvailable": 27
  },
  {
    "sizeId": "size-118",
    "quantityOnHand": 2,
    "quantityReserved": 0,
    "quantityAvailable": 2
  },
  {
    "sizeId": "size-119",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-120",
    "quantityOnHand": 31,
    "quantityReserved": 0,
    "quantityAvailable": 31
  },
  {
    "sizeId": "size-121",
    "quantityOnHand": 41,
    "quantityReserved": 0,
    "quantityAvailable": 41
  },
  {
    "sizeId": "size-122",
    "quantityOnHand": 22,
    "quantityReserved": 0,
    "quantityAvailable": 22
  },
  {
    "sizeId": "size-123",
    "quantityOnHand": 30,
    "quantityReserved": 0,
    "quantityAvailable": 30
  },
  {
    "sizeId": "size-124",
    "quantityOnHand": 30,
    "quantityReserved": 0,
    "quantityAvailable": 30
  },
  {
    "sizeId": "size-125",
    "quantityOnHand": 30,
    "quantityReserved": 0,
    "quantityAvailable": 30
  },
  {
    "sizeId": "size-126",
    "quantityOnHand": 47,
    "quantityReserved": 0,
    "quantityAvailable": 47
  },
  {
    "sizeId": "size-127",
    "quantityOnHand": 30,
    "quantityReserved": 0,
    "quantityAvailable": 30
  },
  {
    "sizeId": "size-128",
    "quantityOnHand": 42,
    "quantityReserved": 0,
    "quantityAvailable": 42
  },
  {
    "sizeId": "size-129",
    "quantityOnHand": 73,
    "quantityReserved": 0,
    "quantityAvailable": 73
  },
  {
    "sizeId": "size-130",
    "quantityOnHand": 36,
    "quantityReserved": 0,
    "quantityAvailable": 36
  },
  {
    "sizeId": "size-131",
    "quantityOnHand": 4,
    "quantityReserved": 0,
    "quantityAvailable": 4
  },
  {
    "sizeId": "size-132",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-133",
    "quantityOnHand": 4,
    "quantityReserved": 0,
    "quantityAvailable": 4
  },
  {
    "sizeId": "size-134",
    "quantityOnHand": 10,
    "quantityReserved": 0,
    "quantityAvailable": 10
  },
  {
    "sizeId": "size-135",
    "quantityOnHand": 1,
    "quantityReserved": 0,
    "quantityAvailable": 1
  },
  {
    "sizeId": "size-136",
    "quantityOnHand": 57,
    "quantityReserved": 0,
    "quantityAvailable": 57
  },
  {
    "sizeId": "size-137",
    "quantityOnHand": 77,
    "quantityReserved": 0,
    "quantityAvailable": 77
  },
  {
    "sizeId": "size-138",
    "quantityOnHand": 130,
    "quantityReserved": 0,
    "quantityAvailable": 130
  },
  {
    "sizeId": "size-139",
    "quantityOnHand": 20,
    "quantityReserved": 0,
    "quantityAvailable": 20
  },
  {
    "sizeId": "size-140",
    "quantityOnHand": 28,
    "quantityReserved": 0,
    "quantityAvailable": 28
  },
  {
    "sizeId": "size-141",
    "quantityOnHand": 68,
    "quantityReserved": 0,
    "quantityAvailable": 68
  },
  {
    "sizeId": "size-142",
    "quantityOnHand": 61,
    "quantityReserved": 0,
    "quantityAvailable": 61
  },
  {
    "sizeId": "size-143",
    "quantityOnHand": 15,
    "quantityReserved": 0,
    "quantityAvailable": 15
  },
  {
    "sizeId": "size-144",
    "quantityOnHand": 19,
    "quantityReserved": 0,
    "quantityAvailable": 19
  },
  {
    "sizeId": "size-145",
    "quantityOnHand": 1,
    "quantityReserved": 0,
    "quantityAvailable": 1
  },
  {
    "sizeId": "size-146",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-147",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-148",
    "quantityOnHand": 22,
    "quantityReserved": 0,
    "quantityAvailable": 22
  },
  {
    "sizeId": "size-149",
    "quantityOnHand": 48,
    "quantityReserved": 0,
    "quantityAvailable": 48
  },
  {
    "sizeId": "size-150",
    "quantityOnHand": 22,
    "quantityReserved": 0,
    "quantityAvailable": 22
  },
  {
    "sizeId": "size-151",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-152",
    "quantityOnHand": 13,
    "quantityReserved": 0,
    "quantityAvailable": 13
  },
  {
    "sizeId": "size-153",
    "quantityOnHand": 41,
    "quantityReserved": 0,
    "quantityAvailable": 41
  },
  {
    "sizeId": "size-154",
    "quantityOnHand": 23,
    "quantityReserved": 0,
    "quantityAvailable": 23
  },
  {
    "sizeId": "size-155",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-156",
    "quantityOnHand": 29,
    "quantityReserved": 0,
    "quantityAvailable": 29
  },
  {
    "sizeId": "size-157",
    "quantityOnHand": 15,
    "quantityReserved": 0,
    "quantityAvailable": 15
  },
  {
    "sizeId": "size-158",
    "quantityOnHand": 12,
    "quantityReserved": 0,
    "quantityAvailable": 12
  },
  {
    "sizeId": "size-159",
    "quantityOnHand": 20,
    "quantityReserved": 0,
    "quantityAvailable": 20
  },
  {
    "sizeId": "size-160",
    "quantityOnHand": 6,
    "quantityReserved": 0,
    "quantityAvailable": 6
  },
  {
    "sizeId": "size-161",
    "quantityOnHand": 28,
    "quantityReserved": 0,
    "quantityAvailable": 28
  },
  {
    "sizeId": "size-162",
    "quantityOnHand": 13,
    "quantityReserved": 0,
    "quantityAvailable": 13
  },
  {
    "sizeId": "size-163",
    "quantityOnHand": 14,
    "quantityReserved": 0,
    "quantityAvailable": 14
  },
  {
    "sizeId": "size-164",
    "quantityOnHand": 9,
    "quantityReserved": 0,
    "quantityAvailable": 9
  },
  {
    "sizeId": "size-165",
    "quantityOnHand": 7,
    "quantityReserved": 0,
    "quantityAvailable": 7
  },
  {
    "sizeId": "size-166",
    "quantityOnHand": 110,
    "quantityReserved": 0,
    "quantityAvailable": 110
  },
  {
    "sizeId": "size-167",
    "quantityOnHand": 46,
    "quantityReserved": 0,
    "quantityAvailable": 46
  },
  {
    "sizeId": "size-168",
    "quantityOnHand": 456,
    "quantityReserved": 0,
    "quantityAvailable": 456
  },
  {
    "sizeId": "size-169",
    "quantityOnHand": 113,
    "quantityReserved": 0,
    "quantityAvailable": 113
  },
  {
    "sizeId": "size-170",
    "quantityOnHand": 88,
    "quantityReserved": 0,
    "quantityAvailable": 88
  },
  {
    "sizeId": "size-171",
    "quantityOnHand": 4,
    "quantityReserved": 0,
    "quantityAvailable": 4
  },
  {
    "sizeId": "size-172",
    "quantityOnHand": 59,
    "quantityReserved": 0,
    "quantityAvailable": 59
  },
  {
    "sizeId": "size-173",
    "quantityOnHand": 188,
    "quantityReserved": 0,
    "quantityAvailable": 188
  },
  {
    "sizeId": "size-174",
    "quantityOnHand": 41,
    "quantityReserved": 0,
    "quantityAvailable": 41
  },
  {
    "sizeId": "size-175",
    "quantityOnHand": 378,
    "quantityReserved": 0,
    "quantityAvailable": 378
  },
  {
    "sizeId": "size-176",
    "quantityOnHand": 15,
    "quantityReserved": 0,
    "quantityAvailable": 15
  },
  {
    "sizeId": "size-177",
    "quantityOnHand": 50,
    "quantityReserved": 0,
    "quantityAvailable": 50
  },
  {
    "sizeId": "size-178",
    "quantityOnHand": 70,
    "quantityReserved": 0,
    "quantityAvailable": 70
  },
  {
    "sizeId": "size-179",
    "quantityOnHand": 8,
    "quantityReserved": 0,
    "quantityAvailable": 8
  },
  {
    "sizeId": "size-180",
    "quantityOnHand": 63,
    "quantityReserved": 0,
    "quantityAvailable": 63
  },
  {
    "sizeId": "size-181",
    "quantityOnHand": 38,
    "quantityReserved": 0,
    "quantityAvailable": 38
  },
  {
    "sizeId": "size-182",
    "quantityOnHand": 4,
    "quantityReserved": 0,
    "quantityAvailable": 4
  },
  {
    "sizeId": "size-183",
    "quantityOnHand": 2,
    "quantityReserved": 0,
    "quantityAvailable": 2
  },
  {
    "sizeId": "size-184",
    "quantityOnHand": 12,
    "quantityReserved": 0,
    "quantityAvailable": 12
  },
  {
    "sizeId": "size-185",
    "quantityOnHand": 17,
    "quantityReserved": 0,
    "quantityAvailable": 17
  },
  {
    "sizeId": "size-186",
    "quantityOnHand": 2,
    "quantityReserved": 0,
    "quantityAvailable": 2
  },
  {
    "sizeId": "size-187",
    "quantityOnHand": 7,
    "quantityReserved": 0,
    "quantityAvailable": 7
  },
  {
    "sizeId": "size-188",
    "quantityOnHand": 7,
    "quantityReserved": 0,
    "quantityAvailable": 7
  },
  {
    "sizeId": "size-189",
    "quantityOnHand": 10,
    "quantityReserved": 0,
    "quantityAvailable": 10
  },
  {
    "sizeId": "size-190",
    "quantityOnHand": 10,
    "quantityReserved": 0,
    "quantityAvailable": 10
  },
  {
    "sizeId": "size-191",
    "quantityOnHand": 11,
    "quantityReserved": 0,
    "quantityAvailable": 11
  },
  {
    "sizeId": "size-192",
    "quantityOnHand": 8,
    "quantityReserved": 0,
    "quantityAvailable": 8
  },
  {
    "sizeId": "size-193",
    "quantityOnHand": 11,
    "quantityReserved": 0,
    "quantityAvailable": 11
  },
  {
    "sizeId": "size-194",
    "quantityOnHand": 60,
    "quantityReserved": 0,
    "quantityAvailable": 60
  },
  {
    "sizeId": "size-195",
    "quantityOnHand": 88,
    "quantityReserved": 0,
    "quantityAvailable": 88
  },
  {
    "sizeId": "size-196",
    "quantityOnHand": 169,
    "quantityReserved": 0,
    "quantityAvailable": 169
  },
  {
    "sizeId": "size-197",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-198",
    "quantityOnHand": 2,
    "quantityReserved": 0,
    "quantityAvailable": 2
  },
  {
    "sizeId": "size-199",
    "quantityOnHand": 47,
    "quantityReserved": 0,
    "quantityAvailable": 47
  },
  {
    "sizeId": "size-200",
    "quantityOnHand": 473,
    "quantityReserved": 0,
    "quantityAvailable": 473
  },
  {
    "sizeId": "size-201",
    "quantityOnHand": 4,
    "quantityReserved": 0,
    "quantityAvailable": 4
  },
  {
    "sizeId": "size-202",
    "quantityOnHand": 38,
    "quantityReserved": 0,
    "quantityAvailable": 38
  },
  {
    "sizeId": "size-203",
    "quantityOnHand": 377,
    "quantityReserved": 0,
    "quantityAvailable": 377
  },
  {
    "sizeId": "size-204",
    "quantityOnHand": 126,
    "quantityReserved": 0,
    "quantityAvailable": 126
  },
  {
    "sizeId": "size-205",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-206",
    "quantityOnHand": 226,
    "quantityReserved": 0,
    "quantityAvailable": 226
  },
  {
    "sizeId": "size-207",
    "quantityOnHand": 1276,
    "quantityReserved": 0,
    "quantityAvailable": 1276
  },
  {
    "sizeId": "size-208",
    "quantityOnHand": 688,
    "quantityReserved": 0,
    "quantityAvailable": 688
  },
  {
    "sizeId": "size-209",
    "quantityOnHand": 477,
    "quantityReserved": 0,
    "quantityAvailable": 477
  },
  {
    "sizeId": "size-210",
    "quantityOnHand": 9,
    "quantityReserved": 0,
    "quantityAvailable": 9
  },
  {
    "sizeId": "size-211",
    "quantityOnHand": 15,
    "quantityReserved": 0,
    "quantityAvailable": 15
  },
  {
    "sizeId": "size-212",
    "quantityOnHand": 10,
    "quantityReserved": 0,
    "quantityAvailable": 10
  },
  {
    "sizeId": "size-213",
    "quantityOnHand": 16,
    "quantityReserved": 0,
    "quantityAvailable": 16
  },
  {
    "sizeId": "size-214",
    "quantityOnHand": 43,
    "quantityReserved": 0,
    "quantityAvailable": 43
  },
  {
    "sizeId": "size-215",
    "quantityOnHand": 28,
    "quantityReserved": 0,
    "quantityAvailable": 28
  },
  {
    "sizeId": "size-216",
    "quantityOnHand": 1,
    "quantityReserved": 0,
    "quantityAvailable": 1
  },
  {
    "sizeId": "size-217",
    "quantityOnHand": 1,
    "quantityReserved": 0,
    "quantityAvailable": 1
  },
  {
    "sizeId": "size-218",
    "quantityOnHand": 1,
    "quantityReserved": 0,
    "quantityAvailable": 1
  },
  {
    "sizeId": "size-219",
    "quantityOnHand": 1,
    "quantityReserved": 0,
    "quantityAvailable": 1
  },
  {
    "sizeId": "size-220",
    "quantityOnHand": 2,
    "quantityReserved": 0,
    "quantityAvailable": 2
  },
  {
    "sizeId": "size-221",
    "quantityOnHand": 1,
    "quantityReserved": 0,
    "quantityAvailable": 1
  },
  {
    "sizeId": "size-222",
    "quantityOnHand": 5,
    "quantityReserved": 0,
    "quantityAvailable": 5
  },
  {
    "sizeId": "size-223",
    "quantityOnHand": 2,
    "quantityReserved": 0,
    "quantityAvailable": 2
  },
  {
    "sizeId": "size-224",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-225",
    "quantityOnHand": 2,
    "quantityReserved": 0,
    "quantityAvailable": 2
  },
  {
    "sizeId": "size-226",
    "quantityOnHand": 4,
    "quantityReserved": 0,
    "quantityAvailable": 4
  },
  {
    "sizeId": "size-227",
    "quantityOnHand": 2,
    "quantityReserved": 0,
    "quantityAvailable": 2
  },
  {
    "sizeId": "size-228",
    "quantityOnHand": 4,
    "quantityReserved": 0,
    "quantityAvailable": 4
  },
  {
    "sizeId": "size-229",
    "quantityOnHand": 4,
    "quantityReserved": 0,
    "quantityAvailable": 4
  },
  {
    "sizeId": "size-230",
    "quantityOnHand": 2,
    "quantityReserved": 0,
    "quantityAvailable": 2
  },
  {
    "sizeId": "size-231",
    "quantityOnHand": 1,
    "quantityReserved": 0,
    "quantityAvailable": 1
  },
  {
    "sizeId": "size-232",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-233",
    "quantityOnHand": 0,
    "quantityReserved": 0,
    "quantityAvailable": 0
  },
  {
    "sizeId": "size-234",
    "quantityOnHand": 1,
    "quantityReserved": 0,
    "quantityAvailable": 1
  },
  {
    "sizeId": "size-235",
    "quantityOnHand": 42,
    "quantityReserved": 0,
    "quantityAvailable": 42
  },
  {
    "sizeId": "size-236",
    "quantityOnHand": 120,
    "quantityReserved": 0,
    "quantityAvailable": 120
  }
];

// ==============================================
// SAMPLE USERS (for testing)
// ==============================================
export const users: User[] = [
  {
    "id": "user-1",
    "email": "admin@lacounty.gov",
    "firstName": "Admin",
    "lastName": "User",
    "role": "WarehouseAdmin",
    "isActive": true,
    "sizes": {},
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  {
    "id": "user-2",
    "email": "warehouse@lacounty.gov",
    "firstName": "Warehouse",
    "lastName": "Staff",
    "role": "WarehouseStaff",
    "isActive": true,
    "sizes": {},
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  {
    "id": "user-3",
    "email": "member@lacounty.gov",
    "firstName": "Team",
    "lastName": "Member",
    "role": "TeamMember",
    "isActive": true,
    "sizes": {
      "shirt": "Large",
      "pantsWaist": "34",
      "pantsInseam": "32",
      "bootSize": "10.5"
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
];

// ==============================================
// SAMPLE VENDORS
// ==============================================
export const vendors: Vendor[] = [
  {
    "id": "vendor-1",
    "name": "5.11 Tactical",
    "email": "orders@511tactical.com",
    "isActive": true
  },
  {
    "id": "vendor-2",
    "name": "Tru-Spec",
    "email": "orders@truspec.com",
    "isActive": true
  },
  {
    "id": "vendor-3",
    "name": "Galls",
    "email": "orders@galls.com",
    "isActive": true
  },
  {
    "id": "vendor-4",
    "name": "LA Police Gear",
    "email": "orders@lapolicegear.com",
    "isActive": true
  }
];

// ==============================================
// REQUESTS & PURCHASE ORDERS (empty - start fresh)
// ==============================================
export const requests: Request[] = [];
export const purchaseOrders: PurchaseOrder[] = [];

// ==============================================
// HELPER: Build denormalized catalog view
// ==============================================
export function buildCatalog() {
  return sizes.map(size => {
    const variant = variants.find(v => v.id === size.variantId)!;
    const itemType = itemTypes.find(it => it.id === variant.itemTypeId)!;
    const category = categories.find(c => c.id === itemType.categoryId)!;
    const inv = inventory.find(i => i.sizeId === size.id);
    
    return {
      categoryId: category.id,
      categoryName: category.name,
      itemTypeId: itemType.id,
      itemTypeName: itemType.name,
      femaCode: itemType.femaCode,
      isConsumable: itemType.isConsumable,
      variantId: variant.id,
      variantName: variant.name,
      manufacturer: variant.manufacturer,
      sizeId: size.id,
      sizeName: size.name,
      quantityOnHand: inv?.quantityOnHand ?? 0,
      quantityReserved: inv?.quantityReserved ?? 0,
      quantityAvailable: inv?.quantityAvailable ?? 0,
    };
  });
}
