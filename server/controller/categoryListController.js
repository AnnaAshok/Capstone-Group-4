const express = require("express");
const router = express.Router();
const Categories = require("../models/categories"); 

// API Route to fetch categories
router.get("/", async (req, res) => {
    try {
      const categories = await Categories.find();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = router;