import React, { useState, useEffect } from 'react';
import axios from "axios";
import CustomCourseTable from '../CustomCourseTable'; // Import your custom table component for courses
import './Course.css'; // Ensure the CSS file is correctly imported
import { useNavigate } from 'react-router-dom';

const ListCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate(); // for navigation to Add Course page

  useEffect(() => {
    axios.get("http://localhost:5000/getCourses")
      .then(response => setCourses(response.data))
      .catch(error => console.error("Error fetching courses:", error));
  }, []);

  const handleAddCourse = () => {
    navigate("/admin/addCourse"); // Navigate to add course page
  };

  return (
    <main className="main-container">
      <div className="list-courses">
        <h3>List of Courses</h3>
        <button onClick={handleAddCourse}>Add new Course</button>
      </div>
      <CustomCourseTable courses={courses} setCourses={setCourses} /> {/* Use CustomTable for courses */}
    </main>
  );
};

export default ListCourses;
