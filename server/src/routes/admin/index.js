import express from 'express'
import UploadRouter from './v1/upload.js'
import ProductRouter from './v1/products.js'
import MetafieldRouter from './v1/metafield.js'

const router = express.Router()

router.use('/v1/upload', UploadRouter)
router.use('/v1/products', ProductRouter)
router.use('/v1/metafield/definitions', MetafieldRouter)

export default router
