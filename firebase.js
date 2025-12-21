const firebaseConfig = {
  apiKey: "AIzaSyBjDHapatmMS4C2EDFXxp_WQXVhb0UCZZg",
  authDomain: "web-usaha-ivan.firebaseapp.com",
  projectId: "web-usaha-ivan",
  storageBucket: "web-usaha-ivan.appspot.com",
  messagingSenderId: "588839561784",
  appId: "1:588839561784:web:4accd7d9316a5a0ec5d4cd"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
