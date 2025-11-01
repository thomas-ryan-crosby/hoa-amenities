import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Amenity {
  id: number;
  name: string;
  description: string;
  reservationFee: number | string;
  deposit: number | string;
  capacity: number;
}

interface TimeSlot {
  time: string;
  start: Date;
  end: Date;
  available: boolean;
}

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string;
  onReservationCreated?: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  // Default to today using local date components
  selectedDate = (() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  })(),
  onReservationCreated
}) => {
  const { user } = useAuth();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenity, setSelectedAmenity] = useState<number | null>(null);
  const [reservationDate, setReservationDate] = useState<string>(selectedDate);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [setupTimeStart, setSetupTimeStart] = useState<string>('');
  const [partyTimeEnd, setPartyTimeEnd] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [eventName, setEventName] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [specialRequirements, setSpecialRequirements] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      fetchAmenities();
      // Update reservation date when modal opens with a selected date
      if (selectedDate) {
        setReservationDate(selectedDate);
      }
    }
  }, [isOpen, selectedDate]);

  // Update reservation date when selectedDate prop changes
  useEffect(() => {
    if (selectedDate) {
      setReservationDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedAmenity && isOpen) {
      fetchTimeSlots();
    }
  }, [selectedAmenity, reservationDate, isOpen]);

  const fetchAmenities = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/amenities`);
      setAmenities(response.data);
    } catch (err) {
      setError('Failed to load amenities');
      console.error('Error fetching amenities:', err);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/api/calendar/time-slots`, {
        params: {
          date: reservationDate,
          amenityId: selectedAmenity
        }
      });
      setTimeSlots(response.data.timeSlots);
    } catch (err) {
      setError('Failed to load time slots');
      console.error('Error fetching time slots:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAmenityChange = (amenityId: number) => {
    setSelectedAmenity(amenityId);
    // Reset form when amenity changes
    setSetupTimeStart('');
    setPartyTimeEnd('');
  };

  // Round time to nearest 30 minutes
  const roundToNearest30Minutes = (time: string): string => {
    if (!time) return time;
    
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const roundedMinutes = Math.round(totalMinutes / 30) * 30;
    const roundedHours = Math.floor(roundedMinutes / 60) % 24;
    const roundedMins = roundedMinutes % 60;
    
    return `${String(roundedHours).padStart(2, '0')}:${String(roundedMins).padStart(2, '0')}`;
  };

  const handleSetupTimeChange = (time: string) => {
    const roundedTime = roundToNearest30Minutes(time);
    setSetupTimeStart(roundedTime);
  };

  const handlePartyTimeEndChange = (time: string) => {
    const roundedTime = roundToNearest30Minutes(time);
    setPartyTimeEnd(roundedTime);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAmenity || !setupTimeStart || !partyTimeEnd) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const selectedAmenityData = amenities.find(a => a.id === selectedAmenity);
      const totalFee = parseFloat(String(selectedAmenityData?.reservationFee)) || 0;
      const totalDeposit = parseFloat(String(selectedAmenityData?.deposit)) || 0;

      // Ensure times are rounded to nearest 30 minutes (safety check)
      const roundedSetupTime = roundToNearest30Minutes(setupTimeStart);
      const roundedPartyTimeEnd = roundToNearest30Minutes(partyTimeEnd);
      
      const reservationData = {
        amenityId: selectedAmenity,
        date: reservationDate,
        setupTimeStart: `${reservationDate}T${roundedSetupTime}:00`,
        setupTimeEnd: `${reservationDate}T${roundedSetupTime}:00`, // Same as start for now
        partyTimeStart: `${reservationDate}T${roundedSetupTime}:00`, // Party starts when setup starts
        partyTimeEnd: `${reservationDate}T${roundedPartyTimeEnd}:00`,
        guestCount,
        eventName: eventName || null,
        isPrivate: isPrivate,
        specialRequirements: specialRequirements || null,
        totalFee,
        totalDeposit
      };

      const response = await axios.post(`${apiUrl}/api/reservations`, reservationData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Reservation created:', response.data);
      
      // Reset form
      setSelectedAmenity(null);
      setReservationDate(selectedDate); // Reset to original selected date
      setSetupTimeStart('');
      setPartyTimeEnd('');
      setGuestCount(1);
      setEventName('');
      setIsPrivate(false);
      setSpecialRequirements('');
      
      // Close modal and refresh calendar
      onClose();
      if (onReservationCreated) {
        onReservationCreated();
      }
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create reservation');
      console.error('Error creating reservation:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedAmenityData = amenities.find(a => a.id === selectedAmenity);

  if (!isOpen) return null;

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
            Make a Reservation
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
            })()} // Can't select past dates
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
          {/* Amenity Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Select Amenity *
            </label>
            <select
              value={selectedAmenity || ''}
              onChange={(e) => handleAmenityChange(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              required
            >
              <option value="">Choose an amenity...</option>
              {amenities.map(amenity => (
                <option key={amenity.id} value={amenity.id}>
                  {amenity.name} - ${parseFloat(String(amenity.reservationFee)).toFixed(2)} reservation fee (Potential damage fee: ${parseFloat(String(amenity.deposit)).toFixed(2)} if damages occur)
                </option>
              ))}
            </select>
          </div>

          {/* Amenity Details */}
          {selectedAmenityData && (
            <div style={{ 
              marginBottom: '20px', 
              padding: '12px', 
              backgroundColor: '#f0f9ff', 
              border: '1px solid #0ea5e9', 
              borderRadius: '4px' 
            }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{selectedAmenityData.name}</h3>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{selectedAmenityData.description}</p>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}>
                <strong>Capacity:</strong> {selectedAmenityData.capacity} people
              </p>
              <p style={{ margin: '0', fontSize: '14px' }}>
                <strong>Reservation Fee:</strong> ${parseFloat(String(selectedAmenityData.reservationFee)).toFixed(2)}
                <span style={{ color: '#6b7280', fontSize: '12px' }}> (Charged at booking)</span>
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                <strong>Potential Damage Fee:</strong> ${parseFloat(String(selectedAmenityData.deposit)).toFixed(2)}
                <span style={{ color: '#6b7280', fontSize: '12px' }}> (Only charged if damages occur)</span>
              </p>
            </div>
          )}

          {/* Setup Start Time */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Setup Start Time *
            </label>
            <input
              type="time"
              value={setupTimeStart}
              onChange={(e) => handleSetupTimeChange(e.target.value)}
              step="1800"
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
              When you plan to start setting up for your party
            </p>
          </div>

          {/* Party End Time */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Party End Time *
            </label>
            <input
              type="time"
              value={partyTimeEnd}
              onChange={(e) => handlePartyTimeEndChange(e.target.value)}
              step="1800"
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
              When your party will end
            </p>
          </div>

          {/* Event Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Event Name *
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
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
              This will be displayed on the calendar
            </p>
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
            <p style={{ margin: '4px 0 0 26px', fontSize: '12px', color: '#6b7280' }}>
              If checked, "Private Event" will be shown on the calendar instead of the event name. Janitorial and Admin staff will still see the full details.
            </p>
          </div>

          {/* Guest Count */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Number of Guests *
            </label>
            <input
              type="number"
              min="1"
              max={selectedAmenityData?.capacity || 100}
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
            {selectedAmenityData && (
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                Maximum capacity: {selectedAmenityData.capacity} people
              </p>
            )}
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
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: loading ? '#9ca3af' : '#355B45',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px'
              }}
            >
              {loading ? 'Creating...' : 'Create Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationModal;
