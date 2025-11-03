import React from 'react';
import { Link } from 'react-router-dom';
import LandingHeader from './LandingHeader';

const LandingPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <LandingHeader />
      <main>
        {/* Hero Section */}
        <section style={{
          padding: '4rem 1rem',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '2rem' }}>
            <img 
              src="/images/Neighbri_Wordmark_Final.png" 
              alt="Neighbri"
              style={{ 
                height: '60px', 
                maxWidth: '300px',
                margin: '0 auto 1.5rem'
              }}
            />
          </div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '1rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Your Neighborhood Amenities, Simplified
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#6b7280',
            marginBottom: '2.5rem',
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.6',
            fontFamily: 'Inter, sans-serif'
          }}>
            Streamline amenity reservations for your community. Book pools, clubrooms, and more with ease.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/login"
              style={{
                backgroundColor: '#355B45',
                color: 'white',
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
                e.currentTarget.style.backgroundColor = '#244032';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#355B45';
              }}
            >
              Get Started
            </Link>
            <Link
              to="/about"
              style={{
                backgroundColor: 'transparent',
                color: '#355B45',
                padding: '0.75rem 2rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontSize: '1.125rem',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
                border: '2px solid #355B45',
                transition: 'background-color 0.2s',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f4f1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Learn More
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section style={{
          padding: '4rem 1rem',
          backgroundColor: 'white',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#1f2937',
            textAlign: 'center',
            marginBottom: '3rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Features
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            padding: '0 1rem'
          }}>
            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1rem'
              }}>
                📅
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Easy Reservations
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif'
              }}>
                Book amenities with a simple, intuitive calendar interface.
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1rem'
              }}>
                🔔
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Real-time Updates
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif'
              }}>
                Stay informed with instant notifications and availability updates.
              </p>
            </div>

            <div style={{
              padding: '2rem',
              borderRadius: '0.5rem',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1rem'
              }}>
                🏘️
              </div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Community Management
              </h3>
              <p style={{
                color: '#6b7280',
                lineHeight: '1.6',
                fontFamily: 'Inter, sans-serif'
              }}>
                Streamlined administration tools for HOA staff and residents.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          padding: '4rem 1rem',
          backgroundColor: '#355B45',
          color: 'white',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '1rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            Ready to Simplify Your Amenity Management?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            marginBottom: '2rem',
            opacity: 0.9,
            fontFamily: 'Inter, sans-serif'
          }}>
            Join your community on Neighbri today.
          </p>
          <Link
            to="/login"
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
            Sign In
          </Link>
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

export default LandingPage;

