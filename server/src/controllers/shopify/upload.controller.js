import UploadServices from '../../services/shopify/upload/upload.services.js'

const UploadControllers = {
    single: async (req, res) => {
        try {
            const file = req.file

            if (!file) {
                return res.status(400).send('No file uploaded.')
            }

            const _result = await UploadServices.single(file)
            console.log('_result', _result)

            return res.status(200).json({ message: 'Upload success' })
        } catch (error) {
            console.log('UploadControllers single error', error)
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

            return res.status(200).json({ message: 'Upload success' })
        } catch (error) {
            console.log('UploadControllers multi error', error)
        }
    },
}

export default UploadControllers
