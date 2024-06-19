import multer from 'multer'

// SET STORAGE
const storageImage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'temps')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})

const storageFont = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'fonts')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    },
})

//#region [file filter with font]
const fileFilter = (req, file, cb) => {
    // Kiểm tra loại file (ví dụ: chỉ cho phép các file có đuôi .ttf và .otf)
    if (
        file.mimetype === 'font/ttf' ||
        file.mimetype === 'font/otf' ||
        file.mimetype === 'font/woff' ||
        file.mimetype === 'font/woff2'
    ) {
        cb(null, true)
    } else {
        cb(new Error('Only .ttf, .woff, .woff2 and .otf files are allowed'), false)
    }
}
//#endregion

//#region [file filter with image]
//#endregion

const uploadImage = multer({ storage: storageImage })
const uploadFont = multer({
    storage: storageFont,
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: fileFilter,
})

export default {
    withImage: uploadImage,
    withFont: uploadFont,
}
