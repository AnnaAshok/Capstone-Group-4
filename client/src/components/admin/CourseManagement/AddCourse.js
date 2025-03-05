import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

function AddCourse() {
 // const quillRef = useRef(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryID: "",
    duration: "2 weeks",
    price: "",
    courseImage: null,
  });

  useEffect(() => {
    axios.get("http://localhost:5000/getCategories") // Fetch categories for dropdown
      .then(response => {
        console.log(response.data); // Check if categories are fetched correctly
        setCategories(response.data);
      })
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, courseImage: e.target.files[0] });
  };

  const handleEditorChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      await axios.post("http://localhost:5000/addCourse", data);
      alert("Course added successfully!");
      navigate("/admin/courses");
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  return (
    <main className="main-container">
      <Paper elevation={3} sx={{ padding: 3, margin: "auto" }}>
        <div className="list-category">
          <h3>Add Course</h3>
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>
              Course Title:
            </Typography>
            <TextField
              sx={{ width: "50%" }}
              variant="outlined"
              size="small"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Box>

          {/* Description (with Text Editor) */}
          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>
            Course Description:
          </Typography>
          <ReactQuill
            value={formData.description}
            onChange={handleEditorChange}
            theme="snow"
            style={{ height: "200px", marginBottom: "35px" }}
          />

          {/* Category Dropdown */}
          <Box marginBottom={2}>
            <FormControl fullWidth variant="outlined" size="small">
              <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", marginTop:"20px", fontSize: "18px" }}>
                Select Category:
              </Typography>
              <Select
                labelId="category-label"
                name="categoryID"
                value={formData.categoryID}
                onChange={handleChange}
               
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Duration Selection */}
          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", marginTop:"20px", fontSize: "18px" }}>
              Duration:
            </Typography>
            <Select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="2 weeks">2 Weeks</MenuItem>
              <MenuItem value="1 month">1 Month</MenuItem>
              <MenuItem value="3 months">3 Months</MenuItem>
            </Select>
          </Box>

          {/* Price Field */}
          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>
              Price:
            </Typography>
            <TextField
              sx={{ width: "50%" }}
              variant="outlined"
              size="small"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </Box>

          {/* File Upload */}
          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>
              Course Image:
            </Typography>
            <input
              type="file"
              name="courseImage"
              onChange={handleFileChange}
              required
              style={{ padding: "10px", fontSize: "16px" }}
            />
          </Box>

          {/* Submit and Cancel Buttons */}
          <Box display="flex" gap={2} marginTop={2}>
            <Button type="submit" variant="contained">
              Save Course
            </Button>
            <Button variant="outlined" sx={{ border: "1px solid #0F3460", color: "#0F3460" }} onClick={() => navigate("/admin/courses")}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </main>
  );
}

export default AddCourse;
