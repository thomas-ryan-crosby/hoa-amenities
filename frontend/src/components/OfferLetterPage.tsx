import React, { useState } from 'react';
import LandingHeader from './LandingHeader';

const OfferLetterPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Maloney2025') {
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
              Access Offer Letter
            </h2>
            <p style={{
              color: '#6b7280',
              marginBottom: '2rem',
              textAlign: 'center',
              fontFamily: 'Inter, sans-serif'
            }}>
              Please enter the password to view the offer letter.
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
                Access Offer Letter
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
            Offer Letter
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1.125rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Christian Maloney<br/>
            Co-Founder & Head of Sales
          </p>
        </div>

        {/* Trial Period Agreement */}
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
            marginBottom: '1rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Phase 0: Trial Period Agreement
          </h2>
          <div style={{
            background: '#fef3c7',
            border: '2px solid #fbbf24',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <p style={{
              color: '#92400e',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif'
            }}>
              ⚠️ This is a trial period with no long-term commitment. Either party may terminate with 7 days written notice.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: '#1f2937',
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Terms
            </h3>
            <ul style={{
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li><strong>Duration:</strong> 30-90 days (to be determined)</li>
              <li><strong>Start Date:</strong> [To be determined]</li>
              <li><strong>End Date:</strong> [To be determined]</li>
              <li><strong>Status:</strong> Independent Contractor</li>
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
              Compensation
            </h3>
            <ul style={{
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li><strong>Base Salary:</strong> $0 (commission-only)</li>
              <li><strong>Commission:</strong> 30-35% of first-year ARR on all closed deals</li>
              <li><strong>Payment Terms:</strong> Commissions paid within 30 days of customer payment</li>
              <li><strong>Expenses:</strong> Reimbursed with receipts (travel, tools, CRM subscriptions, etc.)</li>
              <li><strong>Equity:</strong> None during trial period</li>
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
              Performance Expectations
            </h3>
            <ul style={{
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li>Close 2-5 customers during trial period</li>
              <li>Learn product features and market positioning</li>
              <li>Establish initial sales process and materials</li>
              <li>Demonstrate commitment and work ethic</li>
              <li>Provide feedback on product and sales approach</li>
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
              Termination
            </h3>
            <ul style={{
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li>Either party may terminate with 7 days written notice</li>
              <li>Commissions will be paid on all closed deals, regardless of termination</li>
              <li>No equity will be granted during or after trial if terminated</li>
              <li>Clean break with no further obligations</li>
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
              Successful Trial Outcome
            </h4>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.8',
              fontFamily: 'Inter, sans-serif'
            }}>
              If the trial period is successful (2-5 customers closed, demonstrated sales ability, 
              and positive working relationship), we will move to Phase 1: Commission-Only Sales Agreement.
            </p>
          </div>
        </section>

        {/* Phase 1 Agreement */}
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
            marginBottom: '1rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Phase 1: Commission-Only Sales Agreement
          </h2>
          <div style={{
            background: '#dbeafe',
            border: '2px solid #3b82f6',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <p style={{
              color: '#1e40af',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif'
            }}>
              ℹ️ This phase begins after successful completion of the trial period.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: '#1f2937',
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Terms
            </h3>
            <ul style={{
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li><strong>Duration:</strong> 6 months (with co-founder review at 6 months)</li>
              <li><strong>Start Date:</strong> Upon successful completion of trial period</li>
              <li><strong>Review Date:</strong> 6 months from Phase 1 start</li>
              <li><strong>Status:</strong> Employee or Independent Contractor (to be determined)</li>
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
              Compensation
            </h3>
            <div style={{
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              marginBottom: '1rem'
            }}>
              <p style={{
                color: '#1f2937',
                fontWeight: 600,
                marginBottom: '0.75rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Commission Structure (Tiered):
              </p>
              <ul style={{
                color: '#6b7280',
                lineHeight: '1.8',
                paddingLeft: '1.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                <li><strong>First $50K ARR:</strong> 30% commission</li>
                <li><strong>$50K-$150K ARR:</strong> 25% commission</li>
                <li><strong>$150K+ ARR:</strong> 20% commission</li>
              </ul>
            </div>
            <ul style={{
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li><strong>Base Salary:</strong> $0 (commission-only)</li>
              <li><strong>Equity:</strong> 2-3% (employee grant, 4-year vesting, 6-month cliff)</li>
              <li><strong>Payment Terms:</strong> Commissions paid within 30 days of customer payment</li>
              <li><strong>Expenses:</strong> Reimbursed with receipts</li>
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
              Performance Expectations
            </h3>
            <ul style={{
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li><strong>Month 1-3:</strong> 5-10 customers</li>
              <li><strong>Month 4-6:</strong> 10-15 customers</li>
              <li><strong>Total 6 months:</strong> 15-25 customers = $30K-$50K ARR</li>
              <li>Establish repeatable sales process</li>
              <li>Build sales pipeline and materials</li>
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
              <li><strong>Grant:</strong> 2-3% equity (from employee option pool)</li>
              <li><strong>Vesting:</strong> 4-year vesting schedule</li>
              <li><strong>Cliff:</strong> 6-month cliff (no vesting until 6 months)</li>
              <li><strong>Vesting Schedule:</strong> Monthly vesting after cliff</li>
              <li><strong>83(b) Election:</strong> Recommended within 30 days of grant</li>
            </ul>
          </div>
        </section>

        {/* Co-Founder Path */}
        <section style={{
          background: 'white',
          borderRadius: '0.5rem',
          padding: '3rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '3px solid #355B45'
        }}>
          <h2 style={{
            color: '#355B45',
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '1rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Phase 2: Co-Founder Status (Earned)
          </h2>
          <div style={{
            background: '#f0f4f1',
            border: '2px solid #355B45',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <p style={{
              color: '#355B45',
              fontWeight: 600,
              fontSize: '1.125rem',
              marginBottom: '0.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              🎯 Co-Founder status is earned through performance, not granted automatically.
            </p>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.8',
              fontFamily: 'Inter, sans-serif'
            }}>
              This is a significant milestone that demonstrates your commitment, sales ability, 
              and value to the company. Co-founder status comes with increased equity, 
              decision-making authority, and long-term commitment.
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: '#1f2937',
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Performance Milestones Required
            </h3>
            <div style={{
              background: '#fef2f2',
              border: '2px solid #fecaca',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              marginBottom: '1rem'
            }}>
              <p style={{
                color: '#991b1b',
                fontWeight: 600,
                marginBottom: '0.75rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                All of the following must be achieved:
              </p>
              <ul style={{
                color: '#991b1b',
                lineHeight: '1.8',
                paddingLeft: '1.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                <li>✅ Close 20-30 total paying customers</li>
                <li>✅ Generate $40,000-$60,000+ ARR</li>
                <li>✅ Establish repeatable sales process</li>
                <li>✅ Demonstrate leadership in sales strategy</li>
                <li>✅ Show commitment to long-term success</li>
                <li>✅ Positive working relationship and cultural fit</li>
              </ul>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: '#1f2937',
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Co-Founder Benefits
            </h3>
            <div style={{
              background: '#f0fdf4',
              border: '2px solid #86efac',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              marginBottom: '1rem'
            }}>
              <p style={{
                color: '#166534',
                fontWeight: 600,
                marginBottom: '0.75rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Upon earning co-founder status:
              </p>
              <ul style={{
                color: '#166534',
                lineHeight: '1.8',
                paddingLeft: '1.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                <li><strong>Equity:</strong> 10% co-founder stake (separate from employee pool)</li>
                <li><strong>Title:</strong> Co-Founder & Head of Sales</li>
                <li><strong>Commission:</strong> 15-20% (lower % but higher volume expected)</li>
                <li><strong>Decision-Making:</strong> Full co-founder rights and responsibilities</li>
                <li><strong>Vesting:</strong> New 4-year vesting schedule from co-founder date</li>
                <li><strong>Board:</strong> Potential board seat (depending on company structure)</li>
              </ul>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{
              color: '#1f2937',
              fontSize: '1.5rem',
              fontWeight: 600,
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Review Process
            </h3>
            <ul style={{
              color: '#6b7280',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li><strong>Timeline:</strong> Performance review at 6 months of Phase 1</li>
              <li><strong>Evaluation:</strong> Objective metrics + subjective assessment</li>
              <li><strong>Decision:</strong> If milestones met → Co-founder conversion</li>
              <li><strong>If not met:</strong> Continue Phase 1, re-evaluate at 12 months, or part ways if not working</li>
            </ul>
          </div>

          <div style={{
            background: '#fef3c7',
            border: '2px solid #fbbf24',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginTop: '2rem'
          }}>
            <p style={{
              color: '#92400e',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              marginBottom: '0.5rem'
            }}>
              ⚠️ Important Notes:
            </p>
            <ul style={{
              color: '#92400e',
              lineHeight: '1.8',
              paddingLeft: '1.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              <li>Co-founder equity is separate from the employee option pool</li>
              <li>Co-founder status is permanent once granted (subject to vesting)</li>
              <li>This is a significant commitment from both parties</li>
              <li>All agreements will be formalized with legal documentation</li>
            </ul>
          </div>
        </section>

        {/* Summary */}
        <section style={{
          background: 'linear-gradient(135deg, #355B45 0%, #244032 100%)',
          borderRadius: '0.5rem',
          padding: '3rem',
          color: 'white',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Summary
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Phase 0: Trial (30-90 days)
              </h3>
              <ul style={{
                opacity: 0.9,
                lineHeight: '1.8',
                paddingLeft: '1.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                <li>35% commission</li>
                <li>No equity</li>
                <li>2-5 customers target</li>
                <li>7-day termination notice</li>
              </ul>
            </div>
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Phase 1: Sales Hire (6 months)
              </h3>
              <ul style={{
                opacity: 0.9,
                lineHeight: '1.8',
                paddingLeft: '1.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                <li>25-30% commission (tiered)</li>
                <li>2-3% equity (employee)</li>
                <li>15-25 customers target</li>
                <li>Path to co-founder</li>
              </ul>
            </div>
            <div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                marginBottom: '0.75rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Phase 2: Co-Founder (Earned)
              </h3>
              <ul style={{
                opacity: 0.9,
                lineHeight: '1.8',
                paddingLeft: '1.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                <li>10% co-founder equity</li>
                <li>15-20% commission</li>
                <li>Full co-founder rights</li>
                <li>Long-term commitment</li>
              </ul>
            </div>
          </div>
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
            <li><strong>Review this offer letter</strong> and discuss any questions</li>
            <li><strong>Agree on trial period duration</strong> (30, 60, or 90 days)</li>
            <li><strong>Sign trial period agreement</strong> (legal documentation)</li>
            <li><strong>Begin trial period</strong> and start sales activities</li>
            <li><strong>Regular check-ins</strong> (weekly during trial, monthly after)</li>
            <li><strong>Performance review</strong> at end of trial → Phase 1 if successful</li>
            <li><strong>6-month review</strong> → Co-founder status if milestones met</li>
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
              this arrangement works for both parties and sets us up for long-term success.
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
          © 2024 Neighbri. All rights reserved. Confidential - For Christian Maloney Only.
        </p>
      </footer>
    </div>
  );
};

export default OfferLetterPage;

