const express = require("express");
const mongoose = require('mongoose');

const router = express.Router();
const Courses = require("../models/courses");

// API Route to Fetch Courses with category filtering
router.get("/", async (req, res) => {
    try {
        console.log("Received query params:", req.query);

        const { categoryID, page = 1, limit = 6 } = req.query;

        let query = {};
        if (categoryID && categoryID !== "All") {
            query.categoryId = new mongoose.Types.ObjectId(categoryID);
        } else {
            // Ensure categoryId is not null if 'All' is selected
            query.categoryId = { $ne: null }; // Fetch all courses where categoryId is not null
        }

        console.log("Category ID received on backend:", categoryID);
        console.log("Query sent to DB:", query);

        const courses = await Courses.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        console.log("Courses found in DB:", courses);  // Log courses

        const totalCourses = await Courses.countDocuments(query); // Total count for pagination

        res.json({
            courses,
            totalPages: Math.ceil(totalCourses / limit),
            currentPage: parseInt(page),
        });

    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Error fetching courses", error });
    }
});


// API Route to Fetch Course Details by ID
router.get("/:id", async (req, res) => {
    const courseId = req.params.id;
    console.log(`Received request for course ID: ${courseId}`);

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({ error: "Invalid course ID format" });
    }

    try {
        const course = await Courses.findById(courseId);

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        console.log("Course found:", course);
        res.json(course);
    } catch (error) {
        console.error("Error fetching course details:", error);
        res.status(500).json({ error: "Server error" });
    }
});



module.exports = router;