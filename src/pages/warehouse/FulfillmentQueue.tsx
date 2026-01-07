import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, StatusBadge, Modal, EmptyState, Icon } from '../../components/ui';
import { requestsApi, inventoryApi, catalogApi } from '../../services/api';
import { Request, CatalogItem, RequestStatus } from '../../types';

export function FulfillmentQueue() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'ready'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [allRequests, catalog] = await Promise.all([
        requestsApi.getAll(),
        catalogApi.getCatalogItems(),
      ]);
      // Filter to only show actionable requests
      const actionable = allRequests.filter(
        (r) => ['Pending', 'Approved', 'ReadyForPickup', 'Backordered'].includes(r.status)
      );
      setRequests(actionable);
      setCatalogItems(catalog);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredRequests = requests.filter((r) => {
    switch (filter) {
      case 'pending':
        return r.status === 'Pending';
      case 'approved':
        return r.status === 'Approved';
      case 'ready':
        return r.status === 'ReadyForPickup';
      default:
        return true;
    }
  });

  const getStockForSize = (sizeId?: string) => {
    if (!sizeId) return null;
    const item = catalogItems.find((c) => c.sizeId === sizeId);
    return item?.quantityAvailable ?? 0;
  };

  const handleStatusChange = async (requestId: string, newStatus: RequestStatus) => {
    setIsProcessing(true);
    try {
      await requestsApi.updateStatus(requestId, newStatus);
      await loadData();
      setSelectedRequest(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFulfill = async (requestId: string) => {
    setIsProcessing(true);
    try {
      await requestsApi.fulfill(requestId);
      await loadData();
      setSelectedRequest(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const statusCounts = {
    pending: requests.filter((r) => r.status === 'Pending').length,
    approved: requests.filter((r) => r.status === 'Approved').length,
    ready: requests.filter((r) => r.status === 'ReadyForPickup').length,
    backordered: requests.filter((r) => r.status === 'Backordered').length,
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fulfillment Queue</h1>
        <p className="text-gray-600">Process and fulfill gear requests</p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-700">{statusCounts.pending}</div>
          <div className="text-sm text-yellow-600">Pending</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{statusCounts.approved}</div>
          <div className="text-sm text-blue-600">Approved</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{statusCounts.ready}</div>
          <div className="text-sm text-green-600">Ready for Pickup</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-700">{statusCounts.backordered}</div>
          <div className="text-sm text-orange-600">Backordered</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'ready'] as const).map((f) => (
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
            {f !== 'all' && (
              <span className="ml-1 text-xs">
                ({f === 'pending' ? statusCounts.pending :
                  f === 'approved' ? statusCounts.approved :
                  statusCounts.ready})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Request List */}
      {filteredRequests.length === 0 ? (
        <Card>
          <EmptyState
            title="No requests"
            description={`No ${filter === 'all' ? '' : filter} requests to process`}
            icon={<Icon name="assignment" size="xl" />}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card
              key={request.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedRequest(request)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">
                      {request.requestedByName}
                    </h3>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Request #{request.id.split('-')[1]} |{' '}
                    {new Date(request.requestDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {request.lines.length} item{request.lines.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-500">
                    {request.lines.reduce((sum, l) => sum + l.quantity, 0)} total qty
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {request.lines.map((line) => {
                  const stock = getStockForSize(line.requestedSizeId);
                  return (
                    <div
                      key={line.id}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium">{line.itemTypeName}</p>
                        <p className="text-xs text-gray-500">
                          {line.preferredVariantName || 'Any'} | {line.requestedSizeName || 'Any'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Qty: {line.quantity}</p>
                        {stock !== null && (
                          <p className={`text-xs ${stock >= line.quantity ? 'text-green-600' : 'text-red-600'}`}>
                            Stock: {stock}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Process Request Modal */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title={`Process Request - ${selectedRequest?.requestedByName}`}
        size="lg"
        footer={
          selectedRequest && (
            <div className="flex justify-between">
              <button
                onClick={() => setSelectedRequest(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <div className="flex gap-2">
                {selectedRequest.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(selectedRequest.id, 'Cancelled')}
                      disabled={isProcessing}
                      className="btn btn-danger"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedRequest.id, 'Approved')}
                      disabled={isProcessing}
                      className="btn btn-success"
                    >
                      Approve
                    </button>
                  </>
                )}
                {selectedRequest.status === 'Approved' && (
                  <button
                    onClick={() => handleStatusChange(selectedRequest.id, 'ReadyForPickup')}
                    disabled={isProcessing}
                    className="btn btn-primary"
                  >
                    Mark Ready for Pickup
                  </button>
                )}
                {selectedRequest.status === 'ReadyForPickup' && (
                  <button
                    onClick={() => handleFulfill(selectedRequest.id)}
                    disabled={isProcessing}
                    className="btn btn-success"
                  >
                    Complete Pickup
                  </button>
                )}
              </div>
            </div>
          )
        }
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Request #{selectedRequest.id.split('-')[1]}</p>
                <p className="text-sm text-gray-500">
                  Submitted: {new Date(selectedRequest.requestDate).toLocaleString()}
                </p>
              </div>
              <StatusBadge status={selectedRequest.status} />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Items Requested</h4>
              <div className="space-y-3">
                {selectedRequest.lines.map((line) => {
                  const stock = getStockForSize(line.requestedSizeId);
                  const canFulfill = stock !== null && stock >= line.quantity;

                  return (
                    <div
                      key={line.id}
                      className={`p-3 rounded-lg border ${
                        canFulfill ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{line.itemTypeName}</p>
                          <p className="text-sm text-gray-600">
                            {line.preferredVariantName || 'Any variant'} |{' '}
                            {line.requestedSizeName || 'Any size'}
                          </p>
                          {line.replacementReason && (
                            <p className="text-sm text-orange-600 mt-1">
                              Replacement: {line.replacementReason}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Qty: {line.quantity}</p>
                          {stock !== null && (
                            <p className={`text-sm ${canFulfill ? 'text-green-600' : 'text-red-600'}`}>
                              Available: {stock}
                            </p>
                          )}
                          {!canFulfill && (
                            <span className="badge badge-backordered text-xs mt-1">
                              Insufficient
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedRequest.notes && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedRequest.notes}
                </p>
              </div>
            )}

            {selectedRequest.status === 'ReadyForPickup' && (
              <div className="border-t pt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Pickup Instructions</h4>
                  <ol className="text-sm text-blue-800 list-decimal list-inside space-y-1">
                    <li>Verify team member identity</li>
                    <li>Have team member review items</li>
                    <li>Collect signature (optional)</li>
                    <li>Click "Complete Pickup" to finalize</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
