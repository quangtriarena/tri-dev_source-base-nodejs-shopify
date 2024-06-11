import { Worker } from "bullmq";

const worker = new Worker("product", async (job) => {
	console.log("job.data", job.data);
});

worker.on("completed", (job) => {
	console.log("Job completed:", job.data);
});

worker.on("failed", (job, err) => {
	console.log("Job failed:", job.data);
	console.error(err);
});

worker.on("progress", (job, progress) => {
	console.log("Job progress:", progress);
});
