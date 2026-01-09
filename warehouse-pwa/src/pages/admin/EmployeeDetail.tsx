import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, Modal, EmptyState, Icon } from '../../components/ui';
import { usersApi, EmployeeDetail as EmployeeDetailType } from '../../services/api';
import { IssuedItem, RETURN_CONDITIONS, ReturnCondition } from '../../types';

export function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<EmployeeDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ppe' | 'requests' | 'history'>('ppe');
  const [selectedItem, setSelectedItem] = useState<IssuedItem | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadEmployee();
    }
  }, [id]);

  async function loadEmployee() {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await usersApi.getEmployeeDetail(id);
      setEmployee(data || null);
    } finally {
      setIsLoading(false);
    }
  }

  const groupedPPE = employee?.issuedItems.reduce((acc, item) => {
    const cat = item.categoryName || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, IssuedItem[]>) || {};

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-action-primary"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/users')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-900"
        >
          <Icon name="arrow_back" size="sm" />
          Back to Team Directory
        </button>
        <Card>
          <EmptyState
            title="Employee not found"
            description="The employee you're looking for doesn't exist or has been removed."
            icon={<Icon name="person_off" size="xl" />}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/users')}
          className="flex items-center gap-2 text-primary-600 hover:text-primary-900"
        >
          <Icon name="arrow_back" size="sm" />
          Back to Team Directory
        </button>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary flex items-center gap-2">
            <Icon name="edit" size="sm" />
            Edit
          </button>
          <button className="btn btn-primary flex items-center gap-2">
            <Icon name="add" size="sm" />
            Issue PPE
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <Card>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar & Basic Info */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-action-primary to-action-pressed flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {employee.firstName[0]}{employee.lastName[0]}
              </span>
            </div>
            <div>
              <h1 className="text-heading-lg text-primary-900">
                {employee.firstName} {employee.lastName}
              </h1>
              <p className="text-primary-600">{employee.position || 'Team Member'}</p>
              <div className="flex items-center gap-4 mt-2">
                {employee.employeeId && (
                  <span className="inline-flex items-center gap-1 text-sm text-primary-500">
                    <Icon name="badge" size="sm" />
                    #{employee.employeeId}
                  </span>
                )}
                {employee.department && (
                  <span className="inline-flex items-center gap-1 text-sm text-primary-500">
                    <Icon name="business" size="sm" />
                    {employee.department}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Contact & Status */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 md:border-l md:pl-6">
            <div>
              <label className="text-xs text-primary-500 uppercase tracking-wide">Email</label>
              <p className="text-sm font-medium text-primary-900 truncate">{employee.email}</p>
            </div>
            <div>
              <label className="text-xs text-primary-500 uppercase tracking-wide">Phone</label>
              <p className="text-sm font-medium text-primary-900">{employee.phone || '—'}</p>
            </div>
            <div>
              <label className="text-xs text-primary-500 uppercase tracking-wide">Status</label>
              <span
                className={`inline-block mt-1 badge ${
                  employee.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {employee.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <label className="text-xs text-primary-500 uppercase tracking-wide">Role</label>
              <span
                className={`inline-block mt-1 badge ${
                  employee.role === 'WarehouseAdmin'
                    ? 'bg-purple-100 text-purple-800'
                    : employee.role === 'WarehouseStaff'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-primary-100 text-primary-800'
                }`}
              >
                {employee.role === 'TeamMember'
                  ? 'Team Member'
                  : employee.role === 'WarehouseStaff'
                  ? 'Warehouse Staff'
                  : 'Admin'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600">{employee.assignedPPECount}</div>
          <div className="text-sm text-primary-500">PPE Items Assigned</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-blue-600">{employee.requestHistory.total}</div>
          <div className="text-sm text-primary-500">Total Requests</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-yellow-600">{employee.requestHistory.pending}</div>
          <div className="text-sm text-primary-500">Pending Requests</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-primary-600">
            {employee.lastPPEIssueDate
              ? new Date(employee.lastPPEIssueDate).toLocaleDateString()
              : '—'}
          </div>
          <div className="text-sm text-primary-500">Last Issue Date</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-primary-200">
        <nav className="flex gap-4">
          {[
            { id: 'ppe' as const, label: 'Assigned PPE', icon: 'inventory_2', count: employee.assignedPPECount },
            { id: 'requests' as const, label: 'Recent Requests', icon: 'receipt_long', count: employee.recentRequests.length },
            { id: 'history' as const, label: 'Activity', icon: 'history' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-action-primary text-action-primary'
                  : 'border-transparent text-primary-500 hover:text-primary-700 hover:border-primary-300'
              }`}
            >
              <Icon name={tab.icon} size="sm" />
              <span className="font-medium">{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  activeTab === tab.id ? 'bg-action-primary/10 text-action-primary' : 'bg-primary-100 text-primary-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'ppe' && (
        <div className="space-y-6">
          {employee.issuedItems.length === 0 ? (
            <Card>
              <EmptyState
                title="No PPE assigned"
                description="This team member doesn't have any PPE currently assigned."
                icon={<Icon name="inventory_2" size="xl" />}
              />
            </Card>
          ) : (
            Object.entries(groupedPPE).map(([category, items]) => (
              <Card key={category} title={category}>
                <div className="divide-y divide-gray-100">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                          <Icon name="checkroom" size="md" className="text-primary-500" />
                        </div>
                        <div>
                          <div className="font-medium text-primary-900">{item.itemTypeName}</div>
                          <div className="text-sm text-primary-500">
                            {item.variantName} • {item.sizeName}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium text-primary-900">Qty: {item.quantity}</div>
                          <div className="text-xs text-primary-500">
                            Issued {new Date(item.issuedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setIsReturnModalOpen(true);
                          }}
                          className="p-2 text-primary-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Process Return"
                        >
                          <Icon name="rotate_left" size="sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <Card>
          {employee.recentRequests.length === 0 ? (
            <EmptyState
              title="No requests"
              description="This team member hasn't submitted any requests."
              icon={<Icon name="receipt_long" size="xl" />}
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {employee.recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <div className="font-medium text-primary-900">
                      {request.lines.length} item{request.lines.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-sm text-primary-500">
                      {new Date(request.requestDate).toLocaleDateString()} • {request.lines.map(l => l.itemTypeName).join(', ')}
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      request.status === 'Fulfilled'
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : request.status === 'ReadyForPickup'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-primary-100 text-primary-800'
                    }`}
                  >
                    {request.status === 'ReadyForPickup' ? 'Ready' : request.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {activeTab === 'history' && (
        <Card>
          <div className="text-center py-8 text-primary-500">
            <Icon name="history" size="xl" className="mx-auto mb-2 text-gray-300" />
            <p>Activity history coming soon</p>
          </div>
        </Card>
      )}

      {/* Return Modal */}
      <Modal
        isOpen={isReturnModalOpen}
        onClose={() => {
          setIsReturnModalOpen(false);
          setSelectedItem(null);
        }}
        title="Process Return"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setIsReturnModalOpen(false);
                setSelectedItem(null);
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button className="btn btn-primary">
              Process Return
            </button>
          </div>
        }
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="p-4 bg-primary-50 rounded-lg">
              <h4 className="font-medium">{selectedItem.itemTypeName}</h4>
              <p className="text-sm text-primary-600">
                {selectedItem.variantName} • {selectedItem.sizeName}
              </p>
              <p className="text-sm text-primary-500 mt-1">Qty: {selectedItem.quantity}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Condition
              </label>
              <div className="grid grid-cols-3 gap-2">
                {RETURN_CONDITIONS.map((condition) => (
                  <button
                    key={condition}
                    className="p-3 rounded-lg text-sm font-medium border-2 border-primary-200 hover:border-primary-300 transition-colors"
                  >
                    {condition === 'NeedsRepair' ? 'Needs Repair' : condition}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Notes (optional)
              </label>
              <textarea
                className="input"
                rows={3}
                placeholder="Any notes about the condition..."
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
