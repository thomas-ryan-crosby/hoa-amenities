import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LandingHeader from './LandingHeader';
import { useNavigate } from 'react-router-dom';

const PitchDeckGate: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if email already exists when email is entered
  useEffect(() => {
    const checkEmail = async () => {
      const email = formData.email.trim();
      if (!email || email.length < 5) return; // Don't check until email looks valid

      // Validate email format before checking
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return;

      try {
        setChecking(true);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/investors/check/${encodeURIComponent(email)}`);
        
        if (response.data.exists) {
          // Email exists - auto-grant access
          sessionStorage.setItem('pitchDeckAccess', 'true');
          sessionStorage.setItem('investorEmail', email);
          
          // Pre-fill name if available
          if (response.data.investor?.name && !formData.name) {
            setFormData(prev => ({ ...prev, name: response.data.investor.name }));
          }
          
          // Navigate to pitch deck after a brief moment
          setTimeout(() => {
            navigate('/pitch');
          }, 500);
        }
      } catch (err: any) {
        // Silently fail - user can still submit manually
        console.log('Email check failed or email not found:', err);
      } finally {
        setChecking(false);
      }
    };

    // Debounce the check
    const timeoutId = setTimeout(checkEmail, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.email, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setSubmitting(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      await axios.post(`${apiUrl}/api/investors`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null
      });

      // Store in sessionStorage to allow access to pitch deck
      sessionStorage.setItem('pitchDeckAccess', 'true');
      sessionStorage.setItem('investorEmail', formData.email.trim());
      
      // Navigate to pitch deck
      navigate('/pitch');
    } catch (err: any) {
      console.error('Error submitting investor information:', err);
      setError(err.response?.data?.message || 'Failed to submit information. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <LandingHeader />
      <main style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
        padding: '2rem 1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '3rem',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1f2937',
              marginBottom: '0.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Investor Access
            </h1>
            <p style={{
              fontSize: '1rem',
              color: '#6b7280',
              fontFamily: 'Inter, sans-serif'
            }}>
              Please provide your information to access the Neighbri pitch deck
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 600,
                color: '#374151',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: error && !formData.name.trim() ? '2px solid #ef4444' : '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your full name"
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 600,
                color: '#374151',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Email *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    paddingRight: checking ? '2.5rem' : '0.75rem',
                    border: error && !formData.email.trim() ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontFamily: 'Inter, sans-serif',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your email address"
                />
                {checking && (
                  <span style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    Checking...
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 600,
                color: '#374151',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your phone number"
              />
            </div>

            {error && (
              <div style={{
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                color: '#dc2626',
                fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                backgroundColor: submitting ? '#9ca3af' : '#355B45',
                color: 'white',
                padding: '0.875rem',
                borderRadius: '6px',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  e.currentTarget.style.backgroundColor = '#244032';
                }
              }}
              onMouseLeave={(e) => {
                if (!submitting) {
                  e.currentTarget.style.backgroundColor = '#355B45';
                }
              }}
            >
              {submitting ? 'Submitting...' : 'Access Pitch Deck'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PitchDeckGate;

