import React, { useState } from 'react';
import axios from 'axios';

interface TestPlanFeedbackFormProps {
  onSuccess?: () => void;
}

const TestPlanFeedbackForm: React.FC<TestPlanFeedbackFormProps> = ({ onSuccess }) => {
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
      const response = await axios.post(`${apiUrl}/api/feedback/test-plan`, formData);

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
        padding: '1.5rem',
        marginTop: '2rem',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#065f46', marginBottom: '0.5rem' }}>✅ Thank You!</h3>
        <p style={{ color: '#065f46', margin: 0 }}>
          Your feedback has been submitted successfully. You should receive a confirmation email shortly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          style={{
            marginTop: '1rem',
            padding: '8px 16px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '2rem',
      marginTop: '2rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#355B45', fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        Submit Your Feedback
      </h2>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '4px',
          padding: '12px',
          marginBottom: '1rem',
          color: '#991b1b'
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
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

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
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

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
          Test Scenarios Completed (optional)
        </label>
        <textarea
          name="testScenarios"
          value={formData.testScenarios}
          onChange={handleChange}
          rows={4}
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
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
          Overall Experience (optional)
        </label>
        <textarea
          name="overallExperience"
          value={formData.overallExperience}
          onChange={handleChange}
          rows={4}
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
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
          Bugs & Issues Found (optional)
        </label>
        <textarea
          name="bugs"
          value={formData.bugs}
          onChange={handleChange}
          rows={4}
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
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
          Suggestions & Improvements (optional)
        </label>
        <textarea
          name="suggestions"
          value={formData.suggestions}
          onChange={handleChange}
          rows={4}
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
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#374151' }}>
          General Feedback <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <textarea
          name="feedback"
          value={formData.feedback}
          onChange={handleChange}
          required
          rows={6}
          placeholder="Share your thoughts, observations, or any other feedback..."
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
    </form>
  );
};

export default TestPlanFeedbackForm;

