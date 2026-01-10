import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Modal, EmptyState } from '../../components/ui';
import { ppeApi, PPEInventoryItem, PPEInventorySummary, PPEIssuedRecord, PPEActivityLog, usersApi, GroupedProduct, groupInventoryByProduct } from '../../services/api';
import { ppeCategories } from '../../data/ppe-seed-data';
import { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { SizeQuantityGrid } from '../../components/warehouse/SizeQuantityGrid';
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

  // Size grid pending changes state (for batch save)
  const [pendingQuantityChanges, setPendingQuantityChanges] = useState<Record<string, number>>({});
  const [isSavingBatch, setIsSavingBatch] = useState(false);

  // Grouped view state (one row per product instead of per size)
  const [isGroupedView, setIsGroupedView] = useState(true); // Default to grouped view
  const [selectedProduct, setSelectedProduct] = useState<GroupedProduct | null>(null);

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

  // Grouped products (one row per product instead of per size)
  const groupedProducts = useMemo(() => {
    const grouped = groupInventoryByProduct(filteredItems);
    // Sort by product name or other field
    return grouped.sort((a, b) => {
      if (sortField === 'itemTypeName') {
        return sortDirection === 'asc'
          ? a.itemTypeName.localeCompare(b.itemTypeName)
          : b.itemTypeName.localeCompare(a.itemTypeName);
      }
      if (sortField === 'categoryName') {
        return sortDirection === 'asc'
          ? a.categoryName.localeCompare(b.categoryName)
          : b.categoryName.localeCompare(a.categoryName);
      }
      if (sortField === 'manufacturer') {
        return sortDirection === 'asc'
          ? a.manufacturer.localeCompare(b.manufacturer)
          : b.manufacturer.localeCompare(a.manufacturer);
      }
      if (sortField === 'quantityOnHand') {
        return sortDirection === 'asc'
          ? a.totalOnHand - b.totalOnHand
          : b.totalOnHand - a.totalOnHand;
      }
      if (sortField === 'quantityOut') {
        return sortDirection === 'asc'
          ? a.totalOut - b.totalOut
          : b.totalOut - a.totalOut;
      }
      // Default sort by name
      return a.itemTypeName.localeCompare(b.itemTypeName);
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
    setSelectedProduct(null); // Clear grouped product selection
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

  // Open detail modal for a grouped product (shows all sizes)
  const openGroupedProductModal = async (product: GroupedProduct) => {
    setSelectedProduct(product);
    setSelectedItem(product.sizes[0]); // Select first size as default for edit operations
    setIsEditMode(false);
    setEditForm({});
    setAdjustmentReason('count');
    setAdjustmentNote('');
    setAdjustmentQty(product.sizes[0]?.quantityOnHand || 0);
    setSelectedUserId('');
    setUserSearchQuery('');
    setDetailModalTab('overview');
    setThresholdValue(product.sizes[0]?.lowStockThreshold ?? 10);
    setIsEditingThreshold(false);
    setPendingQuantityChanges({}); // Clear pending changes
    setIsDetailModalOpen(true);

    // Load issued records and activity logs for ALL sizes in this product
    setIsLoadingIssued(true);
    setIsLoadingActivityLogs(true);
    try {
      const allRecords: PPEIssuedRecord[] = [];
      const allLogs: PPEActivityLog[] = [];

      await Promise.all(
        product.sizes.map(async (size) => {
          const [records, logs] = await Promise.all([
            ppeApi.getIssuedRecords(size.sizeId),
            ppeApi.getActivityLog(size.sizeId),
          ]);
          allRecords.push(...records);
          allLogs.push(...logs);
        })
      );

      // Sort logs by date descending
      allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setIssuedRecords(allRecords);
      setActivityLogs(allLogs);
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

  // Handle batch save of pending quantity changes from size grid
  const handleBatchSaveQuantities = async () => {
    if (Object.keys(pendingQuantityChanges).length === 0) return;

    setIsSavingBatch(true);
    try {
      const updatedByName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Unknown';

      // Save each pending change
      for (const [sizeId, newQuantityOnHand] of Object.entries(pendingQuantityChanges)) {
        // Find the original item to get current quantityOut
        const originalItem = items.find(i => i.sizeId === sizeId);
        const quantityOut = originalItem?.quantityOut || 0;

        await ppeApi.updateItem(
          sizeId,
          {
            quantityOnHand: newQuantityOnHand,
            quantityTotal: newQuantityOnHand + quantityOut,
            status: newQuantityOnHand > 0 ? 'IN' : 'OUT',
          },
          updatedByName,
          'Batch quantity adjustment'
        );
      }

      // Clear pending changes and refresh data
      setPendingQuantityChanges({});
      await loadData();

      // Refresh the selected item if it was updated
      if (selectedItem && pendingQuantityChanges[selectedItem.sizeId] !== undefined) {
        const updatedItem = await ppeApi.getInventoryBySizeId(selectedItem.sizeId);
        if (updatedItem) {
          setSelectedItem(updatedItem);
        }
      }
    } finally {
      setIsSavingBatch(false);
    }
  };

  // Clear pending changes when modal closes
  const handleCloseDetailModal = () => {
    // If there are unsaved changes, confirm before closing
    if (Object.keys(pendingQuantityChanges).length > 0) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        return;
      }
    }
    setPendingQuantityChanges({});
    setIsDetailModalOpen(false);
    setIsEditMode(false);
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

          {/* Grouped/Flat View Toggle */}
          <button
            onClick={() => setIsGroupedView(!isGroupedView)}
            className={`px-3 py-2 flex items-center gap-1 text-sm border rounded-lg transition-colors ${
              isGroupedView
                ? 'bg-action-primary text-white border-action-primary'
                : 'bg-white text-primary-600 border-border-default hover:bg-primary-50'
            }`}
            title={isGroupedView ? 'Switch to flat view (one row per size)' : 'Switch to grouped view (one row per product)'}
          >
            <span className="material-symbols-outlined text-lg">
              {isGroupedView ? 'view_list' : 'view_module'}
            </span>
            <span className="hidden sm:inline">{isGroupedView ? 'Grouped' : 'Flat'}</span>
          </button>
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
      ) : isGroupedView ? (
        /* Grouped View - One row per product */
        <div className="bg-white shadow-sm border border-border-default overflow-hidden rounded-lg">
          <div className="overflow-auto max-h-[calc(100vh-240px)]">
            <table className="w-full border-collapse">
              <thead className="bg-primary-100 sticky top-0 z-20 shadow-sm">
                <tr>
                  <th
                    className="px-3 py-2 text-left text-xs font-semibold text-primary-700 cursor-pointer hover:bg-primary-200 select-none"
                    onClick={() => handleSort('itemTypeName')}
                  >
                    <div className="flex items-center gap-1">
                      Product Name
                      {sortField === 'itemTypeName' && (
                        <span className="material-symbols-outlined text-sm">
                          {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-3 py-2 text-left text-xs font-semibold text-primary-700 cursor-pointer hover:bg-primary-200 select-none"
                    onClick={() => handleSort('manufacturer')}
                  >
                    <div className="flex items-center gap-1">
                      Manufacturer
                      {sortField === 'manufacturer' && (
                        <span className="material-symbols-outlined text-sm">
                          {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-3 py-2 text-left text-xs font-semibold text-primary-700 cursor-pointer hover:bg-primary-200 select-none"
                    onClick={() => handleSort('categoryName')}
                  >
                    <div className="flex items-center gap-1">
                      Category
                      {sortField === 'categoryName' && (
                        <span className="material-symbols-outlined text-sm">
                          {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-primary-700">
                    Sizes
                  </th>
                  <th
                    className="px-3 py-2 text-right text-xs font-semibold text-primary-700 cursor-pointer hover:bg-primary-200 select-none"
                    onClick={() => handleSort('quantityOnHand')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      On Hand
                      {sortField === 'quantityOnHand' && (
                        <span className="material-symbols-outlined text-sm">
                          {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-3 py-2 text-right text-xs font-semibold text-primary-700 cursor-pointer hover:bg-primary-200 select-none"
                    onClick={() => handleSort('quantityOut')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Issued
                      {sortField === 'quantityOut' && (
                        <span className="material-symbols-outlined text-sm">
                          {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-semibold text-primary-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {groupedProducts.map((product, index) => (
                  <tr
                    key={product.variantId}
                    onClick={() => openGroupedProductModal(product)}
                    className={`hover:bg-action-primary/5 transition-colors cursor-pointer ${
                      index % 2 === 0 ? 'bg-white' : 'bg-primary-50/40'
                    } ${
                      product.hasLowStock && !product.hasOutOfStock
                        ? '!bg-amber-50'
                        : product.hasOutOfStock
                        ? '!bg-red-50'
                        : ''
                    }`}
                  >
                    <td className="px-3 py-2.5 text-sm">
                      <div className="font-medium text-primary-900">{product.itemTypeName}</div>
                      {product.femaCode && (
                        <div className="text-xs text-primary-500">{product.femaCode}</div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-primary-600">{product.manufacturer}</td>
                    <td className="px-3 py-2.5 text-sm text-primary-600">
                      <div>{product.categoryName}</div>
                      {product.subcategory && (
                        <div className="text-xs text-primary-400">{product.subcategory}</div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                        {product.sizeCount} {product.sizeCount === 1 ? 'size' : 'sizes'}
                      </span>
                      {(product.lowStockCount > 0 || product.outOfStockCount > 0) && (
                        <div className="flex items-center justify-center gap-1 mt-1 text-xs">
                          {product.outOfStockCount > 0 && (
                            <span className="text-red-600">{product.outOfStockCount} out</span>
                          )}
                          {product.lowStockCount > 0 && (
                            <span className="text-amber-600">{product.lowStockCount} low</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-sm text-right">
                      <span className={`font-semibold ${
                        product.totalOnHand === 0 ? 'text-red-600' :
                        product.hasLowStock ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {product.totalOnHand}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-right">
                      <span className="text-sky-600 font-medium">{product.totalOut}</span>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.overallStatus === 'Out of Stock'
                          ? 'bg-red-100 text-red-700'
                          : product.overallStatus === 'Low Stock'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          product.overallStatus === 'Out of Stock'
                            ? 'bg-red-500'
                            : product.overallStatus === 'Low Stock'
                            ? 'bg-amber-500'
                            : 'bg-green-500'
                        }`} />
                        {product.overallStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2 border-t border-border-default bg-primary-50 text-sm text-primary-600 flex justify-between items-center">
            <span>
              Showing {groupedProducts.length} products ({sortedItems.length} total sizes)
              {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active)`}
            </span>
            <span className="text-xs text-primary-400">Click row to view all sizes • Click header to sort</span>
          </div>
        </div>
      ) : (
        /* Flat View - One row per size (original) */
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
        onClose={handleCloseDetailModal}
        title={
          isEditMode
            ? 'Edit Item'
            : selectedProduct
            ? selectedProduct.itemTypeName
            : selectedItem
            ? getDisplayName(selectedItem)
            : 'Item Details'
        }
        subtitle={
          !isEditMode && selectedItem
            ? (() => {
                // Line 1: Manufacturer • Category › Subcategory • X sizes
                const sizeCount = selectedProduct ? selectedProduct.sizeCount : 1;
                const line1Parts = [
                  selectedItem.manufacturer || 'Unknown',
                  selectedItem.subcategory
                    ? `${selectedItem.categoryName} › ${selectedItem.subcategory}`
                    : selectedItem.categoryName,
                  `${sizeCount} size${sizeCount !== 1 ? 's' : ''}`,
                ];
                const line1 = line1Parts.join(' • ');

                // Line 2: FEMA Code • Item ID
                const line2Parts = [
                  selectedItem.femaCode && `FEMA: ${selectedItem.femaCode}`,
                  selectedItem.legacyId && `ID: ${selectedItem.legacyId}`,
                ].filter(Boolean);
                const line2 = line2Parts.length > 0 ? line2Parts.join(' • ') : null;

                return line2 ? `${line1}\n${line2}` : line1;
              })()
            : undefined
        }
        size="wide"
        footer={
          <div className="flex items-center justify-between w-full">
            {!isEditMode ? (
              <>
                <div className="flex items-center gap-3">
                  <button
                    onClick={startEditMode}
                    className="px-4 py-2 text-sm font-medium text-action-primary bg-action-primary/10 rounded-lg hover:bg-action-primary/20 transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                    Edit Item
                  </button>
                  {Object.keys(pendingQuantityChanges).length > 0 && (
                    <span className="text-sm text-yellow-700 bg-yellow-100 px-3 py-1.5 rounded-full">
                      {Object.keys(pendingQuantityChanges).length} unsaved {Object.keys(pendingQuantityChanges).length === 1 ? 'change' : 'changes'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCloseDetailModal}
                    className="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-100 rounded-lg hover:bg-primary-200 transition-colors"
                  >
                    {Object.keys(pendingQuantityChanges).length > 0 ? 'Cancel' : 'Close'}
                  </button>
                  {Object.keys(pendingQuantityChanges).length > 0 && (
                    <button
                      onClick={handleBatchSaveQuantities}
                      disabled={isSavingBatch}
                      className="px-4 py-2 text-sm font-medium text-white bg-action-primary rounded-lg hover:bg-action-hover transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">save</span>
                      {isSavingBatch ? 'Saving...' : 'Save Changes'}
                    </button>
                  )}
                </div>
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
          <div className="space-y-3 h-[580px] flex flex-col">
            {/* Unified Stats Bar - Variant Counts */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              {/* Variant Counts */}
              {selectedProduct ? (
                <div className="flex items-center gap-3 text-sm">
                  {(() => {
                    const okCount = selectedProduct.sizeCount - selectedProduct.lowStockCount - selectedProduct.outOfStockCount;
                    return (
                      <>
                        {okCount > 0 && (
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500" />
                            <strong className="text-green-600">{okCount}</strong>
                            <span className="text-primary-500">{okCount === 1 ? 'size' : 'sizes'} OK</span>
                          </span>
                        )}
                        {selectedProduct.lowStockCount > 0 && (
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            <strong className="text-amber-600">{selectedProduct.lowStockCount}</strong>
                            <span className="text-primary-500">{selectedProduct.lowStockCount === 1 ? 'size' : 'sizes'} low</span>
                          </span>
                        )}
                        {selectedProduct.outOfStockCount > 0 && (
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <strong className="text-red-600">{selectedProduct.outOfStockCount}</strong>
                            <span className="text-primary-500">{selectedProduct.outOfStockCount === 1 ? 'size' : 'sizes'} out</span>
                          </span>
                        )}
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="flex items-center gap-4 text-primary-600">
                  <span>
                    <strong className="text-green-600">{selectedItem.quantityOnHand}</strong> on hand
                  </span>
                  <span>
                    <strong className="text-sky-600">{selectedItem.quantityOut || 0}</strong> issued
                  </span>
                </div>
              )}
              {!selectedProduct && (
                <button
                  onClick={() => setIsEditingThreshold(true)}
                  className="ml-auto flex items-center gap-1.5 text-xs text-primary-500 hover:text-primary-700 transition-colors group"
                  title="Click to edit threshold"
                >
                  <span className="material-symbols-outlined text-sm text-orange-500">warning</span>
                  <span>Alert ≤ {selectedItem.lowStockThreshold ?? 10}</span>
                  <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity">edit</span>
                </button>
              )}
            </div>

            {/* Tabs Navigation - Compact */}
            <div className="border-b border-border-default -mx-6 px-6">
              <nav className="flex gap-1">
                {([
                  { id: 'overview', label: 'Overview', icon: 'info' },
                  { id: 'history', label: 'History', icon: 'history', count: activityLogs.length },
                  { id: 'assignments', label: 'Assignments', icon: 'group', count: issuedRecords.length },
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

            {/* Tab Content - Fixed height to prevent modal size jumping */}
            <div className="flex-1 overflow-y-auto">
            {detailModalTab === 'overview' && (
              <div className="space-y-4">
                {/* Size Quantity Grid - Full Width */}
                <div>
                  <h4 className="text-sm font-semibold text-primary-900 mb-3">All Sizes</h4>
                  <SizeQuantityGrid
                    selectedItem={selectedItem}
                    pendingChanges={pendingQuantityChanges}
                    onPendingChangesUpdate={setPendingQuantityChanges}
                  />
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
            <div className="space-y-3 h-[580px]">
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
