export async function handler(event, context) {
  const API_KEY = "0196c28c-7320-7273-be63-30900df36070";
  const { url } = JSON.parse(event.body || '{}');

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "URL tidak valid" })
    };
  }

  try {
    const response = await fetch(`https://ipqualityscore.com/api/json/url/${API_KEY}/${encodeURIComponent(url)}`);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Gagal mengambil data" })
    };
  }
}
