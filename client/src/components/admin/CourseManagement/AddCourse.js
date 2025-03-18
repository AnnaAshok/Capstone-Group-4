import { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Box, Typography, Paper, Select, MenuItem, FormControl } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone"; // Importing useDropzone

function AddCourse() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    categoryID: "",
    duration: "2 weeks",
    price: "",
    courseImage: null,
  });
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    axios.post("http://localhost:5000/getCategory")
      .then(response => {
        setCategories(response.data.categories);
      })
      .catch(error => console.error("Error fetching categories:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (value, field) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle file upload
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFormData({ ...formData, courseImage: acceptedFiles[0] });
    },
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (!formData.title || !formData.description || !formData.categoryID || !formData.price || !formData.courseImage) {
      alert("Please fill out all fields");
      return;
    }

    const uploadData = new FormData(); // Use a different name like 'uploadData'
    uploadData.append("file", formData.courseImage);
    uploadData.append("upload_preset", "eduSphere");

  try {
    const cloudinaryResponse = await axios.post(
      "https://api.cloudinary.com/v1_1/dnmqu8v7b/image/upload",
      uploadData
    );
      const imageUrl = cloudinaryResponse.data.secure_url; // Get the uploaded image URL from Cloudinary response

      const courseData = {
        title: formData.title,
        description: formData.description,
        categoryID: formData.categoryID,
        duration: formData.duration,
        price: formData.price,
        courseImage: imageUrl, // Use the Cloudinary image URL
      };
      const response = await axios.post("http://localhost:5000/addCourse", courseData, {
        headers: { "Content-Type": "application/json" }
      });

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
      console.error("Error adding course:", error);
    }
  };

  return (
    <main className="main-container">
      <Paper elevation={3} sx={{ padding: 3, margin: "auto" }}>
        <div className="list-category">
          <h3>Add New Course</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
              Course Title:
            </Typography>
            <TextField
              sx={{ width: "50%" }}
              variant="outlined"
              size="small"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </Box>

          <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
            Short Description:
          </Typography>
          <TextField
            sx={{ width: "50%" }}
            variant="outlined"
            size="small"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            multiline
            rows={4}
          />

          <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
            Long Description:
          </Typography>
          <ReactQuill
            value={formData.longDescription}
            onChange={(value) => handleEditorChange(value, 'longDescription')}
            theme="snow"
            style={{ height: "200px", marginBottom: "35px" }}
          />

          <Box marginBottom={2}>
            <FormControl fullWidth variant="outlined" size="small">
              <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px", marginTop: "25px" }}>
                Select Category:
              </Typography>
              <Select
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

          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
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

          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
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
            />
          </Box>

          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Course Image:</Typography>
          <Box {...getRootProps()} sx={{ border: "2px dashed #0F3460", padding: "20px", textAlign: "center", cursor: "pointer", borderRadius: "8px", backgroundColor: "#f9f9f9", width: "50%" }} marginBottom={2}>
            <input {...getInputProps()} />
            <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>Drag & drop an image here, or click to upload</Typography>
            {formData.courseImage && <Typography variant="body2" sx={{ marginTop: 1, color: "green" }}>{formData.courseImage.name}</Typography>}
          </Box>

          <Button type="submit" variant="contained" color="primary">
            Add Course
          </Button>
        </form>
      </Paper>
    </main>
  );
}

export default AddCourse;
