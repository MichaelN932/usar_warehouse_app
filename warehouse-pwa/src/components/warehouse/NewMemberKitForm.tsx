import { useState, useEffect, useMemo } from 'react';
import {
  NEW_MEMBER_KIT,
  KitItem,
  SizeCategory,
  getKitCategories,
  getKitItemsByCategory,
} from '../../data/new-member-kit-template';
import { SIZE_OPTIONS } from '../../utils/size-mappings';
import { ChevronDown, ChevronRight, Check, Minus, Plus, AlertCircle } from 'lucide-react';

// User profile sizes interface
interface UserSizes {
  shirt?: string;
  pantsWaist?: string;
  pantsInseam?: string;
  bootSize?: string;
  gloveSize?: string;
}

// Form item state
interface KitFormItem {
  kitItemId: string;
  included: boolean;
  selectedBrand?: string;
  selectedSize?: string;
  quantity: number;
}

interface NewMemberKitFormProps {
  userId: string;
  userName: string;
  userSizes?: UserSizes;
  onComplete: (items: KitFormItem[]) => void;
  onCancel: () => void;
}

// Map user profile size to Tru-Spec code (default to Regular length)
function mapToTruSpecSize(userSize: string): string {
  const sizeMap: Record<string, string> = {
    'S': 'SR',
    'M': 'MR',
    'L': 'LR',
    'XL': 'XLR',
    '2XL': '2XLR',
    '3XL': '3XLR',
    '4XL': '4XLR',
  };
  return sizeMap[userSize] || userSize;
}

// Map user profile to 5.11 pants size (WaistxInseam)
function mapToFiveElevenPants(waist?: string, inseam?: string): string | undefined {
  if (!waist || !inseam) return undefined;
  return `${waist}X${inseam}`;
}

