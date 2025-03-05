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

module.exports = router;