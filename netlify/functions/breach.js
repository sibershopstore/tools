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

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      loading.style.display = 'none';
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
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
          console.error(e);
          resultBox.value = '❌ Gagal memproses data respons.';
        }
      } else {
        console.error('Status:', xhr.status);
        resultBox.value = '❌ Gagal memeriksa data. Coba lagi nanti.';
      }
    }
  };

  const url = `https://breachdirectory.p.rapidapi.com/?func=auto&term=${encodeURIComponent(email)}`;
  xhr.open('GET', url);
  xhr.setRequestHeader('x-rapidapi-key', '086ce2e822mshcebcaa238595670p10beddjsn9d0c243c876a');
  xhr.setRequestHeader('x-rapidapi-host', 'breachdirectory.p.rapidapi.com');
  xhr.send();
});
