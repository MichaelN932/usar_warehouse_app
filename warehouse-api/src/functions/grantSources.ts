import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { query, execute } from '../services/database.js';
import { GrantSource } from '../types/index.js';
import { getUserFromToken } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

// Helper to calculate remaining budget
function addRemainingBudget(gs: GrantSource): GrantSource {
  return {
    ...gs,
    remainingBudget: gs.totalBudget - gs.usedBudget,
  };
}

// GET /api/grantSources
async function getGrantSources(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const activeOnly = request.query.get('activeOnly') === 'true';
    const fiscalYear = request.query.get('fiscalYear');

    let sql = 'SELECT * FROM GrantSources WHERE 1=1';
    const params: Record<string, unknown> = {};

    if (activeOnly) {
      sql += ' AND isActive = 1';
    }

    if (fiscalYear) {
      sql += ' AND fiscalYear = @fiscalYear';
      params.fiscalYear = parseInt(fiscalYear);
    }

    sql += ' ORDER BY fiscalYear DESC, name';

    const grantSources = await query<GrantSource>(sql, params);
    return { jsonBody: grantSources.map(addRemainingBudget) };
  } catch (error) {
    context.error('Get grant sources error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/grantSources/:id
async function getGrantSourceById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const id = request.params.id;
    const grantSources = await query<GrantSource>(
      'SELECT * FROM GrantSources WHERE id = @id',
      { id }
    );

    if (grantSources.length === 0) {
      return { status: 404, jsonBody: { error: 'Grant source not found' } };
    }

    return { jsonBody: addRemainingBudget(grantSources[0]) };
  } catch (error) {
    context.error('Get grant source error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/grantSources
async function createGrantSource(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || user.role !== 'WarehouseAdmin') {
      return { status: 403, jsonBody: { error: 'Forbidden - Admin access required' } };
    }

    const body = await request.json() as Partial<GrantSource>;
    const { name, code, description, fiscalYear, totalBudget } = body;

    if (!name || !code || !fiscalYear) {
      return { status: 400, jsonBody: { error: 'Name, code, and fiscal year are required' } };
    }

    // Check for duplicate code
    const existing = await query<GrantSource>(
      'SELECT id FROM GrantSources WHERE code = @code',
      { code }
    );
    if (existing.length > 0) {
      return { status: 400, jsonBody: { error: 'Grant source code already exists' } };
    }

    const id = uuidv4();

    await execute(
      `INSERT INTO GrantSources (id, name, code, description, fiscalYear, totalBudget, usedBudget, isActive, createdAt, updatedAt)
       VALUES (@id, @name, @code, @description, @fiscalYear, @totalBudget, 0, 1, GETUTCDATE(), GETUTCDATE())`,
      {
        id,
        name,
        code,
        description: description || null,
        fiscalYear,
        totalBudget: totalBudget || 0,
      }
    );

    const grantSources = await query<GrantSource>(
      'SELECT * FROM GrantSources WHERE id = @id',
      { id }
    );

    return { status: 201, jsonBody: addRemainingBudget(grantSources[0]) };
  } catch (error) {
    context.error('Create grant source error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// PUT /api/grantSources/:id
async function updateGrantSource(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || user.role !== 'WarehouseAdmin') {
      return { status: 403, jsonBody: { error: 'Forbidden - Admin access required' } };
    }

    const id = request.params.id;
    const body = await request.json() as Partial<GrantSource>;

    const updates: string[] = [];
    const params: Record<string, unknown> = { id };

    if (body.name !== undefined) {
      updates.push('name = @name');
      params.name = body.name;
    }
    if (body.code !== undefined) {
      // Check for duplicate code (excluding current record)
      const existing = await query<GrantSource>(
        'SELECT id FROM GrantSources WHERE code = @code AND id != @id',
        { code: body.code, id }
      );
      if (existing.length > 0) {
        return { status: 400, jsonBody: { error: 'Grant source code already exists' } };
      }
      updates.push('code = @code');
      params.code = body.code;
    }
    if (body.description !== undefined) {
      updates.push('description = @description');
      params.description = body.description;
    }
    if (body.fiscalYear !== undefined) {
      updates.push('fiscalYear = @fiscalYear');
      params.fiscalYear = body.fiscalYear;
    }
    if (body.totalBudget !== undefined) {
      updates.push('totalBudget = @totalBudget');
      params.totalBudget = body.totalBudget;
    }
    if (body.isActive !== undefined) {
      updates.push('isActive = @isActive');
      params.isActive = body.isActive ? 1 : 0;
    }

    if (updates.length === 0) {
      return { status: 400, jsonBody: { error: 'No fields to update' } };
    }

    updates.push('updatedAt = GETUTCDATE()');

    await execute(
      `UPDATE GrantSources SET ${updates.join(', ')} WHERE id = @id`,
      params
    );

    const grantSources = await query<GrantSource>(
      'SELECT * FROM GrantSources WHERE id = @id',
      { id }
    );

    return { jsonBody: addRemainingBudget(grantSources[0]) };
  } catch (error) {
    context.error('Update grant source error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// PUT /api/grantSources/:id/budget
// Update the used budget amount
async function updateGrantSourceBudget(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || user.role !== 'WarehouseAdmin') {
      return { status: 403, jsonBody: { error: 'Forbidden - Admin access required' } };
    }

    const id = request.params.id;
    const body = await request.json() as { amount: number; operation: 'add' | 'subtract' | 'set' };

    if (body.amount === undefined || !body.operation) {
      return { status: 400, jsonBody: { error: 'Amount and operation are required' } };
    }

    // Get current grant source
    const grantSources = await query<GrantSource>(
      'SELECT * FROM GrantSources WHERE id = @id',
      { id }
    );

    if (grantSources.length === 0) {
      return { status: 404, jsonBody: { error: 'Grant source not found' } };
    }

    let newUsedBudget: number;
    const current = grantSources[0];

    switch (body.operation) {
      case 'add':
        newUsedBudget = current.usedBudget + body.amount;
        break;
      case 'subtract':
        newUsedBudget = Math.max(0, current.usedBudget - body.amount);
        break;
      case 'set':
        newUsedBudget = body.amount;
        break;
      default:
        return { status: 400, jsonBody: { error: 'Invalid operation' } };
    }

    await execute(
      'UPDATE GrantSources SET usedBudget = @usedBudget, updatedAt = GETUTCDATE() WHERE id = @id',
      { id, usedBudget: newUsedBudget }
    );

    const updated = await query<GrantSource>(
      'SELECT * FROM GrantSources WHERE id = @id',
      { id }
    );

    return { jsonBody: addRemainingBudget(updated[0]) };
  } catch (error) {
    context.error('Update grant source budget error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Register routes
app.http('grantSources-list', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'grantSources',
  handler: getGrantSources,
});

app.http('grantSources-create', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'grantSources',
  handler: createGrantSource,
});

app.http('grantSources-get', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'grantSources/{id}',
  handler: getGrantSourceById,
});

app.http('grantSources-update', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'grantSources/{id}',
  handler: updateGrantSource,
});

app.http('grantSources-updateBudget', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'grantSources/{id}/budget',
  handler: updateGrantSourceBudget,
});
