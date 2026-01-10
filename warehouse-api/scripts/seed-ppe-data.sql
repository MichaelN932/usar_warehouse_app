-- =====================================================
-- PPE Inventory Seed Data
-- =====================================================
-- Auto-generated from ppe_inventory_USAR_OPTIMIZED.xlsx
-- Generated: 2026-01-09T15:57:37.753Z
--
-- Categories: 13
-- Item Types: 83
-- Variants: 83
-- Sizes: 265
-- Inventory Records: 265
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
PRINT 'Inserting 13 categories...';

IF NOT EXISTS (SELECT 1 FROM Categories WHERE id = N'cat-clothing')
    INSERT INTO Categories (id, name, sortOrder, isActive) VALUES (N'cat-clothing', N'Clothing', 10, 1);
IF NOT EXISTS (SELECT 1 FROM Categories WHERE id = N'cat-footwear')
    INSERT INTO Categories (id, name, sortOrder, isActive) VALUES (N'cat-footwear', N'Footwear', 20, 1);
IF NOT EXISTS (SELECT 1 FROM Categories WHERE id = N'cat-gloves')
    INSERT INTO Categories (id, name, sortOrder, isActive) VALUES (N'cat-gloves', N'Gloves', 30, 1);
IF NOT EXISTS (SELECT 1 FROM Categories WHERE id = N'cat-head-protection')
    INSERT INTO Categories (id, name, sortOrder, isActive) VALUES (N'cat-head-protection', N'Head Protection', 40, 1);
IF NOT EXISTS (SELECT 1 FROM Categories WHERE id = N'cat-headwear')
    INSERT INTO Categories (id, name, sortOrder, isActive) VALUES (N'cat-headwear', N'Headwear', 50, 1);
IF NOT EXISTS (SELECT 1 FROM Categories WHERE id = N'cat-medical')
    INSERT INTO Categories (id, name, sortOrder, isActive) VALUES (N'cat-medical', N'Medical', 60, 1);
IF NOT EXISTS (SELECT 1 FROM Categories WHERE id = N'cat-packs-bags')
    INSERT INTO Categories (id, name, sortOrder, isActive) VALUES (N'cat-packs-bags', N'Packs & Bags', 70, 1);
IF NOT EXISTS (SELECT 1 FROM Categories WHERE id = N'cat-patches')
    INSERT INTO Categories (id, name, sortOrder, isActive) VALUES (N'cat-patches', N'Patches', 80, 1);
IF NOT EXISTS (SELECT 1 FROM Categories WHERE id = N'cat-personal-care')
    INSERT INTO Categories (id, name, sortOrder, isActive) VALUES (N'cat-personal-care', N'Personal Care', 90, 1);
IF NOT EXISTS (SELECT 1 FROM Categories WHERE id = N'cat-references')
    INSERT INTO Categories (id, name, sortOrder, isActive) VALUES (N'cat-references', N'References', 100, 1);
IF NOT EXISTS (SELECT 1 FROM Categories WHERE id = N'cat-safety-protection')
    INSERT INTO Categories (id, name, sortOrder, isActive) VALUES (N'cat-safety-protection', N'Safety & Protection', 110, 1);
IF NOT EXISTS (SELECT 1 FROM Categories WHERE id = N'cat-sleep-system')
    INSERT INTO Categories (id, name, sortOrder, isActive) VALUES (N'cat-sleep-system', N'Sleep System', 120, 1);
IF NOT EXISTS (SELECT 1 FROM Categories WHERE id = N'cat-tools-lighting')
    INSERT INTO Categories (id, name, sortOrder, isActive) VALUES (N'cat-tools-lighting', N'Tools & Lighting', 130, 1);

-- =====================================================
-- Insert Item Types
-- =====================================================
PRINT 'Inserting 83 item types...';

IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-1')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-1', N'cat-clothing', N'CMC Cobra-D Uniform Rappel Belt', N'BDUs', N'Accessories', N'CA-TF2', N'LG-0112.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-2')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-2', N'cat-clothing', N'Tru-Spec BDU Shorts', N'BDUs', N'Bottoms', N'CA-TF2', N'LG-0120.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-3')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-3', N'cat-clothing', N'Tru-Spec BDU Pants', N'BDUs', N'Bottoms', N'CA-TF2', N'LG-0112.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-4')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-4', N'cat-clothing', N'5.11 Stryke EMS Pants', N'BDUs', N'Bottoms', N'CA-TF2', N'LG-0112.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-5')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-5', N'cat-clothing', N'5.11 Stryke TDU Blouse', N'BDUs', N'Tops', N'CA-TF2', N'LG-0112.01', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-6')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-6', N'cat-clothing', N'Tru-Spec BDU Blouse', N'BDUs', N'Tops', N'CA-TF2', N'LG-0112.01', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-7')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-7', N'cat-clothing', N'Tru-Spec Gen-III ECWS Level 2', N'Base Layers', N'Bottoms', N'CA-TF2', N'LG-0122.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-8')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-8', N'cat-clothing', N'Tru-Spec Gen-III ECWS Level 2', N'Base Layers', N'Tops', N'CA-TF2', N'LG-0122.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-9')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-9', N'cat-clothing', N'5.11 3-IN-1 Parka', N'Outerwear', N'Parkas', N'CA-TF2', N'LG-0122.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-10')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-10', N'cat-clothing', N'Tru-Spec Rain Shell Pant', N'Outerwear', N'Rain Gear', N'CA-TF2', N'LG-0110.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-11')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-11', N'cat-clothing', N'5.11 Performance', N'Polos - CA-TF2', N'Long Sleeve', N'CA-TF2', N'ITEM-0112', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-12')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-12', N'cat-clothing', N'5.11 Performance', N'Polos - CA-TF2', N'Short Sleeve', N'CA-TF2', N'ITEM-0105', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-13')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-13', N'cat-clothing', N'Hanes Cotton Blend', N'Polos - USAID', N'Short Sleeve', N'USAID', N'ITEM-0098', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-14')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-14', N'cat-clothing', N'Gildan Dry Blend 50/50 Poly/Cotton', N'T-Shirts - CA-TF2', N'Long Sleeve', N'CA-TF2', N'LG-0125.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-15')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-15', N'cat-clothing', N'Gildan Dry Blend 50/50 Poly/Cotton', N'T-Shirts - CA-TF2', N'Short Sleeve', N'CA-TF2', N'LG-0120.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-16')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-16', N'cat-clothing', N'Gildan Dry Blend 50/50 Poly/Cotton', N'T-Shirts - USAID', N'Long Sleeve', N'USAID', N'LG-0125.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-17')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-17', N'cat-clothing', N'Gildan Dry Blend 50/50 Poly/Cotton', N'T-Shirts - USAID', N'Short Sleeve', N'USAID', N'LG-0125.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-18')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-18', N'cat-clothing', N'Anetik Premium Performance UPF 30+', N'Water Ops', N'Shirts', N'CA-TF2', N'ITEM-0127', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-19')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-19', N'cat-clothing', N'Florence Marine X F1 Cordura Utility Short', N'Water Ops', N'Shorts', N'CA-TF2', N'LG-0135.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-20')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-20', N'cat-clothing', N'HippyTree Design Co. USAR Guard Boardshort (Custom)', N'Water Ops', N'Shorts', N'CA-TF2', N'LG-0135.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-21')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-21', N'cat-footwear', N'Outdoor Research Rocky Mountain High', N'Accessories', N'Gaiters', N'CA-TF2', N'LG-0110.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-22')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-22', N'cat-footwear', N'Rocky Alpha Force', N'Cold Weather Boots', N'Insulated', N'CA-TF2', N'LG-0122.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-23')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-23', N'cat-footwear', N'Globe Technical Rescue', N'Rescue Boots', N'Men''s', N'CA-TF2', N'LG-0102.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-24')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-24', N'cat-footwear', N'Globe Technical Rescue', N'Rescue Boots', N'Women''s', N'CA-TF2', N'LG-0102.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-25')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-25', N'cat-gloves', N'Mechanix Coldwork Peak', N'Cold Weather', N'Insulated', N'CA-TF2', N'LG-0122.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-26')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-26', N'cat-gloves', N'Mechanix Coldwork M-PACT', N'Cold Weather', N'Insulated', N'CA-TF2', N'LG-0122.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-27')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-27', N'cat-gloves', N'Shelby 2515', N'Rescue', N'Leather', N'CA-TF2', N'LG-0108.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-28')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-28', N'cat-gloves', N'Dragon Fire First-Due', N'Work', N'Leather', N'CA-TF2', N'LG-0108.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-29')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-29', N'cat-head-protection', N'Team Wendy SAR Comfort Pad Replacement Kit', N'Helmet Accessories', N'Comfort Pads', N'CA-TF2', N'LG-0105.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-30')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-30', N'cat-head-protection', N'ESS Profile Pivot', N'Helmet Accessories', N'Goggles', N'CA-TF2', N'LE-0111.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-31')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-31', N'cat-head-protection', N'Princeton Tec VIZ II', N'Helmet Accessories', N'Headlamps', N'CA-TF2', N'LG-0106.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-32')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-32', N'cat-head-protection', N'Team Wendy MAGPUL MOE 5-Slot Mounting Kit', N'Helmet Accessories', N'Rail Adapters', N'CA-TF2', N'LG-0105.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-33')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-33', N'cat-head-protection', N'Team Wendy SAR Replacement Vent Covers', N'Helmet Accessories', N'Vent Covers', N'CA-TF2', N'LG-0105.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-34')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-34', N'cat-head-protection', N'Team Wendy EXFIL SAR', N'Rescue Helmets', N'Blue', N'CA-TF2', N'LG-0105.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-35')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-35', N'cat-head-protection', N'Team Wendy EXFIL SAR', N'Rescue Helmets', N'Orange', N'CA-TF2', N'LG-0105.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-36')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-36', N'cat-head-protection', N'Team Wendy EXFIL SAR', N'Rescue Helmets', N'White', N'CA-TF2', N'LG-0105.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-37')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-37', N'cat-head-protection', N'Team Wendy EXFIL SAR', N'Rescue Helmets', N'Yellow', N'CA-TF2', N'LG-0105.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-38')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-38', N'cat-head-protection', N'NRS Water Rescue Helmet, White', N'Water Helmets', N'NRS', N'CA-TF2', N'WA-0101.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-39')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-39', N'cat-headwear', N'FlexFit 110 nu', N'Hats', N'Ball Caps', N'CA-TF2', N'LG-0101.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-40')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-40', N'cat-headwear', N'Blue Beanie, One Size', N'Hats', N'Beanies', N'CA-TF2', N'LG-0122.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-41')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-41', N'cat-headwear', N'Blue Boonie Hat, One Size', N'Hats', N'Boonie Hats', N'CA-TF2', N'LG-0101.01', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-42')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-42', N'cat-medical', N'North American Rescue Gloves', N'First Aid', N'IFAK', N'CA-TF2', N'MN-0158.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-43')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-43', N'cat-packs-bags', N'Wolf Pack Gear 24 Hour Pack', N'Backpacks', N'24-Hour', N'CA-TF2', N'LG-0118.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-44')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-44', N'cat-packs-bags', N'5.11 Rush 72', N'Backpacks', N'72-Hour', N'CA-TF2', N'LG-0118.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-45')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-45', N'cat-packs-bags', N'Red Forest Service bag for personal cold weather i', N'Gear Bags', N'Cold Weather', N'CA-TF2', N'LG-0118.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-46')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-46', N'cat-packs-bags', N'Wolf Pack Gear Load Bearing Harness', N'Load Bearing', N'Web Gear', N'CA-TF2', N'LG-0117.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-47')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-47', N'cat-packs-bags', N'USAID Web Gear Patch with Velcro', N'Load Bearing', N'Web Gear', N'CA-TF2', N'LG-0112.01', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-48')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-48', N'cat-packs-bags', N'Wolf Pack Gear Max Air Roller bag', N'Luggage', N'Roller Bags', N'CA-TF2', N'LG-0118.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-49')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-49', N'cat-packs-bags', N'Wolf Pack Gear Web Gear Bag', N'Luggage', N'Roller Bags', N'CA-TF2', N'LG-0118.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-50')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-50', N'cat-patches', N'US Flag Patch with Velcro', N'Flags', NULL, N'CA-TF2', N'LG-0112.01', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-51')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-51', N'cat-patches', N'CA-TF2 Rocker Patch with Velcro', N'Rockers', NULL, N'CA-TF2', N'LG-0112.01', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-52')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-52', N'cat-patches', N'USA-2 Rocker Patch with Velcro', N'Rockers', NULL, N'CA-TF2', N'LG-0112.01', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-53')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-53', N'cat-patches', N'USAID Shoulder Patch with Velcro', N'USAID', NULL, N'USAID', N'LG-0112.01', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-54')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-54', N'cat-patches', N'USAID BDU Back Patch with Velcro', N'USAID', NULL, N'USAID', N'LG-0112.01', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-55')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-55', N'cat-patches', N'Orange USAR Patch with Veclro', N'Unit', NULL, N'CA-TF2', N'LG-0112.01', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-56')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-56', N'cat-patches', N'CALOES Patch with Velcro', N'Unit', NULL, N'CA-TF2', N'LG-0112.01', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-57')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-57', N'cat-patches', N'LACoFD USAR BDU Back Pactch with Velcro', N'Unit', NULL, N'CA-TF2', N'LG-0112.01', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-58')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-58', N'cat-patches', N'FEMA Patch with Velcro', N'Unit', NULL, N'CA-TF2', N'LG-0112.01', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-59')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-59', N'cat-personal-care', N'Solar Shower Shower', N'Hygiene', N'Shower', N'CA-TF2', N'ITEM-0243', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-60')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-60', N'cat-personal-care', N'Medline Ready Bath', N'Hygiene', N'Wipes', N'CA-TF2', N'LD-0110.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-61')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-61', N'cat-personal-care', N'Coretex Bug X 30', N'Insect Protection', N'Repellent', N'CA-TF2', N'LE-0123.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-62')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-62', N'cat-personal-care', N'American Innotek Daily Restroom Kit - 2 Liquid Waste, 1 Solid Waste', N'Sanitation', N'Restroom Kits', N'CA-TF2', N'LD-0105.04', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-63')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-63', N'cat-personal-care', N'American Innotek Daily Restroom Kit', N'Sanitation', N'Restroom Kits', N'CA-TF2', N'LD-0105.04', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-64')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-64', N'cat-personal-care', N'American innotek Urinal Bag', N'Sanitation', N'Urinal Bags', N'CA-TF2', N'LD-0105.04', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-65')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-65', N'cat-personal-care', N'Coretex SunX30', N'Sun Protection', N'Sunscreen', N'CA-TF2', N'LE-0126.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-66')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-66', N'cat-references', N'LACoFD FOG', N'Field Guides', N'FOG', N'CA-TF2', N'PA-0101.56', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-67')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-67', N'cat-references', N'USACE US&R Shoring Operations Guide', N'Field Guides', N'Shoring', N'CA-TF2', N'LG-0129.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-68')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-68', N'cat-references', N'USACE US&R Structural Specialist F.O.G.', N'Field Guides', N'Structural', N'CA-TF2', N'LG-0129.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-69')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-69', N'cat-references', N'Desert Rescue Research Edition 6', N'Field Guides', N'Technical Rescue', N'CA-TF2', N'LG-0129.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-70')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-70', N'cat-safety-protection', N'Uvex S3200X', N'Eye Protection', N'Safety Glasses', N'CA-TF2', N'LG-0111.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-71')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-71', N'cat-safety-protection', N'3M Multiple', N'Hearing Protection', N'Ear Plugs', N'CA-TF2', N'LG-0104.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-72')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-72', N'cat-safety-protection', N'3M 7093 Hard Shell Particulate Filter P100', N'Respirators', N'Filters', N'CA-TF2', N'LE-0102.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-73')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-73', N'cat-safety-protection', N'3M 60000 Half Face Respirator', N'Respirators', N'Half Face', N'CA-TF2', N'LG-0127.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-74')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-74', N'cat-safety-protection', N'Scott Bag', N'SCBA', N'Accessories', N'CA-TF2', N'HD-0147.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-75')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-75', N'cat-safety-protection', N'Scott Bayonet Adapter', N'SCBA', N'Adapters', N'CA-TF2', N'HD-0145.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-76')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-76', N'cat-safety-protection', N'Scott AV300', N'SCBA', N'Masks', N'CA-TF2', N'HD-0147.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-77')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-77', N'cat-sleep-system', N'Big Agnes Boundary Deluxe Pillow', N'Accessories', N'Pillows', N'CA-TF2', N'LG-0136.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-78')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-78', N'cat-sleep-system', N'Big Agnes Superlight Girdle', N'Accessories', N'Stuff Sacks', N'CA-TF2', N'LG-0136.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-79')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-79', N'cat-sleep-system', N'SOL Escape Bivy Orange', N'Emergency Shelter', N'Bivvy', N'CA-TF2', N'LG-0136.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-80')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-80', N'cat-sleep-system', N'Big Agnes Lost Dog 0', N'Sleeping Bags', N'Standard', N'CA-TF2', N'LG-0136.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-81')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-81', N'cat-sleep-system', N'Big Agnes Rapide Sleeping Pad', N'Sleeping Pads', N'Inflatable', N'CA-TF2', N'LG-0136.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-82')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-82', N'cat-tools-lighting', N'Pelican 3415', N'Flashlights', N'Right Angle', N'CA-TF2', N'LG-0103.00', 1);
IF NOT EXISTS (SELECT 1 FROM ItemTypes WHERE id = N'it-83')
    INSERT INTO ItemTypes (id, categoryId, name, subcategory, type, deployment, femaCode, isActive)
    VALUES (N'it-83', N'cat-tools-lighting', N'Gerber MP-600', N'Multi-Tools', N'Standard', N'CA-TF2', N'LG-0107.00', 1);

-- =====================================================
-- Insert Variants
-- =====================================================
PRINT 'Inserting 83 variants...';

IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-1')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-1', N'it-1', N'CMC Cobra-D Uniform Rappel Belt', N'CMC', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-2')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-2', N'it-2', N'Tru-Spec BDU Shorts', N'Tru-Spec', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-3')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-3', N'it-3', N'Tru-Spec BDU Pants', N'Tru-Spec', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-4')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-4', N'it-4', N'5.11 Stryke EMS Pants', N'5.11', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-5')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-5', N'it-5', N'5.11 Stryke TDU Blouse', N'5.11', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-6')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-6', N'it-6', N'Tru-Spec BDU Blouse', N'Tru-Spec', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-7')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-7', N'it-7', N'Tru-Spec Gen-III ECWS Level 2', N'Tru-Spec', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-8')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-8', N'it-8', N'Tru-Spec Gen-III ECWS Level 2', N'Tru-Spec', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-9')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-9', N'it-9', N'5.11 3-IN-1 Parka', N'5.11', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-10')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-10', N'it-10', N'Tru-Spec Rain Shell Pant', N'Tru-Spec', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-11')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-11', N'it-11', N'5.11 Performance', N'5.11', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-12')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-12', N'it-12', N'5.11 Performance', N'5.11', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-13')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-13', N'it-13', N'Hanes Cotton Blend', N'Hanes', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-14')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-14', N'it-14', N'Gildan Dry Blend 50/50 Poly/Cotton', N'Gildan', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-15')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-15', N'it-15', N'Gildan Dry Blend 50/50 Poly/Cotton', N'Gildan', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-16')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-16', N'it-16', N'Gildan Dry Blend 50/50 Poly/Cotton', N'Gildan', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-17')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-17', N'it-17', N'Gildan Dry Blend 50/50 Poly/Cotton', N'Gildan', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-18')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-18', N'it-18', N'Anetik Premium Performance UPF 30+', N'Anetik', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-19')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-19', N'it-19', N'Florence Marine X F1 Cordura Utility Short', N'Florence Marine X', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-20')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-20', N'it-20', N'HippyTree Design Co. USAR Guard Boardshort (Custom)', N'HippyTree Design Co.', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-21')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-21', N'it-21', N'Outdoor Research Rocky Mountain High', N'Outdoor Research', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-22')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-22', N'it-22', N'Rocky Alpha Force', N'Rocky', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-23')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-23', N'it-23', N'Globe Technical Rescue', N'Globe', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-24')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-24', N'it-24', N'Globe Technical Rescue', N'Globe', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-25')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-25', N'it-25', N'Mechanix Coldwork Peak', N'Mechanix', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-26')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-26', N'it-26', N'Mechanix Coldwork M-PACT', N'Mechanix', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-27')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-27', N'it-27', N'Shelby 2515', N'Shelby', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-28')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-28', N'it-28', N'Dragon Fire First-Due', N'Dragon Fire', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-29')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-29', N'it-29', N'Team Wendy SAR Comfort Pad Replacement Kit', N'Team Wendy', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-30')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-30', N'it-30', N'ESS Profile Pivot', N'ESS', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-31')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-31', N'it-31', N'Princeton Tec VIZ II', N'Princeton Tec', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-32')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-32', N'it-32', N'Team Wendy MAGPUL MOE 5-Slot Mounting Kit', N'Team Wendy', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-33')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-33', N'it-33', N'Team Wendy SAR Replacement Vent Covers', N'Team Wendy', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-34')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-34', N'it-34', N'Team Wendy EXFIL SAR', N'Team Wendy', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-35')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-35', N'it-35', N'Team Wendy EXFIL SAR', N'Team Wendy', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-36')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-36', N'it-36', N'Team Wendy EXFIL SAR', N'Team Wendy', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-37')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-37', N'it-37', N'Team Wendy EXFIL SAR', N'Team Wendy', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-38')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-38', N'it-38', N'NRS Water Rescue Helmet, White', N'NRS', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-39')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-39', N'it-39', N'FlexFit 110 nu', N'FlexFit', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-40')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-40', N'it-40', N'Blue Beanie, One Size', N'Generic', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-41')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-41', N'it-41', N'Blue Boonie Hat, One Size', N'Generic', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-42')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-42', N'it-42', N'North American Rescue Gloves', N'North American Rescue', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-43')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-43', N'it-43', N'Wolf Pack Gear 24 Hour Pack', N'Wolf Pack Gear', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-44')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-44', N'it-44', N'5.11 Rush 72', N'5.11', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-45')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-45', N'it-45', N'Red Forest Service bag for personal cold weather i', N'Generic', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-46')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-46', N'it-46', N'Wolf Pack Gear Load Bearing Harness', N'Wolf Pack Gear', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-47')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-47', N'it-47', N'USAID Web Gear Patch with Velcro', N'Generic', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-48')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-48', N'it-48', N'Wolf Pack Gear Max Air Roller bag', N'Wolf Pack Gear', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-49')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-49', N'it-49', N'Wolf Pack Gear Web Gear Bag', N'Wolf Pack Gear', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-50')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-50', N'it-50', N'US Flag Patch with Velcro', N'Generic', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-51')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-51', N'it-51', N'CA-TF2 Rocker Patch with Velcro', N'Generic', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-52')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-52', N'it-52', N'USA-2 Rocker Patch with Velcro', N'Generic', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-53')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-53', N'it-53', N'USAID Shoulder Patch with Velcro', N'Generic', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-54')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-54', N'it-54', N'USAID BDU Back Patch with Velcro', N'Generic', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-55')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-55', N'it-55', N'Orange USAR Patch with Veclro', N'Generic', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-56')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-56', N'it-56', N'CALOES Patch with Velcro', N'Generic', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-57')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-57', N'it-57', N'LACoFD USAR BDU Back Pactch with Velcro', N'Generic', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-58')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-58', N'it-58', N'FEMA Patch with Velcro', N'Generic', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-59')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-59', N'it-59', N'Solar Shower Shower', N'Solar Shower', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-60')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-60', N'it-60', N'Medline Ready Bath', N'Medline', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-61')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-61', N'it-61', N'Coretex Bug X 30', N'Coretex', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-62')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-62', N'it-62', N'American Innotek Daily Restroom Kit - 2 Liquid Waste, 1 Solid Waste', N'American Innotek', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-63')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-63', N'it-63', N'American Innotek Daily Restroom Kit', N'American Innotek', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-64')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-64', N'it-64', N'American innotek Urinal Bag', N'American innotek', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-65')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-65', N'it-65', N'Coretex SunX30', N'Coretex', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-66')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-66', N'it-66', N'LACoFD FOG', N'LACoFD', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-67')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-67', N'it-67', N'USACE US&R Shoring Operations Guide', N'USACE', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-68')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-68', N'it-68', N'USACE US&R Structural Specialist F.O.G.', N'USACE', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-69')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-69', N'it-69', N'Desert Rescue Research Edition 6', N'Desert Rescue Research', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-70')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-70', N'it-70', N'Uvex S3200X', N'Uvex', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-71')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-71', N'it-71', N'3M Multiple', N'3M', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-72')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-72', N'it-72', N'3M 7093 Hard Shell Particulate Filter P100', N'3M', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-73')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-73', N'it-73', N'3M 60000 Half Face Respirator', N'3M', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-74')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-74', N'it-74', N'Scott Bag', N'Scott', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-75')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-75', N'it-75', N'Scott Bayonet Adapter', N'Scott', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-76')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-76', N'it-76', N'Scott AV300', N'Scott', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-77')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-77', N'it-77', N'Big Agnes Boundary Deluxe Pillow', N'Big Agnes', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-78')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-78', N'it-78', N'Big Agnes Superlight Girdle', N'Big Agnes', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-79')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-79', N'it-79', N'SOL Escape Bivy Orange', N'SOL', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-80')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-80', N'it-80', N'Big Agnes Lost Dog 0', N'Big Agnes', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-81')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-81', N'it-81', N'Big Agnes Rapide Sleeping Pad', N'Big Agnes', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-82')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-82', N'it-82', N'Pelican 3415', N'Pelican', 1);
IF NOT EXISTS (SELECT 1 FROM Variants WHERE id = N'var-83')
    INSERT INTO Variants (id, itemTypeId, name, manufacturer, isActive)
    VALUES (N'var-83', N'it-83', N'Gerber MP-600', N'Gerber', 1);

-- =====================================================
-- Insert Sizes
-- =====================================================
PRINT 'Inserting 265 sizes...';

IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-1')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-1', N'var-1', N'One Size', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-2')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-2', N'var-2', N'Small', N'27-29', N'LG-0120.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-3')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-3', N'var-3', N'SL', N'27-31 / 32½-35½', N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-4')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-4', N'var-3', N'SR', N'27-31 / 29½-32½', N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-5')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-5', N'var-3', N'SS', N'27-31 / 26½-29½', N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-6')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-6', N'var-2', N'Medium', N'29-31', N'LG-0120.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-7')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-7', N'var-3', N'ML', N'31-35 / 32½-35½', N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-8')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-8', N'var-3', N'MR', N'31-35 / 29½-32½', N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-9')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-9', N'var-3', N'MS', N'31-35 / 26½-29½', N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-10')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-10', N'var-2', N'Large', N'31-33', N'LG-0120.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-11')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-11', N'var-3', N'LL', N'35-39 / 32½-35½', N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-12')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-12', N'var-3', N'LR', N'35-39 / 29½-32½', N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-13')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-13', N'var-3', N'LS', N'35-39 / 26½-29½', N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-14')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-14', N'var-2', N'XL', N'33-35', N'LG-0120.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-15')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-15', N'var-3', N'XLL', N'39-43 / 32½-35½', N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-16')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-16', N'var-3', N'XLR', N'39-43 / 29½-32½', N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-17')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-17', N'var-3', N'XLR', N'39-43 / 29½-32½', N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-18')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-18', N'var-2', N'2XL', N'35-37', N'LG-0120.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-19')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-19', N'var-3', N'2XLL', N'43-47 / 32½-35½', N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-20')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-20', N'var-3', N'2XLR', N'43-47 / 29½-32½', N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-21')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-21', N'var-3', N'2XLR', N'43-47 / 29½-32½', N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-22')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-22', N'var-4', N'28X30', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-23')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-23', N'var-4', N'28X32', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-24')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-24', N'var-4', N'28X34', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-25')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-25', N'var-4', N'30X30', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-26')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-26', N'var-4', N'30X32', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-27')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-27', N'var-4', N'30X34', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-28')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-28', N'var-4', N'32X30', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-29')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-29', N'var-4', N'32X32', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-30')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-30', N'var-4', N'32X34', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-31')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-31', N'var-4', N'34X30', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-32')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-32', N'var-4', N'34X32', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-33')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-33', N'var-4', N'34X34', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-34')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-34', N'var-4', N'36X30', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-35')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-35', N'var-4', N'36X32', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-36')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-36', N'var-4', N'36X34', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-37')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-37', N'var-4', N'38X30', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-38')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-38', N'var-4', N'38X32', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-39')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-39', N'var-4', N'38X34', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-40')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-40', N'var-4', N'40X30', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-41')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-41', N'var-4', N'40X32', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-42')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-42', N'var-4', N'40X34', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-43')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-43', N'var-4', N'42X30', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-44')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-44', N'var-4', N'42X32', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-45')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-45', N'var-4', N'42X34', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-46')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-46', N'var-4', N'44X30', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-47')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-47', N'var-4', N'44X32', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-48')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-48', N'var-4', N'44X34', NULL, N'LG-0112.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-49')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-49', N'var-5', N'XS', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-50')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-50', N'var-5', N'Small', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-51')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-51', N'var-6', N'SL', N'27-31 / 32½-35½', N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-52')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-52', N'var-6', N'SR', N'27-31 / 29½-32½', N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-53')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-53', N'var-6', N'SS', N'27-31 / 26½-29½', N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-54')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-54', N'var-5', N'Medium', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-55')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-55', N'var-6', N'ML', N'31-35 / 32½-35½', N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-56')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-56', N'var-6', N'MR', N'31-35 / 29½-32½', N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-57')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-57', N'var-6', N'MS', N'31-35 / 26½-29½', N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-58')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-58', N'var-5', N'Large', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-59')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-59', N'var-6', N'LL', N'35-39 / 32½-35½', N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-60')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-60', N'var-6', N'LR', N'35-39 / 29½-32½', N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-61')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-61', N'var-6', N'LS', N'35-39 / 26½-29½', N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-62')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-62', N'var-6', N'XLL', N'39-43 / 32½-35½', N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-63')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-63', N'var-6', N'XLR', N'39-43 / 29½-32½', N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-64')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-64', N'var-6', N'XLR', N'39-43 / 29½-32½', N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-65')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-65', N'var-5', N'2XL', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-66')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-66', N'var-5', N'3XL', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-67')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-67', N'var-6', N'2XL Long', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-68')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-68', N'var-6', N'2XL Regular', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-69')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-69', N'var-6', N'3XL Long', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-70')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-70', N'var-5', N'XL Tall', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-71')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-71', N'var-7', N'Small', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-72')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-72', N'var-7', N'Medium', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-73')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-73', N'var-7', N'Large', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-74')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-74', N'var-7', N'XL', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-75')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-75', N'var-7', N'2XL', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-76')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-76', N'var-7', N'3XL', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-77')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-77', N'var-8', N'Small', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-78')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-78', N'var-8', N'Medium', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-79')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-79', N'var-8', N'Large', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-80')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-80', N'var-8', N'XL', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-81')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-81', N'var-8', N'2XL', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-82')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-82', N'var-8', N'3XL', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-83')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-83', N'var-9', N'XS', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-84')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-84', N'var-9', N'Small', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-85')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-85', N'var-9', N'Medium', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-86')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-86', N'var-9', N'Large', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-87')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-87', N'var-9', N'XL', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-88')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-88', N'var-9', N'2XL', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-89')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-89', N'var-9', N'3XL', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-90')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-90', N'var-10', N'2XL Regular', NULL, N'LG-0110.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-91')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-91', N'var-10', N'3XL Regular', NULL, N'LG-0110.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-92')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-92', N'var-10', N'Large Regular', NULL, N'LG-0110.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-93')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-93', N'var-10', N'Small Regular', NULL, N'LG-0110.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-94')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-94', N'var-10', N'XL Long', NULL, N'LG-0110.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-95')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-95', N'var-10', N'XL Regular', NULL, N'LG-0110.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-96')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-96', N'var-11', N'XS', NULL, N'ITEM-0112', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-97')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-97', N'var-11', N'Small', NULL, N'ITEM-0113', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-98')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-98', N'var-11', N'Medium', NULL, N'ITEM-0114', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-99')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-99', N'var-11', N'Large', NULL, N'ITEM-0115', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-100')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-100', N'var-11', N'XL', NULL, N'ITEM-0116', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-101')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-101', N'var-11', N'2XL', NULL, N'ITEM-0117', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-102')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-102', N'var-11', N'3XL', NULL, N'ITEM-0118', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-103')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-103', N'var-12', N'XS', NULL, N'ITEM-0105', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-104')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-104', N'var-12', N'Small', NULL, N'ITEM-0106', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-105')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-105', N'var-12', N'Medium', NULL, N'ITEM-0107', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-106')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-106', N'var-12', N'Large', NULL, N'ITEM-0108', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-107')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-107', N'var-12', N'XL', NULL, N'ITEM-0109', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-108')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-108', N'var-12', N'2XL', NULL, N'ITEM-0110', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-109')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-109', N'var-12', N'3XL', NULL, N'ITEM-0111', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-110')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-110', N'var-13', N'XS', NULL, N'ITEM-0098', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-111')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-111', N'var-13', N'Small', NULL, N'ITEM-0099', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-112')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-112', N'var-13', N'Medium', NULL, N'ITEM-0100', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-113')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-113', N'var-13', N'Large', NULL, N'ITEM-0101', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-114')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-114', N'var-13', N'XL', NULL, N'ITEM-0102', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-115')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-115', N'var-13', N'2XL', NULL, N'ITEM-0103', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-116')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-116', N'var-13', N'3XL', NULL, N'ITEM-0104', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-117')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-117', N'var-14', N'XS', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-118')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-118', N'var-14', N'Small', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-119')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-119', N'var-14', N'Medium', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-120')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-120', N'var-14', N'Large', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-121')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-121', N'var-14', N'XL', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-122')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-122', N'var-14', N'2XL', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-123')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-123', N'var-15', N'XS', NULL, N'LG-0120.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-124')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-124', N'var-15', N'Small', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-125')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-125', N'var-15', N'Medium', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-126')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-126', N'var-15', N'Large', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-127')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-127', N'var-15', N'XL', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-128')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-128', N'var-15', N'2XL', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-129')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-129', N'var-15', N'3XL', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-130')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-130', N'var-16', N'XS', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-131')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-131', N'var-16', N'Small', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-132')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-132', N'var-16', N'Medium', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-133')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-133', N'var-16', N'Large', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-134')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-134', N'var-16', N'XL', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-135')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-135', N'var-16', N'2XL', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-136')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-136', N'var-16', N'3XL', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-137')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-137', N'var-17', N'XS', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-138')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-138', N'var-17', N'Small', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-139')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-139', N'var-17', N'Medium', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-140')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-140', N'var-17', N'Large', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-141')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-141', N'var-17', N'XL', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-142')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-142', N'var-17', N'2XL', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-143')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-143', N'var-17', N'3XL', NULL, N'LG-0125.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-144')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-144', N'var-18', N'XS', NULL, N'ITEM-0127', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-145')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-145', N'var-18', N'Small', NULL, N'ITEM-0128', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-146')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-146', N'var-18', N'Medium', NULL, N'ITEM-0129', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-147')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-147', N'var-18', N'Large', NULL, N'ITEM-0130', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-148')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-148', N'var-18', N'XL', NULL, N'ITEM-0131', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-149')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-149', N'var-18', N'2XL', NULL, N'ITEM-0132', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-150')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-150', N'var-19', N'30', NULL, N'LG-0135.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-151')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-151', N'var-19', N'32', NULL, N'LG-0135.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-152')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-152', N'var-19', N'34', NULL, N'LG-0135.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-153')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-153', N'var-19', N'36', NULL, N'LG-0135.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-154')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-154', N'var-19', N'38', NULL, N'LG-0135.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-155')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-155', N'var-20', N'40', NULL, N'LG-0135.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-156')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-156', N'var-20', N'42', NULL, N'LG-0135.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-157')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-157', N'var-20', N'44', NULL, N'LG-0135.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-158')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-158', N'var-21', N'Small', N'Shoe 4-7', N'LG-0110.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-159')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-159', N'var-21', N'Medium', N'Shoe 7-9', N'LG-0110.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-160')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-160', N'var-21', N'Large', N'Shoe 9-11', N'LG-0110.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-161')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-161', N'var-21', N'XL', N'Shoe 11-13', N'LG-0110.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-162')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-162', N'var-21', N'2XL', N'Shoe 13-15', N'LG-0110.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-163')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-163', N'var-22', N'9', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-164')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-164', N'var-22', N'9.5', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-165')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-165', N'var-22', N'10', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-166')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-166', N'var-22', N'10.5', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-167')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-167', N'var-22', N'11', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-168')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-168', N'var-22', N'11.5', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-169')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-169', N'var-22', N'12', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-170')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-170', N'var-22', N'13', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-171')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-171', N'var-23', N'9', N'Medium', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-172')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-172', N'var-23', N'9.5', N'Medium', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-173')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-173', N'var-23', N'10', N'Medium', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-174')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-174', N'var-23', N'10.5', N'Medium', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-175')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-175', N'var-23', N'11', N'Medium', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-176')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-176', N'var-23', N'11.5', N'Medium', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-177')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-177', N'var-23', N'12', N'Medium', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-178')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-178', N'var-23', N'12.5', N'Medium', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-179')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-179', N'var-24', N'6.5', N'Wide', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-180')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-180', N'var-24', N'8', N'Medium', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-181')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-181', N'var-24', N'8.5', N'Wide', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-182')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-182', N'var-24', N'9', N'Wide', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-183')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-183', N'var-24', N'9.5', N'Wide', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-184')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-184', N'var-24', N'10', N'Wide', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-185')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-185', N'var-24', N'10.5', N'Wide', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-186')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-186', N'var-24', N'11', N'Wide', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-187')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-187', N'var-24', N'11.5', N'Wide', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-188')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-188', N'var-24', N'12', N'Wide', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-189')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-189', N'var-24', N'12.5', N'Wide', N'LG-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-190')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-190', N'var-25', N'Small', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-191')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-191', N'var-26', N'Small', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-192')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-192', N'var-25', N'Medium', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-193')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-193', N'var-26', N'Medium', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-194')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-194', N'var-26', N'Large', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-195')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-195', N'var-25', N'Large', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-196')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-196', N'var-26', N'XL', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-197')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-197', N'var-25', N'XL', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-198')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-198', N'var-26', N'2XL', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-199')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-199', N'var-25', N'2XL', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-200')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-200', N'var-27', N'Medium', NULL, N'LG-0108.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-201')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-201', N'var-27', N'Large', NULL, N'LG-0108.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-202')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-202', N'var-27', N'X-Large', NULL, N'LG-0108.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-203')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-203', N'var-28', N'Small', NULL, N'LG-0108.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-204')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-204', N'var-28', N'Medium', NULL, N'LG-0108.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-205')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-205', N'var-28', N'Large', NULL, N'LG-0108.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-206')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-206', N'var-28', N'XL', NULL, N'LG-0108.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-207')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-207', N'var-28', N'2XL', NULL, N'LG-0108.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-208')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-208', N'var-29', N'One Size', NULL, N'LG-0105.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-209')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-209', N'var-30', N'One Size', NULL, N'LE-0111.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-210')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-210', N'var-31', N'One Size', NULL, N'LG-0106.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-211')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-211', N'var-32', N'One Size', NULL, N'LG-0105.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-212')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-212', N'var-33', N'One Size', NULL, N'LG-0105.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-213')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-213', N'var-34', N'One Size', NULL, N'LG-0105.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-214')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-214', N'var-35', N'One Size', NULL, N'LG-0105.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-215')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-215', N'var-36', N'One Size', NULL, N'LG-0105.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-216')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-216', N'var-37', N'One Size', NULL, N'LG-0105.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-217')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-217', N'var-38', N'LARGE', NULL, N'WA-0101.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-218')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-218', N'var-39', N'One Size', NULL, N'LG-0101.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-219')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-219', N'var-40', N'One Size', NULL, N'LG-0122.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-220')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-220', N'var-41', N'One Size', NULL, N'LG-0101.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-221')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-221', N'var-42', N'One Size', NULL, N'MN-0158.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-222')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-222', N'var-43', N'One Size', NULL, N'LG-0118.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-223')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-223', N'var-44', N'One Size', NULL, N'LG-0118.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-224')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-224', N'var-45', N'One Size', NULL, N'LG-0118.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-225')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-225', N'var-46', N'One Size', NULL, N'LG-0117.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-226')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-226', N'var-47', N'One Size', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-227')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-227', N'var-48', N'One Size', NULL, N'LG-0118.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-228')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-228', N'var-49', N'One Size', NULL, N'LG-0118.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-229')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-229', N'var-50', N'One Size', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-230')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-230', N'var-51', N'One Size', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-231')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-231', N'var-52', N'One Size', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-232')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-232', N'var-53', N'One Size', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-233')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-233', N'var-54', N'One Size', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-234')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-234', N'var-55', N'One Size', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-235')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-235', N'var-56', N'One Size', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-236')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-236', N'var-57', N'One Size', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-237')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-237', N'var-58', N'One Size', NULL, N'LG-0112.01', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-238')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-238', N'var-59', N'One Size', NULL, N'ITEM-0243', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-239')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-239', N'var-60', N'One Size', NULL, N'LD-0110.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-240')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-240', N'var-61', N'One Size', NULL, N'LE-0123.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-241')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-241', N'var-62', N'One Size', NULL, N'LD-0105.04', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-242')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-242', N'var-63', N'One Size', NULL, N'LD-0105.04', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-243')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-243', N'var-64', N'One Size', NULL, N'LD-0105.04', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-244')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-244', N'var-65', N'One Size', NULL, N'LE-0126.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-245')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-245', N'var-66', N'One Size', NULL, N'PA-0101.56', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-246')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-246', N'var-67', N'One Size', NULL, N'LG-0129.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-247')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-247', N'var-68', N'One Size', NULL, N'LG-0129.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-248')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-248', N'var-69', N'One Size', NULL, N'LG-0129.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-249')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-249', N'var-70', N'One Size', NULL, N'LG-0111.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-250')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-250', N'var-71', N'One Size', NULL, N'LG-0104.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-251')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-251', N'var-72', N'One Size', NULL, N'LE-0102.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-252')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-252', N'var-73', N'Medium', NULL, N'LG-0127.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-253')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-253', N'var-73', N'Large', NULL, N'LG-0127.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-254')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-254', N'var-74', N'One Size', NULL, N'HD-0147.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-255')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-255', N'var-75', N'One Size', NULL, N'HD-0145.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-256')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-256', N'var-76', N'Small', NULL, N'HD-0147.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-257')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-257', N'var-76', N'Medium', NULL, N'HD-0147.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-258')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-258', N'var-76', N'Large', NULL, N'HD-0147.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-259')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-259', N'var-77', N'One Size', NULL, N'LG-0136.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-260')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-260', N'var-78', N'One Size', NULL, N'LG-0136.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-261')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-261', N'var-79', N'One Size', NULL, N'LG-0136.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-262')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-262', N'var-80', N'Long', NULL, N'LG-0136.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-263')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-263', N'var-81', N'One Size', NULL, N'LG-0136.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-264')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-264', N'var-82', N'One Size', NULL, N'LG-0103.00', 0, 1);
IF NOT EXISTS (SELECT 1 FROM Sizes WHERE id = N'sz-265')
    INSERT INTO Sizes (id, variantId, name, sizeDetail, legacyId, sortOrder, isActive)
    VALUES (N'sz-265', N'var-83', N'One Size', NULL, N'LG-0107.00', 0, 1);

