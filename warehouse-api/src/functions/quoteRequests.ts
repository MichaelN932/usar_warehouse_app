import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { query, execute } from '../services/database.js';
import { QuoteRequest, QuoteRequestLine, VendorQuote, VendorQuoteLine, GrantSource } from '../types/index.js';
import { getUserFromToken } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

interface QuoteRequestRow extends Omit<QuoteRequest, 'lines' | 'vendorQuotes' | 'grantSource'> {
  grantSourceName?: string;
  grantSourceCode?: string;
}

// Helper to generate request number
async function generateRequestNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const result = await query<{ maxNum: number }>(
    `SELECT ISNULL(MAX(CAST(SUBSTRING(requestNumber, 9, 10) AS INT)), 0) as maxNum
     FROM QuoteRequests
     WHERE requestNumber LIKE @pattern`,
    { pattern: `QR-${year}-%` }
  );
  const nextNum = (result[0]?.maxNum || 0) + 1;
  return `QR-${year}-${nextNum.toString().padStart(3, '0')}`;
}

// Helper to load full quote request with lines and vendor quotes
async function loadQuoteRequestFull(id: string): Promise<QuoteRequest | null> {
  const requests = await query<QuoteRequestRow>(
    `SELECT qr.*,
            gs.name as grantSourceName, gs.code as grantSourceCode,
            u.firstName + ' ' + u.lastName as requestedByName,
            ua.firstName + ' ' + ua.lastName as approvedByName,
            ud.firstName + ' ' + ud.lastName as deniedByName
     FROM QuoteRequests qr
     LEFT JOIN GrantSources gs ON qr.grantSourceId = gs.id
     LEFT JOIN Users u ON qr.requestedBy = u.id
     LEFT JOIN Users ua ON qr.approvedBy = ua.id
     LEFT JOIN Users ud ON qr.deniedBy = ud.id
     WHERE qr.id = @id`,
    { id }
  );

  if (requests.length === 0) return null;

  const lines = await query<QuoteRequestLine>(
    `SELECT qrl.*, it.name as itemTypeName, v.name as variantName, s.name as sizeName
     FROM QuoteRequestLines qrl
     LEFT JOIN ItemTypes it ON qrl.itemTypeId = it.id
     LEFT JOIN Variants v ON qrl.variantId = v.id
     LEFT JOIN Sizes s ON qrl.sizeId = s.id
     WHERE qrl.quoteRequestId = @id
     ORDER BY qrl.sortOrder`,
    { id }
  );

  const vendorQuotes = await query<VendorQuote & { vendorName: string }>(
    `SELECT vq.*, v.name as vendorName
     FROM VendorQuotes vq
     JOIN Vendors v ON vq.vendorId = v.id
     WHERE vq.quoteRequestId = @id
     ORDER BY vq.totalAmount`,
    { id }
  );

  // Load lines for each vendor quote
  for (const vq of vendorQuotes) {
    const vqLines = await query<VendorQuoteLine>(
      'SELECT * FROM VendorQuoteLines WHERE vendorQuoteId = @vqId ORDER BY id',
      { vqId: vq.id }
    );
    vq.lines = vqLines;
    vq.vendor = { id: vq.vendorId, name: vq.vendorName, isActive: true };
  }

  const row = requests[0];
  return {
    ...row,
    grantSource: row.grantSourceId ? {
      id: row.grantSourceId,
      name: row.grantSourceName!,
      code: row.grantSourceCode!,
    } as GrantSource : undefined,
    lines,
    vendorQuotes,
  };
}

