import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
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
  cleaningTimeStart?: string;
  cleaningTimeEnd?: string;
  // Damage Assessment Fields
  damageAssessed?: boolean;
  damageAssessmentPending?: boolean;
  damageAssessmentStatus?: 'PENDING' | 'APPROVED' | 'ADJUSTED' | 'DENIED' | null;
  damageCharge?: number | null;
  damageChargeAmount?: number | null;
  damageDescription?: string | null;
  damageNotes?: string | null;
  amenity: {
    id: number;
    name: string;
    description: string;
    reservationFee: number | string;
    deposit: number | string;
    capacity: number;
  };
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const JanitorialPage: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useMobile();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'NEW' | 'JANITORIAL_APPROVED' | 'FULLY_APPROVED'>('all');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [showCleaningTimeModal, setShowCleaningTimeModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [cleaningTime, setCleaningTime] = useState({
    start: '',
    end: ''
  });
  const [showPartyCompleteModal, setShowPartyCompleteModal] = useState(false);
  const [showDamageAssessmentModal, setShowDamageAssessmentModal] = useState(false);
  const [damageAssessment, setDamageAssessment] = useState({
    amount: '',
    description: '',
    notes: ''
  });

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${apiUrl}/api/reservations/all`, {
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

  const handleApprove = async (reservationId: number) => {
    // For janitorial users, show cleaning time modal
    if (user?.role === 'janitorial') {
      const reservation = reservations.find(r => r.id === reservationId);
      if (reservation) {
        setSelectedReservation(reservation);
        // Set default cleaning time (2 hours after party ends)
        const partyEndTime = new Date(reservation.partyTimeEnd);
        const defaultCleaningStart = new Date(partyEndTime.getTime() + 30 * 60 * 1000); // 30 minutes after party
        const defaultCleaningEnd = new Date(defaultCleaningStart.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
        
        setCleaningTime({
          start: defaultCleaningStart.toISOString().slice(0, 16), // Format for datetime-local input
          end: defaultCleaningEnd.toISOString().slice(0, 16)
        });
        setShowCleaningTimeModal(true);
      }
    } else {
      // For admin users, approve directly
      await approveReservation(reservationId);
    }
  };

  const approveReservation = async (reservationId: number, cleaningTimeData?: { start: string; end: string }) => {
    try {
      setActionLoading(reservationId);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const requestData = cleaningTimeData ? {
        cleaningTimeStart: cleaningTimeData.start,
        cleaningTimeEnd: cleaningTimeData.end
      } : {};
      
      await axios.put(`${apiUrl}/api/reservations/${reservationId}/approve`, requestData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh reservations
      fetchReservations();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve reservation');
      console.error('Error approving reservation:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCleaningTimeSubmit = async () => {
    if (!selectedReservation) return;
    
    // Validate cleaning time
    if (!cleaningTime.start || !cleaningTime.end) {
      setError('Please select both cleaning start and end times');
      return;
    }
    
    const startTime = new Date(cleaningTime.start);
    const endTime = new Date(cleaningTime.end);
    
    if (startTime >= endTime) {
      setError('Cleaning end time must be after start time');
      return;
    }
    
    const duration = endTime.getTime() - startTime.getTime();
    const twoHours = 2 * 60 * 60 * 1000;
    
    if (duration < twoHours) {
      setError('Cleaning time must be at least 2 hours');
      return;
    }
    
    // Close modal and approve with cleaning time
    setShowCleaningTimeModal(false);
    await approveReservation(selectedReservation.id, cleaningTime);
  };

  const handleCleaningTimeCancel = () => {
    setShowCleaningTimeModal(false);
    setSelectedReservation(null);
    setCleaningTime({ start: '', end: '' });
  };

  const handlePartyComplete = async (damagesFound: boolean) => {
    if (!selectedReservation) return;
    
    try {
      setActionLoading(selectedReservation.id);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.put(`${apiUrl}/api/reservations/${selectedReservation.id}/complete`, {
        damagesFound
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // If damages found, open damage assessment modal
      if (damagesFound) {
        setShowPartyCompleteModal(false);
        setShowDamageAssessmentModal(true);
      } else {
        // No damages - close modal and refresh
        setShowPartyCompleteModal(false);
        setSelectedReservation(null);
        fetchReservations();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark party complete');
      console.error('Error marking party complete:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDamageAssessment = async () => {
    if (!selectedReservation) return;
    
    // Validate input
    if (!damageAssessment.amount || parseFloat(damageAssessment.amount) <= 0) {
      setError('Damage amount must be greater than 0');
      return;
    }
    if (!damageAssessment.description || damageAssessment.description.trim() === '') {
      setError('Damage description is required');
      return;
    }
    
    const maxDamageFee = parseFloat(String(selectedReservation.amenity?.deposit || selectedReservation.totalDeposit));
    const damageAmount = parseFloat(damageAssessment.amount);
    
    if (damageAmount > maxDamageFee) {
      setError(`Damage amount cannot exceed potential damage fee of $${maxDamageFee.toFixed(2)}`);
      return;
    }
    
    try {
      setActionLoading(selectedReservation.id);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.post(`${apiUrl}/api/reservations/${selectedReservation.id}/assess-damages`, {
        amount: damageAmount,
        description: damageAssessment.description.trim(),
        notes: damageAssessment.notes.trim() || null
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Close modal and refresh
      setShowDamageAssessmentModal(false);
      setSelectedReservation(null);
      setDamageAssessment({ amount: '', description: '', notes: '' });
      fetchReservations();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assess damages');
      console.error('Error assessing damages:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (reservationId: number) => {
    const reason = window.prompt('Please provide a reason for rejection (optional):');
    if (reason === null) return; // User cancelled

    try {
      setActionLoading(reservationId);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      await axios.put(`${apiUrl}/api/reservations/${reservationId}/reject`, {
        reason: reason || undefined
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Refresh reservations
      fetchReservations();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject reservation');
      console.error('Error rejecting reservation:', err);
    } finally {
      setActionLoading(null);
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
      NEW: 'New - Needs Janitorial Review',
      JANITORIAL_APPROVED: 'Janitorial Approved - Needs Admin Review',
      FULLY_APPROVED: 'Fully Approved',
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

  const canApprove = (reservation: Reservation): boolean => {
    if (user?.role === 'admin') {
      return reservation.status === 'NEW' || reservation.status === 'JANITORIAL_APPROVED';
    } else if (user?.role === 'janitorial') {
      return reservation.status === 'NEW';
    }
    return false;
  };

  const canReject = (reservation: Reservation): boolean => {
    return reservation.status === 'NEW' || reservation.status === 'JANITORIAL_APPROVED';
  };

  const filteredReservations = filter === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filter);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Loading reservations for review...</div>
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
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: 'bold', margin: 0 }}>
          Janitorial Dashboard
        </h1>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
          >
            <option value="all">All Reservations</option>
            <option value="NEW">New (Need Review)</option>
            <option value="JANITORIAL_APPROVED">Janitorial Approved</option>
            <option value="FULLY_APPROVED">Fully Approved</option>
          </select>
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
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: isMobile ? '0.95rem' : '1rem' }}>Janitorial Approved</h3>
          <div style={{ fontSize: isMobile ? '1.75rem' : '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
            {reservations.filter(r => r.status === 'JANITORIAL_APPROVED').length}
          </div>
        </div>
        <div style={{ backgroundColor: 'white', padding: isMobile ? '1rem' : '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: isMobile ? '0.95rem' : '1rem' }}>Fully Approved</h3>
          <div style={{ fontSize: isMobile ? '1.75rem' : '2rem', fontWeight: 'bold', color: '#10b981' }}>
            {reservations.filter(r => r.status === 'FULLY_APPROVED').length}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#0c4a6e' }}>Review Process:</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c4a6e' }}>
          <li><strong>NEW:</strong> Review and approve/reject the reservation</li>
          <li><strong>JANITORIAL_APPROVED:</strong> Admin can provide final approval</li>
          <li><strong>FULLY_APPROVED:</strong> Reservation is ready for use</li>
        </ul>
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#6b7280', marginBottom: '10px' }}>No reservations found</h3>
          <p style={{ color: '#9ca3af' }}>
            {filter === 'all' 
              ? "No reservations have been made yet."
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
                  <p style={{ color: '#6b7280', margin: '0 0 4px 0', fontSize: '14px' }}>
                    {formatDate(reservation.date)}
                  </p>
                  <p style={{ color: '#9ca3af', margin: 0, fontSize: '12px' }}>
                    Requested by: {reservation.user.firstName} {reservation.user.lastName} ({reservation.user.email})
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
                </div>
              </div>

              {/* Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
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
                    Total Cost
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    <strong>Reservation Fee:</strong> ${parseFloat(String(reservation.totalFee)).toFixed(2)}
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}> (PAID)</span>
                    <br />
                    <strong>Damage Assessment:</strong> Damage fees will be assessed after conclusion of the party. If damages are noted, the resident is responsible for the amount of the repairs.
                  </p>
                </div>
              </div>

              {/* Special Requirements */}
              {reservation.specialRequirements && (
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 4px 0' }}>
                    Special Requirements
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    {reservation.specialRequirements}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                {canApprove(reservation) && (
                  <button
                    onClick={() => handleApprove(reservation.id)}
                    disabled={actionLoading === reservation.id}
                    style={{
                      backgroundColor: actionLoading === reservation.id ? '#9ca3af' : '#10b981',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: actionLoading === reservation.id ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    {actionLoading === reservation.id ? 'Processing...' : 
                     (reservation.status === 'NEW' ? 'Approve' : 'Final Approve')}
                  </button>
                )}
                {canReject(reservation) && (
                  <button
                    onClick={() => handleReject(reservation.id)}
                    disabled={actionLoading === reservation.id}
                    style={{
                      backgroundColor: actionLoading === reservation.id ? '#9ca3af' : '#ef4444',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: actionLoading === reservation.id ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    {actionLoading === reservation.id ? 'Processing...' : 'Reject'}
                  </button>
                )}
                {(reservation.status === 'FULLY_APPROVED' || reservation.status === 'JANITORIAL_APPROVED') && (
                  <button
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setShowPartyCompleteModal(true);
                    }}
                    disabled={actionLoading === reservation.id}
                    style={{
                      backgroundColor: actionLoading === reservation.id ? '#9ca3af' : '#355B45',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: actionLoading === reservation.id ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginLeft: '8px'
                    }}
                  >
                    Mark Party Complete
                  </button>
                )}
                {reservation.status === 'COMPLETED' && reservation.damageAssessmentPending && !reservation.damageAssessed && (
                  <button
                    onClick={() => {
                      setSelectedReservation(reservation);
                      setShowDamageAssessmentModal(true);
                    }}
                    disabled={actionLoading === reservation.id}
                    style={{
                      backgroundColor: actionLoading === reservation.id ? '#9ca3af' : '#f59e0b',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: actionLoading === reservation.id ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginLeft: '8px'
                    }}
                  >
                    Assess Damages
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cleaning Time Modal */}
      {showCleaningTimeModal && selectedReservation && (
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
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>
              Set Cleaning Time
            </h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                <strong>Reservation:</strong> {selectedReservation.amenity.name} on {new Date(selectedReservation.date).toLocaleDateString()}
              </p>
              <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                <strong>Party Time:</strong> {new Date(selectedReservation.partyTimeStart).toLocaleTimeString()} - {new Date(selectedReservation.partyTimeEnd).toLocaleTimeString()}
              </p>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                <strong>Party Ends:</strong> {new Date(selectedReservation.partyTimeEnd).toLocaleString()}
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                Cleaning Start Time
              </label>
              <input
                type="datetime-local"
                value={cleaningTime.start}
                onChange={(e) => setCleaningTime(prev => ({ ...prev, start: e.target.value }))}
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

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                Cleaning End Time
              </label>
              <input
                type="datetime-local"
                value={cleaningTime.end}
                onChange={(e) => setCleaningTime(prev => ({ ...prev, end: e.target.value }))}
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

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={handleCleaningTimeCancel}
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
                onClick={handleCleaningTimeSubmit}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Approve with Cleaning Time
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Party Complete Modal */}
      {showPartyCompleteModal && selectedReservation && (
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
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>
              Party Completion
            </h2>
            
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Did you find any damages?
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button
                onClick={() => handlePartyComplete(false)}
                disabled={actionLoading === selectedReservation.id}
                style={{
                  flex: 1,
                  backgroundColor: actionLoading === selectedReservation.id ? '#9ca3af' : '#10b981',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: actionLoading === selectedReservation.id ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                No Damages Found
              </button>
              <button
                onClick={() => handlePartyComplete(true)}
                disabled={actionLoading === selectedReservation.id}
                style={{
                  flex: 1,
                  backgroundColor: actionLoading === selectedReservation.id ? '#9ca3af' : '#f59e0b',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: actionLoading === selectedReservation.id ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                Damages Found
              </button>
            </div>

            <button
              onClick={() => {
                setShowPartyCompleteModal(false);
                setSelectedReservation(null);
              }}
              style={{
                width: '100%',
                backgroundColor: '#e5e7eb',
                color: '#374151',
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Damage Assessment Modal */}
      {showDamageAssessmentModal && selectedReservation && (
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
              Damage Assessment
            </h2>
            
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              <strong>Reservation:</strong> {selectedReservation.amenity.name} - {selectedReservation.user.firstName} {selectedReservation.user.lastName}
              <br />
              <strong>Date:</strong> {new Date(selectedReservation.date).toLocaleDateString()}
              <br />
              <strong>Max Damage Fee:</strong> ${parseFloat(String(selectedReservation.amenity?.deposit || selectedReservation.totalDeposit)).toFixed(2)}
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                Damage Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max={parseFloat(String(selectedReservation.amenity?.deposit || selectedReservation.totalDeposit))}
                value={damageAssessment.amount}
                onChange={(e) => setDamageAssessment(prev => ({ ...prev, amount: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                Damage Description *
              </label>
              <textarea
                value={damageAssessment.description}
                onChange={(e) => setDamageAssessment(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Describe the damages found..."
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#374151' }}>
                Additional Notes (Optional)
              </label>
              <textarea
                value={damageAssessment.notes}
                onChange={(e) => setDamageAssessment(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
                placeholder="Any additional notes..."
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleDamageAssessment}
                disabled={actionLoading === selectedReservation.id}
                style={{
                  flex: 1,
                  backgroundColor: actionLoading === selectedReservation.id ? '#9ca3af' : '#355B45',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: actionLoading === selectedReservation.id ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {actionLoading === selectedReservation.id ? 'Submitting...' : 'Submit for Admin Review'}
              </button>
              <button
                onClick={() => {
                  setShowDamageAssessmentModal(false);
                  setSelectedReservation(null);
                  setDamageAssessment({ amount: '', description: '', notes: '' });
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

export default JanitorialPage;
