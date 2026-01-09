import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ppeApi, PPEIssuedRecord, PPEInventoryItem } from '../../services/api';
import { Card, Icon, EmptyState, Modal } from '../../components/ui';
import { Search, Filter, Users, Package, Download } from 'lucide-react';

type ViewMode = 'by-person' | 'by-item';
type SortField = 'name' | 'date' | 'quantity' | 'department' | 'issuedBy';
type SortOrder = 'asc' | 'desc';

interface GroupedByPerson {
  userId: string;
  userName: string;
  userEmployeeId?: string;
  userDepartment?: string;
  records: PPEIssuedRecord[];
  totalItems: number;
}

interface GroupedByItem {
  sizeId: string;
  itemName: string;
  sizeName: string;
  categoryName: string;
  records: PPEIssuedRecord[];
  totalIssued: number;
}

export function IssuedGear() {
  const [issuedRecords, setIssuedRecords] = useState<PPEIssuedRecord[]>([]);
  const [inventoryItems, setInventoryItems] = useState<PPEInventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('by-person');
  const [searchQuery, setSearchQuery] = useState('');
  const [includeReturned, setIncludeReturned] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedPerson, setSelectedPerson] = useState<GroupedByPerson | null>(null);

  useEffect(() => {
    loadData();
  }, [includeReturned]);

  async function loadData() {
    setIsLoading(true);
    try {
      const [records, inventory] = await Promise.all([
        ppeApi.getAllIssuedRecordsGlobal(includeReturned),
        ppeApi.getInventory(),
      ]);
      setIssuedRecords(records);
      setInventoryItems(inventory);
    } finally {
      setIsLoading(false);
    }
  }

  // Get item details from inventory
  const getItemDetails = (sizeId: string): PPEInventoryItem | undefined => {
    return inventoryItems.find((item) => item.sizeId === sizeId);
  };

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set<string>();
    issuedRecords.forEach((r) => {
      if (r.userDepartment) depts.add(r.userDepartment);
    });
    return Array.from(depts).sort();
  }, [issuedRecords]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return issuedRecords.filter((record) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const item = getItemDetails(record.sizeId);
        const matchesSearch =
          record.userName.toLowerCase().includes(query) ||
          record.userEmployeeId?.toLowerCase().includes(query) ||
          item?.itemTypeName?.toLowerCase().includes(query) ||
          item?.categoryName?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      // Department filter
      if (selectedDepartment !== 'all' && record.userDepartment !== selectedDepartment) {
        return false;
      }
      return true;
    });
  }, [issuedRecords, searchQuery, selectedDepartment, inventoryItems]);

  // Group by person
  const groupedByPerson = useMemo((): GroupedByPerson[] => {
    const groups = new Map<string, GroupedByPerson>();
    filteredRecords.forEach((record) => {
      if (!groups.has(record.userId)) {
        groups.set(record.userId, {
          userId: record.userId,
          userName: record.userName,
          userEmployeeId: record.userEmployeeId,
          userDepartment: record.userDepartment,
          records: [],
          totalItems: 0,
        });
      }
      const group = groups.get(record.userId)!;
      group.records.push(record);
      group.totalItems += record.quantity;
    });

    let result = Array.from(groups.values());

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.userName.localeCompare(b.userName);
          break;
        case 'quantity':
          comparison = a.totalItems - b.totalItems;
          break;
        case 'department':
          comparison = (a.userDepartment || '').localeCompare(b.userDepartment || '');
          break;
        case 'date':
          const aDate = Math.max(...a.records.map((r) => new Date(r.issuedAt).getTime()));
          const bDate = Math.max(...b.records.map((r) => new Date(r.issuedAt).getTime()));
          comparison = aDate - bDate;
          break;
        case 'issuedBy':
          const aLastRecord = a.records.reduce((latest, r) =>
            !latest || new Date(r.issuedAt) > new Date(latest.issuedAt) ? r : latest, a.records[0]);
          const bLastRecord = b.records.reduce((latest, r) =>
            !latest || new Date(r.issuedAt) > new Date(latest.issuedAt) ? r : latest, b.records[0]);
          comparison = (aLastRecord?.issuedBy || '').localeCompare(bLastRecord?.issuedBy || '');
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [filteredRecords, sortField, sortOrder]);

  // Group by item
  const groupedByItem = useMemo((): GroupedByItem[] => {
    const groups = new Map<string, GroupedByItem>();
    filteredRecords.forEach((record) => {
      if (!groups.has(record.sizeId)) {
        const item = getItemDetails(record.sizeId);
        groups.set(record.sizeId, {
          sizeId: record.sizeId,
          itemName: item?.itemTypeName || 'Unknown Item',
          sizeName: item?.sizeName || '',
          categoryName: item?.categoryName || 'Unknown',
          records: [],
          totalIssued: 0,
        });
      }
      const group = groups.get(record.sizeId)!;
      group.records.push(record);
      group.totalIssued += record.quantity;
    });

    let result = Array.from(groups.values());

    // Sort by item name
    result.sort((a, b) => {
      let comparison = a.itemName.localeCompare(b.itemName);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [filteredRecords, sortOrder, inventoryItems]);

  // Stats
  const stats = useMemo(() => {
    const uniquePeople = new Set(filteredRecords.map((r) => r.userId)).size;
    const totalItems = filteredRecords.reduce((sum, r) => sum + r.quantity, 0);
    const uniqueItemTypes = new Set(filteredRecords.map((r) => r.sizeId)).size;
    return { uniquePeople, totalItems, uniqueItemTypes };
  }, [filteredRecords]);

  // Toggle group expansion
  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Person', 'Employee ID', 'Department', 'Item', 'Size', 'Quantity', 'Issued Date', 'Issued By', 'Status'];
    const rows = filteredRecords.map((record) => {
      const item = getItemDetails(record.sizeId);
      return [
        record.userName,
        record.userEmployeeId || '',
        record.userDepartment || '',
        item?.itemTypeName || '',
        item?.sizeName || '',
        record.quantity.toString(),
        new Date(record.issuedAt).toLocaleDateString(),
        record.issuedBy,
        record.returnedAt ? 'Returned' : 'Active',
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `issued-gear-${new Date().toISOString().split('T')[0]}.csv`);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-heading-lg text-primary-900">Issued PPE/Gear</h1>
          <p className="text-primary-600">View all PPE and gear assigned to personnel</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-900">{stats.uniquePeople}</div>
              <div className="text-sm text-blue-600">Personnel with Issued Gear</div>
            </div>
          </div>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-900">{stats.totalItems}</div>
              <div className="text-sm text-green-600">Total Items Issued</div>
            </div>
          </div>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="category" size="lg" className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-900">{stats.uniqueItemTypes}</div>
              <div className="text-sm text-purple-600">Unique Item Types</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
            <input
              type="text"
              placeholder="Search by name, employee ID, or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-action-primary focus:border-action-primary"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-primary-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('by-person')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'by-person'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-primary-600 hover:text-primary-900'
              }`}
            >
              <Users className="w-4 h-4" />
              By Person
            </button>
            <button
              onClick={() => setViewMode('by-item')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'by-item'
                  ? 'bg-white text-primary-900 shadow-sm'
                  : 'text-primary-600 hover:text-primary-900'
              }`}
            >
              <Package className="w-4 h-4" />
              By Item
            </button>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary-400" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="border border-primary-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-action-primary"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Include Returned */}
          <label className="flex items-center gap-2 text-sm text-primary-600 cursor-pointer">
            <input
              type="checkbox"
              checked={includeReturned}
              onChange={(e) => setIncludeReturned(e.target.checked)}
              className="rounded border-primary-300 text-action-primary focus:ring-action-primary"
            />
            Include Returned
          </label>
        </div>
      </Card>

      {/* Results - Excel-style Table */}
      <Card className="overflow-hidden">
        {filteredRecords.length === 0 ? (
          <EmptyState
            title="No issued gear found"
            description={searchQuery ? 'Try adjusting your search or filters' : 'No gear has been issued yet'}
            icon={<Icon name="inventory_2" size="xl" />}
          />
        ) : viewMode === 'by-person' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary-50 border-b border-primary-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-primary-700 whitespace-nowrap">
                    <button
                      onClick={() => {
                        if (sortField === 'name') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortField('name');
                          setSortOrder('asc');
                        }
                      }}
                      className="flex items-center gap-1 hover:text-action-primary"
                    >
                      Person
                      {sortField === 'name' && (
                        <Icon name={sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'} size="sm" />
                      )}
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-primary-700 whitespace-nowrap">Employee ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-primary-700 whitespace-nowrap">
                    <button
                      onClick={() => {
                        if (sortField === 'department') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortField('department');
                          setSortOrder('asc');
                        }
                      }}
                      className="flex items-center gap-1 hover:text-action-primary"
                    >
                      Department
                      {sortField === 'department' && (
                        <Icon name={sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'} size="sm" />
                      )}
                    </button>
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-primary-700 whitespace-nowrap">
                    <button
                      onClick={() => {
                        if (sortField === 'quantity') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortField('quantity');
                          setSortOrder('desc');
                        }
                      }}
                      className="flex items-center gap-1 hover:text-action-primary mx-auto"
                    >
                      Items
                      {sortField === 'quantity' && (
                        <Icon name={sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'} size="sm" />
                      )}
                    </button>
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-primary-700 whitespace-nowrap">Types</th>
                  <th className="text-left px-4 py-3 font-semibold text-primary-700 whitespace-nowrap">
                    <button
                      onClick={() => {
                        if (sortField === 'date') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortField('date');
                          setSortOrder('desc');
                        }
                      }}
                      className="flex items-center gap-1 hover:text-action-primary"
                    >
                      Last Issued
                      {sortField === 'date' && (
                        <Icon name={sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'} size="sm" />
                      )}
                    </button>
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-primary-700 whitespace-nowrap">
                    <button
                      onClick={() => {
                        if (sortField === 'issuedBy') {
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        } else {
                          setSortField('issuedBy');
                          setSortOrder('asc');
                        }
                      }}
                      className="flex items-center gap-1 hover:text-action-primary"
                    >
                      Issued By
                      {sortField === 'issuedBy' && (
                        <Icon name={sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'} size="sm" />
                      )}
                    </button>
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-primary-700 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {groupedByPerson.map((group) => {
                  const lastIssuedDate = Math.max(...group.records.map((r) => new Date(r.issuedAt).getTime()));
                  const lastRecord = group.records.find((r) => new Date(r.issuedAt).getTime() === lastIssuedDate);
                  return (
                    <tr key={group.userId} className={`hover:bg-action-primary/5 transition-colors cursor-pointer ${
                  groupedByPerson.indexOf(group) % 2 === 0 ? 'bg-white' : 'bg-primary-50/40'
                }`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-action-primary/10 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-action-primary font-bold text-xs">
                              {group.userName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </span>
                          </div>
                          <span className="font-medium text-primary-900">{group.userName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-primary-600">{group.userEmployeeId || '-'}</td>
                      <td className="px-4 py-3">
                        {group.userDepartment ? (
                          <span className="px-2 py-1 bg-primary-100 rounded text-xs font-medium text-primary-700">
                            {group.userDepartment}
                          </span>
                        ) : (
                          <span className="text-primary-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-primary-900">{group.totalItems}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-primary-600">{group.records.length}</td>
                      <td className="px-4 py-3 text-primary-600">
                        {new Date(lastIssuedDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-primary-600">
                        {lastRecord?.issuedBy || '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setSelectedPerson(group)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-action-primary hover:bg-action-primary/10 rounded transition-colors"
                        >
                          <Icon name="visibility" size="sm" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary-50 border-b border-primary-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-primary-700 whitespace-nowrap">Item</th>
                  <th className="text-left px-4 py-3 font-semibold text-primary-700 whitespace-nowrap">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-primary-700 whitespace-nowrap">Size</th>
                  <th className="text-center px-4 py-3 font-semibold text-primary-700 whitespace-nowrap">Total Issued</th>
                  <th className="text-center px-4 py-3 font-semibold text-primary-700 whitespace-nowrap">People</th>
                  <th className="text-center px-4 py-3 font-semibold text-primary-700 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-100">
                {groupedByItem.map((group, index) => (
                  <tr key={group.sizeId} className={`hover:bg-action-primary/5 transition-colors cursor-pointer ${
                    index % 2 === 0 ? 'bg-white' : 'bg-primary-50/40'
                  }`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                          <Package className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="font-medium text-primary-900">{group.itemName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-primary-100 rounded text-xs font-medium text-primary-700">
                        {group.categoryName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-primary-600">{group.sizeName || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold text-primary-900">{group.totalIssued}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-primary-600">{group.records.length}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleGroup(group.sizeId)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-action-primary hover:bg-action-primary/10 rounded transition-colors"
                      >
                        <Icon name={expandedGroups.has(group.sizeId) ? 'expand_less' : 'expand_more'} size="sm" />
                        {expandedGroups.has(group.sizeId) ? 'Hide' : 'Show'} Recipients
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Expanded item details */}
            {groupedByItem.map((group) =>
              expandedGroups.has(group.sizeId) && (
                <div key={`${group.sizeId}-detail`} className="border-t border-primary-200 bg-primary-50/50">
                  <div className="px-4 py-2 bg-primary-100 border-b border-primary-200">
                    <span className="text-xs font-semibold text-primary-600 uppercase">
                      Recipients of {group.itemName} ({group.sizeName || 'N/A'})
                    </span>
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-primary-50">
                      <tr>
                        <th className="text-left px-6 py-2 font-medium text-primary-600">Person</th>
                        <th className="text-left px-4 py-2 font-medium text-primary-600">Department</th>
                        <th className="text-center px-4 py-2 font-medium text-primary-600">Qty</th>
                        <th className="text-left px-4 py-2 font-medium text-primary-600">Issued Date</th>
                        <th className="text-left px-4 py-2 font-medium text-primary-600">Issued By</th>
                        <th className="text-left px-4 py-2 font-medium text-primary-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-100 bg-white">
                      {group.records.map((record) => (
                        <tr key={record.id} className={record.returnedAt ? 'opacity-60' : ''}>
                          <td className="px-6 py-2">
                            <div className="font-medium text-primary-900">{record.userName}</div>
                            {record.userEmployeeId && (
                              <div className="text-xs text-primary-500">{record.userEmployeeId}</div>
                            )}
                          </td>
                          <td className="px-4 py-2 text-primary-600">{record.userDepartment || '-'}</td>
                          <td className="px-4 py-2 text-center font-medium">{record.quantity}</td>
                          <td className="px-4 py-2 text-primary-600">{new Date(record.issuedAt).toLocaleDateString()}</td>
                          <td className="px-4 py-2 text-primary-600">{record.issuedBy}</td>
                          <td className="px-4 py-2">
                            {record.returnedAt ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                Returned
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                Active
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        )}
      </Card>

      {/* Person Detail Modal */}
      <Modal
        isOpen={!!selectedPerson}
        onClose={() => setSelectedPerson(null)}
        title={`${selectedPerson?.userName}'s Issued Gear`}
        size="lg"
      >
        {selectedPerson && (
          <div className="space-y-4">
            {/* Person Info */}
            <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-lg">
              <div className="w-14 h-14 bg-action-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {selectedPerson.userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary-900">{selectedPerson.userName}</h3>
                <div className="text-sm text-primary-600">
                  {selectedPerson.userEmployeeId && <span className="mr-3">{selectedPerson.userEmployeeId}</span>}
                  {selectedPerson.userDepartment && <span>{selectedPerson.userDepartment}</span>}
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-2xl font-bold text-action-primary">{selectedPerson.totalItems}</div>
                <div className="text-xs text-primary-500">Total Items</div>
              </div>
            </div>

            {/* Items Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-primary-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-primary-600">Item</th>
                    <th className="text-left px-4 py-3 font-medium text-primary-600">Category</th>
                    <th className="text-left px-4 py-3 font-medium text-primary-600">Size</th>
                    <th className="text-center px-4 py-3 font-medium text-primary-600">Qty</th>
                    <th className="text-left px-4 py-3 font-medium text-primary-600">Issued Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary-100">
                  {selectedPerson.records.map((record) => {
                    const item = getItemDetails(record.sizeId);
                    return (
                      <tr key={record.id}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-primary-900">{item?.itemTypeName || 'Unknown'}</div>
                          <div className="text-xs text-primary-500">{item?.manufacturer}</div>
                        </td>
                        <td className="px-4 py-3 text-primary-700">{item?.categoryName || '-'}</td>
                        <td className="px-4 py-3 text-primary-700">{item?.sizeName || '-'}</td>
                        <td className="px-4 py-3 text-center font-medium">{record.quantity}</td>
                        <td className="px-4 py-3 text-primary-700">{new Date(record.issuedAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setSelectedPerson(null)}
                className="px-4 py-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
              >
                Close
              </button>
              <Link
                to={`/employees/${selectedPerson.userId}`}
                className="px-4 py-2 bg-action-primary text-white rounded-lg hover:bg-action-hover transition-colors"
              >
                View Full Profile
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
