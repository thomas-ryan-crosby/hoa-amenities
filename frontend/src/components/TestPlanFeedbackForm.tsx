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
  const [expanded, setExpanded] = useState(isGeneral); // General forms start expanded

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
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      padding: '2rem',
      marginTop: '2rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#374151', fontSize: '1.5rem', marginBottom: '1rem' }}>
        Submit Your Feedback
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
        </div>

        <p style={{ marginTop: '0.75rem', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
          Your feedback will be sent to neighbriapp@gmail.com and you'll receive a confirmation copy.
        </p>
      </form>
    </div>
  );
};

export default TestPlanFeedbackForm;
