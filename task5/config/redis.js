const IORedis = require("ioredis");

const redis = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  console.log("Redis Connected Successfully");
});

redis.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

module.exports = redis;
