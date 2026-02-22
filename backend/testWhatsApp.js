require("dotenv").config();
const sendWhatsApp = require("./services/whatsappService");

sendWhatsApp("Test message from LifeSRE");
console.log(process.env.USER_WHATSAPP_NUMBER);