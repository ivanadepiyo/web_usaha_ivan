<script>

<!-- ================================================= -->
<!-- ============== FIREBASE INIT ==================== -->
<!-- ================================================= -->
/* Inisialisasi Auth & Firestore */
const auth = firebase.auth();
const db = firebase.firestore();


<!-- ================================================= -->
<!-- =================== LOGIN ======================= -->
<!-- ================================================= -->
/* Proses login user */
document.getElementById("loginBtn")?.addEventListener("click", async () => {

  /* Ambil input email & password */
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    /* Login menggunakan Firebase Auth */
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    /* Cek apakah email sudah diverifikasi */
    if (!user.emailVerified) {
      alert("Silahkan verifikasi email dulu!");
      await auth.signOut();
      return;
    }

    /* Login berhasil → masuk dashboard */
    window.location.href = "dashboard.html";

  } catch (err) {
    /* Tampilkan error login */
    alert(err.message);
  }
});


<!-- ================================================= -->
<!-- ================= REGISTER ====================== -->
<!-- ================================================= -->
/* Proses pendaftaran user */
document.getElementById("registerBtn")?.addEventListener("click", async () => {

  /* Ambil semua input register */
  const nama = document.getElementById("nama").value;
  const email = document.getElementById("email").value;
  const telp = document.getElementById("telp").value;
  const alamat = document.getElementById("alamat").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;
  const msg = document.getElementById("msg");

  /* Reset pesan */
  msg.textContent = "";
  msg.style.color = "red";

  /* Validasi semua field */
  if (
    !nama || nama.length > 15 ||
    !/^[\w.+-]+@gmail\.com$/.test(email) ||
    !telp || !alamat ||
    !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9!@#$%^&*]).{8,}$/.test(password) ||
    !/^[A-Z]/.test(password) ||
    password !== confirm
  ) {
    msg.textContent = "Periksa semua field, pastikan benar!";
    return;
  }

  try {
    /* Cek apakah email sudah terdaftar */
    const methods = await auth.fetchSignInMethodsForEmail(email);
    if (methods.length > 0) {
      msg.textContent = "Email sudah terdaftar!";
      return;
    }

    /* Buat akun baru */
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    /* Simpan data tambahan ke Firestore */
    await db.collection("users").doc(user.uid).set({
      nama,
      email,
      telp,
      alamat,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    /* Kirim email verifikasi */
    await user.sendEmailVerification();

    /* Pesan sukses */
    msg.style.color = "green";
    msg.textContent = "Akun berhasil dibuat! Silahkan cek email untuk verifikasi.";

    /* Redirect ke login */
    setTimeout(() => window.location.href = "login.html", 3000);

  } catch (err) {
    msg.textContent = "Gagal mendaftar: " + err.message;
  }
});


<!-- ================================================= -->
<!-- ============== RESET PASSWORD =================== -->
<!-- ================================================= -->
/* Kirim email reset password */
function resetPassword(email) {
  auth.sendPasswordResetEmail(email)
    .then(() => alert("Link reset password terkirim"))
    .catch(err => alert(err.message));
}


<!-- ================================================= -->
<!-- =================== LOGOUT ====================== -->
<!-- ================================================= -->
/* Logout user */
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await auth.signOut();
  window.location.href = "login.html";
});


<!-- ================================================= -->
<!-- ============ PROTEKSI DASHBOARD ================ -->
<!-- ================================================= -->
/* Cek status login saat halaman dibuka */
auth.onAuthStateChanged(async (user) => {

  /* Hanya berlaku di halaman dashboard */
  if (location.pathname.includes("dashboard")) {

    /* Jika belum login → kembali ke login */
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    /* Ambil data user dari Firestore */
    try {
      const doc = await db.collection("users").doc(user.uid).get();

      if (doc.exists) {
        const data = doc.data();

        /* Tampilkan data user ke dashboard */
        document.getElementById("userNama").textContent = data.nama || "-";
        document.getElementById("userEmail").textContent = data.email || "-";
        document.getElementById("userTelp").textContent = data.telp || "-";
        document.getElementById("userAlamat").textContent = data.alamat || "-";
      }

    } catch (err) {
      alert("Gagal mengambil data user: " + err.message);
    }
  }
});

</script>
