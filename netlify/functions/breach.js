// netlify/functions/breach.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const email = event.queryStringParameters.check;
  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Parameter 'check' diperlukan." }),
    };
  }

  try {
    const res = await fetch(`https://leakcheck.net/api/public?check=${encodeURIComponent(email)}`);
    const data = await res.json();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Gagal mengambil data dari LeakCheck." }),
    };
  }
};
