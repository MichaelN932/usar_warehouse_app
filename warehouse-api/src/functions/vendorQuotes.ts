import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { query, execute } from '../services/database.js';
import { VendorQuote, VendorQuoteLine } from '../types/index.js';
import { getUserFromToken } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

// Helper to load vendor quote with lines
async function loadVendorQuoteFull(id: string): Promise<VendorQuote | null> {
  const quotes = await query<VendorQuote & { vendorName: string }>(
    `SELECT vq.*, v.name as vendorName
     FROM VendorQuotes vq
     JOIN Vendors v ON vq.vendorId = v.id
     WHERE vq.id = @id`,
    { id }
  );

  if (quotes.length === 0) return null;

  const lines = await query<VendorQuoteLine>(
    'SELECT * FROM VendorQuoteLines WHERE vendorQuoteId = @id ORDER BY id',
    { id }
  );

  const quote = quotes[0];
  return {
    ...quote,
    vendor: { id: quote.vendorId, name: quote.vendorName, isActive: true },
    lines,
  };
}

// POST /api/vendorQuotes
async function createVendorQuote(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const body = await request.json() as {
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
      lines: Partial<VendorQuoteLine>[];
    };

    if (!body.quoteRequestId || !body.vendorId || !body.receivedDate) {
      return { status: 400, jsonBody: { error: 'Quote request ID, vendor ID, and received date are required' } };
    }

    if (!body.lines || body.lines.length === 0) {
      return { status: 400, jsonBody: { error: 'At least one line item is required' } };
    }

    // Verify quote request exists and is in valid state
    const qr = await query<{ status: string }>(
      'SELECT status FROM QuoteRequests WHERE id = @id',
      { id: body.quoteRequestId }
    );
    if (qr.length === 0) {
      return { status: 404, jsonBody: { error: 'Quote request not found' } };
    }
    if (!['Sent', 'QuotesReceived'].includes(qr[0].status)) {
      return { status: 400, jsonBody: { error: 'Quote request is not accepting quotes' } };
    }

    const id = uuidv4();

    // Calculate total
    let totalAmount = 0;
    for (const line of body.lines) {
      totalAmount += (line.unitPrice || 0) * (line.quantity || 1);
    }
    totalAmount += body.shippingCost || 0;

    await execute(
      `INSERT INTO VendorQuotes (id, quoteRequestId, vendorId, quoteNumber, receivedDate, validUntil, totalAmount, shippingCost, leadTimeDays, attachmentUrl, attachmentFileName, isSelected, notes, createdAt, updatedAt)
       VALUES (@id, @quoteRequestId, @vendorId, @quoteNumber, @receivedDate, @validUntil, @totalAmount, @shippingCost, @leadTimeDays, @attachmentUrl, @attachmentFileName, 0, @notes, GETUTCDATE(), GETUTCDATE())`,
      {
        id,
        quoteRequestId: body.quoteRequestId,
        vendorId: body.vendorId,
        quoteNumber: body.quoteNumber || null,
        receivedDate: body.receivedDate,
        validUntil: body.validUntil || null,
        totalAmount,
        shippingCost: body.shippingCost || 0,
        leadTimeDays: body.leadTimeDays || null,
        attachmentUrl: body.attachmentUrl || null,
        attachmentFileName: body.attachmentFileName || null,
        notes: body.notes || null,
      }
    );

    // Insert lines
    for (const line of body.lines) {
      const lineId = uuidv4();
      const lineTotal = (line.unitPrice || 0) * (line.quantity || 1);
      await execute(
        `INSERT INTO VendorQuoteLines (id, vendorQuoteId, quoteRequestLineId, description, unitPrice, quantity, lineTotal, availability, notes)
         VALUES (@id, @vendorQuoteId, @quoteRequestLineId, @description, @unitPrice, @quantity, @lineTotal, @availability, @notes)`,
        {
          id: lineId,
          vendorQuoteId: id,
          quoteRequestLineId: line.quoteRequestLineId || null,
          description: line.description || '',
          unitPrice: line.unitPrice || 0,
          quantity: line.quantity || 1,
          lineTotal,
          availability: line.availability || null,
          notes: line.notes || null,
        }
      );
    }

    // Update quote request status to QuotesReceived if it was Sent
    await execute(
      `UPDATE QuoteRequests SET status = 'QuotesReceived', updatedAt = GETUTCDATE() WHERE id = @id AND status = 'Sent'`,
      { id: body.quoteRequestId }
    );

    const vendorQuote = await loadVendorQuoteFull(id);
    return { status: 201, jsonBody: vendorQuote };
  } catch (error) {
    context.error('Create vendor quote error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/vendorQuotes/:id
async function getVendorQuoteById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const id = request.params.id;
    const vendorQuote = await loadVendorQuoteFull(id);

    if (!vendorQuote) {
      return { status: 404, jsonBody: { error: 'Vendor quote not found' } };
    }

    return { jsonBody: vendorQuote };
  } catch (error) {
    context.error('Get vendor quote error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// PUT /api/vendorQuotes/:id
async function updateVendorQuote(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const id = request.params.id;
    const body = await request.json() as Partial<VendorQuote> & { lines?: Partial<VendorQuoteLine>[] };

    // Check if exists
    const existing = await query<VendorQuote>(
      'SELECT * FROM VendorQuotes WHERE id = @id',
      { id }
    );
    if (existing.length === 0) {
      return { status: 404, jsonBody: { error: 'Vendor quote not found' } };
    }

    const updates: string[] = [];
    const params: Record<string, unknown> = { id };

    if (body.quoteNumber !== undefined) {
      updates.push('quoteNumber = @quoteNumber');
      params.quoteNumber = body.quoteNumber;
    }
    if (body.receivedDate !== undefined) {
      updates.push('receivedDate = @receivedDate');
      params.receivedDate = body.receivedDate;
    }
    if (body.validUntil !== undefined) {
      updates.push('validUntil = @validUntil');
      params.validUntil = body.validUntil;
    }
    if (body.shippingCost !== undefined) {
      updates.push('shippingCost = @shippingCost');
      params.shippingCost = body.shippingCost;
    }
    if (body.leadTimeDays !== undefined) {
      updates.push('leadTimeDays = @leadTimeDays');
      params.leadTimeDays = body.leadTimeDays;
    }
    if (body.attachmentUrl !== undefined) {
      updates.push('attachmentUrl = @attachmentUrl');
      params.attachmentUrl = body.attachmentUrl;
    }
    if (body.attachmentFileName !== undefined) {
      updates.push('attachmentFileName = @attachmentFileName');
      params.attachmentFileName = body.attachmentFileName;
    }
    if (body.notes !== undefined) {
      updates.push('notes = @notes');
      params.notes = body.notes;
    }

    // Update lines if provided
    if (body.lines) {
      // Delete existing lines
      await execute('DELETE FROM VendorQuoteLines WHERE vendorQuoteId = @id', { id });

      // Insert new lines and calculate total
      let totalAmount = body.shippingCost ?? existing[0].shippingCost ?? 0;
      for (const line of body.lines) {
        const lineId = uuidv4();
        const lineTotal = (line.unitPrice || 0) * (line.quantity || 1);
        totalAmount += lineTotal;

        await execute(
          `INSERT INTO VendorQuoteLines (id, vendorQuoteId, quoteRequestLineId, description, unitPrice, quantity, lineTotal, availability, notes)
           VALUES (@id, @vendorQuoteId, @quoteRequestLineId, @description, @unitPrice, @quantity, @lineTotal, @availability, @notes)`,
          {
            id: lineId,
            vendorQuoteId: id,
            quoteRequestLineId: line.quoteRequestLineId || null,
            description: line.description || '',
            unitPrice: line.unitPrice || 0,
            quantity: line.quantity || 1,
            lineTotal,
            availability: line.availability || null,
            notes: line.notes || null,
          }
        );
      }

      updates.push('totalAmount = @totalAmount');
      params.totalAmount = totalAmount;
    }

    if (updates.length > 0) {
      updates.push('updatedAt = GETUTCDATE()');
      await execute(
        `UPDATE VendorQuotes SET ${updates.join(', ')} WHERE id = @id`,
        params
      );
    }

    const vendorQuote = await loadVendorQuoteFull(id);
    return { jsonBody: vendorQuote };
  } catch (error) {
    context.error('Update vendor quote error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// DELETE /api/vendorQuotes/:id
async function deleteVendorQuote(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const id = request.params.id;

    // Check if exists and not selected
    const existing = await query<VendorQuote>(
      'SELECT * FROM VendorQuotes WHERE id = @id',
      { id }
    );
    if (existing.length === 0) {
      return { status: 404, jsonBody: { error: 'Vendor quote not found' } };
    }
    if (existing[0].isSelected) {
      return { status: 400, jsonBody: { error: 'Cannot delete selected vendor quote' } };
    }

    // Delete (cascade will handle lines)
    await execute('DELETE FROM VendorQuotes WHERE id = @id', { id });

    return { status: 204 };
  } catch (error) {
    context.error('Delete vendor quote error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/vendorQuotes/:id/select
async function selectVendorQuote(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || user.role !== 'WarehouseAdmin') {
      return { status: 403, jsonBody: { error: 'Forbidden - Admin access required' } };
    }

    const id = request.params.id;

    const existing = await query<VendorQuote>(
      'SELECT * FROM VendorQuotes WHERE id = @id',
      { id }
    );
    if (existing.length === 0) {
      return { status: 404, jsonBody: { error: 'Vendor quote not found' } };
    }

    // Deselect all quotes for this request, then select this one
    await execute(
      'UPDATE VendorQuotes SET isSelected = 0, updatedAt = GETUTCDATE() WHERE quoteRequestId = @quoteRequestId',
      { quoteRequestId: existing[0].quoteRequestId }
    );
    await execute(
      'UPDATE VendorQuotes SET isSelected = 1, updatedAt = GETUTCDATE() WHERE id = @id',
      { id }
    );

    const vendorQuote = await loadVendorQuoteFull(id);
    return { jsonBody: vendorQuote };
  } catch (error) {
    context.error('Select vendor quote error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Register routes
app.http('vendorQuotes-create', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'vendorQuotes',
  handler: createVendorQuote,
});

app.http('vendorQuotes-get', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'vendorQuotes/{id}',
  handler: getVendorQuoteById,
});

app.http('vendorQuotes-update', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'vendorQuotes/{id}',
  handler: updateVendorQuote,
});

app.http('vendorQuotes-delete', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'vendorQuotes/{id}',
  handler: deleteVendorQuote,
});

app.http('vendorQuotes-select', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'vendorQuotes/{id}/select',
  handler: selectVendorQuote,
});
