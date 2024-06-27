import { Server } from 'socket.io'

class SocketIO {
    constructor() {
        this.io = null
        this.callback = null
    }

    init(server) {
        console.log('Initializing Socket.IO...')
        let io = new Server(server, {
            cors: {
                origin: '*',
            },
        })

        io.on('connection', (socket) => {
            console.log('1. New client connected:', socket.id)

            socket.on('disconnect', () => {
                console.log('2. Client disconnected:', socket.id)
            })
        })

        if (this.callback) {
            this.callback(io)
        } else {
            this.io = io
        }

        return io
    }

    getSocketIOInstance = (_callback) => {
        if (!this.io) {
            this.callback = _callback
        } else {
            return _callback(this.io)
        }
    }
}

const socketIO = new SocketIO()

export default socketIO
