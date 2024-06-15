import dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import AdminRoutes from "./routes/index.js";
import redisClient from "./configs/redisConfig.js";
import { morganMiddleware } from "./utils/morganMiddleware.js";
import "./configs/databaseConfig.js";
import "./models/index.js";

//#region [test redis]
redisClient.set("test-redis", "Redis online ne !!!", (err, reply) => {
	if (err) {
		console.error("Redis connection error:", err);
	} else {
		console.log("Redis connected successfully. Test key set:", reply);
	}
});
//#endregion

const PORT = process.env.SERVER_PORT || 3333;
const app = express();

app.use(morganMiddleware);

app.use(
	cors({
		origin: "*",
	})
);
app.use(bodyParser.urlencoded({ extended: true }));

//#region [ROUTE TEST SERVER]
app.get("/", (req, res) => {
	res.send("Hello World!");
});
//#endregion

//#region [ROUTES]
app.use("/app/admin", AdminRoutes);
//#endregion

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});
