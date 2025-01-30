import React, { useState } from 'react';
import './index.css';

export default function LoginSignup() {
 function SwitchContent(){
  const content = document.getElementById('content');
  const signupbtn = document.getElementById('signup');
    const loginbtn = document.getElementById('login');

    signupbtn.addEventListener('click', () =>{
      content.classList.add('active')
    });

    loginbtn.addEventListener('click', () =>{
      content.classList.remove('active')
    });
 }


  return (
     <div className='container'>
    <div className='content justify-content-center align-items-center d-flex shadow-lg' id='content'>
      {/*---------------------------- SIGNUP form ---------------------------------------*/}
      <div className='col-md-6 d-flex justify-content-center'>
        <form>
          <div className='header-text mb-4'>
          <h1>Signup</h1>
          </div>
          <div className='input-group mb-3'>
            <input type='text' placeholder='Enter Your Name' className='form-control form-control-lg bg-light'/>
          </div>
          <div className='input-group mb-3'>
            <input type='email' placeholder='Enter Your Email' className='form-control form-control-lg bg-light'/>
          </div>
          <div className='input-group mb-3'>
            <input type='password' placeholder='Enter Your Password' className='form-control form-control-lg bg-light'/>
          </div>
          <div className='input-group mb-3 justify-content-center'>
            <button className='butn border-white text-white w-50 fs-6'>Signup</button>
          </div>
        </form>
      </div>
      
      {/*---------------------------- Login form ---------------------------------------*/}
      <div className='col-md-6 login-box'>
        <form>
          <div className='header-text mb-4'>
          <h1>Login</h1>
          </div>
          <div className='input-group mb-3'>
            <input type='email' placeholder='Enter Your Email' className='form-control form-control-lg bg-light'/>
          </div>
          <div className='input-group mb-3'>
            <input type='password' placeholder='Enter Your Password' className='form-control form-control-lg bg-light'/>
          </div>
          <div className='input-group mb-5 justify-content-between'>
            <div className='check'>
              <input type='checkbox' className='form-check-input' id='remember-me'/>
              <label htmlFor='remember-me' className='form-check-label text-secondary'>Remember Me</label>
            </div>
            <div className='forgot'>
            <small><a href='#'>Forgot Password?</a></small>
          </div>
          </div>
          <div className='input-group mb-3 justify-content-center'>
            <button className='butn border-white text-white w-50 fs-6'>Login</button>
          </div>
        </form>
      </div>
      {/* --------------------switch panel--------------------------- */}
      <div className='switch-content'>
        <div className='switch'>
          <div className='switch-panel switch-left'>
            <h1>Hello, Again</h1>
            <p>We are happy to see you back</p>
            <button className='hidden btn border-white text-white w-50 fs-6' id='login' onClick={SwitchContent}>Login</button>
          </div>
          <div className='switch-panel switch-right'>
            <h1>Welcome</h1>
            <p>Join our platform</p>
            <button className='hidden btn border-white text-white w-50 fs-6' id='signup' onClick={SwitchContent}>Signup</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
