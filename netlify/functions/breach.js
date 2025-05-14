// netlify/functions/breach.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const email = event.queryStringParameters.check;
  const API_URL = process.env.BREACH_API_URL || 'https://leakcheck.net/api/public';

  if (!email) {
    return {
      statusCode: 400,
      body: 'Parameter "check" diperlukan.'
    };
  }

  try {
    const url = `${API_URL}?check=${encodeURIComponent(email)}`;
    const res = await fetch(url);

    if (!res.ok) {
      const errText = await res.text();
      console.error('LeakCheck API error:', errText);
      throw new Error(`Status ${res.status}`);
    }

    const data = await res.json();
    // Langsung kirim JSON mentahnya ke client
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
