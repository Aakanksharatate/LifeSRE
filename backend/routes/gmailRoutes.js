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

      // ✅ FIX 1: Await extraction
      const extractedRaw = await extractContractDetails(email.text);

      const extracted =
        typeof extractedRaw === "string"
          ? JSON.parse(extractedRaw)
          : extractedRaw;

      // ✅ FIX 2: Proper vendor replacement
      let vendorName = extracted.vendor;

      if (
        !vendorName ||
        vendorName === "Unknown" ||
        vendorName === "Unknown Vendor" ||
        vendorName === "Subject" ||
        vendorName === "Unknown Service"
      ) {
        vendorName = email.subject?.trim() || "Unknown Service";
      }

      const renewalDate = parseDate(extracted.renewalDate);
      const renewalAmount = parseAmount(extracted.renewalAmount);

      console.log("Final Vendor:", vendorName);

      if (!renewalDate || renewalAmount === 0) {
        continue;
      }

      const riskData = calculateRisk(renewalDate, renewalAmount);

      // ✅ FIX 3: Prevent duplicates using Gmail message ID
      const existing = await Contract.findOne({
        userId: user._id,
        gmailMessageId: email.id,
      });

      if (existing) {
        continue;
      }

      const newContract = await Contract.create({
        userId: user._id,
        gmailMessageId: email.id, // store gmail id
        vendor: vendorName,
        renewalDate,
        renewalAmount,
        senderEmail: email.senderEmail,
        threadId: email.threadId,
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