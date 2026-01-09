import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { query, execute } from '../services/database.js';
import { InventoryItem, InventoryAdjustment, CatalogItem } from '../types/index.js';
import { getUserFromToken } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

// GET /api/inventory
async function getInventory(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const inventory = await query<InventoryItem>(
      'SELECT * FROM Inventory'
    );
    return { jsonBody: inventory };
  } catch (error) {
    context.error('Get inventory error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/inventory/:sizeId
async function getInventoryBySizeId(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const sizeId = request.params.sizeId;
    const items = await query<InventoryItem>(
      'SELECT * FROM Inventory WHERE sizeId = @sizeId',
      { sizeId }
    );

    if (items.length === 0) {
      return { status: 404, jsonBody: { error: 'Inventory item not found' } };
    }

    return { jsonBody: items[0] };
  } catch (error) {
    context.error('Get inventory item error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// PUT /api/inventory/:sizeId
async function updateInventory(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const sizeId = request.params.sizeId;
    const body = await request.json() as Partial<InventoryItem>;

    const updates: string[] = [];
    const params: Record<string, unknown> = { sizeId };

    if (body.quantityOnHand !== undefined) {
      updates.push('quantityOnHand = @quantityOnHand');
      params.quantityOnHand = body.quantityOnHand;
    }
    if (body.quantityReserved !== undefined) {
      updates.push('quantityReserved = @quantityReserved');
      params.quantityReserved = body.quantityReserved;
    }

    updates.push('lastCountDate = @lastCountDate');
    params.lastCountDate = new Date().toISOString();
    updates.push('lastCountBy = @lastCountBy');
    params.lastCountBy = user.id;

    await execute(
      `UPDATE Inventory SET ${updates.join(', ')} WHERE sizeId = @sizeId`,
      params
    );

    const items = await query<InventoryItem>(
      'SELECT * FROM Inventory WHERE sizeId = @sizeId',
      { sizeId }
    );

    return { jsonBody: items[0] };
  } catch (error) {
    context.error('Update inventory error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/inventory/adjust
async function adjustInventory(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const body = await request.json() as {
      sizeId: string;
      adjustmentType: string;
      quantityChange: number;
      reason?: string;
    };

    const { sizeId, adjustmentType, quantityChange, reason } = body;

    // Get current inventory
    const current = await query<InventoryItem>(
      'SELECT * FROM Inventory WHERE sizeId = @sizeId',
      { sizeId }
    );

    const quantityBefore = current.length > 0 ? current[0].quantityOnHand : 0;
    const quantityAfter = quantityBefore + quantityChange;

    // Get item description for audit
    const itemInfo = await query<{ description: string }>(`
      SELECT CONCAT(it.name, ' - ', v.name, ' - ', s.name) AS description
      FROM Sizes s
      JOIN Variants v ON v.id = s.variantId
      JOIN ItemTypes it ON it.id = v.itemTypeId
      WHERE s.id = @sizeId
    `, { sizeId });

    const itemDescription = itemInfo.length > 0 ? itemInfo[0].description : 'Unknown Item';

    // Create adjustment record
    const adjustmentId = uuidv4();
    const now = new Date().toISOString();

    await execute(
      `INSERT INTO InventoryAdjustments
       (id, sizeId, itemDescription, adjustmentType, quantityBefore, quantityAfter, quantityChange, reason, adjustedBy, adjustedByName, adjustedAt)
       VALUES (@id, @sizeId, @itemDescription, @adjustmentType, @quantityBefore, @quantityAfter, @quantityChange, @reason, @adjustedBy, @adjustedByName, @adjustedAt)`,
      {
        id: adjustmentId,
        sizeId,
        itemDescription,
        adjustmentType,
        quantityBefore,
        quantityAfter,
        quantityChange,
        reason: reason || null,
        adjustedBy: user.id,
        adjustedByName: `${user.firstName} ${user.lastName}`,
        adjustedAt: now,
      }
    );

    // Update or insert inventory
    if (current.length > 0) {
      await execute(
        `UPDATE Inventory
         SET quantityOnHand = @quantityAfter, lastCountDate = @now, lastCountBy = @userId
         WHERE sizeId = @sizeId`,
        { sizeId, quantityAfter, now, userId: user.id }
      );
    } else {
      await execute(
        `INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved, lastCountDate, lastCountBy)
         VALUES (@sizeId, @quantityAfter, 0, @now, @userId)`,
        { sizeId, quantityAfter, now, userId: user.id }
      );
    }

    const adjustment: InventoryAdjustment = {
      id: adjustmentId,
      sizeId,
      itemDescription,
      adjustmentType: adjustmentType as InventoryAdjustment['adjustmentType'],
      quantityBefore,
      quantityAfter,
      quantityChange,
      reason,
      adjustedBy: user.id,
      adjustedByName: `${user.firstName} ${user.lastName}`,
      adjustedAt: now,
    };

    return { status: 201, jsonBody: adjustment };
  } catch (error) {
    context.error('Adjust inventory error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/inventory/low-stock
async function getLowStockItems(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const lowStock = await query<CatalogItem>(`
      SELECT
        c.id AS categoryId,
        c.name AS categoryName,
        it.id AS itemTypeId,
        it.name AS itemTypeName,
        it.femaCode,
        it.isConsumable,
        v.id AS variantId,
        v.name AS variantName,
        v.manufacturer,
        s.id AS sizeId,
        s.name AS sizeName,
        COALESCE(i.quantityOnHand, 0) AS quantityOnHand,
        COALESCE(i.quantityReserved, 0) AS quantityReserved,
        COALESCE(i.quantityOnHand, 0) - COALESCE(i.quantityReserved, 0) AS quantityAvailable
      FROM Categories c
      JOIN ItemTypes it ON it.categoryId = c.id
      JOIN Variants v ON v.itemTypeId = it.id
      JOIN Sizes s ON s.variantId = v.id
      LEFT JOIN Inventory i ON i.sizeId = s.id
      WHERE c.isActive = 1
        AND it.isActive = 1
        AND v.isActive = 1
        AND s.isActive = 1
        AND COALESCE(i.quantityOnHand, 0) <= it.parLevel
      ORDER BY (COALESCE(i.quantityOnHand, 0) - it.parLevel), it.name
    `);

    return { jsonBody: lowStock };
  } catch (error) {
    context.error('Get low stock error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Register routes
app.http('inventory-list', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'inventory',
  handler: getInventory,
});

app.http('inventory-get', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'inventory/{sizeId}',
  handler: getInventoryBySizeId,
});

app.http('inventory-update', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'inventory/{sizeId}',
  handler: updateInventory,
});

app.http('inventory-adjust', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'inventory/adjust',
  handler: adjustInventory,
});

app.http('inventory-low-stock', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'inventory/low-stock',
  handler: getLowStockItems,
});
