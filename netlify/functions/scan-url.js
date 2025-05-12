// functions/scan-url.js

exports.handler = async function(event) {
  const API_KEY = process.env.URL_SCAN_API_KEY; // Disembunyikan lewat environment variable
  const { url } = JSON.parse(event.body || "{}");

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "URL tidak ditemukan" })
    };
  }

  try {
    const res = await fetch(`https://ipqualityscore.com/api/json/url/${API_KEY}/${encodeURIComponent(url)}`);
    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Gagal menghubungi API" })
    };
  }
};
