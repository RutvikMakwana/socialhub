import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useFirebase } from "../Context/Firebase";

const NavigationBar = () => {
  const { isLoggedIn, logoutUser } = useFirebase();

  const renderAuthButtons = () => {
    if (isLoggedIn) {
      return (
        <>
          <Nav className="me-3">
            <Nav.Link as={Link} to="/dashboard">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/posts">
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
    <Navbar bg="dark" expand="lg" variant="dark" className="py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          SocialHub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {renderAuthButtons()}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
