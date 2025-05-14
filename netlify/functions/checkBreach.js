const fetch = require("node-fetch");

exports.handler = async (event) => {
  const email = event.queryStringParameters.email;
  const apiKey = "8cb2237d0679ca88db6464eac60da96345513964"; // Ganti dengan API key Anda

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Email tidak boleh kosong." })
    };
  }

  try {
    const response = await fetch(`https://leakcheck.io/api/v2/query/${encodeURIComponent(email)}?type=email`, {
      headers: {
        "X-API-Key": apiKey
      }
    });

    const data = await response.json();

    if (!data.success) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.error || "Gagal mengambil data dari LeakCheck." })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        breached: data.found,
        breaches: data.result || []
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Terjadi kesalahan pada server: " + error.message })
    };
  }
};
