import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import api from "../apiService";
import { auth } from "./firebase";

export const doSignInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const user = result.user;
    const it = await user.getIdToken();
    const gGLoginViewModel={
      idToken: it  
    }
    const response = await api.post("/Authentication/gg/login-with-google",gGLoginViewModel);
    if (response.data) {
      const token = response.data.Bear;
      localStorage.setItem("token", token);
      window.location.reload();
    } else {
      console.error("API không trả về token. Hủy đăng nhập.");
      await doSignOut();
    }
  } catch (error) {
    console.error("Lỗi khi đăng nhập với Google: ", error);
    await doSignOut();
  }
};

export const doSignOut = () => {
  return auth.signOut();
};