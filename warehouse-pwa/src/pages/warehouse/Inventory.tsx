import { useState, useEffect } from 'react';
import { Card, Modal, EmptyState, SearchInput } from '../../components/ui';
import { catalogApi, inventoryApi } from '../../services/api';
import { CatalogItem, Category, AdjustmentType } from '../../types';

export function Inventory() {
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>('Count');
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [catalog, cats] = await Promise.all([
        catalogApi.getCatalogItems(),
        catalogApi.getCategories(),
      ]);
      setCatalogItems(catalog);
      setCategories(cats);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredItems = catalogItems.filter((item) => {
    if (selectedCategory && item.categoryId !== selectedCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        item.itemTypeName.toLowerCase().includes(query) ||
        item.variantName.toLowerCase().includes(query) ||
        item.manufacturer.toLowerCase().includes(query) ||
        item.femaCode.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    if (showLowStock && item.quantityAvailable >= 10) return false; // Simplified low stock check
    return true;
  });

  // Group by item type for display
  const groupedItems = filteredItems.reduce((acc, item) => {
    const key = `${item.itemTypeId}-${item.variantId}`;
    if (!acc[key]) {
      acc[key] = {
        itemTypeName: item.itemTypeName,
        variantName: item.variantName,
        manufacturer: item.manufacturer,
        categoryName: item.categoryName,
        femaCode: item.femaCode,
        sizes: [],
      };
    }
    acc[key].sizes.push(item);
    return acc;
  }, {} as Record<string, { itemTypeName: string; variantName: string; manufacturer: string; categoryName: string; femaCode: string; sizes: CatalogItem[] }>);

  const handleAdjust = async () => {
    if (!selectedItem) return;

    setIsSubmitting(true);
    try {
      let quantityChange = adjustmentQuantity;
      if (adjustmentType === 'Count') {
        // For count, we set the absolute value
        const currentQty = selectedItem.quantityOnHand;
        quantityChange = adjustmentQuantity - currentQty;
      } else if (['Damage', 'Loss'].includes(adjustmentType)) {
        quantityChange = -Math.abs(adjustmentQuantity);
      }

      await inventoryApi.adjust(
        selectedItem.sizeId,
        adjustmentType,
        quantityChange,
        adjustmentReason
      );

      await loadData();
      closeAdjustModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAdjustModal = (item: CatalogItem) => {
    setSelectedItem(item);
    setAdjustmentQuantity(item.quantityOnHand);
    setAdjustmentType('Count');
    setAdjustmentReason('');
    setIsAdjustModalOpen(true);
  };

  const closeAdjustModal = () => {
    setIsAdjustModalOpen(false);
    setSelectedItem(null);
    setAdjustmentQuantity(0);
    setAdjustmentReason('');
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
          <h1 className="text-heading-lg text-primary-900">Inventory Management</h1>
          <p className="text-primary-600">
            {catalogItems.length} SKUs across {categories.length} categories
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search items, variants, manufacturers..."
            className="flex-1"
          />
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input w-auto"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowLowStock(!showLowStock)}
              className={`btn ${showLowStock ? 'btn-danger' : 'btn-secondary'}`}
            >
              {showLowStock ? 'Showing Low Stock' : 'Low Stock'}
            </button>
          </div>
        </div>
      </Card>

      {/* Inventory Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <div className="text-heading-lg text-primary-900">{catalogItems.length}</div>
          <div className="text-sm text-primary-500">Total SKUs</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <div className="text-2xl font-bold text-green-600">
            {catalogItems.reduce((sum, i) => sum + i.quantityOnHand, 0)}
          </div>
          <div className="text-sm text-primary-500">Total Units</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <div className="text-2xl font-bold text-blue-600">
            {catalogItems.reduce((sum, i) => sum + i.quantityReserved, 0)}
          </div>
          <div className="text-sm text-primary-500">Reserved</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <div className="text-2xl font-bold text-red-600">
            {catalogItems.filter((i) => i.quantityAvailable < 10).length}
          </div>
          <div className="text-sm text-primary-500">Low Stock Items</div>
        </div>
      </div>

      {/* Inventory List */}
      {Object.keys(groupedItems).length === 0 ? (
        <Card>
          <EmptyState
            title="No items found"
            description="Try adjusting your search or filters"
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([key, group]) => (
            <Card key={key}>
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-primary-900">{group.itemTypeName}</h3>
                    <p className="text-sm text-primary-600">
                      {group.variantName} | {group.manufacturer}
                    </p>
                    <p className="text-xs text-primary-500">{group.categoryName} | {group.femaCode}</p>
                  </div>
                  <span className="badge bg-primary-100 text-primary-800">
                    {group.sizes.length} size{group.sizes.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-primary-200">
                  <thead className="bg-primary-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-primary-500 uppercase">
                        Size
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-primary-500 uppercase">
                        On Hand
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-primary-500 uppercase">
                        Reserved
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-primary-500 uppercase">
                        Available
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-primary-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-primary-200">
                    {group.sizes.map((item) => (
                      <tr
                        key={item.sizeId}
                        className={item.quantityAvailable < 5 ? 'bg-red-50' : ''}
                      >
                        <td className="px-4 py-2 text-sm font-medium text-primary-900">
                          {item.sizeName}
                        </td>
                        <td className="px-4 py-2 text-sm text-right text-primary-900">
                          {item.quantityOnHand}
                        </td>
                        <td className="px-4 py-2 text-sm text-right text-blue-600">
                          {item.quantityReserved}
                        </td>
                        <td className={`px-4 py-2 text-sm text-right font-medium ${
                          item.quantityAvailable < 5 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {item.quantityAvailable}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => openAdjustModal(item)}
                            className="text-action-primary hover:text-action-hover text-sm font-medium"
                          >
                            Adjust
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Adjust Modal */}
      <Modal
        isOpen={isAdjustModalOpen}
        onClose={closeAdjustModal}
        title="Adjust Inventory"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={closeAdjustModal} className="btn btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleAdjust}
              disabled={isSubmitting || !adjustmentReason}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Saving...' : 'Save Adjustment'}
            </button>
          </div>
        }
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="bg-primary-50 p-4 rounded-lg">
              <p className="font-medium">{selectedItem.itemTypeName}</p>
              <p className="text-sm text-primary-600">
                {selectedItem.variantName} - {selectedItem.sizeName}
              </p>
              <p className="text-sm text-primary-500 mt-2">
                Current: {selectedItem.quantityOnHand} on hand,{' '}
                {selectedItem.quantityReserved} reserved
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Adjustment Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Count', 'Damage', 'Loss', 'Found', 'Transfer'] as AdjustmentType[]).map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => setAdjustmentType(type)}
                      className={`p-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                        adjustmentType === type
                          ? 'border-action-primary bg-primary-50 text-action-hover'
                          : 'border-primary-200 hover:border-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                {adjustmentType === 'Count' ? 'New Quantity' : 'Quantity to Adjust'}
              </label>
              <input
                type="number"
                min="0"
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value) || 0)}
                className="input"
              />
              {adjustmentType === 'Count' && (
                <p className="text-sm text-primary-500 mt-1">
                  Change: {adjustmentQuantity - selectedItem.quantityOnHand > 0 ? '+' : ''}
                  {adjustmentQuantity - selectedItem.quantityOnHand}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Reason (Required)
              </label>
              <textarea
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                className="input"
                rows={2}
                placeholder="Why are you making this adjustment?"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
