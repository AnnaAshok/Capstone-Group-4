const mongoose = require("mongoose");

const CertificatesModel = new mongoose.Schema({
    issueDate: { type: Date, required: true},
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
    courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'courses', default: null }
});

module.exports = mongoose.model("certificates", CertificatesModel);