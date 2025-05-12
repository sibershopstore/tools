// functions/scan-url.js

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Metode harus POST" }),
    };
  }

  let url;
  try {
    const body = JSON.parse(event.body);
    url = body.url;
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Body tidak valid" }),
    };
  }

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "URL tidak ditemukan" }),
    };
  }

  const API_KEY = process.env.URL_SCAN_API_KEY;

  try {
    const res = await fetch(`https://ipqualityscore.com/api/json/url/${API_KEY}/${encodeURIComponent(url)}`);
    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Gagal menghubungi API" }),
    };
  }
};
