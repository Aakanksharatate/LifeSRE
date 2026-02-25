// models/Contract.js

const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    vendor: String,
    senderEmail: String,
    threadId: String,
    renewalDate: Date,
    renewalAmount: Number,
    contractType: String,
    cancellationWindow: String,
    gmailMessageId: String,
    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },

    daysLeft: Number,
    potentialSavings: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "SWITCHED", "ARCHIVED","PAID", "CANCELLED"],
      default: "ACTIVE",
    },
    rawText: String,
    renewalReminderSent: { type: Boolean, default: false },
    riskAlertSent: { type: Boolean, default: false },
    savingsAlertSent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Contract", contractSchema);
