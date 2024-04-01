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
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import "firebase/functions";

// Initialize Firebase app
const firebaseConfig = {
  apiKey: "AIzaSyCZ76l9JnwFxoBq9TI5sN8jiPe7aontV_c",
  authDomain: "socialconnect-9bdb9.firebaseapp.com",
  databaseURL: "https://socialconnect-9bdb9-default-rtdb.firebaseio.com",
  projectId: "socialconnect-9bdb9",
  storageBucket: "socialconnect-9bdb9.appspot.com",
  messagingSenderId: "371734982811",
  appId: "1:371734982811:web:c0134ab0093b9e7e1a163e",
  measurementId: "G-0TFBZBZ7P4",
};

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, setUser);
    return () => unsubscribe();
  }, []);

  const handleAuth = async (authFunction) => {
    try {
      const userCredential = await authFunction();
      setUser(userCredential.user);
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
      // Store user information including Twitter access token
      setUser({
        ...userCredential.user,
        accessToken: null, // Initialize with null value
      });
      await addUserToFirestore(userCredential.user, fullName, email);
      return userCredential.user;
    } catch (error) {
      console.error("Sign Up Error:", error.message);
      throw error;
    }
  };

  const addUserToFirestore = async (user, fullName, email) => {
    try {
      await addDoc(collection(firestore, "Users"), {
        userName: fullName,
        userEmail: email,
        userId: user.uid,
      });
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
