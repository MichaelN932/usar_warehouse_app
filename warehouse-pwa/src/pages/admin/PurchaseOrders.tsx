import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, StatusBadge, Modal, EmptyState } from '../../components/ui';
import { purchaseOrdersApi, vendorsApi, grantSourcesApi } from '../../services/api';
import { PurchaseOrder, Vendor, GrantSource } from '../../types';

export function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [grantSources, setGrantSources] = useState<GrantSource[]>([]);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'completed'>('all');
  const [filterGrant, setFilterGrant] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [pos, vends, grants] = await Promise.all([
        purchaseOrdersApi.getAll(),
        vendorsApi.getAll(),
        grantSourcesApi.getAll(),
      ]);
      setPurchaseOrders(pos);
      setVendors(vends);
      setGrantSources(grants);
    } finally {
      setIsLoading(false);
    }
  }

  function getGrantColor(code?: string): string {
    if (!code) return 'bg-primary-100 text-primary-600';
    if (code.includes('FEMA')) return 'bg-grant-fema/10 text-grant-fema';
    if (code.includes('State')) return 'bg-grant-state/10 text-grant-state';
    if (code.includes('PRM')) return 'bg-grant-prm/10 text-grant-prm';
    return 'bg-primary-100 text-primary-600';
  }

  const filteredPOs = purchaseOrders.filter((po) => {
    // Status filter
    let matchesStatus = true;
    switch (filter) {
      case 'open':
        matchesStatus = ['Draft', 'Submitted', 'PartialReceived'].includes(po.status);
        break;
      case 'completed':
        matchesStatus = ['Received', 'Cancelled'].includes(po.status);
        break;
    }
    // Grant filter
    const matchesGrant = !filterGrant || po.grantSourceId === filterGrant;
    return matchesStatus && matchesGrant;
  });

  const stats = {
    total: purchaseOrders.length,
    totalValue: purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0),
    open: purchaseOrders.filter((po) =>
      ['Draft', 'Submitted', 'PartialReceived'].includes(po.status)
    ).length,
    openValue: purchaseOrders
      .filter((po) => ['Draft', 'Submitted', 'PartialReceived'].includes(po.status))
      .reduce((sum, po) => sum + po.totalAmount, 0),
  };

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
          <h1 className="text-heading-lg text-primary-900">Purchase Orders</h1>
          <p className="text-primary-600">{purchaseOrders.length} orders total</p>
        </div>
        <button className="btn btn-primary">Create PO</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <div className="text-heading-lg text-primary-900">{stats.total}</div>
          <div className="text-sm text-primary-500">Total Orders</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <div className="text-2xl font-bold text-green-600">
            ${stats.totalValue.toFixed(2)}
          </div>
          <div className="text-sm text-primary-500">Total Value</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
          <div className="text-sm text-primary-500">Open Orders</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <div className="text-2xl font-bold text-orange-600">
            ${stats.openValue.toFixed(2)}
          </div>
          <div className="text-sm text-primary-500">Pending Value</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          {(['all', 'open', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-action-primary text-white'
                  : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-primary-700">Grant:</label>
          <select
            value={filterGrant}
            onChange={(e) => setFilterGrant(e.target.value)}
            className="px-3 py-2 border border-primary-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-action-primary"
          >
            <option value="">All Grants</option>
            {grantSources.map((g) => (
              <option key={g.id} value={g.id}>{g.code}</option>
            ))}
          </select>
        </div>
      </div>

      {/* PO List */}
      {filteredPOs.length === 0 ? (
        <Card>
          <EmptyState
            title="No purchase orders"
            description={filter === 'all' ? 'Create a purchase order to get started' : `No ${filter} orders`}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPOs.map((po) => (
            <Card
              key={po.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedPO(po)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-primary-900">{po.poNumber}</h3>
                    <StatusBadge status={po.status} />
                    {po.grantSource && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getGrantColor(po.grantSource.code)}`}>
                        {po.grantSource.code}
                      </span>
                    )}
                    {po.quoteRequest && (
                      <Link
                        to={`/procurement/quotes/${po.quoteRequestId}`}
                        className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-mono hover:bg-purple-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {po.quoteRequest.requestNumber}
                      </Link>
                    )}
                  </div>
                  <p className="text-sm text-primary-600">{po.vendorName}</p>
                  <p className="text-xs text-primary-500 mt-1">
                    Ordered: {po.orderDate && new Date(po.orderDate).toLocaleDateString()}
                    {po.expectedDeliveryDate && (
                      <> | Expected: {new Date(po.expectedDeliveryDate).toLocaleDateString()}</>
                    )}
                    {po.trackingNumber && (
                      <> | Tracking: {po.trackingNumber}</>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-primary-900">
                    ${po.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-primary-500">{po.lines.length} line items</p>
                </div>
              </div>

              {/* Progress bar for receiving */}
              {['Submitted', 'PartialReceived'].includes(po.status) && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-primary-500 mb-1">
                    <span>Receiving Progress</span>
                    <span>
                      {po.lines.reduce((sum, l) => sum + l.quantityReceived, 0)} /{' '}
                      {po.lines.reduce((sum, l) => sum + l.quantityOrdered, 0)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (po.lines.reduce((sum, l) => sum + l.quantityReceived, 0) /
                            po.lines.reduce((sum, l) => sum + l.quantityOrdered, 0)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* PO Detail Modal */}
      <Modal
        isOpen={!!selectedPO}
        onClose={() => setSelectedPO(null)}
        title={`Purchase Order - ${selectedPO?.poNumber}`}
        size="lg"
      >
        {selectedPO && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-primary-900">{selectedPO.vendorName}</p>
                <p className="text-sm text-primary-500">
                  Created: {new Date(selectedPO.createdAt).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={selectedPO.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 bg-primary-50 p-4 rounded-lg">
              <div>
                <label className="block text-xs text-primary-500">Order Date</label>
                <p className="text-primary-900">
                  {selectedPO.orderDate
                    ? new Date(selectedPO.orderDate).toLocaleDateString()
                    : '-'}
                </p>
              </div>
              <div>
                <label className="block text-xs text-primary-500">Expected Delivery</label>
                <p className="text-primary-900">
                  {selectedPO.expectedDeliveryDate
                    ? new Date(selectedPO.expectedDeliveryDate).toLocaleDateString()
                    : '-'}
                </p>
              </div>
              {selectedPO.grantSource && (
                <div>
                  <label className="block text-xs text-primary-500">Grant Source</label>
                  <p className="text-primary-900">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getGrantColor(selectedPO.grantSource.code)}`}>
                      {selectedPO.grantSource.code}
                    </span>
                    {' '}{selectedPO.grantSource.name}
                  </p>
                </div>
              )}
              {selectedPO.quoteRequest && (
                <div>
                  <label className="block text-xs text-primary-500">Quote Request</label>
                  <p className="text-primary-900">
                    <Link
                      to={`/procurement/quotes/${selectedPO.quoteRequestId}`}
                      className="text-action-primary hover:underline font-mono"
                    >
                      {selectedPO.quoteRequest.requestNumber}
                    </Link>
                  </p>
                </div>
              )}
              {selectedPO.trackingNumber && (
                <div>
                  <label className="block text-xs text-primary-500">Tracking</label>
                  <p className="text-primary-900">
                    {selectedPO.shippingCarrier && <span className="text-primary-500">{selectedPO.shippingCarrier}: </span>}
                    {selectedPO.trackingNumber}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-primary-900 mb-3">Line Items</h4>
              <div className="space-y-2">
                {selectedPO.lines.map((line) => (
                  <div
                    key={line.id}
                    className="flex justify-between items-center p-3 bg-primary-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{line.itemDescription}</p>
                      <p className="text-sm text-primary-500">
                        ${line.unitCost.toFixed(2)} x {line.quantityOrdered}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${line.lineTotal.toFixed(2)}</p>
                      <p className="text-sm text-primary-500">
                        Received: {line.quantityReceived}/{line.quantityOrdered}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-primary-900">Total</span>
              <span className="text-heading-lg text-primary-900">
                ${selectedPO.totalAmount.toFixed(2)}
              </span>
            </div>

            {selectedPO.notes && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-primary-900 mb-2">Notes</h4>
                <p className="text-primary-600 bg-primary-50 p-3 rounded-lg">
                  {selectedPO.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
