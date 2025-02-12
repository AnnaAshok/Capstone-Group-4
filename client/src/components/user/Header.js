import React,{useState} from "react";
import { Navbar, Nav, Container, Form, Button } from "react-bootstrap";
import "../../index.css";
import logoimage from "../../Assets/images/Edu_Logo.png";
import { useNavigate } from "react-router-dom";
import LoginSignup from "././LoginSignup";

const Header = () => {
  const loggedIn = localStorage.getItem("token")
  const navigate = useNavigate()
  const [modalShow, setModalShow] = useState(false);

  const handleLogout=() =>{
    localStorage.clear();
    navigate(0); 
  }

  return (
    <header>
      {/* Contact Info & Login/Signup Section */}
      <div
        className="header-top d-flex justify-content-between align-items-center"
        style={{
          backgroundColor: "#0f3460",
          color: "white",
          padding: "10px 20px",
          marginBottom: "0", // Remove space between header-top and navbar
        }}
      >
      

        <div className="contact-info d-flex align-items-center gap-3">
          <p className="contact-link mb-0">
            <i className="fa-solid fa-phone-volume"></i> 123-456-7890
          </p>
          <p className="contact-link mb-0">
            <i className="fa-solid fa-envelope"></i> edusphere@gmail.com
          </p>
        </div>

        <div className="login_signup d-flex align-items-center gap-3">
          {!loggedIn ? <p className="login-signup-link" onClick={() => setModalShow(true)}>
            <i className="fa-solid fa-sign-in-alt"></i> Login/Signup
          </p>: 
           <p className="logout-link" onClick={handleLogout}>
            <i className="fa-solid fa-sign-out"></i> Logout
          </p>}
        </div>
      </div>

      {/* Navigation Bar */}
      <Navbar
        expand="lg"
        style={{
          // backgroundColor: "#e6e9ec", // Grey background
          marginTop: "0", // Remove space between header-top and navbar
          paddingTop: "0", 
        }}
      >
        <Container
          fluid
          className="d-flex align-items-center"
          style={{
            padding: "10px 20px",
          }}
        >
          {/* Logo & Name Section */}
          <div className="d-flex align-items-center">
            <Navbar.Brand href="/" className="d-flex align-items-center">
              <img
                src={logoimage}
                alt="EduSphere Logo"
                style={{ width: "100px", height: "auto" }}
              />
              <h3 className="mb-0">
                <span
                  style={{
                    color: "#0f3460",
                    fontWeight: "bold",
                    fontFamily: "RobotoThin",
                  }}
                >
                  Edu
                </span>
                <span
                  style={{
                    color: "#f7c221",
                    fontWeight: "bold",
                    fontFamily: "RobotoThin",
                  }}
                >
                  Sphere
                </span>
              </h3>
            </Navbar.Brand>

            {/* Search Bar */}
            <Form className="d-flex ms-5">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
              />
              <Button
                style={{
                  border: "2px solid #f7c221",
                  color: "#f7c221",
                  fontWeight: "bold",
                  backgroundColor: "transparent",
                }}
              >
                Search
              </Button>
            </Form>
          </div>

          <Navbar.Toggle aria-controls="navbarScroll" className="ms-auto" />
          <Navbar.Collapse id="navbarScroll" className="justify-content-end">
            {/* Navbar Links (Right-Aligned) */}
            <Nav className="ms-auto">
              <Nav.Link
                href="/"
                style={{ color: "#0F3460", fontWeight: "bold" }}
              >
                Home
              </Nav.Link>
              <Nav.Link
                href="/courses"
                style={{ color: "#0F3460", fontWeight: "bold" }}
              >
                Courses
              </Nav.Link>
              <Nav.Link
                href="/about"
                style={{ color: "#0F3460", fontWeight: "bold" }}
              >
                About Us
              </Nav.Link>
              <Nav.Link
                href="/contact"
                style={{ color: "#0F3460", fontWeight: "bold" }}
              >
                Contact Us
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <LoginSignup show={modalShow} handleClose={() => setModalShow(false)} setModalShow={setModalShow}/>
    </header>
  );
};

export default Header;
