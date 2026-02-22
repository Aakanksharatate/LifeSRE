// services/gmailService.js

const { google } = require("googleapis");
const oauth2Client = require("../config/googleAuth");

function decodeBase64(encoded) {
  if (!encoded) return "";
  const buff = Buffer.from(encoded, "base64");
  return buff.toString("utf-8");
}

function extractTextFromPayload(payload) {
  if (!payload) return "";

  if (payload.body && payload.body.data) {
    return decodeBase64(payload.body.data);
  }

  if (payload.parts) {
    for (let part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body.data) {
        return decodeBase64(part.body.data);
      }
    }
  }
  return "";
}

const renewalKeywords = [
  "renew",
  "auto debit",
  "expires",
  "subscription renewal",
  "policy valid",
  "will be charged",
  "billing",
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

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const listResponse = await gmail.users.messages.list({
    userId: "me",
    maxResults: 5,
    q: "newer_than:2d",
    includeSpamTrash: true,
    q: "renew OR charged OR subscription OR expires",
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
    const textContent = extractTextFromPayload(payload);

    if (isRenewalEmail(textContent)) {
      filteredEmails.push({
        id: msg.id,
        text: textContent,
      });
    }
  }

  return filteredEmails;
}

module.exports = fetchFullEmails;