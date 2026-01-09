import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Modal, EmptyState } from '../../components/ui';
import { ppeApi, PPEInventoryItem, PPEInventorySummary, PPEIssuedRecord, PPEActivityLog, usersApi } from '../../services/api';
import { ppeCategories } from '../../data/ppe-seed-data';
import { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import {
  getSizeOptions,
  getSubcategoriesForCategory,
  getManufacturersForCategory,
  isOneSizeCategory,
} from '../../utils/size-mappings';

type ViewMode = 'inventory' | 'in-stock' | 'low-stock' | 'out-of-stock' | 'issued';
type SortField = 'itemTypeName' | 'categoryName' | 'subcategory' | 'type' | 'manufacturer' | 'sizeName' | 'femaCode' | 'legacyId' | 'quantityOnHand' | 'quantityOut' | 'quantityTotal' | 'status' | 'lastUpdatedAt' | 'lastUpdatedBy';
type SortDirection = 'asc' | 'desc';
type ColumnFilters = Partial<Record<SortField, Set<string>>>;

// Column definitions with labels
interface ColumnDef {
  field: SortField;
  label: string;
  defaultVisible: boolean;
}

const ALL_COLUMNS: ColumnDef[] = [
  { field: 'itemTypeName', label: 'Product Name', defaultVisible: true },
  { field: 'categoryName', label: 'Category', defaultVisible: true },
  { field: 'subcategory', label: 'Subcategory', defaultVisible: false },
  { field: 'type', label: 'Type', defaultVisible: false },
  { field: 'manufacturer', label: 'Manufacturer', defaultVisible: true },
  { field: 'sizeName', label: 'Size', defaultVisible: true },
  { field: 'femaCode', label: 'FEMA Ref', defaultVisible: true },
  { field: 'legacyId', label: 'Item ID', defaultVisible: false },
  { field: 'quantityOnHand', label: 'Available', defaultVisible: true },
  { field: 'quantityOut', label: 'Issued', defaultVisible: true },
  { field: 'quantityTotal', label: 'Total', defaultVisible: true },
  { field: 'status', label: 'Status', defaultVisible: true },
  { field: 'lastUpdatedAt', label: 'Last Updated', defaultVisible: true },
  { field: 'lastUpdatedBy', label: 'Updated By', defaultVisible: true },
];

const DEFAULT_COLUMN_ORDER = ALL_COLUMNS.filter(c => c.defaultVisible).map(c => c.field);

// Get initial column order from localStorage or defaults (ordered array of visible fields)
const getInitialColumnOrder = (): SortField[] => {
  try {
    const stored = localStorage.getItem('ppe-inventory-column-order');
    if (stored) {
      const parsed = JSON.parse(stored) as SortField[];
      // Validate that all fields exist
      const validFields = new Set(ALL_COLUMNS.map(c => c.field));
      const validParsed = parsed.filter(f => validFields.has(f));
      if (validParsed.length > 0) return validParsed;
    }
  } catch {
    // ignore
  }
  return DEFAULT_COLUMN_ORDER;
};

// Compute combined status from quantity (uses item's lowStockThreshold or defaults to 10)
const getComputedStatus = (item: PPEInventoryItem): 'In Stock' | 'Low Stock' | 'Out of Stock' => {
  const qty = item.quantityOnHand || 0;
  const threshold = item.lowStockThreshold ?? 10;
  if (qty === 0) return 'Out of Stock';
  if (qty <= threshold) return 'Low Stock';
  return 'In Stock';
};

// Helper to get value from item by field
const getFieldValue = (item: PPEInventoryItem, field: SortField): string | number => {
  switch (field) {
    case 'itemTypeName': return item.itemTypeName || '';
    case 'categoryName': return item.categoryName || '';
    case 'subcategory': return item.subcategory || '';
    case 'type': return item.type || '';
    case 'manufacturer': return item.manufacturer || '';
    case 'sizeName': return item.sizeName || '';
    case 'femaCode': return item.femaCode || '';
    case 'legacyId': return item.legacyId || '';
    case 'quantityOnHand': return item.quantityOnHand || 0;
    case 'quantityOut': return item.quantityOut || 0;
    case 'quantityTotal': return item.quantityTotal || 0;
    case 'status': return getComputedStatus(item);
    case 'lastUpdatedAt': return item.lastUpdatedAt || '';
    case 'lastUpdatedBy': return item.lastUpdatedBy || '';
    default: return '';
  }
};

// Format the last updated timestamp for display
const formatLastUpdated = (item: PPEInventoryItem): string => {
  if (!item.lastUpdatedAt) return '—';
  const date = new Date(item.lastUpdatedAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Format time
  const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  // Format date based on recency
  let dateStr: string;
  if (diffDays === 0) {
    dateStr = 'Today';
  } else if (diffDays === 1) {
    dateStr = 'Yesterday';
  } else if (diffDays < 7) {
    dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  return `${dateStr} ${timeStr}`;
};

export function PPEInventory() {
  const { user: currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<PPEInventoryItem[]>([]);
  const [summary, setSummary] = useState<PPEInventorySummary | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>((searchParams.get('view') as ViewMode) || 'inventory');
  const [sortField, setSortField] = useState<SortField>('itemTypeName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedItem, setSelectedItem] = useState<PPEInventoryItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New Item Modal state
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItemForm, setNewItemForm] = useState<Partial<Omit<PPEInventoryItem, 'sizeId'>>>({
    categoryName: '',
    itemTypeName: '',
    variantName: '',
    manufacturer: '',
    sizeName: '',
    femaCode: '',
    legacyId: '',
    quantityOnHand: 0,
    quantityOut: 0,
    quantityTotal: 0,
    status: 'IN',
  });

  // Edit Item Modal state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<PPEInventoryItem>>({});

  // Quantity Adjustment state (Square-style)
  type AdjustmentReason = 'count' | 'received' | 'damaged' | 'lost' | 'returned' | 'issued' | 'other';
  const [adjustmentReason, setAdjustmentReason] = useState<AdjustmentReason>('count');
  const [adjustmentNote, setAdjustmentNote] = useState('');
  const [adjustmentQty, setAdjustmentQty] = useState(0);

  // Issued personnel tracking state
  const [issuedRecords, setIssuedRecords] = useState<PPEIssuedRecord[]>([]);
  const [isLoadingIssued, setIsLoadingIssued] = useState(false);

  // Detail modal tab state
  type DetailModalTab = 'overview' | 'history' | 'assignments';
  const [detailModalTab, setDetailModalTab] = useState<DetailModalTab>('overview');
  const [activityLogs, setActivityLogs] = useState<PPEActivityLog[]>([]);
  const [isLoadingActivityLogs, setIsLoadingActivityLogs] = useState(false);

  // Low stock threshold editing state
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [thresholdValue, setThresholdValue] = useState(10);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Column filter state
  const [columnFilters, setColumnFilters] = useState<ColumnFilters>({});
  const [openFilterColumn, setOpenFilterColumn] = useState<SortField | null>(null);
  const [filterSearchText, setFilterSearchText] = useState('');
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Column visibility and order state (ordered array of visible column fields)
  const [columnOrder, setColumnOrder] = useState<SortField[]>(getInitialColumnOrder);
  const [isColumnPickerOpen, setIsColumnPickerOpen] = useState(false);
  const columnPickerRef = useRef<HTMLDivElement>(null);

  // Drag state for column reordering
  const [draggedColumn, setDraggedColumn] = useState<SortField | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<SortField | null>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setOpenFilterColumn(null);
        setFilterSearchText('');
      }
      if (columnPickerRef.current && !columnPickerRef.current.contains(event.target as Node)) {
        setIsColumnPickerOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load users for personnel selection
  useEffect(() => {
    async function loadUsers() {
      try {
        const userList = await usersApi.getAll();
        setUsers(userList);
      } catch {
        // Silently fail - users will use manual entry
      }
    }
    loadUsers();
  }, []);

  // Save column order to localStorage when changed
  useEffect(() => {
    localStorage.setItem('ppe-inventory-column-order', JSON.stringify(columnOrder));
  }, [columnOrder]);

  useEffect(() => {
    loadData();
  }, [selectedCategory, viewMode]);

  async function loadData() {
    setIsLoading(true);
    try {
      let inventoryItems: PPEInventoryItem[];

      switch (viewMode) {
        case 'in-stock':
          inventoryItems = await ppeApi.getInStockItems();
          break;
        case 'low-stock':
          inventoryItems = await ppeApi.getLowStockItems();
          break;
        case 'out-of-stock':
          inventoryItems = await ppeApi.getOutOfStockItems();
          break;
        case 'issued':
          inventoryItems = await ppeApi.getIssuedItems();
          break;
        default:
          inventoryItems = await ppeApi.getInventory({
            categoryId: selectedCategory || undefined,
            status: 'all',
          });
      }

      setItems(inventoryItems);
      const summaryData = await ppeApi.getSummary();
      setSummary(summaryData);
    } finally {
      setIsLoading(false);
    }
  }

  // Get unique values for a column (for filter dropdown)
  const getUniqueValues = useCallback((field: SortField): string[] => {
    const values = new Set<string>();
    items.forEach(item => {
      const val = getFieldValue(item, field);
      values.add(String(val) || '(empty)');
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [items]);

  // Filter items by search query AND column filters
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Global search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = (
          item.description?.toLowerCase().includes(query) ||
          item.itemTypeName?.toLowerCase().includes(query) ||
          item.manufacturer?.toLowerCase().includes(query) ||
          item.femaCode?.toLowerCase().includes(query) ||
          item.sizeName?.toLowerCase().includes(query)
        );
        if (!matchesSearch) return false;
      }

      // Column filters
      for (const [field, selectedValues] of Object.entries(columnFilters)) {
        if (selectedValues && selectedValues.size > 0) {
          const itemValue = String(getFieldValue(item, field as SortField)) || '(empty)';
          if (!selectedValues.has(itemValue)) {
            return false;
          }
        }
      }

      return true;
    });
  }, [items, searchQuery, columnFilters]);

  // Sorted items
  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const aVal = getFieldValue(a, sortField);
      const bVal = getFieldValue(b, sortField);

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const comparison = String(aVal).localeCompare(String(bVal));
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredItems, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleFilterDropdown = (field: SortField, e: React.MouseEvent) => {
    e.stopPropagation();
    if (openFilterColumn === field) {
      setOpenFilterColumn(null);
      setFilterSearchText('');
    } else {
      setOpenFilterColumn(field);
      setFilterSearchText('');
    }
  };

  const toggleFilterValue = (field: SortField, value: string) => {
    setColumnFilters(prev => {
      const current = prev[field] || new Set<string>();
      const updated = new Set(current);
      if (updated.has(value)) {
        updated.delete(value);
      } else {
        updated.add(value);
      }
      return { ...prev, [field]: updated.size > 0 ? updated : undefined };
    });
  };

  const selectAllFilterValues = (field: SortField) => {
    const allValues = getUniqueValues(field);
    setColumnFilters(prev => ({
      ...prev,
      [field]: new Set(allValues)
    }));
  };

  const clearFilterValues = (field: SortField) => {
    setColumnFilters(prev => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const clearAllFilters = () => {
    setColumnFilters({});
  };

  const activeFilterCount = Object.values(columnFilters).filter(v => v && v.size > 0).length;

  // Column visibility functions
  const visibleColumnsSet = useMemo(() => new Set(columnOrder), [columnOrder]);

  const toggleColumnVisibility = (field: SortField) => {
    setColumnOrder(prev => {
      if (prev.includes(field)) {
        // Don't allow hiding all columns - keep at least one
        if (prev.length > 1) {
          return prev.filter(f => f !== field);
        }
        return prev;
      } else {
        // Add column at end
        return [...prev, field];
      }
    });
  };

  const showAllColumns = () => {
    // Add all columns that aren't already visible, maintaining current order
    setColumnOrder(prev => {
      const currentSet = new Set(prev);
      const newColumns = ALL_COLUMNS.filter(c => !currentSet.has(c.field)).map(c => c.field);
      return [...prev, ...newColumns];
    });
  };

  const resetToDefaultColumns = () => {
    setColumnOrder(DEFAULT_COLUMN_ORDER);
  };

  // Get visible columns in order with their definitions
  const visibleColumnsList = useMemo(() => {
    const colMap = new Map(ALL_COLUMNS.map(c => [c.field, c]));
    return columnOrder.map(field => colMap.get(field)!).filter(Boolean);
  }, [columnOrder]);

  // Drag handlers for column reordering
  const handleDragStart = (field: SortField) => {
    setDraggedColumn(field);
  };

  const handleDragOver = (e: React.DragEvent, field: SortField) => {
    e.preventDefault();
    if (draggedColumn && draggedColumn !== field) {
      setDragOverColumn(field);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetField: SortField) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetField) {
      setDraggedColumn(null);
      setDragOverColumn(null);
      return;
    }

    setColumnOrder(prev => {
      const newOrder = [...prev];
      const draggedIndex = newOrder.indexOf(draggedColumn);
      const targetIndex = newOrder.indexOf(targetField);

      if (draggedIndex === -1 || targetIndex === -1) return prev;

      // Remove dragged column and insert at target position
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedColumn);

      return newOrder;
    });

    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  // Helper to get display name (strips manufacturer prefix if present)
  const getDisplayName = (item: PPEInventoryItem): string => {
    let displayName = item.itemTypeName || '';
    if (item.manufacturer && displayName.toLowerCase().startsWith(item.manufacturer.toLowerCase())) {
      displayName = displayName.slice(item.manufacturer.length).trim();
    }
    return displayName;
  };

  // Render cell content based on field type
  const renderCellContent = (item: PPEInventoryItem, field: SortField) => {
    switch (field) {
      case 'itemTypeName':
        return <span className="font-medium text-primary-900">{getDisplayName(item)}</span>;
      case 'categoryName':
        return <span className="text-primary-600">{item.categoryName}</span>;
      case 'subcategory':
        return <span className="text-primary-600">{item.subcategory || '—'}</span>;
      case 'type':
        return <span className="text-primary-600">{item.type || '—'}</span>;
      case 'manufacturer':
        return <span className="text-primary-600">{item.manufacturer}</span>;
      case 'sizeName':
        return (
          <div>
            <span className="text-primary-700">{item.sizeName}</span>
            {item.sizeDetail && (
              <span className="text-primary-400 text-xs ml-1">({item.sizeDetail})</span>
            )}
          </div>
        );
      case 'femaCode':
        return <span className="font-mono text-primary-500">{item.femaCode || '—'}</span>;
      case 'legacyId':
        return <span className="font-mono text-primary-500">{item.legacyId || '—'}</span>;
      case 'quantityOnHand':
        return <span className={`font-semibold tabular-nums text-center block ${getQuantityColor(item.quantityOnHand)}`}>{item.quantityOnHand.toLocaleString()}</span>;
      case 'quantityOut':
        return <span className="text-primary-600 tabular-nums text-center block">{(item.quantityOut || 0).toLocaleString()}</span>;
      case 'quantityTotal':
        return <span className="font-medium text-primary-700 tabular-nums text-center block">{(item.quantityTotal || 0).toLocaleString()}</span>;
      case 'status':
        const computedStatus = getComputedStatus(item);
        return (
          <div className="text-center">
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(computedStatus)}`}>
              {computedStatus}
            </span>
          </div>
        );
      case 'lastUpdatedAt':
        return item.lastUpdatedAt ? (
          <div className="text-xs">
            <div className="text-primary-700">{formatLastUpdated(item)}</div>
            {item.lastUpdatedBy && (
              <div className="text-primary-500">by {item.lastUpdatedBy}</div>
            )}
            {item.lastUpdateReason && (
              <div className="text-primary-400 italic">{item.lastUpdateReason}</div>
            )}
          </div>
        ) : (
          <span className="text-primary-400">—</span>
        );
      case 'lastUpdatedBy':
        return <span className="text-primary-600">{item.lastUpdatedBy || '—'}</span>;
      default:
        return <span className="text-primary-600">—</span>;
    }
  };

  // Columns that should be centered
  const centeredColumns: SortField[] = ['quantityOnHand', 'quantityOut', 'quantityTotal', 'status'];

  // Column Header with Sort + Filter + Drag
  const ColumnHeader = ({ field, label }: { field: SortField; label: string }) => {
    const isOpen = openFilterColumn === field;
    const hasFilter = columnFilters[field] && columnFilters[field]!.size > 0;
    const uniqueValues = isOpen ? getUniqueValues(field) : [];
    const filteredUniqueValues = uniqueValues.filter(v =>
      v.toLowerCase().includes(filterSearchText.toLowerCase())
    );
    const selectedCount = columnFilters[field]?.size || 0;
    const isDragging = draggedColumn === field;
    const isDragOver = dragOverColumn === field;
    const isCentered = centeredColumns.includes(field);

    return (
      <th
        draggable
        onDragStart={() => handleDragStart(field)}
        onDragOver={(e) => handleDragOver(e, field)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, field)}
        onDragEnd={handleDragEnd}
        className={`px-2 py-2 ${isCentered ? 'text-center' : 'text-left'} text-xs font-semibold text-primary-600 uppercase tracking-wider bg-primary-100 relative cursor-grab active:cursor-grabbing select-none transition-all ${
          isDragging ? 'opacity-50 bg-action-primary/20' : ''
        } ${isDragOver ? 'bg-action-primary/10 border-l-2 border-action-primary' : ''}`}
      >
        <div className={`flex items-center gap-1 ${isCentered ? 'justify-center' : ''}`}>
          {/* Drag handle + Sort button */}
          <button
            onClick={() => handleSort(field)}
            className={`flex items-center gap-1 hover:text-action-primary transition-colors ${isCentered ? '' : 'flex-1'} min-w-0`}
          >
            <span className="material-symbols-outlined text-xs text-primary-300 flex-shrink-0 mr-0.5">
              drag_indicator
            </span>
            <span className="truncate">{label}</span>
            {sortField === field && (
              <span className="material-symbols-outlined text-sm text-action-primary flex-shrink-0">
                {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
              </span>
            )}
          </button>

          {/* Filter button */}
          <button
            onClick={(e) => toggleFilterDropdown(field, e)}
            className={`p-0.5 rounded hover:bg-primary-200 transition-colors flex-shrink-0 ${
              hasFilter ? 'text-action-primary bg-action-primary/10' : 'text-primary-400'
            }`}
            title={hasFilter ? `Filtered (${selectedCount} selected)` : 'Filter'}
          >
            <span className="material-symbols-outlined text-sm">
              {hasFilter ? 'filter_alt' : 'filter_list'}
            </span>
          </button>
        </div>

        {/* Filter Dropdown */}
        {isOpen && (
          <div
            ref={filterDropdownRef}
            className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-border-default z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search within filter */}
            <div className="p-2 border-b border-border-default">
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm text-primary-400">
                  search
                </span>
                <input
                  type="text"
                  value={filterSearchText}
                  onChange={(e) => setFilterSearchText(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-7 pr-2 py-1.5 text-sm border border-border-default rounded focus:outline-none focus:ring-1 focus:ring-action-primary"
                  autoFocus
                />
              </div>
            </div>

            {/* Select All / Clear buttons */}
            <div className="px-2 py-1.5 border-b border-border-default flex gap-2">
              <button
                onClick={() => selectAllFilterValues(field)}
                className="text-xs text-action-primary hover:underline"
              >
                Select All
              </button>
              <span className="text-primary-300">|</span>
              <button
                onClick={() => clearFilterValues(field)}
                className="text-xs text-action-primary hover:underline"
              >
                Clear
              </button>
              {selectedCount > 0 && (
                <span className="text-xs text-primary-500 ml-auto">
                  {selectedCount} selected
                </span>
              )}
            </div>

            {/* Values list */}
            <div className="max-h-48 overflow-y-auto p-1">
              {filteredUniqueValues.length === 0 ? (
                <div className="px-2 py-3 text-sm text-primary-400 text-center">
                  No matching values
                </div>
              ) : (
                filteredUniqueValues.map((value) => {
                  const isSelected = columnFilters[field]?.has(value) || false;
                  return (
                    <label
                      key={value}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-primary-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleFilterValue(field, value)}
                        className="w-4 h-4 rounded border-primary-300 text-action-primary focus:ring-action-primary"
                      />
                      <span className="text-sm text-primary-700 truncate flex-1">
                        {value === '(empty)' ? <em className="text-primary-400">(empty)</em> : value}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        )}
      </th>
    );
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getQuantityColor = (qty: number) => {
    if (qty === 0) return 'text-red-600';
    if (qty <= 10) return 'text-orange-600';
    return 'text-green-600';
  };

  const openDetailModal = async (item: PPEInventoryItem) => {
    setSelectedItem(item);
    setIsEditMode(false);
    setEditForm({});
    setAdjustmentReason('count');
    setAdjustmentNote('');
    setAdjustmentQty(item.quantityOnHand);
    setSelectedUserId('');
    setUserSearchQuery('');
    setDetailModalTab('overview');
    setThresholdValue(item.lowStockThreshold ?? 10);
    setIsEditingThreshold(false);
    setIsDetailModalOpen(true);

    // Load issued records and activity logs for this item
    setIsLoadingIssued(true);
    setIsLoadingActivityLogs(true);
    try {
      const [records, logs] = await Promise.all([
        ppeApi.getIssuedRecords(item.sizeId),
        ppeApi.getActivityLog(item.sizeId),
      ]);
      setIssuedRecords(records);
      setActivityLogs(logs);
    } finally {
      setIsLoadingIssued(false);
      setIsLoadingActivityLogs(false);
    }
  };

  const startEditMode = () => {
    if (!selectedItem) return;
    setEditForm({ ...selectedItem });
    setIsEditMode(true);
  };

  const cancelEditMode = () => {
    setIsEditMode(false);
    setEditForm({});
  };

  const handleSaveThreshold = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      const updatedByName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Unknown';
      await ppeApi.updateItem(
        selectedItem.sizeId,
        { ...selectedItem, lowStockThreshold: thresholdValue },
        updatedByName,
        `Low stock threshold set to ${thresholdValue}`
      );
      // Update local state
      setSelectedItem({ ...selectedItem, lowStockThreshold: thresholdValue });
      setIsEditingThreshold(false);
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!selectedItem || !editForm) return;

    setIsSubmitting(true);
    try {
      const updatedByName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Unknown';
      await ppeApi.updateItem(
        selectedItem.sizeId,
        {
          ...editForm,
          quantityTotal: (editForm.quantityOnHand || 0) + (editForm.quantityOut || 0),
        },
        updatedByName,
        'Item details updated'
      );
      await loadData();
      setIsDetailModalOpen(false);
      setIsEditMode(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityAdjustment = async () => {
    if (!selectedItem) return;

    // For "issued" reason, require a user to be selected
    if (adjustmentReason === 'issued' && !selectedUserId) {
      return; // Don't proceed without a user
    }

    setIsSubmitting(true);
    try {
      let newQuantityOnHand = selectedItem.quantityOnHand;
      let newQuantityOut = selectedItem.quantityOut || 0;

      switch (adjustmentReason) {
        case 'count':
          // Direct count - set to the adjustment quantity
          newQuantityOnHand = adjustmentQty;
          break;
        case 'received':
          // Add to on-hand
          newQuantityOnHand = selectedItem.quantityOnHand + adjustmentQty;
          break;
        case 'damaged':
        case 'lost':
          // Remove from on-hand
          newQuantityOnHand = Math.max(0, selectedItem.quantityOnHand - adjustmentQty);
          break;
        case 'returned':
          // Return from out to on-hand
          newQuantityOut = Math.max(0, (selectedItem.quantityOut || 0) - adjustmentQty);
          newQuantityOnHand = selectedItem.quantityOnHand + adjustmentQty;
          break;
        case 'issued':
          // Issue from on-hand to out - also create an issued record
          newQuantityOnHand = Math.max(0, selectedItem.quantityOnHand - adjustmentQty);
          newQuantityOut = (selectedItem.quantityOut || 0) + adjustmentQty;

          // Create issued record for the selected user
          const selectedUser = users.find(u => u.id === selectedUserId);
          if (selectedUser) {
            await ppeApi.issueToUser(
              selectedItem.sizeId,
              selectedUser.id,
              `${selectedUser.firstName} ${selectedUser.lastName}`,
              adjustmentQty,
              currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Unknown',
              adjustmentNote || undefined,
              selectedUser.employeeId,
              selectedUser.department
            );
          }
          break;
        case 'other':
          // Apply as +/- adjustment (can be negative)
          newQuantityOnHand = Math.max(0, selectedItem.quantityOnHand + adjustmentQty);
          break;
      }

      // Determine update reason based on adjustment type
      const reasonMap: Record<string, string> = {
        restock: `Restocked +${adjustmentQty}`,
        count: `Inventory count adjustment`,
        issued: selectedUser ? `Issued to ${selectedUser.firstName} ${selectedUser.lastName}` : 'Issued',
        returned: `Returned +${adjustmentQty}`,
        damaged: `Damaged/Lost -${Math.abs(adjustmentQty)}`,
        other: adjustmentNote || `Adjusted ${adjustmentQty >= 0 ? '+' : ''}${adjustmentQty}`,
      };
      const updateReason = reasonMap[adjustmentReason] || 'Quantity adjusted';
      const updatedByName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Unknown';

      await ppeApi.updateItem(
        selectedItem.sizeId,
        {
          quantityOnHand: newQuantityOnHand,
          quantityOut: newQuantityOut,
          quantityTotal: newQuantityOnHand + newQuantityOut,
          status: newQuantityOnHand > 0 ? 'IN' : 'OUT',
        },
        updatedByName,
        updateReason
      );

      await loadData();
      setIsDetailModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter users for dropdown
  const filteredUsers = useMemo(() => {
    if (!userSearchQuery) return users;
    const query = userSearchQuery.toLowerCase();
    return users.filter(u =>
      u.firstName.toLowerCase().includes(query) ||
      u.lastName.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.employeeId?.toLowerCase().includes(query) ||
      u.department?.toLowerCase().includes(query)
    );
  }, [users, userSearchQuery]);

  // Get selected user info
  const selectedUser = useMemo(() => {
    return users.find(u => u.id === selectedUserId);
  }, [users, selectedUserId]);

  const openNewItemModal = () => {
    setNewItemForm({
      categoryName: '',
      itemTypeName: '',
      variantName: '',
      manufacturer: '',
      sizeName: '',
      femaCode: '',
      legacyId: '',
      quantityOnHand: 0,
      quantityOut: 0,
      quantityTotal: 0,
      status: 'IN',
    });
    setIsNewItemModalOpen(true);
  };

  const handleNewItemSubmit = async () => {
    if (!newItemForm.itemTypeName || !newItemForm.categoryName) {
      return; // Basic validation
    }

    setIsSubmitting(true);
    try {
      await ppeApi.createItem({
        categoryName: newItemForm.categoryName || '',
        itemTypeName: newItemForm.itemTypeName || '',
        variantId: `var-new-${Date.now()}`,
        variantName: newItemForm.variantName || newItemForm.manufacturer || '',
        manufacturer: newItemForm.manufacturer || '',
        sizeName: newItemForm.sizeName || 'One Size',
        femaCode: newItemForm.femaCode || '',
        legacyId: newItemForm.legacyId || '',
        quantityOnHand: newItemForm.quantityOnHand || 0,
        quantityOut: newItemForm.quantityOut || 0,
        quantityTotal: (newItemForm.quantityOnHand || 0) + (newItemForm.quantityOut || 0),
        status: newItemForm.status || 'IN',
        subcategory: newItemForm.subcategory,
        type: newItemForm.type,
        sizeDetail: newItemForm.sizeDetail,
        displayName: newItemForm.displayName,
        description: newItemForm.description,
        deployment: newItemForm.deployment,
        stockStatus: newItemForm.stockStatus,
        serialNumber: newItemForm.serialNumber,
        barcode: newItemForm.barcode,
      });

      // Reload data to show the new item
      await loadData();
      setIsNewItemModalOpen(false);
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
    <div className="space-y-4">
      {/* View Mode Tabs + Filters in One Row */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Left side: View Mode Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'inventory', label: 'All Items', icon: 'inventory_2', count: summary?.totalItems },
            { id: 'in-stock', label: 'In Stock', icon: 'check_circle', count: summary?.totalQuantityOnHand },
            { id: 'low-stock', label: 'Low Stock', icon: 'warning', count: summary?.lowStockItems },
            { id: 'out-of-stock', label: 'Out of Stock', icon: 'block', count: summary?.outOfStockItems },
            { id: 'issued', label: 'Issued', icon: 'person', count: summary?.issuedItems },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as ViewMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                viewMode === tab.id
                  ? 'bg-action-primary text-white'
                  : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${
                  viewMode === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-primary-200 text-primary-600'
                }`}>
                  {tab.count.toLocaleString()}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Right side: Search, Category, Columns */}
        <div className="flex flex-1 gap-2 items-center flex-wrap lg:justify-end">
          {/* Search */}
          <div className="relative flex-1 lg:flex-none lg:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 material-symbols-outlined text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary focus:border-transparent text-sm"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm"
          >
            <option value="">All Categories</option>
            {ppeCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Clear Filters Button */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-2 flex items-center gap-1 text-sm text-action-primary hover:bg-action-primary/10 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-lg">filter_alt_off</span>
              <span className="hidden sm:inline">Clear {activeFilterCount}</span>
            </button>
          )}

          {/* New Item Button */}
          <button
            onClick={openNewItemModal}
            className="px-3 py-2 flex items-center gap-1 text-sm bg-action-primary text-white rounded-lg hover:bg-action-hover transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span className="hidden sm:inline">New Item</span>
          </button>

          {/* Column Picker */}
          <div className="relative" ref={columnPickerRef}>
            <button
              onClick={() => setIsColumnPickerOpen(!isColumnPickerOpen)}
              className={`px-3 py-2 flex items-center gap-1 text-sm border rounded-lg transition-colors ${
                isColumnPickerOpen
                  ? 'bg-action-primary text-white border-action-primary'
                  : 'bg-white text-primary-600 border-border-default hover:bg-primary-50'
              }`}
              title="Select Columns"
            >
              <span className="material-symbols-outlined text-lg">view_column</span>
              <span className="hidden sm:inline">Columns</span>
              <span className="px-1.5 py-0.5 bg-primary-200/50 text-primary-700 rounded text-xs font-medium ml-1">
                {columnOrder.length}
              </span>
            </button>

            {/* Column Picker Dropdown */}
            {isColumnPickerOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-border-default z-50">
                {/* Header with actions */}
                <div className="px-3 py-2 border-b border-border-default flex items-center justify-between">
                  <span className="text-sm font-medium text-primary-700">Show Columns</span>
                  <div className="flex gap-2">
                    <button
                      onClick={showAllColumns}
                      className="text-xs text-action-primary hover:underline"
                    >
                      All
                    </button>
                    <span className="text-primary-300">|</span>
                    <button
                      onClick={resetToDefaultColumns}
                      className="text-xs text-action-primary hover:underline"
                    >
                      Default
                    </button>
                  </div>
                </div>

                {/* Column list */}
                <div className="max-h-72 overflow-y-auto p-1">
                  {ALL_COLUMNS.map((col) => {
                    const isVisible = visibleColumnsSet.has(col.field);
                    return (
                      <label
                        key={col.field}
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-primary-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isVisible}
                          onChange={() => toggleColumnVisibility(col.field)}
                          className="w-4 h-4 rounded border-primary-300 text-action-primary focus:ring-action-primary"
                        />
                        <span className="text-sm text-primary-700 flex-1">{col.label}</span>
                        {col.defaultVisible && (
                          <span className="text-[10px] text-primary-400 uppercase">default</span>
                        )}
                      </label>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="px-3 py-2 border-t border-border-default bg-primary-50 text-xs text-primary-500">
                  {columnOrder.length} of {ALL_COLUMNS.length} columns visible • Drag headers to reorder
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inventory List */}
      {filteredItems.length === 0 ? (
        <Card>
          <EmptyState
            title="No items found"
            description={
              activeFilterCount > 0
                ? 'Try adjusting your column filters'
                : viewMode === 'in-stock'
                ? 'No items currently have stock available'
                : viewMode === 'low-stock'
                ? 'No items are currently low on stock'
                : viewMode === 'out-of-stock'
                ? 'All items have stock available'
                : viewMode === 'issued'
                ? 'No items are currently issued out'
                : 'Try adjusting your search or filters'
            }
          />
        </Card>
      ) : (
        /* Spreadsheet View - Full width with frozen header */
        <div className="bg-white shadow-sm border border-border-default overflow-hidden rounded-lg">
          <div className="overflow-auto max-h-[calc(100vh-240px)]">
            <table className="w-full border-collapse">
              <thead className="bg-primary-100 sticky top-0 z-20 shadow-sm">
                <tr>
                  {visibleColumnsList.map((col) => (
                    <ColumnHeader key={col.field} field={col.field} label={col.label} />
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {sortedItems.map((item, index) => (
                  <tr
                    key={item.sizeId}
                    onClick={() => openDetailModal(item)}
                    className={`hover:bg-action-primary/5 transition-colors cursor-pointer ${
                      index % 2 === 0 ? 'bg-white' : 'bg-primary-50/40'
                    } ${
                      item.quantityOnHand <= 10 && item.quantityOnHand > 0
                        ? '!bg-orange-50'
                        : item.quantityOnHand === 0
                        ? '!bg-red-50'
                        : ''
                    }`}
                  >
                    {visibleColumnsList.map((col) => (
                      <td key={col.field} className="px-2 py-2 text-sm whitespace-nowrap">
                        {renderCellContent(item, col.field)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-border-default bg-primary-50 text-sm text-primary-600 flex justify-between items-center">
            <span>
              Showing {sortedItems.length} of {items.length} items
              {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active)`}
            </span>
            <span className="text-xs text-primary-400">Click row for details • Click header to sort • Drag headers to reorder</span>
          </div>
        </div>
      )}

      {/* Item Detail/Edit Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => { setIsDetailModalOpen(false); setIsEditMode(false); }}
        title={isEditMode ? 'Edit Item' : (selectedItem ? getDisplayName(selectedItem) : 'Item Details')}
        subtitle={!isEditMode && selectedItem ? `${selectedItem.manufacturer} • ${selectedItem.sizeName} • ${selectedItem.femaCode || 'No FEMA Code'}` : undefined}
        size="wide"
        footer={
          <div className="flex justify-between w-full">
            {!isEditMode ? (
              <>
                <button
                  onClick={startEditMode}
                  className="px-4 py-2 text-sm font-medium text-action-primary bg-action-primary/10 rounded-lg hover:bg-action-primary/20 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                  Edit Item
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-100 rounded-lg hover:bg-primary-200 transition-colors"
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={cancelEditMode}
                  className="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-100 rounded-lg hover:bg-primary-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-action-primary rounded-lg hover:bg-action-hover transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            )}
          </div>
        }
      >
        {selectedItem && !isEditMode && (
          <div className="space-y-3">
            {/* Compact Stats Row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-2 border-b border-border-default text-sm">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  getComputedStatus(selectedItem) === 'In Stock' ? 'bg-green-500' :
                  getComputedStatus(selectedItem) === 'Low Stock' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="font-medium text-primary-900">{getComputedStatus(selectedItem)}</span>
              </div>
              <div className="flex items-center gap-4 text-primary-600">
                <span><strong className="text-green-600">{selectedItem.quantityOnHand}</strong> on hand</span>
                <span><strong className="text-blue-600">{selectedItem.quantityOut || 0}</strong> issued</span>
                <span><strong className="text-primary-700">{selectedItem.quantityTotal || 0}</strong> total</span>
              </div>
              <button
                onClick={() => setIsEditingThreshold(true)}
                className="ml-auto flex items-center gap-1.5 text-xs text-primary-500 hover:text-primary-700 transition-colors group"
                title="Click to edit threshold"
              >
                <span className="material-symbols-outlined text-sm text-orange-500">warning</span>
                <span>Alert ≤ {selectedItem.lowStockThreshold ?? 10}</span>
                <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity">edit</span>
              </button>
            </div>

            {/* Tabs Navigation - Compact */}
            <div className="border-b border-border-default -mx-6 px-6">
              <nav className="flex gap-1">
                {([
                  { id: 'overview', label: 'Overview', icon: 'info' },
                  { id: 'history', label: 'History', icon: 'history', count: activityLogs.length },
                  { id: 'assignments', label: 'Assigned', icon: 'group', count: issuedRecords.length },
                ] as { id: DetailModalTab; label: string; icon: string; count?: number }[]).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setDetailModalTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                      detailModalTab === tab.id
                        ? 'border-action-primary text-action-primary'
                        : 'border-transparent text-primary-500 hover:text-primary-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">{tab.icon}</span>
                    {tab.label}
                    {tab.count !== undefined && tab.count > 0 && (
                      <span className={`px-1.5 py-0.5 text-xs rounded-full font-medium ${
                        tab.id === 'assignments' ? 'bg-purple-100 text-purple-700' : 'bg-primary-100 text-primary-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Threshold Edit Popover */}
            {isEditingThreshold && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-center gap-3">
                <span className="material-symbols-outlined text-orange-500">warning</span>
                <span className="text-sm text-primary-700">Alert when on-hand ≤</span>
                <input
                  type="number"
                  min="0"
                  value={thresholdValue}
                  onChange={(e) => setThresholdValue(parseInt(e.target.value) || 0)}
                  className="w-20 px-2 py-1 text-center border border-border-default rounded focus:outline-none focus:ring-2 focus:ring-action-primary text-sm"
                  autoFocus
                />
                <span className="text-sm text-primary-600">units</span>
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditingThreshold(false);
                      setThresholdValue(selectedItem.lowStockThreshold ?? 10);
                    }}
                    className="px-2 py-1 text-xs text-primary-600 hover:bg-orange-100 rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveThreshold}
                    disabled={isSubmitting}
                    className="px-3 py-1 text-xs font-medium text-white bg-action-primary rounded hover:bg-action-hover transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            )}

            {/* Tab Content */}
            {detailModalTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column - Item Details */}
                <div className="space-y-3">
                  {/* Compact Item Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-primary-400">category</span>
                      <span className="text-primary-600">{selectedItem.categoryName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-primary-400">tag</span>
                      <span className="font-mono text-primary-600">{selectedItem.legacyId || 'No ID'}</span>
                    </div>
                    {selectedItem.description && (
                      <div className="col-span-2 text-primary-500 text-sm">
                        {selectedItem.description}
                      </div>
                    )}
                  </div>

                  {/* Quick Links */}
                  <div className="flex items-center gap-4 pt-2 border-t border-border-default">
                    <button
                      onClick={() => setDetailModalTab('assignments')}
                      className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">group</span>
                      <span>{issuedRecords.length > 0 ? `${issuedRecords.length} assigned` : 'No assignments'}</span>
                    </button>
                    <button
                      onClick={() => setDetailModalTab('history')}
                      className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">history</span>
                      <span>View history</span>
                    </button>
                  </div>

                  {/* Identifiers (if present) */}
                  {(selectedItem.serialNumber || selectedItem.barcode) && (
                    <div className="pt-2 border-t border-border-default">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {selectedItem.serialNumber && (
                          <div>
                            <label className="block text-xs font-medium text-primary-500 uppercase">Serial Number</label>
                            <p className="mt-1 text-sm font-mono text-primary-900">{selectedItem.serialNumber}</p>
                          </div>
                        )}
                        {selectedItem.barcode && (
                          <div>
                            <label className="block text-xs font-medium text-primary-500 uppercase">Barcode</label>
                            <p className="mt-1 text-sm font-mono text-primary-900">{selectedItem.barcode}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Quantity Adjustment */}
                <div className="lg:border-l lg:border-border-default lg:pl-4">
                  <h4 className="text-sm font-semibold text-primary-900 mb-3">Adjust Quantity</h4>

              {/* Reason Buttons */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {([
                  { id: 'count', label: 'Count', icon: 'calculate', color: 'bg-primary-100 text-primary-700' },
                  { id: 'received', label: 'Received', icon: 'add_circle', color: 'bg-green-100 text-green-700' },
                  { id: 'damaged', label: 'Damaged', icon: 'broken_image', color: 'bg-orange-100 text-orange-700' },
                  { id: 'lost', label: 'Lost', icon: 'help', color: 'bg-red-100 text-red-700' },
                  { id: 'returned', label: 'Returned', icon: 'keyboard_return', color: 'bg-blue-100 text-blue-700' },
                  { id: 'issued', label: 'Issued', icon: 'arrow_forward', color: 'bg-purple-100 text-purple-700' },
                ] as { id: AdjustmentReason; label: string; icon: string; color: string }[]).map((reason) => (
                  <button
                    key={reason.id}
                    onClick={() => {
                      setAdjustmentReason(reason.id);
                      if (reason.id === 'count') {
                        setAdjustmentQty(selectedItem.quantityOnHand);
                      } else {
                        setAdjustmentQty(0);
                      }
                    }}
                    className={`p-2 rounded-lg text-xs font-medium border-2 transition-all flex flex-col items-center gap-1 ${
                      adjustmentReason === reason.id
                        ? 'border-action-primary ring-2 ring-action-primary/20 ' + reason.color
                        : 'border-transparent ' + reason.color + ' opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">{reason.icon}</span>
                    {reason.label}
                  </button>
                ))}
              </div>

              {/* Quantity Input */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    {adjustmentReason === 'count' ? 'New Count' : 'Quantity'}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAdjustmentQty(Math.max(0, adjustmentQty - 1))}
                      className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 flex items-center justify-center transition-colors"
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={adjustmentQty}
                      onChange={(e) => setAdjustmentQty(parseInt(e.target.value) || 0)}
                      className="flex-1 px-4 py-2 text-center text-lg font-semibold border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
                    />
                    <button
                      onClick={() => setAdjustmentQty(adjustmentQty + 1)}
                      className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 flex items-center justify-center transition-colors"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* User Selection for Issue */}
              {adjustmentReason === 'issued' && (
                <div className="mt-3">
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Issue To <span className="text-red-500">*</span>
                  </label>
                  <div className="relative" ref={userDropdownRef}>
                    {selectedUser ? (
                      <div className="flex items-center justify-between p-3 border border-purple-300 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm text-purple-700">person</span>
                          </div>
                          <div>
                            <div className="font-medium text-primary-900 text-sm">
                              {selectedUser.firstName} {selectedUser.lastName}
                            </div>
                            <div className="text-xs text-primary-500">
                              {selectedUser.employeeId && <span className="font-mono">{selectedUser.employeeId}</span>}
                              {selectedUser.employeeId && selectedUser.department && ' • '}
                              {selectedUser.department}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedUserId('');
                            setUserSearchQuery('');
                          }}
                          className="p-1 hover:bg-purple-200 rounded transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm text-primary-500">close</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-lg text-primary-400">
                            person_search
                          </span>
                          <input
                            type="text"
                            value={userSearchQuery}
                            onChange={(e) => {
                              setUserSearchQuery(e.target.value);
                              setShowUserDropdown(true);
                            }}
                            onFocus={() => setShowUserDropdown(true)}
                            placeholder="Search for personnel..."
                            className="w-full pl-10 pr-4 py-2.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                          />
                        </div>

                        {/* User Dropdown */}
                        {showUserDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-border-default z-50 max-h-48 overflow-y-auto">
                            {filteredUsers.length === 0 ? (
                              <div className="px-3 py-4 text-center text-sm text-primary-400">
                                No users found
                              </div>
                            ) : (
                              filteredUsers.slice(0, 10).map((user) => (
                                <button
                                  key={user.id}
                                  onClick={() => {
                                    setSelectedUserId(user.id);
                                    setUserSearchQuery('');
                                    setShowUserDropdown(false);
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-primary-50 transition-colors text-left"
                                >
                                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="material-symbols-outlined text-sm text-primary-600">person</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-primary-900 text-sm truncate">
                                      {user.firstName} {user.lastName}
                                    </div>
                                    <div className="text-xs text-primary-500 truncate">
                                      {user.employeeId && <span className="font-mono">{user.employeeId}</span>}
                                      {user.employeeId && user.department && ' • '}
                                      {user.department || user.email}
                                    </div>
                                  </div>
                                </button>
                              ))
                            )}
                            {filteredUsers.length > 10 && (
                              <div className="px-3 py-2 text-xs text-primary-400 text-center border-t border-border-default">
                                Type to narrow results ({filteredUsers.length - 10} more)
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Preview of change */}
              {adjustmentReason !== 'count' && adjustmentQty > 0 && (
                <div className="mt-3 p-3 bg-primary-50 rounded-lg text-sm">
                  <span className="text-primary-600">Result: </span>
                  <span className="font-semibold text-primary-900">
                    {adjustmentReason === 'received' && `${selectedItem.quantityOnHand} + ${adjustmentQty} = ${selectedItem.quantityOnHand + adjustmentQty} on hand`}
                    {adjustmentReason === 'damaged' && `${selectedItem.quantityOnHand} - ${adjustmentQty} = ${Math.max(0, selectedItem.quantityOnHand - adjustmentQty)} on hand`}
                    {adjustmentReason === 'lost' && `${selectedItem.quantityOnHand} - ${adjustmentQty} = ${Math.max(0, selectedItem.quantityOnHand - adjustmentQty)} on hand`}
                    {adjustmentReason === 'returned' && `${selectedItem.quantityOnHand} + ${adjustmentQty} = ${selectedItem.quantityOnHand + adjustmentQty} on hand, ${Math.max(0, (selectedItem.quantityOut || 0) - adjustmentQty)} out`}
                    {adjustmentReason === 'issued' && (
                      <>
                        {Math.max(0, selectedItem.quantityOnHand - adjustmentQty)} on hand, {(selectedItem.quantityOut || 0) + adjustmentQty} out
                        {selectedUser && (
                          <span className="block text-purple-600 mt-1">
                            → Issuing to {selectedUser.firstName} {selectedUser.lastName}
                          </span>
                        )}
                      </>
                    )}
                  </span>
                </div>
              )}
              {adjustmentReason === 'count' && adjustmentQty !== selectedItem.quantityOnHand && (
                <div className="mt-3 p-3 bg-primary-50 rounded-lg text-sm">
                  <span className="text-primary-600">Change: </span>
                  <span className={`font-semibold ${adjustmentQty > selectedItem.quantityOnHand ? 'text-green-600' : 'text-red-600'}`}>
                    {adjustmentQty > selectedItem.quantityOnHand ? '+' : ''}{adjustmentQty - selectedItem.quantityOnHand}
                  </span>
                </div>
              )}

              {/* Optional Note */}
              <div className="mt-3">
                <input
                  type="text"
                  value={adjustmentNote}
                  onChange={(e) => setAdjustmentNote(e.target.value)}
                  placeholder="Add a note (optional)"
                  className="w-full px-3 py-2 text-sm border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
                />
              </div>

              {/* Apply Button */}
              <button
                onClick={handleQuantityAdjustment}
                disabled={
                  isSubmitting ||
                  (adjustmentReason === 'count' && adjustmentQty === selectedItem.quantityOnHand) ||
                  (adjustmentReason !== 'count' && adjustmentQty === 0) ||
                  (adjustmentReason === 'issued' && !selectedUserId)
                }
                className="mt-4 w-full px-4 py-3 text-sm font-medium text-white bg-action-primary rounded-lg hover:bg-action-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">check</span>
                {isSubmitting ? 'Applying...' : adjustmentReason === 'issued' && !selectedUserId ? 'Select a Person to Issue To' : 'Apply Adjustment'}
              </button>
                </div>
              </div>
            )}

            {/* History Tab */}
            {detailModalTab === 'history' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-primary-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-blue-600">history</span>
                    Activity History
                  </h4>
                  <span className="text-xs text-primary-400">
                    {activityLogs.length} events
                  </span>
                </div>

                {isLoadingActivityLogs ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : activityLogs.length === 0 ? (
                  <div className="text-center py-8 text-primary-400 bg-primary-50 rounded-lg">
                    <span className="material-symbols-outlined text-3xl mb-2 block">history</span>
                    <p className="text-sm">No activity recorded for this item</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {activityLogs.map((log) => {
                      // Icon and color mapping for activity types
                      const activityStyles: Record<string, { icon: string; color: string; bg: string }> = {
                        created: { icon: 'add_circle', color: 'text-green-600', bg: 'bg-green-50' },
                        stock_received: { icon: 'inventory', color: 'text-green-600', bg: 'bg-green-50' },
                        stock_adjusted: { icon: 'tune', color: 'text-blue-600', bg: 'bg-blue-50' },
                        issued: { icon: 'arrow_forward', color: 'text-purple-600', bg: 'bg-purple-50' },
                        returned: { icon: 'keyboard_return', color: 'text-blue-600', bg: 'bg-blue-50' },
                        damaged: { icon: 'broken_image', color: 'text-orange-600', bg: 'bg-orange-50' },
                        lost: { icon: 'help', color: 'text-red-600', bg: 'bg-red-50' },
                        transferred: { icon: 'swap_horiz', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        count_updated: { icon: 'calculate', color: 'text-primary-600', bg: 'bg-primary-50' },
                        details_updated: { icon: 'edit', color: 'text-primary-600', bg: 'bg-primary-50' },
                      };
                      const style = activityStyles[log.activityType] || { icon: 'info', color: 'text-primary-600', bg: 'bg-primary-50' };

                      return (
                        <div
                          key={log.id}
                          className={`p-3 rounded-lg ${style.bg} border border-transparent hover:border-border-default transition-colors`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                              <span className={`material-symbols-outlined text-lg ${style.color}`}>{style.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-medium text-primary-900">{log.description}</p>
                                  {log.relatedUserName && (
                                    <p className="text-xs text-purple-600 mt-0.5 flex items-center gap-1">
                                      <span className="material-symbols-outlined text-xs">person</span>
                                      {log.relatedUserName}
                                    </p>
                                  )}
                                  {log.note && (
                                    <p className="text-xs text-primary-500 mt-1 italic">"{log.note}"</p>
                                  )}
                                </div>
                                {log.quantityChange !== undefined && (
                                  <span className={`text-sm font-semibold ${log.quantityChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {log.quantityChange >= 0 ? '+' : ''}{log.quantityChange}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-1.5 text-xs text-primary-400">
                                <span>{new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                <span>{new Date(log.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                                <span className="flex items-center gap-1">
                                  <span className="material-symbols-outlined text-xs">person</span>
                                  {log.performedBy}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Assignments Tab */}
            {detailModalTab === 'assignments' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-primary-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg text-purple-600">group</span>
                    Currently Issued To
                  </h4>
                  {issuedRecords.length > 0 && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                      {issuedRecords.reduce((sum, r) => sum + r.quantity, 0)} items to {issuedRecords.length} people
                    </span>
                  )}
                </div>

                {isLoadingIssued ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : issuedRecords.length === 0 ? (
                  <div className="text-center py-8 text-primary-400 bg-primary-50 rounded-lg">
                    <span className="material-symbols-outlined text-3xl mb-2 block">person_off</span>
                    <p className="text-sm">No items currently issued</p>
                    <p className="text-xs mt-1">Issue items from the Overview tab</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {issuedRecords.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-purple-700">person</span>
                          </div>
                          <div>
                            <div className="font-medium text-primary-900">{record.userName}</div>
                            <div className="text-sm text-primary-500">
                              {record.userEmployeeId && <span className="font-mono">{record.userEmployeeId}</span>}
                              {record.userEmployeeId && record.userDepartment && ' • '}
                              {record.userDepartment}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-purple-700 text-lg">×{record.quantity}</div>
                          <div className="text-xs text-primary-400">
                            Issued {new Date(record.issuedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          {record.issuedBy && (
                            <div className="text-xs text-primary-400">by {record.issuedBy}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Edit Mode */}
        {selectedItem && isEditMode && (() => {
          // Compute cascading dropdown options based on current form state
          const editSubcategoryOptions = getSubcategoriesForCategory(editForm.categoryName || '');
          const editManufacturerOptions = getManufacturersForCategory(editForm.categoryName || '');
          const editSizeOptions = getSizeOptions(
            editForm.categoryName || '',
            editForm.manufacturer,
            editForm.subcategory
          );
          const editIsOneSize = isOneSizeCategory(editForm.categoryName || '');

          return (
            <div className="space-y-3">
              {/* Row 1: Category, Subcategory, Manufacturer */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-primary-600 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editForm.categoryName || ''}
                    onChange={(e) => {
                      const newCategory = e.target.value;
                      const newIsOneSize = isOneSizeCategory(newCategory);
                      setEditForm({
                        ...editForm,
                        categoryName: newCategory,
                        subcategory: '', // Reset subcategory when category changes
                        sizeName: newIsOneSize ? 'One Size' : '', // Auto-set for one-size categories
                      });
                    }}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm"
                  >
                    <option value="">Select Category</option>
                    {ppeCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-600 mb-1">Subcategory</label>
                  <select
                    value={editForm.subcategory || ''}
                    onChange={(e) => setEditForm({ ...editForm, subcategory: e.target.value })}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm"
                    disabled={!editForm.categoryName}
                  >
                    <option value="">Select Subcategory</option>
                    {editSubcategoryOptions.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-600 mb-1">Manufacturer</label>
                  <select
                    value={editForm.manufacturer || ''}
                    onChange={(e) => {
                      const newManufacturer = e.target.value;
                      // Recalculate size options when manufacturer changes
                      const newSizeOptions = getSizeOptions(
                        editForm.categoryName || '',
                        newManufacturer,
                        editForm.subcategory
                      );
                      // Reset size if current size is not in new options
                      const shouldResetSize = editForm.sizeName && !newSizeOptions.includes(editForm.sizeName);
                      setEditForm({
                        ...editForm,
                        manufacturer: newManufacturer,
                        variantName: newManufacturer,
                        sizeName: shouldResetSize ? '' : editForm.sizeName,
                      });
                    }}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm"
                  >
                    <option value="">Select Manufacturer</option>
                    {editManufacturerOptions.map((mfr) => (
                      <option key={mfr} value={mfr}>{mfr}</option>
                    ))}
                    {editForm.manufacturer && !editManufacturerOptions.includes(editForm.manufacturer) && (
                      <option value={editForm.manufacturer}>{editForm.manufacturer}</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Row 2: Product Name, Size, Status */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-primary-600 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.itemTypeName || ''}
                    onChange={(e) => setEditForm({ ...editForm, itemTypeName: e.target.value })}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-600 mb-1">
                    Size {editIsOneSize && <span className="text-primary-400 text-[10px]">(auto)</span>}
                  </label>
                  <select
                    value={editForm.sizeName || ''}
                    onChange={(e) => setEditForm({ ...editForm, sizeName: e.target.value })}
                    className={`w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm ${
                      editIsOneSize ? 'bg-primary-50 text-primary-500' : ''
                    }`}
                    disabled={editIsOneSize}
                  >
                    <option value="">Select Size</option>
                    {editSizeOptions.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                    {editForm.sizeName && !editSizeOptions.includes(editForm.sizeName) && (
                      <option value={editForm.sizeName}>{editForm.sizeName}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-600 mb-1">Status</label>
                  <div className="flex gap-2 pt-0.5">
                    {(['IN', 'OUT', 'N/A'] as const).map((status) => (
                      <label key={status} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="editStatus"
                          checked={editForm.status === status}
                          onChange={() => setEditForm({ ...editForm, status })}
                          className="w-3.5 h-3.5 text-action-primary focus:ring-action-primary"
                        />
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                          status === 'IN' ? 'bg-green-100 text-green-800' :
                          status === 'OUT' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {status}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: FEMA Code, Item ID, Type */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-primary-600 mb-1">FEMA Code</label>
                  <input
                    type="text"
                    value={editForm.femaCode || ''}
                    onChange={(e) => setEditForm({ ...editForm, femaCode: e.target.value })}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-600 mb-1">Item ID</label>
                  <input
                    type="text"
                    value={editForm.legacyId || ''}
                    onChange={(e) => setEditForm({ ...editForm, legacyId: e.target.value })}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-600 mb-1">Type</label>
                  <input
                    type="text"
                    value={editForm.type || ''}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm"
                    placeholder="e.g., Bottoms, Tops"
                  />
                </div>
              </div>

              {/* Row 4: Quantities (compact inline) */}
              <div className="flex items-end gap-3 pt-2 border-t border-border-default">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-primary-600 mb-1">On Hand</label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.quantityOnHand || 0}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value) || 0;
                      setEditForm({
                        ...editForm,
                        quantityOnHand: qty,
                        quantityTotal: qty + (editForm.quantityOut || 0),
                      });
                    }}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-primary-600 mb-1">Issued Out</label>
                  <input
                    type="number"
                    min="0"
                    value={editForm.quantityOut || 0}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value) || 0;
                      setEditForm({
                        ...editForm,
                        quantityOut: qty,
                        quantityTotal: (editForm.quantityOnHand || 0) + qty,
                      });
                    }}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-primary-600 mb-1">Total</label>
                  <input
                    type="number"
                    value={(editForm.quantityOnHand || 0) + (editForm.quantityOut || 0)}
                    disabled
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg bg-primary-50 text-primary-500 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-primary-600 mb-1">Serial #</label>
                  <input
                    type="text"
                    value={editForm.serialNumber || ''}
                    onChange={(e) => setEditForm({ ...editForm, serialNumber: e.target.value })}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm font-mono"
                    placeholder="Optional"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-primary-600 mb-1">Barcode</label>
                  <input
                    type="text"
                    value={editForm.barcode || ''}
                    onChange={(e) => setEditForm({ ...editForm, barcode: e.target.value })}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm font-mono"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* New Item Modal */}
      <Modal
        isOpen={isNewItemModalOpen}
        onClose={() => setIsNewItemModalOpen(false)}
        title="Add New Item"
        size="wide"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsNewItemModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-100 rounded-lg hover:bg-primary-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleNewItemSubmit}
              disabled={isSubmitting || !newItemForm.itemTypeName || !newItemForm.categoryName}
              className="px-4 py-2 text-sm font-medium text-white bg-action-primary rounded-lg hover:bg-action-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        }
      >
        {(() => {
          // Compute cascading dropdown options based on current form state
          const newSubcategoryOptions = getSubcategoriesForCategory(newItemForm.categoryName || '');
          const newManufacturerOptions = getManufacturersForCategory(newItemForm.categoryName || '');
          const newSizeOptions = getSizeOptions(
            newItemForm.categoryName || '',
            newItemForm.manufacturer,
            newItemForm.subcategory
          );
          const newIsOneSize = isOneSizeCategory(newItemForm.categoryName || '');

          return (
            <div className="space-y-3">
              {/* Row 1: Category, Subcategory, Manufacturer */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-primary-600 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newItemForm.categoryName || ''}
                    onChange={(e) => {
                      const newCategory = e.target.value;
                      const oneSizeCategory = isOneSizeCategory(newCategory);
                      setNewItemForm({
                        ...newItemForm,
                        categoryName: newCategory,
                        subcategory: '',
                        sizeName: oneSizeCategory ? 'One Size' : '',
                      });
                    }}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm"
                  >
                    <option value="">Select Category</option>
                    {ppeCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-600 mb-1">Subcategory</label>
                  <select
                    value={newItemForm.subcategory || ''}
                    onChange={(e) => setNewItemForm({ ...newItemForm, subcategory: e.target.value })}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm"
                    disabled={!newItemForm.categoryName}
                  >
                    <option value="">Select Subcategory</option>
                    {newSubcategoryOptions.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-600 mb-1">Manufacturer</label>
                  <select
                    value={newItemForm.manufacturer || ''}
                    onChange={(e) => {
                      const newMfr = e.target.value;
                      const newSizes = getSizeOptions(newItemForm.categoryName || '', newMfr, newItemForm.subcategory);
                      const resetSize = newItemForm.sizeName && !newSizes.includes(newItemForm.sizeName);
                      setNewItemForm({
                        ...newItemForm,
                        manufacturer: newMfr,
                        variantName: newMfr,
                        sizeName: resetSize ? '' : newItemForm.sizeName,
                      });
                    }}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm"
                  >
                    <option value="">Select Manufacturer</option>
                    {newManufacturerOptions.map((mfr) => (
                      <option key={mfr} value={mfr}>{mfr}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Product Name, Size, Status */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-primary-600 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newItemForm.itemTypeName || ''}
                    onChange={(e) => setNewItemForm({ ...newItemForm, itemTypeName: e.target.value })}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm"
                    placeholder="e.g., BDU Pants"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-600 mb-1">
                    Size {newIsOneSize && <span className="text-primary-400 text-[10px]">(auto)</span>}
                  </label>
                  <select
                    value={newItemForm.sizeName || ''}
                    onChange={(e) => setNewItemForm({ ...newItemForm, sizeName: e.target.value })}
                    className={`w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm ${
                      newIsOneSize ? 'bg-primary-50 text-primary-500' : ''
                    }`}
                    disabled={newIsOneSize}
                  >
                    <option value="">Select Size</option>
                    {newSizeOptions.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-600 mb-1">Status</label>
                  <div className="flex gap-2 pt-0.5">
                    {(['IN', 'OUT', 'N/A'] as const).map((status) => (
                      <label key={status} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="newStatus"
                          checked={newItemForm.status === status}
                          onChange={() => setNewItemForm({ ...newItemForm, status })}
                          className="w-3.5 h-3.5 text-action-primary focus:ring-action-primary"
                        />
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                          status === 'IN' ? 'bg-green-100 text-green-800' :
                          status === 'OUT' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {status}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: FEMA Code, Item ID, Type */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-primary-600 mb-1">FEMA Code</label>
                  <input
                    type="text"
                    value={newItemForm.femaCode || ''}
                    onChange={(e) => setNewItemForm({ ...newItemForm, femaCode: e.target.value })}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm font-mono"
                    placeholder="e.g., LG-0120.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-600 mb-1">Item ID</label>
                  <input
                    type="text"
                    value={newItemForm.legacyId || ''}
                    onChange={(e) => setNewItemForm({ ...newItemForm, legacyId: e.target.value })}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm font-mono"
                    placeholder="e.g., LG-0120.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-primary-600 mb-1">Type</label>
                  <input
                    type="text"
                    value={newItemForm.type || ''}
                    onChange={(e) => setNewItemForm({ ...newItemForm, type: e.target.value })}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm"
                    placeholder="e.g., Bottoms, Tops"
                  />
                </div>
              </div>

              {/* Row 4: Quantities and identifiers */}
              <div className="flex items-end gap-3 pt-2 border-t border-border-default">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-primary-600 mb-1">On Hand</label>
                  <input
                    type="number"
                    min="0"
                    value={newItemForm.quantityOnHand || 0}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value) || 0;
                      setNewItemForm({
                        ...newItemForm,
                        quantityOnHand: qty,
                        quantityTotal: qty + (newItemForm.quantityOut || 0),
                      });
                    }}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-primary-600 mb-1">Issued Out</label>
                  <input
                    type="number"
                    min="0"
                    value={newItemForm.quantityOut || 0}
                    onChange={(e) => {
                      const qty = parseInt(e.target.value) || 0;
                      setNewItemForm({
                        ...newItemForm,
                        quantityOut: qty,
                        quantityTotal: (newItemForm.quantityOnHand || 0) + qty,
                      });
                    }}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-primary-600 mb-1">Total</label>
                  <input
                    type="number"
                    value={(newItemForm.quantityOnHand || 0) + (newItemForm.quantityOut || 0)}
                    disabled
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg bg-primary-50 text-primary-500 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-primary-600 mb-1">Serial #</label>
                  <input
                    type="text"
                    value={newItemForm.serialNumber || ''}
                    onChange={(e) => setNewItemForm({ ...newItemForm, serialNumber: e.target.value })}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm font-mono"
                    placeholder="Optional"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-primary-600 mb-1">Barcode</label>
                  <input
                    type="text"
                    value={newItemForm.barcode || ''}
                    onChange={(e) => setNewItemForm({ ...newItemForm, barcode: e.target.value })}
                    className="w-full px-2 py-1.5 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary text-sm font-mono"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

export default PPEInventory;
