import { useState, useEffect } from 'react';
import { Card, StatusBadge, Modal, EmptyState } from '../../components/ui';
import { purchaseOrdersApi, inventoryApi } from '../../services/api';
import { PurchaseOrder, POLine } from '../../types';

export function ReceiveOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [receivingQuantities, setReceivingQuantities] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open'>('open');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const pos = await purchaseOrdersApi.getAll();
      setPurchaseOrders(pos);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredPOs = purchaseOrders.filter((po) => {
    if (filter === 'open') {
      return ['Submitted', 'PartialReceived'].includes(po.status);
    }
    return true;
  });

  const openReceiveModal = (po: PurchaseOrder) => {
    setSelectedPO(po);
    const quantities: Record<string, number> = {};
    po.lines.forEach((line) => {
      quantities[line.id] = 0;
    });
    setReceivingQuantities(quantities);
  };

  const handleReceive = async () => {
    if (!selectedPO) return;

    setIsSubmitting(true);
    try {
      // Update inventory for each line
      for (const line of selectedPO.lines) {
        const qtyReceiving = receivingQuantities[line.id] || 0;
        if (qtyReceiving > 0) {
          await inventoryApi.adjust(
            line.sizeId,
            'Found', // Using 'Found' as a receiving adjustment type
            qtyReceiving,
            `Received from PO ${selectedPO.poNumber}`
          );
        }
      }

      // Determine new status
      const totalOrdered = selectedPO.lines.reduce((sum, l) => sum + l.quantityOrdered, 0);
      const totalReceived = selectedPO.lines.reduce(
        (sum, l) => sum + l.quantityReceived + (receivingQuantities[l.id] || 0),
        0
      );

      let newStatus: PurchaseOrder['status'] = selectedPO.status;
      if (totalReceived >= totalOrdered) {
        newStatus = 'Received';
      } else if (totalReceived > 0) {
        newStatus = 'PartialReceived';
      }

      await purchaseOrdersApi.updateStatus(selectedPO.id, newStatus);
      await loadData();
      setSelectedPO(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLineStatus = (line: POLine) => {
    if (line.quantityReceived >= line.quantityOrdered) return 'complete';
    if (line.quantityReceived > 0) return 'partial';
    return 'pending';
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
      <div>
        <h1 className="text-heading-lg text-primary-900">Orders</h1>
        <p className="text-primary-600">Record incoming inventory from purchase orders</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">
            {purchaseOrders.filter((po) => po.status === 'Submitted').length}
          </div>
          <div className="text-sm text-blue-600">Awaiting Delivery</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-700">
            {purchaseOrders.filter((po) => po.status === 'PartialReceived').length}
          </div>
          <div className="text-sm text-yellow-600">Partial Received</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">
            {purchaseOrders.filter((po) => po.status === 'Received').length}
          </div>
          <div className="text-sm text-green-600">Completed</div>
        </div>
        <div className="bg-primary-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary-700">
            ${purchaseOrders
              .filter((po) => ['Submitted', 'PartialReceived'].includes(po.status))
              .reduce((sum, po) => sum + po.totalAmount, 0)
              .toFixed(2)}
          </div>
          <div className="text-sm text-primary-600">Pending Value</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('open')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'open'
              ? 'bg-action-primary text-white'
              : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
          }`}
        >
          Open Orders
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-action-primary text-white'
              : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
          }`}
        >
          All Orders
        </button>
      </div>

      {/* PO List */}
      {filteredPOs.length === 0 ? (
        <Card>
          <EmptyState
            title="No purchase orders"
            description={filter === 'open' ? 'No open orders to receive' : 'No purchase orders found'}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPOs.map((po) => (
            <Card key={po.id}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-primary-900">{po.poNumber}</h3>
                    <StatusBadge status={po.status} />
                  </div>
                  <p className="text-sm text-primary-600">{po.vendorName}</p>
                  <p className="text-xs text-primary-500 mt-1">
                    Ordered: {po.orderDate && new Date(po.orderDate).toLocaleDateString()}
                    {po.expectedDeliveryDate && (
                      <> | Expected: {new Date(po.expectedDeliveryDate).toLocaleDateString()}</>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-900">${po.totalAmount.toFixed(2)}</p>
                  {['Submitted', 'PartialReceived'].includes(po.status) && (
                    <button
                      onClick={() => openReceiveModal(po)}
                      className="btn btn-primary text-sm mt-2"
                    >
                      Receive Items
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {po.lines.map((line) => {
                  const status = getLineStatus(line);
                  return (
                    <div
                      key={line.id}
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        status === 'complete'
                          ? 'bg-green-50'
                          : status === 'partial'
                          ? 'bg-yellow-50'
                          : 'bg-primary-50'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium">{line.itemDescription}</p>
                        <p className="text-xs text-primary-500">
                          ${line.unitCost.toFixed(2)} each
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          <span className={status === 'complete' ? 'text-green-600' : ''}>
                            {line.quantityReceived}
                          </span>
                          <span className="text-primary-400"> / {line.quantityOrdered}</span>
                        </p>
                        <p className="text-xs text-primary-500">${line.lineTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Receive Modal */}
      <Modal
        isOpen={!!selectedPO}
        onClose={() => setSelectedPO(null)}
        title={`Receive - ${selectedPO?.poNumber}`}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setSelectedPO(null)} className="btn btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleReceive}
              disabled={isSubmitting || Object.values(receivingQuantities).every((q) => q === 0)}
              className="btn btn-success"
            >
              {isSubmitting ? 'Processing...' : 'Record Receipt'}
            </button>
          </div>
        }
      >
        {selectedPO && (
          <div className="space-y-4">
            <div className="bg-primary-50 p-4 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{selectedPO.vendorName}</p>
                  <p className="text-sm text-primary-500">
                    Expected: {selectedPO.expectedDeliveryDate &&
                      new Date(selectedPO.expectedDeliveryDate).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={selectedPO.status} />
              </div>
            </div>

            <div className="space-y-3">
              {selectedPO.lines.map((line) => {
                const remaining = line.quantityOrdered - line.quantityReceived;
                return (
                  <div key={line.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium">{line.itemDescription}</p>
                        <p className="text-sm text-primary-500">
                          Ordered: {line.quantityOrdered} | Received: {line.quantityReceived} |{' '}
                          <span className="text-orange-600">Remaining: {remaining}</span>
                        </p>
                      </div>
                    </div>

                    {remaining > 0 ? (
                      <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-primary-700">
                          Receiving:
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setReceivingQuantities({
                                ...receivingQuantities,
                                [line.id]: Math.max(0, (receivingQuantities[line.id] || 0) - 1),
                              })
                            }
                            className="btn btn-secondary px-3 py-1"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            max={remaining}
                            value={receivingQuantities[line.id] || 0}
                            onChange={(e) =>
                              setReceivingQuantities({
                                ...receivingQuantities,
                                [line.id]: Math.min(
                                  remaining,
                                  Math.max(0, parseInt(e.target.value) || 0)
                                ),
                              })
                            }
                            className="input w-20 text-center"
                          />
                          <button
                            onClick={() =>
                              setReceivingQuantities({
                                ...receivingQuantities,
                                [line.id]: Math.min(
                                  remaining,
                                  (receivingQuantities[line.id] || 0) + 1
                                ),
                              })
                            }
                            className="btn btn-secondary px-3 py-1"
                          >
                            +
                          </button>
                          <button
                            onClick={() =>
                              setReceivingQuantities({
                                ...receivingQuantities,
                                [line.id]: remaining,
                              })
                            }
                            className="btn btn-secondary text-sm"
                          >
                            All ({remaining})
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-green-600 font-medium text-sm">
                        Fully received
                      </p>
                    )}
                  </div>
                );
              })}
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
