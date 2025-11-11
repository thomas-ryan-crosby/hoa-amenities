import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SimpleTimeSelector from './SimpleTimeSelector';
import PaymentConfirmationModal from './PaymentConfirmationModal';
import { formatDate, formatTime } from '../utils/dateTimeUtils';

interface Reservation {
  id: number;
  date: string;
  setupTimeStart: string;
  setupTimeEnd: string;
  partyTimeStart: string;
  partyTimeEnd: string;
  guestCount: number;
  eventName?: string | null;
  isPrivate?: boolean;
  specialRequirements?: string | null;
  amenity: {
    id: number;
    name: string;
    capacity: number;
  };
}

interface ModifyReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onReservationModified?: () => void;
}

const ModifyReservationModal: React.FC<ModifyReservationModalProps> = ({
  isOpen,
  onClose,
  reservation,
  onReservationModified
}) => {
  const [loading, setLoading] = useState(false);
  const [calculatingFee, setCalculatingFee] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state - initialized from reservation
  const [reservationDate, setReservationDate] = useState<string>('');
  const [reservationTimeStart, setReservationTimeStart] = useState<string>('');
  const [reservationTimeEnd, setReservationTimeEnd] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [eventName, setEventName] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [specialRequirements, setSpecialRequirements] = useState<string>('');
  
  // Modification fee state
  const [modificationFee, setModificationFee] = useState<number | null>(null);
  const [modificationFeeReason, setModificationFeeReason] = useState<string>('');
  const [modificationCount, setModificationCount] = useState<number>(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [modifiedReservation, setModifiedReservation] = useState<any>(null);
  const [originalDateStr, setOriginalDateStr] = useState<string>('');

  // Memoize calculateModificationFee to avoid dependency issues
  const calculateModificationFee = useCallback(async () => {
    if (!reservation || !reservationDate) return;
    
    try {
      setCalculatingFee(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${apiUrl}/api/reservations/${reservation.id}/modify/calculate-fee`,
        {
          params: {
            newDate: reservationDate
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setModificationFee(response.data.modificationFee);
      setModificationFeeReason(response.data.modificationFeeReason);
      setModificationCount(response.data.modificationCount || 0);
    } catch (err: any) {
      console.error('Error calculating modification fee:', err);
      // Don't show error for fee calculation - just set to null
      setModificationFee(null);
      setModificationFeeReason('');
    } finally {
      setCalculatingFee(false);
    }
  }, [reservation, reservationDate]);

  // Initialize form from reservation when modal opens
  useEffect(() => {
    if (isOpen && reservation) {
      // Parse date directly from string (YYYY-MM-DD format) to avoid timezone issues
      // reservation.date is a DATE type from database, not a datetime
      let dateStr = reservation.date;
      if (dateStr.includes('T')) {
        // If it's an ISO datetime string, extract just the date part
        dateStr = dateStr.split('T')[0];
      }
      // Ensure it's in YYYY-MM-DD format
      setReservationDate(dateStr);
      setOriginalDateStr(dateStr); // Store original date for comparison
      
      // Parse times from ISO strings
      const startTime = new Date(reservation.partyTimeStart);
      const endTime = new Date(reservation.partyTimeEnd);
      
      const startHours = String(startTime.getHours()).padStart(2, '0');
      const startMinutes = String(startTime.getMinutes()).padStart(2, '0');
      setReservationTimeStart(`${startHours}:${startMinutes}`);
      
      const endHours = String(endTime.getHours()).padStart(2, '0');
      const endMinutes = String(endTime.getMinutes()).padStart(2, '0');
      setReservationTimeEnd(`${endHours}:${endMinutes}`);
      
      setGuestCount(reservation.guestCount);
      setEventName(reservation.eventName || '');
      setIsPrivate(reservation.isPrivate || false);
      setSpecialRequirements(reservation.specialRequirements || '');
      
      // Reset fee calculation
      setModificationFee(null);
      setModificationFeeReason('');
      
      // Calculate initial fee
      calculateModificationFee();
    }
  }, [isOpen, reservation, calculateModificationFee]);

  // Calculate modification fee when relevant fields change
  useEffect(() => {
    if (isOpen && reservation && reservationDate) {
      const timeoutId = setTimeout(() => {
        calculateModificationFee();
      }, 500); // Debounce by 500ms
      
      return () => clearTimeout(timeoutId);
    }
  }, [reservationDate, isOpen, reservation, calculateModificationFee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reservation || !reservationTimeStart || !reservationTimeEnd) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      // Construct Date objects in local timezone, then convert to ISO strings for UTC storage
      const [year, month, day] = reservationDate.split('-').map(Number);
      
      const localStartDate = new Date(year, month - 1, day);
      const [startHours, startMinutes] = reservationTimeStart.split(':').map(Number);
      localStartDate.setHours(startHours, startMinutes, 0, 0);
      
      const localEndDate = new Date(year, month - 1, day);
      const [endHours, endMinutes] = reservationTimeEnd.split(':').map(Number);
      localEndDate.setHours(endHours, endMinutes, 0, 0);
      
      const updateData: any = {
        date: reservationDate,
        setupTimeStart: localStartDate.toISOString(),
        setupTimeEnd: localStartDate.toISOString(),
        partyTimeStart: localStartDate.toISOString(),
        partyTimeEnd: localEndDate.toISOString(),
        guestCount,
        eventName: eventName || null,
        isPrivate: isPrivate,
        specialRequirements: specialRequirements || null
      };

      const response = await axios.put(
        `${apiUrl}/api/reservations/${reservation.id}/modify`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Reservation modified:', response.data);
      
      // Store modified reservation data for payment modal
      setModifiedReservation({
        reservation: response.data.reservation,
        modificationFee: response.data.modificationFee || 0,
        modificationFeeReason: response.data.modificationFeeReason || ''
      });
      
      // Show payment confirmation modal if there's a fee, otherwise just close
      if (response.data.modificationFee && response.data.modificationFee > 0) {
        setShowPaymentModal(true);
      } else {
        // No fee, close immediately
        onClose();
        if (onReservationModified) {
          onReservationModified();
        }
      }
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to modify reservation';
      const errorDetails = err.response?.data?.details || '';
      const errorCode = err.response?.data?.errorCode || '';
      
      console.error('Error modifying reservation:', err);
      console.error('Error response data:', err.response?.data);
      
      if (errorDetails) {
        setError(`${errorMessage}\n\nDetails: ${errorDetails}\nError Code: ${errorCode}`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !reservation) return null;

  // Check if any fields have changed
  const originalStartTime = new Date(reservation.partyTimeStart);
  const originalEndTime = new Date(reservation.partyTimeEnd);
  const originalStartHours = String(originalStartTime.getHours()).padStart(2, '0');
  const originalStartMinutes = String(originalStartTime.getMinutes()).padStart(2, '0');
  const originalStartTimeStr = `${originalStartHours}:${originalStartMinutes}`;
  const originalEndHours = String(originalEndTime.getHours()).padStart(2, '0');
  const originalEndMinutes = String(originalEndTime.getMinutes()).padStart(2, '0');
  const originalEndTimeStr = `${originalEndHours}:${originalEndMinutes}`;
  
  const hasChanges = 
    reservationDate !== originalDateStr ||
    reservationTimeStart !== originalStartTimeStr ||
    reservationTimeEnd !== originalEndTimeStr ||
    guestCount !== reservation.guestCount ||
    eventName !== (reservation.eventName || '') ||
    isPrivate !== (reservation.isPrivate || false) ||
    specialRequirements !== (reservation.specialRequirements || '');

  return (
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
        borderRadius: '8px',
        padding: '24px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            Modify Reservation
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ×
          </button>
        </div>

        {/* Current Reservation Info */}
        <div style={{ 
          marginBottom: '20px', 
          padding: '12px', 
          backgroundColor: '#f0f9ff', 
          border: '1px solid #0ea5e9', 
          borderRadius: '4px' 
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#0c4a6e' }}>Current Reservation</h3>
          <p style={{ margin: '4px 0', fontSize: '14px', color: '#0c4a6e' }}>
            <strong>Date:</strong> {formatDate(reservation.date)}
          </p>
          <p style={{ margin: '4px 0', fontSize: '14px', color: '#0c4a6e' }}>
            <strong>Time:</strong> {formatTime(reservation.partyTimeStart)} - {formatTime(reservation.partyTimeEnd)}
          </p>
          <p style={{ margin: '4px 0', fontSize: '14px', color: '#0c4a6e' }}>
            <strong>Guests:</strong> {reservation.guestCount}
          </p>
          {modificationCount > 0 && (
            <p style={{ margin: '4px 0', fontSize: '14px', color: '#0c4a6e' }}>
              <strong>Previous Modifications:</strong> {modificationCount}
            </p>
          )}
        </div>

        {error && (
          <div style={{ 
            marginBottom: '20px', 
            padding: '12px', 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fecaca', 
            borderRadius: '4px',
            color: '#dc2626'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Date Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Reservation Date *
            </label>
            <input
              type="date"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
              min={(() => {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
              })()}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              required
            />
          </div>

          {/* Reservation Start Time */}
          <SimpleTimeSelector
            label="Reservation Start Time"
            value={reservationTimeStart}
            onChange={setReservationTimeStart}
            required
          />
          <p style={{ margin: '-16px 0 16px 0', fontSize: '12px', color: '#6b7280' }}>
            Include any setup time needed in your start time
          </p>

          {/* Reservation End Time */}
          <SimpleTimeSelector
            label="Reservation End Time"
            value={reservationTimeEnd}
            onChange={setReservationTimeEnd}
            required
          />
          <p style={{ margin: '-16px 0 16px 0', fontSize: '12px', color: '#6b7280' }}>
            Include any cleanup time needed in your end time
          </p>

          {/* Reservation Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Reservation Name *
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g., Birthday Party, Family Reunion..."
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              required
            />
          </div>

          {/* Make Event Private */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                style={{
                  marginRight: '8px',
                  width: '18px',
                  height: '18px',
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontWeight: 'bold' }}>
                Make Event Private
              </span>
            </label>
          </div>

          {/* Guest Count */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Number of Guests *
            </label>
            <input
              type="number"
              min="1"
              max={reservation.amenity.capacity}
              value={guestCount}
              onChange={(e) => setGuestCount(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              required
            />
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
              Maximum capacity: {reservation.amenity.capacity} people
            </p>
          </div>

          {/* Special Requirements */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Special Requirements
            </label>
            <textarea
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              placeholder="Any special setup needs, equipment requests, or notes..."
              rows={3}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Modification Fee Display */}
          {calculatingFee ? (
            <div style={{ 
              marginBottom: '20px', 
              padding: '12px', 
              backgroundColor: '#f9fafb', 
              border: '1px solid #d1d5db', 
              borderRadius: '4px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              Calculating modification fee...
            </div>
          ) : modificationFee !== null && hasChanges ? (
            <div style={{ 
              marginBottom: '20px', 
              padding: '12px', 
              backgroundColor: modificationFee > 0 ? '#fef3c7' : '#d1fae5', 
              border: `1px solid ${modificationFee > 0 ? '#f59e0b' : '#10b981'}`, 
              borderRadius: '4px'
            }}>
              <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: modificationFee > 0 ? '#92400e' : '#065f46' }}>
                Modification Fee: ${modificationFee.toFixed(2)}
              </p>
              <p style={{ margin: 0, fontSize: '14px', color: modificationFee > 0 ? '#78350f' : '#047857' }}>
                {modificationFeeReason}
              </p>
            </div>
          ) : !hasChanges ? (
            <div style={{ 
              marginBottom: '20px', 
              padding: '12px', 
              backgroundColor: '#f3f4f6', 
              border: '1px solid #d1d5db', 
              borderRadius: '4px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              No changes detected
            </div>
          ) : null}

          {/* Submit Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                backgroundColor: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !hasChanges}
              style={{
                padding: '12px 24px',
                backgroundColor: (loading || !hasChanges) ? '#9ca3af' : '#355B45',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (loading || !hasChanges) ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              {loading ? 'Modifying...' : 'Modify Reservation'}
            </button>
          </div>
        </form>
      </div>

      {/* Payment Confirmation Modal */}
      {showPaymentModal && modifiedReservation && modifiedReservation.modificationFee > 0 && (
        <PaymentConfirmationModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setModifiedReservation(null);
            // Close modify modal
            onClose();
          }}
          onConfirm={() => {
            setShowPaymentModal(false);
            setModifiedReservation(null);
            // Close modify modal
            onClose();
            // Refresh reservations
            if (onReservationModified) {
              onReservationModified();
            }
          }}
          paymentItems={[
            {
              label: 'Modification Fee',
              amount: modifiedReservation.modificationFee
            }
          ]}
          title="Modification Payment Confirmation"
          description={`${modifiedReservation.modificationFeeReason || 'A modification fee applies to this change.'} Please review the payment summary below.`}
        />
      )}
    </div>
  );
};

export default ModifyReservationModal;

