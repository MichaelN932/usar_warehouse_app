import { useState, useEffect } from 'react';
import { Card, Modal, EmptyState } from '../../components/ui';
import { catalogApi } from '../../services/api';
import { Category, ItemType, Variant } from '../../types';

export function Catalog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<ItemType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'categories' | 'items' | 'variants'>('items');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [cats, items, vars] = await Promise.all([
        catalogApi.getCategories(),
        catalogApi.getItemTypes(),
        catalogApi.getVariants(),
      ]);
      setCategories(cats);
      setItemTypes(items);
      setVariants(vars);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredItemTypes = itemTypes.filter((it) => {
    if (selectedCategory && it.categoryId !== selectedCategory.id) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        it.name.toLowerCase().includes(query) ||
        it.femaCode.toLowerCase().includes(query) ||
        it.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getVariantsForItemType = (itemTypeId: string) => {
    return variants.filter((v) => v.itemTypeId === itemTypeId);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown';
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
          <h1 className="text-2xl font-bold text-gray-900">Item Catalog</h1>
          <p className="text-gray-600">
            {categories.length} categories | {itemTypes.length} item types |{' '}
            {variants.length} variants
          </p>
        </div>
        <button className="btn btn-primary">Add Item Type</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
          <div className="text-sm text-gray-500">Categories</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{itemTypes.length}</div>
          <div className="text-sm text-gray-500">Item Types</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <div className="text-2xl font-bold text-green-600">{variants.length}</div>
          <div className="text-sm text-gray-500">Variants</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow text-center">
          <div className="text-2xl font-bold text-purple-600">
            {itemTypes.filter((it) => it.isConsumable).length}
          </div>
          <div className="text-sm text-gray-500">Consumables</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {(['items', 'categories', 'variants'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-fire-500 text-fire-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Item Types Tab */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          <Card>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search item types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input"
                />
              </div>
              <select
                value={selectedCategory?.id || ''}
                onChange={(e) => {
                  const cat = categories.find((c) => c.id === e.target.value);
                  setSelectedCategory(cat || null);
                }}
                className="input w-auto"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {filteredItemTypes.length === 0 ? (
            <Card>
              <EmptyState title="No items found" description="Try adjusting your search" />
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredItemTypes.map((itemType) => {
                const itemVariants = getVariantsForItemType(itemType.id);
                return (
                  <Card
                    key={itemType.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedItemType(itemType)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{itemType.name}</h3>
                          {itemType.isConsumable && (
                            <span className="badge bg-blue-100 text-blue-800">Consumable</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {getCategoryName(itemType.categoryId)} | {itemType.femaCode}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">{itemType.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {itemVariants.length} variant{itemVariants.length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          FEMA Req: {itemType.femaRequiredQty} | Par: {itemType.parLevel}
                        </p>
                      </div>
                    </div>

                    {itemVariants.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {itemVariants.slice(0, 5).map((variant) => (
                          <span
                            key={variant.id}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {variant.name}
                          </span>
                        ))}
                        {itemVariants.length > 5 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                            +{itemVariants.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const categoryItems = itemTypes.filter((it) => it.categoryId === category.id);
            return (
              <Card key={category.id}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  <span className="badge bg-gray-100 text-gray-800">
                    {categoryItems.length} items
                  </span>
                </div>
                <p className="text-sm text-gray-600">{category.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Sort Order: {category.sortOrder}</span>
                  <button className="text-fire-600 hover:text-fire-700 text-sm font-medium">
                    Edit
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Variants Tab */}
      {activeTab === 'variants' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Variant Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Manufacturer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Item Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Unit Cost
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {variants.map((variant) => {
                  const itemType = itemTypes.find((it) => it.id === variant.itemTypeId);
                  return (
                    <tr key={variant.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{variant.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{variant.manufacturer}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {itemType?.name || 'Unknown'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{variant.sku || '-'}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {variant.unitCost ? `$${variant.unitCost.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-fire-600 hover:text-fire-700 text-sm font-medium">
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Item Type Detail Modal */}
      <Modal
        isOpen={!!selectedItemType}
        onClose={() => setSelectedItemType(null)}
        title={selectedItemType?.name || ''}
        size="lg"
      >
        {selectedItemType && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Category</label>
                <p className="text-gray-900">{getCategoryName(selectedItemType.categoryId)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">FEMA Code</label>
                <p className="text-gray-900">{selectedItemType.femaCode}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">FEMA Required Qty</label>
                <p className="text-gray-900">{selectedItemType.femaRequiredQty}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Par Level</label>
                <p className="text-gray-900">{selectedItemType.parLevel}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-900">{selectedItemType.description}</p>
            </div>

            <div className="flex gap-2">
              {selectedItemType.isConsumable && (
                <span className="badge bg-blue-100 text-blue-800">Consumable</span>
              )}
              {selectedItemType.isActive ? (
                <span className="badge bg-green-100 text-green-800">Active</span>
              ) : (
                <span className="badge bg-red-100 text-red-800">Inactive</span>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">
                Variants ({getVariantsForItemType(selectedItemType.id).length})
              </h4>
              <div className="space-y-2">
                {getVariantsForItemType(selectedItemType.id).map((variant) => (
                  <div
                    key={variant.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{variant.name}</p>
                      <p className="text-sm text-gray-500">{variant.manufacturer}</p>
                    </div>
                    <div className="text-right">
                      {variant.unitCost && (
                        <p className="font-medium">${variant.unitCost.toFixed(2)}</p>
                      )}
                      <p className="text-xs text-gray-500">SKU: {variant.sku || '-'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
