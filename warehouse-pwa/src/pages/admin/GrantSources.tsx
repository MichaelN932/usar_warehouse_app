import { useState, useEffect } from 'react';
import { grantSourcesApi } from '../../services/api';
import { GrantSource } from '../../types';

export default function GrantSourcesPage() {
  const [grantSources, setGrantSources] = useState<GrantSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGrant, setEditingGrant] = useState<GrantSource | null>(null);
  const [filterYear, setFilterYear] = useState<string>('');

  useEffect(() => {
    loadGrantSources();
  }, []);

  async function loadGrantSources() {
    try {
      const data = await grantSourcesApi.getAll();
      setGrantSources(data);
    } catch (error) {
      console.error('Failed to load grant sources:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function getGrantColor(code: string): string {
    if (code.includes('FEMA')) return 'bg-grant-fema/10 text-grant-fema border-grant-fema/20';
    if (code.includes('State')) return 'bg-grant-state/10 text-grant-state border-grant-state/20';
    if (code.includes('PRM')) return 'bg-grant-prm/10 text-grant-prm border-grant-prm/20';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  }

  function getBudgetColor(percentUsed: number): string {
    if (percentUsed >= 90) return 'bg-status-error';
    if (percentUsed >= 75) return 'bg-status-warning';
    return 'bg-status-success';
  }

  function handleEdit(grant: GrantSource) {
    setEditingGrant(grant);
    setShowModal(true);
  }

  function handleCreate() {
    setEditingGrant(null);
    setShowModal(true);
  }

  async function handleToggleActive(grant: GrantSource) {
    try {
      await grantSourcesApi.update(grant.id, { isActive: !grant.isActive });
      loadGrantSources();
    } catch (error) {
      console.error('Failed to toggle grant status:', error);
    }
  }

  const filteredGrants = filterYear
    ? grantSources.filter(g => g.fiscalYear.toString() === filterYear)
    : grantSources;

  const fiscalYears = [...new Set(grantSources.map(g => g.fiscalYear))].sort((a, b) => b - a);

  const totalBudget = filteredGrants.reduce((sum, g) => sum + g.totalBudget, 0);
  const totalUsed = filteredGrants.reduce((sum, g) => sum + g.usedBudget, 0);
  const totalRemaining = totalBudget - totalUsed;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-action-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-900">Grant Sources</h1>
          <p className="text-sm text-primary-500 mt-1">Manage funding sources and budgets</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Add Grant Source
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-border-default p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600">account_balance</span>
            </div>
            <div>
              <p className="text-sm text-primary-500">Total Budget</p>
              <p className="text-xl font-bold text-primary-900">{formatCurrency(totalBudget)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-border-default p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-orange-600">payments</span>
            </div>
            <div>
              <p className="text-sm text-primary-500">Used</p>
              <p className="text-xl font-bold text-primary-900">{formatCurrency(totalUsed)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-border-default p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600">savings</span>
            </div>
            <div>
              <p className="text-sm text-primary-500">Remaining</p>
              <p className="text-xl font-bold text-primary-900">{formatCurrency(totalRemaining)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg border border-border-default p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-primary-700">Fiscal Year:</label>
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-3 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-action-primary"
          >
            <option value="">All Years</option>
            {fiscalYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <span className="text-sm text-primary-500">
            {filteredGrants.length} grant source{filteredGrants.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Grant Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredGrants.map((grant) => {
          const percentUsed = grant.totalBudget > 0
            ? Math.round((grant.usedBudget / grant.totalBudget) * 100)
            : 0;
          const remaining = grant.totalBudget - grant.usedBudget;

          return (
            <div
              key={grant.id}
              className={`bg-white rounded-lg border border-border-default overflow-hidden ${
                !grant.isActive ? 'opacity-60' : ''
              }`}
            >
              <div className={`px-4 py-3 border-l-4 ${getGrantColor(grant.code)}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${getGrantColor(grant.code)}`}>
                        {grant.code}
                      </span>
                      {!grant.isActive && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                          Inactive
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-primary-900 mt-1">{grant.name}</h3>
                    {grant.description && (
                      <p className="text-sm text-primary-500 mt-0.5">{grant.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(grant)}
                      className="p-2 text-primary-500 hover:bg-primary-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                    <button
                      onClick={() => handleToggleActive(grant)}
                      className={`p-2 rounded-lg transition-colors ${
                        grant.isActive
                          ? 'text-orange-500 hover:bg-orange-50'
                          : 'text-green-500 hover:bg-green-50'
                      }`}
                      title={grant.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {grant.isActive ? 'toggle_on' : 'toggle_off'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-primary-500">FY {grant.fiscalYear}</span>
                  <span className="font-medium text-primary-900">
                    {formatCurrency(grant.usedBudget)} / {formatCurrency(grant.totalBudget)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="budget-bar">
                    <div
                      className={`budget-bar-fill ${getBudgetColor(percentUsed)}`}
                      style={{ width: `${Math.min(percentUsed, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className={`font-medium ${
                      percentUsed >= 90 ? 'text-status-error' :
                      percentUsed >= 75 ? 'text-status-warning' :
                      'text-status-success'
                    }`}>
                      {percentUsed}% used
                    </span>
                    <span className="text-primary-500">
                      {formatCurrency(remaining)} remaining
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filteredGrants.length === 0 && (
          <div className="col-span-2 bg-white rounded-lg border border-border-default p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-primary-300 mb-3 block">
              account_balance
            </span>
            <h3 className="text-lg font-medium text-primary-700 mb-2">No Grant Sources</h3>
            <p className="text-sm text-primary-500 mb-4">
              Get started by adding your first grant source.
            </p>
            <button onClick={handleCreate} className="btn-primary">
              Add Grant Source
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <GrantSourceModal
          grant={editingGrant}
          onClose={() => {
            setShowModal(false);
            setEditingGrant(null);
          }}
          onSaved={() => {
            setShowModal(false);
            setEditingGrant(null);
            loadGrantSources();
          }}
        />
      )}
    </div>
  );
}

// Grant Source Modal Component
function GrantSourceModal({
  grant,
  onClose,
  onSaved,
}: {
  grant: GrantSource | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(grant?.name || '');
  const [code, setCode] = useState(grant?.code || '');
  const [description, setDescription] = useState(grant?.description || '');
  const [fiscalYear, setFiscalYear] = useState(grant?.fiscalYear || new Date().getFullYear());
  const [totalBudget, setTotalBudget] = useState(grant?.totalBudget || 0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !code.trim()) {
      setError('Name and code are required');
      return;
    }

    setSubmitting(true);
    try {
      if (grant) {
        await grantSourcesApi.update(grant.id, {
          name,
          code,
          description: description || undefined,
          fiscalYear,
          totalBudget,
        });
      } else {
        await grantSourcesApi.create({
          name,
          code,
          description: description || undefined,
          fiscalYear,
          totalBudget,
          isActive: true,
        });
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save grant source');
    } finally {
      setSubmitting(false);
    }
  }

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="border-b border-border-default p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary-900">
            {grant ? 'Edit Grant Source' : 'Add Grant Source'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-primary-100 rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-primary-700 mb-1">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., FEMA Homeland Security"
                className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">Code *</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g., FEMA-2025"
                className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">Fiscal Year</label>
              <select
                value={fiscalYear}
                onChange={(e) => setFiscalYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-primary-700 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-primary-700 mb-1">Total Budget</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500">$</span>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-default">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border-default text-primary-700 rounded-lg hover:bg-primary-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary disabled:opacity-50"
            >
              {submitting ? 'Saving...' : grant ? 'Save Changes' : 'Add Grant Source'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
