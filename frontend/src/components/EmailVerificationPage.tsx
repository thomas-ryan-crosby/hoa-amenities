import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const EmailVerificationPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Invalid verification link');
        setLoading(false);
        return;
      }

      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        await axios.get(`${apiUrl}/api/auth/verify-email/${token}`);

        setSuccess(true);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to verify email. The link may have expired.');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  if (loading) {
    return (
      <div style={{ 
        maxWidth: '400px', 
        margin: '2rem auto', 
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <p>Verifying your email...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ 
        maxWidth: '400px', 
        margin: '2rem auto', 
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '3rem', 
          color: '#355B45', 
          marginBottom: '1rem' 
        }}>
          ✅
        </div>
        <h2 style={{ color: '#355B45', marginBottom: '1rem', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
          Email Verified!
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          Your email has been successfully verified. You can now sign in to your account.
        </p>
        <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
          Redirecting to login page...
        </p>
        <Link 
          to="/login" 
          style={{ 
            color: '#355B45', 
            textDecoration: 'none',
            fontSize: '0.875rem'
          }}
        >
          Go to login now
        </Link>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '2rem auto', 
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    }}>
      <div style={{ 
        fontSize: '3rem', 
        color: '#ef4444', 
        marginBottom: '1rem' 
      }}>
        ❌
      </div>
      <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>
        Verification Failed
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
        {error}
      </p>
      <div style={{ marginTop: '1.5rem' }}>
        <Link 
          to="/register" 
          style={{ 
            color: '#355B45', 
            textDecoration: 'none',
            fontSize: '0.875rem'
          }}
        >
          Register again
        </Link>
        {' | '}
        <Link 
          to="/login" 
          style={{ 
            color: '#355B45', 
            textDecoration: 'none',
            fontSize: '0.875rem'
          }}
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
