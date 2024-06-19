import UploadServices from '../../services/shopify/upload/upload.services.js'
import ResponseHandler from '../../utils/responseHandler.js'

const UploadControllers = {
    single: async (req, res) => {
        try {
            const file = req.file

            const _result = await UploadServices.single(file)

            return ResponseHandler.success({ res, data: _result, message: 'Upload success' })
        } catch (error) {
            console.log('UploadControllers single error', error)
            return ResponseHandler.error({ res, error, message: 'Upload error' })
        }
    },

    multi: async (req, res) => {
        try {
            const files = req.files

            const _result = await UploadServices.multi(files)
            console.log('_result', _result)

            return ResponseHandler.success({ res, data: _result, message: 'Upload success' })
        } catch (error) {
            console.log('UploadControllers multi error', error)
            return ResponseHandler.error({ res, error, message: 'Upload error' })
        }
    },

    singleFont: async (req, res) => {
        try {
            const font = req.file

            const _result = await UploadServices.singleFont(font)
            console.log('_result', _result)

            return ResponseHandler.success({ res, data: _result, message: 'Upload font success' })
        } catch (error) {
            console.log('UploadControllers single font error', error)
            return ResponseHandler.error({ res, error, message: 'Upload font error' })
        }
    },

    multiFonts: async (req, res) => {
        try {
            const fonts = req.files

            const _result = await UploadServices.multiFonts(fonts)
            console.log('_result', _result)

            return ResponseHandler.success({ res, data: _result, message: 'Upload fonts success' })
        } catch (error) {
            console.log('UploadControllers multi font error', error)
            return ResponseHandler.error({ res, error, message: 'Upload error' })
        }
    },
}

export default UploadControllers
