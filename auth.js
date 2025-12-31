<script>
/* ================================================= */
/* ============== FIREBASE INIT ==================== */
/* ================================================= */
const auth = firebase.auth();
const db = firebase.firestore();

/* ================================================= */
/* ================= REGISTER ====================== */
/* ================================================= */
document.getElementById("registerBtn")?.addEventListener("click", async () => {
  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  const telp = document.getElementById("telp").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;
  const msg = document.getElementById("msg");

  msg.textContent = "";
  msg.style.color = "red";

  // Validasi input
  if (
    !nama || nama.length < 3 || nama.length > 50 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !telp || telp.length < 10 ||
    !alamat || alamat.length < 5 ||
    !/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}/.test(password) ||
    password !== confirm
  ) {
    msg.textContent = "Periksa semua field, pastikan benar!";
    return;
  }

  try {
    // Cek email sudah terdaftar
    const methods = await auth.fetchSignInMethodsForEmail(email);
    if (methods.length > 0) {
      msg.textContent = "Email sudah terdaftar!";
      return;
    }

    // Buat akun baru
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Simpan data tambahan ke Firestore
    await db.collection("users").doc(user.uid).set({
      nama,
      email,
      telp,
      alamat,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Kirim email verifikasi
    await user.sendEmailVerification();

    msg.style.color = "green";
    msg.textContent = "Akun berhasil dibuat! Silahkan cek email untuk verifikasi.";

    setTimeout(() => window.location.href = "login.html", 3000);

  } catch (err) {
    msg.textContent = "Gagal mendaftar: " + err.message;
  }
});

/* ================================================= */
/* ================= LOGIN ========================= */
/* ================================================= */
document.getElementById("loginBtn")?.addEventListener("click", async () => {
  const emailInput = document.getElementById("email").value.trim();
  const passwordInput = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  msg.textContent = "";

  if (!emailInput || !passwordInput) {
    msg.textContent = "Email dan password harus diisi!";
    return;
  }

  try {
    const userCredential = await auth.signInWithEmailAndPassword(emailInput, passwordInput);
    const user = userCredential.user;

    if (!user.emailVerified) {
      msg.textContent = "Silahkan verifikasi email terlebih dahulu!";
      await auth.signOut();
      return;
    }

    window.location.href = "dashboard.html";

  } catch (err) {
    msg.textContent = err.message;
  }
});

/* ================================================= */
/* ================= RESET PASSWORD ================= */
/* ================================================= */
function resetPassword() {
  const email = document.getElementById("email").value.trim();
  if(!email){
    alert("Masukkan email terlebih dahulu!");
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(() => alert("Link reset password terkirim!"))
    .catch(err => alert(err.message));
}

/* ================================================= */
/* ================= LOGOUT ========================= */
/* ================================================= */
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await auth.signOut();
  window.location.href = "login.html";
});

/* ================================================= */
/* ============ PROTEKSI DASHBOARD ================ */
/* ================================================= */
auth.onAuthStateChanged(async (user) => {
  if(location.pathname.includes("dashboard")) {

    if(!user){
      window.location.href = "login.html";
      return;
    }

    try {
      const doc = await db.collection("users").doc(user.uid).get();
      if(doc.exists){
        const data = doc.data();
        document.getElementById("userNama").textContent = data.nama || "-";
        document.getElementById("userEmail").textContent = data.email || "-";
        document.getElementById("userTelp").textContent = data.telp || "-";
        document.getElementById("userAlamat").textContent = data.alamat || "-";
      }
    } catch(err) {
      alert("Gagal mengambil data user: " + err.message);
    }
  }
});
</script>
