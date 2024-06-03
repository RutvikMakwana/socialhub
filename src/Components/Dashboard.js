import React from "react";
import '../CSS/Dashboard.css'; 
import FacebookLogin from "./FacebookLogin";
import { useTwitter } from '../Context/TwitterContext';
import axios from 'axios';

const Dashboard = () => {
  const { setTwitterTokens, twitterTokens } = useTwitter();
    console.log('Dashboard - Twitter Tokens:', twitterTokens);
  
    const twitterAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/twitter/auth');
        const { oauthToken } = response.data;
        window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`;
      } catch (error) {
        console.error('Error during Twitter authentication:', error);
      }
    };
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
          <button onClick={twitterAuth}>Authenticate with Twitter</button>

        </section>
        {/* <section className="dashboard-features">
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
        </section> */}
      </main>
      <footer>
        <p>&copy; 2024 Your App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;











// import React from 'react';
// import axios from 'axios';
// import { useTwitter } from '../Context/TwitterContext';

// const Dashboard = () => {
//   const { setTwitterTokens, twitterTokens } = useTwitter();
//   console.log('Dashboard - Twitter Tokens:', twitterTokens);

//   const twitterAuth = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/twitter/auth');
//       const { oauthToken } = response.data;
//       window.location.href = `https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`;
//     } catch (error) {
//       console.error('Error during Twitter authentication:', error);
//     }
//   };

//   return (
//     <div className="dashboard-container">
//       <header>
//         <h1>Dashboard</h1>
//         <p>Welcome to your dashboard</p>
//       </header>
//       <main>
//         <section className="social-media-registration">
//           <h2>Register Social Media Accounts</h2>
//           <button onClick={twitterAuth}>Authenticate with Twitter</button>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;
