import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Card, StatCard, StatusBadge, Icon } from '../../components/ui';
import { requestsApi, notificationsApi, issuedItemsApi } from '../../services/api';
import { Request, Notification, IssuedItem } from '../../types';

export function Dashboard() {
  const { user, hasRole } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [issuedItems, setIssuedItems] = useState<IssuedItem[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
        hasRole(['WarehouseStaff', 'WarehouseAdmin']) ? requestsApi.getPending() : Promise.resolve([]),
      ]);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fire-600"></div>
      </div>
    );
  }

  const activeRequests = requests.filter(
    (r) => !['Fulfilled', 'Cancelled'].includes(r.status)
  ).length;

  const readyForPickup = requests.filter((r) => r.status === 'ReadyForPickup').length;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600">
          {user?.role === 'TeamMember'
            ? 'Manage your gear requests and inventory'
            : user?.role === 'WarehouseStaff'
            ? 'Process requests and manage inventory'
            : 'Administer the warehouse system'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Requests"
          value={activeRequests}
          subtitle="In progress"
          color="blue"
          icon={<Icon name="assignment" size="lg" />}
        />

        <StatCard
          title="Ready for Pickup"
          value={readyForPickup}
          subtitle={readyForPickup > 0 ? 'Visit Ripley Room' : 'None pending'}
          color={readyForPickup > 0 ? 'green' : 'default'}
          icon={<Icon name="inventory_2" size="lg" />}
        />

        <StatCard
          title="Items Issued"
          value={issuedItems.length}
          subtitle="In your possession"
          color="fire"
          icon={<Icon name="deployed_code" size="lg" />}
        />

        <StatCard
          title="Unread Notifications"
          value={notifications.length}
          subtitle={notifications.length > 0 ? 'New updates' : 'All caught up'}
          color={notifications.length > 0 ? 'yellow' : 'default'}
          icon={<Icon name="notifications" size="lg" />}
        />
      </div>

      {/* Warehouse Staff Stats */}
      {hasRole(['WarehouseStaff', 'WarehouseAdmin']) && (
        <Card title="Warehouse Overview" className="bg-fire-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/fulfillment" className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-fire-600">{pendingCount}</div>
              <div className="text-gray-600">Pending Requests</div>
            </Link>
            <Link to="/receive" className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-blue-600">2</div>
              <div className="text-gray-600">Open POs</div>
            </Link>
            <Link to="/inventory" className="block p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-yellow-600">3</div>
              <div className="text-gray-600">Low Stock Items</div>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <Card
          title="Recent Requests"
          actions={
            <Link to="/my-requests" className="text-fire-600 hover:text-fire-700 text-sm font-medium">
              View all
            </Link>
          }
        >
          {requests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No requests yet</p>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {request.lines[0]?.itemTypeName}
                      {request.lines.length > 1 && ` +${request.lines.length - 1} more`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
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
                className="text-fire-600 hover:text-fire-700 text-sm font-medium"
              >
                Mark all read
              </button>
            )
          }
        >
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No new notifications</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg"
                >
                  <p className="font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/request"
            className="flex flex-col items-center p-4 bg-fire-50 rounded-lg hover:bg-fire-100 transition-colors"
          >
            <Icon name="add_circle" size="xl" className="text-fire-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">New Request</span>
          </Link>

          <Link
            to="/my-inventory"
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Icon name="checklist" size="xl" className="text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">My Inventory</span>
          </Link>

          <Link
            to="/profile"
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Icon name="person" size="xl" className="text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Update Sizes</span>
          </Link>

          <Link
            to="/my-requests"
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Icon name="history" size="xl" className="text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Request History</span>
          </Link>
        </div>
      </Card>
    </div>
  );
}
