const mongoose = require("mongoose");

const EnrollmentsModel = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
    courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'course', default: null },
    paymentID: { type: mongoose.Schema.Types.ObjectId, ref: 'payment', default: null }
});

module.exports = mongoose.model("enrollments", EnrollmentsModel);