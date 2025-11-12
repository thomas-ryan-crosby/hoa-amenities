import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// ScenarioFeedbackBox component moved outside to prevent re-creation on every render
interface ScenarioFeedbackBoxProps {
  scenarioNumber: number;
  scenarioName: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ScenarioFeedbackBox: React.FC<ScenarioFeedbackBoxProps> = ({ scenarioNumber, scenarioName, value, onChange }) => {
  return (
    <div style={{ 
      marginTop: '1rem', 
      marginBottom: '1.5rem',
      padding: '1rem',
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '6px'
    }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '14px' }}>
        Feedback for Scenario {scenarioNumber}: {scenarioName} (optional)
      </label>
      <textarea
        name={`scenario${scenarioNumber}Feedback`}
        value={value}
        onChange={onChange}
        rows={3}
        placeholder={`Share your thoughts, observations, or feedback for Scenario ${scenarioNumber}...`}
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          fontSize: '14px',
          fontFamily: 'inherit',
          resize: 'vertical'
        }}
      />
    </div>
  );
};

const TestPlanPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
    testScenarios: '',
    overallExperience: '',
    bugs: '',
    suggestions: '',
    scenario1Feedback: '',
    scenario2Feedback: '',
    scenario3Feedback: '',
    scenario4Feedback: '',
    scenario5Feedback: '',
    scenario6Feedback: '',
    scenario7Feedback: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      // Collect all scenario feedbacks into a structured object
      const scenarioFeedbacks = {
        scenario1: formData.scenario1Feedback,
        scenario2: formData.scenario2Feedback,
        scenario3: formData.scenario3Feedback,
        scenario4: formData.scenario4Feedback,
        scenario5: formData.scenario5Feedback,
        scenario6: formData.scenario6Feedback,
        scenario7: formData.scenario7Feedback
      };

      const response = await axios.post(`${apiUrl}/api/feedback/test-plan`, {
        name: formData.name,
        email: formData.email,
        feedback: formData.feedback,
        testScenarios: formData.testScenarios,
        overallExperience: formData.overallExperience,
        bugs: formData.bugs,
        suggestions: formData.suggestions,
        scenarioFeedbacks: scenarioFeedbacks
      });

      if (response.data.success) {
        setSubmitted(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          feedback: '',
          testScenarios: '',
          overallExperience: '',
          bugs: '',
          suggestions: '',
          scenario1Feedback: '',
          scenario2Feedback: '',
          scenario3Feedback: '',
          scenario4Feedback: '',
          scenario5Feedback: '',
          scenario6Feedback: '',
          scenario7Feedback: ''
        });
      }
    } catch (err: any) {
      console.error('Error submitting feedback:', err);
      setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  if (submitted) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        padding: '2rem 1rem',
        fontFamily: 'Inter, sans-serif',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '3rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: '#d1fae5',
            border: '1px solid #10b981',
            borderRadius: '6px',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <p style={{ color: '#065f46', margin: 0, fontSize: '18px', fontWeight: 600 }}>
              ✅ Feedback submitted successfully!
            </p>
            <p style={{ color: '#065f46', margin: '0.5rem 0 0 0', fontSize: '14px' }}>
              You'll receive a confirmation email at {formData.email || 'your email address'}.
            </p>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              window.location.reload();
            }}
            style={{
              marginTop: '1rem',
              padding: '10px 20px',
              backgroundColor: '#355B45',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Submit More Feedback
          </button>
        </div>
      </div>
    );
  }

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
          
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #ef4444',
                borderRadius: '4px',
                padding: '12px',
                marginBottom: '1rem',
                color: '#991b1b',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            {/* Test Scenarios with Feedback Boxes */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#355B45', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Scenario 1: New Community Creation
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                Test the complete flow of creating a new HOA/community on Neighbri, including the subscription payment modal and welcome email.
              </p>
              <ScenarioFeedbackBox 
                scenarioNumber={1} 
                scenarioName="New Community Creation"
                value={formData.scenario1Feedback}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#355B45', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Scenario 2: Registering with The Sanctuary
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                Test joining "The Sanctuary" community by searching for it (zip code 70471) and the approval workflow.
              </p>
              <ScenarioFeedbackBox 
                scenarioNumber={2} 
                scenarioName="Registering with The Sanctuary"
                value={formData.scenario2Feedback}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#355B45', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Scenario 3: Admin Perspective Testing
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                Test all features available to community administrators: creating amenities, managing members, reviewing damage assessments, and more.
              </p>
              <ScenarioFeedbackBox 
                scenarioNumber={3} 
                scenarioName="Admin Perspective Testing"
                value={formData.scenario3Feedback}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#355B45', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Scenario 4: Janitorial Perspective Testing
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                Test features available to janitorial staff: approving reservations, setting cleaning times, proposing modifications, and assessing damages.
              </p>
              <ScenarioFeedbackBox 
                scenarioNumber={4} 
                scenarioName="Janitorial Perspective Testing"
                value={formData.scenario4Feedback}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#355B45', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Scenario 5: Resident Perspective Testing
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                Test features available to regular residents: creating reservations, modifying/canceling reservations, handling modification proposals, and managing profile settings.
              </p>
              <ScenarioFeedbackBox 
                scenarioNumber={5} 
                scenarioName="Resident Perspective Testing"
                value={formData.scenario5Feedback}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#355B45', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Scenario 6: Email Notifications Testing
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                Verify that email notifications are sent correctly for all events (reservations, modifications, approvals, etc.).
              </p>
              <ScenarioFeedbackBox 
                scenarioNumber={6} 
                scenarioName="Email Notifications Testing"
                value={formData.scenario6Feedback}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#355B45', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Scenario 7: Edge Cases and Error Handling
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                Test unusual scenarios, form validation, access control, and browser compatibility.
              </p>
              <ScenarioFeedbackBox 
                scenarioNumber={7} 
                scenarioName="Edge Cases and Error Handling"
                value={formData.scenario7Feedback}
                onChange={handleChange}
              />
            </div>

            {/* General Feedback Section */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ color: '#374151', fontSize: '1.5rem', marginBottom: '1rem' }}>
                General Feedback
              </h2>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '14px' }}>
                  Test Scenarios Completed (optional)
                </label>
                <textarea
                  name="testScenarios"
                  value={formData.testScenarios}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Which test scenarios did you complete? (e.g., Scenario 1, 3, 5)"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '14px' }}>
                  Overall Experience (optional)
                </label>
                <textarea
                  name="overallExperience"
                  value={formData.overallExperience}
                  onChange={handleChange}
                  rows={3}
                  placeholder="How was your overall experience testing Neighbri?"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '14px' }}>
                  Bugs & Issues Found (optional)
                </label>
                <textarea
                  name="bugs"
                  value={formData.bugs}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe any bugs, errors, or issues you encountered..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '14px' }}>
                  Suggestions & Improvements (optional)
                </label>
                <textarea
                  name="suggestions"
                  value={formData.suggestions}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any suggestions for improvements, new features, or design changes?"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '14px' }}>
                  General Feedback (UI, Design, Features, etc.) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Share your thoughts on UI, design, features, or any other general feedback..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            {/* Name, Email, and Submit Button */}
            <div style={{ 
              borderTop: '2px solid #e5e7eb', 
              paddingTop: '1.5rem', 
              marginTop: '2rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '14px' }}>
                    Your Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '14px' }}>
                    Your Email <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  backgroundColor: submitting ? '#9ca3af' : '#355B45',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>

              <p style={{ marginTop: '1rem', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
                Your feedback will be sent to neighbriapp@gmail.com and you'll receive a confirmation copy.
              </p>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default TestPlanPage;
