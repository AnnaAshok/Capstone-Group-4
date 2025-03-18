const mongoose = require("mongoose");

<<<<<<< HEAD
const UserModel = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    roleID: { type: mongoose.Schema.Types.ObjectId, ref: "role", default: null },
    image: { type: String, default: "" }, // URL to the user profile image
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    dob: { type: Date, default: null },
  },
  { timestamps: true }
);
=======
const UserModel = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, required: false }, 
  address: { type: String, required: false }, 
  dob: { type: Date, required: false }, 
  image: { type: String, required: false }, 
  roleID: { type: mongoose.Schema.Types.ObjectId, ref: 'role', default: null },
}, { timestamps: true });
>>>>>>> e5a72646935e9bfb2c28f6e3912ac87ec1b6b184

module.exports = mongoose.model("user", UserModel);
