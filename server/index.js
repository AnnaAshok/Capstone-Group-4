const express = require("express");




const connectDB = require("./config/db");
const cors = require("cors");
const authController = require("./controller/authController");
const categoryController =  require("./controller/categoryController")

const user = require("./models/users")
const Courses = require("./models/courses"); 
const Categories = require('./models/categories');
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

// Routes of category
app.post("/getCategory",categoryController.getCategories)
app.post("/addCategory",categoryController.addCategory)
app.post("/updateCategory/:id",categoryController.updateCategory)
app.post("/categories/:id", categoryController.getCategoryById); 

// API Route to Fetch Courses
app.get("/courses", async (req, res) => {
    try {
        const courses = await Courses.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses", error });
    }
});

// API Route to fetch categories
app.get("/categories", async (req, res) => {
    try {
      const categories = await Categories.find();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  })

app.listen(5000, () => {
    console.log('App listening on port 5000')
})