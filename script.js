import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

let editId = null;

// SIMPAN / UPDATE DATA
document.getElementById("usahaForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const bidang = document.getElementById("bidang").value;
  const deskripsi = document.getElementById("deskripsi").value;

  if (editId) {
    await updateDoc(doc(db, "usaha", editId), {
      nama,
      bidang,
      deskripsi
    });
    editId = null;
    alert("Data berhasil diperbarui ✏️");
  } else {
    await addDoc(collection(db, "usaha"), {
      nama,
      bidang,
      deskripsi,
      createdAt: new Date()
    });
    alert("Data tersimpan 🎉");
  }

  document.getElementById("usahaForm").reset();
  tampilkanData();
});

// TAMPILKAN DATA
async function tampilkanData() {
  const daftar = document.getElementById("daftarUsaha");
  daftar.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "usaha"));

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${data.nama}</strong><br>
      Bidang: ${data.bidang}<br>
      Deskripsi: ${data.deskripsi}<br>
      <button class="edit">Edit</button>
      <button class="hapus">Hapus</button>
      <hr>
    `;

    // EDIT
    li.querySelector(".edit").addEventListener("click", () => {
      document.getElementById("nama").value = data.nama;
      document.getElementById("bidang").value = data.bidang;
      document.getElementById("deskripsi").value = data.deskripsi;
      editId = docSnap.id;
    });

    // DELETE
    li.querySelector(".hapus").addEventListener("click", async () => {
      await deleteDoc(doc(db, "usaha", docSnap.id));
      tampilkanData();
    });

    daftar.appendChild(li);
  });
}

tampilkanData();
