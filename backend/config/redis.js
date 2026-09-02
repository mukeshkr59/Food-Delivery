import { createClient } from "redis";

const redisClient = process.env.REDIS_URL
  ? createClient({ url: process.env.REDIS_URL })
  : null;

if (redisClient) {
  redisClient.on("error", (error) => {
    console.error("Redis error:", error.message);
  });
}

const connectRedis = async () => {
  if (!redisClient) {
    console.log("Redis disabled: REDIS_URL is not configured");
    return;
  }

  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (error) {
    console.error(
      "Redis connection failed. Continuing without cache:",
      error.message,
    );
  }
};

const getCache = async (key) => {
  if (!redisClient?.isReady) return null;

  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error("Redis read failed:", error.message);
    return null;
  }
};

const setCache = async (key, value, ttlSeconds) => {
  if (!redisClient?.isReady) return;

  try {
    await redisClient.setEx(key, ttlSeconds, value);
  } catch (error) {
    console.error("Redis write failed:", error.message);
  }
};

const deleteCache = async (key) => {
  if (!redisClient?.isReady) return;

  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Redis delete failed:", error.message);
  }
};

export { connectRedis, getCache, setCache, deleteCache };
