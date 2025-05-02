document.getElementById("breach-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const resultBox = document.getElementById("result-box");
  resultBox.innerHTML = `<p>Mengecek data, mohon tunggu...</p>`;

  try {
    const response = await fetch(`https://leakcheck.net/api/public?check=${encodeURIComponent(email)}`);
    const text = await response.text();

    const firstBraceIndex = text.indexOf("{");
    const jsonString = text.slice(firstBraceIndex);
    const data = JSON.parse(jsonString);

    if (!data.success || !data.sources || data.sources.length === 0) {
      resultBox.innerHTML = `<p class="text-danger">Data tidak ditemukan atau email aman dari kebocoran publik.</p>`;
      return;
    }

    let totalLeaks = data.sources.length;
    let details = "";

    data.sources.forEach(source => {
      details += `
        <div class="card mb-3">
          <div class="card-body d-flex">
            <img src="https://logo.clearbit.com/${source.domain}" onerror="this.src='https://via.placeholder.com/40'" alt="Logo" width="40" height="40" class="me-3">
            <div>
              <h5 class="mb-1">${source.domain}</h5>
              <p class="mb-0"><strong>Tanggal Bocor:</strong> ${source.date || "Tidak diketahui"}</p>
              <p class="mb-0"><strong>Data Bocor:</strong> ${source.data.join(", ")}</p>
            </div>
          </div>
        </div>
      `;
    });

    resultBox.innerHTML = `
      <div class="alert alert-warning">
        <strong>Email:</strong> ${email}<br>
        <strong>Total Kebocoran:</strong> ${totalLeaks} sumber ditemukan.<br>
        <strong>Catatan:</strong> Jika email kamu bocor, segera ubah password, aktifkan 2FA, dan hindari memakai password yang sama di beberapa platform.
      </div>
      ${details}
    `;
  } catch (error) {
    console.error("Error:", error);
    resultBox.innerHTML = `<p class="text-danger">Terjadi kesalahan saat memproses permintaan. Silakan coba lagi.</p>`;
  }
});
