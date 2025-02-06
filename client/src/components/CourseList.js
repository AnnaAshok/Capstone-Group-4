import React, { useEffect, useState } from 'react';
import '../home.css';
import sample_img from "../Assets/Python-logo.png"

const CourseList = () => {
    const [courses, setCourses] = useState([]);

    // Fetch courses from MongoDB
    useEffect(() => {
        fetch("http://localhost:5000/courses")
            .then(response => response.json())
            .then(data => setCourses(data))
            .catch(error => console.error("Error fetching courses:", error));
    }, []);

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
                    {courses.map((course) => (
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
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CourseList;
