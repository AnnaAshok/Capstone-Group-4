const Category = require("../models/categories")
const multer = require("multer");
const path = require("path");

// Configure Storage for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Store images in the "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
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

// get paginated categories
exports.getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body; 
    const skip = (page - 1) * limit;

      // Fetch paginated categories
      const categories = await Category.find().skip(skip).limit(limit);
      
      // Count total categories for pagination
      const totalCategories = await Category.countDocuments();

      res.status(200).json({
          categories,
          currentPage: page,
          totalPages: Math.ceil(totalCategories / limit),
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


// add single category
exports.addCategory =  async (req, res) =>{
  try {
    if (!req.file) {
        return res.status(400).json({ message: "Please upload an image" });
      }

      const newCategory = new Category({
        categoryName: req.body.categoryName,
        categoryImage: req.file.path, // Save image path in DB
      });

      await newCategory.save();
      res.status(201).json({ message: "Category added successfully", newCategory });
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

// Get single category by ID
exports.getCategoryById = async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Update each category
  exports.updateCategory = async (req, res) => {
    try {
      let updatedCategoryData = {
        categoryName: req.body.categoryName,
      };
      // Check if a new file (image) has been uploaded
      if (req.file) {
        updatedCategoryData.categoryImage = req.file.path;
      }
      // Update category
      const category = await Category.findByIdAndUpdate(req.params.id, updatedCategoryData, {
        new: true, // Return the updated category
      });
  
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Delete a category
  exports.deleteCategory = async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // get categorylist for course page
  exports.categoryList = async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  
  exports.uploads = uploads;
