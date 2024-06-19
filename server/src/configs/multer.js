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
const fileFilterFont = (req, file, cb) => {
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
const fileFilterImage = (req, file, cb) => {
    // Kiểm tra loại file (ví dụ: chỉ cho phép các file có đuôi .jpeg và .png)
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/gif' ||
        file.mimetype === 'image/webp' ||
        file.minetype === 'image/jpg'
    ) {
        cb(null, true)
    } else {
        cb(new Error('Only .jpeg, .png, .gif, .webp, .jpg and .png files are allowed'), false)
    }
}
//#endregion

const uploadImage = multer({
    storage: storageImage,
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: fileFilterImage,
})
const uploadFont = multer({
    storage: storageFont,
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: fileFilterFont,
})

export default {
    withImage: uploadImage,
    withFont: uploadFont,
}
