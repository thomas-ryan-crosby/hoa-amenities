import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingHeader: React.FC = () => {
  const { isAuthenticated } = useAuth();
  // const navigate = useNavigate(); // Removed unused variable
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header style={{ 
      backgroundColor: '#355B45', 
      color: 'white', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: isMobile ? '0.75rem 0' : '1rem 0'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0 0.75rem' : '0 1rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: isMobile ? 'wrap' : 'nowrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img 
                src="/images/Neighbri_Wordmark_Final.png" 
                alt="Neighbri"
                style={{ height: '32px', maxWidth: '180px' }}
              />
            </Link>
          </div>

          {isMobile ? (
            <>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  minHeight: '44px',
                  minWidth: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ☰
              </button>
              {isMobileMenuOpen && (
                <div style={{
                  position: 'fixed',
                  top: '60px',
                  left: 0,
                  right: 0,
                  backgroundColor: '#355B45',
                  padding: '1rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  zIndex: 1000
                }}>
                  <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <Link
                      to="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        color: 'white',
                        textDecoration: 'none',
                        padding: '0.75rem 1rem',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        minHeight: '44px',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      }}
                    >
                      Home
                    </Link>
                    <Link
                      to="/about"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        color: 'white',
                        textDecoration: 'none',
                        padding: '0.75rem 1rem',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        minHeight: '44px',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      }}
                    >
                      About
                    </Link>
                    {isAuthenticated ? (
                      <Link
                        to="/app"
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                          color: 'white',
                          textDecoration: 'none',
                          padding: '0.75rem 1rem',
                          borderRadius: '4px',
                          fontSize: '1rem',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 400,
                          minHeight: '44px',
                          alignItems: 'center',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        }}
                      >
                        Go to App
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                          color: 'white',
                          textDecoration: 'none',
                          padding: '0.75rem 1rem',
                          borderRadius: '4px',
                          fontSize: '1rem',
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: 400,
                          minHeight: '44px',
                          alignItems: 'center',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        }}
                      >
                        Login
                      </Link>
                    )}
                  </nav>
                </div>
              )}
            </>
          ) : (
            <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link 
                to="/" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.95rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                style={{ 
                  color: 'white', 
                  textDecoration: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.95rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                About
              </Link>
              {isAuthenticated ? (
                <Link 
                  to="/app" 
                  style={{ 
                    color: 'white', 
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.95rem',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Go to App
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  style={{ 
                    color: 'white', 
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.95rem',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Login
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;

