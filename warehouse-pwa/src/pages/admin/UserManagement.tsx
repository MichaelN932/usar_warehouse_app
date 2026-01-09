import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Modal, EmptyState, Icon, SearchInput } from '../../components/ui';
import { usersApi, UserWithPPE } from '../../services/api';
import { User, UserRole } from '../../types';

export function UserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithPPE[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [departments, setDepartments] = useState<string[]>([]);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setIsLoading(true);
    try {
      const [allUsers, depts] = await Promise.all([
        usersApi.getAllWithPPE(),
        usersApi.getDepartments(),
      ]);
      setUsers(allUsers);
      setDepartments(depts);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredUsers = users.filter((user) => {
    if (roleFilter !== 'all' && user.role !== roleFilter) return false;
    if (departmentFilter !== 'all' && user.department !== departmentFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.employeeId?.toLowerCase().includes(query) ||
        user.department?.toLowerCase().includes(query) ||
        user.position?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      employeeId: user.employeeId,
      department: user.department,
      position: user.position,
      phone: user.phone,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    setIsSaving(true);
    try {
      await usersApi.update(selectedUser.id, editForm);
      await loadUsers();
      setIsModalOpen(false);
      setSelectedUser(null);
    } finally {
      setIsSaving(false);
    }
  };

  const viewEmployeeDetails = (userId: string) => {
    navigate(`/employees/${userId}`);
  };

  const roleCounts = {
    TeamMember: users.filter((u) => u.role === 'TeamMember').length,
    WarehouseStaff: users.filter((u) => u.role === 'WarehouseStaff').length,
    WarehouseAdmin: users.filter((u) => u.role === 'WarehouseAdmin').length,
  };

  const totalAssignedPPE = users.reduce((sum, u) => sum + (u.assignedPPECount || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-action-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-lg text-primary-900">Team Directory</h1>
          <p className="text-primary-600">{users.length} team members</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Icon name="person_add" size="sm" />
          Add Team Member
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-primary-50 rounded-lg p-4 text-center">
          <div className="text-heading-lg text-primary-700">{users.length}</div>
          <div className="text-sm text-primary-500">Total Members</div>
        </div>
        <div className="bg-primary-50 rounded-lg p-4 text-center">
          <div className="text-heading-lg text-primary-700">{roleCounts.TeamMember}</div>
          <div className="text-sm text-primary-500">Team Members</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{roleCounts.WarehouseStaff}</div>
          <div className="text-sm text-blue-600">Warehouse Staff</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">{roleCounts.WarehouseAdmin}</div>
          <div className="text-sm text-purple-600">Administrators</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{totalAssignedPPE}</div>
          <div className="text-sm text-green-600">PPE Items Issued</div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, email, employee ID, or department..."
            className="flex-1"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
            className="input w-auto"
          >
            <option value="all">All Roles</option>
            <option value="TeamMember">Team Member</option>
            <option value="WarehouseStaff">Warehouse Staff</option>
            <option value="WarehouseAdmin">Warehouse Admin</option>
          </select>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* User List */}
      {filteredUsers.length === 0 ? (
        <Card>
          <EmptyState
            title="No team members found"
            description="Try adjusting your search or filters"
            icon={<Icon name="group" size="xl" />}
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-primary-200">
              <thead className="bg-primary-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-primary-500 uppercase">
                    Employee
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-primary-500 uppercase">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-primary-500 uppercase">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-primary-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-primary-500 uppercase">
                    PPE Assigned
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-primary-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-primary-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-primary-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-action-primary to-action-pressed flex items-center justify-center mr-3">
                          <span className="text-white font-medium text-sm">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-primary-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-primary-500 flex items-center gap-2">
                            <span>{user.email}</span>
                            {user.employeeId && (
                              <span className="text-xs text-primary-400 font-mono">
                                #{user.employeeId}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-primary-900">{user.department || '—'}</div>
                      <div className="text-xs text-primary-500">{user.position || ''}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge ${
                          user.role === 'WarehouseAdmin'
                            ? 'bg-purple-100 text-purple-800'
                            : user.role === 'WarehouseStaff'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-primary-100 text-primary-800'
                        }`}
                      >
                        {user.role === 'TeamMember'
                          ? 'Team Member'
                          : user.role === 'WarehouseStaff'
                          ? 'Warehouse Staff'
                          : 'Admin'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge ${
                          user.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {user.assignedPPECount > 0 ? (
                        <button
                          onClick={() => viewEmployeeDetails(user.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium hover:bg-green-200 transition-colors"
                        >
                          <Icon name="inventory_2" size="sm" />
                          {user.assignedPPECount}
                        </button>
                      ) : (
                        <span className="text-primary-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => viewEmployeeDetails(user.id)}
                          className="p-1.5 rounded-lg text-primary-500 hover:text-action-primary hover:bg-primary-100 transition-colors"
                          title="View Details"
                        >
                          <Icon name="visibility" size="sm" />
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1.5 rounded-lg text-primary-500 hover:text-action-primary hover:bg-primary-100 transition-colors"
                          title="Edit"
                        >
                          <Icon name="edit" size="sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Team Member"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn btn-primary"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={editForm.firstName || ''}
                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={editForm.lastName || ''}
                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">Email</label>
              <input
                type="email"
                value={editForm.email || ''}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">Employee ID</label>
              <input
                type="text"
                value={editForm.employeeId || ''}
                onChange={(e) => setEditForm({ ...editForm, employeeId: e.target.value })}
                className="input"
                placeholder="Badge number"
              />
            </div>
          </div>

          {/* Organization */}
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium text-primary-700 mb-3">Organization</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">Department</label>
                <input
                  type="text"
                  value={editForm.department || ''}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className="input"
                  placeholder="e.g., USAR, Fire Station 88"
                  list="departments-list"
                />
                <datalist id="departments-list">
                  {departments.map((dept) => (
                    <option key={dept} value={dept} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">Position</label>
                <input
                  type="text"
                  value={editForm.position || ''}
                  onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                  className="input"
                  placeholder="e.g., Task Force Leader, Rescue Specialist"
                />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium text-primary-700 mb-3">Contact</h4>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">Phone</label>
              <input
                type="tel"
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="input"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          {/* Access */}
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium text-primary-700 mb-3">Access & Permissions</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">Role</label>
                <select
                  value={editForm.role || ''}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}
                  className="input"
                >
                  <option value="TeamMember">Team Member</option>
                  <option value="WarehouseStaff">Warehouse Staff</option>
                  <option value="WarehouseAdmin">Warehouse Admin</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                    className="h-4 w-4 text-action-primary focus:ring-action-primary border-primary-300 rounded"
                  />
                  <span className="text-sm text-primary-700">Account is active</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
