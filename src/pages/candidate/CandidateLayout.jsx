import React from 'react';
import { LogOut, User, Briefcase, FileText, UserCircle } from 'lucide-react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Footer from '../../components/layout/Footer';

const CandidateLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-yellow-500' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/candidate/dashboard" className="text-xl font-bold text-yellow-500">
                KAUSHAL
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/candidate/dashboard"
                  className={`flex items-center px-3 py-2 text-sm font-medium ${isActive('/candidate/dashboard')}`}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link
                  to="/candidate/jobs"
                  className={`flex items-center px-3 py-2 text-sm font-medium ${isActive('/candidate/jobs')}`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Jobs
                </Link>
                <Link
                  to="/candidate/applications"
                  className={`flex items-center px-3 py-2 text-sm font-medium ${isActive('/candidate/applications')}`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Applications
                </Link>
                <Link
                  to="/candidate/profile"
                  className={`flex items-center px-3 py-2 text-sm font-medium ${isActive('/candidate/profile')}`}
                >
                  <UserCircle className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {profile && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {profile.full_name}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default CandidateLayout; 