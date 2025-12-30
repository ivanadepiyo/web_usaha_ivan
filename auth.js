<script>
const auth = firebase.auth();
const db = firebase.firestore();

// LOGIN
document.getElementById("loginBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (!user.emailVerified) {
      alert("Silahkan verifikasi email dulu!");
      await auth.signOut();
      return;
    }

    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
});

// REGISTER (jika register page pakai auth.js)
document.getElementById("registerBtn")?.addEventListener("click", async () => {
  const nama = document.getElementById("nama").value;
  const email = document.getElementById("email").value;
  const telp = document.getElementById("telp").value;
  const alamat = document.getElementById("alamat").value;
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;
  const msg = document.getElementById("msg");

  msg.textContent = "";
  msg.style.color = "red";

  // Validasi lengkap
  if (!nama || nama.length > 15 ||
      !/^[\w.+-]+@gmail\.com$/.test(email) ||
      !telp || !alamat ||
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9!@#$%^&*]).{8,}$/.test(password) ||
      !/^[A-Z]/.test(password) ||
      password !== confirm) {
    msg.textContent = "Periksa semua field, pastikan benar!";
    return;
  }

  try {
    // Cek email duplikat
    const methods = await auth.fetchSignInMethodsForEmail(email);
    if (methods.length > 0) {
      msg.textContent = "Email sudah terdaftar!";
      return;
    }

    // Buat akun
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Simpan data tambahan
    await db.collection("users").doc(user.uid).set({ nama, email, telp, alamat, createdAt: firebase.firestore.FieldValue.serverTimestamp() });

    // Kirim email verifikasi
    await user.sendEmailVerification();

    msg.style.color = "green";
    msg.textContent = "Akun berhasil dibuat! Silahkan cek email untuk verifikasi.";
    setTimeout(() => window.location.href = "login.html", 3000);

  } catch (err) {
    msg.textContent = "Gagal mendaftar: " + err.message;
  }
});

// RESET PASSWORD
function resetPassword(email) {
  auth.sendPasswordResetEmail(email)
    .then(() => alert("Link reset password terkirim"))
    .catch(err => alert(err.message));
}

// LOGOUT
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await auth.signOut();
  window.location.href = "login.html";
});

// PROTEKSI HALAMAN DASHBOARD
auth.onAuthStateChanged(async (user) => {
  if (location.pathname.includes("dashboard")) {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // Ambil data user untuk dashboard
    try {
      const doc = await db.collection("users").doc(user.uid).get();
      if (doc.exists) {
        const data = doc.data();
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
