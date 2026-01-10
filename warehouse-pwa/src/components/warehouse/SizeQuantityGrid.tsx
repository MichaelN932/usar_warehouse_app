import { useState, useEffect, useMemo } from 'react';
import { PPEInventoryItem, ppeApi } from '../../services/api';

// Adjustment types with their properties
type AdjustmentType = 'stock_received' | 'recount' | 'damage_loss' | 'restock_return' | 'issue';

interface AdjustmentOption {
  id: AdjustmentType;
  label: string;
  icon: string;
  description: string;
  direction: 'add' | 'subtract' | 'set';
  requiresTeamMember?: boolean;
  color: string;
}

const ADJUSTMENT_OPTIONS: AdjustmentOption[] = [
  {
    id: 'stock_received',
    label: 'Stock Received',
    icon: 'inventory',
    description: 'Add items from PO or donation',
    direction: 'add',
    color: 'green',
  },
  {
    id: 'recount',
    label: 'Inventory Recount',
    icon: 'calculate',
    description: 'Correct from physical count',
    direction: 'set',
    color: 'blue',
  },
  {
    id: 'damage_loss',
    label: 'Damage / Loss',
    icon: 'broken_image',
    description: 'Remove damaged or lost items',
    direction: 'subtract',
    color: 'orange',
  },
  {
    id: 'restock_return',
    label: 'Restock Return',
    icon: 'keyboard_return',
    description: 'Items returned to stock',
    direction: 'add',
    requiresTeamMember: true,
    color: 'purple',
  },
  {
    id: 'issue',
    label: 'Issue to Member',
    icon: 'person_add',
    description: 'Issue to team member',
    direction: 'subtract',
    requiresTeamMember: true,
    color: 'sky',
  },
];

// Mock team members - in production this would come from API
const MOCK_TEAM_MEMBERS = [
  { id: 'tm-1', name: 'John Smith', badge: 'TF2-0123' },
  { id: 'tm-2', name: 'Maria Rodriguez', badge: 'TF2-0456' },
  { id: 'tm-3', name: 'James Chen', badge: 'TF2-0789' },
  { id: 'tm-4', name: 'Sarah Johnson', badge: 'TF2-0234' },
  { id: 'tm-5', name: 'Michael Brown', badge: 'TF2-0567' },
];

interface PendingAdjustment {
  sizeId: string;
  type: AdjustmentType;
  quantity: number;
  note?: string;
  teamMemberId?: string;
  teamMemberName?: string;
  originalQty: number;
  newQty: number;
}

interface SizeQuantityGridProps {
  selectedItem: PPEInventoryItem;
  onPendingChangesUpdate: (changes: Record<string, number>) => void;
  pendingChanges: Record<string, number>;
  onAdjustmentsUpdate?: (adjustments: PendingAdjustment[]) => void;
}

interface SummaryStats {
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalIssued: number;
}

