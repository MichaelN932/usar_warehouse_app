import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ppeApi, usersApi, PPEInventoryItem, PPEIssuedRecord, PPEActivityLog, PPEActivityType } from '../../services/api';
import { Card, Icon, Modal } from '../../components/ui';
import { User } from '../../types';
import {
  ArrowLeft,
  Edit,
  MoreVertical,
  Package,
  Users,
  History,
  Settings,
  Download,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Check,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  FileText,
  Trash2,
  Search,
} from 'lucide-react';

type TabType = 'overview' | 'activity' | 'assignments' | 'adjust';

// Activity type display configuration
const activityConfig: Record<PPEActivityType, { label: string; icon: string; color: string; bgColor: string }> = {
  created: { label: 'Created', icon: 'add_circle', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  stock_received: { label: 'Stock Received', icon: 'inventory', color: 'text-green-600', bgColor: 'bg-green-50' },
  stock_adjusted: { label: 'Stock Adjusted', icon: 'tune', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  issued: { label: 'Issued', icon: 'arrow_forward', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  returned: { label: 'Returned', icon: 'keyboard_return', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  damaged: { label: 'Damaged', icon: 'broken_image', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  lost: { label: 'Lost', icon: 'help', color: 'text-red-600', bgColor: 'bg-red-50' },
  transferred: { label: 'Transferred', icon: 'swap_horiz', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  count_updated: { label: 'Count Updated', icon: 'calculate', color: 'text-slate-600', bgColor: 'bg-slate-50' },
  details_updated: { label: 'Details Updated', icon: 'edit', color: 'text-slate-600', bgColor: 'bg-slate-50' },
};

type AdjustmentReason = 'count' | 'received' | 'damaged' | 'lost' | 'returned' | 'issued';

export function PPEItemDetail() {
  const { sizeId } = useParams<{ sizeId: string }>();
  const navigate = useNavigate();

  // Data state
  const [item, setItem] = useState<PPEInventoryItem | null>(null);
  const [issuedRecords, setIssuedRecords] = useState<PPEIssuedRecord[]>([]);
  const [activityLogs, setActivityLogs] = useState<PPEActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Adjustment state
  const [adjustmentReason, setAdjustmentReason] = useState<AdjustmentReason>('count');
  const [adjustmentQty, setAdjustmentQty] = useState(0);
  const [adjustmentNote, setAdjustmentNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User selection for issue
  const [users, setUsers] = useState<User[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Actions menu
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  useEffect(() => {
    if (sizeId) {
      loadData();
    }
  }, [sizeId]);

  useEffect(() => {
    loadUsers();
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function loadData() {
    if (!sizeId) return;
    setIsLoading(true);
    try {
      const [itemData, issued, activity] = await Promise.all([
        ppeApi.getInventoryBySizeId(sizeId),
        ppeApi.getIssuedRecords(sizeId),
        ppeApi.getActivityLog(sizeId),
      ]);
      setItem(itemData || null);
      setIssuedRecords(issued);
      setActivityLogs(activity);
      if (itemData) {
        setAdjustmentQty(itemData.quantityOnHand);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function loadUsers() {
    const allUsers = await usersApi.getAll();
    setUsers(allUsers);
  }

  // Filter users for dropdown
  const filteredUsers = users.filter((user) => {
    if (!userSearchQuery) return true;
    const query = userSearchQuery.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.employeeId?.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const selectedUser = users.find((u) => u.id === selectedUserId);

  // Get computed status
  const getComputedStatus = (item: PPEInventoryItem) => {
    if (item.quantityOnHand === 0) return 'Out of Stock';
    if (item.quantityOnHand <= 5) return 'Low Stock';
    if ((item.quantityOut || 0) > 0) return 'Partially Issued';
    return 'In Stock';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-700';
      case 'Low Stock':
        return 'bg-amber-100 text-amber-700';
      case 'Out of Stock':
        return 'bg-red-100 text-red-700';
      case 'Partially Issued':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Handle quantity adjustment
  const handleQuantityAdjustment = async () => {
    if (!item) return;
    setIsSubmitting(true);

    try {
      let newQuantityOnHand = item.quantityOnHand;
      let newQuantityOut = item.quantityOut || 0;
      let activityType: PPEActivityType = 'stock_adjusted';
      let description = '';

      switch (adjustmentReason) {
        case 'count':
          activityType = 'count_updated';
          description = 'Physical inventory count';
          newQuantityOnHand = adjustmentQty;
          break;
        case 'received':
          activityType = 'stock_received';
          description = 'Stock received from vendor';
          newQuantityOnHand = item.quantityOnHand + adjustmentQty;
          break;
        case 'damaged':
          activityType = 'damaged';
          description = 'Stock removed - damaged';
          newQuantityOnHand = Math.max(0, item.quantityOnHand - adjustmentQty);
          break;
        case 'lost':
          activityType = 'lost';
          description = 'Stock removed - lost';
          newQuantityOnHand = Math.max(0, item.quantityOnHand - adjustmentQty);
          break;
        case 'returned':
          activityType = 'returned';
          description = 'Item returned to inventory';
          newQuantityOut = Math.max(0, (item.quantityOut || 0) - adjustmentQty);
          newQuantityOnHand = item.quantityOnHand + adjustmentQty;
          break;
        case 'issued':
          activityType = 'issued';
          description = 'Issued to personnel';
          newQuantityOnHand = Math.max(0, item.quantityOnHand - adjustmentQty);
          newQuantityOut = (item.quantityOut || 0) + adjustmentQty;

          if (selectedUser) {
            await ppeApi.issueToUser(
              item.sizeId,
              selectedUser.id,
              `${selectedUser.firstName} ${selectedUser.lastName}`,
              adjustmentQty,
              'Warehouse Staff',
              adjustmentNote,
              selectedUser.employeeId,
              selectedUser.department
            );
          }
          break;
      }

      // Update item
      await ppeApi.updateItem(
        item.sizeId,
        {
          quantityOnHand: newQuantityOnHand,
          quantityOut: newQuantityOut,
          quantityTotal: newQuantityOnHand + newQuantityOut,
        },
        'Warehouse Staff',
        adjustmentNote || description
      );

      // Add activity log
      await ppeApi.addActivityLog({
        sizeId: item.sizeId,
        activityType,
        timestamp: new Date().toISOString(),
        performedBy: 'Warehouse Staff',
        description,
        quantityChange:
          adjustmentReason === 'count'
            ? adjustmentQty - item.quantityOnHand
            : adjustmentReason === 'received' || adjustmentReason === 'returned'
            ? adjustmentQty
            : -adjustmentQty,
        quantityBefore: item.quantityOnHand,
        quantityAfter: newQuantityOnHand,
        relatedUserId: selectedUser?.id,
        relatedUserName: selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : undefined,
        note: adjustmentNote || undefined,
      });

      // Reset and reload
      setAdjustmentNote('');
      setSelectedUserId('');
      await loadData();
      setActiveTab('activity');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group activity logs by date
  const groupedActivityLogs = activityLogs.reduce((groups, log) => {
    const date = new Date(log.timestamp).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {} as Record<string, PPEActivityLog[]>);

  // Export activity log
  const exportActivityLog = () => {
    const headers = ['Date', 'Time', 'Activity', 'Description', 'Quantity Change', 'Performed By', 'Note'];
    const rows = activityLogs.map((log) => {
      const date = new Date(log.timestamp);
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        activityConfig[log.activityType].label,
        log.description,
        log.quantityChange ? (log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange.toString()) : '',
        log.performedBy,
        log.note || '',
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `activity-log-${sizeId}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-action-primary"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <Icon name="inventory_2" size="xl" className="mx-auto mb-4 text-primary-300" />
        <h2 className="text-xl font-semibold text-primary-900">Item Not Found</h2>
        <p className="text-primary-600 mt-2">The requested item could not be found.</p>
        <button
          onClick={() => navigate('/ppe-inventory')}
          className="mt-4 px-4 py-2 bg-action-primary text-white rounded-lg hover:bg-action-hover"
        >
          Back to Inventory
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: 'info' },
    { id: 'activity' as TabType, label: 'Activity Log', icon: 'history', badge: activityLogs.length },
    { id: 'assignments' as TabType, label: 'Assignments', icon: 'group', badge: issuedRecords.length },
    { id: 'adjust' as TabType, label: 'Adjust Stock', icon: 'tune' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            onClick={() => navigate('/ppe-inventory')}
            className="p-2 text-primary-500 hover:text-primary-700 hover:bg-primary-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-primary-900">{item.itemTypeName}</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(getComputedStatus(item))}`}>
                {getComputedStatus(item)}
              </span>
            </div>
            <p className="text-primary-600 mt-1">
              {item.manufacturer} • {item.sizeName}
              {item.description && ` • ${item.description}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('adjust')}
            className="flex items-center gap-2 px-4 py-2 bg-action-primary text-white rounded-lg hover:bg-action-hover transition-colors"
          >
            <Settings className="w-4 h-4" />
            Adjust Stock
          </button>
          <div className="relative">
            <button
              onClick={() => setShowActionsMenu(!showActionsMenu)}
              className="p-2 text-primary-500 hover:text-primary-700 hover:bg-primary-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showActionsMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-primary-200 z-10">
                <button
                  onClick={() => {
                    exportActivityLog();
                    setShowActionsMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary-700 hover:bg-primary-50"
                >
                  <Download className="w-4 h-4" />
                  Export Activity Log
                </button>
                <button
                  onClick={() => {
                    // Edit mode would go here
                    setShowActionsMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary-700 hover:bg-primary-50"
                >
                  <Edit className="w-4 h-4" />
                  Edit Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">{item.quantityOnHand}</div>
              <div className="text-sm text-green-600">On Hand</div>
            </div>
          </div>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">{item.quantityOut || 0}</div>
              <div className="text-sm text-purple-600">Issued Out</div>
            </div>
          </div>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="functions" size="md" className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">{item.quantityTotal || 0}</div>
              <div className="text-sm text-blue-600">Total</div>
            </div>
          </div>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <History className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{activityLogs.length}</div>
              <div className="text-sm text-slate-600">Activities</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-primary-200 overflow-hidden">
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
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`px-1.5 py-0.5 text-xs font-bold rounded-full ${
                    activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-primary-200 text-primary-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-4">Item Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-primary-500 uppercase">Category</label>
                      <p className="mt-1 text-sm text-primary-900">{item.categoryName}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-primary-500 uppercase">Subcategory</label>
                      <p className="mt-1 text-sm text-primary-900">{item.subcategory || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-primary-500 uppercase">FEMA Code</label>
                      <p className="mt-1 text-sm font-mono text-primary-900">{item.femaCode || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-primary-500 uppercase">Item ID</label>
                      <p className="mt-1 text-sm font-mono text-primary-900">{item.legacyId || item.sizeId}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-primary-500 uppercase">Manufacturer</label>
                      <p className="mt-1 text-sm text-primary-900">{item.manufacturer}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-primary-500 uppercase">Size</label>
                      <p className="mt-1 text-sm text-primary-900">{item.sizeName}</p>
                    </div>
                  </div>
                </div>

                {(item.serialNumber || item.barcode) && (
                  <div>
                    <h3 className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-4">Identifiers</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {item.serialNumber && (
                        <div>
                          <label className="block text-xs font-medium text-primary-500 uppercase">Serial Number</label>
                          <p className="mt-1 text-sm font-mono text-primary-900">{item.serialNumber}</p>
                        </div>
                      )}
                      {item.barcode && (
                        <div>
                          <label className="block text-xs font-medium text-primary-500 uppercase">Barcode</label>
                          <p className="mt-1 text-sm font-mono text-primary-900">{item.barcode}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {item.lastUpdatedAt && (
                  <div>
                    <h3 className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-4">Audit Info</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-primary-500 uppercase">Last Updated</label>
                        <p className="mt-1 text-sm text-primary-900">
                          {new Date(item.lastUpdatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {item.lastUpdatedBy && (
                        <div>
                          <label className="block text-xs font-medium text-primary-500 uppercase">Updated By</label>
                          <p className="mt-1 text-sm text-primary-900">{item.lastUpdatedBy}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-primary-500 uppercase tracking-wider mb-4">Recent Activity</h3>
                  {activityLogs.length === 0 ? (
                    <div className="text-center py-8 text-primary-400">
                      <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No activity recorded</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activityLogs.slice(0, 5).map((log) => {
                        const config = activityConfig[log.activityType];
                        return (
                          <div key={log.id} className={`p-3 rounded-lg ${config.bgColor}`}>
                            <div className="flex items-start gap-3">
                              <div className={`mt-0.5 ${config.color}`}>
                                <Icon name={config.icon} size="sm" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
                                  <span className="text-xs text-primary-400">
                                    {new Date(log.timestamp).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-sm text-primary-700 mt-0.5">{log.description}</p>
                                {log.relatedUserName && (
                                  <p className="text-xs text-primary-500 mt-1">{log.relatedUserName}</p>
                                )}
                              </div>
                              {log.quantityChange && (
                                <span
                                  className={`text-sm font-semibold ${
                                    log.quantityChange > 0 ? 'text-green-600' : 'text-red-600'
                                  }`}
                                >
                                  {log.quantityChange > 0 ? '+' : ''}
                                  {log.quantityChange}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      {activityLogs.length > 5 && (
                        <button
                          onClick={() => setActiveTab('activity')}
                          className="w-full text-center text-sm text-action-primary hover:underline py-2"
                        >
                          View all {activityLogs.length} activities
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-primary-500 uppercase tracking-wider">Current Assignments</h3>
                    {issuedRecords.length > 0 && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                        {issuedRecords.reduce((sum, r) => sum + r.quantity, 0)} to {issuedRecords.length}
                      </span>
                    )}
                  </div>
                  {issuedRecords.length === 0 ? (
                    <div className="text-center py-8 text-primary-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No items currently issued</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {issuedRecords.slice(0, 3).map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-purple-700">
                                {record.userName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-primary-900 text-sm">{record.userName}</div>
                              <div className="text-xs text-primary-500">{record.userDepartment}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-purple-700 text-sm">×{record.quantity}</div>
                            <div className="text-xs text-primary-400">
                              {new Date(record.issuedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                      {issuedRecords.length > 3 && (
                        <button
                          onClick={() => setActiveTab('assignments')}
                          className="w-full text-center text-sm text-action-primary hover:underline py-2"
                        >
                          View all {issuedRecords.length} assignments
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ACTIVITY LOG TAB */}
          {activeTab === 'activity' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-primary-900">Activity Log</h3>
                <button
                  onClick={exportActivityLog}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-100 rounded-lg"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>

              {activityLogs.length === 0 ? (
                <div className="text-center py-12 text-primary-400">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg">No activity recorded</p>
                  <p className="text-sm mt-1">Activity will appear here when stock is adjusted or items are issued</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(groupedActivityLogs).map(([date, logs]) => (
                    <div key={date}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-primary-300 rounded-full"></div>
                        <h4 className="text-sm font-semibold text-primary-600">{date}</h4>
                      </div>
                      <div className="ml-6 pl-6 border-l-2 border-primary-200 space-y-4">
                        {logs.map((log) => {
                          const config = activityConfig[log.activityType];
                          return (
                            <div key={log.id} className={`p-4 rounded-lg border ${config.bgColor} border-transparent`}>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                  <div className={`mt-0.5 ${config.color}`}>
                                    <Icon name={config.icon} size="md" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className={`font-semibold ${config.color}`}>{config.label}</span>
                                      <span className="text-xs text-primary-400">
                                        {new Date(log.timestamp).toLocaleTimeString('en-US', {
                                          hour: 'numeric',
                                          minute: '2-digit',
                                        })}
                                      </span>
                                    </div>
                                    <p className="text-sm text-primary-700 mt-1">{log.description}</p>
                                    {log.relatedUserName && (
                                      <p className="text-sm text-primary-600 mt-1">
                                        <span className="font-medium">{log.relatedUserName}</span>
                                        {log.relatedPONumber && ` • ${log.relatedPONumber}`}
                                      </p>
                                    )}
                                    {log.relatedPONumber && !log.relatedUserName && (
                                      <p className="text-sm text-primary-600 mt-1 font-mono">{log.relatedPONumber}</p>
                                    )}
                                    {log.note && (
                                      <p className="text-sm text-primary-500 mt-2 italic">"{log.note}"</p>
                                    )}
                                    <p className="text-xs text-primary-400 mt-2">by {log.performedBy}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {log.quantityChange !== undefined && (
                                    <span
                                      className={`text-lg font-bold ${
                                        log.quantityChange > 0 ? 'text-green-600' : 'text-red-600'
                                      }`}
                                    >
                                      {log.quantityChange > 0 ? '+' : ''}
                                      {log.quantityChange}
                                    </span>
                                  )}
                                  {log.quantityBefore !== undefined && log.quantityAfter !== undefined && (
                                    <p className="text-xs text-primary-400 mt-1">
                                      {log.quantityBefore} → {log.quantityAfter}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ASSIGNMENTS TAB */}
          {activeTab === 'assignments' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary-900">Current Assignments</h3>
                  <p className="text-sm text-primary-500 mt-1">
                    {issuedRecords.reduce((sum, r) => sum + r.quantity, 0)} units issued to {issuedRecords.length}{' '}
                    personnel
                  </p>
                </div>
              </div>

              {issuedRecords.length === 0 ? (
                <div className="text-center py-12 text-primary-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-lg">No items currently issued</p>
                  <p className="text-sm mt-1">Use the "Adjust Stock" tab to issue items to personnel</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {issuedRecords.map((record) => (
                    <div
                      key={record.id}
                      className="p-4 bg-white border border-primary-200 rounded-lg hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-purple-700">
                              {record.userName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-primary-900">{record.userName}</div>
                            <div className="text-sm text-primary-500">
                              {record.userEmployeeId && <span className="font-mono mr-2">{record.userEmployeeId}</span>}
                              {record.userDepartment}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-purple-700">×{record.quantity}</div>
                          <div className="text-sm text-primary-500">
                            {new Date(record.issuedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-primary-100 flex items-center justify-between text-sm">
                        <span className="text-primary-500">Issued by {record.issuedBy}</span>
                        {record.note && <span className="text-primary-400 italic">"{record.note}"</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADJUST STOCK TAB */}
          {activeTab === 'adjust' && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-primary-900 mb-6">Adjust Stock</h3>

              {/* Reason Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-primary-700 mb-3">Adjustment Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      { id: 'count', label: 'Count', icon: 'calculate', color: 'bg-primary-100 text-primary-700' },
                      { id: 'received', label: 'Received', icon: 'add_circle', color: 'bg-green-100 text-green-700' },
                      { id: 'damaged', label: 'Damaged', icon: 'broken_image', color: 'bg-orange-100 text-orange-700' },
                      { id: 'lost', label: 'Lost', icon: 'help', color: 'bg-red-100 text-red-700' },
                      { id: 'returned', label: 'Returned', icon: 'keyboard_return', color: 'bg-blue-100 text-blue-700' },
                      { id: 'issued', label: 'Issue', icon: 'arrow_forward', color: 'bg-purple-100 text-purple-700' },
                    ] as { id: AdjustmentReason; label: string; icon: string; color: string }[]
                  ).map((reason) => (
                    <button
                      key={reason.id}
                      onClick={() => {
                        setAdjustmentReason(reason.id);
                        if (reason.id === 'count') {
                          setAdjustmentQty(item.quantityOnHand);
                        } else {
                          setAdjustmentQty(0);
                        }
                        setSelectedUserId('');
                      }}
                      className={`p-3 rounded-lg text-sm font-medium border-2 transition-all flex flex-col items-center gap-2 ${
                        adjustmentReason === reason.id
                          ? 'border-action-primary ring-2 ring-action-primary/20 ' + reason.color
                          : 'border-transparent ' + reason.color + ' opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Icon name={reason.icon} size="md" />
                      {reason.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-primary-700 mb-2">
                  {adjustmentReason === 'count' ? 'New Count' : 'Quantity'}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setAdjustmentQty(Math.max(0, adjustmentQty - 1))}
                    className="w-12 h-12 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={adjustmentQty}
                    onChange={(e) => setAdjustmentQty(parseInt(e.target.value) || 0)}
                    className="flex-1 px-4 py-3 text-center text-2xl font-bold border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
                  />
                  <button
                    onClick={() => setAdjustmentQty(adjustmentQty + 1)}
                    className="w-12 h-12 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* User Selection for Issue */}
              {adjustmentReason === 'issued' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-primary-700 mb-2">
                    Issue To <span className="text-red-500">*</span>
                  </label>
                  <div className="relative" ref={userDropdownRef}>
                    {selectedUser ? (
                      <div className="flex items-center justify-between p-3 border border-purple-300 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-purple-700">
                              {selectedUser.firstName[0]}
                              {selectedUser.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-primary-900">
                              {selectedUser.firstName} {selectedUser.lastName}
                            </div>
                            <div className="text-sm text-primary-500">
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
                          <Icon name="close" size="sm" className="text-primary-500" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                          <input
                            type="text"
                            value={userSearchQuery}
                            onChange={(e) => {
                              setUserSearchQuery(e.target.value);
                              setShowUserDropdown(true);
                            }}
                            onFocus={() => setShowUserDropdown(true)}
                            placeholder="Search for personnel..."
                            className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>

                        {showUserDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-primary-200 z-50 max-h-48 overflow-y-auto">
                            {filteredUsers.length === 0 ? (
                              <div className="px-3 py-4 text-center text-sm text-primary-400">No users found</div>
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
                                    <span className="text-xs font-bold text-primary-600">
                                      {user.firstName[0]}
                                      {user.lastName[0]}
                                    </span>
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
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Preview */}
              {adjustmentReason !== 'count' && adjustmentQty > 0 && (
                <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                  <span className="text-primary-600">Result: </span>
                  <span className="font-semibold text-primary-900">
                    {adjustmentReason === 'received' &&
                      `${item.quantityOnHand} + ${adjustmentQty} = ${item.quantityOnHand + adjustmentQty} on hand`}
                    {adjustmentReason === 'damaged' &&
                      `${item.quantityOnHand} - ${adjustmentQty} = ${Math.max(0, item.quantityOnHand - adjustmentQty)} on hand`}
                    {adjustmentReason === 'lost' &&
                      `${item.quantityOnHand} - ${adjustmentQty} = ${Math.max(0, item.quantityOnHand - adjustmentQty)} on hand`}
                    {adjustmentReason === 'returned' &&
                      `${item.quantityOnHand} + ${adjustmentQty} = ${item.quantityOnHand + adjustmentQty} on hand`}
                    {adjustmentReason === 'issued' &&
                      `${item.quantityOnHand} - ${adjustmentQty} = ${Math.max(0, item.quantityOnHand - adjustmentQty)} on hand`}
                  </span>
                  {adjustmentReason === 'issued' && selectedUser && (
                    <p className="text-purple-600 mt-1">
                      Issuing to {selectedUser.firstName} {selectedUser.lastName}
                    </p>
                  )}
                </div>
              )}
              {adjustmentReason === 'count' && adjustmentQty !== item.quantityOnHand && (
                <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                  <span className="text-primary-600">Change: </span>
                  <span
                    className={`font-semibold ${adjustmentQty > item.quantityOnHand ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {adjustmentQty > item.quantityOnHand ? '+' : ''}
                    {adjustmentQty - item.quantityOnHand}
                  </span>
                </div>
              )}

              {/* Note */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-primary-700 mb-2">Note (optional)</label>
                <input
                  type="text"
                  value={adjustmentNote}
                  onChange={(e) => setAdjustmentNote(e.target.value)}
                  placeholder="Add a note about this adjustment..."
                  className="w-full px-4 py-3 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleQuantityAdjustment}
                disabled={
                  isSubmitting ||
                  (adjustmentReason === 'count' && adjustmentQty === item.quantityOnHand) ||
                  (adjustmentReason !== 'count' && adjustmentQty === 0) ||
                  (adjustmentReason === 'issued' && !selectedUserId)
                }
                className="w-full px-6 py-4 text-white bg-action-primary rounded-lg hover:bg-action-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
              >
                <Check className="w-5 h-5" />
                {isSubmitting
                  ? 'Applying...'
                  : adjustmentReason === 'issued' && !selectedUserId
                  ? 'Select a Person to Issue To'
                  : 'Apply Adjustment'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
