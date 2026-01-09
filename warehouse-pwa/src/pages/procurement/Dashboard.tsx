import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { procurementApi, quoteRequestsApi } from '../../services/api';
import { ProcurementMetrics, QuoteRequest } from '../../types';

interface TimelineItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  relatedId?: string;
  relatedType?: string;
}

export default function ProcurementDashboard() {
  const [metrics, setMetrics] = useState<ProcurementMetrics | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [metricsData, timelineData, quotesData] = await Promise.all([
        procurementApi.getDashboard(),
        procurementApi.getTimeline(10),
        quoteRequestsApi.getAll(),
      ]);
      setMetrics(metricsData);
      setTimeline(timelineData);
      setQuoteRequests(quotesData);
    } catch (error) {
      console.error('Failed to load procurement data:', error);
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

  function getTimelineIcon(type: string): string {
    switch (type) {
      case 'quote_request': return 'request_quote';
      case 'purchase_order': return 'shopping_cart';
      case 'vendor_quote': return 'inventory';
      default: return 'info';
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

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-action-primary"></div>
      </div>
    );
  }

  const pipelineStages = [
    { key: 'pending', label: 'Quotes Pending', count: metrics?.quotesPending || 0, icon: 'hourglass_empty', color: 'text-blue-600' },
    { key: 'approval', label: 'Approval Needed', count: metrics?.quotesAwaitingApproval || 0, icon: 'approval', color: 'text-purple-600' },
    { key: 'ordered', label: 'Ordered', count: metrics?.quotesReadyToOrder || 0, icon: 'local_shipping', color: 'text-green-600' },
    { key: 'receiving', label: 'Receiving', count: metrics?.ordersAwaitingReceiving || 0, icon: 'inventory_2', color: 'text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-primary-900">Procurement</h1>
          <p className="text-sm text-primary-500 mt-1">Manage quotes, orders, and budgets</p>
        </div>
        <Link
          to="/procurement/quotes/new"
          className="btn-primary flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          New Quote Request
        </Link>
      </div>

      {/* Budget Overview */}
      <div className="bg-white rounded-lg border border-border-default p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary-900">Budget Overview</h2>
          <span className="text-sm text-primary-500">FY 2025-2026</span>
        </div>
        <div className="space-y-4">
          {metrics?.budgetsByGrant.map((budget) => (
            <div key={budget.grantId} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getGrantColor(budget.grantCode)}`}>
                    {budget.grantCode}
                  </span>
                  <span className="text-sm text-primary-700">{budget.grantName}</span>
                </div>
                <span className="text-sm font-medium text-primary-900">
                  {formatCurrency(budget.usedBudget)} / {formatCurrency(budget.totalBudget)}
                </span>
              </div>
              <div className="budget-bar">
                <div
                  className={`budget-bar-fill ${
                    budget.percentUsed >= 90 ? 'bg-status-error' :
                    budget.percentUsed >= 75 ? 'bg-status-warning' :
                    'bg-status-success'
                  }`}
                  style={{ width: `${Math.min(budget.percentUsed, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-primary-500">
                <span>{budget.percentUsed}% used</span>
                <span>{formatCurrency(budget.remainingBudget)} remaining</span>
              </div>
            </div>
          ))}
          {(!metrics?.budgetsByGrant || metrics.budgetsByGrant.length === 0) && (
            <p className="text-sm text-primary-500 text-center py-4">
              No grant sources configured. <Link to="/admin/grants" className="text-action-primary hover:underline">Add grant sources</Link>
            </p>
          )}
        </div>
      </div>

      {/* Pipeline */}
      <div className="bg-white rounded-lg border border-border-default p-6">
        <h2 className="text-lg font-semibold text-primary-900 mb-4">Procurement Pipeline</h2>
        <div className="grid grid-cols-4 gap-4">
          {pipelineStages.map((stage) => (
            <div key={stage.key} className="pipeline-card">
              <div className={`text-3xl font-bold ${stage.color}`}>{stage.count}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`material-symbols-outlined text-xl ${stage.color}`}>{stage.icon}</span>
                <span className="text-sm font-medium text-primary-700">{stage.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Quote Requests & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quote Requests */}
        <div className="bg-white rounded-lg border border-border-default">
          <div className="p-4 border-b border-border-default flex items-center justify-between">
            <h2 className="font-semibold text-primary-900">Recent Quote Requests</h2>
            <Link to="/procurement/quotes" className="text-sm text-action-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border-default">
            {quoteRequests.slice(0, 5).map((qr) => (
              <Link
                key={qr.id}
                to={`/procurement/quotes/${qr.id}`}
                className="block p-4 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-primary-900">
                        {qr.requestNumber}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(qr.status)}`}>
                        {qr.status}
                      </span>
                    </div>
                    <p className="text-sm text-primary-500 mt-1">
                      {qr.lines?.length || 0} line items
                      {qr.grantSource && (
                        <>
                          {' · '}
                          <span className={`px-1.5 py-0.5 rounded text-xs ${getGrantColor(qr.grantSource.code)}`}>
                            {qr.grantSource.code}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-primary-500">{formatDate(qr.createdAt)}</span>
                    {qr.vendorQuotes && qr.vendorQuotes.length > 0 && (
                      <p className="text-xs text-primary-400 mt-1">
                        {qr.vendorQuotes.length} quote{qr.vendorQuotes.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
            {quoteRequests.length === 0 && (
              <div className="p-8 text-center text-primary-500">
                <span className="material-symbols-outlined text-4xl mb-2 block">request_quote</span>
                <p>No quote requests yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-lg border border-border-default">
          <div className="p-4 border-b border-border-default">
            <h2 className="font-semibold text-primary-900">Recent Activity</h2>
          </div>
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            {timeline.map((item) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-icon bg-primary-100">
                  <span className="material-symbols-outlined text-lg text-primary-600">
                    {getTimelineIcon(item.type)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary-900 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-primary-500 truncate">
                    {item.description}
                  </p>
                </div>
                <span className="text-xs text-primary-400 whitespace-nowrap">
                  {formatTime(item.timestamp)}
                </span>
              </div>
            ))}
            {timeline.length === 0 && (
              <div className="text-center text-primary-500 py-8">
                <span className="material-symbols-outlined text-4xl mb-2 block">history</span>
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/procurement/quotes" className="action-tile">
          <span className="material-symbols-outlined text-3xl text-action-primary">request_quote</span>
          <span className="text-sm font-medium text-primary-900 mt-2">Quote Requests</span>
        </Link>
        <Link to="/admin/purchase-orders" className="action-tile">
          <span className="material-symbols-outlined text-3xl text-action-primary">shopping_cart</span>
          <span className="text-sm font-medium text-primary-900 mt-2">Purchase Orders</span>
        </Link>
        <Link to="/admin/vendors" className="action-tile">
          <span className="material-symbols-outlined text-3xl text-action-primary">store</span>
          <span className="text-sm font-medium text-primary-900 mt-2">Vendors</span>
        </Link>
        <Link to="/admin/grants" className="action-tile">
          <span className="material-symbols-outlined text-3xl text-action-primary">account_balance</span>
          <span className="text-sm font-medium text-primary-900 mt-2">Grant Sources</span>
        </Link>
      </div>
    </div>
  );
}
