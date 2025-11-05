import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ReservationModal from './ReservationModal';
import { useMobile } from '../hooks/useMobile';

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
  const { user, currentCommunity } = useAuth();
  const isMobile = useMobile();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
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
    // TODO: Open modification modal with pre-filled data
    alert(`Modification feature coming soon!\n\nYou will be able to modify:\n- Event name\n- Date\n- Times\n- Guest count\n- Special requirements\n\nModification fees apply based on timing:\n- Within 1 month: $10 fee\n- Within 1 week: $50 fee\n- Within 48 hours: Full booking amount`);
  };

  const handleCancelReservation = async (reservation: Reservation) => {
    // Calculate cancellation fee on frontend first for display
    const reservationDate = new Date(reservation.date);
    const now = new Date();
    const hoursUntilReservation = (reservationDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    const daysUntilReservation = Math.floor(hoursUntilReservation / 24);
    
    let cancellationFee = 0;
    let feeReason = '';
    
    if (hoursUntilReservation < 48) {
      cancellationFee = parseFloat(String(reservation.totalFee));
      feeReason = 'Within 48 hours - full booking amount';
    } else if (daysUntilReservation < 7) {
      cancellationFee = 50.00;
      feeReason = 'Within 1 week - $50 modification/cancellation fee';
    } else if (daysUntilReservation < 30) {
      cancellationFee = 10.00;
      feeReason = 'Within 1 month - $10 modification/cancellation fee';
    } else {
      feeReason = 'More than 1 month away - no fee';
    }
    
    const confirmMessage = cancellationFee > 0
      ? `Are you sure you want to cancel this reservation?\n\nCancellation Fee: $${cancellationFee.toFixed(2)}\nReason: ${feeReason}\n\nClick OK to confirm cancellation.`
      : `Are you sure you want to cancel this reservation?\n\nNo cancellation fee will be charged.\nReason: ${feeReason}`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.delete(`${apiUrl}/api/reservations/${reservation.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh reservations
      fetchReservations();
      
      if (cancellationFee > 0) {
        alert(`Reservation cancelled successfully.\n\nCancellation Fee: $${cancellationFee.toFixed(2)}\nReason: ${feeReason}`);
      } else {
        alert('Reservation cancelled successfully. No fee charged.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel reservation');
      console.error('Error cancelling reservation:', err);
    }
  };

  const getStatusColor = (status: string): string => {
    const colors = {
      NEW: '#f59e0b',              // Orange
      JANITORIAL_APPROVED: '#3b82f6',  // Blue
      FULLY_APPROVED: '#10b981',   // Green
      CANCELLED: '#ef4444',        // Red
      COMPLETED: '#6b7280'         // Gray
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const getStatusText = (reservation: Reservation): string => {
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

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateTimeString: string): string => {
    if (!dateTimeString) return '';
    return new Date(dateTimeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
                      backgroundColor: reservation.status === 'FULLY_APPROVED' ? '#10b981' : reservation.status === 'COMPLETED' ? '#6b7280' : reservation.status === 'CANCELLED' ? '#ef4444' : '#f59e0b',
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

              {/* Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px 0' }}>
                    Reservation Time
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    {formatTime(reservation.partyTimeStart)} - {formatTime(reservation.partyTimeEnd)}
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
    </div>
  );
};

export default ReservationsPage;
