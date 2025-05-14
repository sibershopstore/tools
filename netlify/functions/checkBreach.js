// netlify/functions/checkBreach.js
export async function handler(event) {
  const email = event.queryStringParameters.email;
  const apiKey = process.env.LEAKCHECK_API_KEY;

  if (!email || !apiKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Parameter atau API Key tidak tersedia." })
    };
  }

  const url = `https://leakcheck.io/api/v2?key=${apiKey}&check=${encodeURIComponent(email)}&type=email`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: data.error || "Gagal memeriksa data." })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        breached: data.found,
        breaches: data.result
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Gagal mengambil data." })
    };
  }
}
