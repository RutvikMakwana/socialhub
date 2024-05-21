import React, { useEffect, useState, useCallback } from "react";
import { useFirebase } from "../Context/Firebase";
import PostCard from "../Components/PostCard";

const Posts = () => {
  const firebase = useFirebase();
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const postsData = await firebase.getPosts();
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  }, [firebase]);

  useEffect(() => {
    setIsLoggedIn(firebase.isLoggedIn);
    if (firebase.isLoggedIn) {
      fetchPosts();
    }
  }, [firebase, fetchPosts]);

  const handleDeletePost = async (postId) => {
    try {
      await firebase.deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error.message);
    }
  };

  return (
    <div className="container mt-5">
      {isLoggedIn && (
        <>
          <h1>All Posts</h1>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
          ))}
        </>
      )}
    </div>
  );
};

export default Posts;
