import React from 'react'
import Header from './Header'
import Footer from './Footer'
import '../../home.css';
import CourseList from './CourseList';
import { useEffect, useState } from 'react';

const CoursePage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch categories from backend
  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then(response => response.json())
      .then(data => {
        console.log("Fetched categories:", data);
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Unexpected API response format:", data);
          setCategories([]);
        }
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      });
  }, []);

  return (
    <>
      <Header />
      <section>
        <div className='course-page-banner-bg'></div>
      </section>

      {/* Category Buttons */}
      <div className="category-buttons">
        <button
          className={`category-btn ${selectedCategory === "All" ? "active" : ""}`}
          onClick={() => setSelectedCategory("All")}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category._id}
            className={`category-btn ${selectedCategory === category.categoryName ? "active" : ""}`}
            onClick={() => {
              console.log("Selected category:", category.categoryName);
              setSelectedCategory(category.categoryName)
            }}
          >
            {category.categoryName}
          </button>
        ))}
      </div>

      <CourseList selectedCategory={selectedCategory} categories={categories} />
      <Footer />
    </>
  )
}

export default CoursePage