document.getElementById('checkBtn').addEventListener('click', async () => {
  const email = document.getElementById('emailInput').value.trim();
  const resultBox = document.getElementById('resultBox');
  const loadingSpinner = document.getElementById('loadingSpinner');

  resultBox.innerHTML = '';
  if (!email) {
    resultBox.innerHTML = '<p class="text-danger">Silakan masukkan email.</p>';
    return;
  }

  loadingSpinner.style.display = 'flex';

  try {
    const res = await fetch(`/.netlify/functions/breach?check=${encodeURIComponent(email)}`);
    const data = await res.json();

    if (data.success && data.sources.length > 0) {
      const total = data.sources.length;
      let html = `<p><strong>Total Kebocoran:</strong> ${total} kasus ditemukan.</p>`;
      html += `<div class="breach-list">`;

      data.sources.forEach(source => {
        const logoURL = `https://logo.clearbit.com/${source.name.toLowerCase().replace(/\s+/g, '')}.com`;
        html += `
          <div class="d-flex mb-3 p-3 border rounded align-items-start bg-light">
            <img src="${logoURL}" onerror="this.style.display='none'" alt="logo ${source.name}" style="width: 50px; height: 50px; margin-right: 15px; border-radius: 6px;">
            <div>
              <strong>${source.name}</strong><br>
              <small><strong>Tanggal Bocor:</strong> ${source.date || 'Tidak diketahui'}</small><br>
              <small><strong>Jumlah Data:</strong> ${source.lines || 'Tidak diketahui'} baris</small><br>
              <small><strong>Jenis Data:</strong> ${source.details || 'Tidak tersedia'}</small>
            </div>
          </div>`;
      });

      html += `</div>
      <div class="alert alert-warning mt-3">
        ⚠️ <strong>Catatan:</strong> Jika datamu muncul dalam daftar ini, segera lakukan hal berikut:
        <ul>
          <li>Ganti password pada akun terkait</li>
          <li>Gunakan password yang unik dan kuat</li>
          <li>Aktifkan verifikasi 2 langkah (2FA) jika tersedia</li>
        </ul>
      </div>`;
      resultBox.innerHTML = html;
    } else {
      resultBox.innerHTML = `<p class="text-success">✅ Email kamu aman, tidak ditemukan dalam kebocoran data publik.</p>`;
    }

  } catch (err) {
    console.error(err);
    resultBox.innerHTML = '<p class="text-danger">Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.</p>';
  } finally {
    loadingSpinner.style.display = 'none';
  }
});
