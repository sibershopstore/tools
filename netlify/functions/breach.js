document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('checkBtn');
  const loading = document.getElementById('loading');
  const resultBox = document.getElementById('resultBox');
  const emailInput = document.getElementById('emailInput');

  loading.style.display = 'none';

  btn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    resultBox.value = '';
    if (!email) {
      alert('Silakan masukkan email.');
      return;
    }

    loading.style.display = 'block';

    try {
      const res = await fetch(`/.netlify/functions/breach?check=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error('Status ' + res.status);
      const data = await res.json();

      if (data.success) {
        const container = document.createElement('div');
        container.innerHTML = `<p class="mb-3 text-danger fw-bold">⚠️ Email "<strong>${email}</strong>" terdeteksi dalam <strong>${data.sources.length}</strong> kebocoran:</p>`;

        data.sources.forEach(src => {
          const logoUrl = `https://logo.clearbit.com/${src.domain}`;
          const fallbackLogo = "images/default-breach-logo.png";

          const card = document.createElement('div');
          card.className = 'card mb-3';
          card.innerHTML = `
            <div class="card-body d-flex">
              <img src="${logoUrl}" onerror="this.src='${fallbackLogo}'" class="me-3 rounded" alt="Logo ${src.name}" style="width:48px; height:48px; object-fit:contain;">
              <div>
                <h5 class="card-title mb-1">${src.name}</h5>
                <p class="card-text mb-1"><strong>Tanggal:</strong> ${src.date || 'Tidak tersedia'}</p>
                <p class="card-text mb-1"><strong>Compromised data:</strong> Email addresses, Passwords, Names, Genders, Dates of birth, IP Address, Alamat, Negara</p>
                <p class="card-text"><strong>Total data bocor:</strong> ${src.found ? src.found.toLocaleString('id-ID') + ' baris' : 'Tidak diketahui'}</p>
              </div>
            </div>
          `;
          container.appendChild(card);
        });

        resultBox.replaceWith(container);
      } else {
        resultBox.value = `✅ Email "${email}" tidak ditemukan dalam database kebocoran.`;
      }
    } catch (err) {
      console.error(err);
      resultBox.value = '❌ Gagal memeriksa data. Coba lagi nanti.';
    } finally {
      loading.style.display = 'none';
    }
  });
});
