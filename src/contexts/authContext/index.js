import React, { useContext, useState, useEffect } from "react";
import { auth } from "../../firebase/firebase";
import {  onAuthStateChanged } from "firebase/auth";
import api from "../../apiService";
import { doSignOut } from "../../firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    let isUserValid = false;
    if (user) {
      try {
        const idToken = await user.getIdToken();
        const gGLoginViewModel = { idToken };

        const response = await api.post(
          "/Authentication/gg/login-with-google",
          gGLoginViewModel
        );

        if (response.data) {
          const token = response.data.bear;
          localStorage.setItem("token", token);
          setCurrentUser(user); 
          setUserLoggedIn(true);
          isUserValid = true;
        } else {
          await doSignOut(); 
          setCurrentUser(null);
          setUserLoggedIn(false);
        }
      } catch (error) {
        await doSignOut(); 
        console.error("Lỗi xác thực API:", error);
        setCurrentUser(null);
        setUserLoggedIn(false);
      }
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
    return isUserValid;
  }

  const value = {
    userLoggedIn,
    isGoogleUser,
    currentUser,
    initializeUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}