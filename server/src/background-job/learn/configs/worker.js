import EntryModels from '../../../models/index.js'

class Worker {
    constructor(queue) {
        this.queue = queue
        this.failedJobs = []
    }

    async start() {
        while (true) {
            const job = this.queue.dequeue()
            if (job) {
                try {
                    // Xử lý công việc
                    console.log(`Xử lý công việc: ${job.name}`)
                    console.log('sau 1s sẽ lưu vào db 1 lần')
                    await new Promise((resolve) =>
                        setTimeout(async () => {
                            await EntryModels.ProductModel.create({ name: job.name })
                            resolve(1)
                        }, 1000)
                    )
                    // Giả sử có 30% khả năng công việc thất bại
                    if (Math.random() < 0.3) {
                        throw new Error(`Lỗi trong công việc ${job.name}`)
                    }
                    console.log(`Công việc ${job.name} hoàn thành`)
                } catch (err) {
                    console.log(err.message)
                    this.failedJobs.push(job)
                }
            } else {
                // Nếu không có công việc, đợi 1 giây trước khi kiểm tra lại
                await new Promise((resolve) => setTimeout(resolve, 15000))
            }
        }
    }

    retryFailedJobs() {
        this.failedJobs.forEach((job) => {
            this.queue.enqueue(job)
        })
        this.failedJobs = []
    }
}

export default Worker
