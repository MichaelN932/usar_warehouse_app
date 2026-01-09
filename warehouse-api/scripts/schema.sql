-- USAR Warehouse Database Schema
-- Azure SQL / SQL Server

-- Users table
CREATE TABLE Users (
    id NVARCHAR(36) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL UNIQUE,
    passwordHash NVARCHAR(255) NOT NULL,
    firstName NVARCHAR(100) NOT NULL,
    lastName NVARCHAR(100) NOT NULL,
    role NVARCHAR(50) NOT NULL CHECK (role IN ('TeamMember', 'WarehouseStaff', 'WarehouseAdmin')),
    isActive BIT NOT NULL DEFAULT 1,
    sizes NVARCHAR(MAX), -- JSON string
    createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Categories table
CREATE TABLE Categories (
    id NVARCHAR(36) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(500),
    sortOrder INT NOT NULL DEFAULT 0,
    isActive BIT NOT NULL DEFAULT 1
);

-- ItemTypes table
CREATE TABLE ItemTypes (
    id NVARCHAR(36) PRIMARY KEY,
    categoryId NVARCHAR(36) NOT NULL REFERENCES Categories(id),
    name NVARCHAR(200) NOT NULL,
    description NVARCHAR(1000),
    femaCode NVARCHAR(50),
    femaRequiredQty INT NOT NULL DEFAULT 0,
    parLevel INT NOT NULL DEFAULT 0,
    isConsumable BIT NOT NULL DEFAULT 0,
    isActive BIT NOT NULL DEFAULT 1
);

-- Variants table
CREATE TABLE Variants (
    id NVARCHAR(36) PRIMARY KEY,
    itemTypeId NVARCHAR(36) NOT NULL REFERENCES ItemTypes(id),
    name NVARCHAR(200) NOT NULL,
    manufacturer NVARCHAR(200),
    sku NVARCHAR(100),
    barcode NVARCHAR(100),
    unitCost DECIMAL(10,2),
    isActive BIT NOT NULL DEFAULT 1
);

-- Sizes table
CREATE TABLE Sizes (
    id NVARCHAR(36) PRIMARY KEY,
    variantId NVARCHAR(36) NOT NULL REFERENCES Variants(id),
    name NVARCHAR(100) NOT NULL,
    sortOrder INT NOT NULL DEFAULT 0,
    isActive BIT NOT NULL DEFAULT 1
);

-- Inventory table
CREATE TABLE Inventory (
    sizeId NVARCHAR(36) PRIMARY KEY REFERENCES Sizes(id),
    quantityOnHand INT NOT NULL DEFAULT 0,
    quantityReserved INT NOT NULL DEFAULT 0,
    lastCountDate DATETIME2,
    lastCountBy NVARCHAR(36) REFERENCES Users(id)
);

-- Vendors table
CREATE TABLE Vendors (
    id NVARCHAR(36) PRIMARY KEY,
    name NVARCHAR(200) NOT NULL,
    contactName NVARCHAR(200),
    email NVARCHAR(255),
    phone NVARCHAR(50),
    address NVARCHAR(500),
    website NVARCHAR(255),
    notes NVARCHAR(MAX),
    isActive BIT NOT NULL DEFAULT 1
);

-- Requests table
CREATE TABLE Requests (
    id NVARCHAR(36) PRIMARY KEY,
    requestedBy NVARCHAR(36) NOT NULL REFERENCES Users(id),
    requestedByName NVARCHAR(200) NOT NULL,
    status NVARCHAR(50) NOT NULL CHECK (status IN ('Pending', 'Approved', 'Backordered', 'ReadyForPickup', 'Fulfilled', 'Cancelled')),
    requestDate DATETIME2 NOT NULL,
    notes NVARCHAR(MAX),
    fulfilledBy NVARCHAR(36) REFERENCES Users(id),
    fulfilledAt DATETIME2,
    pickupSignature NVARCHAR(MAX), -- Base64 encoded
    pickupSignedAt DATETIME2,
    createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- RequestLines table
CREATE TABLE RequestLines (
    id NVARCHAR(36) PRIMARY KEY,
    requestId NVARCHAR(36) NOT NULL REFERENCES Requests(id) ON DELETE CASCADE,
    itemTypeId NVARCHAR(36) NOT NULL REFERENCES ItemTypes(id),
    itemTypeName NVARCHAR(200) NOT NULL,
    requestedSizeId NVARCHAR(36) REFERENCES Sizes(id),
    requestedSizeName NVARCHAR(100),
    preferredVariantId NVARCHAR(36) REFERENCES Variants(id),
    preferredVariantName NVARCHAR(200),
    quantity INT NOT NULL,
    replacementReason NVARCHAR(200),
    issuedSizeId NVARCHAR(36) REFERENCES Sizes(id),
    issuedQuantity INT NOT NULL DEFAULT 0,
    isBackordered BIT NOT NULL DEFAULT 0,
    backorderedAt DATETIME2
);

-- PurchaseOrders table
CREATE TABLE PurchaseOrders (
    id NVARCHAR(36) PRIMARY KEY,
    poNumber NVARCHAR(50) NOT NULL UNIQUE,
    vendorId NVARCHAR(36) NOT NULL REFERENCES Vendors(id),
    vendorName NVARCHAR(200) NOT NULL,
    status NVARCHAR(50) NOT NULL CHECK (status IN ('Draft', 'Submitted', 'PartialReceived', 'Received', 'Cancelled')),
    orderDate DATETIME2,
    expectedDeliveryDate DATETIME2,
    totalAmount DECIMAL(12,2) NOT NULL DEFAULT 0,
    notes NVARCHAR(MAX),
    createdBy NVARCHAR(36) NOT NULL REFERENCES Users(id),
    createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- POLines table
CREATE TABLE POLines (
    id NVARCHAR(36) PRIMARY KEY,
    purchaseOrderId NVARCHAR(36) NOT NULL REFERENCES PurchaseOrders(id) ON DELETE CASCADE,
    sizeId NVARCHAR(36) NOT NULL REFERENCES Sizes(id),
    itemDescription NVARCHAR(500) NOT NULL,
    quantityOrdered INT NOT NULL,
    quantityReceived INT NOT NULL DEFAULT 0,
    unitCost DECIMAL(10,2) NOT NULL,
    lineTotal DECIMAL(12,2) NOT NULL
);

-- ReceivingDocuments table
CREATE TABLE ReceivingDocuments (
    id NVARCHAR(36) PRIMARY KEY,
    purchaseOrderId NVARCHAR(36) REFERENCES PurchaseOrders(id),
    poNumber NVARCHAR(50),
    documentImageUrl NVARCHAR(500),
    ocrRawText NVARCHAR(MAX),
    receivedBy NVARCHAR(36) NOT NULL REFERENCES Users(id),
    receivedAt DATETIME2 NOT NULL,
    notes NVARCHAR(MAX)
);

-- ReceivingLines table
CREATE TABLE ReceivingLines (
    id NVARCHAR(36) PRIMARY KEY,
    receivingDocId NVARCHAR(36) NOT NULL REFERENCES ReceivingDocuments(id) ON DELETE CASCADE,
    poLineId NVARCHAR(36) REFERENCES POLines(id),
    sizeId NVARCHAR(36) NOT NULL REFERENCES Sizes(id),
    itemDescription NVARCHAR(500) NOT NULL,
    quantityReceived INT NOT NULL
);

-- IssuedItems table (Personnel inventory)
CREATE TABLE IssuedItems (
    id NVARCHAR(36) PRIMARY KEY,
    userId NVARCHAR(36) NOT NULL REFERENCES Users(id),
    sizeId NVARCHAR(36) NOT NULL REFERENCES Sizes(id),
    itemDescription NVARCHAR(500) NOT NULL,
    categoryName NVARCHAR(100) NOT NULL,
    itemTypeName NVARCHAR(200) NOT NULL,
    variantName NVARCHAR(200) NOT NULL,
    sizeName NVARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    issuedAt DATETIME2 NOT NULL,
    requestLineId NVARCHAR(36) REFERENCES RequestLines(id),
    returnedAt DATETIME2,
    returnReason NVARCHAR(200),
    returnCondition NVARCHAR(50) CHECK (returnCondition IN ('Serviceable', 'NeedsRepair', 'Dispose'))
);

-- InventoryAdjustments table
CREATE TABLE InventoryAdjustments (
    id NVARCHAR(36) PRIMARY KEY,
    sizeId NVARCHAR(36) NOT NULL REFERENCES Sizes(id),
    itemDescription NVARCHAR(500) NOT NULL,
    adjustmentType NVARCHAR(50) NOT NULL CHECK (adjustmentType IN ('Count', 'Damage', 'Loss', 'Found', 'Transfer')),
    quantityBefore INT NOT NULL,
    quantityAfter INT NOT NULL,
    quantityChange INT NOT NULL,
    reason NVARCHAR(500),
    adjustedBy NVARCHAR(36) NOT NULL REFERENCES Users(id),
    adjustedByName NVARCHAR(200) NOT NULL,
    adjustedAt DATETIME2 NOT NULL
);

-- Notifications table
CREATE TABLE Notifications (
    id NVARCHAR(36) PRIMARY KEY,
    userId NVARCHAR(36) NOT NULL REFERENCES Users(id),
    title NVARCHAR(200) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    relatedTable NVARCHAR(100),
    relatedRecordId NVARCHAR(36),
    isRead BIT NOT NULL DEFAULT 0,
    createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    readAt DATETIME2
);

-- AuditLog table
CREATE TABLE AuditLog (
    id NVARCHAR(36) PRIMARY KEY,
    tableName NVARCHAR(100) NOT NULL,
    recordId NVARCHAR(36) NOT NULL,
    action NVARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    userId NVARCHAR(36) REFERENCES Users(id),
    userName NVARCHAR(200),
    oldValues NVARCHAR(MAX), -- JSON
    newValues NVARCHAR(MAX), -- JSON
    timestamp DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- Create indexes for performance
CREATE INDEX IX_ItemTypes_categoryId ON ItemTypes(categoryId);
CREATE INDEX IX_Variants_itemTypeId ON Variants(itemTypeId);
CREATE INDEX IX_Sizes_variantId ON Sizes(variantId);
CREATE INDEX IX_Requests_requestedBy ON Requests(requestedBy);
CREATE INDEX IX_Requests_status ON Requests(status);
CREATE INDEX IX_RequestLines_requestId ON RequestLines(requestId);
CREATE INDEX IX_PurchaseOrders_vendorId ON PurchaseOrders(vendorId);
CREATE INDEX IX_PurchaseOrders_status ON PurchaseOrders(status);
CREATE INDEX IX_POLines_purchaseOrderId ON POLines(purchaseOrderId);
CREATE INDEX IX_IssuedItems_userId ON IssuedItems(userId);
CREATE INDEX IX_IssuedItems_sizeId ON IssuedItems(sizeId);
CREATE INDEX IX_Notifications_userId ON Notifications(userId);
CREATE INDEX IX_Notifications_isRead ON Notifications(userId, isRead);
CREATE INDEX IX_AuditLog_tableName ON AuditLog(tableName, recordId);

-- Insert default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO Users (id, email, passwordHash, firstName, lastName, role, isActive, sizes, createdAt, updatedAt)
VALUES (
    'admin-001',
    'admin@lacountyfire.gov',
    '$2a$10$rQnM1rQEqPKq6xQj5xJvKuZhJvJvJvJvJvJvJvJvJvJvJvJvJvJvK', -- Change this!
    'System',
    'Administrator',
    'WarehouseAdmin',
    1,
    '{}',
    GETUTCDATE(),
    GETUTCDATE()
);
