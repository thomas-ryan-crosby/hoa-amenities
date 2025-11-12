import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Calendar from './components/Calendar';
import ReservationModal from './components/ReservationModal';
import ReservationsPage from './components/ReservationsPage';
import JanitorialPage from './components/JanitorialPage';
import AdminPage from './components/AdminPage';
import ProfilePage from './components/ProfilePage';
import AuthPage from './components/AuthPage';
import Register from './components/Register';
import EmailVerificationPage from './components/EmailVerificationPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import LandingPage from './components/LandingPage';
import AboutPage from './components/AboutPage';
import OnboardingPage from './components/OnboardingPage';
import NoCommunityPage from './components/NoCommunityPage';
import TestPlanPage from './components/TestPlanPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const OnboardingRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, currentCommunity, communities } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If user has no communities, redirect to no-community page (except for profile and no-community page itself)
  if (communities.length === 0 && !currentCommunity) {
    const currentPath = window.location.pathname;
    if (currentPath !== '/no-community' && currentPath !== '/profile') {
      return <Navigate to="/no-community" />;
    }
  }
  
  // Onboarding is now auto-completed on community creation, so skip this check
  // if (isAdmin && currentCommunity && !currentCommunity.onboardingCompleted) {
  //   return <Navigate to="/onboarding" />;
  // }
  
  // If onboarding is completed, allow access
  return <>{children}</>;
};

const MobileNavLink: React.FC<{ to: string; onClick: () => void; children: React.ReactNode }> = ({ to, onClick, children }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
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
      {children}
    </Link>
  );
};

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin, isJanitorial } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
            <Link to="/app" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img 
                src="/images/Neighbri_Wordmark_Final.png" 
                alt="neighbri"
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
                    <MobileNavLink to="/app" onClick={() => setIsMobileMenuOpen(false)}>Calendar</MobileNavLink>
                    {isAuthenticated && (
                      <MobileNavLink to="/reservations" onClick={() => setIsMobileMenuOpen(false)}>My Reservations</MobileNavLink>
                    )}
                    {isJanitorial && (
                      <MobileNavLink to="/janitorial" onClick={() => setIsMobileMenuOpen(false)}>Janitorial</MobileNavLink>
                    )}
                    {isAdmin && (
                      <MobileNavLink to="/admin" onClick={() => setIsMobileMenuOpen(false)}>Admin</MobileNavLink>
                    )}
                    {isAuthenticated && (
                      <>
                        <MobileNavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profile</MobileNavLink>
                        <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                          <button
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              logout();
                            }}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              backgroundColor: '#244032',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '1rem',
                              minHeight: '44px'
                            }}
                          >
                            Logout
                          </button>
                        </div>
                      </>
                    )}
                  </nav>
                </div>
              )}
            </>
          ) : (
          <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
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
              Calendar
            </Link>
            {isAuthenticated && (
              <Link 
                to="/reservations" 
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
                My Reservations
              </Link>
            )}
            {isJanitorial && (
              <Link 
                to="/janitorial" 
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
                Janitorial
              </Link>
            )}
            {isAdmin && (
              <Link 
                to="/admin" 
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
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                <Link 
                  to="/profile" 
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
                  Profile
                </Link>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)', padding: '0 0.5rem' }}>                          
                  {user?.firstName}
                </span>
                <button
                  onClick={logout}
                  style={{
                    backgroundColor: '#244032',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.25rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1a3025';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#244032';
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: '0.5rem' }}>
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
                <Link 
                  to="/register" 
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
                  Register
                </Link>
              </div>
            )}
          </nav>
          )}
        </div>
      </div>
    </header>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, login } = useAuth();
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [refreshCalendar, setRefreshCalendar] = useState(0);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setShowReservationModal(true);
  };

  const handleReservationCreated = () => {
    setRefreshCalendar(prev => prev + 1);
  };

  return (
    <>
      <Routes>
        {/* Public routes without app header */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/testplan" element={<TestPlanPage />} />
        <Route path="/login" element={
          isAuthenticated ? 
            <Navigate to="/app" /> : 
            <AuthPage onLogin={login} />
        } />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
              <Navigate to="/app" /> : 
              <Register />
          } 
        />
        <Route 
          path="/verify-email/:token" 
          element={<EmailVerificationPage />} 
        />
        <Route 
          path="/forgot-password" 
          element={
            isAuthenticated ? 
              <Navigate to="/app" /> : 
              <ForgotPasswordPage />
          } 
        />
        <Route 
          path="/reset-password/:token" 
          element={
            isAuthenticated ? 
              <Navigate to="/app" /> : 
              <ResetPasswordPage />
          } 
        />
        
        {/* App routes with header */}
        <Route path="*" element={
          <>
            <Header />
            <main>
              <Routes>
                <Route path="/app" element={
                  <OnboardingRoute>
                    <ProtectedRoute>
                      <Calendar 
                        onDateClick={handleDateClick}
                        refreshTrigger={refreshCalendar}
                      />
                    </ProtectedRoute>
                  </OnboardingRoute>
                } />
                <Route 
                  path="/reservations" 
                  element={
                    <OnboardingRoute>
                      <ProtectedRoute>
                        <ReservationsPage />
                      </ProtectedRoute>
                    </OnboardingRoute>
                  } 
                />
                <Route 
                  path="/janitorial" 
                  element={
                    <OnboardingRoute>
                      <ProtectedRoute>
                        <JanitorialPage />
                      </ProtectedRoute>
                    </OnboardingRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <OnboardingRoute>
                      <ProtectedRoute>
                        <AdminPage />
                      </ProtectedRoute>
                    </OnboardingRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <OnboardingRoute>
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    </OnboardingRoute>
                  } 
                />
                <Route 
                  path="/no-community" 
                  element={
                    <ProtectedRoute>
                      <NoCommunityPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/onboarding" 
                  element={
                    <ProtectedRoute>
                      <OnboardingPage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            
            {/* Reservation Modal */}
            <ReservationModal
              isOpen={showReservationModal}
              onClose={() => setShowReservationModal(false)}
              selectedDate={selectedDate}
              onReservationCreated={handleReservationCreated}
            />
          </>
        } />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;