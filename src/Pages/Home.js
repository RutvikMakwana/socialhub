import React from "react"; // { useEffect, useState, useCallback }
import '../CSS/Homepage.css'
// import { useFirebase } from "../Context/Firebase";
// import PostCard from "../Components/PostCard";

const Home = () => {
  // const firebase = useFirebase();
  // const [posts, setPosts] = useState([]);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const fetchPosts = useCallback(async () => {
  //   try {
  //     const postsData = await firebase.getPosts();
  //     setPosts(postsData);
  //   } catch (error) {
  //     console.error("Error fetching posts:", error.message);
  //   }
  // }, [firebase]);

  // useEffect(() => {
  //   setIsLoggedIn(firebase.isLoggedIn);
  //   if (firebase.isLoggedIn) {
  //     fetchPosts();
  //   }
  // }, [firebase, fetchPosts]);

  return (
    //   <div className="container mt-5">
    //     {isLoggedIn && (
    //       <>
    //         <h1>All Posts</h1>
    //         {posts.map((post) => (
    //           <PostCard key={post.id} {...post} />
    //         ))}
    //       </>
    //     )}
    //   </div>
    // <h1>This is home page</h1>
    <div className="homepage-container">
    <header>
      <h1>Welcome to Social Hub!</h1>
      <p>Where Social Media Management Made Easy</p>
    </header>
    <main>
      <section className="features">
      <h2 className="features-heading">Key Features</h2>
        <div className="feature">
          <img src="https://www.secureauth.com/wp-content/uploads/2022/05/types-of-authentications.jpeg" alt="User Authentication" />
          <h3>User Authentication</h3>
          <p>Securely log in to access your dashboard.</p>
        </div>
        <div className="feature">
          <img src="https://via.placeholder.com/150" alt="Dashboard Analytics" />
          <h3>Dashboard Analytics</h3>
          <p>Track your social media performance with insightful analytics.</p>
        </div>
        <div className="feature">
          <img src="https://static.vecteezy.com/system/resources/previews/000/407/000/original/illustration-of-social-media-concept-vector.jpg" alt="Social Media Integration" />
          <h3>Social Media Integration</h3>
          <p>Connect and manage multiple social media accounts in one place.</p>
        </div>
      </section>
      <section className="call-to-action">
        <h2>Get Started</h2>
        <p>Sign up now to streamline your social media management!</p>
        <button className="btn-signup">Sign Up</button>
      </section>
    </main>
    <footer>
      <p>&copy; 2024 Social Hub. All rights reserved.</p>
    </footer>
  </div>
  );

};

export default Home;
