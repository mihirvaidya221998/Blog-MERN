// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "blog-mern-a6396.firebaseapp.com",
  projectId: "blog-mern-a6396",
  storageBucket: "blog-mern-a6396.appspot.com",
  messagingSenderId: "89274523811",
  appId: "1:89274523811:web:b19762cdf83dfb7e441f16"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);