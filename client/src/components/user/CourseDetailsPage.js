import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Use useNavigate if you want to navigate programmatically
import '../../home.css';
import Header from './Header'
import Footer from './Footer'
import sample_img from "../../Assets/images/Python-logo.png";

const CourseDetailsPage = () => {
    const { courseId } = useParams(); // Get course ID from URL
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);  // For loading state
    const [error, setError] = useState(null);  // For error handling

    useEffect(() => {
        // Fetch course details from API
        fetch(`http://localhost:5000/courses/${courseId}`)
            .then(response => {
                console.log("response",response)
                if (!response.ok) {
                    throw new Error('Failed to fetch course details');
                }
                return response.json();
            })
            .then(data => {
                setCourse(data);
                setLoading(false);  // Stop loading once the data is fetched
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [courseId]);

    if (loading) {
        return <p>Loading course details...</p>;
    }

    if (error) {
        return <p>{error}</p>; // Display error if there was an issue fetching data
    }

    if (!course) {
        return <p>Course not found</p>;
    }

    return (
        <>
            <Header />

            <section>
                <div className='course-details-page-banner-bg'></div>
            </section>

            <section className="course-details-page">
                <div className="course-details-content">
                    {/* Left Section: Title, Description, and Image */}
                    <div className="course-left">
                        <h1 className=''>{course.title}</h1>
                        {/* <img src={course.image || "../../Assets/images/Python-logo.png"} alt={course.title} className="course-image text-left"/> */}
                        <img src={sample_img} alt="sample image" className='course-image-details-page' />
                        <p className="course-description"><div dangerouslySetInnerHTML={{__html: course.description}}/></p>
                    </div>

                    {/* Right Section: Additional Course Details */}
                    <div className="course-right">
                        {/* <h2>Course Details</h2> */}
                        <p className=''>Duration: {course.duration}</p>
                        <p className=''>Price: ${course.price}</p>
                        <button className="enroll-button">Enroll</button>
                        <button onClick={() => window.history.back()} className="back-button">Back</button>
                    </div>
                </div>
            </section>

            <Footer />
        </>      
    );
};

export default CourseDetailsPage;
