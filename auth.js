<script>
const auth = firebase.auth();

function login(email, password){
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential=>{
      if(!userCredential.user.emailVerified){
        alert("Silahkan verifikasi email dulu!");
        auth.signOut();
        return;
      }
      window.location.href = "dashboard.html";
    })
    .catch(err=>alert(err.message));
}

function logout(){
  auth.signOut().then(()=> window.location.href="login.html");
}

function resetPassword(email){
  auth.sendPasswordResetEmail(email)
    .then(()=> alert("Link reset password terkirim"))
    .catch(err=> alert(err.message));
}

// Proteksi halaman dashboard
auth.onAuthStateChanged(user=>{
  if(!user && location.pathname.includes("dashboard")){
    window.location.href="login.html";
  }
});
</script>
