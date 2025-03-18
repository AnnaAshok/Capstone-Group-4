const bcrypt = require("bcrypt");
const User = require("../models/users");
const Role = require("../models/role")
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { SECRET_KEY } = require("../middleware/authMiddleware"); // Import the shared secret key


// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("roleID");
    const filteredUsers = users
    .filter(user => user.roleID && user.roleID.role === "Student")
    .map(user => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roleID: user.roleID._id,
      role: user.roleID.role
    }));

  res.status(200).json(filteredUsers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// Get single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("roleID");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
};

// Add a new user
exports.addUser = async (req, res) => {
  const { firstName, lastName, email, password, roleID } = req.body;
  
  try {
   // Hash the password before saving it
   const hashedPassword = await bcrypt.hash(password, 10); 

   const newUser = new User({
     firstName,
     lastName,
     email,
     password: hashedPassword, // Save the hashed password
     roleID,
   });

   await newUser.save();
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (err) {
    res.status(400).json({ message: "Failed to add user", error: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
   // Check if the password is being updated
   if (req.body.password) {
    // Hash the new password before updating
    req.body.password = await bcrypt.hash(req.body.password, 10); 
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: "Failed to update user", error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};
exports.updatePassword = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL params
    const { newPassword } = req.body; // Get the new password from the request body

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { password: hashedPassword }, 
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Password updated successfully", user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: "Failed to update password", error: err.message });
  }
};
