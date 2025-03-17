const bcrypt = require("bcrypt");
const User = require("../models/users");
const jwt = require("jsonwebtoken");

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
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); 

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword, // Save hashed password
      roleID,
    });

    await newUser.save();
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (err) {
    res.status(400).json({ message: "Failed to add user", error: err.message });
  }
};

// Update user (including password)
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, phone, address, dob } = req.body;
    const userId = req.user.id;  // Assuming you're using JWT for authentication

    const user = await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
      phone,
      address,
      dob
    }, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
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

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const { email } = req.user;  // Get email from the JWT payload
    const userDetails = await User.findOne({ email }).populate("roleID");

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      email: userDetails.email,
      role: userDetails.roleID?.role || "Unknown"
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user's password
exports.updatePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to update password", error: err.message });
  }
};