require("dotenv").config();

const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const transporter = require("../config/email");

const connection = new IORedis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
});

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    console.log(`Processing email job: ${job.id}`);
    console.log(`Job type: ${job.name}`);

    const { to, subject, html, text } = job.data;

    if (!to) {
      throw new Error("Recipient email is required");
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: subject || "Shopping API",
      text: text || "",
      html: html || "",
    });

    console.log(`Email sent successfully to ${to}`);

    return {
      success: true,
      recipient: to,
    };
  },
  {
    connection,
    concurrency: 5,
  },
);

emailWorker.on("completed", (job) => {
  console.log(`Email job ${job.id} completed`);
});

emailWorker.on("failed", (job, error) => {
  console.error(
    `Email job ${job?.id || "unknown"} failed:`,
    error.message,
  );
});

emailWorker.on("error", (error) => {
  console.error("Email worker error:", error.message);
});

console.log("Email worker is running...");
