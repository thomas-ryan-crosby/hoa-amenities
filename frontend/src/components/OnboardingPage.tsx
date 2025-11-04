import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const OnboardingPage: React.FC = () => {
  const { currentCommunity, token, refreshCommunities } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState<string>('');

  useEffect(() => {
    // Refresh communities to get latest data including access code
    if (token) {
      refreshCommunities();
    }
    
    // Check if community needs onboarding
    if (currentCommunity?.onboardingCompleted) {
      navigate('/app');
    }
    // Only allow admins to access onboarding
    if (currentCommunity && currentCommunity.role !== 'admin') {
      navigate('/app');
    }
    
    // Get access code from current community
    if (currentCommunity?.accessCode) {
      setAccessCode(currentCommunity.accessCode);
    } else if (currentCommunity?.id && token) {
      // Fetch access code if not in current community data
      fetchAccessCode();
    }
  }, [currentCommunity, token, navigate, refreshCommunities]);

  const fetchAccessCode = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/communities/${currentCommunity?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.community?.accessCode) {
        setAccessCode(response.data.community.accessCode);
      }
    } catch (err) {
      console.error('Error fetching access code:', err);
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      // Mark onboarding as complete
      await axios.put(`${apiUrl}/api/communities/${currentCommunity?.id}/onboarding/complete`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Refresh communities to get updated status
      await refreshCommunities();
      
      // Navigate to app
      navigate('/app');
    } catch (err: any) {
      console.error('Error completing onboarding:', err);
      setError(err.response?.data?.message || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  if (!currentCommunity) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2.5rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          Welcome to Neighbri!
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: '#6b7280',
          marginBottom: '2rem'
        }}>
          Your community <strong>{currentCommunity.name}</strong> has been set up successfully.
        </p>

        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <div style={{
          backgroundColor: '#f0f9f4',
          border: '2px solid #355B45',
          borderRadius: '0.75rem',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Your Community Access Code
          </h2>
          
          {accessCode ? (
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#355B45',
              letterSpacing: '0.5rem',
              marginBottom: '1.5rem',
              fontFamily: 'monospace',
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              border: '2px dashed #355B45'
            }}>
              {accessCode}
            </div>
          ) : (
            <div style={{
              fontSize: '1rem',
              color: '#6b7280',
              marginBottom: '1.5rem'
            }}>
              Generating access code...
            </div>
          )}

          <div style={{
            fontSize: '1rem',
            color: '#374151',
            lineHeight: '1.6',
            textAlign: 'left',
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            marginTop: '1rem'
          }}>
            <p style={{ marginBottom: '1rem' }}>
              <strong>Please send this access code to all of your residents</strong> along with a link to{' '}
              <a 
                href="https://www.neighbri.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: '#355B45',
                  textDecoration: 'underline',
                  fontWeight: 600
                }}
              >
                neighbri.com
              </a>
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
              Residents will use this code to register and join your community on Neighbri.
            </p>
          </div>
        </div>

        <button
          onClick={handleCompleteOnboarding}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.875rem 1.5rem',
            backgroundColor: loading ? '#9ca3af' : '#355B45',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            fontFamily: 'Inter, sans-serif'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#244032';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#355B45';
            }
          }}
        >
          {loading ? 'Completing...' : 'Continue to App'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;
