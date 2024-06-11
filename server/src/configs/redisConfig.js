// config/redisConfig.js
import Redis from "ioredis";

const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = process.env.REDIS_PORT || 6379;
const redisPassword = process.env.REDIS_PASSWORD || null;
const redisDb = process.env.REDIS_DB || 0;

const redisClient = new Redis({
	host: redisHost,
	port: redisPort,
	password: redisPassword,
	db: redisDb,
});

// Xử lý sự kiện kết nối và lỗi
redisClient.on("connect", () => {
	console.log("Redis client connected");
});

redisClient.on("error", (err) => {
	console.error("Redis client error:", err);
});

export default redisClient;
