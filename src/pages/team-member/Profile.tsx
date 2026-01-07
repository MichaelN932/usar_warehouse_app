import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui';
import { UserSizes } from '../../types';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sizes, setSizes] = useState<UserSizes>(user?.sizes || {});
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ sizes });
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const sizeFields = [
    { key: 'shirt', label: 'Shirt Size', options: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'] },
    { key: 'pantsWaist', label: 'Pants Waist', options: ['28', '30', '32', '34', '36', '38', '40', '42'] },
    { key: 'pantsInseam', label: 'Pants Inseam', options: ['28', '30', '32', '34', '36'] },
    { key: 'bootSize', label: 'Boot Size', options: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14'] },
    { key: 'gloveSize', label: 'Glove Size', options: ['XS', 'S', 'M', 'L', 'XL', '2XL'] },
    { key: 'hatSize', label: 'Hat Size', options: ['S', 'M', 'L', 'XL', 'One Size'] },
  ] as const;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account settings and sizes</p>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Account Info */}
      <Card title="Account Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Name</label>
            <p className="text-gray-900 font-medium">
              {user?.firstName} {user?.lastName}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Role</label>
            <p className="text-gray-900">
              <span className={`badge ${
                user?.role === 'WarehouseAdmin'
                  ? 'bg-purple-100 text-purple-800'
                  : user?.role === 'WarehouseStaff'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {user?.role === 'TeamMember' ? 'Team Member' :
                 user?.role === 'WarehouseStaff' ? 'Warehouse Staff' :
                 'Warehouse Admin'}
              </span>
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Member Since</label>
            <p className="text-gray-900">
              {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Size Information */}
      <Card
        title="Size Information"
        subtitle="Your sizes are used to help fulfill gear requests accurately"
        actions={
          !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-secondary text-sm"
            >
              Edit Sizes
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSizes(user?.sizes || {});
                  setIsEditing(false);
                }}
                className="btn btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn btn-primary text-sm"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sizeFields.map(({ key, label, options }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              {isEditing ? (
                <select
                  value={sizes[key as keyof UserSizes] || ''}
                  onChange={(e) => setSizes({ ...sizes, [key]: e.target.value })}
                  className="input"
                >
                  <option value="">Not set</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900 py-2">
                  {sizes[key as keyof UserSizes] || (
                    <span className="text-gray-400">Not set</span>
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Current Sizes Summary */}
      <Card title="Quick Reference">
        <div className="flex flex-wrap gap-3">
          {user?.sizes?.shirt && (
            <div className="bg-fire-50 rounded-lg px-4 py-2">
              <span className="text-xs text-fire-600 block">Shirt</span>
              <span className="font-semibold text-fire-800">{user.sizes.shirt}</span>
            </div>
          )}
          {user?.sizes?.pantsWaist && user?.sizes?.pantsInseam && (
            <div className="bg-blue-50 rounded-lg px-4 py-2">
              <span className="text-xs text-blue-600 block">Pants</span>
              <span className="font-semibold text-blue-800">
                {user.sizes.pantsWaist}x{user.sizes.pantsInseam}
              </span>
            </div>
          )}
          {user?.sizes?.bootSize && (
            <div className="bg-green-50 rounded-lg px-4 py-2">
              <span className="text-xs text-green-600 block">Boot</span>
              <span className="font-semibold text-green-800">{user.sizes.bootSize}</span>
            </div>
          )}
          {user?.sizes?.gloveSize && (
            <div className="bg-yellow-50 rounded-lg px-4 py-2">
              <span className="text-xs text-yellow-600 block">Glove</span>
              <span className="font-semibold text-yellow-800">{user.sizes.gloveSize}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Notifications Preferences (placeholder) */}
      <Card title="Notification Preferences">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Request Updates</p>
              <p className="text-sm text-gray-500">
                Get notified when your requests are processed
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-fire-600 focus:ring-fire-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Ready for Pickup</p>
              <p className="text-sm text-gray-500">
                Get notified when items are ready for pickup
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-fire-600 focus:ring-fire-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">System Updates</p>
              <p className="text-sm text-gray-500">
                Announcements and system changes
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 text-fire-600 focus:ring-fire-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
