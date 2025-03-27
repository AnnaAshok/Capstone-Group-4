const mongoose = require("mongoose");

const QuizzesModel = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', default: null, },
    totalMarks: { type: Number, required: true },
    receivedMarks: { type: Number, required: true },
    status: {
    type: String,
    enum: ['passed', 'failed', 'pending'],
    required: true,
    default: 'pending',
  },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("quizzes", QuizzesModel);