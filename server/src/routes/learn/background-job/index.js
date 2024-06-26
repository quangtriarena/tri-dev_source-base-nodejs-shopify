import express from 'express'
import Queue from '../../../background-job/learn/configs/queue.js'
import Worker from '../../../background-job/learn/configs/worker.js'
import productQueue from '../../../background-job/products/producers/product.queue.js'

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const { size } = req.query

        await productQueue.addJob(
            Array.from({ length: Number(size) }).map((_item, i) => {
                return {
                    name: 'Marcus Allen' + i,
                    age: i,
                    gender: i % 2 === 0 ? 'Male' : 'Female',
                    email: 'email' + i + '@gmail.com',
                    address: 'address' + i,
                }
            })
        )

        //#region [CODE TEST]
        // const productQueue = new Queue()
        // const worker = new Worker(productQueue)
        // // step 1: add 10 jobs to the queue
        // for (let i = 1; i <= size; i++) {
        //     productQueue.addJob({ name: 'Marcus Allen' + i })
        // }
        // setTimeout(() => {
        //     worker.start()
        // }, 2000)
        //#endregion
        return res.status(200).json({ message: 'Background job is running' })
    } catch (error) {
        console.log('error', error)
    }
})

export default router
