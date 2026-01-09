// =============================================
// Warehouse Inventory & PPE Management System
// TypeScript Interfaces
// =============================================

// User & Auth
export type UserRole = 'TeamMember' | 'WarehouseStaff' | 'WarehouseAdmin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  sizes: UserSizes;
  createdAt: string;
  updatedAt: string;
}

export interface UserSizes {
  shirt?: string;
  pantsWaist?: string;
  pantsInseam?: string;
  bootSize?: string;
  gloveSize?: string;
  hatSize?: string;
}

// Item Catalog
export interface Category {
  id: string;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ItemType {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  femaCode: string;           // e.g., "LG-0112.00"
  femaRequiredQty: number;    // FEMA recommendation (reference only)
  parLevel: number;           // Your actual reorder point
  isConsumable: boolean;
  isActive: boolean;
}

export interface Variant {
  id: string;
  itemTypeId: string;
  name: string;               // e.g., "5.11 Stryke TDU"
  manufacturer: string;
  sku?: string;
  barcode?: string;
  unitCost?: number;
  isActive: boolean;
}

export interface Size {
  id: string;
  variantId: string;
  name: string;               // e.g., "32x32", "Large", "10.5"
  sortOrder: number;
  isActive: boolean;
}

// Inventory
export interface InventoryItem {
  sizeId: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;  // Computed: onHand - reserved
  lastCountDate?: string;
  lastCountBy?: string;
}

// Denormalized view for UI
export interface CatalogItem {
  categoryId: string;
  categoryName: string;
  itemTypeId: string;
  itemTypeName: string;
  femaCode: string;
  isConsumable: boolean;
  variantId: string;
  variantName: string;
  manufacturer: string;
  sizeId: string;
  sizeName: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
}

// Requests (Employee Store)
export type RequestStatus = 
  | 'Pending' 
  | 'Approved' 
  | 'Backordered' 
  | 'ReadyForPickup' 
  | 'Fulfilled' 
  | 'Cancelled';

export interface Request {
  id: string;
  requestedBy: string;        // User ID
  requestedByName: string;    // Denormalized for display
  status: RequestStatus;
  requestDate: string;
  notes?: string;
  lines: RequestLine[];
  fulfilledBy?: string;
  fulfilledAt?: string;
  pickupSignature?: string;   // Base64 image
  pickupSignedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RequestLine {
  id: string;
  requestId: string;
  itemTypeId: string;
  itemTypeName: string;       // Denormalized
  requestedSizeId?: string;
  requestedSizeName?: string; // Denormalized
  preferredVariantId?: string;
  preferredVariantName?: string; // Denormalized
  quantity: number;
  replacementReason?: string; // Required for durables if user already has one
  issuedSizeId?: string;
  issuedQuantity: number;
  isBackordered: boolean;
  backorderedAt?: string;
}

// Purchase Orders
export type POStatus = 
  | 'Draft' 
  | 'Submitted' 
  | 'PartialReceived' 
  | 'Received' 
  | 'Cancelled';

export interface Vendor {
  id: string;
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  notes?: string;
  isActive: boolean;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;         // Denormalized
  status: POStatus;
  orderDate?: string;
  expectedDeliveryDate?: string;
  totalAmount: number;
  notes?: string;
  lines: POLine[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface POLine {
  id: string;
  purchaseOrderId: string;
  sizeId: string;
  itemDescription: string;    // Denormalized
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: number;
  lineTotal: number;
}

// Receiving
export interface ReceivingDocument {
  id: string;
  purchaseOrderId?: string;
  poNumber?: string;
  documentImageUrl?: string;
  ocrRawText?: string;
  receivedBy: string;
  receivedAt: string;
  lines: ReceivingLine[];
  notes?: string;
}

export interface ReceivingLine {
  id: string;
  receivingDocId: string;
  poLineId?: string;
  sizeId: string;
  itemDescription: string;
  quantityReceived: number;
}

// Personnel Issued Inventory
export interface IssuedItem {
  id: string;
  userId: string;
  sizeId: string;
  itemDescription: string;    // Denormalized: "5.11 BDU Pants - 32x32"
  categoryName: string;
  itemTypeName: string;
  variantName: string;
  sizeName: string;
  quantity: number;
  issuedAt: string;
  requestLineId?: string;
  returnedAt?: string;
  returnReason?: string;
  returnCondition?: 'Serviceable' | 'NeedsRepair' | 'Dispose';
}

// Notifications
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  relatedTable?: string;
  relatedRecordId?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

// Audit Log
export interface AuditLogEntry {
  id: string;
  tableName: string;
  recordId: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  userId?: string;
  userName?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  timestamp: string;
}

// Inventory Adjustment
export type AdjustmentType = 
  | 'Count' 
  | 'Damage' 
  | 'Loss' 
  | 'Found' 
  | 'Transfer';

export interface InventoryAdjustment {
  id: string;
  sizeId: string;
  itemDescription: string;
  adjustmentType: AdjustmentType;
  quantityBefore: number;
  quantityAfter: number;
  quantityChange: number;
  reason?: string;
  adjustedBy: string;
  adjustedByName: string;
  adjustedAt: string;
}

// Replacement Reasons (for durables)
export const REPLACEMENT_REASONS = [
  'Damaged',
  'Lost',
  'Sizing Issue',
  'Worn Out',
  'Contaminated',
  'Other'
] as const;

export type ReplacementReason = typeof REPLACEMENT_REASONS[number];

// Return Conditions
export const RETURN_CONDITIONS = [
  'Serviceable',
  'NeedsRepair', 
  'Dispose'
] as const;

export type ReturnCondition = typeof RETURN_CONDITIONS[number];
