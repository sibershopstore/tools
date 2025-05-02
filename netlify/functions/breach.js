document.addEventListener('DOMContentLoaded', () => {
  const btn       = document.getElementById('checkBtn');
  const loading   = document.getElementById('loading');
  const resultDiv = document.getElementById('resultBox');
  const emailIn   = document.getElementById('emailInput');
  const fallback  = '/assets/img/default-logo.png'; // pastikan ada

  loading.style.display = 'none';

  btn.addEventListener('click', async () => {
    const email = emailIn.value.trim();
    resultDiv.innerHTML = '';
    if (!email) {
      emailIn.focus();
      return alert('Silakan masukkan email.');
    }

    loading.style.display = 'block';

    try {
      // Memanggil Netlify Function breach
      const res  = await fetch(`/.netlify/functions/breach?check=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.sources) && data.sources.length) {
        let html = `<p class="text-danger fw-bold">⚠️ Email "<strong>${email}</strong>" terdeteksi dalam <strong>${data.sources.length}</strong> kebocoran:</p>`;

        data.sources.forEach(src => {
          const domain  = (src.domain || src.name.toLowerCase().replace(/\s+/g, '')) + '.com';
          const logoUrl = `https://logo.clearbit.com/${domain}`;

          html += `
            <div class="breach-item">
              <img src="${logoUrl}" onerror="this.onerror=null;this.src='${fallback}';" alt="Logo ${src.name}">
              <div class="breach-details">
                <p><strong>${src.name}</strong> — ${src.date || 'Tanggal tidak tersedia'}</p>
                <p><em>Compromised data:</em> Dates of birth, Email addresses, Genders, Names, Passwords</p>
                ${typeof data.found === 'number'
                  ? `<p><em>Total masukan bocor:</em> ${data.found.toLocaleString('id-ID')} baris (perkiraan)</p>`
                  : ''
                }
              </div>
            </div>`;
        });

        resultDiv.innerHTML = html;
      } else {
        resultDiv.innerHTML = `<p class="text-success">✅ Email "<strong>${email}</strong>" tidak ditemukan dalam database kebocoran.</p>`;
      }
    } catch (err) {
      console.error(err);
      resultDiv.innerHTML = `<p class="text-danger">❌ Gagal memeriksa data. Coba lagi nanti.</p>`;
    } finally {
      loading.style.display = 'none';
    }
  });
});
