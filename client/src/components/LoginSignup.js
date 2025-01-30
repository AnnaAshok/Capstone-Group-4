import React, { useState } from 'react';
import '../index.css';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function LoginSignup() {
  const navigate = useNavigate()
  const [activeLogin, setActiveLogin] = useState(true)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmpassword,setConfirmPassword]= useState("")
  const [validate,setValidate] = useState(false)
  const [message, setMessage]= useState("")

  function SwitchContent() {
    setActiveLogin(!activeLogin)
    setMessage("")
    setValidate(false)
  }

  const handleSignup = (e) => {
    e.preventDefault();
    if((firstName && lastName && email && password && confirmpassword) !== "" && (password === confirmpassword)){
      setValidate(false)
      axios.post('http://localhost:5000/register', { firstName, lastName, email, password })
        .then(result => {
          setMessage(result.data)
        })
        .catch(err => console.log(err))
    }else{
      if(password !== confirmpassword){
        setMessage("Passwords must match")
      }else{
        setValidate(true)
      }
    }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if((email && password) !== ""){
      axios.post('http://localhost:5000/login', { email, password })
      .then(result => {
        navigate("/home")
      })
      .catch(err => console.log(err))
    }else{
        setValidate(true)
      
    }
  }
  return (
    <div className='container'>
      <div className={`content justify-content-center align-items-center d-flex shadow-lg ${activeLogin ? "" : "active"}`} id="content">
        {/*---------------------------- SIGNUP form ---------------------------------------*/}
        <div className='col-md-6 login-box'>
          <form onSubmit={handleSignup}>

            <div className='header-text mb-4'>
              <h1>Signup</h1>
            </div>
            <p className='text-danger'>{validate ? "Please fill the required fields": ""}</p>
            <p className={`${message == "Account created Successfully" ? "text-success": "text-danger"}`}>{message}</p>
            <div className='input-group mb-3'>
              <input type='text'
                placeholder='Enter Your Firstname'
                name='firstname'
                id='firstname'
                className='form-control bg-light'
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className='input-group mb-3'>
              <input type='text'
                placeholder='Enter Your Lastname'
                name='lastname'
                id='lastname'
                className='form-control bg-light'
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className='input-group mb-3'>
              <input type='email'
                placeholder='Enter Your Email'
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                className='form-control bg-light'
              />
            </div>
            <div className='input-group mb-3'>
              <input type='password'
                placeholder='Enter Your Password'
                name="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                className='form-control bg-light'
              />
            </div>
            <div className='input-group mb-3'>
              <input type='password'
                placeholder='Confirm Password'
                id='confirmpassword'
                name="confirmpassword"
                onChange={(e)=>setConfirmPassword(e.target.value)}
                className='form-control bg-light'
              />
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
            <p className='text-danger'>{validate ? "Please fill the required fields": ""}</p>

            <div className='input-group mb-3'>
              <input type='email'
                name="email"
                onChange={e => setEmail(e.target.value)}
                placeholder='Enter Your Email' className='form-control bg-light' />
            </div>
            <div className='input-group mb-3'>
              <input type='password'
                name="password"
                onChange={e => setPassword(e.target.value)}
                placeholder='Enter Your Password' className='form-control bg-light' />
            </div>
            <div className='input-group justify-content-end'>
              <div className='forgot'>
                <Link to="/forgotpassword">Forgot Password?</Link>
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
    </div>
  )
}
