import React, { useEffect, useState } from 'react';
import '../../home.css';
import sample_img from "../../Assets/images/Python-logo.png"

const CourseList = ({ selectedCategory, categories, limit }) => {
    const [courses, setCourses] = useState([]);

    const selectedCategoryID = categories.find(cat => cat.categoryName === selectedCategory)?._id || null;

    // Fetch courses from backend
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const categoryParam = selectedCategory === "All" ? "" : `?categoryID=${selectedCategoryID}`;
                const response = await fetch(`http://localhost:5000/courses${categoryParam}`);
                const data = await response.json();
                console.log("Fetched courses:", data);
                setCourses(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setCourses([]);
            }
        };
        // ✅ Only fetch if selectedCategoryID is valid
        if (selectedCategoryID !== null || selectedCategory === "All") {
            fetchCourses();
        }
    }, [selectedCategoryID, selectedCategory]);


    // ✅ Ensure filtering is based on categoryID
    const filteredCourses = selectedCategory === "All"
        ? courses
        : courses.filter(course => course.categoryID === selectedCategoryID);


    const displayedCourses = limit ? filteredCourses.slice(0, limit) : filteredCourses;

    return (
        <section className='courses-section'>
            <div>
                {/* Title Section */}
                <div className='courses-title-image'>
                    <p className='courses-subtitle mt-5'>Our Top Classes</p>
                    <h2 className="courses-title">Featured Courses</h2>
                </div>
                <p className="course-title-description mt-2">Explore our wide range of courses designed to help you excel.</p>


                {/* Courses Section */}
                <div className="courses-grid">
                    {displayedCourses.length > 0 ? (
                        displayedCourses.map(course => (
                            <div key={course._id} className="course-card">
                                <img src={sample_img} alt="sample image" className='course-image' />

                                <div className="course-content">
                                    <h3 className="course-title">{course.title}</h3>
                                    <p className="course-description">{course.description}</p>

                                    {/* Duration and Stars */}
                                    <div className="course-duration-rating mt-4">
                                        <p className="course-duration"><strong>Duration:</strong> {course.duration}</p>
                                        {/* <div className="stars">
                                            {"\u2605 \u2605 \u2605 \u2605 \u2606"} 
                                        </div>  */}
                                    </div>

                                    <hr className="divider" />

                                    {/* Price and Button Row */}
                                    <div className="course-price-button">
                                        <p className="course-price">${course.price}</p>
                                        <button className="view-details-btn">View Details</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No courses available for this category.</p>
                    )}

                </div>
            </div>
        </section>
    );
};

export default CourseList;
