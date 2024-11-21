import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";

export const doSignInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return user;
    // const it = await user.getIdToken();
    // const gGLoginViewModel={
    //   idToken: it  
    // }
    // const response = await api.post("/Authentication/gg/login-with-google",gGLoginViewModel);
    // if (response.data) {
    //   const token = response.data.bear;
    //   localStorage.setItem("token", token);
    //   return user;
    //   //window.location.reload();
    // } else {
    //   console.log("API không trả về token. Hủy đăng nhập.");
    //   await doSignOut();
    //   throw new Error("Người dùng không tồn tại.");
    // }
  } catch (error) {
    console.error("Lỗi khi đăng nhập với Google: ", error);
    await doSignOut();
    throw error;
  }
};

export const doSignOut = async () => {
  try {
    await auth.signOut(); 
    localStorage.removeItem("token"); 
    console.log("Đã đăng xuất và xóa token.");
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
  }
};