<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyBjDHapatmMS4C2EDFXxp_WQXVhb0UCZZg",
    authDomain: "web-usaha-ivan.firebaseapp.com",
    projectId: "web-usaha-ivan",
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
</script>
