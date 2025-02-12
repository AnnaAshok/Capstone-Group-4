const express = require("express");
const router = express.Router();
const Courses = require("../models/courses"); 

// API Route to Fetch Courses
router.get("/", async (req, res) => {
    try {
        const courses = await Courses.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses", error });
    }
});

module.exports = router;