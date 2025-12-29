let editId = null;

document.getElementById("usahaForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = nama.value;
  const bidang = bidang.value;
  const deskripsi = deskripsi.value;

  if (editId) {
    await db.collection("usaha").doc(editId).update({
      nama, bidang, deskripsi
    });
    editId = null;
    alert("Data diperbarui ✏️");
  } else {
    await db.collection("usaha").add({
      nama, bidang, deskripsi,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    alert("Data tersimpan 🎉");
  }

  usahaForm.reset();
  tampilkanData();
});

async function tampilkanData() {
  daftarUsaha.innerHTML = "";

  const snapshot = await db.collection("usaha").get();
  snapshot.forEach(doc => {
    const d = doc.data();

    daftarUsaha.innerHTML += `
      <li>
        <b>${d.nama}</b><br>
        ${d.bidang}<br>
        ${d.deskripsi}<br>
        <button onclick="edit('${doc.id}','${d.nama}','${d.bidang}','${d.deskripsi}')">Edit</button>
        <button onclick="hapus('${doc.id}')">Hapus</button>
        <hr>
      </li>`;
  });
}

function edit(id,n,b,d) {
  editId = id;
  nama.value = n;
  bidang.value = b;
  deskripsi.value = d;
}

function hapus(id) {
  db.collection("usaha").doc(id).delete();
  tampilkanData();
}

tampilkanData();
