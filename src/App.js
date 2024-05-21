import React from "react";
import { Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import NavigationBar from "./Components/NavigationBar";
import Dashboard from "./Components/Dashboard";
import Posts from "./Pages/Posts";
import TwitterCallback from "./Pages/TwitterCallback";
import Tweet from "./Pages/Tweet";
import { useTwitter } from "./Context/TwitterContext";

function App() {
  const { setTwitterTokens } = useTwitter();
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/posts" element={<Posts />} />
        <Route
          path="/twitter/callback"
          element={<TwitterCallback setTwitterTokens={setTwitterTokens} />}
        />
        <Route path="/tweet" element={<Tweet />} />
      </Routes>
    </>
  );
}

export default App;
