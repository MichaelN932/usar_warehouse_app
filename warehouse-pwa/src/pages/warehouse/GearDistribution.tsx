import { useState, useEffect, useCallback } from 'react';
import { User, Request, RequestStatus, CatalogItem } from '../../types';
import { usersApi, ppeApi, PPEInventoryItem, PPEIssuedRecord, requestsApi, catalogApi } from '../../services/api';
import { Icon } from '../../components/ui/Icon';
import { Modal } from '../../components/ui/Modal';
import { StatusBadge } from '../../components/ui';
import {
  NEW_MEMBER_KIT,
  SizeCategory
} from '../../data/new-member-kit-template';
import { getSizeOptions } from '../../utils/size-mappings';
import { NewMemberKitForm } from '../../components/warehouse/NewMemberKitForm';

// Tab types for the main navigation
type TabType = 'queue' | 'checkout' | 'return' | 'newmember';

// Cart item for distribution
interface CartItem {
  id: string;
  itemName: string;
  category: string;
  size: string;
  sizeCategory: SizeCategory;
  quantity: number;
  isIssued: boolean;
  notes?: string;
  // For linking to inventory
  sizeId?: string;
  inventoryItem?: PPEInventoryItem;
  // For returns
  issuedRecordId?: string;
  returnCondition?: 'Serviceable' | 'NeedsRepair' | 'Dispose';
}

// Return item from issued records
interface ReturnItem extends PPEIssuedRecord {
  selected: boolean;
  returnCondition: 'Serviceable' | 'NeedsRepair' | 'Dispose';
  returnQuantity: number;
}

