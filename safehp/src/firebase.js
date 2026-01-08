import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZy2XM_JIaIXVWMk8tlNmRiX3uBG_uVWU",
  authDomain: "safehp-51dd8.firebaseapp.com",
  projectId: "safehp-51dd8",
  storageBucket: "safehp-51dd8.firebasestorage.app",
  messagingSenderId: "736569048042",
  appId: "1:736569048042:web:43b2172d9e35c4e019d093"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);