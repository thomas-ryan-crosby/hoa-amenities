import React from 'react';
import LandingHeader from './LandingHeader';

const AboutPage: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <LandingHeader />
      <main>
        <section style={{
          padding: '4rem 1rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '1.5rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            About Neighbri
          </h1>
          
          <div style={{
            fontSize: '1.125rem',
            lineHeight: '1.8',
            color: '#4b5563',
            marginBottom: '2rem',
            fontFamily: 'Inter, sans-serif'
          }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Neighbri is a modern platform designed to simplify amenity management for residential communities. 
              We understand that managing shared spaces like pools, clubrooms, and event areas can be complex and time-consuming.
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              Our mission is to make it effortless for residents to reserve amenities and for community administrators 
              to manage bookings, track usage, and maintain these shared spaces.
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              With Neighbri, you can:
            </p>
            <ul style={{
              marginLeft: '1.5rem',
              marginBottom: '1.5rem',
              listStyleType: 'disc'
            }}>
              <li style={{ marginBottom: '0.5rem' }}>Book amenities quickly with an intuitive calendar interface</li>
              <li style={{ marginBottom: '0.5rem' }}>View availability in real-time</li>
              <li style={{ marginBottom: '0.5rem' }}>Manage reservations from anywhere</li>
              <li style={{ marginBottom: '0.5rem' }}>Receive instant notifications about your bookings</li>
              <li style={{ marginBottom: '0.5rem' }}>Streamline administrative tasks for HOA staff</li>
            </ul>
            <p>
              Built with communities in mind, Neighbri brings modern technology to neighborhood amenities management, 
              making it simpler, faster, and more efficient for everyone.
            </p>
          </div>

          <div style={{
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            marginTop: '3rem'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#1f2937',
              marginBottom: '1rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Contact Us
            </h2>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.6',
              fontFamily: 'Inter, sans-serif'
            }}>
              Have questions or need support? Contact your community administrator or reach out through your HOA management portal.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '2rem 1rem',
        backgroundColor: '#1f2937',
        color: 'white',
        textAlign: 'center',
        marginTop: '4rem'
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

export default AboutPage;

