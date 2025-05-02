export async function handler(event) {
  const email = event.queryStringParameters.check;
  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: "Parameter 'check' diperlukan." }),
    };
  }

  try {
    const res = await fetch(`https://leakcheck.net/api/public?check=${encodeURIComponent(email)}`);
    const text = await res.text();

    const firstBraceIndex = text.indexOf("{");
    const jsonString = text.slice(firstBraceIndex);
    const data = JSON.parse(jsonString);

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
}
