const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { email } = event.queryStringParameters;
  const apiKey = "8cb2237d0679ca88db6464eac60da96345513964";

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Email tidak boleh kosong." })
    };
  }

  try {
    const res = await fetch(`https://leakcheck.io/api/v2/public/email/${encodeURIComponent(email)}`, {
      headers: { "X-API-Key": apiKey }
    });

    const data = await res.json();

    if (!data.success) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.message || "Gagal mengambil data." })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        breached: data.found,
        breaches: data.sources || []
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error: " + err.message })
    };
  }
};
