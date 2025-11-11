import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ReservationModal from './ReservationModal';
import ModifyReservationModal from './ModifyReservationModal';
import CancelReservationModal from './CancelReservationModal';
import { useMobile } from '../hooks/useMobile';
import { formatDate, formatTimeRange } from '../utils/dateTimeUtils';

interface Reservation {
  id: number;
  date: string;
  setupTimeStart: string;
  setupTimeEnd: string;
  partyTimeStart: string;
  partyTimeEnd: string;
  guestCount: number;
  specialRequirements?: string;
  status: 'NEW' | 'JANITORIAL_APPROVED' | 'FULLY_APPROVED' | 'CANCELLED' | 'COMPLETED';
  totalFee: number | string;
  totalDeposit: number | string;
  // Modification Proposal Fields
  modificationStatus?: 'NONE' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | null;
  proposedDate?: string | null;
  proposedPartyTimeStart?: string | null;
  proposedPartyTimeEnd?: string | null;
  modificationReason?: string | null;
  amenity: {
    id: number;
    name: string;
    description: string;
    reservationFee: number | string;
    deposit: number | string;
    capacity: number;
    janitorialRequired?: boolean;
    approvalRequired?: boolean;
  };
}

const ReservationsPage: React.FC = () => {
  const { currentCommunity } = useAuth();
  const isMobile = useMobile();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedReservationForModify, setSelectedReservationForModify] = useState<Reservation | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservationForCancel, setSelectedReservationForCancel] = useState<Reservation | null>(null);
  const [filter, setFilter] = useState<'all' | 'NEW' | 'JANITORIAL_APPROVED' | 'FULLY_APPROVED' | 'CANCELLED' | 'COMPLETED'>('all');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${apiUrl}/api/reservations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setReservations(response.data.reservations);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load reservations');
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleModifyReservation = (reservation: Reservation) => {
    setSelectedReservationForModify(reservation);
    setShowModifyModal(true);
  };

  const handleAcceptModification = async (reservation: Reservation) => {
    try {
      setActionLoading(reservation.id);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.put(`${apiUrl}/api/reservations/${reservation.id}/accept-modification`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh reservations
      fetchReservations();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to accept modification';
      const errorDetails = err.response?.data?.details || '';
      const errorCode = err.response?.data?.errorCode || '';
      
      console.error('Error accepting modification:', err);
      console.error('Error response data:', err.response?.data);
      console.error('Error details:', errorDetails);
      console.error('Error code:', errorCode);
      
      if (errorDetails) {
        setError(`${errorMessage}\n\nDetails: ${errorDetails}\nError Code: ${errorCode}`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectModification = async (reservation: Reservation) => {
    try {
      setActionLoading(reservation.id);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.put(`${apiUrl}/api/reservations/${reservation.id}/reject-modification`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh reservations
      fetchReservations();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject modification');
      console.error('Error rejecting modification:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelReservation = (reservation: Reservation) => {
    setSelectedReservationForCancel(reservation);
    setShowCancelModal(true);
  };

  // Removed unused getStatusColor function

  const getStatusText = (reservation: Reservation): string => {
    // Show modification status if pending
    if (reservation.modificationStatus === 'PENDING') {
      return 'Modification Proposed - Awaiting Your Response';
    }
    if (reservation.status === 'CANCELLED') {
      return 'Cancelled';
    }
    if (reservation.status === 'COMPLETED') {
      return 'Completed';
    }
    if (reservation.status === 'FULLY_APPROVED') {
      return 'Confirmed';
    }
    
    // For NEW and JANITORIAL_APPROVED, determine what approvals are still needed
    const amenity = reservation.amenity;
    const needsJanitorial = amenity.janitorialRequired !== false && reservation.status === 'NEW';
    const needsAdmin = amenity.approvalRequired !== false && reservation.status === 'JANITORIAL_APPROVED';
    
    const pendingApprovals: string[] = [];
    if (needsJanitorial) {
      pendingApprovals.push('Janitorial');
    }
    if (needsAdmin) {
      pendingApprovals.push('Admin');
    }
    
    if (pendingApprovals.length > 0) {
      return `Unconfirmed (Awaiting Approvals - ${pendingApprovals.join(', ')})`;
    }
    
    // Fallback (shouldn't reach here, but just in case)
    return 'Unconfirmed';
  };


  const filteredReservations = filter === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filter);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading your reservations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
        <button 
          onClick={fetchReservations}
          style={{ padding: '8px 16px', backgroundColor: '#355B45', color: 'white', border: 'none', borderRadius: '4px', fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0.75rem' : '20px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center', 
        marginBottom: isMobile ? '1.5rem' : '30px',
        gap: isMobile ? '1rem' : '0'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 'bold', margin: 0 }}>
            My Reservations
          </h1>
          {currentCommunity && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
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
            </div>
          )}
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '0.75rem' : '10px', 
          alignItems: isMobile ? 'stretch' : 'center',
          width: isMobile ? '100%' : 'auto'
        }}>
          <button
            onClick={() => setShowReservationModal(true)}
            style={{
              padding: isMobile ? '0.75rem 1.25rem' : '10px 20px',
              backgroundColor: '#355B45',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: isMobile ? '1rem' : '14px',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minHeight: '44px',
              width: isMobile ? '100%' : 'auto'
            }}
          >
            <span>+</span>
            Add a new reservation
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: isMobile ? '100%' : 'auto' }}>
            <label style={{ fontSize: isMobile ? '1rem' : '14px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              style={{ 
                padding: isMobile ? '0.75rem' : '8px', 
                border: '1px solid #d1d5db', 
                borderRadius: '4px',
                fontSize: isMobile ? '1rem' : '14px',
                minHeight: '44px',
                width: isMobile ? '100%' : 'auto',
                flex: isMobile ? 1 : 'none'
              }}
            >
              <option value="all">All Reservations</option>
              <option value="NEW">New</option>
              <option value="JANITORIAL_APPROVED">Janitorial Approved</option>
              <option value="FULLY_APPROVED">Fully Approved</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: isMobile ? '0.75rem' : '20px', 
        marginBottom: isMobile ? '1.5rem' : '30px' 
      }}>
        <div style={{ backgroundColor: 'white', padding: isMobile ? '1rem' : '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: isMobile ? '0.95rem' : '1rem' }}>Total Reservations</h3>
          <div style={{ fontSize: isMobile ? '1.75rem' : '2rem', fontWeight: 600, color: '#355B45', fontFamily: 'Inter, sans-serif' }}>
            {reservations.length}
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: isMobile ? '1rem' : '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: isMobile ? '0.95rem' : '1rem' }}>Pending Review</h3>
          <div style={{ fontSize: isMobile ? '1.75rem' : '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
            {reservations.filter(r => r.status === 'NEW').length}
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: isMobile ? '1rem' : '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: isMobile ? '0.95rem' : '1rem' }}>Approved</h3>
          <div style={{ fontSize: isMobile ? '1.75rem' : '2rem', fontWeight: 'bold', color: '#10b981' }}>
            {reservations.filter(r => r.status === 'FULLY_APPROVED').length}
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: isMobile ? '1rem' : '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: isMobile ? '0.95rem' : '1rem' }}>Total Cost</h3>
          <div style={{ fontSize: isMobile ? '1.75rem' : '2rem', fontWeight: 600, color: '#355B45', fontFamily: 'Inter, sans-serif' }}>
            ${reservations.reduce((sum, r) => sum + parseFloat(String(r.totalFee)), 0).toFixed(2)}
          </div>
    <p style={{ margin: '8px 0 0 0', fontSize: isMobile ? '0.8rem' : '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>
      Damage fees will be assessed after conclusion of the party. If damages are noted, you are responsible for the amount of the repairs.
    </p>
        </div>
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#6b7280', marginBottom: '10px' }}>No reservations found</h3>
          <p style={{ color: '#9ca3af' }}>
            {filter === 'all' 
              ? "You haven't made any reservations yet. Click on the calendar to create your first reservation!"
              : `No reservations with status "${filter}" found.`
            }
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredReservations.map((reservation) => (
            <div
              key={reservation.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                padding: isMobile ? '1rem' : '24px',
                border: '1px solid #e5e7eb'
              }}
            >
              {/* Header */}
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between', 
                alignItems: isMobile ? 'flex-start' : 'flex-start', 
                marginBottom: '16px',
                gap: isMobile ? '0.75rem' : '0'
              }}>
                <div>
                  <h3 style={{ fontSize: isMobile ? '1.1rem' : '1.25rem', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                    {reservation.amenity.name}
                  </h3>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: isMobile ? '0.9rem' : '14px' }}>
                    {formatDate(reservation.date)}
                  </p>
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'stretch' : 'center', 
                  gap: isMobile ? '0.5rem' : '12px',
                  width: isMobile ? '100%' : 'auto'
                }}>
                  <span
                    style={{
                      backgroundColor: reservation.modificationStatus === 'PENDING' ? '#3b82f6' : reservation.status === 'FULLY_APPROVED' ? '#10b981' : reservation.status === 'COMPLETED' ? '#6b7280' : reservation.status === 'CANCELLED' ? '#ef4444' : '#f59e0b',
                      color: 'white',
                      padding: isMobile ? '0.5rem 0.75rem' : '4px 12px',
                      borderRadius: '20px',
                      fontSize: isMobile ? '0.9rem' : '12px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      width: isMobile ? '100%' : 'auto'
                    }}
                  >
                    {getStatusText(reservation)}
                  </span>
                  {reservation.modificationStatus === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleAcceptModification(reservation)}
                        disabled={actionLoading === reservation.id}
                        style={{
                          backgroundColor: actionLoading === reservation.id ? '#9ca3af' : '#10b981',
                          color: 'white',
                          padding: isMobile ? '0.75rem 1rem' : '6px 12px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: actionLoading === reservation.id ? 'not-allowed' : 'pointer',
                          fontSize: isMobile ? '1rem' : '12px',
                          minHeight: '44px',
                          width: isMobile ? '100%' : 'auto'
                        }}
                      >
                        {actionLoading === reservation.id ? 'Processing...' : 'Accept Modification'}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Rejecting this modification will cancel your reservation. You will need to book a new reservation if you want to proceed. Are you sure you want to reject this modification?')) {
                            handleRejectModification(reservation);
                          }
                        }}
                        disabled={actionLoading === reservation.id}
                        style={{
                          backgroundColor: actionLoading === reservation.id ? '#9ca3af' : '#ef4444',
                          color: 'white',
                          padding: isMobile ? '0.75rem 1rem' : '6px 12px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: actionLoading === reservation.id ? 'not-allowed' : 'pointer',
                          fontSize: isMobile ? '1rem' : '12px',
                          minHeight: '44px',
                          width: isMobile ? '100%' : 'auto'
                        }}
                      >
                        {actionLoading === reservation.id ? 'Processing...' : 'Reject & Cancel'}
                      </button>
                    </>
                  )}
                  {(reservation.status === 'NEW' || reservation.status === 'JANITORIAL_APPROVED') && (
                    <button
                      onClick={() => handleCancelReservation(reservation)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: isMobile ? '0.75rem 1rem' : '6px 12px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: isMobile ? '1rem' : '12px',
                        minHeight: '44px',
                        width: isMobile ? '100%' : 'auto'
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Proposed Modification Alert - Prominent Warning */}
              {reservation.modificationStatus === 'PENDING' && (
                <div style={{ 
                  marginBottom: '16px', 
                  padding: '20px', 
                  backgroundColor: '#fef3c7', 
                  border: '2px solid #f59e0b', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '24px', marginRight: '8px' }}>⚠️</span>
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#92400e', margin: 0 }}>
                      Action Required: Modification Proposed
                    </h4>
                  </div>
                  <p style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#78350f', fontWeight: '500' }}>
                    A modification has been proposed for your reservation. Please review and respond:
                  </p>
                  <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #fbbf24' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#78350f', fontWeight: 'bold' }}>
                      Reason for Modification:
                    </p>
                    <p style={{ margin: 0, fontSize: '14px', color: '#374151' }}>
                      {reservation.modificationReason}
                    </p>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>Current Reservation Time:</p>
                      <p style={{ margin: 0, fontSize: '15px', color: '#374151', fontWeight: '500' }}>
                        {formatTimeRange(reservation.partyTimeStart, reservation.partyTimeEnd)}
                      </p>
                    </div>
                    <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '6px', border: '2px solid #f59e0b' }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#92400e', fontWeight: 'bold' }}>Proposed New Time:</p>
                      <p style={{ margin: 0, fontSize: '15px', color: '#92400e', fontWeight: '600' }}>
                        {reservation.proposedPartyTimeStart && reservation.proposedPartyTimeEnd 
                          ? formatTimeRange(reservation.proposedPartyTimeStart, reservation.proposedPartyTimeEnd)
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div style={{ 
                    padding: '12px', 
                    backgroundColor: '#fee2e2', 
                    borderRadius: '6px', 
                    border: '1px solid #f87171',
                    marginTop: '12px'
                  }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#991b1b', fontWeight: '500' }}>
                      <strong>Important:</strong> You must accept the modified time or reject it to cancel your reservation. 
                      If you reject, you will need to book a new reservation.
                    </p>
                  </div>
                </div>
              )}

              {/* Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px 0' }}>
                    Reservation Time
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    {formatTimeRange(reservation.partyTimeStart, reservation.partyTimeEnd)}
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px 0' }}>
                    Guest Count
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    {reservation.guestCount} people
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px 0' }}>
                    Payment
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    <strong>Reservation Fee:</strong> ${parseFloat(String(reservation.totalFee)).toFixed(2)}
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}> (PAID)</span>
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>
                    <strong>Damage Assessment:</strong> Damage fees will be assessed after conclusion of the party. If damages are noted, you are responsible for the amount of the repairs.
                  </p>
                </div>
              </div>

              {/* Special Requirements */}
              {reservation.specialRequirements && (
                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px 0' }}>
                    Special Requirements
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    {reservation.specialRequirements}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {reservation.status !== 'COMPLETED' && reservation.status !== 'CANCELLED' && (
                <div style={{ 
                  marginTop: '16px', 
                  display: 'flex', 
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '0.75rem' : '10px',
                  width: '100%'
                }}>
                  <button
                    onClick={() => handleModifyReservation(reservation)}
                    style={{
                      padding: isMobile ? '0.5rem 0.75rem' : '6px 12px',
                      backgroundColor: '#355B45',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: isMobile ? '0.875rem' : '13px',
                      fontWeight: '500',
                      minHeight: 'auto',
                      width: 'auto',
                      flex: 'none'
                    }}
                  >
                    Modify Reservation
                  </button>
                  <button
                    onClick={() => handleCancelReservation(reservation)}
                    style={{
                      padding: isMobile ? '0.5rem 0.75rem' : '6px 12px',
                      backgroundColor: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: isMobile ? '0.875rem' : '13px',
                      fontWeight: '500',
                      minHeight: 'auto',
                      width: 'auto',
                      flex: 'none'
                    }}
                  >
                    Cancel Reservation
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Reservation Modal */}
      {showReservationModal && (
        <ReservationModal
          isOpen={showReservationModal}
          onClose={() => setShowReservationModal(false)}
          onReservationCreated={() => {
            setShowReservationModal(false);
            fetchReservations(); // Refresh the list
          }}
        />
      )}

      {/* Modify Reservation Modal */}
      {showModifyModal && selectedReservationForModify && (
        <ModifyReservationModal
          isOpen={showModifyModal}
          onClose={() => {
            setShowModifyModal(false);
            setSelectedReservationForModify(null);
          }}
          reservation={selectedReservationForModify}
          onReservationModified={() => {
            setShowModifyModal(false);
            setSelectedReservationForModify(null);
            fetchReservations(); // Refresh the list
          }}
        />
      )}

      {/* Cancel Reservation Modal */}
      {showCancelModal && selectedReservationForCancel && (
        <CancelReservationModal
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedReservationForCancel(null);
          }}
          reservation={selectedReservationForCancel}
          onReservationCancelled={() => {
            setShowCancelModal(false);
            setSelectedReservationForCancel(null);
            fetchReservations(); // Refresh the list
          }}
        />
      )}
    </div>
  );
};

export default ReservationsPage;
