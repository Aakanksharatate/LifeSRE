require("dotenv").config();
const twilio = require("twilio");
const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendWhatsApp(message) {
  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: process.env.USER_WHATSAPP_NUMBER,
      body: message,
    });

    console.log("WhatsApp sent:", message);
  } catch (error) {
    console.error("Twilio error:", error.message);
  }
}

module.exports = sendWhatsApp;