import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { query } from '../services/database.js';
import { Category, ItemType, Variant, Size, CatalogItem } from '../types/index.js';
import { getUserFromToken } from './auth.js';

// GET /api/categories
async function getCategories(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const categories = await query<Category>(
      'SELECT * FROM Categories WHERE isActive = 1 ORDER BY sortOrder'
    );
    return { jsonBody: categories };
  } catch (error) {
    context.error('Get categories error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/itemTypes
async function getItemTypes(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const categoryId = request.query.get('categoryId');
    let sql = 'SELECT * FROM ItemTypes WHERE isActive = 1';
    const params: Record<string, unknown> = {};

    if (categoryId) {
      sql += ' AND categoryId = @categoryId';
      params.categoryId = categoryId;
    }

    sql += ' ORDER BY name';

    const itemTypes = await query<ItemType>(sql, params);
    return { jsonBody: itemTypes };
  } catch (error) {
    context.error('Get item types error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/variants
async function getVariants(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const itemTypeId = request.query.get('itemTypeId');
    let sql = 'SELECT * FROM Variants WHERE isActive = 1';
    const params: Record<string, unknown> = {};

    if (itemTypeId) {
      sql += ' AND itemTypeId = @itemTypeId';
      params.itemTypeId = itemTypeId;
    }

    sql += ' ORDER BY name';

    const variants = await query<Variant>(sql, params);
    return { jsonBody: variants };
  } catch (error) {
    context.error('Get variants error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/sizes
async function getSizes(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const variantId = request.query.get('variantId');
    let sql = 'SELECT * FROM Sizes WHERE isActive = 1';
    const params: Record<string, unknown> = {};

    if (variantId) {
      sql += ' AND variantId = @variantId';
      params.variantId = variantId;
    }

    sql += ' ORDER BY sortOrder';

    const sizes = await query<Size>(sql, params);
    return { jsonBody: sizes };
  } catch (error) {
    context.error('Get sizes error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// GET /api/catalog - Denormalized catalog view
async function getCatalog(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const user = await getUserFromToken(request.headers.get('authorization'));
    if (!user) {
      return { status: 401, jsonBody: { error: 'Unauthorized' } };
    }

    const catalog = await query<CatalogItem>(`
      SELECT
        c.id AS categoryId,
        c.name AS categoryName,
        it.id AS itemTypeId,
        it.name AS itemTypeName,
        it.femaCode,
        it.isConsumable,
        v.id AS variantId,
        v.name AS variantName,
        v.manufacturer,
        s.id AS sizeId,
        s.name AS sizeName,
        COALESCE(i.quantityOnHand, 0) AS quantityOnHand,
        COALESCE(i.quantityReserved, 0) AS quantityReserved,
        COALESCE(i.quantityOnHand, 0) - COALESCE(i.quantityReserved, 0) AS quantityAvailable
      FROM Categories c
      JOIN ItemTypes it ON it.categoryId = c.id
      JOIN Variants v ON v.itemTypeId = it.id
      JOIN Sizes s ON s.variantId = v.id
      LEFT JOIN Inventory i ON i.sizeId = s.id
      WHERE c.isActive = 1
        AND it.isActive = 1
        AND v.isActive = 1
        AND s.isActive = 1
      ORDER BY c.sortOrder, it.name, v.name, s.sortOrder
    `);

    return { jsonBody: catalog };
  } catch (error) {
    context.error('Get catalog error:', error);
    return { status: 500, jsonBody: { error: 'Internal server error' } };
  }
}

// Register routes
app.http('catalog-categories', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'categories',
  handler: getCategories,
});

app.http('catalog-itemTypes', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'itemTypes',
  handler: getItemTypes,
});

app.http('catalog-variants', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'variants',
  handler: getVariants,
});

app.http('catalog-sizes', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'sizes',
  handler: getSizes,
});

app.http('catalog-list', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'catalog',
  handler: getCatalog,
});
