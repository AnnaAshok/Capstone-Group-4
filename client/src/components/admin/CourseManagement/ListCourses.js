import React, { useState, useEffect } from 'react';
import axios from "axios";
import CustomCourseTable from '../CustomCourseTable'; // Import your custom table component for courses
import './Course.css'; // Ensure the CSS file is correctly imported
import { useNavigate } from 'react-router-dom';

const ListCourses = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate(); // for navigation to Add Course page
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  const API_BASE = process.env.REACT_APP_API_URL;

    useEffect(() => {
      fetchCourses();
    }, [currentPage]);

  const fetchCourses = async () => {
    try {
    const response = await axios.get(`${API_BASE}/getCourses`, {
      params: {
        page: currentPage,
        limit: limit,
      }
    });
    setCourses(response.data.courses)
    setTotalPages(response.data.totalPages);
    }catch (error) {
      console.error("Error fetching course:", error);
    }
  }
  const handleAddCourse = () => {
    navigate("/admin/addCourse"); // Navigate to add course page
  };
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
  };
  return (
    <main className="main-container">
      <div className="list-courses">
        <h3>List of Courses</h3>
        <button onClick={handleAddCourse}>Add New Course</button>
      </div>
      <CustomCourseTable courses={courses} setCourses={setCourses} currentPage={currentPage} itemsPerPage={limit}/> {/* Use CustomTable for courses */}
      <div className="pagination">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span> {currentPage} of {totalPages} </span>
                <button 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
    </main>
  );
};

export default ListCourses;
