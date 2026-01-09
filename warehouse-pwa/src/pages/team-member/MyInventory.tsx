import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, EmptyState, Modal, Icon } from '../../components/ui';
import { issuedItemsApi } from '../../services/api';
import { IssuedItem, RETURN_CONDITIONS, ReturnCondition } from '../../types';

export function MyInventory() {
  const { user } = useAuth();
  const [issuedItems, setIssuedItems] = useState<IssuedItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<IssuedItem | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [returnCondition, setReturnCondition] = useState<ReturnCondition>('Serviceable');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groupBy, setGroupBy] = useState<'category' | 'date'>('category');

  useEffect(() => {
    loadItems();
  }, [user]);

  async function loadItems() {
    if (!user) return;
    setIsLoading(true);
    try {
      const items = await issuedItemsApi.getByUser(user.id);
      setIssuedItems(items);
    } finally {
      setIsLoading(false);
    }
  }

  const groupedItems = issuedItems.reduce((acc, item) => {
    const key = groupBy === 'category' ? item.categoryName :
      new Date(item.issuedAt).toLocaleDateString();
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, IssuedItem[]>);

  const handleReturn = async () => {
    if (!selectedItem || !returnReason) return;

    setIsSubmitting(true);
    try {
      await issuedItemsApi.return(selectedItem.id, returnReason, returnCondition);
      setIssuedItems(issuedItems.filter((i) => i.id !== selectedItem.id));
      setIsReturnModalOpen(false);
      setSelectedItem(null);
      setReturnReason('');
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-heading-lg text-primary-900">My Inventory</h1>
          <p className="text-primary-600">
            {issuedItems.length} items currently issued to you
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setGroupBy('category')}
            className={`px-3 py-1 rounded text-sm ${
              groupBy === 'category'
                ? 'bg-action-primary text-white'
                : 'bg-primary-100 text-primary-700'
            }`}
          >
            By Category
          </button>
          <button
            onClick={() => setGroupBy('date')}
            className={`px-3 py-1 rounded text-sm ${
              groupBy === 'date'
                ? 'bg-action-primary text-white'
                : 'bg-primary-100 text-primary-700'
            }`}
          >
            By Date
          </button>
        </div>
      </div>

      {issuedItems.length === 0 ? (
        <Card>
          <EmptyState
            title="No items issued"
            description="You don't have any gear currently issued to you"
            icon={<Icon name="inventory_2" size="xl" />}
          />
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([group, items]) => (
            <Card key={group} title={group}>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start p-4 bg-primary-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-primary-900">
                        {item.itemTypeName}
                      </h4>
                      <p className="text-sm text-primary-600">
                        {item.variantName} - {item.sizeName}
                      </p>
                      <p className="text-xs text-primary-500 mt-1">
                        Issued: {new Date(item.issuedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="badge bg-primary-100 text-primary-800">
                        Qty: {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setIsReturnModalOpen(true);
                        }}
                        className="block mt-2 text-sm text-action-primary hover:text-action-hover"
                      >
                        Return
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {issuedItems.length > 0 && (
        <Card title="Summary">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-heading-lg text-primary-900">
                {issuedItems.length}
              </div>
              <div className="text-sm text-primary-500">Total Items</div>
            </div>
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-heading-lg text-primary-900">
                {issuedItems.reduce((sum, i) => sum + i.quantity, 0)}
              </div>
              <div className="text-sm text-primary-500">Total Quantity</div>
            </div>
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-heading-lg text-primary-900">
                {Object.keys(
                  issuedItems.reduce((acc, i) => ({ ...acc, [i.categoryName]: true }), {})
                ).length}
              </div>
              <div className="text-sm text-primary-500">Categories</div>
            </div>
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <div className="text-heading-lg text-primary-900">
                {Math.floor(
                  (Date.now() - Math.min(...issuedItems.map((i) => new Date(i.issuedAt).getTime()))) /
                    (1000 * 60 * 60 * 24)
                )}
              </div>
              <div className="text-sm text-primary-500">Days Since First Issue</div>
            </div>
          </div>
        </Card>
      )}

      {/* Return Modal */}
      <Modal
        isOpen={isReturnModalOpen}
        onClose={() => {
          setIsReturnModalOpen(false);
          setSelectedItem(null);
          setReturnReason('');
        }}
        title="Return Item"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setIsReturnModalOpen(false);
                setSelectedItem(null);
                setReturnReason('');
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleReturn}
              disabled={!returnReason || isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Processing...' : 'Submit Return'}
            </button>
          </div>
        }
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="p-4 bg-primary-50 rounded-lg">
              <h4 className="font-medium">{selectedItem.itemTypeName}</h4>
              <p className="text-sm text-primary-600">
                {selectedItem.variantName} - {selectedItem.sizeName}
              </p>
              <p className="text-sm text-primary-500 mt-1">Qty: {selectedItem.quantity}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Condition
              </label>
              <div className="grid grid-cols-3 gap-2">
                {RETURN_CONDITIONS.map((condition) => (
                  <button
                    key={condition}
                    onClick={() => setReturnCondition(condition)}
                    className={`p-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                      returnCondition === condition
                        ? 'border-action-primary bg-primary-50 text-action-hover'
                        : 'border-primary-200 hover:border-primary-300'
                    }`}
                  >
                    {condition === 'NeedsRepair' ? 'Needs Repair' : condition}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Reason for Return
              </label>
              <textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="input"
                rows={3}
                placeholder="Why are you returning this item?"
              />
            </div>

            <p className="text-sm text-primary-500">
              Please bring the item to the Ripley Room for processing.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
