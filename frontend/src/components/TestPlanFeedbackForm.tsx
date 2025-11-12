import React, { useState } from 'react';
import axios from 'axios';

interface TestPlanFeedbackFormProps {
  onSuccess?: () => void;
  scenarioNumber?: number;
  scenarioName?: string;
  isGeneral?: boolean;
}

const TestPlanFeedbackForm: React.FC<TestPlanFeedbackFormProps> = ({ 
  onSuccess, 
  scenarioNumber, 
  scenarioName,
  isGeneral = false 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
    testScenarios: '',
    overallExperience: '',
    bugs: '',
    suggestions: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      // Build feedback text with scenario context
      let feedbackText = formData.feedback;
      if (scenarioNumber && scenarioName) {
        feedbackText = `[Scenario ${scenarioNumber}: ${scenarioName}]\n\n${feedbackText}`;
      } else if (isGeneral) {
        feedbackText = `[General Feedback]\n\n${feedbackText}`;
      }

      const response = await axios.post(`${apiUrl}/api/feedback/test-plan`, {
        ...formData,
        feedback: feedbackText,
        testScenarios: scenarioNumber ? `Scenario ${scenarioNumber}` : formData.testScenarios
      });

      if (response.data.success) {
        setSubmitted(true);
        if (onSuccess) {
          onSuccess();
        }
        // Reset form
        setFormData({
          name: '',
          email: '',
          feedback: '',
          testScenarios: '',
          overallExperience: '',
          bugs: '',
          suggestions: ''
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
        backgroundColor: '#d1fae5',
        border: '1px solid #10b981',
        borderRadius: '6px',
        padding: '1rem',
        marginTop: '1rem',
        textAlign: 'center'
      }}>
        <p style={{ color: '#065f46', margin: 0, fontSize: '14px' }}>
          ✅ Feedback submitted! You'll receive a confirmation email.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setExpanded(false);
          }}
          style={{
            marginTop: '0.5rem',
            padding: '6px 12px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Submit More Feedback
        </button>
      </div>
    );
  }

  if (!expanded && !isGeneral) {
    return (
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={() => setExpanded(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#355B45',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          Submit Feedback for This Scenario
        </button>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      padding: '1.5rem',
      marginTop: '1rem'
    }}>
      {!isGeneral && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ color: '#355B45', fontSize: '1.1rem', margin: 0 }}>
            {scenarioNumber && scenarioName ? `Feedback: Scenario ${scenarioNumber} - ${scenarioName}` : 'Submit Feedback'}
          </h3>
          <button
            onClick={() => setExpanded(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0',
              width: '24px',
              height: '24px'
            }}
          >
            ×
          </button>
        </div>
      )}

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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
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
                padding: '8px',
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
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        {isGeneral && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '14px' }}>
                Test Scenarios Completed (optional)
              </label>
              <textarea
                name="testScenarios"
                value={formData.testScenarios}
                onChange={handleChange}
                rows={3}
                placeholder="Which test scenarios did you complete?"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
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
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
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
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
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
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>
          </>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151', fontSize: '14px' }}>
            {isGeneral ? 'General Feedback (UI, Design, Features, etc.)' : 'Feedback for This Scenario'} <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            name="feedback"
            value={formData.feedback}
            onChange={handleChange}
            required
            rows={isGeneral ? 6 : 4}
            placeholder={isGeneral ? "Share your thoughts on UI, design, features, or any other general feedback..." : "Share your thoughts, observations, or feedback for this specific scenario..."}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            width: '100%',
            padding: '10px 20px',
            backgroundColor: submitting ? '#9ca3af' : '#355B45',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: submitting ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>

        <p style={{ marginTop: '0.75rem', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
          Your feedback will be sent to neighbriapp@gmail.com and you'll receive a confirmation copy.
        </p>
      </form>
    </div>
  );
};

export default TestPlanFeedbackForm;
