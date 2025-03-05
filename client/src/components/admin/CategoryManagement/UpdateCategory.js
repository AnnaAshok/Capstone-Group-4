import React, { useState ,useEffect} from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const UpdateCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isEditMode, setIsEditMode] = useState(false); 
  const [existingImage, setExistingImage] = useState("");


  useEffect(() => {
    const categoryId = location.state?.id; 
    if (categoryId) {
      // If categoryId is passed, fetch category data for editing
      axios.post(`http://localhost:5000/getCategoryById/${categoryId}`)
        .then((response) => {
          const { categoryName, categoryImage } = response.data;
          setCategoryName(categoryName);
          setExistingImage(categoryImage.replace("\\", "/")); // Replacing backslash with forward slash
          setIsEditMode(true); 
        })
        .catch((error) => {
          console.error("Error fetching category:", error);
          alert("Error fetching category data.");
        });
    }
  }, [location.state]);

  const handleImageChange = (e) => {
    setCategoryImage(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!categoryName) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("categoryName", categoryName);
    if (categoryImage) {
      formData.append("categoryImage", categoryImage);
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/updateCategory/${location.state.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Category updated successfully!");
      navigate("/admin/Category");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Failed to update category. Please try again.");
    }
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setCategoryImage(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleCancel = () => {
    setCategoryName("");
    setCategoryImage(null);
    navigate("/admin/Category");

  };

  return (
    <main className="main-container">
      <Paper elevation={3} sx={{ padding: 3, margin: "auto" }}>
        <div className="list-category">
          <h3>Update category</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <Box marginBottom={2}>
            <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>
              Category Name:
            </Typography>
            <TextField
              sx={{ width: "50%" }}
              variant="outlined"
              size="small"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </Box>

          {/* Drag and Drop File Upload */}
          <Typography variant="body1" sx={{ color: "#0F3460", marginBottom: "8px", fontSize: "18px" }}>
            Category Image:
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
            <input {...getInputProps()} onChange={handleImageChange} />
            <Typography variant="body1" sx={{ color: "#0F3460", fontSize: "18px" }}>
              Drag & drop an image here, or click to upload
            </Typography>
             {/* Show Existing or New Image */}
             {categoryImage && (
              <div>
                <img
                  src={URL.createObjectURL(categoryImage)}
                  alt="New Category"
                  style={{ width: "100px", marginTop: "10px" }}
                />
                <p>New Image Selected</p>
              </div>
            )}

            {existingImage && !categoryImage && (
              <div>
                <img
                  src={`http://localhost:5000/${existingImage}`}
                  alt="Existing Category"
                  style={{ width: "100px", marginTop: "10px" }}
                />
                <p>Existing Image</p>
              </div>
            )}
          </Box>
          <Box display="flex" gap={2} marginTop={2}>
            <Button type="submit" variant="contained">
              Update
            </Button>
            <Button variant="outlined" sx={{ border: "1px solid #0F3460", color: "#0F3460" }} onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </main>
  );
};

export default UpdateCategory;
