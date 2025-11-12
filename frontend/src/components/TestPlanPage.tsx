import React from 'react';
import { Link } from 'react-router-dom';
import TestPlanFeedbackForm from './TestPlanFeedbackForm';

const TestPlanPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      padding: '2rem 1rem',
      fontFamily: 'Inter, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link 
            to="/" 
            style={{
              color: '#355B45',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            ← Back to Home
          </Link>
        </div>

        <h1 style={{
          color: '#355B45',
          fontSize: '2.5rem',
          marginBottom: '1rem',
          fontWeight: 700
        }}>
          Neighbri Beta Testing Plan
        </h1>

        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '6px',
          padding: '1rem',
          marginBottom: '2rem'
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#78350f', fontWeight: 600 }}>
            🎉 Welcome Beta Testers! This is beta software - your feedback is invaluable!
          </p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#374151', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Important Notes
          </h2>
          <ul style={{ lineHeight: '1.8', color: '#6b7280', paddingLeft: '1.5rem' }}>
            <li>This is a <strong>beta version</strong> - some features may not work perfectly</li>
            <li>Please report any issues, bugs, or confusing experiences</li>
            <li>Feel free to test edge cases and unusual scenarios</li>
            <li>All feedback is welcome, even if it's just "this feels weird"</li>
            <li><strong>This test plan is a guide - feel free to go off script!</strong> Explore, click around, and test things in any order you like.</li>
            <li>We welcome feedback on <strong>style, formatting, features, and anything else</strong> you notice</li>
          </ul>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#374151', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Pre-Testing Setup
          </h2>
          <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '6px' }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>What You'll Need:</p>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li><strong>Two valid email addresses</strong>:
                <ul style={{ marginTop: '0.25rem', paddingLeft: '1.5rem' }}>
                  <li><strong>Email 1:</strong> For creating a NEW community (you'll become the admin)</li>
                  <li><strong>Email 2:</strong> For registering and joining "The Sanctuary" community (you'll become a resident)</li>
                </ul>
              </li>
              <li>Access to your email inbox (for verification and notifications)</li>
              <li>A web browser (Chrome, Firefox, Safari, or Edge recommended)</li>
              <li>About 1-2 hours to complete the full test plan (or test at your own pace!)</li>
            </ul>
            <p style={{ margin: '1rem 0 0.5rem 0', fontWeight: 600 }}>Testing Flow:</p>
            <ol style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
              <li><strong>Create a New Community</strong> (using Email 1) - This makes you an admin of your own community</li>
              <li><strong>Register for The Sanctuary</strong> (using Email 2) - Search for zip code <code style={{ backgroundColor: '#e5e7eb', padding: '2px 6px', borderRadius: '3px' }}>70471</code> to find "The Sanctuary"</li>
              <li><strong>Test Different Roles</strong> - Use the test accounts below to experience different user perspectives</li>
            </ol>
            <p style={{ margin: '1rem 0 0.5rem 0', fontWeight: 600 }}>Test Accounts for The Sanctuary:</p>
            <div style={{ backgroundColor: '#dbeafe', border: '1px solid #3b82f6', borderRadius: '4px', padding: '0.75rem', marginTop: '0.5rem' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '14px' }}>Once you've registered for The Sanctuary, you can test different roles:</p>
              <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', fontSize: '14px', lineHeight: '1.6' }}>
                <li><strong>Admin Role:</strong> <code style={{ backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '3px' }}>ryan@kellby.com</code> | <code style={{ backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '3px' }}>admin123</code></li>
                <li><strong>Janitorial Role:</strong> <code style={{ backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '3px' }}>janitorial@hoa.com</code> | <code style={{ backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '3px' }}>admin123</code></li>
                <li><strong>Resident Role:</strong> Use your Email 2 (the one you used to register for The Sanctuary) OR <code style={{ backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '3px' }}>resident@hoa.com</code> | <code style={{ backgroundColor: '#f3f4f6', padding: '2px 6px', borderRadius: '3px' }}>admin123</code></li>
              </ul>
            </div>
            <p style={{ margin: '1rem 0 0.5rem 0', fontWeight: 600 }}>Test Environment:</p>
            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
              <li><strong>URL:</strong> https://www.neighbri.com</li>
              <li><strong>Browser:</strong> Please use a modern browser (Chrome, Firefox, Safari, or Edge)</li>
            </ul>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#374151', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Test Scenarios
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#355B45', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              Scenario 1: New Community Creation
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
              Test the complete flow of creating a new HOA/community on Neighbri, including the subscription payment modal and welcome email.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#355B45', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              Scenario 2: Registering with The Sanctuary
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
              Test joining "The Sanctuary" community by searching for it (zip code 70471) and the approval workflow.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#355B45', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              Scenario 3: Admin Perspective Testing
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
              Test all features available to community administrators: creating amenities, managing members, reviewing damage assessments, and more.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#355B45', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              Scenario 4: Janitorial Perspective Testing
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
              Test features available to janitorial staff: approving reservations, setting cleaning times, proposing modifications, and assessing damages.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#355B45', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              Scenario 5: Resident Perspective Testing
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
              Test features available to regular residents: creating reservations, modifying/canceling reservations, handling modification proposals, and managing profile settings.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#355B45', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              Scenario 6: Email Notifications Testing
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
              Verify that email notifications are sent correctly for all events (reservations, modifications, approvals, etc.).
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#355B45', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              Scenario 7: Edge Cases and Error Handling
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
              Test unusual scenarios, form validation, access control, and browser compatibility.
            </p>
          </div>

          {/* Single Feedback Form Below All Scenarios */}
          <TestPlanFeedbackForm isGeneral={true} />
        </div>

      </div>
    </div>
  );
};

export default TestPlanPage;

