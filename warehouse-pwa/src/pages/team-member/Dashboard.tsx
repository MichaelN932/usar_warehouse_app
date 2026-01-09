import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, StatusBadge, Icon } from '../../components/ui';
import { requestsApi, notificationsApi, issuedItemsApi, inventoryApi } from '../../services/api';
import { Request, Notification, IssuedItem, InventoryItem } from '../../types';

export function Dashboard() {
  const { user, hasRole } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [issuedItems, setIssuedItems] = useState<IssuedItem[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isWarehouseRole = hasRole(['WarehouseStaff', 'WarehouseAdmin']);

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    if (!user) return;
    setIsLoading(true);
    try {
      const [userRequests, userNotifications, userItems, allPending] = await Promise.all([
        requestsApi.getByUser(user.id),
        notificationsApi.getByUser(user.id),
        issuedItemsApi.getByUser(user.id),
        isWarehouseRole ? requestsApi.getPending() : Promise.resolve([]),
      ]);

      // Get low stock items for warehouse staff
      if (isWarehouseRole) {
        try {
          const inventory = await inventoryApi.getLowStockItems();
          setLowStockItems(inventory.slice(0, 5));
        } catch {
          setLowStockItems([]);
        }
      }

      setRequests(userRequests.slice(0, 5));
      setNotifications(userNotifications.filter(n => !n.isRead).slice(0, 5));
      setIssuedItems(userItems);
      setPendingCount(allPending.length);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-action-primary"></div>
      </div>
    );
  }

  const readyForPickup = requests.filter((r) => r.status === 'ReadyForPickup').length;
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Warehouse POS Dashboard for Staff/Admins
  if (isWarehouseRole) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-h1 text-primary-900">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.firstName}
            </h1>
            <p className="text-body text-primary-500">{currentDate}</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="stat-value text-action-primary">{pendingCount}</div>
            <div className="stat-label">Pending Requests</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-warning-500">{lowStockItems.length}</div>
            <div className="stat-label">Low Stock Items</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-info-500">2</div>
            <div className="stat-label">Receiving Today</div>
          </div>
          <div className="stat-card">
            <div className="stat-value text-success-500">{readyForPickup}</div>
            <div className="stat-label">Ready for Pickup</div>
          </div>
        </div>

        {/* Quick Action Tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/warehouse/issue" className="action-tile group">
            <div className="action-tile-icon bg-action-primary/10">
              <Icon name="arrow_upward" size="lg" className="text-action-primary" />
            </div>
            <span className="font-semibold text-primary-900 group-hover:text-action-primary transition-colors">Issue Equipment</span>
            <span className="text-caption text-primary-400">Check out gear</span>
          </Link>

          <Link to="/receive" className="action-tile group">
            <div className="action-tile-icon bg-success-100">
              <Icon name="arrow_downward" size="lg" className="text-success-500" />
            </div>
            <span className="font-semibold text-primary-900 group-hover:text-success-500 transition-colors">Receive Inventory</span>
            <span className="text-caption text-primary-400">Incoming shipments</span>
          </Link>

          <Link to="/warehouse/returns" className="action-tile group">
            <div className="action-tile-icon bg-warning-100">
              <Icon name="rotate_left" size="lg" className="text-warning-500" />
            </div>
            <span className="font-semibold text-primary-900 group-hover:text-warning-500 transition-colors">Returns</span>
            <span className="text-caption text-primary-400">Process check-ins</span>
          </Link>

          <Link to="/fulfillment" className="action-tile group relative">
            <div className="action-tile-icon bg-purple-100">
              <Icon name="list_alt" size="lg" className="text-purple-600" />
            </div>
            <span className="font-semibold text-primary-900 group-hover:text-purple-600 transition-colors">Request Queue</span>
            <span className="text-caption text-primary-400">Pending requests</span>
            {pendingCount > 0 && (
              <span className="absolute top-3 right-3 pipeline-count">{pendingCount}</span>
            )}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alerts */}
          <Card
            title="Low Stock Alerts"
            actions={
              <Link to="/inventory" className="text-action-primary hover:text-action-hover text-sm font-medium flex items-center gap-1">
                View all <Icon name="arrow_forward" size="sm" />
              </Link>
            }
          >
            {lowStockItems.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="check_circle" size="xl" className="text-success-500 mx-auto mb-2" />
                <p className="text-primary-500">All stock levels are good</p>
              </div>
            ) : (
              <div className="space-y-2">
                {lowStockItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-warning-100/50 border border-warning-500/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon name="warning" size="sm" className="text-warning-500" />
                      <span className="font-medium text-primary-900">Item {i + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-warning-500 font-bold">{item.quantityOnHand} left</span>
                      <Icon name="arrow_forward" size="sm" className="text-primary-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Recent Activity */}
          <Card
            title="Recent Activity"
            actions={
              <button className="text-action-primary hover:text-action-hover text-sm font-medium flex items-center gap-1">
                Filter <Icon name="filter_list" size="sm" />
              </button>
            }
          >
            <div className="space-y-1">
              {[
                { time: '10:42', action: 'Issued 2 items to M. Rodriguez', icon: 'arrow_upward', color: 'text-action-primary' },
                { time: '10:15', action: 'Received PO #2024-0847 (24 items)', icon: 'arrow_downward', color: 'text-success-500' },
                { time: '09:58', action: 'Return processed - T. Chen', icon: 'rotate_left', color: 'text-warning-500' },
                { time: '09:30', action: 'Request approved #REQ-2847', icon: 'check_circle', color: 'text-success-500' },
              ].map((activity, i) => (
                <div key={i} className="timeline-item">
                  <span className="timeline-time w-12">{activity.time}</span>
                  <Icon name={activity.icon} size="sm" className={activity.color} />
                  <span className="text-body-sm text-primary-700 flex-1">{activity.action}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Pending Requests Preview */}
        {pendingCount > 0 && (
          <Card
            title={`Pending Requests (${pendingCount})`}
            actions={
              <Link to="/fulfillment" className="text-action-primary hover:text-action-hover text-sm font-medium flex items-center gap-1">
                Process all <Icon name="arrow_forward" size="sm" />
              </Link>
            }
          >
            <div className="space-y-2">
              {requests
                .filter(r => r.status === 'Pending')
                .slice(0, 3)
                .map((request) => (
                  <Link
                    key={request.id}
                    to={`/fulfillment?id=${request.id}`}
                    className="flex items-center justify-between p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-action-primary/10 flex items-center justify-center">
                        <Icon name="person" size="sm" className="text-action-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-primary-900">{request.requestedByName}</p>
                        <p className="text-body-sm text-primary-500">
                          {request.lines.length} item{request.lines.length !== 1 ? 's' : ''} - {new Date(request.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={request.status} />
                      <Icon name="chevron_right" size="sm" className="text-primary-400" />
                    </div>
                  </Link>
                ))}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // Team Member Dashboard (Store View)
  const activeRequests = requests.filter(
    (r) => !['Fulfilled', 'Cancelled'].includes(r.status)
  ).length;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-action-primary to-action-pressed rounded-2xl p-6 text-white">
        <h1 className="text-h1">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-blue-100 mt-1">
          Browse the equipment catalog and manage your gear
        </p>
        <Link
          to="/store"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white text-action-primary font-semibold rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Icon name="storefront" size="sm" />
          Browse Catalog
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="stat-value text-action-primary">{activeRequests}</div>
          <div className="stat-label">Active Requests</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-success-500">{readyForPickup}</div>
          <div className="stat-label">Ready for Pickup</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-warning-500">{issuedItems.length}</div>
          <div className="stat-label">Items Issued</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-info-500">{notifications.length}</div>
          <div className="stat-label">Notifications</div>
        </div>
      </div>

      {/* Ready for Pickup Alert */}
      {readyForPickup > 0 && (
        <div className="bg-success-100 border border-success-500/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success-500 flex items-center justify-center">
              <Icon name="inventory_2" size="md" className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-success-500">{readyForPickup} item{readyForPickup !== 1 ? 's' : ''} ready for pickup!</p>
              <p className="text-body-sm text-primary-600">Visit the Ripley Room to collect your gear</p>
            </div>
          </div>
          <Link
            to="/my-requests"
            className="btn btn-success"
          >
            View Details
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/store" className="action-tile group">
          <div className="action-tile-icon bg-action-primary/10">
            <Icon name="storefront" size="lg" className="text-action-primary" />
          </div>
          <span className="font-semibold text-primary-900 group-hover:text-action-primary transition-colors">Browse Catalog</span>
        </Link>

        <Link to="/my-requests" className="action-tile group">
          <div className="action-tile-icon bg-purple-100">
            <Icon name="receipt_long" size="lg" className="text-purple-600" />
          </div>
          <span className="font-semibold text-primary-900 group-hover:text-purple-600 transition-colors">My Requests</span>
        </Link>

        <Link to="/my-inventory" className="action-tile group">
          <div className="action-tile-icon bg-warning-100">
            <Icon name="inventory_2" size="lg" className="text-warning-500" />
          </div>
          <span className="font-semibold text-primary-900 group-hover:text-warning-500 transition-colors">My Equipment</span>
        </Link>

        <Link to="/profile" className="action-tile group">
          <div className="action-tile-icon bg-success-100">
            <Icon name="person" size="lg" className="text-success-500" />
          </div>
          <span className="font-semibold text-primary-900 group-hover:text-success-500 transition-colors">Update Sizes</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <Card
          title="Recent Requests"
          actions={
            <Link to="/my-requests" className="text-action-primary hover:text-action-hover text-sm font-medium flex items-center gap-1">
              View all <Icon name="arrow_forward" size="sm" />
            </Link>
          }
        >
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="assignment" size="xl" className="text-primary-300 mx-auto mb-2" />
              <p className="text-primary-500">No requests yet</p>
              <Link to="/store" className="text-action-primary hover:text-action-hover text-sm font-medium mt-2 inline-block">
                Browse the catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {requests.map((request) => (
                <Link
                  key={request.id}
                  to={`/my-requests?id=${request.id}`}
                  className="flex items-center justify-between p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-primary-900">
                      {request.lines[0]?.itemTypeName}
                      {request.lines.length > 1 && ` +${request.lines.length - 1} more`}
                    </p>
                    <p className="text-body-sm text-primary-500">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={request.status} />
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Notifications */}
        <Card
          title="Notifications"
          actions={
            notifications.length > 0 && (
              <button
                onClick={async () => {
                  await notificationsApi.markAllAsRead(user!.id);
                  setNotifications([]);
                }}
                className="text-action-primary hover:text-action-hover text-sm font-medium"
              >
                Mark all read
              </button>
            )
          }
        >
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="notifications_off" size="xl" className="text-primary-300 mx-auto mb-2" />
              <p className="text-primary-500">No new notifications</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 bg-warning-100/50 border-l-4 border-warning-500 rounded-r-lg"
                >
                  <p className="font-medium text-primary-900">{notification.title}</p>
                  <p className="text-body-sm text-primary-600">{notification.message}</p>
                  <p className="text-caption text-primary-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
