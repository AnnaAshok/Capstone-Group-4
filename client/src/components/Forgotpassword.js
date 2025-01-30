import React, { useState } from 'react'
import '../index.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Forgotpassword = () => {
const [email, setEmail] = useState('')
const navigate = useNavigate()
const [password, setPassword] = useState('')
const [ cpassword, setCpassword] = useState('')
const [activeLogin, setActiveLogin] = useState(true)
const [validate,setValidate] = useState("")

const handleUpdatePassword= (e)=>{
  e.preventDefault();
  axios.post('http://localhost:5000/resetpassword',{email,password})
  .then(result => {
    if(result.data == "Success"){
      console.log(result)
    }
  })
}

const handleCheckEmail= (e)=>{
  e.preventDefault();
  axios.post('http://localhost:5000/getEmail',{email})
  .then(result => {
    if(result.data == "Success"){
      setActiveLogin(false)
    }
  })
}

  return (
    <div className='container'>
    <div className={`content justify-content-center align-items-center d-flex shadow-lg ${activeLogin ? "" : "active"}`} id='content'>
    <div className='col-md-6 d-flex justify-content-center'>
    <form onSubmit={handleUpdatePassword}>
          <div className='header-text mb-4'>
            <h1>Reset Password</h1>
          </div>
          <div className='input-group mb-3'>
            <input type='email' 
            name="email"
            id="email"
            readOnly
            value={email}
            className='form-control bg-light'/>
          </div>
          <div className='input-group mb-3'>
            <input type='password' 
            name="password"
            id="password"
            onChange={e=>setPassword(e.target.value)}
            placeholder='New password' className='form-control  bg-light'/>
          </div>
          <div className='input-group mb-3'>
            <input type='password' 
            id="cpassword"
            name="cpassword"
            onChange={e=>setCpassword(e.target.value)}
            placeholder='Confirm password' className='form-control bg-light'/>
          </div>
          <div className='input-group mb-3 justify-content-center'>
            <input className='butn border-white text-white fs-6 custombtn' value="Reset Password" type='submit'/>
          </div>
        </form>
    </div>
      <div className='col-md-6 login-box'>
        <form onSubmit={handleCheckEmail}>
          <div className='header-text mb-4'>
          <h1>Find your email</h1>
          </div>
          <div className='input-group mb-3'>
            <input type='email' 
            name="email"
            onChange={e=>setEmail(e.target.value)}
            placeholder='Enter Your Email' className='form-control bg-light'/>
          </div>
          <div className='input-group justify-content-end'>
              <div className='forgot'>
                <Link to="/">Back to Login?</Link>
              </div>
            </div>
          <div className='input-group mb-3 justify-content-center'>
            <input className='butn fs-6 custombtn' value="Find Email" type='submit'/>
          </div>
        </form>
      </div>
      {/* --------------------switch panel--------------------------- */}
       {/* --------------------switch panel--------------------------- */}
       <div className='switch-content'>
          <div className='switch'>
            <div className='switch-panel switch-left'>
              <h1>Hello, Again</h1>
              <p>We are happy to see you back</p>
              {/* <button className='hidden btn border-white text-white w-50 fs-6' id='login' onClick={SwitchContent}>Login</button> */}
            </div>
            <div className='switch-panel switch-right'>
              <h1>Welcome</h1>
              <p>Join our platform</p>
              {/* <button className='hidden btn border-white text-white w-50 fs-6' id='signup' onClick={SwitchContent}>Signup</button> */}
            </div>
          </div>
        </div>
    </div>
  </div>
  )
}

export default Forgotpassword