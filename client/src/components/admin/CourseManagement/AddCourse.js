import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper, Select, MenuItem, FormControl } from "@mui/material";
import ReactQuill from 'react-quill';
import { useDropzone } from "react-dropzone";
import 'react-quill/dist/quill.snow.css';

function AddCourse() {
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
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  useEffect(() => {
    axios.post("http://localhost:5000/getCategory")
      .then(response => {
        console.log(response)

        setCategories(response.data.categories);
      })
      .catch(error => console.error("Error fetching categories:", error));
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFormData({ ...formData, courseImage: acceptedFiles[0] });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!formData.title || !formData.description || !formData.categoryID || !formData.price || !formData.courseImage) {
      alert("Please fill out all fields and upload an image.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("categoryID", formData.categoryID);
    data.append("duration", formData.duration);
    data.append("price", formData.price);
    data.append("courseImage", formData.courseImage);

    try {
      const response = await axios.post("http://localhost:5000/addCourse", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Course added successfully!");
      setFormData({
        title: "",
        description: "",
        categoryID: "",
        duration: "2 weeks",
        price: "",
        courseImage: null,
      });
      navigate("/admin/courses");
    } catch (error) {
      console.error("Error adding course:", error.response?.data || error.message);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Failed to add course. Please check the console for details.");
      }
    }
  };

  return (
    <main className="main-container">
      <Paper elevation={3} sx={{ padding: 3, margin: "auto" }}>
        <div className="list-category">
          <h3>Add Course</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Course Title:</Typography>
            <TextField sx={{ width: "50%" }} variant="outlined" size="small" name="title" value={formData.title} onChange={handleChange} required />
          </Box>

          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Course Description:</Typography>
          <ReactQuill value={formData.description} onChange={handleEditorChange} theme="snow" style={{ height: "200px", marginBottom: "35px" }} required />

          <Box marginBottom={2}>
            <FormControl fullWidth variant="outlined" size="small" required>
              <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", marginTop: "20px", fontSize: "18px" }}>Select Category:</Typography>
              <Select name="categoryID" value={formData.categoryID || ""} onChange={handleChange} required>
                <MenuItem value=""><em>None</em></MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>{category.categoryName}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", marginTop: "20px", fontSize: "18px" }}>Duration:</Typography>
            <Select name="duration" value={formData.duration} onChange={handleChange} fullWidth required>
              <MenuItem value="2 weeks">2 Weeks</MenuItem>
              <MenuItem value="1 month">1 Month</MenuItem>
              <MenuItem value="3 months">3 Months</MenuItem>
            </Select>
          </Box>

          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Price:</Typography>
            <TextField sx={{ width: "50%" }} variant="outlined" size="small" name="price" type="number" value={formData.price} onChange={handleChange} required />
          </Box>
          {errorMessage && (
            <Box sx={{ marginTop: 2, color: "red", fontSize: "16px", marginBottom: 5 }}>
              <Typography variant="body1">{errorMessage}</Typography>
            </Box>
          )}

          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Course Image:</Typography>
          <Box {...getRootProps()} sx={{ border: "2px dashed #0F3460", padding: "20px", textAlign: "center", cursor: "pointer", borderRadius: "8px", backgroundColor: "#f9f9f9", width: "50%" }} marginBottom={2}>
            <input {...getInputProps()} />
            <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>Drag & drop an image here, or click to upload</Typography>
            {formData.courseImage && <Typography variant="body2" sx={{ marginTop: 1, color: "green" }}>{formData.courseImage.name}</Typography>}
          </Box>

          <Box display="flex" gap={2} marginTop={2}>
            <Button type="submit" variant="contained">Save Course</Button>
            <Button variant="outlined" sx={{ border: "1px solid #0F3460", color: "#0F3460" }} onClick={() => navigate("/admin/courses")}>Cancel</Button>
          </Box>
        </form>
      </Paper>
    </main>
  );
}

export default AddCourse;
