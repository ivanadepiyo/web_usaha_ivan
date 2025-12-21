// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjDHapatmMS4C2EDFXxp_WQXVhb0UCZZg",
  authDomain: "web-usaha-ivan.firebaseapp.com",
  projectId: "web-usaha-ivan",
  storageBucket: "web-usaha-ivan.appspot.com",
  messagingSenderId: "588839561784",
  appId: "1:588839561784:web:4accd7d9316a5a0ec5d4cd"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
