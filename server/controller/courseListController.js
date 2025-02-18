const express = require("express");
const router = express.Router();
const Courses = require("../models/courses");

// API Route to Fetch Courses with category filtering
router.get("/", async (req, res) => {
    try {
        const { categoryID } = req.query;

        let query = {};
        if (categoryID && categoryID !== "All") {
            query.categoryID = categoryID;
        }

        const courses = await Courses.find(query);
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses", error });
    }
});

module.exports = router;