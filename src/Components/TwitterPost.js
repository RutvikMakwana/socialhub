// src/Components/TwitterPost.js
import React, { useState, useEffect } from "react";
import { useFirebase } from "../Context/Firebase";
import axios from "axios";

const TwitterPost = () => {
  const { twitterAuth, postTweet } = useFirebase();
  const [oauthAccessToken, setOauthAccessToken] = useState(null);
  const [oauthAccessTokenSecret, setOauthAccessTokenSecret] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthToken = urlParams.get("oauth_token");
    const oauthVerifier = urlParams.get("oauth_verifier");

    if (oauthToken && oauthVerifier) {
      axios
        .get(`http://localhost:5000/twitter/callback?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`)
        .then((response) => {
          setOauthAccessToken(response.data.oauthAccessToken);
          setOauthAccessTokenSecret(response.data.oauthAccessTokenSecret);
        })
        .catch((error) => console.error("Callback Error:", error));
    }
  }, []);

  const handlePost = async () => {
    if (oauthAccessToken && oauthAccessTokenSecret) {
      try {
        const tweet = await postTweet(oauthAccessToken, oauthAccessTokenSecret, status);
        console.log("Tweet posted:", tweet);
      } catch (error) {
        console.error("Error posting tweet:", error);
      }
    } else {
      console.error("OAuth tokens are not available.");
    }
  };

  return (
    <div>
      <button onClick={twitterAuth}>Authenticate with Twitter</button>
      <textarea value={status} onChange={(e) => setStatus(e.target.value)} placeholder="What's happening?" />
      <button onClick={handlePost}>Tweet</button>
    </div>
  );
};

export default TwitterPost;
