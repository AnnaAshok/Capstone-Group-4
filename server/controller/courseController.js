  const Course = require("../models/courses");
  const multer = require("multer");
  const path = require("path");
  const { v2: cloudinary } = require("cloudinary");
  const { CloudinaryStorage } = require("multer-storage-cloudinary");
  require("dotenv").config();
  
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Images", // Folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

// File Filter (Only accept images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

// Initialize Multer Middleware
const uploads = multer({ storage, fileFilter });


  // Get all courses
  exports.getCourses = async (req, res) => {
    try {
      const courses = await Course.find().populate("categoryID"); // Populate category details
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Get a single course by ID
  exports.getCourseById = async (req, res) => {
    try {
      const course = await Course.findById(req.params.id).populate("categoryID");
      if (!course) return res.status(404).json({ message: "Course not found" });

      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Add Course
  exports.addCourse = async (req, res) => {
    try {
      const { title, description, categoryID, duration, price ,courseImage} = req.body;

      // Validate required fields
      if (!title || !categoryID || !duration || !price) {
        return res.status(400).json({ message: "All fields are required!" });
      }

      if (price < 0 ){
        return res.status(400).json({ message: "Price should be greater than zero!" });
      }

      const newCourse = new Course({ title, description, categoryID, courseImage, duration, price });
      await newCourse.save();

      res.status(201).json({ message: "Course added successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Update Course
  exports.updateCourse = async (req, res) => {
    try {
      const { title, description, categoryID, duration, price } = req.body;
      const courseImage = req.body.courseImage ? req.body.courseImage : req.body.existingImage;

      // Validate required fields
      if (!title || !categoryID || !duration || !price) {
        return res.status(400).json({ message: "All fields are required!" });
      }

      const updatedCourse = await Course.findByIdAndUpdate(
        req.params.id,
        { title, description, categoryID, courseImage, duration, price },
        { new: true }
      );

      if (!updatedCourse) return res.status(404).json({ message: "Course not found" });

      res.status(200).json({ message: "Course updated successfully!", updatedCourse });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Delete Course
  exports.deleteCourse = async (req, res) => {
    try {
      const deletedCourse = await Course.findByIdAndDelete(req.params.id);
      if (!deletedCourse) return res.status(404).json({ message: "Course not found" });

      res.status(200).json({ message: "Course deleted successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  exports.uploads = uploads;
