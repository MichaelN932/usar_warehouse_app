import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../services/database.js';
import { User, UserRecord, LoginRequest, AuthResponse } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// Helper to extract user from token
export async function getUserFromToken(
  authHeader: string | null
): Promise<User | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const users = await query<UserRecord>(
      'SELECT * FROM Users WHERE id = @userId AND isActive = 1',
      { userId: decoded.userId }
    );

    if (users.length === 0) return null;

    const user = users[0];
    // Remove password hash before returning
    const { passwordHash, ...safeUser } = user;
    return {
      ...safeUser,
      sizes: JSON.parse((safeUser.sizes as unknown as string) || '{}'),
    };
  } catch {
    return null;
  }
}

// POST /api/auth/login
async function login(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const body = (await request.json()) as LoginRequest;
    const { email, password } = body;

    if (!email || !password) {
      return {
        status: 400,
        jsonBody: { error: 'Email and password are required' },
      };
    }

    const users = await query<UserRecord>(
      'SELECT * FROM Users WHERE email = @email AND isActive = 1',
      { email: email.toLowerCase() }
    );

    if (users.length === 0) {
      return {
        status: 401,
        jsonBody: { error: 'Invalid email or password' },
      };
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return {
        status: 401,
        jsonBody: { error: 'Invalid email or password' },
      };
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '24h',
    });

    const { passwordHash, ...safeUser } = user;
    const response: AuthResponse = {
      user: {
        ...safeUser,
        sizes: JSON.parse((safeUser.sizes as unknown as string) || '{}'),
      },
      token,
    };

    return { jsonBody: response };
  } catch (error) {
    context.error('Login error:', error);
    return {
      status: 500,
      jsonBody: { error: 'Internal server error' },
    };
  }
}

// GET /api/auth/me
async function getCurrentUser(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));

    if (!user) {
      return {
        status: 401,
        jsonBody: { error: 'Unauthorized' },
      };
    }

    return { jsonBody: user };
  } catch (error) {
    context.error('Get current user error:', error);
    return {
      status: 500,
      jsonBody: { error: 'Internal server error' },
    };
  }
}

// POST /api/auth/logout
async function logout(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  // Stateless JWT - client just discards token
  return { jsonBody: { success: true } };
}

// Register routes
app.http('auth-login', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/login',
  handler: login,
});

app.http('auth-me', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'auth/me',
  handler: getCurrentUser,
});

app.http('auth-logout', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'auth/logout',
  handler: logout,
});
