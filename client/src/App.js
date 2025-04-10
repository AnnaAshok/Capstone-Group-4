import './App.css';
import{BrowserRouter, Routes, Route} from 'react-router-dom'
import React, { useState, useEffect } from "react";
import axios from 'axios';

import LoginSignup from './components/user/LoginSignup';
import Forgotpassword from './components/user/Forgotpassword';
import Home from './components/user/Home'
import CoursePage  from './components/user/CoursePage';
import CustomTable from './components/admin/CustomTable';
import AdminRoutes from './components/admin/AdminRoutes';
import Profile from './components/user/profile';
import CourseDetailsPage from './components/user/CourseDetailsPage';
import ContactUs from './components/user/ContactUs';
import Quiz from './components/user/Quiz';
import AboutUs from './components/user/AboutUs.js';


import ProceedToPay from './components/user/ProceedToPay.js';


function App() {

  // const [clientSecret, setClientSecret] = useState("");

  // useEffect(() => {
  //   const fetchClientSecret = async () => {
  //     try {
  //       const { data } = await axios.post("http://localhost:5000/create-payment-intent", {
  //         amount: 100,  // Amount in cents
  //         currency: "usd",  // Currency code
  //       });
  //       console.log(data);
  //       setClientSecret(data.clientSecret); // Set clientSecret from backend
  //     } catch (error) {
  //       console.error("Error fetching client secret:", error);
  //     }
  //   };

  //   fetchClientSecret();
  // }, []);
  return (
    <div className='App'>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginSignup/>}></Route>
        <Route path='/forgotpassword' element={<Forgotpassword />}></Route>
        <Route path='/' element={<Home />}></Route>
        <Route path='/tables' element={<CustomTable />}></Route>
        
        <Route path="/courses" element={<CoursePage />}></Route>
        <Route path="/courses/:courseId" element={<CourseDetailsPage />}></Route>
        <Route path="/contactUs" element={<ContactUs />}></Route>

        <Route path="/aboutUs" element={<AboutUs />}></Route>
        
        {/* Admin routes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
        {/* <Route path="/admin/*" element={<ProtectedRoute element={<AdminRoutes />} />}></Route> */}

        <Route path="/profile" element={<Profile />}></Route>
        {/* Quiz route */}
        <Route path='/quiz' element={<Quiz />} />
        <Route path='/checkout' element={<ProceedToPay />} />

      </Routes>
    </BrowserRouter>

    </div>
 
  );
}

export default App;

