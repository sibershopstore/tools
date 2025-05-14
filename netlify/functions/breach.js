// netlify/functions/breach.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const email = event.queryStringParameters.check;
  const API_URL = process.env.BREACH_API_URL || 'https://leakcheck.net/api/public';

  if (!email) {
    return { statusCode: 400, body: 'Parameter "check" diperlukan.' };
  }

  const url = `${API_URL}?check=${encodeURIComponent(email)}`;
  const headers = {
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (compatible; SiberShop/1.0)' 
  };

  try {
    const res = await fetch(url, { headers });

    // Jika status bukan 2xx, baca teks error dulu
    if (!res.ok) {
      const errText = await res.text();
      console.error(`LeakCheck API error (status ${res.status}):`, errText);
      return {
        statusCode: 502,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          success: false,
          error: 'LeakCheck API mengembalikan error.',
          status: res.status,
          detail: errText
        })
      };
    }

    // Parse JSON
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

  } catch (err) {
    console.error('Fetch error:', err);
    return {
      statusCode: 502,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        success: false,
        error: 'Gagal mengambil data LeakCheck.',
        detail: err.message
      })
    };
  }
};
