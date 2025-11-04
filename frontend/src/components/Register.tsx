import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface RegisterProps {
  onRegister?: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [step, setStep] = useState<'community-selection' | 'community-finder' | 'registration'>('community-selection');
  const [communitySelection, setCommunitySelection] = useState<'existing' | 'interested' | null>(null);
  const [interestedRole, setInterestedRole] = useState<'resident' | 'janitorial' | 'admin' | ''>('');
  const [selectedCommunities, setSelectedCommunities] = useState<Array<{id: number, name: string, description?: string}>>([]);
  const [searchMethod, setSearchMethod] = useState<'zipcode' | 'accesscode'>('zipcode');
  const [zipCode, setZipCode] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [accessCodes, setAccessCodes] = useState<string[]>(['']);
  const [searchResults, setSearchResults] = useState<Array<{id: number, name: string, description?: string, address?: string}>>([]);
  const [searching, setSearching] = useState(false);
  const [registeringNewCommunity, setRegisteringNewCommunity] = useState(false);
  const [communityInfo, setCommunityInfo] = useState({
    communityName: '',
    communityAddress: '',
    approximateHouseholds: '',
    primaryContact: ''
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    agreedToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleCommunityInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCommunityInfo({
      ...communityInfo,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!communitySelection) {
      setError('Please complete the community selection step');
      return;
    }

    // For interested users, require community info
    if (communitySelection === 'interested') {
      if (!communityInfo.communityName.trim()) {
        setError('Community / HOA Name is required');
        return;
      }
      if (!communityInfo.communityAddress.trim()) {
        setError('Community / HOA Address is required');
        return;
      }
      if (!communityInfo.primaryContact.trim()) {
        setError('Primary contact for HOA / Community is required');
        return;
      }
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
        setError('Please provide your personal information');
        return;
      }
    }

    if (communitySelection === 'existing' && selectedCommunities.length === 0 && !registeringNewCommunity) {
      setError('Please select at least one community or register a new community');
      return;
    }

    // Validate community info if registering new community (existing users)
    if (registeringNewCommunity && communitySelection === 'existing') {
      if (!communityInfo.communityName.trim()) {
        setError('Community / HOA Name is required');
        return;
      }
      if (!communityInfo.communityAddress.trim()) {
        setError('Community / HOA Address is required');
        return;
      }
      if (!communityInfo.primaryContact.trim()) {
        setError('Primary contact for HOA / Community is required');
        return;
      }
    }

    if (!formData.agreedToTerms) {
      setError('You must agree to the Terms of Service to create an account');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const registrationData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        role: 'resident' // Default role for new registrations
      };

      // Add community selection info
      registrationData.communitySelection = registeringNewCommunity ? 'new-community' : communitySelection;
      if (communitySelection === 'interested' && interestedRole) {
        registrationData.interestedRole = interestedRole;
      }
      if (communitySelection === 'existing' && selectedCommunities.length > 0) {
        registrationData.communityIds = selectedCommunities.map(c => c.id);
      }
      
      // Add community info if registering new community
      if (registeringNewCommunity) {
        registrationData.communityInfo = {
          communityName: communityInfo.communityName,
          communityAddress: communityInfo.communityAddress,
          approximateHouseholds: parseInt(communityInfo.approximateHouseholds) || 0,
          primaryContact: communityInfo.primaryContact
        };
      }

      const response = await axios.post(`${apiUrl}/api/auth/register`, registrationData);

      console.log('✅ Registration successful:', response.data);
      setRegisteredEmail(formData.email);
      setSuccess(true);

    } catch (error: any) {
      console.error('❌ Registration error:', error);
      console.error('❌ Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      await axios.post(`${apiUrl}/api/auth/resend-verification`, {
        email: registeredEmail
      });
      setError(null);
      alert('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ 
        maxWidth: '480px', 
        margin: '0 auto', 
        padding: '0',
        textAlign: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '3rem', 
            color: '#355B45', 
            marginBottom: '1rem' 
          }}>
            ✅
          </div>
          <h2 style={{ color: '#355B45', marginBottom: '1rem', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
            Registration Successful!
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            We've sent a verification email to <strong>{registeredEmail}</strong>. 
            Please check your inbox and click the verification link to activate your account.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '1.5rem' }}>
            You won't be able to make reservations until your email is verified.
          </p>
          <button
            onClick={handleResendVerification}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: loading ? '#9ca3af' : '#355B45',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              transition: 'background-color 0.2s'
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
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Already verified?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#355B45', 
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Community Selection Step
  if (step === 'community-selection') {
    return (
      <div>
        {/* Progress Indicator */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#355B45', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
              1
            </div>
            <div style={{ width: '60px', height: '2px', backgroundColor: '#e5e7eb' }}></div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e5e7eb', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
              2
            </div>
            <div style={{ width: '60px', height: '2px', backgroundColor: '#e5e7eb' }}></div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e5e7eb', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
              3
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
            <span style={{ color: '#355B45', fontWeight: 600 }}>Community</span>
            <span>Account</span>
            <span>Complete</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 700, 
            color: '#1f2937', 
            marginBottom: '0.5rem',
            fontFamily: 'Inter, sans-serif' 
          }}>
            Welcome to Neighbri
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '0.9375rem',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '2rem'
          }}>
            Let's get started by understanding your community situation
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <button
            type="button"
            onClick={() => {
              setCommunitySelection('existing');
              setStep('community-finder');
            }}
            style={{
              width: '100%',
              padding: '1.25rem',
              backgroundColor: communitySelection === 'existing' ? '#f0f9f4' : 'white',
              border: communitySelection === 'existing' ? '2px solid #355B45' : '2px solid #e5e7eb',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => {
              if (communitySelection !== 'existing') {
                e.currentTarget.style.borderColor = '#355B45';
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (communitySelection !== 'existing') {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = 'white';
              }
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.5rem' }}>
              My community has Neighbri
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              I am looking to get registered within my community
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setCommunitySelection('interested');
              setStep('community-finder');
            }}
            style={{
              width: '100%',
              padding: '1.25rem',
              backgroundColor: communitySelection === 'interested' ? '#f0f9f4' : 'white',
              border: communitySelection === 'interested' ? '2px solid #355B45' : '2px solid #e5e7eb',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={(e) => {
              if (communitySelection !== 'interested') {
                e.currentTarget.style.borderColor = '#355B45';
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }
            }}
            onMouseLeave={(e) => {
              if (communitySelection !== 'interested') {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.backgroundColor = 'white';
              }
            }}
          >
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.5rem' }}>
              Unsure if my community has Neighbri
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              I am interested in learning more
            </div>
          </button>
        </div>


        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#355B45', 
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Community Finder Step (for existing communities)
  if (step === 'community-finder') {
    const searchByZipCode = async () => {
      if (!zipCode.trim()) {
        setError('Please enter a zip code');
        return;
      }

      try {
        setSearching(true);
        setError(null);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/communities/search/by-zipcode`, {
          params: { zipCode: zipCode.trim() }
        });
        setSearchResults(response.data.communities || []);
        if (response.data.communities.length === 0) {
          setError('No communities found for this zip code');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to search communities');
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    };

    const searchByAccessCode = async (code: string) => {
      if (!code.trim()) {
        return;
      }

      try {
        setSearching(true);
        setError(null);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/communities/search/by-access-code`, {
          params: { accessCode: code.trim().toUpperCase() }
        });
        
        const community = response.data.community;
        if (community && !selectedCommunities.find(c => c.id === community.id)) {
          setSelectedCommunities([...selectedCommunities, community]);
          setAccessCode('');
        } else if (community) {
          setError('Community already added');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Community not found with this access code');
      } finally {
        setSearching(false);
      }
    };

    const removeCommunity = (id: number) => {
      setSelectedCommunities(selectedCommunities.filter(c => c.id !== id));
    };

    const addCommunityFromResults = (community: any) => {
      if (!selectedCommunities.find(c => c.id === community.id)) {
        setSelectedCommunities([...selectedCommunities, community]);
      }
    };

    return (
      <div>
        {/* Progress Indicator */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
              ✓
            </div>
            <div style={{ width: '60px', height: '2px', backgroundColor: '#355B45' }}></div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#355B45', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
              2
            </div>
            <div style={{ width: '60px', height: '2px', backgroundColor: '#e5e7eb' }}></div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e5e7eb', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
              3
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
            <span style={{ color: '#10b981', fontWeight: 600 }}>Community</span>
            <span style={{ color: '#355B45', fontWeight: 600 }}>Find</span>
            <span>Account</span>
            <span>Complete</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 700, 
            color: '#1f2937', 
            marginBottom: '0.5rem',
            fontFamily: 'Inter, sans-serif' 
          }}>
            Find Your Community
          </h1>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '0.9375rem',
            fontFamily: 'Inter, sans-serif' 
          }}>
            Search by zip code or enter an access code
          </p>
        </div>

        <button
          type="button"
          onClick={() => setStep('community-selection')}
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

        {/* Search Method Toggle */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
          <button
            type="button"
            onClick={() => setSearchMethod('zipcode')}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: searchMethod === 'zipcode' ? '#f0f9f4' : 'white',
              border: searchMethod === 'zipcode' ? '2px solid #355B45' : '1px solid #d1d5db',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: searchMethod === 'zipcode' ? 600 : 400,
              color: '#1f2937',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Search by Zip Code
          </button>
          <button
            type="button"
            onClick={() => setSearchMethod('accesscode')}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: searchMethod === 'accesscode' ? '#f0f9f4' : 'white',
              border: searchMethod === 'accesscode' ? '2px solid #355B45' : '1px solid #d1d5db',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: searchMethod === 'accesscode' ? 600 : 400,
              color: '#1f2937',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Enter Access Code
          </button>
        </div>

        {/* Zip Code Search */}
        {searchMethod === 'zipcode' && (
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Zip Code *
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter zip code"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    searchByZipCode();
                  }
                }}
              />
              <button
                type="button"
                onClick={searchByZipCode}
                disabled={searching || !zipCode.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: searching || !zipCode.trim() ? '#9ca3af' : '#355B45',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  cursor: searching || !zipCode.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                  Found Communities ({searchResults.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                  {searchResults.map((community) => (
                    <button
                      key={community.id}
                      type="button"
                      onClick={() => addCommunityFromResults(community)}
                      disabled={!!selectedCommunities.find(c => c.id === community.id)}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        backgroundColor: selectedCommunities.find(c => c.id === community.id) ? '#f0f9f4' : 'white',
                        border: selectedCommunities.find(c => c.id === community.id) ? '2px solid #355B45' : '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        cursor: selectedCommunities.find(c => c.id === community.id) ? 'default' : 'pointer',
                        textAlign: 'left',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.25rem' }}>
                        {community.name}
                        {selectedCommunities.find(c => c.id === community.id) && (
                          <span style={{ marginLeft: '0.5rem', color: '#059669', fontSize: '0.75rem' }}>✓ Added</span>
                        )}
                      </div>
                      {community.description && (
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                          {community.description}
                        </div>
                      )}
                      {community.address && (
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          {community.address}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Access Code Entry */}
        {searchMethod === 'accesscode' && (
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '0.5rem'
            }}>
              Access Code *
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter access code"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box',
                  textTransform: 'uppercase'
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    searchByAccessCode(accessCode);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => searchByAccessCode(accessCode)}
                disabled={searching || !accessCode.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: searching || !accessCode.trim() ? '#9ca3af' : '#355B45',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  cursor: searching || !accessCode.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                {searching ? 'Searching...' : 'Add'}
              </button>
            </div>
          </div>
        )}

        {/* Selected Communities */}
        {selectedCommunities.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
              Selected Communities ({selectedCommunities.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selectedCommunities.map((community) => (
                <div
                  key={community.id}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#f0f9f4',
                    border: '2px solid #355B45',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.25rem' }}>
                      {community.name}
                    </div>
                    {community.description && (
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {community.description}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCommunity(community.id)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#dc2626',
                      cursor: 'pointer',
                      fontSize: '1.25rem',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          type="button"
          onClick={() => {
            if (selectedCommunities.length === 0) {
              setError('Please select at least one community or enter an access code');
              return;
            }
            setError(null);
            setStep('registration');
          }}
          style={{
            width: '100%',
            backgroundColor: '#355B45',
            color: 'white',
            padding: '0.75rem 1rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            marginBottom: '1.5rem',
            transition: 'background-color 0.2s, transform 0.1s',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#244032';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#355B45';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Continue with {selectedCommunities.length} {selectedCommunities.length === 1 ? 'Community' : 'Communities'}
        </button>

        {/* Can't find community option */}
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ 
            textAlign: 'center', 
            color: '#6b7280', 
            fontSize: '0.875rem',
            marginBottom: '1rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Can't find your community?
          </p>
          <button
            type="button"
            onClick={() => {
              setRegisteringNewCommunity(true);
              setStep('registration');
            }}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'transparent',
              border: '2px dashed #355B45',
              borderRadius: '0.5rem',
              color: '#355B45',
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f9f4';
              e.currentTarget.style.borderColor = '#244032';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#355B45';
            }}
          >
            Maybe your community isn't onboard yet - Register your community
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress Indicator */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
            ✓
          </div>
          <div style={{ width: '60px', height: '2px', backgroundColor: communitySelection === 'existing' ? '#10b981' : '#e5e7eb' }}></div>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: communitySelection === 'existing' ? '#10b981' : '#355B45', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
            {communitySelection === 'existing' ? '✓' : '2'}
          </div>
          <div style={{ width: '60px', height: '2px', backgroundColor: '#355B45' }}></div>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#355B45', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
            3
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem', color: '#6b7280' }}>
          <span style={{ color: '#10b981', fontWeight: 600 }}>Community</span>
          {communitySelection === 'existing' && <span style={{ color: '#10b981', fontWeight: 600 }}>Find</span>}
          <span style={{ color: '#355B45', fontWeight: 600 }}>Account</span>
          <span>Complete</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '1.875rem', 
          fontWeight: 700, 
          color: '#1f2937', 
          marginBottom: '0.5rem',
          fontFamily: 'Inter, sans-serif' 
        }}>
          Create your account
        </h1>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '0.9375rem',
          fontFamily: 'Inter, sans-serif' 
        }}>
          Join the Neighbri community today
        </p>
      </div>

      {communitySelection === 'existing' ? (
        <button
          type="button"
          onClick={() => setStep('community-finder')}
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
          ← Back to Community Finder
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setStep('community-selection')}
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
      )}

      {/* Community Search Prompt for Registration */}
      {!registeringNewCommunity && communitySelection === 'existing' && (
        <div style={{ 
          marginBottom: '1.5rem', 
          padding: '1rem', 
          backgroundColor: '#f0f9f4', 
          border: '1px solid #355B45', 
          borderRadius: '0.5rem' 
        }}>
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#374151', 
            marginBottom: '0.5rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            <strong>Did you find your community?</strong> If not, you can register your community below.
          </p>
          <button
            type="button"
            onClick={() => setRegisteringNewCommunity(true)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid #355B45',
              borderRadius: '0.375rem',
              color: '#355B45',
              fontSize: '0.875rem',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer'
            }}
          >
            Register New Community
          </button>
        </div>
      )}

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

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: '#374151',
            marginBottom: '0.25rem'
          }}>
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
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
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: '#374151',
            marginBottom: '0.25rem'
          }}>
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
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
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
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
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: '#374151',
            marginBottom: '0.25rem'
          }}>
            Phone Number
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
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: '#374151',
            marginBottom: '0.25rem'
          }}>
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street address, City, State"
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
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: '#374151',
            marginBottom: '0.25rem'
          }}>
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
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

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: '500', 
            color: '#374151',
            marginBottom: '0.25rem'
          }}>
            Confirm Password *
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
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

        {/* Community Information Fields (when registering new community) */}
        {registeringNewCommunity && (
          <div style={{ 
            marginTop: '2rem', 
            paddingTop: '2rem', 
            borderTop: '2px solid #355B45' 
          }}>
            <h3 style={{ 
              fontSize: '1.125rem', 
              fontWeight: 600, 
              color: '#1f2937', 
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Community / HOA Information
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '0.25rem'
              }}>
                Community / HOA Name *
              </label>
              <input
                type="text"
                name="communityName"
                value={communityInfo.communityName}
                onChange={handleCommunityInfoChange}
                required
                placeholder="e.g., The Sanctuary"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '0.25rem'
              }}>
                Community / HOA Address *
              </label>
              <input
                type="text"
                name="communityAddress"
                value={communityInfo.communityAddress}
                onChange={handleCommunityInfoChange}
                required
                placeholder="e.g., 1 Sanctuary Blvd, Mandeville, LA 70471"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '0.25rem'
              }}>
                Approximate Number of Households / Units
              </label>
              <input
                type="number"
                name="approximateHouseholds"
                value={communityInfo.approximateHouseholds}
                onChange={handleCommunityInfoChange}
                min="1"
                placeholder="e.g., 150"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '0.25rem'
              }}>
                Primary Contact for HOA / Community *
              </label>
              <input
                type="text"
                name="primaryContact"
                value={communityInfo.primaryContact}
                onChange={handleCommunityInfoChange}
                required
                placeholder="e.g., HOA Board President, Property Manager"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        )}

        {/* Terms of Service */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'flex-start' }}>
          <input
            type="checkbox"
            name="agreedToTerms"
            id="agreedToTerms"
            checked={formData.agreedToTerms}
            onChange={handleChange}
            required
            style={{
              marginRight: '0.5rem',
              marginTop: '0.25rem'
            }}
          />
          <label 
            htmlFor="agreedToTerms"
            style={{ 
              fontSize: '0.875rem', 
              color: '#374151',
              lineHeight: '1.5'
            }}
          >
            I agree to the Terms of Service and Privacy Policy *
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: loading ? '#9ca3af' : '#355B45',
            color: 'white',
            padding: '0.75rem 1rem',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '1.5rem',
            transition: 'background-color 0.2s, transform 0.1s',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
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
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#355B45', 
                textDecoration: 'none',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Sign in here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
