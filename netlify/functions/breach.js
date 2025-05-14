// netlify/functions/breach.js
// (Node 18+ di Netlify sudah punya fetch global, jadi kita tak perlu import)
exports.handler = async (event) => {
  const email = event.queryStringParameters.check;
  const API_URL = process.env.BREACH_API_URL || 'https://leakcheck.net/api/public';
  const API_KEY = process.env.BREACH_API_KEY;   // ← ambil dari env var

  if (!email) {
    return { statusCode: 400, body: 'Parameter "check" diperlukan.' };
  }
  if (!API_KEY) {
    console.error('Missing BREACH_API_KEY');
    return { statusCode: 500, body: 'Server misconfiguration: missing API key.' };
  }

  const url = `${API_URL}?check=${encodeURIComponent(email)}&key=${API_KEY}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SiberShop/1.0'
      }
    });
    const text = await res.text();
    if (!res.ok) {
      console.error('LeakCheck API error:', text);
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: text })
      };
    }
    const data = JSON.parse(text);
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
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
