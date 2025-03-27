import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Use useNavigate if you want to navigate programmatically
import '../../home.css';
import Header from './Header'
import Footer from './Footer'
import LoginSignup from "./LoginSignup";
import { jwtDecode } from 'jwt-decode';

function removeHtmlTags(input) {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.body.textContent || "";
}

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
            setLoading(true);

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

                    // 🔥 First check LocalStorage
                    const storedEnrollment = localStorage.getItem(`enrolled_${courseId}_${userID}`);
                    if (storedEnrollment === 'true') {
                        setEnrolled(true);
                        setLoading(false); // Ensure loading is set to false once enrollment is checked
                        return; // Stop here since we know the user is enrolled
                    }

                    // Check if the user is already enrolled in the course from the DB
                    const enrollmentResponse = await fetch(`http://localhost:5000/enroll/${userID}/${courseId}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`, // Ensure the token is passed as a Bearer token
                            "Content-Type": "application/json",
                        }
                    });

                    if (enrollmentResponse.ok) {
                        const enrollmentData = await enrollmentResponse.json();
                        if (enrollmentData.enrolled) {
                            setEnrolled(true);
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

        let userID;
        // Decode the token to get the user ID
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
                        <img src={course.courseImage} alt={course.title} className="course-image-details-page text-left" />
                        <p className="course-description">{course.shortDescription}</p>
                    </div>

                    {/* Right Section: Additional Course Details */}
                    <div className="course-right">
                        {/* <h2>Course Details</h2> */}
                        <p className=''>Duration: {course.duration}</p>
                        <p className=''>Price: ${course.price}</p>
                        {/* Show enroll button only if the user is NOT enrolled */}
                        {!enrolled && (
                            <button onClick={handleEnrollment} className="enroll-button">Enroll</button>
                        )}
                        <button onClick={() => window.history.back()} className="back-button">Back</button>
                        {successMessage && <p className="success-message">{successMessage}</p>}
                    </div>
                </div>
            </section>

            {enrolled && (
                <section className="course-materials mt-5">
                    <h2 className='text-left'>{course.heading ? course.heading.toUpperCase() : ''}</h2>
                    <p>{removeHtmlTags(course.longDescription)}</p>
                    <div className="video-container">
                        {course.videos.length > 0 && (
                                <div className="videos-row">
                                    {course.videos.map((video, index) => (
                                        <div className="video-item" key={index}>
                                            <video width="400" controls>
                                                <source src={video} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>


                    <div className='text-center mt-5'>
                        <button className="attend-quiz-button">Attend Quiz</button>
                    </div>
                </section>
            )}


            {/* Render the LoginSignup modal when loginModalShow is true */}
            {loginModalShow && (
                <LoginSignup show={loginModalShow} handleClose={() => setLoginModalShow(false)} />
            )}

            <Footer />
        </>
    );
};

export default CourseDetailsPage;
