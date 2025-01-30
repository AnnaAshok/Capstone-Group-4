import React from 'react'
import Navbar from './Navbar'
import "../index.css";

const Header = () => {
  return (
   <section className='header'>
      <section className='head-top'>
      <section className='head-top_logo'>
    <a href="#" className='header-logo'>LOGO</a>
   </section>
   <section className='head-top_navbar'>
    <section className='head-top_navigation'>
         <Navbar/>
    </section>
    <hr className='head-top_seperator'/>
    </section>
   
    </section>

    <section className='head-bottom'>
    <section className='head-bottom_phone'>
    1234567890
    </section>
    <section className='head-bottom_email'>
    edusphere@gmail.com
    </section>
    </section>
   </section>
  )
}

export default Header
