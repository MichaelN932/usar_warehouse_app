import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, StatusBadge, EmptyState, Modal } from '../../components/ui';
import { requestsApi } from '../../services/api';
import { Request } from '../../types';

export function MyRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, [user]);

  async function loadRequests() {
    if (!user) return;
    setIsLoading(true);
    try {
      const userRequests = await requestsApi.getByUser(user.id);
      setRequests(userRequests);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredRequests = requests.filter((r) => {
    if (filter === 'active') {
      return !['Fulfilled', 'Cancelled'].includes(r.status);
    }
    if (filter === 'completed') {
      return ['Fulfilled', 'Cancelled'].includes(r.status);
    }
    return true;
  });

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
          <h1 className="text-heading-lg text-primary-900">My Requests</h1>
          <p className="text-primary-600">Track and manage your gear requests</p>
        </div>
        <Link to="/request" className="btn btn-primary">
          New Request
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'active', 'completed'] as const).map((f) => (
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

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <Card>
          <EmptyState
            title="No requests found"
            description={
              filter === 'all'
                ? "You haven't made any requests yet"
                : `No ${filter} requests`
            }
            action={
              <Link to="/request" className="btn btn-primary">
                Create Request
              </Link>
            }
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
                    <h3 className="font-semibold text-primary-900">
                      Request #{request.id.split('-')[1]}
                    </h3>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="text-sm text-primary-500 mt-1">
                    Submitted {new Date(request.requestDate).toLocaleDateString()} at{' '}
                    {new Date(request.requestDate).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-primary-900">
                    {request.lines.length} item{request.lines.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {request.lines.slice(0, 3).map((line) => (
                  <div
                    key={line.id}
                    className="flex justify-between items-center p-2 bg-primary-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">{line.itemTypeName}</p>
                      <p className="text-xs text-primary-500">
                        {line.preferredVariantName && `${line.preferredVariantName} | `}
                        {line.requestedSizeName || 'Any size'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Qty: {line.quantity}</p>
                      {line.isBackordered && (
                        <span className="badge badge-backordered text-xs">Backordered</span>
                      )}
                    </div>
                  </div>
                ))}
                {request.lines.length > 3 && (
                  <p className="text-sm text-primary-500 text-center">
                    +{request.lines.length - 3} more items
                  </p>
                )}
              </div>

              {request.status === 'ReadyForPickup' && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium text-sm">
                    Ready for pickup at the Ripley Room
                  </p>
                </div>
              )}

              {request.notes && (
                <div className="mt-4 text-sm text-primary-600">
                  <span className="font-medium">Notes:</span> {request.notes}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Request Detail Modal */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title={`Request #${selectedRequest?.id.split('-')[1]}`}
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <StatusBadge status={selectedRequest.status} />
              <span className="text-sm text-primary-500">
                {new Date(selectedRequest.requestDate).toLocaleString()}
              </span>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-primary-900 mb-3">Items</h4>
              <div className="space-y-3">
                {selectedRequest.lines.map((line) => (
                  <div
                    key={line.id}
                    className="flex justify-between items-start p-3 bg-primary-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{line.itemTypeName}</p>
                      <p className="text-sm text-primary-500">
                        {line.preferredVariantName || 'Any variant'} |{' '}
                        {line.requestedSizeName || 'Any size'}
                      </p>
                      {line.replacementReason && (
                        <p className="text-sm text-orange-600 mt-1">
                          Reason: {line.replacementReason}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Qty: {line.quantity}</p>
                      {line.issuedQuantity > 0 && (
                        <p className="text-sm text-green-600">
                          Issued: {line.issuedQuantity}
                        </p>
                      )}
                      {line.isBackordered && (
                        <span className="badge badge-backordered text-xs mt-1">
                          Backordered
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedRequest.notes && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-primary-900 mb-2">Notes</h4>
                <p className="text-primary-600">{selectedRequest.notes}</p>
              </div>
            )}

            {selectedRequest.status === 'Fulfilled' && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-primary-900 mb-2">Fulfillment Details</h4>
                <p className="text-sm text-primary-600">
                  Fulfilled on {new Date(selectedRequest.fulfilledAt!).toLocaleString()}
                </p>
                {selectedRequest.pickupSignedAt && (
                  <p className="text-sm text-primary-600">
                    Signed for on{' '}
                    {new Date(selectedRequest.pickupSignedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {selectedRequest.status === 'ReadyForPickup' && (
              <div className="border-t pt-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-green-800 font-semibold">
                    Your items are ready for pickup
                  </p>
                  <p className="text-green-700 text-sm mt-1">
                    Please visit the Ripley Room during business hours
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
