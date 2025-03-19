import React, { useState, useEffect } from "react";
import "../../profile.css";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import defaultUser from "../../Assets/images/user.png";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("userInfo");
  const [image, setImage] = useState(null);
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
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null); // Store user data
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const [userId, setUserId] = useState(null); 

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setEmail(decodedToken.email);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  const fetchUserDetails = async () => {
    try {
        const response = await axios.post(
            "http://localhost:5000/user/details", // API endpoint
            { email }, // Send email in request body
            {
                headers: {
                    "Authorization": `Bearer ${token}`, // Send token in Authorization header
                    "Content-Type": "application/json"
                }
            }
        );
        setUser(response.data);
        setUserId(response.data._id); // Store the user ID from the response
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setPhone(response.data.phone);
        setAddress(response.data.address);
        setDob(response.data.dob);
        setImage(response.data.image);
    } catch (err) {
        setError(err.response?.data?.message || "An error occurred while fetching user details.");
    }
};
  useEffect(()=>{
    if(email) fetchUserDetails();

  },[email])

  const updateUserDetails = async () => {
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
          setErrorMessage("Passwords do not match.");
          return;
      }
  }
    let imageUrl = image; // Default to existing image
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "eduSphere"); // Cloudinary upload preset
  
      try {
        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dnmqu8v7b/image/upload",
          formData
        );
        imageUrl = cloudinaryResponse.data.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
        return;
      }
    }
    try {
      const updateData = {
        firstName,
        lastName,
        phone,
        address,
        dob,
    };
    // Include password only if it's provided
    if (newPassword) {
        updateData.password = newPassword;
    }
    if(image){
      updateData.image = imageUrl
    }
    const response = await axios.post(
        `http://localhost:5000/user/update/${userId}`,
        updateData,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
        alert("User details updated successfully!");
    } catch (err) {
        setErrorMessage(err.response?.data?.message || "Error updating details.");
    }
};

  return (
    <>
      <Header />
      <div className="profile-page">
        <div className="profile-left">
          <div className="profile-image">
            <img src={image ? image : defaultUser} alt="Profile" />
            </div>
          <div className="profile-details">
            <h5>{user?.firstName} {user?.lastName}</h5>
            <h5>{email}</h5>
            <p>{user?.phone ? user?.phone : ""}</p>
            <p>{user?.address ? user?.address : ""}</p>
            <p>{user?.dob ? user?.dob : ""}</p>
          </div>
        </div>

        <div className="profile-right">
          <div className="tabs">
            <button className={activeTab === "userInfo" ? "active" : ""} onClick={() => setActiveTab("userInfo")}>User Information</button>
            <button className={activeTab === "passwordUpdate" ? "active" : ""} onClick={() => setActiveTab("passwordUpdate")}>Change Password</button>
            <button className={activeTab === "courseInfo" ? "active" : ""} onClick={() => setActiveTab("courseInfo")}>Course Information</button>
          </div>

          {activeTab === "userInfo" && (
            <div className="user-info">
              <label>First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <label>Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <label>Email</label>
              <input type="email" value={email} disabled />
              <label>Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <label>Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
              <label>Date of Birth</label>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              <label>Profile picture</label>
              <input type="file" id="image" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
              <button className="update-button" onClick={updateUserDetails}>Update</button>
            </div>
          )}

          {activeTab === "passwordUpdate" && (
            <div className="password-update">
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <label>New Password</label>
              <div className="password-input-container">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                />
                <button onClick={() => setShowNewPassword(!showNewPassword)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    {showNewPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                    )}
                  </svg>
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
                <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
              </div>

              <button onClick={updateUserDetails} className="update-button">Update Password</button>
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
