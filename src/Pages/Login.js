import React, { useState, useEffect } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useFirebase } from "../Context/Firebase";
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";

const Login = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (firebase.isLoggedIn) {
      navigate("/dashboard");
    }
  }, [firebase, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await firebase.signInUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Error signing in:", error.message);
    }
  };

  const handleFacebookLogin = async (e) => {
    e.preventDefault();
    try {
      await firebase.signupWithFacebook();
    } catch (error) {
      console.error("Error signing in with Facebook:", error.message);
    }
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      await firebase.signupWithGoogle();
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };

  const handleTwitterLogin = async (e) => {
    e.preventDefault();
    try {
      await firebase.signupWithTwitter();
    } catch (error) {
      console.error("Error signing in with Twitter:", error);
    }
  };

  return (
    <section className="vh-100 gradient-custom">
      <Container fluid className="py-5 h-100">
        <Row className="justify-content-center align-items-center h-100">
          <Col md={6}>
            <div className="card bg-dark text-white rounded-3">
              <div className="card-body p-5">
                <h2 className="fw-bold mb-4 text-center">Login</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit" size="lg">
                      Login
                    </Button>
                  </div>
                </Form>
                <div className="text-center mt-4">
                  <p className="text-white mb-0">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="fw-bold text-decoration-none"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-white mb-0">Or continue with:</p>
                  <div className="social-media-auth-buttons mt-3">
                    <Button
                      onClick={handleGoogleLogin}
                      className="google-auth-button"
                      variant="outline-danger"
                    >
                      <FaGoogle size={25} /> Sign in with Google
                    </Button>
                    <Button
                      onClick={handleFacebookLogin}
                      className="facebook-auth-button"
                      variant="outline-primary"
                    >
                      <FaFacebook size={27} /> Sign in with Facebook
                    </Button>
                    <Button
                      onClick={handleTwitterLogin}
                      className="twitter-auth-button"
                      variant="outline-info"
                    >
                      <FaTwitter size={27} /> Sign in with Twitter
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
