import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";  // Import framer-motion for animations
import "../../quiz.css"; 

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/quizzes");
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching quizzes", error);
    }
  };

  const handleSelectAnswer = (questionId, option) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: option });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/submit-quiz", selectedAnswers);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting quiz", error);
    }
  };

  return (
    <div className="container">
      <motion.h1
        className="quiz-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Take Quiz
      </motion.h1>

      <form onSubmit={handleSubmit} className="quiz-form">
        {quizzes.map((quiz) => (
          <motion.div
            key={quiz._id}
            className="card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-header">{quiz.question}</div>
            <div className="card-content">
              {quiz.options.map((option, index) => (
                <motion.div
                  key={index}
                  className="option"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="radio"
                    name={quiz._id}
                    value={option}
                    checked={selectedAnswers[quiz._id] === option}
                    onChange={() => handleSelectAnswer(quiz._id, option)}
                  />
                  <label>{option}</label>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.button
          type="submit"
          className="button"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          Submit Quiz
        </motion.button>
      </form>

      {submitted && (
        <motion.p
          className="success-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Quiz submitted successfully!
        </motion.p>
      )}
    </div>
  );
};

export default Quiz;
