import { Queue } from 'bullmq'
import redisConfig from '../../../configs/redisConfig.js'

const queue = new Queue('products', { connection: redisConfig })

const productQueue = {
    async addJob(data) {
        try {
            return await queue.add('products/create', data, { delay: 500 })
        } catch (error) {
            throw error
        }
    },
}

export default { ...productQueue, queue }
