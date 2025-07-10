import React, { useState } from 'react';
import './App.css';

const QUESTIONS = [
  {
    id: 1,
    question: "Which country are you in?",
    type: "dropdown",
    options: ['United States', 'Canada', 'United Kingdom', 'Australia', 'India', 'Other'],
    field: 'country'
  },
  {
    id: 2,
    question: "What is your gender identity?",
    type: "buttons",
    options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'],
    field: 'gender'
  },
  {
    id: 3,
    question: "How old are you?",
    type: "dropdown",
    options: ['Under 18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    field: 'age'
  },
  {
    id: 4,
    question: "What is your primary concern?",
    type: "buttons",
    options: ['Anxiety', 'Depression', 'Relationship issues', 'Trauma', 'Stress', 'Other'],
    field: 'concern'
  },
  {
    id: 5,
    question: "How long have you been experiencing this?",
    type: "dropdown",
    options: ['Less than a month', '1-6 months', '6-12 months', '1-2 years', 'More than 2 years'],
    field: 'duration'
  },
  {
    id: 6,
    question: "Have you had therapy before?",
    type: "buttons",
    options: ['Yes', 'No'],
    field: 'therapyBefore'
  },
  {
    id: 7,
    question: "What type of therapist would you prefer?",
    type: "buttons",
    options: ['Male', 'Female', 'No preference'],
    field: 'therapistPreference'
  },
  {
    id: 8,
    question: "What is your preferred session frequency?",
    type: "dropdown",
    options: ['Once a week', 'Twice a week', 'Once every 2 weeks', 'Once a month'],
    field: 'frequency'
  },
  {
    id: 9,
    question: "What time of day works best for you?",
    type: "buttons",
    options: ['Morning', 'Afternoon', 'Evening', 'No preference'],
    field: 'timePreference'
  },
  {
    id: 10,
    question: "How would you prefer to communicate?",
    type: "buttons",
    options: ['Video call', 'Phone call', 'Text chat', 'In-person'],
    field: 'communicationPreference'
  }
];

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState(
    QUESTIONS.reduce((acc, question) => {
      acc[question.field] = '';
      return acc;
    }, {})
  );
  const [submissionState, setSubmissionState] = useState({
    isSubmitting: false,
    error: null
  });

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const navigateQuestion = (direction) => {
    if (direction === 'next' && currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (direction === 'previous' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionState({ isSubmitting: true, error: null });

    const url = "https://script.google.com/macros/s/AKfycby0gKwTDx2Sr0gyfZQ8A5K5KhEEFXJk6bzItuVejPg1OvQKl_8kN9svzFgmp9YmBtXphQ/exec";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          Country: formData.country,
          Gender: formData.gender,
          Age: formData.age,
          Concern: formData.concern,
          Duration: formData.duration,
          TherapyBefore: formData.therapyBefore,
          TherapistPreference: formData.therapistPreference,
          Frequency: formData.frequency,
          TimePreference: formData.timePreference,
          CommunicationPreference: formData.communicationPreference
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();

    if (result.status === "success") {
  window.open("https://www.crink.app/book-therapy", "_blank");
}
 else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setSubmissionState({ 
        isSubmitting: false, 
        error: error.message || "Failed to submit form"
      });
    }
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case "dropdown":
        return (
          <div className="input-container">
            <div className="select-wrapper">
              <select
                value={formData[currentQuestion.field]}
                onChange={(e) => handleInputChange(currentQuestion.field, e.target.value)}
                className="dropdown"
              >
                <option value="">Select an option</option>
                {currentQuestion.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
        );
      case "buttons":
        return (
          <div className="buttons-container">
            <div className="buttons-group">
              {currentQuestion.options.map(option => (
                <button
                  key={option}
                  type="button"
                  className={`option-button ${formData[currentQuestion.field] === option ? 'selected' : ''}`}
                  onClick={() => handleInputChange(currentQuestion.field, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <div className="progress-indicator">
        {QUESTIONS.map((_, index) => (
          <div
            key={index}
            className={`progress-bar ${currentQuestionIndex >= index ? 'active' : ''}`}
          />
        ))}
      </div>

      <header className="header">
        <h1>Help us match you to the right therapist</h1>
        <p className="subheading">
          It's important to have a therapist who you can establish a personal connection with.
          The following questions are designed to match you to a licensed therapist based on
          your therapy needs and personal preferences.
        </p>
      </header>

      <div className="card-container">
        <div className="card">
          <div className="card-content">
            <h2>{currentQuestion.question}</h2>
            {renderQuestion()}
            {submissionState.error && (
              <div className="error-message">{submissionState.error}</div>
            )}
            <div className="button-container dual-buttons">
              {currentQuestionIndex > 0 && (
                <button
                  onClick={() => navigateQuestion('previous')}
                  className="previous-button"
                  type="button"
                >
                  Back
                </button>
              )}
              {currentQuestionIndex < QUESTIONS.length - 1 ? (
                <button
                  onClick={() => navigateQuestion('next')}
                  disabled={!formData[currentQuestion.field]}
                  className="next-button"
                  type="button"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!formData[currentQuestion.field] || submissionState.isSubmitting}
                  className="submit-button"
                >
                  {submissionState.isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;