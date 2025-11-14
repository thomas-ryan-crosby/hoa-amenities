import React from 'react';
import LandingHeader from './LandingHeader';

const PitchDeckPage: React.FC = () => {
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
            Targeting Luxury & Class A Residential Communities
          </p>
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
                15-20%
              </div>
              <p style={{
                fontSize: '1.125rem',
                color: '#1f2937',
                fontWeight: 600,
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                of HOAs are Class A/Luxury
              </p>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif'
              }}>
                Approximately 55,000-75,000 luxury communities with premium amenities nationwide
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
                Luxury communities have higher budgets and greater need for professional management tools
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
                  $130M+
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
                  65,000 luxury communities nationwide × $2,000/year avg subscription
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
                  $16M+
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
                  ~8,000 luxury communities in target regional markets × $2,000/year avg
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
                  $400K+
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
                  ~200 luxury communities in first 3 years (regional expansion) × $2,000/year avg
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
                <strong>Note:</strong> Revenue projections based on subscription fees only. Additional revenue from payment 
                processing transaction fees (2.9% + $0.30 per reservation) not included in above calculations.
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
              <strong>Luxury/Class A Communities:</strong> Residential developments with premium amenities including pools, 
              clubrooms, tennis courts, fitness centers, and event spaces. These communities typically have:
            </p>
            <ul style={{
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li>Higher HOA fees ($300+/month)</li>
              <li>Professional property management</li>
              <li>Significant amenity budgets</li>
              <li>Residents with high expectations for service quality</li>
              <li>Complex reservation and payment requirements</li>
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
              Neighbri will initially focus on establishing a strong presence in select regional markets with high 
              concentrations of luxury residential communities. These markets offer ideal conditions: numerous Class A 
              developments, significant amenity budgets, and residents with high service expectations.
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
                10-20
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
                50-100
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
                200+
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
            border: '2px solid #355B45'
          }}>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.8',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center'
            }}>
              <strong>Revenue Model:</strong> With pricing tiers ranging from $99-299/month per community 
              (average ~$180/month), 100 communities would generate approximately $216,000 in annual recurring 
              revenue, plus transaction fees from reservation payments.
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
            To become the leading platform for luxury and Class A community amenity management, starting with 
            strategic regional markets and expanding to serve premium residential developments nationwide.
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

