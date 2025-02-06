import React from "react";
import { useSpring, animated } from "@react-spring/web";
import "../index.css";
import logoimage from "../Assets/Edu_Logo.png";

const Footer = () => {
  const animationProps = useSpring({
    opacity: 1,
    transform: "translateY(0px)",
    from: { opacity: 0, transform: "translateY(20px)" },
    config: { tension: 170, friction: 26 },
  });

  return (
    <>

      <nav className="navbar navbar-expand-lg navbar-light bg-light"></nav>
      <div className="footer">
      <animated.div style={animationProps} className="floating-box">
        <p className="text-lg font-medium">Let’s talk about the courses</p>
        <button className="contact-btn">Contact us</button>
      </animated.div>
        <div className="footer-container text-center">
          <div className="row">
            <div className="col-md-6 col-lg-5 col-12 footer-1">
              <h3>
                <img src={logoimage} className="navbar-brand" alt="Logo" />
                <span>Edu</span>Sphere
              </h3>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Tenetur eius architecto error incidunt quas est quos, suscipit
                iure in, doloribus autem recusandae libero nihil voluptate vel
                quidem modi nulla illo?
              </p>
              <div className="social-icons">
                <i className="fa-brands fa-facebook"></i>
                <i className="fa-brands fa-twitter"></i>
                <i className="fa-brands fa-instagram"></i>
                <i className="fa-brands fa-linkedin-in"></i>
              </div>
            </div>

            <div className="col-md-6 col-lg-3 col-12 footer-2">
              <h4>Quick Links</h4>
              <ul>
                <li className="nav-item">
                  <a className="" href="#">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="" href="#">
                    Courses
                  </a>
                </li>
                <li className="nav-item">
                  <a className="" href="#">
                    Contact Us
                  </a>
                </li>
                <li className="nav-item">
                  <a className="" href="#">
                    About Us
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-6 col-lg-4 col-12 footer-3">
              <h4>Contact Info</h4>
              <p>
                <i className="fa-solid fa-phone-volume"></i>1234567890
              </p>
              <p>
                <i className="fa-solid fa-envelope"></i>edusphere@gmail.com
              </p>
              <p>
                <i className="fa-solid fa-location-dot"></i>abcsfhj, Ontario
              </p>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>@copyright Group4</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
