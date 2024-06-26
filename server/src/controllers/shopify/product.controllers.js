import ProductServices from '../../services/shopify/product/product.services.js'

const Controllers = {
    findAll: async (req, res) => {
        try {
        } catch (error) {
            console.log(error)
        }
    },

    findById: async (req, res) => {
        try {
        } catch (error) {
            console.log(error)
        }
    },

    create: async (req, res) => {
        try {
        } catch (error) {
            console.log(error)
        }
    },

    update: async (req, res) => {
        try {
        } catch (error) {
            console.log(error)
        }
    },

    _delete: async (req, res) => {
        try {
        } catch (error) {
            console.log(error)
        }
    },

    bulkCreated: async (req, res) => {
        try {
            // body gửi lên kèm theo số lượng
            // vd: size = 100
            const { size } = req.query

            const data = await ProductServices.bulkCreated(size)

            return res.status(200).json({
                message: 'Add job success',
            })
        } catch (error) {
            console.log(error)
        }
    },
}

export default Controllers
