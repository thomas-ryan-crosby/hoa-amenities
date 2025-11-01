import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'resident' | 'janitorial' | 'admin';
  isActive: boolean;
  createdAt: string;
}

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'resident' | 'janitorial' | 'admin'>('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'damage-reviews'>('users');
  const [damageReviews, setDamageReviews] = useState<any[]>([]);
  const [damageReviewsLoading, setDamageReviewsLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'adjust' | 'deny'>('approve');
  const [adjustedAmount, setAdjustedAmount] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchDamageReviews();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${apiUrl}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setUsers(response.data.users);
    } catch (error: any) {
      console.error('❌ Error fetching users:', error);
      setError(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      setActionLoading(userId);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.put(`${apiUrl}/api/admin/users/${userId}/role`, {
        role: newRole
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole as any } : u
      ));
    } catch (error: any) {
      console.error('❌ Error updating user role:', error);
      setError(error.response?.data?.message || 'Failed to update user role');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleUserStatus = async (userId: number, isActive: boolean) => {
    try {
      setActionLoading(userId);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.put(`${apiUrl}/api/admin/users/${userId}/status`, {
        isActive: !isActive
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, isActive: !isActive } : u
      ));
    } catch (error: any) {
      console.error('❌ Error updating user status:', error);
      setError(error.response?.data?.message || 'Failed to update user status');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = filter === 'all' 
    ? users 
    : users.filter(u => u.role === filter);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#dc2626';
      case 'janitorial': return '#355B45';
      case 'resident': return '#059669';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? '#059669' : '#dc2626';
  };

  const fetchDamageReviews = async () => {
    try {
      setDamageReviewsLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${apiUrl}/api/reservations/admin/damage-reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setDamageReviews(response.data.reservations || []);
    } catch (error: any) {
      console.error('❌ Error fetching damage reviews:', error);
      setError(error.response?.data?.message || 'Failed to fetch damage reviews');
    } finally {
      setDamageReviewsLoading(false);
    }
  };

  const handleReviewDamageAssessment = async () => {
    if (!selectedReview) return;

    // Validate if adjusting
    if (reviewAction === 'adjust') {
      if (!adjustedAmount || parseFloat(adjustedAmount) <= 0) {
        setError('Adjusted amount must be greater than 0');
        return;
      }
    }

    try {
      setActionLoading(selectedReview.id);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `${apiUrl}/api/reservations/${selectedReview.id}/review-damage-assessment`,
        {
          action: reviewAction,
          amount: reviewAction === 'adjust' ? parseFloat(adjustedAmount) : undefined,
          adminNotes: adminNotes.trim() || undefined
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Close modal and refresh
      setShowReviewModal(false);
      setSelectedReview(null);
      setReviewAction('approve');
      setAdjustedAmount('');
      setAdminNotes('');
      fetchDamageReviews();
    } catch (error: any) {
      console.error('❌ Error reviewing damage assessment:', error);
      setError(error.response?.data?.message || 'Failed to review damage assessment');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#6b7280' }}>Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#6b7280' }}>
          Manage users and review damage assessments
        </p>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '2rem',
        borderBottom: '2px solid #e5e7eb'
      }}>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: activeTab === 'users' ? '#355B45' : 'transparent',
            color: activeTab === 'users' ? 'white' : '#6b7280',
            border: 'none',
            borderBottom: activeTab === 'users' ? '2px solid #355B45' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: activeTab === 'users' ? '600' : '400',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '-2px'
          }}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('damage-reviews')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: activeTab === 'damage-reviews' ? '#355B45' : 'transparent',
            color: activeTab === 'damage-reviews' ? 'white' : '#6b7280',
            border: 'none',
            borderBottom: activeTab === 'damage-reviews' ? '2px solid #355B45' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: activeTab === 'damage-reviews' ? '600' : '400',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '-2px',
            position: 'relative'
          }}
        >
          Damage Reviews
          {damageReviews.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              {damageReviews.length}
            </span>
          )}
        </button>
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

      {/* Users Tab Content */}
      {activeTab === 'users' && (
        <>
          {/* Filter Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            marginBottom: '1.5rem',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '1rem'
          }}>
            {(['all', 'resident', 'janitorial', 'admin'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            style={{
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '0.375rem',
              backgroundColor: filter === filterType ? '#355B45' : '#f3f4f6',
              color: filter === filterType ? 'white' : '#374151',
              fontFamily: 'Inter, sans-serif',
              fontWeight: filter === filterType ? 600 : 400,
              cursor: 'pointer',
              fontSize: '0.875rem',
              textTransform: 'capitalize'
            }}
          >
            {filterType} ({filterType === 'all' ? users.length : users.filter(u => u.role === filterType).length})
          </button>
        ))}
      </div>

      {/* Users List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredUsers.map((userData) => (
          <div
            key={userData.id}
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    {userData.firstName} {userData.lastName}
                  </h3>
                  <span style={{
                    backgroundColor: getRoleColor(userData.role),
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    textTransform: 'uppercase'
                  }}>
                    {userData.role}
                  </span>
                  <span style={{
                    backgroundColor: getStatusColor(userData.isActive),
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {userData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  <div>📧 {userData.email}</div>
                  {userData.phone && <div>📞 {userData.phone}</div>}
                  {userData.address && <div>🏠 {userData.address}</div>}
                  <div>📅 Joined: {new Date(userData.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px' }}>
                {/* Role Selection */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '0.75rem', 
                    fontWeight: '500', 
                    color: '#374151',
                    marginBottom: '0.25rem'
                  }}>
                    Role
                  </label>
                  <select
                    value={userData.role}
                    onChange={(e) => updateUserRole(userData.id, e.target.value)}
                    disabled={actionLoading === userData.id || userData.id === user?.id}
                    style={{
                      width: '100%',
                      padding: '0.375rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.25rem',
                      fontSize: '0.875rem',
                      backgroundColor: userData.id === user?.id ? '#f9fafb' : 'white'
                    }}
                  >
                    <option value="resident">Resident</option>
                    <option value="janitorial">Janitorial</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Status Toggle */}
                <button
                  onClick={() => toggleUserStatus(userData.id, userData.isActive)}
                  disabled={actionLoading === userData.id || userData.id === user?.id}
                  style={{
                    padding: '0.375rem 0.75rem',
                    border: 'none',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: userData.id === user?.id ? 'not-allowed' : 'pointer',
                    backgroundColor: userData.isActive ? '#dc2626' : '#059669',
                    color: 'white',
                    opacity: userData.id === user?.id ? 0.5 : 1
                  }}
                >
                  {actionLoading === userData.id ? 'Updating...' : 
                   userData.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👥</div>
          <div>No users found for the selected filter.</div>
        </div>
      )}
        </>
      )}

      {/* Damage Reviews Tab Content */}
      {activeTab === 'damage-reviews' && (
        <>
          {damageReviewsLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '1.5rem', color: '#6b7280' }}>Loading damage reviews...</div>
            </div>
          ) : damageReviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                No Pending Damage Reviews
              </div>
              <p style={{ color: '#9ca3af' }}>All damage assessments have been reviewed.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {damageReviews.map((review: any) => (
                <div
                  key={review.id}
                  style={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: '#1f2937' }}>
                        {review.amenity?.name || 'Unknown Amenity'} - {review.user?.firstName} {review.user?.lastName}
                      </h3>
                      <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                        Date: {new Date(review.date).toLocaleDateString()}
                        {review.damageAssessedAt && (
                          <> | Assessed: {new Date(review.damageAssessedAt).toLocaleDateString()}</>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedReview(review);
                        setReviewAction('approve');
                        setAdjustedAmount(String(review.damageChargeAmount || ''));
                        setAdminNotes('');
                        setShowReviewModal(true);
                      }}
                      style={{
                        backgroundColor: '#355B45',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Review Assessment
                    </button>
                  </div>

                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                      <strong>Assessed Amount:</strong> ${parseFloat(String(review.damageChargeAmount || 0)).toFixed(2)}
                    </p>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#6b7280' }}>
                      <strong>Max Damage Fee:</strong> ${parseFloat(String(review.amenity?.deposit || review.totalDeposit)).toFixed(2)}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
                      <strong>Description:</strong> {review.damageDescription || 'No description'}
                    </p>
                    {review.damageNotes && (
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
                        <strong>Notes:</strong> {review.damageNotes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedReview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>
              Review Damage Assessment
            </h2>
            
            <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
              <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                <strong>Reservation:</strong> {selectedReview.amenity?.name} - {selectedReview.user?.firstName} {selectedReview.user?.lastName}
              </p>
              <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                <strong>Date:</strong> {new Date(selectedReview.date).toLocaleDateString()}
              </p>
              <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                <strong>Assessed Amount:</strong> ${parseFloat(String(selectedReview.damageChargeAmount || 0)).toFixed(2)}
              </p>
              <p style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>
                <strong>Max Damage Fee:</strong> ${parseFloat(String(selectedReview.amenity?.deposit || selectedReview.totalDeposit)).toFixed(2)}
              </p>
              <p style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>
                <strong>Description:</strong> {selectedReview.damageDescription}
              </p>
              {selectedReview.damageNotes && (
                <p style={{ margin: '0.5rem 0 0 0', color: '#6b7280' }}>
                  <strong>Notes:</strong> {selectedReview.damageNotes}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                Action
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setReviewAction('approve')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '2px solid',
                    borderColor: reviewAction === 'approve' ? '#10b981' : '#d1d5db',
                    backgroundColor: reviewAction === 'approve' ? '#d1fae5' : 'white',
                    color: reviewAction === 'approve' ? '#059669' : '#374151',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: reviewAction === 'approve' ? '600' : '400'
                  }}
                >
                  Approve as-is
                </button>
                <button
                  onClick={() => setReviewAction('adjust')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '2px solid',
                    borderColor: reviewAction === 'adjust' ? '#f59e0b' : '#d1d5db',
                    backgroundColor: reviewAction === 'adjust' ? '#fef3c7' : 'white',
                    color: reviewAction === 'adjust' ? '#d97706' : '#374151',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: reviewAction === 'adjust' ? '600' : '400'
                  }}
                >
                  Adjust Amount
                </button>
                <button
                  onClick={() => setReviewAction('deny')}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '4px',
                    border: '2px solid',
                    borderColor: reviewAction === 'deny' ? '#ef4444' : '#d1d5db',
                    backgroundColor: reviewAction === 'deny' ? '#fee2e2' : 'white',
                    color: reviewAction === 'deny' ? '#dc2626' : '#374151',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: reviewAction === 'deny' ? '600' : '400'
                  }}
                >
                  Deny
                </button>
              </div>
            </div>

            {reviewAction === 'adjust' && (
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                  Adjusted Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={parseFloat(String(selectedReview.amenity?.deposit || selectedReview.totalDeposit))}
                  value={adjustedAmount}
                  onChange={(e) => setAdjustedAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                Admin Notes (Optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Add notes about your decision..."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleReviewDamageAssessment}
                disabled={actionLoading === selectedReview.id}
                style={{
                  flex: 1,
                  backgroundColor: actionLoading === selectedReview.id ? '#9ca3af' : '#355B45',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: actionLoading === selectedReview.id ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {actionLoading === selectedReview.id ? 'Processing...' : 'Submit Review'}
              </button>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedReview(null);
                  setReviewAction('approve');
                  setAdjustedAmount('');
                  setAdminNotes('');
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
