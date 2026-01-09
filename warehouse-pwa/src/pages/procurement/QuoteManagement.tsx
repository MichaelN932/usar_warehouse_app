import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quoteRequestsApi, grantSourcesApi, vendorsApi, vendorQuotesApi } from '../../services/api';
import { QuoteRequest, GrantSource, Vendor, VendorQuote } from '../../types';
import VendorQuoteCompare from '../../components/VendorQuoteCompare';

type QuoteRequestStatus = 'Draft' | 'Sent' | 'QuotesReceived' | 'Approved' | 'Denied' | 'Converted';

export default function QuoteManagement() {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [grantSources, setGrantSources] = useState<GrantSource[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterGrant, setFilterGrant] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVendorQuoteModal, setShowVendorQuoteModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [filterStatus, filterGrant]);

  async function loadData() {
    try {
      const [quotesData, grantsData, vendorsData] = await Promise.all([
        quoteRequestsApi.getAll({
          status: filterStatus || undefined,
          grantSourceId: filterGrant || undefined,
        }),
        grantSourcesApi.getAll(true),
        vendorsApi.getAll(),
      ]);
      setQuoteRequests(quotesData);
      setGrantSources(grantsData);
      setVendors(vendorsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'Sent': return 'bg-blue-100 text-blue-700';
      case 'QuotesReceived': return 'bg-purple-100 text-purple-700';
      case 'Approved': return 'bg-green-100 text-green-700';
      case 'Denied': return 'bg-red-100 text-red-700';
      case 'Converted': return 'bg-primary-100 text-primary-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  function getGrantColor(code?: string): string {
    if (!code) return 'bg-gray-100 text-gray-600';
    if (code.includes('FEMA')) return 'bg-grant-fema/10 text-grant-fema';
    if (code.includes('State')) return 'bg-grant-state/10 text-grant-state';
    if (code.includes('PRM')) return 'bg-grant-prm/10 text-grant-prm';
    return 'bg-gray-100 text-gray-600';
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  async function handleSendToVendors(id: string) {
    try {
      await quoteRequestsApi.send(id);
      loadData();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Failed to send quote request:', error);
    }
  }

  async function handleApprove(id: string, vendorQuoteId: string) {
    try {
      await quoteRequestsApi.approve(id, vendorQuoteId);
      loadData();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Failed to approve quote:', error);
    }
  }

  async function handleDeny(id: string) {
    const reason = prompt('Reason for denial (optional):');
    try {
      await quoteRequestsApi.deny(id, reason || undefined);
      loadData();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Failed to deny quote:', error);
    }
  }

  async function handleConvert(id: string) {
    try {
      const result = await quoteRequestsApi.convert(id);
      alert(`Purchase Order ${result.purchaseOrder.poNumber} created!`);
      loadData();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Failed to convert to PO:', error);
    }
  }

  async function handleSelectQuote(vendorQuoteId: string) {
    try {
      await vendorQuotesApi.select(vendorQuoteId);
      if (selectedRequest) {
        const updated = await quoteRequestsApi.getById(selectedRequest.id);
        setSelectedRequest(updated || null);
      }
    } catch (error) {
      console.error('Failed to select quote:', error);
    }
  }

  const statusOptions: QuoteRequestStatus[] = ['Draft', 'Sent', 'QuotesReceived', 'Approved', 'Denied', 'Converted'];

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
          <h1 className="text-2xl font-semibold text-primary-900">Quote Requests</h1>
          <p className="text-sm text-primary-500 mt-1">Manage vendor quote requests and approvals</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          New Quote Request
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-border-default p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-primary-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-action-primary"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-primary-700 mb-1">Grant Source</label>
            <select
              value={filterGrant}
              onChange={(e) => setFilterGrant(e.target.value)}
              className="w-full px-3 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-action-primary"
            >
              <option value="">All Grants</option>
              {grantSources.map((grant) => (
                <option key={grant.id} value={grant.id}>{grant.code} - {grant.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quote Requests Table */}
      <div className="bg-white rounded-lg border border-border-default overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary-50 border-b border-border-default">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                Request #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                Grant
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                Items
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                Quotes
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                Created
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wider">
                Due
              </th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {quoteRequests.map((qr) => (
              <tr
                key={qr.id}
                className="hover:bg-primary-50 cursor-pointer transition-colors"
                onClick={() => setSelectedRequest(qr)}
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-sm font-medium text-primary-900">
                    {qr.requestNumber}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(qr.status)}`}>
                    {qr.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {qr.grantSource ? (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getGrantColor(qr.grantSource.code)}`}>
                      {qr.grantSource.code}
                    </span>
                  ) : (
                    <span className="text-sm text-primary-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-primary-700">
                  {qr.lines?.length || 0}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm ${qr.vendorQuotes && qr.vendorQuotes.length > 0 ? 'text-primary-700' : 'text-primary-400'}`}>
                    {qr.vendorQuotes?.length || 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-primary-500">
                  {formatDate(qr.createdAt)}
                </td>
                <td className="px-4 py-3 text-sm text-primary-500">
                  {qr.dueDate ? formatDate(qr.dueDate) : '-'}
                </td>
                <td className="px-4 py-3">
                  <span className="material-symbols-outlined text-primary-400">chevron_right</span>
                </td>
              </tr>
            ))}
            {quoteRequests.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-primary-500">
                  <span className="material-symbols-outlined text-4xl mb-2 block">request_quote</span>
                  <p>No quote requests found</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="mt-4 text-action-primary hover:underline"
                  >
                    Create your first quote request
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Slideout */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSelectedRequest(null)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border-default p-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-lg font-semibold text-primary-900">
                  {selectedRequest.requestNumber}
                </h2>
                <span className={`mt-1 inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                  {selectedRequest.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-primary-500 uppercase">Grant Source</label>
                  <p className="mt-1">
                    {selectedRequest.grantSource ? (
                      <span className={`px-2 py-1 rounded text-sm ${getGrantColor(selectedRequest.grantSource.code)}`}>
                        {selectedRequest.grantSource.code} - {selectedRequest.grantSource.name}
                      </span>
                    ) : (
                      <span className="text-primary-400">Not assigned</span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-primary-500 uppercase">Due Date</label>
                  <p className="mt-1 text-sm text-primary-900">
                    {selectedRequest.dueDate ? formatDate(selectedRequest.dueDate) : 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-primary-500 uppercase">Requested By</label>
                  <p className="mt-1 text-sm text-primary-900">
                    {selectedRequest.requestedBy
                      ? `${selectedRequest.requestedBy.firstName} ${selectedRequest.requestedBy.lastName}`
                      : 'Unknown'}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-primary-500 uppercase">Created</label>
                  <p className="mt-1 text-sm text-primary-900">
                    {formatDate(selectedRequest.createdAt)}
                  </p>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <h3 className="text-sm font-semibold text-primary-900 mb-3">Requested Items</h3>
                <div className="border border-border-default rounded-lg divide-y divide-border-default">
                  {selectedRequest.lines?.map((line, idx) => (
                    <div key={line.id || idx} className="p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-primary-900">{line.description}</p>
                        <p className="text-xs text-primary-500">
                          Qty: {line.quantity}
                          {line.estimatedUnitPrice && ` · Est. ${formatCurrency(line.estimatedUnitPrice)}/ea`}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!selectedRequest.lines || selectedRequest.lines.length === 0) && (
                    <div className="p-4 text-center text-primary-500">No items</div>
                  )}
                </div>
              </div>

              {/* Vendor Quotes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-primary-900">Vendor Quotes</h3>
                  <div className="flex items-center gap-3">
                    {selectedRequest.vendorQuotes && selectedRequest.vendorQuotes.length > 1 && (
                      <button
                        onClick={() => setShowCompareModal(true)}
                        className="text-sm text-action-primary hover:underline flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-lg">compare</span>
                        Compare
                      </button>
                    )}
                    {['Sent', 'QuotesReceived'].includes(selectedRequest.status) && (
                      <button
                        onClick={() => setShowVendorQuoteModal(true)}
                        className="text-sm text-action-primary hover:underline flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add Quote
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  {selectedRequest.vendorQuotes?.map((vq) => (
                    <div
                      key={vq.id}
                      className={`border rounded-lg p-4 ${
                        vq.isSelected ? 'border-green-500 bg-green-50' : 'border-border-default'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-primary-900">{vq.vendor?.name}</p>
                            {vq.isSelected && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                                Selected
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-primary-500">
                            {vq.quoteNumber && `#${vq.quoteNumber} · `}
                            Received {formatDate(vq.receivedDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-primary-900">
                            {formatCurrency(vq.totalAmount)}
                          </p>
                          {vq.shippingCost > 0 && (
                            <p className="text-xs text-primary-500">
                              +{formatCurrency(vq.shippingCost)} shipping
                            </p>
                          )}
                        </div>
                      </div>
                      {vq.leadTimeDays && (
                        <p className="mt-2 text-xs text-primary-500">
                          Lead time: {vq.leadTimeDays} days
                        </p>
                      )}
                      {!vq.isSelected && selectedRequest.status === 'QuotesReceived' && (
                        <button
                          onClick={() => handleSelectQuote(vq.id)}
                          className="mt-3 text-sm text-action-primary hover:underline"
                        >
                          Select this quote
                        </button>
                      )}
                    </div>
                  ))}
                  {(!selectedRequest.vendorQuotes || selectedRequest.vendorQuotes.length === 0) && (
                    <div className="border border-dashed border-border-default rounded-lg p-6 text-center text-primary-500">
                      <span className="material-symbols-outlined text-3xl mb-2 block">inventory</span>
                      <p>No vendor quotes received yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedRequest.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-primary-900 mb-2">Notes</h3>
                  <p className="text-sm text-primary-700 bg-primary-50 rounded-lg p-3">
                    {selectedRequest.notes}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="border-t border-border-default pt-6 flex flex-wrap gap-3">
                {selectedRequest.status === 'Draft' && (
                  <button
                    onClick={() => handleSendToVendors(selectedRequest.id)}
                    className="btn-primary"
                  >
                    Send to Vendors
                  </button>
                )}
                {selectedRequest.status === 'QuotesReceived' && (
                  <>
                    {selectedRequest.vendorQuotes?.some(vq => vq.isSelected) && (
                      <button
                        onClick={() => {
                          const selected = selectedRequest.vendorQuotes?.find(vq => vq.isSelected);
                          if (selected) handleApprove(selectedRequest.id, selected.id);
                        }}
                        className="btn-primary"
                      >
                        Approve Selected Quote
                      </button>
                    )}
                    <button
                      onClick={() => handleDeny(selectedRequest.id)}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Deny Request
                    </button>
                  </>
                )}
                {selectedRequest.status === 'Approved' && (
                  <button
                    onClick={() => handleConvert(selectedRequest.id)}
                    className="btn-primary"
                  >
                    Convert to Purchase Order
                  </button>
                )}
                <Link
                  to={`/procurement/quotes/${selectedRequest.id}/edit`}
                  className="px-4 py-2 border border-border-default text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Quote Request Modal */}
      {showCreateModal && (
        <CreateQuoteRequestModal
          grantSources={grantSources}
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            loadData();
          }}
        />
      )}

      {/* Add Vendor Quote Modal */}
      {showVendorQuoteModal && selectedRequest && (
        <AddVendorQuoteModal
          quoteRequest={selectedRequest}
          vendors={vendors}
          onClose={() => setShowVendorQuoteModal(false)}
          onAdded={() => {
            setShowVendorQuoteModal(false);
            loadData();
            // Refresh selected request
            quoteRequestsApi.getById(selectedRequest.id).then(qr => setSelectedRequest(qr || null));
          }}
        />
      )}

      {/* Compare Quotes Modal */}
      {showCompareModal && selectedRequest && selectedRequest.vendorQuotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowCompareModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-border-default p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-primary-900">Compare Vendor Quotes</h2>
                <p className="text-sm text-primary-500">{selectedRequest.requestNumber}</p>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-2 hover:bg-primary-100 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-80px)]">
              <VendorQuoteCompare
                quoteRequestLines={selectedRequest.lines || []}
                vendorQuotes={selectedRequest.vendorQuotes}
                selectedQuoteId={selectedRequest.vendorQuotes.find(vq => vq.isSelected)?.id}
                onSelectQuote={async (quoteId) => {
                  await handleSelectQuote(quoteId);
                  // Refresh selected request
                  const updated = await quoteRequestsApi.getById(selectedRequest.id);
                  setSelectedRequest(updated || null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Create Quote Request Modal Component
function CreateQuoteRequestModal({
  grantSources,
  onClose,
  onCreated,
}: {
  grantSources: GrantSource[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [grantSourceId, setGrantSourceId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<Array<{ description: string; quantity: number; estimatedUnitPrice: number }>>([
    { description: '', quantity: 1, estimatedUnitPrice: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  function addLine() {
    setLines([...lines, { description: '', quantity: 1, estimatedUnitPrice: 0 }]);
  }

  function removeLine(index: number) {
    setLines(lines.filter((_, i) => i !== index));
  }

  function updateLine(index: number, field: string, value: string | number) {
    setLines(lines.map((line, i) => i === index ? { ...line, [field]: value } : line));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (lines.every(l => !l.description.trim())) {
      alert('Please add at least one line item');
      return;
    }
    setSubmitting(true);
    try {
      await quoteRequestsApi.create({
        grantSourceId: grantSourceId || undefined,
        dueDate: dueDate || undefined,
        notes: notes || undefined,
        lines: lines.filter(l => l.description.trim()).map(l => ({
          description: l.description,
          quantity: l.quantity,
          estimatedUnitPrice: l.estimatedUnitPrice || undefined,
        })),
      });
      onCreated();
    } catch (error) {
      console.error('Failed to create quote request:', error);
      alert('Failed to create quote request');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border-default p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary-900">New Quote Request</h2>
          <button onClick={onClose} className="p-2 hover:bg-primary-100 rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">Grant Source</label>
              <select
                value={grantSourceId}
                onChange={(e) => setGrantSourceId(e.target.value)}
                className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
              >
                <option value="">Select grant source</option>
                {grantSources.map((g) => (
                  <option key={g.id} value={g.id}>{g.code} - {g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">Line Items</label>
            <div className="space-y-3">
              {lines.map((line, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Description"
                      value={line.description}
                      onChange={(e) => updateLine(idx, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      value={line.quantity}
                      onChange={(e) => updateLine(idx, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
                    />
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      placeholder="Est. Price"
                      min="0"
                      step="0.01"
                      value={line.estimatedUnitPrice || ''}
                      onChange={(e) => updateLine(idx, 'estimatedUnitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
                    />
                  </div>
                  {lines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLine(idx)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addLine}
              className="mt-3 text-sm text-action-primary hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add Line
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
              placeholder="Additional notes or requirements..."
            />
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
              {submitting ? 'Creating...' : 'Create Quote Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Vendor Quote Modal Component
function AddVendorQuoteModal({
  quoteRequest,
  vendors,
  onClose,
  onAdded,
}: {
  quoteRequest: QuoteRequest;
  vendors: Vendor[];
  onClose: () => void;
  onAdded: () => void;
}) {
  const [vendorId, setVendorId] = useState('');
  const [quoteNumber, setQuoteNumber] = useState('');
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [leadTimeDays, setLeadTimeDays] = useState<number | ''>('');
  const [lines, setLines] = useState(
    quoteRequest.lines?.map(l => ({
      quoteRequestLineId: l.id,
      description: l.description,
      quantity: l.quantity,
      unitPrice: 0,
    })) || []
  );
  const [submitting, setSubmitting] = useState(false);

  function updateLine(index: number, unitPrice: number) {
    setLines(lines.map((line, i) => i === index ? { ...line, unitPrice } : line));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!vendorId) {
      alert('Please select a vendor');
      return;
    }
    setSubmitting(true);
    try {
      await vendorQuotesApi.create({
        quoteRequestId: quoteRequest.id,
        vendorId,
        quoteNumber: quoteNumber || undefined,
        receivedDate,
        validUntil: validUntil || undefined,
        shippingCost,
        leadTimeDays: leadTimeDays ? Number(leadTimeDays) : undefined,
        lines: lines.map(l => ({
          quoteRequestLineId: l.quoteRequestLineId,
          description: l.description,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
        })),
      });
      onAdded();
    } catch (error) {
      console.error('Failed to add vendor quote:', error);
      alert('Failed to add vendor quote');
    } finally {
      setSubmitting(false);
    }
  }

  const totalAmount = lines.reduce((sum, l) => sum + (l.unitPrice * l.quantity), 0) + shippingCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border-default p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary-900">Add Vendor Quote</h2>
          <button onClick={onClose} className="p-2 hover:bg-primary-100 rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">Vendor *</label>
              <select
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
              >
                <option value="">Select vendor</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">Quote Number</label>
              <input
                type="text"
                value={quoteNumber}
                onChange={(e) => setQuoteNumber(e.target.value)}
                className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">Received Date *</label>
              <input
                type="date"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">Valid Until</label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">Shipping Cost</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={shippingCost}
                onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">Lead Time (days)</label>
              <input
                type="number"
                min="0"
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(e.target.value ? parseInt(e.target.value) : '')}
                className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">Line Item Pricing</label>
            <div className="border border-border-default rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-primary-700">Description</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-primary-700">Qty</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-primary-700">Unit Price</th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-primary-700">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {lines.map((line, idx) => (
                    <tr key={idx}>
                      <td className="px-3 py-2 text-sm text-primary-700">{line.description}</td>
                      <td className="px-3 py-2 text-center text-sm text-primary-700">{line.quantity}</td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.unitPrice || ''}
                          onChange={(e) => updateLine(idx, parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 border border-border-default rounded text-right focus:outline-none focus:ring-2 focus:ring-action-primary"
                        />
                      </td>
                      <td className="px-3 py-2 text-right text-sm font-medium text-primary-900">
                        ${(line.unitPrice * line.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-primary-50">
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-right text-sm font-medium text-primary-700">
                      Shipping:
                    </td>
                    <td className="px-3 py-2 text-right text-sm font-medium text-primary-900">
                      ${shippingCost.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-right text-sm font-semibold text-primary-900">
                      Total:
                    </td>
                    <td className="px-3 py-2 text-right text-lg font-bold text-primary-900">
                      ${totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
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
              {submitting ? 'Adding...' : 'Add Quote'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
