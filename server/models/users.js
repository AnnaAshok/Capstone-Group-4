const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
    firstName: { type: String, required: true},
    lastName: { type: String, required: true },
    email: { type: String, required:true ,unique: true},
    password: { type: String, required:true ,minlength: 6},
    roleID: { type: mongoose.Schema.Types.ObjectId, ref: 'role', default: null },

}, { timestamps: true });

module.exports = mongoose.model("user", UserModel);