import React, { useEffect, useState } from 'react';
import '../../home.css';
import sample_img from "../../Assets/images/Python-logo.png"

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Fetch categories from MongoDB
    useEffect(() => {
        fetch("http://localhost:5000/category")
            .then(response => response.json())
            .then(data => {
                console.log("Categories Data:", data);
                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    setCategories([]);
                    console.error("Fetched data is not an array:", data);
                }
            })
            .catch(error => console.error("Error fetching categories:", error));
    }, []);

    // Fetch courses from MongoDB
    useEffect(() => {
        fetch("http://localhost:5000/courses")
            .then(response => response.json())
            .then(data => setCourses(data))
            .catch(error => console.error("Error fetching courses:", error));
    }, []);

    // Filter courses based on selected category
    const filteredCourses = selectedCategory
        ? courses.filter(course => course.category === selectedCategory)
        : courses;

    return (
        <section className='courses-section'>
            <div>
                {/* Title Section */}
                <div className='courses-title-image'>
                    <p className='courses-subtitle mt-5'>Our Top Classes</p>
                    <h2 className="courses-title">Featured Courses</h2>
                </div>
                <p className="course-title-description mt-2">Explore our wide range of courses designed to help you excel.</p>

                {/* Categories Section */}
                <div className="categories-container">
                    <div className="categories-list">
                        {categories.map(category => (
                            <button
                                key={category._id}
                                className={`category-btn ${selectedCategory === category.categoryName ? "active" : ""}`}
                                onClick={() => setSelectedCategory(category.categoryName)}
                            >
                                {category.categoryName}
                            </button>
                        ))}
                        <button className="category-btn" onClick={() => setSelectedCategory(null)}>All</button>
                    </div>
                </div>

                {/* Courses Section */}
                <div className="courses-grid">
                    {filteredCourses.map((course) => (
                        <div key={course._id} className="course-card">
                            <img src={sample_img} alt="sample image" className='course-image' />

                            <div className="course-content">
                                <h3 className="course-title">{course.title}</h3>
                                <p className="course-description">{course.description}</p>

                                {/* Duration and Stars */}
                                <div className="course-duration-rating mt-4">
                                    <p className="course-duration"><strong>Duration:</strong> {course.duration}</p>
                                    <div className="stars">
                                        {"\u2605 \u2605 \u2605 \u2605 \u2606"} 
                                    </div> 
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
