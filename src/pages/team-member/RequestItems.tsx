import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Modal, EmptyState, Icon } from '../../components/ui';
import { catalogApi, requestsApi, issuedItemsApi } from '../../services/api';
import { Category, ItemType, Variant, Size, CatalogItem, RequestLine, IssuedItem, REPLACEMENT_REASONS } from '../../types';

interface CartItem {
  itemType: ItemType;
  variant?: Variant;
  size?: Size;
  quantity: number;
  replacementReason?: string;
}

export function RequestItems() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [issuedItems, setIssuedItems] = useState<IssuedItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedItemType, setSelectedItemType] = useState<ItemType | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [replacementReason, setReplacementReason] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [cats, items, vars, szs, catalog, issued] = await Promise.all([
        catalogApi.getCategories(),
        catalogApi.getItemTypes(),
        catalogApi.getVariants(),
        catalogApi.getSizes(),
        catalogApi.getCatalogItems(),
        issuedItemsApi.getByUser(user!.id),
      ]);
      setCategories(cats);
      setItemTypes(items);
      setVariants(vars);
      setSizes(szs);
      setCatalogItems(catalog);
      setIssuedItems(issued);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredItemTypes = selectedCategory
    ? itemTypes.filter((it) => it.categoryId === selectedCategory)
    : itemTypes;

  const availableVariants = selectedItemType
    ? variants.filter((v) => v.itemTypeId === selectedItemType.id)
    : [];

  const availableSizes = selectedVariant
    ? sizes.filter((s) => s.variantId === selectedVariant.id)
    : [];

  const getStockForSize = (sizeId: string) => {
    const item = catalogItems.find((c) => c.sizeId === sizeId);
    return item?.quantityAvailable || 0;
  };

  const userHasItem = (itemTypeId: string) => {
    return issuedItems.some((ii) => {
      const variant = variants.find((v) => v.id === ii.sizeId.split('-')[0]);
      return variant?.itemTypeId === itemTypeId;
    });
  };

  const needsReplacementReason = () => {
    if (!selectedItemType) return false;
    if (selectedItemType.isConsumable) return false;
    return userHasItem(selectedItemType.id);
  };

  const addToCart = () => {
    if (!selectedItemType) return;

    const cartItem: CartItem = {
      itemType: selectedItemType,
      variant: selectedVariant || undefined,
      size: selectedSize || undefined,
      quantity,
      replacementReason: needsReplacementReason() ? replacementReason : undefined,
    };

    setCart([...cart, cartItem]);
    resetSelection();
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const resetSelection = () => {
    setSelectedItemType(null);
    setSelectedVariant(null);
    setSelectedSize(null);
    setQuantity(1);
    setReplacementReason('');
  };

  const submitRequest = async () => {
    if (cart.length === 0 || !user) return;

    setIsSubmitting(true);
    try {
      const lines: Omit<RequestLine, 'id'>[] = cart.map((item, index) => ({
        requestId: '', // Will be set by API
        itemTypeId: item.itemType.id,
        itemTypeName: item.itemType.name,
        requestedSizeId: item.size?.id,
        requestedSizeName: item.size?.name,
        preferredVariantId: item.variant?.id,
        preferredVariantName: item.variant?.name,
        quantity: item.quantity,
        replacementReason: item.replacementReason,
        issuedQuantity: 0,
        isBackordered: false,
      })).map((line, index) => ({ ...line, id: `temp-${index}` }));

      await requestsApi.create({
        requestedBy: user.id,
        requestedByName: `${user.firstName} ${user.lastName}`,
        status: 'Pending',
        requestDate: new Date().toISOString(),
        notes: notes || undefined,
        lines: lines as RequestLine[],
      });

      setCart([]);
      setNotes('');
      setIsModalOpen(false);
      navigate('/my-requests');
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Request Items</h1>
          <p className="text-gray-600">Browse and request gear from the warehouse</p>
        </div>
        {cart.length > 0 && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary relative"
          >
            Review Request
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
              {cart.length}
            </span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Browse Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Filter */}
          <Card title="Categories">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !selectedCategory
                    ? 'bg-fire-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-fire-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </Card>

          {/* Item Types */}
          <Card title="Available Items">
            {filteredItemTypes.length === 0 ? (
              <EmptyState
                title="No items found"
                description="Try selecting a different category"
              />
            ) : (
              <div className="space-y-2">
                {filteredItemTypes.map((itemType) => {
                  const category = categories.find((c) => c.id === itemType.categoryId);
                  return (
                    <div
                      key={itemType.id}
                      onClick={() => {
                        setSelectedItemType(itemType);
                        setSelectedVariant(null);
                        setSelectedSize(null);
                      }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedItemType?.id === itemType.id
                          ? 'border-fire-500 bg-fire-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{itemType.name}</h4>
                          <p className="text-sm text-gray-500">
                            {category?.name} | {itemType.femaCode}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {itemType.isConsumable && (
                            <span className="badge bg-blue-100 text-blue-800">Consumable</span>
                          )}
                          {userHasItem(itemType.id) && !itemType.isConsumable && (
                            <span className="badge bg-orange-100 text-orange-800">Issued</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Selection Panel */}
        <div className="space-y-4">
          <Card title="Selection">
            {!selectedItemType ? (
              <p className="text-gray-500 text-center py-8">
                Select an item from the list to continue
              </p>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedItemType.name}</h4>
                  <p className="text-sm text-gray-500">{selectedItemType.femaCode}</p>
                </div>

                {/* Variant Selection */}
                {availableVariants.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Variant / Brand (Optional)
                    </label>
                    <select
                      value={selectedVariant?.id || ''}
                      onChange={(e) => {
                        const v = variants.find((v) => v.id === e.target.value);
                        setSelectedVariant(v || null);
                        setSelectedSize(null);
                      }}
                      className="input"
                    >
                      <option value="">Any variant</option>
                      {availableVariants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.manufacturer})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Size Selection */}
                {selectedVariant && availableSizes.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableSizes.map((size) => {
                        const stock = getStockForSize(size.id);
                        return (
                          <button
                            key={size.id}
                            onClick={() => setSelectedSize(size)}
                            disabled={stock === 0}
                            className={`p-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                              selectedSize?.id === size.id
                                ? 'border-fire-500 bg-fire-50 text-fire-700'
                                : stock === 0
                                ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <span>{size.name}</span>
                            <span className={`block text-xs ${stock === 0 ? 'text-red-500' : 'text-gray-500'}`}>
                              {stock} avail
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="btn btn-secondary px-3 py-1"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="btn btn-secondary px-3 py-1"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Replacement Reason */}
                {needsReplacementReason() && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Replacement Reason (Required)
                    </label>
                    <select
                      value={replacementReason}
                      onChange={(e) => setReplacementReason(e.target.value)}
                      className="input"
                    >
                      <option value="">Select a reason...</option>
                      {REPLACEMENT_REASONS.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-orange-600 mt-1">
                      You already have this item issued. A reason is required.
                    </p>
                  </div>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={addToCart}
                  disabled={needsReplacementReason() && !replacementReason}
                  className="w-full btn btn-primary"
                >
                  Add to Request
                </button>
              </div>
            )}
          </Card>

          {/* Cart Preview */}
          {cart.length > 0 && (
            <Card title={`Request Items (${cart.length})`}>
              <div className="space-y-2">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.itemType.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.variant?.name} {item.size?.name} x{item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Icon name="close" size="md" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full btn btn-primary mt-4"
              >
                Review & Submit
              </button>
            </Card>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Review Request"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={submitRequest}
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="divide-y">
            {cart.map((item, index) => (
              <div key={index} className="py-3 flex justify-between">
                <div>
                  <p className="font-medium">{item.itemType.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.variant?.name || 'Any variant'} | {item.size?.name || 'Any size'}
                  </p>
                  {item.replacementReason && (
                    <p className="text-sm text-orange-600">
                      Reason: {item.replacementReason}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-medium">Qty: {item.quantity}</p>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-red-600 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input"
              rows={3}
              placeholder="Any special instructions or notes..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
