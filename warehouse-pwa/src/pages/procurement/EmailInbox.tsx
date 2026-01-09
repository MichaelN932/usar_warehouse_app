import { useState, useEffect } from 'react';
import { emailsApi, vendorsApi, quoteRequestsApi } from '../../services/api';
import { InboundEmail, Vendor, QuoteRequest } from '../../types';

type EmailStatus = 'Pending' | 'Processed' | 'Failed' | 'Ignored';

export default function EmailInbox() {
  const [emails, setEmails] = useState<InboundEmail[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('Pending');
  const [selectedEmail, setSelectedEmail] = useState<InboundEmail | null>(null);
  const [showProcessModal, setShowProcessModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  async function loadData() {
    try {
      const [emailsData, vendorsData, quotesData] = await Promise.all([
        emailsApi.getAll(filterStatus || undefined),
        vendorsApi.getAll(),
        quoteRequestsApi.getAll({ status: 'Sent' }),
      ]);
      setEmails(emailsData);
      setVendors(vendorsData);
      setQuoteRequests(quotesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusColor(status: EmailStatus): string {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700';
      case 'Processed': return 'bg-green-100 text-green-700';
      case 'Failed': return 'bg-red-100 text-red-700';
      case 'Ignored': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  function formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateStr);
  }

  async function handleIgnore(id: string) {
    try {
      await emailsApi.ignore(id);
      loadData();
      setSelectedEmail(null);
    } catch (error) {
      console.error('Failed to ignore email:', error);
    }
  }

  function handleProcess(email: InboundEmail) {
    setSelectedEmail(email);
    setShowProcessModal(true);
  }

  const statusOptions: EmailStatus[] = ['Pending', 'Processed', 'Failed', 'Ignored'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-action-primary"></div>
      </div>
    );
  }

  const pendingCount = emails.filter(e => e.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-900">Email Inbox</h1>
          <p className="text-sm text-primary-500 mt-1">
            Process inbound vendor quotes and communications
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <span className="material-symbols-outlined text-yellow-600">mail</span>
            <span className="text-sm font-medium text-yellow-700">
              {pendingCount} pending email{pendingCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-border-default p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-primary-700">Status:</label>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === ''
                  ? 'bg-action-primary text-white'
                  : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
              }`}
            >
              All
            </button>
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-action-primary text-white'
                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="bg-white rounded-lg border border-border-default overflow-hidden">
        <div className="divide-y divide-border-default">
          {emails.map((email) => (
            <div
              key={email.id}
              className={`p-4 hover:bg-primary-50 cursor-pointer transition-colors ${
                email.status === 'Pending' ? 'bg-yellow-50/50' : ''
              }`}
              onClick={() => setSelectedEmail(email)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(email.status)}`}>
                      {email.status}
                    </span>
                    {email.matchedVendor && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {email.matchedVendor.name}
                      </span>
                    )}
                    {email.matchedQuoteRequest && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-mono">
                        {email.matchedQuoteRequest.requestNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-primary-900 truncate">
                    {email.subject}
                  </p>
                  <p className="text-xs text-primary-500 truncate mt-0.5">
                    From: {email.fromAddress}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {email.attachmentCount > 0 && (
                    <div className="flex items-center gap-1 text-primary-400">
                      <span className="material-symbols-outlined text-lg">attach_file</span>
                      <span className="text-xs">{email.attachmentCount}</span>
                    </div>
                  )}
                  <span className="text-xs text-primary-400 whitespace-nowrap">
                    {formatRelativeTime(email.receivedAt)}
                  </span>
                  <span className="material-symbols-outlined text-primary-400">chevron_right</span>
                </div>
              </div>
            </div>
          ))}
          {emails.length === 0 && (
            <div className="p-12 text-center text-primary-500">
              <span className="material-symbols-outlined text-5xl mb-3 block">inbox</span>
              <h3 className="text-lg font-medium text-primary-700 mb-2">No emails</h3>
              <p className="text-sm">
                {filterStatus === 'Pending'
                  ? 'All caught up! No pending emails to process.'
                  : `No ${filterStatus.toLowerCase()} emails found.`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Email Detail Slideout */}
      {selectedEmail && !showProcessModal && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSelectedEmail(null)}
          />
          <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border-default p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedEmail.status)}`}>
                  {selectedEmail.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedEmail(null)}
                className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Email Header */}
              <div>
                <h2 className="text-lg font-semibold text-primary-900 mb-3">
                  {selectedEmail.subject}
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="w-20 text-primary-500">From:</span>
                    <span className="text-primary-900">{selectedEmail.fromAddress}</span>
                  </div>
                  <div className="flex">
                    <span className="w-20 text-primary-500">Received:</span>
                    <span className="text-primary-900">{formatDate(selectedEmail.receivedAt)}</span>
                  </div>
                  {selectedEmail.attachmentCount > 0 && (
                    <div className="flex">
                      <span className="w-20 text-primary-500">Attachments:</span>
                      <span className="text-primary-900">{selectedEmail.attachmentCount} file(s)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Auto-matched Info */}
              {(selectedEmail.matchedVendor || selectedEmail.matchedQuoteRequest) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">auto_awesome</span>
                    Auto-matched
                  </h3>
                  {selectedEmail.matchedVendor && (
                    <p className="text-sm text-blue-700">
                      Vendor: <span className="font-medium">{selectedEmail.matchedVendor.name}</span>
                    </p>
                  )}
                  {selectedEmail.matchedQuoteRequest && (
                    <p className="text-sm text-blue-700">
                      Quote Request: <span className="font-mono font-medium">{selectedEmail.matchedQuoteRequest.requestNumber}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Email Body Preview */}
              {selectedEmail.body && (
                <div>
                  <h3 className="text-sm font-semibold text-primary-900 mb-2">Message</h3>
                  <div className="bg-primary-50 rounded-lg p-4 text-sm text-primary-700 whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {selectedEmail.body}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {selectedEmail.errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-red-900 mb-1">Error</h3>
                  <p className="text-sm text-red-700">{selectedEmail.errorMessage}</p>
                </div>
              )}

              {/* Actions */}
              {selectedEmail.status === 'Pending' && (
                <div className="border-t border-border-default pt-6 flex gap-3">
                  <button
                    onClick={() => handleProcess(selectedEmail)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-xl">check_circle</span>
                    Process Email
                  </button>
                  <button
                    onClick={() => handleIgnore(selectedEmail.id)}
                    className="px-4 py-2 border border-border-default text-primary-700 rounded-lg hover:bg-primary-50 transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-xl">do_not_disturb_on</span>
                    Ignore
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Process Email Modal */}
      {showProcessModal && selectedEmail && (
        <ProcessEmailModal
          email={selectedEmail}
          vendors={vendors}
          quoteRequests={quoteRequests}
          onClose={() => {
            setShowProcessModal(false);
            setSelectedEmail(null);
          }}
          onProcessed={() => {
            setShowProcessModal(false);
            setSelectedEmail(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}

// Process Email Modal Component
function ProcessEmailModal({
  email,
  vendors,
  quoteRequests,
  onClose,
  onProcessed,
}: {
  email: InboundEmail;
  vendors: Vendor[];
  quoteRequests: QuoteRequest[];
  onClose: () => void;
  onProcessed: () => void;
}) {
  const [vendorId, setVendorId] = useState(email.matchedVendorId || '');
  const [quoteRequestId, setQuoteRequestId] = useState(email.matchedQuoteRequestId || '');
  const [createQuote, setCreateQuote] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [leadTimeDays, setLeadTimeDays] = useState<number | ''>('');
  const [lines, setLines] = useState<Array<{ description: string; quantity: number; unitPrice: number }>>([
    { description: '', quantity: 1, unitPrice: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  function addLine() {
    setLines([...lines, { description: '', quantity: 1, unitPrice: 0 }]);
  }

  function removeLine(index: number) {
    setLines(lines.filter((_, i) => i !== index));
  }

  function updateLine(index: number, field: string, value: string | number) {
    const updated = lines.map((line, i) => i === index ? { ...line, [field]: value } : line);
    setLines(updated);
    // Recalculate total
    const lineTotal = updated.reduce((sum, l) => sum + (l.unitPrice * l.quantity), 0);
    setTotalAmount(lineTotal + shippingCost);
  }

  useEffect(() => {
    const lineTotal = lines.reduce((sum, l) => sum + (l.unitPrice * l.quantity), 0);
    setTotalAmount(lineTotal + shippingCost);
  }, [lines, shippingCost]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      await emailsApi.process(email.id, {
        vendorId: vendorId || undefined,
        quoteRequestId: quoteRequestId || undefined,
        createVendorQuote: createQuote,
        vendorQuoteData: createQuote ? {
          quoteNumber: quoteNumber || undefined,
          totalAmount,
          shippingCost,
          leadTimeDays: leadTimeDays ? Number(leadTimeDays) : undefined,
          lines: lines.filter(l => l.description.trim()),
        } : undefined,
      });
      onProcessed();
    } catch (error) {
      console.error('Failed to process email:', error);
      alert('Failed to process email');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-border-default p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary-900">Process Email</h2>
          <button onClick={onClose} className="p-2 hover:bg-primary-100 rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Email Summary */}
          <div className="bg-primary-50 rounded-lg p-4">
            <p className="text-sm font-medium text-primary-900">{email.subject}</p>
            <p className="text-xs text-primary-500 mt-1">From: {email.fromAddress}</p>
          </div>

          {/* Link to Vendor */}
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Link to Vendor</label>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
            >
              <option value="">Select vendor (optional)</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>

          {/* Link to Quote Request */}
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">Link to Quote Request</label>
            <select
              value={quoteRequestId}
              onChange={(e) => setQuoteRequestId(e.target.value)}
              className="w-full px-3 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-action-primary"
            >
              <option value="">Select quote request (optional)</option>
              {quoteRequests.map((qr) => (
                <option key={qr.id} value={qr.id}>
                  {qr.requestNumber} - {qr.lines?.length || 0} items
                </option>
              ))}
            </select>
          </div>

          {/* Create Vendor Quote Toggle */}
          {vendorId && quoteRequestId && (
            <div className="border border-border-default rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={createQuote}
                  onChange={(e) => setCreateQuote(e.target.checked)}
                  className="w-5 h-5 rounded border-border-default text-action-primary focus:ring-action-primary"
                />
                <div>
                  <span className="text-sm font-medium text-primary-900">Create Vendor Quote</span>
                  <p className="text-xs text-primary-500">Enter pricing details from this email</p>
                </div>
              </label>

              {createQuote && (
                <div className="mt-4 pt-4 border-t border-border-default space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-primary-500 mb-1">Quote #</label>
                      <input
                        type="text"
                        value={quoteNumber}
                        onChange={(e) => setQuoteNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-action-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-primary-500 mb-1">Shipping</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={shippingCost}
                        onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-action-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-primary-500 mb-1">Lead Time (days)</label>
                      <input
                        type="number"
                        min="0"
                        value={leadTimeDays}
                        onChange={(e) => setLeadTimeDays(e.target.value ? parseInt(e.target.value) : '')}
                        className="w-full px-3 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-action-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-primary-500 mb-2">Line Items</label>
                    <div className="space-y-2">
                      {lines.map((line, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Description"
                            value={line.description}
                            onChange={(e) => updateLine(idx, 'description', e.target.value)}
                            className="flex-1 px-3 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-action-primary"
                          />
                          <input
                            type="number"
                            placeholder="Qty"
                            min="1"
                            value={line.quantity}
                            onChange={(e) => updateLine(idx, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-20 px-3 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-action-primary"
                          />
                          <input
                            type="number"
                            placeholder="Price"
                            min="0"
                            step="0.01"
                            value={line.unitPrice || ''}
                            onChange={(e) => updateLine(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-24 px-3 py-2 border border-border-default rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-action-primary"
                          />
                          {lines.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeLine(idx)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addLine}
                      className="mt-2 text-sm text-action-primary hover:underline flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-lg">add</span>
                      Add Line
                    </button>
                  </div>

                  <div className="text-right pt-2 border-t border-border-default">
                    <span className="text-sm text-primary-500">Total: </span>
                    <span className="text-lg font-bold text-primary-900">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

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
              {submitting ? 'Processing...' : 'Process Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
