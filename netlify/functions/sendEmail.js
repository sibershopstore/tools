// netlify/functions/sendEmail.js
const emailjs = require('@emailjs/nodejs');

exports.handler = async (event) => {
  console.log("📬 Invoked sendEmail function");
  
  if (event.httpMethod !== 'POST') {
    console.log("❌ Wrong HTTP method:", event.httpMethod);
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data;
  try {
    data = JSON.parse(event.body);
    console.log("📥 Payload:", data);
  } catch (err) {
    console.error("❌ Invalid JSON:", err);
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  // Log env vars
  console.log("🔑 PUBLIC_KEY:", process.env.EMAILJS_PUBLIC_KEY);
  console.log("🔑 SERVICE_ID:", process.env.EMAILJS_SERVICE_ID);
  console.log("🔑 TEMPLATE_ID:", process.env.EMAILJS_TEMPLATE_ID);

  if (!process.env.EMAILJS_PUBLIC_KEY ||
      !process.env.EMAILJS_SERVICE_ID ||
      !process.env.EMAILJS_TEMPLATE_ID) {
    console.error("❗ Missing one or more environment variables");
    return { statusCode: 500, body: 'Env vars not set' };
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
    console.log("✅ Email sent successfully");
    return { statusCode: 200, body: 'OK' };
  } catch (error) {
    console.error("❌ EmailJS Error:", error);
    return { statusCode: 500, body: 'Failed to send email' };
  }
};
