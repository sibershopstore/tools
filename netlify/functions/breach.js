const fetch = require('node-fetch');

exports.handler = async (event) => {
  const email = event.queryStringParameters.check;
  const API_KEY = process.env.LEAKCHECK_API_KEY; // 🔒 Ambil dari env var

  if (!email) {
    return { statusCode: 400, body: 'Parameter "check" diperlukan.' };
  }

  try {
    const url = `https://leakcheck.net/api/public?check=${encodeURIComponent(email)}&key=${API_KEY}`;
    const res = await fetch(url);

    if (!res.ok) {
      const errText = await res.text();
      console.error('API response error:', errText);
      throw new Error(`Status ${res.status}`);
    }

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
      body: JSON.stringify({ success: false, error: 'Gagal mengambil data LeakCheck.' })
    };
  }
};
