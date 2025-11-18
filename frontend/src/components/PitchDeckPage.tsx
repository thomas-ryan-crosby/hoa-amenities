import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from './LandingHeader';

const PitchDeckPage: React.FC = () => {
  const navigate = useNavigate();
  const [businessModel, setBusinessModel] = useState<'amenityManagement' | 'dayPassPlatform'>('amenityManagement');
  const [showGTVTooltip, setShowGTVTooltip] = useState(false);

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
        {/* Business Model Selector */}
        <section style={{
          padding: '0.75rem 1rem',
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem'
          }}>
            <span style={{
              fontSize: '0.875rem',
              color: '#6b7280',
              fontFamily: 'Inter, sans-serif',
              marginRight: '0.25rem'
            }}>
              Model:
            </span>
            <button
              onClick={() => setBusinessModel('amenityManagement')}
              style={{
                padding: '0.4rem 0.75rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                borderRadius: '0.375rem',
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: businessModel === 'amenityManagement' ? '#355B45' : 'white',
                color: businessModel === 'amenityManagement' ? 'white' : '#6b7280',
                borderColor: businessModel === 'amenityManagement' ? '#355B45' : '#d1d5db'
              }}
              onMouseEnter={(e) => {
                if (businessModel !== 'amenityManagement') {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }
              }}
              onMouseLeave={(e) => {
                if (businessModel !== 'amenityManagement') {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }
              }}
            >
              A) Amenity Management
            </button>
            <button
              onClick={() => setBusinessModel('dayPassPlatform')}
              style={{
                padding: '0.4rem 0.75rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                fontFamily: 'Inter, sans-serif',
                borderRadius: '0.375rem',
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: businessModel === 'dayPassPlatform' ? '#355B45' : 'white',
                color: businessModel === 'dayPassPlatform' ? 'white' : '#6b7280',
                borderColor: businessModel === 'dayPassPlatform' ? '#355B45' : '#d1d5db'
              }}
              onMouseEnter={(e) => {
                if (businessModel !== 'dayPassPlatform') {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }
              }}
              onMouseLeave={(e) => {
                if (businessModel !== 'dayPassPlatform') {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }
              }}
            >
              B) Day Pass Platform
            </button>
          </div>
        </section>

        {/* Title Slide */}
        <section style={{
          padding: '8rem 1rem',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          minHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f0f9ff 0%, #f0f4f1 50%, #ffffff 100%)',
          borderRadius: '1rem',
          marginTop: '2rem',
          marginBottom: '4rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative background elements */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(53, 91, 69, 0.1) 0%, transparent 70%)',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-50px',
            left: '-50px',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(53, 91, 69, 0.08) 0%, transparent 70%)',
            zIndex: 0
          }} />
          
          <div style={{ 
            marginBottom: '3rem',
            position: 'relative',
            zIndex: 1
          }}>
            <img 
              src="/images/Neighbri_Wordmark_Final.png" 
              alt="Neighbri"
              style={{ 
                height: '100px', 
                maxWidth: '450px',
                margin: '0 auto',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }}
            />
          </div>
          <h1 style={{
            fontSize: '5.5rem',
            fontWeight: 800,
            color: '#1f2937',
            marginBottom: '1.5rem',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
            position: 'relative',
            zIndex: 1,
            textShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            Neighborhood Amenities, Simplified
          </h1>
          <p style={{
            fontSize: '1.5rem',
            color: '#4b5563',
            maxWidth: '800px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.9',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            position: 'relative',
            zIndex: 1
          }}>
            Neighbri streamlines amenity reservations and management for communities. Amenities such as clubrooms, pools, and more can be booked, cleaned, and managed with ease.
          </p>
          {/* Feature Bubbles */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            maxWidth: '900px',
            margin: '3rem auto 0',
            position: 'relative',
            zIndex: 1
          }}>
            {/* Reservations Feature */}
            <div style={{
              padding: '2rem 1.5rem',
              borderRadius: '1rem',
              backgroundColor: 'white',
              boxShadow: '0 8px 24px rgba(53, 91, 69, 0.15)',
              border: '2px solid #86efac',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(53, 91, 69, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(53, 91, 69, 0.15)';
            }}
            >
              <div style={{
                fontSize: '3.5rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80px'
              }}>
                📅
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '0.75rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Reservations
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif',
                margin: 0
              }}>
                Streamlined booking system with calendar management
              </p>
            </div>

            {/* Payments Feature */}
            <div style={{
              padding: '2rem 1.5rem',
              borderRadius: '1rem',
              backgroundColor: 'white',
              boxShadow: '0 8px 24px rgba(53, 91, 69, 0.15)',
              border: '2px solid #86efac',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(53, 91, 69, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(53, 91, 69, 0.15)';
            }}
            >
              <div style={{
                fontSize: '3.5rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80px'
              }}>
                💳
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '0.75rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Payments
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif',
                margin: 0
              }}>
                Automated fee collection and deposit processing
              </p>
            </div>

            {/* Management Feature */}
            <div style={{
              padding: '2rem 1.5rem',
              borderRadius: '1rem',
              backgroundColor: 'white',
              boxShadow: '0 8px 24px rgba(53, 91, 69, 0.15)',
              border: '2px solid #86efac',
              textAlign: 'center',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(53, 91, 69, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(53, 91, 69, 0.15)';
            }}
            >
              <div style={{
                fontSize: '3.5rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80px'
              }}>
                ⚙️
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#1f2937',
                marginBottom: '0.75rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Management
              </h3>
              <p style={{
                color: '#6b7280',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif',
                margin: 0
              }}>
                Complete administrative oversight and control
              </p>
            </div>
          </div>

          {/* Additional feature for day pass platform */}
          {businessModel === 'dayPassPlatform' && (
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem 2rem',
              borderRadius: '1rem',
              backgroundColor: 'rgba(53, 91, 69, 0.1)',
              border: '2px solid #355B45',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '0.75rem'
              }}>
                🎫
              </div>
              <p style={{
                color: '#1f2937',
                fontSize: '1.1rem',
                lineHeight: '1.7',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                margin: 0
              }}>
                <strong>Plus:</strong> Monetize idle amenities through day passes for non-residents, creating new revenue streams
              </p>
            </div>
          )}
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
            marginBottom: '3rem',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
          }}>
            The Problem
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📧</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Manual Processes
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.8',
                fontFamily: 'Inter, sans-serif'
              }}>
                Class A and amenity-rich properties rely on email chains, spreadsheets, and phone calls to manage premium amenities, 
                leading to double-bookings and resident dissatisfaction.
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💸</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Payment Friction
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.8',
                fontFamily: 'Inter, sans-serif'
              }}>
                Collecting fees and deposits requires manual processing, checks, and cash handling, creating administrative burden.
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⏰</div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Time-Consuming
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.8',
                fontFamily: 'Inter, sans-serif'
              }}>
                Staff spend hours coordinating reservations, managing calendars, and handling janitorial scheduling manually.
              </p>
            </div>
          </div>
            {businessModel === 'dayPassPlatform' && (
              <div style={{
                padding: '2rem',
                borderRadius: '0.5rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                marginBottom: '2rem'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💰</div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#1f2937',
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Untapped Revenue Opportunity
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.8',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Premium amenities sit idle 80-90% of the time, representing billions in unrealized revenue. Communities 
                  lack the infrastructure to safely monetize day passes to non-residents, missing out on a proven market 
                  validated by Swimply ($160k+ annual earnings for top hosts) and the $15.2B racquet facility rental market.
                </p>
              </div>
            )}
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f9fafb',
              border: '2px solid #355B45',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '1.25rem',
                color: '#1f2937',
                lineHeight: '1.8',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600
              }}>
                <strong>Result:</strong> {businessModel === 'amenityManagement' 
                  ? 'Frustrated residents in Class A and amenity-rich properties, overworked HOA staff, and inefficient use of premium amenities that residents pay significant fees to access.'
                  : 'Frustrated residents, overworked HOA staff, inefficient amenity use, AND billions in unrealized revenue from idle premium amenities that could be monetized through day passes.'}
              </p>
            </div>
        </section>

        {/* Solution */}
        <section style={{
          padding: '6rem 1rem',
          backgroundColor: '#355B45',
          color: 'white'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              marginBottom: '3rem',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif'
            }}>
              The Solution: Neighbri
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              <div style={{
                padding: '2rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📅</div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Intuitive Calendar
                </h3>
                <p style={{
                  lineHeight: '1.8',
                  opacity: 0.9,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Google Calendar-like interface for easy reservation management with real-time availability.
                </p>
              </div>

              <div style={{
                padding: '2rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💳</div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Integrated Payments
                </h3>
                <p style={{
                  lineHeight: '1.8',
                  opacity: '0.9',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Seamless payment processing for fees and deposits, eliminating manual payment collection.
                </p>
              </div>

              <div style={{
                padding: '2rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔔</div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Automated Workflows
                </h3>
                <p style={{
                  lineHeight: '1.8',
                  opacity: '0.9',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Automated notifications, janitorial scheduling, and approval workflows reduce administrative overhead.
                </p>
              </div>

              <div style={{
                padding: '2rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👥</div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Role-Based Access
                </h3>
                <p style={{
                  lineHeight: '1.8',
                  opacity: '0.9',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Separate interfaces for residents, janitorial staff, and administrators with appropriate permissions.
                </p>
              </div>
              
              {businessModel === 'dayPassPlatform' && (
                <>
                  <div style={{
                    padding: '2rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎫</div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      marginBottom: '1rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Day Pass Marketplace
                    </h3>
                    <p style={{
                      lineHeight: '1.8',
                      opacity: '0.9',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Enable non-residents to book day passes to premium amenities. Built-in access control, guest management, 
                      and automated revenue sharing (15-20% commission) for communities.
                    </p>
                  </div>

                  <div style={{
                    padding: '2rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      marginBottom: '1rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Resident Priority & Access Control
                    </h3>
                    <p style={{
                      lineHeight: '1.8',
                      opacity: '0.9',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Residents always get first priority. Day passes only available when residents haven't booked, with 
                      automated access verification and guest management.
                    </p>
                  </div>

                  <div style={{
                    padding: '2rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📈</div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      marginBottom: '1rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      New Revenue Stream
                    </h3>
                    <p style={{
                      lineHeight: '1.8',
                      opacity: '0.9',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Monetize idle amenity time. Communities earn revenue from day passes while maintaining resident 
                      priority and control over pricing and availability.
                    </p>
                  </div>
                </>
              )}
            </div>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '1.25rem',
                lineHeight: '1.8',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600
              }}>
                {businessModel === 'amenityManagement' 
                  ? 'Neighbri transforms amenity management from a time-consuming burden into a streamlined, automated process.'
                  : 'Neighbri transforms amenity management into a streamlined, automated process AND unlocks new revenue streams through day pass monetization, validated by Swimply ($160k+ annual earnings) and the $15.2B racquet facility market.'}
              </p>
            </div>
          </div>
        </section>

        {/* Market Opportunity */}
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
            Market Opportunity
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

          {/* Market Funnel */}
          <div style={{
            padding: '2rem',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
            border: '2px solid #355B45',
            marginBottom: '3rem'
          }}>
            <h3 style={{
              fontSize: '1.75rem',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '2rem',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif'
            }}>
              Total Addressable Landscape
            </h3>
            
            {/* Total Market */}
            <div style={{
              padding: '1.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#e0f2fe',
              border: '1px solid #7dd3fc',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: '#355B45',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    370,000+
                  </div>
                  <p style={{
                    fontSize: '1.125rem',
                    color: '#1f2937',
                    fontWeight: 600,
                    marginTop: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Total HOAs in the United States
                  </p>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    marginTop: '0.25rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Source:{' '}
                    <a 
                      href="https://www.caionline.org/AboutCommunityAssociations/Pages/StatisticalInformation.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#355B45',
                        textDecoration: 'underline',
                        fontWeight: 500
                      }}
                    >
                      Community Associations Institute
                    </a>
                  </p>
                </div>
                <div style={{
                  fontSize: '1.5rem',
                  color: '#355B45',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  +
                </div>
                <div>
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: '#355B45',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    210,000
                  </div>
                  <p style={{
                    fontSize: '1.125rem',
                    color: '#1f2937',
                    fontWeight: 600,
                    marginTop: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Total Multifamily Properties
                  </p>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    marginTop: '0.25rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Apartment communities and rental properties
                  </p>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.85rem',
                    marginTop: '0.25rem',
                    fontStyle: 'italic',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Estimate based on{' '}
                    <a 
                      href="https://www.census.gov/data/tables/time-series/demo/construction/housing-characteristics.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#355B45',
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
              <div style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #bae6fd',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '1.25rem',
                  color: '#1f2937',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  marginBottom: '0.5rem'
                }}>
                  <strong>Total Market: 580,000 properties</strong>
                </p>
                <p style={{
                  fontSize: '1rem',
                  color: '#6b7280',
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'italic'
                }}>
                  (370,000 HOAs + 210,000 multifamily)
                </p>
                <p style={{
                  fontSize: '1.125rem',
                  color: '#355B45',
                  fontWeight: 600,
                  marginTop: '0.75rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <strong>Amenity-Rich Subset: 345,000 communities</strong>
                </p>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#6b7280',
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'italic'
                }}>
                  (220,000 HOAs + 125,000 multifamily with shared amenities)
                </p>
              </div>
            </div>

          </div>

          {/* Key Market Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd'
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: 700,
                color: '#355B45',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                345K
              </div>
              <p style={{
                fontSize: '1.125rem',
                color: '#1f2937',
                fontWeight: 600,
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Target Properties
              </p>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif'
              }}>
                {businessModel === 'dayPassPlatform' 
                  ? 'Amenity-rich communities (220k HOAs + 125k multifamily) with day pass monetization potential'
                  : 'Amenity-rich communities (220k HOAs + 125k multifamily) requiring reservation & payment management'}
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd'
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: 700,
                color: '#355B45',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                $500+
              </div>
              <p style={{
                fontSize: '1.125rem',
                color: '#1f2937',
                fontWeight: 600,
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Average Monthly HOA Fee
              </p>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif'
              }}>
                Luxury properties have higher budgets and greater need for professional management tools
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd'
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: 700,
                color: '#355B45',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Premium
              </div>
              <p style={{
                fontSize: '1.125rem',
                color: '#1f2937',
                fontWeight: 600,
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Amenity Expectations
              </p>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif'
              }}>
                Pools, clubrooms, tennis courts, fitness centers, and event spaces require sophisticated management
              </p>
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
                  {businessModel === 'dayPassPlatform' ? '$2.8B' : '$690M+'}
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
                  {businessModel === 'dayPassPlatform' ? (
                    <>
                      345,000 amenity-rich communities × $40K/year avg{' '}
                      <span 
                        style={{ 
                          textDecoration: 'underline',
                          cursor: 'help',
                          color: '#86efac',
                          fontWeight: 600,
                          position: 'relative'
                        }}
                        onMouseEnter={() => setShowGTVTooltip(true)}
                        onMouseLeave={() => setShowGTVTooltip(false)}
                      >
                        GTV
                      </span>
                      {showGTVTooltip && (
                        <div style={{
                          position: 'absolute',
                          backgroundColor: '#1f2937',
                          color: 'white',
                          padding: '1rem',
                          borderRadius: '0.5rem',
                          fontSize: '0.85rem',
                          maxWidth: '300px',
                          zIndex: 1000,
                          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                          marginTop: '0.5rem',
                          marginLeft: '-150px',
                          lineHeight: '1.6',
                          fontFamily: 'Inter, sans-serif'
                        }}>
                          <strong>GTV (Gross Transaction Value):</strong><br/>
                          The total dollar value of all day pass bookings processed through the platform before platform fees are deducted.<br/><br/>
                          <strong>Calculation:</strong> Number of bookings × Average booking price = GTV<br/>
                          <strong>Example:</strong> 30 bookings/month × $50/day × 12 months = $18,000/year GTV per community<br/><br/>
                          Platform revenue = GTV × Commission rate (15-20%)
                        </div>
                      )}
                      {' '}→ $2.8B platform revenue (20% take rate)
                    </>
                  ) : (
                    '345,000 amenity-rich communities × $2,000/year avg subscription'
                  )}
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
                  {businessModel === 'dayPassPlatform' ? '$1.4B' : '$340M+'}
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
                  {businessModel === 'dayPassPlatform'
                    ? '170,000 communities in top 50 MSAs × $40K/year GTV → $1.4B platform revenue'
                    : '170,000 communities in top 50 MSAs × $2,000/year avg subscription'}
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
                  {businessModel === 'dayPassPlatform' ? '$70-140M' : '$17-34M'}
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
                  {businessModel === 'dayPassPlatform'
                    ? '5-10% of SAM over 5-7 years → $70-140M annual platform revenue'
                    : '5-10% of SAM over 5-7 years → $17-34M annual platform revenue'}
                </p>
              </div>
            </div>
            <div style={{
              marginTop: '2rem',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '0.9rem',
                opacity: 0.9,
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif'
              }}>
                <strong>Note:</strong> {businessModel === 'dayPassPlatform'
                  ? 'Day Pass Platform: Revenue includes subscription fees ($2,000/year) plus 15-20% commission on day pass GTV. Based on $7-21B total GTV opportunity across 345,000 amenity-rich communities.'
                  : 'Amenity Management Platform: Revenue projections based on subscription fees only.'}
              </p>
            </div>
          </div>

          {/* Business Model Details */}
          <div style={{
            padding: '2rem',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
            border: '2px solid #355B45',
            marginBottom: '2rem'
          }}>
            {businessModel === 'amenityManagement' ? (
              <div>
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#355B45',
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Standard Amenity Reservation System
                </h4>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.8',
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  The core Neighbri platform provides comprehensive amenity reservation management exclusively for community residents. 
                  This includes calendar-based booking, janitorial scheduling, and administrative oversight.
                </p>
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f0f4f1',
                  borderRadius: '0.25rem',
                  marginTop: '1rem'
                }}>
                  <p style={{
                    color: '#1f2937',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Revenue Sources:
                  </p>
                  <ul style={{
                    color: '#6b7280',
                    lineHeight: '1.8',
                    paddingLeft: '1.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    <li>SaaS subscription fees ($99-$299/month per community)</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#355B45',
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  HOAPass: Day Pass & Guest Reservation System
                </h4>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.8',
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  HOAPass extends Neighbri's platform to allow non-residents and guests to book day passes or reservations 
                  for HOA amenities. Similar to ResortPass (which serves hospitality assets), HOAPass enables Class A and amenity-rich properties 
                  to monetize their premium amenities by offering access to outsiders, creating a new revenue stream for HOAs 
                  while maintaining resident priority and access control.
                </p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.5rem',
                  marginTop: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '0.5rem',
                    border: '1px solid #bae6fd'
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      marginBottom: '0.5rem'
                    }}>💰</div>
                    <h5 style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: '#1f2937',
                      marginBottom: '0.5rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      New Revenue Stream
                    </h5>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      HOAs can generate additional income by selling day passes to non-residents for pools, clubrooms, 
                      fitness centers, and other premium amenities
                    </p>
                  </div>

                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '0.5rem',
                    border: '1px solid #bae6fd'
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      marginBottom: '0.5rem'
                    }}>🎯</div>
                    <h5 style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: '#1f2937',
                      marginBottom: '0.5rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Resident Priority
                    </h5>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      System ensures residents always have priority access, with guest/day pass availability only during 
                      non-peak times or designated slots
                    </p>
                  </div>

                  <div style={{
                    padding: '1.5rem',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '0.5rem',
                    border: '1px solid #bae6fd'
                  }}>
                    <div style={{
                      fontSize: '2rem',
                      marginBottom: '0.5rem'
                    }}>🔒</div>
                    <h5 style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: '#1f2937',
                      marginBottom: '0.5rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Access Control
                    </h5>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Built-in verification and check-in system ensures only authorized guests access amenities, with 
                      digital passes and visitor management
                    </p>
                  </div>
                </div>

                <div style={{
                  padding: '1.5rem',
                  backgroundColor: '#f0f4f1',
                  borderRadius: '0.5rem',
                  marginTop: '1.5rem',
                  border: '1px solid #355B45'
                }}>
                  <p style={{
                    color: '#1f2937',
                    fontWeight: 600,
                    marginBottom: '0.75rem',
                    fontSize: '1.125rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    HOAPass Revenue Model:
                  </p>
                  <ul style={{
                    color: '#6b7280',
                    lineHeight: '1.8',
                    paddingLeft: '1.5rem',
                    marginBottom: '1rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    <li><strong>Day Pass Sales:</strong> HOAs set pricing for day passes (e.g., $25-75/day for pool access, $50-150 for clubroom rental)</li>
                    <li><strong>Revenue Share:</strong> Neighbri takes a percentage of day pass sales (e.g., 15-20%) as platform fee</li>
                    <li><strong>Premium Features:</strong> Advanced guest management, marketing tools, and analytics available as add-ons</li>
                  </ul>
                  <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: 'white',
                    borderRadius: '0.25rem',
                    border: '1px solid #cbd5e1'
                  }}>
                    <p style={{
                      color: '#1f2937',
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      Market Opportunity Example:
                    </p>
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      A luxury community with a pool and clubroom could generate $20,000-60,000+ annually in day pass GTV 
                      (depending on capacity, pricing, and booking volume), creating a new revenue stream that helps offset HOA fees or fund 
                      amenity improvements. With 345,000 target communities, this represents a significant additional market opportunity.
                    </p>
                  </div>
                </div>

                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#fef3c7',
                  borderRadius: '0.5rem',
                  border: '1px solid #fbbf24'
                }}>
                  <p style={{
                    color: '#92400e',
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    fontFamily: 'Inter, sans-serif',
                    margin: 0
                  }}>
                    <strong>Note:</strong> HOAPass is an optional add-on feature. Communities can use Neighbri's standard 
                    reservation system exclusively for residents, or enable HOAPass to monetize amenities through guest access. 
                    The platform supports both models seamlessly.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* HOAPass vs ResortPass Comparison - Only show for Day Pass Platform */}
          {businessModel === 'dayPassPlatform' && (
          <div style={{
            padding: '2rem',
            borderRadius: '0.5rem',
            backgroundColor: '#f0f9ff',
            border: '2px solid #0ea5e9',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.75rem',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '1.5rem',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center'
            }}>
              HOAPass vs. ResortPass: Market Comparison
            </h3>
            
            <div style={{
              overflowX: 'auto',
              marginBottom: '1.5rem'
            }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                overflow: 'hidden'
              }}>
                <thead>
                  <tr style={{
                    backgroundColor: '#0ea5e9',
                    color: 'white'
                  }}>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1rem'
                    }}>Metric</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1rem'
                    }}>HOAPass (Neighbri)</th>
                    <th style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '1rem'
                    }}>ResortPass</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb'
                  }}>
                    <td style={{
                      padding: '1rem',
                      fontWeight: 600,
                      color: '#1f2937',
                      fontFamily: 'Inter, sans-serif'
                    }}>Market Focus</td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>HOA/Residential Communities</td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>Hotels & Resorts</td>
                  </tr>
                  <tr style={{
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <td style={{
                      padding: '1rem',
                      fontWeight: 600,
                      color: '#1f2937',
                      fontFamily: 'Inter, sans-serif'
                    }}>Target Properties</td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>~345,000 amenity-rich communities</td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>900+ hotels/resorts (growing)</td>
                  </tr>
                  <tr style={{
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb'
                  }}>
                    <td style={{
                      padding: '1rem',
                      fontWeight: 600,
                      color: '#1f2937',
                      fontFamily: 'Inter, sans-serif'
                    }}>Business Model</td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {businessModel === 'dayPassPlatform' ? 'SaaS Subscription + Commission (15-20%)' : 'SaaS Subscription'}
                    </td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>Transaction-Based (Commission)</td>
                  </tr>
                  <tr style={{
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <td style={{
                      padding: '1rem',
                      fontWeight: 600,
                      color: '#1f2937',
                      fontFamily: 'Inter, sans-serif'
                    }}>Revenue per Property</td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>$8,000/year avg<br/>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        ($2,000 subscription + $6,000 commission on $40K GTV)
                      </span>
                    </td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>$18,700/year avg (estimated)<br/>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        ($16.8M revenue ÷ 900 hotels)
                      </span>
                    </td>
                  </tr>
                  <tr style={{
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb'
                  }}>
                    <td style={{
                      padding: '1rem',
                      fontWeight: 600,
                      color: '#1f2937',
                      fontFamily: 'Inter, sans-serif'
                    }}>TAM - Total Market Size (GTV)</td>
                    <td style={{
                      padding: '1rem',
                      color: '#355B45',
                      fontWeight: 600,
                      fontFamily: 'Inter, sans-serif'
                    }}>$7-21B<br/>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        345K communities × $20K-60K/year avg GTV
                      </span>
                    </td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>$50-100B+ (estimated)<br/>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        Total luxury hotel amenity revenue
                      </span>
                    </td>
                  </tr>
                  <tr style={{
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <td style={{
                      padding: '1rem',
                      fontWeight: 600,
                      color: '#1f2937',
                      fontFamily: 'Inter, sans-serif'
                    }}>TAM - Platform Revenue</td>
                    <td style={{
                      padding: '1rem',
                      color: '#355B45',
                      fontWeight: 600,
                      fontFamily: 'Inter, sans-serif'
                    }}>$2.8B<br/>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        $14B mid-case GTV × 20% take rate
                      </span>
                    </td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>$9-11B+ (estimated)<br/>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        Global luxury hotel amenities market
                      </span>
                    </td>
                  </tr>
                  <tr style={{
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <td style={{
                      padding: '1rem',
                      fontWeight: 600,
                      color: '#1f2937',
                      fontFamily: 'Inter, sans-serif'
                    }}>SAM - Platform Revenue</td>
                    <td style={{
                      padding: '1rem',
                      color: '#355B45',
                      fontWeight: 600,
                      fontFamily: 'Inter, sans-serif'
                    }}>$1.4B<br/>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        170K communities × $40K GTV × 20% take rate
                      </span>
                    </td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>$2-3B+ (estimated)<br/>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        US luxury hotel day-pass market
                      </span>
                    </td>
                  </tr>
                  <tr style={{
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb'
                  }}>
                    <td style={{
                      padding: '1rem',
                      fontWeight: 600,
                      color: '#1f2937',
                      fontFamily: 'Inter, sans-serif'
                    }}>SOM - Platform Revenue</td>
                    <td style={{
                      padding: '1rem',
                      color: '#355B45',
                      fontWeight: 600,
                      fontFamily: 'Inter, sans-serif'
                    }}>$70-140M<br/>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        5-10% of SAM over 5-7 years
                      </span>
                    </td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>$100-150M+ (estimated)<br/>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        5-10% of SAM over 5 years
                      </span>
                    </td>
                  </tr>
                  <tr style={{
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <td style={{
                      padding: '1rem',
                      fontWeight: 600,
                      color: '#1f2937',
                      fontFamily: 'Inter, sans-serif'
                    }}>Growth Rate (YoY)</td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>Early stage</td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>~40-60% (estimated)<br/>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        Based on Series B funding & expansion
                      </span>
                    </td>
                  </tr>
                  <tr style={{
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb'
                  }}>
                    <td style={{
                      padding: '1rem',
                      fontWeight: 600,
                      color: '#1f2937',
                      fontFamily: 'Inter, sans-serif'
                    }}>GMV (Gross Merchandise Value)</td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {businessModel === 'dayPassPlatform' ? (
                        <>
                          $40,000/year avg<br/>
                          <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                            Mid-case GTV per community (range: $20K-60K)
                          </span>
                        </>
                      ) : (
                        'N/A (SaaS model)'
                      )}
                    </td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>$80-120M+ (estimated)<br/>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        Assuming 15-20% commission on $16.8M revenue
                      </span>
                    </td>
                  </tr>
                  <tr style={{
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <td style={{
                      padding: '1rem',
                      fontWeight: 600,
                      color: '#1f2937',
                      fontFamily: 'Inter, sans-serif'
                    }}>Funding Raised</td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>Pre-seed/Seed stage</td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>$37.4M (Series B: $26M)</td>
                  </tr>
                  <tr style={{
                    backgroundColor: '#f9fafb'
                  }}>
                    <td style={{
                      padding: '1rem',
                      fontWeight: 600,
                      color: '#1f2937',
                      fontFamily: 'Inter, sans-serif'
                    }}>Estimated Annual Revenue</td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>Early stage</td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>~$16.8M</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
              marginTop: '1.5rem'
            }}>
              <div style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                border: '1px solid #0ea5e9'
              }}>
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#1f2937',
                  marginBottom: '0.75rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  HOAPass Advantages
                </h4>
                <ul style={{
                  color: '#6b7280',
                  lineHeight: '1.8',
                  paddingLeft: '1.25rem',
                  fontSize: '0.9rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <li>Recurring subscription revenue (predictable)</li>
                  <li>Dual revenue stream (subscription + platform fees)</li>
                  <li>Resident-first model with guest monetization</li>
                  <li>Lower customer acquisition cost (B2B sales)</li>
                  <li>Higher customer lifetime value (sticky SaaS)</li>
                </ul>
              </div>

              <div style={{
                padding: '1.5rem',
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                border: '1px solid #0ea5e9'
              }}>
                <h4 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#1f2937',
                  marginBottom: '0.75rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Market Context
                </h4>
                <ul style={{
                  color: '#6b7280',
                  lineHeight: '1.8',
                  paddingLeft: '1.25rem',
                  fontSize: '0.9rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <li>ResortPass validates day-pass model for amenities</li>
                  <li>HOAs represent untapped market (345K+ amenity-rich communities)</li>
                  <li>Different asset class = different dynamics</li>
                  <li>Large market with high per-property revenue potential</li>
                  <li>Less competition in HOA space</li>
                </ul>
              </div>
            </div>

          </div>
          )}

          <div style={{
            padding: '2rem',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
            border: '2px solid #355B45',
            marginBottom: '2rem'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Target Market Definition
            </h3>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.8',
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <strong>Neighbri serves luxury/Class A properties with reservable amenities:</strong>
            </p>
            <ul style={{
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li><strong>HOAs:</strong> Single-family home communities with shared amenities</li>
              <li><strong>Condo Complexes:</strong> Condominium buildings with common spaces and amenities</li>
              <li><strong>Multifamily Properties:</strong> Apartment communities and residential developments with reservable amenities</li>
            </ul>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.8',
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <strong>Key Characteristics:</strong>
            </p>
            <ul style={{
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li>Higher HOA/condo fees ($300+/month)</li>
              <li>Professional property management</li>
              <li>Significant amenity budgets</li>
              <li>Residents with high expectations for service quality</li>
              <li>Complex reservation and payment requirements</li>
              <li>Premium amenities: pools, clubrooms, tennis courts, fitness centers, event spaces</li>
            </ul>
          </div>
          {/* Sources Section */}
          <div style={{
            padding: '1.5rem',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            marginBottom: '2rem'
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '0.75rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Sources & Methodology
            </h4>
            <ul style={{
              color: '#6b7280',
              fontSize: '0.85rem',
              lineHeight: '1.6',
              paddingLeft: '1.5rem',
              fontFamily: 'Inter, sans-serif',
              listStyle: 'disc'
            }}>
              <li>
                HOA statistics:{' '}
                <a 
                  href="https://www.caionline.org/AboutCommunityAssociations/Pages/StatisticalInformation.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#355B45',
                    textDecoration: 'underline'
                  }}
                >
                  Community Associations Institute
                </a>
              </li>
              <li>
                Condo and multifamily estimates based on{' '}
                <a 
                  href="https://www.census.gov/data/tables/time-series/demo/construction/housing-characteristics.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#355B45',
                    textDecoration: 'underline'
                  }}
                >
                  U.S. Census Bureau housing data
                </a>
                {' '}and industry analysis
              </li>
              <li>
                Market segmentation estimates derived from property management industry reports and luxury housing market analysis
              </li>
            </ul>
          </div>

          <div style={{
            padding: '2rem',
            borderRadius: '0.5rem',
            backgroundColor: '#f0f4f1',
            border: '2px solid #355B45'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Go-to-Market Strategy
            </h3>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.8',
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Neighbri will focus on establishing a strong presence in markets with high concentrations of luxury 
              residential communities. These markets offer ideal conditions: numerous Class A developments, significant 
              amenity budgets, and residents with high service expectations.
            </p>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.8',
              fontFamily: 'Inter, sans-serif'
            }}>
              <strong>Expansion Plan:</strong> Build a strong foundation in initial markets, then expand systematically 
              to adjacent regions and eventually nationwide, targeting Class A and amenity-rich properties.
            </p>
          </div>
        </section>

        {/* Business Model */}
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
                lineHeight: '1.8',
                marginBottom: '1.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Monthly/annual subscription fees tiered by number of units/households, with amenity add-ons available.
              </p>
              <div style={{
                padding: '1rem',
                backgroundColor: '#f0f4f1',
                borderRadius: '0.25rem'
              }}>
                <p style={{
                  fontSize: '1.125rem',
                  color: '#1f2937',
                  fontFamily: 'Inter, sans-serif',
                  marginBottom: '0.75rem'
                }}>
                  <strong>Pricing Tiers (Monthly):</strong>
                </p>
                <div style={{
                  marginBottom: '0.75rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid #cbd5e1'
                }}>
                  <p style={{
                    color: '#355B45',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '0.25rem'
                  }}>
                    Starter: $99/month
                  </p>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    fontFamily: 'Inter, sans-serif',
                    marginLeft: '1rem'
                  }}>
                    • Up to 50 units/households<br/>
                    • Up to 3 amenities included
                  </p>
                </div>
                <div style={{
                  marginBottom: '0.75rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid #cbd5e1'
                }}>
                  <p style={{
                    color: '#355B45',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '0.25rem'
                  }}>
                    Professional: $199/month
                  </p>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    fontFamily: 'Inter, sans-serif',
                    marginLeft: '1rem'
                  }}>
                    • 51-150 units/households<br/>
                    • Up to 5 amenities included<br/>
                    • Priority support
                  </p>
                </div>
                <div style={{
                  marginBottom: '0.75rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid #cbd5e1'
                }}>
                  <p style={{
                    color: '#355B45',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '0.25rem'
                  }}>
                    Enterprise: $299/month
                  </p>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    fontFamily: 'Inter, sans-serif',
                    marginLeft: '1rem'
                  }}>
                    • 151-300 units/households<br/>
                    • Unlimited amenities<br/>
                    • Dedicated support
                  </p>
                </div>
                <div>
                  <p style={{
                    color: '#355B45',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    marginBottom: '0.25rem'
                  }}>
                    Custom: Contact for pricing
                  </p>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    fontFamily: 'Inter, sans-serif',
                    marginLeft: '1rem'
                  }}>
                    • 300+ units/households<br/>
                    • Enterprise features + white-label options
                  </p>
                </div>
                <p style={{
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #cbd5e1',
                  color: '#6b7280',
                  fontSize: '0.85rem',
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'italic'
                }}>
                  Additional amenities: $25/month each beyond tier limit<br/>
                  Annual billing: 15% discount (2 months free)
                </p>
              </div>
            </div>

            {businessModel === 'dayPassPlatform' && (
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
                  Day Pass Commission
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.8',
                  marginBottom: '1.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  15-20% commission on all day pass bookings from non-residents, creating a scalable revenue stream 
                  that grows with community adoption and booking volume.
                </p>
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f0f4f1',
                  borderRadius: '0.25rem'
                }}>
                  <p style={{
                    fontSize: '1.125rem',
                    color: '#1f2937',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    <strong>Revenue Model:</strong>
                  </p>
                  <p style={{
                    marginTop: '0.5rem',
                    color: '#6b7280',
                    lineHeight: '1.8',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Subscription ($2,000/year) + Commission (15-20% of day pass GTV). Average community generates 
                    $3,150/year in commission revenue from day passes.
                  </p>
                </div>
              </div>
            )}

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
                Scalable Growth
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.8',
                marginBottom: '1.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Low marginal costs per community enable profitable scaling across thousands of communities.
              </p>
              <div style={{
                padding: '1rem',
                backgroundColor: '#f0f4f1',
                borderRadius: '0.25rem'
              }}>
                <p style={{
                  fontSize: '1.125rem',
                  color: '#1f2937',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <strong>Unit Economics:</strong>
                </p>
                <p style={{
                  marginTop: '0.5rem',
                  color: '#6b7280',
                  lineHeight: '1.8',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {businessModel === 'dayPassPlatform'
                    ? 'High customer lifetime value with low churn + scalable commission revenue from day pass bookings'
                    : 'High customer lifetime value with low churn in the HOA market'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Traction */}
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
            Traction & Progress
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
              backgroundColor: '#f0fdf4',
              border: '1px solid #86efac',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: 700,
                color: '#355B45',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                ✓
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Product Built
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif'
              }}>
                Fully functional web application with all core features
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f0fdf4',
              border: '1px solid #86efac',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: 700,
                color: '#355B45',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                ✓
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Beta Testing
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif'
              }}>
                Active beta testing with real communities and users
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f0fdf4',
              border: '1px solid #86efac',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: 700,
                color: '#355B45',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                ✓
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Payment Integration
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif'
              }}>
                Payment processing fully integrated
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f0fdf4',
              border: '1px solid #86efac',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: 700,
                color: '#355B45',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                ✓
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Production Ready
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif'
              }}>
                Deployed and accessible at neighbri.com
              </p>
            </div>
          </div>
          <div style={{
            padding: '2rem',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
            border: '2px solid #355B45'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Next Steps
            </h3>
            <ul style={{
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li>Complete beta testing and gather user feedback</li>
              <li>Onboard first paying customers in target markets</li>
              <li>Build strategic partnerships with HOA management companies</li>
              <li>Expand feature set based on customer needs</li>
              <li>Scale marketing and sales efforts</li>
            </ul>
          </div>
        </section>

        {/* Technology */}
        <section style={{
          padding: '6rem 1rem',
          backgroundColor: '#1f2937',
          color: 'white'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              marginBottom: '3rem',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif'
            }}>
              Technology Stack
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem'
            }}>
              <div style={{
                padding: '2rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Frontend
                </h3>
                <p style={{
                  opacity: 0.9,
                  lineHeight: '1.8',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  React with TypeScript for a modern, responsive user experience
                </p>
              </div>

              <div style={{
                padding: '2rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Backend
                </h3>
                <p style={{
                  opacity: 0.9,
                  lineHeight: '1.8',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Node.js/Express API with robust authentication and authorization
                </p>
              </div>

              <div style={{
                padding: '2rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Database
                </h3>
                <p style={{
                  opacity: 0.9,
                  lineHeight: '1.8',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  PostgreSQL for reliable, scalable data management
                </p>
              </div>

              <div style={{
                padding: '2rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Payments
                </h3>
                <p style={{
                  opacity: 0.9,
                  lineHeight: '1.8',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Secure payment processing integration
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Competition */}
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
            Competition
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            textAlign: 'center',
            marginBottom: '3rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            How Neighbri compares to existing solutions
          </p>
          
          {/* Competitor Comparison Table */}
          <div style={{
            overflowX: 'auto',
            marginBottom: '3rem'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <thead>
                <tr style={{
                  backgroundColor: '#355B45',
                  color: 'white'
                }}>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem'
                  }}>Solution</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem'
                  }}>Type</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem'
                  }}>Limitations</th>
                  <th style={{
                    padding: '1rem',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1rem'
                  }}>Neighbri Advantage</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <td style={{
                    padding: '1rem',
                    fontWeight: 600,
                    color: '#1f2937',
                    fontFamily: 'Inter, sans-serif'
                  }}>Manual Processes</td>
                  <td style={{
                    padding: '1rem',
                    color: '#6b7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>Email, Spreadsheets, Phone</td>
                  <td style={{
                    padding: '1rem',
                    color: '#6b7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    • Double-bookings<br/>
                    • No integrated payments<br/>
                    • Time-consuming<br/>
                    • Error-prone
                  </td>
                  <td style={{
                    padding: '1rem',
                    color: '#355B45',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600
                  }}>
                    ✓ Automated system<br/>
                    ✓ Integrated payments<br/>
                    ✓ Real-time availability<br/>
                    ✓ Error-free
                  </td>
                </tr>
                <tr style={{
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: '#f9fafb'
                }}>
                  <td style={{
                    padding: '1rem',
                    fontWeight: 600,
                    color: '#1f2937',
                    fontFamily: 'Inter, sans-serif'
                  }}>Generic Property Management</td>
                  <td style={{
                    padding: '1rem',
                    color: '#6b7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>AppFolio, Buildium, TOPS</td>
                  <td style={{
                    padding: '1rem',
                    color: '#6b7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    • Over-engineered for amenity management<br/>
                    • Complex interfaces<br/>
                    • Expensive ($200-500+/month)<br/>
                    • Not amenity-focused
                  </td>
                  <td style={{
                    padding: '1rem',
                    color: '#355B45',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600
                  }}>
                    ✓ Purpose-built for amenities<br/>
                    ✓ Simple, intuitive UI<br/>
                    ✓ Affordable pricing<br/>
                    ✓ Specialized features
                  </td>
                </tr>
                <tr style={{
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <td style={{
                    padding: '1rem',
                    fontWeight: 600,
                    color: '#1f2937',
                    fontFamily: 'Inter, sans-serif'
                  }}>Calendar Booking Tools</td>
                  <td style={{
                    padding: '1rem',
                    color: '#6b7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>Calendly, Acuity, Cal.com</td>
                  <td style={{
                    padding: '1rem',
                    color: '#6b7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    • Not HOA-specific<br/>
                    • No janitorial workflows<br/>
                    • Limited payment capabilities<br/>
                    • No deposit management
                  </td>
                  <td style={{
                    padding: '1rem',
                    color: '#355B45',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600
                  }}>
                    ✓ Built for HOAs<br/>
                    ✓ Janitorial integration<br/>
                    ✓ Deposit handling<br/>
                    ✓ HOA-specific features
                  </td>
                </tr>
                <tr style={{
                  backgroundColor: '#f9fafb'
                }}>
                  <td style={{
                    padding: '1rem',
                    fontWeight: 600,
                    color: '#1f2937',
                    fontFamily: 'Inter, sans-serif'
                  }}>Legacy HOA Software</td>
                  <td style={{
                    padding: '1rem',
                    color: '#6b7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>CINC, TOPS, various</td>
                  <td style={{
                    padding: '1rem',
                    color: '#6b7280',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    • Outdated interfaces<br/>
                    • Poor user experience<br/>
                    • Limited mobile support<br/>
                    • High learning curve
                  </td>
                  <td style={{
                    padding: '1rem',
                    color: '#355B45',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 600
                  }}>
                    ✓ Modern design<br/>
                    ✓ Excellent UX<br/>
                    ✓ Mobile-responsive<br/>
                    ✓ Easy to use
                  </td>
                </tr>
                {businessModel === 'dayPassPlatform' && (
                  <>
                    <tr style={{
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      <td style={{
                        padding: '1rem',
                        fontWeight: 600,
                        color: '#1f2937',
                        fontFamily: 'Inter, sans-serif'
                      }}>Swimply (Private Pools)</td>
                      <td style={{
                        padding: '1rem',
                        color: '#6b7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>Private Pool Marketplace</td>
                      <td style={{
                        padding: '1rem',
                        color: '#6b7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        • Individual homeowners only<br/>
                        • No HOA/multifamily focus<br/>
                        • Limited to pools/courts<br/>
                        • No internal management tools
                      </td>
                      <td style={{
                        padding: '1rem',
                        color: '#355B45',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600
                      }}>
                        ✓ HOA/multifamily focus<br/>
                        ✓ Internal + external booking<br/>
                        ✓ Full amenity suite<br/>
                        ✓ Integrated management
                      </td>
                    </tr>
                    <tr style={{
                      backgroundColor: '#f9fafb'
                    }}>
                      <td style={{
                        padding: '1rem',
                        fontWeight: 600,
                        color: '#1f2937',
                        fontFamily: 'Inter, sans-serif'
                      }}>ResortPass</td>
                      <td style={{
                        padding: '1rem',
                        color: '#6b7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>Hotel Day Pass Platform</td>
                      <td style={{
                        padding: '1rem',
                        color: '#6b7280',
                        fontFamily: 'Inter, sans-serif'
                      }}>
                        • Hospitality assets only<br/>
                        • No residential focus<br/>
                        • Different market dynamics<br/>
                        • No internal management
                      </td>
                      <td style={{
                        padding: '1rem',
                        color: '#355B45',
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 600
                      }}>
                        ✓ Residential focus<br/>
                        ✓ HOA-specific features<br/>
                        ✓ Resident priority model<br/>
                        ✓ Subscription + commission
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Key Differentiators */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              border: '2px solid #355B45',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                fontSize: '2rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>🎯</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#355B45',
                marginBottom: '0.5rem',
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif'
              }}>
                Purpose-Built
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif'
              }}>
                Designed specifically for Class A and amenity-rich property management, not adapted from other use cases
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              border: '2px solid #355B45',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                fontSize: '2rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>💰</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#355B45',
                marginBottom: '0.5rem',
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif'
              }}>
                Better Value
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif'
              }}>
                Affordable pricing focused on amenity management without paying for unnecessary features
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              border: '2px solid #355B45',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                fontSize: '2rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>⚡</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#355B45',
                marginBottom: '0.5rem',
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif'
              }}>
                Modern Technology
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif'
              }}>
                Built with modern tech stack for speed, reliability, and excellent user experience
              </p>
            </div>
          </div>
        </section>

        {/* Competitive Advantage */}
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
            Competitive Advantage
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#355B45',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Focused Solution
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.8',
                fontFamily: 'Inter, sans-serif'
              }}>
                Unlike generic property management software, Neighbri is purpose-built specifically for amenity reservations, 
                making it more intuitive and feature-rich for this use case.
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#355B45',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Modern UX
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.8',
                fontFamily: 'Inter, sans-serif'
              }}>
                Clean, modern interface that residents actually want to use, unlike clunky legacy systems that frustrate users.
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#355B45',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Value-Aligned Pricing
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.8',
                fontFamily: 'Inter, sans-serif'
              }}>
                Pricing that reflects the value delivered to Class A and amenity-rich properties, with ROI that justifies the investment 
                in professional amenity management.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
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
            Team
          </h2>
          <div style={{
            padding: '3rem',
            borderRadius: '0.5rem',
            backgroundColor: 'white',
            border: '2px solid #355B45',
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.75rem',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Ryan Crosby
            </h3>
            <p style={{
              fontSize: '1.125rem',
              color: '#355B45',
              marginBottom: '1.5rem',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif'
            }}>
              Founder
            </p>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.8',
              marginBottom: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Deep experience in product management and technical program management. Combined with a deep understanding 
              of HOA management through family real estate development and management portfolio. Passionate about solving 
              real-world problems with technology.
            </p>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.8',
              fontFamily: 'Inter, sans-serif'
            }}>
              <strong>Contact:</strong> thomas.ryan.crosby@gmail.com | (985) 373-2383
            </p>
          </div>
        </section>

        {/* Financial Projections */}
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
              backgroundColor: '#f0fdf4',
              border: '1px solid #86efac',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Year 1
              </h3>
              <div style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: '#355B45',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                30-50
              </div>
              <p style={{
                color: '#6b7280',
                fontFamily: 'Inter, sans-serif'
              }}>
                Communities
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f0fdf4',
              border: '1px solid #86efac',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Year 2
              </h3>
              <div style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: '#355B45',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                150-200
              </div>
              <p style={{
                color: '#6b7280',
                fontFamily: 'Inter, sans-serif'
              }}>
                Communities
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f0fdf4',
              border: '1px solid #86efac',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Year 3
              </h3>
              <div style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: '#355B45',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                400+
              </div>
              <p style={{
                color: '#6b7280',
                fontFamily: 'Inter, sans-serif'
              }}>
                Communities
              </p>
            </div>
          </div>
          <div style={{
            padding: '2rem',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
            border: '2px solid #355B45',
            marginBottom: '2rem'
          }}>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.8',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              <strong>Revenue Model:</strong> {businessModel === 'dayPassPlatform' 
                ? 'With pricing tiers ranging from $99-299/month per community (average ~$180/month subscription) plus 15-20% commission on day pass bookings, 100 communities would generate approximately $216,000 in annual recurring subscription revenue, plus $315,000+ in commission revenue from day passes (assuming $3,150/year avg per community).'
                : 'With pricing tiers ranging from $99-299/month per community (average ~$180/month), 100 communities would generate approximately $216,000 in annual recurring revenue.'}
            </p>
          </div>

          {/* Growth Methodology */}
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
              lineHeight: '1.8',
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Projections are based on accelerated growth assumptions with dedicated sales leadership from launch:
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '0.25rem',
                border: '1px solid #cbd5e1'
              }}>
                <p style={{
                  color: '#1f2937',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Year 1 Assumptions
                </p>
                <ul style={{
                  color: '#6b7280',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  paddingLeft: '1.25rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <li>Dedicated sales leader on board</li>
                  <li>30-60 day sales cycle</li>
                  <li>5-8% lead conversion rate</li>
                  <li>Structured sales process</li>
                  <li>Focus on target markets</li>
                </ul>
              </div>
              <div style={{
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '0.25rem',
                border: '1px solid #cbd5e1'
              }}>
                <p style={{
                  color: '#1f2937',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Year 2 Assumptions
                </p>
                <ul style={{
                  color: '#6b7280',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  paddingLeft: '1.25rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <li>Expand sales team (2-3 reps)</li>
                  <li>Improved conversion (8-12%)</li>
                  <li>Strong word-of-mouth referrals</li>
                  <li>Property management partnerships</li>
                  <li>Multi-region expansion</li>
                </ul>
              </div>
              <div style={{
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '0.25rem',
                border: '1px solid #cbd5e1'
              }}>
                <p style={{
                  color: '#1f2937',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Year 3 Assumptions
                </p>
                <ul style={{
                  color: '#6b7280',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  paddingLeft: '1.25rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <li>Full sales team (5-7 reps)</li>
                  <li>12-18% conversion rates</li>
                  <li>Established partnership channels</li>
                  <li>Full marketing automation</li>
                  <li>Nationwide presence</li>
                </ul>
              </div>
            </div>
            <p style={{
              color: '#6b7280',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              fontStyle: 'italic',
              fontFamily: 'Inter, sans-serif'
            }}>
              <strong>Note:</strong> These projections assume successful execution of go-to-market strategy, 
              adequate funding for sales/marketing, and strong product-market fit. Actual results may vary 
              based on market conditions, competition, and execution capabilities.
            </p>
          </div>
        </section>

        {/* Company Values & Impact */}
        <section style={{
          padding: '6rem 1rem',
          backgroundColor: '#355B45',
          color: 'white'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              marginBottom: '3rem',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif'
            }}>
              Company Values & Impact
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
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Customer-Focused
                </h3>
                <p style={{
                  opacity: 0.9,
                  lineHeight: '1.8',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Built with deep understanding of Class A and amenity-rich property needs, developed through direct engagement with 
                  HOA administrators and residents.
                </p>
              </div>

              <div style={{
                padding: '2rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Growth & Hiring
                </h3>
                <p style={{
                  opacity: 0.9,
                  lineHeight: '1.8',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Plans to build a talented team across sales, customer success, and product development as we scale 
                  and expand into new markets.
                </p>
              </div>

              <div style={{
                padding: '2rem',
                borderRadius: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Community Impact
              </h3>
              <p style={{
                opacity: 0.9,
                lineHeight: '1.8',
                fontFamily: 'Inter, sans-serif'
              }}>
                Empowering Class A and amenity-rich properties to better serve their residents and maximize the value of premium amenities 
                that justify high HOA fees.
              </p>
              </div>
            </div>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '1.25rem',
                lineHeight: '1.8',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600
              }}>
                Neighbri is committed to building a sustainable, scalable business that creates value for Class A and amenity-rich 
                properties while fostering innovation in property management technology.
              </p>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section style={{
          padding: '6rem 1rem',
          backgroundColor: 'white',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '2rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Vision
          </h2>
          <p style={{
            fontSize: '1.5rem',
            color: '#6b7280',
            lineHeight: '1.8',
            maxWidth: '800px',
            margin: '0 auto 3rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            To become the leading platform for Class A and amenity-rich property amenity management, serving premium 
            residential developments nationwide and transforming how properties manage their shared amenities.
          </p>
          <div style={{
            padding: '3rem',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
            border: '2px solid #355B45',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#355B45',
              marginBottom: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Investment Opportunity
            </h3>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.8',
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Neighbri is seeking strategic partnerships and investment to accelerate growth. Investment would enable:
            </p>
            <ul style={{
              textAlign: 'left',
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li>Accelerated customer acquisition and market expansion</li>
              <li>Enhanced product development and feature additions</li>
              <li>Building a strong sales and customer success team</li>
              <li>Strategic partnerships with property management companies</li>
              <li>Marketing and brand development initiatives</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section style={{
          padding: '6rem 1rem',
          backgroundColor: '#355B45',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '1rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Ready to Transform HOA Amenity Management?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            opacity: 0.9,
            fontFamily: 'Inter, sans-serif'
          }}>
            Let's build the future of community living together.
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a
              href="https://www.neighbri.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: 'white',
                color: '#355B45',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontSize: '1.125rem',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                transition: 'background-color 0.2s',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f4f1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Try Neighbri
            </a>
            <a
              href="mailto:thomas.ryan.crosby@gmail.com"
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontSize: '1.125rem',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                border: '2px solid white',
                transition: 'background-color 0.2s',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '2rem 1rem',
        backgroundColor: '#1f2937',
        color: 'white',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '0.875rem',
          opacity: 0.8,
          fontFamily: 'Inter, sans-serif'
        }}>
          © 2024 Neighbri. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default PitchDeckPage;