export function GearDistribution() {
  // Active tab state
  const [activeTab, setActiveTab] = useState<TabType>('queue');

  // State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notes, setNotes] = useState('');

  // Return mode state
  const [userIssuedItems, setUserIssuedItems] = useState<ReturnItem[]>([]);
  const [loadingIssuedItems, setLoadingIssuedItems] = useState(false);

  // Inventory search for adding items
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<PPEInventoryItem[]>([]);
  const [inventorySearch, setInventorySearch] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [completedItems, setCompletedItems] = useState<CartItem[]>([]);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Request Queue state
  const [requests, setRequests] = useState<Request[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [queueFilter, setQueueFilter] = useState<'all' | 'pending' | 'approved' | 'ready'>('all');
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);

  // Search users
  const searchUsers = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await usersApi.search(query);
      setSearchResults(results.filter(u => u.isActive));
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userSearch) {
        searchUsers(userSearch);
        setShowSearchResults(true);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [userSearch, searchUsers]);

  // Load request queue on mount
  useEffect(() => {
    loadRequestQueue();
  }, []);

  const loadRequestQueue = async () => {
    setLoadingRequests(true);
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
    } catch (err) {
      console.error('Error loading requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Load user's issued items when user selected and on return tab
  useEffect(() => {
    if (selectedUser && activeTab === 'return') {
      loadUserIssuedItems(selectedUser.id);
    }
  }, [selectedUser, activeTab]);

  const loadUserIssuedItems = async (userId: string) => {
    setLoadingIssuedItems(true);
    try {
      const records = await ppeApi.getIssuedRecordsByUser(userId);
      setUserIssuedItems(records.map(r => ({
        ...r,
        selected: false,
        returnCondition: 'Serviceable' as const,
        returnQuantity: r.quantity,
      })));
    } catch (err) {
      console.error('Error loading issued items:', err);
    } finally {
      setLoadingIssuedItems(false);
    }
  };

  // Load inventory for add item modal
  useEffect(() => {
    if (showAddItemModal) {
      loadInventory();
    }
  }, [showAddItemModal]);

  const loadInventory = async () => {
    try {
      const items = await ppeApi.getInventory({ status: 'IN' });
      setInventoryItems(items.filter(i => i.quantityOnHand > 0));
    } catch (err) {
      console.error('Error loading inventory:', err);
    }
  };

  // Select a user
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setUserSearch('');
    setSearchResults([]);
    setShowSearchResults(false);
    // Clear cart when changing users
    setCart([]);
    setUserIssuedItems([]);
  };

  // Clear selected user
  const handleClearUser = () => {
    setSelectedUser(null);
    setCart([]);
    setUserIssuedItems([]);
  };

  // Handle completion of new member kit form
  const handleNewMemberKitComplete = async (formItems: Array<{
    kitItemId: string;
    included: boolean;
    selectedBrand?: string;
    selectedSize?: string;
    quantity: number;
  }>) => {
    if (!selectedUser) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Convert form items to cart items for display
      const kitItems: CartItem[] = [];

      for (const formItem of formItems) {
        const templateItem = NEW_MEMBER_KIT.find(i => i.id === formItem.kitItemId);
        if (!templateItem) continue;

        // Determine size category based on selected brand or default
        let sizeCategory: SizeCategory = 'oneSize';
        if (templateItem.sizing.type === 'sized') {
          if (formItem.selectedBrand && templateItem.sizing.brandOptions) {
            const brandOption = templateItem.sizing.brandOptions.find(b => b.brand === formItem.selectedBrand);
            sizeCategory = brandOption?.sizeCategory || templateItem.sizing.defaultSizeCategory || 'clothing';
          } else {
            sizeCategory = templateItem.sizing.defaultSizeCategory || 'clothing';
          }
        }

        kitItems.push({
          id: templateItem.id,
          itemName: formItem.selectedBrand
            ? `${templateItem.itemName} (${formItem.selectedBrand})`
            : templateItem.itemName,
          category: templateItem.category,
          size: formItem.selectedSize || 'One Size',
          sizeCategory,
          quantity: formItem.quantity,
          isIssued: templateItem.isIssued,
          notes: templateItem.notes,
        });
      }

      // TODO: In production, process each item through the API
      // For now, we'll show the confirmation with the processed items
      setCompletedItems(kitItems);
      setShowConfirmation(true);
    } catch (err) {
      console.error('Error processing new member kit:', err);
      setError('Failed to process new member kit. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Add item from inventory
  const handleAddFromInventory = (invItem: PPEInventoryItem) => {
    const newItem: CartItem = {
      id: `inv-${invItem.sizeId}`,
      itemName: invItem.itemTypeName || invItem.description || 'Unknown Item',
      category: invItem.categoryName || 'Other',
      size: invItem.sizeName || 'One Size',
      sizeCategory: 'oneSize', // Would need mapping logic
      quantity: 1,
      isIssued: true,
      sizeId: invItem.sizeId,
      inventoryItem: invItem,
    };

    setCart(prev => [...prev, newItem]);
    setShowAddItemModal(false);
    setInventorySearch('');
  };

  // Update cart item
  const handleUpdateCartItem = (itemId: string, updates: Partial<CartItem>) => {
    setCart(prev => prev.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  // Remove cart item
  const handleRemoveCartItem = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  // Toggle return item selection
  const handleToggleReturnItem = (recordId: string) => {
    setUserIssuedItems(prev => prev.map(item =>
      item.id === recordId ? { ...item, selected: !item.selected } : item
    ));
  };

  // Update return item
  const handleUpdateReturnItem = (recordId: string, updates: Partial<ReturnItem>) => {
    setUserIssuedItems(prev => prev.map(item =>
      item.id === recordId ? { ...item, ...updates } : item
    ));
  };

  // Get stock for a size from catalog
  const getStockForSize = (sizeId?: string) => {
    if (!sizeId) return null;
    const item = catalogItems.find((c) => c.sizeId === sizeId);
    return item?.quantityAvailable ?? 0;
  };

  // Filter requests by queue filter
  const filteredRequests = requests.filter((r) => {
    switch (queueFilter) {
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

  // Status counts for queue
  const statusCounts = {
    pending: requests.filter((r) => r.status === 'Pending').length,
    approved: requests.filter((r) => r.status === 'Approved').length,
    ready: requests.filter((r) => r.status === 'ReadyForPickup').length,
    backordered: requests.filter((r) => r.status === 'Backordered').length,
    total: requests.length,
  };

  // Select a request to process
  const handleSelectRequest = async (request: Request) => {
    setSelectedRequest(request);

    // Look up the user by ID (requestedBy contains the userId)
    if (request.requestedBy) {
      try {
        const user = await usersApi.getById(request.requestedBy);
        if (user) {
          setSelectedUser(user);
          setUserSearch('');
          setSearchResults([]);
          setShowSearchResults(false);
        }
      } catch {
        // If we can't find the user, try searching by name
        const results = await usersApi.search(request.requestedByName);
        if (results.length > 0) {
          setSelectedUser(results[0]);
        }
      }
    }

    // Populate cart from request lines
    const requestItems: CartItem[] = request.lines.map((line) => ({
      id: `req-${line.id}`,
      itemName: line.itemTypeName,
      category: 'Other', // Category not available on RequestLine
      size: line.requestedSizeName || 'One Size',
      sizeCategory: 'oneSize' as SizeCategory, // Would need mapping
      quantity: line.quantity,
      isIssued: true,
      sizeId: line.requestedSizeId,
      notes: line.replacementReason,
    }));

    setCart(requestItems);
    // Switch to checkout tab to process the request
    setActiveTab('checkout');
  };

  // Handle request status change
  const handleRequestStatusChange = async (requestId: string, newStatus: RequestStatus) => {
    setIsProcessingRequest(true);
    try {
      await requestsApi.updateStatus(requestId, newStatus);
      await loadRequestQueue();
      if (newStatus === 'Cancelled') {
        setSelectedRequest(null);
        setSelectedUser(null);
        setCart([]);
      } else if (selectedRequest?.id === requestId) {
        setSelectedRequest({ ...selectedRequest, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating request status:', err);
      setError('Failed to update request status');
    } finally {
      setIsProcessingRequest(false);
    }
  };

  // Complete request fulfillment
  const handleFulfillRequest = async (requestId: string) => {
    setIsProcessingRequest(true);
    try {
      await requestsApi.fulfill(requestId);
      await loadRequestQueue();
      setSelectedRequest(null);
      setCompletedItems([...cart]);
      setShowConfirmation(true);
    } catch (err) {
      console.error('Error fulfilling request:', err);
      setError('Failed to fulfill request');
    } finally {
      setIsProcessingRequest(false);
    }
  };

  // Clear selected request
  const handleClearRequest = () => {
    setSelectedRequest(null);
    setSelectedUser(null);
    setCart([]);
  };

  // Get size options for a cart item
  const getSizeOptionsForItem = (item: CartItem): string[] => {
    switch (item.sizeCategory) {
      case 'clothing':
        return getSizeOptions('Clothing');
      case 'footwear':
        return getSizeOptions('Footwear');
      case 'gloves':
        return getSizeOptions('Gloves');
      case 'truSpec':
        return getSizeOptions('Clothing', 'Tru-Spec');
      case 'fiveElevenPants':
        return getSizeOptions('Clothing', '5.11', 'pants');
      case 'oneSize':
      default:
        return ['One Size'];
    }
  };

  // Process checkout transaction
  const handleCompleteCheckout = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    setError(null);

    try {
      const processed: CartItem[] = [];

      for (const item of cart) {
        if (item.sizeId) {
          await ppeApi.issueToUser(
            item.sizeId,
            selectedUser.id,
            `${selectedUser.firstName} ${selectedUser.lastName}`,
            item.quantity,
            'Warehouse Staff', // Would be current user
            item.notes,
            selectedUser.employeeId,
            selectedUser.department
          );
          processed.push(item);
        }
      }

      setCompletedItems(processed);
      setShowConfirmation(true);
    } catch (err) {
      console.error('Error processing checkout:', err);
      setError('Failed to process checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Process return transaction
  const handleCompleteReturn = async () => {
    if (!selectedUser) return;

    setIsProcessing(true);
    setError(null);

    try {
      const selectedReturns = userIssuedItems.filter(item => item.selected);
      for (const returnItem of selectedReturns) {
        await ppeApi.returnIssuedItem(
          returnItem.id,
          returnItem.returnQuantity,
          `Condition: ${returnItem.returnCondition}`
        );
      }

      setCompletedItems([]);
      setShowConfirmation(true);
    } catch (err) {
      console.error('Error processing returns:', err);
      setError('Failed to process returns. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset after confirmation
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setCart([]);
    setUserIssuedItems([]);
    setNotes('');
    setCompletedItems([]);
    // Optionally clear user for next transaction
    // setSelectedUser(null);
  };

  // Print receipt
  const handlePrint = () => {
    window.print();
  };

  // Clear cart
  const handleClearCart = () => {
    setCart([]);
    setUserIssuedItems(prev => prev.map(item => ({ ...item, selected: false })));
  };

  // Group cart items by category
  const groupedCart = cart.reduce<Record<string, CartItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Filter inventory for add item modal
  const filteredInventory = inventorySearch
    ? inventoryItems.filter(item =>
        item.itemTypeName?.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.description?.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.categoryName?.toLowerCase().includes(inventorySearch.toLowerCase())
      )
    : inventoryItems.slice(0, 50); // Show first 50 if no search

  // Calculate totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const selectedReturnsCount = userIssuedItems.filter(i => i.selected).length;

  // Tab configuration
  const tabs: { id: TabType; label: string; icon: string; badge?: number }[] = [
    { id: 'queue', label: 'Queue', icon: 'assignment', badge: statusCounts.total > 0 ? statusCounts.total : undefined },
    { id: 'checkout', label: 'Checkout', icon: 'shopping_cart' },
    { id: 'return', label: 'Return', icon: 'keyboard_return' },
    { id: 'newmember', label: 'New Member', icon: 'person_add' },
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary-900">PPE/Gear Distribution</h1>
          <p className="text-primary-600 mt-1">Process gear checkout, returns, and new member kits</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-primary-200 mb-4">
        <div className="flex border-b border-primary-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600 -mb-px'
                  : 'text-primary-600 hover:bg-primary-50'
              }`}
            >
              <Icon name={tab.icon} size="sm" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {/* QUEUE TAB */}
        {activeTab === 'queue' && (
          <div className="h-full bg-white rounded-xl border border-primary-200 flex flex-col overflow-hidden">
            {/* Status Summary */}
            <div className="px-4 py-3 border-b border-primary-200 bg-primary-50">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-700">{statusCounts.pending}</div>
                  <div className="text-sm text-yellow-600">Pending</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">{statusCounts.approved}</div>
                  <div className="text-sm text-blue-600">Approved</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">{statusCounts.ready}</div>
                  <div className="text-sm text-green-600">Ready</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-700">{statusCounts.backordered}</div>
                  <div className="text-sm text-orange-600">Backordered</div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-2 border-b border-primary-100 flex gap-2">
              {(['all', 'pending', 'approved', 'ready'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setQueueFilter(f)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    queueFilter === f
                      ? 'bg-blue-600 text-white'
                      : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f !== 'all' && (
                    <span className="ml-1">
                      ({f === 'pending' ? statusCounts.pending : f === 'approved' ? statusCounts.approved : statusCounts.ready})
                    </span>
                  )}
                </button>
              ))}
              <button
                onClick={loadRequestQueue}
                disabled={loadingRequests}
                className="ml-auto px-3 py-2 text-sm text-primary-600 hover:bg-primary-100 rounded-lg flex items-center gap-1"
              >
                <Icon name="refresh" size="sm" className={loadingRequests ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            {/* Request List */}
            <div className="flex-1 overflow-y-auto p-4">
              {loadingRequests ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-primary-300 border-t-blue-500 rounded-full animate-spin" />
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="text-center py-12 text-primary-500">
                  <Icon name="assignment" size="xl" className="mx-auto mb-3 opacity-40" />
                  <p className="text-lg">No {queueFilter === 'all' ? '' : queueFilter} requests</p>
                  <p className="text-sm mt-1">Requests will appear here when team members submit gear requests</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredRequests.map((request) => (
                    <button
                      key={request.id}
                      onClick={() => handleSelectRequest(request)}
                      className="w-full p-4 text-left bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors border border-transparent hover:border-primary-200"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-primary-900">
                              {request.requestedByName}
                            </span>
                            <StatusBadge status={request.status} size="sm" />
                          </div>
                          <div className="text-sm text-primary-500 mt-1">
                            Request #{request.id.split('-')[1]} • {new Date(request.requestDate).toLocaleDateString()}
                          </div>
                          <div className="mt-2 text-sm text-primary-600">
                            {request.lines.length} item{request.lines.length !== 1 ? 's' : ''} •{' '}
                            {request.lines.reduce((sum, l) => sum + l.quantity, 0)} total qty
                          </div>
                          {request.lines[0] && (
                            <div className="mt-1 text-sm text-primary-400">
                              {request.lines[0].itemTypeName}
                              {request.lines.length > 1 && ` +${request.lines.length - 1} more`}
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <Icon name="chevron_right" size="md" className="text-primary-400" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* CHECKOUT TAB */}
        {activeTab === 'checkout' && (
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
            {/* Main Content Area */}
            <div className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto">
              {/* Selected Request Banner (if processing a request) */}
              {selectedRequest && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon name="assignment" size="md" className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-blue-900">
                          Processing Request #{selectedRequest.id.split('-')[1]}
                        </div>
                        <div className="text-sm text-blue-700 flex items-center gap-2">
                          {selectedRequest.requestedByName} • <StatusBadge status={selectedRequest.status} size="sm" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedRequest.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleRequestStatusChange(selectedRequest.id, 'Cancelled')}
                            disabled={isProcessingRequest}
                            className="px-3 py-1.5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleRequestStatusChange(selectedRequest.id, 'Approved')}
                            disabled={isProcessingRequest}
                            className="px-3 py-1.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
                          >
                            Approve
                          </button>
                        </>
                      )}
                      {selectedRequest.status === 'Approved' && (
                        <button
                          onClick={() => handleRequestStatusChange(selectedRequest.id, 'ReadyForPickup')}
                          disabled={isProcessingRequest}
                          className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                          Mark Ready
                        </button>
                      )}
                      {selectedRequest.status === 'ReadyForPickup' && (
                        <button
                          onClick={() => handleFulfillRequest(selectedRequest.id)}
                          disabled={isProcessingRequest}
                          className="px-3 py-1.5 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
                        >
                          Complete Pickup
                        </button>
                      )}
                      <button
                        onClick={handleClearRequest}
                        className="p-1.5 text-primary-400 hover:text-primary-600 hover:bg-primary-100 rounded"
                      >
                        <Icon name="close" size="sm" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Team Member Selection */}
              <div className="bg-white rounded-xl border border-primary-200 p-6">
                <h2 className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-4">
                  Team Member
                </h2>

                {!selectedUser ? (
                  <div className="relative">
                    <div className="relative">
                      <Icon name="search" size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                      <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        onFocus={() => setShowSearchResults(true)}
                        className="w-full pl-10 pr-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-5 h-5 border-2 border-primary-300 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                      )}
                    </div>

                    {showSearchResults && searchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-primary-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {searchResults.map(user => (
                          <button
                            key={user.id}
                            onClick={() => handleSelectUser(user)}
                            className="w-full px-4 py-3 text-left hover:bg-primary-50 flex items-center gap-3 border-b border-primary-100 last:border-b-0"
                          >
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <Icon name="person" size="md" className="text-primary-600" />
                            </div>
                            <div>
                              <div className="font-medium text-primary-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-primary-500">
                                {user.employeeId && `#${user.employeeId}`}
                                {user.employeeId && user.department && ' | '}
                                {user.department}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon name="person" size="lg" className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-primary-900">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </div>
                        <div className="text-sm text-primary-600">
                          {selectedUser.employeeId && `#${selectedUser.employeeId}`}
                          {selectedUser.employeeId && selectedUser.department && ' | '}
                          {selectedUser.department}
                        </div>
                        {selectedUser.sizes && (
                          <div className="text-xs text-primary-500 mt-1">
                            Sizes: {selectedUser.sizes.shirt && `Shirt: ${selectedUser.sizes.shirt}`}
                            {selectedUser.sizes.pantsWaist && `, Pants: ${selectedUser.sizes.pantsWaist}x${selectedUser.sizes.pantsInseam || '32'}`}
                            {selectedUser.sizes.bootSize && `, Boot: ${selectedUser.sizes.bootSize}`}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleClearUser}
                      className="p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-100 rounded-lg"
                    >
                      <Icon name="close" size="md" />
                    </button>
                  </div>
                )}
              </div>

              {/* Cart Items */}
              <div className="bg-white rounded-xl border border-primary-200">
                <div className="px-6 py-4 border-b border-primary-200 flex items-center justify-between">
                  <h2 className="font-semibold text-primary-900">
                    Items to Distribute
                    {totalItems > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-sm rounded-full">
                        {totalItems} items
                      </span>
                    )}
                  </h2>
                  <button
                    onClick={() => setShowAddItemModal(true)}
                    disabled={!selectedUser}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Icon name="add" size="sm" />
                    Add Item
                  </button>
                </div>

                <div className="p-6 max-h-[400px] overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-12 text-primary-500">
                      <Icon name="inventory_2" size="lg" className="mx-auto mb-3 opacity-50" />
                      <p>No items in cart</p>
                      <p className="text-sm mt-1">
                        {selectedUser
                          ? 'Add items manually using the button above'
                          : 'Select a team member first'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Object.entries(groupedCart).map(([category, items]) => (
                        <div key={category}>
                          <h3 className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-3">
                            {category}
                          </h3>
                          <div className="space-y-2">
                            {items.map(item => (
                              <div
                                key={item.id}
                                className="flex items-center gap-4 p-3 bg-primary-50 rounded-lg"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-primary-900 truncate">
                                    {item.itemName}
                                  </div>
                                  {item.notes && (
                                    <div className="text-xs text-primary-500 truncate">
                                      {item.notes}
                                    </div>
                                  )}
                                </div>

                                <select
                                  value={item.size}
                                  onChange={(e) => handleUpdateCartItem(item.id, { size: e.target.value })}
                                  className="w-24 px-2 py-1.5 text-sm border border-primary-300 rounded-lg bg-white"
                                >
                                  <option value="">Size</option>
                                  {getSizeOptionsForItem(item).map(size => (
                                    <option key={size} value={size}>{size}</option>
                                  ))}
                                </select>

                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleUpdateCartItem(item.id, { quantity: Math.max(1, item.quantity - 1) })}
                                    className="p-1 text-primary-600 hover:bg-primary-200 rounded"
                                  >
                                    <Icon name="remove" size="sm" />
                                  </button>
                                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                                  <button
                                    onClick={() => handleUpdateCartItem(item.id, { quantity: item.quantity + 1 })}
                                    className="p-1 text-primary-600 hover:bg-primary-200 rounded"
                                  >
                                    <Icon name="add" size="sm" />
                                  </button>
                                </div>

                                <button
                                  onClick={() => handleRemoveCartItem(item.id)}
                                  className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg"
                                >
                                  <Icon name="delete" size="sm" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Panel */}
            <div className="bg-white rounded-xl border border-primary-200 p-6 flex flex-col h-fit">
              <h2 className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-4">
                Summary
              </h2>

              <div className="space-y-3 flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-600">Items to distribute:</span>
                  <span className="font-medium text-primary-900">{totalItems}</span>
                </div>

                <div className="pt-3 border-t">
                  <label className="text-sm font-medium text-primary-600 block mb-2">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this transaction..."
                    rows={3}
                    className="w-full px-3 py-2 border border-primary-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  onClick={handleCompleteCheckout}
                  disabled={!selectedUser || isProcessing || cart.length === 0}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Icon name="check" size="sm" />
                      Complete Checkout
                    </>
                  )}
                </button>
                <button
                  onClick={handleClearCart}
                  disabled={cart.length === 0}
                  className="w-full px-6 py-2 text-primary-600 hover:bg-primary-50 rounded-lg font-medium disabled:opacity-50"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RETURN TAB */}
        {activeTab === 'return' && (
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
            <div className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto">
              {/* Team Member Selection */}
              <div className="bg-white rounded-xl border border-primary-200 p-6">
                <h2 className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-4">
                  Team Member
                </h2>

                {!selectedUser ? (
                  <div className="relative">
                    <div className="relative">
                      <Icon name="search" size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                      <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        onFocus={() => setShowSearchResults(true)}
                        className="w-full pl-10 pr-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-5 h-5 border-2 border-primary-300 border-t-blue-500 rounded-full animate-spin" />
                        </div>
                      )}
                    </div>

                    {showSearchResults && searchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-primary-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {searchResults.map(user => (
                          <button
                            key={user.id}
                            onClick={() => handleSelectUser(user)}
                            className="w-full px-4 py-3 text-left hover:bg-primary-50 flex items-center gap-3 border-b border-primary-100 last:border-b-0"
                          >
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <Icon name="person" size="md" className="text-primary-600" />
                            </div>
                            <div>
                              <div className="font-medium text-primary-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-primary-500">
                                {user.employeeId && `#${user.employeeId}`}
                                {user.employeeId && user.department && ' | '}
                                {user.department}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Icon name="person" size="lg" className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-primary-900">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </div>
                        <div className="text-sm text-primary-600">
                          {selectedUser.employeeId && `#${selectedUser.employeeId}`}
                          {selectedUser.employeeId && selectedUser.department && ' | '}
                          {selectedUser.department}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleClearUser}
                      className="p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-100 rounded-lg"
                    >
                      <Icon name="close" size="md" />
                    </button>
                  </div>
                )}
              </div>

              {/* Issued Items to Return */}
              <div className="bg-white rounded-xl border border-primary-200 flex-1">
                <div className="px-6 py-4 border-b border-primary-200">
                  <h2 className="font-semibold text-primary-900">
                    Items to Return
                    {selectedReturnsCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-sm rounded-full">
                        {selectedReturnsCount} selected
                      </span>
                    )}
                  </h2>
                </div>

                <div className="p-6 max-h-[400px] overflow-y-auto">
                  {!selectedUser ? (
                    <div className="text-center py-12 text-primary-500">
                      <Icon name="person" size="xl" className="mx-auto mb-3 opacity-40" />
                      <p>Select a team member to see their issued gear</p>
                    </div>
                  ) : loadingIssuedItems ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-primary-300 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                  ) : userIssuedItems.length === 0 ? (
                    <div className="text-center py-12 text-primary-500">
                      <Icon name="inventory_2" size="xl" className="mx-auto mb-3 opacity-40" />
                      <p>No issued items found</p>
                      <p className="text-sm mt-1">This team member has no gear checked out</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {userIssuedItems.map(item => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                            item.selected
                              ? 'bg-orange-50 border-orange-200'
                              : 'bg-primary-50 border-transparent'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => handleToggleReturnItem(item.id)}
                            className="w-5 h-5 rounded border-primary-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-primary-900">
                              Item #{item.sizeId}
                            </div>
                            <div className="text-sm text-primary-500">
                              Issued: {new Date(item.issuedAt).toLocaleDateString()}
                              {item.quantity > 1 && ` (Qty: ${item.quantity})`}
                            </div>
                          </div>
                          {item.selected && (
                            <select
                              value={item.returnCondition}
                              onChange={(e) => handleUpdateReturnItem(item.id, {
                                returnCondition: e.target.value as ReturnItem['returnCondition']
                              })}
                              className="px-2 py-1 text-sm border border-primary-300 rounded-lg bg-white"
                            >
                              <option value="Serviceable">Serviceable</option>
                              <option value="NeedsRepair">Needs Repair</option>
                              <option value="Dispose">Dispose</option>
                            </select>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Summary Panel */}
            <div className="bg-white rounded-xl border border-primary-200 p-6 flex flex-col h-fit">
              <h2 className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-4">
                Summary
              </h2>

              <div className="space-y-3 flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-600">Items to return:</span>
                  <span className="font-medium text-primary-900">{selectedReturnsCount}</span>
                </div>

                <div className="pt-3 border-t">
                  <label className="text-sm font-medium text-primary-600 block mb-2">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this return..."
                    rows={3}
                    className="w-full px-3 py-2 border border-primary-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  onClick={handleCompleteReturn}
                  disabled={!selectedUser || isProcessing || selectedReturnsCount === 0}
                  className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Icon name="keyboard_return" size="sm" />
                      Process Return
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* NEW MEMBER TAB */}
        {activeTab === 'newmember' && (
          <div className="h-full overflow-hidden">
            {!selectedUser ? (
              <div className="bg-white rounded-xl border border-primary-200 p-6 max-w-xl mx-auto">
                <h2 className="text-lg font-semibold text-primary-900 mb-4">Select Team Member</h2>
                <p className="text-primary-600 mb-4">Search for the new team member to issue their starter kit.</p>
                <div className="relative">
                  <div className="relative">
                    <Icon name="search" size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                    <input
                      type="text"
                      placeholder="Search by name or ID..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      onFocus={() => setShowSearchResults(true)}
                      className="w-full pl-10 pr-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-primary-300 border-t-blue-500 rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-primary-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                      {searchResults.map(user => (
                        <button
                          key={user.id}
                          onClick={() => handleSelectUser(user)}
                          className="w-full px-4 py-3 text-left hover:bg-primary-50 flex items-center gap-3 border-b border-primary-100 last:border-b-0"
                        >
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <Icon name="person" size="md" className="text-primary-600" />
                          </div>
                          <div>
                            <div className="font-medium text-primary-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-primary-500">
                              {user.employeeId && `#${user.employeeId}`}
                              {user.employeeId && user.department && ' | '}
                              {user.department}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <NewMemberKitForm
                userId={selectedUser.id}
                userName={`${selectedUser.firstName} ${selectedUser.lastName}`}
                userSizes={{
                  shirt: selectedUser.sizes?.shirt,
                  pantsWaist: selectedUser.sizes?.pantsWaist,
                  pantsInseam: selectedUser.sizes?.pantsInseam,
                  bootSize: selectedUser.sizes?.bootSize,
                  gloveSize: selectedUser.sizes?.gloveSize,
                }}
                onComplete={handleNewMemberKitComplete}
                onCancel={handleClearUser}
              />
            )}
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddItemModal}
        onClose={() => {
          setShowAddItemModal(false);
          setInventorySearch('');
        }}
        title="Add Item from Inventory"
        size="lg"
      >
        <div className="space-y-4">
          <div className="relative">
            <Icon name="search" size="sm" className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-primary-300 rounded-lg"
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {filteredInventory.map(item => (
              <button
                key={item.sizeId}
                onClick={() => handleAddFromInventory(item)}
                className="w-full p-3 text-left bg-primary-50 hover:bg-primary-100 rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="font-medium text-primary-900">
                    {item.itemTypeName || item.description}
                  </div>
                  <div className="text-sm text-primary-500">
                    {item.categoryName} {item.sizeName && `| ${item.sizeName}`} | Available: {item.quantityOnHand}
                  </div>
                </div>
                <Icon name="add" size="sm" className="text-blue-600" />
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={handleCloseConfirmation}
        title="Transaction Complete"
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-primary-700 bg-white border border-primary-300 rounded-lg hover:bg-primary-50 flex items-center gap-2"
            >
              <Icon name="print" size="sm" />
              Print Receipt
            </button>
            <button
              onClick={handleCloseConfirmation}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Icon name="check" size="md" className="text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-green-800">
                {activeTab === 'checkout' && 'Gear Distributed Successfully'}
                {activeTab === 'return' && 'Returns Processed Successfully'}
                {activeTab === 'newmember' && 'New Member Kit Issued Successfully'}
              </div>
              <div className="text-sm text-green-600">
                {selectedUser && `${selectedUser.firstName} ${selectedUser.lastName}`}
              </div>
            </div>
          </div>

          {completedItems.length > 0 && (
            <div>
              <h3 className="font-medium text-primary-900 mb-2">Items Distributed:</h3>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {completedItems.map(item => (
                  <div key={item.id} className="text-sm text-primary-600 flex justify-between">
                    <span>{item.itemName}</span>
                    <span className="text-primary-500">
                      {item.size && `${item.size} | `}Qty: {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
