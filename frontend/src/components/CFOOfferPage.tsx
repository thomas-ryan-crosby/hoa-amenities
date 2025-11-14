import React, { useState } from 'react';
import LandingHeader from './LandingHeader';

const CFOOfferPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Pioneers2018') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <LandingHeader />
        <main style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 200px)',
          padding: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            padding: '3rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            maxWidth: '500px',
            width: '100%'
          }}>
            <h2 style={{
              color: '#355B45',
              fontSize: '1.75rem',
              fontWeight: 700,
              marginBottom: '1rem',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif'
            }}>
              Access Offer Terms
            </h2>
            <p style={{
              color: '#6b7280',
              marginBottom: '2rem',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif'
            }}>
              Please enter the password to view the offer terms.
            </p>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontFamily: 'Inter, sans-serif',
                  marginBottom: '1rem',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#355B45';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              />
              {error && (
                <p style={{
                  color: '#dc2626',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                  fontFamily: 'Inter, sans-serif'
                }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: '#355B45',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#244032';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#355B45';
                }}
              >
                Access Offer Terms
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <LandingHeader />
      <main style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '0.5rem',
          padding: '3rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            color: '#355B45',
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Offer Terms
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1.125rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            CFO
          </p>
          <div style={{
            background: '#fef3c7',
            border: '2px solid #fbbf24',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginTop: '1.5rem'
          }}>
            <p style={{
              color: '#92400e',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              marginBottom: '0.5rem'
            }}>
              ⚠️ Non-Binding Offer Terms
            </p>
            <p style={{
              color: '#92400e',
              fontSize: '0.875rem',
              lineHeight: '1.6',
              fontFamily: 'Inter, sans-serif'
            }}>
              These offer terms are provided for discussion purposes only and are non-binding 
              until formal documentation is produced and executed by both parties. All terms 
              are subject to change and require legal review and formal agreement.
            </p>
          </div>
        </div>

        {/* Compensation */}
        <section style={{
          background: 'white',
          borderRadius: '0.5rem',
          padding: '3rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            color: '#1f2937',
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Compensation & Equity
          </h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: '#1f2937',
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Base Compensation
            </h3>
            <ul style={{
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li><strong>Base Salary:</strong> $140,000 - $180,000 (commensurate with experience)</li>
              <li><strong>Equity:</strong> 1% - 2% (from employee option pool)</li>
              <li><strong>Vesting:</strong> 4-year vesting schedule with 1-year cliff</li>
              <li><strong>Benefits:</strong> Health, dental, vision insurance; 401(k) matching</li>
              <li><strong>PTO:</strong> Unlimited PTO policy</li>
            </ul>
          </div>

          <div style={{
            background: '#f0f4f1',
            border: '2px solid #355B45',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginTop: '2rem'
          }}>
            <h4 style={{
              color: '#355B45',
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Equity Details
            </h4>
            <ul style={{
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li><strong>Grant:</strong> 1-2% equity (from employee option pool)</li>
              <li><strong>Vesting:</strong> 4-year vesting schedule</li>
              <li><strong>Cliff:</strong> 1-year cliff (no vesting until 12 months)</li>
              <li><strong>Vesting Schedule:</strong> Monthly vesting after cliff</li>
              <li><strong>83(b) Election:</strong> Recommended within 30 days of grant</li>
            </ul>
          </div>
        </section>

        {/* Role & Responsibilities */}
        <section style={{
          background: 'white',
          borderRadius: '0.5rem',
          padding: '3rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            color: '#1f2937',
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Role & Responsibilities
          </h2>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: '#1f2937',
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Key Responsibilities
            </h3>
            <ul style={{
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li>Financial planning, analysis, and reporting</li>
              <li>Accounting operations and compliance</li>
              <li>Budget management and forecasting</li>
              <li>Investor relations and fundraising support</li>
              <li>Manage finance team and accounting functions</li>
              <li>Establish financial controls and processes</li>
              <li>Support strategic decision-making with financial insights</li>
            </ul>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: '#1f2937',
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Qualifications
            </h3>
            <ul style={{
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li>CPA or MBA in Finance preferred</li>
              <li>8+ years of finance and accounting experience</li>
              <li>Experience in SaaS or technology companies</li>
              <li>Strong understanding of startup finance and fundraising</li>
              <li>Experience with financial modeling and forecasting</li>
              <li>Experience in early-stage startups preferred</li>
            </ul>
          </div>
        </section>

        {/* Start Date & Terms */}
        <section style={{
          background: 'white',
          borderRadius: '0.5rem',
          padding: '3rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            color: '#1f2937',
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Start Date & Terms
          </h2>
          
          <ul style={{
            color: '#6b7280',
            lineHeight: '1.8',
            paddingLeft: '1.5rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            <li><strong>Start Date:</strong> [To be determined]</li>
            <li><strong>Location:</strong> Remote / Hybrid (flexible)</li>
            <li><strong>Reporting:</strong> Reports directly to CEO</li>
            <li><strong>Employment Type:</strong> Full-time, exempt</li>
            <li><strong>At-Will Employment:</strong> This is an at-will employment relationship</li>
          </ul>
        </section>

        {/* Next Steps */}
        <section style={{
          background: 'white',
          borderRadius: '0.5rem',
          padding: '3rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            color: '#1f2937',
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '1rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Next Steps
          </h2>
          <ol style={{
            color: '#6b7280',
            lineHeight: '1.8',
            paddingLeft: '1.5rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            <li><strong>Review these offer terms</strong> and discuss any questions</li>
            <li><strong>Reference checks</strong> and final interview discussions</li>
            <li><strong>Formal offer letter</strong> will be prepared upon acceptance</li>
            <li><strong>Legal documentation</strong> including employment agreement and equity grant</li>
            <li><strong>Onboarding</strong> and start date coordination</li>
          </ol>
          <div style={{
            background: '#f0f4f1',
            border: '2px solid #355B45',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginTop: '2rem'
          }}>
            <p style={{
              color: '#355B45',
              fontWeight: 600,
              marginBottom: '0.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Questions or Concerns?
            </p>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.8',
              fontFamily: 'Inter, sans-serif'
            }}>
              Please reach out to discuss any aspect of this offer. We want to ensure 
              this opportunity aligns with your career goals and sets us up for long-term success.
            </p>
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
          © 2024 Neighbri. All rights reserved. Confidential - For CFO Candidates Only.
        </p>
      </footer>
    </div>
  );
};

export default CFOOfferPage;

