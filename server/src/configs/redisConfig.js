import Redis from "ioredis";

const redisConfig = {
	production: {
		connectionString: process.env.REDIS_PROD_CONNECTION_STRING,
	},
	development: {
		connectionString: process.env.REDIS_STAGING_CONNECTION_STRING || "redis://127.0.0.1:6379",
	},
};

const environment = process.env.NODE_ENV || "development";
const redisClient = new Redis(redisConfig[environment].connectionString);

// Handle connection and error events
redisClient.on("connect", () => {
	console.log("Redis client connected");
});

redisClient.on("error", (err) => {
	console.error("Redis client error:", err);
});

export default redisClient;
