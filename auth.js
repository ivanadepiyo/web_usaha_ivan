<!-- auth.js -->
<script>
function login(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then(() => window.location.href = "dashboard.html")
    .catch(err => alert(err.message));
}

function register(email, password) {
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert("Registrasi berhasil"))
    .catch(err => alert(err.message));
}

function logout() {
  auth.signOut().then(() => window.location.href = "login.html");
}

function resetPassword(email) {
  auth.sendPasswordResetEmail(email)
    .then(() => alert("Link reset terkirim"))
    .catch(err => alert(err.message));
}

auth.onAuthStateChanged(user => {
  if (!user && location.pathname.includes("dashboard")) {
    window.location.href = "login.html";
  }
});
</script>
