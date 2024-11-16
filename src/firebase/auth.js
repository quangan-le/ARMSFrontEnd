import { auth } from "./firebase";
import api from "../apiService";
import {
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

export const doSignInWithGoogle = async (selectedCampus, loginWithCustomAuth) => {
  if (!selectedCampus) {
    throw new Error("selectedCampus is required");
  }
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  // const response = await api.post("/Authentication/login-by-email", {
  //   email: result.user.email,
  //   campusId: selectedCampus
  // });

  // if (!response.data.bear || !response.data.campusId || !response.data.role) {
  //   throw new Error(response.data.message);
  // } 
  // const token = response.data.bear;
  // localStorage.setItem('token', token);
  return user;
};

export const doSignOut = () => {
  return auth.signOut();
};