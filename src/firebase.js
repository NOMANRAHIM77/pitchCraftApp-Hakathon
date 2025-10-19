// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD-0CgKIzMFiczBK6Z2SgwR1sKVszWtSXQ",
  authDomain: "hakathon-project-9a490.firebaseapp.com",
  projectId: "hakathon-project-9a490",
  storageBucket: "hakathon-project-9a490.appspot.com", // ✅ fixed here
  messagingSenderId: "510264156057",
  appId: "1:510264156057:web:ae5132a96a9167454e7d08"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);