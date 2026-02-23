const express = require("express");
const router = express.Router();
const Contract = require("../models/Contract");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const { google } = require("googleapis");
const oauth2Client = require("../config/googleAuth");
const generateCancellationEmail = require("../services/remediationService");
const sendWhatsApp = require("../services/whatsappService");

router.post("/:id/switch", async (req, res) => {
  try {
    const { potentialSavings } = req.body;

    // 1️⃣ Get contract FIRST
    const contract = await Contract.findById(req.params.id);
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    if (contract.status === "ARCHIVED") {
      return res.status(400).json({ message: "Already switched" });
    }

    // 2️⃣ Then get user
    const user = await User.findById(contract.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ Set Gmail credentials
    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // 4️⃣ Generate cancellation email
    let emailContent;

    try {
      emailContent = await generateCancellationEmail(contract);
    } catch (err) {
      console.log("⚠️ OpenAI failed. Using fallback email.");
      emailContent = `
        Dear ${contract.vendor},

        Please cancel my subscription effective immediately.
        Do not auto-renew my plan.

        Thank you.
        `;
    }

    const recipient =
      contract.senderEmail ||
      `support@${contract.vendor.toLowerCase().replace(/\s/g, "")}.com`;

    const message = [
      `To: ${recipient}`,
      "Subject: Subscription Cancellation Request",
      "",
      emailContent,
    ].join("\n");

    const encodedEmail = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: encodedEmail },
    });

    console.log("📧 Cancellation email sent");

    // 5️⃣ Update contract
    contract.status = "ARCHIVED";
    contract.potentialSavings = potentialSavings || 0;
    await contract.save();

    // 6️⃣ Update savings
    user.savingsTotal += potentialSavings || 0;

    const month = new Date().toISOString().slice(0, 7);

    const existingMonth = user.monthlySavings.find((m) => m.month === month);

    if (existingMonth) {
      existingMonth.amount += potentialSavings || 0;
    } else {
      user.monthlySavings.push({
        month,
        amount: potentialSavings || 0,
      });
    }

    await user.save();

    // 7️⃣ WhatsApp notification
    await sendWhatsApp(
      `LifeSRE Update:
      Your ${contract.vendor} contract was successfully cancelled.

      You saved ₹${potentialSavings}.
      Total savings: ₹${user.savingsTotal}.`
    );

    // 8️⃣ Audit log
    await AuditLog.create({
      userId: user._id,
      contractId: contract._id,
      action: "SWITCH_EXECUTED",
      metadata: {
        vendor: contract.vendor,
        savings: potentialSavings,
      },
    });

    res.json({
      message: "Contract switched successfully",
      savingsTotal: user.savingsTotal,
    });
  } catch (err) {
    console.error("Switch Error:", err.message);
    res.status(500).json({ message: "Error switching contract" });
  }
});

module.exports = router;
