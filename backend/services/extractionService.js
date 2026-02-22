// services/extractionService.js

const OpenAI = require("openai");

let openai;

// Only initialize if API key exists
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

async function extractContractDetails(emailText) {
  try {
    // 🧪 DEV MODE: skip OpenAI if quota exhausted or no key
    if (!openai) {
      console.log("⚠️ OpenAI not configured. Using mock extraction.");
      return JSON.stringify(mockExtraction(emailText));
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Extract contract details and return STRICT JSON only with no explanation.",
        },
        {
          role: "user",
          content: `
Extract details from this email:

${emailText}

Return format:
{
  "vendor": "",
  "renewalDate": "",
  "renewalAmount": "",
  "contractType": "",
  "cancellationWindow": ""
}
          `,
        },
      ],
    });

    return response.choices[0].message.content;

  } catch (error) {
    console.error("❌ OpenAI Error:", error.message);

    // Fallback to mock extraction if quota error
    return JSON.stringify(mockExtraction(emailText));
  }
}

// 🔥 Simple fallback logic (basic keyword detection)
function mockExtraction(text) {
  return {
    vendor: detectVendor(text),
    renewalDate: detectDate(text),
    renewalAmount: detectAmount(text),
    contractType: "Unknown",
    cancellationWindow: "Unknown",
  };
}

function detectVendor(text) {
  if (!text) return "Unknown";
  if (text.toLowerCase().includes("netflix")) return "Netflix";
  if (text.toLowerCase().includes("amazon")) return "Amazon";
  if (text.toLowerCase().includes("insurance")) return "Insurance Provider";
  if (text.toLowerCase().includes("Driver License")) return "Insurance Provider";
  return "Subject";
}

function detectDate(text) {
  const match = text.match(/\d{1,2}\s\w+\s\d{4}/);
  return match ? match[0] : "Unknown";
}

function detectAmount(text) {
  const match = text.match(/₹\s?\d+/);
  return match ? match[0] : "Unknown";
}

module.exports = extractContractDetails;