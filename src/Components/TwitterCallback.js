// src/components/TwitterCallback.js

import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTwitter } from '../Context/TwitterContext';

const TwitterCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setTwitterTokens } = useTwitter();

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(location.search);
      const oauth_token = params.get('oauth_token');
      const oauth_verifier = params.get('oauth_verifier');

      try {
        const response = await axios.post('http://localhost:5000/twitter/access-token', {
          oauth_token,
          oauth_verifier,
        });
        const { oauth_access_token, oauth_access_token_secret } = response.data;
        setTwitterTokens({ oauth_access_token, oauth_access_token_secret });
        navigate('/tweet');
      } catch (error) {
        console.error('Error getting access token:', error);
      }
    };

    fetchData();
  }, [location.search, navigate, setTwitterTokens]);

  return <div>Processing Twitter authentication...</div>;
};

export default TwitterCallback;
