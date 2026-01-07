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
} from '../types';

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
};

export default api;
