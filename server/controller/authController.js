const bcrypt = require("bcrypt");
const user = require("../models/users");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { SECRET_KEY } = require("../middleware/authMiddleware"); // Import the shared secret key

//login api
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Check if the user exists
        const userDetails = await user.findOne({ email: email });
        if (!userDetails) {
            return res.status(404).json({ message: "Invalid username or password" });
        }
        // Compare hashed password
        const isMatch = await bcrypt.compare(password, userDetails.password);
          
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
          // Generate JWT Token using dynamic SECRET_KEY
        const token = jwt.sign(
            { userId: userDetails._id, email: userDetails.email, roleID: userDetails.roleID },
            SECRET_KEY,
            { expiresIn: "1h" }
        );
        res.json({ message: "Success",token:token  });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// registration api
exports.register = async (req,res)=>{
    try {
        const { firstName, lastName, email, password } = req.body;
    
        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
          return res.status(400).json({ message: "All fields are required" });
        }
    
        // Check if user already exists
        const existingUser = await user.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists. Please login!" });
        }
    
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Create a new user
        const newUser = await user.create({
          firstName,
          lastName,
          email,
          password: hashedPassword
        });
    
        res.status(201).json({ message: "Account created successfully", user: newUser });
      } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }


// get email api
exports.getEmail = async (req,res) =>{
    const { email } = req.body;

    try {
        const result = await user.findOne({ email: email });

        if (result) {
            res.json("Success");
        } else {
            res.json("Email not found. Create an account!");
        }
    } catch (error) {
        console.error("Error fetching email:", error);
        res.status(500).json("Something went wrong. Please try again later.");
    }
}


// reset password api
exports.resetPassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!password) {
            return res.status(400).json({ message: "All fields are required" });
          }
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await user.findOneAndUpdate(
            { email: email },
            { password: hashedPassword },
            { new: true }
        );

        if (result) {
            res.status(200).json({ message: "Password updated successfully"});
        } else {
            res.status(404).json("Email not found. Please check the email and try again.");
        }
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json("Something went wrong. Please try again later.");
    }
}