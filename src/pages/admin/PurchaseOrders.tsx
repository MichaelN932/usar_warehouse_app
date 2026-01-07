import { useState, useEffect } from 'react';
import { Card, StatusBadge, Modal, EmptyState } from '../../components/ui';
import { purchaseOrdersApi, vendorsApi } from '../../services/api';
import { PurchaseOrder, Vendor } from '../../types';

export function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [filter, setFilter] = useState<'all' | 'open' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [pos, vends] = await Promise.all([
        purchaseOrdersApi.getAll(),
        vendorsApi.getAll(),
      ]);
      setPurchaseOrders(pos);
      setVendors(vends);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredPOs = purchaseOrders.filter((po) => {
    switch (filter) {
      case 'open':
        return ['Draft', 'Submitted', 'PartialReceived'].includes(po.status);
      case 'completed':
        return ['Received', 'Cancelled'].includes(po.status);
      default:
        return true;
    }
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fire-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-gray-600">{purchaseOrders.length} orders total</p>
        </div>
        <button className="btn btn-primary">Create PO</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Total Orders</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <div className="text-2xl font-bold text-green-600">
            ${stats.totalValue.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">Total Value</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
          <div className="text-sm text-gray-500">Open Orders</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <div className="text-2xl font-bold text-orange-600">
            ${stats.openValue.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">Pending Value</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'open', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-fire-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
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
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">{po.poNumber}</h3>
                    <StatusBadge status={po.status} />
                  </div>
                  <p className="text-sm text-gray-600">{po.vendorName}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Ordered: {po.orderDate && new Date(po.orderDate).toLocaleDateString()}
                    {po.expectedDeliveryDate && (
                      <> | Expected: {new Date(po.expectedDeliveryDate).toLocaleDateString()}</>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-semibold text-gray-900">
                    ${po.totalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">{po.lines.length} line items</p>
                </div>
              </div>

              {/* Progress bar for receiving */}
              {['Submitted', 'PartialReceived'].includes(po.status) && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
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
                <p className="font-medium text-gray-900">{selectedPO.vendorName}</p>
                <p className="text-sm text-gray-500">
                  Created: {new Date(selectedPO.createdAt).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={selectedPO.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-xs text-gray-500">Order Date</label>
                <p className="text-gray-900">
                  {selectedPO.orderDate
                    ? new Date(selectedPO.orderDate).toLocaleDateString()
                    : '-'}
                </p>
              </div>
              <div>
                <label className="block text-xs text-gray-500">Expected Delivery</label>
                <p className="text-gray-900">
                  {selectedPO.expectedDeliveryDate
                    ? new Date(selectedPO.expectedDeliveryDate).toLocaleDateString()
                    : '-'}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Line Items</h4>
              <div className="space-y-2">
                {selectedPO.lines.map((line) => (
                  <div
                    key={line.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{line.itemDescription}</p>
                      <p className="text-sm text-gray-500">
                        ${line.unitCost.toFixed(2)} x {line.quantityOrdered}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${line.lineTotal.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">
                        Received: {line.quantityReceived}/{line.quantityOrdered}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                ${selectedPO.totalAmount.toFixed(2)}
              </span>
            </div>

            {selectedPO.notes && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
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
