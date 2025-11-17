import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from './LandingHeader';

const PitchDeckPage: React.FC = () => {
  const navigate = useNavigate();
  const [showHOAPass, setShowHOAPass] = useState(false);

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
        {/* Title Slide */}
        <section style={{
          padding: '6rem 1rem',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <img 
              src="/images/Neighbri_Wordmark_Final.png" 
              alt="Neighbri"
              style={{ 
                height: '80px', 
                maxWidth: '400px',
                margin: '0 auto 2rem'
              }}
            />
          </div>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '1rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Neighbri
          </h1>
          <p style={{
            fontSize: '1.75rem',
            color: '#355B45',
            marginBottom: '2rem',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif'
          }}>
            Premium Amenity Management for Luxury Communities
          </p>
          <p style={{
            fontSize: '1.25rem',
            color: '#6b7280',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.8',
            fontFamily: 'Inter, sans-serif'
          }}>
            A modern platform that streamlines reservations, payments, and management for luxury residential communities 
            with premium amenities
          </p>
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
                Luxury communities rely on email chains, spreadsheets, and phone calls to manage premium amenities, 
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
                <strong>Result:</strong> Frustrated residents in luxury communities, overworked HOA staff, and inefficient 
                use of premium amenities that residents pay significant fees to access.
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
                  Seamless Square payment processing for fees and deposits, eliminating manual payment collection.
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
                Neighbri transforms amenity management from a time-consuming burden into a streamlined, automated process.
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
                    150,000+
                  </div>
                  <p style={{
                    fontSize: '1.125rem',
                    color: '#1f2937',
                    fontWeight: 600,
                    marginTop: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Condo Complexes & Multifamily Properties
                  </p>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    marginTop: '0.25rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    With shared amenities requiring reservation management
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
                  fontFamily: 'Inter, sans-serif'
                }}>
                  <strong>Total Market: 520,000+ properties</strong>
                </p>
              </div>
            </div>

            {/* Down-Selection Steps */}
            <div style={{
              padding: '1.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              marginBottom: '1.5rem'
            }}>
              <h4 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '1rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Market Down-Selection
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'white',
                  borderRadius: '0.25rem',
                  border: '1px solid #cbd5e1'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#355B45',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Step 1
                  </div>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    <strong>Properties with Reservable Amenities:</strong><br/>
                    Pools, clubrooms, event spaces, tennis courts, etc.
                  </p>
                  <p style={{
                    color: '#355B45',
                    fontWeight: 600,
                    marginTop: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    ~200,000 properties
                  </p>
                </div>

                <div style={{
                  padding: '1rem',
                  backgroundColor: 'white',
                  borderRadius: '0.25rem',
                  border: '1px solid #cbd5e1'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#355B45',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Step 2
                  </div>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    <strong>Luxury/Class A Properties:</strong><br/>
                    Higher HOA fees, professional management, premium amenities
                  </p>
                  <p style={{
                    color: '#355B45',
                    fontWeight: 600,
                    marginTop: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    ~65,000-75,000 properties
                  </p>
                </div>

                <div style={{
                  padding: '1rem',
                  backgroundColor: 'white',
                  borderRadius: '0.25rem',
                  border: '1px solid #cbd5e1'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#355B45',
                    marginBottom: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    Step 3
                  </div>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    <strong>Neighbri Target Market:</strong><br/>
                    Properties requiring sophisticated reservation & payment management
                  </p>
                  <p style={{
                    color: '#355B45',
                    fontWeight: 600,
                    marginTop: '0.5rem',
                    fontFamily: 'Inter, sans-serif'
                  }}>
                    ~65,000-75,000 properties
                  </p>
                </div>
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
                65K-75K
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
                Luxury HOAs, condos, and multifamily properties with premium reservable amenities
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
                  {showHOAPass ? '$227M+' : '$130M+'}
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
                  {showHOAPass 
                    ? '65,000 luxury communities × $3,500/year avg (subscription + HOAPass platform fees)'
                    : '65,000 luxury communities nationwide × $2,000/year avg subscription'}
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
                  {showHOAPass ? '$28M+' : '$16M+'}
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
                  {showHOAPass
                    ? '~8,000 luxury communities in target markets × $3,500/year avg'
                    : '~8,000 luxury communities in target markets × $2,000/year avg'}
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
                  {showHOAPass ? '$1.4M+' : '$800K+'}
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
                  {showHOAPass
                    ? '~400+ luxury communities in first 3 years × $3,500/year avg'
                    : '~400+ luxury communities in first 3 years × $2,000/year avg'}
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
                <strong>Note:</strong> {showHOAPass 
                  ? 'Revenue projections include subscription fees ($2,000/year) plus HOAPass platform fees (~$1,500/year avg from 15-20% revenue share on day pass sales). Additional revenue from payment processing transaction fees (2.9% + $0.30 per reservation) not included in above calculations.'
                  : 'Revenue projections based on subscription fees only. Additional revenue from payment processing transaction fees (2.9% + $0.30 per reservation) not included in above calculations.'}
              </p>
            </div>
          </div>

          {/* Revenue Stream Toggle */}
          <div style={{
            padding: '2rem',
            borderRadius: '0.5rem',
            backgroundColor: '#f9fafb',
            border: '2px solid #355B45',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: 600,
                color: '#1f2937',
                fontFamily: 'Inter, sans-serif',
                margin: 0
              }}>
                Revenue Stream Options
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: 'white',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                border: '2px solid #355B45'
              }}>
                <button
                  onClick={() => setShowHOAPass(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.25rem',
                    border: 'none',
                    backgroundColor: !showHOAPass ? '#355B45' : 'transparent',
                    color: !showHOAPass ? 'white' : '#355B45',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s'
                  }}
                >
                  Standard System
                </button>
                <button
                  onClick={() => setShowHOAPass(true)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.25rem',
                    border: 'none',
                    backgroundColor: showHOAPass ? '#355B45' : 'transparent',
                    color: showHOAPass ? 'white' : '#355B45',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'all 0.2s'
                  }}
                >
                  HOAPass System
                </button>
              </div>
            </div>

            {!showHOAPass ? (
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
                  This includes calendar-based booking, payment processing, janitorial scheduling, and administrative oversight.
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
                    <li>Payment processing transaction fees (2.9% + $0.30 per reservation)</li>
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
                  for HOA amenities. Similar to ResortPass (which serves hospitality assets), HOAPass enables luxury communities 
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
                    <li><strong>Transaction Fees:</strong> Standard payment processing fees (2.9% + $0.30) on all guest bookings</li>
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
                      A luxury community with a pool and clubroom could generate $5,000-15,000+ annually from day pass sales 
                      (depending on capacity and pricing), creating a new revenue stream that helps offset HOA fees or fund 
                      amenity improvements. With 65,000 target communities, this represents a significant additional market opportunity.
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

          {/* HOAPass vs ResortPass Comparison */}
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
                    }}>~65,000 luxury HOAs/condos</td>
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
                    }}>SaaS Subscription + Platform Fees</td>
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
                    }}>$3,500/year avg<br/>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        ($2,000 subscription + $1,500 HOAPass fees)
                      </span>
                    </td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>Variable (commission-based)<br/>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        Depends on booking volume
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
                    }}>TAM (Estimated)</td>
                    <td style={{
                      padding: '1rem',
                      color: '#355B45',
                      fontWeight: 600,
                      fontFamily: 'Inter, sans-serif'
                    }}>$227M+</td>
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
                    }}>SAM (Estimated)</td>
                    <td style={{
                      padding: '1rem',
                      color: '#355B45',
                      fontWeight: 600,
                      fontFamily: 'Inter, sans-serif'
                    }}>$28M+</td>
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
                    }}>SOM (Estimated)</td>
                    <td style={{
                      padding: '1rem',
                      color: '#355B45',
                      fontWeight: 600,
                      fontFamily: 'Inter, sans-serif'
                    }}>$1.4M+</td>
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
                    }}>N/A (SaaS model)</td>
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
                    }}>Revenue per Property</td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>$3,500/year avg<br/>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        ($2,000 subscription + $1,500 HOAPass fees)
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
                    }}>Commission/Take Rate</td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>15-20% on day passes<br/>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        Plus subscription revenue
                      </span>
                    </td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>15-20% (estimated)<br/>
                      <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        Industry standard for marketplace
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
                    }}>Revenue Predictability</td>
                    <td style={{
                      padding: '1rem',
                      color: '#355B45',
                      fontWeight: 600,
                      fontFamily: 'Inter, sans-serif'
                    }}>✓ High (Recurring SaaS)</td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>Variable (Usage-based)</td>
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
                    }}>Primary Revenue Source</td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>Subscription fees (guaranteed)<br/>
                      + Platform fees on day passes
                    </td>
                    <td style={{
                      padding: '1rem',
                      color: '#6b7280',
                      fontFamily: 'Inter, sans-serif'
                    }}>Commission on bookings only</td>
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
                  <li>HOAs represent untapped market (65K+ properties)</li>
                  <li>Different asset class = different dynamics</li>
                  <li>Smaller market but higher per-property revenue</li>
                  <li>Less competition in HOA space</li>
                </ul>
              </div>
            </div>

            <div style={{
              marginTop: '1.5rem',
              padding: '1.5rem',
              backgroundColor: '#f0f9ff',
              borderRadius: '0.5rem',
              border: '1px solid #0ea5e9'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '0.75rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                ResortPass Financial Estimates - Methodology
              </h4>
              <p style={{
                color: '#6b7280',
                fontSize: '0.85rem',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif',
                marginBottom: '0.75rem'
              }}>
                <strong>Known Facts:</strong> ResortPass has raised $37.4M (Series B: $26M in Nov 2022), has 900+ hotel 
                partnerships, estimated annual revenue of ~$16.8M, and 100+ employees.
              </p>
              <p style={{
                color: '#6b7280',
                fontSize: '0.85rem',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif',
                marginBottom: '0.75rem'
              }}>
                <strong>Derived Estimates:</strong>
              </p>
              <ul style={{
                color: '#6b7280',
                fontSize: '0.85rem',
                lineHeight: '1.6',
                paddingLeft: '1.25rem',
                fontFamily: 'Inter, sans-serif',
                marginBottom: '0.75rem'
              }}>
                <li><strong>TAM ($9-11B):</strong> Based on global luxury hotel market ($93-238B) with 10% attributed to amenity/day-pass services</li>
                <li><strong>SAM ($2-3B):</strong> US luxury hotel market (~$30B) with 10% for day-pass services</li>
                <li><strong>SOM ($100-150M):</strong> 5-10% of SAM over 5 years, considering competition and market penetration</li>
                <li><strong>GMV ($80-120M):</strong> Reverse-engineered from $16.8M revenue assuming 15-20% commission rate</li>
                <li><strong>Revenue per Property ($18,700):</strong> $16.8M revenue ÷ 900 hotels</li>
                <li><strong>Growth Rate (40-60%):</strong> Estimated based on Series B funding, expansion trajectory, and marketplace growth patterns</li>
              </ul>
              <p style={{
                color: '#6b7280',
                fontSize: '0.85rem',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif',
                fontStyle: 'italic'
              }}>
                <strong>Note:</strong> These are estimates derived from public information and industry benchmarks. Actual figures 
                may vary. ResortPass does not publicly disclose detailed financial metrics.
              </p>
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
                <strong>Key Insight:</strong> This comparison highlights different market dynamics. ResortPass operates in the hospitality 
                sector (hotels/resorts) with a larger TAM but transaction-based revenue. HOAPass targets residential communities 
                (HOAs/condos) with a smaller but more focused market, benefiting from subscription-based recurring revenue that provides 
                more predictable cash flow and higher customer lifetime value.
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
              to adjacent regions and eventually nationwide, targeting luxury communities and Class A developments.
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
                Payment Processing
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.8',
                marginBottom: '1.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Small transaction fee on each reservation payment processed through the platform.
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
                  <strong>Revenue Stream:</strong>
                </p>
                <p style={{
                  marginTop: '0.5rem',
                  color: '#6b7280',
                  lineHeight: '1.8',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  2.9% + $0.30 per transaction (industry standard)
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
                  High customer lifetime value with low churn in the HOA market
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
                Square payment processing fully integrated
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
                  Square API integration for secure payment processing
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
                    • No payment integration<br/>
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
                    • Limited payment options<br/>
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
                Designed specifically for luxury community amenity management, not adapted from other use cases
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
                Pricing that reflects the value delivered to luxury communities, with ROI that justifies the investment 
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
              Thomas Crosby
            </h3>
            <p style={{
              fontSize: '1.125rem',
              color: '#355B45',
              marginBottom: '1.5rem',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif'
            }}>
              Founder & Developer
            </p>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.8',
              marginBottom: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Full-stack developer with experience building scalable web applications. 
              Passionate about solving real-world problems through technology.
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
              <strong>Revenue Model:</strong> With pricing tiers ranging from $99-299/month per community 
              (average ~$180/month), 100 communities would generate approximately $216,000 in annual recurring 
              revenue, plus transaction fees from reservation payments.
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
                  Built with deep understanding of luxury community needs, developed through direct engagement with 
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
                Empowering luxury communities to better serve their residents and maximize the value of premium amenities 
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
                Neighbri is committed to building a sustainable, scalable business that creates value for luxury 
                communities while fostering innovation in property management technology.
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
            To become the leading platform for luxury and Class A community amenity management, serving premium 
            residential developments nationwide and transforming how communities manage their shared amenities.
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

