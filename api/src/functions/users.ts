import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import bcrypt from 'bcryptjs';
import { query, execute } from '../services/database.js';
import { User, UserRecord } from '../types/index.js';
import { getUserFromToken } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

// Helper to transform DB record to User
function toUser(record: UserRecord): User {
  const { passwordHash, ...user } = record;
  return {
    ...user,
    sizes: typeof user.sizes === 'string' ? JSON.parse(user.sizes) : user.sizes,
  };
}

// GET /api/users
async function getUsers(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const currentUser = await getUserFromToken(
      request.headers.get('authorization')
    );
    if (!currentUser || currentUser.role !== 'WarehouseAdmin') {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const users = await query<UserRecord>('SELECT * FROM Users ORDER BY lastName, firstName');
    return { jsonBody: users.map(toUser) };
  } catch (error) {
    context.error('Get users error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/users/:id
async function getUserById(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const currentUser = await getUserFromToken(
      request.headers.get('authorization')
    );
    if (!currentUser) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const id = request.params.id;

    // Users can only view their own profile unless admin
    if (currentUser.id !== id && currentUser.role !== 'WarehouseAdmin') {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const users = await query<UserRecord>(
      'SELECT * FROM Users WHERE id = @id',
      { id }
    );

    if (users.length === 0) {
      return { status: 404, jsonBody: { error: 'User not found' } };
    }

    return { jsonBody: toUser(users[0]) };
  } catch (error) {
    context.error('Get user error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// POST /api/users
async function createUser(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const currentUser = await getUserFromToken(
      request.headers.get('authorization')
    );
    if (!currentUser || currentUser.role !== 'WarehouseAdmin') {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const body = await request.json() as Partial<User> & { password: string };
    const { email, firstName, lastName, role, password, sizes } = body;

    if (!email || !firstName || !lastName || !role || !password) {
      return {
        status: 400,
        jsonBody: { error: 'Missing required fields' },
      };
    }

    // Check if email already exists
    const existing = await query<UserRecord>(
      'SELECT id FROM Users WHERE email = @email',
      { email: email.toLowerCase() }
    );
    if (existing.length > 0) {
      return { status: 400, jsonBody: { error: 'Email already exists' } };
    }

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    await execute(
      `INSERT INTO Users (id, email, firstName, lastName, role, isActive, sizes, passwordHash, createdAt, updatedAt)
       VALUES (@id, @email, @firstName, @lastName, @role, 1, @sizes, @passwordHash, @createdAt, @updatedAt)`,
      {
        id,
        email: email.toLowerCase(),
        firstName,
        lastName,
        role,
        sizes: JSON.stringify(sizes || {}),
        passwordHash,
        createdAt: now,
        updatedAt: now,
      }
    );

    const users = await query<UserRecord>(
      'SELECT * FROM Users WHERE id = @id',
      { id }
    );

    return { status: 201, jsonBody: toUser(users[0]) };
  } catch (error) {
    context.error('Create user error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// PUT /api/users/:id
async function updateUser(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const currentUser = await getUserFromToken(
      request.headers.get('authorization')
    );
    if (!currentUser) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const id = request.params.id;

    // Users can update their own profile (limited fields) or admin can update anyone
    const isAdmin = currentUser.role === 'WarehouseAdmin';
    const isSelf = currentUser.id === id;

    if (!isAdmin && !isSelf) {
      return { status: 403, jsonBody: { error: 'Forbidden' } };
    }

    const body = await request.json() as Partial<User> & { password?: string };
    const updates: string[] = [];
    const params: Record<string, unknown> = { id };

    // Fields everyone can update for themselves
    if (body.firstName !== undefined) {
      updates.push('firstName = @firstName');
      params.firstName = body.firstName;
    }
    if (body.lastName !== undefined) {
      updates.push('lastName = @lastName');
      params.lastName = body.lastName;
    }
    if (body.sizes !== undefined) {
      updates.push('sizes = @sizes');
      params.sizes = JSON.stringify(body.sizes);
    }

    // Admin-only fields
    if (isAdmin) {
      if (body.role !== undefined) {
        updates.push('role = @role');
        params.role = body.role;
      }
      if (body.isActive !== undefined) {
        updates.push('isActive = @isActive');
        params.isActive = body.isActive ? 1 : 0;
      }
      if (body.email !== undefined) {
        updates.push('email = @email');
        params.email = body.email.toLowerCase();
      }
    }

    // Password update
    if (body.password) {
      updates.push('passwordHash = @passwordHash');
      params.passwordHash = await bcrypt.hash(body.password, 10);
    }

    if (updates.length === 0) {
      return { status: 400, jsonBody: { error: 'No fields to update' } };
    }

    updates.push('updatedAt = @updatedAt');
    params.updatedAt = new Date().toISOString();

    await execute(
      `UPDATE Users SET ${updates.join(', ')} WHERE id = @id`,
      params
    );

    const users = await query<UserRecord>(
      'SELECT * FROM Users WHERE id = @id',
      { id }
    );

    return { jsonBody: toUser(users[0]) };
  } catch (error) {
    context.error('Update user error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Register routes
app.http('users-list', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'users',
  handler: getUsers,
});

app.http('users-create', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'users',
  handler: createUser,
});

app.http('users-get', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'users/{id}',
  handler: getUserById,
});

app.http('users-update', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'users/{id}',
  handler: updateUser,
});
