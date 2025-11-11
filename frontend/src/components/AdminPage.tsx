import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import SimpleTimeSelector from './SimpleTimeSelector';
import ToggleSwitch from './ToggleSwitch';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'resident' | 'janitorial' | 'admin';
  isActive: boolean;
  joinedAt?: string;
  createdAt?: string;
}

interface Amenity {
  id: number;
  name: string;
  description?: string;
  reservationFee: number | string;
  deposit: number | string;
  capacity: number;
  calendarGroup?: string | null;
  isPublic?: boolean;
  publicReservationFee?: number | string | null;
  publicDeposit?: number | string | null;
  daysOfOperation?: string | null;
  hoursOfOperation?: string | null;
  displayColor?: string;
  janitorialRequired?: boolean;
  approvalRequired?: boolean;
  cancellationFeeEnabled?: boolean;
  modificationFeeEnabled?: boolean;
  isActive: boolean;
}

interface AmenitiesManagementProps {
  currentCommunity: any;
  onError: (error: string | null) => void;
}

const AmenitiesManagement: React.FC<AmenitiesManagementProps> = ({ currentCommunity, onError }) => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
  const [autoApprovalNotification, setAutoApprovalNotification] = useState<string | null>(null);
  const [approvalChangeWarning, setApprovalChangeWarning] = useState<{
    show: boolean;
    message: string;
    originalJanitorial: boolean;
    originalAdmin: boolean;
    newJanitorial?: boolean;
    newAdmin?: boolean;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    reservationFee: '',
    deposit: '',
    capacity: '50',
    calendarGroup: '',
    newCalendarGroup: '',
    isPublic: false,
    publicReservationFee: '',
    publicDeposit: '',
    daysOfOperation: [] as string[],
    hoursOfOperation: { open: '09:00', close: '17:00', open24Hours: false },
    displayColor: '#355B45',
    janitorialRequired: true,
    approvalRequired: true,
    cancellationFeeEnabled: true,
    modificationFeeEnabled: true
  });

  useEffect(() => {
    fetchAmenities();
  }, [currentCommunity?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAmenities = async () => {
    if (!currentCommunity?.id) return;

    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      // Fetch all amenities (including inactive) for admin management
      const response = await axios.get(`${apiUrl}/api/amenities`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Also fetch inactive ones - we'll need to modify the backend to return all
      // For now, we'll use what we get
      setAmenities(response.data || []);
    } catch (error: any) {
      console.error('Error fetching amenities:', error);
      onError(error.response?.data?.message || 'Failed to fetch amenities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCommunity?.id) {
      onError('No community selected');
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      const payload: any = {
        name: formData.name,
        description: formData.description || null,
        reservationFee: formData.reservationFee === '' ? '0' : formData.reservationFee,
        deposit: formData.deposit === '' ? '0' : formData.deposit,
        capacity: parseInt(formData.capacity),
        calendarGroup: formData.calendarGroup === '__NEW__' 
          ? (formData.newCalendarGroup?.trim() || null)
          : (formData.calendarGroup.trim() || null),
        isPublic: formData.isPublic
      };

      // Only include public pricing if amenity is public
      if (formData.isPublic) {
        payload.publicReservationFee = formData.publicReservationFee === '' ? null : formData.publicReservationFee;
        payload.publicDeposit = formData.publicDeposit === '' ? null : formData.publicDeposit;
      } else {
        payload.publicReservationFee = null;
        payload.publicDeposit = null;
      }

      // Add operational fields
      payload.daysOfOperation = formData.daysOfOperation.length > 0 ? formData.daysOfOperation : null;
      payload.hoursOfOperation = formData.hoursOfOperation.open24Hours ? { open24Hours: true } : { open: formData.hoursOfOperation.open, close: formData.hoursOfOperation.close };
      payload.displayColor = formData.displayColor;
      payload.janitorialRequired = formData.janitorialRequired;
      payload.approvalRequired = formData.approvalRequired;

      let response;
      if (editingAmenity) {
        // Update existing
        response = await axios.put(`${apiUrl}/api/amenities/${editingAmenity.id}`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Check if any reservations were auto-approved or moved to unconfirmed
        if (response.data.autoApprovedCount > 0 && response.data.autoApprovedMessage) {
          let message = response.data.autoApprovedMessage;
          if (response.data.unconfirmedCount > 0 && response.data.unconfirmedMessage) {
            message += '\n\n' + response.data.unconfirmedMessage;
          }
          setAutoApprovalNotification(message);
        } else if (response.data.unconfirmedCount > 0 && response.data.unconfirmedMessage) {
          setAutoApprovalNotification(response.data.unconfirmedMessage);
        }
      } else {
        // Create new
        response = await axios.post(`${apiUrl}/api/amenities`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      // Don't close modal if there's an auto-approval notification - let user see it and manually close
      if (response.data?.autoApprovedCount > 0 && response.data?.autoApprovedMessage) {
        // Keep modal open to show notification
      } else {
        setShowModal(false);
        setEditingAmenity(null);
      }
      setFormData({
        name: '',
        description: '',
        reservationFee: '',
        deposit: '',
        capacity: '50',
        calendarGroup: '',
        newCalendarGroup: '',
        isPublic: false,
        publicReservationFee: '',
        publicDeposit: '',
        daysOfOperation: [],
        hoursOfOperation: { open: '09:00', close: '17:00', open24Hours: false },
        displayColor: '#355B45',
        janitorialRequired: true,
        approvalRequired: true,
        cancellationFeeEnabled: true,
        modificationFeeEnabled: true
      });
      fetchAmenities();
    } catch (error: any) {
      console.error('Error saving amenity:', error);
      onError(error.response?.data?.message || 'Failed to save amenity');
    }
  };

  const handleEdit = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    
    // Parse days of operation
    let daysOfOp: string[] = [];
    if (amenity.daysOfOperation) {
      try {
        daysOfOp = typeof amenity.daysOfOperation === 'string' ? JSON.parse(amenity.daysOfOperation) : amenity.daysOfOperation;
      } catch (e) {
        daysOfOp = [];
      }
    }
    
    // Parse hours of operation
    let hoursOfOp = { open: '09:00', close: '17:00', open24Hours: false };
    if (amenity.hoursOfOperation) {
      try {
        const parsed = typeof amenity.hoursOfOperation === 'string' ? JSON.parse(amenity.hoursOfOperation) : amenity.hoursOfOperation;
        if (parsed.open24Hours) {
          hoursOfOp = { open: '00:00', close: '23:59', open24Hours: true };
        } else {
          hoursOfOp = { open: parsed.open || '09:00', close: parsed.close || '17:00', open24Hours: false };
        }
      } catch (e) {
        // Use defaults
      }
    }
    
    setFormData({
      name: amenity.name,
      description: amenity.description || '',
      reservationFee: String(amenity.reservationFee),
      deposit: String(amenity.deposit),
      capacity: String(amenity.capacity),
      calendarGroup: amenity.calendarGroup || '',
      newCalendarGroup: '',
      isPublic: amenity.isPublic || false,
      publicReservationFee: amenity.publicReservationFee !== null && amenity.publicReservationFee !== undefined ? String(amenity.publicReservationFee) : '',
      publicDeposit: amenity.publicDeposit !== null && amenity.publicDeposit !== undefined ? String(amenity.publicDeposit) : '',
      daysOfOperation: daysOfOp,
      hoursOfOperation: hoursOfOp,
      displayColor: amenity.displayColor || '#355B45',
      janitorialRequired: amenity.janitorialRequired !== undefined ? amenity.janitorialRequired : true,
      approvalRequired: amenity.approvalRequired !== undefined ? amenity.approvalRequired : true,
      cancellationFeeEnabled: amenity.cancellationFeeEnabled !== undefined ? amenity.cancellationFeeEnabled : true,
      modificationFeeEnabled: amenity.modificationFeeEnabled !== undefined ? amenity.modificationFeeEnabled : true
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this amenity? This will deactivate it.')) {
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      await axios.delete(`${apiUrl}/api/amenities/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      fetchAmenities();
    } catch (error: any) {
      console.error('Error deleting amenity:', error);
      onError(error.response?.data?.message || 'Failed to delete amenity');
    }
  };

  const handleCreateNew = () => {
    setEditingAmenity(null);
    setFormData({
      name: '',
      description: '',
      reservationFee: '',
      deposit: '',
      capacity: '50',
      calendarGroup: '',
      newCalendarGroup: '',
      isPublic: false,
      publicReservationFee: '',
      publicDeposit: '',
      daysOfOperation: [],
      hoursOfOperation: { open: '09:00', close: '17:00', open24Hours: false },
      displayColor: '#355B45',
      janitorialRequired: true,
      approvalRequired: true,
      cancellationFeeEnabled: true,
      modificationFeeEnabled: true
    });
    setShowModal(true);
  };

  // Get unique calendar groups
  const calendarGroups = Array.from(new Set(amenities.map(a => a.calendarGroup).filter(Boolean))) as string[];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading amenities...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1f2937' }}>Amenities Management</h2>
        <button
          onClick={handleCreateNew}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#355B45',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          + Create Amenity
        </button>
      </div>

      {/* Calendar Groups Summary */}
      {calendarGroups.length > 0 && (
        <div style={{
          backgroundColor: '#f0f9f4',
          border: '1px solid #355B45',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#1f2937' }}>Calendar Groups:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {calendarGroups.map(group => (
              <span key={group} style={{
                backgroundColor: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                color: '#355B45',
                border: '1px solid #355B45'
              }}>
                {group}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Amenities List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {amenities.map((amenity) => (
          <div
            key={amenity.id}
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              opacity: amenity.isActive ? 1 : 0.6
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                    {amenity.name}
                  </h3>
                  {!amenity.isActive && (
                    <span style={{
                      backgroundColor: '#6b7280',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}>
                      Inactive
                    </span>
                  )}
                  {amenity.calendarGroup && (
                    <span style={{
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}>
                      {amenity.calendarGroup}
                    </span>
                  )}
                  {amenity.displayColor && (
                    <span style={{
                      backgroundColor: amenity.displayColor,
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      display: 'inline-block',
                      border: '1px solid #d1d5db',
                      marginLeft: '0.5rem'
                    }} title={`Color: ${amenity.displayColor}`} />
                  )}
                  {amenity.janitorialRequired !== false && (
                    <span style={{
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      marginLeft: '0.5rem'
                    }}>
                      Janitorial Required
                    </span>
                  )}
                </div>
                {amenity.description && (
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    {amenity.description}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  <div>💰 Reservation Fee: ${parseFloat(String(amenity.reservationFee)).toFixed(2)}</div>
                  <div>💵 Deposit: ${parseFloat(String(amenity.deposit)).toFixed(2)}</div>
                  <div>👥 Capacity: {amenity.capacity}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleEdit(amenity)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#355B45',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(amenity.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {amenities.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏊</div>
          <div>No amenities configured yet.</div>
          <button
            onClick={handleCreateNew}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#355B45',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Create First Amenity
          </button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
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
            borderRadius: '0.5rem',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem', color: '#1f2937' }}>
              {editingAmenity ? 'Edit Amenity' : 'Create Amenity'}
            </h2>
            
            {/* Auto-approval notification (after save) */}
            {autoApprovalNotification && (
              <div style={{
                backgroundColor: '#fef3c7',
                border: '2px solid #f59e0b',
                color: '#92400e',
                padding: '1rem',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '1rem'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>⚠️</span>
                    <strong style={{ fontSize: '1rem' }}>Auto-Approval Notice</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.875rem' }}>
                    {autoApprovalNotification}
                  </p>
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', fontStyle: 'italic' }}>
                    Note: Any outstanding non-approved reservations are automatically approved when approval requirements are removed from an amenity.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setAutoApprovalNotification(null);
                    setShowModal(false);
                    setEditingAmenity(null);
                    fetchAmenities(); // Refresh the list
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#355B45',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Acknowledge & Close
                </button>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontFamily: 'Inter, sans-serif'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                    Reservation Fee ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.reservationFee}
                    onChange={(e) => setFormData({ ...formData, reservationFee: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                    Deposit ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                  Capacity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                  Calendar Group
                </label>
                {formData.calendarGroup === '__NEW__' ? (
                  <>
                    <input
                      type="text"
                      value={formData.newCalendarGroup || ''}
                      onChange={(e) => setFormData({ ...formData, newCalendarGroup: e.target.value })}
                      placeholder="Enter new calendar group name"
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontSize: '1rem',
                        marginBottom: '0.5rem'
                      }}
                      autoFocus
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.newCalendarGroup && formData.newCalendarGroup.trim()) {
                            const newGroupName = formData.newCalendarGroup.trim();
                            // Set calendarGroup to the new name (not __NEW__) so it persists
                            setFormData({ ...formData, calendarGroup: newGroupName, newCalendarGroup: '' });
                          } else {
                            setFormData({ ...formData, calendarGroup: '', newCalendarGroup: '' });
                          }
                        }}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}
                      >
                        Use This Name
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, calendarGroup: '', newCalendarGroup: '' })}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <select
                    value={formData.calendarGroup === '__NEW__' ? '__NEW__' : (formData.calendarGroup || '')}
                    onChange={(e) => {
                      if (e.target.value === '__NEW__') {
                        setFormData({ ...formData, calendarGroup: '__NEW__', newCalendarGroup: '' });
                      } else {
                        setFormData({ ...formData, calendarGroup: e.target.value || '' });
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Default Calendar (no group)</option>
                    {Array.from(new Set(amenities.map(a => a.calendarGroup).filter(Boolean))).map(group => (
                      <option key={group as string} value={group as string}>{group}</option>
                    ))}
                    {/* Show the new calendar group name if it's not in the list yet but is set in formData */}
                    {formData.calendarGroup && 
                     formData.calendarGroup !== '__NEW__' && 
                     !amenities.some(a => a.calendarGroup === formData.calendarGroup) && (
                      <option value={formData.calendarGroup}>{formData.calendarGroup}</option>
                    )}
                    <option value="__NEW__" style={{ fontWeight: 'bold', borderTop: '1px solid #d1d5db', paddingTop: '0.5rem' }}>
                      + ADD NEW
                    </option>
                  </select>
                )}
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  Amenities with the same calendar group will appear on the same calendar view. Leave empty for default calendar.
                </p>
              </div>

              <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f0f9f4', border: '1px solid #355B45', borderRadius: '0.375rem' }}>
                <div style={{ marginBottom: formData.isPublic ? '1rem' : '0' }}>
                  <ToggleSwitch
                    checked={formData.isPublic}
                    onChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                    label="Public Amenity (bookable by non-community members)"
                  />
                </div>
                {formData.isPublic && (
                  <div style={{ marginTop: '1rem', paddingLeft: '1.75rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                      Set different pricing for public users. Leave empty to use the same prices as residents.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
                          Public Reservation Fee ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.publicReservationFee}
                          onChange={(e) => setFormData({ ...formData, publicReservationFee: e.target.value })}
                          placeholder="Same as resident fee"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151', fontSize: '0.875rem' }}>
                          Public Deposit ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.publicDeposit}
                          onChange={(e) => setFormData({ ...formData, publicDeposit: e.target.value })}
                          placeholder="Same as resident deposit"
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Days of Operation */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                  Days of Operation
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <label key={day} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.daysOfOperation.includes(day)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, daysOfOperation: [...formData.daysOfOperation, day] });
                          } else {
                            setFormData({ ...formData, daysOfOperation: formData.daysOfOperation.filter(d => d !== day) });
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.875rem', textTransform: 'capitalize' }}>{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Hours of Operation */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                  Hours of Operation
                </label>
                <div style={{ marginBottom: '0.5rem' }}>
                  <ToggleSwitch
                    checked={formData.hoursOfOperation.open24Hours}
                    onChange={(checked) => setFormData({
                      ...formData,
                      hoursOfOperation: { ...formData.hoursOfOperation, open24Hours: checked }
                    })}
                    label="Open 24 Hours"
                  />
                </div>
                {!formData.hoursOfOperation.open24Hours && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <SimpleTimeSelector
                        label="Open Time"
                        value={formData.hoursOfOperation.open}
                        onChange={(time) => setFormData({
                          ...formData,
                          hoursOfOperation: { ...formData.hoursOfOperation, open: time }
                        })}
                      />
                    </div>
                    <div>
                      <SimpleTimeSelector
                        label="Close Time"
                        value={formData.hoursOfOperation.close}
                        onChange={(time) => setFormData({
                          ...formData,
                          hoursOfOperation: { ...formData.hoursOfOperation, close: time }
                        })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Display Color */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>
                  Display Color
                </label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={formData.displayColor}
                    onChange={(e) => setFormData({ ...formData, displayColor: e.target.value })}
                    style={{
                      width: '60px',
                      height: '40px',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    value={formData.displayColor}
                    onChange={(e) => setFormData({ ...formData, displayColor: e.target.value })}
                    placeholder="#355B45"
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  This color will be used to display reservations on the calendar
                </p>
              </div>

              {/* Approval Requirements */}
              <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <ToggleSwitch
                      checked={formData.janitorialRequired}
                      onChange={(newValue) => {
                        const oldValue = editingAmenity?.janitorialRequired ?? formData.janitorialRequired;
                        
                        // If changing janitorial requirement, show warning
                        if (editingAmenity && newValue !== oldValue) {
                          if (!newValue && oldValue) {
                            // Unchecking - will auto-approve
                            setApprovalChangeWarning({
                              show: true,
                              message: 'Removing janitorial approval requirement will auto-approve all NEW reservations for this amenity.',
                              originalJanitorial: oldValue,
                              originalAdmin: formData.approvalRequired,
                              newJanitorial: newValue
                            });
                          } else if (newValue && !oldValue) {
                            // Checking - will move to unconfirmed
                            setApprovalChangeWarning({
                              show: true,
                              message: 'Enabling janitorial approval requirement will move all FULLY_APPROVED reservations to NEW (requiring approval).',
                              originalJanitorial: oldValue,
                              originalAdmin: formData.approvalRequired,
                              newJanitorial: newValue
                            });
                          }
                        } else {
                          setFormData({ ...formData, janitorialRequired: newValue });
                        }
                      }}
                      label="Janitorial Approval Required"
                    />
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', marginLeft: '3rem' }}>
                    If enabled, reservations will require janitorial approval before being confirmed.
                  </p>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <ToggleSwitch
                      checked={formData.approvalRequired}
                      onChange={(newValue) => {
                        const oldValue = editingAmenity?.approvalRequired ?? formData.approvalRequired;
                        
                        // If changing admin approval requirement, show warning
                        if (editingAmenity && newValue !== oldValue) {
                          if (!newValue && oldValue) {
                            // Unchecking - will auto-approve
                            setApprovalChangeWarning({
                              show: true,
                              message: 'Removing admin approval requirement will auto-approve all JANITORIAL_APPROVED reservations for this amenity.',
                              originalJanitorial: formData.janitorialRequired,
                              originalAdmin: oldValue,
                              newAdmin: newValue
                            });
                          } else if (newValue && !oldValue) {
                            // Checking - will move to unconfirmed
                            setApprovalChangeWarning({
                              show: true,
                              message: 'Enabling admin approval requirement will move all FULLY_APPROVED reservations to unconfirmed status (requiring approval).',
                              originalJanitorial: formData.janitorialRequired,
                              originalAdmin: oldValue,
                              newAdmin: newValue
                            });
                          }
                        } else {
                          setFormData({ ...formData, approvalRequired: newValue });
                        }
                      }}
                      label="Admin Approval Required"
                    />
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', marginLeft: '3rem' }}>
                    If enabled, reservations will require admin approval after janitorial approval.
                  </p>
                </div>
              </div>

              {/* Approval change warning (before save) - appears directly below Approval Requirements */}
              {approvalChangeWarning && approvalChangeWarning.show && (
                <div style={{
                  backgroundColor: '#fef3c7',
                  border: '2px solid #f59e0b',
                  color: '#92400e',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>⚠️</span>
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '1rem', display: 'block', marginBottom: '0.5rem' }}>Approval Requirement Change</strong>
                      <p style={{ margin: 0, fontSize: '0.875rem' }}>
                        {approvalChangeWarning.message}
                      </p>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', fontStyle: 'italic' }}>
                        {approvalChangeWarning.message.includes('Removing') 
                          ? 'Note: Any outstanding non-approved reservations will be automatically approved when approval requirements are removed.'
                          : 'Note: Any fully approved reservations will be moved to unconfirmed status when approval requirements are enabled.'}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => {
                        // Revert to original values
                        setFormData({
                          ...formData,
                          janitorialRequired: approvalChangeWarning.originalJanitorial,
                          approvalRequired: approvalChangeWarning.originalAdmin
                        });
                        setApprovalChangeWarning(null);
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Revert Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // Proceed with changes - apply the pending change
                        if (approvalChangeWarning) {
                          setFormData({
                            ...formData,
                            janitorialRequired: approvalChangeWarning.newJanitorial !== undefined 
                              ? approvalChangeWarning.newJanitorial 
                              : formData.janitorialRequired,
                            approvalRequired: approvalChangeWarning.newAdmin !== undefined 
                              ? approvalChangeWarning.newAdmin 
                              : formData.approvalRequired
                          });
                        }
                        setApprovalChangeWarning(null);
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#355B45',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Proceed
                    </button>
                  </div>
                </div>
              )}

              {/* Fee Structure Configuration */}
              {(formData.cancellationFeeEnabled || formData.modificationFeeEnabled || editingAmenity) && (
                <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f0f9ff', border: '1px solid #3b82f6', borderRadius: '0.375rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e40af', marginBottom: '1rem' }}>
                    Fee Structure Configuration
                  </h3>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <ToggleSwitch
                      checked={formData.cancellationFeeEnabled}
                      onChange={(checked) => setFormData({ ...formData, cancellationFeeEnabled: checked })}
                      label="Enable Cancellation Fees"
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <ToggleSwitch
                      checked={formData.modificationFeeEnabled}
                      onChange={(checked) => setFormData({ ...formData, modificationFeeEnabled: checked })}
                      label="Enable Modification Fees"
                    />
                  </div>

                  {formData.cancellationFeeEnabled && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'white', borderRadius: '0.375rem', border: '1px solid #e5e7eb' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: '#374151' }}>
                      Cancellation Fee Structure:
                    </h4>
                    <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <th style={{ textAlign: 'left', padding: '0.5rem', color: '#6b7280', fontWeight: 500 }}>Action</th>
                          <th style={{ textAlign: 'left', padding: '0.5rem', color: '#6b7280', fontWeight: 500 }}>Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: '0.5rem', color: '#374151' }}>Cancel &gt;14 days</td>
                          <td style={{ padding: '0.5rem', color: '#374151' }}>Full refund</td>
                        </tr>
                        <tr style={{ backgroundColor: '#f9fafb' }}>
                          <td style={{ padding: '0.5rem', color: '#374151' }}>Cancel 7–14 days</td>
                          <td style={{ padding: '0.5rem', color: '#374151' }}>$50 admin fee</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '0.5rem', color: '#374151' }}>Cancel &lt;7 days</td>
                          <td style={{ padding: '0.5rem', color: '#374151' }}>Full rental fee / deposit forfeited</td>
                        </tr>
                        <tr style={{ backgroundColor: '#f9fafb' }}>
                          <td style={{ padding: '0.5rem', color: '#374151' }}>No-show</td>
                          <td style={{ padding: '0.5rem', color: '#374151' }}>Full rental fee</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
                
                {formData.modificationFeeEnabled && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'white', borderRadius: '0.375rem', border: '1px solid #e5e7eb' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', color: '#374151' }}>
                      Modification Fee Structure:
                    </h4>
                    <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <th style={{ textAlign: 'left', padding: '0.5rem', color: '#6b7280', fontWeight: 500 }}>Action</th>
                          <th style={{ textAlign: 'left', padding: '0.5rem', color: '#6b7280', fontWeight: 500 }}>Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: '0.5rem', color: '#374151' }}>One date/time change &gt;7 days</td>
                          <td style={{ padding: '0.5rem', color: '#374151' }}>No charge</td>
                        </tr>
                        <tr style={{ backgroundColor: '#f9fafb' }}>
                          <td style={{ padding: '0.5rem', color: '#374151' }}>Additional change</td>
                          <td style={{ padding: '0.5rem', color: '#374151' }}>$25 each</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
                
                  {!formData.cancellationFeeEnabled && !formData.modificationFeeEnabled && (
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.375rem', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, fontStyle: 'italic' }}>
                        Fee structures are disabled. Enable cancellation or modification fees above to configure fee structures.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAmenity(null);
                  }}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#355B45',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {editingAmenity ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminPage: React.FC = () => {
  const { user, currentCommunity } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'resident' | 'janitorial' | 'admin'>('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'users' | 'damage-reviews' | 'amenities'>('users');
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
    } else if (activeTab === 'damage-reviews') {
      fetchDamageReviews();
    }
    // amenities tab will fetch its own data
  }, [activeTab, currentCommunity?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUsers = async () => {
    if (!currentCommunity?.id) {
      setError('No community selected');
      return;
    }

    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      // Fetch users for the current community only
      const response = await axios.get(`${apiUrl}/api/communities/${currentCommunity.id}/users`, {
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
    if (!currentCommunity?.id) {
      setError('No community selected');
      return;
    }

    try {
      setActionLoading(userId);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      // Update role in the current community
      await axios.put(`${apiUrl}/api/communities/${currentCommunity.id}/users/${userId}/role`, {
        role: newRole
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Refresh users list
      await fetchUsers();
    } catch (error: any) {
      console.error('❌ Error updating user role:', error);
      setError(error.response?.data?.message || 'Failed to update user role');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleUserStatus = async (userId: number, isActive: boolean) => {
    if (!currentCommunity?.id) {
      setError('No community selected');
      return;
    }

    try {
      setActionLoading(userId);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      // Update status in the current community
      await axios.put(`${apiUrl}/api/communities/${currentCommunity.id}/users/${userId}/status`, {
        isActive: !isActive
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Refresh users list
      await fetchUsers();
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
      
      await axios.put(
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
        <div style={{ marginBottom: '0.5rem' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Admin Dashboard
          </h1>
          {currentCommunity && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>
                Community:
              </span>
              <span style={{ 
                fontSize: '0.875rem', 
                color: '#355B45', 
                fontWeight: '600',
                backgroundColor: '#f0f9f4',
                padding: '0.25rem 0.75rem',
                borderRadius: '0.375rem',
                border: '1px solid #d1fae5'
              }}>
                {currentCommunity.name}
              </span>
              {currentCommunity.accessCode && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#fef3c7',
                  border: '2px solid #f59e0b',
                  borderRadius: '0.5rem',
                  padding: '0.5rem 1rem',
                  marginTop: '0.5rem'
                }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#92400e' }}>
                    Community Access Code:
                  </span>
                  <span style={{
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: '#78350f',
                    fontFamily: 'monospace',
                    letterSpacing: '0.1em',
                    backgroundColor: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.25rem',
                    border: '1px solid #f59e0b'
                  }}>
                    {currentCommunity.accessCode}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
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
          onClick={() => setActiveTab('amenities')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: activeTab === 'amenities' ? '#355B45' : 'transparent',
            color: activeTab === 'amenities' ? 'white' : '#6b7280',
            border: 'none',
            borderBottom: activeTab === 'amenities' ? '2px solid #355B45' : '2px solid transparent',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: activeTab === 'amenities' ? '600' : '400',
            fontFamily: 'Inter, sans-serif',
            marginBottom: '-2px'
          }}
        >
          Amenities
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

      {/* Amenities Tab Content */}
      {activeTab === 'amenities' && (
        <AmenitiesManagement 
          currentCommunity={currentCommunity}
          onError={setError}
        />
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
                  {userData.createdAt && <div>📅 Joined: {new Date(userData.createdAt).toLocaleDateString()}</div>}
                  {userData.joinedAt && <div>📅 Joined Community: {new Date(userData.joinedAt).toLocaleDateString()}</div>}
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
