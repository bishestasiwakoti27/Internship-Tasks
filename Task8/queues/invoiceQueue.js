const { Queue } = require("bullmq");
const redis = require("../config/redis");

const invoiceQueue = new Queue("invoice-email", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 100,
    removeOnFail: false,
  },
});

module.exports = invoiceQueue;
