import { signInWithEmailAndPassword } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth } from "./firebase.js";

function login() {
  const email = email.value;
  const password = password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      msg.innerText = "✅ Login berhasil";
      location.href = "dashboard.html";
    })
    .catch(() => {
      msg.innerText = "❌ Email atau password salah";
    });
}
