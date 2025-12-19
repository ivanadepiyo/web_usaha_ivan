import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { db } from "./firebase.js";

document.getElementById("usahaForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const bidang = document.getElementById("bidang").value;
  const deskripsi = document.getElementById("deskripsi").value;

  try {
    await addDoc(collection(db, "usaha"), {
      nama,
      bidang,
      deskripsi,
      createdAt: new Date()
    });

    alert("Data usaha berhasil tersimpan 🎉");
    document.getElementById("usahaForm").reset();
  } catch (error) {
    console.error(error);
    alert("Gagal menyimpan data ❌");
  }
});
