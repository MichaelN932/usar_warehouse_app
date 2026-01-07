import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { query, execute } from '../services/database.js';
import { PurchaseOrder, POLine, POStatus } from '../types/index.js';
import { getUserFromToken } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

// Helper to get PO with lines
async function getPOWithLines(poId: string): Promise<PurchaseOrder | null> {
  const pos = await query<PurchaseOrder>(
    'SELECT * FROM PurchaseOrders WHERE id = @id',
    { id: poId }
  );

  if (pos.length === 0) return null;

  const lines = await query<POLine>(
    'SELECT * FROM POLines WHERE purchaseOrderId = @purchaseOrderId',
    { purchaseOrderId: poId }
  );

  return { ...pos[0], lines };
}

// GET /api/purchaseOrders
async function getPurchaseOrders(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const status = request.query.get('status') as POStatus | null;

    let sql = 'SELECT * FROM PurchaseOrders';
    const params: Record<string, unknown> = {};

    if (status) {
      sql += ' WHERE status = @status';
      params.status = status;
    }

    sql += ' ORDER BY createdAt DESC';

    const pos = await query<PurchaseOrder>(sql, params);

    const posWithLines = await Promise.all(
      pos.map(async (po) => {
        const lines = await query<POLine>(
          'SELECT * FROM POLines WHERE purchaseOrderId = @purchaseOrderId',
          { purchaseOrderId: po.id }
        );
        return { ...po, lines };
      })
    );

    return { jsonBody: posWithLines };
  } catch (error) {
    context.error('Get purchase orders error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/purchaseOrders/:id
async function getPurchaseOrderById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const id = request.params.id;
    const po = await getPOWithLines(id);

    if (!po) {
      return { status: 404, jsonBody: { error: 'Purchase order not found' } };
    }

    return { jsonBody: po };
  } catch (error) {
    context.error('Get purchase order error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/purchaseOrders
async function createPurchaseOrder(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || user.role !== 'WarehouseAdmin') {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const body = await request.json() as {
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
    };

    const poId = uuidv4();
    const now = new Date().toISOString();

    // Generate PO number
    const countResult = await query<{ cnt: number }>(
      'SELECT COUNT(*) AS cnt FROM PurchaseOrders'
    );
    const poNumber = `PO-${String((countResult[0]?.cnt || 0) + 1).padStart(6, '0')}`;

    // Calculate total
    const totalAmount = body.lines.reduce(
      (sum, line) => sum + line.quantityOrdered * line.unitCost,
      0
    );

    await execute(
      `INSERT INTO PurchaseOrders
       (id, poNumber, vendorId, vendorName, status, orderDate, expectedDeliveryDate, totalAmount, notes, createdBy, createdAt, updatedAt)
       VALUES (@id, @poNumber, @vendorId, @vendorName, 'Draft', @orderDate, @expectedDeliveryDate, @totalAmount, @notes, @createdBy, @createdAt, @updatedAt)`,
      {
        id: poId,
        poNumber,
        vendorId: body.vendorId,
        vendorName: body.vendorName,
        orderDate: body.orderDate || null,
        expectedDeliveryDate: body.expectedDeliveryDate || null,
        totalAmount,
        notes: body.notes || null,
        createdBy: user.id,
        createdAt: now,
        updatedAt: now,
      }
    );

    // Insert lines
    for (const line of body.lines) {
      const lineId = uuidv4();
      await execute(
        `INSERT INTO POLines
         (id, purchaseOrderId, sizeId, itemDescription, quantityOrdered, quantityReceived, unitCost, lineTotal)
         VALUES (@id, @purchaseOrderId, @sizeId, @itemDescription, @quantityOrdered, 0, @unitCost, @lineTotal)`,
        {
          id: lineId,
          purchaseOrderId: poId,
          sizeId: line.sizeId,
          itemDescription: line.itemDescription,
          quantityOrdered: line.quantityOrdered,
          unitCost: line.unitCost,
          lineTotal: line.quantityOrdered * line.unitCost,
        }
      );
    }

    const createdPO = await getPOWithLines(poId);
    return { status: 201, jsonBody: createdPO };
  } catch (error) {
    context.error('Create purchase order error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// PUT /api/purchaseOrders/:id/status
async function updatePOStatus(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const id = request.params.id;
    const body = await request.json() as { status: POStatus };
    const now = new Date().toISOString();

    await execute(
      'UPDATE PurchaseOrders SET status = @status, updatedAt = @updatedAt WHERE id = @id',
      { id, status: body.status, updatedAt: now }
    );

    const updatedPO = await getPOWithLines(id);
    return { jsonBody: updatedPO };
  } catch (error) {
    context.error('Update PO status error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/purchaseOrders/:id/receive
async function receivePO(
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
      lines: Array<{
        lineId: string;
        quantityReceived: number;
      }>;
    };

    const now = new Date().toISOString();

    // Update each line
    for (const line of body.lines) {
      await execute(
        'UPDATE POLines SET quantityReceived = quantityReceived + @qty WHERE id = @lineId',
        { lineId: line.lineId, qty: line.quantityReceived }
      );

      // Update inventory
      const poLine = await query<POLine>(
        'SELECT sizeId FROM POLines WHERE id = @lineId',
        { lineId: line.lineId }
      );

      if (poLine.length > 0) {
        // Check if inventory exists
        const inv = await query<{ sizeId: string }>(
          'SELECT sizeId FROM Inventory WHERE sizeId = @sizeId',
          { sizeId: poLine[0].sizeId }
        );

        if (inv.length > 0) {
          await execute(
            'UPDATE Inventory SET quantityOnHand = quantityOnHand + @qty WHERE sizeId = @sizeId',
            { sizeId: poLine[0].sizeId, qty: line.quantityReceived }
          );
        } else {
          await execute(
            'INSERT INTO Inventory (sizeId, quantityOnHand, quantityReserved) VALUES (@sizeId, @qty, 0)',
            { sizeId: poLine[0].sizeId, qty: line.quantityReceived }
          );
        }
      }
    }

    // Check if fully received
    const po = await getPOWithLines(id);
    if (po) {
      const allReceived = po.lines.every(
        (line) => line.quantityReceived >= line.quantityOrdered
      );
      const someReceived = po.lines.some((line) => line.quantityReceived > 0);

      let newStatus: POStatus = po.status;
      if (allReceived) {
        newStatus = 'Received';
      } else if (someReceived) {
        newStatus = 'PartialReceived';
      }

      if (newStatus !== po.status) {
        await execute(
          'UPDATE PurchaseOrders SET status = @status, updatedAt = @updatedAt WHERE id = @id',
          { id, status: newStatus, updatedAt: now }
        );
      }
    }

    const updatedPO = await getPOWithLines(id);
    return { jsonBody: updatedPO };
  } catch (error) {
    context.error('Receive PO error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Register routes
app.http('purchaseOrders-list', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'purchaseOrders',
  handler: getPurchaseOrders,
});

app.http('purchaseOrders-create', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'purchaseOrders',
  handler: createPurchaseOrder,
});

app.http('purchaseOrders-get', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'purchaseOrders/{id}',
  handler: getPurchaseOrderById,
});

app.http('purchaseOrders-update-status', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'purchaseOrders/{id}/status',
  handler: updatePOStatus,
});

app.http('purchaseOrders-receive', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'purchaseOrders/{id}/receive',
  handler: receivePO,
});
