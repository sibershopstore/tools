// netlify/functions/breach.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const email = event.queryStringParameters.check;
  if (!email) {
    return { statusCode: 400, body: 'Parameter "check" diperlukan.' };
  }

  try {
    const res = await fetch(`https://leakcheck.net/api/public?check=${encodeURIComponent(email)}`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 502,
      body: JSON.stringify({ success: false, error: 'Gagal mengambil data LeakCheck.' })
    };
  }
};
