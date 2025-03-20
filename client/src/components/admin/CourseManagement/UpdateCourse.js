import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDropzone } from "react-dropzone";

function UpdateCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null); // Reference for file input

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    categoryID: "",
    duration: "2 weeks",
    price: "",
    existingImage: "",
    courseImage: null,
  });

  // Fetch course details
  useEffect(() => {
    axios
      .get(`http://localhost:5000/getCourseById/${id}`)
      .then((response) => {
        const course = response.data;
        if (course) {
          setFormData({
            title: course.title || "",
            shortDescription: course.shortDescription || "",
            longDescription: course.longDescription || "",
            categoryID: course.categoryID?._id || course.categoryID || "",
            duration: course.duration || "2 weeks",
            price: course.price || "",
            existingImage: course.courseImage
              ? course.courseImage
              : "",
            courseImage: null,
          });
        }
      })
      .catch((error) => console.error("Error fetching course:", error));
  }, [id]);

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

  // File input handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, courseImage: file });
    }
  };

  // Dropzone for drag-and-drop file uploads
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFormData({ ...formData, courseImage: acceptedFiles[0] });
      }
    },
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("shortDescription", formData.shortDescription);
    data.append("longDescription", formData.longDescription);
    data.append("categoryID", formData.categoryID);
    data.append("duration", formData.duration);
    data.append("price", formData.price);

    if (formData.courseImage) {
      data.append("courseImage", formData.courseImage);
    }

    let imageUrl = formData.existingImage;

    const uploadData = new FormData(); 
    uploadData.append("file", formData.existingImage ? formData.existingImage : formData.courseImage);
    uploadData.append("upload_preset", "eduSphere");

    try {
      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dnmqu8v7b/image/upload",
        uploadData
      );

      imageUrl = cloudinaryResponse.data.secure_url;

      const courseData = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        longDescription: formData.longDescription,
        categoryID: formData.categoryID,
        duration: formData.duration,
        price: formData.price,
        courseImage: imageUrl, 
      };

      await axios.post(`http://localhost:5000/updateCourse/${id}`, courseData);
      navigate("/admin/courses");
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };
  return (
    <main className="main-container">
      <Paper elevation={3} sx={{ padding: 3, margin: "auto" }}>
        <div className="list-category">
          <h3>Update Course</h3>
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
                value={formData.categoryID || ""} // Ensures existing category is shown
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

          <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
            Course Image:
          </Typography>
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed #0F3460",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              width: "50%",
            }}
            marginBottom={2}
          >
            <input {...getInputProps()} />
            <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
              Drag & drop an image here, or click to upload
            </Typography>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {formData.courseImage && (
              <img
                src={URL.createObjectURL(formData.courseImage)}
                alt="Preview"
                style={{
                  marginTop: "10px",
                  maxWidth: "100px",
                  maxHeight: "100px",
                }}
              />
            )}

            {formData.existingImage && !formData.courseImage && (
              <img
                src={formData.existingImage}
                alt="Existing"
                style={{
                  marginTop: "10px",
                  maxWidth: "100px",
                  maxHeight: "100px",
                }}
              />
            )}
          </Box>

          <Button type="submit" variant="contained" color="primary">
            Update Course
          </Button>
        </form>
      </Paper>
    </main>
  );
}

export default UpdateCourse;
