-- Migration: 001-add-ppe-fields.sql
-- Description: Add missing columns to support full PPE inventory data from Excel
-- Source: ppe_inventory_USAR_OPTIMIZED.xlsx
-- Date: 2026-01-09

-- =====================================================
-- ItemTypes Table - Add subcategory, type, deployment
-- =====================================================

-- Add subcategory column (e.g., "BDUs", "Outerwear", "T-Shirts")
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('ItemTypes') AND name = 'subcategory')
BEGIN
    ALTER TABLE ItemTypes ADD subcategory NVARCHAR(100) NULL;
    PRINT 'Added subcategory column to ItemTypes';
END

-- Add type column (e.g., "Bottoms", "Tops", "Accessories")
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('ItemTypes') AND name = 'type')
BEGIN
    ALTER TABLE ItemTypes ADD type NVARCHAR(100) NULL;
    PRINT 'Added type column to ItemTypes';
END

-- Add deployment column (e.g., "CA-TF2", "USAID")
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('ItemTypes') AND name = 'deployment')
BEGIN
    ALTER TABLE ItemTypes ADD deployment NVARCHAR(50) NOT NULL DEFAULT 'CA-TF2';
    PRINT 'Added deployment column to ItemTypes';
END

-- =====================================================
-- Sizes Table - Add sizeDetail and legacyId
-- =====================================================

-- Add sizeDetail column (e.g., "27-31 / 29½-32½" for waist/inseam ranges)
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Sizes') AND name = 'sizeDetail')
BEGIN
    ALTER TABLE Sizes ADD sizeDetail NVARCHAR(100) NULL;
    PRINT 'Added sizeDetail column to Sizes';
END

-- Add legacyId column (original ITEM_ID from Excel for reference)
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Sizes') AND name = 'legacyId')
BEGIN
    ALTER TABLE Sizes ADD legacyId NVARCHAR(100) NULL;
    PRINT 'Added legacyId column to Sizes';
END

-- =====================================================
-- Inventory Table - Add quantityOut
-- =====================================================

-- Add quantityOut column (items currently issued to personnel)
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('Inventory') AND name = 'quantityOut')
BEGIN
    ALTER TABLE Inventory ADD quantityOut INT NOT NULL DEFAULT 0;
    PRINT 'Added quantityOut column to Inventory';
END

-- =====================================================
-- Add indexes for new columns
-- =====================================================

-- Index on deployment for filtering by task force
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ItemTypes_deployment')
BEGIN
    CREATE INDEX IX_ItemTypes_deployment ON ItemTypes(deployment);
    PRINT 'Created index IX_ItemTypes_deployment';
END

-- Index on subcategory for filtering
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ItemTypes_subcategory')
BEGIN
    CREATE INDEX IX_ItemTypes_subcategory ON ItemTypes(subcategory);
    PRINT 'Created index IX_ItemTypes_subcategory';
END

-- Index on legacyId for lookups from old system
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Sizes_legacyId')
BEGIN
    CREATE INDEX IX_Sizes_legacyId ON Sizes(legacyId);
    PRINT 'Created index IX_Sizes_legacyId';
END

PRINT 'Migration 001-add-ppe-fields.sql completed successfully';
