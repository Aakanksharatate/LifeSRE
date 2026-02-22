const sendWhatsApp = require("./whatsappService");
const cron = require("node-cron");
const Contract = require("../models/Contract");

// Run every minute (testing)
cron.schedule("* * * * *", async () => {
  console.log("Checking subscriptions...");

  try {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const contracts = await Contract.find({
      status: { $ne: "ARCHIVED" } // don't notify archived
    });

    for (const contract of contracts) {
      const name =
        contract.vendor ||
        contract.serviceName ||
        contract.title ||
        "Service";

      const renewalDate = new Date(contract.renewalDate);

      // 1️⃣ Renewal Reminder (ONLY ONCE)
      if (
        renewalDate &&
        renewalDate.toDateString() === tomorrow.toDateString() &&
        !contract.renewalReminderSent
      ) {
        await sendWhatsApp(
          `LifeSRE Reminder:\n${name} renews tomorrow.`
        );

        contract.renewalReminderSent = true;
        await contract.save();
      }

      // 2️⃣ High Risk Alert (ONLY ONCE)
      if (
        contract.riskLevel === "HIGH" &&
        !contract.riskAlertSent
      ) {
        await sendWhatsApp(
          `LifeSRE Alert:\n${name} is marked as HIGH RISK.`
        );

        contract.riskAlertSent = true;
        await contract.save();
      }

      // 3️⃣ Savings Suggestion (ONLY ONCE)
      if (
        contract.potentialSavings > 0 &&
        !contract.savingsAlertSent
      ) {
        await sendWhatsApp(
          `LifeSRE Suggestion:\nYou can save ₹${contract.potentialSavings} on ${name}.`
        );

        contract.savingsAlertSent = true;
        await contract.save();
      }
    }
  } catch (error) {
    console.error("Scheduler error:", error.message);
  }
});