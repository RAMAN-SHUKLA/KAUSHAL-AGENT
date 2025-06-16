import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Layout from './components/shared/Layout';
import AdminLayout from './pages/admin/AdminLayout';
import CandidateLayout from './pages/candidate/CandidateLayout';

// Page Imports
import LandingPage from './pages/LandingPage';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';

// Admin Components
import AdminDashboard from './components/admin/Dashboard';
import JobsManagement from './components/admin/JobsManagement';
import ApplicationsManagement from './components/admin/ApplicationsManagement';
import UsersManagement from './components/admin/UsersManagement';
import Settings from './components/admin/Settings';
import Analytics from './components/admin/Analytics';
import JobEditor from './components/admin/JobPostForm';

// Candidate Components
import CandidateDashboard from './pages/candidate/Dashboard';
import JobBrowse from './pages/candidate/JobBrowse';
import Applications from './pages/candidate/Applications';
import Profile from './pages/candidate/Profile';
import JobDetails from './pages/candidate/JobDetails';
import Assessment from './pages/candidate/Assessment';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error) { console.error('App Error:', error); return { hasError: true }; }
  componentDidCatch(error, errorInfo) { console.error('App Error:', error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Something went wrong.</h1>
            <button onClick={() => window.location.reload()}>Refresh Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const NotFound = () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <Link to="/">Go Home</Link>
      </div>
    </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Landing Page does not use the main layout */}
            <Route path="/" element={<LandingPage />} />

            {/* Public-facing routes that use the main site layout */}
            <Route element={<Layout />}>
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Routes - Direct Access */}
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

            {/* Candidate Routes - Direct Access */}
            <Route path="/candidate" element={<CandidateLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<CandidateDashboard />} />
              <Route path="jobs" element={<JobBrowse />} />
              <Route path="jobs/:id" element={<JobDetails />} />
              <Route path="applications" element={<Applications />} />
              <Route path="profile" element={<Profile />} />
              <Route path="assessment/:jobId" element={<Assessment />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={5000} newestOnTop />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;