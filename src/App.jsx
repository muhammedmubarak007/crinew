import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';

function TherapyForm() {
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'India', 'Other'];
  const ageGroups = ['Under 18', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'];

  const handleNext = () => {
    setStep(step + 1);
    setSubmitError(null);
  };

  const handlePrevious = () => {
    setStep(step - 1);
    setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const scriptUrl = "https://script.google.com/macros/s/AKfycbzLXGtJaKm9yLtm6vAlG7njtJDdDrjM1PUQJz3U_FyfeflEaUR73CR7I6nQH-FAAzD8zw/exec";

    const formData = {
      Name: 'Therapy User',
      Email: 'user@example.com',
      Country: country,
      Gender: gender,
      Age: age
    };

    try {
      await fetch(`${scriptUrl}?auth=true`, { 
        method: 'GET',
        redirect: 'follow'
      });

      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        redirect: 'follow'
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        setSubmitSuccess(true);
        setTimeout(resetForm, 2000);
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setCountry('');
    setGender('');
    setAge('');
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  return (
    <div className="app">
      <div className="progress-indicator">
        <div className={`progress-bar ${step >= 1 ? 'active' : ''}`}></div>
        <div className={`progress-bar ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`progress-bar ${step >= 3 ? 'active' : ''}`}></div>
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
        {submitSuccess ? (
          <div className="card">
            <div className="card-content submission-success">
              <div className="success-icon">✓</div>
              <h2>Thank You!</h2>
              <p>Your information has been submitted successfully.</p>
              <p>We'll match you with a therapist soon.</p>
              <button 
                onClick={resetForm}
                className="submit-button"
              >
                Start New Submission
              </button>
            </div>
          </div>
        ) : (
          <div className="card">
            {step === 1 && (
              <div className="card-content">
                <h2>Which country are you in?</h2>
                <div className="input-container">
                  <div className="select-wrapper">
                    <select 
                      value={country} 
                      onChange={(e) => setCountry(e.target.value)}
                      className="dropdown"
                    >
                      <option value="">Select your country</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <span className="dropdown-arrow">▼</span>
                  </div>
                </div>
                <div className="button-container">
                  <button 
                    onClick={handleNext} 
                    disabled={!country}
                    className="next-button"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="card-content">
                <h2>What is your gender identity?</h2>
                <div className="gender-buttons-container">
                  <div className="gender-buttons-group">
                    <button 
                      className={`gender-button ${gender === 'Male' ? 'selected' : ''}`}
                      onClick={() => setGender('Male')}
                    >
                      Male
                    </button>
                    <button 
                      className={`gender-button ${gender === 'Female' ? 'selected' : ''}`}
                      onClick={() => setGender('Female')}
                    >
                      Female
                    </button>
                    <button 
                      className={`gender-button ${gender === 'Non-binary' ? 'selected' : ''}`}
                      onClick={() => setGender('Non-binary')}
                    >
                      Non-binary
                    </button>
                    <button 
                      className={`gender-button ${gender === 'Prefer not to say' ? 'selected' : ''}`}
                      onClick={() => setGender('Prefer not to say')}
                    >
                      Prefer not to say
                    </button>
                  </div>
                </div>
                <div className="button-container dual-buttons">
                  <button 
                    onClick={handlePrevious}
                    className="previous-button"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleNext} 
                    disabled={!gender}
                    className="next-button"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card-content">
                <h2>How old are you?</h2>
                <div className="input-container">
                  <div className="select-wrapper">
                    <select 
                      value={age} 
                      onChange={(e) => setAge(e.target.value)}
                      className="dropdown"
                    >
                      <option value="">Select your age group</option>
                      {ageGroups.map((a) => (
                        <option key={a} value={a}>{a}</option>
                      ))}
                    </select>
                    <span className="dropdown-arrow">▼</span>
                  </div>
                </div>
                <div className="button-container dual-buttons">
                  <button 
                    onClick={handlePrevious}
                    className="previous-button"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={!age || isSubmitting}
                    className={`submit-button ${isSubmitting ? 'loading' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
                {submitError && <p className="error-message">{submitError}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<TherapyForm />} />
        {/* Add more routes if needed */}
      </Routes>
    </HashRouter>
  );
}

export default App;