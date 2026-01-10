import {
  User,
  Category,
  ItemType,
  Variant,
  Size,
  InventoryItem,
  CatalogItem,
  Request,
  RequestStatus,
  PurchaseOrder,
  Vendor,
  IssuedItem,
  Notification,
  InventoryAdjustment,
  AdjustmentType,
  GrantSource,
  QuoteRequest,
  VendorQuote,
  VendorQuoteLine,
  ProcurementMetrics,
  InboundEmail,
} from '../types';
import {
  ppeCategories,
  ppeItemTypes,
  ppeVariants,
  ppeSizes,
  ppeInventory,
  ppeIssuedRecords,
  ppeActivityLogs,
  type PPECategory,
  type PPEItemType,
  type PPEVariant,
  type PPESize,
  type PPEInventoryItem,
  type PPEIssuedRecord,
  type PPEActivityLog,
  type PPEActivityType,
} from '../data/ppe-seed-data';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7071/api';

// Token management
let authToken: string | null = localStorage.getItem('authToken');

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

// HTTP helper functions
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ==============================================
// AUTH API
// ==============================================
export const authApi = {
  async getCurrentUser(): Promise<User> {
    return fetchApi<User>('/auth/me');
  },

  async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await fetchApi<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAuthToken(response.token);
      return response.user;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    await fetchApi('/auth/logout', { method: 'POST' }).catch(() => {});
    setAuthToken(null);
  },
};

// ==============================================
// USERS API
// ==============================================
export interface UserWithPPE extends User {
  assignedPPECount: number;
  lastPPEIssueDate?: string;
  totalIssuedValue?: number;
}

export interface EmployeeDetail extends UserWithPPE {
  issuedItems: IssuedItem[];
  recentRequests: Request[];
  requestHistory: {
    total: number;
    fulfilled: number;
    pending: number;
    cancelled: number;
  };
}

export const usersApi = {
  async getAll(): Promise<User[]> {
    return fetchApi<User[]>('/users');
  },

  async getById(id: string): Promise<User | undefined> {
    try {
      return await fetchApi<User>(`/users/${id}`);
    } catch {
      return undefined;
    }
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    return fetchApi<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }): Promise<User> {
    return fetchApi<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Get all users with their PPE assignment counts
  async getAllWithPPE(): Promise<UserWithPPE[]> {
    try {
      return await fetchApi<UserWithPPE[]>('/users/with-ppe');
    } catch {
      // Fallback: fetch users and issued items separately and combine
      const [users, allIssued] = await Promise.all([
        fetchApi<User[]>('/users'),
        fetchApi<IssuedItem[]>('/issuedItems'),
      ]);

      return users.map(user => {
        const userItems = allIssued.filter(item => item.userId === user.id && !item.returnedAt);
        const lastIssue = userItems.length > 0
          ? userItems.reduce((latest, item) =>
              new Date(item.issuedAt) > new Date(latest.issuedAt) ? item : latest
            ).issuedAt
          : undefined;

        return {
          ...user,
          assignedPPECount: userItems.reduce((sum, item) => sum + item.quantity, 0),
          lastPPEIssueDate: lastIssue,
        };
      });
    }
  },

  // Get detailed employee info including PPE and request history
  async getEmployeeDetail(id: string): Promise<EmployeeDetail | undefined> {
    try {
      return await fetchApi<EmployeeDetail>(`/users/${id}/detail`);
    } catch {
      // Fallback: fetch data separately and combine
      const [user, issuedItems, requests] = await Promise.all([
        usersApi.getById(id),
        fetchApi<IssuedItem[]>(`/issuedItems/user/${id}`),
        fetchApi<Request[]>(`/requests?userId=${id}`),
      ]);

      if (!user) return undefined;

      const activeItems = issuedItems.filter(item => !item.returnedAt);
      const lastIssue = activeItems.length > 0
        ? activeItems.reduce((latest, item) =>
            new Date(item.issuedAt) > new Date(latest.issuedAt) ? item : latest
          ).issuedAt
        : undefined;

      return {
        ...user,
        assignedPPECount: activeItems.reduce((sum, item) => sum + item.quantity, 0),
        lastPPEIssueDate: lastIssue,
        issuedItems: activeItems,
        recentRequests: requests.slice(0, 10),
        requestHistory: {
          total: requests.length,
          fulfilled: requests.filter(r => r.status === 'Fulfilled').length,
          pending: requests.filter(r => ['Pending', 'Approved', 'ReadyForPickup'].includes(r.status)).length,
          cancelled: requests.filter(r => r.status === 'Cancelled').length,
        },
      };
    }
  },

  // Search employees by name, email, or employee ID
  async search(query: string): Promise<User[]> {
    const params = new URLSearchParams({ q: query });
    try {
      return await fetchApi<User[]>(`/users/search?${params}`);
    } catch {
      // Fallback: filter locally
      const users = await fetchApi<User[]>('/users');
      const queryLower = query.toLowerCase();
      return users.filter(u =>
        u.firstName.toLowerCase().includes(queryLower) ||
        u.lastName.toLowerCase().includes(queryLower) ||
        u.email.toLowerCase().includes(queryLower) ||
        u.employeeId?.toLowerCase().includes(queryLower) ||
        u.department?.toLowerCase().includes(queryLower)
      );
    }
  },

  // Get employees by department
  async getByDepartment(department: string): Promise<User[]> {
    try {
      return await fetchApi<User[]>(`/users?department=${encodeURIComponent(department)}`);
    } catch {
      const users = await fetchApi<User[]>('/users');
      return users.filter(u => u.department === department);
    }
  },

  // Get unique departments list
  async getDepartments(): Promise<string[]> {
    try {
      return await fetchApi<string[]>('/users/departments');
    } catch {
      const users = await fetchApi<User[]>('/users');
      const depts = new Set(users.map(u => u.department).filter(Boolean) as string[]);
      return Array.from(depts).sort();
    }
  },
};

