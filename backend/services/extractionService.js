// services/extractionService.js

function extractContractDetails(emailText, subject = "") {
  const vendor = detectVendor(emailText, subject);
  const renewalDate = detectDate(emailText);
  const renewalAmount = detectAmount(emailText);

  return {
    vendor,
    renewalDate,
    renewalAmount,
    contractType: "Subscription",
    cancellationWindow: "Unknown",
  };
}


function detectVendor(text = "", subject = "") {
  const combined = (text + " " + subject).toLowerCase();

  if (combined.includes("netflix")) return "Netflix";
  if (combined.includes("amazon")) return "Amazon";
  if (combined.includes("spotify")) return "Spotify";
  if (combined.includes("insurance")) return "Insurance Provider";
  if (combined.includes("hotstar")) return "Hotstar";

  // fallback → use subject as vendor
  if (subject) return subject;

  return "Unknown Vendor";
}

function detectDate(text = "") {
  const match = text.match(/\d{1,2}\s+\w+\s+\d{4}/);
  return match ? match[0] : null;
}

function detectAmount(text = "") {
  const match = text.match(/₹\s?\d+/);
  return match ? match[0] : null;
}

module.exports = extractContractDetails;