import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CommunitySelector from './CommunitySelector';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin, isJanitorial, currentCommunity } = useAuth();

  return (
    <header style={{
      backgroundColor: '#355B45',
      color: 'white',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>
              Neighbri
            </Link>
          </div>
          <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              Calendar
            </Link>
            {isAuthenticated && (
              <Link to="/reservations" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                My Reservations
              </Link>
            )}
            {isJanitorial && (
              <Link to="/janitorial" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                Approval Center
              </Link>
            )}
            {isAdmin && (
              <Link to="/admin" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                Admin
              </Link>
            )}
            {isAuthenticated && (
              <Link to="/profile" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                Profile
              </Link>
            )}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <CommunitySelector />
                <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  {user?.firstName}
                </span>
                <button
                  onClick={logout}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '0.875rem', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
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
