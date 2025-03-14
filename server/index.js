const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

const categoryController = require("./controller/categoryController")
const courseController = require("./controller/courseController");
const authController = require("./controller/authController");
const userController = require('./controller/userController')
const roleConroller = require('./controller/roleController')

const app = express();

// Upload folder setup
const multer = require("multer");
const uploads = multer({ dest: "uploads/" }); // Temporary storage for image uploads

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect Database
connectDB();

// Routes using controllers directly
app.post("/login", authController.login);
app.post("/register", authController.register);
app.post("/getEmail", authController.getEmail);
app.post("/resetpassword", authController.resetPassword);


// Routes for category
app.post("/getCategory", categoryController.getCategories);
app.post("/addCategory", categoryController.uploads.single("categoryImage"), categoryController.addCategory);
app.post("/updateCategory/:id", categoryController.uploads.single("categoryImage"), categoryController.updateCategory);
app.post("/getCategoryById/:id", categoryController.getCategoryById);
app.post("/deleteCategory/:id", categoryController.deleteCategory);
app.get("/categories", categoryController.categoryList); // list of categories

// Routes for course
app.get("/getCourseById/:id", courseController.getCourseById);
app.get("/getCourses", courseController.getCourses);
app.post("/addCourse", courseController.upload.single("courseImage"), courseController.addCourse);
app.post("/deleteCourse/:id", courseController.deleteCourse);
app.post("/getCourseById/:id", courseController.getCourseById);
app.post("/updateCourse/:id", courseController.upload.single("courseImage"), courseController.updateCourse);
app.get("/courses", courseController.courseListfilter); // list of courses
app.get("/courses/:id", courseController.courseDetailsById); // detailed view for course

//routes of users
app.post("/getUsers", userController.getUsers)
app.post("/addUser", userController.addUser)
app.post("/updateUser/:id",userController.updateUser)
app.post("/getUserById/:id", userController.getUserById);
app.post("/deleteUser/:id",userController.deleteUser)

// Routes for role
app.get("/roles",roleConroller.getRoles);



app.listen(5000, () => {
  console.log('App listening on port 5000');
});
