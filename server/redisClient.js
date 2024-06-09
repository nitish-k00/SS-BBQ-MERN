const redis = require("redis");

const redisClient = redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379
  }
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to REDIS");
  } catch (err) {
    console.error("Redis connection error:", err);
  }
};

connectRedis();

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = redisClient;
