import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const OnboardingPage: React.FC = () => {
  const { currentCommunity, token } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Step 1: Authorization Certification
  const [authorizationCertified, setAuthorizationCertified] = useState(false);
  
  // Step 2: Payment Setup (placeholder)
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  // Step 3: Member Access
  const [memberAccessMethod, setMemberAccessMethod] = useState<'upload' | 'email' | null>(null);
  const [emailList, setEmailList] = useState('');
  const [memberListFile, setMemberListFile] = useState<File | null>(null);

  useEffect(() => {
    // Check if community needs onboarding
    if (currentCommunity?.onboardingCompleted) {
      navigate('/app');
    }
    // Only allow admins to access onboarding
    if (currentCommunity && currentCommunity.role !== 'admin') {
      navigate('/app');
    }
  }, [currentCommunity, navigate]);

  const handleCertification = async () => {
    if (!authorizationCertified) {
      setError('Please certify that you have authorization to make decisions for this community.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      await axios.put(`${apiUrl}/api/communities/${currentCommunity?.id}/onboarding/certify`, {
        certified: true
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setStep(2);
    } catch (err: any) {
      console.error('Error certifying authorization:', err);
      setError(err.response?.data?.message || 'Failed to save certification');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentPlaceholder = () => {
    // Placeholder for payment setup
    setPaymentCompleted(true);
    setStep(3);
  };

  const handleSendAccessCodes = async () => {
    if (!emailList.trim()) {
      setError('Please enter at least one email address');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const emails = emailList.split('\n').map(e => e.trim()).filter(e => e);
      
      await axios.post(`${apiUrl}/api/communities/${currentCommunity?.id}/onboarding/send-access-codes`, {
        emails
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Mark member list as uploaded (email sent)
      await axios.put(`${apiUrl}/api/communities/${currentCommunity?.id}/onboarding/complete`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Refresh to get updated community status
      window.location.reload();
    } catch (err: any) {
      console.error('Error sending access codes:', err);
      setError(err.response?.data?.message || 'Failed to send access codes');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadMemberList = async () => {
    if (!memberListFile) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const formData = new FormData();
      formData.append('memberList', memberListFile);
      
      await axios.post(`${apiUrl}/api/communities/${currentCommunity?.id}/onboarding/upload-member-list`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Mark member list as uploaded
      await axios.put(`${apiUrl}/api/communities/${currentCommunity?.id}/onboarding/complete`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Refresh to get updated community status
      window.location.reload();
    } catch (err: any) {
      console.error('Error uploading member list:', err);
      setError(err.response?.data?.message || 'Failed to upload member list');
    } finally {
      setLoading(false);
    }
  };

  if (!currentCommunity) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        padding: '2rem'
      }}>
        {/* Progress Indicator */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: step >= s ? '#355B45' : '#e5e7eb',
                  color: step >= s ? 'white' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}>
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && (
                  <div style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: step > s ? '#355B45' : '#e5e7eb',
                    margin: '0 0.5rem'
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
            <span style={{ fontWeight: step === 1 ? 600 : 400 }}>Authorization</span>
            <span style={{ fontWeight: step === 2 ? 600 : 400 }}>Payment</span>
            <span style={{ fontWeight: step === 3 ? 600 : 400 }}>Member Access</span>
          </div>
        </div>

        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 700,
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          Welcome to Neighbri, {currentCommunity.name}!
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Let's get your community set up. This will only take a few minutes.
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

        {/* Step 1: Authorization Certification */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>
              Step 1: Authorization Certification
            </h2>
            <div style={{
              backgroundColor: '#f0f9f4',
              border: '1px solid #355B45',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={authorizationCertified}
                  onChange={(e) => setAuthorizationCertified(e.target.checked)}
                  style={{
                    marginTop: '0.25rem',
                    marginRight: '0.75rem',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer'
                  }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '0.5rem' }}>
                    I certify that I have authorization to make decisions for {currentCommunity.name}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    By checking this box, you confirm that you have the authority to enter into agreements and make 
                    decisions on behalf of your community/HOA, including setting up recurring payments.
                  </div>
                </div>
              </label>
            </div>
            <button
              onClick={handleCertification}
              disabled={loading || !authorizationCertified}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                backgroundColor: loading || !authorizationCertified ? '#9ca3af' : '#355B45',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: loading || !authorizationCertified ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? 'Saving...' : 'Continue to Payment Setup'}
            </button>
          </div>
        )}

        {/* Step 2: Payment Setup */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>
              Step 2: Payment Setup
            </h2>
            <div style={{
              backgroundColor: '#f0f9f4',
              border: '1px solid #355B45',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '0.5rem' }}>
                  Recurring Payment: $200/month
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Your community will be charged $200 per month for Neighbri services. This fee will be automatically 
                  charged to your payment method on file.
                </div>
              </div>
              <div style={{
                backgroundColor: 'white',
                border: '2px dashed #d1d5db',
                borderRadius: '0.5rem',
                padding: '2rem',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#6b7280', marginBottom: '0.5rem' }}>
                  Payment Integration Coming Soon
                </div>
                <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                  This is where Stripe/Square payment setup would be integrated
                </div>
              </div>
            </div>
            <button
              onClick={handlePaymentPlaceholder}
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                backgroundColor: loading ? '#9ca3af' : '#355B45',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? 'Processing...' : 'Continue to Member Access'}
            </button>
          </div>
        )}

        {/* Step 3: Member Access */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>
              Step 3: Member Access
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Choose how you'd like to provide access to your community members:
            </p>

            {!memberAccessMethod && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => setMemberAccessMethod('email')}
                  style={{
                    padding: '1.5rem',
                    backgroundColor: 'white',
                    border: '2px solid #d1d5db',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#355B45';
                    e.currentTarget.style.backgroundColor = '#f0f9f4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '0.5rem' }}>
                    📧 Send Access Codes via Email
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Enter email addresses and we'll send each member their access code and registration link
                  </div>
                </button>

                <button
                  onClick={() => setMemberAccessMethod('upload')}
                  style={{
                    padding: '1.5rem',
                    backgroundColor: 'white',
                    border: '2px solid #d1d5db',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#355B45';
                    e.currentTarget.style.backgroundColor = '#f0f9f4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  <div style={{ fontWeight: 600, color: '#1f2937', marginBottom: '0.5rem' }}>
                    📄 Upload Member List
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Upload a CSV file with member email addresses and we'll process them automatically
                  </div>
                </button>
              </div>
            )}

            {memberAccessMethod === 'email' && (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Email Addresses (one per line)
                  </label>
                  <textarea
                    value={emailList}
                    onChange={(e) => setEmailList(e.target.value)}
                    placeholder="member1@example.com&#10;member2@example.com&#10;member3@example.com"
                    style={{
                      width: '100%',
                      minHeight: '150px',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontFamily: 'Inter, sans-serif',
                      resize: 'vertical'
                    }}
                  />
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    Access code: <strong>{currentCommunity.accessCode || 'Not generated yet'}</strong>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => setMemberAccessMethod(null)}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'white',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSendAccessCodes}
                    disabled={loading || !emailList.trim()}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1.5rem',
                      backgroundColor: loading || !emailList.trim() ? '#9ca3af' : '#355B45',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: loading || !emailList.trim() ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Sending...' : 'Send Access Codes'}
                  </button>
                </div>
              </div>
            )}

            {memberAccessMethod === 'upload' && (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '0.5rem'
                  }}>
                    Upload Member List (CSV)
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setMemberListFile(e.target.files?.[0] || null)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  />
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    CSV should have a column with email addresses. Other columns are optional.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => setMemberAccessMethod(null)}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'white',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleUploadMemberList}
                    disabled={loading || !memberListFile}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1.5rem',
                      backgroundColor: loading || !memberListFile ? '#9ca3af' : '#355B45',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: loading || !memberListFile ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Uploading...' : 'Upload Member List'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;

