import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useFirebase } from "../Context/Firebase";

const PostCard = (props) => {
  const firebase = useFirebase();
  const [url, setURL] = useState(null);

  useEffect(() => {
    const fetchPostURL = async () => {
      try {
        const postURL = await firebase.getPostURL(props.mediaURL);
        if (postURL) {
          setURL(postURL);
        } else {
          console.error("Error: Post URL is undefined.");
        }
      } catch (error) {
        console.error("Error fetching post URL:", error);
        // Handle error, e.g., set a default URL
      }
    };

    fetchPostURL();
  }, [firebase, props.mediaURL]);

  return (
    <Card className="shadow-sm mb-4">
      <Card.Img variant="top" src={url} />
      <Card.Body>
        <Card.Title>{props.caption}</Card.Title>
        <Button variant="primary" className="mt-2">
          Read more
        </Button>
      </Card.Body>
    </Card>
  );
};

export default PostCard;
