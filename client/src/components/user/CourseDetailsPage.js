// CourseDetailsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../home.css'; // You might need to adjust this path
import Header from './Header'; // And these paths, depending on your project structure
import Footer from './Footer';
import LoginSignup from './LoginSignup';
import { jwtDecode } from 'jwt-decode';
import Quiz from './Quiz';

function removeHtmlTags(input) {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.body.textContent || '';
}

const CourseDetailsPage = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolled, setEnrolled] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [loginModalShow, setLoginModalShow] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
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
                setCourse(data);

                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const userID = decodedToken.userId;

                    const storedEnrollment = localStorage.getItem(`enrolled_${courseId}_${userID}`);
                    if (storedEnrollment === 'true') {
                        setEnrolled(true);
                        setLoading(false);
                        return;
                    }

                    const enrollmentResponse = await fetch(`http://localhost:5000/enroll/${userID}/${courseId}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
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
        const token = localStorage.getItem('token');

        if (!token) {
            setLoginModalShow(true);
            return;
        }

        let userID;
        try {
            const decodedToken = jwtDecode(token);
            userID = decodedToken.userId;
        } catch (error) {
            setError('Invalid token.');
            return;
        }

        if (course.price === 0) {
            const paymentID = null;

            try {
                const response = await fetch('http://localhost:5000/enroll', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ userID, courseId, paymentId: null }),
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
            //navigate(/payment?courseId=${courseId}&userID=${userID});
        }
    };

    const handleAttendQuiz = () => {
        setShowQuiz(true);
    };

    if (loading) {
        return <p>Loading course details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!course) {
        return <p>Course not found</p>;
    }

    return (
        <>
            <Header />

            <section>
                <div className="course-details-page-banner-bg"></div>
            </section>

            <section className="course-details-page">
                <div className="course-details-content">
                    <div className="course-left">
                        <h1 className="">{course.title}</h1>
                        <img src={course.courseImage} alt={course.title} className="course-image-details-page text-left" />
                        <p className="course-description">{course.shortDescription}</p>
                    </div>

                    <div className="course-right">
                        <p className="">Duration: {course.duration}</p>
                        <p className="">Price: ${course.price}</p>
                        {!enrolled && (
                            <button onClick={handleEnrollment} className="enroll-button">Enroll</button>
                        )}
                        <button onClick={() => window.history.back()} className="back-button">Back</button>
                        {successMessage && <p className="success-message">{successMessage}</p>}
                    </div>
                </div>
            </section>

            {enrolled && !showQuiz && (
                <section className="course-materials mt-5">
                    <h2 className="text-left">{course.heading ? course.heading.toUpperCase() : ''}</h2>
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

                    <div className="text-center mt-5">
                        <button onClick={handleAttendQuiz} className="attend-quiz-button">Attend Quiz</button>
                    </div>
                </section>
            )}

            {showQuiz && <Quiz courseId={courseId} />}

            {loginModalShow && (
                <LoginSignup show={loginModalShow} handleClose={() => setLoginModalShow(false)} />
            )}

            <Footer />
        </>
    );
};


export default CourseDetailsPage;
