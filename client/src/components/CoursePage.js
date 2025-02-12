import React from 'react'
import Header from './Header'
import Footer from './Footer'
import '../home.css';
import CourseList from './CourseList';
import { useEffect, useState } from 'react';


const CoursePage = () => {
      const [categories, setCategories] = useState([]);
    
      // Fetch categories from backend
      useEffect(() => {
        fetch("http://localhost:5000/categories")
          .then(response => (response.json())
        )
          .then(data => {
            if (Array.isArray(data)) {
              setCategories(data); // Set categories only if it's an array
            } else {
              console.error("Unexpected API response format:", data);
              setCategories([]); // Default to an empty array
            }
          })
          .catch(error => {
            console.error("Error fetching categories:", error);
            setCategories([]); // Ensure categories is always an array
          });
      },[]);

    return (
      <>
        <Header />
        <section>
            <div className='course-page-banner-bg'></div>
        </section>
        <CourseList />
        <Footer />
      </>
    )
  }
  
  export default CoursePage