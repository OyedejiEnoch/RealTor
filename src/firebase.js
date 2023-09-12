// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8jjf3DqPLYYzLdP5YFvDGzmAnZCNcFZ0",
  authDomain: "realtor-eb5cc.firebaseapp.com",
  projectId: "realtor-eb5cc",
  storageBucket: "realtor-eb5cc.appspot.com",
  messagingSenderId: "982870996875",
  appId: "1:982870996875:web:2059bba646a8bf7997e18e",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
