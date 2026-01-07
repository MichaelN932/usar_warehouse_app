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

import {
  users,
  categories,
  itemTypes,
  variants,
  sizes,
  inventory,
  requests,
  purchaseOrders,
  vendors,
  issuedItems,
  notifications,
  currentUser,
} from '../data/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const API_DELAY = 300;

// ==============================================
// AUTH API
// ==============================================
export const authApi = {
  async getCurrentUser(): Promise<User> {
    await delay(API_DELAY);
    return currentUser;
  },

  async login(email: string, _password: string): Promise<User | null> {
    await delay(API_DELAY);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
  },

  async logout(): Promise<void> {
    await delay(API_DELAY);
  },
};

// ==============================================
// USERS API
// ==============================================
export const usersApi = {
  async getAll(): Promise<User[]> {
    await delay(API_DELAY);
    return users;
  },

  async getById(id: string): Promise<User | undefined> {
    await delay(API_DELAY);
    return users.find(u => u.id === id);
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    await delay(API_DELAY);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
    return users[index];
  },

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    await delay(API_DELAY);
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(newUser);
    return newUser;
  },
};

// ==============================================
// CATALOG API
// ==============================================
export const catalogApi = {
  async getCategories(): Promise<Category[]> {
    await delay(API_DELAY);
    return categories.filter(c => c.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async getItemTypes(categoryId?: string): Promise<ItemType[]> {
    await delay(API_DELAY);
    let items = itemTypes.filter(it => it.isActive);
    if (categoryId) {
      items = items.filter(it => it.categoryId === categoryId);
    }
    return items;
  },

  async getVariants(itemTypeId?: string): Promise<Variant[]> {
    await delay(API_DELAY);
    let items = variants.filter(v => v.isActive);
    if (itemTypeId) {
      items = items.filter(v => v.itemTypeId === itemTypeId);
    }
    return items;
  },

  async getSizes(variantId?: string): Promise<Size[]> {
    await delay(API_DELAY);
    let items = sizes.filter(s => s.isActive);
    if (variantId) {
      items = items.filter(s => s.variantId === variantId);
    }
    return items.sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async getCatalogItems(): Promise<CatalogItem[]> {
    await delay(API_DELAY);
    const catalogItems: CatalogItem[] = [];

    for (const size of sizes.filter(s => s.isActive)) {
      const variant = variants.find(v => v.id === size.variantId);
      if (!variant || !variant.isActive) continue;

      const itemType = itemTypes.find(it => it.id === variant.itemTypeId);
      if (!itemType || !itemType.isActive) continue;

      const category = categories.find(c => c.id === itemType.categoryId);
      if (!category || !category.isActive) continue;

      const inv = inventory.find(i => i.sizeId === size.id) || {
        quantityOnHand: 0,
        quantityReserved: 0,
        quantityAvailable: 0,
      };

      catalogItems.push({
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
        quantityOnHand: inv.quantityOnHand,
        quantityReserved: inv.quantityReserved,
        quantityAvailable: inv.quantityAvailable,
      });
    }

    return catalogItems;
  },
};

// ==============================================
// INVENTORY API
// ==============================================
export const inventoryApi = {
  async getAll(): Promise<InventoryItem[]> {
    await delay(API_DELAY);
    return inventory;
  },

  async getBySizeId(sizeId: string): Promise<InventoryItem | undefined> {
    await delay(API_DELAY);
    return inventory.find(i => i.sizeId === sizeId);
  },

  async updateQuantity(sizeId: string, quantityOnHand: number): Promise<InventoryItem> {
    await delay(API_DELAY);
    const index = inventory.findIndex(i => i.sizeId === sizeId);
    if (index === -1) {
      const newItem: InventoryItem = {
        sizeId,
        quantityOnHand,
        quantityReserved: 0,
        quantityAvailable: quantityOnHand,
        lastCountDate: new Date().toISOString(),
        lastCountBy: currentUser.id,
      };
      inventory.push(newItem);
      return newItem;
    }

    inventory[index] = {
      ...inventory[index],
      quantityOnHand,
      quantityAvailable: quantityOnHand - inventory[index].quantityReserved,
      lastCountDate: new Date().toISOString(),
      lastCountBy: currentUser.id,
    };
    return inventory[index];
  },

  async adjust(
    sizeId: string,
    adjustmentType: AdjustmentType,
    quantityChange: number,
    reason?: string
  ): Promise<InventoryAdjustment> {
    await delay(API_DELAY);
    const invItem = inventory.find(i => i.sizeId === sizeId);
    const quantityBefore = invItem?.quantityOnHand || 0;
    const quantityAfter = quantityBefore + quantityChange;

    if (invItem) {
      invItem.quantityOnHand = quantityAfter;
      invItem.quantityAvailable = quantityAfter - invItem.quantityReserved;
      invItem.lastCountDate = new Date().toISOString();
      invItem.lastCountBy = currentUser.id;
    }

    const size = sizes.find(s => s.id === sizeId);
    const variant = variants.find(v => v.id === size?.variantId);

    return {
      id: `adj-${Date.now()}`,
      sizeId,
      itemDescription: `${variant?.name || 'Unknown'} - ${size?.name || 'Unknown'}`,
      adjustmentType,
      quantityBefore,
      quantityAfter,
      quantityChange,
      reason,
      adjustedBy: currentUser.id,
      adjustedByName: `${currentUser.firstName} ${currentUser.lastName}`,
      adjustedAt: new Date().toISOString(),
    };
  },

  async getLowStockItems(): Promise<CatalogItem[]> {
    await delay(API_DELAY);
    const catalogItems = await catalogApi.getCatalogItems();

    return catalogItems.filter(item => {
      const itemType = itemTypes.find(it => it.id === item.itemTypeId);
      return itemType && item.quantityAvailable < itemType.parLevel;
    });
  },
};

// ==============================================
// REQUESTS API
// ==============================================
export const requestsApi = {
  async getAll(): Promise<Request[]> {
    await delay(API_DELAY);
    return requests.sort((a, b) =>
      new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
    );
  },

  async getByUser(userId: string): Promise<Request[]> {
    await delay(API_DELAY);
    return requests
      .filter(r => r.requestedBy === userId)
      .sort((a, b) =>
        new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
      );
  },

  async getById(id: string): Promise<Request | undefined> {
    await delay(API_DELAY);
    return requests.find(r => r.id === id);
  },

  async getPending(): Promise<Request[]> {
    await delay(API_DELAY);
    return requests
      .filter(r => r.status === 'Pending' || r.status === 'Approved')
      .sort((a, b) =>
        new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime()
      );
  },

  async getReadyForPickup(): Promise<Request[]> {
    await delay(API_DELAY);
    return requests.filter(r => r.status === 'ReadyForPickup');
  },

  async create(request: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>): Promise<Request> {
    await delay(API_DELAY);
    const newRequest: Request = {
      ...request,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    requests.push(newRequest);
    return newRequest;
  },

  async updateStatus(id: string, status: RequestStatus): Promise<Request> {
    await delay(API_DELAY);
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');

    requests[index] = {
      ...requests[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    if (status === 'ReadyForPickup') {
      requests[index].fulfilledBy = currentUser.id;
    } else if (status === 'Fulfilled') {
      requests[index].fulfilledAt = new Date().toISOString();
    }

    return requests[index];
  },

  async fulfill(id: string, signature?: string): Promise<Request> {
    await delay(API_DELAY);
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');

    requests[index] = {
      ...requests[index],
      status: 'Fulfilled',
      fulfilledBy: currentUser.id,
      fulfilledAt: new Date().toISOString(),
      pickupSignature: signature,
      pickupSignedAt: signature ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    };

    return requests[index];
  },
};

// ==============================================
// PURCHASE ORDERS API
// ==============================================
export const purchaseOrdersApi = {
  async getAll(): Promise<PurchaseOrder[]> {
    await delay(API_DELAY);
    return purchaseOrders.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getById(id: string): Promise<PurchaseOrder | undefined> {
    await delay(API_DELAY);
    return purchaseOrders.find(po => po.id === id);
  },

  async create(po: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<PurchaseOrder> {
    await delay(API_DELAY);
    const newPO: PurchaseOrder = {
      ...po,
      id: `po-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    purchaseOrders.push(newPO);
    return newPO;
  },

  async updateStatus(id: string, status: PurchaseOrder['status']): Promise<PurchaseOrder> {
    await delay(API_DELAY);
    const index = purchaseOrders.findIndex(po => po.id === id);
    if (index === -1) throw new Error('Purchase order not found');

    purchaseOrders[index] = {
      ...purchaseOrders[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    return purchaseOrders[index];
  },
};

// ==============================================
// VENDORS API
// ==============================================
export const vendorsApi = {
  async getAll(): Promise<Vendor[]> {
    await delay(API_DELAY);
    return vendors.filter(v => v.isActive);
  },

  async getById(id: string): Promise<Vendor | undefined> {
    await delay(API_DELAY);
    return vendors.find(v => v.id === id);
  },

  async create(vendor: Omit<Vendor, 'id'>): Promise<Vendor> {
    await delay(API_DELAY);
    const newVendor: Vendor = {
      ...vendor,
      id: `ven-${Date.now()}`,
    };
    vendors.push(newVendor);
    return newVendor;
  },

  async update(id: string, updates: Partial<Vendor>): Promise<Vendor> {
    await delay(API_DELAY);
    const index = vendors.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Vendor not found');
    vendors[index] = { ...vendors[index], ...updates };
    return vendors[index];
  },
};

// ==============================================
// ISSUED ITEMS API
// ==============================================
export const issuedItemsApi = {
  async getByUser(userId: string): Promise<IssuedItem[]> {
    await delay(API_DELAY);
    return issuedItems.filter(ii => ii.userId === userId && !ii.returnedAt);
  },

  async getAll(): Promise<IssuedItem[]> {
    await delay(API_DELAY);
    return issuedItems.filter(ii => !ii.returnedAt);
  },

  async issue(item: Omit<IssuedItem, 'id'>): Promise<IssuedItem> {
    await delay(API_DELAY);
    const newItem: IssuedItem = {
      ...item,
      id: `ii-${Date.now()}`,
    };
    issuedItems.push(newItem);
    return newItem;
  },

  async return(
    id: string,
    returnReason: string,
    returnCondition: IssuedItem['returnCondition']
  ): Promise<IssuedItem> {
    await delay(API_DELAY);
    const index = issuedItems.findIndex(ii => ii.id === id);
    if (index === -1) throw new Error('Issued item not found');

    issuedItems[index] = {
      ...issuedItems[index],
      returnedAt: new Date().toISOString(),
      returnReason,
      returnCondition,
    };

    return issuedItems[index];
  },
};

// ==============================================
// NOTIFICATIONS API
// ==============================================
export const notificationsApi = {
  async getByUser(userId: string): Promise<Notification[]> {
    await delay(API_DELAY);
    return notifications
      .filter(n => n.userId === userId)
      .sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  async getUnreadCount(userId: string): Promise<number> {
    await delay(API_DELAY);
    return notifications.filter(n => n.userId === userId && !n.isRead).length;
  },

  async markAsRead(id: string): Promise<Notification> {
    await delay(API_DELAY);
    const index = notifications.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Notification not found');

    notifications[index] = {
      ...notifications[index],
      isRead: true,
      readAt: new Date().toISOString(),
    };

    return notifications[index];
  },

  async markAllAsRead(userId: string): Promise<void> {
    await delay(API_DELAY);
    const now = new Date().toISOString();
    notifications.forEach(n => {
      if (n.userId === userId && !n.isRead) {
        n.isRead = true;
        n.readAt = now;
      }
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
