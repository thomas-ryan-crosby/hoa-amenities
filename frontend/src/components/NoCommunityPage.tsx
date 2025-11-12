import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const NoCommunityPage: React.FC = () => {
  const { token, login, refreshCommunities } = useAuth();
  const navigate = useNavigate();
  const [searchMethod, setSearchMethod] = useState<'zipcode' | 'accesscode'>('zipcode');
  const [zipCode, setZipCode] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{id: number, name: string, description?: string, address?: string}>>([]);
  const [searching, setSearching] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      const communities = response.data.communities || [];
      setSearchResults(communities);
      if (communities.length === 0) {
        setError('No communities found for this zip code');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search communities');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleJoinCommunity = async (communityId: number) => {
    if (!token) {
      setError('You must be logged in to join a community');
      return;
    }

    try {
      setJoining(true);
      setError(null);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(
        `${apiUrl}/api/communities/join`,
        { communityId },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Check if request is pending approval
      if (response.data.status === 'pending') {
        setSuccess(response.data.message || 'Your request to join this community has been submitted and is pending admin approval. You will be notified once your request is reviewed.');
        setSearchResults([]);
        setZipCode('');
        return;
      }

      // Update auth context with new token and community (if approved immediately)
      const { token: newToken, currentCommunity, communities } = response.data;
      
      // Get user data from localStorage
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (user && newToken) {
        // Transform communities data
        const communitiesList = (communities || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          role: c.role,
          joinedAt: c.joinedAt
        }));

        const currentCommunityData = currentCommunity ? {
          id: currentCommunity.id,
          name: currentCommunity.name,
          role: currentCommunity.role
        } : null;

        login(user, newToken, communitiesList, currentCommunityData);
        await refreshCommunities();
        
        setSuccess(`Successfully joined ${currentCommunity.name}!`);
        setTimeout(() => {
          navigate('/app');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to join community');
    } finally {
      setJoining(false);
    }
  };

  const handleJoinByAccessCode = async () => {
    if (!accessCode.trim()) {
      setError('Please enter an access code');
      return;
    }

    if (!token) {
      setError('You must be logged in to join a community');
      return;
    }

    try {
      setJoining(true);
      setError(null);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(
        `${apiUrl}/api/communities/join`,
        { accessCode: accessCode.trim().toUpperCase() },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Check if request is pending approval
      if (response.data.status === 'pending') {
        setSuccess(response.data.message || 'Your request to join this community has been submitted and is pending admin approval. You will be notified once your request is reviewed.');
        setAccessCode('');
        return;
      }

      // Update auth context with new token and community (if approved immediately)
      const { token: newToken, currentCommunity, communities } = response.data;
      
      // Get user data from localStorage
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (user && newToken) {
        // Transform communities data
        const communitiesList = (communities || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          description: c.description,
          role: c.role,
          joinedAt: c.joinedAt
        }));

        const currentCommunityData = currentCommunity ? {
          id: currentCommunity.id,
          name: currentCommunity.name,
          role: currentCommunity.role
        } : null;

        login(user, newToken, communitiesList, currentCommunityData);
        await refreshCommunities();
        
        setSuccess(`Successfully joined ${currentCommunity.name}!`);
        setTimeout(() => {
          navigate('/app');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to join community');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '2rem auto', 
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
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
          Search for your community to get started
        </p>
      </div>

      {success && (
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #86efac',
          color: '#166534',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          {success}
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

      {/* Search Method Toggle */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '1.5rem',
        backgroundColor: '#f9fafb',
        padding: '0.25rem',
        borderRadius: '0.5rem'
      }}>
        <button
          type="button"
          onClick={() => {
            setSearchMethod('zipcode');
            setSearchResults([]);
            setError(null);
          }}
          style={{
            flex: 1,
            padding: '0.5rem',
            backgroundColor: searchMethod === 'zipcode' ? '#355B45' : 'transparent',
            color: searchMethod === 'zipcode' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.2s'
          }}
        >
          Search by Zip Code
        </button>
        <button
          type="button"
          onClick={() => {
            setSearchMethod('accesscode');
            setSearchResults([]);
            setError(null);
          }}
          style={{
            flex: 1,
            padding: '0.5rem',
            backgroundColor: searchMethod === 'accesscode' ? '#355B45' : 'transparent',
            color: searchMethod === 'accesscode' ? 'white' : '#6b7280',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            transition: 'all 0.2s'
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
                setSearchResults([]);
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
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151', marginBottom: '0.75rem' }}>
                Found {searchResults.length} {searchResults.length === 1 ? 'Community' : 'Communities'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {searchResults.map((community) => (
                  <button
                    key={community.id}
                    type="button"
                    onClick={() => handleJoinCommunity(community.id)}
                    disabled={joining}
                    style={{
                      padding: '1rem',
                      backgroundColor: joining ? '#f3f4f6' : 'white',
                      border: '2px solid #355B45',
                      borderRadius: '0.5rem',
                      cursor: joining ? 'not-allowed' : 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      fontFamily: 'Inter, sans-serif'
                    }}
                    onMouseEnter={(e) => {
                      if (!joining) {
                        e.currentTarget.style.backgroundColor = '#f0f9f4';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!joining) {
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.25rem' }}>
                      {community.name}
                    </div>
                    {community.description && (
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        {community.description}
                      </div>
                    )}
                    {community.address && (
                      <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        {community.address}
                      </div>
                    )}
                    <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#355B45', fontWeight: 600 }}>
                      {joining ? 'Joining...' : 'Click to Join →'}
                    </div>
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
              onChange={(e) => {
                setAccessCode(e.target.value);
                setSearchResults([]);
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
                  handleJoinByAccessCode();
                }
              }}
            />
            <button
              type="button"
              onClick={handleJoinByAccessCode}
              disabled={joining || !accessCode.trim()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: joining || !accessCode.trim() ? '#9ca3af' : '#355B45',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                cursor: joining || !accessCode.trim() ? 'not-allowed' : 'pointer'
              }}
            >
              {joining ? 'Joining...' : 'Join'}
            </button>
          </div>
          <p style={{ 
            fontSize: '0.75rem', 
            color: '#6b7280', 
            marginTop: '0.5rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Don't have an access code? Contact your HOA administrator.
          </p>
        </div>
      )}
    </div>
  );
};

export default NoCommunityPage;

