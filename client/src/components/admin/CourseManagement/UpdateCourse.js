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
  const API_BASE = process.env.REACT_APP_API_URL;

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    heading: "",
    longDescription: "",
    categoryID: "",
    duration: "2 weeks",
    price: "",
    existingImage: "",
    courseImage: null,
    existingVideos: [],
    videos: [],
  });

  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  


  // Fetch course details
  useEffect(() => {
    axios
      .get(`${API_BASE}/getCourseById/${id}`)
      .then((response) => {
        const course = response.data;
        if (course) {
          setFormData({
            title: course.title || "",
            shortDescription: course.shortDescription || "",
            heading: course.heading || "",
            longDescription: course.longDescription || "",
            categoryID: course.categoryID?._id || course.categoryID || "",
            duration: course.duration || "2 weeks",
            price: course.price || "",
            existingImage: course.courseImage
              ? course.courseImage
              : "",
            courseImage: null,
            existingVideos: course.videos
              ? course.videos
              : "",
            videos: null,
          });
        }
      })
      .catch((error) => console.error("Error fetching course:", error));
  }, [id]);

  console.log("new uploaded image: ", formData.courseImage);
  console.log("Existing videos fetched from DB: ", formData.existingVideos);


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

  // File input handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setFormData({ ...formData, courseImage: file });
      } else if (file.type.startsWith("video/")) {
        setFormData((prevData) => ({
          ...prevData,
          videos: [...prevData.videos, file], // Append videos for multiple files
        }));
      }
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

  // Handle video upload
  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
    accept: "video/*",
    multiple: true, // Allow multiple video selection
    onDrop: (acceptedFiles) => {
      setFormData((prevData) => ({
        ...prevData,
        videos: [...prevData.videos || [], ...acceptedFiles], // Append new videos
      }));
    },
  });

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("shortDescription", formData.shortDescription);
    data.append("heading", formData.heading);
    data.append("longDescription", formData.longDescription);
    data.append("categoryID", formData.categoryID);
    data.append("duration", formData.duration);
    data.append("price", formData.price);

    if (formData.courseImage) {
      data.append("courseImage", formData.courseImage);
    }

    let imageUrl = formData.existingImage;

    // Check if a new image is uploaded
    if (formData.courseImage && formData.courseImage !== formData.existingImage) {
      const uploadData = new FormData();
      uploadData.append("file", formData.courseImage);
      uploadData.append("upload_preset", "eduSphere");

      console.log("uploaded image", formData.courseImage);

      try {
        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dnmqu8v7b/image/upload",
          uploadData,
          {
            onUploadProgress: (progressEvent) => {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setImageUploadProgress(percent);
            },
          }
        );
        console.log("Cloudinary Response", cloudinaryResponse);
        imageUrl = cloudinaryResponse.data.secure_url;
        console.log("imageURL", imageUrl);

      } catch (error) {
        console.error("Image upload failed", error);
        imageUrl = formData.existingImage;
      }

    } else {
      // If no new image uploaded, use the existing one
      imageUrl = formData.existingImage;
    }


    // Upload video if a new one is provided
    const videoUrls = formData.existingVideos;

    if (formData.videos && formData.videos.length > 0) {
      for (const video of formData.videos) {
        const uploadData = new FormData();
        uploadData.append("file", video);
        uploadData.append("upload_preset", "eduSphere");

        try {
          const cloudinaryVideoResponse = await axios.post(
            "https://api.cloudinary.com/v1_1/dnmqu8v7b/video/upload",
            uploadData
          );
          videoUrls.push(cloudinaryVideoResponse.data.secure_url);
        } catch (error) {
          console.error("Error uploading video:", error);
        }
      }
    }


    const courseData = {
      title: formData.title,
      shortDescription: formData.shortDescription,
      heading: formData.heading,
      longDescription: formData.longDescription,
      categoryID: formData.categoryID,
      duration: formData.duration,
      price: formData.price,
      courseImage: imageUrl,
      videos: videoUrls,
    };

    await axios.post(`${API_BASE}/updateCourse/${id}`, courseData);
    navigate("/admin/courses");
  }

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

            {imageUploadProgress > 0 && imageUploadProgress < 100 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ color: "#0F3460", mb: 0.5 }}>
                  Uploading Image: {imageUploadProgress}%
                </Typography>
                <Box sx={{ height: 10, backgroundColor: "#ccc", borderRadius: 5 }}>
                  <Box
                    sx={{
                      height: "100%",
                      width: `${imageUploadProgress}%`,
                      backgroundColor: "#0F3460",
                      borderRadius: 5,
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>

          {/* Course Video Upload */}
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
              </Box>
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
