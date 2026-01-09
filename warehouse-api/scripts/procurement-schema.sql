-- USAR Warehouse - Procurement System Schema Additions
-- Run after main schema.sql

-- =====================================================
-- Grant Sources Table
-- Admin-configurable funding sources (FEMA, State, PRM)
-- =====================================================
CREATE TABLE GrantSources (
    id NVARCHAR(36) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,           -- 'FEMA', 'State Homeland Security', 'PRM'
    code NVARCHAR(20) NOT NULL UNIQUE,     -- 'FEMA-2025', 'SHS-2025'
    description NVARCHAR(500),
    fiscalYear INT NOT NULL,
    totalBudget DECIMAL(12,2) NOT NULL DEFAULT 0,
    usedBudget DECIMAL(12,2) NOT NULL DEFAULT 0,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- =====================================================
-- Quote Requests Table
-- Requests for quotes (before PO creation)
-- =====================================================
CREATE TABLE QuoteRequests (
    id NVARCHAR(36) PRIMARY KEY,
    requestNumber NVARCHAR(20) NOT NULL UNIQUE,  -- 'QR-2025-001'
    grantSourceId NVARCHAR(36) REFERENCES GrantSources(id),
    status NVARCHAR(20) NOT NULL CHECK (status IN ('Draft', 'Sent', 'QuotesReceived', 'Approved', 'Denied', 'Converted')),
    requestedBy NVARCHAR(36) NOT NULL REFERENCES Users(id),
    approvedBy NVARCHAR(36) REFERENCES Users(id),
    approvedAt DATETIME2,
    deniedBy NVARCHAR(36) REFERENCES Users(id),
    deniedAt DATETIME2,
    denialReason NVARCHAR(500),
    notes NVARCHAR(MAX),
    dueDate DATE,
    sentAt DATETIME2,
    createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- =====================================================
-- Quote Request Lines Table
-- Line items for quote requests
-- =====================================================
CREATE TABLE QuoteRequestLines (
    id NVARCHAR(36) PRIMARY KEY,
    quoteRequestId NVARCHAR(36) NOT NULL REFERENCES QuoteRequests(id) ON DELETE CASCADE,
    itemTypeId NVARCHAR(36) REFERENCES ItemTypes(id),
    variantId NVARCHAR(36) REFERENCES Variants(id),
    sizeId NVARCHAR(36) REFERENCES Sizes(id),
    description NVARCHAR(500) NOT NULL,
    quantity INT NOT NULL,
    estimatedUnitPrice DECIMAL(10,2),
    notes NVARCHAR(500),
    sortOrder INT NOT NULL DEFAULT 0
);

-- =====================================================
-- Vendor Quotes Table
-- Quote responses from vendors
-- =====================================================
CREATE TABLE VendorQuotes (
    id NVARCHAR(36) PRIMARY KEY,
    quoteRequestId NVARCHAR(36) NOT NULL REFERENCES QuoteRequests(id) ON DELETE CASCADE,
    vendorId NVARCHAR(36) NOT NULL REFERENCES Vendors(id),
    quoteNumber NVARCHAR(50),
    receivedDate DATE NOT NULL,
    validUntil DATE,
    totalAmount DECIMAL(12,2) NOT NULL DEFAULT 0,
    shippingCost DECIMAL(10,2) NOT NULL DEFAULT 0,
    leadTimeDays INT,
    attachmentUrl NVARCHAR(500),           -- PDF storage URL
    attachmentFileName NVARCHAR(255),
    isSelected BIT NOT NULL DEFAULT 0,
    notes NVARCHAR(MAX),
    createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    updatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- =====================================================
-- Vendor Quote Lines Table
-- Line items from vendor quotes
-- =====================================================
CREATE TABLE VendorQuoteLines (
    id NVARCHAR(36) PRIMARY KEY,
    vendorQuoteId NVARCHAR(36) NOT NULL REFERENCES VendorQuotes(id) ON DELETE CASCADE,
    quoteRequestLineId NVARCHAR(36) REFERENCES QuoteRequestLines(id),
    description NVARCHAR(500) NOT NULL,
    unitPrice DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    lineTotal DECIMAL(12,2) NOT NULL,
    availability NVARCHAR(50),              -- 'In Stock', 'Backorder 2 weeks', etc.
    notes NVARCHAR(500)
);

-- =====================================================
-- Inbound Emails Table
-- Emails processed for quote responses
-- =====================================================
CREATE TABLE InboundEmails (
    id NVARCHAR(36) PRIMARY KEY,
    fromAddress NVARCHAR(255) NOT NULL,
    toAddress NVARCHAR(255),
    subject NVARCHAR(500) NOT NULL,
    receivedAt DATETIME2 NOT NULL,
    body NVARCHAR(MAX),
    attachmentCount INT NOT NULL DEFAULT 0,
    attachmentUrls NVARCHAR(MAX),           -- JSON array of URLs
    status NVARCHAR(20) NOT NULL CHECK (status IN ('Pending', 'Processed', 'Failed', 'Ignored')),
    matchedVendorId NVARCHAR(36) REFERENCES Vendors(id),
    matchedQuoteRequestId NVARCHAR(36) REFERENCES QuoteRequests(id),
    processedAt DATETIME2,
    processedBy NVARCHAR(36) REFERENCES Users(id),
    errorMessage NVARCHAR(500),
    createdAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);

-- =====================================================
-- Modify Existing Tables
-- =====================================================

-- Add email domain to Vendors for auto-matching
ALTER TABLE Vendors ADD emailDomain NVARCHAR(100);

-- Add procurement fields to PurchaseOrders
ALTER TABLE PurchaseOrders ADD grantSourceId NVARCHAR(36) REFERENCES GrantSources(id);
ALTER TABLE PurchaseOrders ADD quoteRequestId NVARCHAR(36) REFERENCES QuoteRequests(id);
ALTER TABLE PurchaseOrders ADD vendorQuoteId NVARCHAR(36) REFERENCES VendorQuotes(id);
ALTER TABLE PurchaseOrders ADD trackingNumber NVARCHAR(100);
ALTER TABLE PurchaseOrders ADD shippingCarrier NVARCHAR(50);
ALTER TABLE PurchaseOrders ADD shippingCost DECIMAL(10,2) DEFAULT 0;

-- =====================================================
-- Create Indexes
-- =====================================================
CREATE INDEX IX_GrantSources_fiscalYear ON GrantSources(fiscalYear);
CREATE INDEX IX_GrantSources_isActive ON GrantSources(isActive);
CREATE INDEX IX_QuoteRequests_grantSourceId ON QuoteRequests(grantSourceId);
CREATE INDEX IX_QuoteRequests_status ON QuoteRequests(status);
CREATE INDEX IX_QuoteRequests_requestedBy ON QuoteRequests(requestedBy);
CREATE INDEX IX_QuoteRequestLines_quoteRequestId ON QuoteRequestLines(quoteRequestId);
CREATE INDEX IX_VendorQuotes_quoteRequestId ON VendorQuotes(quoteRequestId);
CREATE INDEX IX_VendorQuotes_vendorId ON VendorQuotes(vendorId);
CREATE INDEX IX_VendorQuoteLines_vendorQuoteId ON VendorQuoteLines(vendorQuoteId);
CREATE INDEX IX_InboundEmails_status ON InboundEmails(status);
CREATE INDEX IX_InboundEmails_matchedVendorId ON InboundEmails(matchedVendorId);
CREATE INDEX IX_InboundEmails_matchedQuoteRequestId ON InboundEmails(matchedQuoteRequestId);
CREATE INDEX IX_PurchaseOrders_grantSourceId ON PurchaseOrders(grantSourceId);
CREATE INDEX IX_PurchaseOrders_quoteRequestId ON PurchaseOrders(quoteRequestId);

-- =====================================================
-- Insert Default Grant Sources
-- =====================================================
INSERT INTO GrantSources (id, name, code, description, fiscalYear, totalBudget, usedBudget, isActive)
VALUES
    ('grant-fema-2025', 'FEMA USAR Grant', 'FEMA-2025', 'Federal Emergency Management Agency USAR Equipment Grant FY2025', 2025, 250000.00, 0, 1),
    ('grant-shs-2025', 'State Homeland Security', 'SHS-2025', 'California State Homeland Security Grant Program FY2025', 2025, 125000.00, 0, 1),
    ('grant-prm-2025', 'PRM Equipment Fund', 'PRM-2025', 'Personnel Readiness & Maintenance Equipment Fund FY2025', 2025, 175000.00, 0, 1);
