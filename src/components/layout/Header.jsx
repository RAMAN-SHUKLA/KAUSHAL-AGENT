import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  // Don't show header on landing page
  if (location.pathname === '/') {
    return null;
  }

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm fixed w-full top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-6 flex items-center justify-between border-b border-yellow-500 lg:border-none">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-800 dark:text-white">KAUSHAL</span>
            </Link>
            <div className="hidden ml-10 space-x-8 lg:block">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-base font-medium ${
                    isActive(link.href)
                      ? 'text-yellow-600'
                      : 'text-gray-700 dark:text-gray-200 hover:text-yellow-600 dark:hover:text-yellow-500'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="ml-10 space-x-4 hidden lg:flex items-center">
            {user ? (
              <>
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/candidate'}
                  className="inline-block bg-yellow-600 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-yellow-700"
                >
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="inline-block bg-white dark:bg-gray-700 py-2 px-4 border border-transparent rounded-md text-base font-medium text-yellow-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-block bg-white dark:bg-gray-700 py-2 px-4 border border-transparent rounded-md text-base font-medium text-yellow-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="inline-block bg-yellow-600 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-yellow-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
          <div className="lg:hidden">
            <button
              type="button"
              className="bg-white dark:bg-gray-700 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`block py-2 px-3 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? 'text-yellow-600 bg-yellow-50 dark:bg-gray-700'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-yellow-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/candidate'}
                  className="block w-full text-left py-2 px-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-yellow-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 px-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-yellow-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-center py-2 px-4 border border-transparent rounded-md text-base font-medium text-yellow-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="block text-center py-2 px-4 border border-transparent rounded-md text-base font-medium text-white bg-yellow-600 hover:bg-yellow-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header; 