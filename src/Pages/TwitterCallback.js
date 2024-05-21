// src/Pages/TwitterCallback.js

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TwitterCallback = ({ setTwitterTokens }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(location.search);
      const oauth_token = params.get("oauth_token");
      const oauth_verifier = params.get("oauth_verifier");

      try {
        const response = await axios.post("http://localhost:5000/twitter/access-token", {
          oauth_token,
          oauth_verifier,
        });
        setTwitterTokens(response.data);
        navigate("/tweet");
      } catch (error) {
        console.error("Error getting access token:", error);
      }
    };

    fetchData();
  }, [location.search, navigate, setTwitterTokens]);

  return <div>Processing Twitter authentication...</div>;
};

export default TwitterCallback;
