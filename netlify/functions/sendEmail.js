exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: "Preflight OK",
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, email, subject, message } = data;

    // Validasi input
    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ error: "Semua field wajib diisi" }),
      };
    }

    // Kirim ke EmailJS di sini...
    // (Kamu bisa pakai fetch ke EmailJS endpoint atau service lainnya)

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Pesan berhasil dikirim" }),
    };
  } catch (error) {
    console.error("Error kirim pesan:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};
