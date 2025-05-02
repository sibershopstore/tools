document.getElementById('checkBtn').addEventListener('click', () => {
  const email = document.getElementById('emailInput').value.trim();
  const loading = document.getElementById('loading');
  const resultBox = document.getElementById('resultBox');

  resultBox.value = '';
  loading.style.display = 'none';

  if (!email) {
    alert('Silakan masukkan email.');
    return;
  }

  loading.style.display = 'block';

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = false;

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      loading.style.display = 'none';
      try {
        const response = JSON.parse(this.responseText);
        const sites = Object.keys(response);

        if (sites.length === 0) {
          resultBox.value = `✅ Email "${email}" tidak ditemukan dalam database kebocoran.`;
        } else {
          let output = `⚠️ Email "${email}" ditemukan dalam ${sites.length} kebocoran:\n\n`;
          sites.forEach(site => {
            const count = Array.isArray(response[site]) ? response[site].length : 0;
            output += `• ${site} — ${count.toLocaleString()} data\n`;
          });
          resultBox.value = output;
        }
      } catch (e) {
        resultBox.value = '❌ Gagal memproses data. Pastikan API key valid.';
        console.error(e);
      }
    }
  });

  const url = `https://breachdirectory.p.rapidapi.com/?func=auto&term=${encodeURIComponent(email)}`;
  xhr.open('GET', url);
  xhr.setRequestHeader('x-rapidapi-key', '086ce2e822mshcebcaa238595670p10beddjsn9d0c243c876a');
  xhr.setRequestHeader('x-rapidapi-host', 'breachdirectory.p.rapidapi.com');
  xhr.send();
});
