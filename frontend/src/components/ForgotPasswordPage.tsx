import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Email is required');
      return;
    }

    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/auth/forgot-password`, {
        email
      });

      // Always show success message for security (don't reveal if email exists)
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          Email Sent!
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          If an account exists for <strong>{email}</strong>, we've sent a password reset link. 
          Please check your inbox and follow the instructions.
        </p>
        <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1rem' }}>
          The reset link will expire in 1 hour.
        </p>
        <Link 
          to="/login" 
          style={{ 
            color: '#355B45', 
            textDecoration: 'none',
            fontSize: '0.875rem'
          }}
        >
          Back to login
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
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937' }}>
          Forgot Password?
        </h1>
        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '0.75rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: '#374151',
            marginBottom: '0.25rem'
          }}>
            Email Address *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: loading ? '#9ca3af' : '#355B45',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            color: 'white',
            padding: '0.75rem',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '1rem'
          }}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Remember your password?{' '}
            <Link to="/login" style={{ color: '#355B45', textDecoration: 'none', fontFamily: 'Inter, sans-serif' }}>
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
