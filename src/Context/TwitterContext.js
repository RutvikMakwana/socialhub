// src/context/TwitterContext.js

import React, { createContext, useState, useContext } from "react";

const TwitterContext = createContext();

export const TwitterProvider = ({ children }) => {
  const [twitterTokens, setTwitterTokens] = useState(null);

  return (
    <TwitterContext.Provider value={{ twitterTokens, setTwitterTokens }}>
      {children}
    </TwitterContext.Provider>
  );
};

export const useTwitter = () => useContext(TwitterContext);
