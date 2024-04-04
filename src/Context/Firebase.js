import React, { createContext, useContext, useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  TwitterAuthProvider,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";

// Initialize Firebase app
const firebaseConfig = {
  apiKey: "AIzaSyDF0E2IMdxqPzAcsrrAfl1H7nRGubu7rYY",
  authDomain: "social-hub-29b50.firebaseapp.com",
  projectId: "social-hub-29b50",
  storageBucket: "social-hub-29b50.appspot.com",
  messagingSenderId: "411798135842",
  appId: "1:411798135842:web:d0aed75a23c7a33ae1967b",
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const firebaseFunctions = getFunctions();
const postTweetFunction = httpsCallable(firebaseFunctions, "postTweet");

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          await addUserToFirestore(firebaseUser);
        } else {
          setUser(null);
        }
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAuth = async (authFunction) => {
    try {
      const userCredential = await authFunction();
      return userCredential.user;
    } catch (error) {
      console.error("Authentication Error:", error.message);
      throw error;
    }
  };

  const signUpUserWithEmailAndPassword = async (email, password, fullName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: fullName });
      return userCredential.user;
    } catch (error) {
      console.error("Sign Up Error:", error.message);
      throw error;
    }
  };

  const addUserToFirestore = async (firebaseUser) => {
    try {
      const { uid, displayName, email } = firebaseUser;
      const userRef = doc(firestore, "users", uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          userName: displayName,
          userEmail: email,
        });
      }
    } catch (error) {
      console.error("Firestore Error:", error.message);
      throw error;
    }
  };

  const signInUserWithEmailAndPassword = async (email, password) =>
    handleAuth(() => signInWithEmailAndPassword(firebaseAuth, email, password));

  const logoutUser = async () => {
    try {
      await signOut(firebaseAuth);
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error.message);
      throw error;
    }
  };

  const signupWithFacebook = async () =>
    handleAuth(() => signInWithPopup(firebaseAuth, new FacebookAuthProvider()));

  const signupWithGoogle = async () =>
    handleAuth(() => signInWithPopup(firebaseAuth, new GoogleAuthProvider()));

  const signupWithTwitter = async () =>
    handleAuth(() => signInWithPopup(firebaseAuth, new TwitterAuthProvider()));

  const isLoggedIn = !!user;

  const handlePostSubmit = async (caption, mediaFile, mediaType) => {
    try {
      const mediaRef = ref(
        storage,
        `uploads/posts/${Date.now()}-${mediaFile.name}`
      );
      await uploadBytes(mediaRef, mediaFile);
      const mediaURL = await getDownloadURL(mediaRef);
      await addDoc(collection(firestore, "posts"), {
        userID: user.uid,
        caption,
        mediaURL,
        mediaType,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Post Upload Error:", error.message);
      throw error;
    }
  };

  const getPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "posts"));
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Get Posts Error:", error.message);
      throw error;
    }
  };

  const deletePost = async (postId) => {
    try {
      await deleteDoc(doc(firestore, "posts", postId));
      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Delete Post Error:", error.message);
      throw error;
    }
  };

  const getPostURL = async (path) => {
    try {
      return await getDownloadURL(ref(storage, path));
    } catch (error) {
      console.error("Error getting post URL:", error);
      throw error;
    }
  };

  const postTweet = async (tweet) => {
    try {
      const response = await postTweetFunction({ tweet });
      if (response.data.success) {
        console.log(
          "Tweet posted successfully with ID:",
          response.data.tweetId
        );
      } else {
        console.error("Error posting tweet:", response.data.error);
      }
    } catch (error) {
      console.error("Error calling postTweet function:", error);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        isLoggedIn,
        signInUserWithEmailAndPassword,
        signUpUserWithEmailAndPassword,
        logoutUser,
        signupWithFacebook,
        signupWithGoogle,
        signupWithTwitter,
        handlePostSubmit,
        getPosts,
        deletePost,
        getPostURL,
        postTweet,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};
