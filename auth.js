// auth.js
const namaInput = document.getElementById("nama");
const emailInput = document.getElementById("email");
const telpInput = document.getElementById("telp");
const alamatInput = document.getElementById("alamat");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirm");
const msg = document.getElementById("msg");
const registerBtn = document.getElementById("registerBtn");

// Fungsi indikator
function setCheck(element, condition) {
  element.className = condition ? "check green" : "check red";
}

// Validasi real-time
namaInput.addEventListener("input", ()=>setCheck(document.getElementById("namaCheck"), namaInput.value.length > 0 && namaInput.value.length <= 15));
emailInput.addEventListener("input", ()=>setCheck(document.getElementById("emailCheck"), /^[\w.+-]+@gmail\.com$/.test(emailInput.value)));
telpInput.addEventListener("input", ()=>setCheck(document.getElementById("telpCheck"), telpInput.value.trim() !== ""));
alamatInput.addEventListener("input", ()=>setCheck(document.getElementById("alamatCheck"), alamatInput.value.trim() !== ""));
passwordInput.addEventListener("input", ()=>setCheck(document.getElementById("passwordCheck"), /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9!@#$%^&*]).{8,}$/.test(passwordInput.value)));
confirmInput.addEventListener("input", ()=>setCheck(document.getElementById("confirmCheck"), confirmInput.value === passwordInput.value && confirmInput.value !== ""));

// Fungsi register
registerBtn.addEventListener("click", async function() {
  msg.textContent = "";
  msg.style.color = "red";

  if(document.querySelectorAll(".check.green").length !== 6){
    msg.textContent = "Periksa semua field, pastikan benar!";
    return;
  }

  const nama = namaInput.value;
  const email = emailInput.value;
  const telp = telpInput.value;
  const alamat = alamatInput.value;
  const password = passwordInput.value;

  try {
    // Cek apakah email sudah terdaftar di Firestore
    const usersRef = firebase.firestore().collection("users");
    const snapshot = await usersRef.where("email","==",email).get();
    if(!snapshot.empty){
      msg.textContent = "Email sudah terdaftar, gunakan email lain.";
      return;
    }

    // Firebase Auth
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email,password);
    const user = userCredential.user;

    // Simpan data tambahan
    await usersRef.doc(user.uid).set({
      nama,email,telp,alamat,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Kirim email verifikasi
    await user.sendEmailVerification();

    msg.style.color = "green";
    msg.textContent = "Akun berhasil dibuat! Silahkan cek email untuk verifikasi, kemudian login.";
    setTimeout(()=> window.location.href="login.html",3000);

  } catch(err){
    msg.textContent = "Gagal mendaftar: "+err.message;
  }
});

// Auth state check (opsional)
firebase.auth().onAuthStateChanged(user => {
  if(user && location.pathname.includes("register.html")){
    window.location.href="dashboard.html";
  }
});
