const express = require('express');
const router = express.Router();
const QuizResult = require('../models/quizzes'); 


router.post('/quiz-results', async (req, res) => {
    try {
      const { userId, courseID, totalMarks, receivedMarks, status } = req.body;
  
      // Basic validation
      if (!userId || !courseID || totalMarks == null || receivedMarks == null) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const quizResult = new QuizResult({
        userId,
        courseID,
        totalMarks,
        receivedMarks,
        status: status || 'pending', // Default to 'pending' if not provided
      });
  
      const savedQuizResult = await quizResult.save();
      res.status(201).json(savedQuizResult);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error while creating quiz result' });
    }
  });
  
  // Get all quiz results
  router.get('/quiz-results', async (req, res) => {
    try {
      const quizResults = await QuizResult.find()
        .populate('userId', 'name email') // Populate user details
        .populate('courseID', 'courseName'); // Populate course details
  
      res.status(200).json(quizResults);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error while fetching quiz results' });
    }
  });
  
  module.exports = router;