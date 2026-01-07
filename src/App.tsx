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
import { ReceiveOrders } from './pages/warehouse/ReceiveOrders';
import { UserManagement } from './pages/admin/UserManagement';
import { Catalog } from './pages/admin/Catalog';
import { Vendors } from './pages/admin/Vendors';
import { PurchaseOrders } from './pages/admin/PurchaseOrders';
import { Reports } from './pages/admin/Reports';
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
              path="/catalog"
              element={
                <ProtectedRoute requiredRoles={['WarehouseAdmin']}>
                  <Catalog />
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
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
