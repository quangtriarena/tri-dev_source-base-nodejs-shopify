import { Worker } from 'bullmq'
import redisConfig from '../../../configs/redisConfig.js'

const worker = new Worker(
    'products',
    async (job) => {
        try {
            console.log('job.data', job.data)
        } catch (error) {
            console.log('Worker product error', error)
        }
    },
    { connection: redisConfig, concurrency: 1 }
)

worker.on('ready', async (job) => {
    console.log('worker is running')
})

worker.on('active', async (job) => {
    console.log('worker is active')
})

worker.on('completed', async () => {
    console.log('worker is completed')
})

worker.on('failed', (job, err) => {
    console.log('Job failed:', job.data)
    console.error(err)
})

worker.on('progress', async (job, progress) => {
    console.log('job', job)
    console.log('Job progress:', progress)
})

export default worker