// ==============================================
// CATALOG API
// ==============================================
export const catalogApi = {
  async getCategories(): Promise<Category[]> {
    return fetchApi<Category[]>('/categories');
  },

  async getItemTypes(categoryId?: string): Promise<ItemType[]> {
    const params = categoryId ? `?categoryId=${categoryId}` : '';
    return fetchApi<ItemType[]>(`/itemTypes${params}`);
  },

  async getVariants(itemTypeId?: string): Promise<Variant[]> {
    const params = itemTypeId ? `?itemTypeId=${itemTypeId}` : '';
    return fetchApi<Variant[]>(`/variants${params}`);
  },

  async getSizes(variantId?: string): Promise<Size[]> {
    const params = variantId ? `?variantId=${variantId}` : '';
    return fetchApi<Size[]>(`/sizes${params}`);
  },

  async getCatalogItems(): Promise<CatalogItem[]> {
    return fetchApi<CatalogItem[]>('/catalog');
  },
};

// ==============================================
// INVENTORY API
// ==============================================
export const inventoryApi = {
  async getAll(): Promise<InventoryItem[]> {
    return fetchApi<InventoryItem[]>('/inventory');
  },

  async getBySizeId(sizeId: string): Promise<InventoryItem | undefined> {
    try {
      return await fetchApi<InventoryItem>(`/inventory/${sizeId}`);
    } catch {
      return undefined;
    }
  },

  async updateQuantity(sizeId: string, quantityOnHand: number): Promise<InventoryItem> {
    return fetchApi<InventoryItem>(`/inventory/${sizeId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantityOnHand }),
    });
  },

  async adjust(
    sizeId: string,
    adjustmentType: AdjustmentType,
    quantityChange: number,
    reason?: string
  ): Promise<InventoryAdjustment> {
    return fetchApi<InventoryAdjustment>('/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify({ sizeId, adjustmentType, quantityChange, reason }),
    });
  },

  async getLowStockItems(): Promise<CatalogItem[]> {
    return fetchApi<CatalogItem[]>('/inventory/low-stock');
  },
};

// ==============================================
// REQUESTS API
// ==============================================
export const requestsApi = {
  async getAll(): Promise<Request[]> {
    return fetchApi<Request[]>('/requests');
  },

  async getByUser(userId: string): Promise<Request[]> {
    return fetchApi<Request[]>(`/requests?userId=${userId}`);
  },

  async getById(id: string): Promise<Request | undefined> {
    try {
      return await fetchApi<Request>(`/requests/${id}`);
    } catch {
      return undefined;
    }
  },

  async getPending(): Promise<Request[]> {
    return fetchApi<Request[]>('/requests/pending');
  },

  async getReadyForPickup(): Promise<Request[]> {
    return fetchApi<Request[]>('/requests/ready-for-pickup');
  },

  async create(request: {
    notes?: string;
    lines: Array<{
      itemTypeId: string;
      itemTypeName: string;
      requestedSizeId?: string;
      requestedSizeName?: string;
      preferredVariantId?: string;
      preferredVariantName?: string;
      quantity: number;
      replacementReason?: string;
    }>;
    requestedBy?: string;
  }): Promise<Request> {
    return fetchApi<Request>('/requests', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async updateStatus(id: string, status: RequestStatus): Promise<Request> {
    return fetchApi<Request>(`/requests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async fulfill(id: string, signature?: string): Promise<Request> {
    return fetchApi<Request>(`/requests/${id}/fulfill`, {
      method: 'POST',
      body: JSON.stringify({ signature }),
    });
  },
};

// ==============================================
// PURCHASE ORDERS API
// ==============================================
export const purchaseOrdersApi = {
  async getAll(): Promise<PurchaseOrder[]> {
    return fetchApi<PurchaseOrder[]>('/purchaseOrders');
  },

  async getById(id: string): Promise<PurchaseOrder | undefined> {
    try {
      return await fetchApi<PurchaseOrder>(`/purchaseOrders/${id}`);
    } catch {
      return undefined;
    }
  },

  async create(po: {
    vendorId: string;
    vendorName: string;
    orderDate?: string;
    expectedDeliveryDate?: string;
    notes?: string;
    lines: Array<{
      sizeId: string;
      itemDescription: string;
      quantityOrdered: number;
      unitCost: number;
    }>;
  }): Promise<PurchaseOrder> {
    return fetchApi<PurchaseOrder>('/purchaseOrders', {
      method: 'POST',
      body: JSON.stringify(po),
    });
  },

  async updateStatus(id: string, status: PurchaseOrder['status']): Promise<PurchaseOrder> {
    return fetchApi<PurchaseOrder>(`/purchaseOrders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  async receive(id: string, lines: Array<{ lineId: string; quantityReceived: number }>): Promise<PurchaseOrder> {
    return fetchApi<PurchaseOrder>(`/purchaseOrders/${id}/receive`, {
      method: 'POST',
      body: JSON.stringify({ lines }),
    });
  },
};

// ==============================================
// VENDORS API
// ==============================================
export const vendorsApi = {
  async getAll(): Promise<Vendor[]> {
    return fetchApi<Vendor[]>('/vendors');
  },

  async getById(id: string): Promise<Vendor | undefined> {
    try {
      return await fetchApi<Vendor>(`/vendors/${id}`);
    } catch {
      return undefined;
    }
  },

  async create(vendor: Omit<Vendor, 'id'>): Promise<Vendor> {
    return fetchApi<Vendor>('/vendors', {
      method: 'POST',
      body: JSON.stringify(vendor),
    });
  },

  async update(id: string, updates: Partial<Vendor>): Promise<Vendor> {
    return fetchApi<Vendor>(`/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// ==============================================
// ISSUED ITEMS API
// ==============================================
export const issuedItemsApi = {
  async getByUser(userId: string): Promise<IssuedItem[]> {
    return fetchApi<IssuedItem[]>(`/issuedItems/user/${userId}`);
  },

  async getAll(): Promise<IssuedItem[]> {
    return fetchApi<IssuedItem[]>('/issuedItems');
  },

  async issue(item: {
    userId: string;
    sizeId: string;
    quantity: number;
    requestLineId?: string;
  }): Promise<IssuedItem> {
    return fetchApi<IssuedItem>('/issuedItems', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  },

  async return(
    id: string,
    returnReason: string,
    returnCondition: IssuedItem['returnCondition']
  ): Promise<IssuedItem> {
    return fetchApi<IssuedItem>(`/issuedItems/${id}/return`, {
      method: 'POST',
      body: JSON.stringify({ returnReason, returnCondition }),
    });
  },
};

// ==============================================
// NOTIFICATIONS API
// ==============================================
export const notificationsApi = {
  async getByUser(userId: string): Promise<Notification[]> {
    return fetchApi<Notification[]>(`/notifications?userId=${userId}`);
  },

  async getUnreadCount(userId: string): Promise<number> {
    const response = await fetchApi<{ count: number }>('/notifications/count');
    return response.count;
  },

  async markAsRead(id: string): Promise<Notification> {
    return fetchApi<Notification>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  async markAllAsRead(userId: string): Promise<void> {
    await fetchApi('/notifications/read-all', {
      method: 'PUT',
    });
  },
};

// ==============================================
// GRANT SOURCES API
// ==============================================
export const grantSourcesApi = {
  async getAll(activeOnly = false): Promise<GrantSource[]> {
    const params = activeOnly ? '?activeOnly=true' : '';
    return fetchApi<GrantSource[]>(`/grantSources${params}`);
  },

  async getById(id: string): Promise<GrantSource | undefined> {
    try {
      return await fetchApi<GrantSource>(`/grantSources/${id}`);
    } catch {
      return undefined;
    }
  },

  async create(grant: Omit<GrantSource, 'id' | 'usedBudget' | 'remainingBudget' | 'createdAt' | 'updatedAt'>): Promise<GrantSource> {
    return fetchApi<GrantSource>('/grantSources', {
      method: 'POST',
      body: JSON.stringify(grant),
    });
  },

  async update(id: string, updates: Partial<GrantSource>): Promise<GrantSource> {
    return fetchApi<GrantSource>(`/grantSources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async updateBudget(id: string, amount: number, operation: 'add' | 'subtract' | 'set'): Promise<GrantSource> {
    return fetchApi<GrantSource>(`/grantSources/${id}/budget`, {
      method: 'PUT',
      body: JSON.stringify({ amount, operation }),
    });
  },
};

// ==============================================
// QUOTE REQUESTS API
// ==============================================
export const quoteRequestsApi = {
  async getAll(filters?: { status?: string; grantSourceId?: string }): Promise<QuoteRequest[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.grantSourceId) params.append('grantSourceId', filters.grantSourceId);
    const query = params.toString();
    return fetchApi<QuoteRequest[]>(`/quoteRequests${query ? `?${query}` : ''}`);
  },

  async getById(id: string): Promise<QuoteRequest | undefined> {
    try {
      return await fetchApi<QuoteRequest>(`/quoteRequests/${id}`);
    } catch {
      return undefined;
    }
  },

  async create(request: {
    grantSourceId?: string;
    notes?: string;
    dueDate?: string;
    lines: Array<{
      itemTypeId?: string;
      variantId?: string;
      sizeId?: string;
      description: string;
      quantity: number;
      estimatedUnitPrice?: number;
    }>;
  }): Promise<QuoteRequest> {
    return fetchApi<QuoteRequest>('/quoteRequests', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async update(id: string, updates: Partial<QuoteRequest>): Promise<QuoteRequest> {
    return fetchApi<QuoteRequest>(`/quoteRequests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async send(id: string): Promise<QuoteRequest> {
    return fetchApi<QuoteRequest>(`/quoteRequests/${id}/send`, {
      method: 'POST',
    });
  },

  async approve(id: string, selectedVendorQuoteId: string): Promise<QuoteRequest> {
    return fetchApi<QuoteRequest>(`/quoteRequests/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ selectedVendorQuoteId }),
    });
  },

  async deny(id: string, reason?: string): Promise<QuoteRequest> {
    return fetchApi<QuoteRequest>(`/quoteRequests/${id}/deny`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  async convert(id: string): Promise<{ purchaseOrder: PurchaseOrder; quoteRequest: QuoteRequest }> {
    return fetchApi<{ purchaseOrder: PurchaseOrder; quoteRequest: QuoteRequest }>(`/quoteRequests/${id}/convert`, {
      method: 'POST',
    });
  },
};

// ==============================================
// VENDOR QUOTES API
// ==============================================
export const vendorQuotesApi = {
  async getById(id: string): Promise<VendorQuote | undefined> {
    try {
      return await fetchApi<VendorQuote>(`/vendorQuotes/${id}`);
    } catch {
      return undefined;
    }
  },

  async create(quote: {
    quoteRequestId: string;
    vendorId: string;
    quoteNumber?: string;
    receivedDate: string;
    validUntil?: string;
    shippingCost?: number;
    leadTimeDays?: number;
    attachmentUrl?: string;
    attachmentFileName?: string;
    notes?: string;
    lines: Array<Partial<VendorQuoteLine>>;
  }): Promise<VendorQuote> {
    return fetchApi<VendorQuote>('/vendorQuotes', {
      method: 'POST',
      body: JSON.stringify(quote),
    });
  },

  async update(id: string, updates: Partial<VendorQuote> & { lines?: Partial<VendorQuoteLine>[] }): Promise<VendorQuote> {
    return fetchApi<VendorQuote>(`/vendorQuotes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async delete(id: string): Promise<void> {
    await fetchApi(`/vendorQuotes/${id}`, {
      method: 'DELETE',
    });
  },

  async select(id: string): Promise<VendorQuote> {
    return fetchApi<VendorQuote>(`/vendorQuotes/${id}/select`, {
      method: 'POST',
    });
  },
};

// ==============================================
// INBOUND EMAILS API
// ==============================================
export const emailsApi = {
  async getAll(status?: string): Promise<InboundEmail[]> {
    const params = status ? `?status=${status}` : '';
    return fetchApi<InboundEmail[]>(`/emails${params}`);
  },

  async getById(id: string): Promise<InboundEmail | undefined> {
    try {
      return await fetchApi<InboundEmail>(`/emails/${id}`);
    } catch {
      return undefined;
    }
  },

  async process(id: string, data: {
    vendorId?: string;
    quoteRequestId?: string;
    createVendorQuote?: boolean;
    vendorQuoteData?: {
      quoteNumber?: string;
      totalAmount: number;
      shippingCost?: number;
      leadTimeDays?: number;
      lines: Array<{ description: string; quantity: number; unitPrice: number }>;
    };
  }): Promise<InboundEmail> {
    return fetchApi<InboundEmail>(`/emails/${id}/process`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async ignore(id: string): Promise<void> {
    await fetchApi(`/emails/${id}/ignore`, {
      method: 'POST',
    });
  },
};

// ==============================================
// PROCUREMENT DASHBOARD API
// ==============================================
export const procurementApi = {
  async getDashboard(): Promise<ProcurementMetrics> {
    return fetchApi<ProcurementMetrics>('/procurement/dashboard');
  },

  async getTimeline(limit = 20): Promise<Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    relatedId?: string;
    relatedType?: string;
  }>> {
    return fetchApi(`/procurement/timeline?limit=${limit}`);
  },
};

// ==============================================
// PPE INVENTORY API (Local data from Excel import)
// ==============================================
export interface PPEInventoryFilters {
  categoryId?: string;
  search?: string;
  status?: 'IN' | 'OUT' | 'N/A' | 'all';
  lowStockOnly?: boolean;
  equipmentOnly?: boolean; // Items >= $5,000 requiring property records per 2 CFR 200
}

export interface PPEInventorySummary {
  totalItems: number;
  totalQuantityOnHand: number;
  totalQuantityOut: number;
  inStockItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  issuedItems: number;
  equipmentCount: number; // Items >= $5,000 requiring property records
  categoryCounts: Record<string, number>;
}

// Grouped product interface for displaying one row per product (instead of per size)
export interface GroupedProduct {
  // Grouping key
  variantId: string;

  // Product info (same for all sizes)
  itemTypeName: string;
  manufacturer: string;
  categoryName: string;
  subcategory?: string;
  type?: string;
  femaCode: string;

  // Aggregated data
  sizes: PPEInventoryItem[];     // All size variants
  sizeCount: number;             // Number of sizes
  totalOnHand: number;           // Sum of quantityOnHand
  totalOut: number;              // Sum of quantityOut
  totalQuantity: number;         // totalOnHand + totalOut

  // Status (worst case across sizes)
  hasOutOfStock: boolean;        // Any size at 0
  hasLowStock: boolean;          // Any size below threshold
  lowStockCount: number;         // Count of low stock sizes
  outOfStockCount: number;       // Count of out of stock sizes
  overallStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

// Group inventory items by product (itemTypeName + manufacturer)
export function groupInventoryByProduct(items: PPEInventoryItem[]): GroupedProduct[] {
  const groups = new Map<string, PPEInventoryItem[]>();

  items.forEach(item => {
    const key = `${item.itemTypeName}||${item.manufacturer}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  });

  return Array.from(groups.entries()).map(([, sizes]) => {
    const first = sizes[0];
    const totalOnHand = sizes.reduce((sum, s) => sum + s.quantityOnHand, 0);
    const totalOut = sizes.reduce((sum, s) => sum + (s.quantityOut || 0), 0);

    // Count status by size
    let outOfStockCount = 0;
    let lowStockCount = 0;
    sizes.forEach(s => {
      const threshold = s.lowStockThreshold ?? 10;
      if (s.quantityOnHand === 0) {
        outOfStockCount++;
      } else if (s.quantityOnHand <= threshold) {
        lowStockCount++;
      }
    });

    const hasOutOfStock = outOfStockCount > 0;
    const hasLowStock = lowStockCount > 0;

    // Sort sizes by sort order or name
    const sortedSizes = [...sizes].sort((a, b) => {
      const sizeA = ppeSizes.find(s => s.id === a.sizeId);
      const sizeB = ppeSizes.find(s => s.id === b.sizeId);
      if (sizeA?.sortOrder && sizeB?.sortOrder) {
        return sizeA.sortOrder.localeCompare(sizeB.sortOrder);
      }
      return (a.sizeName || '').localeCompare(b.sizeName || '');
    });

    return {
      variantId: first.variantId,
      itemTypeName: first.itemTypeName,
      manufacturer: first.manufacturer,
      categoryName: first.categoryName,
      subcategory: first.subcategory,
      type: first.type,
      femaCode: first.femaCode,
      sizes: sortedSizes,
      sizeCount: sizes.length,
      totalOnHand,
      totalOut,
      totalQuantity: totalOnHand + totalOut,
      hasOutOfStock,
      hasLowStock,
      lowStockCount,
      outOfStockCount,
      overallStatus: hasOutOfStock ? 'Out of Stock' : hasLowStock ? 'Low Stock' : 'In Stock',
    };
  });
}

// Estimate unit cost based on category and item characteristics
// Per federal regulations (2 CFR 200), equipment >= $5,000 requires property records
const EQUIPMENT_THRESHOLD = 5000;

function estimateUnitCost(item: PPEInventoryItem): number {
  const desc = (item.description || item.itemTypeName || '').toLowerCase();
  const category = (item.categoryName || '').toLowerCase();

  // High-value equipment typically >= $5,000
  if (category.includes('hazmat') || category.includes('detection')) {
    if (desc.includes('sonar') || desc.includes('detector') || desc.includes('life detector')) return 25000;
    if (desc.includes('scba') || desc.includes('breathing')) return 7500;
    if (desc.includes('monitor') || desc.includes('meter')) return 3500;
    if (desc.includes('suit') && desc.includes('level')) return 1200;
    return 2500;
  }

  if (category.includes('life safety')) {
    if (desc.includes('thermal') || desc.includes('camera')) return 8500;
    if (desc.includes('generator') || desc.includes('lifting')) return 12000;
    if (desc.includes('saw') || desc.includes('hydraulic')) return 6500;
    if (desc.includes('shore') || desc.includes('strut')) return 5500;
    if (desc.includes('airbag')) return 4500;
    return 800;
  }

  if (category.includes('medical')) {
    if (desc.includes('defibrillator') || desc.includes('aed')) return 2500;
    if (desc.includes('monitor') || desc.includes('ventilator')) return 15000;
    if (desc.includes('kit') || desc.includes('bag')) return 450;
    return 200;
  }

  if (category.includes('water rescue')) {
    if (desc.includes('boat') || desc.includes('raft')) return 8500;
    if (desc.includes('motor') || desc.includes('engine')) return 5500;
    if (desc.includes('suit') && (desc.includes('dry') || desc.includes('immersion'))) return 1200;
    if (desc.includes('pfd') || desc.includes('life vest')) return 350;
    return 250;
  }

  if (category.includes('logistics')) {
    if (desc.includes('tent') || desc.includes('shelter')) return 4500;
    if (desc.includes('generator')) return 6500;
    if (desc.includes('radio') || desc.includes('communication')) return 5500;
    return 150;
  }

  // Default low-value PPE items
  if (desc.includes('helmet')) return 350;
  if (desc.includes('boot')) return 250;
  if (desc.includes('glove')) return 45;
  if (desc.includes('uniform') || desc.includes('bdu') || desc.includes('shirt') || desc.includes('pant')) return 75;

  return 100; // Default
}

function isEquipment(item: PPEInventoryItem): boolean {
  return estimateUnitCost(item) >= EQUIPMENT_THRESHOLD;
}

// Export for use in components
export { estimateUnitCost, isEquipment, EQUIPMENT_THRESHOLD };

export const ppeApi = {
  // Get all PPE categories
  async getCategories(): Promise<PPECategory[]> {
    return Promise.resolve([...ppeCategories]);
  },

  // Get PPE item types (optionally filtered by category)
  async getItemTypes(categoryId?: string): Promise<PPEItemType[]> {
    let items = [...ppeItemTypes];
    if (categoryId) {
      items = items.filter(item => item.categoryId === categoryId);
    }
    return Promise.resolve(items);
  },

  // Get PPE variants (optionally filtered by item type)
  async getVariants(itemTypeId?: string): Promise<PPEVariant[]> {
    let items = [...ppeVariants];
    if (itemTypeId) {
      items = items.filter(item => item.itemTypeId === itemTypeId);
    }
    return Promise.resolve(items);
  },

  // Get PPE sizes (optionally filtered by variant)
  async getSizes(variantId?: string): Promise<PPESize[]> {
    let items = [...ppeSizes];
    if (variantId) {
      items = items.filter(item => item.variantId === variantId);
    }
    return Promise.resolve(items);
  },

  // Get all PPE inventory items with optional filtering
  async getInventory(filters?: PPEInventoryFilters): Promise<PPEInventoryItem[]> {
    let items = [...ppeInventory];

    if (filters) {
      // Filter by category
      if (filters.categoryId) {
        const catName = ppeCategories.find(c => c.id === filters.categoryId)?.name;
        if (catName) {
          items = items.filter(item => item.categoryName === catName);
        }
      }

      // Filter by search term
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        items = items.filter(item =>
          item.description?.toLowerCase().includes(searchLower) ||
          item.itemTypeName?.toLowerCase().includes(searchLower) ||
          item.manufacturer?.toLowerCase().includes(searchLower) ||
          item.femaCode?.toLowerCase().includes(searchLower) ||
          item.sizeName?.toLowerCase().includes(searchLower)
        );
      }

      // Filter by status
      if (filters.status && filters.status !== 'all') {
        items = items.filter(item => item.status === filters.status);
      }

      // Filter by low stock
      if (filters.lowStockOnly) {
        items = items.filter(item => item.quantityOnHand <= 10 && item.quantityOnHand > 0);
      }

      // Filter by equipment threshold ($5,000+)
      if (filters.equipmentOnly) {
        items = items.filter(item => isEquipment(item));
      }
    }

    return Promise.resolve(items);
  },

  // Get inventory item by size ID
  async getInventoryBySizeId(sizeId: string): Promise<PPEInventoryItem | undefined> {
    const item = ppeInventory.find(i => i.sizeId === sizeId);
    return Promise.resolve(item);
  },

  // Get inventory summary/stats
  async getSummary(): Promise<PPEInventorySummary> {
    const categoryCounts: Record<string, number> = {};
    let totalQuantityOnHand = 0;
    let totalQuantityOut = 0;
    let inStockItems = 0;
    let lowStockItems = 0;
    let outOfStockItems = 0;
    let issuedItems = 0;
    let equipmentCount = 0;

    ppeInventory.forEach(item => {
      // Count by category
      const cat = item.categoryName || 'Unknown';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

      // Sum quantities
      totalQuantityOnHand += item.quantityOnHand || 0;
      totalQuantityOut += item.quantityOut || 0;

      // Count in-stock items (quantity > 0)
      if (item.quantityOnHand > 0) {
        inStockItems++;
      }

      // Count low stock items
      if (item.quantityOnHand <= 10 && item.quantityOnHand > 0) {
        lowStockItems++;
      }

      // Count out of stock items
      if (item.quantityOnHand === 0) {
        outOfStockItems++;
      }

      // Count issued items
      if ((item.quantityOut || 0) > 0) {
        issuedItems++;
      }

      // Count equipment items ($5,000+)
      if (isEquipment(item)) {
        equipmentCount++;
      }
    });

    return Promise.resolve({
      totalItems: ppeInventory.length,
      totalQuantityOnHand,
      totalQuantityOut,
      inStockItems,
      lowStockItems,
      outOfStockItems,
      issuedItems,
      equipmentCount,
      categoryCounts,
    });
  },

  // Get items grouped by category for display
  async getInventoryByCategory(): Promise<Map<string, PPEInventoryItem[]>> {
    const grouped = new Map<string, PPEInventoryItem[]>();

    ppeInventory.forEach(item => {
      const catName = item.categoryName || 'Unknown';
      if (!grouped.has(catName)) {
        grouped.set(catName, []);
      }
      grouped.get(catName)!.push(item);
    });

    return Promise.resolve(grouped);
  },

  // Get items grouped by item type (e.g., all BDU Pants together)
  async getInventoryByItemType(): Promise<Map<string, PPEInventoryItem[]>> {
    const grouped = new Map<string, PPEInventoryItem[]>();

    ppeInventory.forEach(item => {
      const typeName = item.itemTypeName || 'Unknown';
      if (!grouped.has(typeName)) {
        grouped.set(typeName, []);
      }
      grouped.get(typeName)!.push(item);
    });

    return Promise.resolve(grouped);
  },

  // Get grouped inventory (one row per product instead of per size)
  async getGroupedInventory(filters?: PPEInventoryFilters): Promise<GroupedProduct[]> {
    // First get filtered items
    const items = await this.getInventory(filters);
    // Then group them
    return Promise.resolve(groupInventoryByProduct(items));
  },

  // Get low stock items
  async getLowStockItems(): Promise<PPEInventoryItem[]> {
    const items = ppeInventory.filter(item =>
      item.quantityOnHand <= 10 && item.quantityOnHand > 0
    );
    return Promise.resolve(items);
  },

  // Get in-stock items (quantity > 0)
  async getInStockItems(): Promise<PPEInventoryItem[]> {
    const items = ppeInventory.filter(item => item.quantityOnHand > 0);
    return Promise.resolve(items);
  },

  // Get out of stock items (zero quantity on hand)
  async getOutOfStockItems(): Promise<PPEInventoryItem[]> {
    const items = ppeInventory.filter(item => item.quantityOnHand === 0);
    return Promise.resolve(items);
  },

  // Get issued/out items
  async getIssuedItems(): Promise<PPEInventoryItem[]> {
    const items = ppeInventory.filter(item => (item.quantityOut || 0) > 0);
    return Promise.resolve(items);
  },

  // Get all sizes for a product by item type name (for size grid display)
  async getSizesForProduct(itemTypeName: string, manufacturer?: string): Promise<PPEInventoryItem[]> {
    let items = ppeInventory.filter(item => item.itemTypeName === itemTypeName);
    // If manufacturer provided, also filter by that
    if (manufacturer) {
      items = items.filter(item => item.manufacturer === manufacturer);
    }
    // Sort by size (use sortOrder if available from ppeSizes, otherwise alphabetical)
    items.sort((a, b) => {
      // Try to find sort order from ppeSizes
      const sizeA = ppeSizes.find(s => s.id === a.sizeId);
      const sizeB = ppeSizes.find(s => s.id === b.sizeId);
      if (sizeA?.sortOrder && sizeB?.sortOrder) {
        return sizeA.sortOrder.localeCompare(sizeB.sortOrder);
      }
      return (a.sizeName || '').localeCompare(b.sizeName || '');
    });
    return Promise.resolve(items);
  },

  // Get equipment items ($5,000+ requiring property records per 2 CFR 200)
  async getEquipmentItems(): Promise<PPEInventoryItem[]> {
    const items = ppeInventory.filter(item => isEquipment(item));
    return Promise.resolve(items);
  },

  // Create a new PPE inventory item
  async createItem(item: Omit<PPEInventoryItem, 'sizeId'>): Promise<PPEInventoryItem> {
    // Generate a new unique sizeId
    const maxId = ppeInventory.reduce((max, i) => {
      const num = parseInt(i.sizeId.replace('sz-', ''), 10);
      return num > max ? num : max;
    }, 0);

    const newItem: PPEInventoryItem = {
      ...item,
      sizeId: `sz-${maxId + 1}`,
    };

    // Add to the inventory array (in real app, this would be a POST to the API)
    ppeInventory.push(newItem);

    return Promise.resolve(newItem);
  },

  // Update an existing PPE inventory item with audit tracking
  async updateItem(
    sizeId: string,
    updates: Partial<PPEInventoryItem>,
    updatedBy?: string,
    updateReason?: string
  ): Promise<PPEInventoryItem | undefined> {
    const index = ppeInventory.findIndex(i => i.sizeId === sizeId);
    if (index === -1) return Promise.resolve(undefined);

    // Add audit tracking fields
    const auditedUpdates = {
      ...updates,
      lastUpdatedAt: new Date().toISOString(),
      lastUpdatedBy: updatedBy || updates.lastUpdatedBy,
      lastUpdateReason: updateReason || updates.lastUpdateReason,
    };

    ppeInventory[index] = { ...ppeInventory[index], ...auditedUpdates };
    return Promise.resolve(ppeInventory[index]);
  },

  // Delete a PPE inventory item
  async deleteItem(sizeId: string): Promise<boolean> {
    const index = ppeInventory.findIndex(i => i.sizeId === sizeId);
    if (index === -1) return Promise.resolve(false);

    ppeInventory.splice(index, 1);
    return Promise.resolve(true);
  },

  // =============================================
  // PPE ISSUED RECORDS METHODS
  // =============================================

  // Get all issued records for a specific item (by sizeId)
  async getIssuedRecords(sizeId: string): Promise<PPEIssuedRecord[]> {
    return Promise.resolve(
      ppeIssuedRecords.filter(r => r.sizeId === sizeId && !r.returnedAt)
    );
  },

  // Get all issued records including returned ones
  async getAllIssuedRecords(sizeId: string): Promise<PPEIssuedRecord[]> {
    return Promise.resolve(
      ppeIssuedRecords.filter(r => r.sizeId === sizeId)
    );
  },

  // Issue an item to a user
  async issueToUser(
    sizeId: string,
    userId: string,
    userName: string,
    quantity: number,
    issuedBy: string,
    note?: string,
    userEmployeeId?: string,
    userDepartment?: string
  ): Promise<PPEIssuedRecord> {
    const maxId = ppeIssuedRecords.reduce((max, r) => {
      const num = parseInt(r.id.replace('iss-', ''), 10);
      return num > max ? num : max;
    }, 0);

    const newRecord: PPEIssuedRecord = {
      id: `iss-${String(maxId + 1).padStart(3, '0')}`,
      sizeId,
      userId,
      userName,
      userEmployeeId,
      userDepartment,
      quantity,
      issuedAt: new Date().toISOString(),
      issuedBy,
      note,
    };

    ppeIssuedRecords.push(newRecord);
    return Promise.resolve(newRecord);
  },

  // Return an issued item
  async returnIssuedItem(
    recordId: string,
    returnedQuantity: number,
    returnReason?: string
  ): Promise<PPEIssuedRecord | undefined> {
    const record = ppeIssuedRecords.find(r => r.id === recordId);
    if (!record) return Promise.resolve(undefined);

    record.returnedAt = new Date().toISOString();
    record.returnedQuantity = returnedQuantity;
    record.returnReason = returnReason;

    return Promise.resolve(record);
  },

  // Get issued records for a specific user
  async getIssuedRecordsByUser(userId: string): Promise<PPEIssuedRecord[]> {
    return Promise.resolve(
      ppeIssuedRecords.filter(r => r.userId === userId && !r.returnedAt)
    );
  },

  // Get ALL issued records globally (for admin view)
  async getAllIssuedRecordsGlobal(includeReturned: boolean = false): Promise<PPEIssuedRecord[]> {
    if (includeReturned) {
      return Promise.resolve([...ppeIssuedRecords]);
    }
    return Promise.resolve(
      ppeIssuedRecords.filter(r => !r.returnedAt)
    );
  },

  // =============================================
  // PPE ACTIVITY LOG METHODS
  // =============================================

  // Get activity log for a specific item (by sizeId)
  async getActivityLog(sizeId: string): Promise<PPEActivityLog[]> {
    const logs = ppeActivityLogs.filter(log => log.sizeId === sizeId);
    // Sort by timestamp descending (most recent first)
    return Promise.resolve(
      logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    );
  },

  // Get all activity logs (for global audit view)
  async getAllActivityLogs(): Promise<PPEActivityLog[]> {
    return Promise.resolve(
      [...ppeActivityLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    );
  },

  // Add a new activity log entry
  async addActivityLog(log: Omit<PPEActivityLog, 'id'>): Promise<PPEActivityLog> {
    const maxId = ppeActivityLogs.reduce((max, l) => {
      const num = parseInt(l.id.replace('act-', ''), 10);
      return num > max ? num : max;
    }, 0);

    const newLog: PPEActivityLog = {
      ...log,
      id: `act-${String(maxId + 1).padStart(3, '0')}`,
    };

    ppeActivityLogs.push(newLog);
    return Promise.resolve(newLog);
  },
};

// Export PPE types for use in components
export type { PPECategory, PPEItemType, PPEVariant, PPESize, PPEInventoryItem, PPEIssuedRecord, PPEActivityLog, PPEActivityType };

// Export all APIs
export const api = {
  auth: authApi,
  users: usersApi,
  catalog: catalogApi,
  inventory: inventoryApi,
  requests: requestsApi,
  purchaseOrders: purchaseOrdersApi,
  vendors: vendorsApi,
  issuedItems: issuedItemsApi,
  notifications: notificationsApi,
  grantSources: grantSourcesApi,
  quoteRequests: quoteRequestsApi,
  vendorQuotes: vendorQuotesApi,
  procurement: procurementApi,
  emails: emailsApi,
  ppe: ppeApi,
};

export default api;
