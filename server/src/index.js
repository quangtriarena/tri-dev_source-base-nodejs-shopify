import compression from 'compression'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'

import './configs/databaseConfig.js'
import redisClient from './configs/redisConfig.js'
import './models/index.js'
import ROUTER from './routes/index.js'
import { morganMiddleware } from './utils/morganMiddleware.js'

const app = express()

//#region [LOAD THE SUITABLE .env FILE BASED ON NODE_ENV]
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
dotenv.config({ path: envFile })
//#endregion

//#region [TEST REDIS]
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
    res.send('đã update mới !!! ádsadda')
})
//#endregion

//#region [ROUTES]
app.use('/app/admin', ROUTER.AdminRoutes)
app.use('/app/learn', ROUTER.LearnRoutes)

//#endregion

export default app
