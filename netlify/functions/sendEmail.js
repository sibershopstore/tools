// netlify/functions/sendEmail.js
const emailjs = require('@emailjs/nodejs');  // package nodejs

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { name, email, subject, message } = JSON.parse(event.body);

  // Inisialisasi dengan Environment Variables
  emailjs.init(process.env.EMAILJS_PUBLIC_KEY);

  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      { name, email, subject, message }
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'OK' })
    };
  } catch (err) {
    console.error('EmailJS Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' })
    };
  }
};
