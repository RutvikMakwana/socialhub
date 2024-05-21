import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useFirebase } from "../Context/Firebase";
import "../CSS/NavigationBar.css"; // Import custom CSS file for styling

const NavigationBar = () => {
  const { isLoggedIn, logoutUser } = useFirebase();
  const location = useLocation();

  const renderAuthButtons = () => {
    if (isLoggedIn) {
      return (
        <>
          <Nav className="me-3">
            <Nav.Link as={Link} to="/dashboard" className={location.pathname === "/dashboard" ? "nav-link active" : "nav-link"}>
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/posts" className={location.pathname === "/posts" ? "nav-link active" : "nav-link"}>
              Posts
            </Nav.Link>
          </Nav>
          <Button variant="outline-light" onClick={handleLogout}>
            Logout
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button
            as={Link}
            to="/register"
            variant="outline-light"
            className="me-2"
          >
            Sign Up
          </Button>
          <Button
            as={Link}
            to="/login"
            variant="outline-light"
            className="me-2"
          >
            Login
          </Button>
        </>
      );
    }
  };

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <Navbar bg="dark" variant="dark" className="py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          SocialHub
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/" className={location.pathname === "/" ? "nav-link active" : "nav-link"}>
            Home
          </Nav.Link>
          {renderAuthButtons()}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
