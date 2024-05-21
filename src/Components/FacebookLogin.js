import React, { useState, useEffect } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useFirebase } from "../Context/Firebase";

function FacebookLogin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [caption, setCaption] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaFile, setMediaFile] = useState(null); // Define mediaFile state
  const [successMessage, setSuccessMessage] = useState("");
  const [pageAccessToken, setPageAccessToken] = useState("");
  const [instagramBusinessAccount, setInstagramBusinessAccount] = useState("");
  const [pageId, setPageId] = useState("");
  const [postToInstagram, setPostToInstagram] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Define isLoading state
  const firebase = useFirebase();

  useEffect(() => {
    loadFacebookSDK();
  }, []);

  const loadFacebookSDK = () => {
    // Load Facebook SDK
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: "1444714743106812",
        autoLogAppEvents: true,
        xfbml: true,
        version: "v13.0",
      });
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  };

  const handleFacebookLogin = () => {
    window.FB.login((response) => {
      if (response.authResponse) {
        setIsLoggedIn(true);
        fetchPageAccessToken();
      } else {
        console.log("User cancelled login or did not fully authorize.");
      }
    });
  };

  const fetchPageAccessToken = () => {
    // Fetch page access token
    window.FB.api("/me/accounts", async (response) => {
      if (response && !response.error) {
        const page = response.data[0];
        setPageAccessToken(page.access_token);
        setPageId(page.id);

        // Exchange short-lived token for long-lived token
        try {
          const longLivedToken = await exchangeShortLivedToken(page.access_token);
          setPageAccessToken(longLivedToken);
        } catch (error) {
          console.error('Error exchanging short-lived token for long-lived token:', error);
        }

        fetchInstagramBusinessAccount(page.id, page.access_token);
      }
    });
  };

  const exchangeShortLivedToken = async (shortLivedToken) => {
    // Exchange short-lived token for long-lived token
    const appId = "1444714743106812";
    const appSecret = "066f32d8ba5fd7c9cdcfd0352f9af5d7";
    const response = await axios.get(`https://graph.facebook.com/v13.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`);
    return response.data.access_token;
  };

  const fetchInstagramBusinessAccount = async (pageId, pageAccessToken) => {
    // Fetch Instagram Business Account
    try {
      const response = await axios.get(`https://graph.facebook.com/v19.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`);
      const igData = response.data;
      if (igData.instagram_business_account) {
        setInstagramBusinessAccount(igData.instagram_business_account.id);
      } else {
        console.error('Instagram Business Account not found for the Page.');
      }
    } catch (error) {
      console.error('Error fetching Instagram Business Account:', error);
    }
  };

  const handleMediaUrlChange = (e) => {
    setMediaUrl(e.target.value);
  };

  const handleMediaChange = (e) => {
    // Handle file upload and set mediaFile state
    setMediaFile(e.target.files[0]);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (postToInstagram) {
      await handleInstagramPost();
    } else {
      await handleFacebookPost();
    }
  };

  const handleFacebookPost = async () => {
    if (pageAccessToken && (caption.trim() !== "" || mediaFile)) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("access_token", pageAccessToken);
      formData.append("caption", caption);

      if (mediaFile) {
        formData.append("source", mediaFile);
      }

      try {
        const response = await axios.post(
          mediaFile && mediaFile.type.startsWith("video/")
            ? "https://graph.facebook.com/me/videos" // Endpoint for video posts
            : "https://graph.facebook.com/me/photos", // Endpoint for photo posts
          formData
        );
        console.log("Post was published successfully:", response.data);
        setCaption("");
        setMediaFile(null);
        setSuccessMessage("Post was published successfully.");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
        // Handle post submission to Firebase with platform information
        await firebase.handlePostSubmit({ caption, mediaFile, platform: 'Facebook' });
      } catch (error) {
        console.error("Error occurred while posting:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInstagramPost = async () => {
    if (instagramBusinessAccount && pageAccessToken && mediaUrl) {
      try {
        // Step 1: Create a media object container
        const mediaObjectResponse = await axios.post(
          `https://graph.facebook.com/v19.0/${instagramBusinessAccount}/media`,
          {
            image_url: mediaUrl,
            caption: caption,
            access_token: pageAccessToken,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        const creationId = mediaObjectResponse.data.id;

        // Step 2: Publish the media object container
        await axios.post(
          `https://graph.facebook.com/v19.0/${instagramBusinessAccount}/media_publish`,
          {
            creation_id: creationId,
            access_token: pageAccessToken,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        setSuccessMessage('Photo submitted to Instagram successfully!');
        setCaption('');
        setMediaUrl('');
        // Handle post submission to Firebase with platform information
        await firebase.handlePostSubmit({ caption, mediaUrl, platform: 'Instagram' });
      } catch (error) {
        console.error('Error publishing photo to Instagram:', error.response.data.error.message);
        // Log the entire error response for debugging
        console.error(error.response);
      }
    } else {
      console.error('Please enter a valid media URL and ensure you have a valid page access token.');
    }
  };

  return (
    <Container>
      <h1>Social Media Post</h1>
      {!isLoggedIn ? (
        <Button onClick={handleFacebookLogin}>Login with Facebook</Button>
      ) : (
        <Form onSubmit={handlePostSubmit}>
          <Form.Group controlId="caption">
            <Form.Label>Caption</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="mediaUrl">
            <Form.Label>Media URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter media URL"
              value={mediaUrl}
              onChange={handleMediaUrlChange}
            />
          </Form.Group>
          <Form.Group controlId="mediaFile">
            <Form.Label>Media File</Form.Label>
            <Form.Control
              type="file"
              onChange={handleMediaChange}
            />
          </Form.Group>
          <Form.Group controlId="postToInstagram">
            <Form.Check
              type="checkbox"
              label="Post to Instagram"
              checked={postToInstagram}
              onChange={(e) => setPostToInstagram(e.target.checked)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? "Posting..." : "Submit"}
          </Button>
          {successMessage && <p className="text-success">{successMessage}</p>}
        </Form>
      )}
    </Container>
  );
}

export default FacebookLogin;
