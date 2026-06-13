import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminProvider, useAdmin } from './context/AdminContext';

// Public pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import RegisterProvider from './pages/public/RegisterProvider';
import ProvidersPage from './pages/public/Providers';
import ProviderDetail from './pages/public/ProviderDetail';
import { ServicesPage, AboutPage, ContactPage } from './pages/public/StaticPages';

// Customer pages
import CustomerDashboard from './pages/customer/Dashboard';

// Provider pages
import ProviderDashboard from './pages/provider/Dashboard';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

import { PageLoader } from './components/common/index.jsx';

// Protected route for customers/providers
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

// Protected route for admin
const AdminRoute = ({ children }) => {
  const { admin, loading } = useAdmin();
  if (loading) return <PageLoader />;
  if (!admin) return <Navigate to="/admin/login" replace />;
  return children;
};

// Redirect if already logged in
const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    if (user.role === 'customer') return <Navigate to="/customer/dashboard" replace />;
    if (user.role === 'provider') return <Navigate to="/provider/dashboard" replace />;
  }
  return children;
};

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<Landing />} />
    <Route path="/services" element={<ServicesPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/providers" element={<ProvidersPage />} />
    <Route path="/providers/:id" element={<ProviderDetail />} />

    {/* Auth (guest only) */}
    <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
    <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
    <Route path="/register-provider" element={<GuestRoute><RegisterProvider /></GuestRoute>} />

    {/* Customer */}
    <Route path="/customer/dashboard" element={
      <ProtectedRoute allowedRoles={['customer']}>
        <CustomerDashboard />
      </ProtectedRoute>
    } />

    {/* Provider */}
    <Route path="/provider/dashboard" element={
      <ProtectedRoute allowedRoles={['provider']}>
        <ProviderDashboard />
      </ProtectedRoute>
    } />

    {/* Admin */}
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route path="/admin/dashboard" element={
      <AdminRoute><AdminDashboard /></AdminRoute>
    } />

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                fontFamily: 'Poppins, sans-serif',
                borderRadius: '16px',
                boxShadow: '0 10px 40px rgba(14,165,233,0.15)',
                fontSize: '14px',
                fontWeight: '500'
              },
              success: {
                iconTheme: { primary: '#0ea5e9', secondary: '#fff' },
                style: { border: '1px solid #bae6fd', background: '#f0f9ff', color: '#0c4a6e' }
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#fff' },
                style: { border: '1px solid #fecaca', background: '#fff1f2', color: '#7f1d1d' }
              }
            }}
          />
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
