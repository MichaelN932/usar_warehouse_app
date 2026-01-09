import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/Login';
import { Dashboard } from './pages/team-member/Dashboard';
import { RequestItems } from './pages/team-member/RequestItems';
import { MyRequests } from './pages/team-member/MyRequests';
import { MyInventory } from './pages/team-member/MyInventory';
import { Profile } from './pages/team-member/Profile';
import { FulfillmentQueue } from './pages/warehouse/FulfillmentQueue';
import { Inventory } from './pages/warehouse/Inventory';
import { PPEInventory } from './pages/warehouse/PPEInventory';
import { GearDistribution } from './pages/warehouse/GearDistribution';
import { IssuedGear } from './pages/warehouse/IssuedGear';
import { ReceiveOrders } from './pages/warehouse/ReceiveOrders';
import { UserManagement } from './pages/admin/UserManagement';
import { EmployeeDetail } from './pages/admin/EmployeeDetail';
import { Vendors } from './pages/admin/Vendors';
import { PurchaseOrders } from './pages/admin/PurchaseOrders';
import { Reports } from './pages/admin/Reports';
import ProcurementDashboard from './pages/procurement/Dashboard';
import QuoteManagement from './pages/procurement/QuoteManagement';
import EmailInbox from './pages/procurement/EmailInbox';
import GrantSourcesPage from './pages/admin/GrantSources';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Team Member Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/request" element={<RequestItems />} />
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/my-inventory" element={<MyInventory />} />
            <Route path="/profile" element={<Profile />} />

            {/* Warehouse Staff Routes */}
            <Route
              path="/fulfillment"
              element={
                <ProtectedRoute requiredRoles={['WarehouseStaff', 'WarehouseAdmin']}>
                  <FulfillmentQueue />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute requiredRoles={['WarehouseStaff', 'WarehouseAdmin']}>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ppe-inventory"
              element={
                <ProtectedRoute requiredRoles={['WarehouseStaff', 'WarehouseAdmin']}>
                  <PPEInventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/warehouse/distribution"
              element={
                <ProtectedRoute requiredRoles={['WarehouseStaff', 'WarehouseAdmin']}>
                  <GearDistribution />
                </ProtectedRoute>
              }
            />
            <Route
              path="/warehouse/issued-gear"
              element={
                <ProtectedRoute requiredRoles={['WarehouseStaff', 'WarehouseAdmin']}>
                  <IssuedGear />
                </ProtectedRoute>
              }
            />
            <Route
              path="/receive"
              element={
                <ProtectedRoute requiredRoles={['WarehouseStaff', 'WarehouseAdmin']}>
                  <ReceiveOrders />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/users"
              element={
                <ProtectedRoute requiredRoles={['WarehouseAdmin']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/:id"
              element={
                <ProtectedRoute requiredRoles={['WarehouseAdmin']}>
                  <EmployeeDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendors"
              element={
                <ProtectedRoute requiredRoles={['WarehouseAdmin']}>
                  <Vendors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchase-orders"
              element={
                <ProtectedRoute requiredRoles={['WarehouseAdmin']}>
                  <PurchaseOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute requiredRoles={['WarehouseAdmin']}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/grants"
              element={
                <ProtectedRoute requiredRoles={['WarehouseAdmin']}>
                  <GrantSourcesPage />
                </ProtectedRoute>
              }
            />

            {/* Procurement Routes */}
            <Route
              path="/procurement"
              element={
                <ProtectedRoute requiredRoles={['WarehouseAdmin']}>
                  <ProcurementDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/procurement/quotes"
              element={
                <ProtectedRoute requiredRoles={['WarehouseStaff', 'WarehouseAdmin']}>
                  <QuoteManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/procurement/quotes/:id"
              element={
                <ProtectedRoute requiredRoles={['WarehouseStaff', 'WarehouseAdmin']}>
                  <QuoteManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/procurement/emails"
              element={
                <ProtectedRoute requiredRoles={['WarehouseStaff', 'WarehouseAdmin']}>
                  <EmailInbox />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
