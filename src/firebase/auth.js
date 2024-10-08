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
  await api.post("/Authentication/google-login", null, {
    headers: {
      "Authorization": `Bearer ${idToken}`,
    },
  });
};

export const doSignOut = () => {
  return auth.signOut();
};