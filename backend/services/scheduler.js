const sendWhatsApp = require("./whatsappService");
const cron = require("node-cron");
const Contract = require("../models/Contract");


// Run every minute for testing
cron.schedule("* * * * *", async () => {
  console.log("Checking subscriptions...");

  try {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const contracts = await Contract.find();

    for (const contract of contracts) {
      const name =
        contract.vendor ||
        contract.serviceName ||
        contract.title ||
        "Service";

      const renewalDate = new Date(
        contract.renewalDate || contract.nextBillingDate
      );

      // 1. Renewal Reminder
      if (
        renewalDate &&
        renewalDate.toDateString() === tomorrow.toDateString()
      ) {
        await sendWhatsApp(
          `LifeSRE Reminder:\n${name} renews tomorrow.`
        );
      }

      // 2. High Risk Alert
      if (
        contract.riskLevel === "HIGH" ||
        contract.riskLevel === "High"
      ) {
        await sendWhatsApp(
          `LifeSRE Alert:\n${name} is marked as HIGH RISK.`
        );
      }

      // 3. Savings Suggestion
      if (contract.potentialSavings && contract.potentialSavings > 0) {
        await sendWhatsApp(
          `LifeSRE Suggestion:\nYou can save ₹${contract.potentialSavings} on ${name}.`
        );
      }
    }
  } catch (error) {
    console.error("Scheduler error:", error.message);
  }
});