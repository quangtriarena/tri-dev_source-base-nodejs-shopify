import productQueue from '../../../background-job/products/producers/product.queue.js'
import generateRandomData from '../../../helpers/generateRandomProductBySize.js'
import { v4 as uuidv4 } from 'uuid'

const Services = {
    findAll: async (req, res) => {
        try {
        } catch (error) {
            console.log(error)
            throw error
        }
    },

    findById: async (req, res) => {
        try {
        } catch (error) {
            console.log(error)
            throw error
        }
    },

    create: async (req, res) => {
        try {
        } catch (error) {
            console.log(error)
            throw error
        }
    },

    update: async (req, res) => {
        try {
        } catch (error) {
            console.log(error)
            throw error
        }
    },

    _delete: async (req, res) => {
        try {
        } catch (error) {
            console.log(error)
            throw error
        }
    },

    bulkCreated: async (size) => {
        try {
            const randomDataBySize = generateRandomData(size)

            const _data = {
                id: uuidv4(),
                data: randomDataBySize,
            }

            await productQueue.addJob(_data)
        } catch (error) {
            throw error
        }
    },
}

export default Services
