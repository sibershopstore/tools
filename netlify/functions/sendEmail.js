const emailjs = require('emailjs-com');
require('dotenv').config();

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  const { name, email, subject, message } = JSON.parse(event.body);

  const emailParams = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    template_params: {
      name: name,
      email: email,
      subject: subject,
      message: message
    }
  };

  try {
    const result = await emailjs.sendForm(emailParams);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Pesan berhasil dikirim!' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Gagal mengirim pesan.' }),
    };
  }
};
