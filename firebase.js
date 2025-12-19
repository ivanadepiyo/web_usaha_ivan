import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjDHapatmMS4C2EDFXxp_WQXVhb0UCZZg",
  authDomain: "web-usaha-ivan.firebaseapp.com",
  projectId: "web-usaha-ivan",
  storageBucket: "web-usaha-ivan.firebasestorage.app",
  messagingSenderId: "588839561784",
  appId: "1:588839561784:web:4accd7d9316a5a0ec5d4cd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
