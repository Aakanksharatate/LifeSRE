// routes/gmailRoutes.js

const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Contract = require("../models/Contract");

const calculateRisk = require("../services/riskEngine");
const fetchFullEmails = require("../services/gmailService");
const extractContractDetails = require("../services/extractionService");

function parseAmount(amountString) {
  if (!amountString) return 0;
  return Number(amountString.replace(/[^\d]/g, ""));
}

function parseDate(dateString) {
  if (!dateString) return null;
  const parsed = new Date(dateString);
  return isNaN(parsed) ? null : parsed;
}

router.get("/fetch/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const emails = await fetchFullEmails(user);
    console.log("📩 Emails fetched:", emails.length);

    const savedContracts = [];

    for (let email of emails) {
      const extracted = extractContractDetails(email.text, email.subject);

      if (!extracted.vendor || extracted.vendor === "Unknown Vendor") {
        extracted.vendor = email.subject || "Unknown Service";
      }

      const renewalDate = parseDate(extracted.renewalDate);
      const renewalAmount = parseAmount(extracted.renewalAmount);
      console.log("Extracted:", extracted);
      console.log("Parsed date:", renewalDate);
      console.log("Parsed amount:", renewalAmount);

      if (!renewalDate || renewalAmount === 0) {
        continue;
      }

      const riskData = calculateRisk(renewalDate, renewalAmount);

      const existing = await Contract.findOne({
        userId: user._id,
        vendor: extracted.vendor,
        renewalDate,
        renewalAmount,
      });

      if (existing) {
        continue;
      }

      const newContract = await Contract.create({
        userId: user._id,
        vendor: extracted.vendor,
        renewalDate,
        renewalAmount,
        contractType: extracted.contractType || "Unknown",
        cancellationWindow: extracted.cancellationWindow || "Unknown",
        rawText: email.text,
        status: "ACTIVE",
        ...riskData,
      });

      savedContracts.push(newContract);
    }

    res.json(savedContracts);
  } catch (err) {
    console.error("❌ Gmail Fetch Error:", err.message);
    res.status(500).json({ message: "Error fetching emails" });
  }
});

module.exports = router;
