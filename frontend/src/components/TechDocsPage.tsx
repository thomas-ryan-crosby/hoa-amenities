import React from 'react';
import LandingHeader from './LandingHeader';

const TechDocsPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <LandingHeader />
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Internal Technical Documentation
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            System architecture, workflows, and technical specifications
          </p>
        </div>

        {/* Table of Contents */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '2rem', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
            Table of Contents
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#workflow" style={{ color: '#355B45', textDecoration: 'none' }}>
                1. Reservation Workflow Diagram
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#status-flow" style={{ color: '#355B45', textDecoration: 'none' }}>
                2. Status Flow & State Management
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#modification-flow" style={{ color: '#355B45', textDecoration: 'none' }}>
                3. Modification Workflow
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#damage-flow" style={{ color: '#355B45', textDecoration: 'none' }}>
                4. Damage Assessment Workflow
              </a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="#architecture" style={{ color: '#355B45', textDecoration: 'none' }}>
                5. System Architecture
              </a>
            </li>
          </ul>
        </div>

        {/* Workflow Diagram Section */}
        <section id="workflow" style={{ marginBottom: '4rem' }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '2rem', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Reservation Workflow Diagram
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Complete flow of a reservation from creation through completion, including approval, modification, and damage assessment processes.
            </p>

            {/* Mermaid Diagram Container */}
            <div style={{ 
              backgroundColor: '#f9fafb', 
              padding: '2rem', 
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              overflowX: 'auto',
              marginBottom: '2rem'
            }}>
              <div style={{ 
                fontFamily: 'monospace', 
                fontSize: '14px',
                lineHeight: '1.6',
                color: '#374151'
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{`graph TD
    Start([Resident Creates Reservation]) --> CheckApproval{Check Amenity<br/>Approval Requirements}
    
    CheckApproval -->|No Janitorial<br/>No Admin| FullyApproved1[Status: FULLY_APPROVED]
    CheckApproval -->|No Janitorial<br/>Admin Required| JanitorialApproved1[Status: JANITORIAL_APPROVED]
    CheckApproval -->|Janitorial Required| New[Status: NEW]
    
    New --> JanitorialReview{Janitorial Staff<br/>Reviews}
    JanitorialReview -->|Approve| CheckAdmin{Admin Approval<br/>Required?}
    JanitorialReview -->|Reject| Cancelled1[Status: CANCELLED]
    
    CheckAdmin -->|Yes| JanitorialApproved2[Status: JANITORIAL_APPROVED]
    CheckAdmin -->|No| FullyApproved2[Status: FULLY_APPROVED]
    
    JanitorialApproved1 --> AdminReview1{Admin Reviews}
    JanitorialApproved2 --> AdminReview2{Admin Reviews}
    
    AdminReview1 -->|Approve| FullyApproved3[Status: FULLY_APPROVED]
    AdminReview1 -->|Reject| Cancelled2[Status: CANCELLED]
    AdminReview2 -->|Approve| FullyApproved4[Status: FULLY_APPROVED]
    AdminReview2 -->|Reject| Cancelled3[Status: CANCELLED]
    
    FullyApproved1 --> CanModify1{Modification<br/>Proposed?}
    FullyApproved2 --> CanModify2{Modification<br/>Proposed?}
    FullyApproved3 --> CanModify3{Modification<br/>Proposed?}
    FullyApproved4 --> CanModify4{Modification<br/>Proposed?}
    New --> CanModify5{Modification<br/>Proposed?}
    JanitorialApproved1 --> CanModify6{Modification<br/>Proposed?}
    JanitorialApproved2 --> CanModify7{Modification<br/>Proposed?}
    
    CanModify1 -->|Yes| ModPending1[modificationStatus: PENDING]
    CanModify2 -->|Yes| ModPending2[modificationStatus: PENDING]
    CanModify3 -->|Yes| ModPending3[modificationStatus: PENDING]
    CanModify4 -->|Yes| ModPending4[modificationStatus: PENDING]
    CanModify5 -->|Yes| ModPending5[modificationStatus: PENDING]
    CanModify6 -->|Yes| ModPending6[modificationStatus: PENDING]
    CanModify7 -->|Yes| ModPending7[modificationStatus: PENDING]
    
    ModPending1 --> ResidentResponse1{Resident<br/>Responds}
    ModPending2 --> ResidentResponse2{Resident<br/>Responds}
    ModPending3 --> ResidentResponse3{Resident<br/>Responds}
    ModPending4 --> ResidentResponse4{Resident<br/>Responds}
    ModPending5 --> ResidentResponse5{Resident<br/>Responds}
    ModPending6 --> ResidentResponse6{Resident<br/>Responds}
    ModPending7 --> ResidentResponse7{Resident<br/>Responds}
    
    ResidentResponse1 -->|Accept| UpdateReservation1[Update Dates/Times<br/>Status → NEW]
    ResidentResponse1 -->|Reject| FullyApproved1
    ResidentResponse2 -->|Accept| UpdateReservation2[Update Dates/Times<br/>Status → NEW]
    ResidentResponse2 -->|Reject| FullyApproved2
    ResidentResponse3 -->|Accept| UpdateReservation3[Update Dates/Times<br/>Status → NEW]
    ResidentResponse3 -->|Reject| FullyApproved3
    ResidentResponse4 -->|Accept| UpdateReservation4[Update Dates/Times<br/>Status → NEW]
    ResidentResponse4 -->|Reject| FullyApproved4
    ResidentResponse5 -->|Accept| UpdateReservation5[Update Dates/Times<br/>Status → NEW]
    ResidentResponse5 -->|Reject| New
    ResidentResponse6 -->|Accept| UpdateReservation6[Update Dates/Times<br/>Status → NEW]
    ResidentResponse6 -->|Reject| JanitorialApproved1
    ResidentResponse7 -->|Accept| UpdateReservation7[Update Dates/Times<br/>Status → NEW]
    ResidentResponse7 -->|Reject| JanitorialApproved2
    
    UpdateReservation1 --> New
    UpdateReservation2 --> New
    UpdateReservation3 --> New
    UpdateReservation4 --> New
    UpdateReservation5 --> New
    UpdateReservation6 --> New
    UpdateReservation7 --> New
    
    FullyApproved1 --> ReservationDate{Reservation<br/>Date Arrives}
    FullyApproved2 --> ReservationDate
    FullyApproved3 --> ReservationDate
    FullyApproved4 --> ReservationDate
    
    ReservationDate --> MarkComplete[Janitorial Marks<br/>Party Complete]
    
    MarkComplete --> CheckDamages{Damages<br/>Found?}
    
    CheckDamages -->|No| Completed1[Status: COMPLETED<br/>damageAssessmentPending: false]
    CheckDamages -->|Yes| Completed2[Status: COMPLETED<br/>damageAssessmentPending: true]
    
    Completed2 --> AssessDamages[Janitorial Assesses<br/>Damages]
    AssessDamages --> DamagePending[damageAssessed: true<br/>damageAssessmentStatus: PENDING]
    
    DamagePending --> AdminReviewDamage{Admin Reviews<br/>Damage Assessment}
    
    AdminReviewDamage -->|Approve| DamageApproved[damageAssessmentStatus: APPROVED<br/>damageCharge: damageChargeAmount]
    AdminReviewDamage -->|Adjust| DamageAdjusted[damageAssessmentStatus: ADJUSTED<br/>damageCharge: adjustedAmount]
    AdminReviewDamage -->|Deny| DamageDenied[damageAssessmentStatus: DENIED<br/>damageCharge: null]
    
    DamageApproved --> End1([End])
    DamageAdjusted --> End2([End])
    DamageDenied --> End3([End])
    Completed1 --> End4([End])
    Cancelled1 --> End5([End])
    Cancelled2 --> End6([End])
    Cancelled3 --> End7([End])
    
    style Start fill:#355B45,stroke:#1f2937,stroke-width:2px,color:#fff
    style End1 fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style End2 fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style End3 fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style End4 fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style End5 fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
    style End6 fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
    style End7 fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
    style New fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    style JanitorialApproved1 fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff
    style JanitorialApproved2 fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff
    style FullyApproved1 fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style FullyApproved2 fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style FullyApproved3 fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style FullyApproved4 fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style Completed1 fill:#6b7280,stroke:#4b5563,stroke-width:2px,color:#fff
    style Completed2 fill:#6b7280,stroke:#4b5563,stroke-width:2px,color:#fff
    style Cancelled1 fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
    style Cancelled2 fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
    style Cancelled3 fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff`}</pre>
              </div>
            </div>

            <div style={{ 
              backgroundColor: '#fef3c7', 
              padding: '1rem', 
              borderRadius: '4px',
              border: '1px solid #f59e0b',
              marginTop: '1rem'
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e' }}>
                <strong>Note:</strong> This diagram can be rendered using Mermaid.js. To view it visually, copy the diagram code above and paste it into a Mermaid editor (e.g., <a href="https://mermaid.live" target="_blank" rel="noopener noreferrer" style={{ color: '#92400e', textDecoration: 'underline' }}>mermaid.live</a>).
              </p>
            </div>
          </div>
        </section>

        {/* Status Flow Section */}
        <section id="status-flow" style={{ marginBottom: '4rem' }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '2rem', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Status Flow & State Management
            </h2>
            
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginTop: '2rem', marginBottom: '1rem' }}>
              Reservation Statuses
            </h3>
            <ul style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
              <li><strong style={{ color: '#1f2937' }}>NEW</strong>: Initial status when janitorial approval is required. Awaiting janitorial staff review.</li>
              <li><strong style={{ color: '#1f2937' }}>JANITORIAL_APPROVED</strong>: Janitorial has approved, but admin approval is still required.</li>
              <li><strong style={{ color: '#1f2937' }}>FULLY_APPROVED</strong>: All approvals complete. Reservation is confirmed and ready.</li>
              <li><strong style={{ color: '#1f2937' }}>COMPLETED</strong>: Party has occurred and been marked complete by janitorial staff.</li>
              <li><strong style={{ color: '#1f2937' }}>CANCELLED</strong>: Reservation was rejected or cancelled.</li>
            </ul>

            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginTop: '2rem', marginBottom: '1rem' }}>
              Initial Status Determination
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              When a reservation is created, the initial status is determined by the amenity's approval requirements:
            </p>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb', color: '#374151' }}>Janitorial Required</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb', color: '#374151' }}>Admin Required</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', border: '1px solid #e5e7eb', color: '#374151' }}>Initial Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', color: '#6b7280' }}>No</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', color: '#6b7280' }}>No</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', color: '#6b7280' }}><strong>FULLY_APPROVED</strong></td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', color: '#6b7280' }}>No</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', color: '#6b7280' }}>Yes</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', color: '#6b7280' }}><strong>JANITORIAL_APPROVED</strong></td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', color: '#6b7280' }}>Yes</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', color: '#6b7280' }}>No</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', color: '#6b7280' }}><strong>NEW</strong></td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', color: '#6b7280' }}>Yes</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', color: '#6b7280' }}>Yes</td>
                  <td style={{ padding: '0.75rem', border: '1px solid #e5e7eb', color: '#6b7280' }}><strong>NEW</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Modification Flow Section */}
        <section id="modification-flow" style={{ marginBottom: '4rem' }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '2rem', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Modification Workflow
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Modifications can be proposed by admin or janitorial staff for reservations that are not yet FULLY_APPROVED.
            </p>
            
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginTop: '2rem', marginBottom: '1rem' }}>
              Modification Status Flow
            </h3>
            <ol style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
              <li><strong style={{ color: '#1f2937' }}>Proposal</strong>: Admin/Janitorial proposes new date/time. <code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>modificationStatus = 'PENDING'</code></li>
              <li><strong style={{ color: '#1f2937' }}>Resident Response</strong>: Resident can ACCEPT or REJECT the proposal.</li>
              <li><strong style={{ color: '#1f2937' }}>If ACCEPTED</strong>:
                <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                  <li>Reservation dates/times are updated to proposed values</li>
                  <li>Status is reset to <code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>NEW</code> (requires re-approval)</li>
                  <li><code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>modificationStatus = 'ACCEPTED'</code></li>
                </ul>
              </li>
              <li><strong style={{ color: '#1f2937' }}>If REJECTED</strong>:
                <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                  <li>Original reservation remains unchanged</li>
                  <li><code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>modificationStatus = 'REJECTED'</code></li>
                </ul>
              </li>
            </ol>
          </div>
        </section>

        {/* Damage Assessment Flow Section */}
        <section id="damage-flow" style={{ marginBottom: '4rem' }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '2rem', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              Damage Assessment Workflow
            </h2>
            
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginTop: '2rem', marginBottom: '1rem' }}>
              Completion & Assessment
            </h3>
            <ol style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
              <li><strong style={{ color: '#1f2937' }}>Mark Complete</strong>: When reservation date arrives, janitorial marks party as complete.</li>
              <li><strong style={{ color: '#1f2937' }}>Damage Check</strong>:
                <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                  <li>If <strong>no damages</strong>: <code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>damageAssessmentPending = false</code>, status = COMPLETED</li>
                  <li>If <strong>damages found</strong>: <code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>damageAssessmentPending = true</code>, status = COMPLETED</li>
                </ul>
              </li>
              <li><strong style={{ color: '#1f2937' }}>Damage Assessment</strong> (if damages found): Janitorial assesses damages and sets:
                <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                  <li><code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>damageAssessed = true</code></li>
                  <li><code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>damageAssessmentStatus = 'PENDING'</code></li>
                  <li><code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>damageChargeAmount</code> (assessed amount)</li>
                </ul>
              </li>
              <li><strong style={{ color: '#1f2937' }}>Admin Review</strong>: Admin reviews damage assessment and can:
                <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                  <li><strong>APPROVE</strong>: <code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>damageCharge = damageChargeAmount</code></li>
                  <li><strong>ADJUST</strong>: <code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>damageCharge = adjustedAmount</code></li>
                  <li><strong>DENY</strong>: <code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>damageCharge = null</code></li>
                </ul>
              </li>
            </ol>
          </div>
        </section>

        {/* Architecture Section */}
        <section id="architecture" style={{ marginBottom: '4rem' }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '2rem', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
              System Architecture
            </h2>
            
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginTop: '2rem', marginBottom: '1rem' }}>
              Technology Stack
            </h3>
            <ul style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
              <li><strong style={{ color: '#1f2937' }}>Frontend</strong>: React with TypeScript, React Router</li>
              <li><strong style={{ color: '#1f2937' }}>Backend</strong>: Node.js with Express, TypeScript</li>
              <li><strong style={{ color: '#1f2937' }}>Database</strong>: PostgreSQL with Sequelize ORM</li>
              <li><strong style={{ color: '#1f2937' }}>Authentication</strong>: JWT tokens</li>
              <li><strong style={{ color: '#1f2937' }}>Email</strong>: Nodemailer for notifications</li>
            </ul>

            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginTop: '2rem', marginBottom: '1rem' }}>
              Key Models
            </h3>
            <ul style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem' }}>
              <li><strong style={{ color: '#1f2937' }}>User</strong>: Community members with roles (resident, janitorial, admin)</li>
              <li><strong style={{ color: '#1f2937' }}>Community</strong>: HOA/condo communities</li>
              <li><strong style={{ color: '#1f2937' }}>Amenity</strong>: Reservable amenities (pools, clubrooms, etc.)</li>
              <li><strong style={{ color: '#1f2937' }}>Reservation</strong>: Core entity tracking reservation lifecycle</li>
            </ul>

            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#374151', marginTop: '2rem', marginBottom: '1rem' }}>
              API Endpoints
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Key reservation endpoints:
            </p>
            <ul style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '2rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>
              <li><code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>POST /api/reservations</code> - Create reservation</li>
              <li><code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>PUT /api/reservations/:id/approve</code> - Approve reservation</li>
              <li><code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>PUT /api/reservations/:id/reject</code> - Reject reservation</li>
              <li><code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>PUT /api/reservations/:id/complete</code> - Mark party complete</li>
              <li><code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>POST /api/reservations/:id/assess-damages</code> - Assess damages</li>
              <li><code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>PUT /api/reservations/:id/review-damage-assessment</code> - Review damage assessment</li>
              <li><code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>POST /api/reservations/:id/propose-modification</code> - Propose modification</li>
              <li><code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>PUT /api/reservations/:id/accept-modification</code> - Accept modification</li>
              <li><code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>PUT /api/reservations/:id/reject-modification</code> - Reject modification</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TechDocsPage;

