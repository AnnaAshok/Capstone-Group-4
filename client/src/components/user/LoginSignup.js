import React, { useEffect, useState } from 'react';
import '../../index.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from "react-bootstrap";
import Forgotpassword from '././Forgotpassword';


export default function LoginSignup({ show, handleClose,setModalShow }) {
  const navigate = useNavigate()
  const [activeLogin, setActiveLogin] = useState(true)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmpassword,setConfirmPassword]= useState("")
  const [message, setMessage]= useState("")
  const [errors, setErrors] = useState({});
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [loginModalShow, setLoginModalShow] = useState(false);


  function SwitchContent() {
    setActiveLogin(!activeLogin)
    setMessage("")
    setErrors({});
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }
  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateForm = () => {
    let errors = {};
    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";
    if (!email.trim()) errors.email = "Email is required";
    else if (!isValidEmail(email)) errors.email = "Invalid email format";

    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters";

    if (!confirmpassword) errors.confirmpassword = "Confirm password is required";
    else if (password !== confirmpassword) errors.confirmpassword = "Passwords must match";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
          const response = await axios.post('http://localhost:5005/register', { firstName, lastName, email, password })
          setMessage(response.data.message);
          if (response.status === 201) {
            // Clear form fields after successful signup
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

          }
        }catch (error) {
          setMessage(error.response?.data?.message || "An error occurred");
      }
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate input fields
    if (!email || !password) {
        setErrors({
            email: !email ? "Email is required" : "",
            password: !password ? "Password is required" : ""
        });
        return;
    }
    try {
        const response = await axios.post('http://localhost:5005/login', { email, password });
        if (response.data.message === "Success") {
          localStorage.setItem("token", response.data.token); // Store token
            handleClose();
            setLoginModalShow(false)

              // Redirect based on role
              if (response.data.user.role === "Admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } else {
            setErrors({ general: response.data.message });
        }
    } catch (error) {
        setErrors({ general: error.response?.data?.message ||"Something went wrong. Please try again later." });
    }
};

const handleForgotpassword = ()=>{
  handleClose();
  setShowForgotModal(true)
  setMessage("")
}
useEffect(()=>{
  if(!show){
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setMessage("")
    setActiveLogin(true)
    setErrors({});
  }
},[show])
  return (
    <>
      <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal">
      <Modal.Body>
      <div className={`content justify-content-center align-items-center d-flex shadow-lg ${activeLogin ? "" : "active"}`} id="content">
        {/*---------------------------- SIGNUP form ---------------------------------------*/}
        <div className='col-md-6 login-box'>
          <form onSubmit={handleSignup}>

            <div className='header-text mb-4'>
              <h1>Signup</h1>
            </div>
           {message && <p className={`${message == "Account created successfully" ? "text-success": "text-danger"}`}>{message}</p> } 
            <div className='input-group mb-3'>
              <input type='text'
                placeholder='Enter Your Firstname'
                name='firstname'
                id='firstname'
                className='form-control bg-light'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && <p className="text-danger small m-0 w-100">{errors.firstName}</p>}

            </div>
            <div className='input-group mb-3'>
              <input type='text'
                placeholder='Enter Your Lastname'
                name='lastname'
                id='lastname'
                className='form-control bg-light'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && <p className="text-danger small m-0 w-100">{errors.lastName}</p>}
            </div>
            <div className='input-group mb-3'>
              <input type='email'
                placeholder='Enter Your Email'
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='form-control bg-light'
              />
              {errors.email && <p className="text-danger small m-0 w-100">{errors.email}</p>}
            </div>
            <div className='input-group mb-3'>
              <input type='password'
                placeholder='Enter Your Password'
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='form-control bg-light'
              />
              {errors.password && <p className="text-danger small m-0 w-100">{errors.password}</p>}
            </div>
            <div className='input-group mb-3'>
              <input type='password'
                placeholder='Confirm Password'
                id='confirmpassword'
                name="confirmpassword"
                value={confirmpassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                className='form-control bg-light'
              />
              {errors.confirmpassword && <p className="text-danger small m-0 w-100">{errors.confirmpassword}</p>}
            </div>
            <div className='input-group mb-3 justify-content-center'>
              <input className='butn fs-6 custombtn' type='submit' value="Register" />
            </div>
          </form>
        </div>

        {/*---------------------------- Login form ---------------------------------------*/}
        <div className='col-md-6 login-box'>
          <form onSubmit={handleLogin}>
            <div className='header-text mb-4'>
              <h1>Login</h1>
            </div>
            {errors.general && <p className="text-danger small w-100">{errors.general}</p>}

            <div className='input-group mb-3'>
              <input type='email'
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder='Enter Your Email' className='form-control bg-light' />
                {errors.email && <p className="text-danger small m-0 w-100">{errors.email}</p>}
            </div>
            <div className='input-group mb-3'>
              <input type='password'
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Enter Your Password' className='form-control bg-light' />
                {errors.password && <p className="text-danger small m-0 w-100">{errors.password}</p>}
            </div>
            <div className='input-group justify-content-end'>
              <div className='forgot'>
                <p onClick={handleForgotpassword} className='link-custom'>Forgot Password?</p>
              </div>
            </div>
            <div className='input-group mb-3 justify-content-center'>
              <input className='butn fs-6 custombtn' value="Login" type='submit' />
            </div>
          </form>
        </div>
        {/* --------------------switch panel--------------------------- */}
        <div className='switch-content'>
          <div className='switch'>
            <div className='switch-panel switch-left'>
              <h1>Hello, Again</h1>
              <p>We are happy to see you back</p>
              <button className='hidden btn w-50 fs-6' id='login' onClick={SwitchContent}>Login</button>
            </div>
            <div className='switch-panel switch-right'>
              <h1>Welcome</h1>
              <p>Join our platform</p>
              <button className='hidden btn w-50 fs-6' id='signup' onClick={SwitchContent}>Signup</button>
            </div>
          </div>
        </div>
      </div>
      </Modal.Body>
      </Modal>
      <Forgotpassword 
        show={showForgotModal} 
        handleClose={() => setShowForgotModal(false)} 
        setModalShow={setModalShow}
      />
      </>
        )
}
