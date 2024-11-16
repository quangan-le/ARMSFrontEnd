import { auth } from "./firebase";
import api from "../apiService";
import {
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);

  const user = result.user;
  const idToken = await user.getIdToken();
  const response = await api.post("/Authentication/login-by-email", {
    email: result.user.email,
    campusId: selectedCampus
  }, {
    headers: { Authorization: `Bearer ${idToken}` }
  });
  const token = response.data.Bear;
  localStorage.setItem('token', token);
  window.location.reload();

};

export const doSignOut = () => {
  return auth.signOut();
};