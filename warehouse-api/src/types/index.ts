// =============================================
// Warehouse API - TypeScript Interfaces
// Shared types between frontend and backend
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

// Extended user for database (includes password hash)
export interface UserRecord extends User {
  passwordHash: string;
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
  femaCode: string;
  femaRequiredQty: number;
  parLevel: number;
  isConsumable: boolean;
  isActive: boolean;
}

export interface Variant {
  id: string;
  itemTypeId: string;
  name: string;
  manufacturer: string;
  sku?: string;
  barcode?: string;
  unitCost?: number;
  isActive: boolean;
}

export interface Size {
  id: string;
  variantId: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

// Inventory
export interface InventoryItem {
  sizeId: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
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
  requestedBy: string;
  requestedByName: string;
  status: RequestStatus;
  requestDate: string;
  notes?: string;
  lines: RequestLine[];
  fulfilledBy?: string;
  fulfilledAt?: string;
  pickupSignature?: string;
  pickupSignedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RequestLine {
  id: string;
  requestId: string;
  itemTypeId: string;
  itemTypeName: string;
  requestedSizeId?: string;
  requestedSizeName?: string;
  preferredVariantId?: string;
  preferredVariantName?: string;
  quantity: number;
  replacementReason?: string;
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
  vendorName: string;
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
  itemDescription: string;
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
  itemDescription: string;
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
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
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

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// =============================================
// Procurement System Types
// =============================================

// Grant Sources
export interface GrantSource {
  id: string;
  name: string;
  code: string;
  description?: string;
  fiscalYear: number;
  totalBudget: number;
  usedBudget: number;
  remainingBudget: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Quote Request Status
export type QuoteRequestStatus =
  | 'Draft'
  | 'Sent'
  | 'QuotesReceived'
  | 'Approved'
  | 'Denied'
  | 'Converted';

// Quote Request
export interface QuoteRequest {
  id: string;
  requestNumber: string;
  grantSourceId?: string;
  grantSource?: GrantSource;
  status: QuoteRequestStatus;
  requestedBy: string;
  requestedByName?: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  deniedBy?: string;
  deniedByName?: string;
  deniedAt?: string;
  denialReason?: string;
  notes?: string;
  dueDate?: string;
  sentAt?: string;
  lines: QuoteRequestLine[];
  vendorQuotes: VendorQuote[];
  createdAt: string;
  updatedAt: string;
}

// Quote Request Line
export interface QuoteRequestLine {
  id: string;
  quoteRequestId: string;
  itemTypeId?: string;
  itemTypeName?: string;
  variantId?: string;
  variantName?: string;
  sizeId?: string;
  sizeName?: string;
  description: string;
  quantity: number;
  estimatedUnitPrice?: number;
  notes?: string;
  sortOrder: number;
}

// Vendor Quote
export interface VendorQuote {
  id: string;
  quoteRequestId: string;
  vendorId: string;
  vendor?: Vendor;
  quoteNumber?: string;
  receivedDate: string;
  validUntil?: string;
  totalAmount: number;
  shippingCost: number;
  leadTimeDays?: number;
  attachmentUrl?: string;
  attachmentFileName?: string;
  isSelected: boolean;
  notes?: string;
  lines: VendorQuoteLine[];
  createdAt: string;
  updatedAt: string;
}

// Vendor Quote Line
export interface VendorQuoteLine {
  id: string;
  vendorQuoteId: string;
  quoteRequestLineId?: string;
  description: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  availability?: string;
  notes?: string;
}

// Inbound Email Status
export type InboundEmailStatus = 'Pending' | 'Processed' | 'Failed' | 'Ignored';

// Inbound Email
export interface InboundEmail {
  id: string;
  fromAddress: string;
  toAddress?: string;
  subject: string;
  receivedAt: string;
  body?: string;
  attachmentCount: number;
  attachmentUrls?: string[];
  status: InboundEmailStatus;
  matchedVendorId?: string;
  matchedVendor?: Vendor;
  matchedQuoteRequestId?: string;
  matchedQuoteRequest?: QuoteRequest;
  processedAt?: string;
  processedBy?: string;
  errorMessage?: string;
  createdAt: string;
}

// Procurement Dashboard Metrics
export interface ProcurementMetrics {
  quotesPending: number;
  quotesAwaitingApproval: number;
  quotesReadyToOrder: number;
  emailsUnprocessed: number;
  ordersInTransit: number;
  ordersAwaitingReceiving: number;
  budgetsByGrant: {
    grantId: string;
    grantName: string;
    grantCode: string;
    totalBudget: number;
    usedBudget: number;
    remainingBudget: number;
    percentUsed: number;
  }[];
}
