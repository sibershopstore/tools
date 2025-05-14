// netlify/functions/breach.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const email = event.queryStringParameters.check;
  const API_URL = process.env.BREACH_API_URL;  // e.g. https://www.freepublicapis.com/api/apis/275

  if (!email) {
    return { statusCode: 400, body: 'Parameter "check" diperlukan.' };
  }
  if (!API_URL) {
    console.error('Missing BREACH_API_URL');
    return { statusCode: 500, body: 'Server misconfiguration.' };
  }

  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      const errText = await res.text();
      console.error('API error:', errText);
      throw new Error(`Status ${res.status}`);
    }

    // FreePublicAPIs returns an array wrapping satu item
    const arr = await res.json();
    const data = Array.isArray(arr) ? arr[0] : arr;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, api: data })
    };
  } catch (err) {
    console.error('Fetch error:', err);
    return { statusCode: 502, body: JSON.stringify({ success: false, error: 'Gagal mengambil data API.' }) };
  }
};
