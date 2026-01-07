import { useState, useEffect } from 'react';
import { Card, Modal, EmptyState } from '../../components/ui';
import { usersApi } from '../../services/api';
import { User, UserRole } from '../../types';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [editForm, setEditForm] = useState<Partial<User>>({});

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setIsLoading(true);
    try {
      const allUsers = await usersApi.getAll();
      setUsers(allUsers);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredUsers = users.filter((user) => {
    if (roleFilter !== 'all' && user.role !== roleFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
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

  const roleCounts = {
    TeamMember: users.filter((u) => u.role === 'TeamMember').length,
    WarehouseStaff: users.filter((u) => u.role === 'WarehouseStaff').length,
    WarehouseAdmin: users.filter((u) => u.role === 'WarehouseAdmin').length,
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">{users.length} users in the system</p>
        </div>
        <button className="btn btn-primary">Add User</button>
      </div>

      {/* Role Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-700">{roleCounts.TeamMember}</div>
          <div className="text-sm text-gray-500">Team Members</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-700">{roleCounts.WarehouseStaff}</div>
          <div className="text-sm text-blue-600">Warehouse Staff</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">{roleCounts.WarehouseAdmin}</div>
          <div className="text-sm text-purple-600">Administrators</div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
            />
          </div>
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
        </div>
      </Card>

      {/* User List */}
      {filteredUsers.length === 0 ? (
        <Card>
          <EmptyState
            title="No users found"
            description="Try adjusting your search or filters"
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Member Since
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-fire-100 flex items-center justify-center mr-3">
                          <span className="text-fire-700 font-medium text-sm">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`badge ${
                          user.role === 'WarehouseAdmin'
                            ? 'bg-purple-100 text-purple-800'
                            : user.role === 'WarehouseStaff'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
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
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-fire-600 hover:text-fire-700 text-sm font-medium"
                      >
                        Edit
                      </button>
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
        title="Edit User"
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={editForm.email || ''}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
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

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={editForm.isActive}
              onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
              className="h-4 w-4 text-fire-600 focus:ring-fire-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Account is active
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
