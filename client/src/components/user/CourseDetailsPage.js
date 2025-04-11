// CourseDetailsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../home.css'; 
import Header from './Header';
import Footer from './Footer';
import LoginSignup from './LoginSignup';
import { jwtDecode } from 'jwt-decode';
import Quiz from './Quiz';
import Certificate from './Certificate';
import PaymentForm from "./PaymentForms.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";



const stripePromise = loadStripe("pk_test_51R6wQSQcPPmDfWJk5KDjPCcTRcmg8kiv55ZACiHCR9CX56h7gMPcJNOiRaCoNRQrjH0cbdpHpuh2b2wRSN00PIA500YP74CTjf");

// To remove <p> from long description
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

    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [quizPassed, setQuizPassed] = useState(false);

    const [userName, setUserName] = useState("User");
    const [attemptCount, setAttemptCount] = useState(0); // Track the number of attempts
    const [hasPassed, setHasPassed] = useState(false);
    const [quizAttemptsFetched, setQuizAttemptsFetched] = useState(false);
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

                    // First check LocalStorage
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

                    if (userID) {
                        try {
                            const response = await axios.post(`http://localhost:5000/getUserById/${userID}`);
                            
                            if (response.data) {
                                //setUserName(response.data.firstName || "User");
                                const { firstName, lastName } = response.data;
                                setUserName(`${firstName} ${lastName}`.trim() || "User");
                            } else {
                                console.error("No user data received");
                            }
                        } catch (error) {
                            console.error("Error fetching user data:", error);
                        }
                    }

                    if (enrollmentResponse.ok) {
                        const enrollmentData = await enrollmentResponse.json();
                        if (enrollmentData.enrolled) {
                            setEnrolled(true);
                        }
                    }
                }
                setLoading(false);
                setQuizAttemptsFetched(true);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    const token = localStorage.getItem("token");
    let userID = "";

    if (token) {
        const decodedToken = jwtDecode(token);
        userID = decodedToken.userId;
    }

    useEffect(() => {
        if (showPaymentForm && !clientSecret) {
            fetch("http://localhost:5000/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: course?.price, userId: userID }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.clientSecret) {
                        setClientSecret(data.clientSecret);
                    } else {
                        setError("Failed to load payment details. Please try again.");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching clientSecret:", error);
                    setError("An error occurred while processing payment.");
                });
        }
    }, [showPaymentForm, clientSecret, course]);

    const handleEnrollment = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setLoginModalShow(true);
            return;
        }

        let userID;
        try {
            const decodedToken = jwtDecode(token);  // Decode the token to extract information
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
            setShowPaymentForm(true)
        }
    };

    const handleAttendQuiz = () => {
        setShowQuiz(true);
    };

    const handleQuizCompletion = (isPassed) => {
        if (isPassed) {
            setQuizPassed(true);
        }
    };

    useEffect(()=>{
        const fetchQuizAttempts = async () => {
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
            try {
              setLoading(true);
              const response = await axios.get(`http://localhost:5000/getusers-quiz-results?userId=${userID}&courseId=${courseId}`, {
                headers: {
                  Authorization: `Bearer ${token}` // Include token in request header
                }
              });
              if (response.data) {
                const quizResult = response.data;
                if(quizResult.message != "No quiz results found for this user and course"){
                    setAttemptCount(quizResult.attempts.length); // Set the number of attempts from the backend
                    setQuizPassed(quizResult.attempts.some(attempt => attempt.status === 'passed')); // Check if any attempt passed
                }
                else{
                    setAttemptCount(0)
                    setQuizPassed(false)
                }
              } else {
                setError('Invalid data received from server');
              }
            } catch (err) {
              setError('Error fetching quiz results');
              console.error(err);
            } finally {
              setLoading(false);
            }
          };
          if(userID){
            fetchQuizAttempts();
          }   
     },[userID,courseId,quizPassed])
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
                        <p className=''><strong>Duration:</strong> {course.duration}</p>
                        <p className=''><strong>Price:</strong> ${course.price}</p>
                        {!enrolled && !showPaymentForm && (
                            <button onClick={handleEnrollment} className="enroll-button">Enroll</button>
                        )}

                        {showPaymentForm && clientSecret && (
                            <Elements stripe={stripePromise} options={{ clientSecret }}>
                                <PaymentForm
                                    amount={course.price}
                                    userId={userID}
                                    courseId={courseId}
                                    setEnrolled={setEnrolled}
                                    setShowPaymentForm={setShowPaymentForm}
                                    setSuccessMessage={setSuccessMessage}
                                />
                            </Elements>
                        )}

                        <button onClick={() => window.history.back()} className="back-button">Back</button>
                        {successMessage && <p className="success-message">{successMessage}</p>}
                    </div>
                </div>
            </section>
            <section>

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
                    {
                        quizAttemptsFetched && (
                            attemptCount >= 5 && hasPassed ? (
                            <div className='text-center'><p>Already attended and passed the quiz. Download the certificate</p></div>
                            ) : attemptCount >= 5 && !hasPassed ? (
                            <div className='text-center'><p className='text-center mb-0'>Maximum Quiz attempt reached</p></div>
                            ) : (
                            <div className="text-center mt-5">
                                <button onClick={handleAttendQuiz} className="attend-quiz-button">Attend Quiz</button>
                            </div>
                            )
                        )
                        }
                </section>
            )}

            {showQuiz && <Quiz courseId={courseId} onQuizComplete={handleQuizCompletion} userName={userName} course={course}/>}


            {quizPassed && <Certificate userName={userName} courseName={course.title} quizPassed={quizPassed} />}


            {loginModalShow && (
                <LoginSignup show={loginModalShow} handleClose={() => setLoginModalShow(false)} />
            )}

            <Footer />
        </>
    );
};

export default CourseDetailsPage;
