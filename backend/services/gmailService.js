// services/gmailService.js

const { google } = require("googleapis");
const oauth2Client = require("../config/googleAuth");

function decodeBase64(encoded) {
  if (!encoded) return "";

  // Gmail uses base64url
  encoded = encoded.replace(/-/g, "+").replace(/_/g, "/");

  const buff = Buffer.from(encoded, "base64");
  return buff.toString("utf-8");
}

function extractTextFromPayload(payload) {
  if (!payload) return "";

  // Plain text first priority
  if (payload.mimeType === "text/plain" && payload.body?.data) {
    return decodeBase64(payload.body.data);
  }

  // HTML fallback
  if (payload.mimeType === "text/html" && payload.body?.data) {
    return decodeBase64(payload.body.data);
  }

  // Recursively check parts
  if (payload.parts) {
    for (let part of payload.parts) {
      const result = extractTextFromPayload(part);
      if (result) return result;
    }
  }

  return "";
}

function extractHeader(payload, name) {
  const headers = payload.headers || [];
  const header = headers.find(
    (h) => h.name.toLowerCase() === name.toLowerCase()
  );
  return header ? header.value : null;
}

const renewalKeywords = [
  "renew",
  "renewal",
  "auto debit",
  "expires",
  "subscription",
  "policy",
  "charged",
  "billing",
  "premium",
];

function isRenewalEmail(text) {
  if (!text) return false;

  const lowerText = text.toLowerCase();
  return renewalKeywords.some((keyword) =>
    lowerText.includes(keyword)
  );
}

async function fetchFullEmails(user) {
  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
  });

  const listResponse = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
    includeSpamTrash: true,
    q: "newer_than:3d (renew OR renewal OR subscription OR charged OR expires)",
  });

  const messages = listResponse.data.messages || [];

  const filteredEmails = [];

  for (let msg of messages) {
    const message = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
      format: "full",
    });

    const payload = message.data.payload;

    const subject =
      extractHeader(payload, "Subject") || "Unknown Service";

    const fromRaw = extractHeader(payload, "From") || "";

    // Extract pure email from "Netflix <info@netflix.com>"
    const emailMatch = fromRaw.match(/<(.+?)>/);
    const senderEmail = emailMatch
      ? emailMatch[1]
      : fromRaw;

    const textContent = extractTextFromPayload(payload);

    if (isRenewalEmail(textContent)) {
      filteredEmails.push({
        id: msg.id,
        threadId: message.data.threadId,
        subject,
        text: textContent,
        senderEmail,   // 🔥 REAL SENDER EMAIL
      });
    }
  }

  console.log("📩 Emails fetched:", filteredEmails.length);

  return filteredEmails;
}

module.exports = fetchFullEmails;