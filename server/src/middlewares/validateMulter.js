import multer from 'multer'
import uploadMiddleware from '../configs/multer.js'

const ValidateMulter = {
    font: {
        single: (req, res, next) => {
            uploadMiddleware.withFont.single('fonts')(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ error: 'Multer error', message: err.message })
                } else if (err) {
                    return res.status(400).json({ error: 'Upload error', message: err.message })
                }

                if (!req.file) {
                    return res.status(400).json({ error: 'No file uploaded' })
                }

                next()
            })
        },
        multi: (req, res, next) => {
            uploadMiddleware.withFont.array('fonts')(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ error: 'Multer error', message: err.message })
                } else if (err) {
                    return res.status(400).json({ error: 'Upload error', message: err.message })
                }

                if (!req.files.length) {
                    return res.status(400).json({ error: 'No file uploaded' })
                }

                next()
            })
        },
    },

    image: (req, res, next) => {
        // Add your image validation logic here
    },
}

export default ValidateMulter
