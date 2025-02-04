const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const authController = require("./controller/authController");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB();

// Routes using controllers directly
app.post("/login", authController.login);
app.post("/register", authController.register);
app.post("/getEmail", authController.getEmail);
app.post("/resetpassword", authController.resetPassword);

app.listen(5000, () => {
    console.log('App listening on port 5000')
})