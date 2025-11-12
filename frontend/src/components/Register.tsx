import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface RegisterProps {
  onRegister?: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [step, setStep] = useState<'community-selection' | 'community-finder' | 'registration' | 'authorization' | 'payment'>('community-selection');
  const [communitySelection, setCommunitySelection] = useState<'existing' | 'interested' | null>(null);
  // Removed unused interestedRole and accessCodes state
  const [selectedCommunities, setSelectedCommunities] = useState<Array<{id: number, name: string, description?: string}>>([]);
  const [searchMethod, setSearchMethod] = useState<'zipcode' | 'accesscode'>('zipcode');
  const [zipCode, setZipCode] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{id: number, name: string, description?: string, address?: string}>>([]);
  const [searching, setSearching] = useState(false);
  const [accessCodeSearched, setAccessCodeSearched] = useState(false);
  const [zipCodeSearched, setZipCodeSearched] = useState(false);
  const [registeringNewCommunity, setRegisteringNewCommunity] = useState(false);
  const [communityInfo, setCommunityInfo] = useState({
    communityName: '',
    communityStreet: '',
    communityZipCode: '',
    communityCity: '',
    communityState: '',
    approximateHouseholds: '',
    primaryContactName: '',
    primaryContactTitle: '',
    primaryContactInfo: ''
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    street: '',
    zipCode: '',
    city: '',
    state: '',
    agreedToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  
  // Onboarding states for interested users
  const [authorizationCertified, setAuthorizationCertified] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleCommunityInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCommunityInfo({
      ...communityInfo,
      [name]: value
    });
    
    // Auto-populate city and state when zip code is entered
    if (name === 'communityZipCode' && value.length === 5) {
      fetchCityStateFromZip(value);
    }
  };

  const fetchCityStateFromZip = async (zip: string) => {
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (response.ok) {
        const data = await response.json();
        if (data.places && data.places.length > 0) {
          const place = data.places[0];
          setCommunityInfo(prev => ({
            ...prev,
            communityCity: place['place name'],
            communityState: place['state abbreviation']
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching city/state from zip:', error);
    }
  };

  const handlePersonalZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      zipCode: value
    });
    
    // Auto-populate city and state when zip code is entered
    if (value.length === 5) {
      try {
        const response = await fetch(`https://api.zippopotam.us/us/${value}`);
        if (response.ok) {
          const data = await response.json();
          if (data.places && data.places.length > 0) {
            const place = data.places[0];
            setFormData(prev => ({
              ...prev,
              zipCode: value,
              city: place['place name'],
              state: place['state abbreviation']
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching city/state from zip:', error);
      }
    }
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
      if (!communityInfo.communityStreet.trim()) {
        setError('Community street address is required');
        return;
      }
      if (!communityInfo.communityZipCode.trim()) {
        setError('Community zip code is required');
        return;
      }
      if (!communityInfo.primaryContactName.trim()) {
        setError('Primary contact name is required');
        return;
      }
      if (!communityInfo.primaryContactTitle.trim()) {
        setError('Primary contact title is required');
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
      if (!communityInfo.communityStreet.trim()) {
        setError('Community street address is required');
        return;
      }
      if (!communityInfo.communityZipCode.trim()) {
        setError('Community zip code is required');
        return;
      }
      if (!communityInfo.primaryContactName.trim()) {
        setError('Primary contact name is required');
        return;
      }
      if (!communityInfo.primaryContactTitle.trim()) {
        setError('Primary contact title is required');
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
      
      // For interested users, proceed to authorization step
      if (communitySelection === 'interested' && step === 'registration') {
        // Move to authorization step
        setStep('authorization');
        return;
      }

      // Handle authorization step - move to payment
      if (communitySelection === 'interested' && step === 'authorization') {
        if (!authorizationCertified) {
          setError('Please certify that you have authorization to make decisions for this community.');
          return;
        }
        setStep('payment');
        return;
      }

      // Handle payment step - create account and community
      if (communitySelection === 'interested' && step === 'payment') {
        if (!paymentCompleted) {
          setError('Please complete payment setup');
          return;
        }

        // Create account and community with onboarding
        const registrationData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password || 'temp123456', // Generate temp password if not provided
          phone: formData.phone || null,
          street: formData.street || null,
          zipCode: formData.zipCode || null,
          city: formData.city || null,
          state: formData.state || null,
          communitySelection: 'new-community',
          communityInfo: {
            communityName: communityInfo.communityName,
            communityStreet: communityInfo.communityStreet,
            communityZipCode: communityInfo.communityZipCode,
            communityCity: communityInfo.communityCity,
            communityState: communityInfo.communityState,
            approximateHouseholds: parseInt(communityInfo.approximateHouseholds) || 0,
            primaryContactName: communityInfo.primaryContactName,
            primaryContactTitle: communityInfo.primaryContactTitle,
            primaryContactInfo: communityInfo.primaryContactInfo || null,
            authorizationCertified: true,
            paymentSetup: true
          }
        };

        const response = await axios.post(`${apiUrl}/api/auth/register`, registrationData);
        console.log('✅ Community registration successful:', response.data);
        
        // Auto-login the user
        if (response.data.token && response.data.user) {
          // Store token and user info
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Store community info
          if (response.data.community) {
            const community = {
              id: response.data.community.id,
              name: response.data.community.name,
              role: 'admin',
              accessCode: response.data.community.accessCode || '',
              onboardingCompleted: response.data.community.onboardingCompleted || false,
              authorizationCertified: true,
              paymentSetup: true,
              memberListUploaded: false
            };
            localStorage.setItem('currentCommunity', JSON.stringify(community));
            localStorage.setItem('communities', JSON.stringify([community]));
          }
          
          // Redirect to app (onboarding will be shown there)
          window.location.href = '/app';
        } else {
          setRegisteredEmail(formData.email);
          setSuccess(true);
        }
        return;
      }

      // For existing users, create account
      const registrationData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        street: formData.street,
        zipCode: formData.zipCode,
        city: formData.city,
        state: formData.state,
        role: 'resident' // Default role for new registrations
      };

      // Add community selection info
      registrationData.communitySelection = registeringNewCommunity ? 'new-community' : communitySelection;
      if (communitySelection === 'existing' && selectedCommunities.length > 0) {
        registrationData.communityIds = selectedCommunities.map(c => c.id);
      }
      
      // Add community info if registering new community
      if (registeringNewCommunity) {
        registrationData.communityInfo = {
          communityName: communityInfo.communityName,
          communityStreet: communityInfo.communityStreet,
          communityZipCode: communityInfo.communityZipCode,
          communityCity: communityInfo.communityCity,
          communityState: communityInfo.communityState,
          approximateHouseholds: parseInt(communityInfo.approximateHouseholds) || 0,
          primaryContactName: communityInfo.primaryContactName,
          primaryContactTitle: communityInfo.primaryContactTitle,
          primaryContactInfo: communityInfo.primaryContactInfo || null
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
    // Show different message for interested users vs account creation
    if (communitySelection === 'interested') {
      return (
        <div style={{ 
          maxWidth: '480px', 
          margin: '0 auto', 
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: '3rem', 
            color: '#10b981', 
            marginBottom: '1rem' 
          }}>
            ✓
          </div>
          <h2 style={{ 
            color: '#1f2937', 
            marginBottom: '1rem', 
            fontFamily: 'Inter, sans-serif', 
            fontWeight: 700,
            fontSize: '1.875rem'
          }}>
            Thank You for Your Interest!
          </h2>
          <p style={{ 
            color: '#6b7280', 
            marginBottom: '1rem',
            fontSize: '1rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Someone will reach out to you shortly.
          </p>
          <p style={{ 
            fontSize: '0.9375rem', 
            color: '#6b7280', 
            marginBottom: '1.5rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            We've received your information and will contact you at <strong>{registeredEmail}</strong> to discuss how Neighbri can help your community.
          </p>
        </div>
      );
    }

    // Regular registration success message
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
        setZipCodeSearched(true);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/communities/search/by-zipcode`, {
          params: { zipCode: zipCode.trim() }
        });
        const communities = response.data.communities || [];
        setSearchResults(communities);
        // Don't set error for empty results - we'll show the no results message instead
        if (communities.length === 0) {
          setError(null);
        }
      } catch (err: any) {
        // Don't set error for empty results - show no results message instead
        if (err.response?.status === 404 || (err.response?.data?.communities && err.response.data.communities.length === 0)) {
          setSearchResults([]);
          setError(null);
        } else {
          setError(err.response?.data?.message || 'Failed to search communities');
          setSearchResults([]);
        }
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
        setAccessCodeSearched(true);
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/api/communities/search/by-access-code`, {
          params: { accessCode: code.trim().toUpperCase() }
        });
        
        const community = response.data.community;
        if (community && !selectedCommunities.find(c => c.id === community.id)) {
          setSelectedCommunities([...selectedCommunities, community]);
          setAccessCode('');
          setError(null); // Clear any previous errors
          setAccessCodeSearched(false); // Reset since we found a community
        } else if (community) {
          setError('Community already added');
          setAccessCodeSearched(false);
        }
      } catch (err: any) {
        // Don't set error for "not found" - we'll show the no results message instead
        if (err.response?.status === 404) {
          setError(null);
          setAccessCodeSearched(true); // Keep as true to show no results message
        } else {
          setError(err.response?.data?.message || 'Failed to search community');
          setAccessCodeSearched(false);
        }
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
                onChange={(e) => {
                  setZipCode(e.target.value);
                  setZipCodeSearched(false); // Reset when user types
                }}
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

            {/* No Results Message */}
            {!searching && searchResults.length === 0 && zipCodeSearched && zipCode && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                backgroundColor: '#fef2f2', 
                border: '1px solid #fecaca', 
                borderRadius: '0.5rem' 
              }}>
                <p style={{ 
                  color: '#dc2626', 
                  fontSize: '0.875rem',
                  marginBottom: '0.75rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600
                }}>
                  Can't find your community?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (communitySelection === 'interested') {
                      setStep('registration');
                    } else {
                      setRegisteringNewCommunity(true);
                      setStep('registration');
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'transparent',
                    border: '1px solid #dc2626',
                    borderRadius: '0.375rem',
                    color: '#dc2626',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee2e2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Maybe your community isn't onboard yet - Register your community
                </button>
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
                onChange={(e) => {
                  setAccessCode(e.target.value);
                  setAccessCodeSearched(false); // Reset when user types
                }}
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

            {/* No Results Message for Access Code */}
            {!searching && accessCodeSearched && selectedCommunities.length === 0 && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                backgroundColor: '#fef2f2', 
                border: '1px solid #fecaca', 
                borderRadius: '0.5rem' 
              }}>
                <p style={{ 
                  color: '#dc2626', 
                  fontSize: '0.875rem',
                  marginBottom: '0.75rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600
                }}>
                  Can't find your community?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (communitySelection === 'interested') {
                      setStep('registration');
                    } else {
                      setRegisteringNewCommunity(true);
                      setStep('registration');
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'transparent',
                    border: '1px solid #dc2626',
                    borderRadius: '0.375rem',
                    color: '#dc2626',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fee2e2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Maybe your community isn't onboard yet - Register your community
                </button>
              </div>
            )}
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

      {/* Show different content based on step for interested users */}
      {communitySelection === 'interested' && step === 'authorization' && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>
            Authorization Certification
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
                  I certify that I have authorization to make decisions for {communityInfo.communityName || 'this community'}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  By checking this box, you confirm that you have the authority to enter into agreements and make 
                  decisions on behalf of your community/HOA, including setting up recurring payments.
                </div>
              </div>
            </label>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!authorizationCertified}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              backgroundColor: !authorizationCertified ? '#9ca3af' : '#355B45',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: !authorizationCertified ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Continue to Payment Setup
          </button>
        </div>
      )}

      {communitySelection === 'interested' && step === 'payment' && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '1rem' }}>
            Payment Setup
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
            type="button"
            onClick={() => {
              setPaymentCompleted(true);
              handleSubmit(new Event('submit') as any);
            }}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#355B45',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            Continue to Create Account
          </button>
        </div>
      )}

      {((communitySelection === 'interested' && step === 'registration') || (communitySelection !== 'interested')) && (
      <form onSubmit={handleSubmit}>
        {/* Community Information Fields (shown ONLY if no community selected AND registering new community, OR if user is interested) */}
        {(communitySelection === 'interested' || (registeringNewCommunity && selectedCommunities.length === 0)) && (
          <div style={{ 
            marginBottom: '2rem', 
            paddingBottom: '2rem', 
            borderBottom: '2px solid #355B45' 
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
                Street Address *
              </label>
              <input
                type="text"
                name="communityStreet"
                value={communityInfo.communityStreet}
                onChange={handleCommunityInfoChange}
                required
                placeholder="e.g., 1 Sanctuary Blvd"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>
                  Zip Code *
                </label>
                <input
                  type="text"
                  name="communityZipCode"
                  value={communityInfo.communityZipCode}
                  onChange={handleCommunityInfoChange}
                  required
                  maxLength={5}
                  placeholder="70471"
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
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>
                  City
                </label>
                <input
                  type="text"
                  name="communityCity"
                  value={communityInfo.communityCity}
                  readOnly
                  placeholder="Auto-filled"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontFamily: 'Inter, sans-serif',
                    boxSizing: 'border-box',
                    backgroundColor: '#f3f4f6'
                  }}
                />
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>
                  State
                </label>
                <input
                  type="text"
                  name="communityState"
                  value={communityInfo.communityState}
                  readOnly
                  placeholder="Auto-filled"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    fontFamily: 'Inter, sans-serif',
                    boxSizing: 'border-box',
                    backgroundColor: '#f3f4f6'
                  }}
                />
              </div>
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
                marginBottom: '0.5rem'
              }}>
                Primary Contact for HOA / Community *
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.75rem', 
                      fontWeight: '500', 
                      color: '#6b7280',
                      marginBottom: '0.25rem'
                    }}>
                      Name *
                    </label>
                    <input
                      type="text"
                      name="primaryContactName"
                      value={communityInfo.primaryContactName}
                      onChange={handleCommunityInfoChange}
                      required
                      placeholder="Full Name"
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
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.75rem', 
                      fontWeight: '500', 
                      color: '#6b7280',
                      marginBottom: '0.25rem'
                    }}>
                      Title *
                    </label>
                    <input
                      type="text"
                      name="primaryContactTitle"
                      value={communityInfo.primaryContactTitle}
                      onChange={handleCommunityInfoChange}
                      required
                      placeholder="e.g., HOA President, Property Manager"
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
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: '#6b7280',
                    marginBottom: '0.25rem'
                  }}>
                    Contact Information (Optional)
                  </label>
                  <input
                    type="text"
                    name="primaryContactInfo"
                    value={communityInfo.primaryContactInfo}
                    onChange={handleCommunityInfoChange}
                    placeholder="Phone or Email"
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
            </div>
          </div>
        )}

        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: 600, 
          color: '#1f2937', 
          marginBottom: '1rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          {communitySelection === 'interested' ? 'Your Information' : 'Personal Information'}
        </h3>

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
            Street Address
          </label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            placeholder="Street address"
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '0.25rem'
            }}>
              Zip Code
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handlePersonalZipChange}
              maxLength={5}
              placeholder="70471"
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
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '0.25rem'
            }}>
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              readOnly
              placeholder="Auto-filled"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
                backgroundColor: '#f3f4f6'
              }}
            />
          </div>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#374151',
              marginBottom: '0.25rem'
            }}>
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              readOnly
              placeholder="Auto-filled"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
                backgroundColor: '#f3f4f6'
              }}
            />
          </div>
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
      )}
    </div>
  );
};

export default Register;
