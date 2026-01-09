import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { query, execute } from '../services/database.js';
import { Request, RequestLine, RequestStatus } from '../types/index.js';
import { getUserFromToken } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

// Helper to get request with lines
async function getRequestWithLines(requestId: string): Promise<Request | null> {
  const requests = await query<Request>(
    'SELECT * FROM Requests WHERE id = @id',
    { id: requestId }
  );

  if (requests.length === 0) return null;

  const lines = await query<RequestLine>(
    'SELECT * FROM RequestLines WHERE requestId = @requestId',
    { requestId }
  );

  return { ...requests[0], lines };
}

// GET /api/requests
async function getRequests(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const status = request.query.get('status') as RequestStatus | null;
    const userId = request.query.get('userId');

    let sql = 'SELECT * FROM Requests WHERE 1=1';
    const params: Record<string, unknown> = {};

    // Non-warehouse users can only see their own requests
    if (!['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      sql += ' AND requestedBy = @currentUserId';
      params.currentUserId = user.id;
    } else if (userId) {
      sql += ' AND requestedBy = @userId';
      params.userId = userId;
    }

    if (status) {
      sql += ' AND status = @status';
      params.status = status;
    }

    sql += ' ORDER BY requestDate DESC';

    const requests = await query<Request>(sql, params);

    // Get lines for each request
    const requestsWithLines = await Promise.all(
      requests.map(async (req) => {
        const lines = await query<RequestLine>(
          'SELECT * FROM RequestLines WHERE requestId = @requestId',
          { requestId: req.id }
        );
        return { ...req, lines };
      })
    );

    return { jsonBody: requestsWithLines };
  } catch (error) {
    context.error('Get requests error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/requests/:id
async function getRequestById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const id = request.params.id;
    const req = await getRequestWithLines(id);

    if (!req) {
      return { status: 404, jsonBody: { error: 'Request not found' } };
    }

    // Non-warehouse users can only see their own requests
    if (
      !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role) &&
      req.requestedBy !== user.id
    ) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    return { jsonBody: req };
  } catch (error) {
    context.error('Get request error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/requests
async function createRequest(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const body = await request.json() as {
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
      requestedBy?: string; // For warehouse staff creating on behalf of user
    };

    const requestId = uuidv4();
    const now = new Date().toISOString();

    // Warehouse staff can create requests for other users
    let requestedBy = user.id;
    let requestedByName = `${user.firstName} ${user.lastName}`;

    if (
      body.requestedBy &&
      ['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)
    ) {
      const targetUser = await query<{ id: string; firstName: string; lastName: string }>(
        'SELECT id, firstName, lastName FROM Users WHERE id = @id',
        { id: body.requestedBy }
      );
      if (targetUser.length > 0) {
        requestedBy = targetUser[0].id;
        requestedByName = `${targetUser[0].firstName} ${targetUser[0].lastName}`;
      }
    }

    await execute(
      `INSERT INTO Requests (id, requestedBy, requestedByName, status, requestDate, notes, createdAt, updatedAt)
       VALUES (@id, @requestedBy, @requestedByName, 'Pending', @requestDate, @notes, @createdAt, @updatedAt)`,
      {
        id: requestId,
        requestedBy,
        requestedByName,
        requestDate: now,
        notes: body.notes || null,
        createdAt: now,
        updatedAt: now,
      }
    );

    // Insert lines
    for (const line of body.lines) {
      const lineId = uuidv4();
      await execute(
        `INSERT INTO RequestLines
         (id, requestId, itemTypeId, itemTypeName, requestedSizeId, requestedSizeName, preferredVariantId, preferredVariantName, quantity, replacementReason, issuedQuantity, isBackordered)
         VALUES (@id, @requestId, @itemTypeId, @itemTypeName, @requestedSizeId, @requestedSizeName, @preferredVariantId, @preferredVariantName, @quantity, @replacementReason, 0, 0)`,
        {
          id: lineId,
          requestId,
          itemTypeId: line.itemTypeId,
          itemTypeName: line.itemTypeName,
          requestedSizeId: line.requestedSizeId || null,
          requestedSizeName: line.requestedSizeName || null,
          preferredVariantId: line.preferredVariantId || null,
          preferredVariantName: line.preferredVariantName || null,
          quantity: line.quantity,
          replacementReason: line.replacementReason || null,
        }
      );
    }

    const createdRequest = await getRequestWithLines(requestId);
    return { status: 201, jsonBody: createdRequest };
  } catch (error) {
    context.error('Create request error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// PUT /api/requests/:id/status
async function updateRequestStatus(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const id = request.params.id;
    const body = await request.json() as { status: RequestStatus };
    const now = new Date().toISOString();

    await execute(
      'UPDATE Requests SET status = @status, updatedAt = @updatedAt WHERE id = @id',
      { id, status: body.status, updatedAt: now }
    );

    const updatedRequest = await getRequestWithLines(id);
    return { jsonBody: updatedRequest };
  } catch (error) {
    context.error('Update request status error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/requests/:id/fulfill
async function fulfillRequest(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const id = request.params.id;
    const body = await request.json() as { signature?: string };
    const now = new Date().toISOString();

    await execute(
      `UPDATE Requests
       SET status = 'Fulfilled', fulfilledBy = @fulfilledBy, fulfilledAt = @fulfilledAt,
           pickupSignature = @signature, pickupSignedAt = @signedAt, updatedAt = @updatedAt
       WHERE id = @id`,
      {
        id,
        fulfilledBy: user.id,
        fulfilledAt: now,
        signature: body.signature || null,
        signedAt: body.signature ? now : null,
        updatedAt: now,
      }
    );

    const fulfilledRequest = await getRequestWithLines(id);
    return { jsonBody: fulfilledRequest };
  } catch (error) {
    context.error('Fulfill request error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/requests/pending
async function getPendingRequests(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const requests = await query<Request>(
      "SELECT * FROM Requests WHERE status IN ('Pending', 'Approved', 'Backordered') ORDER BY requestDate"
    );

    const requestsWithLines = await Promise.all(
      requests.map(async (req) => {
        const lines = await query<RequestLine>(
          'SELECT * FROM RequestLines WHERE requestId = @requestId',
          { requestId: req.id }
        );
        return { ...req, lines };
      })
    );

    return { jsonBody: requestsWithLines };
  } catch (error) {
    context.error('Get pending requests error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/requests/ready-for-pickup
async function getReadyForPickup(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || !['WarehouseStaff', 'WarehouseAdmin'].includes(user.role)) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const requests = await query<Request>(
      "SELECT * FROM Requests WHERE status = 'ReadyForPickup' ORDER BY requestDate"
    );

    const requestsWithLines = await Promise.all(
      requests.map(async (req) => {
        const lines = await query<RequestLine>(
          'SELECT * FROM RequestLines WHERE requestId = @requestId',
          { requestId: req.id }
        );
        return { ...req, lines };
      })
    );

    return { jsonBody: requestsWithLines };
  } catch (error) {
    context.error('Get ready for pickup error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Register routes
app.http('requests-list', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'requests',
  handler: getRequests,
});

app.http('requests-create', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'requests',
  handler: createRequest,
});

app.http('requests-get', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'requests/{id}',
  handler: getRequestById,
});

app.http('requests-update-status', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'requests/{id}/status',
  handler: updateRequestStatus,
});

app.http('requests-fulfill', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'requests/{id}/fulfill',
  handler: fulfillRequest,
});

app.http('requests-pending', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'requests/pending',
  handler: getPendingRequests,
});

app.http('requests-ready', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'requests/ready-for-pickup',
  handler: getReadyForPickup,
});
