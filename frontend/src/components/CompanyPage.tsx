import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from './LandingHeader';

const CompanyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <LandingHeader />
      <main>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          padding: '3rem',
          marginTop: '2rem',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            color: '#355B45',
            fontSize: '2.5rem',
            marginBottom: '0.5rem',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
          }}>
            Neighbri Organizational Chart
          </h1>
          <p style={{
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '1.125rem',
            marginBottom: '2rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Future State - Year 3 (400+ Communities, $1M+ ARR)
          </p>
          
          
          {/* Org Chart */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem'
          }}>
            {/* CEO Level */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #355B45 0%, #244032 100%)',
                color: 'white',
                borderRadius: '0.5rem',
                padding: '2rem',
                minWidth: '300px',
                boxShadow: '0 4px 12px rgba(53, 91, 69, 0.3)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  CEO
                </div>
                <div style={{
                  fontSize: '1rem',
                  marginBottom: '0.75rem',
                  opacity: 0.9,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Thomas Crosby
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  opacity: 0.8,
                  fontStyle: 'italic',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Reports to: Board of Directors
                </div>
              </div>
            </div>
            
            {/* Connector */}
            <div style={{
              width: '2px',
              background: '#cbd5e1',
              height: '2rem'
            }}></div>
            
            {/* Executive Level */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              width: '100%'
            }}>
              {/* Co-Founder & Head of Sales */}
              <div 
                onClick={() => navigate('/company/offer')}
                style={{
                  background: 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)',
                  color: '#1f2937',
                  border: '2px solid #22c55e',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  minWidth: '250px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Co-Founder & Head of Sales
                </div>
                <div style={{
                  fontSize: '1rem',
                  marginBottom: '0.75rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Christian Maloney
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  background: 'rgba(31, 41, 55, 0.1)',
                  borderRadius: '0.25rem',
                  display: 'inline-block',
                  marginBottom: '0.75rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Click to view offer letter
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#355B45',
                  marginBottom: '0.5rem',
                  marginTop: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Responsibilities
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  • Sales strategy & execution<br/>
                  • Pipeline management<br/>
                  • Team leadership & development<br/>
                  • Revenue growth
                </div>
              </div>
              
              {/* CTO / VP Engineering */}
              <div 
                onClick={() => navigate('/company/cto-offer')}
                style={{
                  background: '#f0f9ff',
                  border: '2px solid #7dd3fc',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  minWidth: '250px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  CTO / VP Engineering
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#355B45',
                  marginBottom: '0.5rem',
                  marginTop: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Responsibilities
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  • Product development<br/>
                  • Technical architecture<br/>
                  • Engineering team leadership<br/>
                  • Infrastructure & DevOps
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  background: 'rgba(31, 41, 55, 0.1)',
                  borderRadius: '0.25rem',
                  display: 'inline-block',
                  marginTop: '0.75rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Click to view offer terms
                </div>
              </div>
              
              {/* CFO */}
              <div 
                onClick={() => navigate('/company/cfo-offer')}
                style={{
                  background: '#f0f9ff',
                  border: '2px solid #7dd3fc',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  minWidth: '250px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  CFO
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#355B45',
                  marginBottom: '0.5rem',
                  marginTop: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Responsibilities
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  • Financial planning & analysis<br/>
                  • Accounting & reporting<br/>
                  • Budget management<br/>
                  • Investor relations
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  background: 'rgba(31, 41, 55, 0.1)',
                  borderRadius: '0.25rem',
                  display: 'inline-block',
                  marginTop: '0.75rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Click to view offer terms
                </div>
              </div>
              
              {/* VP Customer Success */}
              <div 
                onClick={() => navigate('/company/vpcs-offer')}
                style={{
                  background: '#f0f9ff',
                  border: '2px solid #7dd3fc',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  minWidth: '250px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  VP Customer Success
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#355B45',
                  marginBottom: '0.5rem',
                  marginTop: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Responsibilities
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  • Customer onboarding<br/>
                  • Account management<br/>
                  • Support & retention<br/>
                  • Customer satisfaction
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  background: 'rgba(31, 41, 55, 0.1)',
                  borderRadius: '0.25rem',
                  display: 'inline-block',
                  marginTop: '0.75rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Click to view offer terms
                </div>
              </div>
              
              {/* VP Marketing */}
              <div 
                onClick={() => navigate('/company/vpmarketing-offer')}
                style={{
                  background: '#f0f9ff',
                  border: '2px solid #7dd3fc',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  minWidth: '250px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  VP Marketing
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#355B45',
                  marginBottom: '0.5rem',
                  marginTop: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Responsibilities
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  lineHeight: '1.6',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  • Brand & messaging<br/>
                  • Demand generation<br/>
                  • Content & communications<br/>
                  • Marketing operations
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  background: 'rgba(31, 41, 55, 0.1)',
                  borderRadius: '0.25rem',
                  display: 'inline-block',
                  marginTop: '0.75rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Click to view offer terms
                </div>
              </div>
            </div>
          </div>
          
          {/* Organization Summary */}
          <div style={{
            background: '#f9fafb',
            borderRadius: '0.5rem',
            padding: '2rem',
            marginTop: '3rem',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              color: '#355B45',
              marginBottom: '1rem',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif'
            }}>
              Organization Summary
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
              marginTop: '1rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#355B45',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  6
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginTop: '0.25rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Executive Team
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#355B45',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  $1M+
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginTop: '0.25rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Annual Recurring Revenue
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#355B45',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  400+
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginTop: '0.25rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  Customer Communities
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default CompanyPage;

