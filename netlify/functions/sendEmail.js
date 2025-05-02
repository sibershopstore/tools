// netlify/functions/sendEmail.js
const emailjs = require('emailjs-com'); // Pastikan ini sesuai dengan EmailJS SDK
const { EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID } = process.env;

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const data = JSON.parse(event.body); // Data yang dikirimkan oleh frontend (form data)

  const emailParams = {
    service_id: EMAILJS_SERVICE_ID, 
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message
    }
  };

  try {
    // Kirim email menggunakan EmailJS
    const result = await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to send email' }),
    };
  }
};