// GET /api/quoteRequests
async function getQuoteRequests(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const status = request.query.get('status');
    const grantSourceId = request.query.get('grantSourceId');

    let sql = `SELECT qr.*,
               gs.name as grantSourceName, gs.code as grantSourceCode,
               u.firstName + ' ' + u.lastName as requestedByName,
               (SELECT COUNT(*) FROM VendorQuotes vq WHERE vq.quoteRequestId = qr.id) as quoteCount
               FROM QuoteRequests qr
               LEFT JOIN GrantSources gs ON qr.grantSourceId = gs.id
               LEFT JOIN Users u ON qr.requestedBy = u.id
               WHERE 1=1`;
    const params: Record<string, unknown> = {};

    if (status) {
      sql += ' AND qr.status = @status';
      params.status = status;
    }

    if (grantSourceId) {
      sql += ' AND qr.grantSourceId = @grantSourceId';
      params.grantSourceId = grantSourceId;
    }

    sql += ' ORDER BY qr.createdAt DESC';

    const requests = await query<QuoteRequestRow & { quoteCount: number }>(sql, params);

    // Transform results
    const result = requests.map(r => ({
      ...r,
      grantSource: r.grantSourceId ? {
        id: r.grantSourceId,
        name: r.grantSourceName,
        code: r.grantSourceCode,
      } : undefined,
      lines: [],
      vendorQuotes: [],
    }));

    return { jsonBody: result };
  } catch (error) {
    context.error('Get quote requests error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/quoteRequests/:id
async function getQuoteRequestById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const id = request.params.id;
    const quoteRequest = await loadQuoteRequestFull(id);

    if (!quoteRequest) {
      return { status: 404, jsonBody: { error: 'Quote request not found' } };
    }

    return { jsonBody: quoteRequest };
  } catch (error) {
    context.error('Get quote request error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/quoteRequests
async function createQuoteRequest(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const body = await request.json() as {
      grantSourceId?: string;
      notes?: string;
      dueDate?: string;
      lines: Partial<QuoteRequestLine>[];
    };

    if (!body.lines || body.lines.length === 0) {
      return { status: 400, jsonBody: { error: 'At least one line item is required' } };
    }

    const id = uuidv4();
    const requestNumber = await generateRequestNumber();

    await execute(
      `INSERT INTO QuoteRequests (id, requestNumber, grantSourceId, status, requestedBy, notes, dueDate, createdAt, updatedAt)
       VALUES (@id, @requestNumber, @grantSourceId, 'Draft', @requestedBy, @notes, @dueDate, GETUTCDATE(), GETUTCDATE())`,
      {
        id,
        requestNumber,
        grantSourceId: body.grantSourceId || null,
        requestedBy: user.id,
        notes: body.notes || null,
        dueDate: body.dueDate || null,
      }
    );

    // Insert lines
    for (let i = 0; i < body.lines.length; i++) {
      const line = body.lines[i];
      const lineId = uuidv4();
      await execute(
        `INSERT INTO QuoteRequestLines (id, quoteRequestId, itemTypeId, variantId, sizeId, description, quantity, estimatedUnitPrice, notes, sortOrder)
         VALUES (@id, @quoteRequestId, @itemTypeId, @variantId, @sizeId, @description, @quantity, @estimatedUnitPrice, @notes, @sortOrder)`,
        {
          id: lineId,
          quoteRequestId: id,
          itemTypeId: line.itemTypeId || null,
          variantId: line.variantId || null,
          sizeId: line.sizeId || null,
          description: line.description || '',
          quantity: line.quantity || 1,
          estimatedUnitPrice: line.estimatedUnitPrice || null,
          notes: line.notes || null,
          sortOrder: i,
        }
      );
    }

    const quoteRequest = await loadQuoteRequestFull(id);
    return { status: 201, jsonBody: quoteRequest };
  } catch (error) {
    context.error('Create quote request error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// PUT /api/quoteRequests/:id
async function updateQuoteRequest(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const id = request.params.id;
    const body = await request.json() as Partial<QuoteRequest> & { lines?: Partial<QuoteRequestLine>[] };

    // Check if exists and is editable
    const existing = await query<QuoteRequest>(
      'SELECT * FROM QuoteRequests WHERE id = @id',
      { id }
    );
    if (existing.length === 0) {
      return { status: 404, jsonBody: { error: 'Quote request not found' } };
    }
    if (!['Draft', 'Sent'].includes(existing[0].status)) {
      return { status: 400, jsonBody: { error: 'Cannot edit quote request in current status' } };
    }

    const updates: string[] = [];
    const params: Record<string, unknown> = { id };

    if (body.grantSourceId !== undefined) {
      updates.push('grantSourceId = @grantSourceId');
      params.grantSourceId = body.grantSourceId;
    }
    if (body.notes !== undefined) {
      updates.push('notes = @notes');
      params.notes = body.notes;
    }
    if (body.dueDate !== undefined) {
      updates.push('dueDate = @dueDate');
      params.dueDate = body.dueDate;
    }

    if (updates.length > 0) {
      updates.push('updatedAt = GETUTCDATE()');
      await execute(
        `UPDATE QuoteRequests SET ${updates.join(', ')} WHERE id = @id`,
        params
      );
    }

    // Update lines if provided
    if (body.lines) {
      // Delete existing lines
      await execute('DELETE FROM QuoteRequestLines WHERE quoteRequestId = @id', { id });

      // Insert new lines
      for (let i = 0; i < body.lines.length; i++) {
        const line = body.lines[i];
        const lineId = uuidv4();
        await execute(
          `INSERT INTO QuoteRequestLines (id, quoteRequestId, itemTypeId, variantId, sizeId, description, quantity, estimatedUnitPrice, notes, sortOrder)
           VALUES (@id, @quoteRequestId, @itemTypeId, @variantId, @sizeId, @description, @quantity, @estimatedUnitPrice, @notes, @sortOrder)`,
          {
            id: lineId,
            quoteRequestId: id,
            itemTypeId: line.itemTypeId || null,
            variantId: line.variantId || null,
            sizeId: line.sizeId || null,
            description: line.description || '',
            quantity: line.quantity || 1,
            estimatedUnitPrice: line.estimatedUnitPrice || null,
            notes: line.notes || null,
            sortOrder: i,
          }
        );
      }
    }

    const quoteRequest = await loadQuoteRequestFull(id);
    return { jsonBody: quoteRequest };
  } catch (error) {
    context.error('Update quote request error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/quoteRequests/:id/send
async function sendQuoteRequest(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const id = request.params.id;

    const existing = await query<QuoteRequest>(
      'SELECT * FROM QuoteRequests WHERE id = @id',
      { id }
    );
    if (existing.length === 0) {
      return { status: 404, jsonBody: { error: 'Quote request not found' } };
    }
    if (existing[0].status !== 'Draft') {
      return { status: 400, jsonBody: { error: 'Can only send draft quote requests' } };
    }

    await execute(
      `UPDATE QuoteRequests SET status = 'Sent', sentAt = GETUTCDATE(), updatedAt = GETUTCDATE() WHERE id = @id`,
      { id }
    );

    const quoteRequest = await loadQuoteRequestFull(id);
    return { jsonBody: quoteRequest };
  } catch (error) {
    context.error('Send quote request error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/quoteRequests/:id/approve
async function approveQuoteRequest(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || user.role !== 'WarehouseAdmin') {
      return { status: 403, jsonBody: { error: 'Forbidden - Admin access required' } };
    }

    const id = request.params.id;
    const body = await request.json() as { selectedQuoteId: string };

    if (!body.selectedQuoteId) {
      return { status: 400, jsonBody: { error: 'Selected vendor quote ID is required' } };
    }

    const existing = await query<QuoteRequest>(
      'SELECT * FROM QuoteRequests WHERE id = @id',
      { id }
    );
    if (existing.length === 0) {
      return { status: 404, jsonBody: { error: 'Quote request not found' } };
    }
    if (!['Sent', 'QuotesReceived'].includes(existing[0].status)) {
      return { status: 400, jsonBody: { error: 'Quote request must have quotes received' } };
    }

    // Mark selected quote
    await execute(
      'UPDATE VendorQuotes SET isSelected = 0 WHERE quoteRequestId = @id',
      { id }
    );
    await execute(
      'UPDATE VendorQuotes SET isSelected = 1 WHERE id = @selectedQuoteId',
      { selectedQuoteId: body.selectedQuoteId }
    );

    await execute(
      `UPDATE QuoteRequests SET status = 'Approved', approvedBy = @approvedBy, approvedAt = GETUTCDATE(), updatedAt = GETUTCDATE() WHERE id = @id`,
      { id, approvedBy: user.id }
    );

    const quoteRequest = await loadQuoteRequestFull(id);
    return { jsonBody: quoteRequest };
  } catch (error) {
    context.error('Approve quote request error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/quoteRequests/:id/deny
async function denyQuoteRequest(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || user.role !== 'WarehouseAdmin') {
      return { status: 403, jsonBody: { error: 'Forbidden - Admin access required' } };
    }

    const id = request.params.id;
    const body = await request.json() as { reason?: string };

    const existing = await query<QuoteRequest>(
      'SELECT * FROM QuoteRequests WHERE id = @id',
      { id }
    );
    if (existing.length === 0) {
      return { status: 404, jsonBody: { error: 'Quote request not found' } };
    }

    await execute(
      `UPDATE QuoteRequests SET status = 'Denied', deniedBy = @deniedBy, deniedAt = GETUTCDATE(), denialReason = @reason, updatedAt = GETUTCDATE() WHERE id = @id`,
      { id, deniedBy: user.id, reason: body.reason || null }
    );

    const quoteRequest = await loadQuoteRequestFull(id);
    return { jsonBody: quoteRequest };
  } catch (error) {
    context.error('Deny quote request error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/quoteRequests/:id/convert
// Converts approved quote request to Purchase Order
async function convertToPO(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || user.role !== 'WarehouseAdmin') {
      return { status: 403, jsonBody: { error: 'Forbidden - Admin access required' } };
    }

    const id = request.params.id;

    const quoteRequest = await loadQuoteRequestFull(id);
    if (!quoteRequest) {
      return { status: 404, jsonBody: { error: 'Quote request not found' } };
    }
    if (quoteRequest.status !== 'Approved') {
      return { status: 400, jsonBody: { error: 'Quote request must be approved before converting to PO' } };
    }

    const selectedQuote = quoteRequest.vendorQuotes.find(vq => vq.isSelected);
    if (!selectedQuote) {
      return { status: 400, jsonBody: { error: 'No vendor quote selected' } };
    }

    // Generate PO number
    const year = new Date().getFullYear();
    const poResult = await query<{ maxNum: number }>(
      `SELECT ISNULL(MAX(CAST(SUBSTRING(poNumber, 6, 10) AS INT)), 0) as maxNum
       FROM PurchaseOrders
       WHERE poNumber LIKE @pattern`,
      { pattern: `PO-${year}-%` }
    );
    const nextPONum = (poResult[0]?.maxNum || 0) + 1;
    const poNumber = `PO-${year}-${nextPONum.toString().padStart(4, '0')}`;

    const poId = uuidv4();

    // Create Purchase Order
    await execute(
      `INSERT INTO PurchaseOrders (id, poNumber, vendorId, vendorName, status, orderDate, totalAmount, notes, createdBy, grantSourceId, quoteRequestId, vendorQuoteId, shippingCost, createdAt, updatedAt)
       VALUES (@id, @poNumber, @vendorId, @vendorName, 'Draft', GETUTCDATE(), @totalAmount, @notes, @createdBy, @grantSourceId, @quoteRequestId, @vendorQuoteId, @shippingCost, GETUTCDATE(), GETUTCDATE())`,
      {
        id: poId,
        poNumber,
        vendorId: selectedQuote.vendorId,
        vendorName: selectedQuote.vendor?.name || '',
        totalAmount: selectedQuote.totalAmount,
        notes: quoteRequest.notes,
        createdBy: user.id,
        grantSourceId: quoteRequest.grantSourceId,
        quoteRequestId: id,
        vendorQuoteId: selectedQuote.id,
        shippingCost: selectedQuote.shippingCost,
      }
    );

    // Create PO Lines from vendor quote lines
    for (const line of selectedQuote.lines) {
      const lineId = uuidv4();
      await execute(
        `INSERT INTO POLines (id, purchaseOrderId, sizeId, itemDescription, quantityOrdered, quantityReceived, unitCost, lineTotal)
         VALUES (@id, @purchaseOrderId, @sizeId, @itemDescription, @quantityOrdered, 0, @unitCost, @lineTotal)`,
        {
          id: lineId,
          purchaseOrderId: poId,
          sizeId: line.quoteRequestLineId || lineId, // Use quoteRequestLineId if linked to a size, otherwise placeholder
          itemDescription: line.description,
          quantityOrdered: line.quantity,
          unitCost: line.unitPrice,
          lineTotal: line.lineTotal,
        }
      );
    }

    // Update quote request status
    await execute(
      `UPDATE QuoteRequests SET status = 'Converted', updatedAt = GETUTCDATE() WHERE id = @id`,
      { id }
    );

    return {
      jsonBody: {
        success: true,
        purchaseOrderId: poId,
        poNumber,
        message: `Quote request converted to Purchase Order ${poNumber}`,
      },
    };
  } catch (error) {
    context.error('Convert to PO error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Register routes
app.http('quoteRequests-list', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'quoteRequests',
  handler: getQuoteRequests,
});

app.http('quoteRequests-create', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'quoteRequests',
  handler: createQuoteRequest,
});

app.http('quoteRequests-get', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'quoteRequests/{id}',
  handler: getQuoteRequestById,
});

app.http('quoteRequests-update', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'quoteRequests/{id}',
  handler: updateQuoteRequest,
});

app.http('quoteRequests-send', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'quoteRequests/{id}/send',
  handler: sendQuoteRequest,
});

app.http('quoteRequests-approve', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'quoteRequests/{id}/approve',
  handler: approveQuoteRequest,
});

app.http('quoteRequests-deny', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'quoteRequests/{id}/deny',
  handler: denyQuoteRequest,
});

app.http('quoteRequests-convert', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'quoteRequests/{id}/convert',
  handler: convertToPO,
});
