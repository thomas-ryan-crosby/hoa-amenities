import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import LandingHeader from './LandingHeader';
import Register from './Register';

interface AuthPageProps {
  onLogin: (user: any, token: string, communities: any[], currentCommunity: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<'choice' | 'signin' | 'signup'>('choice');

  // Check location state for forceSignin flag (when clicking "Go To App" while already on /login)
  useEffect(() => {
    const state = location.state as { forceSignin?: boolean } | null;
    if (state?.forceSignin) {
      setMode('signin');
      // Clear the state to prevent it from persisting
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/auth/login`, formData);
      
      console.log('🔐 Login response:', {
        hasToken: !!response.data.token,
        hasUser: !!response.data.user,
        hasCommunities: !!response.data.communities,
        communitiesCount: response.data.communities?.length || 0,
        hasCurrentCommunity: !!response.data.currentCommunity
      });
      
      if (!response.data.token) {
        console.error('❌ Login failed: No token in response');
        setError('Login failed: Invalid response from server');
        return;
      }
      
      const { user, token, communities, currentCommunity } = response.data;
      
      if (!user) {
        console.error('❌ Login failed: No user data in response');
        setError('Login failed: Invalid response from server');
        return;
      }
      
      // Transform communities data
      const communitiesList = (communities || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description,
        role: c.role,
        joinedAt: c.joinedAt
      }));
      
      // Handle case where user has no communities
      const currentCommunityData = currentCommunity ? {
        id: currentCommunity.id,
        name: currentCommunity.name,
        role: currentCommunity.role
      } : null;
      
      console.log('✅ Login successful, calling onLogin');
      onLogin(user, token, communitiesList, currentCommunityData);
      navigate('/app');
    } catch (err: any) {
      console.error('❌ Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'signup') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <LandingHeader />
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'center', 
          minHeight: 'calc(100vh - 200px)', 
          padding: '2rem 1rem' 
        }}>
          <div style={{ 
            width: '100%', 
            maxWidth: '520px',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            padding: '2.5rem',
            border: '1px solid #e5e7eb',
            position: 'relative'
          }}>
            <button
              onClick={() => setMode('choice')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: '0.875rem',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                fontFamily: 'Inter, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#355B45';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              ← Back
            </button>
            <Register />
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'signin') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <LandingHeader />
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: 'calc(100vh - 200px)', 
          padding: '2rem 1rem' 
        }}>
          <div style={{ 
            width: '100%', 
            maxWidth: '420px',
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            padding: '2.5rem',
            border: '1px solid #e5e7eb',
            position: 'relative'
          }}>
            <button
              onClick={() => setMode('choice')}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#6b7280',
                cursor: 'pointer',
                fontSize: '0.875rem',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                fontFamily: 'Inter, sans-serif'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#355B45';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6b7280';
              }}
            >
              ← Back
            </button>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ 
                fontSize: '1.875rem', 
                fontWeight: 700, 
                color: '#1f2937', 
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif' 
              }}>
                Welcome back
              </h1>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.9375rem',
                fontFamily: 'Inter, sans-serif' 
              }}>
                Sign in to your Neighbri account
              </p>
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} style={{ marginBottom: '1.5rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: 500, 
                  color: '#374151',
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontFamily: 'Inter, sans-serif',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#355B45';
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(53, 91, 69, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.875rem', 
                    fontWeight: 500, 
                    color: '#374151',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    style={{ 
                      fontSize: '0.875rem',
                      color: '#355B45',
                      textDecoration: 'none',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontFamily: 'Inter, sans-serif',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s, box-shadow 0.2s'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#355B45';
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(53, 91, 69, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: loading ? '#9ca3af' : '#355B45',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  border: 'none',
                  transition: 'background-color 0.2s, transform 0.1s',
                  marginBottom: '1.5rem'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#244032';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#355B45';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div style={{ 
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#6b7280',
                fontWeight: 500,
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Demo credentials:
              </p>
              <div style={{ 
                fontSize: '0.6875rem', 
                color: '#9ca3af',
                lineHeight: '1.5',
                fontFamily: 'Inter, sans-serif'
              }}>
                Admin: admin@hoa.com / admin123<br />
                Resident: resident@hoa.com / admin123<br />
                Janitorial: janitorial@hoa.com / admin123
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Choice mode
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <LandingHeader />
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 'calc(100vh - 200px)', 
        padding: '2rem 1rem' 
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '440px',
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          padding: '3rem 2.5rem',
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <img 
              src="/images/Neighbri_Wordmark_Final.png" 
              alt="Neighbri"
              style={{ 
                height: '40px', 
                maxWidth: '200px',
                margin: '0 auto 1.5rem'
              }}
            />
            <h1 style={{ 
              fontSize: '1.875rem', 
              fontWeight: 700, 
              color: '#1f2937', 
              marginBottom: '0.5rem',
              fontFamily: 'Inter, sans-serif' 
            }}>
              Get started
            </h1>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '0.9375rem',
              fontFamily: 'Inter, sans-serif' 
            }}>
              Choose an option to continue
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={() => setMode('signin')}
              style={{
                width: '100%',
                backgroundColor: '#355B45',
                color: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                border: 'none',
                transition: 'background-color 0.2s, transform 0.1s',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#244032';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#355B45';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            >
              I already have an account
            </button>

            <button
              onClick={() => setMode('signup')}
              style={{
                width: '100%',
                backgroundColor: 'white',
                color: '#355B45',
                padding: '1rem 1.5rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                border: '2px solid #355B45',
                transition: 'background-color 0.2s, transform 0.1s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f4f1';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              I am new to Neighbri
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

