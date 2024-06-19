import express from 'express'
import UploadControllers from '../../../controllers/shopify/upload.controller.js'
import MiddlewareCommons from '../../../middlewares/common.js'
import ValidateMulter from '../../../middlewares/validateMulter.js'

const router = express.Router()

router.post(
    '/single',
    MiddlewareCommons.checkFolderExist,
    ValidateMulter.image.single,
    UploadControllers.single
)

router.post(
    '/multi',
    MiddlewareCommons.checkFolderExist,
    ValidateMulter.image.multi,
    UploadControllers.multi
)

router.post(
    '/single/font',
    MiddlewareCommons.checkFolderExist,
    ValidateMulter.font.single,
    UploadControllers.singleFont
)
router.post(
    '/multi/font',
    MiddlewareCommons.checkFolderExist,
    ValidateMulter.font.multi,
    UploadControllers.multiFonts
)

export default router
