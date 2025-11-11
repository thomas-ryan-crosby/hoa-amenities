import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ToggleSwitch from './ToggleSwitch';

interface Community {
  id: number;
  name: string;
  description?: string;
  role: 'resident' | 'janitorial' | 'admin';
  joinedAt?: string;
}

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'resident' | 'janitorial' | 'admin';
  isActive: boolean;
  notificationPreferences?: Record<string, boolean>;
  createdAt: string;
}

interface NotificationPreferences {
  // Reservation notifications
  reservationCreated?: boolean;
  reservationApproved?: boolean;
  reservationRejected?: boolean;
  reservationCancelled?: boolean;
  reservationCompleted?: boolean;
  // Modification notifications
  modificationProposed?: boolean;
  modificationAccepted?: boolean;
  modificationRejected?: boolean;
  reservationModified?: boolean;
  // Reminder notifications
  upcomingReservationReminder24h?: boolean;
  upcomingReservationReminder7d?: boolean;
  // Approval workflow (staff)
  newReservationRequiresApproval?: boolean;
  reservationPendingAdminApproval?: boolean;
  reservationApprovedStaff?: boolean;
  // Damage assessment
  damageAssessmentRequired?: boolean;
  damageAssessmentReviewed?: boolean;
  // System notifications
  accountActivity?: boolean;
  systemAnnouncements?: boolean;
}

