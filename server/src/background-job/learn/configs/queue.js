class Queue {
    constructor() {
        this.queue = []
        this.id = Date.now()
    }

    enqueue(job) {
        this.queue.push(job)
    }

    addJob(job) {
        this.queue.push(job)
    }

    dequeue() {
        return this.queue.shift()
    }

    isEmpty() {
        return this.queue.length === 0
    }
}

export default Queue
