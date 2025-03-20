import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../quiz.css';

const StylishQuizUI = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [error, setError] = useState(null);

  // Fetch questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Assuming the endpoint to fetch all questions is "/api/questions"
        const response = await axios.get('http://localhost:5000/getallquestions');
        setQuestions(response.data.questions); // Assuming response contains questions in 'questions'
      } catch (err) {
        setError('Error fetching questions');
        console.error(err);
      }
    };

    fetchQuestions();
  }, []);

  // Handle user selection for an option
  const handleOptionSelect = (questionId, selectedOption) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[questionId] = selectedOption;
    setUserAnswers(updatedAnswers);
  };

  // Handle next question
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle quiz submission
  const handleSubmit = () => {
    setQuizCompleted(true);
  };

  // Calculate progress
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!questions.length) {
    return <div className="loading">Loading questions...</div>;
  }

  return (
    <div className="quiz-wrapper">
      <div className="quiz-container">
        <h1 className="quiz-title">Interactive Quiz</h1>
        {error && <p className="error-message">{error}</p>}

        <div className="question-container">
          <h2>{questions[currentQuestionIndex].question}</h2>

          <div className="options-container">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <div key={index} className="option">
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={option.value}
                  checked={userAnswers[currentQuestionIndex] === option.value}
                  onChange={() => handleOptionSelect(currentQuestionIndex, option.value)}
                />
                <label>{option.label}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="navigation">
          <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="nav-button">
            Previous
          </button>
          <button onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1} className="nav-button">
            Next
          </button>
        </div>

        <div className="submit">
          {currentQuestionIndex === questions.length - 1 ? (
            <button onClick={handleSubmit} className="submit-button">
              Submit
            </button>
          ) : (
            <button onClick={handleNext} disabled={userAnswers[currentQuestionIndex] == null} className="submit-button">
              Next
            </button>
          )}
        </div>

        {/* Final Results */}
        {quizCompleted && (
          <div className="result">
            <h2>Quiz Completed!</h2>
            <p>Great job! Review your answers and submit your score.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StylishQuizUI;
