import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import './configs/databaseConfig.js'
import redisClient from './configs/redisConfig.js'
import './models/index.js'
import AdminRoutes from './routes/index.js'
import { morganMiddleware } from './utils/morganMiddleware.js'

//#region [Load the appropriate .env file based on NODE_ENV]
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
dotenv.config({ path: envFile })
//#endregion

const PORT = process.env.PORT || 3333
const app = express()

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
app.use(bodyParser.urlencoded({ extended: true }))
//#endregion

//#region [ROUTE TEST SERVER]
app.get('/', (req, res) => {
    res.send('Hello World!')
})
//#endregion

//#region [ROUTES]
app.use('/app/admin', AdminRoutes)
//#endregion

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})
