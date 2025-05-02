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
      const res = await fetch(`https://leakcheck.net/api/public?check=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error('Status ' + res.status);
      const data = await res.json();

      if (data.success && Array.isArray(data.result) && data.result.length > 0) {
        let out = `⚠️ Email "${email}" ditemukan dalam ${data.result.length} kebocoran.\n\n`;

        data.result.forEach(src => {
          const source = src.source || "Tidak diketahui";
          const breachDate = src.date || "Tanggal tidak tersedia";
          const fields = src.fields || [];
          const logo = source
            ? `https://logo.clearbit.com/${source.replace(/\s+/g, '').toLowerCase()}.com`
            : "default-logo.png";

          out += `🛡️ ${source}\n`;
          out += `📅 Tanggal: ${breachDate}\n`;
          out += `🔐 Data bocor: ${fields.length ? fields.join(', ') : 'Tidak diketahui'}\n`;
          out += `🖼️ Logo: ${logo}\n\n`;
        });

        // Tambahkan jumlah total estimasi data bocor jika tersedia
        const estimated = data.result.length > 1000000 ? "juta" : "ribu";
        out += `📊 Perkiraan total data bocor: ${data.result.length.toLocaleString()} ${estimated}`;

        resultBox.value = out;
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
