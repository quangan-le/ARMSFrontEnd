// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOqR5MHvqqhMznkBYDYmembPXfTc_uRaQ",
  authDomain: "armsfrontend.firebaseapp.com",
  projectId: "armsfrontend",
  storageBucket: "armsfrontend.appspot.com",
  messagingSenderId: "437176337523",
  appId: "1:437176337523:web:5b337315501522d4db5606",
  measurementId: "G-0TDYR9HLQJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth };
