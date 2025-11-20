import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA3EJVSp87OpN6uo4aWvvOod4jtblEBJSY",
  authDomain: "tripp-6cf34.firebaseapp.com",
  projectId: "tripp-6cf34",
  storageBucket: "tripp-6cf34.firebasestorage.app",
  messagingSenderId: "757927349560",
  appId: "1:757927349560:web:05b5e79dfe646f0220c5cd"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
