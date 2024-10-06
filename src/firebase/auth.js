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

  console.log("Email:", user.email);
  console.log("Full Name:", user.displayName);
  console.log("ID Token:", idToken);
  
  const idToken = await user.getIdToken();
  await api.post("/Authentication/google-login", {
    email: user.email,
    fullName: user.displayName,
  }, {
    headers: {
      "Authorization": `Bearer ${idToken}`,
    },
  });
};

export const doSignOut = () => {
  return auth.signOut();
};