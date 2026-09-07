require("dotenv").config();

const { Worker } = require("bullmq");
const IORedis = require("ioredis");

const Product = require("../models/Product");
const User = require("../models/User");
const { emailQueue } = require("../queues/emailQueue");

const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

const outOfStockWorker = new Worker(
  "outOfStockQueue",
  async (job) => {
    console.log(`Checking out-of-stock products. Job: ${job.id}`);

    const products = await Product.find({
      quantity: 0,
    });

    if (products.length === 0) {
      console.log("No out-of-stock products found.");
      return {
        count: 0,
      };
    }

    console.log(`${products.length} out-of-stock product(s) found.`);

    const users = await User.find({
      email: { $exists: true, $ne: "" },
    }).select("email");

    for (const user of users) {
      const productList = products
        .map(
          (product) => `
            <li>
              ${product.name}
            </li>
          `,
        )
        .join("");

      await emailQueue.add("outOfStockNotification", {
        to: user.email,
        subject: "Out-of-Stock Product Notification",
        html: `
          <h2>Shopping API</h2>

          <p>Hello,</p>

          <p>The following products are currently out of stock:</p>

          <ul>
            ${productList}
          </ul>

          <p>Please restock these products.</p>
        `,
      });
    }

    console.log("Out-of-stock notification emails queued.");

    return {
      count: products.length,
      usersNotified: users.length,
    };
  },
  {
    connection,
    concurrency: 1,
  },
);

outOfStockWorker.on("completed", (job) => {
  console.log(`Out-of-stock job ${job.id} completed.`);
});

outOfStockWorker.on("failed", (job, error) => {
  console.error(
    `Out-of-stock job ${job?.id || "unknown"} failed:`,
    error.message,
  );
});

outOfStockWorker.on("error", (error) => {
  console.error("Out-of-stock worker error:", error.message);
});

console.log("Out-of-stock worker is running...");