-- =====================================================
-- Insert/Update Inventory
-- =====================================================
PRINT 'Inserting 265 inventory records...';

IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-1')
    UPDATE Inventory SET quantityOnHand = 4, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-1';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-1', 4, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-2')
    UPDATE Inventory SET quantityOnHand = 4, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-2';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-2', 4, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-3')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-3';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-3', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-4')
    UPDATE Inventory SET quantityOnHand = 10, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-4';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-4', 10, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-5')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-5';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-5', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-6')
    UPDATE Inventory SET quantityOnHand = 12, quantityReserved = 0, quantityOut = 2 WHERE sizeId = N'sz-6';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-6', 12, 0, 2);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-7')
    UPDATE Inventory SET quantityOnHand = 15, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-7';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-7', 15, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-8')
    UPDATE Inventory SET quantityOnHand = 12, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-8';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-8', 12, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-9')
    UPDATE Inventory SET quantityOnHand = 8, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-9';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-9', 8, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-10')
    UPDATE Inventory SET quantityOnHand = 9, quantityReserved = 0, quantityOut = 4 WHERE sizeId = N'sz-10';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-10', 9, 0, 4);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-11')
    UPDATE Inventory SET quantityOnHand = 34, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-11';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-11', 34, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-12')
    UPDATE Inventory SET quantityOnHand = 20, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-12';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-12', 20, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-13')
    UPDATE Inventory SET quantityOnHand = 18, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-13';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-13', 18, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-14')
    UPDATE Inventory SET quantityOnHand = 24, quantityReserved = 0, quantityOut = 1 WHERE sizeId = N'sz-14';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-14', 24, 0, 1);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-15')
    UPDATE Inventory SET quantityOnHand = 42, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-15';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-15', 42, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-16')
    UPDATE Inventory SET quantityOnHand = 35, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-16';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-16', 35, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-17')
    UPDATE Inventory SET quantityOnHand = 51, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-17';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-17', 51, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-18')
    UPDATE Inventory SET quantityOnHand = 14, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-18';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-18', 14, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-19')
    UPDATE Inventory SET quantityOnHand = 35, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-19';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-19', 35, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-20')
    UPDATE Inventory SET quantityOnHand = 24, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-20';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-20', 24, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-21')
    UPDATE Inventory SET quantityOnHand = 44, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-21';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-21', 44, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-22')
    UPDATE Inventory SET quantityOnHand = 17, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-22';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-22', 17, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-23')
    UPDATE Inventory SET quantityOnHand = 19, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-23';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-23', 19, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-24')
    UPDATE Inventory SET quantityOnHand = 12, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-24';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-24', 12, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-25')
    UPDATE Inventory SET quantityOnHand = 20, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-25';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-25', 20, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-26')
    UPDATE Inventory SET quantityOnHand = 40, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-26';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-26', 40, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-27')
    UPDATE Inventory SET quantityOnHand = 23, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-27';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-27', 23, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-28')
    UPDATE Inventory SET quantityOnHand = 10, quantityReserved = 0, quantityOut = 6 WHERE sizeId = N'sz-28';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-28', 10, 0, 6);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-29')
    UPDATE Inventory SET quantityOnHand = 34, quantityReserved = 0, quantityOut = 1 WHERE sizeId = N'sz-29';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-29', 34, 0, 1);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-30')
    UPDATE Inventory SET quantityOnHand = 16, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-30';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-30', 16, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-31')
    UPDATE Inventory SET quantityOnHand = 21, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-31';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-31', 21, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-32')
    UPDATE Inventory SET quantityOnHand = 33, quantityReserved = 0, quantityOut = 17 WHERE sizeId = N'sz-32';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-32', 33, 0, 17);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-33')
    UPDATE Inventory SET quantityOnHand = 32, quantityReserved = 0, quantityOut = 1 WHERE sizeId = N'sz-33';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-33', 32, 0, 1);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-34')
    UPDATE Inventory SET quantityOnHand = 35, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-34';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-34', 35, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-35')
    UPDATE Inventory SET quantityOnHand = 5, quantityReserved = 0, quantityOut = 18 WHERE sizeId = N'sz-35';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-35', 5, 0, 18);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-36')
    UPDATE Inventory SET quantityOnHand = 63, quantityReserved = 0, quantityOut = 3 WHERE sizeId = N'sz-36';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-36', 63, 0, 3);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-37')
    UPDATE Inventory SET quantityOnHand = 23, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-37';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-37', 23, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-38')
    UPDATE Inventory SET quantityOnHand = 20, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-38';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-38', 20, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-39')
    UPDATE Inventory SET quantityOnHand = 14, quantityReserved = 0, quantityOut = 1 WHERE sizeId = N'sz-39';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-39', 14, 0, 1);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-40')
    UPDATE Inventory SET quantityOnHand = 20, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-40';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-40', 20, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-41')
    UPDATE Inventory SET quantityOnHand = 15, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-41';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-41', 15, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-42')
    UPDATE Inventory SET quantityOnHand = 12, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-42';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-42', 12, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-43')
    UPDATE Inventory SET quantityOnHand = 12, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-43';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-43', 12, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-44')
    UPDATE Inventory SET quantityOnHand = 12, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-44';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-44', 12, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-45')
    UPDATE Inventory SET quantityOnHand = 11, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-45';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-45', 11, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-46')
    UPDATE Inventory SET quantityOnHand = 12, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-46';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-46', 12, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-47')
    UPDATE Inventory SET quantityOnHand = 13, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-47';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-47', 13, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-48')
    UPDATE Inventory SET quantityOnHand = 15, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-48';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-48', 15, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-49')
    UPDATE Inventory SET quantityOnHand = 20, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-49';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-49', 20, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-50')
    UPDATE Inventory SET quantityOnHand = 27, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-50';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-50', 27, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-51')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-51';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-51', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-52')
    UPDATE Inventory SET quantityOnHand = 13, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-52';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-52', 13, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-53')
    UPDATE Inventory SET quantityOnHand = 11, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-53';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-53', 11, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-54')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-54';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-54', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-55')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 1 WHERE sizeId = N'sz-55';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-55', 0, 0, 1);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-56')
    UPDATE Inventory SET quantityOnHand = 62, quantityReserved = 0, quantityOut = 9 WHERE sizeId = N'sz-56';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-56', 62, 0, 9);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-57')
    UPDATE Inventory SET quantityOnHand = 6, quantityReserved = 0, quantityOut = 5 WHERE sizeId = N'sz-57';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-57', 6, 0, 5);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-58')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-58';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-58', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-59')
    UPDATE Inventory SET quantityOnHand = 1, quantityReserved = 0, quantityOut = 3 WHERE sizeId = N'sz-59';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-59', 1, 0, 3);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-60')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 5 WHERE sizeId = N'sz-60';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-60', 0, 0, 5);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-61')
    UPDATE Inventory SET quantityOnHand = 6, quantityReserved = 0, quantityOut = 3 WHERE sizeId = N'sz-61';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-61', 6, 0, 3);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-62')
    UPDATE Inventory SET quantityOnHand = 43, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-62';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-62', 43, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-63')
    UPDATE Inventory SET quantityOnHand = 21, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-63';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-63', 21, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-64')
    UPDATE Inventory SET quantityOnHand = 203, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-64';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-64', 203, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-65')
    UPDATE Inventory SET quantityOnHand = 34, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-65';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-65', 34, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-66')
    UPDATE Inventory SET quantityOnHand = 31, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-66';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-66', 31, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-67')
    UPDATE Inventory SET quantityOnHand = 70, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-67';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-67', 70, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-68')
    UPDATE Inventory SET quantityOnHand = 50, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-68';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-68', 50, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-69')
    UPDATE Inventory SET quantityOnHand = 8, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-69';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-69', 8, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-70')
    UPDATE Inventory SET quantityOnHand = 32, quantityReserved = 0, quantityOut = 1 WHERE sizeId = N'sz-70';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-70', 32, 0, 1);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-71')
    UPDATE Inventory SET quantityOnHand = 30, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-71';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-71', 30, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-72')
    UPDATE Inventory SET quantityOnHand = 47, quantityReserved = 0, quantityOut = 5 WHERE sizeId = N'sz-72';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-72', 47, 0, 5);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-73')
    UPDATE Inventory SET quantityOnHand = 30, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-73';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-73', 30, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-74')
    UPDATE Inventory SET quantityOnHand = 42, quantityReserved = 0, quantityOut = 6 WHERE sizeId = N'sz-74';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-74', 42, 0, 6);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-75')
    UPDATE Inventory SET quantityOnHand = 73, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-75';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-75', 73, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-76')
    UPDATE Inventory SET quantityOnHand = 36, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-76';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-76', 36, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-77')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-77';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-77', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-78')
    UPDATE Inventory SET quantityOnHand = 31, quantityReserved = 0, quantityOut = 5 WHERE sizeId = N'sz-78';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-78', 31, 0, 5);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-79')
    UPDATE Inventory SET quantityOnHand = 41, quantityReserved = 0, quantityOut = 3 WHERE sizeId = N'sz-79';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-79', 41, 0, 3);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-80')
    UPDATE Inventory SET quantityOnHand = 22, quantityReserved = 0, quantityOut = 6 WHERE sizeId = N'sz-80';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-80', 22, 0, 6);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-81')
    UPDATE Inventory SET quantityOnHand = 30, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-81';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-81', 30, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-82')
    UPDATE Inventory SET quantityOnHand = 30, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-82';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-82', 30, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-83')
    UPDATE Inventory SET quantityOnHand = 8, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-83';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-83', 8, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-84')
    UPDATE Inventory SET quantityOnHand = 15, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-84';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-84', 15, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-85')
    UPDATE Inventory SET quantityOnHand = 17, quantityReserved = 0, quantityOut = 2 WHERE sizeId = N'sz-85';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-85', 17, 0, 2);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-86')
    UPDATE Inventory SET quantityOnHand = 29, quantityReserved = 0, quantityOut = 4 WHERE sizeId = N'sz-86';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-86', 29, 0, 4);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-87')
    UPDATE Inventory SET quantityOnHand = 17, quantityReserved = 0, quantityOut = 7 WHERE sizeId = N'sz-87';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-87', 17, 0, 7);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-88')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-88';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-88', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-89')
    UPDATE Inventory SET quantityOnHand = 5, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-89';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-89', 5, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-90')
    UPDATE Inventory SET quantityOnHand = 27, quantityReserved = 0, quantityOut = 2 WHERE sizeId = N'sz-90';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-90', 27, 0, 2);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-91')
    UPDATE Inventory SET quantityOnHand = 2, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-91';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-91', 2, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-92')
    UPDATE Inventory SET quantityOnHand = 1, quantityReserved = 0, quantityOut = 3 WHERE sizeId = N'sz-92';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-92', 1, 0, 3);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-93')
    UPDATE Inventory SET quantityOnHand = 7, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-93';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-93', 7, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-94')
    UPDATE Inventory SET quantityOnHand = 2, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-94';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-94', 2, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-95')
    UPDATE Inventory SET quantityOnHand = 2, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-95';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-95', 2, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-96')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-96';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-96', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-97')
    UPDATE Inventory SET quantityOnHand = 27, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-97';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-97', 27, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-98')
    UPDATE Inventory SET quantityOnHand = 42, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-98';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-98', 42, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-99')
    UPDATE Inventory SET quantityOnHand = 26, quantityReserved = 0, quantityOut = 3 WHERE sizeId = N'sz-99';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-99', 26, 0, 3);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-100')
    UPDATE Inventory SET quantityOnHand = 40, quantityReserved = 0, quantityOut = 1 WHERE sizeId = N'sz-100';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-100', 40, 0, 1);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-101')
    UPDATE Inventory SET quantityOnHand = 14, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-101';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-101', 14, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-102')
    UPDATE Inventory SET quantityOnHand = 11, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-102';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-102', 11, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-103')
    UPDATE Inventory SET quantityOnHand = 26, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-103';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-103', 26, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-104')
    UPDATE Inventory SET quantityOnHand = 26, quantityReserved = 0, quantityOut = 1 WHERE sizeId = N'sz-104';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-104', 26, 0, 1);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-105')
    UPDATE Inventory SET quantityOnHand = 38, quantityReserved = 0, quantityOut = 2 WHERE sizeId = N'sz-105';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-105', 38, 0, 2);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-106')
    UPDATE Inventory SET quantityOnHand = 51, quantityReserved = 0, quantityOut = 1 WHERE sizeId = N'sz-106';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-106', 51, 0, 1);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-107')
    UPDATE Inventory SET quantityOnHand = 7, quantityReserved = 0, quantityOut = 6 WHERE sizeId = N'sz-107';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-107', 7, 0, 6);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-108')
    UPDATE Inventory SET quantityOnHand = 12, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-108';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-108', 12, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-109')
    UPDATE Inventory SET quantityOnHand = 11, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-109';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-109', 11, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-110')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-110';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-110', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-111')
    UPDATE Inventory SET quantityOnHand = 26, quantityReserved = 0, quantityOut = 2 WHERE sizeId = N'sz-111';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-111', 26, 0, 2);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-112')
    UPDATE Inventory SET quantityOnHand = 39, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-112';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-112', 39, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-113')
    UPDATE Inventory SET quantityOnHand = 3, quantityReserved = 0, quantityOut = 4 WHERE sizeId = N'sz-113';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-113', 3, 0, 4);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-114')
    UPDATE Inventory SET quantityOnHand = 4, quantityReserved = 0, quantityOut = 7 WHERE sizeId = N'sz-114';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-114', 4, 0, 7);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-115')
    UPDATE Inventory SET quantityOnHand = 21, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-115';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-115', 21, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-116')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-116';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-116', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-117')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-117';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-117', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-118')
    UPDATE Inventory SET quantityOnHand = 27, quantityReserved = 0, quantityOut = 5 WHERE sizeId = N'sz-118';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-118', 27, 0, 5);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-119')
    UPDATE Inventory SET quantityOnHand = 25, quantityReserved = 0, quantityOut = 10 WHERE sizeId = N'sz-119';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-119', 25, 0, 10);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-120')
    UPDATE Inventory SET quantityOnHand = 10, quantityReserved = 0, quantityOut = 10 WHERE sizeId = N'sz-120';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-120', 10, 0, 10);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-121')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 16 WHERE sizeId = N'sz-121';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-121', 0, 0, 16);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-122')
    UPDATE Inventory SET quantityOnHand = 18, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-122';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-122', 18, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-123')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-123';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-123', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-124')
    UPDATE Inventory SET quantityOnHand = 8, quantityReserved = 0, quantityOut = 5 WHERE sizeId = N'sz-124';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-124', 8, 0, 5);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-125')
    UPDATE Inventory SET quantityOnHand = 37, quantityReserved = 0, quantityOut = 10 WHERE sizeId = N'sz-125';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-125', 37, 0, 10);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-126')
    UPDATE Inventory SET quantityOnHand = 5, quantityReserved = 0, quantityOut = 26 WHERE sizeId = N'sz-126';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-126', 5, 0, 26);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-127')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 16 WHERE sizeId = N'sz-127';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-127', 0, 0, 16);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-128')
    UPDATE Inventory SET quantityOnHand = 16, quantityReserved = 0, quantityOut = 2 WHERE sizeId = N'sz-128';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-128', 16, 0, 2);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-129')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-129';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-129', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-130')
    UPDATE Inventory SET quantityOnHand = 62, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-130';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-130', 62, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-131')
    UPDATE Inventory SET quantityOnHand = 89, quantityReserved = 0, quantityOut = 5 WHERE sizeId = N'sz-131';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-131', 89, 0, 5);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-132')
    UPDATE Inventory SET quantityOnHand = 214, quantityReserved = 0, quantityOut = 15 WHERE sizeId = N'sz-132';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-132', 214, 0, 15);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-133')
    UPDATE Inventory SET quantityOnHand = 131, quantityReserved = 0, quantityOut = 15 WHERE sizeId = N'sz-133';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-133', 131, 0, 15);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-134')
    UPDATE Inventory SET quantityOnHand = 79, quantityReserved = 0, quantityOut = 35 WHERE sizeId = N'sz-134';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-134', 79, 0, 35);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-135')
    UPDATE Inventory SET quantityOnHand = 108, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-135';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-135', 108, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-136')
    UPDATE Inventory SET quantityOnHand = 33, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-136';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-136', 33, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-137')
    UPDATE Inventory SET quantityOnHand = 66, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-137';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-137', 66, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-138')
    UPDATE Inventory SET quantityOnHand = 319, quantityReserved = 0, quantityOut = 5 WHERE sizeId = N'sz-138';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-138', 319, 0, 5);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-139')
    UPDATE Inventory SET quantityOnHand = 302, quantityReserved = 0, quantityOut = 10 WHERE sizeId = N'sz-139';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-139', 302, 0, 10);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-140')
    UPDATE Inventory SET quantityOnHand = 234, quantityReserved = 0, quantityOut = 20 WHERE sizeId = N'sz-140';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-140', 234, 0, 20);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-141')
    UPDATE Inventory SET quantityOnHand = 15, quantityReserved = 0, quantityOut = 35 WHERE sizeId = N'sz-141';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-141', 15, 0, 35);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-142')
    UPDATE Inventory SET quantityOnHand = 86, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-142';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-142', 86, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-143')
    UPDATE Inventory SET quantityOnHand = 66, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-143';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-143', 66, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-144')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-144';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-144', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-145')
    UPDATE Inventory SET quantityOnHand = 49, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-145';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-145', 49, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-146')
    UPDATE Inventory SET quantityOnHand = 35, quantityReserved = 0, quantityOut = 2 WHERE sizeId = N'sz-146';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-146', 35, 0, 2);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-147')
    UPDATE Inventory SET quantityOnHand = 34, quantityReserved = 0, quantityOut = 6 WHERE sizeId = N'sz-147';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-147', 34, 0, 6);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-148')
    UPDATE Inventory SET quantityOnHand = 22, quantityReserved = 0, quantityOut = 3 WHERE sizeId = N'sz-148';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-148', 22, 0, 3);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-149')
    UPDATE Inventory SET quantityOnHand = 48, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-149';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-149', 48, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-150')
    UPDATE Inventory SET quantityOnHand = 19, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-150';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-150', 19, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-151')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 6 WHERE sizeId = N'sz-151';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-151', 0, 0, 6);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-152')
    UPDATE Inventory SET quantityOnHand = 11, quantityReserved = 0, quantityOut = 1 WHERE sizeId = N'sz-152';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-152', 11, 0, 1);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-153')
    UPDATE Inventory SET quantityOnHand = 32, quantityReserved = 0, quantityOut = 1 WHERE sizeId = N'sz-153';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-153', 32, 0, 1);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-154')
    UPDATE Inventory SET quantityOnHand = 21, quantityReserved = 0, quantityOut = 6 WHERE sizeId = N'sz-154';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-154', 21, 0, 6);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-155')
    UPDATE Inventory SET quantityOnHand = 12, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-155';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-155', 12, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-156')
    UPDATE Inventory SET quantityOnHand = 25, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-156';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-156', 25, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-157')
    UPDATE Inventory SET quantityOnHand = 15, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-157';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-157', 15, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-158')
    UPDATE Inventory SET quantityOnHand = 4, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-158';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-158', 4, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-159')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-159';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-159', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-160')
    UPDATE Inventory SET quantityOnHand = 4, quantityReserved = 0, quantityOut = 7 WHERE sizeId = N'sz-160';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-160', 4, 0, 7);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-161')
    UPDATE Inventory SET quantityOnHand = 10, quantityReserved = 0, quantityOut = 7 WHERE sizeId = N'sz-161';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-161', 10, 0, 7);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-162')
    UPDATE Inventory SET quantityOnHand = 1, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-162';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-162', 1, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-163')
    UPDATE Inventory SET quantityOnHand = 2, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-163';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-163', 2, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-164')
    UPDATE Inventory SET quantityOnHand = 7, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-164';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-164', 7, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-165')
    UPDATE Inventory SET quantityOnHand = 7, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-165';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-165', 7, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-166')
    UPDATE Inventory SET quantityOnHand = 11, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-166';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-166', 11, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-167')
    UPDATE Inventory SET quantityOnHand = 10, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-167';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-167', 10, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-168')
    UPDATE Inventory SET quantityOnHand = 10, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-168';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-168', 10, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-169')
    UPDATE Inventory SET quantityOnHand = 11, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-169';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-169', 11, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-170')
    UPDATE Inventory SET quantityOnHand = 8, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-170';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-170', 8, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-171')
    UPDATE Inventory SET quantityOnHand = 1, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-171';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-171', 1, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-172')
    UPDATE Inventory SET quantityOnHand = 2, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-172';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-172', 2, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-173')
    UPDATE Inventory SET quantityOnHand = 5, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-173';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-173', 5, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-174')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-174';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-174', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-175')
    UPDATE Inventory SET quantityOnHand = 4, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-175';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-175', 4, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-176')
    UPDATE Inventory SET quantityOnHand = 4, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-176';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-176', 4, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-177')
    UPDATE Inventory SET quantityOnHand = 2, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-177';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-177', 2, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-178')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-178';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-178', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-179')
    UPDATE Inventory SET quantityOnHand = 1, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-179';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-179', 1, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-180')
    UPDATE Inventory SET quantityOnHand = 1, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-180';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-180', 1, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-181')
    UPDATE Inventory SET quantityOnHand = 1, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-181';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-181', 1, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-182')
    UPDATE Inventory SET quantityOnHand = 1, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-182';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-182', 1, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-183')
    UPDATE Inventory SET quantityOnHand = 1, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-183';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-183', 1, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-184')
    UPDATE Inventory SET quantityOnHand = 2, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-184';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-184', 2, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-185')
    UPDATE Inventory SET quantityOnHand = 2, quantityReserved = 0, quantityOut = 1 WHERE sizeId = N'sz-185';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-185', 2, 0, 1);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-186')
    UPDATE Inventory SET quantityOnHand = 2, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-186';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-186', 2, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-187')
    UPDATE Inventory SET quantityOnHand = 4, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-187';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-187', 4, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-188')
    UPDATE Inventory SET quantityOnHand = 1, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-188';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-188', 1, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-189')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-189';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-189', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-190')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-190';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-190', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-191')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-191';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-191', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-192')
    UPDATE Inventory SET quantityOnHand = 22, quantityReserved = 0, quantityOut = 3 WHERE sizeId = N'sz-192';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-192', 22, 0, 3);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-193')
    UPDATE Inventory SET quantityOnHand = 2, quantityReserved = 0, quantityOut = 5 WHERE sizeId = N'sz-193';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-193', 2, 0, 5);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-194')
    UPDATE Inventory SET quantityOnHand = 19, quantityReserved = 0, quantityOut = 2 WHERE sizeId = N'sz-194';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-194', 19, 0, 2);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-195')
    UPDATE Inventory SET quantityOnHand = 48, quantityReserved = 0, quantityOut = 2 WHERE sizeId = N'sz-195';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-195', 48, 0, 2);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-196')
    UPDATE Inventory SET quantityOnHand = 1, quantityReserved = 0, quantityOut = 3 WHERE sizeId = N'sz-196';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-196', 1, 0, 3);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-197')
    UPDATE Inventory SET quantityOnHand = 22, quantityReserved = 0, quantityOut = 3 WHERE sizeId = N'sz-197';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-197', 22, 0, 3);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-198')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-198';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-198', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-199')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-199';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-199', 0, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-200')
    UPDATE Inventory SET quantityOnHand = 20, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-200';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-200', 20, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-201')
    UPDATE Inventory SET quantityOnHand = 40, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-201';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-201', 40, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-202')
    UPDATE Inventory SET quantityOnHand = 10, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-202';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-202', 10, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-203')
    UPDATE Inventory SET quantityOnHand = 20, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-203';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-203', 20, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-204')
    UPDATE Inventory SET quantityOnHand = 28, quantityReserved = 0, quantityOut = 7 WHERE sizeId = N'sz-204';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-204', 28, 0, 7);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-205')
    UPDATE Inventory SET quantityOnHand = 68, quantityReserved = 0, quantityOut = 2 WHERE sizeId = N'sz-205';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-205', 68, 0, 2);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-206')
    UPDATE Inventory SET quantityOnHand = 61, quantityReserved = 0, quantityOut = 4 WHERE sizeId = N'sz-206';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-206', 61, 0, 4);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-207')
    UPDATE Inventory SET quantityOnHand = 15, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-207';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-207', 15, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-208')
    UPDATE Inventory SET quantityOnHand = 28, quantityReserved = 0, quantityOut = 2 WHERE sizeId = N'sz-208';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-208', 28, 0, 2);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-209')
    UPDATE Inventory SET quantityOnHand = 13, quantityReserved = 0, quantityOut = 14 WHERE sizeId = N'sz-209';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-209', 13, 0, 14);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-210')
    UPDATE Inventory SET quantityOnHand = 7, quantityReserved = 0, quantityOut = 14 WHERE sizeId = N'sz-210';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-210', 7, 0, 14);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-211')
    UPDATE Inventory SET quantityOnHand = 9, quantityReserved = 0, quantityOut = 1 WHERE sizeId = N'sz-211';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-211', 9, 0, 1);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-212')
    UPDATE Inventory SET quantityOnHand = 14, quantityReserved = 0, quantityOut = 1 WHERE sizeId = N'sz-212';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-212', 14, 0, 1);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-213')
    UPDATE Inventory SET quantityOnHand = 12, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-213';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-213', 12, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-214')
    UPDATE Inventory SET quantityOnHand = 20, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-214';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-214', 20, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-215')
    UPDATE Inventory SET quantityOnHand = 6, quantityReserved = 0, quantityOut = 1 WHERE sizeId = N'sz-215';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-215', 6, 0, 1);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-216')
    UPDATE Inventory SET quantityOnHand = 15, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-216';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-216', 15, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-217')
    UPDATE Inventory SET quantityOnHand = 24, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-217';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-217', 24, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-218')
    UPDATE Inventory SET quantityOnHand = 130, quantityReserved = 0, quantityOut = 14 WHERE sizeId = N'sz-218';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-218', 130, 0, 14);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-219')
    UPDATE Inventory SET quantityOnHand = 57, quantityReserved = 0, quantityOut = 13 WHERE sizeId = N'sz-219';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-219', 57, 0, 13);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-220')
    UPDATE Inventory SET quantityOnHand = 77, quantityReserved = 0, quantityOut = 13 WHERE sizeId = N'sz-220';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-220', 77, 0, 13);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-221')
    UPDATE Inventory SET quantityOnHand = 28, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-221';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-221', 28, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-222')
    UPDATE Inventory SET quantityOnHand = 4, quantityReserved = 0, quantityOut = 13 WHERE sizeId = N'sz-222';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-222', 4, 0, 13);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-223')
    UPDATE Inventory SET quantityOnHand = 17, quantityReserved = 0, quantityOut = 1 WHERE sizeId = N'sz-223';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-223', 17, 0, 1);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-224')
    UPDATE Inventory SET quantityOnHand = 12, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-224';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-224', 12, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-225')
    UPDATE Inventory SET quantityOnHand = 63, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-225';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-225', 63, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-226')
    UPDATE Inventory SET quantityOnHand = 688, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-226';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-226', 688, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-227')
    UPDATE Inventory SET quantityOnHand = 38, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-227';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-227', 38, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-228')
    UPDATE Inventory SET quantityOnHand = 2, quantityReserved = 0, quantityOut = 7 WHERE sizeId = N'sz-228';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-228', 2, 0, 7);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-229')
    UPDATE Inventory SET quantityOnHand = 473, quantityReserved = 0, quantityOut = 27 WHERE sizeId = N'sz-229';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-229', 473, 0, 27);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-230')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 4 WHERE sizeId = N'sz-230';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-230', 0, 0, 4);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-231')
    UPDATE Inventory SET quantityOnHand = 226, quantityReserved = 0, quantityOut = 24 WHERE sizeId = N'sz-231';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-231', 226, 0, 24);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-232')
    UPDATE Inventory SET quantityOnHand = 1276, quantityReserved = 0, quantityOut = 24 WHERE sizeId = N'sz-232';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-232', 1276, 0, 24);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-233')
    UPDATE Inventory SET quantityOnHand = 477, quantityReserved = 0, quantityOut = 23 WHERE sizeId = N'sz-233';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-233', 477, 0, 23);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-234')
    UPDATE Inventory SET quantityOnHand = 4, quantityReserved = 0, quantityOut = 20 WHERE sizeId = N'sz-234';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-234', 4, 0, 20);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-235')
    UPDATE Inventory SET quantityOnHand = 38, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-235';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-235', 38, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-236')
    UPDATE Inventory SET quantityOnHand = 377, quantityReserved = 0, quantityOut = 23 WHERE sizeId = N'sz-236';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-236', 377, 0, 23);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-237')
    UPDATE Inventory SET quantityOnHand = 126, quantityReserved = 0, quantityOut = 24 WHERE sizeId = N'sz-237';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-237', 126, 0, 24);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-238')
    UPDATE Inventory SET quantityOnHand = 7, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-238';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-238', 7, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-239')
    UPDATE Inventory SET quantityOnHand = 120, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-239';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-239', 120, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-240')
    UPDATE Inventory SET quantityOnHand = 113, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-240';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-240', 113, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-241')
    UPDATE Inventory SET quantityOnHand = 2630, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-241';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-241', 2630, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-242')
    UPDATE Inventory SET quantityOnHand = 59, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-242';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-242', 59, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-243')
    UPDATE Inventory SET quantityOnHand = 188, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-243';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-243', 188, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-244')
    UPDATE Inventory SET quantityOnHand = 88, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-244';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-244', 88, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-245')
    UPDATE Inventory SET quantityOnHand = 26, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-245';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-245', 26, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-246')
    UPDATE Inventory SET quantityOnHand = 60, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-246';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-246', 60, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-247')
    UPDATE Inventory SET quantityOnHand = 88, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-247';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-247', 88, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-248')
    UPDATE Inventory SET quantityOnHand = 169, quantityReserved = 0, quantityOut = 11 WHERE sizeId = N'sz-248';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-248', 169, 0, 11);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-249')
    UPDATE Inventory SET quantityOnHand = 200, quantityReserved = 0, quantityOut = 0 WHERE sizeId = N'sz-249';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-249', 200, 0, 0);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-250')
    UPDATE Inventory SET quantityOnHand = 456, quantityReserved = 0, quantityOut = 44 WHERE sizeId = N'sz-250';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-250', 456, 0, 44);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-251')
    UPDATE Inventory SET quantityOnHand = 378, quantityReserved = 0, quantityOut = 22 WHERE sizeId = N'sz-251';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-251', 378, 0, 22);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-252')
    UPDATE Inventory SET quantityOnHand = 41, quantityReserved = 0, quantityOut = 9 WHERE sizeId = N'sz-252';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-252', 41, 0, 9);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-253')
    UPDATE Inventory SET quantityOnHand = 47, quantityReserved = 0, quantityOut = 3 WHERE sizeId = N'sz-253';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-253', 47, 0, 3);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-254')
    UPDATE Inventory SET quantityOnHand = 43, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-254';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-254', 43, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-255')
    UPDATE Inventory SET quantityOnHand = 16, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-255';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-255', 16, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-256')
    UPDATE Inventory SET quantityOnHand = 9, quantityReserved = 0, quantityOut = 1 WHERE sizeId = N'sz-256';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-256', 9, 0, 1);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-257')
    UPDATE Inventory SET quantityOnHand = 15, quantityReserved = 0, quantityOut = 8 WHERE sizeId = N'sz-257';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-257', 15, 0, 8);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-258')
    UPDATE Inventory SET quantityOnHand = 10, quantityReserved = 0, quantityOut = 3 WHERE sizeId = N'sz-258';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-258', 10, 0, 3);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-259')
    UPDATE Inventory SET quantityOnHand = 23, quantityReserved = 0, quantityOut = 1 WHERE sizeId = N'sz-259';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-259', 23, 0, 1);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-260')
    UPDATE Inventory SET quantityOnHand = 41, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-260';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-260', 41, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-261')
    UPDATE Inventory SET quantityOnHand = 29, quantityReserved = 0, quantityOut = 5 WHERE sizeId = N'sz-261';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-261', 29, 0, 5);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-262')
    UPDATE Inventory SET quantityOnHand = 13, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-262';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-262', 13, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-263')
    UPDATE Inventory SET quantityOnHand = 0, quantityReserved = 0, quantityOut = 4 WHERE sizeId = N'sz-263';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-263', 0, 0, 4);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-264')
    UPDATE Inventory SET quantityOnHand = 110, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-264';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-264', 110, 0, 12);
IF EXISTS (SELECT 1 FROM Inventory WHERE sizeId = N'sz-265')
    UPDATE Inventory SET quantityOnHand = 46, quantityReserved = 0, quantityOut = 12 WHERE sizeId = N'sz-265';
ELSE
    INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, quantityOut)
    VALUES (N'sz-265', 46, 0, 12);

-- =====================================================
-- Commit Transaction
-- =====================================================
COMMIT TRANSACTION;
PRINT '';
PRINT '=====================================================';
PRINT 'PPE Seed Data Import Complete!';
PRINT '=====================================================';
PRINT 'Categories: 13';
PRINT 'Item Types: 83';
PRINT 'Variants: 83';
PRINT 'Sizes: 265';
PRINT 'Inventory Records: 265';
PRINT '=====================================================';

END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    PRINT 'ERROR: ' + ERROR_MESSAGE();
    THROW;
END CATCH
