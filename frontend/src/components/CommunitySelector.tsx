import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CommunitySelector: React.FC = () => {
  const { currentCommunity, communities, switchCommunity } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitch = async (communityId: number) => {
    if (communityId === currentCommunity?.id) {
      setIsOpen(false);
      return;
    }

    try {
      await switchCommunity(communityId);
      setIsOpen(false);
    } catch (error: any) {
      console.error('Failed to switch community:', error);
      alert(error.message || 'Failed to switch community');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#dc2626';
      case 'janitorial': return '#355B45';
      case 'resident': return '#059669';
      default: return '#6b7280';
    }
  };

  if (communities.length <= 1) {
    // Don't show selector if user only belongs to one community
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'white' }}>
          {currentCommunity?.name}
        </span>
        <span
          style={{
            backgroundColor: getRoleColor(currentCommunity?.role || ''),
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: '500',
            textTransform: 'uppercase'
          }}
        >
          {currentCommunity?.role}
        </span>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
      >
        <span>{currentCommunity?.name}</span>
        <span
          style={{
            backgroundColor: getRoleColor(currentCommunity?.role || ''),
            color: 'white',
            padding: '0.125rem 0.375rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: '500',
            textTransform: 'uppercase'
          }}
        >
          {currentCommunity?.role}
        </span>
        <span style={{ fontSize: '0.75rem', marginLeft: '0.25rem' }}>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '0.5rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
            minWidth: '250px',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          <div style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
              Your Communities
            </div>
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {communities.map((community) => (
              <button
                key={community.id}
                onClick={() => handleSwitch(community.id)}
                disabled={community.id === currentCommunity?.id}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  backgroundColor: community.id === currentCommunity?.id ? '#f3f4f6' : 'white',
                  cursor: community.id === currentCommunity?.id ? 'default' : 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s',
                  borderBottom: '1px solid #f3f4f6'
                }}
                onMouseEnter={(e) => {
                  if (community.id !== currentCommunity?.id) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (community.id !== currentCommunity?.id) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1f2937' }}>
                      {community.name}
                    </span>
                    {community.id === currentCommunity?.id && (
                      <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '500' }}>✓</span>
                    )}
                  </div>
                  {community.description && (
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {community.description}
                    </div>
                  )}
                </div>
                <span
                  style={{
                    backgroundColor: getRoleColor(community.role),
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    flexShrink: 0
                  }}
                >
                  {community.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunitySelector;

