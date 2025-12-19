document.getElementById("usahaForm").addEventListener("submit", function(e){
  e.preventDefault();

  const usaha = {
    nama: document.getElementById("nama").value,
    bidang: document.getElementById("bidang").value,
    deskripsi: document.getElementById("deskripsi").value
  };

  console.log("Data usaha:", usaha);
  alert("Data berhasil diisi (belum tersimpan ke database)");
});
