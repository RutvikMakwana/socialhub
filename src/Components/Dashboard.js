import React from "react";
import '../CSS/Dashboard.css'; 
import FacebookLogin from "./FacebookLogin";
// import TwitterPost from "./TwitterPost";
const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <header>
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard</p>
      </header>
      <main>
        <section className="social-media-registration">
          <h2>Register Social Media Accounts</h2>
          <FacebookLogin />
          {/* <TwitterPost/> */}

        </section>
        <section className="dashboard-features">
          <h2>Dashboard Features</h2>
          <div className="feature">
            <i className="fas fa-chart-line"></i>
            <h3>Analytics</h3>
            <p>Track your social media performance.</p>
          </div>
          <div className="feature">
            <i className="fas fa-calendar-alt"></i>
            <h3>Scheduler</h3>
            <p>Schedule your social media posts.</p>
          </div>
          <div className="feature">
            <i className="fas fa-users"></i>
            <h3>Engagement</h3>
            <p>Interact with your audience.</p>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2024 Your App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