export function SizeQuantityGrid({
  selectedItem,
  onPendingChangesUpdate,
  pendingChanges,
  onAdjustmentsUpdate,
}: SizeQuantityGridProps) {
  const [allSizes, setAllSizes] = useState<PPEInventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType | null>(null);
  const [adjustmentQty, setAdjustmentQty] = useState<number>(1);
  const [adjustmentNote, setAdjustmentNote] = useState('');
  const [selectedTeamMember, setSelectedTeamMember] = useState<string>('');
  const [pendingAdjustments, setPendingAdjustments] = useState<PendingAdjustment[]>([]);

  // Load all sizes for this product
  useEffect(() => {
    async function loadSizes() {
      setIsLoading(true);
      try {
        const sizes = await ppeApi.getSizesForProduct(
          selectedItem.itemTypeName,
          selectedItem.manufacturer
        );
        setAllSizes(sizes);
      } finally {
        setIsLoading(false);
      }
    }
    loadSizes();
  }, [selectedItem.itemTypeName, selectedItem.manufacturer]);

  // Compute summary statistics
  const summary = useMemo((): SummaryStats => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let totalIssued = 0;

    allSizes.forEach(item => {
      const qty = pendingChanges[item.sizeId] ?? item.quantityOnHand;
      const threshold = item.lowStockThreshold ?? 10;

      if (qty === 0) {
        outOfStock++;
      } else if (qty <= threshold) {
        lowStock++;
      } else {
        inStock++;
      }

      totalIssued += item.quantityOut || 0;
    });

    return { inStock, lowStock, outOfStock, totalIssued };
  }, [allSizes, pendingChanges]);

  const selectedSize = allSizes.find(s => s.sizeId === selectedSizeId);
  const selectedOption = ADJUSTMENT_OPTIONS.find(o => o.id === adjustmentType);

  const getDisplayQty = (item: PPEInventoryItem): number => {
    return pendingChanges[item.sizeId] ?? item.quantityOnHand;
  };

  const handleSizeSelect = (sizeId: string) => {
    if (selectedSizeId === sizeId) {
      // Deselect
      setSelectedSizeId(null);
      setAdjustmentType(null);
    } else {
      setSelectedSizeId(sizeId);
      setAdjustmentType(null);
      setAdjustmentQty(1);
      setAdjustmentNote('');
      setSelectedTeamMember('');
    }
  };

  const handleAdjustmentTypeSelect = (type: AdjustmentType) => {
    setAdjustmentType(type);
    setAdjustmentQty(1);
    setAdjustmentNote('');
    setSelectedTeamMember('');
  };

  const calculateNewQty = (): number => {
    if (!selectedSize || !selectedOption) return 0;
    const currentQty = getDisplayQty(selectedSize);

    switch (selectedOption.direction) {
      case 'add':
        return currentQty + adjustmentQty;
      case 'subtract':
        return Math.max(0, currentQty - adjustmentQty);
      case 'set':
        return adjustmentQty;
      default:
        return currentQty;
    }
  };

  const canApplyAdjustment = (): boolean => {
    if (!selectedSize || !adjustmentType || adjustmentQty < 1) return false;
    if (selectedOption?.requiresTeamMember && !selectedTeamMember) return false;
    return true;
  };

  const handleApplyAdjustment = () => {
    if (!selectedSize || !selectedOption || !canApplyAdjustment()) return;

    const originalQty = selectedSize.quantityOnHand;
    const newQty = calculateNewQty();
    const teamMember = MOCK_TEAM_MEMBERS.find(t => t.id === selectedTeamMember);

    // Create adjustment record
    const adjustment: PendingAdjustment = {
      sizeId: selectedSize.sizeId,
      type: adjustmentType!,
      quantity: adjustmentQty,
      note: adjustmentNote || undefined,
      teamMemberId: selectedTeamMember || undefined,
      teamMemberName: teamMember?.name,
      originalQty,
      newQty,
    };

    // Update pending adjustments
    const newAdjustments = [...pendingAdjustments, adjustment];
    setPendingAdjustments(newAdjustments);
    onAdjustmentsUpdate?.(newAdjustments);

    // Update quantity
    onPendingChangesUpdate({ ...pendingChanges, [selectedSize.sizeId]: newQty });

    // Reset form but keep size selected
    setAdjustmentType(null);
    setAdjustmentQty(1);
    setAdjustmentNote('');
    setSelectedTeamMember('');
  };

  const handleRemoveAdjustment = (sizeId: string, index: number) => {
    const newAdjustments = pendingAdjustments.filter((_, i) => i !== index);
    setPendingAdjustments(newAdjustments);
    onAdjustmentsUpdate?.(newAdjustments);

    // Recalculate the quantity for this size from remaining adjustments
    const sizeAdjustments = newAdjustments.filter(a => a.sizeId === sizeId);
    if (sizeAdjustments.length === 0) {
      // Remove from pending changes
      const updated = { ...pendingChanges };
      delete updated[sizeId];
      onPendingChangesUpdate(updated);
    } else {
      // Recalculate from last adjustment
      const lastAdj = sizeAdjustments[sizeAdjustments.length - 1];
      onPendingChangesUpdate({ ...pendingChanges, [sizeId]: lastAdj.newQty });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-action-primary"></div>
      </div>
    );
  }

  const changedCount = Object.keys(pendingChanges).length;

  return (
    <div className="space-y-3">
      {/* Pending Changes Banner */}
      {changedCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-200 rounded-lg text-xs">
          <span className="material-symbols-outlined text-sky-600 text-sm">edit</span>
          <span className="text-sky-700">
            <strong>{changedCount}</strong> size{changedCount > 1 ? 's' : ''} modified — save to apply
          </span>
        </div>
      )}

      {/* Main Content - Side by Side Layout (50/50) - Fixed height for consistent modal size */}
      <div className="flex gap-4 h-[480px]">
        {/* Left Side - Size List (50%) */}
        <div className="w-1/2 border border-slate-200 rounded-lg overflow-hidden flex flex-col">
          <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 shrink-0">
            <span className="text-xs font-semibold text-slate-600">{allSizes.length} Size{allSizes.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="overflow-y-auto flex-1 min-h-0">
            {allSizes.map((item) => {
              const isSelected = item.sizeId === selectedSizeId;
              const currentQty = getDisplayQty(item);
              const hasChange = item.sizeId in pendingChanges;
              const originalQty = item.quantityOnHand;
              const isLowStock = currentQty <= (item.lowStockThreshold ?? 10) && currentQty > 0;
              const isOutOfStock = currentQty === 0;

              return (
                <div
                  key={item.sizeId}
                  onClick={() => handleSizeSelect(item.sizeId)}
                  className={`flex items-center gap-3 px-3 py-2 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors ${
                    isSelected
                      ? 'bg-action-primary/10 border-l-2 border-l-action-primary'
                      : 'hover:bg-slate-50'
                  } ${hasChange ? 'bg-sky-50/50' : ''}`}
                >
                  {/* Size Name */}
                  <div className="w-16 shrink-0">
                    <div className="font-semibold text-sm text-primary-900">{item.sizeName || 'One Size'}</div>
                    {item.sizeDetail && (
                      <div className="text-[10px] text-slate-500 truncate">{item.sizeDetail}</div>
                    )}
                  </div>

                  {/* On Hand */}
                  <div className="w-14 text-center shrink-0">
                    {hasChange ? (
                      <div className="flex items-center justify-center gap-0.5 text-xs">
                        <span className="text-slate-400 line-through">{originalQty}</span>
                        <span className="text-sky-500">→</span>
                        <span className="font-bold text-sky-700">{currentQty}</span>
                      </div>
                    ) : (
                      <span className={`font-semibold text-sm ${
                        isOutOfStock ? 'text-red-600' :
                        isLowStock ? 'text-amber-600' :
                        'text-green-600'
                      }`}>
                        {currentQty}
                      </span>
                    )}
                    <div className="text-[10px] text-slate-400">on hand</div>
                  </div>

                  {/* Issued */}
                  <div className="w-12 text-center shrink-0">
                    <span className="text-sm text-sky-600 font-medium">{item.quantityOut || 0}</span>
                    <div className="text-[10px] text-slate-400">issued</div>
                  </div>

                  {/* Spacer + Selection Indicator */}
                  <div className="flex-1" />
                  <span className={`material-symbols-outlined text-lg transition-colors ${
                    isSelected ? 'text-action-primary' : 'text-slate-300'
                  }`}>
                    {isSelected ? 'chevron_right' : 'chevron_right'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Adjustment Panel (50%) */}
        <div className="w-1/2">
          {selectedSize ? (
            <div className="h-full border border-action-primary/30 rounded-lg bg-action-primary/5 flex flex-col">
              {/* Selected Size Header */}
              <div className="px-3 py-2 bg-action-primary/10 border-b border-action-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-primary-900">{selectedSize.sizeName || 'One Size'}</div>
                    <div className="text-xs text-primary-600">
                      {getDisplayQty(selectedSize)} on hand
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSizeId(null)}
                    className="text-primary-400 hover:text-primary-600 p-0.5"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>
              </div>

              {/* Adjustment Content */}
              <div className="flex-1 overflow-y-auto p-3">
                {!adjustmentType ? (
                  /* Adjustment Type Selection */
                  <div className="space-y-1.5">
                    <p className="text-xs text-primary-500 mb-2">Select adjustment:</p>
                    {ADJUSTMENT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleAdjustmentTypeSelect(option.id)}
                        className="w-full flex items-center gap-2 p-2 rounded-lg border border-transparent hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-left"
                      >
                        <span className={`material-symbols-outlined text-${option.color}-600 text-lg`}>
                          {option.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-primary-900 text-xs">{option.label}</div>
                          <div className="text-[10px] text-primary-500 truncate">{option.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  /* Adjustment Form */
                  <div className="space-y-3">
                    {/* Selected Type */}
                    <div className="flex items-center gap-2 pb-2 border-b border-primary-200">
                      <span className={`material-symbols-outlined text-${selectedOption?.color}-600 text-base`}>
                        {selectedOption?.icon}
                      </span>
                      <span className="font-medium text-primary-900 text-xs flex-1">{selectedOption?.label}</span>
                      <button
                        onClick={() => setAdjustmentType(null)}
                        className="text-[10px] text-primary-500 hover:text-primary-700"
                      >
                        Change
                      </button>
                    </div>

                    {/* Quantity Input */}
                    <div>
                      <label className="block text-xs font-medium text-primary-700 mb-1">
                        {selectedOption?.direction === 'set' ? 'New qty' : 'Quantity'}
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAdjustmentQty(Math.max(1, adjustmentQty - 1))}
                          className="w-8 h-8 rounded border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-sm"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={adjustmentQty}
                          onChange={(e) => setAdjustmentQty(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-14 h-8 text-center text-sm font-semibold border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-action-primary"
                        />
                        <button
                          onClick={() => setAdjustmentQty(adjustmentQty + 1)}
                          className="w-8 h-8 rounded border border-slate-300 bg-white hover:bg-slate-50 flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>
                      {/* Preview */}
                      <div className="mt-1 text-xs text-primary-600">
                        {getDisplayQty(selectedSize)} → <strong className="text-primary-900">{calculateNewQty()}</strong>
                      </div>
                    </div>

                    {/* Team Member Selection */}
                    {selectedOption?.requiresTeamMember && (
                      <div>
                        <label className="block text-xs font-medium text-primary-700 mb-1">
                          Team Member
                        </label>
                        <select
                          value={selectedTeamMember}
                          onChange={(e) => setSelectedTeamMember(e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-action-primary"
                        >
                          <option value="">Select...</option>
                          {MOCK_TEAM_MEMBERS.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Note */}
                    <div>
                      <label className="block text-xs font-medium text-primary-700 mb-1">
                        Note <span className="text-primary-400">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={adjustmentNote}
                        onChange={(e) => setAdjustmentNote(e.target.value)}
                        placeholder="Add note..."
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-action-primary"
                      />
                    </div>

                    {/* Apply Button */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setAdjustmentType(null)}
                        className="flex-1 px-2 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-100 rounded transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleApplyAdjustment}
                        disabled={!canApplyAdjustment()}
                        className="flex-1 px-2 py-1.5 text-xs font-medium text-white bg-action-primary hover:bg-action-hover rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="h-full border border-dashed border-slate-300 rounded-lg flex items-center justify-center bg-slate-50/50">
              <div className="text-center px-4">
                <span className="material-symbols-outlined text-3xl text-slate-300 mb-2">touch_app</span>
                <p className="text-xs text-slate-500">Select a size to make adjustments</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pending Adjustments List */}
      {pendingAdjustments.length > 0 && (
        <div className="border border-sky-200 rounded-lg bg-sky-50/50">
          <div className="px-3 py-1.5 border-b border-sky-200 bg-sky-100/50">
            <span className="text-xs font-medium text-sky-800">
              Pending Adjustments ({pendingAdjustments.length})
            </span>
          </div>
          <div className="divide-y divide-sky-100 max-h-32 overflow-y-auto">
            {pendingAdjustments.map((adj, index) => {
              const option = ADJUSTMENT_OPTIONS.find(o => o.id === adj.type);
              const size = allSizes.find(s => s.sizeId === adj.sizeId);
              return (
                <div key={index} className="px-3 py-1.5 flex items-center gap-2 text-xs">
                  <span className={`material-symbols-outlined text-${option?.color || 'slate'}-600 text-sm`}>
                    {option?.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-primary-900">{size?.sizeName}</span>
                    <span className="text-primary-400 mx-1">•</span>
                    <span className="text-primary-600">{option?.label}</span>
                    <span className="text-primary-400 mx-1">•</span>
                    <span className="text-primary-700">{adj.originalQty}→{adj.newQty}</span>
                    {adj.teamMemberName && (
                      <span className="text-purple-600 ml-1">({adj.teamMemberName})</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveAdjustment(adj.sizeId, index)}
                    className="text-red-500 hover:text-red-700 p-0.5"
                    title="Remove"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
