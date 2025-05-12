// netlify/functions/scan-url.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  const API_KEY = process.env.API_KEY;  // API Key disimpan di variabel lingkungan
  const url = event.queryStringParameters.url;
  
  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'URL tidak disediakan' }),
    };
  }

  try {
    // Fetching data from the API
    const response = await fetch(`https://api.urlscan.io/api/v1/scan/`, {
      method: 'POST',
      headers: {
        'API-Key': API_KEY, // API key hanya digunakan di server
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error('API error: ' + data.error);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        url: data.url,
        status: data.status,
        unsafe: data.unsafe,
        phishing: data.phishing,
        suspicious: data.suspicious,
        domain_rank: data.domain_rank,
        risk_score: data.risk_score,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
