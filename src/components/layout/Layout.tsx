import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usersApi } from '../../services/api';
import { Icon } from '../ui';

export function Layout() {
  const { user, logout, hasRole, switchUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<Awaited<ReturnType<typeof usersApi.getAll>>>([]);

  const teamMemberLinks = [
    { to: '/', label: 'Dashboard', icon: 'dashboard' },
    { to: '/request', label: 'Request Items', icon: 'add_shopping_cart' },
    { to: '/my-requests', label: 'My Requests', icon: 'list_alt' },
    { to: '/my-inventory', label: 'My Inventory', icon: 'inventory_2' },
    { to: '/profile', label: 'Profile', icon: 'person' },
  ];

  const warehouseLinks = [
    { to: '/fulfillment', label: 'Fulfillment', icon: 'local_shipping' },
    { to: '/inventory', label: 'Inventory', icon: 'warehouse' },
    { to: '/receive', label: 'Receive', icon: 'package_2' },
  ];

  const adminLinks = [
    { to: '/users', label: 'Users', icon: 'group' },
    { to: '/catalog', label: 'Catalog', icon: 'category' },
    { to: '/vendors', label: 'Vendors', icon: 'store' },
    { to: '/purchase-orders', label: 'POs', icon: 'receipt_long' },
    { to: '/reports', label: 'Reports', icon: 'bar_chart' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const loadUsers = async () => {
    if (allUsers.length === 0) {
      const users = await usersApi.getAll();
      setAllUsers(users);
    }
    setIsDemoMenuOpen(!isDemoMenuOpen);
  };

  const handleSwitchUser = async (userId: string) => {
    await switchUser(userId);
    setIsDemoMenuOpen(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-fire-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <Icon name="local_fire_department" size="lg" />
                <span className="text-xl font-bold hidden sm:block">USAR Warehouse</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {teamMemberLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-fire-800 text-white'
                      : 'text-fire-100 hover:bg-fire-600'
                  }`}
                >
                  <Icon name={link.icon} size="sm" />
                  <span>{link.label}</span>
                </Link>
              ))}

              {hasRole(['WarehouseStaff', 'WarehouseAdmin']) && (
                <>
                  <span className="text-fire-400 px-1">|</span>
                  {warehouseLinks.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(link.to)
                          ? 'bg-fire-800 text-white'
                          : 'text-fire-100 hover:bg-fire-600'
                      }`}
                    >
                      <Icon name={link.icon} size="sm" />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </>
              )}

              {hasRole('WarehouseAdmin') && (
                <>
                  <span className="text-fire-400 px-1">|</span>
                  {adminLinks.slice(0, 3).map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(link.to)
                          ? 'bg-fire-800 text-white'
                          : 'text-fire-100 hover:bg-fire-600'
                      }`}
                    >
                      <Icon name={link.icon} size="sm" />
                      <span>{link.label}</span>
                    </Link>
                  ))}
                </>
              )}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              {/* Demo User Switcher */}
              <div className="relative hidden sm:block">
                <button
                  onClick={loadUsers}
                  className="flex items-center gap-1 px-3 py-1 text-xs bg-fire-800 rounded-md hover:bg-fire-900 transition-colors"
                >
                  <Icon name="swap_horiz" size="sm" />
                  <span>Switch User</span>
                </button>
                {isDemoMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
                    {allUsers.map(u => (
                      <button
                        key={u.id}
                        onClick={() => handleSwitchUser(u.id)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 ${
                          u.id === user?.id ? 'bg-fire-50 text-fire-700' : 'text-gray-700'
                        }`}
                      >
                        <Icon name="person" size="sm" />
                        <div>
                          <span className="font-medium">{u.firstName} {u.lastName}</span>
                          <span className="block text-xs text-gray-500">{u.role}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <button className="p-2 rounded-md hover:bg-fire-600 transition-colors">
                <Icon name="notifications" size="md" />
              </button>

              {/* User dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-sm focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-fire-800 flex items-center justify-center">
                    <Icon name="person" size="sm" />
                  </div>
                  <span className="hidden md:block">{user?.firstName}</span>
                  <Icon name="expand_more" size="sm" className="hidden md:block" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-fire-100 text-fire-700 text-xs rounded-full">
                        {user?.role}
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Icon name="settings" size="sm" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Icon name="logout" size="sm" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-fire-600"
              >
                <Icon name={isMobileMenuOpen ? 'close' : 'menu'} size="md" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-fire-600">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {teamMemberLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.to)
                      ? 'bg-fire-800 text-white'
                      : 'text-fire-100 hover:bg-fire-600'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon name={link.icon} size="md" />
                  {link.label}
                </Link>
              ))}

              {hasRole(['WarehouseStaff', 'WarehouseAdmin']) && (
                <>
                  <div className="border-t border-fire-600 my-2"></div>
                  <p className="px-3 py-1 text-xs text-fire-300 uppercase tracking-wider flex items-center gap-2">
                    <Icon name="warehouse" size="sm" />
                    Warehouse
                  </p>
                  {warehouseLinks.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium ${
                        isActive(link.to)
                          ? 'bg-fire-800 text-white'
                          : 'text-fire-100 hover:bg-fire-600'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon name={link.icon} size="md" />
                      {link.label}
                    </Link>
                  ))}
                </>
              )}

              {hasRole('WarehouseAdmin') && (
                <>
                  <div className="border-t border-fire-600 my-2"></div>
                  <p className="px-3 py-1 text-xs text-fire-300 uppercase tracking-wider flex items-center gap-2">
                    <Icon name="admin_panel_settings" size="sm" />
                    Admin
                  </p>
                  {adminLinks.map(link => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium ${
                        isActive(link.to)
                          ? 'bg-fire-800 text-white'
                          : 'text-fire-100 hover:bg-fire-600'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon name={link.icon} size="md" />
                      {link.label}
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Icon name="local_fire_department" size="sm" />
            <span>LA County Fire Department - USAR Task Force</span>
          </div>
          <p className="text-xs">Warehouse Inventory Management System</p>
        </div>
      </footer>
    </div>
  );
}
