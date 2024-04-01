import React from "react"; // { useEffect, useState, useCallback }
// import { useFirebase } from "../Context/Firebase";
// import PostCard from "../Components/PostCard";

const Home = () => {
  // const firebase = useFirebase();
  // const [posts, setPosts] = useState([]);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const fetchPosts = useCallback(async () => {
  //   try {
  //     const postsData = await firebase.getPosts();
  //     setPosts(postsData);
  //   } catch (error) {
  //     console.error("Error fetching posts:", error.message);
  //   }
  // }, [firebase]);

  // useEffect(() => {
  //   setIsLoggedIn(firebase.isLoggedIn);
  //   if (firebase.isLoggedIn) {
  //     fetchPosts();
  //   }
  // }, [firebase, fetchPosts]);

  return (
    //   <div className="container mt-5">
    //     {isLoggedIn && (
    //       <>
    //         <h1>All Posts</h1>
    //         {posts.map((post) => (
    //           <PostCard key={post.id} {...post} />
    //         ))}
    //       </>
    //     )}
    //   </div>
    <h1>This is home page</h1>
  );
};

export default Home;
