import React from "react";
import { Container } from "react-bootstrap";
import "../CSS/Footer.css"; // Import custom CSS file for styling

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <p>&copy; 2024 Social Hub. All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;
