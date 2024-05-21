import React from "react";
import { Card, Button } from "react-bootstrap";

const PostCard = ({ post, onDelete }) => {
  const { caption, mediaURL, platform, id } = post;

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <Card className="shadow-sm mb-4">
      {mediaURL && <Card.Img variant="top" src={mediaURL} />}
      <Card.Body>
        <Card.Title>{caption}</Card.Title>
        <Card.Text>Platform: {platform}</Card.Text>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Card.Body>
    </Card>
  );
};

export default PostCard;
