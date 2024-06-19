import express from 'express'
import uploadMiddleware from '../../../configs/multer.js'
import UploadControllers from '../../../controllers/shopify/upload.controller.js'
import MiddlewareCommons from '../../../middlewares/common.js'
import multer from 'multer'
import ValidateMulter from '../../../middlewares/validateMulter.js'

const router = express.Router()

router.post(
    '/single',
    MiddlewareCommons.checkFolderExist,
    uploadMiddleware.withImage.single('files'),
    UploadControllers.single
)

router.post(
    '/multi',
    MiddlewareCommons.checkFolderExist,
    uploadMiddleware.withImage.array('files'),
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
