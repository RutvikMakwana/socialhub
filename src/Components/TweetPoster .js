import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useFirebase } from "../Context/Firebase";

const TweetPoster = () => {
  const firebase = useFirebase();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tweet, setTweet] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // You can add any initializations or side effects here
  }, []);

  const handleTwitterAuth = async () => {
    try {
      const twitterAccessToken = await firebase.signupWithTwitter();
      if (twitterAccessToken) {
        console.log("User authenticated with Twitter successfully");
        setIsLoggedIn(true);
      } else {
        console.error("Twitter authentication failed");
      }
    } catch (error) {
      console.error("Error during Twitter authentication:", error.message);
    }
  };

  const handlePostTweet = async () => {
    try {
      // Ensure user is logged in
      if (!isLoggedIn) {
        // Handle case where user is not logged in
        return;
      }

      setIsLoading(true);
      // Post tweet to Twitter using Firebase function
      const response = await firebase.postTweet(tweet);

      // Handle successful tweet posting
      console.log("Tweet posted successfully:", response);
      setSuccessMessage("Tweet posted successfully.");
      setTweet(""); // Clear tweet after posting
    } catch (error) {
      // Handle error while posting tweet
      console.error("Error posting tweet:", error.message);
      // Optionally, you can show an error message to the user or perform any other action
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!isLoggedIn && (
        <Button variant="primary" onClick={handleTwitterAuth}>
          Authenticate with Twitter
        </Button>
      )}
      {isLoggedIn && (
        <div>
          <Form>
            <Form.Group controlId="formTweet">
              <Form.Label>Enter your tweet:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={tweet}
                onChange={(e) => setTweet(e.target.value)}
                placeholder="What's on your mind?"
              />
            </Form.Group>
            <Button
              variant="success"
              onClick={handlePostTweet}
              disabled={!tweet.trim() || isLoading}
            >
              {isLoading ? "Posting..." : "Post Tweet"}
            </Button>
          </Form>
          {successMessage && (
            <p className="text-success mt-3">{successMessage}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TweetPoster;
