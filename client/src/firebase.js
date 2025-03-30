// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "hrs-estate.firebaseapp.com",
  projectId: "hrs-estate",
  storageBucket: "hrs-estate.appspot.com",
  messagingSenderId: "501550565061",
  appId: "1:501550565061:web:ed2ec814087156d92b52ac"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);