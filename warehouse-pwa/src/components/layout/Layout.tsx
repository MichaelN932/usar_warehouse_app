import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usersApi } from '../../services/api';
import { Icon } from '../ui';

// Helper to get initial collapsed sections from localStorage
const getInitialCollapsedSections = (): Record<string, boolean> => {
  try {
    const stored = localStorage.getItem('cachedex-collapsed-sections');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export function Layout() {
  const { user, logout, hasRole, switchUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<Awaited<ReturnType<typeof usersApi.getAll>>>([]);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(getInitialCollapsedSections);

  // Persist collapsed sections to localStorage
  useEffect(() => {
    localStorage.setItem('cachedex-collapsed-sections', JSON.stringify(collapsedSections));
  }, [collapsedSections]);

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  // Warehouse General Operations Links (Staff/Admin)
  const warehouseOpsLinks = [
    { to: '/', label: 'Dashboard', icon: 'dashboard', description: 'Command center' },
    { to: '/receive', label: 'Orders', icon: 'arrow_downward', description: 'Incoming shipments' },
  ];

  // Cache definitions with their sub-links (equipment caches - not PPE)
  const cacheTypes = [
    {
      key: 'fema',
      label: 'FEMA Cache',
      icon: 'local_fire_department',
      description: 'Federal equipment',
      links: [
        { to: '/inventory?cache=fema', label: 'Inventory', icon: 'inventory_2', description: 'Stock levels' },
        { to: '/inventory?cache=fema&view=equipment', label: 'Equipment List', icon: 'list', description: 'All items' },
        { to: '/inventory?cache=fema&view=low-stock', label: 'Low Stock', icon: 'warning', description: 'Needs reorder' },
        { to: '/inventory?cache=fema&view=maintenance', label: 'Maintenance', icon: 'build', description: 'Service due' },
      ]
    },
    {
      key: 'prm',
      label: 'PRM Cache',
      icon: 'local_hospital',
      description: 'Medical response',
      links: [
        { to: '/inventory?cache=prm', label: 'Inventory', icon: 'inventory_2', description: 'Stock levels' },
        { to: '/inventory?cache=prm&view=equipment', label: 'Equipment List', icon: 'list', description: 'All items' },
        { to: '/inventory?cache=prm&view=low-stock', label: 'Low Stock', icon: 'warning', description: 'Needs reorder' },
        { to: '/inventory?cache=prm&view=expiring', label: 'Expiring', icon: 'schedule', description: 'Expires soon' },
      ]
    },
    {
      key: 'local',
      label: 'Local Cache',
      icon: 'home_work',
      description: 'County equipment',
      links: [
        { to: '/inventory?cache=local', label: 'Inventory', icon: 'inventory_2', description: 'Stock levels' },
        { to: '/inventory?cache=local&view=equipment', label: 'Equipment List', icon: 'list', description: 'All items' },
        { to: '/inventory?cache=local&view=low-stock', label: 'Low Stock', icon: 'warning', description: 'Needs reorder' },
      ]
    },
    {
      key: 'caloes',
      label: 'CALOES Cache',
      icon: 'account_balance',
      description: 'State equipment',
      links: [
        { to: '/inventory?cache=caloes', label: 'Inventory', icon: 'inventory_2', description: 'Stock levels' },
        { to: '/inventory?cache=caloes&view=equipment', label: 'Equipment List', icon: 'list', description: 'All items' },
        { to: '/inventory?cache=caloes&view=low-stock', label: 'Low Stock', icon: 'warning', description: 'Needs reorder' },
      ]
    },
  ];

  // PPE/Gear - The employee store for personal protective equipment and gear
  const ppeLinks = [
    { to: '/ppe-inventory', label: 'Items', icon: 'inventory_2', description: 'Stock levels' },
    { to: '/warehouse/distribution', label: 'PPE/Gear Distribution', icon: 'local_shipping', description: 'Checkout, returns, requests' },
    { to: '/warehouse/issued-gear', label: 'Issued PPE/Gear', icon: 'assignment_ind', description: 'View all issued items' },
  ];

  // Personal/My Account Links (user-specific)
  const myAccountLinks = [
    { to: '/store/cart', label: 'My Cart', icon: 'shopping_cart', description: 'Request items' },
    { to: '/my-requests', label: 'My Requests', icon: 'receipt_long', description: 'Track status' },
    { to: '/my-inventory', label: 'My Equipment', icon: 'inventory_2', description: 'Issued gear' },
    { to: '/profile', label: 'My Profile', icon: 'person', description: 'Account settings' },
  ];

  // Procurement Links (Admin)
  const procurementLinks = [
    { to: '/procurement', label: 'Dashboard', icon: 'analytics', description: 'Pipeline overview' },
    { to: '/procurement/quotes', label: 'Quotes', icon: 'request_quote', description: 'Quote requests' },
    { to: '/purchase-orders', label: 'Orders', icon: 'receipt_long', description: 'Purchase orders' },
    { to: '/vendors', label: 'Vendors', icon: 'store', description: 'Suppliers' },
    { to: '/procurement/approvals', label: 'Approvals', icon: 'task_alt', description: 'Review queue' },
    { to: '/procurement/budgets', label: 'Budgets', icon: 'account_balance', description: 'Grant tracking' },
  ];

  // Admin Links
  const adminLinks = [
    { to: '/users', label: 'Team Directory', icon: 'group', description: 'Employees & PPE' },
    { to: '/reports', label: 'Reports', icon: 'bar_chart', description: 'Analytics' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    // Handle paths with query strings (e.g., /inventory?cache=fema)
    if (path.includes('?')) {
      const [basePath, queryString] = path.split('?');
      if (location.pathname !== basePath) return false;
      // Check if the query params match
      const params = new URLSearchParams(queryString);
      const currentParams = new URLSearchParams(location.search);
      for (const [key, value] of params.entries()) {
        if (currentParams.get(key) !== value) return false;
      }
      return true;
    }
    // For /inventory without query, only match if there's no cache param
    if (path === '/inventory') {
      const currentParams = new URLSearchParams(location.search);
      return location.pathname === '/inventory' && !currentParams.get('cache');
    }
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

  const getPermissionLabel = (role: string) => {
    switch (role) {
      case 'WarehouseAdmin': return 'Admin';
      case 'WarehouseStaff': return 'Staff';
      default: return 'Member';
    }
  };

  const NavLink = ({ to, label, icon, onClick }: { to: string; label: string; icon: string; description?: string; onClick?: () => void }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`nav-item ${isActive(to) ? 'nav-item-active' : ''} ${isCollapsed ? 'justify-center px-2' : ''}`}
      title={isCollapsed ? label : undefined}
    >
      <Icon name={icon} size="sm" className={isActive(to) ? 'text-action-primary' : 'text-primary-400'} />
      {!isCollapsed && (
        <span className="flex-1 text-left whitespace-nowrap">{label}</span>
      )}
    </Link>
  );

  // Type for nav links
  type NavLinkItem = { to: string; label: string; icon: string; description: string };

  const NavSection = ({
    title,
    icon,
    links,
    sectionKey,
    onLinkClick
  }: {
    title: string;
    icon: string;
    links: NavLinkItem[];
    sectionKey: string;
    onLinkClick?: () => void
  }) => {
    const isSectionCollapsed = collapsedSections[sectionKey] ?? false;

    return (
      <>
        <div className="my-3 border-t border-primary-200"></div>
        {!isCollapsed ? (
          <button
            onClick={() => toggleSection(sectionKey)}
            className="w-full px-3 py-2 text-xs text-primary-400 uppercase tracking-wider font-semibold flex items-center gap-2 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors group"
          >
            <Icon name={icon} size="sm" />
            <span className="flex-1 text-left">{title}</span>
            <Icon
              name={isSectionCollapsed ? 'expand_more' : 'expand_less'}
              size="sm"
              className="text-primary-300 group-hover:text-primary-500 transition-transform"
            />
          </button>
        ) : (
          <button
            onClick={() => toggleSection(sectionKey)}
            className="w-full flex justify-center py-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title={`${title} (${isSectionCollapsed ? 'expand' : 'collapse'})`}
          >
            <Icon name={icon} size="sm" />
          </button>
        )}
        <div
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            isSectionCollapsed ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'
          }`}
        >
          <div className="space-y-1">
            {links.map(link => (
              <NavLink key={link.to} {...link} onClick={onLinkClick} />
            ))}
          </div>
        </div>
      </>
    );
  };

  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Collapse Toggle - Desktop only */}
      <div className="hidden lg:block p-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-primary-500 hover:bg-primary-100 hover:text-primary-700 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <Icon name="menu_open" size="md" />
          ) : (
            <>
              <Icon name="menu" size="md" />
              <span className="text-xs font-medium flex-1 text-left">Collapse Menu</span>
            </>
          )}
        </button>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-primary-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-800 rounded-lg flex items-center justify-center shadow-sm">
            <Icon name="inventory_2" size="sm" className="text-white" />
          </div>
          <span className="font-bold text-primary-900">CacheDEX</span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="p-2 text-primary-500 hover:text-primary-700 hover:bg-primary-100 rounded-lg transition-colors"
        >
          <Icon name="close" size="md" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin">
        {/* Home Link */}
        <NavLink to="/" label="Home" icon="home" onClick={onLinkClick} />

        {/* Warehouse Section (Staff/Admin only) - First */}
        {hasRole(['WarehouseStaff', 'WarehouseAdmin']) && (
          <>
            {/* Warehouse Main Section Header */}
            {!isCollapsed ? (
              <button
                onClick={() => toggleSection('warehouse')}
                className="w-full px-3 py-2 text-xs text-primary-400 uppercase tracking-wider font-semibold flex items-center gap-2 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors group"
              >
                <Icon name="warehouse" size="sm" />
                <span className="flex-1 text-left">Warehouse</span>
                <Icon
                  name={collapsedSections['warehouse'] ? 'expand_more' : 'expand_less'}
                  size="sm"
                  className="text-primary-300 group-hover:text-primary-500 transition-transform"
                />
              </button>
            ) : (
              <button
                onClick={() => toggleSection('warehouse')}
                className="w-full flex justify-center py-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title={`Warehouse (${collapsedSections['warehouse'] ? 'expand' : 'collapse'})`}
              >
                <Icon name="warehouse" size="sm" />
              </button>
            )}
            <div
              className={`overflow-hidden transition-all duration-200 ease-in-out ${
                collapsedSections['warehouse'] ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'
              }`}
            >
              {/* Operations */}
              <div className="space-y-1">
                {warehouseOpsLinks.map(link => (
                  <NavLink key={link.to} {...link} onClick={onLinkClick} />
                ))}
              </div>

              {/* Caches Subsection */}
              <div className="mt-3 ml-2 pl-2 border-l-2 border-primary-200">
                {!isCollapsed ? (
                  <button
                    onClick={() => toggleSection('caches')}
                    className="w-full px-2 py-1.5 text-xs text-primary-400 uppercase tracking-wider font-medium flex items-center gap-2 hover:text-primary-600 rounded transition-colors group"
                  >
                    <Icon name="inventory_2" size="sm" />
                    <span className="flex-1 text-left">Equipment Caches</span>
                    <Icon
                      name={collapsedSections['caches'] ? 'expand_more' : 'expand_less'}
                      size="sm"
                      className="text-primary-300 group-hover:text-primary-500"
                    />
                  </button>
                ) : null}
                <div
                  className={`overflow-hidden transition-all duration-200 ease-in-out ${
                    collapsedSections['caches'] ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'
                  }`}
                >
                  {/* Individual Cache Types */}
                  <div className="space-y-2 mt-2">
                    {cacheTypes.map(cache => (
                      <div key={cache.key} className="ml-1 pl-2 border-l border-primary-100">
                        {!isCollapsed ? (
                          <button
                            onClick={() => toggleSection(`cache-${cache.key}`)}
                            className="w-full px-2 py-1.5 text-xs text-primary-500 font-medium flex items-center gap-2 hover:text-primary-700 hover:bg-primary-50 rounded transition-colors group"
                          >
                            <Icon name={cache.icon} size="sm" />
                            <span className="flex-1 text-left">{cache.label}</span>
                            <Icon
                              name={collapsedSections[`cache-${cache.key}`] ? 'expand_more' : 'expand_less'}
                              size="sm"
                              className="text-primary-300 group-hover:text-primary-500"
                            />
                          </button>
                        ) : null}
                        <div
                          className={`overflow-hidden transition-all duration-200 ease-in-out ${
                            collapsedSections[`cache-${cache.key}`] ? 'max-h-0 opacity-0' : 'max-h-[300px] opacity-100'
                          }`}
                        >
                          <div className="space-y-0.5 mt-1 ml-2">
                            {cache.links.map(link => (
                              <Link
                                key={link.to}
                                to={link.to}
                                onClick={onLinkClick}
                                className={`nav-item text-xs py-1.5 ${
                                  isActive(link.to) ? 'nav-item-active' : ''
                                }`}
                              >
                                <Icon name={link.icon} size="sm" className={isActive(link.to) ? 'text-action-primary' : 'text-primary-400'} />
                                <span>{link.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PPE/Gear Subsection */}
              <div className="mt-3 ml-2 pl-2 border-l-2 border-primary-200">
                {!isCollapsed ? (
                  <button
                    onClick={() => toggleSection('ppe')}
                    className="w-full px-2 py-1.5 text-xs text-primary-400 uppercase tracking-wider font-medium flex items-center gap-2 hover:text-primary-600 rounded transition-colors group"
                  >
                    <Icon name="masks" size="sm" />
                    <span className="flex-1 text-left">PPE/Gear</span>
                    <Icon
                      name={collapsedSections['ppe'] ? 'expand_more' : 'expand_less'}
                      size="sm"
                      className="text-primary-300 group-hover:text-primary-500"
                    />
                  </button>
                ) : null}
                <div
                  className={`overflow-hidden transition-all duration-200 ease-in-out ${
                    collapsedSections['ppe'] ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'
                  }`}
                >
                  <div className="space-y-1 mt-2">
                    {ppeLinks.map(link => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={onLinkClick}
                        className={`nav-item ${isActive(link.to) ? 'nav-item-active' : ''}`}
                      >
                        <Icon name={link.icon} size="sm" className={isActive(link.to) ? 'text-action-primary' : 'text-primary-400'} />
                        <span>{link.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </>
        )}

        {/* Procurement Links (Admin only) */}
        {hasRole('WarehouseAdmin') && (
          <>
            <div className="my-3 border-t border-primary-200"></div>
            {!isCollapsed ? (
              <button
                onClick={() => toggleSection('procurement')}
                className="w-full px-3 py-2 text-xs text-primary-400 uppercase tracking-wider font-semibold flex items-center gap-2 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors group"
              >
                <Icon name="request_quote" size="sm" />
                <span className="flex-1 text-left">Procurement</span>
                <Icon
                  name={collapsedSections['procurement'] ? 'expand_more' : 'expand_less'}
                  size="sm"
                  className="text-primary-300 group-hover:text-primary-500 transition-transform"
                />
              </button>
            ) : (
              <button
                onClick={() => toggleSection('procurement')}
                className="w-full flex justify-center py-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title={`Procurement (${collapsedSections['procurement'] ? 'expand' : 'collapse'})`}
              >
                <Icon name="request_quote" size="sm" />
              </button>
            )}
            <div
              className={`overflow-hidden transition-all duration-200 ease-in-out ${
                collapsedSections['procurement'] ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'
              }`}
            >
              <div className="space-y-1">
                {procurementLinks.map(link => (
                  <NavLink key={link.to} {...link} onClick={onLinkClick} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Admin Links */}
        {hasRole('WarehouseAdmin') && (
          <NavSection title="Admin" icon="admin_panel_settings" links={adminLinks} sectionKey="admin" onLinkClick={onLinkClick} />
        )}

        {/* My Account - Personal items for all users */}
        <NavSection title="My Account" icon="account_circle" links={myAccountLinks} sectionKey="myAccount" onLinkClick={onLinkClick} />
      </nav>

      {/* Bottom Section - User Info & Logout */}
      <div className="border-t border-primary-200 p-3">
        <div className={`flex items-center gap-3 p-2 rounded-lg bg-primary-50 border border-primary-200 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 bg-gradient-to-br from-action-primary to-action-pressed rounded-full flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate text-primary-900">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-primary-500 truncate">
                {getPermissionLabel(user?.role || '')}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-primary-400 hover:text-danger-500 hover:bg-danger-100 transition-colors shrink-0"
            title="Log Out"
          >
            <Icon name="logout" size="sm" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Header Bar */}
      <header className="shrink-0 bg-primary-900 text-white shadow-lg z-10">
        <div className="px-4 py-2 flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-primary-800 text-primary-400 hover:text-white transition-colors"
          >
            <Icon name="menu" size="md" />
          </button>

          {/* Logo / Brand */}
          <div className="flex items-center gap-2.5 pr-4 border-r border-primary-700">
            <div className="w-8 h-8 bg-action-primary rounded-lg flex items-center justify-center shadow-sm">
              <Icon name="inventory_2" size="sm" className="text-white" />
            </div>
            <div className="hidden sm:flex items-baseline gap-1.5">
              <span className="font-bold text-white">CacheDEX</span>
              <span className="text-xs text-primary-400 font-medium">v2.0</span>
            </div>
          </div>

          {/* Tagline */}
          <div className="hidden md:block text-xs text-primary-400 font-medium">
            Mission-Ready Logistics
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Demo User Switcher */}
            <div className="relative">
              <button
                onClick={loadUsers}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-primary-800 hover:bg-primary-700 rounded-full border border-primary-700 transition-all group"
              >
                <div className="w-6 h-6 rounded-full bg-action-primary border border-action-hover flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none">
                  <span className="text-[10px] text-primary-400 font-bold uppercase tracking-wider">Viewing as</span>
                  <span className="text-xs font-bold text-white group-hover:text-action-primary transition-colors">
                    {user?.firstName}
                  </span>
                </div>
                <Icon name={isDemoMenuOpen ? 'expand_less' : 'expand_more'} size="sm" className="text-primary-400" />
              </button>
              {isDemoMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-surface rounded-xl shadow-xl border border-border z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-primary-50 border-b border-border">
                    <h3 className="text-xs font-bold text-primary-500 uppercase tracking-wider">Switch Demo Profile</h3>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {allUsers.map(u => {
                      const isActiveUser = u.id === user?.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => handleSwitchUser(u.id)}
                          className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors border-b border-primary-50 last:border-0 ${
                            isActiveUser ? 'bg-action-primary/10' : 'hover:bg-primary-50'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border ${
                            isActiveUser ? 'bg-action-primary text-white border-action-primary' : 'bg-white text-primary-600 border-primary-200'
                          }`}>
                            {u.firstName[0]}{u.lastName[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className={`text-sm font-bold ${isActiveUser ? 'text-action-primary' : 'text-primary-900'}`}>
                                {u.firstName} {u.lastName}
                              </span>
                              {isActiveUser && <Icon name="check" size="sm" className="text-action-primary" />}
                            </div>
                            <div className="text-xs text-primary-500 truncate mb-1">
                              {u.role}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-primary-400 hover:text-white hover:bg-primary-800 rounded-lg transition-all">
              <Icon name="notifications" size="md" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
            </button>

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary-800 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-action-primary to-action-pressed rounded-full flex items-center justify-center">
                  <Icon name="person" size="sm" className="text-white" />
                </div>
                <Icon name="expand_more" size="sm" className="hidden md:block text-primary-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface rounded-xl shadow-xl py-1 z-50 border border-border">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-bold text-primary-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-primary-500">{user?.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-action-primary/10 text-action-primary text-xs rounded-full font-medium border border-action-primary/20">
                      {user?.role}
                    </span>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Icon name="settings" size="sm" />
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger-500 hover:bg-danger-100 transition-colors"
                  >
                    <Icon name="logout" size="sm" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout - Sidebar + Content */}
      <div className="flex-1 flex min-h-0">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col bg-surface border-r border-border shrink-0 transition-all duration-300 ease-in-out ${
            isCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`lg:hidden fixed inset-y-0 left-0 w-72 bg-surface z-50 transform transition-transform duration-300 shadow-2xl ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <SidebarContent onLinkClick={() => setIsMobileSidebarOpen(false)} />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-6">
            <div className="max-w-full">
              <Outlet />
            </div>
          </main>

          {/* Footer */}
          <footer className="shrink-0 bg-surface border-t border-border">
            <div className="px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-500">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-primary-600">CacheDEX</span>
                <span>v2.0</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="local_fire_department" size="sm" className="text-warning-500" />
                <span>LA County Fire Department - USAR Task Force</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
