const express = require("express");
const router = express.Router();
const Contract = require("../models/Contract");

/**
 * GET /history/subscriptions/:userId
 * REAL subscription history from DB
 */
router.get("/subscriptions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user contracts (latest first)
    const contracts = await Contract.find({ userId })
      .sort({ updatedAt: -1 });

    const history = contracts.map((c) => ({
      serviceName: c.vendor,
      amount: c.renewalAmount,
      billingCycle: c.billingCycle || "Monthly",
      paidOn: new Date(c.updatedAt).toDateString(),
      saved: c.savedAmount || 0,
    }));

    res.json(history);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ message: "Failed to load history" });
  }
});

module.exports = router;