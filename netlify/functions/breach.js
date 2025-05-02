document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('checkBtn');
  const loading = document.getElementById('loading');
  const resultBox = document.getElementById('resultBox');
  const emailInput = document.getElementById('emailInput');

  loading.style.display = 'none';

  btn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    resultBox.value = '';
    loading.style.display = 'none';

    if (!email) {
      alert('Silakan masukkan email.');
      return;
    }

    loading.style.display = 'block';

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://breachdirectory.p.rapidapi.com/?func=auto&term=${encodeURIComponent(email)}`);
    xhr.setRequestHeader('x-rapidapi-key', '086ce2e822mshcebcaa238595670p10beddjsn9d0c243c876a');
    xhr.setRequestHeader('x-rapidapi-host', 'breachdirectory.p.rapidapi.com');
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      loading.style.display = 'none';

      if (xhr.status === 200) {
        try {
          const resp = JSON.parse(xhr.responseText);
          const sites = Object.keys(resp);

          if (sites.length === 0) {
            resultBox.value = `✅ Email "${email}" tidak ditemukan dalam database kebocoran.`;
          } else {
            let out = `⚠️ Email "${email}" terlibat dalam ${sites.length} kebocoran:\n\n`;
            sites.forEach(site => {
              const count = Array.isArray(resp[site]) ? resp[site].length : 0;
              out += `• ${site} — ${count.toLocaleString()} entry\n`;
            });
            resultBox.value = out;
          }
        } catch (e) {
          console.error(e);
          resultBox.value = '❌ Gagal memproses respons API.';
        }
      } else {
        console.error('Error status', xhr.status);
        resultBox.value = '❌ Gagal memeriksa data. Coba lagi nanti.';
      }
    };
    xhr.send();
  });
});
