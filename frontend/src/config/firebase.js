// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDpYD4eaFZUnjax2vWGO3ODSICV2jzA1Ts",
  authDomain: "scos-9ac26.firebaseapp.com",
  projectId: "scos-9ac26",
  storageBucket: "scos-9ac26.firebasestorage.app",
  messagingSenderId: "652261109470",
  appId: "1:652261109470:web:c6a3a9877fa077e65e9c4f",
  measurementId: "G-7ZTB1C0ZJN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
