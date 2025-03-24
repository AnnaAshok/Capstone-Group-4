import React, { useState, useEffect } from 'react';
import axios from 'axios';

// You can create a simple cn function if you don't have a library
function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

const SimpleQuizUI = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timer, setTimer] = useState(660); // 11 minutes (in seconds)
    const [originalTime, setOriginalTime] = useState(660);
    const [isPaused, setIsPaused] = useState(false);


    // Fetch questions from the backend
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/getallquestions');
                setQuestions(response.data.questions);
            } catch (err) {
                setError('Error fetching questions');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    // Start timer when questions are loaded and quiz hasn't been completed
    useEffect(() => {
        if (questions.length > 0 && !quizCompleted) {
            setLoading(false);
            setTimer(originalTime); // Reset timer when questions are loaded or reset
            const intervalId = setInterval(() => {
                if (!isPaused) { // Only decrement if not paused
                    setTimer(prevTimer => {
                        if (prevTimer <= 0) {
                            setQuizCompleted(true);
                            clearInterval(intervalId);
                            return 0;
                        }
                        return prevTimer - 1;
                    });
                }
            }, 1000);

            return () => clearInterval(intervalId); // Cleanup on unmount or when questions change
        }
    }, [questions, quizCompleted, isPaused, originalTime]);

    // Handle user selection for an option
    const handleOptionSelect = (questionId, selectedOption) => {
        setUserAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: selectedOption
        }));
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
    const progress = questions.length ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

    // Format timer
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleReset = () => {
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setQuizCompleted(false);
        setError(null);
        setLoading(true);
        setTimer(originalTime); // Reset to the original time
        setIsPaused(false);
        // Fetch the questions again to ensure a fresh quiz.
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:5000/getallquestions');
                setQuestions(response.data.questions);
            } catch (err) {
                setError('Error fetching questions');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-gray-500 text-lg">Loading questions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    if (!questions.length) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p className="text-gray-500 text-lg">No questions available.</p>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const userChoice = userAnswers[currentQuestion._id];



    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 space-y-6">
                <div className="flex justify-between items-center mb-4">
                    {/* <h1 className="text-2xl font-bold text-gray-800">Ember.js Quiz</h1> */}
                    {/* <div className="flex gap-2">
                        <button
                            onClick={() => setIsPaused(!isPaused)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-sm transition-colors duration-200",
                                isPaused ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30" :
                                    "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            )}
                        >
                            {isPaused ? 'Resume' : 'Pause'}
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-3 py-1.5 rounded-full text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors duration-200"
                        >
                            Reset
                        </button>
                    </div> */}
                    <p className="text-md text-gray-600">Time Remaining: {formatTime(timer)}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </h2>
                    <p className="text-gray-700 mb-4">{currentQuestion.question}</p>
                    <div className="space-y-3">
                        {currentQuestion.options.map((option) => (
                            <div
                                key={option.value}
                                className={cn(
                                    "flex items-center space-x-3 p-3 rounded-md transition-all duration-200",
                                    "border",
                                    userChoice === option.value
                                        ? "bg-blue-100 border-blue-300 text-blue-800" // Highlight selected answer
                                        : "hover:bg-gray-100 border-gray-200 text-gray-700"
                                )}
                                onClick={() => handleOptionSelect(currentQuestion._id, option.value)}

                            >
                                <input
                                    type="radio"
                                    id={`option-${option.value}`}
                                    value={option.value}
                                    checked={userChoice === option.value}
                                    onChange={() => { }} // Keep the radio button from changing state directly
                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <label
                                    htmlFor={`option-${option.value}`}
                                    className="text-sm"
                                >
                                    {option.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-width duration-400 ease"
                        style={{ width: `${progress}%` }}
                        aria-valuenow={progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className={cn(
                            "px-4 py-2 rounded-md transition-colors duration-200 text-sm",
                            currentQuestionIndex === 0
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        )}
                    >
                        Previous
                    </button>
                    {currentQuestionIndex < questions.length - 1 ? (
                        <button
                            onClick={handleNext}
                            disabled={userAnswers[currentQuestion._id] == null}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm transition-colors duration-200 text-white",
                                userAnswers[currentQuestion._id] == null
                                    ? "bg-blue-500/50 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600"
                            )}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 rounded-md text-sm bg-green-500 hover:bg-green-600 text-white transition-colors duration-200"
                        >
                            Submit
                        </button>
                    )}
                </div>

                {quizCompleted && (
                    <div className="text-center mt-8">
                        <h2 className="text-2xl font-semibold text-blue-600">Quiz Completed!</h2>
                        {timer <= 0 ? (
                            <p className="text-red-600">Time's up!</p>
                        ) : (
                            <p className="text-gray-600">Great job! Review your answers.</p>
                        )}
                        {/* Add a way to show and review answers. */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SimpleQuizUI;
