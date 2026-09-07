const { Worker } = require("bullmq");
const redis = require("../config/redis");

const sendInvoiceEmail = require("../utils/sendInvoiceEmail");

const worker = new Worker(
  "invoice-email",
  async (job) => {
    console.log(`Processing invoice job: ${job.id}`);

    await sendInvoiceEmail(job.data);

    console.log(`Invoice email sent for job: ${job.id}`);
  },
  {
    connection: redis,
    concurrency: 5,
  },
);

worker.on("completed", (job) => {
  console.log(`Invoice job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`Invoice job failed: ${job?.id}`, err.message);
});

worker.on("error", (err) => {
  console.error("Invoice worker error:", err.message);
});
