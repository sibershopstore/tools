// netlify/functions/breach.js
const fetch = require('node-fetch');
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers:{'Access-Control-Allow-Origin':'*'}, body:'Method Not Allowed' };
  }
  const { email } = JSON.parse(event.body);
  try {
    const res = await fetch(`https://psbdmp.ws/api/search?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    return {
      statusCode: 200,
      headers:{'Access-Control-Allow-Origin':'*'},
      body: JSON.stringify(data)
    };
  } catch(err) {
    return { statusCode: 500, headers:{'Access-Control-Allow-Origin':'*'}, body: JSON.stringify({ error: 'Server error' }) };
  }
};
