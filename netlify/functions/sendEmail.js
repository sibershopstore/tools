const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: 'Method Not Allowed' }),
      };
    }

    const { name, email, message } = JSON.parse(event.body);

    const serviceID = process.env.EMAILJS_SERVICE_ID;
    const templateID = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;

    const emailData = {
      service_id: serviceID,
      template_id: templateID,
      user_id: publicKey,
      template_params: {
        from_name: name,
        from_email: email,
        message: message,
      },
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (response.ok) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Email terkirim' }),
      };
    } else {
      const errorText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: 'Gagal mengirim email', error: errorText }),
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error', error: error.message }),
    };
  }
};
