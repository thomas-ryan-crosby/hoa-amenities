import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Reservation {
  id: number;
  date: string;
  totalFee: number | string;
  amenity: {
    name: string;
  };
}

interface CancelReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onReservationCancelled?: () => void;
}

const CancelReservationModal: React.FC<CancelReservationModalProps> = ({
  isOpen,
  onClose,
  reservation,
  onReservationCancelled
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancellationInfo, setCancellationInfo] = useState<{
    fee: number;
    reason: string;
    refundAmount: number;
  } | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  // Fetch cancellation fee when modal opens
  useEffect(() => {
    if (isOpen && reservation) {
      fetchCancellationInfo();
    } else {
      setCancellationInfo(null);
      setAcknowledged(false);
      setError(null);
    }
  }, [isOpen, reservation]);

  const fetchCancellationInfo = async () => {
    if (!reservation) return;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      // We'll calculate the fee on the backend when cancelling
      // For now, just set up the modal
      setCancellationInfo(null);
    } catch (err: any) {
      console.error('Error fetching cancellation info:', err);
    }
  };

  const handleCancel = async () => {
    if (!reservation || !acknowledged) return;

    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(
        `${apiUrl}/api/reservations/${reservation.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Store cancellation info from response
      setCancellationInfo({
        fee: response.data.cancellationFee || 0,
        reason: response.data.cancellationFeeReason || 'No fee',
        refundAmount: response.data.refundAmount || 0
      });

      // Close modal and refresh after a short delay to show success
      setTimeout(() => {
        onClose();
        if (onReservationCancelled) {
          onReservationCancelled();
        }
      }, 2000);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel reservation';
      const errorDetails = err.response?.data?.details || '';
      const errorCode = err.response?.data?.errorCode || '';
      
      console.error('Error cancelling reservation:', err);
      
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

  // If cancellation was successful, show success message
  if (cancellationInfo && !loading && !error) {
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
        zIndex: 2000
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '24px',
          width: '90%',
          maxWidth: '500px'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 20px 0', color: '#10b981' }}>
            ✓ Reservation Cancelled
          </h2>
          
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#374151' }}>
              Your reservation has been cancelled successfully.
            </p>
            
            {cancellationInfo.fee > 0 ? (
              <div style={{
                padding: '12px',
                backgroundColor: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '4px',
                marginTop: '12px'
              }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#92400e' }}>
                  Cancellation Fee: ${cancellationInfo.fee.toFixed(2)}
                </p>
                <p style={{ margin: 0, fontSize: '14px', color: '#78350f' }}>
                  {cancellationInfo.reason}
                </p>
              </div>
            ) : (
              <div style={{
                padding: '12px',
                backgroundColor: '#d1fae5',
                border: '1px solid #10b981',
                borderRadius: '4px',
                marginTop: '12px'
              }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#065f46' }}>
                  No cancellation fee charged.
                </p>
              </div>
            )}

            {cancellationInfo.refundAmount > 0 && (
              <div style={{
                padding: '12px',
                backgroundColor: '#d1fae5',
                border: '1px solid #10b981',
                borderRadius: '4px',
                marginTop: '12px'
              }}>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#065f46' }}>
                  Refund Amount: ${cancellationInfo.refundAmount.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            Cancel Reservation
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

        {/* Warning */}
        <div style={{
          marginBottom: '20px',
          padding: '12px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '4px'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#991b1b', fontWeight: 'bold' }}>
            ⚠️ Warning: This action cannot be undone.
          </p>
        </div>

        {/* Reservation Info */}
        <div style={{
          marginBottom: '20px',
          padding: '12px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #0ea5e9',
          borderRadius: '4px'
        }}>
          <p style={{ margin: '4px 0', fontSize: '14px', color: '#0c4a6e' }}>
            <strong>Amenity:</strong> {reservation.amenity.name}
          </p>
          <p style={{ margin: '4px 0', fontSize: '14px', color: '#0c4a6e' }}>
            <strong>Date:</strong> {new Date(reservation.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
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
            {error.split('\n').map((line, i) => (
              <p key={i} style={{ margin: i === 0 ? '0 0 4px 0' : '4px 0 0 0', fontSize: '14px' }}>
                {line}
              </p>
            ))}
          </div>
        )}

        {/* Acknowledgment Checkbox */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            cursor: 'pointer',
            padding: '12px',
            backgroundColor: acknowledged ? '#fef2f2' : '#f3f4f6',
            border: `2px solid ${acknowledged ? '#dc2626' : '#d1d5db'}`,
            borderRadius: '4px',
            transition: 'all 0.2s'
          }}>
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              style={{
                marginRight: '12px',
                marginTop: '2px',
                width: '20px',
                height: '20px',
                cursor: 'pointer',
                flexShrink: 0
              }}
            />
            <span style={{
              fontSize: '14px',
              fontWeight: acknowledged ? '600' : '500',
              color: acknowledged ? '#991b1b' : '#374151',
              lineHeight: '1.5'
            }}>
              I understand that cancelling this reservation cannot be undone and any applicable cancellation fees will be charged.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              color: '#374151',
              opacity: loading ? 0.5 : 1
            }}
          >
            Keep Reservation
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={!acknowledged || loading}
            style={{
              padding: '12px 24px',
              backgroundColor: (!acknowledged || loading) ? '#9ca3af' : '#dc2626',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (!acknowledged || loading) ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Cancelling...' : 'Cancel Reservation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelReservationModal;

