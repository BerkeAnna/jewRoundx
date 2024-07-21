// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD78rL33Yj8KMw5GHrJoH18zFBi-YQ0MYM",
  authDomain: "jewrx-aef33.firebaseapp.com",
  projectId: "jewrx-aef33",
  storageBucket: "jewrx-aef33.appspot.com",
  messagingSenderId: "300292849201",
  appId: "1:300292849201:web:01504ccea6ffde963adf10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);