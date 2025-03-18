import React, { useState, useEffect } from "react";
import "../../profile.css";
import Header from "./Header";
import Footer from "./Footer";
import defaultUser from "../../Assets/images/user.png";
import { jwtDecode } from "jwt-decode";
<<<<<<< HEAD
import axios from 'axios';
=======
>>>>>>> e5a72646935e9bfb2c28f6e3912ac87ec1b6b184

const Profile = () => {
  const [activeTab, setActiveTab] = useState("userInfo");
  const [userImage, setUserImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
<<<<<<< HEAD
  const [message, setMessage] = useState("");
  const [courseInfo, setCourseInfo] = useState({
    courseName: "",
    courseCode: "",
    startDate: "",
    endDate: ""
  });
=======
  const [courses, setCourses] = useState([]);
>>>>>>> e5a72646935e9bfb2c28f6e3912ac87ec1b6b184

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setFirstName(decodedToken.firstName);
        setLastName(decodedToken.lastName);
        setEmail(decodedToken.email);
        setPhone(decodedToken.phone || "");
        setAddress(decodedToken.address || "");
        setDob(decodedToken.dob || "");
<<<<<<< HEAD
        // Fetch course information here, if needed (mocked data for now)
        setCourseInfo({
          courseName: decodedToken.courseName || "Introduction to Web Development",
          courseCode: decodedToken.courseCode || "WEB101",
          startDate: decodedToken.startDate || "2025-01-01",
          endDate: decodedToken.endDate || "2025-04-01"
        });
=======
        setCourses(decodedToken.courses || []);
>>>>>>> e5a72646935e9bfb2c28f6e3912ac87ec1b6b184
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

<<<<<<< HEAD
  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5005/updatepassword",
        { newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage("Error updating password");
    }
  };

=======
>>>>>>> e5a72646935e9bfb2c28f6e3912ac87ec1b6b184
  return (
    <>
      <Header />
      <div className="profile-page">
        <div className="profile-left">
          <div
            className="profile-image"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <img src={userImage || defaultUser} alt="Profile" />
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={(e) =>
                setUserImage(URL.createObjectURL(e.target.files[0]))
              }
              style={{ display: "none" }}
            />
          </div>
          <div className="profile-details">
            <h5>
              {firstName} {lastName}
            </h5>
            <h5>{email}</h5>
            <p>{phone}</p>
            <p>{address}</p>
            <p>{dob}</p>
          </div>
        </div>

        <div className="profile-right">
          <div className="tabs">
            <button
              className={activeTab === "userInfo" ? "active" : ""}
              onClick={() => setActiveTab("userInfo")}
            >
              User Information
            </button>
            <button
              className={activeTab === "passwordUpdate" ? "active" : ""}
              onClick={() => setActiveTab("passwordUpdate")}
            >
              Change Password
            </button>
            <button
              className={activeTab === "courseInfo" ? "active" : ""}
              onClick={() => setActiveTab("courseInfo")}
            >
              Course Information
            </button>
          </div>

          {activeTab === "userInfo" && (
            <div className="user-info">
              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <label>Email</label>
              <input type="email" value={email} disabled />
              <label>Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <label>Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <label>Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              <button className="update-button">Update</button>
            </div>
          )}
<<<<<<< HEAD

=======
>>>>>>> e5a72646935e9bfb2c28f6e3912ac87ec1b6b184
          {activeTab === "passwordUpdate" && (
            <div className="password-update">
              <label>New Password</label>
              <div className="password-input-container">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                />
                <button onClick={() => setShowNewPassword(!showNewPassword)}>
<<<<<<< HEAD
                  {showNewPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    </svg>
                  )}
                </button>
              </div>
=======
                  Show
                </button>
              </div>

>>>>>>> e5a72646935e9bfb2c28f6e3912ac87ec1b6b184
              <label>Confirm Password</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                />
<<<<<<< HEAD
                <button onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    </svg>
                  )}
                </button>
              </div>
              <button className="update-button" onClick={updatePassword}>
                Update Password
              </button>
              {message && <p className="message">{message}</p>}
=======
                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  Show
                </button>
              </div>

              <button className="update-button">Update Password</button>
>>>>>>> e5a72646935e9bfb2c28f6e3912ac87ec1b6b184
            </div>
          )}

          {activeTab === "courseInfo" && (
            <div className="course-info">
<<<<<<< HEAD
              <h3>Course Information</h3>
              <label>Course Name</label>
              <input type="text" value={courseInfo.courseName} disabled />
              <label>Course Code</label>
              <input type="text" value={courseInfo.courseCode} disabled />
              <label>Start Date</label>
              <input type="date" value={courseInfo.startDate} disabled />
              <label>End Date</label>
              <input type="date" value={courseInfo.endDate} disabled />
=======
              <h3>Enrolled Courses</h3>
              <ul>
                {courses.length > 0 ? (
                  courses.map((course, index) => <li key={index}>{course}</li>)
                ) : (
                  <p>No courses enrolled.</p>
                )}
              </ul>
>>>>>>> e5a72646935e9bfb2c28f6e3912ac87ec1b6b184
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
