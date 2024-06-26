import multer from 'multer'
import uploadMiddleware from '../configs/multer.js'
import STATUS_CODE from '../utils/statusCode.js'

const ValidateMulter = {
    font: {
        single: (req, res, next) => {
            uploadMiddleware.withFont.single('fonts')(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    return res
                        .status(STATUS_CODE.badRequest)
                        .json({ error: 'Multer error', message: err.message })
                } else if (err) {
                    return res
                        .status(STATUS_CODE.badRequest)
                        .json({ error: 'Upload error', message: err.message })
                }

                if (!req.file) {
                    return res.status(STATUS_CODE.badRequest).json({ error: 'No file uploaded' })
                }

                next()
            })
        },

        multi: (req, res, next) => {
            uploadMiddleware.withFont.array('fonts')(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    return res
                        .status(STATUS_CODE.badRequest)
                        .json({ error: 'Multer error', message: err.message })
                } else if (err) {
                    return res
                        .status(STATUS_CODE.badRequest)
                        .json({ error: 'Upload error', message: err.message })
                }

                // Kiểm tra nếu không có file nào được upload
                if (!req.files || req.files.length === 0) {
                    return res
                        .status(STATUS_CODE.badRequest)
                        .json({ error: 'No file fonts uploaded' })
                }

                next()
            })
        },
    },

    image: {
        single: (req, res, next) => {
            uploadMiddleware.withImage.single('files')(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    return res
                        .status(STATUS_CODE.badRequest)
                        .json({ error: 'Multer error', message: err.message })
                } else if (err) {
                    return res
                        .status(STATUS_CODE.badRequest)
                        .json({ error: 'Upload error', message: err.message })
                }

                if (!req.file) {
                    return res
                        .status(STATUS_CODE.badRequest)
                        .json({ error: 'No file image uploaded' })
                }

                next()
            })
        },

        multi: (req, res, next) => {
            uploadMiddleware.withImage.array('files')(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    return res
                        .status(STATUS_CODE.badRequest)
                        .json({ error: 'Multer error', message: err.message })
                } else if (err) {
                    return res
                        .status(STATUS_CODE.badRequest)
                        .json({ error: 'Upload error', message: err.message })
                }

                // Kiểm tra nếu không có file nào được upload
                if (!req.files || req.files.length === 0) {
                    return res
                        .status(STATUS_CODE.badRequest)
                        .json({ error: 'No file images uploaded' })
                }

                next()
            })
        },
    },
}

export default ValidateMulter
