import React from 'react';
import LandingHeader from './LandingHeader';

const PitchDeckExecutiveSummary: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'white',
      padding: '2rem 1rem'
    }}>
      <div className="no-print">
        <LandingHeader />
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 1000
        }}>
          <button
            onClick={handlePrint}
            style={{
              backgroundColor: '#355B45',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#244032';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#355B45';
            }}
          >
            Print to PDF
          </button>
        </div>
      </div>
      <div style={{
        maxWidth: '8.5in',
        margin: '0 auto',
        padding: '0.75in',
        backgroundColor: 'white',
        color: '#1f2937',
        fontFamily: 'Inter, sans-serif',
        lineHeight: 1.4
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <img 
            src="/images/Neighbri_Wordmark_Final.png" 
            alt="Neighbri"
            style={{ height: '40px', maxWidth: '200px', marginBottom: '0.25rem' }}
          />
          <h1 style={{
            fontSize: '24pt',
            fontWeight: 700,
            color: '#1f2937',
            margin: '0.25rem 0',
            fontFamily: 'Inter, sans-serif'
          }}>
            Neighbri
          </h1>
          <p style={{
            fontSize: '12pt',
            color: '#355B45',
            fontWeight: 600,
            margin: '0.25rem 0',
            fontFamily: 'Inter, sans-serif'
          }}>
            Premium Amenity Management for Luxury Communities
          </p>
          <p style={{
            fontSize: '9pt',
            color: '#6b7280',
            marginTop: '0.25rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Executive Summary | For detailed information, visit: <strong>www.neighbri.com/pitch</strong>
          </p>
        </div>

        {/* Problem */}
        <div style={{ marginBottom: '0.75rem' }}>
          <h2 style={{
            fontSize: '14pt',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '0.25rem',
            borderBottom: '1px solid #355B45',
            paddingBottom: '0.15rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            The Problem
          </h2>
          <p style={{ fontSize: '9pt', color: '#6b7280', marginBottom: '0.25rem', fontFamily: 'Inter, sans-serif' }}>
            Luxury communities rely on manual processes (email chains, spreadsheets, phone calls) to manage premium amenities, 
            leading to double-bookings, payment friction, and administrative burden. Staff spend hours coordinating reservations 
            while residents experience frustration with outdated systems.
          </p>
        </div>

        {/* Solution */}
        <div style={{ marginBottom: '0.75rem' }}>
          <h2 style={{
            fontSize: '14pt',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '0.25rem',
            borderBottom: '1px solid #355B45',
            paddingBottom: '0.15rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            The Solution
          </h2>
          <p style={{ fontSize: '9pt', color: '#6b7280', marginBottom: '0.25rem', fontFamily: 'Inter, sans-serif' }}>
            <strong>Neighbri</strong> is a modern SaaS platform that streamlines amenity reservations, payments, and management 
            for luxury residential communities. Features include:
          </p>
          <ul style={{ fontSize: '9pt', color: '#6b7280', paddingLeft: '1rem', marginBottom: '0.25rem', fontFamily: 'Inter, sans-serif' }}>
            <li>Intuitive calendar-based reservation system with real-time availability</li>
            <li>Integrated Square payment processing for fees and deposits</li>
            <li>Automated workflows: notifications, janitorial scheduling, approval processes</li>
            <li>Role-based access for residents, janitorial staff, and administrators</li>
            <li>Optional HOAPass feature: monetize amenities through day passes for non-residents</li>
          </ul>
        </div>

        {/* Market Opportunity */}
        <div style={{ marginBottom: '0.75rem' }}>
          <h2 style={{
            fontSize: '14pt',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '0.25rem',
            borderBottom: '1px solid #355B45',
            paddingBottom: '0.15rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Market Opportunity
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <div>
              <p style={{ fontSize: '9pt', color: '#6b7280', marginBottom: '0.15rem', fontFamily: 'Inter, sans-serif' }}>
                <strong style={{ color: '#1f2937' }}>Total Market:</strong> 520,000+ HOAs and multifamily properties
              </p>
              <p style={{ fontSize: '9pt', color: '#6b7280', marginBottom: '0.15rem', fontFamily: 'Inter, sans-serif' }}>
                <strong style={{ color: '#1f2937' }}>Target Market:</strong> 65,000-75,000 luxury communities
              </p>
              <p style={{ fontSize: '9pt', color: '#6b7280', marginBottom: '0.15rem', fontFamily: 'Inter, sans-serif' }}>
                <strong style={{ color: '#1f2937' }}>TAM:</strong> $227M+ (Platform Revenue)
              </p>
            </div>
            <div>
              <p style={{ fontSize: '9pt', color: '#6b7280', marginBottom: '0.15rem', fontFamily: 'Inter, sans-serif' }}>
                <strong style={{ color: '#1f2937' }}>SAM:</strong> $28M+ (Serviceable Addressable Market)
              </p>
              <p style={{ fontSize: '9pt', color: '#6b7280', marginBottom: '0.15rem', fontFamily: 'Inter, sans-serif' }}>
                <strong style={{ color: '#1f2937' }}>SOM:</strong> $1.4M+ (3-year target)
              </p>
              <p style={{ fontSize: '9pt', color: '#6b7280', marginBottom: '0.15rem', fontFamily: 'Inter, sans-serif' }}>
                <strong style={{ color: '#1f2937' }}>HOAPass TAM:</strong> $9-14B (Total market for day passes)
              </p>
            </div>
          </div>
        </div>

        {/* Business Model */}
        <div style={{ marginBottom: '0.75rem' }}>
          <h2 style={{
            fontSize: '14pt',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '0.25rem',
            borderBottom: '1px solid #355B45',
            paddingBottom: '0.15rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Business Model
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <p style={{ fontSize: '9pt', color: '#1f2937', fontWeight: 600, marginBottom: '0.15rem', fontFamily: 'Inter, sans-serif' }}>
                SaaS Subscription:
              </p>
              <ul style={{ fontSize: '8pt', color: '#6b7280', paddingLeft: '1rem', marginBottom: '0.25rem', fontFamily: 'Inter, sans-serif' }}>
                <li>Starter: $99/month (up to 50 units, 3 amenities)</li>
                <li>Professional: $199/month (51-150 units, 5 amenities)</li>
                <li>Enterprise: $299/month (151-300 units, unlimited)</li>
                <li>Custom: Contact for pricing (300+ units)</li>
              </ul>
            </div>
            <div>
              <p style={{ fontSize: '9pt', color: '#1f2937', fontWeight: 600, marginBottom: '0.15rem', fontFamily: 'Inter, sans-serif' }}>
                Additional Revenue:
              </p>
              <ul style={{ fontSize: '8pt', color: '#6b7280', paddingLeft: '1rem', marginBottom: '0.25rem', fontFamily: 'Inter, sans-serif' }}>
                <li>Payment processing: 2.9% + $0.30 per transaction</li>
                <li>HOAPass (optional): 15-20% commission on day pass sales</li>
                <li>Additional amenities: $25/month each beyond tier limit</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Traction & Competitive Advantage */}
        <div style={{ marginBottom: '0.75rem' }}>
          <h2 style={{
            fontSize: '14pt',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '0.25rem',
            borderBottom: '1px solid #355B45',
            paddingBottom: '0.15rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Traction & Competitive Advantage
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <div style={{ padding: '0.4rem', backgroundColor: '#f0fdf4', borderRadius: '3px', border: '1px solid #86efac' }}>
              <p style={{ fontSize: '8pt', color: '#1f2937', fontWeight: 600, marginBottom: '0.15rem', fontFamily: 'Inter, sans-serif' }}>
                ✓ Product Built
              </p>
              <p style={{ fontSize: '7pt', color: '#6b7280', margin: 0, fontFamily: 'Inter, sans-serif' }}>
                Fully functional web application
              </p>
            </div>
            <div style={{ padding: '0.4rem', backgroundColor: '#f0fdf4', borderRadius: '3px', border: '1px solid #86efac' }}>
              <p style={{ fontSize: '8pt', color: '#1f2937', fontWeight: 600, marginBottom: '0.15rem', fontFamily: 'Inter, sans-serif' }}>
                ✓ Beta Testing
              </p>
              <p style={{ fontSize: '7pt', color: '#6b7280', margin: 0, fontFamily: 'Inter, sans-serif' }}>
                Active beta with real communities
              </p>
            </div>
            <div style={{ padding: '0.4rem', backgroundColor: '#f0fdf4', borderRadius: '3px', border: '1px solid #86efac' }}>
              <p style={{ fontSize: '8pt', color: '#1f2937', fontWeight: 600, marginBottom: '0.15rem', fontFamily: 'Inter, sans-serif' }}>
                ✓ Production Ready
              </p>
              <p style={{ fontSize: '7pt', color: '#6b7280', margin: 0, fontFamily: 'Inter, sans-serif' }}>
                Deployed at neighbri.com
              </p>
            </div>
          </div>
          <p style={{ fontSize: '9pt', color: '#6b7280', marginBottom: '0.25rem', fontFamily: 'Inter, sans-serif' }}>
            <strong style={{ color: '#1f2937' }}>Purpose-Built:</strong> Designed specifically for amenity reservations. 
            <strong style={{ color: '#1f2937' }}> Modern UX:</strong> Clean interface residents want to use. 
            <strong style={{ color: '#1f2937' }}>Value-Aligned Pricing:</strong> Affordable without unnecessary features.
          </p>
        </div>

        {/* Financial Projections & Team */}
        <div style={{ marginBottom: '0.75rem' }}>
          <h2 style={{
            fontSize: '14pt',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '0.25rem',
            borderBottom: '1px solid #355B45',
            paddingBottom: '0.15rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Financial Projections & Team
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <div style={{ textAlign: 'center', padding: '0.4rem', backgroundColor: '#f0fdf4', borderRadius: '3px', border: '1px solid #86efac' }}>
                  <p style={{ fontSize: '10pt', fontWeight: 700, color: '#355B45', margin: '0.15rem 0', fontFamily: 'Inter, sans-serif' }}>
                    Year 1
                  </p>
                  <p style={{ fontSize: '9pt', fontWeight: 600, color: '#1f2937', margin: '0.15rem 0', fontFamily: 'Inter, sans-serif' }}>
                    30-50
                  </p>
                </div>
                <div style={{ textAlign: 'center', padding: '0.4rem', backgroundColor: '#f0fdf4', borderRadius: '3px', border: '1px solid #86efac' }}>
                  <p style={{ fontSize: '10pt', fontWeight: 700, color: '#355B45', margin: '0.15rem 0', fontFamily: 'Inter, sans-serif' }}>
                    Year 2
                  </p>
                  <p style={{ fontSize: '9pt', fontWeight: 600, color: '#1f2937', margin: '0.15rem 0', fontFamily: 'Inter, sans-serif' }}>
                    150-200
                  </p>
                </div>
                <div style={{ textAlign: 'center', padding: '0.4rem', backgroundColor: '#f0fdf4', borderRadius: '3px', border: '1px solid #86efac' }}>
                  <p style={{ fontSize: '10pt', fontWeight: 700, color: '#355B45', margin: '0.15rem 0', fontFamily: 'Inter, sans-serif' }}>
                    Year 3
                  </p>
                  <p style={{ fontSize: '9pt', fontWeight: 600, color: '#1f2937', margin: '0.15rem 0', fontFamily: 'Inter, sans-serif' }}>
                    400+
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '8pt', color: '#6b7280', fontStyle: 'italic', fontFamily: 'Inter, sans-serif' }}>
                ~$180/month avg per community. 100 communities = $216K ARR + transaction fees.
              </p>
            </div>
            <div>
              <p style={{ fontSize: '9pt', color: '#6b7280', marginBottom: '0.15rem', fontFamily: 'Inter, sans-serif' }}>
                <strong style={{ color: '#1f2937' }}>Thomas Crosby</strong> - Founder & Developer
              </p>
              <p style={{ fontSize: '8pt', color: '#6b7280', marginBottom: '0.25rem', fontFamily: 'Inter, sans-serif' }}>
                Full-stack developer with experience building scalable web applications. Passionate about solving real-world problems through technology.
              </p>
              <p style={{ fontSize: '8pt', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                <strong>Contact:</strong> thomas.ryan.crosby@gmail.com | (985) 373-2383
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '0.5rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid #355B45',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '8pt', color: '#355B45', fontWeight: 600, marginBottom: '0.15rem', fontFamily: 'Inter, sans-serif' }}>
            For detailed pitch information, visit: <strong>www.neighbri.com/pitch</strong>
          </p>
          <p style={{ fontSize: '7pt', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
            © 2024 Neighbri. All rights reserved.
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          @page {
            size: letter;
            margin: 0.5in;
          }
          * {
            page-break-inside: avoid;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PitchDeckExecutiveSummary;

