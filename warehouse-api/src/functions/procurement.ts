import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { query } from '../services/database.js';
import { ProcurementMetrics } from '../types/index.js';
import { getUserFromToken } from './auth.js';

// GET /api/procurement/dashboard
async function getProcurementDashboard(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || user.role !== 'WarehouseAdmin') {
      return { status: 403, jsonBody: { error: 'Forbidden - Admin access required' } };
    }

    // Get quote metrics
    const quoteStats = await query<{ status: string; count: number }>(
      `SELECT status, COUNT(*) as count FROM QuoteRequests GROUP BY status`
    );

    const quotesPending = quoteStats.find(s => s.status === 'Sent')?.count || 0;
    const quotesAwaitingApproval = quoteStats.find(s => s.status === 'QuotesReceived')?.count || 0;
    const quotesReadyToOrder = quoteStats.find(s => s.status === 'Approved')?.count || 0;

    // Get email metrics (if table exists)
    let emailsUnprocessed = 0;
    try {
      const emailStats = await query<{ count: number }>(
        `SELECT COUNT(*) as count FROM InboundEmails WHERE status = 'Pending'`
      );
      emailsUnprocessed = emailStats[0]?.count || 0;
    } catch {
      // Table might not exist yet
    }

    // Get PO metrics
    const poStats = await query<{ status: string; count: number }>(
      `SELECT status, COUNT(*) as count FROM PurchaseOrders WHERE status IN ('Submitted', 'PartialReceived') GROUP BY status`
    );

    const ordersInTransit = poStats.find(s => s.status === 'Submitted')?.count || 0;
    const ordersAwaitingReceiving = poStats.find(s => s.status === 'PartialReceived')?.count || 0;

    // Get grant budget info
    const grantBudgets = await query<{
      id: string;
      name: string;
      code: string;
      totalBudget: number;
      usedBudget: number;
    }>(
      `SELECT id, name, code, totalBudget, usedBudget FROM GrantSources WHERE isActive = 1 ORDER BY name`
    );

    const budgetsByGrant = grantBudgets.map(g => ({
      grantId: g.id,
      grantName: g.name,
      grantCode: g.code,
      totalBudget: g.totalBudget,
      usedBudget: g.usedBudget,
      remainingBudget: g.totalBudget - g.usedBudget,
      percentUsed: g.totalBudget > 0 ? Math.round((g.usedBudget / g.totalBudget) * 100) : 0,
    }));

    const metrics: ProcurementMetrics = {
      quotesPending,
      quotesAwaitingApproval,
      quotesReadyToOrder,
      emailsUnprocessed,
      ordersInTransit,
      ordersAwaitingReceiving,
      budgetsByGrant,
    };

    return { jsonBody: metrics };
  } catch (error) {
    context.error('Get procurement dashboard error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/procurement/timeline
async function getProcurementTimeline(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || user.role !== 'WarehouseAdmin') {
      return { status: 403, jsonBody: { error: 'Forbidden - Admin access required' } };
    }

    const limit = parseInt(request.query.get('limit') || '20');

    // Combine recent activity from multiple sources
    const activities: {
      id: string;
      type: string;
      title: string;
      description: string;
      timestamp: string;
      relatedId?: string;
      relatedType?: string;
    }[] = [];

    // Recent quote requests
    const quoteActivities = await query<{
      id: string;
      requestNumber: string;
      status: string;
      updatedAt: string;
    }>(
      `SELECT TOP 10 id, requestNumber, status, updatedAt FROM QuoteRequests ORDER BY updatedAt DESC`
    );

    for (const qa of quoteActivities) {
      activities.push({
        id: `qr-${qa.id}`,
        type: 'quote_request',
        title: `Quote Request ${qa.requestNumber}`,
        description: `Status: ${qa.status}`,
        timestamp: qa.updatedAt,
        relatedId: qa.id,
        relatedType: 'QuoteRequest',
      });
    }

    // Recent POs
    const poActivities = await query<{
      id: string;
      poNumber: string;
      status: string;
      vendorName: string;
      updatedAt: string;
    }>(
      `SELECT TOP 10 id, poNumber, status, vendorName, updatedAt FROM PurchaseOrders ORDER BY updatedAt DESC`
    );

    for (const po of poActivities) {
      activities.push({
        id: `po-${po.id}`,
        type: 'purchase_order',
        title: `PO ${po.poNumber}`,
        description: `${po.vendorName} - ${po.status}`,
        timestamp: po.updatedAt,
        relatedId: po.id,
        relatedType: 'PurchaseOrder',
      });
    }

    // Recent vendor quotes
    const vqActivities = await query<{
      id: string;
      quoteNumber: string;
      vendorName: string;
      totalAmount: number;
      createdAt: string;
    }>(
      `SELECT TOP 10 vq.id, vq.quoteNumber, v.name as vendorName, vq.totalAmount, vq.createdAt
       FROM VendorQuotes vq
       JOIN Vendors v ON vq.vendorId = v.id
       ORDER BY vq.createdAt DESC`
    );

    for (const vq of vqActivities) {
      activities.push({
        id: `vq-${vq.id}`,
        type: 'vendor_quote',
        title: `Quote from ${vq.vendorName}`,
        description: `$${vq.totalAmount.toFixed(2)}${vq.quoteNumber ? ` - #${vq.quoteNumber}` : ''}`,
        timestamp: vq.createdAt,
        relatedId: vq.id,
        relatedType: 'VendorQuote',
      });
    }

    // Sort by timestamp descending and limit
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return { jsonBody: activities.slice(0, limit) };
  } catch (error) {
    context.error('Get procurement timeline error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Register routes
app.http('procurement-dashboard', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'procurement/dashboard',
  handler: getProcurementDashboard,
});

app.http('procurement-timeline', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'procurement/timeline',
  handler: getProcurementTimeline,
});