export function NewMemberKitForm({
  userId,
  userName,
  userSizes,
  onComplete,
  onCancel,
}: NewMemberKitFormProps) {
  // Initialize form state from template
  const [formItems, setFormItems] = useState<Map<string, KitFormItem>>(new Map());
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const categories = useMemo(() => getKitCategories(), []);

  // Initialize form items with auto-fill from user profile
  useEffect(() => {
    const initialItems = new Map<string, KitFormItem>();

    NEW_MEMBER_KIT.forEach((item) => {
      // Determine initial brand (use default if available)
      let selectedBrand: string | undefined;
      if (item.sizing.brandOptions && item.sizing.brandOptions.length > 0) {
        const defaultBrand = item.sizing.brandOptions.find((b) => b.isDefault);
        selectedBrand = defaultBrand?.brand || item.sizing.brandOptions[0].brand;
      }

      // Determine initial size based on profile and brand
      let selectedSize: string | undefined;
      if (item.sizing.type === 'sized' && userSizes) {
        selectedSize = getAutoFilledSize(item, selectedBrand, userSizes);
      }

      initialItems.set(item.id, {
        kitItemId: item.id,
        included: item.isIssued, // Issued items start checked, personal items unchecked
        selectedBrand,
        selectedSize,
        quantity: item.qtyRequired,
      });
    });

    setFormItems(initialItems);
  }, [userSizes]);

  // Get auto-filled size based on item config and user profile
  function getAutoFilledSize(
    item: KitItem,
    selectedBrand: string | undefined,
    sizes: UserSizes
  ): string | undefined {
    const { sizing } = item;
    if (sizing.type !== 'sized') return undefined;

    // Determine which size category to use
    let sizeCategory: SizeCategory | undefined;
    if (selectedBrand && sizing.brandOptions) {
      const brandOption = sizing.brandOptions.find((b) => b.brand === selectedBrand);
      sizeCategory = brandOption?.sizeCategory;
    } else {
      sizeCategory = sizing.defaultSizeCategory;
    }

    // Get the user's profile value based on profileField
    let profileValue: string | undefined;
    switch (sizing.profileField) {
      case 'shirt':
        profileValue = sizes.shirt;
        break;
      case 'pants':
        if (sizeCategory === 'fiveElevenPants') {
          profileValue = mapToFiveElevenPants(sizes.pantsWaist, sizes.pantsInseam);
        } else if (sizeCategory === 'truSpec') {
          profileValue = sizes.shirt ? mapToTruSpecSize(sizes.shirt) : undefined;
        } else {
          profileValue = sizes.shirt;
        }
        break;
      case 'bootSize':
        profileValue = sizes.bootSize;
        break;
      case 'gloveSize':
        profileValue = sizes.gloveSize;
        break;
    }

    // Map profile value to appropriate size category
    if (!profileValue) return undefined;

    // For Tru-Spec clothing, map standard sizes to Tru-Spec codes
    if (sizeCategory === 'truSpec' && sizing.profileField === 'shirt') {
      return mapToTruSpecSize(profileValue);
    }

    // Verify the value exists in the size options
    const options = getSizeOptionsForItem(item, selectedBrand);
    if (options.includes(profileValue)) {
      return profileValue;
    }

    return undefined;
  }

  // Get size options based on item and selected brand
  function getSizeOptionsForItem(item: KitItem, selectedBrand?: string): string[] {
    const { sizing } = item;

    if (sizing.type === 'oneSize') {
      return SIZE_OPTIONS.oneSize;
    }

    // Get size category from brand or default
    let sizeCategory: SizeCategory | undefined;
    if (selectedBrand && sizing.brandOptions) {
      const brandOption = sizing.brandOptions.find((b) => b.brand === selectedBrand);
      sizeCategory = brandOption?.sizeCategory;
    } else {
      sizeCategory = sizing.defaultSizeCategory;
    }

    if (sizeCategory && SIZE_OPTIONS[sizeCategory]) {
      return SIZE_OPTIONS[sizeCategory];
    }

    return SIZE_OPTIONS.clothing;
  }

  // Update form item
  function updateItem(itemId: string, updates: Partial<KitFormItem>) {
    setFormItems((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(itemId);
      if (existing) {
        // If brand changed, potentially update size
        if (updates.selectedBrand && updates.selectedBrand !== existing.selectedBrand) {
          const kitItem = NEW_MEMBER_KIT.find((i) => i.id === itemId);
          if (kitItem && userSizes) {
            const newSize = getAutoFilledSize(kitItem, updates.selectedBrand, userSizes);
            updates.selectedSize = newSize;
          }
        }
        newMap.set(itemId, { ...existing, ...updates });
      }
      return newMap;
    });
  }

  // Toggle category collapse
  function toggleCategory(category: string) {
    setCollapsedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }

  // Count selected items in category
  function getCategoryCount(category: string): { selected: number; total: number } {
    const items = getKitItemsByCategory(category);
    let selected = 0;
    items.forEach((item) => {
      const formItem = formItems.get(item.id);
      if (formItem?.included) selected++;
    });
    return { selected, total: items.length };
  }

  // Get total counts
  const totals = useMemo(() => {
    let selectedCount = 0;
    let skippedCount = 0;
    let missingSize = 0;

    formItems.forEach((formItem) => {
      const kitItem = NEW_MEMBER_KIT.find((i) => i.id === formItem.kitItemId);
      if (formItem.included) {
        selectedCount++;
        if (kitItem?.sizing.type === 'sized' && !formItem.selectedSize) {
          missingSize++;
        }
      } else {
        skippedCount++;
      }
    });

    return { selectedCount, skippedCount, missingSize };
  }, [formItems]);

  // Handle submit
  function handleComplete() {
    const items = Array.from(formItems.values()).filter((item) => item.included);
    onComplete(items);
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">New Member Kit</h2>
            <p className="text-sm text-gray-600 mt-1">
              Team Member: <span className="font-medium">{userName}</span>
            </p>
            {userSizes && (
              <p className="text-xs text-gray-500 mt-1">
                Recorded Sizes:
                {userSizes.shirt && ` Shirt ${userSizes.shirt}`}
                {userSizes.pantsWaist &&
                  userSizes.pantsInseam &&
                  ` | Pants ${userSizes.pantsWaist}x${userSizes.pantsInseam}`}
                {userSizes.bootSize && ` | Boot ${userSizes.bootSize}`}
                {userSizes.gloveSize && ` | Gloves ${userSizes.gloveSize}`}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {categories.map((category) => {
          const items = getKitItemsByCategory(category);
          const isCollapsed = collapsedCategories.has(category);
          const { selected, total } = getCategoryCount(category);

          return (
            <div key={category} className="border rounded-lg overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isCollapsed ? (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                  <span className="font-medium text-gray-900">{category}</span>
                </div>
                <span
                  className={`text-sm px-2 py-0.5 rounded ${
                    selected === total
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {selected}/{total}
                </span>
              </button>

              {/* Category Items */}
              {!isCollapsed && (
                <div className="divide-y">
                  {items.map((item) => {
                    const formItem = formItems.get(item.id);
                    if (!formItem) return null;

                    const sizeOptions = getSizeOptionsForItem(item, formItem.selectedBrand);
                    const needsSize = item.sizing.type === 'sized';
                    const missingSize = needsSize && formItem.included && !formItem.selectedSize;

                    return (
                      <div
                        key={item.id}
                        className={`px-4 py-3 flex items-center gap-4 ${
                          !formItem.included ? 'bg-gray-50 opacity-60' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => updateItem(item.id, { included: !formItem.included })}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                            formItem.included
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {formItem.included && <Check className="w-4 h-4" />}
                        </button>

                        {/* Item Name */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium ${formItem.included ? 'text-gray-900' : 'text-gray-500'}`}
                            >
                              {item.itemName}
                            </span>
                            {!item.isIssued && (
                              <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                                Personal
                              </span>
                            )}
                            {missingSize && (
                              <AlertCircle className="w-4 h-4 text-amber-500" />
                            )}
                          </div>
                          {item.notes && (
                            <p className="text-xs text-gray-500 mt-0.5">{item.notes}</p>
                          )}
                        </div>

                        {/* Brand Dropdown (if applicable) */}
                        {item.sizing.brandOptions && item.sizing.brandOptions.length > 1 && (
                          <select
                            value={formItem.selectedBrand || ''}
                            onChange={(e) => updateItem(item.id, { selectedBrand: e.target.value })}
                            disabled={!formItem.included}
                            className="w-28 px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                          >
                            {item.sizing.brandOptions.map((opt) => (
                              <option key={opt.brand} value={opt.brand}>
                                {opt.brand}
                              </option>
                            ))}
                          </select>
                        )}

                        {/* Size Dropdown */}
                        {needsSize ? (
                          <select
                            value={formItem.selectedSize || ''}
                            onChange={(e) => updateItem(item.id, { selectedSize: e.target.value })}
                            disabled={!formItem.included}
                            className={`w-24 px-2 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 ${
                              missingSize ? 'border-amber-500' : ''
                            }`}
                          >
                            <option value="">Size</option>
                            {sizeOptions.map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="w-24 text-center text-sm text-gray-500">One Size</span>
                        )}

                        {/* Quantity */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              updateItem(item.id, { quantity: Math.max(0, formItem.quantity - 1) })
                            }
                            disabled={!formItem.included || formItem.quantity <= 0}
                            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={formItem.quantity}
                            onChange={(e) =>
                              updateItem(item.id, {
                                quantity: Math.max(0, parseInt(e.target.value) || 0),
                              })
                            }
                            disabled={!formItem.included}
                            className="w-12 text-center px-1 py-1 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                          />
                          <button
                            onClick={() => updateItem(item.id, { quantity: formItem.quantity + 1 })}
                            disabled={!formItem.included}
                            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">{totals.selectedCount}</span> items selected
            {totals.skippedCount > 0 && (
              <span className="ml-2">
                | <span className="text-gray-500">{totals.skippedCount} skipped</span>
              </span>
            )}
            {totals.missingSize > 0 && (
              <span className="ml-2 text-amber-600">
                | {totals.missingSize} missing size
              </span>
            )}
          </div>
          <button
            onClick={handleComplete}
            disabled={totals.missingSize > 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Complete Kit Distribution
          </button>
        </div>
      </div>
    </div>
  );
}
