import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from './LandingHeader';

const PitchDeckAmenityManager: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has access (from sessionStorage)
    const hasAccess = sessionStorage.getItem('pitchDeckAccess');
    if (!hasAccess) {
      // Redirect to gate if no access
      navigate('/pitch/gate', { replace: true });
    }
  }, [navigate]);

  // Check access before rendering
  const hasAccess = sessionStorage.getItem('pitchDeckAccess');
  if (!hasAccess) {
    return null; // Will redirect via useEffect
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <LandingHeader />
      <main>
        {/* Company Purpose */}
        <section style={{
          padding: '8rem 1rem 6rem',
          background: 'linear-gradient(135deg, #f0f4f1 0%, #e6f5ed 50%, #f9fafb 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <h1 style={{
              fontSize: '5.5rem',
              fontWeight: 800,
              color: '#1f2937',
              marginBottom: '1.5rem',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '-0.02em',
              lineHeight: '1.1'
            }}>
              Neighbri
            </h1>
            <p style={{
              fontSize: '2.5rem',
              color: '#355B45',
              marginBottom: '1.5rem',
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '-0.01em',
              lineHeight: '1.2'
            }}>
              Neighborhood Amenities, Simplified
            </p>
            <p style={{
              fontSize: '1.5rem',
              color: '#4b5563',
              maxWidth: '800px',
              margin: '0 auto 2.5rem',
              lineHeight: '1.9',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400
            }}>
              Neighbri <strong>streamlines amenity reservations and management</strong> for communities. Amenities such as clubrooms, pools, and more can be <strong>booked, cleaned, and managed with ease</strong>.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              maxWidth: '900px',
              margin: '3rem auto 0'
            }}>
              <div style={{
                padding: '2rem 1.5rem',
                borderRadius: '1rem',
                backgroundColor: 'white',
                boxShadow: '0 8px 24px rgba(53, 91, 69, 0.15)',
                border: '2px solid #86efac',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📅</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.75rem', fontFamily: 'Inter, sans-serif' }}>
                  Reservations
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.6', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                  Streamlined booking system with calendar management
                </p>
              </div>
              <div style={{
                padding: '2rem 1.5rem',
                borderRadius: '1rem',
                backgroundColor: 'white',
                boxShadow: '0 8px 24px rgba(53, 91, 69, 0.15)',
                border: '2px solid #86efac',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>💳</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.75rem', fontFamily: 'Inter, sans-serif' }}>
                  Payments
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.6', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                  Automated fee collection and deposit processing
                </p>
              </div>
              <div style={{
                padding: '2rem 1.5rem',
                borderRadius: '1rem',
                backgroundColor: 'white',
                boxShadow: '0 8px 24px rgba(53, 91, 69, 0.15)',
                border: '2px solid #86efac',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🧹</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.75rem', fontFamily: 'Inter, sans-serif' }}>
                  Management
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.6', fontFamily: 'Inter, sans-serif', margin: 0 }}>
                  Automated cleaning coordination and notifications
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section style={{
          padding: '6rem 1rem',
          backgroundColor: 'white',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '1rem',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
          }}>
            The Problem
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            margin: '0 auto 3rem',
            maxWidth: '800px',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
            lineHeight: '1.8'
          }}>
            Multiple communication systems and methods, offline or disconnected calendars, missed payments, no interconnected solutions
          </p>
          <div style={{
            padding: '3rem 2rem',
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 8px 24px rgba(53, 91, 69, 0.15)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '3rem'
            }}>
              <div>
                <div style={{
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#dc2626',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <span>❌</span>
                  <span>The Old Fragmented Way</span>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem'
                }}>
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      📅 Availability Check
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      <span>📞</span>
                      <span>Phone tag with residents</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      <span>✉️</span>
                      <span>Email back and forth</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      <span>💬</span>
                      <span>Text message chains</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      <span>📒</span>
                      <span>Private physical calendar</span>
                    </div>
                  </div>
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      🧹 Cleaning Coordination
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      <span>📞</span>
                      <span>Calls to janitorial staff</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      <span>✉️</span>
                      <span>Email confirmations</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      <span>💬</span>
                      <span>Text reminders</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      <span>❓</span>
                      <span>Manual status tracking</span>
                    </div>
                  </div>
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      📝 Booking Management
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      <span>📞</span>
                      <span>Callback confirmations</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      <span>✉️</span>
                      <span>Email confirmations</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      <span>📝</span>
                      <span>Manual calendar updates</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      <span>🔄</span>
                      <span>Multiple system updates</span>
                    </div>
                  </div>
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      💳 Payment Processing
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      <span>💰</span>
                      <span>Physical check collection</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      <span>📧</span>
                      <span>Payment reminder emails</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      <span>💳</span>
                      <span>Manual Square charges</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Inter, sans-serif' }}>
                      <span>📊</span>
                      <span>Manual payment tracking</span>
                    </div>
                  </div>
                </div>
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '0.5rem',
                  padding: '2rem',
                  marginTop: '1.5rem'
                }}>
                  <h4 style={{
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: '#1f2937',
                    margin: '0 0 1.25rem 0',
                    textAlign: 'center',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    ⚠️ The Problems
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      background: 'white',
                      padding: '1rem',
                      borderRadius: '0.5rem'
                    }}>
                      <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>⏰</div>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500, fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>
                        Hours wasted on back-and-forth communication
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      background: 'white',
                      padding: '1rem',
                      borderRadius: '0.5rem'
                    }}>
                      <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>❌</div>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500, fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>
                        Double bookings from calendar mismanagement
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      background: 'white',
                      padding: '1rem',
                      borderRadius: '0.5rem'
                    }}>
                      <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>😤</div>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500, fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>
                        Frustrated residents with slow response times
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      background: 'white',
                      padding: '1rem',
                      borderRadius: '0.5rem'
                    }}>
                      <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>💸</div>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500, fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>
                        Lost revenue from payment tracking errors
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solution */}
        <section style={{
          padding: '6rem 1rem',
          backgroundColor: '#f9fafb',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '1rem',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
          }}>
            The Solution
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            margin: '0 auto 3rem',
            maxWidth: '800px',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
            lineHeight: '1.8'
          }}>
            Neighbri. One Platform. Everything Integrated.
          </p>
          <div style={{
            padding: '3rem 2rem',
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 8px 24px rgba(53, 91, 69, 0.15)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '3rem'
            }}>
              <div>
                <div style={{
                  background: 'linear-gradient(135deg, #f0f4f1 0%, #e6f5ed 100%)',
                  border: '2px solid #355B45',
                  borderRadius: '0.75rem',
                  padding: '3rem',
                  position: 'relative',
                  boxShadow: '0 8px 24px rgba(53, 91, 69, 0.15)'
                }}>
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '2rem'
                  }}>
                    <h2 style={{
                      fontSize: '2.5rem',
                      fontWeight: 700,
                      color: '#355B45',
                      margin: 0,
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Neighbri
                    </h2>
                    <p style={{
                      fontSize: '1.125rem',
                      color: '#355B45',
                      margin: '0.5rem 0 0 0',
                      fontWeight: 500,
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      All-in-One HOA Management
                    </p>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1.5rem',
                    marginTop: '2rem'
                  }}>
                    <div style={{
                      background: 'white',
                      borderRadius: '0.5rem',
                      padding: '1.5rem',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📅</div>
                      <h4 style={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: '#1f2937',
                        margin: '0 0 0.75rem 0',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Real-Time Calendar
                      </h4>
                      <p style={{
                        fontSize: '0.9rem',
                        color: '#6b7280',
                        margin: 0,
                        lineHeight: 1.8,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Residents see live availability and book instantly—no calls needed
                      </p>
                    </div>
                    <div style={{
                      background: 'white',
                      borderRadius: '0.5rem',
                      padding: '1.5rem',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧹</div>
                      <h4 style={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: '#1f2937',
                        margin: '0 0 0.75rem 0',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Automated Cleaning
                      </h4>
                      <p style={{
                        fontSize: '0.9rem',
                        color: '#6b7280',
                        margin: 0,
                        lineHeight: 1.8,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Janitorial staff get automatic notifications with all booking details
                      </p>
                    </div>
                    <div style={{
                      background: 'white',
                      borderRadius: '0.5rem',
                      padding: '1.5rem',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✅</div>
                      <h4 style={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: '#1f2937',
                        margin: '0 0 0.75rem 0',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Instant Confirmation
                      </h4>
                      <p style={{
                        fontSize: '0.9rem',
                        color: '#6b7280',
                        margin: 0,
                        lineHeight: 1.8,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Automatic confirmations sent to all parties—zero manual work
                      </p>
                    </div>
                    <div style={{
                      background: 'white',
                      borderRadius: '0.5rem',
                      padding: '1.5rem',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💳</div>
                      <h4 style={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        color: '#1f2937',
                        margin: '0 0 0.75rem 0',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Integrated Payments
                      </h4>
                      <p style={{
                        fontSize: '0.9rem',
                        color: '#6b7280',
                        margin: 0,
                        lineHeight: 1.8,
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        Secure payment processing at booking—no chasing checks
                      </p>
                    </div>
                  </div>
                  <div style={{
                    background: '#f0f4f1',
                    border: '1px solid #86efac',
                    borderRadius: '0.5rem',
                    padding: '2rem',
                    marginTop: '2rem'
                  }}>
                    <h4 style={{
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      color: '#1f2937',
                      margin: '0 0 1.25rem 0',
                      textAlign: 'center',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      🎯 The Results
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '1rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        background: 'white',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>⚡</div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500, fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>
                          Booking takes 2 minutes, not 2 days
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        background: 'white',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>🎉</div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500, fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>
                          Zero double bookings or conflicts
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        background: 'white',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>😊</div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500, fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>
                          Happy residents with 24/7 self-service
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        background: 'white',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>💰</div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500, fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>
                          100% payment collection rate
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        background: 'white',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>⏰</div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500, fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>
                          Staff saves 10+ hours per week
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        background: 'white',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>📊</div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: 500, fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>
                          Complete transparency and reporting
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Now */}
        <section style={{
          padding: '6rem 1rem',
          backgroundColor: 'white',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '3rem',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
          }}>
            Why Now
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📱</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '0.75rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Digital Transformation
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif',
                margin: 0
              }}>
                Communities are ready for modern, cloud-based solutions. Residents expect seamless digital experiences in all aspects of their lives.
              </p>
            </div>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💰</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '0.75rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Cost Pressure
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif',
                margin: 0
              }}>
                HOAs are looking for ways to reduce administrative overhead while improving resident satisfaction. Automation is the answer.
              </p>
            </div>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏗️</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '0.75rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Growing Market
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif',
                margin: 0
              }}>
                Over 370,000 HOAs and 210,000 multifamily properties in the U.S., with 60% having shared amenities requiring management.
              </p>
            </div>
          </div>
        </section>

        {/* Market Potential */}
        <section style={{
          padding: '6rem 1rem',
          backgroundColor: 'white',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '1rem',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
          }}>
            Market Potential
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#355B45',
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: '3rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            From Total Market to Target Segment
          </p>

          {/* Target Market Definition */}
          <div style={{
            padding: '2rem',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
            border: '2px solid #355B45',
            marginBottom: '3rem'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Target Market Definition
            </h3>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.8',
              marginBottom: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <strong>Neighbri serves Class A and amenity-rich properties with reservable amenities:</strong>
            </p>
            <ul style={{
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li>Higher HOA/condo fees ($500+/month average)</li>
              <li>Professional property management</li>
              <li>Significant amenity budgets</li>
              <li>Residents with high expectations for service quality</li>
              <li>Complex reservation and payment requirements</li>
              <li>Premium amenities: pools, clubrooms, tennis courts, fitness centers, event spaces</li>
            </ul>
          </div>

          {/* Market Funnel */}
          <div style={{
            padding: '3rem 2rem',
            borderRadius: '0.5rem',
            backgroundColor: '#1e3a8a',
            color: 'white',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '2.5rem',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif'
            }}>
              Total Addressable Landscape
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              marginBottom: '2.5rem'
            }}>
              {/* HOAs Card */}
              <div style={{
                padding: '1.75rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  370,000+
                </div>
                <p style={{
                  fontSize: '1rem',
                  opacity: 0.9,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600
                }}>
                  Total HOAs in the United States
                </p>
                <p style={{
                  fontSize: '0.9rem',
                  opacity: 0.8,
                  lineHeight: '1.5',
                  fontFamily: 'Inter, sans-serif',
                  margin: 0
                }}>
                  Source:{' '}
                  <a 
                    href="https://www.caionline.org/AboutCommunityAssociations/Pages/StatisticalInformation.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#93c5fd',
                      textDecoration: 'underline',
                      fontWeight: 500
                    }}
                  >
                    Community Associations Institute
                  </a>
                </p>
              </div>

              {/* Multifamily Card */}
              <div style={{
                padding: '1.75rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  210,000
                </div>
                <p style={{
                  fontSize: '1rem',
                  opacity: 0.9,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600
                }}>
                  Total Multifamily Properties
                </p>
                <p style={{
                  fontSize: '0.9rem',
                  opacity: 0.8,
                  lineHeight: '1.5',
                  fontFamily: 'Inter, sans-serif',
                  marginBottom: '0.25rem'
                }}>
                  Apartment communities and rental properties
                </p>
                <p style={{
                  fontSize: '0.85rem',
                  opacity: 0.7,
                  lineHeight: '1.5',
                  fontStyle: 'italic',
                  fontFamily: 'Inter, sans-serif',
                  margin: 0
                }}>
                  Estimate based on{' '}
                  <a 
                    href="https://www.census.gov/data/tables/time-series/demo/construction/housing-characteristics.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#93c5fd',
                      textDecoration: 'underline',
                      fontWeight: 500
                    }}
                  >
                    U.S. Census data
                  </a>
                  {' '}and industry analysis
                </p>
              </div>
            </div>

            {/* Summary Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}>
              <div style={{
                padding: '1.75rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  fontFamily: 'Inter, sans-serif',
                  color: '#93c5fd'
                }}>
                  580,000
                </div>
                <p style={{
                  fontSize: '1rem',
                  opacity: 0.9,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600
                }}>
                  Total Market
                </p>
                <p style={{
                  fontSize: '0.9rem',
                  opacity: 0.8,
                  lineHeight: '1.5',
                  fontFamily: 'Inter, sans-serif',
                  margin: 0
                }}>
                  (370,000 HOAs + 210,000 multifamily)
                </p>
              </div>

              <div style={{
                padding: '1.75rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  marginBottom: '0.75rem',
                  fontFamily: 'Inter, sans-serif',
                  color: '#93c5fd'
                }}>
                  345,000
                </div>
                <p style={{
                  fontSize: '1rem',
                  opacity: 0.9,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600
                }}>
                  Amenity-Rich Subset
                </p>
                <p style={{
                  fontSize: '0.9rem',
                  opacity: 0.8,
                  lineHeight: '1.5',
                  fontFamily: 'Inter, sans-serif',
                  margin: 0
                }}>
                  (220,000 HOAs + 125,000 multifamily with shared amenities)
                </p>
              </div>
            </div>
          </div>

          {/* TAM, SAM, SOM */}
          <div style={{
            padding: '3rem 2rem',
            borderRadius: '0.5rem',
            backgroundColor: '#355B45',
            color: 'white',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '2rem',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif'
            }}>
              Market Sizing
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}>
              <div style={{
                padding: '2rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  TAM
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif',
                  color: '#86efac'
                }}>
                  $690M+
                </div>
                <p style={{
                  fontSize: '1rem',
                  opacity: 0.9,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600
                }}>
                  Total Addressable Market
                </p>
                <p style={{
                  fontSize: '0.9rem',
                  opacity: 0.8,
                  lineHeight: '1.6',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  345,000 amenity-rich communities × $2,000/year avg subscription
                </p>
              </div>

              <div style={{
                padding: '2rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  SAM
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif',
                  color: '#86efac'
                }}>
                  $340M+
                </div>
                <p style={{
                  fontSize: '1rem',
                  opacity: 0.9,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600
                }}>
                  Serviceable Addressable Market
                </p>
                <p style={{
                  fontSize: '0.9rem',
                  opacity: 0.8,
                  lineHeight: '1.6',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  170,000 communities in top 50 MSAs × $2,000/year avg subscription
                </p>
              </div>

              <div style={{
                padding: '2rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  SOM
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif',
                  color: '#86efac'
                }}>
                  $17-34M
                </div>
                <p style={{
                  fontSize: '1rem',
                  opacity: 0.9,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600
                }}>
                  Serviceable Obtainable Market
                </p>
                <p style={{
                  fontSize: '0.9rem',
                  opacity: 0.8,
                  lineHeight: '1.6',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  5-10% of SAM over 5-7 years → 8,500-17,000 communities → $17-34M annual platform revenue
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Business Model */}
        <section style={{
          padding: '6rem 1rem',
          backgroundColor: 'white',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '3rem',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
          }}>
            Business Model
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              border: '2px solid #355B45',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#355B45',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                SaaS Subscription
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.8',
                fontFamily: 'Inter, sans-serif',
                marginBottom: '1rem'
              }}>
                Monthly subscription fees based on community size and feature tier:
              </p>
              <ul style={{
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.8',
                fontFamily: 'Inter, sans-serif',
                paddingLeft: '1.25rem',
                margin: 0
              }}>
                <li><strong>Basic:</strong> $99/month - Essential reservation management</li>
                <li><strong>Standard:</strong> $180/month - Full feature set (average)</li>
                <li><strong>Premium:</strong> $299/month - Advanced features + priority support</li>
              </ul>
            </div>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              border: '2px solid #355B45',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#355B45',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Recurring Revenue
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.8',
                fontFamily: 'Inter, sans-serif',
                marginBottom: '1rem'
              }}>
                Predictable monthly recurring revenue (MRR) with high retention rates typical of property management software.
              </p>
              <div style={{
                padding: '1rem',
                backgroundColor: '#f0f4f1',
                borderRadius: '0.5rem',
                marginTop: '1rem'
              }}>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#1f2937',
                  fontFamily: 'Inter, sans-serif',
                  margin: 0
                }}>
                  <strong>Example:</strong> 100 communities at $180/month average = $216,000 annual recurring revenue
                </p>
              </div>
            </div>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              border: '2px solid #355B45',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#355B45',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Value Proposition
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.8',
                fontFamily: 'Inter, sans-serif',
                margin: 0
              }}>
                Neighbri saves property management staff 10+ hours per week while eliminating double bookings, payment friction, and administrative burden. The ROI is clear: reduced labor costs and improved resident satisfaction.
              </p>
            </div>
          </div>
        </section>

        {/* Financials */}
        <section style={{
          padding: '6rem 1rem',
          backgroundColor: '#f9fafb',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '3rem',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
          }}>
            Financial Projections
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              border: '2px solid #355B45',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#355B45',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Year 1
              </h3>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                200
              </div>
              <div style={{
                fontSize: '1rem',
                color: '#6b7280',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Communities
              </div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#355B45',
                fontFamily: 'Inter, sans-serif'
              }}>
                $432K ARR
              </div>
            </div>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              border: '2px solid #355B45',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#355B45',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Year 2
              </h3>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                800-1,000
              </div>
              <div style={{
                fontSize: '1rem',
                color: '#6b7280',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Communities
              </div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#355B45',
                fontFamily: 'Inter, sans-serif'
              }}>
                $1.7-2.2M ARR
              </div>
            </div>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              border: '2px solid #355B45',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#355B45',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Year 3-5
              </h3>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                3,000-5,000
              </div>
              <div style={{
                fontSize: '1rem',
                color: '#6b7280',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Communities
              </div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#355B45',
                fontFamily: 'Inter, sans-serif'
              }}>
                $6.5-10.8M ARR
              </div>
            </div>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              border: '2px solid #355B45',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#355B45',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Year 6-7
              </h3>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                8,500-17,000
              </div>
              <div style={{
                fontSize: '1rem',
                color: '#6b7280',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Communities
              </div>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#355B45',
                fontFamily: 'Inter, sans-serif'
              }}>
                $17-34M ARR
              </div>
            </div>
          </div>
          <div style={{
            padding: '2rem',
            borderRadius: '0.5rem',
            backgroundColor: '#f0f4f1',
            border: '1px solid #355B45'
          }}>
            <h4 style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Growth Projection Methodology
            </h4>
            <p style={{
              color: '#6b7280',
              fontSize: '0.95rem',
              lineHeight: '1.8',
              fontFamily: 'Inter, sans-serif',
              marginBottom: '1rem'
            }}>
              <strong>Year 1 Assumptions:</strong> Aggressive promotional efforts including free software trials, extended trial periods, referral incentives, targeted marketing to property management companies, and direct outreach to HOA boards. Focus on establishing strong case studies and word-of-mouth referrals.
            </p>
            <p style={{
              color: '#6b7280',
              fontSize: '0.95rem',
              lineHeight: '1.8',
              fontFamily: 'Inter, sans-serif',
              margin: 0
            }}>
              <strong>Year 2+ Assumptions:</strong> Expanded sales team, improved conversion rates (8-12%), strong word-of-mouth referrals, property management partnerships, multi-region expansion, and established brand presence.
            </p>
          </div>
        </section>

        {/* Team */}
        <section style={{
          padding: '6rem 1rem',
          backgroundColor: 'white',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '3rem',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
          }}>
            Team
          </h2>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            padding: '3rem',
            backgroundColor: '#f9fafb',
            borderRadius: '0.75rem',
            border: '2px solid #355B45',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#1f2937',
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Ryan Crosby
            </h3>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              lineHeight: '1.8',
              fontFamily: 'Inter, sans-serif',
              margin: 0
            }}>
              Deep experience in product management and technical program management. Combined with a deep understanding of HOA management through family real estate development and management portfolio. Passionate about solving real-world problems with technology.
            </p>
          </div>
        </section>

        {/* Competition/Alternatives */}
        <section style={{
          padding: '6rem 1rem',
          backgroundColor: '#f9fafb',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '3rem',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
          }}>
            Competition & Alternatives
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Generic Property Management Software
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.8',
                fontFamily: 'Inter, sans-serif',
                margin: 0
              }}>
                Most property management platforms offer basic calendar functionality but lack specialized features for amenity reservations, cleaning coordination, and integrated payments. Neighbri is purpose-built for amenity management.
              </p>
            </div>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Manual Processes
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.8',
                fontFamily: 'Inter, sans-serif',
                margin: 0
              }}>
                Many communities still rely on email, phone calls, and physical calendars. This approach is time-consuming, error-prone, and doesn't scale. Neighbri automates these processes end-to-end.
              </p>
            </div>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Custom Solutions
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.8',
                fontFamily: 'Inter, sans-serif',
                margin: 0
              }}>
                Some larger communities build custom solutions, but these are expensive to develop and maintain. Neighbri provides enterprise-grade features at a fraction of the cost with continuous updates and support.
              </p>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section style={{
          padding: '6rem 1rem',
          backgroundColor: 'white',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '3rem',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
          }}>
            Vision
          </h2>
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '3rem',
            backgroundColor: '#f0f4f1',
            borderRadius: '0.75rem',
            border: '2px solid #355B45',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '1.5rem',
              color: '#1f2937',
              lineHeight: '1.9',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              marginBottom: '2rem'
            }}>
              Neighbri transforms amenity management from a time-consuming burden into a streamlined, automated process.
            </p>
            <p style={{
              fontSize: '1.125rem',
              color: '#6b7280',
              lineHeight: '1.8',
              fontFamily: 'Inter, sans-serif',
              margin: 0
            }}>
              Our vision is to become the standard platform for amenity management across all Class A and amenity-rich properties in the United States. We're building a future where property managers spend less time on administrative tasks and more time creating exceptional resident experiences, while residents enjoy seamless, 24/7 access to their community amenities.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PitchDeckAmenityManager;

