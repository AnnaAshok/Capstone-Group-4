import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categoryID: "",
    duration: "2 weeks",
    price: "",
    existingImage: "",
    courseImage: null,
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/getCourse/${id}`)
      .then(response => {
        const course = response.data;
        setFormData({ ...course, existingImage: course.courseImage });
      })
      .catch(error => console.error("Error fetching course:", error));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, courseImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    try {
      await axios.post(`http://localhost:5000/updateCourse/${id}`, data);
      alert("Course updated successfully!");
      navigate("/admin/courses");
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  return (
    <div className="admin-container">
      <h2>Update Course</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        
        <input type="file" name="courseImage" onChange={handleFileChange} />

        <button type="submit" className="btn btn-primary">Update Course</button>
      </form>
    </div>
  );
}

export default UpdateCourse;
