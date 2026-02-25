const express = require("express");
const router = express.Router();
const Contract = require("../models/Contract");
const sendWhatsApp = require("../services/whatsappService");

/**
 * MARK AS PAID
 */
router.post("/paid", async (req, res) => {
  try {
    const { contractId } = req.body;
    if (!contractId) return res.status(400).json({ message: "contractId is required" });

    const contract = await Contract.findById(contractId);
    if (!contract) return res.status(404).json({ message: "Contract not found" });

    contract.lastPaidOn = new Date();
    contract.status = "PAID";
    await contract.save();

    const message = `✅ Payment Confirmed\n\n${contract.vendor}\nAmount Paid: ₹${contract.renewalAmount}`;

    try {
      await sendWhatsApp(message);
      console.log("📲 WhatsApp message sent:", message);
    } catch (err) {
      console.log("📌 WhatsApp not sent, logging instead:", message);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Paid Route Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * CANCEL SUBSCRIPTION
 */
router.post("/cancel", async (req, res) => {
  try {
    const { contractId } = req.body;
    if (!contractId) return res.status(400).json({ message: "contractId is required" });

    const contract = await Contract.findById(contractId);
    if (!contract) return res.status(404).json({ message: "Contract not found" });

    contract.status = "CANCELLED";
    await contract.save();

    const message = `❌ Subscription Cancelled\n\n${contract.vendor}\nNo further charges will apply.`;

    try {
      await sendWhatsApp(message);
      console.log("📲 WhatsApp message sent:", message);
    } catch (err) {
      console.log("📌 WhatsApp not sent, logging instead:", message);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Cancel Route Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;