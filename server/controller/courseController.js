  const Course = require("../models/courses");
  const multer = require("multer");
  const path = require("path");
  const mongoose = require('mongoose');

  // Set up storage for course images
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/'); // Ensure uploads folder exists
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Generate unique file names
    }
  });

  // Configure multer for file uploads
  const upload = multer({ storage: storage });

  // Export multer upload middleware
  exports.upload = upload;

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
    const { title, shortDescription, longDescription, categoryID, duration, price } = req.body;
    const courseImage = req.file ? req.file.filename : null; // Handle file upload

    // Validate required fields
    if (!title || !shortDescription || !longDescription || !categoryID || !duration || !price) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    if (price < 0) {
      return res.status(400).json({ message: "Price should be greater than zero!" });
    }

    const newCourse = new Course({ title, shortDescription, longDescription, categoryID, courseImage, duration, price });
    await newCourse.save();

    res.status(201).json({ message: "Course added successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


  // Update Course

exports.updateCourse = async (req, res) => {
  try {
    const { title, shortDescription, longDescription, categoryID, duration, price } = req.body;
    const courseImage = req.file ? req.file.filename : req.body.existingImage;

    // Validate required fields
    if (!title || !shortDescription || !longDescription || !categoryID || !duration || !price) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { title, shortDescription, longDescription, categoryID, courseImage, duration, price },
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

  // Course list for coursepage with filter
  exports.courseListfilter = async (req, res) => {
      try {
  
          const { categoryID, page = 1, limit = 6 } = req.query;
  
          let query = {};
          if (categoryID && categoryID !== "All") {
              query.categoryId = new mongoose.Types.ObjectId(categoryID);
          } else {
              // Ensure categoryId is not null if 'All' is selected
              query.categoryId = { $ne: null };
          }
          const courses = await Course.find(query)
              .skip((page - 1) * limit)
              .limit(parseInt(limit));
  
          const totalCourses = await Course.countDocuments(query); // Total count for pagination
  
          res.json({
              courses,
              totalPages: Math.ceil(totalCourses / limit),
              currentPage: parseInt(page),
          });
  
      } catch (error) {
          res.status(500).json({ message: "Error fetching courses", error });
      }
  };
  
  exports.courseDetailsById = async (req, res) => {
      const courseId = req.params.id;
  
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
          return res.status(400).json({ error: "Invalid course ID format" });
      }
  
      try {
          const course = await Course.findById(courseId);
  
          if (!course) {
              return res.status(404).json({ error: "Course not found" });
          }
  
          res.json(course);
      } catch (error) {
          console.error("Error fetching course details:", error);
          res.status(500).json({ error: "Server error" });
      }
  }