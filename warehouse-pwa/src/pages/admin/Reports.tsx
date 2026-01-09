import { useState, useEffect } from 'react';
import { Card, StatCard, Icon } from '../../components/ui';
import { catalogApi, requestsApi, purchaseOrdersApi, issuedItemsApi, inventoryApi } from '../../services/api';
import { CatalogItem, Request, PurchaseOrder, IssuedItem } from '../../types';

export function Reports() {
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [issuedItems, setIssuedItems] = useState<IssuedItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<CatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'30' | '90' | '365'>('30');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [catalog, reqs, pos, issued, lowStock] = await Promise.all([
        catalogApi.getCatalogItems(),
        requestsApi.getAll(),
        purchaseOrdersApi.getAll(),
        issuedItemsApi.getAll(),
        inventoryApi.getLowStockItems(),
      ]);
      setCatalogItems(catalog);
      setRequests(reqs);
      setPurchaseOrders(pos);
      setIssuedItems(issued);
      setLowStockItems(lowStock);
    } finally {
      setIsLoading(false);
    }
  }

  const now = new Date();
  const daysAgo = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
  };

  const filterByDate = <T extends { createdAt?: string; requestDate?: string; issuedAt?: string }>(
    items: T[],
    days: number
  ): T[] => {
    const cutoff = daysAgo(days);
    return items.filter((item) => {
      const date = new Date(item.createdAt || item.requestDate || item.issuedAt || '');
      return date >= cutoff;
    });
  };

  const recentRequests = filterByDate(requests, parseInt(dateRange));
  const recentPOs = filterByDate(purchaseOrders, parseInt(dateRange));

  // Calculate metrics
  const metrics = {
    totalInventoryValue: catalogItems.reduce((sum, item) => {
      // Simplified value calculation
      return sum + item.quantityOnHand * 50; // Using placeholder avg cost
    }, 0),
    totalRequests: recentRequests.length,
    fulfilledRequests: recentRequests.filter((r) => r.status === 'Fulfilled').length,
    pendingRequests: recentRequests.filter((r) =>
      ['Pending', 'Approved', 'ReadyForPickup'].includes(r.status)
    ).length,
    totalPOValue: recentPOs.reduce((sum, po) => sum + po.totalAmount, 0),
    lowStockCount: lowStockItems.length,
    totalIssuedItems: issuedItems.length,
  };

  // Top requested items
  const itemRequestCounts: Record<string, { name: string; count: number }> = {};
  requests.forEach((req) => {
    req.lines.forEach((line) => {
      if (!itemRequestCounts[line.itemTypeId]) {
        itemRequestCounts[line.itemTypeId] = { name: line.itemTypeName, count: 0 };
      }
      itemRequestCounts[line.itemTypeId].count += line.quantity;
    });
  });

  const topRequestedItems = Object.values(itemRequestCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-action-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-lg text-primary-900">Reports & Analytics</h1>
          <p className="text-primary-600">Warehouse performance and inventory insights</p>
        </div>
        <div className="flex gap-2">
          {(['30', '90', '365'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1 rounded text-sm ${
                dateRange === range
                  ? 'bg-action-primary text-white'
                  : 'bg-primary-100 text-primary-700'
              }`}
            >
              {range === '30' ? '30 Days' : range === '90' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Requests"
          value={metrics.totalRequests}
          subtitle={`Last ${dateRange} days`}
          color="blue"
          icon={<Icon name="assignment" size="lg" />}
        />

        <StatCard
          title="Fulfilled"
          value={metrics.fulfilledRequests}
          subtitle={`${((metrics.fulfilledRequests / metrics.totalRequests) * 100 || 0).toFixed(0)}% of requests`}
          color="green"
          icon={<Icon name="check_circle" size="lg" />}
        />

        <StatCard
          title="Low Stock Items"
          value={metrics.lowStockCount}
          subtitle="Below par level"
          color={metrics.lowStockCount > 5 ? 'orange' : undefined}
          icon={<Icon name="warning" size="lg" />}
        />

        <StatCard
          title="PO Value"
          value={`$${metrics.totalPOValue.toFixed(0)}`}
          subtitle={`Last ${dateRange} days`}
          color="purple"
          icon={<Icon name="payments" size="lg" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Status Breakdown */}
        <Card title="Request Status Breakdown">
          <div className="space-y-4">
            {[
              { label: 'Pending', count: requests.filter((r) => r.status === 'Pending').length, color: 'bg-yellow-500' },
              { label: 'Approved', count: requests.filter((r) => r.status === 'Approved').length, color: 'bg-blue-500' },
              { label: 'Ready for Pickup', count: requests.filter((r) => r.status === 'ReadyForPickup').length, color: 'bg-green-500' },
              { label: 'Fulfilled', count: requests.filter((r) => r.status === 'Fulfilled').length, color: 'bg-primary-500' },
              { label: 'Backordered', count: requests.filter((r) => r.status === 'Backordered').length, color: 'bg-orange-500' },
              { label: 'Cancelled', count: requests.filter((r) => r.status === 'Cancelled').length, color: 'bg-red-500' },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex items-center">
                <div className="w-32 text-sm text-primary-600">{label}</div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-primary-200 rounded-full h-4">
                    <div
                      className={`${color} h-4 rounded-full`}
                      style={{
                        width: `${requests.length > 0 ? (count / requests.length) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="w-12 text-right font-medium">{count}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Requested Items */}
        <Card title="Most Requested Items">
          <div className="space-y-3">
            {topRequestedItems.length === 0 ? (
              <p className="text-primary-500 text-center py-4">No request data available</p>
            ) : (
              topRequestedItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary-100 text-action-hover flex items-center justify-center text-sm font-medium mr-3">
                      {index + 1}
                    </span>
                    <span className="font-medium text-primary-900">{item.name}</span>
                  </div>
                  <span className="badge bg-primary-100 text-primary-800">{item.count} requested</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Low Stock Alert */}
        <Card title="Low Stock Alert" className="bg-red-50">
          {lowStockItems.length === 0 ? (
            <p className="text-green-700 text-center py-4">All items are above par level</p>
          ) : (
            <div className="space-y-2">
              {lowStockItems.slice(0, 5).map((item) => (
                <div
                  key={item.sizeId}
                  className="flex justify-between items-center p-3 bg-white rounded-lg"
                >
                  <div>
                    <p className="font-medium text-primary-900">{item.itemTypeName}</p>
                    <p className="text-sm text-primary-500">
                      {item.variantName} - {item.sizeName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-medium">{item.quantityAvailable} available</p>
                  </div>
                </div>
              ))}
              {lowStockItems.length > 5 && (
                <p className="text-center text-primary-500 text-sm">
                  +{lowStockItems.length - 5} more items below par
                </p>
              )}
            </div>
          )}
        </Card>

        {/* Inventory Summary by Category */}
        <Card title="Inventory by Category">
          <div className="space-y-3">
            {Array.from(new Set(catalogItems.map((i) => i.categoryName))).map((categoryName) => {
              const categoryItems = catalogItems.filter((i) => i.categoryName === categoryName);
              const totalQty = categoryItems.reduce((sum, i) => sum + i.quantityOnHand, 0);
              return (
                <div key={categoryName} className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
                  <div>
                    <p className="font-medium text-primary-900">{categoryName}</p>
                    <p className="text-sm text-primary-500">{categoryItems.length} SKUs</p>
                  </div>
                  <span className="text-lg font-semibold text-primary-900">{totalQty}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card title="System Overview">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <div className="text-heading-lg text-primary-900">{catalogItems.length}</div>
            <div className="text-sm text-primary-500">Total SKUs</div>
          </div>
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <div className="text-heading-lg text-primary-900">
              {catalogItems.reduce((sum, i) => sum + i.quantityOnHand, 0)}
            </div>
            <div className="text-sm text-primary-500">Total Units</div>
          </div>
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <div className="text-heading-lg text-primary-900">{issuedItems.length}</div>
            <div className="text-sm text-primary-500">Items Issued</div>
          </div>
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <div className="text-heading-lg text-primary-900">{purchaseOrders.length}</div>
            <div className="text-sm text-primary-500">Total POs</div>
          </div>
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <div className="text-heading-lg text-primary-900">{requests.length}</div>
            <div className="text-sm text-primary-500">All-time Requests</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
