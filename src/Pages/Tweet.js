// src/Pages/Tweet.js

import React, { useState } from "react";
import axios from "axios";
import { useTwitter } from "../Context/TwitterContext";

const Tweet = () => {
  const [status, setStatus] = useState("");
  const { twitterTokens } = useTwitter();

  const handlePostTweet = async () => {
    const bearerToken = "AAAAAAAAAAAAAAAAAAAAABwBtAEAAAAAPeFcxom4Pzl6UYKNn29iPg3UR1E%3DJqSwDZLkT9sbjlxEXaKDOPsNg2XPzxLuMrTRIbRhVhFN8mCxEv";
  
    try {
      const response = await axios.post("http://localhost:5000/twitter/post", {
        status,
        bearerToken
      });
      console.log("Tweet posted:", response.data);
    } catch (error) {
      console.error("Error posting tweet:", error);
    }
  };
  

  return (
    <div>
      <h1>Post a Tweet</h1>
      <textarea
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        placeholder="What's happening?"
      />
      <button onClick={handlePostTweet}>Tweet</button>
    </div>
  );
};

export default Tweet;
