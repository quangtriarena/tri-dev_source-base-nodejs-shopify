import express from 'express'
import ProductControllers from '../../../controllers/shopify/product.controllers.js'

const router = express.Router()

router.get('/bulk-created', ProductControllers.bulkCreated)
router.get('/', ProductControllers.findAll)
router.get('/:id', ProductControllers.findById)

router.post('/', ProductControllers.create)
router.put('/:id', ProductControllers.update)
router.delete('/:id', ProductControllers._delete)

export default router
