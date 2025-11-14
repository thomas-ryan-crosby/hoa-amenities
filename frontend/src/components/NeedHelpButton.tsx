import React, { useState } from 'react';

const NeedHelpButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Sticky Help Button */}
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#355B45',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s',
          lineHeight: 1
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#2d4a38';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#355B45';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)';
        }}
      >
        <span style={{ fontSize: '1.125rem' }}>💬</span>
        <span>Need Help?</span>
      </button>

      {/* Contact Modal */}
      {showModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
          style={{
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
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                color: '#374151',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s',
                lineHeight: 1
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
              }}
            >
              ×
            </button>

            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 700, 
              color: '#1f2937', 
              marginBottom: '0.5rem',
              marginRight: '2rem'
            }}>
              Need Help?
            </h2>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#6b7280', 
              marginBottom: '2rem',
              lineHeight: 1.5
            }}>
              Get in touch with our founder for support, questions, or feedback.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Name */}
              <div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  color: '#6b7280', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>
                  Name
                </div>
                <div style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: 600, 
                  color: '#1f2937'
                }}>
                  Ryan Crosby
                </div>
              </div>

              {/* Email */}
              <div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  color: '#6b7280', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>
                  Email
                </div>
                <a
                  href="mailto:neighbriapp@gmail.com"
                  style={{
                    fontSize: '1rem',
                    color: '#355B45',
                    textDecoration: 'none',
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#2d4a38';
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#355B45';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  neighbriapp@gmail.com
                  <span style={{ fontSize: '0.875rem' }}>↗</span>
                </a>
              </div>

              {/* Phone */}
              <div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 600, 
                  color: '#6b7280', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem'
                }}>
                  Phone
                </div>
                <a
                  href="tel:9853732383"
                  style={{
                    fontSize: '1rem',
                    color: '#355B45',
                    textDecoration: 'none',
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#2d4a38';
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#355B45';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  985-373-2383
                  <span style={{ fontSize: '0.875rem' }}>↗</span>
                </a>
              </div>
            </div>

            <div style={{ 
              marginTop: '2rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#355B45',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#2d4a38';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#355B45';
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NeedHelpButton;

