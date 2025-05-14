// Jika kamu masih menggunakan Node <18, uncomment baris berikut:
// const fetch = require('node-fetch').default;

exports.handler = async (event) => {
  const email = event.queryStringParameters.check;
  const API_URL = process.env.BREACH_API_URL || 'https://leakcheck.net/api/public';
  const API_KEY = process.env.BREACH_API_KEY;   // ← simpan di Netlify env var

  // Validasi input & config
  if (!email) {
    return { statusCode: 400, body: 'Parameter "check" diperlukan.' };
  }
  if (!API_KEY) {
    console.error('Missing BREACH_API_KEY');
    return {
      statusCode: 500,
      body: 'Server misconfiguration: missing API key.'
    };
  }

  // Bangun URL dengan key
  const url = `${API_URL}?check=${encodeURIComponent(email)}&key=${API_KEY}`;
  const headers = {
    'Accept': 'application/json',
    'User-Agent': 'SiberShop/1.0'
  };

  try {
    const res = await fetch(url, { headers });
    const raw = await res.text();
    console.log('LeakCheck response status:', res.status);
    console.log('LeakCheck raw response:', raw);

    if (!res.ok) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: `LeakCheck API error (status ${res.status})`,
          detail: raw
        })
      };
    }

    // Parse JSON setelah logging untuk debugging
    const data = JSON.parse(raw);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

  } catch (err) {
    console.error('Fetch exception:', err);
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Fetch exception',
        detail: err.message
      })
    };
  }
};
