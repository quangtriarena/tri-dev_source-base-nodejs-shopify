import express from 'express'
import UploadRouter from './admin/v1/upload.js'
import ProductRouter from './admin/v1/products.js'
import MetafieldRouter from './admin/v1/metafield.js'

const router = express.Router()

router.use('/v1/upload', UploadRouter)
router.use('/v/products', ProductRouter)
router.use('/v1/metafield/definitions', MetafieldRouter)

export default router
