const mongoose = require("mongoose");

const OptionsSchema = new mongoose.Schema({
    label: {
      type: String, // "Option A", "Option B", etc.
      required: true
    },
    value: {
      type: String, // The correct answer (e.g., "A")
      required: true
    }
  });

const QuestionsModel = new mongoose.Schema({
    quizID: { type: mongoose.Schema.Types.ObjectId, ref: 'quizzes', default: null },
    courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', required: true }, // Reference to the course
    question: { type: String, required: true},
    options: {
        type: [OptionsSchema], // Array of option objects
        required: true,
        validate: [arrayLimit, 'At least 2 options are required'] // Ensure there are enough options
      },
    answer: { type: String, required:true }
});

// Custom validation to ensure there are at least 2 options
function arrayLimit(val) {
    return val.length >= 2;
  }

module.exports = mongoose.model("questions", QuestionsModel);