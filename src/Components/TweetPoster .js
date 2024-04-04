import React, { useEffect, useState } from "react";
import { useFirebase } from "../Context/Firebase";

const TweetPoster = () => {
  const { isLoggedIn, user, signupWithTwitter, postTweet, logoutUser } =
    useFirebase();
  const [isTwitterAuthenticated, setIsTwitterAuthenticated] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user && user.twitterAuthenticated) {
      setIsTwitterAuthenticated(true);
      console.log("User is logged in and authenticated with Twitter");
    } else {
      setIsTwitterAuthenticated(false);
      console.log("User is logged in but not authenticated with Twitter");
    }
  }, [isLoggedIn, user]);

  const handleTwitterAuthentication = async () => {
    try {
      await signupWithTwitter();
      console.log("Authenticated with Twitter successfully");
      setIsTwitterAuthenticated(true);
    } catch (error) {
      console.error("Error authenticating with Twitter:", error.message);
    }
  };

  const handlePostTweet = async () => {
    try {
      const tweet = "Hello from react...";
      const response = await postTweet(tweet);
      if (response.success) {
        console.log("Tweet posted successfully. Tweet ID:", response.tweetId);
      } else {
        console.error("Failed to post tweet:", response.error);
      }
    } catch (error) {
      console.error("Error posting tweet:", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsTwitterAuthenticated(false);
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <p>User is logged in!</p>
          {isTwitterAuthenticated ? (
            <>
              <p>User is authenticated with Twitter</p>
              <button onClick={handlePostTweet}>Post Tweet</button>
            </>
          ) : (
            <button onClick={handleTwitterAuthentication}>
              Authenticate with Twitter
            </button>
          )}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <p>User is not logged in!</p>
      )}
    </div>
  );
};

export default TweetPoster;
