const Category = require("../models/categories")

// get all categories
exports.getCategories = async (req, res)=>{
    try{
        const categories = await Category.find()
        res.status(200).json(categories);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

// add single category
exports.addCategory =  async (res, req) =>{
    try{
        const category = new Category(req.body);
        await category.save();
        res.status(201).json({ message: "Category added successfully", category });
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
      const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
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