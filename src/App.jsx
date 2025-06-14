import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Landing Page
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';

// Auth Components
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AdminLogin from './pages/auth/AdminLogin';

// Protected Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import JobsManagement from './components/admin/JobsManagement';
import ApplicationsManagement from './components/admin/ApplicationsManagement';
import UsersManagement from './components/admin/UsersManagement';
import Settings from './components/admin/Settings';
import JobEditor from './pages/admin/JobEditor';
import Analytics from './pages/admin/Analytics';

// Candidate Components
import CandidateLayout from './pages/candidate/CandidateLayout';
import CandidateDashboard from './pages/candidate/Dashboard';
import JobBrowse from './pages/candidate/JobBrowse';
import Applications from './pages/candidate/Applications';
import Profile from './pages/candidate/Profile';
import JobDetails from './pages/candidate/JobDetails';
import Assessment from './pages/candidate/Assessment';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';

console.log('App.jsx: Starting to render');

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error('App Error:', error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Please try refreshing the page or contact support if the problem persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  console.log('App.jsx: Inside App component');
  
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Routes>
              {/* Landing Page without Header */}
              <Route path="/" element={<LandingPage />} />
              
              {/* All other routes with Header */}
              <Route element={
                <>
                  <Header />
                  <main className="flex-grow mt-20">
                    <Routes>
                      <Route path="/about" element={<About />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/admin-login" element={<AdminLogin />} />

                      {/* Admin Routes */}
                      <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="jobs" element={<JobsManagement />} />
                        <Route path="jobs/new" element={<JobEditor />} />
                        <Route path="jobs/edit/:id" element={<JobEditor />} />
                        <Route path="applications" element={<ApplicationsManagement />} />
                        <Route path="users" element={<UsersManagement />} />
                        <Route path="analytics" element={<Analytics />} />
                        <Route path="settings" element={<Settings />} />
                      </Route>

                      {/* Candidate Routes */}
                      <Route path="/candidate" element={<CandidateLayout />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<CandidateDashboard />} />
                        <Route path="jobs" element={<JobBrowse />} />
                        <Route path="jobs/:id" element={<JobDetails />} />
                        <Route path="applications" element={<Applications />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="assessment/:jobId" element={<Assessment />} />
                      </Route>

                      {/* Catch-all route */}
                      <Route path="*" element={
                        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                          <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                              404 - Page Not Found
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mb-8">
                              The page you're looking for doesn't exist.
                            </p>
                            <Link
                              to="/"
                              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                            >
                              Go Home
                            </Link>
                          </div>
                        </div>
                      } />
                    </Routes>
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
          </div>

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;