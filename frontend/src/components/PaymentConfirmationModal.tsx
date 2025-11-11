import React, { useState } from 'react';

interface PaymentItem {
  label: string;
  amount: number;
}

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  paymentItems: PaymentItem[];
  title?: string;
  description?: string;
}

const PaymentConfirmationModal: React.FC<PaymentConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  paymentItems,
  title = 'Payment Confirmation',
  description
}) => {
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isOpen) return null;

  // Calculate total
  const total = paymentItems.reduce((sum, item) => sum + item.amount, 0);

  const handleConfirm = () => {
    if (acknowledged) {
      onConfirm();
      setAcknowledged(false); // Reset for next time
    }
  };

  const handleClose = () => {
    setAcknowledged(false); // Reset when closing
    onClose();
  };

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
      zIndex: 2000 // Higher than other modals
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
            {title}
          </h2>
          <button
            onClick={handleClose}
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

        {/* Description */}
        {description && (
          <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#0c4a6e' }}>
              {description}
            </p>
          </div>
        )}

        {/* Payment Breakdown */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0 0 12px 0', color: '#374151' }}>
            Payment Summary
          </h3>
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            {paymentItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderBottom: index < paymentItems.length - 1 ? '1px solid #e5e7eb' : 'none',
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                }}
              >
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {item.label}
                </span>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                  ${item.amount.toFixed(2)}
                </span>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: '#f3f4f6',
                borderTop: '2px solid #d1d5db'
              }}
            >
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827' }}>
                Total Amount
              </span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Placeholder for future payment integration */}
        <div style={{
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '4px'
        }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold', color: '#92400e' }}>
            Payment Processing
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: '#78350f' }}>
            Payment processing will be integrated here (Square, Stripe, etc.)
          </p>
        </div>

        {/* Acknowledgment Checkbox */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            cursor: 'pointer',
            padding: '12px',
            backgroundColor: acknowledged ? '#d1fae5' : '#f3f4f6',
            border: `2px solid ${acknowledged ? '#10b981' : '#d1d5db'}`,
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
              color: acknowledged ? '#065f46' : '#374151',
              lineHeight: '1.5'
            }}>
              I understand I will need to pay ${total.toFixed(2)} for this {title.toLowerCase().includes('modification') ? 'modification' : 'reservation'}.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleClose}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              color: '#374151'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!acknowledged}
            style={{
              padding: '12px 24px',
              backgroundColor: acknowledged ? '#355B45' : '#9ca3af',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: acknowledged ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              transition: 'background-color 0.2s'
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmationModal;

