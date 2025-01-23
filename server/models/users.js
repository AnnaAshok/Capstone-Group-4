const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
    firstName: { type: String, required: true},
    lastName: { type: String, required: true },
    email: { type: String, required:true },
    password: { type: String, required:true },
    roleID: { type: mongoose.Schema.Types.ObjectId, ref: 'role', default: null },

});

module.exports = mongoose.model("user", UserModel);