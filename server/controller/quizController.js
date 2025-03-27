const express = require('express');
const router = express.Router();
const QuizResult = require('../models/quizzes');

// Function to save quiz result
const saveQuizResult = async (req, res) => {
  try {
    const { userId, courseId, totalMarks, receivedMarks, status } = req.body;
    console.log("Received data:", req.body); // 1. Debug: Check ALL received data

    // Basic validation
    if (!userId || !courseId || totalMarks == null || receivedMarks == null) {
      console.warn("Missing fields:", { userId, courseId, totalMarks, receivedMarks, status }); 
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate status if it's provided
    if (status && !['passed', 'failed', 'pending'].includes(status)) {
      console.warn("Invalid status:", status);  // 3. Debug: Log invalid status
      return res.status(400).json({ error: 'Invalid status' });
    }

    const quizResult = new QuizResult({
      userId,
      courseID: courseId,
      totalMarks,
      receivedMarks,
      status: status || 'pending',
    });

    try{
        const savedQuizResult = await quizResult.save();
        console.log("Saved result:", savedQuizResult); // 4. Debug: Log saved result
        res.status(201).json(savedQuizResult);
      } catch(dbError){
        console.error("Database error:", dbError); // 5. Debug: Catch and log DB errors
        res.status(500).json({ error: 'Database error while saving quiz result' });
      }

  } catch (error) {
    console.error("Error in saveQuizResult:", error); // 6. Debug: General error
    res.status(500).json({ error: 'Server error while creating quiz result' });
  }
};

// Function to get all quiz results
const getQuizResults = async (req, res) => {
  try {
    const quizResults = await QuizResult.find()
      .populate('userId', 'name email')
      .populate('courseID', 'courseName');

    res.status(200).json(quizResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while fetching quiz results' });
  }
};

// Define routes using the router
router.post('/quiz-results', saveQuizResult);
router.get('/quiz-results', getQuizResults);

// Export the router
module.exports = router;
