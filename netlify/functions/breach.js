// Jika Node <18 gunakan: const fetch = require('node-fetch').default;
// Di Netlify biasanya sudah support fetch global di Node 18+.

exports.handler = async (event) => {
  const email   = event.queryStringParameters.check;
  const API_URL = process.env.LEAKCHECK_API_URL;   // e.g. https://leakcheck.io
  const API_KEY = process.env.LEAKCHECK_API_KEY;   // → X-API-Key header

  // 1) Validasi
  if (!email) {
    return { statusCode: 400, body: 'Parameter "check" diperlukan.' };
  }
  if (!API_URL || !API_KEY) {
    console.error('Missing LEAKCHECK_API_URL or LEAKCHECK_API_KEY');
    return {
      statusCode: 500,
      body: 'Server misconfiguration: missing API URL or API key.'
    };
  }

  // 2) Bangun URL & headers
  const url = `${API_URL}/api/v2/query/${encodeURIComponent(email)}`;
  const headers = {
    'Accept':       'application/json',
    'X-API-Key':    API_KEY,
    'User-Agent':   'SiberShop/1.0'
  };

  try {
    const resRaw = await fetch(url, { headers });
    const text   = await resRaw.text();
    console.log('LeakCheck v2 status:', resRaw.status);
    console.log('LeakCheck v2 raw:', text);

    if (!resRaw.ok) {
      // Kirim detail ke log & client (sementara untuk debug)
      return {
        statusCode: 502,
        headers:     { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error:   `LeakCheck API error (status ${resRaw.status})`,
          detail:  text
        })
      };
    }

    // Parse JSON
    const data = JSON.parse(text);

    // data looks like:
    // { success: true, found: X, quota: Y, result: [ { email, source: {...}, first_name, ... }, ... ] }

    return {
      statusCode: 200,
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify(data)
    };

  } catch (err) {
    console.error('Fetch exception:', err);
    return {
      statusCode: 502,
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify({ success: false, error: err.message })
    };
  }
};
