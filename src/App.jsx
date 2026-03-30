import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GenerationProvider } from './context/GenerationContext';
import { Toaster } from 'react-hot-toast';
import FloatingGenerationIndicator from './components/FloatingGenerationIndicator';

// Layout
import Layout from './components/Layout';
import AuthLayout from './components/AuthLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumeEditor from './pages/ResumeEditor';
import Resumes from './pages/Resumes';
import JobDiscovery from './pages/JobDiscovery';
import JobAlerts from './pages/JobAlerts';
import AnalysisHistory from './pages/AnalysisHistory';
import AnalysisDetail from './pages/AnalysisDetail';
import Pricing from './pages/Pricing';
import Settings from './pages/Settings';
import ApplicationQueue from './pages/ApplicationQueue';
import Applications from './pages/Applications';

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Public route (redirect to dashboard if logged in)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GenerationProvider>
          <Toaster position="top-right" />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            
            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={
                <PublicRoute><Login /></PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute><Register /></PublicRoute>
              } />
            </Route>
            
            {/* Protected routes */}
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/resumes" element={<Resumes />} />
              <Route path="/resumes/:id" element={<ResumeEditor />} />
              <Route path="/jobs" element={<JobDiscovery />} />
              <Route path="/job-alerts" element={<JobAlerts />} />
              <Route path="/history" element={<AnalysisHistory />} />
              <Route path="/history/:id" element={<AnalysisDetail />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/queue" element={<ApplicationQueue />} />
              <Route path="/applications" element={<Applications />} />
            </Route>
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <FloatingGenerationIndicator />
        </GenerationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
