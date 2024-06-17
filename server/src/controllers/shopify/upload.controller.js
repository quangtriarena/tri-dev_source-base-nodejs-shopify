import UploadServices from '../../services/shopify/upload/upload.services.js'
import ResponseHandler from '../../utils/responseHandler.js'

const UploadControllers = {
    single: async (req, res) => {
        try {
            const file = req.file

            if (!file) {
                return res.status(400).send('No file uploaded.')
            }

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

            if (!files) {
                return res.status(400).send('No file uploaded.')
            }

            const _result = await UploadServices.multi(files)
            console.log('_result', _result)

            return ResponseHandler.success({ res, data: _result, message: 'Upload success' })
        } catch (error) {
            console.log('UploadControllers multi error', error)
            return ResponseHandler.error({ res, error, message: 'Upload error' })
        }
    },
}

export default UploadControllers
