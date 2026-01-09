import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { query, execute } from '../services/database.js';
import { Notification } from '../types/index.js';
import { getUserFromToken } from './auth.js';

// GET /api/notifications
async function getNotifications(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const unreadOnly = request.query.get('unreadOnly') === 'true';
    let sql = 'SELECT * FROM Notifications WHERE userId = @userId';

    if (unreadOnly) {
      sql += ' AND isRead = 0';
    }

    sql += ' ORDER BY createdAt DESC';

    const notifications = await query<Notification>(sql, { userId: user.id });
    return { jsonBody: notifications };
  } catch (error) {
    context.error('Get notifications error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/notifications/count
async function getUnreadCount(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const result = await query<{ count: number }>(
      'SELECT COUNT(*) AS count FROM Notifications WHERE userId = @userId AND isRead = 0',
      { userId: user.id }
    );

    return { jsonBody: { count: result[0]?.count || 0 } };
  } catch (error) {
    context.error('Get unread count error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// PUT /api/notifications/:id/read
async function markAsRead(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const id = request.params.id;
    const now = new Date().toISOString();

    await execute(
      'UPDATE Notifications SET isRead = 1, readAt = @readAt WHERE id = @id AND userId = @userId',
      { id, userId: user.id, readAt: now }
    );

    const notifications = await query<Notification>(
      'SELECT * FROM Notifications WHERE id = @id',
      { id }
    );

    if (notifications.length === 0) {
      return { status: 404, jsonBody: { error: 'Notification not found' } };
    }

    return { jsonBody: notifications[0] };
  } catch (error) {
    context.error('Mark as read error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// PUT /api/notifications/read-all
async function markAllAsRead(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const now = new Date().toISOString();

    await execute(
      'UPDATE Notifications SET isRead = 1, readAt = @readAt WHERE userId = @userId AND isRead = 0',
      { userId: user.id, readAt: now }
    );

    return { jsonBody: { success: true } };
  } catch (error) {
    context.error('Mark all as read error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Register routes
app.http('notifications-list', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'notifications',
  handler: getNotifications,
});

app.http('notifications-count', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'notifications/count',
  handler: getUnreadCount,
});

app.http('notifications-read', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'notifications/{id}/read',
  handler: markAsRead,
});

app.http('notifications-read-all', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'notifications/read-all',
  handler: markAllAsRead,
});
