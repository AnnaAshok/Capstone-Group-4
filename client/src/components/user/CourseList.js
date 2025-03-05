import React, { useEffect, useState } from 'react';
import '../../home.css';
import sample_img from "../../Assets/images/Python-logo.png";

const CourseList = ({ selectedCategory, setSelectedCategory, categories, limit, hideCategoryButtons, hidePagination }) => {
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // Added state for totalPages

    const coursesPerPage = 6;

    // Fix: Directly handle 'All' category as a special case
    const selectedCategoryID = selectedCategory === "All"
        ? ""
        : categories?.find(cat => cat.categoryName === selectedCategory)?._id || "";

    // Fetch courses from backend
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const categoryParam = selectedCategory === "All"
                    ? `?page=${currentPage}&limit=${coursesPerPage}`  // If All is selected, no category filter
                    : `?categoryID=${selectedCategoryID}&page=${currentPage}&limit=${coursesPerPage}`;

                console.log("Fetching courses with URL:", `http://localhost:5000/courses${categoryParam}`);

                const response = await fetch(`http://localhost:5000/courses${categoryParam}`);
                console.log("Request URL:", `http://localhost:5000/courses${categoryParam}`); // Fix the logging

                const data = await response.json();

                // Debugging API response
                console.log("1. Fetched courses in CourseList:", data);

                if (Array.isArray(data.courses)) {
                    setCourses(data.courses); // Set courses state
                    setTotalPages(data.totalPages); // Set totalPages from API
                    setCurrentPage(data.currentPage); // Set currentPage from API
                } else {
                    console.error("API response is not an array:", data);
                    setCourses([]); // Set an empty array if data is not in the expected format
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
                setCourses([]);
            }
        };

        // Only fetch if selectedCategoryID is valid or All category is selected
        if (selectedCategory === "All" || selectedCategoryID !== null) {
            fetchCourses();
        }
    }, [selectedCategoryID, selectedCategory, currentPage]);

    // Ensure filtering is based on categoryID, but skip when "All" is selected
    const filteredCourses = selectedCategory === "All"
        ? courses // If 'All' is selected, show all courses
        : courses.filter(course => course.categoryId === selectedCategoryID); // Filter by categoryID

    // Log filtered courses
    // console.log("Courses Before Filtering:", courses);  // Check if courses array is populated
    // console.log("Filtered Courses After Filtering:", filteredCourses);
    // console.log("Total Courses Available:", filteredCourses.length);

    const totalCourses = filteredCourses.length;
    const totalPagesCalculated = Math.ceil(totalCourses / coursesPerPage); // Use the totalCourses length to calculate totalPages
    //const indexOfFirstCourse = (currentPage - 1) * limit;
    //const indexOfLastCourse = Math.min(indexOfFirstCourse + limit, filteredCourses.length);

    // Calculate the index of the first and last course based on the current page
    const indexOfFirstCourse = (currentPage - 1) * limit;
    const indexOfLastCourse = Math.min(indexOfFirstCourse + limit, filteredCourses.length);

    console.log("Total Pages:", totalPagesCalculated);
    console.log("Index of First Course:", indexOfFirstCourse);
    console.log("Index of Last Course:", indexOfLastCourse);

    // applying pagination for the case when limit is provided
    // const displayedCourses = limit
    // ? filteredCourses.slice(0, limit) // If limit exists, only show limited courses
    // : filteredCourses.length > 0
    //     ? filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse) // If pagination is needed
    //     : [];

    // Applying pagination: if limit is provided, only show limited courses
    const displayedCourses = limit
        ? filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse) // Show courses based on pagination
        : filteredCourses.slice(0, limit); // Show limited courses if no pagination is needed

    console.log("Displayed Courses:", displayedCourses);

    return (
        <section className='courses-section'>
            <div>
                {/* Title Section */}
                <div className='courses-title-image'>
                    <p className='courses-subtitle mt-5'>Our Top Classes</p>
                    <h2 className="courses-title">Featured Courses</h2>
                </div>
                <p className="course-title-description mt-2">Explore our wide range of courses designed to help you excel.</p>

                {/* Conditionally show category buttons */}
                {!hideCategoryButtons && (
                    <div className="category-buttons mt-4 mb-2">
                        <button
                            className={`category-btn ${selectedCategory === "All" ? "active" : ""}`}
                            onClick={() => {
                                setSelectedCategory("All");
                                setCurrentPage(1);
                            }}
                        >
                            All
                        </button>
                        {categories.map(category => (
                            <button
                                key={category._id}
                                className={`category-btn ${selectedCategory === category.categoryName ? "active" : ""}`}
                                onClick={() => {
                                    setSelectedCategory(category.categoryName);
                                    setCurrentPage(1);
                                    console.log("Selected category:", category.categoryName);  // Add this line for debugging
                                }}
                            >
                                {category.categoryName}
                            </button>
                        ))}
                    </div>
                )}

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
                        <p className='no-course-available-heading'>No courses available for this category.</p>
                    )}
                </div>

                {/* Pagination (Only Show in Course Page) */}
                {!hidePagination && totalPages > 1 && (
                    <div className="pagination mb-5">
                        <button
                            className="pagination-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Prev
                        </button>
                        <span className="pagination-info">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="pagination-btn"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CourseList;

