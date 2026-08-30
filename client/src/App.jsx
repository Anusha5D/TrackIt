import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';

const AuthenticatedLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            className: 'dark:!bg-gray-800 dark:!text-gray-100',
            style: {
              fontSize: '14px',
              padding: '10px 14px',
              borderRadius: '8px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: 'white' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: 'white' },
              duration: 4000,
            },
          }}
        />
        <Routes>
          <Route
            path="/login"
            element={<PublicRoute><Login /></PublicRoute>}
          />
          <Route
            path="/signup"
            element={<PublicRoute><Signup /></PublicRoute>}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout><Dashboard /></AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout><Applications /></AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;