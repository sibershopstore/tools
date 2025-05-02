const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Metode tidak diizinkan' }),
    };
  }

  const { name, email, subject, message } = JSON.parse(event.body);

  const serviceID = process.env.EMAILJS_SERVICE_ID;
  const templateID = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  const payload = {
    service_id: serviceID,
    template_id: templateID,
    user_id: publicKey,
    template_params: {
      name,
      email,
      subject,
      message,
    },
  };

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: 'Gagal mengirim email', detail: errText }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Pesan berhasil dikirim!' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Terjadi kesalahan server.', detail: error.message }),
    };
  }
};
