import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { query, execute } from '../services/database.js';
import { getUserFromToken } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

interface InboundEmail {
  id: string;
  fromAddress: string;
  subject: string;
  receivedAt: string;
  body?: string;
  attachmentCount: number;
  status: 'Pending' | 'Processed' | 'Failed' | 'Ignored';
  matchedVendorId?: string;
  matchedVendorName?: string;
  matchedQuoteRequestId?: string;
  matchedQuoteRequestNumber?: string;
  processedAt?: string;
  errorMessage?: string;
}

// GET /api/emails
async function getEmails(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const status = request.query.get('status');
    const limit = parseInt(request.query.get('limit') || '50');

    let sql = `
      SELECT
        e.*,
        v.name as matchedVendorName,
        qr.requestNumber as matchedQuoteRequestNumber
      FROM InboundEmails e
      LEFT JOIN Vendors v ON e.matchedVendorId = v.id
      LEFT JOIN QuoteRequests qr ON e.matchedQuoteRequestId = qr.id
      WHERE 1=1
    `;
    const params: Record<string, unknown> = {};

    if (status) {
      sql += ' AND e.status = @status';
      params.status = status;
    }

    sql += ` ORDER BY e.receivedAt DESC OFFSET 0 ROWS FETCH NEXT @limit ROWS ONLY`;
    params.limit = limit;

    const emails = await query<InboundEmail>(sql, params);
    return { jsonBody: emails };
  } catch (error) {
    context.error('Get emails error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/emails/:id
async function getEmailById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const id = request.params.id;
    const emails = await query<InboundEmail>(
      `SELECT
        e.*,
        v.name as matchedVendorName,
        qr.requestNumber as matchedQuoteRequestNumber
      FROM InboundEmails e
      LEFT JOIN Vendors v ON e.matchedVendorId = v.id
      LEFT JOIN QuoteRequests qr ON e.matchedQuoteRequestId = qr.id
      WHERE e.id = @id`,
      { id }
    );

    if (emails.length === 0) {
      return { status: 404, jsonBody: { error: 'Email not found' } };
    }

    return { jsonBody: emails[0] };
  } catch (error) {
    context.error('Get email error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/emails/:id/process
// Manually process an email - link to vendor and quote request
async function processEmail(
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
      vendorId?: string;
      quoteRequestId?: string;
      createVendorQuote?: boolean;
      vendorQuoteData?: {
        quoteNumber?: string;
        totalAmount: number;
        shippingCost?: number;
        leadTimeDays?: number;
        lines: Array<{
          description: string;
          quantity: number;
          unitPrice: number;
        }>;
      };
    };

    // Check email exists
    const emails = await query<InboundEmail>(
      'SELECT * FROM InboundEmails WHERE id = @id',
      { id }
    );
    if (emails.length === 0) {
      return { status: 404, jsonBody: { error: 'Email not found' } };
    }

    const email = emails[0];
    if (email.status !== 'Pending') {
      return { status: 400, jsonBody: { error: 'Email already processed' } };
    }

    // Update email with matches
    await execute(
      `UPDATE InboundEmails
       SET matchedVendorId = @vendorId,
           matchedQuoteRequestId = @quoteRequestId,
           status = 'Processed',
           processedAt = GETUTCDATE()
       WHERE id = @id`,
      {
        id,
        vendorId: body.vendorId || null,
        quoteRequestId: body.quoteRequestId || null,
      }
    );

    // Optionally create a vendor quote
    if (body.createVendorQuote && body.vendorId && body.quoteRequestId && body.vendorQuoteData) {
      const vqId = uuidv4();
      const { vendorQuoteData } = body;

      await execute(
        `INSERT INTO VendorQuotes (id, quoteRequestId, vendorId, quoteNumber, receivedDate, totalAmount, shippingCost, leadTimeDays, isSelected, createdAt, updatedAt)
         VALUES (@id, @quoteRequestId, @vendorId, @quoteNumber, GETUTCDATE(), @totalAmount, @shippingCost, @leadTimeDays, 0, GETUTCDATE(), GETUTCDATE())`,
        {
          id: vqId,
          quoteRequestId: body.quoteRequestId,
          vendorId: body.vendorId,
          quoteNumber: vendorQuoteData.quoteNumber || null,
          totalAmount: vendorQuoteData.totalAmount,
          shippingCost: vendorQuoteData.shippingCost || 0,
          leadTimeDays: vendorQuoteData.leadTimeDays || null,
        }
      );

      // Insert lines
      for (const line of vendorQuoteData.lines) {
        const lineId = uuidv4();
        const lineTotal = line.unitPrice * line.quantity;
        await execute(
          `INSERT INTO VendorQuoteLines (id, vendorQuoteId, description, unitPrice, quantity, lineTotal)
           VALUES (@id, @vendorQuoteId, @description, @unitPrice, @quantity, @lineTotal)`,
          {
            id: lineId,
            vendorQuoteId: vqId,
            description: line.description,
            unitPrice: line.unitPrice,
            quantity: line.quantity,
            lineTotal,
          }
        );
      }

      // Update quote request status if it was Sent
      await execute(
        `UPDATE QuoteRequests SET status = 'QuotesReceived', updatedAt = GETUTCDATE() WHERE id = @id AND status = 'Sent'`,
        { id: body.quoteRequestId }
      );
    }

    // Return updated email
    const updated = await query<InboundEmail>(
      `SELECT
        e.*,
        v.name as matchedVendorName,
        qr.requestNumber as matchedQuoteRequestNumber
      FROM InboundEmails e
      LEFT JOIN Vendors v ON e.matchedVendorId = v.id
      LEFT JOIN QuoteRequests qr ON e.matchedQuoteRequestId = qr.id
      WHERE e.id = @id`,
      { id }
    );

    return { jsonBody: updated[0] };
  } catch (error) {
    context.error('Process email error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/emails/:id/ignore
async function ignoreEmail(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const id = request.params.id;

    await execute(
      `UPDATE InboundEmails SET status = 'Ignored', processedAt = GETUTCDATE() WHERE id = @id`,
      { id }
    );

    return { jsonBody: { success: true } };
  } catch (error) {
    context.error('Ignore email error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/emails/webhook
// Webhook for Azure Logic Apps to send inbound emails
async function emailWebhook(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    // This would typically have its own auth mechanism (API key, etc.)
    const body = await request.json() as {
      fromAddress: string;
      subject: string;
      body?: string;
      receivedAt?: string;
      attachmentCount?: number;
      attachmentUrls?: string[];
    };

    if (!body.fromAddress || !body.subject) {
      return { status: 400, jsonBody: { error: 'fromAddress and subject are required' } };
    }

    const id = uuidv4();

    // Try to auto-match vendor by email domain
    const emailDomain = body.fromAddress.split('@')[1]?.toLowerCase();
    let matchedVendorId: string | null = null;

    if (emailDomain) {
      const vendors = await query<{ id: string }>(
        `SELECT id FROM Vendors WHERE emailDomain = @emailDomain AND isActive = 1`,
        { emailDomain }
      );
      if (vendors.length > 0) {
        matchedVendorId = vendors[0].id;
      }
    }

    // Try to auto-match quote request from subject (look for QR-XXXX-XXX pattern)
    let matchedQuoteRequestId: string | null = null;
    const qrMatch = body.subject.match(/QR-\d{4}-\d{3}/i);
    if (qrMatch) {
      const quoteRequests = await query<{ id: string }>(
        `SELECT id FROM QuoteRequests WHERE requestNumber = @requestNumber AND status IN ('Sent', 'QuotesReceived')`,
        { requestNumber: qrMatch[0].toUpperCase() }
      );
      if (quoteRequests.length > 0) {
        matchedQuoteRequestId = quoteRequests[0].id;
      }
    }

    await execute(
      `INSERT INTO InboundEmails (id, fromAddress, subject, body, receivedAt, attachmentCount, status, matchedVendorId, matchedQuoteRequestId, createdAt)
       VALUES (@id, @fromAddress, @subject, @body, @receivedAt, @attachmentCount, 'Pending', @matchedVendorId, @matchedQuoteRequestId, GETUTCDATE())`,
      {
        id,
        fromAddress: body.fromAddress,
        subject: body.subject,
        body: body.body || null,
        receivedAt: body.receivedAt || new Date().toISOString(),
        attachmentCount: body.attachmentCount || 0,
        matchedVendorId,
        matchedQuoteRequestId,
      }
    );

    return {
      status: 201,
      jsonBody: {
        id,
        matchedVendorId,
        matchedQuoteRequestId,
        message: 'Email received and queued for processing',
      },
    };
  } catch (error) {
    context.error('Email webhook error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Register routes
app.http('emails-list', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'emails',
  handler: getEmails,
});

app.http('emails-get', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'emails/{id}',
  handler: getEmailById,
});

app.http('emails-process', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'emails/{id}/process',
  handler: processEmail,
});

app.http('emails-ignore', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'emails/{id}/ignore',
  handler: ignoreEmail,
});

app.http('emails-webhook', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'emails/webhook',
  handler: emailWebhook,
});
