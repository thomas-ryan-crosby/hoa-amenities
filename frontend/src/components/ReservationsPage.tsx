import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ReservationModal from './ReservationModal';

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
  };
}

const ReservationsPage: React.FC = () => {
  const { user } = useAuth();
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

  const handleCancelReservation = async (reservationId: number) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.delete(`${apiUrl}/api/reservations/${reservationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh reservations
      fetchReservations();
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

  const getStatusText = (status: string): string => {
    const statusText = {
      NEW: 'New - Awaiting Janitorial Review',
      JANITORIAL_APPROVED: 'Janitorial Approved - Awaiting Admin Review',
      FULLY_APPROVED: 'Fully Approved - Ready to Use',
      CANCELLED: 'Cancelled',
      COMPLETED: 'Completed'
    };
    return statusText[status as keyof typeof statusText] || status;
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
          My Reservations
        </h1>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => setShowReservationModal(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#355B45',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>+</span>
            Add a new reservation
          </button>
          <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
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

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280' }}>Total Reservations</h3>
          <div style={{ fontSize: '2rem', fontWeight: 600, color: '#355B45', fontFamily: 'Inter, sans-serif' }}>
            {reservations.length}
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280' }}>Pending Review</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
            {reservations.filter(r => r.status === 'NEW').length}
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280' }}>Approved</h3>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
            {reservations.filter(r => r.status === 'FULLY_APPROVED').length}
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280' }}>Total Cost</h3>
          <div style={{ fontSize: '2rem', fontWeight: 600, color: '#355B45', fontFamily: 'Inter, sans-serif' }}>
            ${reservations.reduce((sum, r) => sum + parseFloat(String(r.totalFee)), 0).toFixed(2)}
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
            (Reservation fees only - damage fees charged separately if damages occur)
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
                padding: '24px',
                border: '1px solid #e5e7eb'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 4px 0' }}>
                    {reservation.amenity.name}
                  </h3>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
                    {formatDate(reservation.date)}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      backgroundColor: getStatusColor(reservation.status),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {getStatusText(reservation.status)}
                  </span>
                  {(reservation.status === 'NEW' || reservation.status === 'JANITORIAL_APPROVED') && (
                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px 0' }}>
                    Setup Time
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    {formatTime(reservation.setupTimeStart)} - {formatTime(reservation.setupTimeEnd)}
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px 0' }}>
                    Party Time
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
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6b7280' }}>
                    <strong>Potential Damage Fee:</strong> ${parseFloat(String(reservation.totalDeposit)).toFixed(2)}
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}> (Not charged - pending assessment)</span>
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
