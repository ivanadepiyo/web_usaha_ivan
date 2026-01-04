<script>
/* ================================================= */
/* ============== FIREBASE INIT ==================== */
/* ================================================= */
const auth = firebase.auth();
const db = firebase.firestore();

/* ================================================= */
/* ================= REGISTER USER ================= */
/* ================================================= */
document.getElementById("btn")?.addEventListener("click", async () => {
  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  const telp = document.getElementById("telp").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;
  const msg = document.getElementById("msg");

  msg.textContent = "";
  msg.style.color = "red";

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
    const methods = await auth.fetchSignInMethodsForEmail(email);
    if (methods.length > 0) {
      msg.textContent = "Email sudah terdaftar!";
      return;
    }

    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    await db.collection("users").doc(user.uid).set({
      nama,
      email,
      telp,
      alamat,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    await user.sendEmailVerification({
      url: window.location.origin + '/login.html'
    });

    msg.style.color = "green";
    msg.textContent = "Akun berhasil dibuat! Silahkan cek email untuk verifikasi.";

    setTimeout(() => window.location.href = "login.html", 3000);

  } catch (err) {
    msg.textContent = "Gagal mendaftar: " + err.message;
  }
});

/* ================================================= */
/* ================= LOGIN USER ==================== */
/* ================================================= */
document.getElementById("loginBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  msg.textContent = "";

  if (!email || !password) {
    msg.textContent = "Email dan password harus diisi!";
    return;
  }

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
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
/* ================= LOGIN ADMIN =================== */
/* ================================================= */
document.getElementById("loginAdminBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  msg.textContent = "";

  if (!email || !password) {
    msg.textContent = "Email dan password harus diisi!";
    return;
  }

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    const adminDoc = await db.collection("admins").doc(user.uid).get();

    if (!adminDoc.exists) {
      await auth.signOut();
      msg.textContent = "Akses ditolak: bukan admin";
      return;
    }

    window.location.href = "dashboard-admin.html";

  } catch (err) {
    msg.textContent = err.message;
  }
});

/* ================================================= */
/* ================= RESET PASSWORD ================ */
/* ================================================= */
function resetPassword() {
  const email = document.getElementById("email")?.value.trim();
  if (!email) {
    alert("Masukkan email terlebih dahulu!");
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(() => alert("Link reset password terkirim!"))
    .catch(err => alert(err.message));
}

/* ================================================= */
/* ================= LOGOUT ======================== */
/* ================================================= */
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await auth.signOut();
  window.location.href = "login.html";
});

/* ================================================= */
/* ============ PROTEKSI DASHBOARD USER ============ */
/* ================================================= */
auth.onAuthStateChanged(async (user) => {

  /* ---- Dashboard USER ---- */
  if (location.pathname.includes("dashboard.html")) {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    const docUser = await db.collection("users").doc(user.uid).get();
    if (!docUser.exists) {
      await auth.signOut();
      window.location.href = "login.html";
      return;
    }

    const data = docUser.data();
    document.getElementById("userNama")?.textContent = data.nama || "-";
    document.getElementById("userEmail")?.textContent = data.email || "-";
    document.getElementById("userTelp")?.textContent = data.telp || "-";
    document.getElementById("userAlamat")?.textContent = data.alamat || "-";
  }

  /* ---- Dashboard ADMIN ---- */
  if (location.pathname.includes("dashboard-admin")) {
    if (!user) {
      window.location.href = "login-admin.html";
      return;
    }

    const adminDoc = await db.collection("admins").doc(user.uid).get();
    if (!adminDoc.exists) {
      await auth.signOut();
      window.location.href = "login-admin.html";
    }
  }
});
</script>
