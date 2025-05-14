import fetch from 'node-fetch';

export async function handler(event) {
  const { email } = event.queryStringParameters;
  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Email is required' })
    };
  }

  // Gunakan API key yang sudah kamu berikan
 const apiKey = process.env.LEAKCHECK_API_KEY;

  const url = `https://leakcheck.io/api/v2/query/${encodeURIComponent(email)}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': apiKey
      }
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: text })
      };
    }

    const data = await res.json();

    if (!data.success) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'LeakCheck API returned unsuccessful response' })
      };
    }

    // Jika tidak ada breach
    if (data.found === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ breached: false, breaches: [] })
      };
    }

    // Map ke format seragam
    const formatted = data.result.map(b => ({
      Title: b.source.name,
      BreachDate: b.source.breach_date,
      Description: `Fields exposed: ${b.fields.join(', ')}`
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ breached: true, breaches: formatted })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
