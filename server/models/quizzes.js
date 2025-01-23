const mongoose = require("mongoose");

const QuizzesModel = new mongoose.Schema({
    courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', default: null },
});

module.exports = mongoose.model("quizzes", QuizzesModel);