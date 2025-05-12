const fetch = require('node-fetch'); // Pastikan untuk menginstal fetch untuk node.js jika belum

exports.handler = async (event, context) => {
  const API_KEY = process.env.API_KEY; // Ambil API Key dari variabel lingkungan
  const url = JSON.parse(event.body).url; // Ambil URL dari body request
  
  const apiUrl = `https://urlscan.io/api/v1/scan/`;
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'API-Key': API_KEY, // Gunakan API key dari variabel lingkungan
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ result: `https://urlscan.io/result/${data.uuid}/` })
      };
    } else {
      throw new Error(data.error || 'Gagal melakukan scan');
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
