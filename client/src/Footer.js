import React from "react";
import "./index.css";

const Footer = () => {
  return (
    <section className="footer">
          <hr className="foot-seperator" />
      {/* Floating Box */}
      <div className="floating-box">
        <p className="text-lg font-medium">Let’s talk about the courses</p>
        <button className="contact-btn">Contact us</button>
      </div>

    

      {/* Footer Main Section */}
      <section className="footer-container">
        <section className="footer-info">
          {/* Left Section */}
          <div className="footer-info-left">
            <div className="footer-info__logo">Logo</div>
          </div>

          {/* Center Section */}
          <div className="footer-info-center">
            <a href="#" className="footer-info__course">
              Course
            </a>
            <br />
            <a href="#" className="footer-info__about">
              About us
            </a>
            <br />
            <a href="#" className="footer-info__contact">
              Contact us
            </a>
          </div>

          {/* Right Section */}
          <div className="footer-info-right">
            <div className="footer-info__email">edusphere@gmail.com</div>
            <div className="footer-info__number">1234567890</div>
            <div className="footer-info__address">abc</div>
          </div>
        </section>
      </section>

      <hr className="foot-seperator" />
      <div className="footer-info__copyright">@copyright</div>
    </section>
  );
};

export default Footer;

