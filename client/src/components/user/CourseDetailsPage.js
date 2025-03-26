import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Use useNavigate if you want to navigate programmatically
import '../../home.css';
import Header from './Header'
import Footer from './Footer'
import LoginSignup from "./LoginSignup";
import { jwtDecode } from 'jwt-decode'; 

const CourseDetailsPage = () => {
    const { courseId } = useParams(); // Get course ID from URL
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);  // For loading state
    const [error, setError] = useState(null);  // For error handling
    const [enrolled, setEnrolled] = useState(false);  // Track enrollment status
    const [successMessage, setSuccessMessage] = useState('');
    const [loginModalShow, setLoginModalShow] = useState(false);  // Renamed the state for modal visibility
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/courses/${courseId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch course details');
                }
                const data = await response.json();
                console.log(data);
                setCourse(data);
    
                // Check if the user is already enrolled
                const token = localStorage.getItem("token");
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const userID = decodedToken.userId;
    
                    const enrollmentResponse = await fetch(`http://localhost:5000/enroll/${courseId}/${userID}`);

                    if (enrollmentResponse.ok) {
                        const enrollmentData = await enrollmentResponse.json();
                        if (enrollmentData.enrolled) {
                            setEnrolled(true);  // Mark as enrolled
                        } else {
                            setEnrolled(false);  // Mark as not enrolled if the user is not enrolled
                        }
                    }
                    
                }
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
    
        fetchCourseDetails();

        // Cleanup function to reset enrollment when the component is unmounted
        return () => {
            setEnrolled(false);
        };
    }, [courseId]);

    
    const handleEnrollment = async () => {
        const token = localStorage.getItem("token");  // Retrieve token from localStorage
        console.log("Token from localStorage:", token);
    
        // Check if the user is not logged in
        if (!token) {
            console.log("User is not logged in");
            setLoginModalShow(true);  // Set modal to show if the user is not logged in
            return;
        }
    
        // Decode the token to get the user ID
        let userID;
        try {
            const decodedToken = jwtDecode(token);  // Decode the token to extract information
            console.log(decodedToken);

            userID = decodedToken.userId;  // Assuming the userID is in the decoded token (adjust if needed)
            console.log("Decoded User ID:", userID);

        } catch (error) {
            console.log("Error decoding token:", error);
            setError('Invalid token.');
            return;
        }
        // If the course is free, proceed with enrollment
        if (course.price === 0) {
            const paymentID = null;

            try {
                const response = await fetch('http://localhost:5000/enroll', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ userID, courseId, paymentId: null })
                });
                if (response.ok) {
                    setSuccessMessage('Enrollment successful!');
                    setEnrolled(true);
                } else {
                    throw new Error('Enrollment failed.');
                }
            } catch (err) {
                setError('Something went wrong.');
            }
        } else {
            // Redirect to payment page for paid courses
            //navigate(`/payment?courseId=${courseId}&userID=${userID}`);
        }
    };
console.log(loginModalShow)

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
                        <img src={course.courseImage} alt={course.title} className="course-image-details-page text-left"/>
                        <p className="course-description">{course.shortDescription}</p>
                    </div>

                    {/* Right Section: Additional Course Details */}
                    <div className="course-right">
                        {/* <h2>Course Details</h2> */}
                        <p className=''>Duration: {course.duration}</p>
                        <p className=''>Price: ${course.price}</p>
                        {!enrolled && (
                            <button onClick={handleEnrollment} className="enroll-button">Enroll</button>
                        )}
                        <button onClick={() => window.history.back()} className="back-button">Back</button>
                        {successMessage && <p className="success-message">{successMessage}</p>}
                    </div>
                </div>
            </section>

            {enrolled && (
                <section className="course-materials">
                    <h2 className='text-left'>Course Details</h2>
                    {course.longDescription}
                    <div className="video-container">
                        <iframe
                            width="560"
                            height="315"
                            src={course.video}
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="Course Video"
                        ></iframe>
                    </div>
                    <button onClick={() => window.history.back()} className="back-button">Quiz</button>
                </section>
            )}
            

            {/* Render the LoginSignup modal when loginModalShow is true */}
            {loginModalShow && (
                <LoginSignup show={loginModalShow} handleClose={() => setLoginModalShow(false)}  />
            )}

            <Footer />
        </>      
    );
};

export default CourseDetailsPage;
