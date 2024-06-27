import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js'
import { ExpressAdapter } from '@bull-board/express'
import dotenv from 'dotenv'
import { createServer } from 'http'
import startAllWorkers from './background-job/index.js'
import products from './background-job/products/producers/product.queue.js'
import socketIO from './configs/socketioConfig.js'
import app from './index.js'
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
dotenv.config({ path: envFile })

const PORT = process.env.PORT || 2222

const server = createServer(app)
const io = socketIO.init(server)

io.on('connection', (socket) => {
    console.log('socket', socket.id)
})

//#region [BULL-BOARD]
const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath('/admin/queues')

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: [new BullMQAdapter(products.queue)],
    serverAdapter: serverAdapter,
})
//#endregion

app.use('/admin/queues', serverAdapter.getRouter())

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)

    startAllWorkers()
})

export default server
