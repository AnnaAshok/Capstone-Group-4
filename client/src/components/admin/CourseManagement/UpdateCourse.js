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
    description: "",
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
            description: course.description || "",
            categoryID: course.categoryID?._id || course.categoryID || "", // Ensure correct ID format
            duration: course.duration || "2 weeks",
            price: course.price || "",
            existingImage: course.courseImage
              ? `http://localhost:5000/uploads/${course.courseImage}`
              : "",
            courseImage: null,
          });
        }
      })
      .catch((error) => console.error("Error fetching course:", error));
  }, [id]);

  // Fetch categories
  useEffect(() => {
    axios
      .get("http://localhost:5000/getCategory")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditorChange = (value) => {
    setFormData({ ...formData, description: value });
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
    data.append("description", formData.description);
    data.append("categoryID", formData.categoryID);
    data.append("duration", formData.duration);
    data.append("price", formData.price);

    if (formData.courseImage) {
      data.append("courseImage", formData.courseImage);
    }

    try {
      await axios.post(`http://localhost:5000/updateCourse/${id}`, data);
      // alert("Course updated successfully!");
      navigate("/admin/courses");
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };
  console.log("formData", formData);
  return (
    <main className="main-container">
      <Paper elevation={3} sx={{ padding: 3, margin: "auto" }}>
        <div className="list-category">
          <h3>Update Course</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <Box marginBottom={2}>
            <Typography
              variant="body1"
              sx={{ color: "#0F3460", fontSize: "18px" }}
            >
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

          <Typography
            variant="body1"
            sx={{ color: "#0F3460", fontSize: "18px" }}
          >
            Course Description:
          </Typography>
          <ReactQuill
            value={formData.description}
            onChange={handleEditorChange}
            theme="snow"
            style={{ height: "200px", marginBottom: "35px" }}
          />

          <Box marginBottom={2}>
            <FormControl fullWidth variant="outlined" size="small">
              <Typography
                variant="body1"
                sx={{ color: "#0F3460", fontSize: "18px", marginTop: "25px" }}
              >
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
            <Typography
              variant="body1"
              sx={{ color: "#0F3460", fontSize: "18px" }}
            >
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
            <Typography
              variant="body1"
              sx={{ color: "#0F3460", fontSize: "18px" }}
            >
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

          <Typography
            variant="body1"
            sx={{ color: "#0F3460", fontSize: "18px" }}
          >
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
            <Typography
              variant="body1"
              sx={{ color: "#0F3460", fontSize: "18px" }}
            >
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
                alt="Selected"
                style={{ width: "100px", marginTop: "10px" }}
              />
            )}

            {formData.existingImage && !formData.courseImage ? (
              <img
                src={formData.existingImage}
                alt="Existing Course"
                style={{
                  width: "100px",
                  marginTop: "10px",
                  borderRadius: "8px",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }} // Hide if error
              />
            ) 
            :
             (
              <Typography>No Image Available</Typography>
            )
            }
          </Box>

          <Box display="flex" gap={2} marginTop={2}>
            <Button type="submit" variant="contained" color="primary">
              Update
            </Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate("/admin/courses")}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </main>
  );
}

export default UpdateCourse;
