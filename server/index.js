const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const categoryController = require("./controller/categoryController")
const courseController = require("./controller/courseController");
const authController = require("./controller/authController");
const courseListController = require("./controller/courseListController");
const categoryListController = require("./controller/categoryListController");
const userController = require('./controller/userController')
const roleConroller = require('./controller/roleController')

const app = express();
// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "Images", // Cloudinary folder name
  allowedFormats: ["jpg", "png", "jpeg"],
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect Database
connectDB();

// Routes using controllers directly
app.post("/login", authController.login);
app.post("/register", authController.register);
app.post("/getEmail", authController.getEmail);
app.post("/resetpassword", authController.resetPassword);

app.use("/courses", courseListController);
app.use("/categories", categoryListController);

// Routes for category
app.post("/getCategory", categoryController.getCategories);
app.post("/addCategory", upload.single("categoryImage"), categoryController.addCategory);
app.post("/updateCategory/:id", upload.single("categoryImage"), categoryController.updateCategory);
app.post("/getCategoryById/:id", categoryController.getCategoryById);
app.post("/deleteCategory/:id", categoryController.deleteCategory);

// Routes for course
app.get("/getCourseById/:id", courseController.getCourseById);
app.get("/getCourses", courseController.getCourses);
app.post("/addCourse", upload.single("courseImage"), courseController.addCourse);
app.post("/deleteCourse/:id", courseController.deleteCourse);
app.post("/getCourseById/:id", courseController.getCourseById);
app.post("/updateCourse/:id", upload.single("courseImage"), courseController.updateCourse);

//routes of users
app.post("/getUsers", userController.getUsers)
app.post("/addUser", userController.addUser)
app.post("/updateUser/:id",userController.updateUser)
app.post("/getUserById/:id", userController.getUserById);
app.post("/deleteUser/:id",userController.deleteUser)

// Routes for role
app.get("/roles",roleConroller.getRoles);


// Route for fetching course details
// app.get("/courses/:id", courseListController.getCourseById);

app.listen(5000, () => {
  console.log('App listening on port 5000');
});
