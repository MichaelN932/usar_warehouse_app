import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { query, execute } from '../services/database.js';
import { Vendor } from '../types/index.js';
import { getUserFromToken } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

// GET /api/vendors
async function getVendors(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const vendors = await query<Vendor>(
      'SELECT * FROM Vendors WHERE isActive = 1 ORDER BY name'
    );
    return { jsonBody: vendors };
  } catch (error) {
    context.error('Get vendors error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/vendors/:id
async function getVendorById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const id = request.params.id;
    const vendors = await query<Vendor>(
      'SELECT * FROM Vendors WHERE id = @id',
      { id }
    );

    if (vendors.length === 0) {
      return { status: 404, jsonBody: { error: 'Vendor not found' } };
    }

    return { jsonBody: vendors[0] };
  } catch (error) {
    context.error('Get vendor error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/vendors
async function createVendor(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || user.role !== 'WarehouseAdmin') {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const body = await request.json() as Partial<Vendor>;
    const { name, contactName, email, phone, address, website, notes } = body;

    if (!name) {
      return { status: 400, jsonBody: { error: 'Vendor name is required' } };
    }

    const id = uuidv4();

    await execute(
      `INSERT INTO Vendors (id, name, contactName, email, phone, address, website, notes, isActive)
       VALUES (@id, @name, @contactName, @email, @phone, @address, @website, @notes, 1)`,
      {
        id,
        name,
        contactName: contactName || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        website: website || null,
        notes: notes || null,
      }
    );

    const vendors = await query<Vendor>(
      'SELECT * FROM Vendors WHERE id = @id',
      { id }
    );

    return { status: 201, jsonBody: vendors[0] };
  } catch (error) {
    context.error('Create vendor error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// PUT /api/vendors/:id
async function updateVendor(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user || user.role !== 'WarehouseAdmin') {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const id = request.params.id;
    const body = await request.json() as Partial<Vendor>;

    const updates: string[] = [];
    const params: Record<string, unknown> = { id };

    if (body.name !== undefined) {
      updates.push('name = @name');
      params.name = body.name;
    }
    if (body.contactName !== undefined) {
      updates.push('contactName = @contactName');
      params.contactName = body.contactName;
    }
    if (body.email !== undefined) {
      updates.push('email = @email');
      params.email = body.email;
    }
    if (body.phone !== undefined) {
      updates.push('phone = @phone');
      params.phone = body.phone;
    }
    if (body.address !== undefined) {
      updates.push('address = @address');
      params.address = body.address;
    }
    if (body.website !== undefined) {
      updates.push('website = @website');
      params.website = body.website;
    }
    if (body.notes !== undefined) {
      updates.push('notes = @notes');
      params.notes = body.notes;
    }
    if (body.isActive !== undefined) {
      updates.push('isActive = @isActive');
      params.isActive = body.isActive ? 1 : 0;
    }

    if (updates.length === 0) {
      return { status: 400, jsonBody: { error: 'No fields to update' } };
    }

    await execute(
      `UPDATE Vendors SET ${updates.join(', ')} WHERE id = @id`,
      params
    );

    const vendors = await query<Vendor>(
      'SELECT * FROM Vendors WHERE id = @id',
      { id }
    );

    return { jsonBody: vendors[0] };
  } catch (error) {
    context.error('Update vendor error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Register routes
app.http('vendors-list', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'vendors',
  handler: getVendors,
});

app.http('vendors-create', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'vendors',
  handler: createVendor,
});

app.http('vendors-get', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'vendors/{id}',
  handler: getVendorById,
});

app.http('vendors-update', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'vendors/{id}',
  handler: updateVendor,
});
