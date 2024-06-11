import { Queue } from "bullmq";
import redisConfig from "../../../configs/redisConfig.js";

const queue = new Queue("create-product", { connection: redisConfig });

const productQueue = {
	async addJob(data) {
		await queue.add("product", data);
	},
};

export default productQueue;
