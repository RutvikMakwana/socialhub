import React, { useState } from 'react';
import axios from 'axios';
import { useTwitter } from '../Context/TwitterContext';
import { useFirebase } from '../Context/Firebase';
import '../CSS/Tweet.css'

const Tweet = () => {
  const [status, setStatus] = useState('');
  const [media, setMedia] = useState(null);
  const [error, setError] = useState(null);
  const { twitterTokens } = useTwitter();
  const { handlePostSubmit } = useFirebase();

  const handlePostTweet = async () => {
    try {
      const formData = new FormData();
      formData.append('text', status);
      if (media) {
        formData.append('media', media);
      }
      formData.append('oauth_access_token', twitterTokens.oauth_access_token);
      formData.append('oauth_access_token_secret', twitterTokens.oauth_access_token_secret);

      const response = await axios.post('http://localhost:5000/twitter/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      await handlePostSubmit({
        caption: status,
        mediaFile: media,
        mediaUrl: response.data.mediaUrl, // Assuming there's a mediaUrl property in the response
        platform: 'twitter', 
      });

      console.log('Tweet posted:', response.data);
      setError(null);
      setStatus(''); // Clear status after posting
      setMedia(null); // Clear media after posting
    } catch (error) {
      console.error('Error posting tweet:', error.response?.data || error.message);
      setError(error.response?.data || error.message);
    }
  };

  return (
    <div className="tweet-container">
      <h1>Post a Tweet</h1>
      <textarea
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        placeholder="What's happening?"
        className="tweet-textarea"
      />
      <input type="file" onChange={(e) => setMedia(e.target.files[0])} className="tweet-file-input" />
      <button onClick={handlePostTweet} className="tweet-button">Tweet</button>
      {error && <p style={{ color: 'red' }}>Error: {error.error || error}</p>}
    </div>
  );
};

export default Tweet;
