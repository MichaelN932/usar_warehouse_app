import { useState, useEffect } from 'react';
import { Card, Modal, EmptyState } from '../../components/ui';
import { vendorsApi } from '../../services/api';
import { Vendor } from '../../types';

export function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Vendor>>({});
  const [isNewVendor, setIsNewVendor] = useState(false);

  useEffect(() => {
    loadVendors();
  }, []);

  async function loadVendors() {
    setIsLoading(true);
    try {
      const allVendors = await vendorsApi.getAll();
      setVendors(allVendors);
    } finally {
      setIsLoading(false);
    }
  }

  const openEditModal = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setEditForm({
      name: vendor.name,
      contactName: vendor.contactName,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      website: vendor.website,
      notes: vendor.notes,
      isActive: vendor.isActive,
    });
    setIsNewVendor(false);
    setIsModalOpen(true);
  };

  const openNewModal = () => {
    setSelectedVendor(null);
    setEditForm({
      name: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      notes: '',
      isActive: true,
    });
    setIsNewVendor(true);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editForm.name) return;

    setIsSaving(true);
    try {
      if (isNewVendor) {
        await vendorsApi.create(editForm as Omit<Vendor, 'id'>);
      } else if (selectedVendor) {
        await vendorsApi.update(selectedVendor.id, editForm);
      }
      await loadVendors();
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-lg text-primary-900">Vendor Management</h1>
          <p className="text-primary-600">{vendors.length} vendors configured</p>
        </div>
        <button onClick={openNewModal} className="btn btn-primary">
          Add Vendor
        </button>
      </div>

      {vendors.length === 0 ? (
        <Card>
          <EmptyState
            title="No vendors"
            description="Add vendors to start creating purchase orders"
            action={
              <button onClick={openNewModal} className="btn btn-primary">
                Add First Vendor
              </button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((vendor) => (
            <Card
              key={vendor.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => openEditModal(vendor)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-primary-900">{vendor.name}</h3>
                <span
                  className={`badge ${
                    vendor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {vendor.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {vendor.contactName && (
                <p className="text-sm text-primary-600 mb-1">
                  <span className="font-medium">Contact:</span> {vendor.contactName}
                </p>
              )}

              {vendor.email && (
                <p className="text-sm text-primary-600 mb-1">
                  <span className="font-medium">Email:</span> {vendor.email}
                </p>
              )}

              {vendor.phone && (
                <p className="text-sm text-primary-600 mb-1">
                  <span className="font-medium">Phone:</span> {vendor.phone}
                </p>
              )}

              {vendor.website && (
                <a
                  href={vendor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-sm text-action-primary hover:text-action-hover"
                >
                  Visit Website
                </a>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isNewVendor ? 'Add Vendor' : 'Edit Vendor'}
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !editForm.name}
              className="btn btn-primary"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">
              Vendor Name *
            </label>
            <input
              type="text"
              value={editForm.name || ''}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="input"
              placeholder="e.g., 5.11 Tactical"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">
              Contact Name
            </label>
            <input
              type="text"
              value={editForm.contactName || ''}
              onChange={(e) => setEditForm({ ...editForm, contactName: e.target.value })}
              className="input"
              placeholder="Account representative name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">Email</label>
              <input
                type="email"
                value={editForm.email || ''}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="input"
                placeholder="orders@vendor.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">Phone</label>
              <input
                type="tel"
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="input"
                placeholder="800-555-1234"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Website</label>
            <input
              type="url"
              value={editForm.website || ''}
              onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
              className="input"
              placeholder="https://www.vendor.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Address</label>
            <textarea
              value={editForm.address || ''}
              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
              className="input"
              rows={2}
              placeholder="Full mailing address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Notes</label>
            <textarea
              value={editForm.notes || ''}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              className="input"
              rows={2}
              placeholder="Any additional notes..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="vendorActive"
              checked={editForm.isActive}
              onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
              className="h-4 w-4 text-action-primary focus:ring-action-primary border-primary-300 rounded"
            />
            <label htmlFor="vendorActive" className="ml-2 text-sm text-primary-700">
              Vendor is active
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
