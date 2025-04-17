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
    heading: "",
    videos: [],
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_URL;

  // Fetch categories
  useEffect(() => {
    axios.post(`${API_BASE}/getCategory`)
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
    accept: ".jpg,.jpeg,.png", // Restrict file types
    onDrop: (acceptedFiles) => {
      // Ensure only allowed types are accepted
      const file = acceptedFiles[0];
      if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
        setFormData({ ...formData, courseImage: file });
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, courseImage: "Only JPG, JPEG, and PNG images are allowed." }));
      }
    },
  });

  // Handle video upload
  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
    accept: "video/*",
    multiple: true, // Allow multiple video selection
    onDrop: (acceptedFiles) => {
      setFormData((prevData) => ({
        ...prevData,
        videos: [...prevData.videos, ...acceptedFiles], // Append new videos
      }));
    },
  });

  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.shortDescription) newErrors.shortDescription = "Short description is required";
    if (!formData.longDescription) newErrors.longDescription = "Long description is required";
    if (!formData.categoryID) newErrors.categoryID = "Category is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.courseImage) newErrors.courseImage = "Course image is required";
    if (!formData.heading) newErrors.heading = "Heading is required";
    if (!formData.videos.length) newErrors.videos = "At least one video is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // If there are no errors, return true
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // If validation fails, stop form submission
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

      // Upload multiple videos
      const videoUrls = await Promise.all(
        formData.videos.map(async (video) => {
          const videoUploadData = new FormData();
          videoUploadData.append("file", video);
          videoUploadData.append("upload_preset", "eduSphere");

          const videoResponse = await axios.post(
            "https://api.cloudinary.com/v1_1/dnmqu8v7b/video/upload",
            videoUploadData
          );

          return videoResponse.data.secure_url; // Return video URL after upload
        })
      );

      const courseData = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription,
        categoryID: formData.categoryID,
        duration: formData.duration,
        price: formData.price,
        courseImage: imageUrl, // Use the Cloudinary image URL
        heading: formData.heading,
        videos: videoUrls,
      };

      const response = await axios.post(`${API_BASE}/addCourse`, courseData, {
        headers: { "Content-Type": "application/json" }
      });

      setFormData({
        title: "",
        shortDescription: "",
        longDescription: "",
        categoryID: "",
        duration: "2 weeks",
        price: "",
        courseImage: null,
        heading: "",
        videos: [],
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
            {errors.title && (
            <Typography variant="body2" color="error" >{errors.title}</Typography>
          )}
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
          {errors.shortDescription && (
            <Typography variant="body2" color="error" >{errors.shortDescription}</Typography>
          )}

          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
              Heading:
            </Typography>
            <TextField
              sx={{ width: "50%" }}
              variant="outlined"
              size="small"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              
            />
            {errors.heading && (
            <Typography variant="body2" color="error" >{errors.heading}</Typography>
          )}
          </Box>

          <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
            Long Description:
          </Typography>
          <ReactQuill
            value={formData.longDescription}
            onChange={(value) => handleEditorChange(value, 'longDescription')}
            theme="snow"
            style={{ height: "200px", marginBottom: "35px" }}
          />
          {errors.longDescription && (
            <Typography variant="body2" color="error" style={{ marginTop: "50px" }}>{errors.longDescription}</Typography>
          )}

          <Box marginBottom={2}>
            <FormControl fullWidth variant="outlined" size="small">
              <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px", marginTop: "25px" }}>
                Select Category:
              </Typography>
              <Select
                name="categoryID"
                value={formData.categoryID}
                onChange={handleChange}
                error={Boolean(errors.categoryID)}
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
              {errors.categoryID && (
                <Typography variant="body2" color="error">{errors.categoryID}</Typography>
              )}
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
              sx={{ width: "50%" }}
            >
              <MenuItem value="2 weeks">2 weeks</MenuItem>
              <MenuItem value="1 month">1 month</MenuItem>
              <MenuItem value="3 months">3 months</MenuItem>
              <MenuItem value="6 months">6 months</MenuItem>
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
            {errors.price && (
                <Typography variant="body2" color="error">{errors.price}</Typography>
              )}
          </Box>
          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>Course Image:</Typography>
          <Box {...getRootProps()} sx={{ border: "2px dashed #0F3460", padding: "20px", textAlign: "center", cursor: "pointer", borderRadius: "8px", backgroundColor: "#f9f9f9", width: "50%" }} marginBottom={2}>
            <input {...getInputProps()} />
            <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>Drag & drop an image here, or click to upload</Typography>
            {formData.courseImage && <Typography variant="body2" sx={{ marginTop: 1, color: "green" }}>{formData.courseImage.name}</Typography>}
            {errors.courseImage && (
            <Typography variant="body2" color="error">{errors.courseImage}</Typography>
          )}
          </Box>

          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>
            Course Video:
          </Typography>
          <Box
            {...getVideoRootProps()}
            sx={{
              border: "2px dashed #0F3460",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              width: "50%"
            }}
            marginBottom={2}
          >
            <input {...getVideoInputProps()} />
            <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
              Drag & drop videos here, or click to upload
            </Typography>

            {/* Display selected video names */}
            {formData.videos && formData.videos.length > 0 && (
              <Box sx={{ marginTop: 1 }}>
                <Typography variant="body2" sx={{ color: "green" }}>Selected Videos:</Typography>
                {formData.videos.map((video, index) => (
                  <Typography key={index} variant="body2" sx={{ color: "#0F3460" }}>
                    {video.name}
                  </Typography>
                ))}
                {errors.videos && (
            <Typography variant="body2" color="error">{errors.videos}</Typography>
          )}
              </Box>
            )}
          </Box>


          <Button variant="contained" type="submit" sx={{ backgroundColor: "#0F3460" }}>
            Add Course
          </Button>
        </form>
      </Paper>
    </main>
  );
}

export default AddCourse;
