// netlify/functions/sendEmail.js
const emailjs = require('@emailjs/nodejs');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }
  
  emailjs.init(process.env.EMAILJS_PUBLIC_KEY);

  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message
      }
    );
    return { statusCode: 200, body: 'OK' };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return { statusCode: 500, body: 'Failed to send email' };
  }
};
