// VALIDASI PASSWORD
function validPassword(pw) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&]).{8,}$/.test(pw);
}

// REGISTER
function register() {
  if (!validPassword(password.value)) {
    msg.innerText = "❌ Password belum memenuhi syarat";
    return;
  }
  if (password.value !== confirm.value) {
    msg.innerText = "❌ Password tidak sama";
    return;
  }

  auth.createUserWithEmailAndPassword(email.value, password.value)
    .then((cred) => {
      return db.collection("users").doc(cred.user.uid).set({
        nama: nama.value,
        email: email.value,
        telp: telp.value,
        alamat: alamat.value,
        role: "user",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      msg.innerText = "✅ Akun berhasil dibuat, silakan login";
    })
    .catch(err => {
      msg.innerText = "❌ Email sudah terdaftar";
    });
}

// LOGIN USER
function login() {
  auth.signInWithEmailAndPassword(email.value, password.value)
    .then(() => location.href = "dashboard.html")
    .catch(() => msg.innerText = "❌ Email atau password salah");
}

// RESET PASSWORD
function resetPassword() {
  auth.sendPasswordResetEmail(email.value)
    .then(() => alert("📩 Link reset terkirim"))
    .catch(() => alert("❌ Email tidak ditemukan"));
}

// ADMIN LOGIN
function adminLogin() {
  if (email.value !== "admin@company.com") {
    msg.innerText = "❌ Bukan akun admin";
    return;
  }

  auth.signInWithEmailAndPassword(email.value, password.value)
    .then(() => location.href = "dashboard.html")
    .catch(() => msg.innerText = "❌ Password salah");
}

// AMBIL DATA DASHBOARD
auth.onAuthStateChanged(user => {
  if (user && location.pathname.includes("dashboard")) {
    db.collection("users").doc(user.uid).get()
      .then(doc => {
        if (doc.exists) {
          nama.innerText = doc.data().nama;
          email.innerText = doc.data().email;
          telp.innerText = doc.data().telp;
          alamat.innerText = doc.data().alamat;
        }
      });
  }
});

// LOGOUT
function logout() {
  auth.signOut().then(() => location.href = "login.html");
}
