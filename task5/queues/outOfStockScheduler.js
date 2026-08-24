require("dotenv").config();

const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

const outOfStockQueue = new Queue("outOfStockQueue", {
  connection,
});

async function scheduleOutOfStockJob() {
  await outOfStockQueue.upsertJobScheduler(
    "out-of-stock-check",
    {
      every: 60 * 60 * 1000,
    },
    {
      name: "checkOutOfStock",
      data: {
        source: "scheduled-job",
      },
      opts: {
        removeOnComplete: true,
        removeOnFail: false,
      },
    },
  );

  console.log("Out-of-stock job scheduled successfully.");
  console.log("It will run every 1 hour.");
}

scheduleOutOfStockJob()
  .then(() => connection.quit())
  .catch(async (error) => {
    console.error("Scheduler error:", error);
    await connection.quit();
    process.exit(1);
  });
