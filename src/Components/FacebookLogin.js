import React, { useState, useEffect, useCallback } from "react";
import { Button, Container, Form, Row, Col, Card } from "react-bootstrap";
import { useFirebase } from "../Context/Firebase";
import axios from "axios";

function FacebookLogin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [pageAccessToken, setPageAccessToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const firebase = useFirebase();

  const fetchUserPosts = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://graph.facebook.com/v19.0/me/posts",
        {
          params: {
            access_token: pageAccessToken,
            fields: "id,message,attachments",
          },
        }
      );
      console.log("Response Data:", response.data);
      setPosts(response.data.data);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  }, [pageAccessToken]);

  useEffect(() => {
    const loadFacebookSDK = () => {
      window.fbAsyncInit = () => {
        window.FB.init({
          appId: 937588387831796,
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

    loadFacebookSDK();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserPosts();
    }
  }, [isLoggedIn, fetchUserPosts]);

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
    window.FB.api("/me/accounts", (response) => {
      if (response && !response.error) {
        const page = response.data[0];
        setPageAccessToken(page.access_token);
      }
    });
  };

  const handleMediaChange = (e) => {
    setMediaFile(e.target.files[0]);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (pageAccessToken && (caption.trim() !== "" || mediaFile)) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("access_token", pageAccessToken);
      formData.append("caption", caption);
      formData.append("source", mediaFile);

      try {
        const response = await axios.post(
          mediaFile.type.startsWith("video/")
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
        await firebase.handlePostSubmit(caption, mediaFile);
        // Refresh posts after successful submission
        fetchUserPosts();
      } catch (error) {
        console.error("Error occurred while posting:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await axios.delete(
        `https://graph.facebook.com/${postId}`,
        {
          params: {
            access_token: pageAccessToken,
          },
        }
      );
      console.log("Post deleted successfully:", response.data);

      // Delete post from Firebase
      await firebase.deletePost(postId);

      // Refresh posts after deletion
      fetchUserPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleLogout = () => {
    window.FB.logout(() => {
      setIsLoggedIn(false);
      setPosts([]); // Clear posts when logging out
    });
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="text-center mb-4">
            <h2>Facebook Login</h2>
            {!isLoggedIn && (
              <Button onClick={handleFacebookLogin} variant="primary">
                Login with Facebook
              </Button>
            )}
          </div>
          {isLoggedIn && (
            <div>
              <Button onClick={handleLogout} variant="danger">
                Logout
              </Button>
              <Form onSubmit={handlePostSubmit} className="mt-4">
                <Form.Group controlId="caption">
                  <Form.Label>Post Text</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Enter your post text"
                  />
                </Form.Group>
                <Form.Group controlId="mediaFile">
                  <Form.Label>Upload Photo or Video</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*, video/*"
                    onChange={handleMediaChange}
                  />
                </Form.Group>
                <Button type="submit" variant="success">
                  Post
                </Button>
              </Form>
              {isLoading && (
                <div className="text-center mt-4">
                  <img
                    src="./loading.gif"
                    alt="Posting..."
                    style={{ width: "50px" }}
                  />
                </div>
              )}
              {successMessage && (
                <p className="text-center mt-4 text-success">
                  {successMessage}
                </p>
              )}
              <div className="mt-4">
                <h3>Your Posts</h3>
                {posts.map((post) => (
                  <Card key={post.id} className="my-3">
                    <Card.Body>
                      <Card.Text>{post.message}</Card.Text>
                      {post.attachments &&
                        post.attachments.data &&
                        post.attachments.data.length > 0 && (
                          <Card.Img
                            src={post.attachments.data[0].media.image.src}
                            alt="Post Media"
                            style={{ maxWidth: "100%" }}
                          />
                        )}
                      <div className="mt-3">
                        <Button
                          onClick={() => deletePost(post.id)}
                          variant="info"
                          className="mr-2"
                        >
                          Update
                        </Button>
                        <Button
                          onClick={() => deletePost(post.id)}
                          variant="danger"
                        >
                          Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default FacebookLogin;
