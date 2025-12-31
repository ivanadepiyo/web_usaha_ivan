<!-- ================================================= -->
<!-- ============ FIREBASE SDK (COMPAT) ============== -->
<!-- ================================================= -->
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>

<!-- ================================================= -->
<!-- ============ FIREBASE CONFIG ==================== -->
<!-- ================================================= -->
<script>
  // Konfigurasi project Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyBjDHapatmMS4C2EDFXxp_WQXVhb0UCZZg",
    authDomain: "web-usaha-ivan.firebaseapp.com",
    projectId: "web-usaha-ivan",
    storageBucket: "web-usaha-ivan.appspot.com",
    messagingSenderId: "588839561784",
    appId: "1:588839561784:web:4accd7d9316a5a0ec5d4cd"
  };

  // Inisialisasi Firebase
  firebase.initializeApp(firebaseConfig);

  // Jangan perlu deklarasi auth & db lagi di sini,
  // cukup gunakan di auth.js agar tidak konflik
</script>
