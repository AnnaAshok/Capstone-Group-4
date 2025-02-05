import React from 'react'
import Header from './Header'
import Footer from './Footer'
import '../home.css';
import CourseList from './CourseList';
import { useEffect, useState } from 'react';

import course_icon from "../images/course-icon.png"
import quiz_icon from "../images/quiz-icon.png"
import certificate_icon from "../images/certificate-icon.png"
import about_img from "../images/about-img-3.png"
import newsletter_img from "../images/newsletter-image.png"

const Home = () => {
  const [categories, setCategories] = useState([]);

  // Fetch categories from backend
  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then(response => (response.json())
    )
      .then(data => {
        console.log("Fetched Categories:", data);
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

      {/* Banner Section */}
      <section className="text-center banner-image">
        <div className='banner-section-overlay'>
          <h1 className='text-white font-bold mt-5'>We Help You Learn</h1>
          <h1 className='text-white font-bold mt-4'>What You Love</h1>
        </div>
      </section>

      {/* Our Services */}
      <section className="text-center services">
        <div className='service-title-image'>
          <p className='service-subtitle mt-5'>Guaranteed Success</p>
          <h2 className="serivce-title">Our Services</h2>
        </div>
        <p className='service-heading-desc mt-3'>We offer flexible learning and expert guidance to help you succeed. Our services ensure practical knowledge and hands-on experience.</p>

        <div className="service-grid">
          <div className="service-card">
            <img src={course_icon} alt="icon for courses"></img>
            <h3 className="service-title mt-3">10+ Courses</h3>
            <p className="service-description">Explore our diverse range of courses, designed to help you to achieve your goals.</p>
          </div>
          <div className="service-card">
            <img src={quiz_icon} alt="icon for quizzes"></img>
            <h3 className="service-title mt-3">Quizzes</h3>
            <p className="service-description">Test your knowledge with quizzes. Reinforce what you've learned in each subject.</p>
          </div>
          <div className="service-card">
            <img src={certificate_icon} alt="icon for certificates"></img>
            <h3 className="service-title mt-3">Certificates</h3>
            <p className="service-description">Earn certificates upon completion. Showcase your skills and enhance your career.</p>
          </div>
        </div>
      </section>

      {/* About our platform */}
      <section className='about-our-platform'>
        <div className='about-our-platform-bg container'>

          <div className='about-image'>
            <div className='about-image-border'>
              {/* <div className='about-img'></div> */}
              <img src={about_img} alt="an image of a girl with books"></img>
            </div>
          </div>
          <div className='about-content'>
            <p className='about-content-subtitle'>About Our Platform</p>
            <h2>We empower students with quality learning resources on our innovative platform.</h2>
            <p className='mt-4'>Our team comprises certified professionals specializing in web development, data science, graphic design, and emerging technologies. With extensive industry experience, we provide comprehensive course materials and interactive quizzes to enhance your learning journey.</p>
            <button className='btn-browse-all-course'>Browse All Courses</button>
          </div>
        </div>
      </section>

      <section className='ad-section'>
        <div className='ad-overlay'>
          <h2>50% Offer For Very First 50<br />Student's & Mentors</h2>
        </div>
      </section>

      <CourseList />

      {/* Subscribe our Newsletter */}
      <section className='newsletter-section'>
        <div className='newsletter-grid'>

          <div className='newsletter-image'>

            {/* <div className='about-img'></div> */}
            <img src={newsletter_img} alt="an image of a girl with books"></img>

          </div>
          <div className='newsletter-content'>
            <p className='newsletter-content-subtitle'>Subscribe Newsletter</p>
            <h2>Find Your Best Course With Us</h2>
            <p className='mt-4'>Quality technologies via fully tested methods of empowerment. Proactively disseminate web enabled best practices after cross functional expertise.</p>

            {/* Input Fields for Email & Courses */}
            <div className="newsletter-inputs">
              <input type="email" placeholder="Email" className="newsletter-input" />
              <input type="text" placeholder="Course Name" className="newsletter-input" />
            </div>

            <button className='btn-subscribe-now mt-4'>Subscribe Now</button>
          </div>
        </div>
      </section>

      {/* categories  */}
      <section className='category-section'>
        <div className="carousel-container">
          <div className="carousel-track">
            {categories?.map((category, index) => (// Duplicate for smooth looping
              <div key={index} className="category-card">
                <img src={category.categoryImage} alt={category.categoryName} className="category-image" />
                <div className="category-info">
                  <p className="category-name">
                    {category.categoryName}
                    {/* <span className="course-count"> ({category.courseCount} courses)</span> */}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </>
  )
}

export default Home