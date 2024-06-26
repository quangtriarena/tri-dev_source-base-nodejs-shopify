import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js'
import { ExpressAdapter } from '@bull-board/express'
import compression from 'compression'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import products from './background-job/products/producers/product.queue.js'
import redisClient from './configs/redisConfig.js'
import { morganMiddleware } from './utils/morganMiddleware.js'
import ROUTER from './routes/index.js'

import './background-job/index.js'
import './configs/databaseConfig.js'
import './models/index.js'

const PORT = process.env.PORT || 2222
const app = express()

//#region [BULL-BOARD]
const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath('/admin/queues')

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: [new BullMQAdapter(products.queue)],
    serverAdapter: serverAdapter,
})
//#endregion

//#region [Load the appropriate .env file based on NODE_ENV]
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
dotenv.config({ path: envFile })

//#endregion

//#region [test redis]
redisClient.set('test-redis', 'Redis online ne !!!', (err, reply) => {
    if (err) {
        console.error('Redis connection error:', err)
    } else {
        console.log('Redis connected successfully. Test key set:', reply)
    }
})
//#endregion

//#region [MIDDLEWARES APPS - public - cors - morganMiddleware - bodyParser...]
app.use('/static', express.static(path.join(process.cwd(), 'public')))
app.use(morganMiddleware)
app.use(
    cors({
        origin: '*',
    })
)
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: '50mb' }))
app.use(compression())
//#endregion

//#region [ROUTE TEST SERVER]
app.get('/', (req, res) => {
    res.send('đã update mới !!!')
})
//#endregion

//#region [ROUTES]
app.use('/app/admin', ROUTER.AdminRoutes)
app.use('/app/external', ROUTER.ExternalRoutes)
app.use('/app/learn', ROUTER.LearnRoutes)
app.use('/admin/queues', serverAdapter.getRouter())
//#endregion

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})
