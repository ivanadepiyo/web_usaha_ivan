import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// SIMPAN DATA
document.getElementById("usahaForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const bidang = document.getElementById("bidang").value;
  const deskripsi = document.getElementById("deskripsi").value;

  await addDoc(collection(db, "usaha"), {
    nama,
    bidang,
    deskripsi,
    createdAt: new Date()
  });

  alert("Data tersimpan 🎉");
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
      <button data-id="${docSnap.id}">H
