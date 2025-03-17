const mongoose = require("mongoose");

const duration = ["2 weeks","1 month","3 months"];

const CoursesModel = new mongoose.Schema({
    title: { type: String, required: true},
    description: { type: String, required: true },
    categoryID: { type: mongoose.Schema.Types.ObjectId, ref: 'categories', default: null },
    courseImage: { type: String, required:true },
    duration: { type: String, enum: duration, required: true },
    price: { type: Number, required:true },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'questions' }] // Array of references to Questions

});

module.exports = mongoose.model("courses", CoursesModel);