const ProfilePage: React.FC = () => {
  const { currentCommunity, switchCommunity } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [communitiesList, setCommunitiesList] = useState<Community[]>([]);
  
  // Form states
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });
  
  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification preferences states
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({});
  const [savingNotifications, setSavingNotifications] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    reservations: true,
    modifications: true,
    reminders: true,
    approvalWorkflow: true,
    damageAssessment: true,
    system: true
  });

  useEffect(() => {
    fetchProfile();
    fetchCommunities();
    fetchNotificationPreferences();
  }, []);

  const fetchNotificationPreferences = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${apiUrl}/api/auth/notification-preferences`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setNotificationPreferences(response.data.preferences || {});
    } catch (error: any) {
      console.error('Error fetching notification preferences:', error);
    }
  };

  const handleNotificationPreferenceChange = async (key: string, value: boolean) => {
    const updatedPreferences = {
      ...notificationPreferences,
      [key]: value
    };
    
    setNotificationPreferences(updatedPreferences);

    // Save immediately
    try {
      setSavingNotifications(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.put(`${apiUrl}/api/auth/notification-preferences`, {
        preferences: updatedPreferences
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error: any) {
      console.error('Error saving notification preferences:', error);
      // Revert on error
      setNotificationPreferences(notificationPreferences);
    } finally {
      setSavingNotifications(false);
    }
  };

  const fetchCommunities = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${apiUrl}/api/communities`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setCommunitiesList(response.data.communities);
    } catch (error: any) {
      console.error('Error fetching communities:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${apiUrl}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const userData = response.data.user || response.data;
      if (!userData) {
        throw new Error('User data not found in response');
      }
      
      setProfile(userData);
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        address: userData.address || ''
      });
    } catch (error: any) {
      console.error('❌ Error fetching profile:', error);
      setError(error.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await axios.put(`${apiUrl}/api/auth/profile`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const userData = response.data.user || response.data;
      if (!userData) {
        throw new Error('User data not found in response');
      }
      
      setProfile(userData);
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      
      // Note: The auth context will be updated on next login/refresh
      // For now, the profile page will show the updated information
    } catch (error: any) {
      console.error('❌ Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        setError('New password must be at least 6 characters long');
        return;
      }

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.put(`${apiUrl}/api/auth/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setShowPasswordChange(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess('Password changed successfully!');
    } catch (error: any) {
      console.error('❌ Error changing password:', error);
      setError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#6b7280' }}>Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#dc2626' }}>Failed to load profile</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
          Profile & Settings
        </h1>
        <p style={{ color: '#6b7280' }}>
          Manage your account information and preferences
        </p>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '0.75rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#166534',
          padding: '0.75rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem'
        }}>
          {success}
        </div>
      )}

      {/* Profile Information */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
            Personal Information
          </h2>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              style={{
                backgroundColor: '#355B45',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormData({
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    phone: profile.phone || '',
                    address: profile.address || ''
                  });
                }}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                style={{
                  backgroundColor: saving ? '#9ca3af' : '#059669',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
              First Name
            </label>
            {editMode ? (
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            ) : (
              <div style={{ padding: '0.5rem', color: '#1f2937' }}>{profile.firstName}</div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
              Last Name
            </label>
            {editMode ? (
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            ) : (
              <div style={{ padding: '0.5rem', color: '#1f2937' }}>{profile.lastName}</div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
              Email Address
            </label>
            <div style={{ padding: '0.5rem', color: '#6b7280' }}>
              {profile.email} <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>(cannot be changed)</span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
              Phone Number
            </label>
            {editMode ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            ) : (
              <div style={{ padding: '0.5rem', color: '#1f2937' }}>
                {profile.phone || <span style={{ color: '#9ca3af' }}>Not provided</span>}
              </div>
            )}
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
              Address
            </label>
            {editMode ? (
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            ) : (
              <div style={{ padding: '0.5rem', color: '#1f2937' }}>
                {profile.address || <span style={{ color: '#9ca3af' }}>Not provided</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Community Information */}
      {currentCommunity && (
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
            Current Community
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                {currentCommunity.name}
              </div>
              {currentCommunity.description && (
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {currentCommunity.description}
                </div>
              )}
            </div>
            <span style={{
              backgroundColor: getRoleColor(currentCommunity.role),
              color: 'white',
              padding: '0.375rem 0.75rem',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              textTransform: 'uppercase'
            }}>
              {currentCommunity.role}
            </span>
          </div>
        </div>
      )}

      {/* Communities Summary */}
      {communitiesList.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
            Your Communities ({communitiesList.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {communitiesList.map((community) => (
              <button
                key={community.id}
                onClick={async () => {
                  if (community.id !== currentCommunity?.id) {
                    try {
                      await switchCommunity(community.id);
                    } catch (error: any) {
                      alert(error.message || 'Failed to switch community');
                    }
                  }
                }}
                disabled={community.id === currentCommunity?.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: community.id === currentCommunity?.id ? '#f0fdf4' : '#f9fafb',
                  border: community.id === currentCommunity?.id ? '2px solid #059669' : '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  transition: 'all 0.2s',
                  cursor: community.id === currentCommunity?.id ? 'default' : 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  if (community.id !== currentCommunity?.id) {
                    e.currentTarget.style.backgroundColor = '#e0f2fe';
                    e.currentTarget.style.borderColor = '#059669';
                  }
                }}
                onMouseLeave={(e) => {
                  if (community.id !== currentCommunity?.id) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
                      {community.name}
                    </span>
                    {community.id === currentCommunity?.id && (
                      <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '500' }}>
                        (Current)
                      </span>
                    )}
                  </div>
                  {community.description && (
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                      {community.description}
                    </div>
                  )}
                  {community.joinedAt && (
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      Joined: {new Date(community.joinedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <span style={{
                  backgroundColor: getRoleColor(community.role),
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  flexShrink: 0
                }}>
                  {community.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Account Information */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Account Information
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
              Current Role
            </label>
            <div style={{ padding: '0.5rem' }}>
              <span style={{
                backgroundColor: getRoleColor(currentCommunity?.role || profile.role),
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '500',
                textTransform: 'uppercase'
              }}>
                {currentCommunity?.role || profile.role}
              </span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
              Status
            </label>
            <div style={{ padding: '0.5rem' }}>
              <span style={{
                backgroundColor: profile.isActive ? '#059669' : '#dc2626',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>
                {profile.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
              Member Since
            </label>
            <div style={{ padding: '0.5rem', color: '#1f2937' }}>
              {new Date(profile.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
            Security
          </h2>
          {!showPasswordChange ? (
            <button
              onClick={() => setShowPasswordChange(true)}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Change Password
            </button>
          ) : (
            <button
              onClick={() => {
                setShowPasswordChange(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Cancel
            </button>
          )}
        </div>

        {showPasswordChange && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
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

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
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

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
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

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleChangePassword}
                disabled={saving}
                style={{
                  backgroundColor: saving ? '#9ca3af' : '#dc2626',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                {saving ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Email Notification Settings */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
          Email Notification Settings
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
          Choose which email notifications you'd like to receive. You can change these settings at any time.
        </p>

        {profile.role === 'resident' && (
          <>
            {/* Reservation Notifications */}
            <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
              <div
                onClick={() => setExpandedCategories({ ...expandedCategories, reservations: !expandedCategories.reservations })}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  cursor: 'pointer',
                  borderBottom: expandedCategories.reservations ? '1px solid #e5e7eb' : 'none'
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', margin: 0 }}>
                  Reservation Notifications
                </h3>
                <span style={{ fontSize: '1.25rem', color: '#6b7280' }}>
                  {expandedCategories.reservations ? '−' : '+'}
                </span>
              </div>
              {expandedCategories.reservations && (
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                      Reservation Created
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Receive confirmation when you create a reservation
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={notificationPreferences.reservationCreated ?? true}
                    onChange={(checked) => handleNotificationPreferenceChange('reservationCreated', checked)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                      Reservation Approved
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Receive confirmation when your reservation is fully approved
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={notificationPreferences.reservationApproved ?? true}
                    onChange={(checked) => handleNotificationPreferenceChange('reservationApproved', checked)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                      Reservation Rejected
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Receive notification if your reservation is rejected
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={notificationPreferences.reservationRejected ?? true}
                    onChange={(checked) => handleNotificationPreferenceChange('reservationRejected', checked)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                      Reservation Cancelled
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Receive confirmation when a reservation is cancelled
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={notificationPreferences.reservationCancelled ?? true}
                    onChange={(checked) => handleNotificationPreferenceChange('reservationCancelled', checked)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                      Reservation Completed
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Receive a thank you message after your reservation is completed
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={notificationPreferences.reservationCompleted ?? false}
                    onChange={(checked) => handleNotificationPreferenceChange('reservationCompleted', checked)}
                  />
                </div>
                </div>
              )}
            </div>

            {/* Modification Notifications */}
            <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
              <div
                onClick={() => setExpandedCategories({ ...expandedCategories, modifications: !expandedCategories.modifications })}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  cursor: 'pointer',
                  borderBottom: expandedCategories.modifications ? '1px solid #e5e7eb' : 'none'
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', margin: 0 }}>
                  Modification Notifications
                </h3>
                <span style={{ fontSize: '1.25rem', color: '#6b7280' }}>
                  {expandedCategories.modifications ? '−' : '+'}
                </span>
              </div>
              {expandedCategories.modifications && (
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                      Modification Proposed
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Receive notification when staff proposes a modification to your reservation
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={notificationPreferences.modificationProposed ?? true}
                    onChange={(checked) => handleNotificationPreferenceChange('modificationProposed', checked)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                      Modification Accepted
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Receive confirmation when you accept a proposed modification
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={notificationPreferences.modificationAccepted ?? true}
                    onChange={(checked) => handleNotificationPreferenceChange('modificationAccepted', checked)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                      Modification Rejected
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Receive confirmation when you reject a proposed modification
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={notificationPreferences.modificationRejected ?? true}
                    onChange={(checked) => handleNotificationPreferenceChange('modificationRejected', checked)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                      Reservation Modified
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Receive confirmation when you modify your own reservation
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={notificationPreferences.reservationModified ?? true}
                    onChange={(checked) => handleNotificationPreferenceChange('reservationModified', checked)}
                  />
                </div>
                </div>
              )}
            </div>

            {/* Reminder Notifications */}
            <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
              <div
                onClick={() => setExpandedCategories({ ...expandedCategories, reminders: !expandedCategories.reminders })}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  cursor: 'pointer',
                  borderBottom: expandedCategories.reminders ? '1px solid #e5e7eb' : 'none'
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', margin: 0 }}>
                  Reminder Notifications
                </h3>
                <span style={{ fontSize: '1.25rem', color: '#6b7280' }}>
                  {expandedCategories.reminders ? '−' : '+'}
                </span>
              </div>
              {expandedCategories.reminders && (
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                      Upcoming Reservation (24 hours)
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Receive a reminder 24 hours before your reservation
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={notificationPreferences.upcomingReservationReminder24h ?? true}
                    onChange={(checked) => handleNotificationPreferenceChange('upcomingReservationReminder24h', checked)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                      Upcoming Reservation (7 days)
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Receive a reminder 7 days before your reservation
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={notificationPreferences.upcomingReservationReminder7d ?? false}
                    onChange={(checked) => handleNotificationPreferenceChange('upcomingReservationReminder7d', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Damage Assessment */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                Damage Assessment
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                    Damage Assessment Reviewed
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Receive notification when a damage assessment is reviewed
                  </div>
                </div>
                <ToggleSwitch
                  checked={notificationPreferences.damageAssessmentReviewed ?? true}
                    onChange={(checked) => handleNotificationPreferenceChange('damageAssessmentReviewed', checked)}
                  />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {(profile.role === 'janitorial' || profile.role === 'admin') && (
          <>
            {/* Approval Workflow Notifications */}
            <div style={{ marginBottom: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
              <div
                onClick={() => setExpandedCategories({ ...expandedCategories, approvalWorkflow: !expandedCategories.approvalWorkflow })}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  cursor: 'pointer',
                  borderBottom: expandedCategories.approvalWorkflow ? '1px solid #e5e7eb' : 'none'
                }}
              >
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', margin: 0 }}>
                  Approval Workflow Notifications
                </h3>
                <span style={{ fontSize: '1.25rem', color: '#6b7280' }}>
                  {expandedCategories.approvalWorkflow ? '−' : '+'}
                </span>
              </div>
              {expandedCategories.approvalWorkflow && (
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                      New Reservation Requires Approval
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Receive notification when a new reservation requires your approval
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={notificationPreferences.newReservationRequiresApproval ?? true}
                    onChange={(checked) => handleNotificationPreferenceChange('newReservationRequiresApproval', checked)}
                  />
                </div>

                {profile.role === 'admin' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                        Reservation Pending Admin Approval
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Receive notification when a reservation is pending admin approval
                      </div>
                    </div>
                    <ToggleSwitch
                      checked={notificationPreferences.reservationPendingAdminApproval ?? true}
                      onChange={(checked) => handleNotificationPreferenceChange('reservationPendingAdminApproval', checked)}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                      Reservation Approved (Staff)
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Receive notification when a reservation you approved is fully approved
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={notificationPreferences.reservationApprovedStaff ?? false}
                    onChange={(checked) => handleNotificationPreferenceChange('reservationApprovedStaff', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Damage Assessment */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                Damage Assessment
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                    Damage Assessment Required
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Receive notification when a damage assessment is required
                  </div>
                </div>
                <ToggleSwitch
                  checked={notificationPreferences.damageAssessmentRequired ?? true}
                    onChange={(checked) => handleNotificationPreferenceChange('damageAssessmentRequired', checked)}
                  />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* System Notifications */}
        <div style={{ marginBottom: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', overflow: 'hidden' }}>
          <div
            onClick={() => setExpandedCategories({ ...expandedCategories, system: !expandedCategories.system })}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              cursor: 'pointer',
              borderBottom: expandedCategories.system ? '1px solid #e5e7eb' : 'none'
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', margin: 0 }}>
              System Notifications
            </h3>
            <span style={{ fontSize: '1.25rem', color: '#6b7280' }}>
              {expandedCategories.system ? '−' : '+'}
            </span>
          </div>
          {expandedCategories.system && (
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                  Account Activity
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Receive notifications for security-related account changes (password changes, etc.)
                </div>
              </div>
              <ToggleSwitch
                checked={notificationPreferences.accountActivity ?? true}
                onChange={(checked) => handleNotificationPreferenceChange('accountActivity', checked)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                  System Announcements
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Receive important system announcements and policy updates
                </div>
              </div>
              <ToggleSwitch
                checked={notificationPreferences.systemAnnouncements ?? true}
                onChange={(checked) => handleNotificationPreferenceChange('systemAnnouncements', checked)}
              />
            </div>
            </div>
          )}
        </div>

        {savingNotifications && (
          <div style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic', marginTop: '1rem' }}>
            Saving preferences...
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
