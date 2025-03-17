import React, { useState, useEffect } from "react";
import "../../profile.css";
import Header from "./Header";
import Footer from "./Footer";
import defaultUser from "../../Assets/images/user.png";
import { jwtDecode } from "jwt-decode";

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
  const [courses, setCourses] = useState([]);

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
        setCourses(decodedToken.courses || []);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

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
                  Show
                </button>
              </div>

              <label>Confirm Password</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                />
                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  Show
                </button>
              </div>

              <button className="update-button">Update Password</button>
            </div>
          )}

          {activeTab === "courseInfo" && (
            <div className="course-info">
              <h3>Enrolled Courses</h3>
              <ul>
                {courses.length > 0 ? (
                  courses.map((course, index) => <li key={index}>{course}</li>)
                ) : (
                  <p>No courses enrolled.</p>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
