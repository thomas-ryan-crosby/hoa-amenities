import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin, isJanitorial } = useAuth();

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold">
              HOA Amenities Manager
            </Link>
          </div>
          <nav className="flex space-x-4 items-center">
            <Link to="/" className="hover:text-blue-200 transition-colors">
              Calendar
            </Link>
            {isAuthenticated && (
              <Link to="/reservations" className="hover:text-blue-200 transition-colors">
                My Reservations
              </Link>
            )}
            {isJanitorial && (
              <Link to="/janitorial" className="hover:text-blue-200 transition-colors">
                Janitorial
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="hover:text-blue-200 transition-colors">
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">
                  Welcome, {user?.firstName} ({user?.role})
                </span>
                <button
                  onClick={logout}
                  className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="hover:text-blue-200 transition-colors">
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
