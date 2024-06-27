import { Worker } from 'bullmq'
import redisConfig from '../../../configs/redisConfig.js'
import ProductMiddleware from '../../../middlewares/product.js'
import EntryModels from '../../../models/index.js'
import socketIO from '../../../configs/socketioConfig.js'

const worker = new Worker(
    'products',
    async (job) => {
        try {
            const { data } = job

            let arrayFail = []

            const TOTAL_STEP = data.data.length

            let result = await new Promise((resolve, reject) => {
                let countTask = data.data.length

                for (let i = 0; i < data.data.length; i++) {
                    let item = data.data[i]

                    setTimeout(() => {
                        const progress = Math.trunc((i * 100) / TOTAL_STEP)

                        job.updateProgress(progress)

                        ProductMiddleware.create(item)
                            .then((_res) => {
                                countTask--

                                socketIO.getSocketIOInstance((_io) => {
                                    _io.emit('job-progress', { jobId: job.id, progress })
                                })
                            })
                            .catch((_err) => {
                                arrayFail.push(item)

                                countTask--
                            })
                            .finally(() => {
                                if (countTask === 0) {
                                    job.updateProgress(100)
                                    resolve(1)
                                }
                            })
                    }, i * 200)
                }
            })

            console.log('arrayFail >>>>>', arrayFail)

            return result
        } catch (error) {
            console.log('Worker product error', error)
        }
    },
    { connection: redisConfig, concurrency: 1 }
)

worker.on('ready', async (job) => {
    console.log('----------------- WORKER IS READY -----------------')
})

worker.on('active', async (job) => {
    console.log('----------------- WORKER IS ACTIVE -----------------')

    /**
     * save job id to database
     */

    await EntryModels.QueueModel.create({
        queueId: job.id,
        queueName: job.queue.name,
        jobName: job.name,
        status: 'processing',
    })
})

worker.on('completed', async (job) => {
    console.log('----------------- WORKER IS COMPLETED -----------------')

    /**
     * remove job id from database
     */

    await EntryModels.QueueModel.update(
        {
            status: 'completed',
        },
        {
            where: {
                queueId: job.id,
            },
        }
    )
})

worker.on('failed', (job, err) => {
    console.log('Job failed:', job.data)
    console.log('----------------- WORKER IS FAILED -----------------')
    console.error(err)
})

worker.on('progress', async (job, progress) => {
    console.log('----------------- WORKER IS PROGRESS -----------------')
    console.log(`Job ${job.id} progress: ${progress}%`)
})

export default worker
