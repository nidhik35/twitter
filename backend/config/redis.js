const { createClient } = require("redis");



const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("connect", () => {
  console.log("Redis Connected");
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});

async function connectRedis() {
  try {
    await redisClient.connect();
  } catch (error) {
    console.log(error);
  }
}

connectRedis();

module.exports = redisClient;

redisClient.on("connect", () => {
  console.log("Redis Connected");
});

redisClient.on("error", (err) => {
  console.log("Redis Error:", err);
});

async function connectRedis() {
  try {
    await redisClient.connect();
  } catch (error) {
    console.log(error);
  }
}

connectRedis();

module.exports = redisClient;