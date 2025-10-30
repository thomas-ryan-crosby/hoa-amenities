import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Calendar from './components/Calendar';
import ReservationModal from './components/ReservationModal';
import ReservationsPage from './components/ReservationsPage';
import JanitorialPage from './components/JanitorialPage';
import AdminPage from './components/AdminPage';
import ProfilePage from './components/ProfilePage';
import Login from './components/Login';
import Register from './components/Register';
import EmailVerificationPage from './components/EmailVerificationPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const Header: React.FC = () => {
  const { user, logout, isAuthenticated, isAdmin, isJanitorial } = useAuth();

  return (
    <header style={{ 
      backgroundColor: '#355B45', 
      color: 'white', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '1rem 0'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img 
                src="/Neighbri Logos & Images/Neighbri_Wordmark_Final.png" 
                alt="neighbri"
                style={{ height: '32px', maxWidth: '180px' }}
              />
            </Link>
          </div>
          <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
                  {user?.firstName} ({user?.role})
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={
            <Calendar 
              onDateClick={handleDateClick}
              refreshTrigger={refreshCalendar}
            />
          } />
          <Route 
            path="/reservations" 
            element={
              <ProtectedRoute>
                <ReservationsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/janitorial" 
            element={
              <ProtectedRoute>
                <JanitorialPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/" /> : 
                <Login onLogin={login} />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? 
                <Navigate to="/" /> : 
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
                <Navigate to="/" /> : 
                <ForgotPasswordPage />
            } 
          />
          <Route 
            path="/reset-password/:token" 
            element={
              isAuthenticated ? 
                <Navigate to="/" /> : 
                <ResetPasswordPage />
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
    </div>
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