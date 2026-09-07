const outOfStockQueue = require("./outOfStockQueue");

const scheduleOutOfStockJob = async () => {
  await outOfStockQueue.upsertJobScheduler(
    "daily-out-of-stock",
    {
      pattern: "0 9 * * *",
    },
    {
      name: "daily-out-of-stock-email",
      data: {},
    },
  );

  console.log("Daily out-of-stock job scheduled.");
};

scheduleOutOfStockJob().catch((err) => {
  console.error("Scheduler error:", err.message);
});
