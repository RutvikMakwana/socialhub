import React from "react";
import '../CSS/Homepage.css';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="homepage-container">
      <header>
        <h1>Welcome to Social Hub!</h1>
        <p>Where Social Media Management Made Easy</p>
      </header>
      <main>
        <section className="features">
          <h2 className="features-heading">Key Features</h2>
          <div className="feature">
            <img src="authentication-image-url" alt="User Authentication" />
            <h3>User Authentication</h3>
            <p>Securely log in to access your dashboard.</p>
          </div>
          <div className="feature">
            <img src="analytics-image-url" alt="Dashboard Analytics" />
            <h3>Dashboard Analytics</h3>
            <p>Track your social media performance with insightful analytics.</p>
          </div>
          <div className="feature">
            <img src="integration-image-url" alt="Social Media Integration" />
            <h3>Social Media Integration</h3>
            <p>Connect and manage multiple social media accounts in one place.</p>
          </div>
        </section>
        <section className="call-to-action">
          <h2>Get Started</h2>
          <p>Sign up now to streamline your social media management!</p>
          <Link to="/login" className="btn-signup">Sign Up</Link>
        </section>
      </main>
      <footer>
        <p>© 2024 Social Hub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
