const mongoose = require("mongoose");

const QuizzesModel = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  totalMarks: { type: Number, required: true, min: 0 },
  receivedMarks: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    enum: ['passed', 'failed', 'pending'], 
    required: true, 
    default: 'pending' 
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("quizzes", QuizzesModel);
