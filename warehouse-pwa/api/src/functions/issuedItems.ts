import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { query, execute } from '../services/database.js';
import { IssuedItem } from '../types/index.js';
import { getUserFromToken } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

// GET /api/issuedItems
async function getIssuedItems(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const userId = request.query.get('userId');

    let sql = 'SELECT * FROM IssuedItems WHERE returnedAt IS NULL';
    const params: Record<string, unknown> = {};

    // Non-warehouse users can only see their own items
    if (!['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      sql += ' AND userId = @userId';
      params.userId = user.id;
    } else if (userId) {
      sql += ' AND userId = @userId';
      params.userId = userId;
    }

    sql += ' ORDER BY issuedAt DESC';

    const items = await query<IssuedItem>(sql, params);
    return { jsonBody: items };
  } catch (error) {
    context.error('Get issued items error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/issuedItems/user/:userId
async function getIssuedItemsByUser(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const userId = request.params.userId;

    // Non-warehouse users can only see their own items
    if (
      !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role) &&
      userId !== user.id
    ) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const items = await query<IssuedItem>(
      'SELECT * FROM IssuedItems WHERE userId = @userId AND returnedAt IS NULL ORDER BY issuedAt DESC',
      { userId }
    );

    return { jsonBody: items };
  } catch (error) {
    context.error('Get issued items by user error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/issuedItems
async function issueItem(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const body = await request.json() as {
      userId: string;
      sizeId: string;
      quantity: number;
      requestLineId?: string;
    };

    const { userId, sizeId, quantity, requestLineId } = body;

    // Get item details for description
    const itemInfo = await query<{
      categoryName: string;
      itemTypeName: string;
      variantName: string;
      sizeName: string;
    }>(`
      SELECT
        c.name AS categoryName,
        it.name AS itemTypeName,
        v.name AS variantName,
        s.name AS sizeName
      FROM Sizes s
      JOIN Variants v ON v.id = s.variantId
      JOIN ItemTypes it ON it.id = v.itemTypeId
      JOIN Categories c ON c.id = it.categoryId
      WHERE s.id = @sizeId
    `, { sizeId });

    if (itemInfo.length === 0) {
      return { status: 404, jsonBody: { error: 'Size not found' } };
    }

    const info = itemInfo[0];
    const itemDescription = `${info.itemTypeName} - ${info.variantName} - ${info.sizeName}`;

    const id = uuidv4();
    const now = new Date().toISOString();

    await execute(
      `INSERT INTO IssuedItems
       (id, userId, sizeId, itemDescription, categoryName, itemTypeName, variantName, sizeName, quantity, issuedAt, requestLineId)
       VALUES (@id, @userId, @sizeId, @itemDescription, @categoryName, @itemTypeName, @variantName, @sizeName, @quantity, @issuedAt, @requestLineId)`,
      {
        id,
        userId,
        sizeId,
        itemDescription,
        categoryName: info.categoryName,
        itemTypeName: info.itemTypeName,
        variantName: info.variantName,
        sizeName: info.sizeName,
        quantity,
        issuedAt: now,
        requestLineId: requestLineId || null,
      }
    );

    // Update inventory (decrease available quantity)
    await execute(
      'UPDATE Inventory SET quantityOnHand = quantityOnHand - @quantity WHERE sizeId = @sizeId',
      { sizeId, quantity }
    );

    const items = await query<IssuedItem>(
      'SELECT * FROM IssuedItems WHERE id = @id',
      { id }
    );

    return { status: 201, jsonBody: items[0] };
  } catch (error) {
    context.error('Issue item error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/issuedItems/:id/return
async function returnItem(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const id = request.params.id;
    const body = await request.json() as {
      returnReason: string;
      returnCondition: 'Serviceable' | 'NeedsRepair' | 'Dispose';
    };

    const now = new Date().toISOString();

    // Get the item before updating
    const items = await query<IssuedItem>(
      'SELECT * FROM IssuedItems WHERE id = @id',
      { id }
    );

    if (items.length === 0) {
      return { status: 404, jsonBody: { error: 'Issued item not found' } };
    }

    const item = items[0];

    await execute(
      `UPDATE IssuedItems
       SET returnedAt = @returnedAt, returnReason = @returnReason, returnCondition = @returnCondition
       WHERE id = @id`,
      {
        id,
        returnedAt: now,
        returnReason: body.returnReason,
        returnCondition: body.returnCondition,
      }
    );

    // If serviceable, add back to inventory
    if (body.returnCondition === 'Serviceable') {
      await execute(
        'UPDATE Inventory SET quantityOnHand = quantityOnHand + @quantity WHERE sizeId = @sizeId',
        { sizeId: item.sizeId, quantity: item.quantity }
      );
    }

    const updatedItems = await query<IssuedItem>(
      'SELECT * FROM IssuedItems WHERE id = @id',
      { id }
    );

    return { jsonBody: updatedItems[0] };
  } catch (error) {
    context.error('Return item error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Register routes
app.http('issuedItems-list', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'issuedItems',
  handler: getIssuedItems,
});

app.http('issuedItems-by-user', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'issuedItems/user/{userId}',
  handler: getIssuedItemsByUser,
});

app.http('issuedItems-issue', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'issuedItems',
  handler: issueItem,
});

app.http('issuedItems-return', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'issuedItems/{id}/return',
  handler: returnItem,
});
