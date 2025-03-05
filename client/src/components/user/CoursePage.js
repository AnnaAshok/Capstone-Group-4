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

      <CourseList
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        hideCategoryButtons={false}
        hidePagination={false}
      />
      <Footer />
    </>
  )
}

export default CoursePage